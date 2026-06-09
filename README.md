[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/Q5Q01S6SYH)

# n8n Chat Studio

**n8n Chat Studio** is a visual, no-code builder for the [n8n Chat Widget](https://www.npmjs.com/package/@n8n/chat). It lets you design a fully branded chat widget — colours, typography, layout, animation, welcome screen and quick actions — preview it live over a realistic mock website, and copy a ready-to-paste embed snippet that wires the widget to your n8n **Chat Trigger** workflow.

Everything runs in the browser. There is no backend and no account: your designs are saved to `localStorage`, and the only thing you ship to your own site is the generated `<link>` + `<style>` + `<script>` snippet.

## ✨ Highlights

- **Top command-bar workspace** — a slim app bar, a horizontal tab strip, a roomy control panel, and a live preview that sits over a mock web page so the widget always reads at a believable size.
- **Multiple saved designs** — create, rename, duplicate, switch between, and delete designs from the design switcher. Everything autosaves to `localStorage`.
- **Undo / redo** — buttons plus `Ctrl/⌘+Z` and `Ctrl/⌘+Shift+Z`. Rapid edits (slider drags, typing) collapse into a single undoable step.
- **Scaled live preview** — the widget renders at its true pixel size inside a 1440×900 stage that scales to fit the pane, so it never overflows and always looks like a real corner bubble.

## 🎛️ What you can customise

The controls are split across nine tabs:

| Tab | What it controls |
|---|---|
| **Theme** | Six starter presets, plus an HSV colour picker for primary, background, and accent colours |
| **Header** | Title, subtitle, header logo, sizing, colours |
| **Welcome** | Welcome screen copy, sizing, colours, and up to four quick-action pills |
| **Messages** | User/bot bubble colours, shape, density, code-block background |
| **Input** | Bot avatar, input box sizing, border colour, send button |
| **Layout** | Window size, position, border radius, and the toggle button (icon, size, colours) |
| **Typography** | Font family with automatic Google Fonts loading, or a custom font |
| **Motion** | Entry animation style (pop / fade / slide) and speed |
| **Connect** | Your n8n webhook URL |

Plus, from the top bar: **Import CSS** (load a saved theme), **Reset**, and **Get Code**.

### Easy export

**Get Code** generates the complete installation snippet — the stylesheet link, scoped CSS variables, and the n8n Chat script with your content baked in — ready to paste before your site's `</body>` tag. The output is clean and comment-free.

## 🛠️ Technology stack

- **Framework**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI components**: [shadcn/ui](https://ui.shadcn.com/) (Radix primitives)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Toasts**: [Sonner](https://sonner.emilkowal.ski/)

## 📦 Installation & usage

1. **Clone the repository**
   ```bash
   git clone https://github.com/nathan-synfo/chat-widget-studio.git
   cd chat-widget-studio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```
   The app runs at `http://localhost:8080`.

4. **Build for production**
   ```bash
   npm run build
   ```
   Static output is written to `dist/`.

## 🚀 Using your widget

1. In n8n, add a **Chat Trigger** node to a workflow and copy its production webhook URL.
2. In Chat Studio, open the **Connect** tab and paste the URL.
3. Design your widget, then click **Get Code** and copy the snippet.
4. Paste it immediately before the closing `</body>` tag (usually the footer) of your website.

## 📂 Project structure

```
src/
  components/
    studio/        Top-bar shell, tab bar, preview, and the nine section panels
    ui/            shadcn/ui primitives
    ChatPreview.tsx  The live widget renderer
    ColorInput.tsx   HSV colour picker
    LogoUpload.tsx   Upload / URL image control
  hooks/
    useDesignManager.ts   Designs, history, persistence
  lib/
    cssVariables.ts  The widget's CSS-variable registry + code generation
    codeGenerator.ts The embed-snippet generator
    themes.ts        The six theme presets
    design.ts        WidgetDesign model + factory
    applyDesign.ts   Theme apply + shade cascade
```

## ☕ Support

If this tool saves you time, you can support development on [Ko-fi](https://ko-fi.com/Q5Q01S6SYH).
