import { Canvas, useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { useMemo, useRef } from 'react';
import type { Group } from 'three';
import { useGameStore } from '../app/store';
import { getSceneVisualState } from '../shared/sceneVisualState';
import type { StreetPedestrianVisualState } from '../shared/sceneVisualState';

const activeCueLabels = {
  none: 'ordinary customer',
  shadowEyes: 'dark eyes',
  longArms: 'low sleeves',
  staticSmile: 'fixed smile',
} as const;

function Loop() {
  const tick = useGameStore((state) => state.tick);
  useFrame((_, delta) => tick(Math.min(delta, 0.05)));
  return null;
}

function BoxButton({
  position,
  scale,
  color,
  hover,
  onClick,
}: {
  position: [number, number, number];
  scale: [number, number, number];
  color: string;
  hover?: string;
  onClick: () => void;
}) {
  return (
    <mesh
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
      <boxGeometry />
      <meshStandardMaterial color={hover ?? color} roughness={0.72} />
    </mesh>
  );
}

function CustomerBody({ visualState }: { visualState: ReturnType<typeof getSceneVisualState> }) {
  const anomaly = visualState.threatCue !== 'none';
  const longArms = visualState.threatCue === 'longArms';
  const shadowEyes = visualState.threatCue === 'shadowEyes';
  const staticSmile = visualState.threatCue === 'staticSmile';
  const armScale: [number, number, number] = longArms ? [0.16, 1.65, 0.16] : [0.18, 0.92, 0.18];
  const eyeScale: [number, number, number] = [
    visualState.customer.eyeScale,
    visualState.customer.eyeScale,
    visualState.customer.eyeScale,
  ];

  return (
    <group position={[0, -1.45, -0.42]} scale={[1.5, 1.5, 1.5]}>
      <mesh position={[0, 1.48, -0.12]} scale={[1.22, 1.55, 0.05]}>
        <boxGeometry />
        <meshBasicMaterial color={anomaly ? '#3b0710' : '#063f3f'} transparent opacity={0.72} />
      </mesh>
      <mesh position={[0, 0.2, 0.1]} rotation={[-Math.PI / 2, 0, 0]} scale={[1.34, 0.56, 1]}>
        <circleGeometry args={[1, 24]} />
        <meshBasicMaterial color={visualState.customer.haloColor} transparent opacity={anomaly ? 0.5 : 0.3} />
      </mesh>
      <mesh position={[0, 1.05, 0]}>
        <capsuleGeometry args={[0.42, 0.72, 6, 10]} />
        <meshStandardMaterial
          color={visualState.customer.bodyColor}
          emissive={visualState.customer.bodyColor}
          emissiveIntensity={anomaly ? 0.18 : 0.1}
          roughness={0.8}
        />
      </mesh>
      <mesh position={[0, 1.78, 0]}>
        <sphereGeometry args={[0.38, 16, 12]} />
        <meshStandardMaterial color={visualState.customer.headColor} emissive="#5b341f" emissiveIntensity={0.24} roughness={0.65} />
      </mesh>
      {shadowEyes && (
        <>
          <mesh position={[-0.14, 1.84, 0.325]} scale={[0.18, 0.18, 0.18]}>
            <sphereGeometry args={[0.5, 14, 10]} />
            <meshBasicMaterial color="#f8fafc" />
          </mesh>
          <mesh position={[0.14, 1.84, 0.325]} scale={[0.18, 0.18, 0.18]}>
            <sphereGeometry args={[0.5, 14, 10]} />
            <meshBasicMaterial color="#f8fafc" />
          </mesh>
          <mesh position={[-0.14, 1.72, 0.34]} scale={[0.055, 0.32, 0.035]}>
            <boxGeometry />
            <meshBasicMaterial color="#020617" />
          </mesh>
          <mesh position={[0.14, 1.72, 0.34]} scale={[0.055, 0.32, 0.035]}>
            <boxGeometry />
            <meshBasicMaterial color="#020617" />
          </mesh>
        </>
      )}
      <mesh position={[-0.14, 1.84, 0.4]} scale={eyeScale}>
        <sphereGeometry args={[0.055, 10, 8]} />
        <meshStandardMaterial
          color={visualState.customer.eyeColor}
          emissive={visualState.customer.eyeColor}
          emissiveIntensity={visualState.customer.eyeGlow}
        />
      </mesh>
      <mesh position={[0.14, 1.84, 0.4]} scale={eyeScale}>
        <sphereGeometry args={[0.055, 10, 8]} />
        <meshStandardMaterial
          color={visualState.customer.eyeColor}
          emissive={visualState.customer.eyeColor}
          emissiveIntensity={visualState.customer.eyeGlow}
        />
      </mesh>
      <mesh position={[0, 1.66, 0.42]} scale={staticSmile ? [0.52, 0.055, 0.045] : [0.34, 0.038, 0.035]}>
        <boxGeometry />
        <meshStandardMaterial
          color={visualState.customer.smileColor}
          emissive={visualState.customer.smileColor}
          emissiveIntensity={visualState.customer.smileGlow}
        />
      </mesh>
      {staticSmile && (
        <>
          <mesh position={[-0.48, 1.66, 0.43]} scale={[0.055, 0.18, 0.04]}>
            <boxGeometry />
            <meshBasicMaterial color={visualState.customer.smileColor} />
          </mesh>
          <mesh position={[0.48, 1.66, 0.43]} scale={[0.055, 0.18, 0.04]}>
            <boxGeometry />
            <meshBasicMaterial color={visualState.customer.smileColor} />
          </mesh>
        </>
      )}
      <mesh position={longArms ? [-0.74, 0.8, 0.28] : [-0.54, 1.06, 0.12]} rotation={[0, 0, longArms ? -0.46 : 0.18]} scale={armScale}>
        <boxGeometry />
        <meshStandardMaterial
          color={visualState.customer.armColor}
          emissive={longArms ? visualState.customer.armColor : '#000000'}
          emissiveIntensity={longArms ? 0.45 : 0}
        />
      </mesh>
      <mesh position={longArms ? [0.74, 0.8, 0.28] : [0.54, 1.06, 0.12]} rotation={[0, 0, longArms ? 0.46 : -0.18]} scale={armScale}>
        <boxGeometry />
        <meshStandardMaterial
          color={visualState.customer.armColor}
          emissive={longArms ? visualState.customer.armColor : '#000000'}
          emissiveIntensity={longArms ? 0.45 : 0}
        />
      </mesh>
      {anomaly && (
        <mesh position={[0, 2.25, 0.04]} scale={[0.9, 0.05, 0.08]}>
          <boxGeometry />
          <meshStandardMaterial color={visualState.anomalyHaloColor} emissive="#ef4444" emissiveIntensity={0.65} />
        </mesh>
      )}
    </group>
  );
}

function ActiveCustomerSceneCue({ visualState }: { visualState: ReturnType<typeof getSceneVisualState> }) {
  const anomaly = visualState.threatCue !== 'none';
  const longArms = visualState.threatCue === 'longArms';
  const shadowEyes = visualState.threatCue === 'shadowEyes';
  const staticSmile = visualState.threatCue === 'staticSmile';
  const cueColor =
    visualState.threatCue === 'shadowEyes' || visualState.threatCue === 'longArms' || visualState.threatCue === 'staticSmile'
      ? visualState.cueColors[visualState.threatCue]
      : '#fde68a';

  return (
    <group position={[0, 1.04, 0.52]}>
      <mesh position={[0, -0.28, -0.08]} rotation={[-Math.PI / 2, 0, 0]} scale={[1.42, 0.34, 1]}>
        <ringGeometry args={[0.72, 0.92, 36]} />
        <meshStandardMaterial color={cueColor} emissive={cueColor} emissiveIntensity={anomaly ? 0.58 : 0.24} transparent opacity={0.72} />
      </mesh>
      <mesh position={[0, 1.72, -0.04]} scale={[1.7, 0.26, 0.08]}>
        <boxGeometry />
        <meshStandardMaterial color="#111827" emissive="#450a0a" emissiveIntensity={0.42} transparent opacity={0.86} />
      </mesh>
      <Text position={[0, 1.73, 0.04]} fontSize={0.15} color="#fff7ed" anchorX="center" anchorY="middle" maxWidth={1.52}>
        CURRENT - {activeCueLabels[visualState.threatCue]}
        <meshBasicMaterial color="#fff7ed" />
      </Text>
      <mesh position={[0, 1.46, -0.02]} scale={[0.74, 0.055, 0.055]}>
        <boxGeometry />
        <meshStandardMaterial color={cueColor} emissive={cueColor} emissiveIntensity={anomaly ? 0.78 : 0.32} />
      </mesh>
      {shadowEyes && (
        <>
          <mesh position={[-0.36, 1.25, 0.02]} scale={[0.13, 0.34, 0.045]}>
            <boxGeometry />
            <meshBasicMaterial color="#020617" />
          </mesh>
          <mesh position={[0.36, 1.25, 0.02]} scale={[0.13, 0.34, 0.045]}>
            <boxGeometry />
            <meshBasicMaterial color="#020617" />
          </mesh>
        </>
      )}
      {longArms && (
        <>
          <mesh position={[-0.62, 0.36, 0.02]} rotation={[0, 0, -0.16]} scale={[0.06, 0.72, 0.05]}>
            <boxGeometry />
            <meshStandardMaterial color={cueColor} emissive={cueColor} emissiveIntensity={0.64} />
          </mesh>
          <mesh position={[0.62, 0.36, 0.02]} rotation={[0, 0, 0.16]} scale={[0.06, 0.72, 0.05]}>
            <boxGeometry />
            <meshStandardMaterial color={cueColor} emissive={cueColor} emissiveIntensity={0.64} />
          </mesh>
        </>
      )}
      {staticSmile && (
        <mesh position={[0, 1.18, 0.03]} scale={[0.66, 0.045, 0.045]}>
          <boxGeometry />
          <meshStandardMaterial color={cueColor} emissive={cueColor} emissiveIntensity={0.9} />
        </mesh>
      )}
    </group>
  );
}

function Smoke() {
  const group = useRef<Group>(null);
  const puffs = useMemo(
    () =>
      Array.from({ length: 12 }, (_, index) => ({
        x: -3.4 + ((index * 0.67) % 6.8),
        y: 0.72 + ((index * 0.23) % 1.1),
        z: -1.85 - ((index * 0.29) % 1.45),
        scale: 0.28 + ((index * 0.07) % 0.28),
      })),
    [],
  );

  useFrame((state) => {
    if (!group.current) return;
    group.current.position.y = Math.sin(state.clock.elapsedTime * 0.55) * 0.045;
  });

  return (
    <group ref={group}>
      {puffs.map((puff, index) => (
        <mesh key={`${puff.x}-${puff.z}`} position={[puff.x, puff.y + index * 0.012, puff.z]} scale={[puff.scale * 1.8, puff.scale, puff.scale * 0.8]}>
          <sphereGeometry args={[1, 7, 5]} />
          <meshStandardMaterial color="#cbd5e1" transparent opacity={0.075} depthWrite={false} roughness={1} />
        </mesh>
      ))}
    </group>
  );
}

function StreetBackground() {
  const windows = useMemo(
    () =>
      Array.from({ length: 18 }, (_, index) => ({
        x: -4.1 + (index % 6) * 1.45,
        y: 2.05 + Math.floor(index / 6) * 0.52,
        lit: index % 3 !== 1,
      })),
    [],
  );

  return (
    <group>
      <mesh position={[-3.85, 1.8, -5.15]} scale={[1.65, 2.8, 0.12]}>
        <boxGeometry />
        <meshStandardMaterial color="#151922" roughness={0.95} />
      </mesh>
      <mesh position={[3.72, 1.85, -5.05]} scale={[1.85, 3.1, 0.12]}>
        <boxGeometry />
        <meshStandardMaterial color="#111827" roughness={0.95} />
      </mesh>
      <mesh position={[0, 1.95, -5.32]} scale={[2.9, 2.35, 0.1]}>
        <boxGeometry />
        <meshStandardMaterial color="#1f2933" roughness={0.96} />
      </mesh>
      {windows.map((window) => (
        <mesh key={`${window.x}-${window.y}`} position={[window.x, window.y, -5.22]} scale={[0.32, 0.18, 0.035]}>
          <boxGeometry />
          <meshStandardMaterial
            color={window.lit ? '#facc15' : '#334155'}
            emissive={window.lit ? '#ca8a04' : '#020617'}
            emissiveIntensity={window.lit ? 0.72 : 0.12}
            roughness={0.45}
          />
        </mesh>
      ))}
      <mesh position={[-4.25, 1.95, -3.85]} scale={[0.08, 2.25, 0.08]}>
        <boxGeometry />
        <meshStandardMaterial color="#334155" metalness={0.5} roughness={0.42} />
      </mesh>
      <mesh position={[-4.1, 3.12, -3.82]} rotation={[0, 0, -0.4]} scale={[0.48, 0.08, 0.08]}>
        <boxGeometry />
        <meshStandardMaterial color="#334155" metalness={0.4} roughness={0.5} />
      </mesh>
      <pointLight position={[-3.9, 2.95, -3.65]} intensity={0.95} color="#fef3c7" distance={4.2} />
      <mesh position={[-3.76, 2.8, -3.62]} scale={[0.26, 0.16, 0.26]}>
        <sphereGeometry args={[1, 16, 10]} />
        <meshStandardMaterial color="#fef3c7" emissive="#f59e0b" emissiveIntensity={1.35} transparent opacity={0.86} />
      </mesh>
    </group>
  );
}

function KioskLightIsland() {
  return (
    <group>
      <mesh position={[0, -0.075, -2.62]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[2.55, 48]} />
        <meshStandardMaterial color="#facc15" emissive="#b45309" emissiveIntensity={0.18} transparent opacity={0.22} roughness={0.2} />
      </mesh>
      <mesh position={[0, -0.09, -2.72]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.75, 3.15, 48]} />
        <meshStandardMaterial color="#fef3c7" emissive="#92400e" emissiveIntensity={0.15} transparent opacity={0.16} roughness={0.1} />
      </mesh>
      <mesh position={[-0.92, -0.072, -3.12]} rotation={[-Math.PI / 2, 0, -0.14]} scale={[0.42, 1.15, 1]}>
        <planeGeometry args={[1, 1]} />
        <meshStandardMaterial color="#fde68a" emissive="#f59e0b" emissiveIntensity={0.18} transparent opacity={0.2} roughness={0.12} />
      </mesh>
      <mesh position={[1.08, -0.072, -3.08]} rotation={[-Math.PI / 2, 0, 0.18]} scale={[0.52, 1.35, 1]}>
        <planeGeometry args={[1, 1]} />
        <meshStandardMaterial color="#fca5a5" emissive="#991b1b" emissiveIntensity={0.2} transparent opacity={0.18} roughness={0.14} />
      </mesh>
    </group>
  );
}

