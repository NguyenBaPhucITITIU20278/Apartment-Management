import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { message, Alert, Space, Typography, Modal, Spin } from "antd";
import Cookies from 'js-cookie';
import { POSTING_PACKAGES, getPackageForFeatures } from '../config/postingPackages';
import { createMomoPayment, cancelMomoPayment } from '../services/momoService';
import axios from 'axios';

const { Text } = Typography;

const AddRoom = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    const [selectedFeatures, setSelectedFeatures] = useState({
        images: false,
        video: false,
        model3D: false,
        view360: false
    });
    const [currentPackage, setCurrentPackage] = useState(POSTING_PACKAGES.STANDARD);
    const [formData, setFormData] = useState({
        roomName: '',
        rentalPrice: '',
        status: '',
        numberOfBedrooms: '0',
        area: '',
        phoneNumber: '',
        address: '',
        description: '',
        images: null,
        video: null,
        model3D: null,
        view360: null
    });

    useEffect(() => {
        const token = Cookies.get('Authorization');
        if (!token) {
            message.error("Please log in to add a room.");
            navigate("/login");
            return;
        }
    }, [navigate]);

    // Update package when features change
    useEffect(() => {
        const features = [];
        if (selectedFeatures.images) features.push('images');
        if (selectedFeatures.video) features.push('video');
        if (selectedFeatures.model3D) features.push('3D');
        if (selectedFeatures.view360) features.push('360');

        const newPackage = getPackageForFeatures(features);
        setCurrentPackage(newPackage);
    }, [selectedFeatures]);

    const handleFeatureChange = (feature, value) => {
        setSelectedFeatures(prev => ({
            ...prev,
            [feature]: value
        }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: files
        }));

        // Update selected features based on file uploads
        switch (name) {
            case 'images':
                handleFeatureChange('images', files.length > 0);
                break;
            case 'video':
                handleFeatureChange('video', files.length > 0);
                break;
            case 'model3D':
                handleFeatureChange('model3D', files.length > 0);
                break;
            case 'view360':
                handleFeatureChange('view360', files.length > 0);
                break;
            default:
                break;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);

            // Validate required fields
            if (!formData.roomName || !formData.rentalPrice || !formData.status ||
                !formData.numberOfBedrooms || !formData.area || !formData.phoneNumber ||
                !formData.address || !formData.description) {
                message.error('Please fill in all required fields');
                return;
            }

            // Prepare room data
            const roomData = {
                name: formData.roomName,
                price: parseFloat(formData.rentalPrice),
                status: formData.status,
                numberOfBedrooms: parseInt(formData.numberOfBedrooms),
                area: parseFloat(formData.area),
                phoneNumber: formData.phoneNumber,
                address: formData.address,
                description: formData.description,
                imagePaths: [],
                videoPaths: [],
                web360Paths: [],
                modelPath: '',
                username: Cookies.get('userName')
            };

            // Tạo FormData để lưu trữ files
            const formDataToStore = new FormData();

            // Append files với key riêng để dễ nhận dạng
            if (formData.images) {
                Array.from(formData.images).forEach((file, index) => {
                    formDataToStore.append(`image_${index}`, file);
                });
                formDataToStore.append('imageCount', formData.images.length);
            }

            if (formData.model3D && formData.model3D.length > 0) {
                formDataToStore.append('model3D', formData.model3D[0]);
            }

            if (formData.view360) {
                Array.from(formData.view360).forEach((file, index) => {
                    formDataToStore.append(`view360_${index}`, file);
                });
                formDataToStore.append('view360Count', formData.view360.length);
            }

            if (formData.video && formData.video.length > 0) {
                formDataToStore.append('video', formData.video[0]);
            }

            // Lưu metadata của files
            const filesMetadata = {
                images: formData.images ? Array.from(formData.images).map(file => ({
                    name: file.name,
                    type: file.type
                })) : [],
                model3D: formData.model3D && formData.model3D.length > 0 ? {
                    name: formData.model3D[0].name,
                    type: formData.model3D[0].type
                } : null,
                view360: formData.view360 ? Array.from(formData.view360).map(file => ({
                    name: file.name,
                    type: file.type
                })) : [],
                video: formData.video && formData.video.length > 0 ? {
                    name: formData.video[0].name,
                    type: formData.video[0].type
                } : null
            };

            // Lưu vào sessionStorage
            sessionStorage.setItem('pendingRoomData', JSON.stringify({
                roomData,
                selectedFeatures,
                currentPackage,
                filesMetadata
            }));

            // Store the payment info
            sessionStorage.setItem('paymentInfo', JSON.stringify({
                price: currentPackage.price,
                packageCode: currentPackage.code,
                timestamp: new Date().getTime()
            }));

            // Lưu FormData vào IndexedDB
            await saveFormDataToIndexedDB(formDataToStore);

            // Create MoMo payment
            const response = await createMomoPayment(
                currentPackage.price,
                currentPackage.code,
                1
            );

            if (response.payUrl) {
                window.location.href = response.payUrl;
            } else {
                throw new Error('No payment URL received');
            }

        } catch (error) {
            message.error('Failed to create payment: ' + error.message);
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    // Thay thế hàm saveFormDataToIndexedDB hiện tại bằng hàm mới này
    const saveFormDataToIndexedDB = async (formData) => {
        // Đầu tiên, chuyển đổi tất cả files thành ArrayBuffer
        const convertFilesToArrayBuffer = async () => {
            const filesObject = {};
            for (const [key, value] of formData.entries()) {
                if (value instanceof File) {
                    const buffer = await new Promise((resolve, reject) => {
                        const reader = new FileReader();
                        reader.onload = () => resolve(reader.result);
                        reader.onerror = () => reject(reader.error);
                        reader.readAsArrayBuffer(value);
                    });
                    filesObject[key] = buffer;
                } else {
                    filesObject[key] = value;
                }
            }
            return filesObject;
        };

        try {
            const filesObject = await convertFilesToArrayBuffer();
            
            return new Promise((resolve, reject) => {
                const request = indexedDB.open('RoomFiles', 1);

                request.onerror = () => reject(new Error('Failed to open IndexedDB'));

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

                    transaction.oncomplete = () => {
                        db.close();
                        resolve();
                    };

                    transaction.onerror = () => {
                        db.close();
                        reject(new Error('Transaction failed'));
                    };

                    store.put(filesObject, 'currentFiles');
                };
            });
        } catch (error) {
            console.error('Error in saveFormDataToIndexedDB:', error);
            throw error;
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-6">Post Rental Listing</h2>

                <Alert
                    message="Posting Package Information"
                    description={
                        <Space direction="vertical">
                            <Text>Current Package: {currentPackage.icon} {currentPackage.name}</Text>
                            <Text>Price: {new Intl.NumberFormat('vi-VN', {
                                style: 'currency',
                                currency: 'VND'
                            }).format(currentPackage.price)}/month</Text>
                            <Text>Features included: {currentPackage.features.join(', ')}</Text>
                        </Space>
                    }
                    type="info"
                    showIcon
                    className="mb-6"
                />

                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-4">Basic Information</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block mb-2">
                                    Room Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="roomName"
                                    required
                                    className="w-full p-2 border rounded"
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div>
                                <label className="block mb-2">
                                    Rental Price <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    name="rentalPrice"
                                    required
                                    className="w-full p-2 border rounded"
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div>
                                <label className="block mb-2">
                                    Status <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="status"
                                    required
                                    className="w-full p-2 border rounded"
                                    onChange={handleInputChange}
                                >
                                    <option value="">Select Status</option>
                                    <option value="available">Available</option>
                                    <option value="rented">Rented</option>
                                </select>
                            </div>

                            <div>
                                <label className="block mb-2">
                                    Number of Bedrooms <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    name="numberOfBedrooms"
                                    required
                                    className="w-full p-2 border rounded"
                                    onChange={handleInputChange}
                                    value={formData.numberOfBedrooms}
                                />
                            </div>

                            <div>
                                <label className="block mb-2">
                                    Area (m²) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    name="area"
                                    required
                                    className="w-full p-2 border rounded"
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div>
                                <label className="block mb-2">
                                    Phone Number <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="tel"
                                    name="phoneNumber"
                                    required
                                    className="w-full p-2 border rounded"
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        <div className="mt-4">
                            <label className="block mb-2">
                                Address <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="address"
                                required
                                className="w-full p-2 border rounded"
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="mt-4">
                            <label className="block mb-2">
                                Description <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                name="description"
                                required
                                className="w-full p-2 border rounded h-32"
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-4">Images and Media</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block mb-2">
                                    Images <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="file"
                                    name="images"
                                    multiple
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="w-full"
                                />
                            </div>

                            <div>
                                <label className="block mb-2">3D Model</label>
                                <input
                                    type="file"
                                    name="model3D"
                                    accept=".glb,.gltf"
                                    onChange={handleFileChange}
                                    className="w-full"
                                />
                            </div>

                            <div>
                                <label className="block mb-2">360° Images</label>
                                <input
                                    type="file"
                                    name="view360"
                                    multiple
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="w-full"
                                />
                            </div>

                            <div>
                                <label className="block mb-2">Video</label>
                                <input
                                    type="file"
                                    name="video"
                                    accept="video/*"
                                    onChange={handleFileChange}
                                    className="w-full"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="text-right">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
                        >
                            {loading ? 'Processing...' : 'Continue to Payment'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddRoom;