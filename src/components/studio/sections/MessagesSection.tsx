import { useVars } from '../studio-context';
import { SectionShell, Subsection, FieldGrid, VarField } from '../atoms';

export function MessagesSection() {
  const { values, setVar } = useVars();
  const v = (name: string) => (
    <VarField name={name} value={values[name]} onChange={(val) => setVar(name, val)} />
  );

  return (
    <SectionShell title="Messages" description="Bubble colors, shape, and density.">
      <Subsection>User bubble</Subsection>
      <FieldGrid cols={2}>
        {v('--chat--message--user--background')}
        {v('--chat--message--user--color')}
      </FieldGrid>

      <Subsection>Bot bubble</Subsection>
      <FieldGrid cols={2}>
        {v('--chat--message--bot--background')}
        {v('--chat--message--bot--color')}
      </FieldGrid>

      <Subsection>Shape & density</Subsection>
      <FieldGrid cols={2}>
        {v('--chat--message--font-size')}
        {v('--chat--message--padding')}
        {v('--chat--message--border-radius')}
        {v('--chat--message-line-height')}
      </FieldGrid>

      <Subsection>Code blocks & send button</Subsection>
      <FieldGrid cols={2}>
        {v('--chat--message--pre--background')}
        {v('--chat--input--send--background')}
      </FieldGrid>
    </SectionShell>
  );
}
