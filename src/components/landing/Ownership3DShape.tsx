'use client';

import { Canvas } from '@react-three/fiber';
import { RoundedBox, OrbitControls } from '@react-three/drei';

export type ShapeType = 'cube' | 'icosahedron' | 'disc' | 'knot';

const BLUE = '#2563EB';

function Shape({ type }: { type: ShapeType }) {
  if (type === 'cube') {
    return (
      <group rotation={[-0.4, -0.6, 0.1]}>
        <RoundedBox args={[2.2, 2.2, 2.2]} radius={0.32} smoothness={6}>
          <meshStandardMaterial color={BLUE} roughness={0.25} metalness={0.05} />
        </RoundedBox>
      </group>
    );
  }

  if (type === 'icosahedron') {
    return (
      <group rotation={[0.2, 0.3, 0.1]}>
        <mesh>
          <icosahedronGeometry args={[1.65, 0]} />
          <meshStandardMaterial color={BLUE} roughness={0.3} metalness={0.05} flatShading />
        </mesh>
      </group>
    );
  }

  if (type === 'disc') {
    return (
      <group rotation={[0.55, 0.2, 0.3]}>
        <mesh>
          <cylinderGeometry args={[1.75, 1.75, 0.42, 64]} />
          <meshStandardMaterial color={BLUE} roughness={0.25} metalness={0.05} />
        </mesh>
      </group>
    );
  }

  // p=3, q=5 → elegant star knot
  return (
    <group rotation={[0.4, 0.3, 0]}>
      <mesh>
        <torusKnotGeometry args={[0.85, 0.28, 300, 32, 3, 5]} />
        <meshStandardMaterial color={BLUE} roughness={0.2} metalness={0.1} />
      </mesh>
    </group>
  );
}

export default function Ownership3DShape({ type }: { type: ShapeType }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 42 }}
      style={{ width: '100%', height: '100%', cursor: 'grab' }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 2]}
    >
      <ambientLight intensity={0.7} />
      <directionalLight position={[4, 6, 5]} intensity={1.4} />
      <directionalLight position={[-3, -2, -4]} intensity={0.25} color="#8ab4ff" />
      <Shape type={type} />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={1.5}
      />
    </Canvas>
  );
}
