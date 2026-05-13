"use client";

if (typeof window !== "undefined") {
  const _warn = console.warn.bind(console);
  console.warn = (...args: unknown[]) => {
    if (typeof args[0] === "string" && args[0].includes("THREE.Clock")) return;
    _warn(...args);
  };
}

import { memo, Suspense, useRef } from "react";
import { Canvas, useFrame, ThreeEvent } from "@react-three/fiber";
import { useGLTF, OrbitControls, Bounds, Center } from "@react-three/drei";
import * as THREE from "three";

type ExtractState = {
  mesh: THREE.Mesh;
  origLocalPos: THREE.Vector3;
  localDir: THREE.Vector3;
  progress: number;
  returning: boolean;
};

function findLargestMesh(scene: THREE.Object3D): THREE.Mesh | null {
  let largest: THREE.Mesh | null = null;
  let largestVol = 0;
  scene.traverse((obj) => {
    if (obj instanceof THREE.Mesh) {
      const box = new THREE.Box3().setFromObject(obj);
      const size = new THREE.Vector3();
      box.getSize(size);
      const vol = size.x * size.y * size.z;
      if (vol > largestVol) {
        largestVol = vol;
        largest = obj;
      }
    }
  });
  return largest;
}

const isSkinMesh = (mesh: THREE.Mesh): boolean => {
  const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
  return mats.some((m) => {
    const mat = m as THREE.MeshStandardMaterial;
    return mat.transparent && mat.opacity < 0.85;
  });
};

function OrgansScene() {
  const { scene } = useGLTF("/organs/3D.glb");
  const hoveredMesh = useRef<THREE.Mesh | null>(null);
  const selectedOrgan = useRef<THREE.Mesh | null>(null);
  const extracted = useRef<ExtractState | null>(null);
  const skinApplied = useRef(false);

  useFrame((_, delta) => {
    if (!skinApplied.current) {
      const skin = findLargestMesh(scene);
      if (skin) {
        skin.material = new THREE.MeshPhysicalMaterial({
          transparent: true,
          opacity: 0.18,
          roughness: 0.2,
          metalness: 0.1,
          side: THREE.FrontSide,
          depthWrite: false,
        });
        skinApplied.current = true;
      }
    }

    const state = extracted.current;
    if (!state) return;

    const speed = delta * 3;
    if (!state.returning) {
      state.progress = Math.min(1, state.progress + speed);
    } else {
      state.progress = Math.max(0, state.progress - speed);
      if (state.progress === 0) {
        state.mesh.position.copy(state.origLocalPos);
        state.mesh.scale.setScalar(1);
        extracted.current = null;
        return;
      }
    }
    const t = state.progress;
    state.mesh.position
      .copy(state.origLocalPos)
      .addScaledVector(state.localDir, t * 0.5);
    state.mesh.scale.setScalar(1 + t * 0.15);
  });

  const onPointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    const mesh = e.object as THREE.Mesh;
    if (hoveredMesh.current === mesh) return;
    if (hoveredMesh.current && hoveredMesh.current !== selectedOrgan.current) {
      const m = hoveredMesh.current.material as THREE.MeshStandardMaterial;
      if (m.emissive) {
        m.emissive.set("#000000");
        m.emissiveIntensity = 0;
      }
    }
    hoveredMesh.current = mesh;
    document.body.style.cursor = "pointer";
    if (mesh !== selectedOrgan.current) {
      const mat = mesh.material as THREE.MeshStandardMaterial;
      if (mat.emissive) {
        mat.emissive.set("#00ff44");
        mat.emissiveIntensity = 0.7;
      }
    }
  };

  const onPointerOut = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    if (hoveredMesh.current && hoveredMesh.current !== selectedOrgan.current) {
      const m = hoveredMesh.current.material as THREE.MeshStandardMaterial;
      if (m.emissive) {
        m.emissive.set("#000000");
        m.emissiveIntensity = 0;
      }
    }
    hoveredMesh.current = null;
    document.body.style.cursor = "auto";
  };

  const onClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    const mesh = e.object as THREE.Mesh;

    if (isSkinMesh(mesh)) {
      const current = extracted.current;
      if (current && current.mesh === mesh) {
        current.returning = true;
        return;
      }
      if (current) {
        current.mesh.position.copy(current.origLocalPos);
        current.mesh.scale.setScalar(1);
      }
      const worldPos = new THREE.Vector3();
      mesh.getWorldPosition(worldPos);
      const worldDir = new THREE.Vector3(worldPos.x >= 0 ? 1 : -1, 0, 0);
      const parentQuat = new THREE.Quaternion();
      if (mesh.parent) mesh.parent.getWorldQuaternion(parentQuat);
      const localDir = worldDir.clone().applyQuaternion(parentQuat.invert());
      extracted.current = {
        mesh,
        origLocalPos: mesh.position.clone(),
        localDir,
        progress: 0,
        returning: false,
      };
    } else {
      if (selectedOrgan.current && selectedOrgan.current !== mesh) {
        const prev = selectedOrgan.current.material as THREE.MeshStandardMaterial;
        if (prev.emissive) {
          prev.emissive.set("#000000");
          prev.emissiveIntensity = 0;
        }
      }
      if (selectedOrgan.current === mesh) {
        const mat = mesh.material as THREE.MeshStandardMaterial;
        if (mat.emissive) {
          mat.emissive.set("#000000");
          mat.emissiveIntensity = 0;
        }
        selectedOrgan.current = null;
        return;
      }
      selectedOrgan.current = mesh;
      const mat = mesh.material as THREE.MeshStandardMaterial;
      if (mat.emissive) {
        mat.emissive.set("#ff0000");
        mat.emissiveIntensity = 0.8;
      }
    }
  };

  return (
    <primitive
      object={scene}
      onClick={onClick}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
    />
  );
}

const BodyModel3D = memo(function BodyModel3D({
  activeOrgans: _activeOrgans,
  simulationIntensity: _simulationIntensity,
}: {
  activeOrgans: string[];
  simulationIntensity: number;
}) {
  return (
    <div className="h-105 w-full relative">
      <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <directionalLight position={[-5, 3, -3]} intensity={0.5} />
        <pointLight position={[-3, 3, 3]} color="#00e5ff" intensity={0.5} />
        <Suspense fallback={null}>
          <Bounds fit clip observe margin={1.2}>
            <Center>
              <OrgansScene />
            </Center>
          </Bounds>
        </Suspense>
        <OrbitControls enableRotate enableZoom enablePan={false} makeDefault />
      </Canvas>
    </div>
  );
});

export default BodyModel3D;
