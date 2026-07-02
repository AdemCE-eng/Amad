/* eslint-disable react/no-unknown-property */
import React from 'react';
import { usePetRig, usePalette } from './usePetRig';

// Procedural low-poly pets. Segment counts are deliberately modest (main
// spheres 20x14, details 12x8) to stay far under a mobile-web triangle budget
// with several materials but zero texture downloads. All dimensions are in
// meters (1 unit = 1m); every pet stands ~0.45m tall with its root pivot at
// bottom-center on the ground plane. Colors mirror the 2D SVG brand palette
// so the 3D hero pet and the 2D thumbnails read as the same character.

const Mat = ({ color, roughness = 0.55 }) => (
  <meshStandardMaterial color={color} roughness={roughness} metalness={0} />
);

function Eyes({ rig, y, z, spread = 0.052, r = 0.026, color = '#1e293b' }) {
  return (
    <group ref={rig.eyes} position={[0, y, z]}>
      <mesh position={[-spread, 0, 0]}>
        <sphereGeometry args={[r, 12, 8]} />
        <Mat color={color} roughness={0.25} />
      </mesh>
      <mesh position={[spread, 0, 0]}>
        <sphereGeometry args={[r, 12, 8]} />
        <Mat color={color} roughness={0.25} />
      </mesh>
    </group>
  );
}

function Feet({ color, x = 0.06, z = 0.05, r = 0.03 }) {
  return (
    <>
      <mesh position={[-x, r * 0.8, z]}>
        <sphereGeometry args={[r, 12, 8]} />
        <Mat color={color} />
      </mesh>
      <mesh position={[x, r * 0.8, z]}>
        <sphereGeometry args={[r, 12, 8]} />
        <Mat color={color} />
      </mesh>
    </>
  );
}

// ── الصقر Falcon ─────────────────────────────────────────
const FALCON = { body: '#f59e0b', face: '#fef3c7', wing: '#d97706', beak: '#ea580c', feet: '#d97706' };

export function Falcon({ animationState, sick, tapPulse }) {
  const rig = usePetRig({ animationState, tapPulse });
  const c = usePalette(FALCON, sick);
  return (
    <group name="Pet_Falcon_Root" ref={rig.root}>
      <group ref={rig.body} position={[0, 0.2, 0]}>
        <mesh scale={[1, 0.95, 0.95]}>
          <sphereGeometry args={[0.17, 20, 14]} />
          <Mat color={c.body} />
        </mesh>
        <group ref={rig.head}>
          <mesh position={[0, 0.015, 0.05]} scale={[0.95, 0.9, 0.62]}>
            <sphereGeometry args={[0.14, 20, 14]} />
            <Mat color={c.face} />
          </mesh>
          <Eyes rig={rig} y={0.05} z={0.135} />
          <mesh position={[0, -0.015, 0.15]} rotation={[Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.03, 0.06, 10]} />
            <Mat color={c.beak} roughness={0.4} />
          </mesh>
        </group>
        <group ref={rig.wingL} position={[-0.155, 0.02, 0]}>
          <mesh position={[0, -0.05, 0]} scale={[0.35, 1.15, 0.6]}>
            <sphereGeometry args={[0.085, 14, 10]} />
            <Mat color={c.wing} />
          </mesh>
        </group>
        <group ref={rig.wingR} position={[0.155, 0.02, 0]}>
          <mesh position={[0, -0.05, 0]} scale={[0.35, 1.15, 0.6]}>
            <sphereGeometry args={[0.085, 14, 10]} />
            <Mat color={c.wing} />
          </mesh>
        </group>
        <group ref={rig.tail} position={[0, -0.02, -0.15]}>
          <mesh rotation={[-1.9, 0, 0]}>
            <coneGeometry args={[0.045, 0.1, 8]} />
            <Mat color={c.wing} />
          </mesh>
        </group>
      </group>
      <Feet color={c.feet} />
    </group>
  );
}

// ── الجمل Camel ──────────────────────────────────────────
const CAMEL = { body: '#f59e0b', hump: '#d97706', leg: '#d97706', eye: '#1e293b' };

