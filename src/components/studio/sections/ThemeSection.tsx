import { Check } from 'lucide-react';
import { toast } from 'sonner';
import { themes } from '@/lib/themes';
import { applyTheme } from '@/lib/applyDesign';
import { useStudio, useVars } from '../studio-context';
import { SectionShell, Subsection, FieldGrid, VarField } from '../atoms';

const PRIMARY_HINT =
  "Master brand colour — recolours the header, toggle button, send button, and the user's message bubble. Fine-tune any of these individually in their own tabs afterwards.";

export function ThemeSection() {
  const { update } = useStudio();
  const { values, setVar } = useVars();

  const currentPrimary = values['--chat--color--primary'];

  const handleApplyTheme = (id: string, name: string) => {
    const next = applyTheme(id);
    if (next) {
      update({ cssValues: next });
      toast.success(`Theme "${name}" applied`);
    }
  };

  return (
    <SectionShell
      title="Theme"
      description="Pick a starting palette, then fine-tune."
    >
      <Subsection>Presets</Subsection>
      <div className="grid grid-cols-3 gap-2">
        {themes.map((t) => {
          const primary = t.values['--chat--color--primary'];
          const headerBg = t.values['--chat--header--background'] || '#101330';
          const light = t.values['--chat--color-light'] || '#f2f4f8';
          const active = primary === currentPrimary;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => handleApplyTheme(t.id, t.name)}
              className={`relative flex flex-col gap-2 rounded-lg border bg-secondary p-2 text-left transition-colors ${
                active ? 'border-primary ring-2 ring-primary/20' : 'border-border hover:border-foreground/30'
              }`}
            >
              {active && (
                <Check className="absolute right-1.5 top-1.5 h-3.5 w-3.5 text-primary" />
              )}
              <div className="flex gap-1">
                <span className="h-4 w-4 rounded" style={{ background: primary }} />
                <span className="h-4 w-4 rounded" style={{ background: headerBg }} />
                <span
                  className="h-4 w-4 rounded"
                  style={{ background: light, boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.08)' }}
                />
              </div>
              <span className="text-[11px] font-medium text-foreground">{t.name}</span>
            </button>
          );
        })}
      </div>

      <Subsection>Colors</Subsection>
      <FieldGrid cols={2}>
        <VarField
          name="--chat--color--primary"
          value={values['--chat--color--primary']}
          onChange={(v) => setVar('--chat--color--primary', v)}
          hint={PRIMARY_HINT}
        />
        <VarField
          name="--chat--color-light"
          value={values['--chat--color-light']}
          onChange={(v) => setVar('--chat--color-light', v)}
        />
      </FieldGrid>
    </SectionShell>
  );
}
