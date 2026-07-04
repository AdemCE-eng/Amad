// <stdin>
import React2 from "react";
import { renderToStaticMarkup } from "react-dom/server";

// src/components/mascot/Mascot.jsx
import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useTransform } from "motion/react";

// src/components/mascot/emotions.js
var EMOTIONS = {
  idle: { brow: { rot: 0, y: 0 }, lid: 0, mouth: "smileSoft", cheeks: 0, headTilt: 0, body: "breathe", fx: null, sat: 1 },
  happy: { brow: { rot: -10, y: -3 }, lid: 0, mouth: "smileOpen", cheeks: 0.55, headTilt: 4, body: "bounce", fx: "sparkle", sat: 1 },
  celebrating: { brow: { rot: -14, y: -5 }, lid: 0, mouth: "grin", cheeks: 0.7, headTilt: 0, body: "hop", fx: "sparkle", sat: 1 },
  eating: { brow: { rot: -6, y: -2 }, lid: 0.1, mouth: "smileOpen", cheeks: 0.4, headTilt: -3, body: "breathe", fx: "crumbs", sat: 1 },
  sad: { brow: { rot: 18, y: 2 }, lid: 0.25, mouth: "frown", cheeks: 0, headTilt: -6, body: "droop", fx: null, sat: 0.9 },
  crying: { brow: { rot: 22, y: 3 }, lid: 0.35, mouth: "frownOpen", cheeks: 0, headTilt: -8, body: "droop", fx: "tears", sat: 0.85 },
  sick: { brow: { rot: 10, y: 4 }, lid: 0.6, mouth: "wavy", cheeks: 0, headTilt: -10, body: "sway", fx: "swirl", sat: 0.45 },
  sleeping: { brow: { rot: 0, y: 2 }, lid: 1, mouth: "smileSoft", cheeks: 0, headTilt: 8, body: "slowBreathe", fx: "zzz", sat: 0.95 }
};

// src/components/mascot/springs.js
var springs = {
  gentle: { type: "spring", stiffness: 60, damping: 14 },
  // emotion morphs: brows, lids, tilt
  pose: { type: "spring", stiffness: 140, damping: 15 },
  // body position (hop/droop)
  snappy: { type: "spring", stiffness: 420, damping: 24 },
  // tap squish, mouth swaps
  slow: { type: "spring", stiffness: 30, damping: 10 }
  // evolution morph
};