export function Camel({ animationState, sick, tapPulse }) {
  const rig = usePetRig({ animationState, tapPulse });
  const c = usePalette(CAMEL, sick);
  return (
    <group name="Pet_Camel_Root" ref={rig.root}>
      <group ref={rig.body} position={[0, 0.19, 0]}>
        <mesh scale={[1.05, 0.85, 1.25]}>
          <sphereGeometry args={[0.15, 20, 14]} />
          <Mat color={c.body} />
        </mesh>
        <mesh position={[0, 0.11, -0.06]}>
          <sphereGeometry args={[0.07, 14, 10]} />
          <Mat color={c.hump} />
        </mesh>
        <mesh position={[0, 0.11, 0.045]}>
          <sphereGeometry args={[0.07, 14, 10]} />
          <Mat color={c.hump} />
        </mesh>
        <group ref={rig.head} position={[0, 0.06, 0.14]}>
          <mesh position={[0, 0.06, 0.02]} rotation={[0.45, 0, 0]}>
            <cylinderGeometry args={[0.035, 0.045, 0.16, 12]} />
            <Mat color={c.body} />
          </mesh>
          <mesh position={[0, 0.15, 0.07]}>
            <sphereGeometry args={[0.08, 16, 12]} />
            <Mat color={c.body} />
          </mesh>
          <mesh position={[0, 0.13, 0.13]} scale={[0.8, 0.7, 1]}>
            <sphereGeometry args={[0.05, 12, 8]} />
            <Mat color={c.body} />
          </mesh>
          <Eyes rig={rig} y={0.17} z={0.125} spread={0.042} r={0.021} color={c.eye} />
          <group ref={rig.wingL} position={[-0.07, 0.2, 0.04]}>
            <mesh rotation={[0, 0, 0.5]}>
              <coneGeometry args={[0.018, 0.045, 8]} />
              <Mat color={c.hump} />
            </mesh>
          </group>
          <group ref={rig.wingR} position={[0.07, 0.2, 0.04]}>
            <mesh rotation={[0, 0, -0.5]}>
              <coneGeometry args={[0.018, 0.045, 8]} />
              <Mat color={c.hump} />
            </mesh>
          </group>
        </group>
        <group ref={rig.tail} position={[0, 0.02, -0.19]}>
          <mesh position={[0, -0.05, -0.01]} rotation={[0.35, 0, 0]}>
            <cylinderGeometry args={[0.008, 0.012, 0.11, 8]} />
            <Mat color={c.hump} />
          </mesh>
          <mesh position={[0, -0.11, -0.03]}>
            <sphereGeometry args={[0.02, 10, 8]} />
            <Mat color={c.hump} />
          </mesh>
        </group>
      </group>
      {[[-0.08, 0.08], [0.08, 0.08], [-0.08, -0.08], [0.08, -0.08]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.08, z]}>
          <cylinderGeometry args={[0.026, 0.03, 0.16, 10]} />
          <Mat color={c.leg} />
        </mesh>
      ))}
    </group>
  );
}

// ── الذئب Wolf ───────────────────────────────────────────
const WOLF = { body: '#64748b', face: '#f1f5f9', ear: '#475569', nose: '#0f172a', feet: '#475569' };

export function Wolf({ animationState, sick, tapPulse }) {
  const rig = usePetRig({ animationState, tapPulse });
  const c = usePalette(WOLF, sick);
  return (
    <group name="Pet_Wolf_Root" ref={rig.root}>
      <group ref={rig.body} position={[0, 0.2, 0]}>
        <mesh scale={[1, 0.95, 0.95]}>
          <sphereGeometry args={[0.17, 20, 14]} />
          <Mat color={c.body} />
        </mesh>
        <group ref={rig.head}>
          <mesh position={[0, -0.02, 0.07]} scale={[0.9, 0.8, 0.75]}>
            <sphereGeometry args={[0.125, 16, 12]} />
            <Mat color={c.face} />
          </mesh>
          <mesh position={[0, -0.04, 0.15]} scale={[1, 0.8, 0.9]}>
            <sphereGeometry args={[0.055, 14, 10]} />
            <Mat color={c.face} />
          </mesh>
          <mesh position={[0, -0.025, 0.195]} scale={[1.3, 0.8, 0.8]}>
            <sphereGeometry args={[0.02, 10, 8]} />
            <Mat color={c.nose} roughness={0.3} />
          </mesh>
          <Eyes rig={rig} y={0.045} z={0.135} spread={0.056} color={c.nose} />
          <group ref={rig.wingL} position={[-0.1, 0.14, 0.01]}>
            <mesh position={[0, 0.04, 0]}>
              <coneGeometry args={[0.045, 0.09, 4]} />
              <Mat color={c.ear} />
            </mesh>
          </group>
          <group ref={rig.wingR} position={[0.1, 0.14, 0.01]}>
            <mesh position={[0, 0.04, 0]}>
              <coneGeometry args={[0.045, 0.09, 4]} />
              <Mat color={c.ear} />
            </mesh>
          </group>
        </group>
        <group ref={rig.tail} position={[0, 0.02, -0.16]}>
          <mesh rotation={[-1.65, 0, 0]} scale={[0.8, 1, 1]}>
            <coneGeometry args={[0.05, 0.15, 10]} />
            <Mat color={c.ear} />
          </mesh>
        </group>
      </group>
      <Feet color={c.feet} />
    </group>
  );
}

