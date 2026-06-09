import { useState } from 'react';
import { ChatPreview } from '@/components/ChatPreview';
import { PreviewStage } from './PreviewStage';
import { MockSite } from './MockSite';
import { useStudio } from './studio-context';

export function PreviewPane() {
  const { active, refreshKey } = useStudio();
  const [open, setOpen] = useState(true);

  return (
    <div className="relative flex min-w-0 flex-1 flex-col bg-[#070709]">
      <PreviewStage>
        <MockSite />
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
