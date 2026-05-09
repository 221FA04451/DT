'use client';

import { Suspense, useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls, Center, Bounds, Points, PointMaterial, Html } from '@react-three/drei';
import * as THREE from 'three';

function DrugFlowParticles({ intensity = 0, activeOrgans = [], organCenters = {} }: { intensity: number, activeOrgans: string[], organCenters: Record<string, THREE.Vector3> }) {
  const pointsRef = useRef<THREE.Points>(null);
  const particlesRef = useRef<Float32Array | null>(null);
  const particleDataRef = useRef<any[]>([]);
  const particleCount = 6000; // Increased for full body coverage

  useEffect(() => {
    if (!pointsRef.current) return;
    
    const particles = new Float32Array(particleCount * 3);
    const data = [];
    
    for (let i = 0; i < particleCount; i++) {
      particles[i * 3] = 0;
      particles[i * 3 + 1] = 0;
      particles[i * 3 + 2] = 0;
      
      data.push({
        t: Math.random(), // Random start progress
        speed: 0.15 + Math.random() * 0.3,
        pathType: Math.random(), // Determines if it goes to organ or systemic (body)
        targetExtremity: Math.floor(Math.random() * 5), // 5 body extremities
        offsetX: (Math.random() - 0.5) * 0.15,
        offsetY: (Math.random() - 0.5) * 0.15,
        offsetZ: (Math.random() - 0.5) * 0.15,
        phase: Math.random() * Math.PI * 2
      });
    }
    particlesRef.current = particles;
    particleDataRef.current = data;
    pointsRef.current.geometry.setAttribute('position', new THREE.BufferAttribute(particles, 3));
    
    // Prevent particles from expanding the Bounds component
    pointsRef.current.geometry.boundingBox = new THREE.Box3(
      new THREE.Vector3(-0.01, -0.01, -0.01),
      new THREE.Vector3(0.01, 0.01, 0.01)
    );
    pointsRef.current.geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(0,0,0), 0.01);
  }, []);

  useFrame((_, delta) => {
    if (!pointsRef.current || !particlesRef.current || intensity <= 0) return;
    
    const positions = particlesRef.current;
    const data = particleDataRef.current;
    const time = Date.now() * 0.002;
    
    // Organ targets
    const availableTargets = Object.values(organCenters);
    const defaultTarget = new THREE.Vector3(0, 0, 0);
    
    // Systemic Full Body Targets (Head, Arms, Legs)
    const bodyTargets = [
      new THREE.Vector3(0, 1.8, 0),    // Head
      new THREE.Vector3(-1.0, 0.2, 0), // Left Arm
      new THREE.Vector3(1.0, 0.2, 0),  // Right Arm
      new THREE.Vector3(-0.4, -3.5, 0),// Left Leg
      new THREE.Vector3(0.4, -3.5, 0), // Right Leg
    ];
    
    for (let i = 0; i < particleCount; i++) {
      const pData = data[i];
      
      pData.t += delta * pData.speed * (0.5 + intensity * 1.2);
      if (pData.t > 1) {
        pData.t = 0;
        pData.pathType = Math.random(); // Reselect path type on reset
      }
      
      const t = pData.t;
      const idx = i * 3;
      
      // Central Hub: Aorta / Heart (connects all organs and body)
      const startX = 0, startY = 0.5, startZ = 0.1;
      
      // Determine if particle goes to an Organ (60% chance) or Full Body Systemic (40% chance)
      let target = defaultTarget;
      let isOrgan = false;
      
      if (pData.pathType < 0.6 && availableTargets.length > 0) {
        target = availableTargets[i % availableTargets.length];
        isOrgan = true;
      } else {
        // Fallback to 0 if undefined due to Next.js Fast Refresh preserving old useRef arrays
        const extremityIndex = pData.targetExtremity !== undefined ? pData.targetExtremity : (i % 5);
        target = bodyTargets[extremityIndex];
      }
      
      // Orbiting effect around the target
      let orbitRadius = 0;
      if (isOrgan) {
        orbitRadius = 0.3 + Math.sin(time + pData.phase) * 0.1;
      } else {
        orbitRadius = 0.1 + Math.sin(time + pData.phase) * 0.3; // Wider loose orbit for limbs
      }
      
      const targetSwirlX = target.x + Math.cos(t * Math.PI * 10 + pData.phase) * orbitRadius;
      const targetSwirlY = target.y + Math.sin(t * Math.PI * 8 + pData.phase) * orbitRadius;
      const targetSwirlZ = target.z + Math.cos(t * Math.PI * 12 + pData.phase) * orbitRadius;
      
      // Smooth curving path from the heart to the target
      // If it goes to limbs, arc it further out
      const arcFactor = isOrgan ? 0.5 : 1.5;
      const midX = (startX + target.x) / 2 + (pData.offsetX * 5 * arcFactor); 
      const midY = (startY + target.y) / 2;
      const midZ = (startZ + target.z) / 2 + (pData.offsetZ * 5 * arcFactor);
      
      const u = 1 - t;
      const tt = t * t;
      const uu = u * u;
      
      let x = uu * startX + 2 * u * t * midX + tt * targetSwirlX;
      let y = uu * startY + 2 * u * t * midY + tt * targetSwirlY;
      let z = uu * startZ + 2 * u * t * midZ + tt * targetSwirlZ;
      
      positions[idx] = x;
      positions[idx + 1] = y;
      positions[idx + 2] = z;
    }
    
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <Points ref={pointsRef} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#00e5ff"
        size={0.10}
        sizeAttenuation={true}
        depthWrite={false}
        depthTest={false}
        blending={THREE.AdditiveBlending}
        opacity={Math.min(intensity * 1.5, 0.8)}
      />
    </Points>
  );
}

