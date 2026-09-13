import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return reduced;
}

function StarField({ reducedMotion }: { reducedMotion: boolean }) {
  const points = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const data = new Float32Array(540);
    for (let index = 0; index < 180; index += 1) {
      const radius = 11 + ((index * 47) % 90) / 10;
      const angle = index * 2.399963;
      const height = (((index * 73) % 200) / 200 - 0.5) * 12;
      data[index * 3] = Math.cos(angle) * radius;
      data[index * 3 + 1] = height;
      data[index * 3 + 2] = Math.sin(angle) * radius - 4;
    }
    return data;
  }, []);

  useFrame((_, rawDelta) => {
    if (!points.current || reducedMotion) return;
    const delta = Math.min(rawDelta, 0.05);
    points.current.rotation.y += delta * 0.006;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#d8d8d8" size={0.025} transparent opacity={0.52} sizeAttenuation />
    </points>
  );
}

function BlackHole({ reducedMotion }: { reducedMotion: boolean }) {
  const group = useRef<THREE.Group>(null);
  const disk = useRef<THREE.Mesh>(null);
  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), []);

  useFrame(({ pointer }, rawDelta) => {
    if (!group.current) return;
    const delta = Math.min(rawDelta, 0.05);
    const targetX = reducedMotion ? 0.18 : pointer.y * 0.11 + 0.18;
    const targetY = reducedMotion ? -0.35 : pointer.x * 0.16 - 0.35;
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, targetX, 2, delta);
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, targetY, 2, delta);
    if (!reducedMotion) {
      uniforms.uTime.value += delta;
      if (disk.current) disk.current.rotation.z += delta * 0.035;
    }
  });

  return (
    <group ref={group} position={[2.7, 0.1, -1.4]} rotation={[0.18, -0.35, -0.12]}>
      <mesh>
        <sphereGeometry args={[1.42, 72, 72]} />
        <meshStandardMaterial color="#010101" roughness={0.18} metalness={0.15} />
      </mesh>
      <mesh ref={disk} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.52, 3.55, 160, 8]} />
        <shaderMaterial
          transparent
          depthWrite={false}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          uniforms={uniforms}
          vertexShader={/* glsl */ `
            varying vec2 vUv;
            void main() {
              vUv = uv;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `}
          fragmentShader={/* glsl */ `
            uniform float uTime;
            varying vec2 vUv;
            void main() {
              float inner = smoothstep(0.0, 0.28, vUv.x);
              float outer = 1.0 - smoothstep(0.58, 1.0, vUv.x);
              float streak = 0.64 + 0.36 * sin(vUv.y * 95.0 + uTime * 0.8 + vUv.x * 18.0);
              float alpha = inner * outer * streak * 0.34;
              vec3 color = mix(vec3(0.18), vec3(0.9), 1.0 - vUv.x);
              gl_FragColor = vec4(color, alpha);
            }
          `}
        />
      </mesh>
      {[1.85, 2.35, 2.9].map((radius, index) => (
        <mesh key={radius} rotation={[Math.PI / 2 + index * 0.08, index * 0.13, 0]}>
          <torusGeometry args={[radius, 0.006, 4, 128]} />
          <meshBasicMaterial color="#8b8b8b" transparent opacity={0.16 - index * 0.025} />
        </mesh>
      ))}
      <pointLight color="#f2f2f2" intensity={10} distance={8} position={[-2.1, 1.1, 2.2]} />
    </group>
  );
}

function DistantPlanet({ reducedMotion }: { reducedMotion: boolean }) {
  const planet = useRef<THREE.Mesh>(null);
  useFrame((_, rawDelta) => {
    if (!planet.current || reducedMotion) return;
    planet.current.rotation.y += Math.min(rawDelta, 0.05) * 0.025;
  });

  return (
    <group position={[-4.5, 2.9, -7]}>
      <mesh ref={planet}>
        <icosahedronGeometry args={[1.05, 5]} />
        <meshStandardMaterial color="#262626" roughness={0.92} metalness={0.05} />
      </mesh>
      <mesh rotation={[1.18, 0.12, 0.15]}>
        <torusGeometry args={[1.45, 0.012, 4, 96]} />
        <meshBasicMaterial color="#8a8a8a" transparent opacity={0.18} />
      </mesh>
    </group>
  );
}

function Scene() {
  const reducedMotion = useReducedMotion();
  return (
    <>
      <fog attach="fog" args={["#020202", 10, 30]} />
      <ambientLight intensity={0.36} />
      <directionalLight position={[-5, 6, 8]} intensity={1.8} color="#ededed" />
      <StarField reducedMotion={reducedMotion} />
      <DistantPlanet reducedMotion={reducedMotion} />
      <BlackHole reducedMotion={reducedMotion} />
    </>
  );
}

export function SpaceScene() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="space-canvas-fallback" aria-hidden="true" />;

  return (
    <div className="space-canvas" aria-hidden="true">
      <Canvas camera={{ position: [0, 0, 9], fov: 52 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }}>
        <Scene />
      </Canvas>
    </div>
  );
}