export interface CSSVariable {
  name: string;
  label: string;
  type: 'color' | 'size' | 'text';
  defaultValue: string;
  category: 'colors' | 'header' | 'messages' | 'toggle' | 'typography' | 'animation' | 'layout' | 'footer' | 'welcome';
  description?: string;
  excludeFromUI?: boolean;
  min?: number;
  max?: number;
}

export const cssVariables: CSSVariable[] = [
  // Colors
  {
    name: '--chat--color--primary',
    label: 'Primary Color',
    type: 'color',
    defaultValue: '#e74266',
    category: 'colors',
    description: 'Main accent color used for the toggle button and Send button.',
    excludeFromUI: true
  },
  {
    name: '--chat--color--primary-shade-50',
    label: 'Primary Shade 50',
    type: 'color',
    defaultValue: '#db4061',
    category: 'colors',
    description: 'Darker shade of primary color (hover states).',
    excludeFromUI: true
  },
  {
    name: '--chat--color--primary--shade-100',
    label: 'Primary Shade 100',
    type: 'color',
    defaultValue: '#cf3c5c',
    category: 'colors',
    description: 'Darkest shade of primary color (active states).',
    excludeFromUI: true
  },

  {
    name: '--chat--color-secondary-shade-50',
    label: 'Secondary Shade 50',
    type: 'color',
    defaultValue: '#1ca08a',
    category: 'colors',
    description: 'Darker shade of secondary color.',
    excludeFromUI: true
  },
  {
    name: '--chat--color-white',
    label: 'White',
    type: 'color',
    defaultValue: '#ffffff',
    category: 'colors',
    description: 'Base white color.',
    excludeFromUI: true
  },
  {
    name: '--chat--color-light',
    label: 'Light Background',
    type: 'color',
    defaultValue: '#f2f4f8',
    category: 'colors',
    description: 'Background color for the chat window.'
  },
  {
    name: '--chat--color-light-shade-50',
    label: 'Light Shade 50',
    type: 'color',
    defaultValue: '#e6e9f1',
    category: 'colors',
    description: 'Border colors and dividers.',
    excludeFromUI: true
  },
  {
    name: '--chat--color-light-shade-100',
    label: 'Light Shade 100',
    type: 'color',
    defaultValue: '#c2c5cc',
    category: 'colors',
    description: 'Darker borders.',
    excludeFromUI: true
  },
  {
    name: '--chat--color-medium',
    label: 'Medium Color',
    type: 'color',
    defaultValue: '#d2d4d9',
    category: 'colors',
    description: 'Used for input borders and secondary elements.'
  },
  {
    name: '--chat--color-dark',
    label: 'Dark Color',
    type: 'color',
    defaultValue: '#101330',
    category: 'colors',
    description: 'Main text color and header background default.',
    excludeFromUI: true
  },
  {
    name: '--chat--color-disabled',
    label: 'Disabled Color',
    type: 'color',
    defaultValue: '#777980',
    category: 'colors',
    description: 'Color for disabled elements.'
  },
  {
    name: '--chat--color-typing',
    label: 'Typing Indicator',
    type: 'color',
    defaultValue: '#404040',
    category: 'colors',
    description: 'Color of the typing dots.'
  },

  // Spacing
  {
    name: '--chat--spacing',
    label: 'Spacing',
    type: 'size',
    defaultValue: '1rem',
    category: 'footer',
    description: 'Base padding unit used throughout the specialized components.',
    min: 0.1,
    max: 3.0
  },
  {
    name: '--chat--border-radius',
    label: 'Border Radius',
    type: 'size',
    defaultValue: '0.25rem',
    category: 'layout',
    description: 'Roundness of buttons, inputs, and the main window.',
    min: 0.1,
    max: 3.0
  },


  // Typography
  {
    name: '--chat--font-family',
    label: 'Global Font Family',
    type: 'text',
    defaultValue: 'inherit',
    category: 'typography',
    description: 'Main font family for the widget.'
  },
  {
    name: '--chat--heading--font-size',
    label: 'Header Title Size',
    type: 'size',
    defaultValue: '24px',
    category: 'header',
    description: 'Size of the main title text.'
  },
  {
    name: '--chat--subtitle--font-size',
    label: 'Header Subtitle Size',
    type: 'size',
    defaultValue: '14px',
    category: 'header',
    description: 'Font size of the header subtitle.'
  },
  {
    name: '--chat--heading--line-height',
    label: 'Header Title Line Height',
    type: 'text',
    defaultValue: '1.2',
    category: 'header',
    description: 'Line height of the header title.',
    min: 0.1,
    max: 3.0
  },
  {
    name: '--chat--subtitle--line-height',
    label: 'Header Subtitle Line Height',
    type: 'text',
    defaultValue: '1.5',
    category: 'header',
    description: 'Line height of the header subtitle.',
    min: 0.1,
    max: 3.0
  },
  {
    name: '--chat--font-family-url',
    label: 'Font URL',
    type: 'text',
    defaultValue: '',
    category: 'typography',
    description: 'URL to import custom font (e.g. Google Fonts).',
    excludeFromUI: true
  },

  // Dimensions
  {
    name: '--chat--window--width',
    label: 'Window Width',
    type: 'size',
    defaultValue: '400px',
    category: 'layout',
    description: 'Width of the open chat window.',
    min: 300,
    max: 800
  },
  {
    name: '--chat--window--height',
    label: 'Window Height',
    type: 'size',
    defaultValue: '600px',
    category: 'layout',
    description: 'Height of the open chat window.',
    min: 400,
    max: 800
  },


  // Header

  {
    name: '--chat--header-height',
    label: 'Header Height',
    type: 'size',
    defaultValue: '96px',
    category: 'header',
    description: 'Fixed height of the header.',
    min: 48,
    max: 200
  },
  {
    name: '--chat--header--padding',
    label: 'Header Padding',
    type: 'text',
    defaultValue: '1rem',
    category: 'header',
    description: 'Padding around the header content.',
    min: 0.1,
    max: 3.0
  },
  {
    name: '--chat--header--background',
    label: 'Header Background',
    type: 'color',
    defaultValue: '#101330',
    category: 'header',
    description: 'Background color of the top header bar.'
  },
  {
    name: '--chat--header--color',
    label: 'Header Text Color',
    type: 'color',
    defaultValue: '#f2f4f8',
    category: 'header',
    description: 'Text color for title and subtitle.'
  },

  // Messages
  {
    name: '--chat--message--font-size',
    label: 'Message Font Size',
    type: 'size',
    defaultValue: '14px',
    category: 'messages',
    description: 'Font size for chat messages.',
    min: 10,
    max: 32
  },
  {
    name: '--chat--message--padding',
    label: 'Message Padding',
    type: 'text',
    defaultValue: '1rem',
    category: 'messages',
    description: 'Padding inside message bubbles.',
    min: 0.1,
    max: 3.0
  },
  {
    name: '--chat--message--border-radius',
    label: 'Message Border Radius',
    type: 'text',
    defaultValue: '0.5rem',
    category: 'messages',
    description: 'Roundness of message bubbles.',
    min: 0,
    max: 3.0
  },
  {
    name: '--chat--message-line-height',
    label: 'Message Line Height',
    type: 'text',
    defaultValue: '1.5',
    category: 'messages',
    description: 'Spacing between lines of text in a message.',
    min: 1.0,
    max: 3.0
  },
  {
    name: '--chat--message--bot--background',
    label: 'Bot Message Background',
    type: 'color',
    defaultValue: '#ffffff',
    category: 'messages',
    description: 'Background color for messages sent by the bot.'
  },
  {
    name: '--chat--message--bot--color',
    label: 'Bot Message Color',
    type: 'color',
    defaultValue: '#101330',
    category: 'messages',
    description: 'Text color for bot messages.'
  },
  {
    name: '--chat--message--user--background',
    label: 'User Message Background',
    type: 'color',
    defaultValue: '#20b69e',
    category: 'messages',
    description: 'Background color for messages sent by the user.'
  },
  {
    name: '--chat--message--user--color',
    label: 'User Message Color',
    type: 'color',
    defaultValue: '#ffffff',
    category: 'messages',
    description: 'Text color for user messages.'
  },
  {
    name: '--chat--message--pre--background',
    label: 'Code Block Background',
    type: 'color',
    defaultValue: 'rgba(0, 0, 0, 0.05)',
    category: 'messages',
    description: 'Background for code snippets.'
  },
  {
    name: '--chat--input--send--background',
    label: 'Send Button Color',
    type: 'color',
    defaultValue: '#e74266',
    category: 'messages',
    description: 'Background color of the send button.'
  },

  // Toggle Button
  {
    name: '--chat--welcome-pill-icon-color',
    label: 'Welcome Pill Icon Color',
    type: 'color',
    defaultValue: '#101330', // Default dark color
    category: 'welcome',
    description: 'Color of the arrow icon in welcome pills'
  },
  {
    name: '--chat--welcome-pill-icon-hover-color',
    label: 'Welcome Pill Icon Hover Color',
    type: 'color',
    defaultValue: '#e74266', // Default primary color
    category: 'welcome',
    description: 'Color of the arrow icon in welcome pills on hover'
  },
  {
    name: '--chat--toggle--background',
    label: 'Toggle Background',
    type: 'color',
    defaultValue: '#e74266',
    category: 'toggle',
    description: 'Background color of the floating chat button.'
  },
  {
    name: '--chat--toggle--hover--background',
    label: 'Toggle Hover',
    type: 'color',
    defaultValue: '#db4061',
    category: 'toggle',
    description: 'Background color when hovering the button.',
    // excludeFromUI removed to enable in control panel
  },
  {
    name: '--chat--toggle--active--background',
    label: 'Toggle Active',
    type: 'color',
    defaultValue: '#cf3c5c',
    category: 'toggle',
    description: 'Background color when clicking the button.',
    excludeFromUI: true
  },
  {
    name: '--chat--toggle--color',
    label: 'Toggle Icon Color',
    type: 'color',
    defaultValue: '#ffffff',
    category: 'toggle',
    description: 'Color of the icon inside the button.'
  },
  {
    name: '--chat--toggle--size',
    label: 'Toggle Size',
    type: 'size',
    defaultValue: '64px',
    category: 'toggle',
    description: 'Size (width/height) of the button.'
  },

  // Position
  {
    name: '--chat--window--bottom',
    label: 'Window Bottom Position',
    type: 'size',
    defaultValue: '20px',
    category: 'layout',
    description: 'Distance from the bottom of the screen.'
  },
  {
    name: '--chat--window--right',
    label: 'Window Right Position',
    type: 'size',
    defaultValue: '20px',
    category: 'layout',
    description: 'Distance from the right of the screen.'
  },

  // Animation
  {
    name: '--chat--animation-style',
    label: 'Animation Style',
    type: 'text', // Treated as select in UI
    defaultValue: 'scale',
    category: 'animation',
    description: 'Entry/Exit animation style.',
    excludeFromUI: true
  },
  {
    name: '--chat--transition-duration',
    label: 'Animation Speed',
    type: 'size', // Treated as slider in UI now
    defaultValue: '0.15s', // Update default to match commonTransition
    category: 'animation',
    description: 'Speed of the entry/exit animation.'
  },
  // Footer / Input Area
  {
    name: '--chat--input--border-radius',
    label: 'Input Border Radius',
    type: 'size',
    defaultValue: '4px', // simplified default
    category: 'footer',
    description: 'Roundness of the chat input box.'
  },
  {
    name: '--chat--input--font-size',
    label: 'Input Font Size',
    type: 'size',
    defaultValue: '0.85rem',
    category: 'footer',
    description: 'Font size of the text inside the input box.'
  },
  {
    name: '--chat--input--icon-size',
    label: 'Send Button Icon Size',
    type: 'size',
    defaultValue: '16px',
    category: 'footer',
    description: 'Size of the icon inside the send button.'
  },
  {
    name: '--chat--input--border-color',
    label: 'Input Border Color',
    type: 'color',
    defaultValue: '#d2d4d9',
    category: 'footer',
    description: 'Color of the input box border.'
  },
  // Welcome Screen
  {
    name: '--chat--welcome--title-font-size',
    label: 'Welcome Title Size',
    type: 'size',
    defaultValue: '20px',
    category: 'welcome',
    description: 'Font size of the welcome screen title.'
  },

  {
    name: '--chat--welcome--title-color',
    label: 'Welcome Title Color',
    type: 'color',
    defaultValue: '#101330',
    category: 'welcome',
    description: 'Color of the welcome screen title.',
    excludeFromUI: true
  },
  {
    name: '--chat--welcome--subtitle-color',
    label: 'Welcome Subtitle Color',
    type: 'color',
    defaultValue: '#101330',
    category: 'welcome',
    description: 'Color of the welcome screen subtitle.',
    excludeFromUI: true
  },
  {
    name: '--chat--welcome--subtitle-font-size',
    label: 'Welcome Subtitle Size',
    type: 'size',
    defaultValue: '14px',
    category: 'welcome',
    description: 'Font size of the welcome screen subtitle.'
  },
  {
    name: '--chat--header--logo-height',
    label: 'Header Logo Height',
    type: 'size',
    defaultValue: '48px',
    category: 'header',
    min: 16,
    max: 128
  }
];

