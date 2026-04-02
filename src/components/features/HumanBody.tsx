'use client';

import { Suspense, useMemo, useEffect, useRef, useState } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';

/* ═══════════════════════════════════════════
   ORGAN DATABASE
═══════════════════════════════════════════ */
type OrganInfo = { name: string; color: string; description: string; facts: string[] };

const ORGAN_INFO: Record<string, OrganInfo> = {
  stomach: { name: 'Stomach', color: '#ffaa33', description: 'The stomach breaks down food using digestive acids and enzymes, beginning the chemical digestion process after swallowing.', facts: ['Holds up to 1.5 L', 'pH 1.5–3.5 (very acidic)', 'Digests food in 4–5 hours'] },
  brain:   { name: 'Brain',   color: '#ff9988', description: 'The brain is the control centre of the nervous system, responsible for thought, memory, emotion, and regulation of all body functions.', facts: ['~86 billion neurons', 'Uses 20% of body oxygen', 'Weighs ~1.4 kg'] },
  kidney:  { name: 'Kidneys', color: '#cc5522', description: 'The kidneys filter blood, remove waste products, and maintain fluid and electrolyte balance, producing urine as a by-product.', facts: ['Filter 200 L of blood/day', 'Produce 1–2 L urine/day', '~1 million nephrons each'] },
  lung:    { name: 'Lungs',   color: '#ff7755', description: 'The lungs are the primary organs of respiration, exchanging oxygen from inhaled air with carbon dioxide carried in the blood.', facts: ['Surface area ~70 m²', '22,000 breaths per day', 'Right lung is slightly larger'] },
  heart:   { name: 'Heart',   color: '#ff2244', description: 'The heart is a muscular organ that pumps blood throughout the body via the circulatory system, supplying oxygen and nutrients to every tissue.', facts: ['Pumps ~5 litres per minute', 'Beats 100,000× per day', 'Weighs 250–350 g'] },
  liver:   { name: 'Liver',   color: '#cc4411', description: 'The liver is the largest internal organ performing over 500 vital functions including detoxification, protein synthesis, and producing bile for digestion.', facts: ['500+ vital functions', 'Can self-regenerate', 'Weighs ~1.5 kg'] },
};

function matchOrgan(matName: string, meshName: string): OrganInfo | null {
  const m = matName.toLowerCase();
  const n = meshName.toLowerCase();
  if (m.includes('stomach'))  return ORGAN_INFO.stomach;
  if (m.includes('hj'))       return ORGAN_INFO.brain;
  if (m.includes('kidney'))   return ORGAN_INFO.kidney;
  if (m.includes('lung'))     return ORGAN_INFO.lung;
  if (m === 'material0.001')  return ORGAN_INFO.heart;
  if (m === 'material0')      return ORGAN_INFO.liver;
  if (n.includes('stomach'))  return ORGAN_INFO.stomach;
  if (n.includes('lung'))     return ORGAN_INFO.lung;
  return null;
}

/* ═══════════════════════════════════════════
   MINI ORGAN VIEWER (inside panel)
═══════════════════════════════════════════ */
function SpinningOrgan({ mesh }: { mesh: THREE.Mesh }) {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((_, dt) => { if (groupRef.current) groupRef.current.rotation.y += dt * 0.9; });

  const cloned = useMemo(() => {
    const geo  = mesh.geometry.clone();
    const src  = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material;
    const mat  = (src as THREE.Material).clone();
    const m    = new THREE.Mesh(geo, mat);
    const box  = new THREE.Box3().setFromObject(m);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const s    = 1.6 / Math.max(size.x, size.y, size.z, 0.001);
    m.scale.setScalar(s);
    m.position.set(-center.x * s, -center.y * s, -center.z * s);
    return m;
  }, [mesh]);

  return (
    <group ref={groupRef}>
      <primitive object={cloned} />
    </group>
  );
}

function OrganViewer({ mesh }: { mesh: THREE.Mesh }) {
  return (
    <Canvas
      style={{ width: '100%', height: '100%' }}
      camera={{ position: [0, 0, 3.5], fov: 45 }}
      gl={{ antialias: true, alpha: false }}
      onCreated={({ scene }) => { scene.background = new THREE.Color(0x0d0d0d); }}
    >
      <ambientLight intensity={3} />
      <directionalLight position={[2, 4, 3]}  intensity={3.5} />
      <directionalLight position={[-2, -2, 2]} intensity={2} />
      <pointLight position={[0, 2, 2]} intensity={2} />
      <SpinningOrgan mesh={mesh} />
    </Canvas>
  );
}

