import { useEffect, useRef, useState } from 'react';
import { generateCSS } from '@/lib/cssVariables';
import { ChevronDown, Send, X } from 'lucide-react';
import type { HeaderContent, WelcomeConfig, LogoValues } from '@/lib/types';

interface ChatPreviewProps {
  cssValues: Record<string, string>;
  logos: LogoValues;
  headerContent: HeaderContent;
  welcomeConfig: WelcomeConfig;
  /** When true, drops the muted backdrop, dot grid and dashed outline so it can overlay a mock site. */
  transparent?: boolean;
  /** Controlled open state. When provided, internal open state is ignored. */
  forcedOpen?: boolean;
  /** Notifies parent when the open state should change (close button, toggle). */
  onOpenChange?: (open: boolean) => void;
}

export function ChatPreview({
  cssValues,
  logos,
  headerContent,
  welcomeConfig,
  transparent = false,
  forcedOpen,
  onOpenChange,
}: ChatPreviewProps) {
  const isControlled = forcedOpen !== undefined;
  const [internalOpen, setInternalOpen] = useState(false); // Default closed
  const open = isControlled ? forcedOpen! : internalOpen;

  const setOpen = (next: boolean) => {
    onOpenChange?.(next);
    if (!isControlled) setInternalOpen(next);
  };

  const [hasMessages, setHasMessages] = useState(false);
  const [userMessage, setUserMessage] = useState('');
  const [inputValue, setInputValue] = useState('');
  const styleRef = useRef<HTMLStyleElement | null>(null);

  const handlePillClick = (msg: string) => {
    setUserMessage(msg);
    setHasMessages(true);
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;
    setUserMessage(inputValue);
    setHasMessages(true);
    setInputValue('');
  };

  useEffect(() => {
    // Create or update style element
    if (!styleRef.current) {
      styleRef.current = document.createElement('style');
      styleRef.current.id = 'n8n-chat-preview-styles';
      document.head.appendChild(styleRef.current);
    }

    // Generate and inject CSS
    // Scope the variables to the preview container to prevent polluting the main app
    const css = generateCSS(cssValues, '#chat-preview-container');
    styleRef.current.textContent = css;

    return () => {
      if (styleRef.current) {
        styleRef.current.remove();
        styleRef.current = null;
      }
    };
  }, [cssValues]);

  return (
    <div
      className={
        transparent
          ? 'absolute inset-0 overflow-hidden'
          : 'h-full w-full flex items-center justify-center bg-background relative overflow-hidden'
      }
    >
      {!transparent && (
        <>
          {/* Background dot pattern */}
          <div
            className="absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
              backgroundSize: '24px 24px',
            }}
          />
          {/* Radial vignette */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse 80% 70% at 50% 50%, transparent 40%, hsl(220,20%,10%) 100%)',
            }}
          />
          {/* Live Preview label */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10 pointer-events-none">
            <div className="w-1.5 h-1.5 rounded-full bg-primary/70 animate-pulse" />
            <span className="text-[10px] font-medium text-muted-foreground/60 tracking-widest uppercase select-none">
              Live Preview
            </span>
          </div>
        </>
      )}

      {/* Preview container - Acts as the "Viewport" */}
      <div
        id="chat-preview-container"
        className={
          transparent
            ? 'relative w-full h-full pointer-events-none'
            : 'relative w-full h-full pointer-events-none border border-dashed border-border/50 rounded-lg'
        }
      >
        {/* IMPORTANT: ID used for Scoping CSS Variables */}
        <div className="chat-layout n8n-chat-animated absolute inset-0 pointer-events-auto">
          {/* Chat window */}
          <div
            className={`chat-window absolute flex flex-col overflow-hidden ${open ? 'is-open' : ''}`}
            style={{
              width: 'var(--chat--window--width, 400px)',
              height: 'var(--chat--window--height, 600px)',
              backgroundColor: 'var(--chat--color-light, #f2f4f8)',
              borderRadius: 'var(--chat--border-radius, 0.25rem)',
              boxShadow: '0 0 0 1px rgba(0,0,0,0.1), 0 4px 12px rgba(0,0,0,0.1)', // Matches Live Widget "Header Gap Fix" shadow
              // Positioning logic matching the real widget
              bottom: 'calc(var(--chat--window--bottom, 20px) + var(--chat--toggle--size, 64px) + 20px)',
              right: 'var(--chat--window--right, 20px)',
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between"
              style={{
                backgroundColor: 'var(--chat--header--background, var(--chat--color-dark))',
                color: 'var(--chat--header--color, var(--chat--color-light))',
                padding: 'var(--chat--header--padding, var(--chat--spacing))',
                height: 'var(--chat--header-height, auto)',
                borderTop: 'var(--chat--header--border-top, none)',
                borderBottom: 'var(--chat--header--border-bottom, none)',
              }}
            >
              <div className="flex items-center gap-3">
                {logos.headerLogo && (
                  <img
                    src={logos.headerLogo}
                    alt="Logo"
                    className="w-auto object-contain"
                    style={{ height: 'var(--chat--header--logo-height, 48px)' }}
                  />
                )}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 0, alignItems: 'flex-start', textAlign: 'left' }}>
                  <h2 style={{
                    fontSize: 'var(--chat--heading--font-size, 2em)',
                    lineHeight: 'var(--chat--heading--line-height, 1.2)',
                    margin: 0,
                    fontWeight: 600,
                  }}>
                    {headerContent.title}
                  </h2>
                  <p style={{
                    fontSize: 'var(--chat--subtitle--font-size, inherit)',
                    lineHeight: 'var(--chat--subtitle--line-height, 1.2)',
                    margin: 0,
                    opacity: 0.9,
                  }}>
                    {headerContent.subtitle}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-1 rounded hover:opacity-80 transition-opacity"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages area */}
            <div className="flex-1 overflow-y-auto relative" style={{ padding: 'var(--chat--spacing, 1rem)' }}>

              {/* Welcome Screen (Empty State) */}
              {welcomeConfig.enabled && !hasMessages && (
                <div className="absolute inset-0 p-4 flex flex-col justify-end pb-4 animated-entry">
                  <div className="mb-4 space-y-2 text-right">
                    <h3 className="font-bold text-lg" style={{ color: 'var(--chat--welcome--title-color, var(--chat--header--background))', fontSize: 'var(--chat--welcome--title-font-size, 20px)' }}>{welcomeConfig.title}</h3>
                    <p className="text-sm" style={{ color: 'var(--chat--welcome--subtitle-color, var(--chat--color-dark))', opacity: 0.8, fontSize: 'var(--chat--welcome--subtitle-font-size, 14px)' }}>{welcomeConfig.subtitle}</p>
                  </div>
                  <div className="flex flex-col gap-2 items-end">
                    {welcomeConfig.pills.map((pill) => (
                      <button
                        key={pill.id}
                        className="text-left text-xs py-2 px-3 rounded-lg transition-all border shadow-sm hover:shadow-md flex items-center justify-between gap-2 group bg-white max-w-[85%]"
                        onClick={() => handlePillClick(pill.message)}
                        style={{
                          borderColor: 'var(--chat--color-light-shade-50, #eee)',
                          color: 'var(--chat--color-dark)',
                        }}
                      >
                        <span className="font-medium">{pill.label}</span>
                        <Send className="w-3 h-3 transition-colors text-[var(--chat--welcome-pill-icon-color)] group-hover:text-[var(--chat--welcome-pill-icon-hover-color)]" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Messages */}
              {hasMessages && (
                <div className="space-y-4">
                  {/* User message (Dynamic) */}
                  <div className="flex justify-end">
                    <div
                      className="inline-block max-w-[80%] rounded-lg"
                      style={{
                        backgroundColor: 'var(--chat--message--user--background, var(--chat--color--secondary))',
                        color: 'var(--chat--message--user--color, var(--chat--color-white))',
                        padding: 'var(--chat--message--padding, var(--chat--spacing))',
                        borderRadius: 'var(--chat--message--border-radius, var(--chat--border-radius))',
                        fontSize: 'var(--chat--message--font-size, 1rem)',
                        lineHeight: 'var(--chat--message-line-height, 1.8)',
                        border: 'var(--chat--message--user--border, none)',
                      }}
                    >
                      {userMessage}
                    </div>
                  </div>

                  {/* Bot message */}
                  <div className="flex items-start gap-2">
                    {logos.botAvatar && (
                      <img
                        src={logos.botAvatar}
                        alt="Bot"
                        className="w-8 h-8 rounded-full object-cover shrink-0"
                      />
                    )}
                    <div
                      className="chat-message inline-block max-w-[80%] rounded-lg"
                      style={{
                        backgroundColor: 'var(--chat--message--bot--background, var(--chat--color-white))',
                        color: 'var(--chat--message--bot--color, var(--chat--color-dark))',
                        padding: 'var(--chat--message--padding, var(--chat--spacing))',
                        borderRadius: 'var(--chat--message--border-radius, var(--chat--border-radius))',
                        fontSize: 'var(--chat--message--font-size, 1rem)',
                        lineHeight: 'var(--chat--message-line-height, 1.8)',
                        border: 'var(--chat--message--bot--border, none)',
                      }}
                    >
                      Thanks for checking in! This is a preview of how your conversation will look.
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input area */}
            <div
              className="border-t flex items-center gap-2"
              style={{
                padding: 'var(--chat--spacing, 1rem)',
                backgroundColor: 'var(--chat--color-white, #ffffff)',
                borderColor: 'var(--chat--color-light-shade-50, #e6e9f1)',
              }}
            >
              <textarea
                placeholder="Type your question.."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                className="flex-1 resize-none border rounded px-3 py-2 text-sm outline-none"
                style={{
                  height: 'var(--chat--textarea--height, 50px)',
                  borderColor: 'var(--chat--input--border-color, var(--chat--color-medium, #d2d4d9))',
                  borderRadius: 'var(--chat--input--border-radius, var(--chat--border-radius, 0.25rem))',
                  color: 'var(--chat--color-dark, #101330)',
                  fontSize: 'var(--chat--input--font-size, 0.85rem)',
                }}
              />
              <button
                onClick={handleSend}
                className="rounded-full p-3 transition-colors flex items-center justify-center"
                style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: 'var(--chat--input--send--background, var(--chat--color--primary))',
                  color: 'var(--chat--toggle--color, #ffffff)',
                  padding: 0,
                }}
              >
                <Send
                  fill="currentColor"
                  style={{
                    width: 'var(--chat--input--icon-size, 16px)',
                    height: 'var(--chat--input--icon-size, 16px)',
                    margin: 0,
                  }}
                />
              </button>
            </div>
          </div>

          {/* Toggle button */}
          <button
            onClick={() => setOpen(!open)}
            className="absolute rounded-full shadow-lg transition-all flex items-center justify-center overflow-hidden"
            style={{
              width: 'var(--chat--toggle--size, 64px)',
              height: 'var(--chat--toggle--size, 64px)',
              backgroundColor: 'var(--chat--toggle--background, var(--chat--color--primary))',
              color: 'var(--chat--toggle--color, var(--chat--color-white))',
              transition: `all var(--chat--transition-duration, 0.15s) ease`,
              // Positioning
              bottom: 'var(--chat--window--bottom, 20px)',
              right: 'var(--chat--window--right, 20px)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--chat--toggle--hover--background, var(--chat--color--primary-shade-50))';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--chat--toggle--background, var(--chat--color--primary))';
            }}
          >
            {open ? (
              <ChevronDown className="w-8 h-8" />
            ) : logos.toggleIcon ? (
              <img src={logos.toggleIcon} alt="Chat" className="w-8 h-8 object-contain" />
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="0" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-circle w-7 h-7">
                <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
