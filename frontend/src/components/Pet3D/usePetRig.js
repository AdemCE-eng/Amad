import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Shared animation rig for every pet model. Models attach these refs to their
// group hierarchy and the rig drives them from the backend's `animationState`
// (idle | happy | sad | eating | sick — see docs/DATA_MODEL.md). Pivots follow
// the convention: `root` sits at bottom-center on the ground plane (y = 0), so
// lying down / hopping never sinks the pet through the floor shadow.
export function usePetRig({ animationState = 'idle', tapPulse = 0 }) {
  const root = useRef();  // ground pivot — hop, sway, lie down when sick
  const body = useRef();  // breathing squash & stretch
  const head = useRef();  // pointer look-at, sad droop, eating peck
  const wingL = useRef(); // wings (birds) or ears (cat/wolf/camel)
  const wingR = useRef();
  const tail = useRef();  // wag when happy, hang when sad
  const eyes = useRef();  // blink via scale.y

  const squish = useRef({ t: 10, last: tapPulse });
  const blinkSeed = useMemo(() => Math.random() * 100, []);

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    const d = (cur, target, lambda = 8) => THREE.MathUtils.damp(cur, target, lambda, dt);
    const sick = animationState === 'sick';
    const sad = animationState === 'sad';
    const happy = animationState === 'happy';
    const eating = animationState === 'eating';

    // Tap squish: a 0→1→0 pulse over ~0.28s after each tapPulse change.
    if (tapPulse !== squish.current.last) {
      squish.current.last = tapPulse;
      squish.current.t = 0;
    }
    squish.current.t += dt;
    const sq = Math.sin(Math.max(0, 1 - squish.current.t / 0.28) * Math.PI);

    if (root.current) {
      root.current.rotation.z = d(root.current.rotation.z, sick ? 1.1 : 0, 4);
      const hop = happy ? Math.abs(Math.sin(t * 5.2)) * 0.05 : 0;
      root.current.position.y = d(root.current.position.y, (sick ? 0.02 : 0) + hop + sq * 0.04, 10);
      root.current.rotation.y = d(root.current.rotation.y, sick ? 0 : Math.sin(t * 0.4) * 0.06, 4);
    }

    if (body.current) {
      const amp = sick ? 0.012 : sad ? 0.015 : happy ? 0.03 : 0.02;
      const hz = sick ? 1.4 : sad ? 0.5 : happy ? 1.6 : 0.75; // sick = shallow rapid breaths
      const br = Math.sin(t * Math.PI * 2 * hz) * amp;
      const sy = (1 + br) * (sad ? 0.95 : 1) * (1 - 0.16 * sq);
      const sxz = (1 - br * 0.6) * (1 + 0.1 * sq);
      body.current.scale.set(d(body.current.scale.x, sxz, 12), d(body.current.scale.y, sy, 12), d(body.current.scale.z, sxz, 12));
      body.current.rotation.x = d(body.current.rotation.x, eating ? 0.1 : 0, 6);
    }

    if (head.current) {
      const p = state.pointer; // head follows the cursor/finger unless knocked out
      const peck = eating ? 0.26 + Math.sin(t * 6.5) * 0.2 : 0;
      const bob = happy ? Math.sin(t * 5.2) * 0.07 : 0;
      head.current.rotation.x = d(head.current.rotation.x, (sick ? 0 : -p.y * 0.18) + (sad ? 0.3 : 0) + peck + bob, 7);
      head.current.rotation.y = d(head.current.rotation.y, sick ? 0 : p.x * 0.35, 7);
    }

    const droop = sad ? 0.5 : 0.15;
    const flap = happy ? Math.sin(t * 10) * 0.45 : Math.sin(t * 1.2) * 0.05;
    if (wingL.current) wingL.current.rotation.z = d(wingL.current.rotation.z, droop + flap, 9);
    if (wingR.current) wingR.current.rotation.z = d(wingR.current.rotation.z, -(droop + flap), 9);

    if (tail.current) {
      const wag = happy ? Math.sin(t * 8) * 0.5 : sick ? 0 : Math.sin(t * 1.4) * 0.13;
      tail.current.rotation.y = d(tail.current.rotation.y, wag, 8);
      tail.current.rotation.z = d(tail.current.rotation.z, sad ? -0.3 : 0, 6);
    }

    if (eyes.current) {
      const closed = (t + blinkSeed) % 3.4 < 0.11;
      eyes.current.scale.y = sick ? d(eyes.current.scale.y, 0.35, 10) : closed ? 0.08 : d(eyes.current.scale.y, 1, 24);
    }
  });

  return { root, body, head, wingL, wingR, tail, eyes };
}

// Desaturate a palette toward gray when the pet is sick — same visual language
// as the old 2D `grayscale` CSS filter, but per-material.
export function usePalette(palette, sick) {
  return useMemo(() => {
    if (!sick) return palette;
    const out = {};
    for (const key of Object.keys(palette)) {
      const c = new THREE.Color(palette[key]);
      const hsl = { h: 0, s: 0, l: 0 };
      c.getHSL(hsl);
      c.setHSL(hsl.h, hsl.s * 0.22, hsl.l * 0.9 + 0.05);
      out[key] = '#' + c.getHexString();
    }
    return out;
  }, [palette, sick]);
}
