import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import PropTypes from "prop-types";

const ThreeDViewer = ({ modelPath, onDelete }) => {
  const mountRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Setup scene
    const scene = new THREE.Scene();
    
    // Setup camera with initial values
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );

    // Setup renderer with container dimensions
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setClearColor(0xffffff, 1);
    mountRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // Add lights
    const ambientLight = new THREE.AmbientLight(0x404040, 2);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(0, 1, 0).normalize();
    scene.add(directionalLight);

    // Load model
    const gltfLoader = new GLTFLoader();
    gltfLoader.load(
      modelPath,
      (gltf) => {
        scene.add(gltf.scene);
        console.log("Model loaded successfully");

        // Calculate bounding box
        const box = new THREE.Box3().setFromObject(gltf.scene);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());

        // Calculate the distance needed to fit the model in view
        const maxDim = Math.max(size.x, size.y, size.z);
        const fov = camera.fov * (Math.PI / 180);
        const cameraDistance = Math.abs(maxDim / Math.sin(fov / 2) / 2);

        // Position camera to fit model
        camera.position.set(
          center.x + cameraDistance,
          center.y + cameraDistance,
          center.z + cameraDistance
        );
        
        // Set controls target to model center
        controls.target.copy(center);
        camera.lookAt(center);
        controls.update();

        // Update camera and controls on window resize
        const handleResize = () => {
          if (!containerRef.current) return;
          
          camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
      },
      undefined,
      (error) => {
        console.error("Error loading model:", error);
      }
    );

    const animate = function () {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, [modelPath]);

  return (
    <div className="relative w-full h-[600px]" ref={containerRef}>
      <div ref={mountRef} className="w-full h-full"></div>
      {onDelete && (
        <button 
          onClick={onDelete}
          className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded"
        >
          Delete 3D Model
        </button>
      )}
    </div>
  );
};

ThreeDViewer.propTypes = {
  modelPath: PropTypes.string.isRequired,
  onDelete: PropTypes.func
};

export default ThreeDViewer;