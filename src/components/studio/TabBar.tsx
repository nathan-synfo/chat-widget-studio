import {
  FileText,
  LayoutGrid,
  Link as LinkIcon,
  MessageSquare,
  Palette,
  Send,
  Sparkles,
  Type,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface TabDef {
  id: string;
  label: string;
  icon: LucideIcon;
}

export const TABS: TabDef[] = [
  { id: 'theme', label: 'Theme', icon: Palette },
  { id: 'header', label: 'Header', icon: FileText },
  { id: 'welcome', label: 'Welcome', icon: Sparkles },
  { id: 'messages', label: 'Messages', icon: MessageSquare },
  { id: 'input', label: 'Input', icon: Send },
  { id: 'layout', label: 'Layout', icon: LayoutGrid },
  { id: 'typography', label: 'Typography', icon: Type },
  { id: 'motion', label: 'Motion', icon: Zap },
  { id: 'connect', label: 'Connect', icon: LinkIcon },
];

export function TabBar({ tab, setTab }: { tab: string; setTab: (id: string) => void }) {
  return (
    <div className="flex h-[42px] shrink-0 items-center gap-1 overflow-x-auto border-b border-border bg-card/60 px-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {TABS.map((t) => {
        const active = tab === t.id;
        const Icon = t.icon;
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={cn(
              'flex h-7 shrink-0 items-center gap-1.5 rounded-md px-3 text-xs font-medium transition-colors',
              active
                ? 'bg-muted text-foreground'
                : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground',
            )}
          >
            <Icon className={cn('h-3.5 w-3.5', active && 'text-primary')} />
            {t.label}
          </button>
        );
      })}
    </div>
  );
}
