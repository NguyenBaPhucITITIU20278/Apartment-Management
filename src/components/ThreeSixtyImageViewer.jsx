// src/components/ThreeSixtyImageViewer.jsx
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const PanoramaViewer = ({ image360Path }) => {
  const mountRef = useRef(null);
  const rendererRef = useRef(null);
  const sphereRef = useRef(null);
  const isDragging = useRef(false);
  const previousMousePosition = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Tạo hình cầu để hiển thị hình ảnh 360 độ
    const geometry = new THREE.SphereGeometry(500, 60, 40);
    const texture = new THREE.TextureLoader().load(image360Path);
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
  }, [image360Path]);

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

  return (
    <div className="relative w-full h-[calc(100vh-100px)] overflow-hidden"> {/* Giả sử footer cao 100px */}
      <div ref={mountRef} className="w-full h-full" />
    </div>
  );
};

export default PanoramaViewer;