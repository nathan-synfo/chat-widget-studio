import { useState, useCallback, useEffect } from 'react';
import { ControlPanel } from '@/components/ControlPanel';
import { ChatPreview } from '@/components/ChatPreview';
import { getDefaultValues } from '@/lib/cssVariables';
import type { LogoValues, HeaderContent, WelcomeConfig, ChatConfig } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'n8n-chat-widget-config';

const Index = () => {
  // Initialize state from localStorage or defaults
  const [initialized, setInitialized] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const [cssValues, setCssValues] = useState<Record<string, string>>(getDefaultValues);
  const [logos, setLogos] = useState<LogoValues>({
    headerLogo: null,
    toggleIcon: null,
    botAvatar: null,
  });
  const [headerContent, setHeaderContent] = useState<HeaderContent>({
    title: 'Hi there! 👋',
    subtitle: "Start a chat. We're here to help you 24/7.",
  });
  const [welcomeConfig, setWelcomeConfig] = useState<WelcomeConfig>({
    enabled: true,
    title: 'Hello! 👋',
    subtitle: 'How can we help you today?',
    pills: [
      { id: '1', label: 'Product Pricing', message: 'I would like to know about pricing.' },
      { id: '2', label: 'Technical Support', message: 'I need technical support.' },
    ]
  });
  const [chatConfig, setChatConfig] = useState<ChatConfig>({
    webhookUrl: '',
  });

  // Load from storage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.cssValues) setCssValues(parsed.cssValues);
        if (parsed.logos) setLogos(parsed.logos);
        if (parsed.headerContent) setHeaderContent(parsed.headerContent);
        if (parsed.welcomeConfig) setWelcomeConfig(parsed.welcomeConfig);
        if (parsed.chatConfig) setChatConfig(parsed.chatConfig);
      } catch (e) {
        console.error('Failed to load chat config', e);
      }
    }
    setInitialized(true);
  }, []);

  // Save to storage on change
  useEffect(() => {
    if (!initialized) return;

    const config = {
      cssValues,
      logos,
      headerContent,
      welcomeConfig,
      chatConfig,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  }, [cssValues, logos, headerContent, welcomeConfig, chatConfig, initialized]);

  const handleChange = useCallback((name: string, value: string) => {
    setCssValues((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleReset = useCallback(() => {
    setCssValues(getDefaultValues());
    setLogos({ headerLogo: null, toggleIcon: null, botAvatar: null });
    setHeaderContent({ title: 'Hi there! 👋', subtitle: "Start a chat. We're here to help you 24/7." });
    setWelcomeConfig({
      enabled: true,
      title: 'Hello! 👋',
      subtitle: 'How can we help you today?',
      pills: [
        { id: uuidv4(), label: 'Product Pricing', message: 'I would like to know about pricing.' },
        { id: uuidv4(), label: 'Technical Support', message: 'I need technical support.' },
      ]
    });
    setChatConfig({ webhookUrl: '' });
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

  if (!initialized) {
    return null; // Or a loading spinner
  }

  return (
    <div className="h-screen w-screen flex overflow-hidden">
      {/* Control Panel */}
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

      {/* Preview */}
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