// ── القط Cat ─────────────────────────────────────────────
const CAT = { body: '#f97316', ear: '#ea580c', nose: '#fca5a5', whisker: '#ffffff', feet: '#ea580c' };

export function Cat({ animationState, sick, tapPulse }) {
  const rig = usePetRig({ animationState, tapPulse });
  const c = usePalette(CAT, sick);
  const whisker = (side, i) => (
    <mesh
      key={`${side}${i}`}
      position={[side * 0.1, 0.005 - i * 0.014, 0.14]}
      rotation={[0, 0, side * (1.45 + i * 0.12)]}
    >
      <cylinderGeometry args={[0.0016, 0.0016, 0.09, 6]} />
      <Mat color={c.whisker} roughness={0.8} />
    </mesh>
  );
  return (
    <group name="Pet_Cat_Root" ref={rig.root}>
      <group ref={rig.body} position={[0, 0.2, 0]}>
        <mesh scale={[1, 0.95, 0.95]}>
          <sphereGeometry args={[0.17, 20, 14]} />
          <Mat color={c.body} />
        </mesh>
        <group ref={rig.head}>
          <Eyes rig={rig} y={0.045} z={0.14} spread={0.056} />
          <mesh position={[0, -0.01, 0.165]} rotation={[Math.PI, 0, 0]}>
            <coneGeometry args={[0.018, 0.022, 8]} />
            <Mat color={c.nose} roughness={0.4} />
          </mesh>
          {[0, 1, 2].map((i) => whisker(-1, i))}
          {[0, 1, 2].map((i) => whisker(1, i))}
          <group ref={rig.wingL} position={[-0.1, 0.14, 0.01]}>
            <mesh position={[0, 0.04, 0]}>
              <coneGeometry args={[0.05, 0.09, 4]} />
              <Mat color={c.ear} />
            </mesh>
          </group>
          <group ref={rig.wingR} position={[0.1, 0.14, 0.01]}>
            <mesh position={[0, 0.04, 0]}>
              <coneGeometry args={[0.05, 0.09, 4]} />
              <Mat color={c.ear} />
            </mesh>
          </group>
        </group>
        <group ref={rig.tail} position={[0.02, 0, -0.15]}>
          <mesh rotation={[0, Math.PI / 2, 0.3]}>
            <torusGeometry args={[0.1, 0.022, 8, 12, Math.PI * 0.85]} />
            <Mat color={c.ear} />
          </mesh>
        </group>
      </group>
      <Feet color={c.feet} />
    </group>
  );
}

// ── الطائر Bird ──────────────────────────────────────────
const BIRD = { body: '#38bdf8', belly: '#e0f2fe', wing: '#0ea5e9', beak: '#facc15', feet: '#facc15' };

export function Bird({ animationState, sick, tapPulse }) {
  const rig = usePetRig({ animationState, tapPulse });
  const c = usePalette(BIRD, sick);
  return (
    <group name="Pet_Bird_Root" ref={rig.root}>
      <group ref={rig.body} position={[0, 0.2, 0]}>
        <mesh scale={[1, 0.98, 0.95]}>
          <sphereGeometry args={[0.17, 20, 14]} />
          <Mat color={c.body} />
        </mesh>
        <group ref={rig.head}>
          <mesh position={[0, -0.045, 0.055]} scale={[0.85, 0.8, 0.62]}>
            <sphereGeometry args={[0.13, 16, 12]} />
            <Mat color={c.belly} />
          </mesh>
          <Eyes rig={rig} y={0.06} z={0.14} />
          <mesh position={[0, 0.005, 0.16]} rotation={[Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.028, 0.055, 10]} />
            <Mat color={c.beak} roughness={0.4} />
          </mesh>
        </group>
        <group ref={rig.wingL} position={[-0.155, 0.02, 0]}>
          <mesh position={[0, -0.05, 0]} scale={[0.35, 1.1, 0.6]}>
            <sphereGeometry args={[0.085, 14, 10]} />
            <Mat color={c.wing} />
          </mesh>
        </group>
        <group ref={rig.wingR} position={[0.155, 0.02, 0]}>
          <mesh position={[0, -0.05, 0]} scale={[0.35, 1.1, 0.6]}>
            <sphereGeometry args={[0.085, 14, 10]} />
            <Mat color={c.wing} />
          </mesh>
        </group>
        <group ref={rig.tail} position={[0, -0.03, -0.15]}>
          <mesh rotation={[-2, 0, 0]} scale={[1.4, 1, 0.5]}>
            <coneGeometry args={[0.04, 0.09, 8]} />
            <Mat color={c.wing} />
          </mesh>
        </group>
      </group>
      <Feet color={c.feet} />
    </group>
  );
}

export const PET_MODELS = { falcon: Falcon, camel: Camel, wolf: Wolf, cat: Cat, bird: Bird };
