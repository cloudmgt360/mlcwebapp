# Loan & Mortgage Calculator

## Overview

A professional financial calculator web application built with React, TypeScript, and Express. The application provides loan and mortgage calculation functionality with a clean, trustworthy interface inspired by modern fintech applications like Stripe and Plaid. Users can input loan amount, interest rate, and loan term to calculate monthly payments, total payment, and total interest.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and development server for fast hot module replacement
- Wouter for lightweight client-side routing
- TanStack Query v5 for server state management (currently unused but configured)

**UI Framework:**
- shadcn/ui component library with Radix UI primitives
- Tailwind CSS for utility-first styling with custom design system
- Class Variance Authority (CVA) for component variant management
- Design system follows "New York" style from shadcn with custom color palette

**Design Philosophy:**
- System-based approach prioritizing clarity and trust
- Professional fintech aesthetic with calm visual design
- Light/dark mode support with carefully crafted color palettes
- Inter font family via Google Fonts for clean typography
- Contained layout with max-width of 672px (max-w-2xl) for focused interaction

**Component Structure:**
- Extensive shadcn/ui component library pre-configured (buttons, cards, forms, dialogs, etc.)
- Custom calculator page component (`client/src/pages/calculator.tsx`) handling calculation logic
- Toast notifications for user feedback using shadcn toast system
- Path aliases configured for clean imports (`@/` for client src, `@shared/` for shared code)

### Backend Architecture

**Server Framework:**
- Express.js with TypeScript for REST API
- ESM module system throughout the codebase
- Custom middleware for request logging with response capture
- Error handling middleware with status code and message normalization

**Development Environment:**
- Vite middleware integration in development for seamless HMR
- Custom Replit plugins for development tooling (cartographer, dev banner, runtime error overlay)
- Separate production build process bundling server code with esbuild

**API Structure:**
- Routes registered in `server/routes.ts` with `/api` prefix convention
- HTTP server creation returns server instance for potential WebSocket upgrades
- Currently minimal API surface - calculator logic runs client-side

**Storage Layer:**
- Abstract storage interface (`IStorage`) for database operations
- In-memory storage implementation (`MemStorage`) as default
- User model with username/password fields (authentication scaffolding)
- Designed to be swapped with database implementation without changing application code

### Data Storage

**Database Configuration:**
- Drizzle ORM configured for PostgreSQL via `@neondatabase/serverless`
- Schema defined in `shared/schema.ts` for code sharing between client/server
- Drizzle Kit configured for migrations in `./migrations` directory
- Zod integration via `drizzle-zod` for runtime validation
- Users table with UUID primary keys, unique username constraint

**Storage Architecture Decision:**
- Currently uses in-memory storage for development/demo purposes
- Database infrastructure configured but not actively used
- Migration path: Swap `MemStorage` for Drizzle-based implementation in `server/storage.ts`
- No session management configured (connect-pg-simple installed but unused)

**Rationale:**
- In-memory storage allows zero-configuration demo deployment
- Database schema serves as documentation for future persistence needs
- Loan calculations are stateless and don't require persistence
- User authentication scaffolding present for future feature expansion

### Build & Deployment

**Build Process:**
- Client: Vite builds to `dist/public` directory
- Server: esbuild bundles to `dist/index.js` as ESM module
- Production mode serves static files from built client directory
- TypeScript checking via `tsc` in check script (no emit)

**Environment Configuration:**
- `DATABASE_URL` environment variable required but may be unused
- `NODE_ENV` controls development vs production behavior
- `REPL_ID` detection for Replit-specific tooling

## External Dependencies

### UI & Styling
- **shadcn/ui**: Pre-built accessible component library based on Radix UI
- **Radix UI**: Unstyled, accessible component primitives (26+ packages for dialogs, dropdowns, forms, etc.)
- **Tailwind CSS**: Utility-first CSS framework with custom theme configuration
- **Lucide React**: Icon library for consistent iconography
- **class-variance-authority**: Variant-based component styling
- **tailwind-merge**: Intelligent Tailwind class merging utility

### Forms & Validation
- **React Hook Form**: Form state management and validation
- **@hookform/resolvers**: Resolver library for schema validation integration
- **Zod**: TypeScript-first schema validation (via drizzle-zod)

### Data & State
- **TanStack Query**: Server state management and caching
- **Drizzle ORM**: TypeScript ORM for PostgreSQL
- **@neondatabase/serverless**: Serverless Postgres driver for Neon

### Development Tools
- **Vite**: Frontend build tool and dev server
- **TypeScript**: Static type checking
- **esbuild**: Fast JavaScript bundler for server code
- **tsx**: TypeScript execution for development server
- **PostCSS**: CSS processing with Autoprefixer

### Replit Platform
- **@replit/vite-plugin-runtime-error-modal**: Development error overlay
- **@replit/vite-plugin-cartographer**: Code navigation tooling (dev only)
- **@replit/vite-plugin-dev-banner**: Development mode banner (dev only)

### Additional Libraries
- **date-fns**: Date utility library
- **embla-carousel-react**: Carousel component (shadcn dependency)
- **cmdk**: Command palette component
- **vaul**: Drawer component library
- **react-day-picker**: Date picker component
- **recharts**: Charting library (available but unused)