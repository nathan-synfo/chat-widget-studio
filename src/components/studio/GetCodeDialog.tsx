import { useState } from 'react';
import { AlertTriangle, Check, Code, Copy } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { generateEmbedCode } from '@/lib/codeGenerator';
import { useStudio } from './studio-context';
import { toast } from 'sonner';

export function GetCodeDialog() {
  const { active } = useStudio();
  const [copied, setCopied] = useState(false);

  const code = generateEmbedCode({
    cssValues: active.cssValues,
    headerContent: active.headerContent,
    welcomeConfig: active.welcomeConfig,
    logos: active.logos,
    chatConfig: active.chatConfig,
  });

  const hasWebhook = Boolean(active.chatConfig.webhookUrl?.trim());

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success('Embed code copied to clipboard!');
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" className="h-7 gap-1.5 text-xs font-medium">
          <Code className="h-3.5 w-3.5" />
          Get Code
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[720px] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Install your widget</DialogTitle>
          <DialogDescription>
            Paste this snippet just before the closing &lt;/body&gt; tag on your site.
          </DialogDescription>
        </DialogHeader>

        {!hasWebhook && (
          <div className="flex items-start gap-2.5 rounded-md border border-warning/30 bg-warning/10 px-3 py-2.5">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
            <p className="text-xs leading-relaxed text-foreground/90">
              <span className="font-semibold">No webhook URL set.</span> The snippet will use a{' '}
              <code className="font-mono text-[11px]">YOUR_WEBHOOK_URL</code> placeholder and the chat
              won't connect until you add your n8n webhook in the{' '}
              <span className="font-medium text-foreground">Connect</span> tab.
            </p>
          </div>
        )}

        <div className="relative min-w-0 overflow-hidden rounded-lg border border-border bg-black">
          <Button
            size="icon"
            variant="secondary"
            className="absolute right-2 top-2 z-10 h-8 w-8"
            onClick={handleCopy}
          >
            {copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
          </Button>
          <pre className="max-h-[400px] overflow-auto p-4 font-mono text-[11px] leading-relaxed text-zinc-200">
            {code}
          </pre>
        </div>
      </DialogContent>
    </Dialog>
  );
}
