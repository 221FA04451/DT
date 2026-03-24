'use client';

import dynamic from 'next/dynamic';
import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

/* -------------------- Shader -------------------- */

const HologramShader = {
  uniforms: {
    c: { value: 0.1 },
    p: { value: 3.5 },
    glowColor: { value: new THREE.Color(0x33b8ff) },
    baseColor: { value: new THREE.Color(0x020815) },
  },
  vertexShader: `
    varying vec3 vNormal;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform vec3 glowColor;
    uniform vec3 baseColor;
    uniform float c;
    uniform float p;
    varying vec3 vNormal;
    void main() {
      float intensity = pow(c - dot(vNormal, vec3(0.0, 0.0, 1.0)), p);
      gl_FragColor = vec4(mix(baseColor, glowColor, intensity), intensity * 1.5 + 0.1);
    }
  `,
};

/* -------------------- HumanBody -------------------- */

type GLTFResult = {
  scene: THREE.Group;
};

function HumanBody() {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF('https://threejs.org/examples/models/gltf/Xbot.glb') as unknown as GLTFResult;

  const holographicGroup = useMemo(() => {
    const group = new THREE.Group();

    const shaderMaterial = new THREE.ShaderMaterial({
      uniforms: HologramShader.uniforms,
      vertexShader: HologramShader.vertexShader,
      fragmentShader: HologramShader.fragmentShader,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.FrontSide,
    });

    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x44ccff,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    scene.traverse((child: THREE.Object3D) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const geom = mesh.geometry;

        const shell = new THREE.Mesh(geom, shaderMaterial);
        shell.position.copy(mesh.position);
        shell.rotation.copy(mesh.rotation);
        shell.scale.copy(mesh.scale);
        group.add(shell);

        const edges = new THREE.EdgesGeometry(geom, 15);
        const lines = new THREE.LineSegments(edges, lineMaterial);
        lines.position.copy(mesh.position);
        lines.rotation.copy(mesh.rotation);
        lines.scale.copy(mesh.scale);
        group.add(lines);
      }
    });

    return group;
  }, [scene]);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y =
        Math.sin(state.clock.elapsedTime * 0.5) * 0.05 - 3;
    }
  });

  return (
    <group ref={groupRef} position={[0, -3, 0]} scale={3}>
      <primitive object={holographicGroup} />
    </group>
  );
}

useGLTF.preload('https://threejs.org/examples/models/gltf/Xbot.glb');

/* -------------------- Page -------------------- */

export default function Page() {
  return (
    <main className="w-full h-screen bg-black">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.3} />
        <HumanBody />
        <OrbitControls />
      </Canvas>
    </main>
  );
}