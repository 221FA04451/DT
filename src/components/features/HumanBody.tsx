'use client';

import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

/* ═══════════════════════════════════════════
   X-RAY BODY SHADER
═══════════════════════════════════════════ */
const xRayVert = `
  varying vec3 vNormal; varying vec3 vViewDir;
  void main() {
    vNormal  = normalize(normalMatrix * normal);
    vec4 mv  = modelViewMatrix * vec4(position,1.0);
    vViewDir = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }`;
const xRayFrag = `
  uniform vec3 bodyColor; uniform vec3 rimColor;
  varying vec3 vNormal;   varying vec3 vViewDir;
  void main() {
    float NdotV = abs(dot(vNormal, vViewDir));
    float edge  = pow(1.0 - NdotV, 2.2);
    vec3  col   = mix(bodyColor, rimColor, edge);
    float alpha = mix(0.03, 0.92, pow(edge, 1.3));
    gl_FragColor = vec4(col, alpha);
  }`;

/* ═══════════════════════════════════════════
   ORGAN CONNECTIONS — animated flow lines
═══════════════════════════════════════════ */
const CONNECTIONS: Array<[string, string]> = [
  ['heart',   'lung-r'],
  ['heart',   'lung-l'],
  ['heart',   'liver'],
  ['heart',   'kidney-r'],
  ['liver',   'stomach'],
  ['liver',   'intestine'],
  ['stomach', 'intestine'],
  ['kidney-r','intestine'],
];

function OrganConnections() {
  const { lineObjects, dotObjects } = useMemo(() => {
    const organPos: Record<string, THREE.Vector3> = Object.fromEntries(
      ORGAN_DEFS.map(d => [d.id, new THREE.Vector3(...d.pos)])
    );

    const lineObjects: { line: THREE.Line; curve: THREE.CatmullRomCurve3 }[] = [];
    const dotObjects: { mesh: THREE.Mesh; curve: THREE.CatmullRomCurve3; phase: number }[] = [];

    const dotGeo = new THREE.SphereGeometry(0.006, 6, 4);

    CONNECTIONS.forEach(([aId, bId], i) => {
      const a = organPos[aId];
      const b = organPos[bId];
      if (!a || !b) return;

      // Slight curve for organic feel
      const mid = new THREE.Vector3().lerpVectors(a, b, 0.5);
      mid.z += 0.04;
      const curve = new THREE.CatmullRomCurve3([a, mid, b]);

      // Static line
      const lineMat = new THREE.LineBasicMaterial({
        color: 0x00c8ff,
        transparent: true,
        opacity: 0.18,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      const lineGeo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(24));
      const line = new THREE.Line(lineGeo, lineMat);
      line.renderOrder = 1;
      lineObjects.push({ line, curve });

      // Two traveling dots per connection, staggered
      for (let j = 0; j < 2; j++) {
        const dotMat = new THREE.MeshBasicMaterial({
          color: 0x7ef4ff,
          transparent: true,
          opacity: 0,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        });
        const mesh = new THREE.Mesh(dotGeo, dotMat);
        mesh.renderOrder = 3;
        dotObjects.push({ mesh, curve, phase: (i / CONNECTIONS.length) + j * 0.5 });
      }
    });

    return { lineObjects, dotObjects };
  }, []);

  useFrame(state => {
    const t = state.clock.elapsedTime;
    dotObjects.forEach(({ mesh, curve, phase }) => {
      const p = (t * 0.35 + phase) % 1;
      const pos = curve.getPoint(p);
      mesh.position.copy(pos);
      (mesh.material as THREE.MeshBasicMaterial).opacity = Math.sin(p * Math.PI) * 0.9;
    });
  });

  return (
    <>
      {lineObjects.map(({ line }) => <primitive key={line.uuid} object={line} />)}
      {dotObjects.map(({ mesh }) => <primitive key={mesh.uuid} object={mesh} />)}
    </>
  );
}

/* ═══════════════════════════════════════════
   SPRITE ORGAN COMPONENT (SVG images)
═══════════════════════════════════════════ */
type OrganDef = {
  id: string;
  src: string;
  pos: [number,number,number];
  size: [number,number];
  pulse?: boolean;
};

const ORGAN_DEFS: OrganDef[] = [
  { id:'brain',    src:'/organs/brain.png',       pos:[ 0.00,  1.74,  0.00], size:[0.24,0.14]             },
  { id:'heart',    src:'/organs/heart.png',       pos:[-0.025, 1.375, 0.14], size:[0.14,0.14], pulse:true  },
  { id:'lung-r',   src:'/organs/lung-right.svg', pos:[ 0.09,  1.345, 0.10], size:[0.11,0.17]             },
  { id:'lung-l',   src:'/organs/lung-left.svg',  pos:[-0.10,  1.345, 0.10], size:[0.10,0.17]             },
  { id:'liver',    src:'/organs/liver.svg',       pos:[ 0.06,  1.15,  0.10], size:[0.22,0.10]             },
  { id:'stomach',  src:'/organs/Stomach.',     pos:[-0.055, 1.10,  0.11], size:[0.11,0.12]             },
  { id:'kidney-r', src:'/organs/kidney.png',      pos:[ 0.00,  1.06,  0.09], size:[0.14,0.12]             },
  { id:'intestine',src:'/organs/intestines.svg',  pos:[ 0.00,  0.94,  0.10], size:[0.22,0.22]             },
];

function OrganSprites() {
  const sprites = useMemo(() => {
    const texLoader = new THREE.TextureLoader();
    return ORGAN_DEFS.map(def => {
      const tex = texLoader.load(def.src);
      tex.colorSpace = THREE.SRGBColorSpace;
      const mat = new THREE.SpriteMaterial({
        map: tex,
        transparent: true,
        alphaTest: 0.05,
        depthTest: true,
        depthWrite: false,
        sizeAttenuation: true,
      });
      const sprite = new THREE.Sprite(mat);
      sprite.position.set(...def.pos);
      sprite.scale.set(def.size[0], def.size[1], 1);
      sprite.renderOrder = 1;
      return { sprite, def };
    });
  }, []);

  useFrame(state => {
    sprites.forEach(({ sprite, def }) => {
      if (def.pulse) {
        const beat = 1 + 0.04 * Math.sin(state.clock.elapsedTime * 3.0);
        sprite.scale.set(def.size[0] * beat, def.size[1] * beat, 1);
      }
    });
  });

  return (
    <>
      {sprites.map(({ sprite }) => (
        <primitive key={sprite.uuid} object={sprite} />
      ))}
    </>
  );
}


/* ═══════════════════════════════════════════
   X-RAY BODY
═══════════════════════════════════════════ */
type GLTFResult = { scene: THREE.Group };

function XRayBody() {
  const groupRef  = useRef<THREE.Group>(null);
  const { scene } = useGLTF('https://threejs.org/examples/models/gltf/Xbot.glb') as unknown as GLTFResult;

  const bodyGroup = useMemo(() => {
    const group = new THREE.Group();
    const mat = new THREE.ShaderMaterial({
      uniforms: {
        bodyColor: { value: new THREE.Color(0x7ec8e3) },
        rimColor:  { value: new THREE.Color(0xddf6ff) },
      },
      vertexShader: xRayVert, fragmentShader: xRayFrag,
      transparent: true, blending: THREE.NormalBlending,
      depthWrite: false, side: THREE.DoubleSide,
    });
    scene.traverse((child: THREE.Object3D) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (mesh.name === 'Alpha_Joints') return;
        const shell = new THREE.Mesh(mesh.geometry, mat);
        shell.position.copy(mesh.position);
        shell.rotation.copy(mesh.rotation);
        shell.scale.copy(mesh.scale);
        shell.renderOrder = 2;
        group.add(shell);
      }
    });
    return group;
  }, [scene]);

  useFrame(s => {
    if (groupRef.current)
      groupRef.current.position.y = Math.sin(s.clock.elapsedTime * 0.5) * 0.04 - 3;
  });

  return (
    <group ref={groupRef} position={[0, -3, 0]} scale={3}>
      <OrganConnections />
      <OrganSprites />
      <primitive object={bodyGroup} />
    </group>
  );
}

