# QueryBook

A modern, interactive notebook application for documenting and demonstrating workflows with AI capabilities.

## Features

- **Interactive Notebooks**: Create and manage notebook cells with rich content
- **Presentation Mode**: Clean, read-only view perfect for sharing and embedding
- **Theme Support**: Switch between dark and light themes
- **URL Configuration**: Configure the app via URL parameters for easy sharing
- **AI Integration**: Powered by Google's Gemini AI
- **Responsive Design**: Built with React and Tailwind CSS

## Quick Start

### Prerequisites

- Node.js (v16 or higher)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/querybook.git
   cd querybook
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Create a `.env.local` file in the root directory
   - Add your Gemini API key:
     ```
     GEMINI_API_KEY=your_api_key_here
     ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:3000`

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

## Documentation

### Core Features
- [URL Parameters](./docs/url-parameters.md) - Complete guide to URL query parameters
- [Presentation Mode](./docs/presentation-mode.md) - How to use the read-only presentation view

### Deployment

The app can be deployed to any static hosting service (Netlify, Vercel, GitHub Pages, etc.). Make sure to set the `GEMINI_API_KEY` environment variable in your hosting platform.

## Tech Stack

- **Frontend**: React 19, TypeScript
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **AI**: Google Gemini AI
- **Charts**: Recharts
- **Markdown**: React Markdown with GFM support

## Project Structure

```
querybook/
├── components/      # Reusable UI components
├── features/        # Feature-specific modules
│   └── notebook/    # Notebook feature
├── services/        # External service integrations
├── shared/          # Shared utilities and hooks
│   ├── hooks/       # Custom React hooks
│   └── ui/          # Shared UI components
├── docs/            # Documentation
├── App.tsx          # Main application component
└── index.tsx        # Application entry point
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).
