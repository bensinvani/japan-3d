"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useScrollStore } from "@/lib/store";

// A soft sakura-petal sprite drawn once to a canvas texture (no asset to load).
function makePetalTexture() {
  const s = 64;
  const c = document.createElement("canvas");
  c.width = c.height = s;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(s * 0.5, s * 0.34, 1, s * 0.5, s * 0.52, s * 0.52);
  g.addColorStop(0, "rgba(255,231,239,1)");
  g.addColorStop(0.55, "rgba(246,178,200,0.95)");
  g.addColorStop(1, "rgba(233,138,166,0)");
  ctx.fillStyle = g;
  // teardrop petal with a soft notch at the tip
  ctx.beginPath();
  ctx.moveTo(s * 0.5, s * 0.08);
  ctx.bezierCurveTo(s * 0.93, s * 0.3, s * 0.84, s * 0.88, s * 0.5, s * 0.97);
  ctx.bezierCurveTo(s * 0.16, s * 0.88, s * 0.07, s * 0.3, s * 0.5, s * 0.08);
  ctx.closePath();
  ctx.fill();
  ctx.globalCompositeOperation = "destination-out";
  ctx.beginPath();
  ctx.ellipse(s * 0.5, s * 0.99, s * 0.12, s * 0.16, 0, 0, Math.PI * 2);
  ctx.fill();
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

type Petal = {
  x: number; y: number; z: number;
  rx: number; ry: number; rz: number;
  speed: number; drift: number; spin: number;
  scale: number; phase: number;
};

function Petals({ count, reduce }: { count: number; reduce: boolean }) {
  const mesh = useRef<THREE.InstancedMesh>(null!);
  const tex = useMemo(makePetalTexture, []);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const gust = useRef(0);

  const data = useMemo<Petal[]>(
    () =>
      Array.from({ length: count }, () => ({
        x: THREE.MathUtils.randFloatSpread(26),
        y: THREE.MathUtils.randFloat(-9, 15),
        z: THREE.MathUtils.randFloat(-7, 5),
        rx: Math.random() * Math.PI,
        ry: Math.random() * Math.PI,
        rz: Math.random() * Math.PI,
        speed: THREE.MathUtils.randFloat(0.5, 1.35),
        drift: THREE.MathUtils.randFloat(0.2, 0.85),
        spin: THREE.MathUtils.randFloat(0.3, 1.2) * (Math.random() < 0.5 ? -1 : 1),
        scale: THREE.MathUtils.randFloat(0.13, 0.36),
        phase: Math.random() * Math.PI * 2,
      })),
    [count]
  );

  useFrame((state, delta) => {
    if (!mesh.current) return;
    const t = state.clock.elapsedTime;
    delta = Math.min(delta, 0.05);

    // ease the wind gust toward |scroll velocity|
    const v = Math.min(Math.abs(useScrollStore.getState().velocity) / 14, 1.6);
    gust.current += (v - gust.current) * Math.min(delta * 4, 1);
    const g = reduce ? 0 : gust.current;

    for (let i = 0; i < count; i++) {
      const p = data[i];
      if (!reduce) {
        p.y -= p.speed * delta * (1 + g * 1.6);
        p.x += (Math.sin(t * p.drift + p.phase) * 0.6 + g * 0.9) * delta;
        if (p.y < -9) {
          p.y = 15;
          p.x = THREE.MathUtils.randFloatSpread(26);
        }
      }
      dummy.position.set(p.x, p.y, p.z);
      dummy.rotation.set(
        p.rx + t * p.spin * 0.4 * (reduce ? 0 : 1),
        p.ry + t * p.spin * 0.5 * (reduce ? 0 : 1),
        p.rz + t * p.spin * 0.3 * (reduce ? 0 : 1)
      );
      dummy.scale.setScalar(p.scale);
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
    }
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={mesh}
      args={[undefined, undefined, count]}
      frustumCulled={false}
    >
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial
        map={tex}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
        opacity={0.92}
        toneMapped={false}
      />
    </instancedMesh>
  );
}

export default function PetalField({
  count = 360,
  reduce = false,
  dpr = 1.5,
  active = true,
}: {
  count?: number;
  reduce?: boolean;
  dpr?: number;
  /** When false the render loop freezes entirely (no RAF) — the perf win off-scene. */
  active?: boolean;
}) {
  return (
    <Canvas
      // freeze the loop when the petals aren't on a frame scene
      frameloop={active ? "always" : "never"}
      dpr={[1, dpr]}
      // soft sprites get nothing from MSAA — skip it for a real GPU saving
      gl={{ antialias: false, powerPreference: "high-performance", alpha: true }}
      camera={{ position: [0, 0, 13], fov: 52 }}
    >
      <Petals count={count} reduce={reduce} />
    </Canvas>
  );
}
