import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { message, Alert, Space, Typography, Modal, Spin } from "antd";
import Cookies from 'js-cookie';
import { POSTING_PACKAGES, getPackageForFeatures } from '../config/postingPackages';
import { createMomoPayment, cancelMomoPayment } from '../services/momoService';
import { saveFiles } from '../services/fileStorage';
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
        
        // Validate file size based on type
        const maxSizes = {
            images: 5 * 1024 * 1024, // 5MB
            video: 100 * 1024 * 1024, // 100MB
            model3D: 50 * 1024 * 1024, // 50MB
            view360: 10 * 1024 * 1024 // 10MB
        };

        // Validate file types
        const allowedTypes = {
            images: ['image/jpeg', 'image/png', 'image/gif'],
            video: ['video/mp4', 'video/webm', 'video/quicktime'],
            model3D: ['model/gltf-binary', '.glb', '.gltf', 'application/octet-stream'],
            view360: ['image/jpeg', 'image/png']
        };

        // Check each file
        let isValid = true;
        Array.from(files).forEach(file => {
            // Check file size
            if (file.size > maxSizes[name]) {
                message.error(`File ${file.name} size must be less than ${maxSizes[name] / (1024 * 1024)}MB`);
                isValid = false;
                return;
            }

            // Special handling for 3D models
            if (name === 'model3D') {
                const isValidModel = file.name.endsWith('.glb') || 
                                   file.name.endsWith('.gltf') || 
                                   allowedTypes.model3D.includes(file.type);
                if (!isValidModel) {
                    message.error(`Invalid 3D model format. Please use .glb or .gltf files.`);
                    isValid = false;
                    return;
                }
            } else if (!allowedTypes[name].includes(file.type)) {
                message.error(`Invalid file type for ${name}. Allowed types: ${allowedTypes[name].join(', ')}`);
                isValid = false;
                return;
            }
        });

        if (!isValid) {
            return;
        }

        // Update form data
        setFormData(prev => ({
            ...prev,
            [name]: files
        }));

        // Update selected features
        handleFeatureChange(name, files.length > 0);

        // Log file details
        console.log(`${name} files updated:`, {
            count: files.length,
            files: Array.from(files).map(f => ({
                name: f.name,
                type: f.type,
                size: f.size
            }))
        });
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

            // Prepare files for storage
            const filesToStore = {
                images: formData.images ? Array.from(formData.images) : [],
                video: formData.video && formData.video.length > 0 ? formData.video[0] : null,
                model3D: formData.model3D && formData.model3D.length > 0 ? formData.model3D[0] : null,
                view360: formData.view360 ? Array.from(formData.view360) : []
            };

            // Prepare files metadata
            const filesMetadata = {
                images: filesToStore.images.map(file => ({
                    name: file.name,
                    type: file.type
                })),
                video: filesToStore.video ? {
                    name: filesToStore.video.name,
                    type: filesToStore.video.type
                } : null,
                model3D: filesToStore.model3D ? {
                    name: filesToStore.model3D.name,
                    type: filesToStore.model3D.type
                } : null,
                view360: filesToStore.view360.map(file => ({
                    name: file.name,
                    type: file.type
                }))
            };

            // Save files to IndexedDB
            const filesKey = await saveFormDataToIndexedDB(filesToStore);
            console.log('Files saved with key:', filesKey);

            // Save data to sessionStorage
            sessionStorage.setItem('pendingRoomData', JSON.stringify({
                roomData,
                selectedFeatures,
                currentPackage,
                filesMetadata
            }));

            // Store the payment info
            const timestamp = new Date().getTime();
            sessionStorage.setItem('paymentInfo', JSON.stringify({
                price: currentPackage.price,
                packageCode: currentPackage.code,
                timestamp
            }));

            // Create MoMo payment
            const response = await createMomoPayment(
                currentPackage.price,
                currentPackage.name,
                1
            );

            if (response.payUrl) {
                window.location.href = response.payUrl;
            } else {
                throw new Error('No payment URL received');
            }
        } catch (error) {
            console.error('Error in handleSubmit:', error);
            message.error('Failed to process your request. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const saveFormDataToIndexedDB = async (formData) => {
        try {
            const files = {
                images: formData.images ? Array.from(formData.images) : [],
                video: formData.video && formData.video.length > 0 ? formData.video[0] : null,
                model3D: formData.model3D && formData.model3D.length > 0 ? formData.model3D[0] : null,
                view360: formData.view360 ? Array.from(formData.view360) : []
            };

            // Log files being saved
            console.log('Saving files to IndexedDB:', {
                images: files.images.length,
                video: files.video ? 1 : 0,
                model3D: files.model3D ? 1 : 0,
                view360: files.view360.length
            });

            // Convert single files to array format for consistent storage
            const filesForStorage = {
                images: files.images,
                video: files.video ? [files.video] : [],
                model3D: files.model3D ? [files.model3D] : [],
                view360: files.view360
            };

            if (files.video) {
                console.log('Video file details:', {
                    name: files.video.name,
                    type: files.video.type,
                    size: files.video.size
                });
            }

            if (files.model3D) {
                console.log('3D Model file details:', {
                    name: files.model3D.name,
                    type: files.model3D.type,
                    size: files.model3D.size
                });
            }

            // Generate a unique key using timestamp
            const timestamp = new Date().getTime();
            const key = `room_${timestamp}`;

            // Save to IndexedDB
            await saveFiles(key, filesForStorage);
            console.log('Files saved to IndexedDB with key:', key);
            
            // Store the key for later retrieval
            sessionStorage.setItem('filesKey', key);

            return key;
        } catch (error) {
            console.error('Error saving files to IndexedDB:', error);
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