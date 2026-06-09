import { useState } from 'react';
import { Check, Code, Copy } from 'lucide-react';
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
            {hasWebhook
              ? 'Paste this snippet just before the closing </body> tag on your site.'
              : 'Set your n8n webhook URL in the Connect tab first, then paste this snippet before the closing </body> tag.'}
          </DialogDescription>
        </DialogHeader>

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
