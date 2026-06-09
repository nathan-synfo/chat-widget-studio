import type { ReactNode } from 'react';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { ColorInput } from '@/components/ColorInput';
import { cn } from '@/lib/utils';
import { cssVariables, type CSSVariable } from '@/lib/cssVariables';

/* ---------- Section shell ---------- */
export function SectionShell({
  title,
  description,
  actions,
  children,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex shrink-0 items-start justify-between gap-3 border-b border-border px-5 py-4">
        <div className="min-w-0">
          <div className="text-[17px] font-semibold tracking-tight text-foreground">{title}</div>
          {description ? (
            <div className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{description}</div>
          ) : null}
        </div>
        {actions ? <div className="flex shrink-0 items-center gap-1.5">{actions}</div> : null}
      </div>
      <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5">{children}</div>
    </div>
  );
}

/* ---------- Field ---------- */
export function Field({
  label,
  hint,
  right,
  children,
}: {
  label?: string;
  hint?: string;
  right?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      {(label || right) && (
        <div className="flex items-center justify-between">
          {label ? <label className="text-[11px] font-medium text-muted-foreground">{label}</label> : <span />}
          {right}
        </div>
      )}
      {children}
      {hint ? <div className="text-[10px] text-muted-foreground/80">{hint}</div> : null}
    </div>
  );
}

/* ---------- FieldGrid ---------- */
export function FieldGrid({ cols = 2, children }: { cols?: 1 | 2 | 3; children: ReactNode }) {
  return (
    <div
      className={cn(
        'grid gap-3',
        cols === 1 && 'grid-cols-1',
        cols === 2 && 'grid-cols-2',
        cols === 3 && 'grid-cols-3',
      )}
    >
      {children}
    </div>
  );
}

/* ---------- Subsection caption ---------- */
export function Subsection({ children, right }: { children: ReactNode; right?: ReactNode }) {
  return (
    <div className="flex items-center justify-between border-t border-border/60 pt-4 first:border-t-0 first:pt-0">
      <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        {children}
      </div>
      {right}
    </div>
  );
}

/* ---------- Unit-aware slider ---------- */
export type Unit = 'px' | 'rem' | 'ms' | '';

function parseSlider(value: string, unit: Unit): number {
  const num = parseFloat(value);
  if (unit === 'ms') {
    const v = (value || '').trim();
    if (v.endsWith('ms')) return num;
    if (v.endsWith('s')) return num * 1000; // seconds → ms
    return isNaN(num) ? 0 : num;
  }
  return isNaN(num) ? 0 : num;
}

function formatSlider(n: number, unit: Unit): string {
  if (unit === 'ms') return `${n / 1000}s`; // store as seconds
  if (unit === '') return `${n}`;
  return `${n}${unit}`;
}

function displaySuffix(unit: Unit): string {
  return unit === 'ms' ? 'ms' : unit;
}

export function SliderField({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  unit,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  min: number;
  max: number;
  step?: number;
  unit: Unit;
  hint?: string;
}) {
  const n = parseSlider(value, unit);
  const display = unit === '' ? n.toFixed(2) : `${Math.round(n * 100) / 100}${displaySuffix(unit)}`;
  return (
    <Field
      label={label}
      hint={hint}
      right={
        <span className="rounded bg-secondary px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground">
          {display}
        </span>
      }
    >
      <Slider
        value={[n]}
        min={min}
        max={max}
        step={step}
        onValueChange={(vals) => onChange(formatSlider(vals[0], unit))}
        className="py-1"
      />
    </Field>
  );
}

/* ---------- Registry-driven control ---------- */
export const varByName: Record<string, CSSVariable> = Object.fromEntries(
  cssVariables.map((v) => [v.name, v]),
);

interface SliderCfg {
  unit: Unit;
  min: number;
  max: number;
  step?: number;
}

export const SLIDER_CONFIG: Record<string, SliderCfg> = {
  '--chat--window--width': { unit: 'px', min: 300, max: 800, step: 10 },
  '--chat--window--height': { unit: 'px', min: 400, max: 800, step: 10 },
  '--chat--window--bottom': { unit: 'px', min: 0, max: 200 },
  '--chat--window--right': { unit: 'px', min: 0, max: 200 },
  '--chat--border-radius': { unit: 'rem', min: 0, max: 3, step: 0.05 },
  '--chat--toggle--size': { unit: 'px', min: 32, max: 120 },
  '--chat--header-height': { unit: 'px', min: 48, max: 200 },
  '--chat--header--padding': { unit: 'rem', min: 0, max: 3, step: 0.05 },
  '--chat--header--logo-height': { unit: 'px', min: 16, max: 128 },
  '--chat--heading--font-size': { unit: 'px', min: 12, max: 48 },
  '--chat--subtitle--font-size': { unit: 'px', min: 12, max: 48 },
  '--chat--heading--line-height': { unit: '', min: 0.8, max: 3, step: 0.05 },
  '--chat--subtitle--line-height': { unit: '', min: 0.8, max: 3, step: 0.05 },
  '--chat--message--font-size': { unit: 'px', min: 10, max: 32 },
  '--chat--message--padding': { unit: 'rem', min: 0, max: 3, step: 0.05 },
  '--chat--message--border-radius': { unit: 'rem', min: 0, max: 3, step: 0.05 },
  '--chat--message-line-height': { unit: '', min: 1, max: 3, step: 0.05 },
  '--chat--spacing': { unit: 'rem', min: 0.1, max: 3, step: 0.05 },
  '--chat--input--border-radius': { unit: 'px', min: 0, max: 24 },
  '--chat--input--font-size': { unit: 'rem', min: 0.1, max: 3, step: 0.05 },
  '--chat--input--icon-size': { unit: 'px', min: 10, max: 32 },
  '--chat--transition-duration': { unit: 'ms', min: 0, max: 2000, step: 50 },
  '--chat--welcome--title-font-size': { unit: 'px', min: 10, max: 32 },
  '--chat--welcome--subtitle-font-size': { unit: 'px', min: 10, max: 32 },
};

/** Renders the correct control for a registry variable by name. */
export function VarField({
  name,
  value,
  onChange,
  labelOverride,
  hint,
}: {
  name: string;
  value: string;
  onChange: (v: string) => void;
  labelOverride?: string;
  hint?: string;
}) {
  const variable = varByName[name];
  if (!variable) return null;
  const label = labelOverride ?? variable.label;

  if (variable.type === 'color') {
    return <ColorInput label={label} value={value} onChange={onChange} variableName={name} hint={hint} />;
  }

  const cfg = SLIDER_CONFIG[name];
  if (cfg) {
    return (
      <SliderField
        label={label}
        value={value}
        onChange={onChange}
        min={cfg.min}
        max={cfg.max}
        step={cfg.step}
        unit={cfg.unit}
      />
    );
  }

  // Fallback: mono text input.
  return (
    <Field label={label}>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 font-mono text-xs"
        placeholder={name}
      />
    </Field>
  );
}