function PassingHeadlights() {
  const group = useRef<Group>(null);

  useFrame((state) => {
    if (!group.current) return;
    const loop = (state.clock.elapsedTime * 0.72) % 7.6;
    group.current.position.x = -4.2 + loop;
  });

  return (
    <group ref={group} position={[-4.2, 0.3, -4.55]}>
      <pointLight position={[0, 0.2, 0]} intensity={0.75} color="#dbeafe" distance={3.4} />
      <mesh position={[0, 0, 0]} scale={[0.58, 0.12, 0.12]}>
        <boxGeometry />
        <meshStandardMaterial color="#dbeafe" emissive="#bfdbfe" emissiveIntensity={1.1} transparent opacity={0.72} />
      </mesh>
      <mesh position={[0.42, 0, 0]} scale={[0.32, 0.08, 0.08]}>
        <boxGeometry />
        <meshStandardMaterial color="#fecaca" emissive="#991b1b" emissiveIntensity={0.85} transparent opacity={0.58} />
      </mesh>
    </group>
  );
}

function WindTrash() {
  const group = useRef<Group>(null);
  const scraps = useMemo(
    () =>
      Array.from({ length: 9 }, (_, index) => ({
        x: -3.8 + index * 0.9,
        z: -3.15 - (index % 3) * 0.34,
        color: index % 2 === 0 ? '#f8fafc' : '#f59e0b',
      })),
    [],
  );

  useFrame((state) => {
    if (!group.current) return;
    group.current.position.x = Math.sin(state.clock.elapsedTime * 0.9) * 0.22;
    group.current.rotation.y = Math.sin(state.clock.elapsedTime * 1.4) * 0.18;
  });

  return (
    <group ref={group}>
      {scraps.map((scrap, index) => (
        <mesh key={`${scrap.x}-${scrap.z}`} position={[scrap.x, 0.015, scrap.z]} rotation={[-Math.PI / 2, 0, index * 0.35]} scale={[0.18, 0.08, 0.02]}>
          <boxGeometry />
          <meshStandardMaterial color={scrap.color} emissive={scrap.color} emissiveIntensity={0.08} roughness={0.85} />
        </mesh>
      ))}
    </group>
  );
}

