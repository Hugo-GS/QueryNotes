# QueryNotes

An interactive notebook application for documenting and testing REST, GraphQL, and SOAP APIs. Perfect for embedding in portfolios or technical documentation.

## Features

- **API Documentation**: Document REST, GraphQL, and SOAP endpoints with live request/response examples
- **Interactive Requests**: Execute real HTTP requests directly from the browser
- **Presentation Mode**: Clean, read-only view perfect for sharing and embedding
- **URL-Driven Configuration**: Configure everything via URL parameters for easy embedding
- **Theme Support**: Dark and light themes (Gruvbox-based)
- **Environment URLs**: Set a base URL applied to all relative endpoints
- **Export/Import**: Save and load notebooks as JSON files

## Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm, pnpm, or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Hugo-GS/QueryNotes.git
   cd QueryNotes
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   pnpm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   pnpm dev
   # or
   yarn dev
   ```

4. Open your browser and navigate to `http://localhost:3000`

## Available Scripts

| Command | Description |
|---------|-------------|
| `dev` | Start the development server |
| `build` | Build for production |
| `preview` | Preview production build locally |

## Documentation

- [URL Parameters](./docs/url-parameters.md) - Configure the app via URL query parameters
- [Presentation Mode](./docs/presentation-mode.md) - Read-only view for embedding
- [Deployment Guide](./DEPLOYMENT.md) - Security headers and platform-specific configuration

## Tech Stack

- **Frontend**: React 19, TypeScript
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Markdown**: React Markdown with GFM support

## Project Structure

```
QueryNotes/
├── features/           # Feature modules
│   ├── notebook/       # Notebook container, cells, I/O
│   ├── request/        # API request cells (REST, GraphQL, SOAP)
│   └── simulation/     # HTTP request execution
├── shared/             # Shared utilities
│   ├── hooks/          # useTheme, useAppQuery
│   ├── ui/             # Reusable UI components
│   └── types.ts        # Shared TypeScript types
├── docs/               # Documentation
├── App.tsx             # Main application component
└── index.tsx           # Entry point
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).
