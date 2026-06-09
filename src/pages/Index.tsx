import { useEffect, useState } from 'react';
import { useDesignManager } from '@/hooks/useDesignManager';
import { StudioProvider } from '@/components/studio/studio-context';
import { TopBar } from '@/components/studio/TopBar';
import { TabBar } from '@/components/studio/TabBar';
import { PreviewPane } from '@/components/studio/PreviewPane';
import { ControlPanel } from '@/components/ControlPanel';

const Index = () => {
  const manager = useDesignManager();
  const [tab, setTab] = useState('theme');

  const { undo, redo } = manager;

  // Keyboard: Cmd/Ctrl+Z = undo, Cmd/Ctrl+Shift+Z (or Ctrl+Y) = redo.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      if (!mod) return;
      const key = e.key.toLowerCase();
      if (key === 'z') {
        e.preventDefault();
        if (e.shiftKey) redo();
        else undo();
      } else if (key === 'y') {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [undo, redo]);

  return (
    <StudioProvider manager={manager}>
      <div className="flex h-screen w-screen flex-col overflow-hidden bg-background text-foreground">
        <TopBar />
        <TabBar tab={tab} setTab={setTab} />
        <div className="flex min-h-0 flex-1">
          <div className="flex w-[420px] shrink-0 flex-col border-r border-border bg-card">
            <ControlPanel tab={tab} />
          </div>
          <PreviewPane />
        </div>
      </div>
    </StudioProvider>
  );
};

export default Index;
