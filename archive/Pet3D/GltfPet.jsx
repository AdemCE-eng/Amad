/* eslint-disable react/no-unknown-property */
import React, { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';
import { SkeletonUtils } from 'three-stdlib';

// Real animal models (glTF), one per companion. Wolf/Cat are Quaternius rigs
// whose baked clips map 1:1 onto the backend animationState contract; the
// camel is a static mesh driven entirely by the procedural layer below; the
// birds hover with their flight clips. See public/models/ATTRIBUTION.md.
//
// `size` = target for the model's largest dimension in meters (pets read
// ~0.4m tall in the stage). `raw` holds each file's true rendered bounds
// (largest dimension + ground offset), measured with gltf-transform — they
// CANNOT be computed at runtime because Box3 reads skinned geometry in bind
// space, ignoring the armature scale Blender bakes into these exports.
export const PET_CONFIG = {
  falcon: { file: '/models/HawkRigged.glb', size: 0.62, raw: { max: 4.87, minY: -0.27 }, yaw: 2.0, fly: true, hover: 0.12 },
  camel: { file: '/models/Camel.glb', size: 0.6, raw: { max: 275.15, minY: -103.83 }, yaw: -1.05 },
  wolf: { file: '/models/Wolf.glb', size: 0.62, raw: { max: 5.55, minY: -0.01 }, yaw: -1.05 },
  fox: { file: '/models/Fox.glb', size: 0.6, raw: { max: 5.88, minY: 0 }, yaw: -1.05 },
  bird: { file: '/models/Bird.glb', size: 0.55, raw: { max: 100.5, minY: -13.9 }, yaw: 1.4, fly: true, hover: 0.14 },
};

Object.values(PET_CONFIG).forEach((c) => useGLTF.preload(c.file));

// Which clip suffixes serve each animation state (first match wins). Clip
// names arrive as "AnimalArmature|...|Idle" — we match on the last segment.
const STATE_CLIPS = {
  idle: ['idle'],
  eating: ['eating', 'idle_eating', 'eat'],
  happy: ['gallop', 'run', 'jump_loop'],
  sad: ['idle_headlow', 'idle_2_headlow', 'idle'],
  sick: ['death'],
};
const STATE_TIMESCALE = { idle: 1, eating: 1, happy: 1.3, sad: 0.5, sick: 1 };
// Flying models loop their single flight clip for every state, varying tempo.
const FLY_TIMESCALE = { idle: 1, eating: 0.8, happy: 1.8, sad: 0.45, sick: 0.15 };

export default function GltfPet({ petType = 'falcon', animationState = 'idle', sick = false, tapPulse = 0 }) {
  const cfg = PET_CONFIG[petType] || PET_CONFIG.falcon;
  const outer = useRef(); // procedural pivot: squish, hop, sway, lie down
  const { scene, animations } = useGLTF(cfg.file);

  // SkeletonUtils.clone keeps skinned meshes bound to their own armature copy;
  // materials are cloned too so the sick tint never leaks into the GLTF cache.
  const { model, mats } = useMemo(() => {
    const model = SkeletonUtils.clone(scene);
    const mats = [];
    model.traverse((o) => {
      if (o.isMesh) {
        o.material = o.material.clone();
        // Many glTF exports ship metallic=1; without an environment map that
        // renders pitch black under plain lights.
        o.material.metalness = 0;
        o.material.roughness = Math.min(o.material.roughness ?? 1, 0.9);
        o.castShadow = true;
        mats.push({ m: o.material, base: o.material.color.clone() });
      }
    });
    // Normalize from the measured bounds: largest dimension → cfg.size,
    // resting on y=0.
    const s = cfg.size / cfg.raw.max;
    model.scale.setScalar(s);
    model.position.set(0, -cfg.raw.minY * s, 0);
    return { model, mats };
  }, [scene, cfg]);

  const { actions } = useAnimations(animations, outer);

  // Look up actions by the last segment of their clip name.
  const bySuffix = useMemo(() => {
    const map = {};
    for (const [name, action] of Object.entries(actions)) {
      map[name.split('|').pop().trim().toLowerCase()] = action;
    }
    return map;
  }, [actions]);

  const allActions = Object.values(actions);
  const hasDeathClip = Boolean(bySuffix.death);

  // Crossfade to the clip that serves the current state.
  useEffect(() => {
    let action = null;
    for (const suffix of STATE_CLIPS[animationState] || []) {
      if (bySuffix[suffix]) { action = bySuffix[suffix]; break; }
    }
    if (!action && cfg.fly && allActions.length) action = allActions[0]; // single flight clip
    if (!action) return; // static model — procedural layer carries the state

    const dying = animationState === 'sick' && action === bySuffix.death;
    action.reset();
    if (dying) {
      action.setLoop(THREE.LoopOnce, 1);
      action.clampWhenFinished = true; // stay collapsed
    } else {
      action.setLoop(THREE.LoopRepeat, Infinity);
    }
    action.timeScale = (cfg.fly ? FLY_TIMESCALE : STATE_TIMESCALE)[animationState] ?? 1;
    action.fadeIn(0.25).play();
    return () => { action.fadeOut(0.25); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animationState, bySuffix]);

  // Sick = desaturated & dimmed, like the old 2D grayscale filter.
  useEffect(() => {
    const hsl = { h: 0, s: 0, l: 0 };
    for (const { m, base } of mats) {
      if (sick) {
        base.getHSL(hsl);
        m.color.setHSL(hsl.h, hsl.s * 0.15, hsl.l * 0.8 + 0.05);
      } else {
        m.color.copy(base);
      }
    }
  }, [sick, mats]);

  // Procedural layer: universal tap-squish + sway, hover for birds, and
  // stand-in motion (hop / breathe / lie down) for models without clips.
  const squish = useRef({ t: 10, last: tapPulse });
  const hasClips = allActions.length > 0;
  useFrame((state, dt) => {
    const g = outer.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    const d = (cur, target, lambda = 8) => THREE.MathUtils.damp(cur, target, lambda, dt);
    const happy = animationState === 'happy';
    const sad = animationState === 'sad';
    const down = animationState === 'sick';

    if (tapPulse !== squish.current.last) { squish.current.last = tapPulse; squish.current.t = 0; }
    squish.current.t += dt;
    const sq = Math.sin(Math.max(0, 1 - squish.current.t / 0.28) * Math.PI);

    // The Death clip already lays clip-animals down; others tip over manually.
    const lie = down && !hasDeathClip && !cfg.fly ? 1.15 : 0;
    g.rotation.z = d(g.rotation.z, lie, 4);
    g.rotation.x = d(g.rotation.x, down && cfg.fly ? 0.7 : sad ? 0.08 : 0, 5);
    g.rotation.y = d(g.rotation.y, cfg.yaw + (down ? 0 : Math.sin(t * 0.4) * 0.08), 4);

    const hover = cfg.fly ? (down ? 0.03 : cfg.hover + Math.sin(t * 1.6) * 0.015) : 0;
    const hop = happy && !hasClips ? Math.abs(Math.sin(t * 5)) * 0.05 : 0;
    g.position.y = d(g.position.y, hover + hop + sq * 0.05, 10);

    const breathe = hasClips ? 0 : Math.sin(t * Math.PI * (down ? 2.6 : 1.5)) * (down ? 0.008 : 0.015);
    const sy = (1 + breathe) * (1 - 0.14 * sq);
    const sxz = (1 - breathe * 0.6) * (1 + 0.09 * sq);
    g.scale.set(d(g.scale.x, sxz, 12), d(g.scale.y, sy, 12), d(g.scale.z, sxz, 12));
  });

  return (
    <group ref={outer} rotation={[0, cfg.yaw, 0]}>
      <primitive object={model} />
    </group>
  );
}
