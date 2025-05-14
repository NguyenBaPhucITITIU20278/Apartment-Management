import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { message, Spin } from 'antd';
import { cancelMomoPayment } from '../services/momoService';
import { addRoomWithModel } from '../services/room';
import { getFiles, deleteFiles } from '../services/fileStorage';
import Cookies from 'js-cookie';

const PaymentResult = () => {
    console.log('PaymentResult component rendered');
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(null);

    const handleRoomCreation = async (roomData, orderId) => {
        const token = Cookies.get('Authorization') || localStorage.getItem('Authorization');
        console.log('Token available:', !!token);
        
        if (!token) {
            throw new Error('No authorization token found');
        }

        const formDataToSend = new FormData();

        try {
            // Get saved room data
            const savedData = sessionStorage.getItem('pendingRoomData');
            console.log('Raw saved data:', savedData);
            
            if (!savedData) {
                throw new Error('No room data found in session storage');
            }

            const parsedData = JSON.parse(savedData);
            console.log('Parsed saved data:', parsedData);
            
            // Keep the original paths from savedRoomData
            const savedRoomData = parsedData.roomData;
            const selectedFeatures = parsedData.selectedFeatures;
            const filesMetadata = parsedData.filesMetadata || {};
            
            console.log('Room data from storage:', savedRoomData);
            console.log('Selected features:', selectedFeatures);
            console.log('Files metadata:', filesMetadata);

            // Get files from IndexedDB using filesKey from sessionStorage
            const filesKey = sessionStorage.getItem('filesKey');
            console.log('Getting files from IndexedDB using filesKey:', filesKey);
            const files = await getFiles(filesKey);
            console.log('Retrieved files from IndexedDB:', files);

            // Prepare room data while preserving original paths
            const roomDataToSend = {
                ...savedRoomData,
                paymentId: roomData.paymentId,
                // Keep the original paths
                imagePaths: savedRoomData.imagePaths || [],
                videoPaths: savedRoomData.videoPaths || [],
                web360Paths: savedRoomData.web360Paths || [],
                modelPath: savedRoomData.modelPath || []
            };

            // Handle files if they exist
            if (files) {
                // Handle images (multiple files)
                if (files.images && files.images.length > 0) {
                    console.log('Processing images:', files.images.length);
                    Array.from(files.images).forEach((image, index) => {
                        formDataToSend.append('files', image);
                        console.log(`Added image ${index}:`, image.name);
                    });
                }

                // Handle video
                if (files.video && selectedFeatures.video) {
                    console.log('Processing video file:', {
                        name: files.video.name,
                        type: files.video.type,
                        size: files.video.size
                    });
                    formDataToSend.append('video', files.video);
                    console.log('Video file added to FormData');
                }

                // Handle 3D model
                if (files.model3D && selectedFeatures.model3D) {
                    console.log('Processing 3D model file:', {
                        name: files.model3D.name,
                        type: files.model3D.type,
                        size: files.model3D.size
                    });
                    formDataToSend.append('model', files.model3D);
                    console.log('3D model file added to FormData');
                }

                // Handle 360 views (multiple files)
                if (files.view360 && files.view360.length > 0) {
                    console.log('Processing 360 views:', files.view360.length);
                    Array.from(files.view360).forEach((view, index) => {
                        formDataToSend.append('web360', view);
                        console.log(`Added 360 view ${index}:`, view.name);
                    });
                }
            }

            // Add room data
            formDataToSend.append('data', JSON.stringify(roomDataToSend));

            // Log final FormData contents for debugging
            console.log('Final FormData contents:');
            for (let [key, value] of formDataToSend.entries()) {
                if (value instanceof File) {
                    console.log(`${key}: File - ${value.name} (${value.size} bytes, ${value.type})`);
                } else {
                    console.log(`${key}: ${value}`);
                }
            }

            const response = await addRoomWithModel(formDataToSend);
            console.log('Room creation response:', response);

            // Clean up storage
            await deleteFiles(filesKey);
            sessionStorage.removeItem('pendingRoomData');
            sessionStorage.removeItem('paymentInfo');
            sessionStorage.removeItem('filesKey');

            return response;
        } catch (error) {
            console.error('Error creating room:', error);
            console.error('Error details:', error.response?.data || error.message);
            setError(error.message);
            throw error;
        }
    };

    useEffect(() => {
        let isMounted = true;

        const handlePaymentResult = async () => {
            console.log('Starting payment result handling...');
            if (isProcessing) {
                console.log('Already processing, skipping...');
                return;
            }

            setIsProcessing(true);
            console.log('Set processing to true');

            try {
                const resultCode = searchParams.get('resultCode');
                const orderId = searchParams.get('orderId');
                const paymentMessage = searchParams.get('message');

                console.log('Payment response:', { resultCode, orderId, paymentMessage });

                if (!resultCode || !orderId) {
                    console.error('Missing resultCode or orderId');
                    message.error('Invalid payment response');
                    navigate('/');
                    return;
                }

                // Get payment ID from orderId (format: paymentId_timestamp)
                const paymentId = orderId.split('_')[0];
                console.log('Extracted payment ID:', paymentId);

                try {
                    // Handle payment status first
                    if (resultCode === '0') {
                        console.log('Payment successful');
                        message.success('Payment successful!');
                    } else if (resultCode === '1006') {
                        console.log('Payment cancelled, proceeding with room creation');
                        await cancelMomoPayment(paymentId);
                        message.info('Payment cancelled but room will still be created');
                    } else {
                        console.error('Payment failed:', paymentMessage);
                        message.error(`Payment failed: ${paymentMessage}`);
                        navigate('/');
                        return;
                    }

                    if (isMounted) {
                        console.log('Attempting room creation...');
                        // Create room
                        const result = await handleRoomCreation({ paymentId }, orderId);
                        console.log('Room creation result:', result);
                        
                        if (result) {
                            message.success('Room created successfully!');
                        }
                        
                        // Navigate home
                        navigate('/');
                    }
                } catch (error) {
                    if (isMounted) {
                        console.error('Error in payment process:', error);
                        message.error(`Failed to process: ${error.message}`);
                        navigate('/');
                    }
                }
            } catch (error) {
                if (isMounted) {
                    console.error('Error processing payment result:', error);
                    message.error('Failed to process payment result');
                    navigate('/');
                }
            } finally {
                if (isMounted) {
                    console.log('Finishing payment process...');
                    setIsProcessing(false);
                }
            }
        };

        handlePaymentResult();

        return () => {
            isMounted = false;
        };
    }, [navigate, searchParams]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <Spin size="large" />
            <p className="mt-4">Processing payment result...</p>
            {error && <p className="mt-2 text-red-500">{error}</p>}
        </div>
    );
};

export default PaymentResult; 