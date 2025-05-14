import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { message, Spin } from 'antd';
import { cancelMomoPayment } from '../services/momoService';
import { addRoomWithModel } from '../services/room';
import { getFiles, deleteFiles } from '../services/fileStorage';
import Cookies from 'js-cookie';
import axios from 'axios';

const PaymentResult = () => {
    console.log('PaymentResult component rendered');
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(null);
    const [files, setFiles] = useState(null);

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
            
            const savedRoomData = parsedData.roomData;
            const selectedFeatures = parsedData.selectedFeatures;
            const filesMetadata = parsedData.filesMetadata || {};
            
            console.log('Room data from storage:', savedRoomData);
            console.log('Selected features:', selectedFeatures);
            console.log('Files metadata:', filesMetadata);
    
            // Get files from IndexedDB
            const key = sessionStorage.getItem('filesKey');
            console.log('Retrieving files with key:', key);
            const files = await getFiles(key);
            console.log('Retrieved files from IndexedDB:', files);

            // Convert array format back to single files where appropriate
            const processedFiles = {
                images: files.images || [],
                video: files.video || [],
                model3D: files.model3D || [],
                view360: files.view360 || []
            };

            console.log('Processed files:', {
                images: processedFiles.images.length,
                video: processedFiles.video.length,
                model3D: processedFiles.model3D.length,
                view360: processedFiles.view360.length
            });

            setFiles(processedFiles);

            // Handle files if they exist
            if (processedFiles.images && processedFiles.images.length > 0) {
                console.log('Processing images:', processedFiles.images.length);
                processedFiles.images.forEach((image, index) => {
                    formDataToSend.append('files', image);
                });
            }

            // Handle video - append as array
            if (processedFiles.video && processedFiles.video.length > 0) {
                console.log('Processing video files:', processedFiles.video.length);
                processedFiles.video.forEach((videoFile, index) => {
                    formDataToSend.append(`video`, videoFile);
                });
            }

            // Handle 3D model - append as array
            if (processedFiles.model3D && processedFiles.model3D.length > 0) {
                console.log('Processing 3D model files:', processedFiles.model3D.length);
                processedFiles.model3D.forEach((modelFile, index) => {
                    formDataToSend.append(`model`, modelFile);
                });
            }

            // Handle 360 views
            if (processedFiles.view360 && processedFiles.view360.length > 0) {
                console.log('Processing 360 views:', processedFiles.view360.length);
                processedFiles.view360.forEach((view, index) => {
                    formDataToSend.append('web360', view);
                });
            }

            // Add room data to FormData
            const roomDataToSend = {
                ...savedRoomData,
                paymentId: roomData.paymentId,
                imagePaths: processedFiles.images ? processedFiles.images.map(f => f.name) : [],
                videoPaths: processedFiles.video ? processedFiles.video.map(f => f.name) : [],
                modelPath: processedFiles.model3D && processedFiles.model3D.length > 0 ? processedFiles.model3D[0].name : '',
                web360Paths: processedFiles.view360 ? processedFiles.view360.map(f => f.name) : []
            };

            // Log request details before sending
            console.log('Sending request with data:', {
                roomData: roomDataToSend,
                files: {
                    images: processedFiles.images.length,
                    video: processedFiles.video.length,
                    model3D: processedFiles.model3D.length,
                    web360: processedFiles.view360.length
                }
            });

            // Add the stringified room data
            formDataToSend.append('data', JSON.stringify(roomDataToSend));

            // Log FormData contents for debugging
            for (let pair of formDataToSend.entries()) {
                if (pair[1] instanceof File) {
                    console.log(`${pair[0]} (File):`, {
                        name: pair[1].name,
                        type: pair[1].type,
                        size: pair[1].size
                    });
                } else {
                    console.log(`${pair[0]} (Data):`, pair[1]);
                }
            }

            // Make the API call
            const headers = {
                'Authorization': Cookies.get('Authorization') || localStorage.getItem('Authorization')
            };

            try {
                const response = await axios.post(
                    'https://apartment-backend-30kj.onrender.com/api/rooms/add-room-with-model',
                    formDataToSend,
                    {
                        headers: headers
                    }
                );
                console.log('Room creation response:', response);

                // Clean up storage
                await deleteFiles(key);
                sessionStorage.removeItem('pendingRoomData');
                sessionStorage.removeItem('paymentInfo');
                sessionStorage.removeItem('filesKey');

                message.success('Room created successfully!');
                navigate('/');
            } catch (error) {
                console.error('Error in API call:', {
                    message: error.message,
                    response: error.response?.data,
                    status: error.response?.status
                });
                throw error;
            }
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

    useEffect(() => {
        const fetchFiles = async () => {
            try {
                const key = sessionStorage.getItem('filesKey');
                if (!key) {
                    console.error('No files key found in sessionStorage');
                    return;
                }

                console.log('Retrieving files with key:', key);
                const files = await getFiles(key);
                console.log('Retrieved files from IndexedDB:', files);

                // Convert array format back to single files where appropriate
                const processedFiles = {
                    images: files.images || [],
                    video: files.video || [],
                    model3D: files.model3D || [],
                    view360: files.view360 || []
                };

                console.log('Processed files:', {
                    images: processedFiles.images.length,
                    video: processedFiles.video.length,
                    model3D: processedFiles.model3D.length,
                    view360: processedFiles.view360.length
                });

                setFiles(processedFiles);
            } catch (error) {
                console.error('Error retrieving files:', error);
            }
        };

        fetchFiles();
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <Spin size="large" />
            <p className="mt-4">Processing payment result...</p>
            {error && <p className="mt-2 text-red-500">{error}</p>}
        </div>
    );
};

export default PaymentResult; 