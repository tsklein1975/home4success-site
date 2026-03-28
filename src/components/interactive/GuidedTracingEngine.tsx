'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { getLetterData, type LetterData, type StrokeData } from './guidedLetterData';

// ─── Types ───
interface Point { x: number; y: number }

interface GuidedTracingEngineProps {
  title: string;
  letters: string[];
  lang: 'he' | 'en';
}

// ─── Constants ───
const VB = 100;                   // SVG viewBox dimension
const SAMPLES = 200;              // sample points per stroke path
const GRAB_RADIUS = 22;           // max dist to grab the handle (VB units)
const PATH_TOLERANCE = 24;        // max dist from path for valid movement
const LOOK_AHEAD = 50;            // sample-point search window (forward only)
const COMPLETE_THRESHOLD = 0.85;  // fraction to auto-complete stroke

// ─── Path utility: compute length + sample points using temp SVG ───
function measureSvgPath(pathD: string): { length: number; points: Point[] } {
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', `0 0 ${VB} ${VB}`);
  svg.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden;pointer-events:none';
  const pathEl = document.createElementNS(ns, 'path');
  pathEl.setAttribute('d', pathD);
  svg.appendChild(pathEl);
  document.body.appendChild(svg);

  const len = pathEl.getTotalLength();
  const pts: Point[] = [];
  for (let i = 0; i <= SAMPLES; i++) {
    const p = pathEl.getPointAtLength((i / SAMPLES) * len);
    pts.push({ x: p.x, y: p.y });
  }
  document.body.removeChild(svg);
  return { length: len, points: pts };
}

// ═══════════════════════════════════════════════════════════════════════
//  COMPONENT
// ═══════════════════════════════════════════════════════════════════════

