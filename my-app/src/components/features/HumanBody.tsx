"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/* ── Hologram shader ── */
const VERT = `
  varying vec3 vNormal;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const FRAG = `
  uniform vec3 glowColor;
  uniform float c;
  uniform float p;
  varying vec3 vNormal;
  void main() {
    float intensity = pow(c - dot(vNormal, vec3(0.0, 0.0, 1.0)), p);
    intensity = clamp(intensity, 0.0, 1.0);
    gl_FragColor = vec4(glowColor * intensity, intensity * 1.8 + 0.05);
  }
`;

function makeHoloMat() {
  return new THREE.ShaderMaterial({
    uniforms: {
      glowColor: { value: new THREE.Color(0x00aaff) },
      c: { value: 0.08 },
      p: { value: 4.0 },
    },
    vertexShader: VERT,
    fragmentShader: FRAG,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    side: THREE.FrontSide,
  });
}

/* ── Star field ── */
const STAR_COUNT = 1800;
const starPositions = (() => {
  const pos = new Float32Array(STAR_COUNT * 3);
  for (let i = 0; i < STAR_COUNT; i++) {
    pos[i * 3]     = (Math.random() - 0.5) * 80;
    pos[i * 3 + 1] = (Math.random() - 0.5) * 80;
    pos[i * 3 + 2] = (Math.random() - 0.5) * 80;
  }
  return pos;
})();

function Stars() {
  const ref = useRef<THREE.Points>(null);
  useFrame((_, delta) => { if (ref.current) ref.current.rotation.y += delta * 0.02; });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[starPositions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#88ccff" size={0.08} transparent opacity={0.7} sizeAttenuation />
    </points>
  );
}

/* ── Platform rings ── */
function Platform() {
  const r1 = useRef<THREE.Mesh>(null);
  const r2 = useRef<THREE.Mesh>(null);
  useFrame((s) => {
    const t = s.clock.elapsedTime;
    if (r1.current) r1.current.rotation.z = t * 0.4;
    if (r2.current) r2.current.rotation.z = -t * 0.25;
  });
  return (
    <group position={[0, -3.2, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.6, 64]} />
        <meshBasicMaterial color="#0055aa" transparent opacity={0.18} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh ref={r1} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.0, 1.06, 64]} />
        <meshBasicMaterial color="#33bbff" transparent opacity={0.9} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh ref={r2} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.45, 1.5, 64]} />
        <meshBasicMaterial color="#0099dd" transparent opacity={0.6} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
    </group>
  );
}

/* ── Human body from primitives ── */
type Part = { geo: THREE.BufferGeometry; pos: [number,number,number]; rot?: [number,number,number] };

function HumanBodyMesh() {
  const groupRef = useRef<THREE.Group>(null);
  const { bodyGroup } = useMemo(() => {
    const parts: Part[] = [
      { geo: new THREE.SphereGeometry(0.18, 20, 20),              pos: [0, 1.72, 0] },
      { geo: new THREE.CylinderGeometry(0.065, 0.065, 0.16, 12), pos: [0, 1.49, 0] },
      { geo: new THREE.CylinderGeometry(0.21, 0.17, 0.92, 18),   pos: [0, 0.92, 0] },
      { geo: new THREE.CylinderGeometry(0.17, 0.14, 0.28, 16),   pos: [0, 0.30, 0] },
      { geo: new THREE.CylinderGeometry(0.07, 0.06, 0.50, 12),   pos: [-0.36, 0.96, 0], rot: [0, 0,  0.42] },
      { geo: new THREE.CylinderGeometry(0.07, 0.06, 0.50, 12),   pos: [ 0.36, 0.96, 0], rot: [0, 0, -0.42] },
      { geo: new THREE.CylinderGeometry(0.055,0.045, 0.46, 12),  pos: [-0.56, 0.62, 0], rot: [0, 0,  0.62] },
      { geo: new THREE.CylinderGeometry(0.055,0.045, 0.46, 12),  pos: [ 0.56, 0.62, 0], rot: [0, 0, -0.62] },
      { geo: new THREE.CylinderGeometry(0.10, 0.09, 0.72, 14),   pos: [-0.13,-0.24, 0] },
      { geo: new THREE.CylinderGeometry(0.10, 0.09, 0.72, 14),   pos: [ 0.13,-0.24, 0] },
      { geo: new THREE.CylinderGeometry(0.08, 0.065,0.66, 14),   pos: [-0.13,-0.87, 0] },
      { geo: new THREE.CylinderGeometry(0.08, 0.065,0.66, 14),   pos: [ 0.13,-0.87, 0] },
      { geo: new THREE.BoxGeometry(0.12, 0.06, 0.26),            pos: [-0.13,-1.24, 0.05] },
      { geo: new THREE.BoxGeometry(0.12, 0.06, 0.26),            pos: [ 0.13,-1.24, 0.05] },
    ];
    const group = new THREE.Group();
    const wireMat = new THREE.LineBasicMaterial({ color: 0x44ccff, transparent: true, opacity: 0.45, blending: THREE.AdditiveBlending, depthWrite: false });
    parts.forEach(({ geo, pos, rot }) => {
      const mesh = new THREE.Mesh(geo, makeHoloMat());
      mesh.position.set(...pos);
      if (rot) mesh.rotation.set(...rot);
      group.add(mesh);
      const edges = new THREE.LineSegments(new THREE.EdgesGeometry(geo, 12), wireMat);
      edges.position.set(...pos);
      if (rot) edges.rotation.set(...rot);
      group.add(edges);
    });
    return { bodyGroup: group };
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.07 - 3.0;
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.12;
  });

  return (
    <group ref={groupRef} position={[0, -3.0, 0]} scale={3.0}>
      <primitive object={bodyGroup} />
    </group>
  );
}

/* ── Exported section ── */
export default function HumanBodySection() {
  return (
    <section className="relative h-screen w-full">
      <div className="absolute inset-0 z-0" style={{ background: "radial-gradient(ellipse at 50% 60%, #061428 0%, #020810 55%, #000000 100%)" }} />
      <Canvas className="relative z-10" camera={{ position: [0, 0.5, 7], fov: 42 }} gl={{ antialias: true, alpha: true }} style={{ background: "transparent" }}>
        <ambientLight intensity={0.1} />
        <pointLight position={[0,  4, 3]} intensity={2.5} color="#33aaff" />
        <pointLight position={[-4, 0, 2]} intensity={1.0} color="#0055ff" />
        <pointLight position={[4, -2, 2]} intensity={0.8} color="#00ddff" />
        <Stars />
        <Platform />
        <HumanBodyMesh />
      </Canvas>
    </section>
  );
}