export const categoryLabels: Record<string, string> = {
  colors: 'Colors',
  layout: 'Window Layout',
  header: 'Header',
  messages: 'Messages',
  toggle: 'Toggle Button',
  typography: 'Typography',
  animation: 'Animation',
  footer: 'Footer & Input',
  welcome: 'Welcome Screen',
};

export function generateCSS(values: Record<string, string>, scopeSelector: string = ':root'): string {
  // 1. Generate standard CSS variables list
  const lines = Object.entries(values)
    .filter(([key, value]) => key !== '--chat--animation-style') // Exclude special handled vars
    .map(([name, value]) => `  ${name}: ${value};`);

  // 2. Font handling
  const fontUrl = values['--chat--font-family-url'];
  const importStatement = fontUrl ? `@import url('${fontUrl}');\n\n` : '';

  // 3. Animation Logic
  const animationStyle = values['--chat--animation-style'] || 'scale';
  const prefix = scopeSelector === ':root' ? '' : `${scopeSelector} `;
  let animationCSS = '';

  const commonTransition = `transition: all var(--chat--transition-duration, 0.15s) cubic-bezier(0.16, 1, 0.3, 1);`;

  switch (animationStyle) {
    case 'fade':
      animationCSS = `
${prefix}.n8n-chat-animated .chat-window {
  display: flex !important;
  opacity: 0;
  pointer-events: none;
  ${commonTransition}
}
${prefix}.n8n-chat-animated .chat-window.is-open {
  opacity: 1;
  pointer-events: auto;
}`;
      break;
    case 'slide-up':
      animationCSS = `
${prefix}.n8n-chat-animated .chat-window {
  display: flex !important;
  opacity: 0;
  transform: translateY(40px);
  pointer-events: none;
  ${commonTransition}
}
${prefix}.n8n-chat-animated .chat-window.is-open {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}`;
      break;
    case 'slide-side':
      animationCSS = `
${prefix}.n8n-chat-animated .chat-window {
  display: flex !important;
  opacity: 0;
  transform: translateX(20px);
  pointer-events: none;
  ${commonTransition}
}
${prefix}.n8n-chat-animated .chat-window.is-open {
  opacity: 1;
  transform: translateX(0);
  pointer-events: auto;
}`;
      break;
    case 'scale':
    default:
      animationCSS = `
${prefix}.n8n-chat-animated .chat-window {
  display: flex !important;
  opacity: 0;
  transform: scale(0.9) translateY(20px);
  transform-origin: bottom right;
  pointer-events: none;
  ${commonTransition}
}
${prefix}.n8n-chat-animated .chat-window.is-open {
  opacity: 1;
  transform: scale(1) translateY(0);
  pointer-events: auto;
}`;
      break;
  }

  // 4. Overrides for Layout Font
  const fontFamilyValue = values['--chat--font-family'];
  const fontStyle = (fontFamilyValue && fontFamilyValue !== 'inherit')
    ? `'${fontFamilyValue}', sans-serif`
    : 'inherit';

  const overrides = `
${prefix}.chat-layout {
  font-family: ${fontStyle};
}
`;

  return `${importStatement}${scopeSelector} {\n${lines.join('\n')}\n}\n${overrides}\n${animationCSS}`;
}

export function parseCSS(css: string): Record<string, string> {
  const values: Record<string, string> = {};

  // Match CSS variable declarations
  const regex = /(--chat--[a-zA-Z0-9-]+)\s*:\s*([^;]+);/g;
  let match;

  while ((match = regex.exec(css)) !== null) {
    const [, name, value] = match;
    values[name] = value.trim();
  }

  return values;
}

export function getDefaultValues(): Record<string, string> {
  const values: Record<string, string> = {};
  cssVariables.forEach((v) => {
    values[v.name] = v.defaultValue;
  });
  return values;
}
