'use client';

import { Suspense, useRef, useState } from 'react';
import { Canvas, useFrame, ThreeEvent } from '@react-three/fiber';
import { useGLTF, OrbitControls, Environment, Center, Bounds } from '@react-three/drei';
import * as THREE from 'three';

// Suppress THREE.Clock deprecation warning emitted by OrbitControls internals
// (three.js r169+ deprecated Clock in favour of Timer; library not yet updated)
if (typeof window !== 'undefined') {
  const _warn = console.warn.bind(console);
  console.warn = (...args: unknown[]) => {
    if (typeof args[0] === 'string' && (
      args[0].includes('THREE.Clock') ||
      args[0].includes('THREE.WebGLProgram') ||
      args[0].includes('non-static position')
    )) return;
    _warn(...args);
  };
}

// ── Organ data ───────────────────────────────────────────────────────────────
interface OrganInfo {
  name: string;
  color: string;
  glbPath: string | null;
  description: string;
  bullets: string[];
}

const ORGAN_MAP: Record<string, OrganInfo> = {
  brain: {
    name: 'Brain',
    color: '#c47b7b',
    glbPath: '/organs/brain.glb',
    description: 'Central organ of the nervous system, controlling thought, memory, motor skills and drug permeability across the blood-brain barrier.',
    bullets: ['Controls central nervous system', 'Blood-brain barrier modelled', 'Drug permeability tracked at synaptic fidelity'],
  },
  heart: {
    name: 'Heart',
    color: '#c0392b',
    glbPath: '/organs/heart.glb',
    description: 'Muscular pump that drives systemic circulation, determining drug distribution speed and cardiac bioavailability.',
    bullets: ['Cardiac output modelled dynamically', 'Drug distribution via bloodstream', 'Rhythm-dependent absorption rates'],
  },
  lung: {
    name: 'Lungs',
    color: '#d4a0a0',
    glbPath: '/organs/lungs.glb',
    description: 'Primary respiratory organs responsible for gas exchange and pulmonary drug absorption pathways.',
    bullets: ['Pulmonary absorption pathway', 'Inhalation bioavailability modelled', 'Rendered at molecular fidelity'],
  },
  kidney: {
    name: 'Kidneys',
    color: '#c0392b',
    glbPath: '/organs/kidney.glb',
    description: 'Bean-shaped paired organs that filter ~200 litres of blood daily, removing waste and regulating renal drug clearance rates.',
    bullets: ['Renal clearance modelled', 'Glomerular filtration rate tracked', 'Drug excretion half-life simulated'],
  },
  liver: {
    name: 'Liver',
    color: '#7b3f00',
    glbPath: '/organs/liver.glb',
    description: 'Primary site of drug metabolism. CYP450 enzyme pathways break down compounds before systemic circulation.',
    bullets: ['First-pass metabolism simulated', 'CYP450 enzyme pathways modelled', 'Hepatic clearance quantified'],
  },
  stomach: {
    name: 'Stomach',
    color: '#c0874b',
    glbPath: '/organs/stomach.glb',
    description: 'Oral drug absorption begins here. pH-dependent solubility determines how much of a dose reaches the bloodstream.',
    bullets: ['Oral drug absorption pathway', 'pH-dependent solubility modelled', 'Gastric emptying time tracked'],
  },
  intestin: {
    name: 'Intestines',
    color: '#b05b3b',
    glbPath: null,
    description: 'Site of nutrient and drug absorption from the gastrointestinal tract via passive and active transport.',
    bullets: ['GI absorption modelled', 'Transit time simulated', 'Transporter-mediated uptake included'],
  },
  spleen: {
    name: 'Spleen',
    color: '#6b4c8c',
    glbPath: null,
    description: 'Immune organ that filters blood and plays a role in nanoparticle drug delivery and immune response modelling.',
    bullets: ['Nanoparticle uptake modelled', 'Immune response integration', 'Blood filtration rate tracked'],
  },
};

