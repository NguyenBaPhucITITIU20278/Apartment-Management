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
    const [files, setFiles] = useState({
        images: null,
        video: null,
        model3D: null,
        view360: null
    });
    const [filesMetadata, setFilesMetadata] = useState({
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
        const file = files[0];
        
        console.log('File change detected:', {
            inputName: name,
            fileName: file?.name,
            fileType: file?.type,
            fileSize: file?.size
        });

        // Validate file size based on type
        const maxSizes = {
            images: 5 * 1024 * 1024, // 5MB
            video: 100 * 1024 * 1024, // 100MB
            model3D: 50 * 1024 * 1024, // 50MB
            view360: 10 * 1024 * 1024 // 10MB
        };

        if (file && file.size > maxSizes[name]) {
            message.error(`File size must be less than ${maxSizes[name] / (1024 * 1024)}MB`);
            return;
        }

        // Define allowed types for each file category
        const allowedTypes = {
            images: ['image/jpeg', 'image/png', 'image/gif'],
            video: ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo'],
            model3D: ['model/gltf-binary', 'model/gltf+json', 'application/octet-stream'],
            view360: ['image/jpeg', 'image/png']
        };

        // Special handling for 3D models
        const is3DModel = name === 'model3D' && (
            file.name.endsWith('.glb') || 
            file.name.endsWith('.gltf') || 
            allowedTypes.model3D.includes(file.type)
        );

        if (file && !is3DModel && !allowedTypes[name]?.includes(file.type)) {
            message.error(`Invalid file type for ${name}. Please check the allowed formats.`);
            return;
        }

        if (file) {
            setFiles(prev => ({
                ...prev,
                [name]: file
            }));
            
            setFilesMetadata(prev => ({
                ...prev,
                [name]: {
                    name: file.name,
                    type: file.type,
                    size: file.size
                }
            }));

            console.log('Updated files state:', {
                fileName: file.name,
                fileType: file.type,
                inputName: name
            });
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
                imagePaths: formData.images ? Array.from(formData.images).map(file => file.name) : [],
                videoPaths: formData.video ? [formData.video[0].name] : [],
                web360Paths: formData.view360 ? Array.from(formData.view360).map(file => file.name) : [],
                modelPath: formData.model3D && formData.model3D.length > 0 ? formData.model3D[0].name : '',
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
            console.log('Room data with file paths:', roomData);

            // Save data to sessionStorage with proper file paths
            sessionStorage.setItem('pendingRoomData', JSON.stringify({
                roomData,
                selectedFeatures,
                currentPackage,
                filesMetadata: {
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
                }
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
            // Prepare files object in the correct format
            const files = {
                images: [],
                video: null,
                model3D: null,
                view360: []
            };

            // Process images
            if (formData.images) {
                files.images = Array.from(formData.images);
            }

            // Process video
            if (formData.video && formData.video.length > 0) {
                files.video = formData.video[0];
            }

            // Process 3D model
            if (formData.model3D && formData.model3D.length > 0) {
                files.model3D = formData.model3D[0];
            }

            // Process 360 views
            if (formData.view360) {
                files.view360 = Array.from(formData.view360);
            }

            // Generate a unique key for this submission
            const timestamp = new Date().getTime();
            const paymentId = sessionStorage.getItem('paymentId');
            const key = paymentId ? `${paymentId}_${timestamp}` : `temp_${timestamp}`;

            // Save to IndexedDB using the fileStorage service
            await saveFiles(key, files);
            
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
                                    accept="image/*"
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
                                    accept="image/*"
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