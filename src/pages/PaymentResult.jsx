import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { message, Spin } from 'antd';
import { cancelMomoPayment } from '../services/momoService';
import { addRoomWithModel } from '../services/room';
import Cookies from 'js-cookie';

const PaymentResult = () => {
    console.log('PaymentResult component rendered');
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(null);

    const handleRoomCreation = async (roomData) => {
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
            
            const savedRoomData = parsedData.roomData;
            console.log('Room data from storage:', savedRoomData);

            // Prepare room data without file fields
            const roomDataToSend = {
                ...savedRoomData,
                paymentId: roomData.paymentId
            };
            
            // Remove file references and unnecessary fields
            delete roomDataToSend.files;
            delete roomDataToSend.imagePaths;
            delete roomDataToSend.videoPaths;
            delete roomDataToSend.modelPath;
            delete roomDataToSend.web360Paths;
            delete roomDataToSend.postedTime;

            // Convert to string and parse back to ensure clean object
            const cleanRoomData = JSON.parse(JSON.stringify(roomDataToSend));
            console.log('Clean room data to send:', cleanRoomData);

            // Append room data
            formDataToSend.append('data', JSON.stringify(cleanRoomData));
            
            // Handle files
            const files = savedRoomData.files;
            console.log('Files to process:', files);

            if (files) {
                // Handle images
                if (files.images && files.images.length > 0) {
                    console.log('Processing images:', files.images.length, 'files');
                    files.images.forEach((image, index) => {
                        console.log(`Processing image ${index}:`, image);
                        formDataToSend.append('files', image);
                    });
                }

                // Handle video
                if (files.video) {
                    console.log('Processing video:', files.video);
                    formDataToSend.append('video', files.video);
                }

                // Handle 3D model
                if (files.model3D) {
                    console.log('Processing 3D model:', files.model3D);
                    formDataToSend.append('model', files.model3D);
                }

                // Handle 360 views
                if (files.view360 && files.view360.length > 0) {
                    console.log('Processing 360 views:', files.view360.length, 'files');
                    files.view360.forEach((view, index) => {
                        console.log(`Processing 360 view ${index}:`, view);
                        formDataToSend.append('web360', view);
                    });
                }
            }

            // Log final FormData contents
            console.log('Final FormData contents:');
            for (let pair of formDataToSend.entries()) {
                if (pair[1] instanceof File) {
                    console.log(pair[0], '(File):', {
                        name: pair[1].name,
                        type: pair[1].type,
                        size: pair[1].size
                    });
                } else {
                    console.log(pair[0], '(Data):', pair[1]);
                }
            }
            
            const response = await addRoomWithModel(formDataToSend);
            console.log('Room creation response:', response);
    
            // Clean up storage
            sessionStorage.removeItem('pendingRoomData');
            sessionStorage.removeItem('paymentInfo');
    
            return response;
        } catch (error) {
            console.error('Error creating room:', error);
            console.error('Error details:', error.response?.data || error.message);
            setError(error.message);
            throw error;
        }
    };

    // Helper function to convert data URL to File
    const dataURLtoFile = (dataurl, filename) => {
        if (!dataurl) return null;
        
        const arr = dataurl.split(',');
        if (arr.length < 2) return null;
        
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        
        while(n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        
        return new File([u8arr], filename, {type: mime});
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

                // Get saved room data
                const savedData = sessionStorage.getItem('pendingRoomData');
                const paymentInfo = sessionStorage.getItem('paymentInfo');

                console.log('Saved data from session:', { savedData, paymentInfo });

                if (!savedData || !paymentInfo) {
                    console.error('Missing saved data or payment info');
                    message.error('No room data or payment info found');
                    navigate('/');
                    return;
                }

                const { roomData, selectedFeatures, currentPackage } = JSON.parse(savedData);
                const { price, packageCode } = JSON.parse(paymentInfo);

                console.log('Parsed room data:', roomData);
                console.log('Package info:', { selectedFeatures, currentPackage, price, packageCode });

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

                    // Add payment ID to room data
                    roomData.paymentId = paymentId;
                    console.log('Updated room data with payment ID:', roomData);

                    if (isMounted) {
                        console.log('Attempting room creation...');
                        // Create room
                        const result = await handleRoomCreation(roomData);
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
        </div>
    );
};

export default PaymentResult; 