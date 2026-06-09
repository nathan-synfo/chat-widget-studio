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
      <FieldGrid cols={2}>
        {v('--chat--input--border-color')}
        <VarField
          name="--chat--color-typing"
          value={values['--chat--color-typing']}
          onChange={(val) => setVar('--chat--color-typing', val)}
          hint="Colour of the animated 'typing' dots shown in the bot's bubble before its reply arrives. Not visible in this static preview."
        />
      </FieldGrid>
    </SectionShell>
  );
}
