import { Input } from '@/components/ui/input';
import { useStudio } from '../studio-context';
import { SectionShell, Field } from '../atoms';

export function ConnectSection() {
  const { active, update } = useStudio();
  const webhookUrl = active.chatConfig.webhookUrl;
  const configured = Boolean(webhookUrl?.trim());

  return (
    <SectionShell title="Connect to n8n" description="Wire your widget to a chat trigger.">
      <Field label="n8n webhook URL" hint="The endpoint that handles chat messages.">
        <Input
          value={webhookUrl}
          onChange={(e) => update({ chatConfig: { ...active.chatConfig, webhookUrl: e.target.value } })}
          className="h-9 font-mono text-xs"
          placeholder="https://your-n8n-instance.com/webhook/..."
        />
      </Field>

      <div className="space-y-2 rounded-lg border border-border bg-secondary p-3">
        <div className="flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${configured ? 'bg-success' : 'bg-muted-foreground'}`} />
          <span className="text-xs font-medium text-foreground">
            {configured ? 'Webhook configured' : 'No webhook yet'}
          </span>
        </div>
        <p className="text-[11px] leading-relaxed text-muted-foreground">
          Don't have one? Create a <span className="text-primary">Chat Trigger</span> node in n8n and
          paste the production URL above.
        </p>
      </div>
    </SectionShell>
  );
}
