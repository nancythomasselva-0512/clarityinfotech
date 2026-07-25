"use client";

import React, { useEffect, useRef } from "react";

// Clarity Brand Color Tokens
const CLARITY_COLORS = {
  navy: "#1E2B7F",        // Deep navy for shadow side nodes
  blue: "#2C5FD9",        // Mid-tone blue for mid nodes
  cyan: "#5FB8F0",        // Light sky blue / cyan for highlight side nodes
  cyanAccent: "#7FD4F5",  // Brightest cyan diamond accent for hub nodes
  lineColor: "#9AB4E0",   // Thin constellation connecting lines
};

// Concentric 'C' Logo Mark centered inside the sphere core
function ClarityCLogoMark({ size = 56 }) {
  return (
    <div
      style={{ width: `${size}px`, height: `${size}px` }}
      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 flex items-center justify-center rounded-full bg-[#0A0E39]/85 border border-white/25 p-2.5 shadow-[0_0_28px_rgba(95,184,240,0.55)] backdrop-blur-md pointer-events-none"
    >
      <svg viewBox="0 0 100 100" className="w-full h-full filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
        <defs>
          <linearGradient id="cMarkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7FD4F5" />
            <stop offset="45%" stopColor="#5FB8F0" />
            <stop offset="80%" stopColor="#2C5FD9" />
            <stop offset="100%" stopColor="#1E2B7F" />
          </linearGradient>
        </defs>
        {/* Outer Ring */}
        <path
          d="M 81.82 18.18 A 45 45 0 1 0 81.82 81.82 A 6 6 0 0 0 73.33 73.33 A 33 33 0 1 1 73.33 26.67 A 6 6 0 0 0 81.82 18.18 Z"
          fill="url(#cMarkGrad)"
          opacity="0.85"
        />
        {/* Middle Ring */}
        <path
          d="M 71.92 28.08 A 31 31 0 1 0 71.92 71.92 A 5 5 0 0 0 64.85 64.85 A 21 21 0 1 1 64.85 35.15 A 5 5 0 0 0 71.92 28.08 Z"
          fill="url(#cMarkGrad)"
          opacity="0.95"
        />
        {/* Inner Ring Core */}
        <path
          d="M 63.44 36.56 A 19 19 0 1 0 63.44 63.44 A 5 5 0 0 0 56.36 56.36 A 9 9 0 1 1 56.36 43.64 A 5 5 0 0 0 63.44 36.56 Z"
          fill="#7FD4F5"
        />
      </svg>
    </div>
  );
}

export default function ClarityNetworkGlobe({ className = "", size = 420 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // High-DPI Canvas Setup
    let animationFrameId;
    const width = size;
    const height = size;
    const dpr = window.devicePixelRatio || 1;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    // Globe Parameters
    const numNodes = 48; // ~45-50 nodes
    const radius = width * 0.38; // ~160px for 420px container (~380px sphere diameter)
    const centerX = width / 2;
    const centerY = height / 2;

    // Fibonacci Sphere Node Distribution
    const baseNodes = [];
    const hubIndices = new Set([4, 12, 23, 34, 41]);

    for (let i = 0; i < numNodes; i++) {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / numNodes);
      const theta = Math.PI * (1 + Math.sqrt(5)) * (i + 0.5);

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.cos(phi);
      const z = radius * Math.sin(phi) * Math.sin(theta);

      const isHub = hubIndices.has(i);

      baseNodes.push({
        id: i,
        x,
        y,
        z,
        isHub,
        baseRadius: isHub ? 6.0 : Math.random() * 1.5 + 2.8, // Hub nodes 12-14px diameter, others 5-8px
        pulseOffset: (i * 1.4) % (Math.PI * 2), // Staggered start times
      });
    }

    // Sparse Constellation Connections (only nearby nodes)
    const connections = [];
    const distThreshold = radius * 0.68;

    for (let i = 0; i < baseNodes.length; i++) {
      let count = 0;
      for (let j = i + 1; j < baseNodes.length; j++) {
        const dx = baseNodes[i].x - baseNodes[j].x;
        const dy = baseNodes[i].y - baseNodes[j].y;
        const dz = baseNodes[i].z - baseNodes[j].z;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (dist < distThreshold && count < 2) {
          connections.push([i, j]);
          count++;
        }
      }
    }

    let angleY = 0;
    const rotationSpeed = (2 * Math.PI) / (22 * 60); // Full 360° rotation in ~22 seconds at 60fps
    let isTabVisible = !document.hidden;

    // Signal Pulse (Radar Ping) state
    let activePingHub = 4;
    let pingProgress = 0; // 0 to 1
    let lastPingTime = performance.now();

    const handleVisibilityChange = () => {
      isTabVisible = !document.hidden;
      if (isTabVisible && !prefersReducedMotion) {
        lastTime = performance.now();
        render();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    let lastTime = performance.now();

    const render = (time = performance.now()) => {
      if (!isTabVisible && !prefersReducedMotion) return;

      const delta = (time - lastTime) / 1000;
      lastTime = time;

      if (!prefersReducedMotion) {
        angleY += rotationSpeed;

        // Radar ping animation timer (~2.2 second cycle)
        pingProgress += delta / 2.2;
        if (pingProgress >= 1) {
          pingProgress = 0;
          // Select a random hub node currently on the front side
          const hubList = Array.from(hubIndices);
          activePingHub = hubList[Math.floor(Math.random() * hubList.length)];
        }
      }

      ctx.clearRect(0, 0, width, height);

      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);

      // Rotate & Calculate Depth Projection
      const projectedNodes = baseNodes.map((node) => {
        const rotX = node.x * cosY + node.z * sinY;
        const rotY = node.y;
        const rotZ = -node.x * sinY + node.z * cosY;

        // Strong Z-Depth Perspective & Opacity Falloff
        const depthScale = (rotZ + radius * 2.2) / (radius * 3.2); // Front nodes scale up, back scale down
        const opacity = Math.max(0.08, Math.min(1.0, (rotZ + radius * 1.5) / (radius * 2.5)));

        // Light vector calculation (Light source from top-front-right [0.55, -0.45, 0.75])
        const lightVector = (rotX * 0.55 - rotY * 0.45 + rotZ * 0.75) / radius;

        // Strict Palette: Navy (#1E2B7F) -> Mid Blue (#2C5FD9) -> Cyan (#5FB8F0) -> Cyan Accent (#7FD4F5)
        let nodeColor;
        if (node.isHub) {
          nodeColor = CLARITY_COLORS.cyanAccent;
        } else if (lightVector > 0.40) {
          nodeColor = CLARITY_COLORS.cyan;
        } else if (lightVector > 0.0) {
          nodeColor = CLARITY_COLORS.blue;
        } else {
          nodeColor = CLARITY_COLORS.navy;
        }

        return {
          ...node,
          projX: centerX + rotX,
          projY: centerY + rotY,
          rotZ,
          depthScale,
          opacity,
          color: nodeColor,
        };
      });

      // Render Thin Constellation Connections (with sharp back-side fade for 3D silhouette)
      ctx.lineWidth = 1;
      connections.forEach(([i, j]) => {
        const n1 = projectedNodes[i];
        const n2 = projectedNodes[j];

        const avgOpacity = (n1.opacity + n2.opacity) / 2;
        // Fade far-side lines sharply so sphere silhouette reads clearly in 3D
        if (avgOpacity < 0.28) return;

        const midX = (n1.projX + n2.projX) / 2;
        const midY = (n1.projY + n2.projY) / 2;
        const ctrlX = centerX + (midX - centerX) * 1.05;
        const ctrlY = centerY + (midY - centerY) * 1.05;

        ctx.strokeStyle = hexToRgba(CLARITY_COLORS.lineColor, (avgOpacity - 0.15) * 0.45);
        ctx.beginPath();
        ctx.moveTo(n1.projX, n1.projY);
        ctx.quadraticCurveTo(ctrlX, ctrlY, n2.projX, n2.projY);
        ctx.stroke();
      });

      // Sort Nodes by Z-depth (draw back to front)
      const sortedNodes = [...projectedNodes].sort((a, b) => a.rotZ - b.rotZ);

      // Render Nodes, Glowing Halos, and Signal Radar Ping Ripples
      sortedNodes.forEach((node) => {
        const currentRadius = node.baseRadius * Math.max(0.55, node.depthScale);

        // Independent Breathing Pulse on Hub Nodes
        let pulseFactor = 1;
        if (node.isHub && !prefersReducedMotion) {
          pulseFactor = 0.75 + 0.35 * Math.sin((time / 1000) * 2.5 + node.pulseOffset);
        }

        const renderAlpha = node.opacity * pulseFactor;

        // Draw Occasional Signal Pulse (Radar Ping Ripple) from active hub node
        if (node.id === activePingHub && node.rotZ > -radius * 0.3 && !prefersReducedMotion) {
          const pingRadius = currentRadius + pingProgress * 32;
          const pingAlpha = Math.max(0, (1 - pingProgress) * node.opacity * 0.7);

          ctx.strokeStyle = hexToRgba(CLARITY_COLORS.cyanAccent, pingAlpha);
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(node.projX, node.projY, pingRadius, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Soft Radial Glow Halo behind Node
        const haloRadius = currentRadius * (node.isHub ? 3.2 : 2.2);
        const radialGrad = ctx.createRadialGradient(
          node.projX,
          node.projY,
          0,
          node.projX,
          node.projY,
          haloRadius
        );
        radialGrad.addColorStop(0, hexToRgba(node.color, renderAlpha * 0.85));
        radialGrad.addColorStop(0.5, hexToRgba(node.color, renderAlpha * 0.30));
        radialGrad.addColorStop(1, hexToRgba(node.color, 0));

        ctx.fillStyle = radialGrad;
        ctx.beginPath();
        ctx.arc(node.projX, node.projY, haloRadius, 0, Math.PI * 2);
        ctx.fill();

        // Core Solid Node Dot
        ctx.fillStyle = hexToRgba(node.color, renderAlpha);
        ctx.beginPath();
        ctx.arc(node.projX, node.projY, currentRadius, 0, Math.PI * 2);
        ctx.fill();
      });

      if (!prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [size]);

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Enhanced Ambient Cyan Glow Halo behind the Globe */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#1E2B7F]/15 via-[#2C5FD9]/20 to-[#5FB8F0]/25 blur-3xl pointer-events-none transform scale-110 opacity-75" />

      {/* 3D Network Globe Canvas */}
      <canvas
        ref={canvasRef}
        className="relative z-10 max-w-full h-auto pointer-events-none drop-shadow-sm"
      />

      {/* Non-Rotating Centered Clarity 'C' Logo Mark */}
      <ClarityCLogoMark size={56} />
    </div>
  );
}

// Helper: Convert Hex to RGBA
function hexToRgba(hex, alpha = 1) {
  let c = hex.replace("#", "");
  if (c.length === 3) {
    c = c.split("").map((char) => char + char).join("");
  }
  const num = parseInt(c, 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(2)})`;
}
