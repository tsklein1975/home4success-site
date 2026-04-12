"use client";

import React, { useState, useRef, useLayoutEffect, useCallback } from 'react';
import { LetterData } from '../_data/lettersData';

// Colors matching learnhebrewalphabet.com reference
const C = {
  guide:    '#E5E7EB',  // gray ghost for untraced strokes
  dashes:   '#8A0F11',  // dark red dashed guide + progress fill
  done:     '#22C55E',  // green for completed strokes
};

interface Props {
  letter: LetterData;
  onClose: () => void;
  lang?: 'he' | 'en';
}

export default function TracingEngine({ letter, onClose, lang = 'he' }: Props) {
  const totalStrokes = letter.strokes.length;
  const SW = letter.strokeWidth ?? 6;

  const [currentStroke, setCurrentStroke] = useState(0);
  const [completed, setCompleted]         = useState<boolean[]>(() => new Array(totalStrokes).fill(false));
  const [progress, setProgress]           = useState(0); // 0–1 for current stroke
  const [isDragging, setIsDragging]       = useState(false);
  const [isFinished, setIsFinished]       = useState(false);
  const [handlePos, setHandlePos]         = useState<{ x: number; y: number } | null>(null);

  const svgRef        = useRef<SVGSVGElement>(null);
  const activePathRef = useRef<SVGPathElement | null>(null);

  // Mutable refs so pointer handlers never capture stale state
  const progressRef      = useRef(0);
  const draggingRef      = useRef(false);
  const currentStrokeRef = useRef(0);
  const finishedRef      = useRef(false);

  // ── Reset on letter change ──────────────────────────────────────────────
  useLayoutEffect(() => {
    const blank = new Array(totalStrokes).fill(false);
    setCurrentStroke(0);   currentStrokeRef.current = 0;
    setCompleted(blank);
    setProgress(0);        progressRef.current = 0;
    setIsFinished(false);  finishedRef.current = false;
    setIsDragging(false);  draggingRef.current = false;
    setHandlePos(null);
  }, [letter, totalStrokes]);

  // ── Sync handle position after each relevant state change ───────────────
  useLayoutEffect(() => {
    const path = activePathRef.current;
    if (!path || isFinished) return;
    try {
      const total = path.getTotalLength();
      if (!total) return;
      const pt = path.getPointAtLength(progress * total);
      setHandlePos(h =>
        h && Math.abs(h.x - pt.x) < 0.01 && Math.abs(h.y - pt.y) < 0.01 ? h : { x: pt.x, y: pt.y }
      );
    } catch (_) {}
  }, [progress, currentStroke, isFinished]);

  // ── Helpers ─────────────────────────────────────────────────────────────
  const toSVG = (cx: number, cy: number) => {
    const svg = svgRef.current; if (!svg) return null;
    const pt = svg.createSVGPoint();
    pt.x = cx; pt.y = cy;
    const ctm = svg.getScreenCTM(); if (!ctm) return null;
    const r = pt.matrixTransform(ctm.inverse());
    return { x: r.x, y: r.y };
  };

  const findNearest = (path: SVGPathElement, pt: { x: number; y: number }, fromLen: number, totalLen: number) => {
    const end = Math.min(totalLen, fromLen + 30);
    let bestDist = Infinity, bestLen = fromLen;
    for (let l = fromLen; l <= end; l += 0.5) {
      const p = path.getPointAtLength(l);
      const d = Math.hypot(p.x - pt.x, p.y - pt.y);
      if (d < bestDist) { bestDist = d; bestLen = l; }
    }
    return { bestLen, bestDist };
  };

  // ── Pointer handlers ────────────────────────────────────────────────────
  const onPointerDown = useCallback((e: React.PointerEvent<SVGSVGElement>) => {
    if (finishedRef.current) return;
    const path = activePathRef.current; if (!path) return;
    const svgPt = toSVG(e.clientX, e.clientY); if (!svgPt) return;
    const total = path.getTotalLength();
    const tip = path.getPointAtLength(progressRef.current * total);
    if (Math.hypot(tip.x - svgPt.x, tip.y - svgPt.y) < 28) {
      draggingRef.current = true;
      setIsDragging(true);
      e.currentTarget.setPointerCapture(e.pointerId);
    }
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent<SVGSVGElement>) => {
    if (!draggingRef.current || finishedRef.current) return;
    const path = activePathRef.current; if (!path) return;
    const svgPt = toSVG(e.clientX, e.clientY); if (!svgPt) return;

    const total = path.getTotalLength();
    const curLen = progressRef.current * total;
    const { bestLen, bestDist } = findNearest(path, svgPt, curLen, total);

    if (bestDist > 22) { draggingRef.current = false; setIsDragging(false); return; }
    if (bestLen <= curLen + 0.01) return; // no going backwards

    const newProg = Math.min(bestLen / total, 1);
    progressRef.current = newProg;
    setProgress(newProg);

    if (bestLen >= total - 1.5) {
      // ── Stroke complete ──
      draggingRef.current = false; setIsDragging(false);
      progressRef.current = 1;    setProgress(1);

      const idx = currentStrokeRef.current;
      setCompleted(prev => { const n = [...prev]; n[idx] = true; return n; });

      if (idx < totalStrokes - 1) {
        setTimeout(() => {
          currentStrokeRef.current = idx + 1;
          progressRef.current = 0;
          setCurrentStroke(idx + 1);
          setProgress(0);
        }, 350);
      } else {
        setTimeout(() => { finishedRef.current = true; setIsFinished(true); }, 350);
      }
    }
  }, [totalStrokes]);

  const onPointerUp = useCallback((e: React.PointerEvent<SVGSVGElement>) => {
    draggingRef.current = false; setIsDragging(false);
    try { e.currentTarget.releasePointerCapture(e.pointerId); } catch (_) {}
  }, []);

  const reset = () => {
    const blank = new Array(totalStrokes).fill(false);
    setCurrentStroke(0);   currentStrokeRef.current = 0;
    setCompleted(blank);
    setProgress(0);        progressRef.current = 0;
    setIsFinished(false);  finishedRef.current = false;
    setIsDragging(false);  draggingRef.current = false;
    setHandlePos(null);
  };

  const isHe = lang === 'he';

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto px-4 py-6 select-none" dir={isHe ? 'rtl' : 'ltr'}>

      {/* Header */}
      <div className="flex w-full justify-between items-center mb-4">
        <h2 className="text-3xl font-bold text-gray-800">
          {letter.char}
          <span className="text-lg font-medium text-[#8aab9f] mr-3">{letter.name}</span>
        </h2>
        <button onClick={onClose} className="text-[#8aab9f] font-bold px-4 py-2 bg-white border-2 border-[#8aab9f]/30 hover:border-[#8aab9f] rounded-full transition-all text-sm">
          {isHe ? '← רְשִׁימָה' : '← Back'}
        </button>
      </div>

      {/* Stroke progress dots */}
      {totalStrokes > 1 && (
        <div className="flex gap-2 mb-4 justify-center">
          {letter.strokes.map((_, i) => (
            <span key={i} className={`w-3 h-3 rounded-full transition-all ${
              completed[i]        ? 'bg-green-500 scale-110' :
              i === currentStroke ? 'bg-amber-400 scale-125 ring-2 ring-amber-300' :
                                    'bg-gray-300'
            }`} />
          ))}
        </div>
      )}

      {/* Instruction */}
      <p className="text-base text-gray-500 font-medium mb-5 text-center min-h-6 px-2">
        {isFinished
          ? (isHe ? '🎉 כָּל הַכָּבוֹד!' : '🎉 Great job!')
          : (isHe ? 'גְּרֹר אֶת הָעִגּוּל לְאֹרֶךְ הַנְּקֻדּוֹת!' : 'Drag the circle along the dots!')}
      </p>

      {/* ── Tracing board ── */}
      <div className="relative w-full max-w-[380px] aspect-square rounded-3xl overflow-hidden shadow-xl border-4 border-amber-200 bg-amber-50">
        <svg
          ref={svgRef}
          viewBox="0 0 100 100"
          className="absolute inset-0 w-full h-full"
          style={{ touchAction: 'none', cursor: isDragging ? 'grabbing' : 'grab' }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          {/* ── HEBREW: Show the ACTUAL character as an SVG text element ── */}
          {/* This guarantees the tracing guide looks IDENTICAL to the header */}
          {isHe && (
            <>
              {/* Faint filled letter guide */}
              <text
                x="50"
                y="78"
                textAnchor="middle"
                fontFamily="'Heebo', 'Arial Hebrew', 'David', sans-serif"
                fontSize="70"
                fontWeight="700"
                fill={C.guide}
                fillOpacity="0.35"
                style={{ userSelect: 'none', pointerEvents: 'none' }}
              >
                {letter.char}
              </text>
              {/* Dotted outline of the same letter — tracing guide dots */}
              <text
                x="50"
                y="78"
                textAnchor="middle"
                fontFamily="'Heebo', 'Arial Hebrew', 'David', sans-serif"
                fontSize="70"
                fontWeight="700"
                fill="none"
                stroke={C.dashes}
                strokeWidth="0.7"
                strokeDasharray="1.5 4"
                strokeOpacity="0.5"
                paintOrder="stroke"
                style={{ userSelect: 'none', pointerEvents: 'none' }}
              >
                {letter.char}
              </text>
            </>
          )}

          {/* ── LAYER 1: Gray ghost for every stroke ── */}
          {/* Hebrew: nearly invisible (just for drag). English: fully visible. */}
          {letter.strokes.map((s, i) => (
            <path
              key={`ghost-${i}`}
              d={s.path}
              fill="none"
              stroke={completed[i] ? C.done : C.guide}
              strokeWidth={SW}
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={isHe ? 0 : (completed[i] ? 0.3 : 0.5)}
            />
          ))}

          {/* ── LAYER 2: Thin dashed direction guide on ACTIVE stroke ── */}
          {!isFinished && (
            <path
              d={letter.strokes[currentStroke].path}
              fill="none"
              stroke={C.dashes}
              strokeWidth={SW * 0.3}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="2 8"
              opacity={isHe ? 0 : 0.4}
            />
          )}

          {/* ── LAYER 3: Thick progress reveal on ACTIVE stroke ── */}
          {!isFinished && (
            <path
              ref={activePathRef}
              d={letter.strokes[currentStroke].path}
              fill="none"
              stroke={C.dashes}
              strokeWidth={SW}
              strokeLinecap="round"
              strokeLinejoin="round"
              pathLength="1"
              strokeDashoffset="0"
              strokeDasharray={`${progress} 1`}
              opacity={isHe ? 0 : 1}
            />
          )}

          {/* ── LAYER 4: Completed strokes ── */}
          {letter.strokes.map((s, i) =>
            completed[i] && (
              <path
                key={`done-${i}`}
                d={s.path}
                fill="none"
                stroke={C.done}
                strokeWidth={SW}
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={isHe ? 0 : 1}
              />
            )
          )}

          {/* ── HEBREW: Green filled letter on completion ── */}
          {isHe && isFinished && (
            <text
              x="50"
              y="78"
              textAnchor="middle"
              fontFamily="'Heebo', 'Arial Hebrew', 'David', sans-serif"
              fontSize="70"
              fontWeight="700"
              fill={C.done}
              fillOpacity="0.5"
              style={{ userSelect: 'none', pointerEvents: 'none' }}
            >
              {letter.char}
            </text>
          )}

          {/* ── LAYER 5: Draggable handle circle at current tip ── */}
          {!isFinished && handlePos && (
            <g transform={`translate(${handlePos.x},${handlePos.y})`} style={{ pointerEvents: 'none' }}>
              <circle r={isDragging ? 10 : 8} fill={C.dashes} opacity={0.15} />
              <circle r="5" fill={C.dashes} stroke="white" strokeWidth="2" />
            </g>
          )}

          {/* ── START dot ── */}
          {!isFinished && progress === 0 && (() => {
            const p = activePathRef.current;
            if (!p) return null;
            try {
              const s = p.getPointAtLength(0);
              return (
                <g style={{ pointerEvents: 'none' }}>
                  <circle cx={s.x} cy={s.y} r={10} fill={C.dashes} opacity={0.1} />
                  <circle cx={s.x} cy={s.y} r={5} fill={C.dashes} stroke="white" strokeWidth="2" />
                </g>
              );
            } catch (_) { return null; }
          })()}
        </svg>

        {/* Completion overlay */}
        {isFinished && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm rounded-3xl gap-4">
            <span className="text-6xl">🌟</span>
            <span className="text-5xl font-bold text-green-500">{letter.char}</span>
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="flex gap-4 mt-6">
        <button onClick={reset} className="px-6 py-3 bg-white text-gray-600 border-2 border-gray-200 rounded-full font-semibold hover:border-[#8aab9f] transition-all">
          {isHe ? '↺ נַסּוּ שׁוּב' : '↺ Try again'}
        </button>
        {isFinished && (
          <button onClick={onClose} className="px-8 py-3 bg-[#8aab9f] text-white rounded-full font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all">
            {isHe ? 'לָאוֹת הַבָּאָה ←' : 'Next letter →'}
          </button>
        )}
      </div>
    </div>
  );
}
