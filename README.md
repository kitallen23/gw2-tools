# GW2 Tools

A collection of data parsing and visualization tools for Guild Wars 2 combat logs. Currently features a health percentage calculator to analyze team performance during encounters.

## Features

### Health Percentage Calculator

Calculates the amount of time players spent above a specified health threshold during combat encounters. This is particularly useful for determining optimal utility usage, such as the [Writ of Masterful Strength](https://wiki.guildwars2.com/wiki/Writ_of_Masterful_Strength).

**Key Features:**

- Upload and parse `.zevtc` combat log files
- Interactive phase selection (DPS phases and breakbar phases)
- Configurable health thresholds (0-100%)
- Real-time visualization with charts and progress bars
- Player-specific analysis and statistics

## Tech Stack

- **Framework:** React 18 with TypeScript
- **Build Tool:** Vite
- **UI Library:** Radix UI (themes and components)
- **Styling:** Vanilla Extract CSS-in-JS
- **Charts:** Recharts
- **File Handling:** React Dropzone
- **HTTP Client:** Ky
- **Routing:** React Router DOM v7

## Development

### Prerequisites

- Node.js 22+
- npm

### Getting Started

1. Clone the repository

```bash
git clone <repository-url>
cd gw2-tools
```

2. Install dependencies

```bash
npm install
```

3. Start the development server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production (TypeScript compilation + Vite build)
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build locally

### Code Quality

The project uses:

- **ESLint** for code linting
- **Prettier** for code formatting
- **Husky** for Git hooks
- **lint-staged** for pre-commit formatting

Pre-commit hooks automatically format and lint staged files.

## Deployment

The application is automatically deployed to AWS S3 with CloudFront CDN when changes are pushed to the `main` branch.

**Deployment Pipeline:**

- GitHub Actions workflow triggers on push to `main`
- Builds the application using Node.js 22
- Syncs build artifacts to S3 bucket (`gw2-tools`)
- Invalidates CloudFront distribution for immediate updates
- Deployed to AWS region: `ap-southeast-4`

Manual deployment can be triggered via GitHub Actions with branch selection.

## Project Structure

```
src/
├── api/           # API utilities and file upload handlers
├── components/    # Reusable UI components
├── contexts/      # React contexts (Password, Theme)
├── pages/         # Page components and route handlers
│   └── Logfiles/  # Combat log analysis pages
├── styles/        # Global styles and design tokens
├── types/         # TypeScript type definitions
└── utils/         # Helper functions and hooks
```

## Example Files

The `examples/` directory contains sample `.zevtc` files for testing:

- Holosmith DPS test (37.5k)
- Soulless Horror encounter
- Training golem solo test

## Environment Configuration

- **Development:** API URL points to `http://localhost:3000`
- **Production:** API URL points to `https://ocr-poc-api.chuggs.net`

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Ensure tests pass and code is properly formatted
5. Submit a pull request

---

_This tool assists in analyzing Guild Wars 2 combat performance data. All game-related content is property of ArenaNet LLC._
