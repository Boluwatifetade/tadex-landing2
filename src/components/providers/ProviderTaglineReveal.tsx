'use client';

import React, { useEffect, useRef, useState } from 'react';

const PROVIDER_TAGLINE_LINES = [
  'You post the trade setup in Telegram.',
  'Tadex verifies every subscriber and executes every order across their exchanges.',
];

const ALL_WORDS = PROVIDER_TAGLINE_LINES.flatMap((line, lineIdx) =>
  line.split(' ').map((word, wordIdx) => ({
    word,
    lineIdx,
    key: `${lineIdx}-${wordIdx}`,
  }))
);

export default function ProviderTaglineReveal() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [activeCount, setActiveCount] = useState<number>(0);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery =
      typeof window.matchMedia === 'function'
        ? window.matchMedia('(prefers-reduced-motion: reduce)')
        : null;

    if (mediaQuery?.matches) {
      setReducedMotion(true);
      setActiveCount(ALL_WORDS.length);
      return;
    }

    let rafId: number | null = null;
    let isInViewport = false;

    const evaluateWords = () => {
      rafId = null;
      const section = sectionRef.current;
      if (!section) return;

      const triggerY = window.innerHeight * 0.78;
      let newlyActive = 0;

      wordRefs.current.forEach((span, idx) => {
        if (!span) return;
        const rect = span.getBoundingClientRect();
        const wordThreshold = triggerY - idx * 6;
        if (rect.top <= wordThreshold) {
          newlyActive = idx + 1;
        }
      });

      setActiveCount((prev) => Math.max(prev, newlyActive));
    };

    const scheduleEvaluation = () => {
      if (!isInViewport || rafId !== null) return;
      rafId = window.requestAnimationFrame(evaluateWords);
    };

    if (typeof IntersectionObserver === 'undefined') {
      setActiveCount(ALL_WORDS.length);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          isInViewport = entry.isIntersecting;
          if (entry.isIntersecting) {
            scheduleEvaluation();
          }
        }
      },
      {
        threshold: [0, 0.15, 0.3, 0.5, 0.75, 1],
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    window.addEventListener('scroll', scheduleEvaluation, { passive: true });
    window.addEventListener('resize', scheduleEvaluation, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', scheduleEvaluation);
      window.removeEventListener('resize', scheduleEvaluation);
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, []);

  let globalIndex = 0;

  return (
    <section
      ref={sectionRef}
      aria-label="Provider automation promise"
      className="bg-surface-canvas py-20 lg:py-24 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        <div className="max-w-[680px]">
          <p className="heading-2 text-content-primary">
            {PROVIDER_TAGLINE_LINES.map((line, lineIdx) => {
              const words = line.split(' ');
              return (
                <span key={lineIdx} className="block">
                  {words.map((word) => {
                    const currentIdx = globalIndex++;
                    const isActive = reducedMotion || currentIdx < activeCount;
                    return (
                      <span
                        key={currentIdx}
                        ref={(el) => {
                          wordRefs.current[currentIdx] = el;
                        }}
                        className={`inline-block mr-3 transition-opacity duration-500 ease-weighted motion-reduce:transition-none ${
                          isActive ? 'opacity-100 text-content-primary' : 'opacity-30 text-content-primary'
                        }`}
                      >
                        {word}
                      </span>
                    );
                  })}
                </span>
              );
            })}
          </p>
        </div>
      </div>
    </section>
  );
}