// --- Main 3D Model ---
interface ModelProps {
  activeOrgans?: string[];
  simulationIntensity?: number;
}

function Model({ activeOrgans = [], simulationIntensity = 0 }: ModelProps) {
  const { scene } = useGLTF('/organs/3D.glb');
  const meshRefs = useRef<Map<string, THREE.Mesh>>(new Map());
  const [organCenters, setOrganCenters] = useState<Record<string, THREE.Vector3>>({});
  const organCentersRef = useRef<Record<string, THREE.Vector3>>({});

  const organColors: Record<string, { base: string; active: string; label: string }> = {
    liver: { base: '#004a5c', active: '#00e5ff', label: 'Liver' },
    kidney: { base: '#004a5c', active: '#ffaa00', label: 'Kidneys' },
    pancreas: { base: '#004a5c', active: '#ff3b3b', label: 'Pancreas' },
    stomach: { base: '#004a5c', active: '#00e676', label: 'Stomach' },
  };

  useEffect(() => {
    const meshMap = new Map<string, THREE.Mesh>();
    const centers: Record<string, THREE.Vector3> = {};
    const processedOrgans = new Set<string>();
    
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const name = mesh.name.toLowerCase();

        meshMap.set(name, mesh);
        
        // Compute precise center of the organ in the Model's local space
        mesh.geometry.computeBoundingBox();
        const center = new THREE.Vector3();
        mesh.geometry.boundingBox?.getCenter(center);
        
        let current: THREE.Object3D | null = mesh;
        while (current && current !== scene) {
          center.applyMatrix4(current.matrix);
          current = current.parent;
        }
        // Only save one center per organ type for the labels
        const organKey = Object.keys(organColors).find(k => name.includes(k));
        if (organKey && !processedOrgans.has(organKey)) {
          centers[organKey] = center;
          processedOrgans.add(organKey);
        }

        const isOrgan = Object.keys(organColors).some(k => name.includes(k));
        
        const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        mats.forEach((m) => {
          const mat = m as THREE.MeshStandardMaterial;
          if (isOrgan) {
            mat.emissive = new THREE.Color('#004a5c');
            mat.emissiveIntensity = 0.6; 
          } else {
            // Full body silhouette
            mat.color = new THREE.Color('#c8c8c8'); // lightgray 200
            mat.emissive = new THREE.Color('#c8c8c8');
            mat.emissiveIntensity = 0.15;
            mat.transparent = true;
            mat.opacity = 0.4; // Keep it transparent to see internal organs/veins
          }
          mat.needsUpdate = true;
        });
      }
    });
    meshRefs.current = meshMap;
    organCentersRef.current = centers;
    setOrganCenters(centers);
  }, [scene]);

  useFrame((_, delta) => {
    meshRefs.current.forEach((mesh, name) => {
      const isOrgan = Object.keys(organColors).some(k => name.includes(k));
      const isActiveOrgan = activeOrgans.some(organ => name.includes(organ.toLowerCase()));
      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];

      mats.forEach((m) => {
        const mat = m as THREE.MeshStandardMaterial;
        
        if (isOrgan) {
          const colorKey = Object.keys(organColors).find(k => name.includes(k)) || 'liver';
          if (isActiveOrgan) {
            const color = organColors[colorKey];
            const targetColor = color.active;
            const targetIntensity = 1.2 + Math.sin(Date.now() * 0.003) * 0.4 * simulationIntensity;

            mat.emissive.lerp(new THREE.Color(targetColor), delta * 2);
            mat.emissiveIntensity += (targetIntensity - mat.emissiveIntensity) * delta * 2;
          } else {
            const baseColor = organColors[colorKey];
            mat.emissive.lerp(new THREE.Color(baseColor.base), delta);
            mat.emissiveIntensity += (0.6 - mat.emissiveIntensity) * delta;
          }
        } else {
          // Pulse the entire body network slightly based on simulation intensity
          const bodyPulse = 0.15 + simulationIntensity * 0.4 + Math.sin(Date.now() * 0.002) * 0.1 * simulationIntensity;
          mat.emissive.lerp(new THREE.Color(simulationIntensity > 0 ? '#00e5ff' : '#c8c8c8'), delta * 2);
          mat.emissiveIntensity += (bodyPulse - mat.emissiveIntensity) * delta * 2;
        }
        
        mat.needsUpdate = true;
      });
    });
  });

  return (
    <group>
      <primitive object={scene} />
      <DrugFlowParticles intensity={simulationIntensity} activeOrgans={activeOrgans} organCenters={organCentersRef.current} />
    </group>
  );
}

useGLTF.preload('/organs/3D.glb');

// --- Main Component ---
interface BodyModel3DProps {
  activeOrgans?: string[];
  simulationIntensity?: number;
}

export default function BodyModel3D({ activeOrgans = [], simulationIntensity = 0 }: BodyModel3DProps) {
  return (
    <div className="relative w-full h-85 sm:h-95 xl:h-105">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent', width: '100%', height: '100%' }}
      >
        <ambientLight intensity={0.35} color="#c0e8ff" />
        <directionalLight position={[1, 3.5, 3]} intensity={1.4 + simulationIntensity * 0.5} color="#00e5ff" />
        <directionalLight position={[-2, 1.8, -4]} intensity={0.5} color="#0088aa" />
        <pointLight position={[0, -3, 2]} intensity={0.4 + simulationIntensity * 0.3} color="#ffaa00" />

        {/* Dynamic Glow Light when simulation is active */}
        {simulationIntensity > 0 && (
          <pointLight position={[0, 0, 2]} intensity={simulationIntensity * 2} color="#00e5ff" distance={5} />
        )}

        <Suspense fallback={null}>
          <Bounds fit clip margin={1.0}>
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

