import { LogoUpload } from '@/components/LogoUpload';
import { useStudio, useVars } from '../studio-context';
import { SectionShell, Subsection, FieldGrid, VarField } from '../atoms';

export function LayoutSection() {
  const { active, update } = useStudio();
  const { values, setVar } = useVars();
  const v = (name: string) => (
    <VarField name={name} value={values[name]} onChange={(val) => setVar(name, val)} />
  );

  return (
    <SectionShell title="Layout & sizing" description="Window, toggle button, and placement.">
      <Subsection>Window</Subsection>
      <FieldGrid cols={2}>
        {v('--chat--window--width')}
        {v('--chat--window--height')}
      </FieldGrid>
      {v('--chat--border-radius')}

      <Subsection>Position</Subsection>
      <FieldGrid cols={2}>
        {v('--chat--window--bottom')}
        {v('--chat--window--right')}
      </FieldGrid>

      <Subsection>Toggle button</Subsection>
      <LogoUpload
        label="Toggle Button Icon"
        value={active.logos.toggleIcon}
        onChange={(val) => update({ logos: { ...active.logos, toggleIcon: val } })}
        tooltip="Replaces the default chat bubble icon."
      />
      {v('--chat--toggle--size')}
      <FieldGrid cols={2}>
        {v('--chat--toggle--background')}
        {v('--chat--toggle--hover--background')}
        {v('--chat--toggle--color')}
      </FieldGrid>
    </SectionShell>
  );
}