function PedestrianFigure({ pedestrian, index }: { pedestrian: StreetPedestrianVisualState; index: number }) {
  const group = useRef<Group>(null);
  const futureVisitor = pedestrian.futureVisitor;
  const baseZ = futureVisitor ? -2.85 + index * 0.08 : -3.65 - (index % 2) * 0.28;
  const baseX = -3.8 + index * 1.65;
  const bodyColor = pedestrian.presentation.palette;
  const hasBag = pedestrian.presentation.primaryMarker === 'backpack' || pedestrian.presentation.primaryMarker === 'shoppingBag';
  const hasCase = pedestrian.presentation.primaryMarker === 'briefcase' || pedestrian.presentation.primaryMarker === 'deliveryBox';
  const hasCane = pedestrian.presentation.primaryMarker === 'walkingCane';
  const hasCap = pedestrian.presentation.primaryMarker === 'workCap' || pedestrian.presentation.primaryMarker === 'hoodie';
  const hasChild = pedestrian.presentation.primaryMarker === 'childHand';
  const stooped = pedestrian.presentation.silhouette === 'stooped';
  const paired = pedestrian.presentation.silhouette === 'paired';

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime + index * 1.8;
    const drift = pedestrian.movementIntent === 'approachingWindow' ? Math.sin(t * 0.38) * 0.25 : ((t * 0.34 + index) % 7.6) - 3.8;
    group.current.position.x = pedestrian.movementIntent === 'approachingWindow' ? 1.35 + drift : drift;
    group.current.position.y = Math.sin(t * 3.2) * 0.018;
    group.current.rotation.z = Math.sin(t * 2.2) * 0.035;
  });

  return (
    <group
      ref={group}
      position={[baseX, 0, baseZ]}
      scale={futureVisitor ? [0.72, 0.72, 0.72] : [0.5, 0.5, 0.5]}
      rotation={[0, 0, stooped ? -0.12 : 0]}
    >
      <mesh position={[0, paired ? 0.64 : 0.68, 0]}>
        <capsuleGeometry args={[0.16, 0.46, 5, 8]} />
        <meshStandardMaterial color={bodyColor} emissive={futureVisitor ? bodyColor : '#000000'} emissiveIntensity={futureVisitor ? 0.12 : 0} roughness={0.84} />
      </mesh>
      <mesh position={[0, 1.08, 0]}>
        <sphereGeometry args={[0.16, 12, 8]} />
        <meshStandardMaterial color="#d7b08b" roughness={0.7} />
      </mesh>
      {hasCap && (
        <mesh position={[0, 1.23, 0.02]} scale={[0.24, 0.055, 0.18]}>
          <boxGeometry />
          <meshStandardMaterial color={pedestrian.presentation.primaryMarker === 'hoodie' ? '#155e75' : '#facc15'} emissive="#111827" emissiveIntensity={0.08} />
        </mesh>
      )}
      <mesh position={[-0.2, 0.62, 0]} rotation={[0, 0, 0.18]} scale={[0.055, 0.38, 0.055]}>
        <boxGeometry />
        <meshStandardMaterial color={bodyColor} roughness={0.82} />
      </mesh>
      <mesh position={[0.2, 0.62, 0]} rotation={[0, 0, -0.18]} scale={[0.055, 0.38, 0.055]}>
        <boxGeometry />
        <meshStandardMaterial color={bodyColor} roughness={0.82} />
      </mesh>
      {hasBag && (
        <mesh position={[-0.24, 0.72, 0.08]} scale={[0.16, 0.22, 0.08]}>
          <boxGeometry />
          <meshStandardMaterial color={pedestrian.presentation.primaryMarker === 'backpack' ? '#1e3a8a' : '#facc15'} roughness={0.78} />
        </mesh>
      )}
      {hasCase && (
        <mesh position={[0.3, 0.42, 0.08]} scale={[0.2, 0.13, 0.08]}>
          <boxGeometry />
          <meshStandardMaterial color={pedestrian.presentation.primaryMarker === 'deliveryBox' ? '#fbbf24' : '#111827'} roughness={0.82} />
        </mesh>
      )}
      {hasCane && (
        <mesh position={[0.3, 0.3, 0.08]} rotation={[0, 0, -0.16]} scale={[0.025, 0.48, 0.025]}>
          <boxGeometry />
          <meshStandardMaterial color="#d6d3d1" roughness={0.7} />
        </mesh>
      )}
      {hasChild && (
        <group position={[0.34, -0.06, 0.02]} scale={[0.62, 0.62, 0.62]}>
          <mesh position={[0, 0.58, 0]} scale={[0.7, 0.78, 0.7]}>
            <capsuleGeometry args={[0.12, 0.3, 5, 8]} />
            <meshStandardMaterial color="#facc15" roughness={0.82} />
          </mesh>
          <mesh position={[0, 0.88, 0]}>
            <sphereGeometry args={[0.11, 10, 8]} />
            <meshStandardMaterial color="#d7b08b" roughness={0.7} />
          </mesh>
        </group>
      )}
      {futureVisitor && (
        <mesh position={[0, 0.08, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[0.42, 0.22, 1]}>
          <circleGeometry args={[1, 20]} />
          <meshStandardMaterial color="#fde68a" emissive="#f59e0b" emissiveIntensity={0.12} transparent opacity={0.32} />
        </mesh>
      )}
    </group>
  );
}

