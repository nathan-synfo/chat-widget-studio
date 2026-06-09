import { useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { ChatPreview } from '@/components/ChatPreview';
import { PreviewStage } from './PreviewStage';
import { MockSite, type MockTheme } from './MockSite';
import { useStudio } from './studio-context';
import { cn } from '@/lib/utils';

export function PreviewPane() {
  const { active, refreshKey } = useStudio();
  const [open, setOpen] = useState(true);
  const [mockTheme, setMockTheme] = useState<MockTheme>('dark');

  return (
    <div className="relative flex min-w-0 flex-1 flex-col bg-[#070709]">
      {/* Canvas light/dark toggle */}
      <div className="absolute right-3 top-3 z-20 flex items-center gap-0.5 rounded-md border border-border bg-card/90 p-0.5 shadow-lg backdrop-blur">
        {([
          { id: 'light', icon: Sun, label: 'Light canvas' },
          { id: 'dark', icon: Moon, label: 'Dark canvas' },
        ] as const).map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            type="button"
            title={label}
            aria-label={label}
            aria-pressed={mockTheme === id}
            onClick={() => setMockTheme(id)}
            className={cn(
              'flex h-6 w-6 items-center justify-center rounded transition-colors',
              mockTheme === id
                ? 'bg-muted text-foreground'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <Icon className="h-3.5 w-3.5" />
          </button>
        ))}
      </div>

      <PreviewStage>
        <MockSite theme={mockTheme} />
        <ChatPreview
          key={refreshKey}
          cssValues={active.cssValues}
          logos={active.logos}
          headerContent={active.headerContent}
          welcomeConfig={active.welcomeConfig}
          transparent
          forcedOpen={open}
          onOpenChange={setOpen}
        />
      </PreviewStage>
    </div>
  );
}
