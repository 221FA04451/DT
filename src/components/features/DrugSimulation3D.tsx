'use client';

import { Suspense, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls, Center, Bounds, Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

interface SimulationProps {
  activeOrgans?: string[];
  simulationIntensity?: number;
}

function ParticleSystem({ intensity = 0 }) {
  const pointsRef = useRef<THREE.Points>(null);
  const particlesRef = useRef<Float32Array | null>(null);

  useEffect(() => {
    if (!pointsRef.current) return;

    const particleCount = 5000;
    const particles = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      particles[i * 3] = (Math.random() - 0.5) * 10;
      particles[i * 3 + 1] = (Math.random() - 0.5) * 10;
      particles[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }

    particlesRef.current = particles;
    if (pointsRef.current.geometry) {
      pointsRef.current.geometry.setAttribute(
        'position',
        new THREE.BufferAttribute(particles, 3)
      );
    }
  }, []);

  useFrame(() => {
    if (!pointsRef.current || !particlesRef.current || intensity === 0) return;

    const positions = particlesRef.current;
    for (let i = 0; i < positions.length; i += 3) {
      const angle = Math.atan2(positions[i + 1], positions[i]);
      const distance = Math.sqrt(positions[i] ** 2 + positions[i + 1] ** 2);

      positions[i] += Math.cos(angle) * intensity * 0.02;
      positions[i + 1] += Math.sin(angle) * intensity * 0.02;
      positions[i + 2] += (Math.random() - 0.5) * intensity * 0.01;

      if (distance > 5) {
        positions[i] = (Math.random() - 0.5) * 10;
        positions[i + 1] = (Math.random() - 0.5) * 10;
        positions[i + 2] = (Math.random() - 0.5) * 10;
      }
    }

    if (pointsRef.current.geometry) {
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <Points ref={pointsRef} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color={intensity > 0.5 ? '#00e5ff' : '#00e676'}
        size={0.1 * intensity}
        sizeAttenuation
        depthWrite={false}
        opacity={Math.min(intensity, 1)}
      />
    </Points>
  );
}

interface ModelProps {
  activeOrgans?: string[];
  simulationIntensity?: number;
}

function Model({ activeOrgans = [], simulationIntensity = 0 }: ModelProps) {
  const { scene } = useGLTF('/organs/3D.glb');
  const meshRefs = useRef<Map<string, THREE.Mesh>>(new Map());
  const glowsRef = useRef<Map<string, THREE.Light>>(new Map());

  const organColors: Record<string, { base: string; active: string }> = {
    liver: { base: '#001a22', active: '#00e5ff' },
    kidney: { base: '#001a22', active: '#ffaa00' },
    pancreas: { base: '#001a22', active: '#ff3b3b' },
    stomach: { base: '#001a22', active: '#00e676' },
  };

  useEffect(() => {
    const meshMap = new Map<string, THREE.Mesh>();
    const glowMap = new Map<string, THREE.Light>();

    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const name = mesh.name.toLowerCase();

        meshMap.set(name, mesh);

        const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        mats.forEach((m) => {
          const mat = m as THREE.MeshStandardMaterial;
          mat.emissive = new THREE.Color('#001a22');
          mat.emissiveIntensity = 0.4;
          mat.needsUpdate = true;
        });

        const pointLight = new THREE.PointLight(0x00e5ff, 0, 10);
        pointLight.position.copy(mesh.position);
        mesh.add(pointLight);
        glowMap.set(name, pointLight);
      }
    });

    meshRefs.current = meshMap;
    glowsRef.current = glowMap;
  }, [scene]);

  useFrame((_, delta) => {
    meshRefs.current.forEach((mesh, name) => {
      const isActive = activeOrgans.some(organ => name.includes(organ.toLowerCase()));
      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      const glow = glowsRef.current.get(name);

      mats.forEach((m) => {
        const mat = m as THREE.MeshStandardMaterial;
        if (isActive) {
          const color = organColors[Object.keys(organColors).find(k => name.includes(k)) || 'liver'];
          const targetColor = color.active;
          const targetIntensity = 1.2 + Math.sin(Date.now() * 0.003) * 0.4;
          const pulse = 0.8 + Math.sin(Date.now() * 0.005) * 0.2;

          mat.emissive.lerp(new THREE.Color(targetColor), delta * 2);
          mat.emissiveIntensity = mat.emissiveIntensity + (targetIntensity - mat.emissiveIntensity) * delta * 2;
          mat.metalness = Math.min(mat.metalness + delta * 0.5, 0.5);

          if (glow) {
            glow.intensity = pulse * simulationIntensity;
            glow.color.setHex(parseInt(targetColor.replace('#', ''), 16));
          }
        } else {
          const baseColor = organColors[Object.keys(organColors).find(k => name.includes(k)) || 'liver'];
          mat.emissive.lerp(new THREE.Color(baseColor.base), delta);
          mat.emissiveIntensity = mat.emissiveIntensity + (0.4 - mat.emissiveIntensity) * delta;
          mat.metalness = Math.max(mat.metalness - delta * 0.3, 0);

          if (glow) {
            glow.intensity = 0;
          }
        }
        mat.needsUpdate = true;
      });
    });
  });

  return (
    <>
      <primitive object={scene} />
      {simulationIntensity > 0 && <ParticleSystem intensity={simulationIntensity} />}
    </>
  );
}

useGLTF.preload('/organs/3D.glb');

interface BodyModel3DProps {
  activeOrgans?: string[];
  simulationIntensity?: number;
}

export default function DrugSimulation3D({ activeOrgans = [], simulationIntensity = 0 }: BodyModel3DProps) {
  return (
    <div className="relative w-full h-85 sm:h-95 xl:h-105">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent', width: '100%', height: '100%' }}
      >
        <ambientLight intensity={0.35 + simulationIntensity * 0.3} color="#c0e8ff" />
        <directionalLight position={[1, 3.5, 3]} intensity={1.4 + simulationIntensity * 0.5} color="#00e5ff" />
        <directionalLight position={[-2, 1.8, -4]} intensity={0.5} color="#0088aa" />
        <pointLight position={[0, -3, 2]} intensity={0.4 + simulationIntensity * 0.5} color="#ffaa00" />

        {simulationIntensity > 0.3 && (
          <>
            <pointLight position={[2, 2, 2]} intensity={simulationIntensity * 2} color="#00e676" />
            <pointLight position={[-2, -2, -2]} intensity={simulationIntensity * 1.5} color="#ff3b3b" />
          </>
        )}

        <Suspense fallback={null}>
          <Bounds fit clip observe margin={1.2}>
            <Center>
              <Model activeOrgans={activeOrgans} simulationIntensity={simulationIntensity} />
            </Center>
          </Bounds>
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            minPolarAngle={Math.PI * 0.18}
            maxPolarAngle={Math.PI * 0.7}
            autoRotate={false}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
