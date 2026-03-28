'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { englishLetters } from './lettersDataSVG';
import hebrewStrokeGuides from './hebrewStrokeGuides';

interface Point { x: number; y: number }

interface TracingGameProps {
  title: string;
  letters: string[];
  lang: 'he' | 'en';
}

// ─── Tuning constants ───
const VB = 100;                // SVG viewBox size
const NUM_SAMPLES = 200;       // points sampled along each stroke path
const GRAB_RADIUS = 22;        // how close pointer must be to handle to start drag (VB units)
const PATH_TOLERANCE = 24;     // max distance from path to count as valid drag (VB units)
const LOOK_AHEAD = 45;         // max sample-point forward search window
const COMPLETION_THRESHOLD = 0.85; // progress fraction to auto-complete a stroke

export default function TracingGame({ title, letters, lang }: TracingGameProps) {
  // ─── Core state ───
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [strokeIndex, setStrokeIndex] = useState(0);
  const [progress, setProgress] = useState(0);       // 0.0–1.0 along active stroke
  const [pathLength, setPathLength] = useState(0);    // SVG path total length (STATE for re-render!)
  const [isDragging, setIsDragging] = useState(false);
  const [success, setSuccess] = useState(false);
  const [stars, setStars] = useState<string[]>([]);

  // ─── Refs (perf: no re-render needed) ───
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const displayCanvasRef = useRef<HTMLCanvasElement>(null);
  const sampledRef = useRef<Point[]>([]);
  const progressRef = useRef(0);  // mutable mirror of progress (avoids stale closures)

  const isHebrew = lang === 'he';

  // Keep progressRef in sync
  useEffect(() => { progressRef.current = progress; }, [progress]);

  // ─── Get stroke paths for a character ───
  const getStrokePaths = useCallback((char: string): string[] | null => {
    if (isHebrew) {
      const g = hebrewStrokeGuides[char];
      return g ? g.strokes.map(s => s.path) : null;
    }
    return englishLetters[char] || null;
  }, [isHebrew]);

  const getCanvasSize = useCallback(() => {
    if (!containerRef.current) return 320;
    return Math.min(containerRef.current.clientWidth * 0.92, 380);
  }, []);

  // ─── Measure path: create temp SVG, compute length + sample points ───
  // This avoids all timing/mount issues — works synchronously.
  const measurePath = useCallback((pathD: string) => {
    const ns = 'http://www.w3.org/2000/svg';
    const tempSvg = document.createElementNS(ns, 'svg');
    tempSvg.setAttribute('viewBox', `0 0 ${VB} ${VB}`);
    tempSvg.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden;pointer-events:none';
    const pathEl = document.createElementNS(ns, 'path');
    pathEl.setAttribute('d', pathD);
    tempSvg.appendChild(pathEl);
    document.body.appendChild(tempSvg);

    const len = pathEl.getTotalLength();
    const pts: Point[] = [];
    for (let i = 0; i <= NUM_SAMPLES; i++) {
      const p = pathEl.getPointAtLength((i / NUM_SAMPLES) * len);
      pts.push({ x: p.x, y: p.y });
    }
    document.body.removeChild(tempSvg);

    sampledRef.current = pts;
    setPathLength(len);      // STATE → triggers re-render → strokeDasharray updates
  }, []);

  // ─── Hebrew: draw gray glyph on canvas ───
  const drawHebrewGlyph = useCallback((char: string) => {
    const size = getCanvasSize();
    const dc = displayCanvasRef.current;
    if (!dc) return;
    dc.width = size;
    dc.height = size;
    const ctx = dc.getContext('2d')!;
    let ff = 'system-ui, sans-serif';
    if (containerRef.current) ff = window.getComputedStyle(containerRef.current).fontFamily || ff;
    ctx.font = `900 ${size * 0.65}px ${ff}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#e2e8f0';
    ctx.fillText(char, size / 2, size * 0.52);
  }, [getCanvasSize]);

  // ─── Convert pointer event → SVG viewBox coordinates ───
  const toSvg = useCallback((e: React.PointerEvent): Point => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const r = svg.getBoundingClientRect();
    return {
      x: ((e.clientX - r.left) / r.width) * VB,
      y: ((e.clientY - r.top) / r.height) * VB,
    };
  }, []);

  // ─── Get handle point from current progress ───
  const getHandlePoint = useCallback((): Point | null => {
    const pts = sampledRef.current;
    if (!pts.length) return null;
    const idx = Math.min(Math.round(progress * (pts.length - 1)), pts.length - 1);
    return pts[idx];
  }, [progress]);

  // ─── Get direction arrow data (angle from start) ───
  const getArrowData = useCallback((): { x: number; y: number; angle: number } | null => {
    const pts = sampledRef.current;
    if (pts.length < 10) return null;
    const start = pts[0];
    const ahead = pts[Math.min(12, pts.length - 1)];
    const angle = Math.atan2(ahead.y - start.y, ahead.x - start.x);
    // Position arrow slightly ahead of start
    const mid = pts[Math.min(6, pts.length - 1)];
    return { x: mid.x, y: mid.y, angle };
  }, []);

  // ─── Complete the current stroke ───
  const completeStroke = useCallback(() => {
    setProgress(1);
    progressRef.current = 1;
    setIsDragging(false);

    const paths = selectedLetter ? getStrokePaths(selectedLetter) : null;
    if (!paths) return;

    setTimeout(() => {
      if (strokeIndex + 1 < paths.length) {
        setStrokeIndex(prev => prev + 1);
        setProgress(0);
        progressRef.current = 0;
      } else {
        setSuccess(true);
        if (selectedLetter && !stars.includes(selectedLetter)) {
          setStars(prev => [...prev, selectedLetter]);
        }
      }
    }, 350);
  }, [selectedLetter, strokeIndex, getStrokePaths, stars]);

  // ─── Pointer down: start dragging if near handle ───
  const onPointerDown = useCallback((e: React.PointerEvent) => {
    if (success) return;
    e.preventDefault();
    const pt = toSvg(e);
    const pts = sampledRef.current;
    if (!pts.length) return;

    const curIdx = Math.min(Math.round(progressRef.current * (pts.length - 1)), pts.length - 1);
    const handlePt = pts[curIdx];
    const dist = Math.hypot(pt.x - handlePt.x, pt.y - handlePt.y);

    if (dist < GRAB_RADIUS) {
      setIsDragging(true);
      // Capture pointer for reliable tracking even if pointer leaves SVG
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

    const curProg = progressRef.current;
    const curIdx = Math.round(curProg * (pts.length - 1));
    const searchEnd = Math.min(curIdx + LOOK_AHEAD, pts.length - 1);

    // Find closest point on path ahead of current position
    let bestIdx = curIdx;
    let bestDist = Infinity;
    for (let i = curIdx; i <= searchEnd; i++) {
      const d = Math.hypot(pts[i].x - pt.x, pts[i].y - pt.y);
      if (d < bestDist) { bestDist = d; bestIdx = i; }
    }

    // Only advance if pointer is close enough to the path AND moving forward
    if (bestDist < PATH_TOLERANCE && bestIdx > curIdx) {
      const newProg = bestIdx / (pts.length - 1);
      setProgress(newProg);
      progressRef.current = newProg;

      if (newProg >= COMPLETION_THRESHOLD) {
        completeStroke();
      }
    }
  }, [isDragging, success, toSvg, completeStroke]);

  // ─── Pointer up: stop dragging, keep progress ───
  const onPointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // ─── Init game for a letter ───
  const initGame = useCallback((char: string) => {
    setSelectedLetter(char);
    setStrokeIndex(0);
    setProgress(0);
    progressRef.current = 0;
    setSuccess(false);
    setIsDragging(false);
    if (isHebrew) setTimeout(() => drawHebrewGlyph(char), 50);
  }, [isHebrew, drawHebrewGlyph]);

  // ─── Reset current letter ───
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
    if (!selectedLetter || success) return;
    const paths = getStrokePaths(selectedLetter);
    if (!paths || strokeIndex >= paths.length) return;
    measurePath(paths[strokeIndex]);
  }, [selectedLetter, strokeIndex, success, measurePath, getStrokePaths]);

  // ═══════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════

  const size = getCanvasSize();
  const strokePaths = selectedLetter ? getStrokePaths(selectedLetter) : null;
  const handlePt = getHandlePoint();
  const arrowData = progress < 0.15 ? getArrowData() : null;

  // ─── Grid view ───
  if (!selectedLetter) {
    return (
      <div className="flex flex-col items-center animate-in fade-in duration-500">
        <h2 className="text-2xl md:text-3xl font-bold text-[#7ca79b] mb-6">{title}</h2>
        <div className="flex flex-wrap justify-center gap-3 md:gap-4 max-w-4xl" dir={isHebrew ? 'rtl' : 'ltr'}>
          {letters.map((l, i) => {
            if (!getStrokePaths(l)) return null;
            const done = stars.includes(l);
            return (
              <button key={i} onClick={() => initGame(l)}
                className={`w-14 h-14 md:w-20 md:h-20 text-3xl md:text-4xl font-extrabold rounded-[1.5rem] flex items-center justify-center transition-transform duration-300 hover:-translate-y-2 shadow-sm active:scale-95 relative
                  ${done ? 'bg-[#E1EFE8] text-green-700 border-[3px] border-[#9DB0A3]' : 'bg-white text-[#d5968b] border-[3px] border-[#f0ded5] hover:border-[#d5968b]'}`}>
                {l}
                {done && <span className="absolute -top-3 -right-3 text-2xl animate-bounce">⭐</span>}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // ─── Tracing view ───
  return (
    <div className="flex flex-col items-center w-full animate-in zoom-in-95 duration-500" ref={containerRef}>
      {/* Back button */}
      <button onClick={() => setSelectedLetter(null)}
        className="self-start mb-4 px-6 py-3 bg-white text-[#7ca79b] rounded-full font-bold shadow-sm hover:bg-[#eaf1ed] flex items-center gap-2 transition-all" dir="rtl">
        <span>חזור לאותיות</span> <span className="text-xl">↩</span>
      </button>

      {/* Stroke progress pills (multi-stroke letters) */}
      {strokePaths && strokePaths.length > 1 && !success && (
        <div className="flex gap-2 mb-3">
          {strokePaths.map((_, idx) => (
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

      {/* Instruction */}
      {!success && (
        <p className="text-base text-gray-400 mb-3 font-medium text-center" dir="rtl">
          {isDragging ? '!יופי, המשיכו לגרור 🎯' : 'גררו את העיגול הירוק לאורך השביל ☝️'}
        </p>
      )}

      {/* ═══ Main tracing area ═══ */}
      <div className="relative mx-auto" style={{ width: size, height: size }}>

        {/* Background container */}
        <div className="absolute inset-0 bg-white rounded-[2.5rem] shadow-lg border-[5px] border-[#eaf1ed] overflow-hidden">
          {/* Hebrew: canvas gray letter */}
          {isHebrew && (
            <canvas ref={displayCanvasRef} className="absolute inset-0 w-full h-full" />
          )}
        </div>

        {/* ═══ Interactive SVG (on top of everything) ═══ */}
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
          {/* English: gray text glyph background */}
          {!isHebrew && (
            <text x="50" y="74" textAnchor="middle" fontSize="80" fontFamily="inherit"
              fontWeight="900" fill="#e2e8f0" className="select-none pointer-events-none">
              {selectedLetter}
            </text>
          )}

          {/* ─── Render ALL strokes ─── */}
          {strokePaths?.map((pathD, idx) => {
            const isCompleted = idx < strokeIndex || success;
            const isActive = idx === strokeIndex && !success;
            const isFuture = idx > strokeIndex && !success;

            return (
              <g key={`s-${idx}`} className="pointer-events-none">
                {/* Base guide path (always visible) */}
                <path
                  d={pathD}
                  fill="none"
                  stroke={isCompleted ? '#4ade80' : isActive ? '#d1d5db' : '#e5e7eb'}
                  strokeWidth={isActive ? '10' : '8'}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity={isFuture ? 0.35 : 1}
                />

                {/* Active stroke: GREEN PROGRESS FILL */}
                {isActive && pathLength > 0 && (
                  <path
                    d={pathD}
                    fill="none"
                    stroke="#22c55e"
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray={pathLength}
                    strokeDashoffset={pathLength * (1 - progress)}
                  />
                )}

                {/* Step number labels for multi-stroke */}
                {strokePaths.length > 1 && !success && isHebrew && (
                  (() => {
                    const guide = hebrewStrokeGuides[selectedLetter!];
                    if (!guide) return null;
                    const s = guide.strokes[idx];
                    return (
                      <text x={s.startX + 8} y={s.startY - 4} fontSize="7"
                        fontWeight="bold" fontFamily="sans-serif"
                        fill={isCompleted ? '#4ade80' : isActive ? '#16a34a' : '#d1d5db'}
                        className="select-none pointer-events-none">
                        {idx + 1}
                      </text>
                    );
                  })()
                )}
              </g>
            );
          })}

          {/* ─── Direction arrow (shown near start when progress is low) ─── */}
          {arrowData && !success && strokeIndex < (strokePaths?.length || 0) && (
            <g className="pointer-events-none" opacity={0.7}>
              <polygon
                points="-5,-4 7,0 -5,4"
                fill="#22c55e"
                transform={`translate(${arrowData.x}, ${arrowData.y}) rotate(${(arrowData.angle * 180) / Math.PI})`}
              />
            </g>
          )}

          {/* ─── Draggable handle circle ─── */}
          {handlePt && !success && strokeIndex < (strokePaths?.length || 0) && (
            <g style={{ cursor: isDragging ? 'grabbing' : 'grab' }}>
              {/* Large invisible hit area */}
              <circle cx={handlePt.x} cy={handlePt.y} r={GRAB_RADIUS}
                fill="transparent" />

              {/* Pulsing glow ring (only when not dragging) */}
              {!isDragging && (
                <circle cx={handlePt.x} cy={handlePt.y} r={10}
                  fill="none" stroke="#22c55e" strokeWidth="2" opacity={0.4}>
                  <animate attributeName="r" values="10;16;10" dur="1.5s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.4;0.1;0.4" dur="1.5s" repeatCount="indefinite" />
                </circle>
              )}

              {/* Main handle circle */}
              <circle cx={handlePt.x} cy={handlePt.y}
                r={isDragging ? 8 : 7}
                fill="#22c55e"
                stroke="white"
                strokeWidth="3"
                style={{ filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.25))' }}
              />

              {/* Center dot */}
              <circle cx={handlePt.x} cy={handlePt.y}
                r={isDragging ? 3 : 2.5}
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
            <button onClick={() => setSelectedLetter(null)}
              className="px-8 py-4 bg-[#7ca79b] hover:bg-[#618d7f] text-white rounded-[2rem] font-bold text-xl shadow-lg hover:-translate-y-1 transition-all">
              בחירת אות חדשה
            </button>
          </div>
        )}
      </div>

      {/* ═══ Controls below tracing area ═══ */}
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
