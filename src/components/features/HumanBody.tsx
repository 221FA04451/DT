'use client';

import { Suspense, useRef } from 'react';
import dynamic from 'next/dynamic';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls, Center, Bounds } from '@react-three/drei';
import * as THREE from 'three';

function Model() {
  const { scene } = useGLTF('/organs/3D.glb');
  const ref = useRef<THREE.Group>(null);

  scene.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      const mesh = child as THREE.Mesh;
      mesh.material = new THREE.MeshStandardMaterial({
        color: new THREE.Color('#bae6fd'),
        emissive: new THREE.Color('#38bdf8'),
        emissiveIntensity: 0.2,
        transparent: true,
        opacity: 0.12,
        depthWrite: false,
        side: THREE.DoubleSide,
      });
    }
  });

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.3;
  });

  return (
    <Center>
      <primitive ref={ref} object={scene} />
    </Center>
  );
}

function Scene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 50 }}
      style={{ background: '#000000', width: '100%', height: '100%' }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={1.5} />
      <pointLight position={[-3, 2, -3]} intensity={1.2} color="#22d3ee" />
      <Suspense fallback={null}>
        <Bounds fit clip observe>
          <Model />
        </Bounds>
      </Suspense>
      <OrbitControls enablePan={false} enableZoom={false} />
    </Canvas>
  );
}

const SceneNoSSR = dynamic(() => Promise.resolve(Scene), { ssr: false });

export default function HumanBody() {
  return (
    <section className="bg-black h-screen w-full">
      <SceneNoSSR />
    </section>
  );
}

useGLTF.preload('/organs/3D.glb');