function resolveOrganInfo(meshName: string): OrganInfo {
  const lower = meshName.toLowerCase();
  // Treat "defaultmaterial" (unnamed mesh) as brain
  if (lower === 'defaultmaterial' || lower === 'default') return ORGAN_MAP.brain;
  // Treat "object" / "object_13" mesh as kidney
  if (lower === 'object' || lower === 'object_13') return ORGAN_MAP.kidney;
  // Treat "object_2" mesh as liver
  if (lower === 'object_2') return ORGAN_MAP.liver;
  for (const [key, data] of Object.entries(ORGAN_MAP)) {
    if (lower.includes(key)) return data;
  }
  // Fallback: show kidney info
  return ORGAN_MAP.kidney;
}

// ── Mini organ 3-D viewer ─────────────────────────────────────────────────────
function OrganPreviewModel({ path }: { path: string }) {
  const { scene } = useGLTF(path);
  return (
    <Bounds fit clip observe margin={1.2}>
      <Center>
        <primitive object={scene} />
      </Center>
    </Bounds>
  );
}

function OrganPreview({ info }: { info: OrganInfo }) {
  if (!info.glbPath) {
    return (
      <div className="flex items-center justify-center" style={{ height: 160, background: 'rgba(0,0,0,0.4)' }}>
        <div className="w-20 h-20 rounded-full"
          style={{
            background: `radial-gradient(circle at 38% 38%, ${info.color}cc, ${info.color}44)`,
            boxShadow: `0 0 32px ${info.color}55`,
          }}
        />
      </div>
    );
  }
  return (
    <div style={{ height: 160, background: 'rgba(0,0,0,0.4)', position: 'relative' }}>
      <Canvas camera={{ position: [0, 0, 3], fov: 45 }} style={{ position: 'relative', width: '100%', height: '100%' }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[3, 3, 3]} intensity={1.2} />
        <Suspense fallback={null}>
          <OrganPreviewModel path={info.glbPath} />
          <Environment preset="city" />
        </Suspense>
        <OrbitControls enablePan={false} enableZoom={false} autoRotate autoRotateSpeed={2} />
      </Canvas>
    </div>
  );
}

