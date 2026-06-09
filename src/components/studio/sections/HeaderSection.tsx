import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { LogoUpload } from '@/components/LogoUpload';
import { useStudio, useVars } from '../studio-context';
import { SectionShell, Subsection, Field, FieldGrid, VarField } from '../atoms';

export function HeaderSection() {
  const { active, update } = useStudio();
  const { values, setVar } = useVars();
  const { headerContent, logos } = active;

  return (
    <SectionShell title="Header" description="The top of the open chat window.">
      <Subsection>Content</Subsection>
      <Field label="Title">
        <Input
          value={headerContent.title}
          onChange={(e) => update({ headerContent: { ...headerContent, title: e.target.value } })}
          className="h-9 text-sm"
          placeholder="Hi there! 👋"
        />
      </Field>
      <Field label="Subtitle">
        <Textarea
          value={headerContent.subtitle}
          onChange={(e) => update({ headerContent: { ...headerContent, subtitle: e.target.value } })}
          className="resize-none text-sm"
          rows={2}
          placeholder="Start a chat..."
        />
      </Field>

      <Subsection>Logo</Subsection>
      <LogoUpload
        label="Header Logo"
        value={logos.headerLogo}
        onChange={(v) => update({ logos: { ...logos, headerLogo: v } })}
        tooltip="Displayed in the chat header."
      />
      <VarField
        name="--chat--header--logo-height"
        value={values['--chat--header--logo-height']}
        onChange={(v) => setVar('--chat--header--logo-height', v)}
      />

      <Subsection>Sizing</Subsection>
      <FieldGrid cols={2}>
        <VarField name="--chat--heading--font-size" value={values['--chat--heading--font-size']} onChange={(v) => setVar('--chat--heading--font-size', v)} />
        <VarField name="--chat--subtitle--font-size" value={values['--chat--subtitle--font-size']} onChange={(v) => setVar('--chat--subtitle--font-size', v)} />
      </FieldGrid>

      <Subsection>Colors</Subsection>
      <FieldGrid cols={2}>
        <VarField name="--chat--header--background" value={values['--chat--header--background']} onChange={(v) => setVar('--chat--header--background', v)} />
        <VarField name="--chat--header--color" value={values['--chat--header--color']} onChange={(v) => setVar('--chat--header--color', v)} />
      </FieldGrid>

      <Subsection>Advanced</Subsection>
      <VarField name="--chat--header-height" value={values['--chat--header-height']} onChange={(v) => setVar('--chat--header-height', v)} />
      <VarField name="--chat--header--padding" value={values['--chat--header--padding']} onChange={(v) => setVar('--chat--header--padding', v)} />
      <FieldGrid cols={2}>
        <VarField name="--chat--heading--line-height" value={values['--chat--heading--line-height']} onChange={(v) => setVar('--chat--heading--line-height', v)} />
        <VarField name="--chat--subtitle--line-height" value={values['--chat--subtitle--line-height']} onChange={(v) => setVar('--chat--subtitle--line-height', v)} />
      </FieldGrid>
    </SectionShell>
  );
}
