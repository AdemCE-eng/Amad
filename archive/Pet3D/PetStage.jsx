/* eslint-disable react/no-unknown-property */
import React, { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { ContactShadows, OrbitControls, Sparkles } from '@react-three/drei';
import GltfPet from './GltfPet';

// The 3D hero stage. Renders one real animal model driven by the backend
// contract (pet.animationState for motion, pet.mood for expression/tint).
// Transparent background so it sits inside the app's circular frame.
// Interactions: tap → squish + hop, drag → orbit around the pet.
export default function PetStage({ petType = 'falcon', mood = 'neutral', animationState = 'idle', onTap }) {
  const [tapPulse, setTapPulse] = useState(0);
  const sick = mood === 'sick';
  const happy = mood === 'happy';

  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ fov: 35, position: [0, 0.35, 1.35] }}
      gl={{ alpha: true, antialias: true }}
      style={{ touchAction: 'none' }}
    >
      <ambientLight intensity={0.9} />
      <directionalLight position={[2, 3, 2]} intensity={1.4} />
      <directionalLight position={[-2, 1.5, -2]} intensity={0.45} color="#fef3c7" />

      <Suspense fallback={null}>
        <group
          onPointerDown={(e) => {
            e.stopPropagation();
            setTapPulse(Date.now());
            onTap?.();
          }}
          onPointerOver={() => (document.body.style.cursor = 'pointer')}
          onPointerOut={() => (document.body.style.cursor = 'auto')}
        >
          <GltfPet petType={petType} animationState={animationState} sick={sick} tapPulse={tapPulse} />
          {happy && (
            <Sparkles count={25} scale={[0.75, 0.55, 0.75]} position={[0, 0.32, 0]} size={3.5} speed={0.5} color="#fbbf24" />
          )}
          <ContactShadows position={[0, 0.001, 0]} opacity={0.35} scale={1.8} blur={2.4} far={0.9} />
        </group>
      </Suspense>

      <OrbitControls
        target={[0, 0.18, 0]}
        enablePan={false}
        enableZoom={false}
        minPolarAngle={Math.PI / 3.4}
        maxPolarAngle={Math.PI / 1.9}
      />
    </Canvas>
  );
}
