import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { message, Spin } from 'antd';
import { cancelMomoPayment } from '../services/momoService';
import { addRoomWithModel } from '../services/room';
import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.REACT_APP_API_URL || 'https://apartment-backend-30kj.onrender.com/api';

const PaymentResult = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [isProcessing, setIsProcessing] = useState(false);

    const checkPaymentProcessed = async (paymentId) => {
        try {
            const token = Cookies.get('Authorization');
            const response = await axios.get(`${API_URL}/rooms/check-payment/${paymentId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data.processed;
        } catch (error) {
            console.error('Error checking payment status:', error);
            return false;
        }
    };

    const handleRoomCreation = async (roomData) => {
        const token = Cookies.get('Authorization');
        if (!token) {
            throw new Error('No authorization token found');
        }
    
        const formDataToSend = new FormData();
    
        try {
            // Check payment processed
            const isProcessed = await checkPaymentProcessed(roomData.paymentId);
            if (isProcessed) {
                console.log('Payment already processed:', roomData.paymentId);
                return null;
            }
    
            // Append room data
            formDataToSend.append('data', JSON.stringify(roomData));
    
            // Lấy files từ IndexedDB
            const files = await getFilesFromIndexedDB();
            if (files) {
                const pendingRoomData = JSON.parse(sessionStorage.getItem('pendingRoomData'));
                const { filesMetadata } = pendingRoomData;
    
                // Restore images
                if (filesMetadata.images.length > 0) {
                    filesMetadata.images.forEach((metadata, index) => {
                        const arrayBuffer = files[`image_${index}`];
                        if (arrayBuffer) {
                            const blob = new Blob([arrayBuffer], { type: metadata.type });
                            formDataToSend.append('files', blob, metadata.name);
                        }
                    });
                }
    
                // Restore 3D model
                if (filesMetadata.model3D) {
                    const modelArrayBuffer = files['model3D'];
                    if (modelArrayBuffer) {
                        const blob = new Blob([modelArrayBuffer], { type: filesMetadata.model3D.type });
                        formDataToSend.append('model', blob, filesMetadata.model3D.name);
                    }
                }
    
                // Restore 360 views
                if (filesMetadata.view360.length > 0) {
                    filesMetadata.view360.forEach((metadata, index) => {
                        const arrayBuffer = files[`view360_${index}`];
                        if (arrayBuffer) {
                            const blob = new Blob([arrayBuffer], { type: metadata.type });
                            formDataToSend.append('web360', blob, metadata.name);
                        }
                    });
                }
    
                // Restore video
                if (filesMetadata.video) {
                    const videoArrayBuffer = files['video'];
                    if (videoArrayBuffer) {
                        const blob = new Blob([videoArrayBuffer], { type: filesMetadata.video.type });
                        formDataToSend.append('video', blob, filesMetadata.video.name);
                    }
                }
            }
    
            console.log('Attempting to create room with payment ID:', roomData.paymentId);
            
            const response = await addRoomWithModel(formDataToSend);
            console.log('Room creation response:', response);
    
            // Clean up
            await clearIndexedDB();
            sessionStorage.removeItem('pendingRoomData');
            sessionStorage.removeItem('paymentInfo');
    
            return response;
        } catch (error) {
            console.error('Error creating room:', error.response?.data || error.message);
            throw error;
        }
    };
    
    // Hàm để lấy files từ IndexedDB
    const getFilesFromIndexedDB = () => {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('RoomFiles', 1);
    
            request.onerror = () => {
                reject(new Error('Failed to open IndexedDB'));
            };
    
            request.onsuccess = (event) => {
                const db = event.target.result;
                const transaction = db.transaction(['files'], 'readonly');
                const store = transaction.objectStore('files');
    
                const getRequest = store.get('currentFiles');
    
                transaction.oncomplete = () => {
                    db.close();
                };
    
                getRequest.onsuccess = () => {
                    resolve(getRequest.result);
                };
    
                getRequest.onerror = () => {
                    db.close();
                    reject(new Error('Failed to get files'));
                };
            };
        });
    };
    
    // Hàm để xóa dữ liệu trong IndexedDB
    const clearIndexedDB = () => {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('RoomFiles', 1);
    
            request.onerror = () => {
                reject(new Error('Failed to open IndexedDB'));
            };
    
            request.onsuccess = (event) => {
                const db = event.target.result;
                const transaction = db.transaction(['files'], 'readwrite');
                const store = transaction.objectStore('files');
    
                const clearRequest = store.clear();
    
                transaction.oncomplete = () => {
                    db.close();
                    resolve();
                };
    
                clearRequest.onerror = () => {
                    db.close();
                    reject(new Error('Failed to clear IndexedDB'));
                };
            };
        });
    };

    const saveFormDataToIndexedDB = async (formData) => {
        return new Promise(async (resolve, reject) => {
            try {
                // Chuyển đổi tất cả files thành ArrayBuffer trước
                const filesObject = {};
                for (const [key, value] of formData.entries()) {
                    if (value instanceof File) {
                        filesObject[key] = await new Promise((resolve) => {
                            const reader = new FileReader();
                            reader.onloadend = () => resolve(reader.result);
                            reader.readAsArrayBuffer(value);
                        });
                    } else {
                        filesObject[key] = value;
                    }
                }

                // Sau khi có tất cả ArrayBuffer, mở IndexedDB và lưu trữ
                const request = indexedDB.open('RoomFiles', 1);

                request.onerror = () => {
                    reject(new Error('Failed to open IndexedDB'));
                };

                request.onupgradeneeded = (event) => {
                    const db = event.target.result;
                    if (!db.objectStoreNames.contains('files')) {
                        db.createObjectStore('files');
                    }
                };

                request.onsuccess = (event) => {
                    const db = event.target.result;
                    const transaction = db.transaction(['files'], 'readwrite');
                    const store = transaction.objectStore('files');

                    const storeRequest = store.put(filesObject, 'currentFiles');

                    storeRequest.onsuccess = () => {
                        resolve();
                    };

                    storeRequest.onerror = () => {
                        reject(new Error('Failed to store files'));
                    };

                    // Xử lý lỗi transaction
                    transaction.onerror = () => {
                        reject(new Error('Transaction failed'));
                    };

                    // Đảm bảo transaction hoàn thành
                    transaction.oncomplete = () => {
                        db.close();
                    };
                };
            } catch (error) {
                reject(error);
            }
        });
    };

    const checkFilesSize = (formData) => {
        let totalSize = 0;
        for (const [key, value] of formData.entries()) {
            if (value instanceof File) {
                totalSize += value.size;
            }
        }
        // Giới hạn tổng kích thước là 50MB
        const MAX_SIZE = 50 * 1024 * 1024; // 50MB in bytes
        if (totalSize > MAX_SIZE) {
            throw new Error(`Total file size exceeds ${MAX_SIZE / (1024 * 1024)}MB limit`);
        }
    };

    useEffect(() => {
        let isMounted = true;

        const handlePaymentResult = async () => {
            if (isProcessing) {
                return;
            }

            setIsProcessing(true);

            try {
                const resultCode = searchParams.get('resultCode');
                const orderId = searchParams.get('orderId');
                const paymentMessage = searchParams.get('message');

                if (!resultCode || !orderId) {
                    message.error('Invalid payment response');
                    navigate('/');
                    return;
                }

                // Get payment ID from orderId (format: paymentId_timestamp)
                const paymentId = orderId.split('_')[0];

                // Get saved room data
                const savedData = sessionStorage.getItem('pendingRoomData');
                const paymentInfo = sessionStorage.getItem('paymentInfo');

                if (!savedData || !paymentInfo) {
                    message.error('No room data or payment info found');
                    navigate('/');
                    return;
                }

                const { roomData, selectedFeatures, currentPackage } = JSON.parse(savedData);
                const { price, packageCode } = JSON.parse(paymentInfo);

                try {
                    // Handle payment status first
                    if (resultCode === '0') {
                        message.success('Payment successful!');
                    } else if (resultCode === '1006') {
                        await cancelMomoPayment(paymentId);
                        message.info('Payment cancelled but room will still be created');
                    } else {
                        message.error(`Payment failed: ${paymentMessage}`);
                        navigate('/');
                        return;
                    }

                    // Add payment ID to room data
                    roomData.paymentId = paymentId;

                    if (isMounted) {
                        // Create room
                        const result = await handleRoomCreation(roomData);
                        if (result) {
                            message.success('Room created successfully!');
                        }

                        // Clean up sessionStorage
                        sessionStorage.removeItem('pendingRoomData');
                        sessionStorage.removeItem('paymentInfo');
                        
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