export default function GuidedTracingEngine({ title, letters, lang }: GuidedTracingEngineProps) {
  // ─── State ───
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [strokeIndex, setStrokeIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [pathLength, setPathLength] = useState(0);     // STATE → triggers SVG re-render
  const [isDragging, setIsDragging] = useState(false);
  const [success, setSuccess] = useState(false);
  const [stars, setStars] = useState<string[]>([]);

  // ─── Refs ───
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sampledRef = useRef<Point[]>([]);
  const progressRef = useRef(0);  // mutable mirror to avoid stale closures
  const letterDataRef = useRef<LetterData | null>(null);

  const isHebrew = lang === 'he';

  // Keep progressRef synced
  useEffect(() => { progressRef.current = progress; }, [progress]);

  // ─── Canvas size ───
  const getCanvasSize = useCallback(() => {
    if (!containerRef.current) return 340;
    return Math.min(containerRef.current.clientWidth * 0.92, 400);
  }, []);

  // ─── Measure active stroke path ───
  const measureStroke = useCallback((pathD: string) => {
    const result = measureSvgPath(pathD);
    sampledRef.current = result.points;
    setPathLength(result.length);
  }, []);

  // ─── Draw Hebrew gray glyph on canvas ───
  const drawHebrewGlyph = useCallback((char: string) => {
    const size = getCanvasSize();
    const cv = canvasRef.current;
    if (!cv) return;
    cv.width = size;
    cv.height = size;
    const ctx = cv.getContext('2d');
    if (!ctx) return;
    let ff = 'system-ui, sans-serif';
    if (containerRef.current) {
      ff = window.getComputedStyle(containerRef.current).fontFamily || ff;
    }
    ctx.font = `900 ${size * 0.65}px ${ff}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#e2e8f0';
    ctx.fillText(char, size / 2, size * 0.52);
  }, [getCanvasSize]);

  // ─── Pointer-to-SVG coordinate conversion ───
  const toSvg = useCallback((e: React.PointerEvent): Point => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const r = svg.getBoundingClientRect();
    return {
      x: ((e.clientX - r.left) / r.width) * VB,
      y: ((e.clientY - r.top) / r.height) * VB,
    };
  }, []);

  // ─── Get handle position from current progress ───
  const getHandlePoint = useCallback((): Point | null => {
    const pts = sampledRef.current;
    if (!pts.length) return null;
    const idx = Math.min(Math.round(progress * (pts.length - 1)), pts.length - 1);
    return pts[idx];
  }, [progress]);

  // ─── Get direction arrow from first few samples ───
  const getArrowAngle = useCallback((): number | null => {
    const pts = sampledRef.current;
    if (pts.length < 10) return null;
    const a = pts[0], b = pts[Math.min(12, pts.length - 1)];
    return Math.atan2(b.y - a.y, b.x - a.x);
  }, []);

  // ─── Complete current stroke ───
  const completeStroke = useCallback(() => {
    setProgress(1);
    progressRef.current = 1;
    setIsDragging(false);

    const data = letterDataRef.current;
    if (!data) return;

    setTimeout(() => {
      if (strokeIndex + 1 < data.strokes.length) {
        setStrokeIndex(prev => prev + 1);
        setProgress(0);
        progressRef.current = 0;
      } else {
        setSuccess(true);
        if (selectedLetter && !stars.includes(selectedLetter)) {
          setStars(prev => [...prev, selectedLetter]);
        }
      }
    }, 300);
  }, [selectedLetter, strokeIndex, stars]);

  // ─── Pointer down: start drag if near handle ───
  const onPointerDown = useCallback((e: React.PointerEvent) => {
    if (success) return;
    e.preventDefault();
    const pt = toSvg(e);
    const pts = sampledRef.current;
    if (!pts.length) return;

    const ci = Math.min(Math.round(progressRef.current * (pts.length - 1)), pts.length - 1);
    const hp = pts[ci];
    if (Math.hypot(pt.x - hp.x, pt.y - hp.y) < GRAB_RADIUS) {
      setIsDragging(true);
      (e.target as Element).setPointerCapture?.(e.pointerId);
    }
  }, [success, toSvg]);

  // ─── Pointer move: advance progress along path ───
  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging || success) return;
    e.preventDefault();
    const pt = toSvg(e);
    const pts = sampledRef.current;
    if (!pts.length) return;

    const curIdx = Math.round(progressRef.current * (pts.length - 1));
    const end = Math.min(curIdx + LOOK_AHEAD, pts.length - 1);

    let bestIdx = curIdx;
    let bestDist = Infinity;
    for (let i = curIdx; i <= end; i++) {
      const d = Math.hypot(pts[i].x - pt.x, pts[i].y - pt.y);
      if (d < bestDist) { bestDist = d; bestIdx = i; }
    }

    if (bestDist < PATH_TOLERANCE && bestIdx > curIdx) {
      const newProg = bestIdx / (pts.length - 1);
      setProgress(newProg);
      progressRef.current = newProg;
      if (newProg >= COMPLETE_THRESHOLD) {
        completeStroke();
      }
    }
  }, [isDragging, success, toSvg, completeStroke]);

  // ─── Pointer up: stop drag, keep progress ───
  const onPointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // ─── Init game for a letter ───
  const initGame = useCallback((char: string) => {
    const data = getLetterData(char, lang);
    if (!data) return;
    letterDataRef.current = data;
    setSelectedLetter(char);
    setStrokeIndex(0);
    setProgress(0);
    progressRef.current = 0;
    setSuccess(false);
    setIsDragging(false);
    if (isHebrew) setTimeout(() => drawHebrewGlyph(char), 60);
  }, [lang, isHebrew, drawHebrewGlyph]);

  // ─── Reset ───
  const resetLetter = useCallback(() => {
    setStrokeIndex(0);
    setProgress(0);
    progressRef.current = 0;
    setSuccess(false);
    setIsDragging(false);
    if (selectedLetter && isHebrew) drawHebrewGlyph(selectedLetter);
  }, [selectedLetter, isHebrew, drawHebrewGlyph]);

  // ─── Measure path when stroke changes ───
  useEffect(() => {
    const data = letterDataRef.current;
    if (!data || !selectedLetter || success) return;
    if (strokeIndex >= data.strokes.length) return;
    measureStroke(data.strokes[strokeIndex].path);
  }, [selectedLetter, strokeIndex, success, measureStroke]);

  // ═══════════════════════════════════════════════
  //  RENDER
  // ═══════════════════════════════════════════════

  const size = getCanvasSize();
  const data = letterDataRef.current;
  const strokes = data?.strokes ?? [];
  const handlePt = getHandlePoint();
  const arrowAngle = progress < 0.12 ? getArrowAngle() : null;

  // ─── GRID VIEW (letter selection) ───
  if (!selectedLetter) {
    return (
      <div className="flex flex-col items-center animate-in fade-in duration-500">
        <h2 className="text-2xl md:text-3xl font-bold text-[#7ca79b] mb-6">{title}</h2>
        <div className="flex flex-wrap justify-center gap-3 md:gap-4 max-w-4xl" dir={isHebrew ? 'rtl' : 'ltr'}>
          {letters.map((l, i) => {
            const hasData = !!getLetterData(l, lang);
            if (!hasData) return null;
            const done = stars.includes(l);
            return (
              <button key={i} onClick={() => initGame(l)}
                className={`w-14 h-14 md:w-20 md:h-20 text-3xl md:text-4xl font-extrabold rounded-[1.5rem] flex items-center justify-center transition-transform duration-300 hover:-translate-y-2 shadow-sm active:scale-95 relative
                  ${done
                    ? 'bg-[#E1EFE8] text-green-700 border-[3px] border-[#9DB0A3]'
                    : 'bg-white text-[#d5968b] border-[3px] border-[#f0ded5] hover:border-[#d5968b]'
                  }`}>
                {l}
                {done && <span className="absolute -top-3 -right-3 text-2xl animate-bounce">⭐</span>}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // ─── TRACING VIEW ───
  return (
    <div className="flex flex-col items-center w-full animate-in zoom-in-95 duration-500" ref={containerRef}>

      {/* Back button */}
      <button onClick={() => { setSelectedLetter(null); letterDataRef.current = null; }}
        className="self-start mb-4 px-6 py-3 bg-white text-[#7ca79b] rounded-full font-bold shadow-sm hover:bg-[#eaf1ed] flex items-center gap-2 transition-all" dir="rtl">
        <span>חזור לאותיות</span> <span className="text-xl">↩</span>
      </button>

      {/* Step progress pills (multi-stroke) */}
      {strokes.length > 1 && !success && (
        <div className="flex gap-2 mb-3">
          {strokes.map((_, idx) => (
            <div key={idx} className="flex items-center gap-1">
              <div className={`rounded-full transition-all duration-300 ${
                idx < strokeIndex ? 'w-6 h-2 bg-[#4ade80]' :
                idx === strokeIndex ? 'w-10 h-2 bg-[#22c55e]' :
                'w-6 h-2 bg-gray-200'
              }`} />
              <span className={`text-xs font-bold ${
                idx <= strokeIndex ? 'text-[#22c55e]' : 'text-gray-300'
              }`}>{idx + 1}</span>
            </div>
          ))}
        </div>
      )}

      {/* Instruction text */}
      {!success && (
        <p className="text-base text-gray-400 mb-3 font-medium text-center" dir="rtl">
          {isDragging ? '!יופי, המשיכו לגרור 🎯' : 'גררו את העיגול הירוק לאורך השביל ☝️'}
        </p>
      )}

      {/* ═══ Main tracing area ═══ */}
      <div className="relative mx-auto" style={{ width: size, height: size }}>

        {/* Background frame */}
        <div className="absolute inset-0 bg-white rounded-[2.5rem] shadow-lg border-[5px] border-[#eaf1ed] overflow-hidden">
          {isHebrew && (
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
          )}
        </div>

        {/* ═══ SVG overlay ═══ */}
        <svg
          ref={svgRef}
          viewBox={`0 0 ${VB} ${VB}`}
          className="absolute inset-0 w-full h-full touch-none"
          style={{ zIndex: 20, cursor: isDragging ? 'grabbing' : 'default' }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          {/* English: gray text glyph */}
          {!isHebrew && (
            <text x="50" y="74" textAnchor="middle" fontSize="80" fontFamily="inherit"
              fontWeight="900" fill="#e2e8f0" className="select-none pointer-events-none">
              {selectedLetter}
            </text>
          )}

          {/* ─── All stroke paths ─── */}
          {strokes.map((stroke: StrokeData, idx: number) => {
            const done = idx < strokeIndex || success;
            const active = idx === strokeIndex && !success;
            const future = idx > strokeIndex && !success;

            return (
              <g key={stroke.id} className="pointer-events-none">

                {/* ── Completed stroke: SOLID GREEN ── */}
                {done && (
                  <path
                    d={stroke.path}
                    fill="none"
                    stroke="#4ade80"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}

                {/* ── Active stroke: DASHED GUIDE (gray dotted line) ── */}
                {active && (
                  <path
                    d={stroke.path}
                    fill="none"
                    stroke="#9ca3af"
                    strokeWidth="1.5"
                    strokeDasharray="4 6"
                  />
                )}

                {/* ── Active stroke: SOLID GREEN PROGRESS OVERLAY ── */}
                {/* This fills on top of the dashed guide as progress advances */}
                {active && pathLength > 0 && (
                  <path
                    d={stroke.path}
                    fill="none"
                    stroke="#22c55e"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray={pathLength}
                    strokeDashoffset={pathLength * (1 - progress)}
                  />
                )}

                {/* ── Future stroke: LIGHT DASHED (faint dotted hint) ── */}
                {future && (
                  <path
                    d={stroke.path}
                    fill="none"
                    stroke="#cbd5e1"
                    strokeWidth="1.5"
                    strokeDasharray="4 6"
                    opacity={0.6}
                  />
                )}

                {/* Step number label */}
                {strokes.length > 1 && !success && (
                  <text
                    x={stroke.startX + (isHebrew ? 8 : -8)}
                    y={stroke.startY - 5}
                    fontSize="7"
                    fontWeight="bold"
                    fontFamily="sans-serif"
                    fill={done ? '#4ade80' : active ? '#16a34a' : '#d1d5db'}
                    className="select-none pointer-events-none"
                  >
                    {idx + 1}
                  </text>
                )}
              </g>
            );
          })}

          {/* ─── Direction arrow (visible near start) ─── */}
          {arrowAngle !== null && !success && strokeIndex < strokes.length && (
            <g className="pointer-events-none" opacity={0.65}>
              {(() => {
                const pts = sampledRef.current;
                if (pts.length < 10) return null;
                const mid = pts[Math.min(8, pts.length - 1)];
                return (
                  <polygon
                    points="-3.5,-3 5,0 -3.5,3"
                    fill="#22c55e"
                    transform={`translate(${mid.x}, ${mid.y}) rotate(${(arrowAngle * 180) / Math.PI})`}
                  />
                );
              })()}
            </g>
          )}

          {/* ─── Handle circle ─── */}
          {handlePt && !success && strokeIndex < strokes.length && (
            <g style={{ cursor: isDragging ? 'grabbing' : 'grab' }}>
              {/* Large invisible hit area */}
              <circle cx={handlePt.x} cy={handlePt.y} r={GRAB_RADIUS} fill="transparent" />

              {/* Pulsing glow (idle only) */}
              {!isDragging && (
                <circle cx={handlePt.x} cy={handlePt.y} r={6}
                  fill="none" stroke="#22c55e" strokeWidth="1.5" opacity={0.4}>
                  <animate attributeName="r" values="6;10;6" dur="1.4s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.4;0.08;0.4" dur="1.4s" repeatCount="indefinite" />
                </circle>
              )}

              {/* Main circle */}
              <circle cx={handlePt.x} cy={handlePt.y}
                r={isDragging ? 5 : 4.5}
                fill="#22c55e" stroke="white" strokeWidth="1.5"
                style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}
              />

              {/* Center dot */}
              <circle cx={handlePt.x} cy={handlePt.y}
                r={1.5}
                fill="white"
                className="pointer-events-none"
              />
            </g>
          )}
        </svg>

        {/* ═══ Success overlay ═══ */}
        {success && (
          <div className="absolute inset-0 z-30 bg-white/85 backdrop-blur-sm rounded-[2.5rem] flex flex-col items-center justify-center animate-in zoom-in duration-500 shadow-inner p-4">
            <div className="text-7xl mb-4 animate-bounce">🥳</div>
            <h3 className="text-4xl md:text-5xl font-black text-[#618d7f] mb-3 drop-shadow-sm text-center">כל הכבוד!</h3>
            <p className="text-2xl text-[#7ca79b] font-bold mb-6 text-center px-4">רוצים אות נוספת?</p>
            <button onClick={() => { setSelectedLetter(null); letterDataRef.current = null; }}
              className="px-8 py-4 bg-[#7ca79b] hover:bg-[#618d7f] text-white rounded-[2rem] font-bold text-xl shadow-lg hover:-translate-y-1 transition-all">
              בחירת אות חדשה
            </button>
          </div>
        )}
      </div>

      {/* ═══ Reset button ═══ */}
      {!success && (
        <div className="mt-6 flex gap-4">
          <button onClick={resetLetter}
            className="px-6 py-3 bg-[#fef5f1] hover:bg-[#f0ded5] text-[#d5968b] rounded-[2rem] font-bold shadow-sm transition-all text-lg border-2 border-[#f0ded5]">
            התחל מחדש 🔄
          </button>
        </div>
      )}
    </div>
  );
}
