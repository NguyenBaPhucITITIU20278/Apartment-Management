import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const ThreeDViewer = ({ modelPath }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0xffffff, 1);
    mountRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);

    // Tạo SkyBox
    const loader = new THREE.CubeTextureLoader();
    const texture = loader.load([
      'path/to/px.jpg', // Right
      'path/to/nx.jpg', // Left
      'path/to/py.jpg', // Top
      'path/to/ny.jpg', // Bottom
      'path/to/pz.jpg', // Front
      'path/to/nz.jpg'  // Back
    ]);
    scene.background = texture;

    const gltfLoader = new GLTFLoader();
    gltfLoader.load(
      modelPath,
      (gltf) => {
        scene.add(gltf.scene);
        console.log("Model loaded successfully");
      },
      undefined,
      (error) => {
        console.error("Error loading model:", error);
      }
    );

    const ambientLight = new THREE.AmbientLight(0x404040, 2); // Soft white light
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(0, 1, 0).normalize();
    scene.add(directionalLight);

    camera.position.set(150, 180, 400);

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

  return <div ref={mountRef}></div>;
};

export default ThreeDViewer;