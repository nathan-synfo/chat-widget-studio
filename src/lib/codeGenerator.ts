import { type HeaderContent, type WelcomeConfig, type LogoValues, type ChatConfig } from './types';
import { generateCSS } from './cssVariables';

interface GeneratorProps {
  cssValues: Record<string, string>;
  headerContent: HeaderContent;
  welcomeConfig: WelcomeConfig;
  logos: LogoValues;
  chatConfig: ChatConfig;
}

export const generateEmbedCode = ({ cssValues, headerContent, welcomeConfig, logos, chatConfig }: GeneratorProps) => {
  const css = generateCSS(cssValues);

  // Escape strings for JS safety
  const safeTitle = welcomeConfig.title.replace(/'/g, "\\'");
  const safeSubtitle = welcomeConfig.subtitle.replace(/'/g, "\\'");

  const safeHeaderTitle = headerContent.title.replace(/'/g, "\\'");
  const safeHeaderSubtitle = headerContent.subtitle.replace(/'/g, "\\'");

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
  
  /* Header Text Resets & Spacing */
  .chat-header-title, .n8n-chat-header-title, 
  .chat-header h1, 
  .n8n-chat-header h1 {
      margin: 0 !important; 
      padding: 0 !important; 
      line-height: var(--chat--heading--line-height, 1.2) !important;
      font-size: var(--chat--heading--font-size, 20px) !important;
  }
  /* CSS Overrides to match Preview */
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
  
  /* 
     FIX: Decouple Toggle Animation from Window Logic 
     The Vue app waits for the toggle button transition to finish before closing the window.
     By removing the transition from the parent button, we unblock the window immediately.
     We then re-apply the transition to the inner icon (svg/img) so the visual effect remains.
  */
  .chat-window-wrapper .chat-window-toggle {
    transition: none !important;
    background: var(--chat--toggle--background) !important; /* Ensure bg is static or handled */
  }

  .chat-window-wrapper .chat-window-toggle:hover {
    background: var(--chat--toggle--hover--background, var(--chat--toggle--background)) !important;
  }
  
  /* Apply transition to the icon inside */
  .chat-window-wrapper .chat-window-toggle > * {
    transition: transform var(--chat--transition-duration) ease, opacity var(--chat--transition-duration) ease !important;
    transform-origin: center center;
  }

  /* Re-imitate Hover Effects on Child */
  .chat-window-wrapper .chat-window-toggle:hover > * {
    transform: scale(1.1);
  }
  .chat-window-wrapper .chat-window-toggle:active > * {
    transform: scale(0.95);
  }
  /* Target the container to remove flex */
  .chat-heading, .n8n-chat-header, .chat-header {
      display: flex !important;
      flex-direction: column !important;
      gap: 0 !important;
      align-items: flex-start !important; /* Fix centering issue */
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


  
  /* Header Gap Fix */
  .chat-window-wrapper .chat-window {
    overflow: hidden !important;
    padding: 0 !important;
    border: none !important; /* Remove physical border (source of gap) */
    box-shadow: 0 0 0 1px rgba(0,0,0,0.1), 0 4px 12px rgba(0,0,0,0.1) !important; /* Simulate border with shadow */
  }
  .chat-window .chat-layout {
    padding: 0 !important;
    overflow: visible !important;
  }
  .chat-layout .chat-header {
    margin: 0 !important; /* Reset margin */
    width: 100% !important;
    max-width: 100% !important;
    border-radius: 0 !important;
  }

  /* Chat Footer & Input Container */
  .chat-layout .chat-footer {
    padding: var(--chat--spacing, 1rem) !important;
    background-color: #ffffff !important; /* Fixed background */
    border-top: 1px solid var(--chat--color-light-shade-50, #e6e9f1) !important;
  }

  /* Input Area Alignment */
  .chat-inputs {
    align-items: center !important; /* Center vertically */
  }

  /* Input Area Styling */
  .chat-inputs textarea {
    border: 1px solid var(--chat--input--border-color, var(--chat--color-medium, #d2d4d9)) !important;
    border-radius: var(--chat--input--border-radius, var(--chat--border-radius, 4px)) !important;
    padding: 0.75rem !important;
    min-height: 48px !important;
    font-family: inherit !important;
    overflow: hidden !important; /* Remove scrollbar */
    font-size: var(--chat--input--font-size, 0.85rem) !important;
  }

  /* Send Button Styling */
  .chat-input-send-button {
    background-color: var(--chat--color--primary, #e74266) !important;
    color: var(--chat--toggle--color, #ffffff) !important;
    border-radius: 50% !important;
    width: 40px !important; /* Smaller button */
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
  /* Icon Rotation and Size */
  .chat-input-send-button svg {
    color: currentColor !important;
    width: var(--chat--input--icon-size, 16px) !important;
    height: var(--chat--input--icon-size, 16px) !important;
    transform: rotate(-45deg) !important;
    margin: 0 !important; /* Centered by flex */
  }

  /* Welcome Screen Fonts */
  .n8n-welcome-title {
    font-size: var(--chat--welcome--title-font-size, 20px) !important;
  }
  .n8n-welcome-subtitle {
    font-size: var(--chat--welcome--subtitle-font-size, 14px) !important;
  }


  /* Bot Avatar Override */
  ${logos.botAvatar ? `
  .n8n-chat-message-container[data-is-bot="true"] .n8n-chat-message-avatar,
  .chat-message-bot-avatar {
      background-image: url('${logos.botAvatar}') !important;
      background-size: cover !important;
      background-position: center !important;
      color: transparent !important; /* Hide default SVG/text */
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
  // Expose chat instance for external control (Close button)
  window.n8nChat = chat;

  let welcomeHidden = false;

  const observer = new MutationObserver((mutations) => {
    const chatContainer = document.querySelector('.n8n-chat-widget') || 
                          document.querySelector('.n8n-chat') || 
                          document.querySelector('.chat-window-wrapper');
    
    if (chatContainer) {
        // Animation Handler - Progressive Enhancement
        const chatWindow = chatContainer.querySelector('.chat-window') || 
                           chatContainer.querySelector('.n8n-chat-window');

        if (chatWindow && !chatWindow.dataset.hasObserver) {
            chatWindow.dataset.hasObserver = 'true';
            
            // Enable animations only if we successfully found the window elements
            chatContainer.classList.add('n8n-chat-animated');
            
            const syncOpenState = () => {
                if (chatWindow.style.display !== 'none') {
                    chatWindow.classList.add('is-open');
                } else {
                    chatWindow.classList.remove('is-open');
                }
            };
            
            // Initial sync
            syncOpenState();
            
            // Watch for style changes (display toggle)
            const styleObserver = new MutationObserver(syncOpenState);
            styleObserver.observe(chatWindow, { attributes: true, attributeFilter: ['style'] });
        }

        const messageList = chatContainer.querySelector('.n8n-chat-messages-list') 
                         || chatContainer.querySelector('.chat-messages') 
                         || chatContainer.querySelector('[class*="messages"]')
                         || chatContainer.querySelector('[class*="history"]')
                         || chatContainer.querySelector('div:not([class]) > div[class*="message"]')?.parentNode; // Deep fallback
        
        if (messageList) {
             const messages = messageList.querySelectorAll('.n8n-chat-message-container, .chat-message');
             if (messages.length > 0 && !welcomeHidden) {
             }
        }
        
        // Robust Injection: Check if element exists in DOM (handling React re-renders)
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
   
    // Lucide Icons
    const LUCIDE_ICON_SEND = '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-send"><path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"></path><path d="m21.854 2.147-10.94 10.939"></path></svg>';
    
    const LUCIDE_ICON_CHAT = '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-message-circle"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"></path></svg>';
    const LUCIDE_ICON_X = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"/><path d="M6 6 18 18"/></svg>';

   // Logo Injection Logic
   const logoConfig = ${JSON.stringify(logos)};
   
   const logoObserver = new MutationObserver(() => {
       const chatContainer = document.querySelector('.n8n-chat-widget') || 
                             document.querySelector('.n8n-chat') || 
                             document.querySelector('.chat-window-wrapper');
                             
       if (chatContainer) {
           // Toggle Icon
           const toggle = chatContainer.querySelector('button[class*="toggle"]') || 
                          document.querySelector('.n8n-chat-widget-button'); // External toggle
           
           if (toggle) {
               if (logoConfig.toggleIcon && !toggle.dataset.hasCustomIcon) {
                   toggle.dataset.hasCustomIcon = 'true';
                   toggle.innerHTML = '<img src="' + logoConfig.toggleIcon + '" style="width: 100%; height: 100%; object-fit: contain;" alt="Chat" />';
               } else if (!logoConfig.toggleIcon && !toggle.dataset.hasLucideIcon) {
                   // Inject Lucide Icon (Only if closed?)
                   // Check if window is open
                   const window = chatContainer.querySelector('.chat-window') || document.querySelector('.chat-window');
                   const isOpen = window && (window.style.display !== 'none' && window.style.opacity !== '0');
                   
                   if (!isOpen && !toggle.innerHTML.includes('lucide')) {
                        toggle.dataset.hasLucideIcon = 'true';
                        toggle.innerHTML = LUCIDE_ICON_CHAT;
                        // We need to reset this when it opens? 
                        // The widget will likely overwrite it. We just need to re-apply if it reverts.
                   }
               }
           }
           
           // Header Logic (Logo + Close Button)
           const header = chatContainer.querySelector('.chat-header') || chatContainer.querySelector('[class*="header"]');
           
           if (header) {
               // Ensure header is relative for absolute positioning of close button
               if (window.getComputedStyle(header).position === 'static') {
                   header.style.position = 'relative';
               }

               // 1. Inject Close Button if missing
               if (!header.querySelector('.n8n-chat-close-btn')) {
                    const closeBtn = document.createElement('button');
                    closeBtn.className = 'n8n-chat-close-btn';
                    closeBtn.innerHTML = LUCIDE_ICON_X;
                    // Absolute positioning with high Z-Index
                    closeBtn.style.cssText = 'position: absolute; right: 16px; top: 16px; background: transparent; border: none; padding: 4px; border-radius: 4px; cursor: pointer; color: var(--chat--header--color, white); display: flex; align-items: center; justify-content: center; transition: opacity 0.2s; width: 28px; height: 28px; z-index: 9999;';
                    
                    closeBtn.onclick = (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        
                        /* 
                        // 1. Try API Method (Disabled to ensure animation sync)
                        if (window.n8nChat && typeof window.n8nChat.toggle === 'function') {
                            window.n8nChat.toggle({ isOpen: false });
                            return;
                        } else if (window.n8nChat && typeof window.n8nChat.close === 'function') {
                            window.n8nChat.close();
                            return;
                        } 
                        */

                        // 2. Robust Toggle Search (Primary Method to ensure sync)
                        // Key fix: Look for .chat-window-toggle which is the div that usually handles the toggle
                        const toggle = document.querySelector('.chat-window-toggle') || 
                                       document.querySelector('.n8n-chat-widget-button') ||
                                       document.querySelector('button[class*="toggle"]');
                        
                        if (toggle) {
                            toggle.click();
                        } else {
                            // Fallback to API if toggle button not found
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

               // 2. Header Logo Logic
               if (logoConfig.headerLogo && !header.dataset.hasCustomLogo) {
                   header.dataset.hasCustomLogo = 'true';
                   
                   // Create text wrapper for Title + Subtitle
                   const textWrapper = document.createElement('div');
                   textWrapper.style.cssText = 'display: flex; flex-direction: column; align-items: flex-start; justify-content: center; gap: 0px;';
                   
                   // Move existing children (text) into wrapper
                   // Exclude Close Button from being moved into text wrapper
                   const children = Array.from(header.childNodes);
                   children.forEach(child => {
                       if (child.className !== 'n8n-chat-close-btn') {
                           textWrapper.appendChild(child);
                       }
                   });
                   
                   // Enforce Flex Row layout on main Header and re-append elements
                   // Add padding-right to prevent text from overlapping close button
                   header.style.cssText += 'display: flex !important; flex-direction: row !important; align-items: center !important; justify-content: flex-start !important; gap: 12px !important; padding-right: 40px !important;';
                   
                   const img = document.createElement('img');
                   img.src = logoConfig.headerLogo;
                   img.style.cssText = 'height: var(--chat--header--logo-height, 48px) !important; width: auto !important; object-fit: contain !important; margin: 0 !important;';
                   
                   header.appendChild(img);
                   header.insertBefore(img, header.firstChild);
                   header.insertBefore(textWrapper, img.nextSibling);

                   // Ensure close button is last (it should be due to absolute positioning, but good for DOM order)
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
    const pills = ${safePills};

    const wrapper = document.createElement('div');
    wrapper.className = 'n8n-chat-welcome-container';
    
    // Header Text
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

    // Pills
    const pillsContainer = document.createElement('div');
    pillsContainer.style.display = 'flex';
    pillsContainer.style.flexDirection = 'column';
    pillsContainer.style.alignItems = 'flex-end'; // Right align to match preview
    pillsContainer.style.gap = '8px';
    
    pills.forEach(pill => {
      const btn = document.createElement('button');
      btn.className = 'n8n-chat-welcome-pill';
      btn.style.cssText = 'background: white; border: 1px solid #eee; padding: 8px 12px; border-radius: 8px; cursor: pointer; box-shadow: 0 1px 2px rgba(0,0,0,0.05); display: flex; align-items: center; justify-content: space-between; gap: 8px; font-size: 12px; color: var(--chat--color-dark); transition: all 0.2s; width: auto; max-width: 85%;';
      
      // Add Hover Effect
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

      btn.innerHTML = '<span style="font-weight: 500;">' + pill.label + '</span> ' + LUCIDE_ICON_SEND;

  const svg = btn.querySelector('svg');
  if (svg) {
    svg.style.transition = 'color 0.2s';
    svg.style.color = 'var(--chat--welcome-pill-icon-color, #101330)';
    svg.style.width = '12px';
    svg.style.height = '12px';
  }

  btn.onclick = () => {
    // Logic to send message
    hideWelcome();

    const chatContainer = document.querySelector('.n8n-chat-widget') ||
      document.querySelector('.n8n-chat') ||
      document.querySelector('.chat-window-wrapper');

    if (chatContainer) {
      const input = chatContainer.querySelector('textarea');
      if (input) {
        // Set value and force React/framework to detect change via Input event
        const propertyDescriptor = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value");
        if (propertyDescriptor && propertyDescriptor.set) {
          propertyDescriptor.set.call(input, pill.message);
        } else {
          input.value = pill.message;
        }

        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));

        // Allow state to update then submit
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
