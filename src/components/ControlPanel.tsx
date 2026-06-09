import { ThemeSection } from './studio/sections/ThemeSection';
import { HeaderSection } from './studio/sections/HeaderSection';
import { WelcomeSection } from './studio/sections/WelcomeSection';
import { MessagesSection } from './studio/sections/MessagesSection';
import { InputSection } from './studio/sections/InputSection';
import { LayoutSection } from './studio/sections/LayoutSection';
import { TypographySection } from './studio/sections/TypographySection';
import { MotionSection } from './studio/sections/MotionSection';
import { ConnectSection } from './studio/sections/ConnectSection';

/** Thin router: renders the section matching the active tab. */
export function ControlPanel({ tab }: { tab: string }) {
  switch (tab) {
    case 'theme':
      return <ThemeSection />;
    case 'header':
      return <HeaderSection />;
    case 'welcome':
      return <WelcomeSection />;
    case 'messages':
      return <MessagesSection />;
    case 'input':
      return <InputSection />;
    case 'layout':
      return <LayoutSection />;
    case 'typography':
      return <TypographySection />;
    case 'motion':
      return <MotionSection />;
    case 'connect':
      return <ConnectSection />;
    default:
      return <ThemeSection />;
  }
}
