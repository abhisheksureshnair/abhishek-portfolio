'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import {
  PERSONAL_INFO,
  ALL_PROJECTS,
  PROFESSIONAL_EXPERIENCE_DATA,
} from '@/data/portfolioData';
import { HQ_SPATIAL_PANEL_SLOTS, HQSpatialSlotId } from './HQSpatialMounts';
import { useWorldStore, worldStore } from '../../stores/worldStore';

interface PanelDetailState {
  expIndex: number;
  projectIndex: number;
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines: number = 3
): number {
  const words = text.split(' ');
  let line = '';
  let drawn = 0;

  for (let i = 0; i < words.length; i++) {
    const testLine = line ? `${line} ${words[i]}` : words[i];
    if (ctx.measureText(testLine).width > maxWidth && line) {
      ctx.fillText(line, x, y + drawn * lineHeight);
      drawn++;
      if (drawn >= maxLines) return y + drawn * lineHeight;
      line = words[i];
    } else {
      line = testLine;
    }
  }
  if (line && drawn < maxLines) {
    ctx.fillText(line, x, y + drawn * lineHeight);
    drawn++;
  }
  return y + drawn * lineHeight;
}

function drawGlassShell(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  accent: string,
  badge: string,
  title: string,
  footer: string
) {
  ctx.clearRect(0, 0, w, h);

  drawRoundedRect(ctx, 14, 14, w - 28, h - 28, 38);
  const bgGrad = ctx.createLinearGradient(0, 14, 0, h - 14);
  bgGrad.addColorStop(0, 'rgba(14, 27, 52, 0.92)');
  bgGrad.addColorStop(0.5, 'rgba(8, 16, 34, 0.88)');
  bgGrad.addColorStop(1, 'rgba(5, 11, 24, 0.94)');
  ctx.fillStyle = bgGrad;
  ctx.fill();

  drawRoundedRect(ctx, 22, 22, w - 44, 140, 30);
  const sheenGrad = ctx.createLinearGradient(0, 22, 0, 162);
  sheenGrad.addColorStop(0, 'rgba(255, 255, 255, 0.12)');
  sheenGrad.addColorStop(1, 'rgba(255, 255, 255, 0.0)');
  ctx.fillStyle = sheenGrad;
  ctx.fill();

  drawRoundedRect(ctx, 14, 14, w - 28, h - 28, 38);
  ctx.strokeStyle = accent;
  ctx.lineWidth = 4;
  ctx.stroke();

  drawRoundedRect(ctx, 24, 24, w - 48, h - 48, 30);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.14)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.font = 'bold 21px ui-monospace, SFMono-Regular, Menlo, monospace';
  ctx.fillStyle = accent;
  ctx.fillText(badge, 56, 74);

  ctx.font = 'bold 42px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = '#f8fafc';
  ctx.fillText(title, 56, 128);

  ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(56, 152);
  ctx.lineTo(w - 56, 152);
  ctx.stroke();

  ctx.font = 'bold 19px ui-monospace, SFMono-Regular, Menlo, monospace';
  ctx.fillStyle = 'rgba(148, 163, 184, 0.95)';
  ctx.fillText(footer, 56, h - 44);
}

function drawPill(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  text: string,
  accent: string
): number {
  ctx.font = '600 20px ui-monospace, SFMono-Regular, Menlo, monospace';
  const tw = ctx.measureText(text).width;
  const pw = tw + 28;
  const ph = 38;
  drawRoundedRect(ctx, x, y, pw, ph, 14);
  ctx.fillStyle = 'rgba(56, 189, 248, 0.14)';
  ctx.fill();
  ctx.strokeStyle = accent;
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.fillStyle = '#e0f2fe';
  ctx.fillText(text, x + 14, y + 26);
  return pw + 12;
}