/* ═══════════════════════════════════════════
   SCROLL GUARD
═══════════════════════════════════════════ */
function ScrollGuard() {
  const { gl } = useThree();
  useEffect(() => {
    const canvas = gl.domElement;
    const h = (e: WheelEvent) => { if (!e.ctrlKey) e.stopImmediatePropagation(); };
    canvas.addEventListener('wheel', h, { capture: true });
    return () => canvas.removeEventListener('wheel', h, { capture: true });
  }, [gl]);
  return null;
}

/* ═══════════════════════════════════════════
   MAIN 3-D BODY
═══════════════════════════════════════════ */
const BODY_MATS  = new Set(['StingrayPBS5']);
const NERVE_MATS = new Set(['StingrayPBS1']);

function HumanBody({ onOrganClick, onOrbitLock }: { onOrganClick: (mesh: THREE.Mesh, info: OrganInfo | null) => void; onOrbitLock: (locked: boolean) => void }) {
  const { scene }      = useGLTF('/organs/3D.glb') as { scene: THREE.Group };
  const { camera, gl } = useThree();

  const splitRef        = useRef(false);
  const nerveOutRef     = useRef(false);
  const selectedRef     = useRef<THREE.Mesh | null>(null);
  const bodyMeshesRef   = useRef<THREE.Mesh[]>([]);
  const nerveMeshesRef  = useRef<THREE.Mesh[]>([]);
  const allMeshesRef    = useRef<THREE.Mesh[]>([]);
  const origXRef        = useRef<Map<THREE.Mesh, number>>(new Map());
  const origZRef        = useRef<Map<THREE.Mesh, number>>(new Map());
  const origScaleRef    = useRef<Map<THREE.Mesh, THREE.Vector3>>(new Map());
  const geoCxRef        = useRef<Map<THREE.Mesh, number>>(new Map());

  const { clonedScene, bodyMeshes, nerveMeshes, allMeshes } = useMemo(() => {
    const cloned       = scene.clone(true);
    const bodyMeshes:  THREE.Mesh[] = [];
    const nerveMeshes: THREE.Mesh[] = [];
    const allMeshes:   THREE.Mesh[] = [];

    cloned.traverse((child: THREE.Object3D) => {
      if (!(child as THREE.Mesh).isMesh) return;
      const mesh    = child as THREE.Mesh;
      const mat     = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material;
      const matName = (mat as THREE.Material & { name?: string })?.name ?? '';

      mesh.material = Array.isArray(mesh.material)
        ? mesh.material.map(m => m.clone())
        : mesh.material.clone();

      if (BODY_MATS.has(matName))       bodyMeshes.push(mesh);
      else if (NERVE_MATS.has(matName)) nerveMeshes.push(mesh);
      allMeshes.push(mesh);
    });

    // Normalize
    const box    = new THREE.Box3().setFromObject(cloned);
    const size   = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const s      = 4.5 / size.y;
    cloned.scale.multiplyScalar(s);
    cloned.position.set(-center.x * s, -box.min.y * s, -center.z * s);

    // World-space center X for split direction
    cloned.updateMatrixWorld(true);
    bodyMeshes.forEach(m => {
      m.geometry.computeBoundingBox();
      const bb  = m.geometry.boundingBox!;
      const loc = new THREE.Vector3((bb.min.x + bb.max.x) / 2, 0, 0);
      m.userData.geoCx = m.localToWorld(loc).x;
    });

    return { clonedScene: cloned, bodyMeshes, nerveMeshes, allMeshes };
  }, [scene]);

  useEffect(() => {
    bodyMeshesRef.current  = bodyMeshes;
    nerveMeshesRef.current = nerveMeshes;
    allMeshesRef.current   = allMeshes;

    allMeshes.forEach(m => {
      origXRef.current.set(m, m.position.x);
      origZRef.current.set(m, m.position.z);
      origScaleRef.current.set(m, m.scale.clone());
    });
    bodyMeshes.forEach(m => {
      geoCxRef.current.set(m, m.userData.geoCx ?? 0);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clonedScene]);

  // Click handler
  useEffect(() => {
    const canvas = gl.domElement;
    const ray    = new THREE.Raycaster();
    let downX = 0, downY = 0;

    const onDown  = (e: MouseEvent) => { downX = e.clientX; downY = e.clientY; };
    const onClick = (e: MouseEvent) => {
      if (Math.hypot(e.clientX - downX, e.clientY - downY) > 5) return;

      const rect = canvas.getBoundingClientRect();
      const ndc  = new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width)  *  2 - 1,
        ((e.clientY - rect.top)  / rect.height) * -2 + 1,
      );
      ray.setFromCamera(ndc, camera);
      const hits = ray.intersectObjects(allMeshesRef.current, false);

      if (hits.length > 0) {
        // Prioritise: organ > nerve > body
        const organHit = hits.find(h =>
          !bodyMeshesRef.current.includes(h.object as THREE.Mesh) &&
          !nerveMeshesRef.current.includes(h.object as THREE.Mesh)
        );
        const nerveHit = hits.find(h => nerveMeshesRef.current.includes(h.object as THREE.Mesh));
        const bodyHit  = hits.find(h => bodyMeshesRef.current.includes(h.object as THREE.Mesh));

        // Fallback: if no direct organ hit, find nearest organ by screen-space distance
        let resolvedOrganMesh: THREE.Mesh | null = organHit?.object as THREE.Mesh ?? null;
        if (!resolvedOrganMesh) {
          let best = 0.18; // max screen-space radius (NDC units)
          allMeshesRef.current.forEach(mesh => {
            if (bodyMeshesRef.current.includes(mesh) || nerveMeshesRef.current.includes(mesh)) return;
            mesh.geometry.computeBoundingBox();
            const c = new THREE.Vector3();
            mesh.geometry.boundingBox!.getCenter(c);
            c.applyMatrix4(mesh.matrixWorld).project(camera);
            const d = Math.hypot(c.x - ndc.x, c.y - ndc.y);
            if (d < best) { best = d; resolvedOrganMesh = mesh; }
          });
        }

        if (resolvedOrganMesh) {
          const mesh = resolvedOrganMesh;
          if (selectedRef.current === mesh) {
            selectedRef.current = null;
            onOrbitLock(false);
            onOrganClick(mesh, null);
          } else {
            selectedRef.current = mesh;
            splitRef.current    = false;   // collapse body when organ selected
            nerveOutRef.current = false;   // collapse nerve layer too
            onOrbitLock(true);
            const mat     = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material;
            const matName = (mat as THREE.Material & { name?: string })?.name ?? '';
            onOrganClick(mesh, matchOrgan(matName, mesh.name));
          }
        } else if (nerveHit) {
          nerveOutRef.current = !nerveOutRef.current;
          selectedRef.current = null;
          onOrbitLock(false);
          onOrganClick(nerveHit.object as THREE.Mesh, null);
        } else if (bodyHit) {
          splitRef.current    = !splitRef.current;
          selectedRef.current = null;
          onOrbitLock(false);
          onOrganClick(bodyHit.object as THREE.Mesh, null);
        }
      } else {
        splitRef.current    = false;
        selectedRef.current = null;
        onOrbitLock(false);
        onOrganClick({} as THREE.Mesh, null);
      }
    };

    canvas.addEventListener('mousedown', onDown);
    canvas.addEventListener('click', onClick);
    return () => {
      canvas.removeEventListener('mousedown', onDown);
      canvas.removeEventListener('click', onClick);
    };
  }, [camera, gl, onOrganClick, onOrbitLock]);

  useFrame(() => {
    const SPLIT = 0.7;

    // Split body left/right
    bodyMeshesRef.current.forEach(mesh => {
      const origX  = origXRef.current.get(mesh) ?? 0;
      const geoCx  = geoCxRef.current.get(mesh) ?? 0;
      const target = splitRef.current ? origX + (geoCx >= 0 ? SPLIT : -SPLIT) : origX;
      mesh.position.x = THREE.MathUtils.lerp(mesh.position.x, target, 0.08);
    });

    // Nerve/vessel layer pops forward
    nerveMeshesRef.current.forEach(mesh => {
      const origZ = origZRef.current.get(mesh) ?? 0;
      const target = nerveOutRef.current ? origZ + 0.6 : origZ;
      mesh.position.z = THREE.MathUtils.lerp(mesh.position.z, target, 0.08);
    });

    // Organ pop-out on select — always push forward on Z (toward camera), reset X
    allMeshesRef.current.forEach(mesh => {
      if (bodyMeshesRef.current.includes(mesh) || nerveMeshesRef.current.includes(mesh)) return;
      const origX  = origXRef.current.get(mesh)    ?? 0;
      const origZ  = origZRef.current.get(mesh)    ?? 0;
      const origSc = origScaleRef.current.get(mesh) ?? new THREE.Vector3(1, 1, 1);
      const sel    = mesh === selectedRef.current;
      mesh.position.x = THREE.MathUtils.lerp(mesh.position.x, origX, 0.1);
      mesh.position.z = THREE.MathUtils.lerp(mesh.position.z, sel ? origZ + 0.5 : origZ, 0.1);
      mesh.scale.lerp(origSc.clone().multiplyScalar(sel ? 1.18 : 1), 0.1);
    });
  });

  return <primitive object={clonedScene} />;
}

