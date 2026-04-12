'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import hebrewStrokeGuides from './hebrewStrokeGuides';
import html2canvas from 'html2canvas-pro';
import { jsPDF } from 'jspdf';

// ─── Letter → word + emoji associations ───
const LETTER_ASSOC: Record<string, { word: string; emoji: string }> = {
  'א': { word: 'אַרְיֵה', emoji: '🦁' },
  'ב': { word: 'בֶּרֶז', emoji: '🚰' },
  'ג': { word: 'גְּלִידָה', emoji: '🍦' },
  'ד': { word: 'דֶּלֶת', emoji: '🚪' },
  'ה': { word: 'הֶלִיקוֹפְּטֶר', emoji: '🚁' },
  'ו': { word: 'וֶרֶד', emoji: '🌹' },
  'ז': { word: 'זֵיתִים', emoji: '🫒' },
  'ח': { word: 'חֵץ', emoji: '🏹' },
  'ט': { word: 'טַוָּס', emoji: '🦚' },
  'י': { word: 'יַנְשׁוּף', emoji: '🦉' },
  'כ': { word: 'כָּרִיךְ', emoji: '🥪' },
  'ל': { word: 'לָמָה', emoji: '🦙' },
  'מ': { word: 'מְדוּזָה', emoji: '🪼' },
  'נ': { word: 'נוּרָה', emoji: '💡' },
  'ס': { word: 'סוּס', emoji: '🐴' },
  'ע': { word: 'עַיִן', emoji: '👁️' },
  'פ': { word: 'פִּיל', emoji: '🐘' },
  'צ': { word: 'צָב', emoji: '🐢' },
  'ק': { word: 'קוּקִיָּה', emoji: '🕰️' },
  'ר': { word: 'רֶשֶׁת', emoji: '🦋' },
  'ש': { word: 'שֵׁן', emoji: '🦷' },
  'ת': { word: 'תַּרְנְגוֹלֶת', emoji: '🐔' },
};

// Background colors per letter page
const PAGE_COLORS = [
  '#4fa5d6', '#e8a745', '#e05555', '#5cb85c', '#e8724a',
  '#9b59b6', '#3498db', '#c0855a', '#e74c8c', '#2ecc71',
  '#e67e22', '#1abc9c', '#e74c3c', '#3498db', '#8e44ad',
  '#27ae60', '#d35400', '#c0392b', '#16a085', '#f39c12',
  '#2980b9', '#e91e63',
];

