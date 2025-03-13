// src/components/ThreeSixtyImageViewer.jsx
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import PropTypes from 'prop-types';

const extractRoomName = (path) => {
  const parts = path.split('/');
  const fileName = parts[parts.length - 1];
  const roomName = fileName.split('.')[0]; // Assuming the file name is the room name
  return roomName.charAt(0).toUpperCase() + roomName.slice(1);
};

const PanoramaViewer = ({ image360Path }) => {
  const mountRef = useRef(null);
  const rendererRef = useRef(null);
  const sphereRef = useRef(null);
  const isDragging = useRef(false);
  const previousMousePosition = useRef({ x: 0, y: 0 });

  console.log("360 Image Paths:", image360Path);

  const images = image360Path.map((path) => ({
    path,
    name: extractRoomName(path),
  }));

  const [currentIndex, setCurrentIndex] = useState(0);
  const currentImage = images[currentIndex];

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Tạo hình cầu để hiển thị hình ảnh 360 độ
    const geometry = new THREE.SphereGeometry(500, 60, 40);
    const texture = new THREE.TextureLoader().load(currentImage.path);
    const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
    const sphere = new THREE.Mesh(geometry, material);
    sphereRef.current = sphere; // Lưu sphere vào ref
    scene.add(sphere);

    camera.position.set(0, 0, 0.1); // Đặt camera bên trong hình cầu

    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };

    animate();

    // Dọn dẹp khi component unmount
    return () => {
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, [currentImage.path]);

  // Xử lý sự kiện chuột để xoay hình cầu
  const handleMouseDown = (event) => {
    isDragging.current = true;
    previousMousePosition.current = { x: event.clientX, y: event.clientY };
  };

  const handleMouseMove = (event) => {
    if (isDragging.current) {
      const deltaX = event.clientX - previousMousePosition.current.x;
      const deltaY = event.clientY - previousMousePosition.current.y;

      if (sphereRef.current) {
        sphereRef.current.rotation.y += deltaX * 0.005; // Xoay trái và phải
        sphereRef.current.rotation.x += deltaY * 0.005; // Xoay lên và xuống
      }

      previousMousePosition.current = { x: event.clientX, y: event.clientY };
    }
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  // Xử lý sự kiện cuộn chuột để phóng to/thu nhỏ
  const handleWheel = (event) => {
    event.preventDefault();
    if (sphereRef.current) {
      const scaleChange = event.deltaY > 0 ? 0.95 : 1.05; // Điều chỉnh tỷ lệ phóng to/thu nhỏ
      sphereRef.current.scale.set(
        sphereRef.current.scale.x * scaleChange,
        sphereRef.current.scale.y * scaleChange,
        sphereRef.current.scale.z * scaleChange
      );
    }
  };

  useEffect(() => {
    const mountElement = mountRef.current;
    mountElement.addEventListener('mousedown', handleMouseDown);
    mountElement.addEventListener('mousemove', handleMouseMove);
    mountElement.addEventListener('mouseup', handleMouseUp);
    mountElement.addEventListener('mouseleave', handleMouseUp); // Để xử lý khi chuột ra ngoài
    mountElement.addEventListener('wheel', handleWheel);

    return () => {
      mountElement.removeEventListener('mousedown', handleMouseDown);
      mountElement.removeEventListener('mousemove', handleMouseMove);
      mountElement.removeEventListener('mouseup', handleMouseUp);
      mountElement.removeEventListener('mouseleave', handleMouseUp);
      mountElement.removeEventListener('wheel', handleWheel);
    };
  }, []);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  return (
    <div className="relative w-full h-[calc(100vh-100px)] overflow-hidden"> {/* Giả sử footer cao 100px */}
      <div ref={mountRef} className="w-full h-full" />
      <div className="absolute top-0 left-0 p-4 text-white bg-black bg-opacity-50">{currentImage.name}</div>
      <div className="absolute bottom-0 left-0 right-0 flex justify-between p-4">
        <button onClick={handlePrevious} className="text-white bg-black bg-opacity-50 p-2">Previous</button>
        <button onClick={handleNext} className="text-white bg-black bg-opacity-50 p-2">Next</button>
      </div>
    </div>
  );
};

PanoramaViewer.propTypes = {
  image360Path: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default PanoramaViewer;