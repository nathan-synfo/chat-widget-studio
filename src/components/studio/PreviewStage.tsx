import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';

const STAGE_W = 1440;
const STAGE_H = 900;

/**
 * Renders its children at a fixed reference viewport (1440×900) and scales the
 * whole stage down with a CSS transform to fit the available pane. This keeps the
 * widget at its true pixel size *within* a believable web page, so it always reads
 * as a small corner bubble and never overflows the pane.
 */
export function PreviewStage({ children }: { children: ReactNode }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const pad = 48; // breathing room around the stage
      const sw = (el.clientWidth - pad) / STAGE_W;
      const sh = (el.clientHeight - pad) / STAGE_H;
      setScale(Math.min(sw, sh, 1)); // never upscale past 1:1
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={wrapRef} className="absolute inset-0 flex items-center justify-center">
      <div
        style={{
          width: STAGE_W,
          height: STAGE_H,
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
          flex: '0 0 auto',
          borderRadius: 12,
          overflow: 'hidden',
          boxShadow: '0 24px 60px rgba(0,0,0,0.45)',
          position: 'relative',
        }}
      >
        {children}
      </div>
    </div>
  );
}