useGLTF.preload('/organs/3D.glb');

/* ═══════════════════════════════════════════
   CANVAS + PANEL
═══════════════════════════════════════════ */
export function HumanBodyCanvas() {
  const [selected, setSelected]       = useState<{ mesh: THREE.Mesh; info: OrganInfo | null } | null>(null);
  const [orbitEnabled, setOrbitEnabled] = useState(true);

  const handleOrganClick = (mesh: THREE.Mesh, info: OrganInfo | null) => {
    if (info) setSelected({ mesh, info });
    else setSelected(null);
  };

  const handleClose = () => {
    setSelected(null);
    setOrbitEnabled(true);
  };

  return (
    <div className="absolute inset-0">
      {/* 3-D Canvas */}
      <Canvas
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        camera={{ position: [0, 2.2, 7], fov: 55, near: 0.01, far: 1000 }}
        gl={{ powerPreference: 'high-performance', antialias: true }}
        dpr={[1, 2]}
        onCreated={({ scene, gl }) => {
          scene.background = new THREE.Color(0x000000);
          gl.domElement.style.touchAction = 'none';
          gl.domElement.style.outline = 'none';
        }}
      >
        <ambientLight intensity={2.5} color={0xfff5e0} />
        <directionalLight position={[2, 6, 5]}  intensity={3.0} color={0xffe8d0} />
        <directionalLight position={[-3, 4, 3]} intensity={2.0} color={0xffdfc0} />
        <directionalLight position={[0, -2, 4]} intensity={1.5} color={0xffeedd} />
        <directionalLight position={[0, 6, -4]} intensity={1.2} color={0xffffff} />
        <ScrollGuard />
        <Suspense fallback={null}>
          <HumanBody onOrganClick={handleOrganClick} onOrbitLock={locked => setOrbitEnabled(!locked)} />
        </Suspense>
        <OrbitControls
          enabled={orbitEnabled}
          target={[0, 2.2, 0]}
          enablePan={false}
          minDistance={3}
          maxDistance={20}
          mouseButtons={{ LEFT: THREE.MOUSE.ROTATE, MIDDLE: THREE.MOUSE.DOLLY, RIGHT: THREE.MOUSE.ROTATE }}
        />
      </Canvas>

      {/* Right-side organ panel */}
      <AnimatePresence>
        {selected && (
          <motion.div
            key={selected.info?.name}
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 60 }}
            transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="absolute right-4 top-16 w-80 rounded-2xl overflow-hidden border border-white/10 bg-black/80 backdrop-blur-md flex flex-col"
            style={{ boxShadow: `0 0 32px ${selected.info?.color ?? '#fff'}33` }}
          >
            {/* Header: organ name */}
            <div className="px-5 py-3 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ background: selected.info?.color }} />
                <h3 className="text-base font-bold text-white">{selected.info?.name}</h3>
              </div>
              <button onClick={handleClose} className="text-zinc-500 hover:text-white text-xs">✕</button>
            </div>

            {/* Middle: 3-D organ viewer */}
            <div className="w-full h-52 bg-[#111]">
              <OrganViewer mesh={selected.mesh} />
            </div>

            {/* Bottom: description + facts */}
            <div className="px-5 py-4 space-y-3">
              <p className="text-xs leading-relaxed text-zinc-300">{selected.info?.description}</p>
              {selected.info?.facts && (
                <ul className="space-y-1">
                  {selected.info.facts.map(f => (
                    <li key={f} className="flex items-start gap-2 text-xs text-zinc-400">
                      <span style={{ color: selected.info!.color }} className="mt-0.5 shrink-0">▸</span>
                      {f}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Page() {
  return (
    <main className="w-full h-screen relative" style={{ touchAction: 'pan-y', background: '#000000' }}>
      <HumanBodyCanvas />
    </main>
  );
}
