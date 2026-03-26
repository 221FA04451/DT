'use client';

import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

/* -------------------- Shader -------------------- */

const HologramShader = {
  uniforms: {
    c: { value: 0.1 },
    p: { value: 3.5 },
    glowColor: { value: new THREE.Color(0x0088cc) }, // 30% secondary
    baseColor: { value: new THREE.Color(0x020815) }, // 60% dominant
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
      float intensity = pow(clamp(c - dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.0, 1.0), p);
      gl_FragColor = vec4(mix(baseColor, glowColor, intensity), intensity * 1.5 + 0.1);
    }
  `,
};

/* -------------------- DisableScrollZoom -------------------- */

function DisableScrollZoom() {
  const { gl } = useThree();
  useEffect(() => {
    const handler = (e: WheelEvent) => e.stopImmediatePropagation();
    gl.domElement.addEventListener('wheel', handler, { capture: true });
    return () => gl.domElement.removeEventListener('wheel', handler, { capture: true });
  }, [gl]);
  return null;
}

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
      color: 0x0088cc, // 30% secondary
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
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.6;
    }
  });

  return (
    <group ref={groupRef} position={[0, -3, 0]} scale={3}>
      <primitive object={holographicGroup} />
    </group>
  );
}

useGLTF.preload('https://threejs.org/examples/models/gltf/Xbot.glb');

/* -------------------- Platform -------------------- */

function Platform() {
  const ring1 = useRef<THREE.Mesh>(null);
  const ring2 = useRef<THREE.Mesh>(null);
  const ring3 = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (ring1.current) ring1.current.rotation.z = t * 0.5;
    if (ring2.current) ring2.current.rotation.z = -t * 0.3;
    if (ring3.current) ring3.current.rotation.z = t * 0.2;
  });

  return (
    <group position={[0, -3.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      {/* base disc */}
      <mesh>
        <circleGeometry args={[1.8, 128]} />
        <meshBasicMaterial
          color="#020815"
          transparent
          opacity={0.25}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* inner ring */}
      <mesh ref={ring1}>
        <ringGeometry args={[0.7, 0.74, 128]} />
        <meshBasicMaterial
          color="#0088cc"
          transparent
          opacity={0.9}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* mid ring */}
      <mesh ref={ring2}>
        <ringGeometry args={[1.1, 1.14, 128]} />
        <meshBasicMaterial
          color="#0088cc"
          transparent
          opacity={0.7}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* outer ring */}
      <mesh ref={ring3}>
        <ringGeometry args={[1.6, 1.65, 128]} />
        <meshBasicMaterial
          color="#0088cc"
          transparent
          opacity={0.5}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* diagonal accent line */}
      <mesh rotation={[0, 0, Math.PI / 4]}>
        <ringGeometry args={[0.0, 1.75, 2, 1, 0, 0.04]} />
        <meshBasicMaterial
          color="#44ddff"
          transparent
          opacity={0.95}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

/* -------------------- Page -------------------- */

export default function Page() {
  return (
    <main className="w-full h-screen bg-black" style={{ touchAction: 'pan-y' }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{ powerPreference: 'high-performance', antialias: false }}
        dpr={[1, 1.5]}
        onCreated={({ gl }) => { gl.domElement.style.touchAction = 'pan-y'; }}
      >
        <ambientLight intensity={0.3} />
        <HumanBody />
        <Platform />
        <DisableScrollZoom />
        <OrbitControls
          mouseButtons={{
            LEFT: 0,   // ROTATE
            MIDDLE: 1, // DOLLY
            RIGHT: 1,  // DOLLY (zoom) on right click
          }}
          enablePan={false}
        />
      </Canvas>
    </main>
  );
}