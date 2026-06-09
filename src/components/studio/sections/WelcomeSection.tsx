import { Plus, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { useStudio, useVars } from '../studio-context';
import { SectionShell, Subsection, Field, FieldGrid, VarField } from '../atoms';
import type { Pill } from '@/lib/types';

export function WelcomeSection() {
  const { active, update } = useStudio();
  const { values, setVar } = useVars();
  const wc = active.welcomeConfig;

  const setPills = (pills: Pill[]) => update({ welcomeConfig: { ...wc, pills } });

  const addPill = () => {
    if (wc.pills.length >= 4) {
      toast.error('Maximum 4 quick actions allowed');
      return;
    }
    setPills([...wc.pills, { id: crypto.randomUUID(), label: 'New Action', message: 'Hello' }]);
  };

  return (
    <SectionShell title="Welcome screen" description="First view before the conversation starts.">
      <Field label="Show welcome screen" right={<Switch checked={wc.enabled} onCheckedChange={(c) => update({ welcomeConfig: { ...wc, enabled: c } })} />}>
        <span />
      </Field>

      {wc.enabled && (
        <>
          <Subsection>Copy</Subsection>
          <Field label="Title">
            <Input value={wc.title} onChange={(e) => update({ welcomeConfig: { ...wc, title: e.target.value } })} className="h-9 text-sm" />
          </Field>
          <Field label="Subtitle">
            <Input value={wc.subtitle} onChange={(e) => update({ welcomeConfig: { ...wc, subtitle: e.target.value } })} className="h-9 text-sm" />
          </Field>

          <Subsection>Sizing</Subsection>
          <FieldGrid cols={2}>
            <VarField name="--chat--welcome--title-font-size" value={values['--chat--welcome--title-font-size']} onChange={(v) => setVar('--chat--welcome--title-font-size', v)} />
            <VarField name="--chat--welcome--subtitle-font-size" value={values['--chat--welcome--subtitle-font-size']} onChange={(v) => setVar('--chat--welcome--subtitle-font-size', v)} />
          </FieldGrid>

          <Subsection>Colors</Subsection>
          <FieldGrid cols={2}>
            <VarField name="--chat--welcome--title-color" labelOverride="Title Color" value={values['--chat--welcome--title-color']} onChange={(v) => setVar('--chat--welcome--title-color', v)} />
            <VarField name="--chat--welcome--subtitle-color" labelOverride="Subtitle Color" value={values['--chat--welcome--subtitle-color']} onChange={(v) => setVar('--chat--welcome--subtitle-color', v)} />
          </FieldGrid>

          <Subsection
            right={
              <button
                type="button"
                onClick={addPill}
                className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground"
              >
                <Plus className="h-3 w-3" />
                Add
              </button>
            }
          >
            Quick actions
          </Subsection>

          {wc.pills.map((pill, i) => (
            <div key={pill.id} className="space-y-2 rounded-lg border border-border bg-secondary/60 p-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Pill {i + 1}
                </span>
                <button
                  type="button"
                  onClick={() => setPills(wc.pills.filter((p) => p.id !== pill.id))}
                  className="rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
              <Field label="Button text">
                <Input
                  value={pill.label}
                  onChange={(e) => setPills(wc.pills.map((p) => (p.id === pill.id ? { ...p, label: e.target.value } : p)))}
                  className="h-8 text-xs"
                  placeholder="Button text"
                />
              </Field>
              <Field label="Sent message">
                <Input
                  value={pill.message}
                  onChange={(e) => setPills(wc.pills.map((p) => (p.id === pill.id ? { ...p, message: e.target.value } : p)))}
                  className="h-8 text-xs"
                  placeholder="Message sent to bot"
                />
              </Field>
            </div>
          ))}

          <Subsection>Quick action icons</Subsection>
          <FieldGrid cols={2}>
            <VarField
              name="--chat--welcome-pill-icon-color"
              labelOverride="Icon Color"
              value={values['--chat--welcome-pill-icon-color']}
              onChange={(v) => setVar('--chat--welcome-pill-icon-color', v)}
            />
            <VarField
              name="--chat--welcome-pill-icon-hover-color"
              labelOverride="Icon Hover Color"
              value={values['--chat--welcome-pill-icon-hover-color']}
              onChange={(v) => setVar('--chat--welcome-pill-icon-hover-color', v)}
            />
          </FieldGrid>
        </>
      )}
    </SectionShell>
  );
}