// ── Organ info panel ─────────────────────────────────────────────────────────
function OrganPanel({ info, onClose }: { info: OrganInfo; onClose: () => void }) {
  return (
    <div className="absolute top-4 right-4 sm:top-6 sm:right-6 w-[calc(100vw-2rem)] max-w-68 sm:w-72 rounded-xl overflow-hidden shadow-2xl z-10"
      style={{ background: 'rgba(10,10,20,0.92)', border: '1px solid rgba(255,255,255,0.08)' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}
      >
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full" style={{ background: info.color }} />
          <span className="text-white font-semibold text-sm">{info.name}</span>
        </div>
        <button onClick={onClose} className="text-white/50 hover:text-white text-base leading-none transition-colors">×</button>
      </div>

      {/* 3-D preview */}
      <OrganPreview info={info} />

      {/* Body */}
      <div className="px-4 pb-5 pt-3">
        <p className="text-white/75 text-xs leading-relaxed mb-4 line-clamp-3">{info.description}</p>
        <ul className="space-y-1.5">
          {info.bullets.map((b) => (
            <li key={b} className="flex items-start gap-2 text-white/55 text-xs">
              <span className="mt-0.5 text-white/30">▸</span>
              {b}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// ── 3-D models ───────────────────────────────────────────────────────────────
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

function BodyModel({ onClick }: { onClick: () => void }) {
  const { scene } = useGLTF('/organs/3D.glb');
  const resolvedRef = useRef<THREE.Mesh | null>(null);
  const shellApplied = useRef(false);

  useFrame(() => {
    if (!resolvedRef.current) resolvedRef.current = findBodyMesh(scene);
    if (!resolvedRef.current) return;
    if (!shellApplied.current) {
      resolvedRef.current.material = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#e5e7eb'),
        transparent: true,
        opacity: 0.18,
        roughness: 0.2,
        metalness: 0.1,
        side: THREE.FrontSide,
        depthWrite: false,
      });
      shellApplied.current = true;
    }
  });

  return (
    <primitive
      object={scene}
      onClick={(e: ThreeEvent<MouseEvent>) => { e.stopPropagation(); onClick(); }}
    />
  );
}

function OrgansModel({ onOrganClick }: { onOrganClick: (meshName: string) => void }) {
  const { scene } = useGLTF('/organs/orhans.glb');
  const hoveredRef = useRef<THREE.Mesh | null>(null);

  // Debug: log all mesh names in the scene
  const allMeshes: string[] = [];
  scene.traverse((obj) => { if (obj instanceof THREE.Mesh) allMeshes.push(obj.name); });
  console.log('[HumanBody] all mesh names in orhans.glb:', allMeshes);

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    const mesh = e.object as THREE.Mesh;
    console.log('[HumanBody] clicked mesh name:', mesh.name, '| parent:', mesh.parent?.name);
    onOrganClick(mesh.name ?? '');
  };

  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    const mesh = e.object as THREE.Mesh;
    if (hoveredRef.current === mesh) return;
    hoveredRef.current = mesh;
    document.body.style.cursor = 'pointer';
    // Brighten hovered mesh
    if (mesh.material instanceof THREE.MeshStandardMaterial) {
      (mesh.material as THREE.MeshStandardMaterial).emissive.set('#ffffff');
      (mesh.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.15;
    }
  };

  const handlePointerOut = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    const mesh = e.object as THREE.Mesh;
    document.body.style.cursor = 'auto';
    if (mesh.material instanceof THREE.MeshStandardMaterial) {
      (mesh.material as THREE.MeshStandardMaterial).emissive.set('#000000');
      (mesh.material as THREE.MeshStandardMaterial).emissiveIntensity = 0;
    }
    hoveredRef.current = null;
  };

  return (
    <primitive
      object={scene}
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    />
  );
}

// Preload both models
useGLTF.preload('/organs/3D.glb');
useGLTF.preload('/organs/orhans.glb');

// ── Main component ────────────────────────────────────────────────────────────
export default function HumanBody() {
  const [showOrgans, setShowOrgans] = useState(false);
  const [selectedOrgan, setSelectedOrgan] = useState<OrganInfo | null>(null);
  const handleOrganClick = (meshName: string) => {
    setSelectedOrgan(resolveOrganInfo(meshName));
  };

  return (
    <section
      className="relative w-full bg-black"
      style={{ height: 'calc(100vh - 56px)', marginTop: '-1px' }}
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        style={{ position: 'relative', width: '100%', height: '100%' }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <Suspense fallback={null}>
          <Bounds fit clip observe margin={1.1}>
            <Center>
              {showOrgans ? (
                <OrgansModel onOrganClick={handleOrganClick} />
              ) : (
                <BodyModel onClick={() => setShowOrgans(true)} />
              )}
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

      {/* Back to body button */}
      {showOrgans && (
        <button
          onClick={() => { setShowOrgans(false); setSelectedOrgan(null); }}
          className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full text-xs text-white/80 hover:text-white transition-colors z-10"
          style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          Back to Body
        </button>
      )}

      {/* Organ info panel */}
      {selectedOrgan && (
        <OrganPanel info={selectedOrgan} onClose={() => setSelectedOrgan(null)} />
      )}


      {/* Bottom: title + description */}
      <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-16 right-4 sm:right-24 pointer-events-none flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-tight">
          Human Digital Twin
        </h1>
        <p className="text-xs text-white/60 leading-relaxed sm:text-right sm:max-w-xs">
          A molecule-level simulation of the human body that models how drugs are absorbed,
          distributed, metabolised, and excreted — before a single clinical trial begins.
        </p>
      </div>
    </section>
  );
}
