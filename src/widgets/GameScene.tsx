import { Canvas, useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import type { Group } from 'three';
import { useGameStore } from '../app/store';
import { usePrefersReducedMotion } from '../shared/usePrefersReducedMotion';

function Loop() {
  const tick = useGameStore((state) => state.tick);
  useFrame((_, delta) => tick(Math.min(delta, 0.05)));
  return null;
}

function HitPlane({
  name,
  position,
  scale,
  onClick,
}: {
  name: string;
  position: [number, number, number];
  scale: [number, number, number];
  onClick: () => void;
}) {
  return (
    <mesh
      name={name}
      position={position}
      scale={scale}
      onClick={(event) => {
        event.stopPropagation();
        onClick();
      }}
      onPointerEnter={(event) => {
        event.stopPropagation();
        document.body.style.cursor = 'pointer';
      }}
      onPointerLeave={() => {
        document.body.style.cursor = 'auto';
      }}
    >
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial transparent opacity={0} depthWrite={false} />
    </mesh>
  );
}

function RainAndSteam() {
  const rain = useRef<Group>(null);
  const steam = useRef<Group>(null);
  const drops = useMemo(
    () =>
      Array.from({ length: 38 }, (_, index) => ({
        x: -4.4 + ((index * 0.53) % 8.8),
        y: -1.8 + ((index * 0.37) % 4.2),
        scale: 0.24 + ((index * 0.03) % 0.22),
      })),
    [],
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (rain.current) rain.current.position.y = -((t * 0.95) % 0.72);
    if (steam.current) {
      steam.current.position.x = Math.sin(t * 0.35) * 0.08;
      steam.current.position.y = Math.sin(t * 0.55) * 0.05;
    }
  });

  return (
    <>
      <group ref={rain} position={[0, 0, -1]}>
        {drops.map((drop, index) => (
          <mesh
            key={`${drop.x}-${drop.y}`}
            position={[drop.x, drop.y, 0]}
            rotation={[0, 0, -0.18]}
            scale={[0.012, drop.scale, 1]}
          >
            <planeGeometry args={[1, 1]} />
            <meshBasicMaterial color="#cbd5e1" transparent opacity={0.18} depthWrite={false} />
          </mesh>
        ))}
      </group>
      <group ref={steam} position={[1.72, -0.55, -0.8]}>
        {[0, 1, 2, 3, 4].map((index) => (
          <mesh key={index} position={[index * 0.18, index * 0.12, 0]} scale={[0.52 + index * 0.08, 0.3 + index * 0.08, 1]}>
            <circleGeometry args={[1, 24]} />
            <meshBasicMaterial color="#dbeafe" transparent opacity={0.045} depthWrite={false} />
          </mesh>
        ))}
      </group>
    </>
  );
}

function InteractionLayer() {
  const startCooking = useGameStore((state) => state.startCooking);
  const collectStation = useGameStore((state) => state.collectStation);
  const beginProtection = useGameStore((state) => state.beginProtection);
  const endProtection = useGameStore((state) => state.endProtection);
  const stations = useGameStore((state) => state.stations);

  const stationActions = useMemo(
    () => ({
      fryer: () => (stations.fryer.status === 'ready' ? collectStation('fryer') : startCooking('fryer')),
      grill: () => (stations.grill.status === 'ready' ? collectStation('grill') : startCooking('grill')),
      oven: () => (stations.oven.status === 'ready' ? collectStation('oven') : startCooking('oven', 'nuggets')),
      drink: () => (stations.drink.status === 'ready' ? collectStation('drink') : startCooking('drink')),
    }),
    [collectStation, startCooking, stations],
  );

  return (
    <group>
      <HitPlane name="visible-fryer-hot-zone" position={[-2.22, -1.2, 0]} scale={[1.12, 0.86, 1]} onClick={stationActions.fryer} />
      <HitPlane name="visible-grill-hot-zone" position={[-0.86, -1.18, 0]} scale={[1.04, 0.82, 1]} onClick={stationActions.grill} />
      <HitPlane name="visible-oven-hot-zone" position={[0.38, -1.05, 0]} scale={[0.96, 1.08, 1]} onClick={stationActions.oven} />
      <HitPlane name="visible-drink-hot-zone" position={[1.62, -1.1, 0]} scale={[0.96, 1.02, 1]} onClick={stationActions.drink} />
      <mesh
        name="visible-shutter-hot-zone"
        position={[3.02, -1.02, 0]}
        scale={[0.76, 0.84, 1]}
        onPointerDown={(event) => {
          event.stopPropagation();
          beginProtection();
        }}
        onPointerUp={(event) => {
          event.stopPropagation();
          endProtection();
        }}
        onPointerCancel={(event) => {
          event.stopPropagation();
          endProtection();
        }}
        onPointerLeave={() => endProtection()}
      >
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  );
}

export function GameScene() {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <Canvas
      className="interaction-canvas"
      camera={{ position: [0, 0, 6], fov: 52 }}
      gl={{ alpha: true, antialias: true }}
      onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
    >
      <Loop />
      {!prefersReducedMotion && <RainAndSteam />}
      <InteractionLayer />
    </Canvas>
  );
}
