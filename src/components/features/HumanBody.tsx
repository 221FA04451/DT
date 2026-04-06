'use client';

import { Suspense, useRef } from 'react';
import { Canvas, useFrame, ThreeEvent } from '@react-three/fiber';
import { useGLTF, OrbitControls, Environment, Center, Bounds } from '@react-three/drei';
import * as THREE from 'three';

// Finds the largest mesh (body shell) by bounding box volume
function findBodyMesh(scene: THREE.Object3D): THREE.Mesh | null {
  let largest: THREE.Mesh | null = null;
  let largestVol = 0;
  scene.traverse((obj) => {
    if (obj instanceof THREE.Mesh) {
      const box = new THREE.Box3().setFromObject(obj);
      const size = new THREE.Vector3();
      box.getSize(size);
      const vol = size.x * size.y * size.z;
      if (vol > largestVol) { largestVol = vol; largest = obj; }
    }
  });
  return largest;
}

function Model() {
  const { scene } = useGLTF('/organs/3D.glb');
  const explodedRef = useRef(false);
  // Resolved lazily on first frame — outside of React's hook tracking
  let resolved: THREE.Mesh | null = null;

  useFrame(() => {
    if (!resolved) resolved = findBodyMesh(scene);
    if (!resolved) return;
    const targetZ = explodedRef.current ? 1.5 : 0;
    resolved.position.z = THREE.MathUtils.lerp(resolved.position.z, targetZ, 0.07);
  });

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    explodedRef.current = !explodedRef.current;
  };

  return <primitive object={scene} onClick={handleClick} />;
}

export default function HumanBody() {
  return (
    <section
      className="relative w-full bg-black"
      style={{ height: 'calc(100vh - 56px)', marginTop: '-1px' }}
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        style={{ width: '100%', height: '100%' }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <Suspense fallback={null}>
          <Bounds fit clip observe margin={1.1}>
            <Center>
              <Model />
            </Center>
          </Bounds>
          <Environment preset="city" />
        </Suspense>
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          makeDefault
          autoRotate
          autoRotateSpeed={0.5}
        />
      </Canvas>

      {/* Bottom-left: title */}
      <div className="absolute bottom-6 left-6 pointer-events-none">
        <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">
          Human Digital Twin
        </h1>
      </div>

      {/* Bottom-right: description */}
      <div className="absolute bottom-6 right-6 max-w-70 pointer-events-none">
        <p className="text-xs text-white/60 leading-relaxed text-left">
          A molecule-level simulation of the human body that models how drugs are absorbed,
          distributed, metabolised, and excreted — before a single clinical trial begins.
        </p>
      </div>
    </section>
  );
}
