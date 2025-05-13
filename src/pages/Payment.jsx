import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, Button, message, Row, Col, Typography, Space, Divider, Radio } from 'antd';
import { POSTING_PACKAGES, getPackageForFeatures } from '../config/postingPackages';
import { createMomoPayment, createRoomWithPayment } from '../services/payment';

const { Title, Text } = Typography;

const Payment = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [selectedDuration, setSelectedDuration] = useState(1);
    const roomData = location.state?.roomData;
    const [currentPackage, setCurrentPackage] = useState(null);

    useEffect(() => {
        if (roomData) {
            const features = [];
            if (roomData.imagePaths) features.push('images');
            if (roomData.videoPaths) features.push('video');
            if (roomData.modelPath) features.push('3D');
            if (roomData.web360Paths) features.push('360');

            const package_ = getPackageForFeatures(features);
            setCurrentPackage(package_);
        }
    }, [roomData]);

    if (!roomData || !currentPackage) {
        return (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
                <Title level={3}>No room data found</Title>
                <Button onClick={() => navigate('/add-room')}>Back to Add Room</Button>
            </div>
        );
    }

    const handleDurationChange = (e) => {
        setSelectedDuration(e.target.value);
    };

    const calculateTotalPrice = () => {
        return currentPackage.price * selectedDuration;
    };

    const handlePayment = async () => {
        try {
            setLoading(true);
            console.log('Starting payment process...');
            
            // Create payment request
            const paymentResponse = await createMomoPayment(
                calculateTotalPrice().toString(),
                `Room Posting - ${currentPackage.name} Package (${selectedDuration} month${selectedDuration > 1 ? 's' : ''})`
            );

            console.log('Payment response:', paymentResponse);

            if (paymentResponse.payUrl) {
                console.log('Original room data:', roomData);
                console.log('Files to save:', {
                    images: roomData.imagePaths,
                    video: roomData.videoPaths,
                    model3D: roomData.modelPath,
                    view360: roomData.web360Paths
                });

                // Save room data and payment info to sessionStorage
                const pendingData = {
                    roomData: {
                        ...roomData,
                        files: {
                            images: roomData.files || [], // Use the original files array
                            video: roomData.videoFile || null, // Use the original video file
                            model3D: roomData.modelFile || null, // Use the original model file
                            view360: roomData.web360Files || [] // Use the original 360 files array
                        }
                    },
                    paymentInfo: {
                        package: currentPackage.name,
                        duration: selectedDuration,
                        amount: calculateTotalPrice(),
                        orderId: paymentResponse.orderId
                    }
                };

                console.log('Data being saved to sessionStorage:', pendingData);
                sessionStorage.setItem('pendingRoomData', JSON.stringify(pendingData));
                
                console.log('Redirecting to:', paymentResponse.payUrl);
                // Redirect to MoMo payment page
                window.location.href = paymentResponse.payUrl;
            } else {
                message.error('Failed to create payment');
            }
        } catch (error) {
            console.error('Payment error:', error);
            message.error('Payment creation failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
            <Card>
                <Title level={2}>Payment Details</Title>
                <Divider />
                
                <Row gutter={[16, 16]}>
                    <Col span={24}>
                        <Space direction="vertical" size="large" style={{ width: '100%' }}>
                            <div>
                                <Text strong>Selected Package:</Text>
                                <Text> {currentPackage.icon} {currentPackage.name}</Text>
                            </div>

                            <div>
                                <Text strong>Package Features:</Text>
                                <ul style={{ marginLeft: '20px' }}>
                                    {currentPackage.features.map(feature => (
                                        <li key={feature}>✓ {feature}</li>
                                    ))}
                                </ul>
                            </div>

                            <div>
                                <Text strong>Base Price:</Text>
                                <Text> {new Intl.NumberFormat('vi-VN', { 
                                    style: 'currency', 
                                    currency: 'VND' 
                                }).format(currentPackage.price)}/month</Text>
                            </div>

                            <div>
                                <Text strong>Duration:</Text>
                                <div style={{ marginTop: '10px' }}>
                                    <Radio.Group onChange={handleDurationChange} value={selectedDuration}>
                                        <Radio value={1}>1 Month</Radio>
                                        <Radio value={3}>3 Months</Radio>
                                        <Radio value={6}>6 Months</Radio>
                                        <Radio value={12}>12 Months</Radio>
                                    </Radio.Group>
                                </div>
                            </div>

                            <div>
                                <Text strong>Total Price:</Text>
                                <Text style={{ fontSize: '18px', color: '#1890ff' }}> {new Intl.NumberFormat('vi-VN', { 
                                    style: 'currency', 
                                    currency: 'VND' 
                                }).format(calculateTotalPrice())}</Text>
                            </div>
                        </Space>
                    </Col>
                </Row>

                <Divider />

                <Row justify="end">
                    <Col>
                        <Space>
                            <Button onClick={() => navigate('/add-room')}>
                                Back
                            </Button>
                            <Button 
                                type="primary" 
                                onClick={handlePayment}
                                loading={loading}
                            >
                                Pay with MoMo
                            </Button>
                        </Space>
                    </Col>
                </Row>
            </Card>
        </div>
    );
};

export default Payment; 