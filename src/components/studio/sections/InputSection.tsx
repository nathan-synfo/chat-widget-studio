import { LogoUpload } from '@/components/LogoUpload';
import { useStudio, useVars } from '../studio-context';
import { SectionShell, Subsection, FieldGrid, VarField } from '../atoms';

export function InputSection() {
  const { active, update } = useStudio();
  const { values, setVar } = useVars();
  const v = (name: string) => (
    <VarField name={name} value={values[name]} onChange={(val) => setVar(name, val)} />
  );

  return (
    <SectionShell title="Input" description="The message composer at the bottom of the window.">
      <Subsection>Bot avatar</Subsection>
      <LogoUpload
        label="Bot Avatar"
        value={active.logos.botAvatar}
        onChange={(val) => update({ logos: { ...active.logos, botAvatar: val } })}
        tooltip="Shown next to bot messages."
      />

      <Subsection>Sizing</Subsection>
      {v('--chat--input--border-radius')}
      {v('--chat--input--font-size')}
      {v('--chat--input--icon-size')}
      {v('--chat--spacing')}

      <Subsection>Colors</Subsection>
      <FieldGrid cols={2}>{v('--chat--input--border-color')}</FieldGrid>
    </SectionShell>
  );
}
