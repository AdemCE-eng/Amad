/* eslint-disable react/no-unknown-property */
import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { ContactShadows, OrbitControls, Sparkles } from '@react-three/drei';
import { PET_MODELS } from './models';

// The 3D hero stage. Renders one pet driven by the backend contract
// (pet.animationState for motion, pet.mood for expression/desaturation).
// Transparent background so it sits inside the app's circular frame.
// Interactions: tap → squish + hop, cursor → head tracking (in the rig),
// drag → orbit around the pet.
export default function PetStage({ petType = 'falcon', mood = 'neutral', animationState = 'idle', onTap }) {
  const Model = PET_MODELS[petType] || PET_MODELS.falcon;
  const [tapPulse, setTapPulse] = useState(0);
  const sick = mood === 'sick';
  const happy = mood === 'happy';

  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ fov: 35, position: [0, 0.34, 1.25] }}
      gl={{ alpha: true, antialias: true }}
      style={{ touchAction: 'none' }}
    >
      <ambientLight intensity={0.85} />
      <directionalLight position={[2, 3, 2]} intensity={1.4} />
      <directionalLight position={[-2, 1.5, -2]} intensity={0.4} color="#fef3c7" />

      <group
        position={[0, -0.2, 0]}
        onPointerDown={(e) => {
          e.stopPropagation();
          setTapPulse(Date.now());
          onTap?.();
        }}
        onPointerOver={() => (document.body.style.cursor = 'pointer')}
        onPointerOut={() => (document.body.style.cursor = 'auto')}
      >
        <Model animationState={animationState} sick={sick} tapPulse={tapPulse} />
        {happy && (
          <Sparkles count={25} scale={[0.7, 0.55, 0.7]} position={[0, 0.3, 0]} size={3.5} speed={0.5} color="#fbbf24" />
        )}
        <ContactShadows position={[0, 0.001, 0]} opacity={0.35} scale={1.6} blur={2.4} far={0.8} />
      </group>

      <OrbitControls
        target={[0, 0.05, 0]}
        enablePan={false}
        enableZoom={false}
        minPolarAngle={Math.PI / 3.4}
        maxPolarAngle={Math.PI / 1.9}
      />
    </Canvas>
  );
}
