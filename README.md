[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/Q5Q01S6SYH)

# Overview

![](https://github.com/nathan-synfo/chat-widget-studio/blob/main/overview.gif)

# n8n Chat Widget Studio

A powerful, visual builder for the n8n Chat Widget, enabling users to customize, preview, and generate embed codes for their AI chatbots without writing code.

![n8n Chat Widget Studio](https://raw.githubusercontent.com/n8n-io/n8n/master/assets/n8n-logo.png) <!-- Replace with actual screenshot if available -->

## 🚀 Features

### Visual Customization
-   **Real-time Preview**: See your changes instantly as you configure the widget.
-   **Theming**: Select from a range of starter themes or manually select the colors to match your branding.
-   **Typography**: distinct controls for Global font family with automatic Google Fonts integration.
-   **Header Styling**: Adjust prompts, icons, and layout.
-   **Message Styling**: Cusomize message bubbles, colors and layout.
-   **Toggle**: Customize the chat bubble icon and position.

### Configuration
-   **Webhook Configuration**: Easily connect your n8n workflow webhook URL.
-   **Welcome Screen**: Create a welcome screen with a Title, Subtitle and Quick Action pills.
-   **Animation**: Choose from different animations and control the animation speed.

### Easy Export
-   **One-Click Copy**: Instantly generate and copy the installation code.
-   **Import/Export CSS**: Export and Import existing CSS stylings.

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
