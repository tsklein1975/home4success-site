'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

/**
 * Standalone mobile menu component.
 * 
 * This is fully isolated from the parent layout to eliminate any
 * hydration race conditions that were causing the hamburger to fail
 * when accessed via local IP (vs localhost).
 * 
 * Key design decisions:
 * - Uses native DOM addEventListener for the toggle (not just React synthetic events)
 * - Uses inline styles for all critical positioning (not Tailwind classes)
 * - Both onClick and onPointerDown for maximum browser compat
 */
export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);

  // ═══ NO DEBUG STATE ═══

  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen(v => !v), []);

  // Attach native DOM click listener as fallback — bypasses any React synthetic event issues
  useEffect(() => {
    const btn = btnRef.current;
    if (!btn) return;

    const handler = (e: Event) => {
      e.stopPropagation();
      setIsOpen(v => !v);
    };

    btn.addEventListener('click', handler, { passive: true });
    return () => btn.removeEventListener('click', handler);
  }, []);

  return (
    <>
      {/* Hamburger trigger */}
      <button
        ref={btnRef}
        type="button"
        aria-label="תפריט ניווט"
        aria-expanded={isOpen}
        aria-controls="mobile-nav-panel"
        style={{
          zIndex: 9999,
          touchAction: 'manipulation',
          WebkitTapHighlightColor: 'transparent',
          pointerEvents: 'auto',
          position: 'relative',
          minWidth: 48,
          minHeight: 48,
          paddingLeft: 'max(1rem, env(safe-area-inset-left))',
          paddingRight: 'max(1rem, env(safe-area-inset-right))',
        }}
        className="lg:hidden flex items-center justify-center min-w-[3rem] min-h-[3rem] rounded-xl text-[#8aab9f] hover:bg-gray-50 transition-colors shrink-0 ml-2 py-2"
      >
        {isOpen ? <X size={32} /> : <Menu size={32} />}
      </button>

      {/* Backdrop + Nav panel */}
      {isOpen && (
        <div
          id="mobile-nav-backdrop"
          className="lg:hidden"
          style={{
            position: 'fixed',
            top: 128,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9998,
            background: 'rgba(0,0,0,0.3)',
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
          }}
          onClick={close}
          onPointerDown={close}
        >
          <nav
            id="mobile-nav-panel"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              zIndex: 9999,
              background: 'white',
              boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.25)',
              borderBottom: '1px solid #f3f4f6',
            }}
            aria-label="ניווט ראשי"
            onClick={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
          >
            {[
              { href: '/', label: 'דף הבית' },
              { href: '/about', label: 'אודות' },
              { href: '/lessons', label: 'השיעורים שלנו' },
              { href: '/testimonials', label: 'המלצות מהורים' },
              { href: '/contact', label: 'יצירת קשר' },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={close}
                style={{
                  display: 'block',
                  padding: '1rem',
                  textAlign: 'center',
                  fontWeight: 700,
                  fontSize: '1.25rem',
                  color: '#4a5568',
                }}
                className="hover:bg-gray-50 transition-colors"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
