import { getDefaultValues } from './cssVariables';
import type { LogoValues, HeaderContent, WelcomeConfig, ChatConfig } from './types';

export interface WidgetDesign {
  id: string;
  name: string;
  updatedAt: number;
  cssValues: Record<string, string>;   // seeded from getDefaultValues()
  logos: LogoValues;                    // { headerLogo, toggleIcon, botAvatar }
  headerContent: HeaderContent;         // { title, subtitle }
  welcomeConfig: WelcomeConfig;         // { enabled, title, subtitle, pills[] }
  chatConfig: ChatConfig;               // { webhookUrl }
}

/** The primary accent of a design — used for the switcher swatches. */
export const designAccent = (d: WidgetDesign): string =>
  d.cssValues['--chat--color--primary'] || '#e74266';

export const DEFAULT_LOGOS: LogoValues = {
  headerLogo: null,
  toggleIcon: null,
  botAvatar: null,
};

export const DEFAULT_HEADER_CONTENT: HeaderContent = {
  title: 'Hi there! 👋',
  subtitle: "Start a chat. We're here to help you 24/7.",
};

export const DEFAULT_CHAT_CONFIG: ChatConfig = {
  webhookUrl: '',
};

export function createDefaultWelcomeConfig(): WelcomeConfig {
  return {
    enabled: true,
    title: 'Hello! 👋',
    subtitle: 'How can we help you today?',
    pills: [
      { id: crypto.randomUUID(), label: 'Product Pricing', message: 'I would like to know about pricing.' },
      { id: crypto.randomUUID(), label: 'Technical Support', message: 'I need technical support.' },
    ],
  };
}

/** Build a fresh, fully-seeded design. */
export function createDefaultDesign(name = 'My widget'): WidgetDesign {
  return {
    id: crypto.randomUUID(),
    name,
    updatedAt: Date.now(),
    cssValues: getDefaultValues(),
    logos: { ...DEFAULT_LOGOS },
    headerContent: { ...DEFAULT_HEADER_CONTENT },
    welcomeConfig: createDefaultWelcomeConfig(),
    chatConfig: { ...DEFAULT_CHAT_CONFIG },
  };
}