function renderPanelTexture(
  slotId: HQSpatialSlotId,
  isExpanded: boolean,
  detail: PanelDetailState
): THREE.CanvasTexture {
  const w = 1024;
  const h = 640;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;

  if (slotId === 'introduction') {
    drawGlassShell(
      ctx,
      w,
      h,
      '#38bdf8',
      '01 // DEVELOPER INTRODUCTION',
      PERSONAL_INFO.name,
      isExpanded ? '[E] or Click to Collapse' : '[E] or Click to Expand Profile'
    );
    ctx.font = 'bold 26px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = '#7dd3fc';
    ctx.fillText(`${PERSONAL_INFO.title}  •  ${PERSONAL_INFO.subtitle}`, 56, 198);

    ctx.font = '500 23px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = '#e2e8f0';
    const nextY = wrapText(
      ctx,
      isExpanded ? PERSONAL_INFO.bioStory : PERSONAL_INFO.tagline,
      56,
      248,
      w - 112,
      34,
      isExpanded ? 5 : 3
    );

    let px = 56;
    const py = Math.max(nextY + 26, 440);
    px += drawPill(ctx, px, py, `${PERSONAL_INFO.experienceYears} Years Exp`, '#38bdf8');
    px += drawPill(ctx, px, py, PERSONAL_INFO.location, '#60a5fa');
    drawPill(ctx, px, py, 'Full-Stack • AI', '#22d3ee');
  } else if (slotId === 'experience') {
    const exp = PROFESSIONAL_EXPERIENCE_DATA;
    const items = exp.projects;
    const activeItem = items[detail.expIndex % items.length];

    drawGlassShell(
      ctx,
      w,
      h,
      '#60a5fa',
      '02 // PROFESSIONAL EXPERIENCE',
      exp.company,
      isExpanded
        ? `[Q] Next Item (${(detail.expIndex % items.length) + 1}/${items.length})  •  [E] Collapse`
        : '[E] or Click to Explore Timeline'
    );
    ctx.font = 'bold 25px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = '#93c5fd';
    ctx.fillText(`${exp.officialTitle} — ${exp.department}  •  ${exp.period}`, 56, 196);

    if (!isExpanded) {
      ctx.font = '500 23px system-ui, -apple-system, sans-serif';
      ctx.fillStyle = '#e2e8f0';
      wrapText(ctx, exp.description, 56, 246, w - 112, 34, 3);

      let px = 56;
      for (const m of exp.metrics.slice(0, 3)) {
        px += drawPill(ctx, px, 452, `${m.value} ${m.label}`, '#60a5fa');
      }
    } else if (activeItem) {
      ctx.font = 'bold 20px ui-monospace, SFMono-Regular, Menlo, monospace';
      ctx.fillStyle = '#38bdf8';
      ctx.fillText(`TIMELINE ITEM: ${activeItem.title.toUpperCase()} (${activeItem.domain})`, 56, 248);

      ctx.font = '500 22px system-ui, -apple-system, sans-serif';
      ctx.fillStyle = '#e2e8f0';
      let cy = wrapText(ctx, activeItem.summary, 56, 290, w - 112, 32, 3);
      cy += 22;
      for (const contrib of activeItem.keyContributions.slice(0, 2)) {
        ctx.fillStyle = '#bae6fd';
        cy = wrapText(ctx, `• ${contrib}`, 56, cy, w - 112, 30, 2) + 8;
      }
    }
  } else if (slotId === 'technology') {
    drawGlassShell(
      ctx,
      w,
      h,
      '#22d3ee',
      '03 // SKILLS & TECHNOLOGIES',
      'Core Engineering Stack',
      isExpanded ? '[E] or Click to Collapse' : '[E] or Click to Expand Stack'
    );

    const groups = [
      { name: 'FRONTEND', items: ['React.js', 'JavaScript', 'HTML', 'CSS'] },
      { name: 'MOBILE', items: ['React Native', 'Flutter'] },
      { name: 'BACKEND', items: ['Node.js', 'REST APIs'] },
      { name: 'LEARNING & AI', items: ['Python', 'AI / LLM Integration'] },
    ];

    let rowY = 196;
    for (const g of groups) {
      ctx.font = 'bold 19px ui-monospace, SFMono-Regular, Menlo, monospace';
      ctx.fillStyle = '#67e8f9';
      ctx.fillText(g.name, 56, rowY + 26);

      let px = 250;
      for (const tech of g.items) {
        px += drawPill(ctx, px, rowY, tech, '#22d3ee');
      }
      rowY += isExpanded ? 86 : 80;
    }
  } else if (slotId === 'development_focus') {
    const idx = detail.projectIndex % ALL_PROJECTS.length;
    const proj = ALL_PROJECTS[idx];

    drawGlassShell(
      ctx,
      w,
      h,
      '#38bdf8',
      '04 // PROJECTS',
      isExpanded ? `${proj.number}. ${proj.title}` : 'Featured Systems & Builds',
      isExpanded
        ? `[Q] Next Project (${idx + 1}/${ALL_PROJECTS.length})  •  [E] Collapse`
        : '[E] or Click to Inspect Projects'
    );

    if (!isExpanded) {
      let cy = 200;
      for (const p of ALL_PROJECTS.slice(0, 3)) {
        ctx.font = 'bold 24px system-ui, -apple-system, sans-serif';
        ctx.fillStyle = '#f8fafc';
        ctx.fillText(`${p.number}  ${p.title}`, 56, cy);
        ctx.font = '500 20px system-ui, -apple-system, sans-serif';
        ctx.fillStyle = '#bae6fd';
        ctx.fillText(`${p.category}  •  ${p.technologies.slice(0, 4).join(', ')}`, 56, cy + 30);
        cy += 104;
      }
    } else {
      ctx.font = 'bold 21px ui-monospace, SFMono-Regular, Menlo, monospace';
      ctx.fillStyle = '#7dd3fc';
      ctx.fillText(`${proj.category}  •  ${proj.year}`, 56, 198);

      ctx.font = '500 23px system-ui, -apple-system, sans-serif';
      ctx.fillStyle = '#e2e8f0';
      const nextY = wrapText(ctx, proj.description, 56, 246, w - 112, 34, 4);

      let px = 56;
      const py = Math.max(nextY + 26, 430);
      for (const tech of proj.technologies.slice(0, 5)) {
        if (px > w - 220) break;
        px += drawPill(ctx, px, py, tech, '#38bdf8');
      }
      if (proj.liveUrl || proj.githubUrl) {
        ctx.font = '600 18px ui-monospace, SFMono-Regular, Menlo, monospace';
        ctx.fillStyle = '#38bdf8';
        ctx.fillText(proj.liveUrl || proj.githubUrl || '', 56, 512);
      }
    }
  } else {
    drawGlassShell(
      ctx,
      w,
      h,
      '#60a5fa',
      '05 // CONTACT & PORTFOLIO NAVIGATION',
      'Connect & Explore City',
      isExpanded
        ? 'Click Panel Action or [E] to Collapse  •  Walk to South Door [E] to Exit'
        : '[E] or Click to Expand Contact & Links'
    );

    ctx.font = '500 23px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = '#e2e8f0';
    ctx.fillText(`Email: ${PERSONAL_INFO.email}  •  ${PERSONAL_INFO.location}`, 56, 206);
    ctx.fillStyle = '#bae6fd';
    ctx.fillText(`GitHub: ${PERSONAL_INFO.github}`, 56, 254);
    ctx.fillText(`LinkedIn: ${PERSONAL_INFO.linkedin}`, 56, 300);

    let px = 56;
    px += drawPill(ctx, px, 356, 'Open GitHub', '#38bdf8');
    px += drawPill(ctx, px, 356, 'Open LinkedIn', '#60a5fa');
    drawPill(ctx, px, 356, 'Email Contact', '#22d3ee');

    ctx.font = '600 20px ui-monospace, SFMono-Regular, Menlo, monospace';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText(
      'Exit HQ: Walk to the South glass doorway and press [E].',
      56,
      462
    );
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

const _panelPlaneGeo = new THREE.PlaneGeometry(1.72, 1.08);
const _camPos = new THREE.Vector3();
const _camDir = new THREE.Vector3();
const _panelPos = new THREE.Vector3();
const _toPanel = new THREE.Vector3();

export const HQSpatialPanels: React.FC = () => {
  const { camera } = useThree();
  const hqExpandedPanel = useWorldStore((s) => s.hqExpandedPanel);

  const [detailState, setDetailState] = useState<PanelDetailState>({
    expIndex: 0,
    projectIndex: 0,
  });

  const panelGroupRefs = useRef<Record<string, THREE.Group | null>>({});
  const panelMatRefs = useRef<Record<string, THREE.MeshBasicMaterial | null>>({});
  const animStateRef = useRef<Record<string, { scale: number; lift: number; zOffset: number }>>({});
  const arrivalElapsedRef = useRef<number>(0);
  const highlightedRef = useRef<string | null>(null);

  const textures = useMemo(() => {
    const map: Record<string, THREE.CanvasTexture> = {};
    for (const slot of HQ_SPATIAL_PANEL_SLOTS) {
      map[slot.id] = renderPanelTexture(
        slot.id,
        hqExpandedPanel === slot.id,
        detailState
      );
    }
    return map;
  }, [hqExpandedPanel, detailState]);

  useEffect(() => {
    return () => {
      Object.values(textures).forEach((tex) => tex.dispose());
    };
  }, [textures]);

  useEffect(() => {
    const handlePanelInteract = () => {
      const { hqInteriorPhase, hqNearExit, hqExpandedPanel: curExpanded } =
        worldStore.getState();
      if (hqInteriorPhase !== 'inside' || hqNearExit) return;
      const targetId = highlightedRef.current;
      if (!targetId) return;
      worldStore
        .getState()
        .setHqExpandedPanel(curExpanded === targetId ? null : targetId);
    };

    const handlePanelCollapse = () => {
      if (worldStore.getState().hqExpandedPanel !== null) {
        worldStore.getState().setHqExpandedPanel(null);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (worldStore.getState().hqInteriorPhase !== 'inside') return;
      if (e.key.toLowerCase() === 'q') {
        const expanded = worldStore.getState().hqExpandedPanel;
        if (expanded === 'experience') {
          setDetailState((s) => ({ ...s, expIndex: s.expIndex + 1 }));
        } else if (expanded === 'development_focus') {
          setDetailState((s) => ({ ...s, projectIndex: s.projectIndex + 1 }));
        }
      }
    };

    window.addEventListener('hq-panel-interact', handlePanelInteract);
    window.addEventListener('hq-panel-collapse', handlePanelCollapse);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('hq-panel-interact', handlePanelInteract);
      window.removeEventListener('hq-panel-collapse', handlePanelCollapse);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Gaze-ray highlight, sequential arrival, & smooth hover/expansion animation
  useFrame((_, delta) => {
    const { hqInteriorPhase, hqExpandedPanel: expandedId } = worldStore.getState();
    if (hqInteriorPhase === 'outside') return;
    const dt = Math.min(delta, 0.05);
    arrivalElapsedRef.current += dt;

    let bestId: string | null = null;
    if (hqInteriorPhase === 'inside') {
      camera.getWorldPosition(_camPos);
      camera.getWorldDirection(_camDir);

      let bestScore = 0.84;
      for (let i = 0; i < HQ_SPATIAL_PANEL_SLOTS.length; i++) {
        const slot = HQ_SPATIAL_PANEL_SLOTS[i];
        _panelPos.set(slot.position[0], slot.position[1] + 1.62, slot.position[2]);
        _toPanel.subVectors(_panelPos, _camPos);
        const dist = _toPanel.length();
        if (dist > 7.5 || dist < 0.4) continue;
        _toPanel.divideScalar(dist);
        const dot = _camDir.dot(_toPanel);
        if (dot > bestScore) {
          bestScore = dot;
          bestId = slot.id;
        }
      }

      if (highlightedRef.current !== bestId) {
        highlightedRef.current = bestId;
        worldStore.getState().setHqHighlightedPanel(bestId);
      }
    }

    for (let i = 0; i < HQ_SPATIAL_PANEL_SLOTS.length; i++) {
      const slot = HQ_SPATIAL_PANEL_SLOTS[i];
      const grp = panelGroupRefs.current[slot.id];
      const mat = panelMatRefs.current[slot.id];
      if (!grp) continue;

      if (!animStateRef.current[slot.id]) {
        animStateRef.current[slot.id] = { scale: 0.85, lift: -0.25, zOffset: 0 };
      }
      const st = animStateRef.current[slot.id];
      const rawArrival = Math.max(
        0,
        Math.min(1, (arrivalElapsedRef.current - i * 0.11) / 0.55)
      );
      const easedArrival = 1 - Math.pow(1 - rawArrival, 3);

      const isExpanded = expandedId === slot.id;
      const isHovered = bestId === slot.id;
      const baseScale = slot.id === 'introduction' ? 1.15 : 1.0;

      const targetScale =
        baseScale *
        (isExpanded ? 1.38 : isHovered ? 1.07 : 1.0) *
        (0.85 + 0.15 * easedArrival);
      const targetLift =
        (isExpanded ? 0.1 : isHovered ? 0.04 : 0.0) -
        0.25 * (1 - easedArrival) +
        Math.sin(arrivalElapsedRef.current * 1.4 + i * 1.2) * 0.02 * easedArrival;
      const targetZ = isExpanded ? 0.42 : isHovered ? 0.1 : 0.0;

      const factor = Math.min(1, dt * 8.5);
      st.scale += (targetScale - st.scale) * factor;
      st.lift += (targetLift - st.lift) * factor;
      st.zOffset += (targetZ - st.zOffset) * factor;

      grp.scale.setScalar(st.scale);
      grp.position.set(0, 1.62 + st.lift, st.zOffset);

      if (mat) {
        const targetOpacity = (isExpanded || isHovered ? 0.99 : 0.92) * easedArrival;
        mat.opacity += (targetOpacity - mat.opacity) * Math.min(1, dt * 10.0);
      }
    }
  });

  const handlePanelClick = (slotId: HQSpatialSlotId, e: any) => {
    e.stopPropagation();
    const { hqInteriorPhase, isPointerLocked, hqExpandedPanel: curExpanded } =
      worldStore.getState();
    if (hqInteriorPhase !== 'inside' || isPointerLocked) return;

    if (curExpanded === slotId && slotId === 'portfolio_navigation') {
      window.open(PERSONAL_INFO.github, '_blank', 'noopener,noreferrer');
      return;
    }

    worldStore
      .getState()
      .setHqExpandedPanel(curExpanded === slotId ? null : slotId);
  };

  return (
    <group name="hq_spatial_panels">
      {HQ_SPATIAL_PANEL_SLOTS.map((slot) => {
        return (
          <group
            key={slot.id}
            position={slot.position}
            rotation={[0, slot.rotationY, 0]}
          >
            <group
              ref={(el) => {
                panelGroupRefs.current[slot.id] = el;
              }}
              position={[0, 1.62, 0]}
            >
              <mesh
                geometry={_panelPlaneGeo}
                onClick={(e) => handlePanelClick(slot.id, e)}
              >
                <meshBasicMaterial
                  ref={(el) => {
                    panelMatRefs.current[slot.id] = el;
                  }}
                  map={textures[slot.id]}
                  transparent
                  opacity={0}
                  side={THREE.DoubleSide}
                />
              </mesh>
            </group>
          </group>
        );
      })}
    </group>
  );
};