function StreetPedestrians({ pedestrians }: { pedestrians: StreetPedestrianVisualState[] }) {
  return (
    <group>
      {pedestrians.slice(0, 8).map((pedestrian, index) => (
        <PedestrianFigure key={`${pedestrian.archetype}-${pedestrian.movementIntent}-${index}`} pedestrian={pedestrian} index={index} />
      ))}
    </group>
  );
}

function Kitchen() {
  const currentCustomer = useGameStore((state) => state.currentCustomer);
  const shutterClosed = useGameStore((state) => state.shutterClosed);
  const phase = useGameStore((state) => state.phase);
  const preShiftStreet = useGameStore((state) => state.preShiftStreet);
  const startCooking = useGameStore((state) => state.startCooking);
  const collectStation = useGameStore((state) => state.collectStation);
  const beginProtection = useGameStore((state) => state.beginProtection);
  const endProtection = useGameStore((state) => state.endProtection);
  const stations = useGameStore((state) => state.stations);
  const holdProgress = useGameStore((state) => state.holdProgress);
  const visualState = getSceneVisualState({
    anomalyKind: currentCustomer?.anomalyKind ?? 'normal',
    shutterClosed,
    holdProgress,
    phase,
    customerStreet: currentCustomer?.street ?? null,
  });

  const stationActions = useMemo(
    () => ({
      fryer: () => (stations.fryer.status === 'ready' ? collectStation('fryer') : startCooking('fryer')),
      grill: () => (stations.grill.status === 'ready' ? collectStation('grill') : startCooking('grill')),
      oven: () => (stations.oven.status === 'ready' ? collectStation('oven') : startCooking('oven', 'nuggets')),
      drink: () => (stations.drink.status === 'ready' ? collectStation('drink') : startCooking('drink')),
    }),
    [collectStation, startCooking, stations],
  );

  const rain = useMemo(
    () =>
      Array.from({ length: 34 }, (_, index) => ({
        x: -4 + ((index * 0.73) % 8),
        y: 0.7 + ((index * 0.31) % 2.4),
        z: -3.65 - ((index * 0.17) % 0.8),
      })),
    [],
  );

  return (
    <group>
      <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[9, 7]} />
        <meshStandardMaterial color="#232526" roughness={0.92} />
      </mesh>
      <mesh position={[0, -0.08, -3.9]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[9, 4]} />
        <meshStandardMaterial color="#0b1014" roughness={0.18} metalness={0.36} />
      </mesh>
      <mesh position={[-1.8, -0.06, -3.9]} rotation={[-Math.PI / 2, 0, -0.14]}>
        <planeGeometry args={[0.06, 5.2]} />
        <meshStandardMaterial color="#f8fafc" emissive="#334155" roughness={0.2} />
      </mesh>
      <mesh position={[1.9, -0.06, -3.95]} rotation={[-Math.PI / 2, 0, 0.12]}>
        <planeGeometry args={[0.05, 4.6]} />
        <meshStandardMaterial color="#fca5a5" emissive="#7f1d1d" roughness={0.2} />
      </mesh>
      <mesh position={[0, 2.2, -3.05]} scale={[8.8, 3.8, 0.18]}>
        <boxGeometry />
        <meshStandardMaterial color="#9a9384" roughness={0.9} />
      </mesh>
      <mesh position={[0, 1.52, -2.86]} scale={[3.25, 1.45, 0.12]}>
        <boxGeometry />
        <meshStandardMaterial color="#111827" roughness={0.35} metalness={0.2} transparent opacity={0.82} />
      </mesh>
      <Text position={[0, 2.64, -2.78]} fontSize={0.45} color="#fff7ed" anchorX="center" anchorY="middle">
        KFS
        <meshStandardMaterial color="#fff7ed" emissive="#dc2626" emissiveIntensity={0.8} />
      </Text>
      <mesh position={[0, 2.64, -2.9]} scale={[1.55, 0.5, 0.08]}>
        <boxGeometry />
        <meshStandardMaterial color="#7f1d1d" emissive="#450a0a" emissiveIntensity={0.65} roughness={0.6} />
      </mesh>
      {rain.map((drop) => (
        <mesh key={`${drop.x}-${drop.y}`} position={[drop.x, drop.y, drop.z]} rotation={[0.35, 0, -0.25]} scale={[0.018, 0.46, 0.018]}>
          <boxGeometry />
          <meshStandardMaterial color="#94a3b8" emissive="#1e293b" transparent opacity={0.58} />
        </mesh>
      ))}
      <mesh position={[0, 0.95, -3.45]} scale={[7, 1.4, 0.04]}>
        <boxGeometry />
        <meshStandardMaterial color="#cbd5e1" transparent opacity={0.08} />
      </mesh>
      <mesh position={[0, 0.55, -1.35]} scale={[5.4, 0.48, 1.15]}>
        <boxGeometry />
        <meshStandardMaterial color="#b91c1c" roughness={0.78} />
      </mesh>
      <mesh position={[0, 0.91, -1.05]} scale={[5.8, 0.16, 1.22]}>
        <boxGeometry />
        <meshStandardMaterial color="#f8fafc" roughness={0.45} metalness={0.25} />
      </mesh>

      <Smoke />
      <StreetBackground />
      <KioskLightIsland />
      <PassingHeadlights />
      <WindTrash />
      {(phase === 'menu' || phase === 'paused' || phase === 'playing') && (
        <StreetPedestrians pedestrians={phase === 'menu' ? preShiftStreet.pedestrians : visualState.street.pedestrians} />
      )}

      {currentCustomer && visualState.customerVisible && (
        <>
          <CustomerBody visualState={visualState} />
          <ActiveCustomerSceneCue visualState={visualState} />
        </>
      )}
      {visualState.shutter.opacity > 0 && (
        <mesh position={[0, 1.55, 0.08]} scale={[3.55, 1.75, 0.2]}>
          <boxGeometry />
          <meshStandardMaterial
            color={visualState.shutter.color}
            emissive={visualState.shutter.glowColor}
            emissiveIntensity={shutterClosed ? 0.45 : 0.16}
            metalness={0.8}
            roughness={0.32}
            transparent
            opacity={visualState.shutter.opacity}
          />
        </mesh>
      )}
      {visualState.shutter.blocksCustomer &&
        [-1.25, -0.42, 0.42, 1.25].map((x) => (
          <mesh key={x} position={[x, 1.55, 0.32]} scale={[0.08, 1.82, 0.08]}>
            <boxGeometry />
            <meshStandardMaterial color={visualState.shutter.stripeColor} emissive="#7f1d1d" emissiveIntensity={0.5} />
          </mesh>
        ))}

      <BoxButton position={[-2.8, 0.58, 0.6]} scale={[1.05, 0.38, 0.88]} color="#d97706" onClick={stationActions.fryer} />
      <BoxButton position={[-1.18, 0.58, 0.63]} scale={[1.05, 0.38, 0.88]} color="#111827" onClick={stationActions.grill} />
      <BoxButton position={[0.52, 0.72, 0.62]} scale={[0.78, 0.9, 0.58]} color="#334155" onClick={stationActions.oven} />
      <BoxButton position={[1.55, 0.72, 0.62]} scale={[0.78, 0.9, 0.58]} color="#2563eb" onClick={stationActions.drink} />
      <BoxButton position={[2.75, 0.78, 0.58]} scale={[0.72, 0.3, 0.72]} color="#e11d48" onClick={() => undefined} />
      <mesh
        position={[2.75, 1.02, 0.58]}
        scale={[0.42, 0.16, 0.42]}
        onPointerDown={(event) => {
          event.stopPropagation();
          beginProtection();
        }}
        onPointerUp={(event) => {
          event.stopPropagation();
          endProtection();
        }}
        onPointerLeave={endProtection}
      >
        <cylinderGeometry args={[0.5, 0.5, 0.4, 24]} />
        <meshStandardMaterial color="#ff1f2d" emissive="#7f1d1d" roughness={0.5} />
      </mesh>
    </group>
  );
}

export function GameScene() {
  return (
    <Canvas camera={{ position: [0, 3.6, 5.6], fov: 45 }} shadows>
      <color attach="background" args={['#090b0d']} />
      <fog attach="fog" args={['#090b0d', 3.4, 8.2]} />
      <ambientLight intensity={0.24} />
      <directionalLight position={[4, 7, 4]} intensity={0.56} />
      <pointLight position={[0, 2.5, 0.8]} intensity={1.45} color="#fff2c4" />
      <pointLight position={[-3.2, 2.2, -3.5]} intensity={1.2} color="#ef4444" />
      <pointLight position={[3.1, 1.2, -3.8]} intensity={0.8} color="#38bdf8" />
      <Loop />
      <Kitchen />
    </Canvas>
  );
}
