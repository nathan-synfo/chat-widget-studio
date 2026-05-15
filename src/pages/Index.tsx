import { useState, useCallback, useEffect } from 'react';
import { ControlPanel } from '@/components/ControlPanel';
import { ChatPreview } from '@/components/ChatPreview';
import { getDefaultValues } from '@/lib/cssVariables';
import type { LogoValues, HeaderContent, WelcomeConfig, ChatConfig } from '@/lib/types';
import { toast } from 'sonner';

const STORAGE_KEY = 'n8n-chat-widget-config';

const DEFAULT_LOGOS: LogoValues = {
  headerLogo: null,
  toggleIcon: null,
  botAvatar: null,
};

const DEFAULT_HEADER_CONTENT: HeaderContent = {
  title: 'Hi there! 👋',
  subtitle: "Start a chat. We're here to help you 24/7.",
};

const DEFAULT_CHAT_CONFIG: ChatConfig = {
  webhookUrl: '',
};

function getDefaultWelcomeConfig(): WelcomeConfig {
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

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed[key] !== undefined) return parsed[key] as T;
    }
  } catch {
    // Corrupt storage — fall through to default
  }
  return fallback;
}

const Index = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  const [cssValues, setCssValues] = useState<Record<string, string>>(
    () => loadFromStorage('cssValues', getDefaultValues())
  );
  const [logos, setLogos] = useState<LogoValues>(
    () => loadFromStorage('logos', DEFAULT_LOGOS)
  );
  const [headerContent, setHeaderContent] = useState<HeaderContent>(
    () => loadFromStorage('headerContent', DEFAULT_HEADER_CONTENT)
  );
  const [welcomeConfig, setWelcomeConfig] = useState<WelcomeConfig>(
    () => loadFromStorage('welcomeConfig', getDefaultWelcomeConfig())
  );
  const [chatConfig, setChatConfig] = useState<ChatConfig>(
    () => loadFromStorage('chatConfig', DEFAULT_CHAT_CONFIG)
  );

  // Save to storage on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ cssValues, logos, headerContent, welcomeConfig, chatConfig }));
    } catch (e) {
      if (e instanceof DOMException && e.name === 'QuotaExceededError') {
        toast.error('Config not saved — storage limit exceeded. Try using image URLs instead of uploaded files.');
      }
    }
  }, [cssValues, logos, headerContent, welcomeConfig, chatConfig]);

  const handleChange = useCallback((name: string, value: string) => {
    setCssValues((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleReset = useCallback(() => {
    setCssValues(getDefaultValues());
    setLogos(DEFAULT_LOGOS);
    setHeaderContent(DEFAULT_HEADER_CONTENT);
    setWelcomeConfig(getDefaultWelcomeConfig());
    setChatConfig(DEFAULT_CHAT_CONFIG);
    localStorage.removeItem(STORAGE_KEY);
    setRefreshKey(prev => prev + 1);
  }, []);

  const handleImport = useCallback((values: Record<string, string>) => {
    setCssValues(values);
    setRefreshKey(prev => prev + 1);
  }, []);

  const handleLogoChange = useCallback((key: keyof LogoValues, value: string | null) => {
    setLogos((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleHeaderChange = useCallback((key: keyof HeaderContent, value: string) => {
    setHeaderContent((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleWelcomeChange = useCallback((config: WelcomeConfig) => {
    setWelcomeConfig(config);
  }, []);

  const handleChatConfigChange = useCallback((config: ChatConfig) => {
    setChatConfig(config);
  }, []);

  return (
    <div className="h-screen w-screen flex overflow-hidden">
      <div className="w-[380px] shrink-0 border-r border-border">
        <ControlPanel
          values={cssValues}
          onChange={handleChange}
          onReset={handleReset}
          onImport={handleImport}
          logos={logos}
          onLogoChange={handleLogoChange}
          headerContent={headerContent}
          onHeaderChange={handleHeaderChange}
          welcomeConfig={welcomeConfig}
          onWelcomeChange={handleWelcomeChange}
          chatConfig={chatConfig}
          onChatConfigChange={handleChatConfigChange}
        />
      </div>

      <div className="flex-1 min-w-0">
        <ChatPreview
          key={refreshKey}
          cssValues={cssValues}
          logos={logos}
          headerContent={headerContent}
          welcomeConfig={welcomeConfig}
        />
      </div>
    </div>
  );
};

export default Index;
