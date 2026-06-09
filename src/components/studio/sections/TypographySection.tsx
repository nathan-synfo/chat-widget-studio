import { Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useVars } from '../studio-context';
import { SectionShell, Subsection, Field } from '../atoms';

const FONT_PRESETS: Record<string, string> = {
  Inter: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
  Roboto: 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap',
  'Open Sans': 'https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;600;700&display=swap',
  Lato: 'https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap',
  Montserrat: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap',
};

const FONT_OPTIONS = [
  { value: 'inherit', label: 'System default', stack: 'system-ui, sans-serif' },
  { value: 'Inter', label: 'Inter', stack: "'Inter', sans-serif" },
  { value: 'Roboto', label: 'Roboto', stack: "'Roboto', sans-serif" },
  { value: 'Open Sans', label: 'Open Sans', stack: "'Open Sans', sans-serif" },
  { value: 'Lato', label: 'Lato', stack: "'Lato', sans-serif" },
  { value: 'Montserrat', label: 'Montserrat', stack: "'Montserrat', sans-serif" },
];

const PRESET_VALUES = FONT_OPTIONS.map((f) => f.value);

export function TypographySection() {
  const { values, setVar } = useVars();
  const family = values['--chat--font-family'] || 'inherit';
  const fontUrl = values['--chat--font-family-url'] || '';
  const isPreset = PRESET_VALUES.includes(family);

  const selectFont = (value: string) => {
    setVar('--chat--font-family', value);
    if (value === 'inherit') {
      setVar('--chat--font-family-url', '');
    } else {
      setVar('--chat--font-family-url', FONT_PRESETS[value] || '');
    }
  };

  return (
    <SectionShell title="Typography" description="Font family for everything in the widget.">
      <Subsection>Font family</Subsection>
      <div className="grid gap-1.5">
        {FONT_OPTIONS.map((f) => {
          const active = family === f.value;
          return (
            <button
              key={f.value}
              type="button"
              onClick={() => selectFont(f.value)}
              className={`flex items-center justify-between rounded-lg border px-3 py-2.5 text-left text-sm transition-colors ${
                active ? 'border-primary bg-muted' : 'border-border bg-secondary hover:border-foreground/30'
              }`}
              style={{ fontFamily: f.stack }}
            >
              <span className="text-foreground">{f.label}</span>
              {active && <Check className="h-3.5 w-3.5 text-primary" />}
            </button>
          );
        })}
      </div>

      <Subsection>Custom font</Subsection>
      {!isPreset && (
        <Field label="Font name" hint="e.g. 'Dancing Script', cursive">
          <Input
            value={family}
            onChange={(e) => setVar('--chat--font-family', e.target.value)}
            className="h-9 font-mono text-xs"
            placeholder="'Custom Font', sans-serif"
          />
        </Field>
      )}
      <Field label="Font URL" hint="Paste the full URL from Google Fonts or another provider.">
        <Input
          value={fontUrl}
          onChange={(e) => setVar('--chat--font-family-url', e.target.value)}
          className="h-9 font-mono text-xs"
          placeholder="https://fonts.googleapis.com/css2?family=..."
        />
      </Field>
    </SectionShell>
  );
}
