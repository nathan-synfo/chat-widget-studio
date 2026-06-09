import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronDown, Info } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface ColorInputProps {
  label?: string;
  value: string;
  onChange: (hex: string) => void;
  variableName?: string;
  palette?: string[];
  hint?: string;
}

/* ---------- color math ---------- */
interface RGB { r: number; g: number; b: number; }
interface HSV { h: number; s: number; v: number; }

function hexToRgb(hex: string): RGB {
  let h = (hex || '').replace('#', '');
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  if (h.length !== 6 || !/^[0-9a-f]{6}$/i.test(h)) return { r: 0, g: 0, b: 0 };
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}
function rgbToHex({ r, g, b }: RGB): string {
  const t = (n: number) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, '0');
  return '#' + t(r) + t(g) + t(b);
}
function rgbToHsv({ r, g, b }: RGB): HSV {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  if (d !== 0) {
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  return { h, s: max === 0 ? 0 : d / max, v: max };
}
function hsvToRgb({ h, s, v }: HSV): RGB {
  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;
  let r = 0, g = 0, b = 0;
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  return { r: (r + m) * 255, g: (g + m) * 255, b: (b + m) * 255 };
}
function hexToHsv(hex: string): HSV { return rgbToHsv(hexToRgb(hex)); }
function hsvToHex(hsv: HSV): string { return rgbToHex(hsvToRgb(hsv)); }

/** Parse any common CSS color (hex 3/6/8, rgb(), rgba()) into rgb + alpha. */
function parseColor(input: string): (RGB & { a: number }) | null {
  const s = (input || '').trim();
  if (!s) return null;

  // rgb() / rgba()
  const rgbMatch = s.match(/^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*(?:,\s*([\d.]+)\s*)?\)$/i);
  if (rgbMatch) {
    return {
      r: Number(rgbMatch[1]),
      g: Number(rgbMatch[2]),
      b: Number(rgbMatch[3]),
      a: rgbMatch[4] !== undefined ? Number(rgbMatch[4]) : 1,
    };
  }

  // hex 3 / 6 / 8
  let h = s.replace('#', '');
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  if (h.length === 6 && /^[0-9a-f]{6}$/i.test(h)) {
    return { ...hexToRgb('#' + h), a: 1 };
  }
  if (h.length === 8 && /^[0-9a-f]{8}$/i.test(h)) {
    return { ...hexToRgb('#' + h.slice(0, 6)), a: parseInt(h.slice(6, 8), 16) / 255 };
  }
  return null;
}

/** Format rgb+alpha as hex — 8-digit when translucent, 6-digit when opaque. */
function rgbaToHex({ r, g, b, a }: RGB & { a: number }): string {
  const t = (n: number) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, '0');
  const base = '#' + t(r) + t(g) + t(b);
  return a < 1 ? base + t(a * 255) : base;
}

/** Normalize any supported color string to a hex string for display. */
function toDisplayHex(value: string): string {
  const parsed = parseColor(value);
  return parsed ? rgbaToHex(parsed) : (value || '').toUpperCase();
}

const QUICK_SWATCHES = [
  '#000000', '#ffffff', '#101330', '#e74266',
  '#1b5e20', '#2e7d32', '#01579b', '#0277bd',
  '#e65100', '#ef6c00', '#4a148c', '#9b59b6',
  '#f2f4f8', '#fafafa', '#e8f5e9', '#fff3e0',
];

/* pointer-drag helper that reports normalized [0..1] x/y */
function useDragRect(
  ref: React.RefObject<HTMLElement>,
  onMove: (x: number, y: number) => void,
) {
  const onMoveRef = useRef(onMove);
  onMoveRef.current = onMove;
  return useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const calc = (cx: number, cy: number) => {
        const x = Math.max(0, Math.min(1, (cx - rect.left) / rect.width));
        const y = Math.max(0, Math.min(1, (cy - rect.top) / rect.height));
        onMoveRef.current(x, y);
      };
      calc(e.clientX, e.clientY);
      const handleMove = (ev: PointerEvent) => calc(ev.clientX, ev.clientY);
      const handleUp = () => {
        window.removeEventListener('pointermove', handleMove);
        window.removeEventListener('pointerup', handleUp);
      };
      window.addEventListener('pointermove', handleMove);
      window.addEventListener('pointerup', handleUp);
    },
    [ref],
  );
}

