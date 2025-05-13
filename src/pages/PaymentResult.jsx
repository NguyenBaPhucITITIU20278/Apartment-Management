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
            console.log('Saved room data:', savedData);
            
            if (!savedData) {
                throw new Error('No room data found in session storage');
            }

            const { roomData: savedRoomData } = JSON.parse(savedData);
            
            // Prepare room data
            const roomDataToSend = {
                ...savedRoomData,
                paymentId: roomData.paymentId,
                postedTime: new Date().toISOString()
            };
            
            // Remove file references from room data
            delete roomDataToSend.files;
            delete roomDataToSend.imagePaths;
            delete roomDataToSend.videoPaths;
            delete roomDataToSend.modelPath;
            delete roomDataToSend.web360Paths;

            // Append room data
            formDataToSend.append('data', JSON.stringify(roomDataToSend));
            
            // Add files if they exist in savedRoomData
            if (savedRoomData.files) {
                // Add images
                if (savedRoomData.files.images && savedRoomData.files.images.length > 0) {
                    savedRoomData.files.images.forEach(image => {
                        formDataToSend.append('files', image);
                    });
                }
                
                // Add video
                if (savedRoomData.files.video) {
                    formDataToSend.append('video', savedRoomData.files.video);
                }
                
                // Add 3D model
                if (savedRoomData.files.model3D) {
                    formDataToSend.append('model', savedRoomData.files.model3D);
                }
                
                // Add 360 views
                if (savedRoomData.files.view360 && savedRoomData.files.view360.length > 0) {
                    savedRoomData.files.view360.forEach(view => {
                        formDataToSend.append('web360', view);
                    });
                }
            }
    
            console.log('Room data being sent:', roomDataToSend);
            console.log('Files being sent:', savedRoomData.files);
            
            const response = await addRoomWithModel(formDataToSend);
            console.log('Room creation response:', response);
    
            // Clean up storage
            sessionStorage.removeItem('pendingRoomData');
            sessionStorage.removeItem('paymentInfo');
    
            return response;
        } catch (error) {
            console.error('Error creating room:', error.response?.data || error.message);
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