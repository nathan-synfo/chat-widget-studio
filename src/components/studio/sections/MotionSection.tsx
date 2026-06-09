import { Check } from 'lucide-react';
import { useVars } from '../studio-context';
import { SectionShell, Subsection, SliderField } from '../atoms';

const ANIMATIONS = [
  { id: 'scale', label: 'Pop', desc: 'Scale up' },
  { id: 'fade', label: 'Fade', desc: 'Opacity only' },
  { id: 'slide-up', label: 'Slide up', desc: 'From below' },
  { id: 'slide-side', label: 'Slide side', desc: 'From the right' },
];

export function MotionSection() {
  const { values, setVar } = useVars();
  const current = values['--chat--animation-style'] || 'scale';

  return (
    <SectionShell title="Motion" description="Open / close animation feel.">
      <Subsection>Entry animation</Subsection>
      <div className="grid grid-cols-2 gap-2">
        {ANIMATIONS.map((a) => {
          const active = current === a.id;
          return (
            <button
              key={a.id}
              type="button"
              onClick={() => setVar('--chat--animation-style', a.id)}
              className={`relative rounded-lg border p-3 text-left transition-colors ${
                active ? 'border-primary bg-muted' : 'border-border bg-secondary hover:border-foreground/30'
              }`}
            >
              {active && <Check className="absolute right-2 top-2 h-3.5 w-3.5 text-primary" />}
              <div className="text-xs font-medium text-foreground">{a.label}</div>
              <div className="mt-0.5 text-[10px] text-muted-foreground">{a.desc}</div>
            </button>
          );
        })}
      </div>

      <Subsection>Speed</Subsection>
      <SliderField
        label="Duration"
        value={values['--chat--transition-duration']}
        onChange={(v) => setVar('--chat--transition-duration', v)}
        min={0}
        max={2000}
        step={50}
        unit="ms"
      />
    </SectionShell>
  );
}