export function ColorInput({ label, value, onChange, variableName, palette, hint }: ColorInputProps) {
  const svRef = useRef<HTMLDivElement>(null);
  const hueRef = useRef<HTMLDivElement>(null);
  const seed = (v: string): HSV => {
    const parsed = parseColor(v);
    return parsed ? rgbToHsv(parsed) : { h: 0, s: 0, v: 0 };
  };
  const [hsv, setHsv] = useState<HSV>(() => seed(value));
  const [hexText, setHexText] = useState(() => toDisplayHex(value).toUpperCase());

  // Reflect external value changes (e.g. a theme is applied).
  useEffect(() => {
    setHsv(seed(value));
    setHexText(toDisplayHex(value).toUpperCase());
  }, [value]);

  const commit = (next: HSV) => {
    setHsv(next);
    const hex = hsvToHex(next);
    setHexText(hex.toUpperCase());
    onChange(hex);
  };

  const onSv = useDragRect(svRef, (x, y) => commit({ h: hsv.h, s: x, v: 1 - y }));
  const onHue = useDragRect(hueRef, (x) => commit({ h: x * 360, s: hsv.s, v: hsv.v }));

  const rgb = hsvToRgb(hsv);
  const huePure = `hsl(${hsv.h}, 100%, 50%)`;
  // The swatch can render the original value directly (browsers understand rgba()/hex8).
  const swatchColor = parseColor(value) ? value : '#000000';
  const swatches = palette && palette.length ? palette : QUICK_SWATCHES;

  const setFromHex = (raw: string) => {
    setHexText(raw.toUpperCase());
    const clean = raw.startsWith('#') ? raw : '#' + raw;
    if (/^#([0-9a-f]{6}|[0-9a-f]{8})$/i.test(clean)) {
      setHsv(hexToHsv(clean.slice(0, 7)));
      onChange(clean.toLowerCase());
    }
  };

  const setFromRgb = (channel: keyof RGB, raw: string) => {
    const n = parseInt(raw, 10);
    if (isNaN(n)) return;
    const hex = rgbToHex({ ...rgb, [channel]: Math.max(0, Math.min(255, n)) });
    setHsv(hexToHsv(hex));
    setHexText(hex.toUpperCase());
    onChange(hex);
  };

  return (
    <div className="space-y-1.5">
      {label ? (
        <div className="flex items-center gap-1">
          <Label className="text-[11px] font-medium text-muted-foreground">{label}</Label>
          {hint ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  aria-label="More info"
                  className="text-muted-foreground/50 transition-colors hover:text-muted-foreground"
                >
                  <Info className="h-3 w-3" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top" align="start" className="max-w-[220px] text-xs leading-relaxed">
                {hint}
              </TooltipContent>
            </Tooltip>
          ) : null}
        </div>
      ) : null}
      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="group flex h-9 w-full items-center gap-2 rounded-md border border-border bg-secondary px-1.5 transition-colors hover:border-foreground/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span
              className="h-6 w-6 shrink-0 rounded"
              style={{
                backgroundColor: swatchColor,
                boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.08)',
              }}
            />
            <span className="flex-1 text-left font-mono text-xs uppercase tracking-wide text-foreground">
              {hexText || '—'}
            </span>
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-[260px] p-3" align="start">
          {/* Saturation / Value square */}
          <div
            ref={svRef}
            onPointerDown={onSv}
            className="relative h-[150px] w-full cursor-crosshair touch-none select-none overflow-hidden rounded-md"
            style={{
              background: `linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, ${huePure})`,
              boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.06)',
            }}
          >
            <div
              className="pointer-events-none absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white"
              style={{
                left: `${hsv.s * 100}%`,
                top: `${(1 - hsv.v) * 100}%`,
                boxShadow: '0 0 0 1px rgba(0,0,0,0.5)',
              }}
            />
          </div>

          {/* Hue strip */}
          <div
            ref={hueRef}
            onPointerDown={onHue}
            className="relative mt-3 h-3 w-full cursor-ew-resize touch-none select-none rounded-full"
            style={{
              background:
                'linear-gradient(to right, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)',
              boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.08)',
            }}
          >
            <div
              className="pointer-events-none absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white"
              style={{
                left: `${(hsv.h / 360) * 100}%`,
                background: huePure,
                boxShadow: '0 0 0 1px rgba(0,0,0,0.5)',
              }}
            />
          </div>

          {/* HEX + R + G + B */}
          <div className="mt-3 grid grid-cols-[1.4fr_1fr_1fr_1fr] gap-1.5">
            {([
              { label: 'HEX', val: hexText, mono: true, on: setFromHex },
              { label: 'R', val: String(Math.round(rgb.r)), mono: false, on: (v: string) => setFromRgb('r', v) },
              { label: 'G', val: String(Math.round(rgb.g)), mono: false, on: (v: string) => setFromRgb('g', v) },
              { label: 'B', val: String(Math.round(rgb.b)), mono: false, on: (v: string) => setFromRgb('b', v) },
            ]).map((f) => (
              <div key={f.label} className="flex flex-col items-center gap-1">
                <input
                  value={f.val}
                  onChange={(e) => f.on(e.target.value)}
                  className={cn(
                    'h-6 w-full rounded-[5px] border border-border bg-secondary px-1.5 text-center text-[11px] text-foreground outline-none focus:border-primary',
                    f.mono && 'font-mono',
                  )}
                />
                <span className="text-[9px] font-semibold tracking-wider text-muted-foreground">
                  {f.label}
                </span>
              </div>
            ))}
          </div>

          {/* Swatches */}
          <div className="mt-3">
            <div className="mb-1.5 text-[9px] font-semibold tracking-wider text-muted-foreground">
              SWATCHES
            </div>
            <div className="grid grid-cols-8 gap-1">
              {swatches.map((c, i) => (
                <button
                  key={`${c}-${i}`}
                  type="button"
                  title={c}
                  onClick={() => {
                    setHsv(hexToHsv(c));
                    setHexText(c.toUpperCase());
                    onChange(c);
                  }}
                  className="aspect-square w-full rounded-[4px]"
                  style={{ background: c, boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.08)' }}
                />
              ))}
            </div>
          </div>

          {variableName ? (
            <div className="mt-2 truncate font-mono text-[9px] text-muted-foreground/60">
              {variableName}
            </div>
          ) : null}
        </PopoverContent>
      </Popover>
    </div>
  );
}