useGLTF.preload('https://threejs.org/examples/models/gltf/Xbot.glb');

/* ═══════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════ */
function DisableScrollZoom() {
  const { gl } = useThree();
  useEffect(() => {
    const h = (e: WheelEvent) => e.stopImmediatePropagation();
    gl.domElement.addEventListener('wheel', h, { capture: true });
    return () => gl.domElement.removeEventListener('wheel', h, { capture: true });
  }, [gl]);
  return null;
}

/* ═══════════════════════════════════════════
   CANVAS
═══════════════════════════════════════════ */
export function HumanBodyCanvas() {
  return (
    <Canvas
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      camera={{ position: [0, 0.5, 11], fov: 45 }}
      gl={{ powerPreference: 'high-performance', antialias: true }}
      dpr={[1, 2]}
      onCreated={({ scene, gl }) => {
        scene.background = new THREE.Color(0x000000);
        gl.domElement.style.touchAction = 'none';
        gl.domElement.style.outline = 'none';
      }}
    >
      <directionalLight position={[2, 6, 5]}  intensity={2.0} color={0xffffff} />
      <directionalLight position={[-2,3,-3]}  intensity={0.6} color={0xaaccff} />
      <ambientLight intensity={0.5} color={0x88aacc} />
      <XRayBody />
      <DisableScrollZoom />
      <OrbitControls
        target={[0, 0.5, 0]}
        mouseButtons={{ LEFT: 0, MIDDLE: 1, RIGHT: 1 }}
        enablePan={false}
        minDistance={4}
        maxDistance={18}
      />
    </Canvas>
  );
}

export default function Page() {
  return (
    <main className="w-full h-screen relative" style={{ touchAction: 'pan-y', background: '#000000' }}>
      <HumanBodyCanvas />
    </main>
  );
}
