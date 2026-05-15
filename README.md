[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/Q5Q01S6SYH)

# Overview

![](https://github.com/nathan-synfo/chat-widget-studio/blob/main/overview.gif)

# n8n Chat Studio

A powerful, visual builder for the n8n Chat Widget, enabling users to customize, preview, and generate embed codes for their AI chatbots without writing code.

## 🚀 Features

### Visual Customization
-   **Live Preview**: See your changes instantly as you configure the widget, with a real-time canvas showing the widget exactly as it will appear.
-   **Theming**: Select from a range of starter themes or manually pick colours to match your branding.
-   **Typography**: Global font family selector with automatic Google Fonts integration and custom font support.
-   **Header Styling**: Adjust title, subtitle, logo, and layout.
-   **Message Styling**: Customize message bubbles, colours, padding, and typography.
-   **Toggle Button**: Customize the chat bubble icon, size, and position.
-   **Footer & Input**: Control the input area, send button, and spacing.
-   **Animation**: Choose from multiple entry/exit animations and control the speed.
-   **Window Layout**: Set widget dimensions, position offset, and border radius.

### Configuration
-   **Webhook Configuration**: Connect your n8n workflow webhook URL.
-   **Welcome Screen**: Create a welcome screen with a custom title, subtitle, and colour controls.
-   **Quick Actions**: Define up to 4 quick-action pills shown on the welcome screen — each with a visible label and a separate message payload sent to the bot.
-   **Import/Export CSS**: Save and reload your theme as a `.css` file.

### Easy Export
-   **Get Embed Code**: Instantly generate and copy the full installation snippet — includes the stylesheet link, scoped CSS variables, and the n8n Chat script — ready to paste before your `</body>` tag.

## 🛠️ Technology Stack

This project is built with a modern frontend stack:
-   **Framework**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
-   **Icons**: [Lucide React](https://lucide.dev/)

## 📦 Installation & Usage

1.  **Clone the repository**
    ```bash
    git clone https://github.com/nathan-synfo/chat-widget-studio.git
    cd chat-widget-studio
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Start the development server**
    ```bash
    npm run dev
    ```
    The application will run at `http://localhost:8080` (or similar).

4.  **Build for production**
    ```bash
    npm run build
    ```

## 🎨 Development

### Project Structure
-   `src/components`: UI components (ControlPanel, ChatPreview, etc.)
-   `src/lib`: Utilities, theme definitions, and CSS variable logic.

### Typography System
The studio features a robust typography system (`src/lib/cssVariables.ts`) that allows users to select from preset Google Fonts or input custom ones. It automatically handles CSS generation and font loading within the preview scope to prevent style leaks.