// src/components/mascot/Mascot.jsx
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var C = {
  body: "#F5B841",
  belly: "#FDEBC8",
  wing: "#E8A62E",
  beakTop: "#E8833A",
  beakBottom: "#D96F2B",
  mouthInner: "#8C3A1D",
  brow: "#7A4E1D",
  eye: "#2B1E12",
  blush: "#F48FB1",
  feet: "#E8833A",
  shell: "#FDF6E3",
  shellEdge: "#E8D9B5"
};
function Pivot({ x, y, children, ...motionProps }) {
  return /* @__PURE__ */ jsx("g", { transform: `translate(${x} ${y})`, children: /* @__PURE__ */ jsx(motion.g, { initial: false, ...motionProps, children: /* @__PURE__ */ jsx("g", { transform: `translate(${-x} ${-y})`, children }) }) });
}
var BEAK_VARIANTS = {
  smileSoft: /* @__PURE__ */ jsx("path", { d: "M110,126 Q120,133 130,126", fill: "none", stroke: C.beakBottom, strokeWidth: "4", strokeLinecap: "round" }),
  smileOpen: /* @__PURE__ */ jsxs("g", { children: [
    /* @__PURE__ */ jsx("path", { d: "M107,123 Q120,142 133,123 Z", fill: C.mouthInner }),
    /* @__PURE__ */ jsx("path", { d: "M107,123 Q120,142 133,123", fill: "none", stroke: C.beakBottom, strokeWidth: "3", strokeLinecap: "round" })
  ] }),
  grin: /* @__PURE__ */ jsxs("g", { children: [
    /* @__PURE__ */ jsx("path", { d: "M104,122 Q120,148 136,122 Z", fill: C.mouthInner }),
    /* @__PURE__ */ jsx("ellipse", { cx: "120", cy: "136", rx: "7", ry: "4", fill: C.blush })
  ] }),
  frown: /* @__PURE__ */ jsx("path", { d: "M111,132 Q120,124 129,132", fill: "none", stroke: C.beakBottom, strokeWidth: "4", strokeLinecap: "round" }),
  frownOpen: /* @__PURE__ */ jsx("g", { className: "anim-wobble", children: /* @__PURE__ */ jsx("path", { d: "M109,128 Q120,121 131,128 Q120,141 109,128 Z", fill: C.mouthInner }) }),
  wavy: /* @__PURE__ */ jsx("path", { d: "M108,130 q6,-5 12,0 q6,5 12,0", fill: "none", stroke: C.beakBottom, strokeWidth: "4", strokeLinecap: "round" })
};
var BODY_LOOP_CLASS = {
  breathe: "anim-breathe-soft",
  slowBreathe: "anim-breathe-slow",
  bounce: "anim-bounce",
  hop: "anim-hop",
  droop: "",
  sway: "anim-sway"
};
function Eye({ cx, lid, blinking }) {
  const closed = blinking ? 1 : lid;
  return /* @__PURE__ */ jsxs("g", { children: [
    /* @__PURE__ */ jsx("circle", { cx, cy: "92", r: "14", fill: C.eye }),
    /* @__PURE__ */ jsx("circle", { cx: cx - 4, cy: "87", r: "4.5", fill: "#fff" }),
    /* @__PURE__ */ jsx("circle", { cx: cx + 4.5, cy: "95.5", r: "2", fill: "#fff", opacity: "0.75" }),
    /* @__PURE__ */ jsx(
      Pivot,
      {
        x: cx,
        y: 76,
        animate: { scaleY: Math.max(1e-3, closed) },
        transition: blinking ? { duration: 0.06 } : springs.gentle,
        children: /* @__PURE__ */ jsx("rect", { x: cx - 15, y: "76", width: "30", height: "31", fill: C.body })
      }
    )
  ] });
}
function Brow({ cx, rot, y, side }) {
  return /* @__PURE__ */ jsx(Pivot, { x: cx, y: 66, animate: { rotate: side * rot, y }, transition: springs.gentle, children: /* @__PURE__ */ jsx(
    "path",
    {
      d: `M${cx - 12},68 Q${cx},61 ${cx + 12},68`,
      fill: "none",
      stroke: C.brow,
      strokeWidth: "5",
      strokeLinecap: "round"
    }
  ) });
}
function Effects({ fx }) {
  if (!fx) return null;
  if (fx === "sparkle") {
    return /* @__PURE__ */ jsx("g", { children: [[52, 62, 0], [186, 48, 0.4], [62, 148, 0.8], [182, 132, 1.2]].map(([x, y, d]) => /* @__PURE__ */ jsx(
      "path",
      {
        className: "anim-twinkle",
        style: { animationDelay: `${d}s` },
        d: `M${x},${y - 7} L${x + 2},${y - 2} L${x + 7},${y} L${x + 2},${y + 2} L${x},${y + 7} L${x - 2},${y + 2} L${x - 7},${y} L${x - 2},${y - 2} Z`,
        fill: "#FFD54F"
      },
      `${x}${y}`
    )) });
  }
  if (fx === "tears") {
    return /* @__PURE__ */ jsxs("g", { children: [
      /* @__PURE__ */ jsx("path", { className: "anim-tear", d: "M96,104 q-4,8 0,12 q4,-4 0,-12", fill: "#7EC8F2" }),
      /* @__PURE__ */ jsx("path", { className: "anim-tear", style: { animationDelay: "0.7s" }, d: "M144,104 q4,8 0,12 q-4,-4 0,-12", fill: "#7EC8F2" })
    ] });
  }
  if (fx === "crumbs") {
    return /* @__PURE__ */ jsx("g", { children: [[112, 132], [124, 136], [118, 130]].map(([x, y], i) => /* @__PURE__ */ jsx("circle", { className: "anim-crumb", style: { animationDelay: `${i * 0.25}s` }, cx: x, cy: y, r: "2.5", fill: C.wing }, i)) });
  }
  if (fx === "zzz") {
    return /* @__PURE__ */ jsxs("g", { fill: "#90A4AE", fontFamily: "sans-serif", fontWeight: "900", children: [
      /* @__PURE__ */ jsx("text", { className: "anim-zzz", x: "164", y: "58", fontSize: "18", children: "z" }),
      /* @__PURE__ */ jsx("text", { className: "anim-zzz", style: { animationDelay: "0.6s" }, x: "178", y: "44", fontSize: "13", children: "z" }),
      /* @__PURE__ */ jsx("text", { className: "anim-zzz", style: { animationDelay: "1.2s" }, x: "189", y: "33", fontSize: "9", children: "z" })
    ] });
  }
  if (fx === "swirl") {
    return /* @__PURE__ */ jsx("g", { className: "anim-spin", style: { transformOrigin: "120px 30px" }, children: /* @__PURE__ */ jsx("path", { d: "M108,30 a12,12 0 1,1 12,12 a8,8 0 1,1 8,-8 a4,4 0 1,1 -4,4", fill: "none", stroke: "#B39DDB", strokeWidth: "3.5", strokeLinecap: "round" }) });
  }
  return null;
}
function Accessory({ id }) {
  if (id === "shemagh") {
    return /* @__PURE__ */ jsxs("g", { children: [
      /* @__PURE__ */ jsx("path", { d: "M64,72 Q120,18 176,72 L176,86 Q120,42 64,86 Z", fill: "#fff" }),
      /* @__PURE__ */ jsx("path", { d: "M64,72 Q120,18 176,72 L176,79 Q120,30 64,79 Z", fill: "#D32F2F", opacity: "0.85" }),
      /* @__PURE__ */ jsx("ellipse", { cx: "120", cy: "46", rx: "42", ry: "10", fill: "none", stroke: "#1a1a1a", strokeWidth: "7" })
    ] });
  }
  if (id === "sunglasses") {
    return /* @__PURE__ */ jsxs("g", { children: [
      /* @__PURE__ */ jsx("rect", { x: "80", y: "82", width: "32", height: "22", rx: "10", fill: "#1a1a1a" }),
      /* @__PURE__ */ jsx("rect", { x: "128", y: "82", width: "32", height: "22", rx: "10", fill: "#1a1a1a" }),
      /* @__PURE__ */ jsx("path", { d: "M112,90 L128,90", stroke: "#1a1a1a", strokeWidth: "5" }),
      /* @__PURE__ */ jsx("circle", { cx: "90", cy: "88", r: "4", fill: "#fff", opacity: "0.35" }),
      /* @__PURE__ */ jsx("circle", { cx: "138", cy: "88", r: "4", fill: "#fff", opacity: "0.35" })
    ] });
  }
  if (id === "falcon_hood") {
    return /* @__PURE__ */ jsxs("g", { children: [
      /* @__PURE__ */ jsx("path", { d: "M86,58 Q120,20 154,58 Q154,74 120,72 Q86,74 86,58 Z", fill: "#8D6E63" }),
      /* @__PURE__ */ jsx("path", { d: "M86,58 Q120,20 154,58", fill: "none", stroke: "#5D4037", strokeWidth: "3" }),
      /* @__PURE__ */ jsx("circle", { cx: "120", cy: "30", r: "5", fill: "#FFD54F" })
    ] });
  }
  return null;
}
function Mascot({ emotion = "idle", stage = 1, size = 240, track = true, equipped = null, onTap }) {
  const e = EMOTIONS[emotion] || EMOTIONS.idle;
  const [blinking, setBlinking] = useState(false);
  useEffect(() => {
    let alive = true;
    let timer;
    const loop = () => {
      timer = setTimeout(() => {
        if (!alive) return;
        setBlinking(true);
        setTimeout(() => {
          if (!alive) return;
          setBlinking(false);
          if (Math.random() < 0.15) {
            setTimeout(() => alive && setBlinking(true), 140);
            setTimeout(() => alive && setBlinking(false), 260);
          }
        }, 120);
        loop();
      }, 2500 + Math.random() * 3500);
    };
    loop();
    return () => {
      alive = false;
      clearTimeout(timer);
    };
  }, []);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const canTrack = track && !["sleeping", "sick", "crying"].includes(emotion);
  useEffect(() => {
    if (!canTrack) {
      mx.set(0);
      my.set(0);
      return;
    }
    const onMove = (ev) => {
      mx.set((ev.clientX / window.innerWidth - 0.5) * 2);
      my.set((ev.clientY / window.innerHeight - 0.5) * 2);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [canTrack, mx, my]);
  const pupilX = useTransform(mx, (v) => v * 3.5);
  const pupilY = useTransform(my, (v) => v * 2.5);
  const grown = stage >= 2;
  const bodyLoop = BODY_LOOP_CLASS[e.body] ?? "";
  const flapping = emotion === "celebrating" || emotion === "happy";
  return /* @__PURE__ */ jsxs(
    motion.svg,
    {
      initial: false,
      viewBox: "0 0 240 240",
      width: size,
      height: size,
      animate: { filter: `saturate(${e.sat})` },
      transition: { duration: 0.6 },
      style: { overflow: "visible", touchAction: "manipulation" },
      onPointerDown: onTap,
      children: [
        /* @__PURE__ */ jsx("ellipse", { cx: "120", cy: "212", rx: "52", ry: "9", fill: "#000", opacity: "0.08" }),
        /* @__PURE__ */ jsxs(
          Pivot,
          {
            x: 120,
            y: 208,
            animate: { y: e.body === "droop" ? 5 : 0, scale: grown ? 1.06 : 1 },
            whileTap: { scaleY: 0.85, scaleX: 1.1 },
            transition: springs.pose,
            children: [
              /* @__PURE__ */ jsxs("g", { className: bodyLoop, style: { transformOrigin: "120px 208px" }, children: [
                grown && /* @__PURE__ */ jsxs("g", { fill: C.wing, children: [
                  /* @__PURE__ */ jsx("ellipse", { cx: "104", cy: "196", rx: "7", ry: "16", transform: "rotate(24 104 196)" }),
                  /* @__PURE__ */ jsx("ellipse", { cx: "120", cy: "200", rx: "7", ry: "17" }),
                  /* @__PURE__ */ jsx("ellipse", { cx: "136", cy: "196", rx: "7", ry: "16", transform: "rotate(-24 136 196)" })
                ] }),
                /* @__PURE__ */ jsx("ellipse", { cx: "120", cy: "158", rx: "56", ry: "50", fill: C.body }),
                /* @__PURE__ */ jsx("ellipse", { cx: "120", cy: "170", rx: "34", ry: "28", fill: C.belly }),
                stage >= 1 && /* @__PURE__ */ jsxs(Fragment, { children: [
                  /* @__PURE__ */ jsx("g", { className: flapping ? "anim-flap-l" : "", style: { transformOrigin: "68px 144px" }, children: /* @__PURE__ */ jsx(Pivot, { x: 68, y: 144, animate: { rotate: e.body === "droop" ? 10 : 0 }, transition: springs.gentle, children: /* @__PURE__ */ jsx("path", { d: "M66,140 Q46,158 58,186 Q72,178 74,156 Z", fill: C.wing }) }) }),
                  /* @__PURE__ */ jsx("g", { className: flapping ? "anim-flap-r" : "", style: { transformOrigin: "172px 144px" }, children: /* @__PURE__ */ jsx(Pivot, { x: 172, y: 144, animate: { rotate: e.body === "droop" ? -10 : 0 }, transition: springs.gentle, children: /* @__PURE__ */ jsx("path", { d: "M174,140 Q194,158 182,186 Q168,178 166,156 Z", fill: C.wing }) }) })
                ] }),
                stage >= 1 && /* @__PURE__ */ jsxs("g", { fill: C.feet, children: [
                  /* @__PURE__ */ jsx("ellipse", { cx: "100", cy: "206", rx: "10", ry: "5" }),
                  /* @__PURE__ */ jsx("ellipse", { cx: "140", cy: "206", rx: "10", ry: "5" })
                ] }),
                /* @__PURE__ */ jsxs(Pivot, { x: 120, y: 150, animate: { rotate: e.headTilt }, transition: springs.gentle, children: [
                  /* @__PURE__ */ jsx("circle", { cx: "120", cy: "92", r: "58", fill: C.body }),
                  grown ? /* @__PURE__ */ jsxs("g", { fill: C.wing, children: [
                    /* @__PURE__ */ jsx("path", { d: "M100,42 Q104,26 114,36 Q108,44 100,42" }),
                    /* @__PURE__ */ jsx("path", { d: "M112,38 Q120,20 128,38 Q120,32 112,38" }),
                    /* @__PURE__ */ jsx("path", { d: "M126,36 Q136,26 140,42 Q132,44 126,36" })
                  ] }) : /* @__PURE__ */ jsx("path", { d: "M112,38 Q120,24 128,38 Q120,34 112,38", fill: C.wing }),
                  /* @__PURE__ */ jsx(Brow, { cx: 96, rot: e.brow.rot, y: e.brow.y, side: -1 }),
                  /* @__PURE__ */ jsx(Brow, { cx: 144, rot: e.brow.rot, y: e.brow.y, side: 1 }),
                  /* @__PURE__ */ jsxs(motion.g, { initial: false, style: { x: pupilX, y: pupilY }, children: [
                    /* @__PURE__ */ jsx(Eye, { cx: 96, lid: e.lid, blinking }),
                    /* @__PURE__ */ jsx(Eye, { cx: 144, lid: e.lid, blinking })
                  ] }),
                  /* @__PURE__ */ jsxs(motion.g, { initial: false, animate: { opacity: e.cheeks }, transition: springs.gentle, children: [
                    /* @__PURE__ */ jsx("ellipse", { cx: "88", cy: "108", rx: "10", ry: "6", fill: C.blush }),
                    /* @__PURE__ */ jsx("ellipse", { cx: "152", cy: "108", rx: "10", ry: "6", fill: C.blush })
                  ] }),
                  /* @__PURE__ */ jsx("path", { d: "M106,112 Q120,102 134,112 L120,124 Z", fill: C.beakTop }),
                  Object.entries(BEAK_VARIANTS).map(([id, node]) => /* @__PURE__ */ jsx(
                    Pivot,
                    {
                      x: 120,
                      y: 128,
                      animate: { opacity: e.mouth === id ? 1 : 0, scale: e.mouth === id ? 1 : 0.85 },
                      transition: springs.snappy,
                      children: node
                    },
                    id
                  )),
                  equipped && /* @__PURE__ */ jsx(Accessory, { id: equipped })
                ] }),
                stage === 0 && /* @__PURE__ */ jsxs("g", { children: [
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      d: "M70,160 L80,148 L90,160 L100,148 L110,160 L120,148 L130,160 L140,148 L150,160 L160,148 L170,160 Q170,208 120,208 Q70,208 70,160 Z",
                      fill: C.shell,
                      stroke: C.shellEdge,
                      strokeWidth: "2"
                    }
                  ),
                  /* @__PURE__ */ jsx("ellipse", { cx: "102", cy: "182", rx: "7", ry: "10", fill: "#fff", opacity: "0.5" })
                ] })
              ] }),
              /* @__PURE__ */ jsx(Effects, { fx: e.fx })
            ]
          }
        )
      ]
    }
  );
}
var Mascot_default = React.memo(Mascot);

// <stdin>
function renderAll() {
  const frames = {};
  for (const emotion of Object.keys(EMOTIONS)) {
    frames["emotion-" + emotion] = renderToStaticMarkup(
      React2.createElement(Mascot_default, { emotion, stage: 1, size: 240, track: false })
    );
  }
  for (const stage of [0, 1, 2]) {
    frames["stage-" + stage] = renderToStaticMarkup(
      React2.createElement(Mascot_default, { emotion: "idle", stage, size: 240, track: false })
    );
  }
  for (const acc of ["shemagh", "sunglasses", "falcon_hood"]) {
    frames["acc-" + acc] = renderToStaticMarkup(
      React2.createElement(Mascot_default, { emotion: "happy", stage: 1, equipped: acc, size: 240, track: false })
    );
  }
  return frames;
}
export {
  renderAll
};
