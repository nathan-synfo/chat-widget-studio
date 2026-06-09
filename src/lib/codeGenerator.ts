import { type HeaderContent, type WelcomeConfig, type LogoValues, type ChatConfig } from './types';
import { generateCSS } from './cssVariables';

interface GeneratorProps {
  cssValues: Record<string, string>;
  headerContent: HeaderContent;
  welcomeConfig: WelcomeConfig;
  logos: LogoValues;
  chatConfig: ChatConfig;
}

// Escapes a string for safe embedding inside a JS single-quoted string literal
// inside a <script> tag. Handles quotes, backslashes, newlines, and the
// </script> sequence that would prematurely terminate the tag.
function escapeForJS(str: string): string {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/\r?\n/g, '\\n')
    .replace(/\r/g, '\\n')
    .replace(/<\/script/gi, '<\\/script');
}

// Escapes a string for safe embedding inside a CSS url() or string value.
function escapeForCSS(str: string): string {
  return str.replace(/'/g, "\\'").replace(/\)/g, '\\)');
}

export const generateEmbedCode = ({ cssValues, headerContent, welcomeConfig, logos, chatConfig }: GeneratorProps) => {
  const css = generateCSS(cssValues);

  const safeTitle = escapeForJS(welcomeConfig.title);
  const safeSubtitle = escapeForJS(welcomeConfig.subtitle);
  const safeHeaderTitle = escapeForJS(headerContent.title);
  const safeHeaderSubtitle = escapeForJS(headerContent.subtitle);

  // Format the webhook URL - ensure it has a value or use placeholder
  const webhookUrl = chatConfig.webhookUrl || 'YOUR_WEBHOOK_URL';
  const safePills = JSON.stringify(welcomeConfig.pills);

  return `<link href="https://cdn.jsdelivr.net/npm/@n8n/chat/dist/style.css" rel="stylesheet" />
<style>
  ${css}
  
  .n8n-chat-welcome-container {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 24px;
    z-index: 10;
    background: linear-gradient(to top, var(--chat--color-light, #fff) 80%, transparent);
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    min-height: 300px;
    border-bottom-left-radius: var(--chat--border-radius, 12px);
    border-bottom-right-radius: var(--chat--border-radius, 12px);
    transition: opacity 0.3s ease;
  }
  .n8n-welcome-content {
    margin-bottom: 20px;
    text-align: right;
  }
  .n8n-welcome-title {
    font-size: 20px;
    font-weight: 700;
    color: var(--chat--header--background, #333);
    margin: 0 0 8px 0;
  }
  .n8n-welcome-subtitle {
    font-size: 14px;
    color: var(--chat--color-dark, #333);
    opacity: 0.8;
    margin: 0;
    line-height: 1.5;
  }
  .n8n-welcome-pills {
    display: flex;
    flex-direction: column;
    gap: 8px;
    align-items: flex-end;
  }
  .n8n-welcome-pill-btn {
    background: white;
    border: 1px solid rgba(0,0,0,0.1);
    padding: 8px 12px;
    border-radius: 10px;
    text-align: left;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    transition: all 0.2s;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: var(--chat--color-dark, #333);
    max-width: 85%;
    gap: 8px;
  }
  .n8n-welcome-pill-btn:hover {
    border-color: var(--chat--color--primary, #e74266);
    color: var(--chat--color--primary, #e74266);
    transform: translateY(-1px);
    box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  }
  .n8n-welcome-pill-arrow {
    transition: color 0.2s;
    color: var(--chat--welcome-pill-icon-color, #101330);
    margin-left: auto;
  }
  .n8n-welcome-pill-btn:hover .n8n-welcome-pill-arrow {
    color: var(--chat--welcome-pill-icon-hover-color, #e74266);
  }
  .n8n-welcome-pill-btn:hover .n8n-welcome-pill-arrow {
    opacity: 1;
    transform: translateX(0);
  }
  .n8n-chat-hidden {
    opacity: 0;
    pointer-events: none;
  }

  .chat-header-title, .n8n-chat-header-title,
  .chat-header h1,
  .n8n-chat-header h1 {
      margin: 0 !important;
      padding: 0 !important;
      line-height: var(--chat--heading--line-height, 1.2) !important;
      font-size: var(--chat--heading--font-size, 20px) !important;
  }
  .n8n-chat-widget [class*="header"] {
    justify-content: flex-start !important;
    gap: 12px !important;
  }
  .n8n-chat-widget [class*="header"] span {
    text-align: left !important;
  }
  .chat-window-transition-enter-from,
  .chat-window-transition-leave-to {
    transform: scale(0.9) translateY(20px) !important;
    opacity: 0 !important;
  }

  .chat-window-wrapper .chat-window-toggle {
    transition: none !important;
    background: var(--chat--toggle--background) !important;
  }

  .chat-window-wrapper .chat-window-toggle:hover {
    background: var(--chat--toggle--hover--background, var(--chat--toggle--background)) !important;
  }

  .chat-window-wrapper .chat-window-toggle > * {
    transition: transform var(--chat--transition-duration) ease, opacity var(--chat--transition-duration) ease !important;
    transform-origin: center center;
  }

  .chat-window-wrapper .chat-window-toggle:hover > * {
    transform: scale(1.1);
  }
  .chat-window-wrapper .chat-window-toggle:active > * {
    transform: scale(0.95);
  }
  .chat-heading, .n8n-chat-header, .chat-header {
      display: flex !important;
      flex-direction: column !important;
      gap: 0 !important;
      align-items: flex-start !important;
      text-align: left !important;
  }
  .chat-header-subtitle, .n8n-chat-header-subtitle,
  .chat-header p, .chat-description,
  .n8n-chat-header p {
      margin: 0 !important;
      padding: 0 !important;
      line-height: var(--chat--subtitle--line-height, 1.2) !important;
      margin-top: 0px !important;
      opacity: 0.9 !important;
      font-size: var(--chat--subtitle--font-size, 14px) !important;
  }

  .chat-window-wrapper .chat-window {
    overflow: hidden !important;
    padding: 0 !important;
    border: none !important;
    box-shadow: 0 0 0 1px rgba(0,0,0,0.1), 0 4px 12px rgba(0,0,0,0.1) !important;
  }
  .chat-window .chat-layout {
    padding: 0 !important;
    overflow: visible !important;
  }
  .chat-layout .chat-header {
    margin: 0 !important;
    width: 100% !important;
    max-width: 100% !important;
    border-radius: 0 !important;
  }

  .chat-layout .chat-footer {
    padding: var(--chat--spacing, 1rem) !important;
    background-color: #ffffff !important;
    border-top: 1px solid var(--chat--color-light-shade-50, #e6e9f1) !important;
  }

  .chat-inputs {
    align-items: center !important;
  }

  .chat-inputs textarea {
    border: 1px solid var(--chat--input--border-color, var(--chat--color-medium, #d2d4d9)) !important;
    border-radius: var(--chat--input--border-radius, var(--chat--border-radius, 4px)) !important;
    padding: 0.75rem !important;
    min-height: 48px !important;
    font-family: inherit !important;
    overflow: hidden !important;
    font-size: var(--chat--input--font-size, 0.85rem) !important;
  }

  .chat-input-send-button {
    background-color: var(--chat--color--primary, #e74266) !important;
    color: var(--chat--toggle--color, #ffffff) !important;
    border-radius: 50% !important;
    width: 40px !important;
    height: 40px !important;
    margin-left: 8px !important;
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
    padding: 0 !important;
    border: none !important;
    cursor: pointer !important;
  }
  .chat-input-send-button:hover {
    opacity: 0.9 !important;
  }
  .chat-input-send-button svg {
    color: currentColor !important;
    width: var(--chat--input--icon-size, 16px) !important;
    height: var(--chat--input--icon-size, 16px) !important;
    transform: rotate(-45deg) !important;
    margin: 0 !important;
  }

  .n8n-welcome-title {
    font-size: var(--chat--welcome--title-font-size, 20px) !important;
  }
  .n8n-welcome-subtitle {
    font-size: var(--chat--welcome--subtitle-font-size, 14px) !important;
  }

  ${logos.botAvatar ? `
  .n8n-chat-message-container[data-is-bot="true"] .n8n-chat-message-avatar,
  .chat-message-bot-avatar {
      background-image: url('${logos.botAvatar ? escapeForCSS(logos.botAvatar) : ''}') !important;
      background-size: cover !important;
      background-position: center !important;
      color: transparent !important;
  }
  .n8n-chat-message-container[data-is-bot="true"] .n8n-chat-message-avatar svg,
  .chat-message-bot-avatar svg {
      display: none !important;
  }
  ` : ''}
</style>

<script type="module">
  import { createChat } from 'https://cdn.jsdelivr.net/npm/@n8n/chat/dist/chat.bundle.es.js';

  const pills = ${safePills};
  
  const chat = createChat({
    webhookUrl: '${webhookUrl}',
    mode: 'window',
    initialMessages: [],
    i18n: {
      en: {
        title: '${safeHeaderTitle}',
        subtitle: '${safeHeaderSubtitle}',
      },
    },
  });
  window.n8nChat = chat;

  let welcomeHidden = false;

  const observer = new MutationObserver((mutations) => {
    const chatContainer = document.querySelector('.n8n-chat-widget') || 
                          document.querySelector('.n8n-chat') || 
                          document.querySelector('.chat-window-wrapper');
    
    if (chatContainer) {
        const chatWindow = chatContainer.querySelector('.chat-window') ||
                           chatContainer.querySelector('.n8n-chat-window');

        if (chatWindow && !chatWindow.dataset.hasObserver) {
            chatWindow.dataset.hasObserver = 'true';

            chatContainer.classList.add('n8n-chat-animated');

            const syncOpenState = () => {
                if (chatWindow.style.display !== 'none') {
                    chatWindow.classList.add('is-open');
                } else {
                    chatWindow.classList.remove('is-open');
                }
            };

            syncOpenState();

            const styleObserver = new MutationObserver(syncOpenState);
            styleObserver.observe(chatWindow, { attributes: true, attributeFilter: ['style'] });
        }

        const messageList = chatContainer.querySelector('.n8n-chat-messages-list')
                         || chatContainer.querySelector('.chat-messages')
                         || chatContainer.querySelector('[class*="messages"]')
                         || chatContainer.querySelector('[class*="history"]')
                         || chatContainer.querySelector('div:not([class]) > div[class*="message"]')?.parentNode;

        if (chatWindow && !chatWindow.querySelector('.n8n-chat-welcome-container') && !welcomeHidden) {
            renderWelcomeScreen(chatWindow);
            
            const input = chatContainer.querySelector('textarea');
            if (input) {
                input.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        hideWelcome();
                    }
                });
                const sendBtn = chatContainer.querySelector('button[class*="send"]');
                if (sendBtn) {
                   sendBtn.addEventListener('click', hideWelcome);
                }
            }
        }
    }
  });
 
   observer.observe(document.body, { childList: true, subtree: true });

    const LUCIDE_ICON_SEND ='<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-send"><path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"></path><path d="m21.854 2.147-10.94 10.939"></path></svg>';
    
    const LUCIDE_ICON_CHAT = '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-message-circle"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"></path></svg>';
    const LUCIDE_ICON_X = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"/><path d="M6 6 18 18"/></svg>';

   const logoConfig = ${JSON.stringify(logos)};

   const logoObserver = new MutationObserver(() => {
       const chatContainer = document.querySelector('.n8n-chat-widget') ||
                             document.querySelector('.n8n-chat') ||
                             document.querySelector('.chat-window-wrapper');

       if (chatContainer) {
           const toggle = chatContainer.querySelector('button[class*="toggle"]') ||
                          document.querySelector('.n8n-chat-widget-button');

           if (toggle) {
               if (logoConfig.toggleIcon && !toggle.dataset.hasCustomIcon) {
                   toggle.dataset.hasCustomIcon = 'true';
                   toggle.innerHTML = '<img src="' + logoConfig.toggleIcon + '" style="width: 100%; height: 100%; object-fit: contain;" alt="Chat" />';
               } else if (!logoConfig.toggleIcon && !toggle.dataset.hasLucideIcon) {
                   const chatWin = chatContainer.querySelector('.chat-window') || document.querySelector('.chat-window');
                   const isOpen = chatWin && (chatWin.style.display !== 'none' && chatWin.style.opacity !== '0');

                   if (!isOpen && !toggle.innerHTML.includes('lucide')) {
                        toggle.dataset.hasLucideIcon = 'true';
                        toggle.innerHTML = LUCIDE_ICON_CHAT;
                   }
               }
           }

           const header = chatContainer.querySelector('.chat-header') || chatContainer.querySelector('[class*="header"]');

           if (header) {
               if (window.getComputedStyle(header).position === 'static') {
                   header.style.position = 'relative';
               }

               if (!header.querySelector('.n8n-chat-close-btn')) {
                    const closeBtn = document.createElement('button');
                    closeBtn.className = 'n8n-chat-close-btn';
                    closeBtn.innerHTML = LUCIDE_ICON_X;
                    closeBtn.style.cssText = 'position: absolute; right: 16px; top: 16px; background: transparent; border: none; padding: 4px; border-radius: 4px; cursor: pointer; color: var(--chat--header--color, white); display: flex; align-items: center; justify-content: center; transition: opacity 0.2s; width: 28px; height: 28px; z-index: 9999;';

                    closeBtn.onclick = (e) => {
                        e.preventDefault();
                        e.stopPropagation();

                        const toggle = document.querySelector('.chat-window-toggle') ||
                                       document.querySelector('.n8n-chat-widget-button') ||
                                       document.querySelector('button[class*="toggle"]');

                        if (toggle) {
                            toggle.click();
                        } else {
                            if (window.n8nChat && typeof window.n8nChat.toggle === 'function') {
                                window.n8nChat.toggle({ isOpen: false });
                            } else {
                                console.warn('n8n Chat: Could not find toggle element to close chat');
                            }
                        }
                    };
                    closeBtn.onmouseenter = () => closeBtn.style.opacity = '0.8';
                    closeBtn.onmouseleave = () => closeBtn.style.opacity = '1';

                    header.appendChild(closeBtn);
               }

               if (logoConfig.headerLogo && !header.dataset.hasCustomLogo) {
                   header.dataset.hasCustomLogo = 'true';

                   const textWrapper = document.createElement('div');
                   textWrapper.style.cssText = 'display: flex; flex-direction: column; align-items: flex-start; justify-content: center; gap: 0px;';

                   const children = Array.from(header.childNodes);
                   children.forEach(child => {
                       if (child.className !== 'n8n-chat-close-btn') {
                           textWrapper.appendChild(child);
                       }
                   });

                   header.style.cssText += 'display: flex !important; flex-direction: row !important; align-items: center !important; justify-content: flex-start !important; gap: 12px !important; padding-right: 40px !important;';

                   const img = document.createElement('img');
                   img.src = logoConfig.headerLogo;
                   img.style.cssText = 'height: var(--chat--header--logo-height, 48px) !important; width: auto !important; object-fit: contain !important; margin: 0 !important;';

                   header.appendChild(img);
                   header.insertBefore(img, header.firstChild);
                   header.insertBefore(textWrapper, img.nextSibling);

                   const closeBtn = header.querySelector('.n8n-chat-close-btn');
                   if (closeBtn) header.appendChild(closeBtn);
               }
           }
       }
   });
   logoObserver.observe(document.body, { childList: true, subtree: true });

   function hideWelcome() {
     const el = document.querySelector('.n8n-chat-welcome-container');
     if (el) el.classList.add('n8n-chat-hidden');
     welcomeHidden = true;
  }

  function renderWelcomeScreen(container) {
    if (welcomeHidden) return;

    const wrapper = document.createElement('div');
    wrapper.className = 'n8n-chat-welcome-container';

    const header = document.createElement('div');
    header.style.marginBottom = '16px';
    header.style.textAlign = 'right';

    const title = document.createElement('div');
    title.innerText = '${safeTitle}';
    title.style.fontWeight = 'bold';
    title.style.fontSize = '18px';
    title.style.color = 'var(--chat--welcome--title-color, var(--chat--header--background))';
    title.style.marginBottom = '4px';
    
    const subtitle = document.createElement('div');
    subtitle.innerText = '${safeSubtitle}';
    subtitle.style.color = 'var(--chat--welcome--subtitle-color, var(--chat--color-dark))';
    subtitle.style.fontSize = '14px';
    subtitle.style.opacity = '0.8';

    header.appendChild(title);
    header.appendChild(subtitle);
    wrapper.appendChild(header);

    const pillsContainer = document.createElement('div');
    pillsContainer.style.display = 'flex';
    pillsContainer.style.flexDirection = 'column';
    pillsContainer.style.alignItems = 'flex-end';
    pillsContainer.style.gap = '8px';

    pills.forEach(pill => {
      const btn = document.createElement('button');
      btn.className = 'n8n-chat-welcome-pill';
      btn.style.cssText = 'background: white; border: 1px solid #eee; padding: 8px 12px; border-radius: 8px; cursor: pointer; box-shadow: 0 1px 2px rgba(0,0,0,0.05); display: flex; align-items: center; justify-content: space-between; gap: 8px; font-size: 12px; color: var(--chat--color-dark); transition: all 0.2s; width: auto; max-width: 85%;';

      btn.onmouseenter = () => {
          btn.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
          const svg = btn.querySelector('svg');
          if(svg) svg.style.color = 'var(--chat--welcome-pill-icon-hover-color, #e74266)';
      };
      btn.onmouseleave = () => {
          btn.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)';
          const svg = btn.querySelector('svg');
          if(svg) svg.style.color = 'var(--chat--welcome-pill-icon-color, #101330)';
      };

      const labelSpan = document.createElement('span');
      labelSpan.style.fontWeight = '500';
      labelSpan.textContent = pill.label;
      btn.appendChild(labelSpan);

      const iconWrapper = document.createElement('span');
      iconWrapper.innerHTML = LUCIDE_ICON_SEND;
      btn.appendChild(iconWrapper);

  const svg = btn.querySelector('svg');
  if (svg) {
    svg.style.transition = 'color 0.2s';
    svg.style.color = 'var(--chat--welcome-pill-icon-color, #101330)';
    svg.style.width = '12px';
    svg.style.height = '12px';
  }

  btn.onclick = () => {
    hideWelcome();

    const chatContainer = document.querySelector('.n8n-chat-widget') ||
      document.querySelector('.n8n-chat') ||
      document.querySelector('.chat-window-wrapper');

    if (chatContainer) {
      const input = chatContainer.querySelector('textarea');
      if (input) {
        const propertyDescriptor = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value");
        if (propertyDescriptor && propertyDescriptor.set) {
          propertyDescriptor.set.call(input, pill.message);
        } else {
          input.value = pill.message;
        }

        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));

        setTimeout(() => {
          const sendBtn = chatContainer.querySelector('button[class*="send"]') ||
            chatContainer.querySelector('.chat-input-send-button');

          if (sendBtn) {
            sendBtn.click();
          } else {
            const enterEvent = new KeyboardEvent('keydown', {
              key: 'Enter',
              code: 'Enter',
              keyCode: 13,
              which: 13,
              bubbles: true
            });
            input.dispatchEvent(enterEvent);
          }
        }, 0);
      }
    }
  };
  pillsContainer.appendChild(btn);
});

wrapper.appendChild(pillsContainer);

const messageList = container.querySelector('.n8n-chat-messages-list')
  || container.querySelector('.chat-messages')
  || container.querySelector('[class*="messages"]')
  || container.querySelector('[class*="history"]')
  || container;

if (getComputedStyle(messageList).position === 'static') {
  messageList.style.position = 'relative';
}

messageList.appendChild(wrapper);
  }
</script>`;
};