export default function NotebookTracingGame({ onBack }: { onBack?: () => void }) {
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);

  // Freehand drawing
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const printableRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Canvas setup
  const setupCanvas = useCallback(() => {
    if (!canvasRef.current || !containerRef.current) return;
    const canvas = canvasRef.current;
    const rect = containerRef.current.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(dpr, dpr);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#2563eb';
    }
  }, []);

  useEffect(() => {
    if (selectedLetter) {
      const t = setTimeout(setupCanvas, 80);
      window.addEventListener('resize', setupCanvas);
      return () => { clearTimeout(t); window.removeEventListener('resize', setupCanvas); };
    }
  }, [selectedLetter, setupCanvas]);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  // ── Download as PDF ──
  const downloadPDF = async () => {
    if (!printableRef.current || !selectedLetter) return;
    setIsExporting(true);
    try {
      // Temporarily merge the drawing canvas onto the notebook background
      const drawCanvas = canvasRef.current;
      const container = containerRef.current;
      let mergedCanvas: HTMLCanvasElement | null = null;
      if (drawCanvas && container) {
        const rect = container.getBoundingClientRect();
        mergedCanvas = document.createElement('canvas');
        mergedCanvas.width = rect.width * 2;
        mergedCanvas.height = rect.height * 2;
        const mCtx = mergedCanvas.getContext('2d');
        if (mCtx) {
          mCtx.scale(2, 2);
          // Draw notebook background
          mCtx.fillStyle = '#faf8f3';
          mCtx.fillRect(0, 0, rect.width, rect.height);
          // Draw lines
          const rowH = rect.height / 3;
          for (let r = 0; r < 3; r++) {
            const centerY = r * rowH + rowH / 2;
            mCtx.strokeStyle = '#d4956a';
            mCtx.lineWidth = 2.5;
            mCtx.beginPath(); mCtx.moveTo(0, centerY - 36); mCtx.lineTo(rect.width, centerY - 36); mCtx.stroke();
            mCtx.beginPath(); mCtx.moveTo(0, centerY + 36); mCtx.lineTo(rect.width, centerY + 36); mCtx.stroke();
            // Gray letters
            mCtx.font = "900 60px 'Heebo', 'Arial Hebrew', sans-serif";
            mCtx.fillStyle = 'rgba(0,0,0,0.08)';
            mCtx.textAlign = 'right';
            mCtx.textBaseline = 'middle';
            const startX = rect.width - 30;
            for (let g = 0; g < 3; g++) {
              mCtx.fillText(selectedLetter, startX - g * 90, centerY);
            }
          }
          // Overlay user drawing
          mCtx.drawImage(drawCanvas, 0, 0, rect.width, rect.height);
        }
      }

      // Capture the top reference card
      const topCard = printableRef.current.querySelector('[data-ref-card]') as HTMLElement;
      const topCanvas = topCard ? await html2canvas(topCard, { scale: 2, useCORS: true, backgroundColor: null }) : null;

      // Build the PDF
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pageW = pdf.internal.pageSize.getWidth();
      const margin = 10;
      const contentW = pageW - margin * 2;
      let yPos = margin;

      // Add top reference card
      if (topCanvas) {
        const ratio = topCanvas.height / topCanvas.width;
        const imgH = contentW * ratio;
        pdf.addImage(topCanvas.toDataURL('image/png'), 'PNG', margin, yPos, contentW, imgH);
        yPos += imgH + 5;
      }

      // Add notebook area
      if (mergedCanvas) {
        const ratio = mergedCanvas.height / mergedCanvas.width;
        const imgH = contentW * ratio;
        if (yPos + imgH > pdf.internal.pageSize.getHeight() - margin) {
          pdf.addPage();
          yPos = margin;
        }
        pdf.addImage(mergedCanvas.toDataURL('image/png'), 'PNG', margin, yPos, contentW, imgH);
      }

      pdf.save(`letter-${selectedLetter}.pdf`);
    } catch (err) {
      console.error('PDF export error:', err);
    } finally {
      setIsExporting(false);
    }
  };

  // Pointer handlers
  const getPos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const r = canvasRef.current?.getBoundingClientRect();
    if (!r) return { x: 0, y: 0 };
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };
  const startDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if ((e.target as Element).hasPointerCapture(e.pointerId))
      (e.target as Element).releasePointerCapture(e.pointerId);
    setIsDrawing(true);
    const { x, y } = getPos(e);
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) { ctx.beginPath(); ctx.moveTo(x, y); }
  };
  const draw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault();
    const { x, y } = getPos(e);
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) { ctx.lineTo(x, y); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x, y); }
  };
  const stopDrawing = () => {
    setIsDrawing(false);
    canvasRef.current?.getContext('2d')?.beginPath();
  };

  const getColor = (letter: string) => {
    const keys = Object.keys(hebrewStrokeGuides);
    return PAGE_COLORS[keys.indexOf(letter) % PAGE_COLORS.length];
  };

  // ── GRID VIEW ──
  if (!selectedLetter) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-6" dir="rtl">
        {/* Top Navigation */}
        {onBack && (
          <button onClick={onBack} className="self-start text-[#8aab9f] font-bold mb-4 block hover:underline">
            ← חֲזֹר לַמִּשְׂחָקִים
          </button>
        )}

        <div className="w-full bg-white rounded-3xl shadow-lg p-6 sm:p-12 border-4 border-[#f0e6ce] animate-in fade-in duration-500">
          <h2 className="text-3xl md:text-4xl font-black text-[#518274] mb-8 text-center">
            מַחְבֶּרֶת כְּתִיבָה ✏️
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {Object.keys(hebrewStrokeGuides).map((l, i) => (
              <button key={i} onClick={() => setSelectedLetter(l)}
                className="w-16 h-16 md:w-24 md:h-24 bg-gray-50 hover:bg-[#eaf1ed] text-[#4a4a4a] text-4xl md:text-5xl font-extrabold rounded-3xl flex items-center justify-center transition-transform hover:scale-105 shadow-md border-4 border-transparent hover:border-[#7ca79b]">
                {l}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── TRACING VIEW ──
  const assoc = LETTER_ASSOC[selectedLetter] || { word: 'מילה', emoji: '✨' };
  const bgColor = getColor(selectedLetter);

  return (
    <div ref={printableRef} className="flex flex-col items-center w-full max-w-5xl mx-auto px-4 py-6 select-none" dir="rtl">

      {/* Action bar */}
      <div className="flex justify-between w-full items-center mb-5">
        <button onClick={() => setSelectedLetter(null)}
          className="px-5 py-2 bg-white text-[#7ca79b] rounded-full font-bold shadow-sm hover:bg-[#eaf1ed] flex items-center gap-2 transition-all">
          <span className="text-xl">↩</span> כָּל הָאוֹתִיּוֹת
        </button>
        <div className="flex gap-3">
          <button onClick={downloadPDF} disabled={isExporting}
            className="px-5 py-2 bg-[#eef6ff] text-[#2563eb] hover:bg-[#dbeafe] rounded-full font-bold shadow-sm transition-all disabled:opacity-50 flex items-center gap-2">
            {isExporting ? '⌛ מְיַצֵּא...' : '📥 הוֹרֵד PDF'}
          </button>
          <button onClick={clearCanvas}
            className="px-5 py-2 bg-[#fef5f1] text-[#d5968b] hover:bg-[#f0ded5] rounded-full font-bold shadow-sm transition-all">
            נַקֵּה מַחְבֶּרֶת ✍️
          </button>
        </div>
      </div>

      {/* ══════════════════════════════════
           TOP: Reference card
           ══════════════════════════════════ */}
      <div
        data-ref-card
        className="w-full rounded-[2rem] shadow-lg border-4 border-white/60 mb-6 flex flex-row items-stretch overflow-hidden"
        style={{ backgroundColor: bgColor, minHeight: 280 }}
      >
        {/* Emoji + word */}
        <div className="flex-1 flex flex-col items-center justify-center gap-3 p-6">
          <div className="text-7xl md:text-8xl drop-shadow-md">{assoc.emoji}</div>
          <div className="text-3xl md:text-5xl font-extrabold text-white drop-shadow-md tracking-wide">
            {assoc.word}
          </div>
        </div>

        {/* Large clear letter */}
        <div className="flex-1 flex items-center justify-center p-4">
          <span
            className="text-white drop-shadow-lg select-none pointer-events-none"
            style={{
              fontSize: 'clamp(120px, 20vw, 200px)',
              fontWeight: 900,
              fontFamily: "'Heebo', 'Arial Hebrew', sans-serif",
              lineHeight: 1,
              textShadow: '0 4px 20px rgba(0,0,0,0.15)',
            }}
          >
            {selectedLetter}
          </span>
        </div>
      </div>

      {/* ══════════════════════════════════
           BOTTOM: Drawing notebook
           ══════════════════════════════════ */}
      <div
        ref={containerRef}
        className="w-full bg-[#faf8f3] rounded-xl shadow-inner border-2 border-slate-200 overflow-hidden relative cursor-crosshair"
        style={{ touchAction: 'none', minHeight: 420 }}
      >
        {/* Notebook lines background */}
        <div className="absolute inset-0 flex flex-col pointer-events-none">
          {[0, 1, 2].map((row) => (
            <div key={row} className="flex-1 relative">
              {/* Two solid orange lines per row */}
              <div className="absolute inset-x-0 top-1/2 -translate-y-[36px] h-[72px]">
                <div className="absolute top-0 w-full border-t-[2.5px] border-[#d4956a]" />
                <div className="absolute bottom-0 w-full border-t-[2.5px] border-[#d4956a]" />
              </div>

              {/* Faint gray reference letter in each row */}
              <div className="absolute inset-0 flex items-center gap-4 md:gap-10 px-6 md:px-10" dir="rtl">
                {[0, 1, 2].map((gi) => (
                  <span
                    key={gi}
                    className={`select-none pointer-events-none ${gi === 2 ? 'hidden md:inline' : ''}`}
                    style={{
                      fontSize: '60px',
                      fontWeight: 900,
                      fontFamily: "'Heebo', 'Arial Hebrew', sans-serif",
                      color: 'rgba(0,0,0,0.08)',
                      lineHeight: 1,
                      flexShrink: 0,
                    }}
                  >
                    {selectedLetter}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Drawing canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 z-10 w-full h-full"
          onPointerDown={startDrawing}
          onPointerMove={draw}
          onPointerUp={stopDrawing}
          onPointerOut={stopDrawing}
          onPointerCancel={stopDrawing}
        />
      </div>
    </div>
  );
}
