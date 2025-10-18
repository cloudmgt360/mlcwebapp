# Loan & Mortgage Calculator

## Overview

A comprehensive financial calculator web application built with React, TypeScript, and Express. The application provides advanced loan and mortgage calculation functionality with a clean, trustworthy interface inspired by modern fintech applications like Stripe and Plaid.

**Core Features:**
- Loan calculation with input validation (amount, interest rate, term)
- Detailed amortization schedule with month-by-month payment breakdown
- Interactive data visualizations (pie chart, area chart)
- Extra payment calculator (monthly recurring or one-time payments)
- Loan comparison tool for side-by-side scenario analysis
- CSV export for amortization schedules and comparison data

**Recent Updates (October 2025):**
- ✅ Implemented comprehensive amortization schedule with scrollable table
- ✅ Added interactive charts for payment visualization using Recharts
- ✅ Built extra payment calculator with accurate interest savings calculation
- ✅ Created loan comparison tool for evaluating multiple scenarios
- ✅ Added CSV export functionality with proper formatting and escaping
- ✅ Fixed critical bug in extra payment calculations (payment clamping)
- ✅ Updated design: Blue background (#02066f), Arial font, white input fields with black borders

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
- Blue background (#02066f) for distinctive branding
- Arial font family for clean, readable typography
- White input fields with prominent black borders (2px) for clear data entry
- Contained layout with max-width of 672px (max-w-2xl) for focused interaction

**Component Structure:**
- Extensive shadcn/ui component library pre-configured (buttons, cards, forms, dialogs, etc.)
- Custom calculator page component (`client/src/pages/calculator.tsx`) with comprehensive features:
  - Core loan calculation with input validation
  - Amortization schedule generation and display
  - Extra payment impact analysis (monthly recurring and one-time)
  - Loan scenario comparison management
  - CSV export functionality
- Toast notifications for user feedback using shadcn toast system
- Collapsible components for progressive disclosure of detailed information
- Recharts integration for interactive data visualizations
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
- **recharts**: Charting library for data visualizations (pie chart, area chart)

## Feature Documentation

### 1. Core Loan Calculator
- **Input Fields:** Loan amount, annual interest rate, loan term (years)
- **Validation:** Ensures all inputs are positive numbers
- **Output:** Monthly payment, total payment, total interest paid
- **Calculation Method:** Standard amortization formula with compound interest

### 2. Amortization Schedule
- **Display:** Collapsible table showing month-by-month payment breakdown
- **Columns:** Month number, payment amount, principal, interest, remaining balance
- **Features:** 
  - Scrollable view for long schedules (400px height)
  - Currency formatting for all monetary values
  - Hover effects for better readability
  - Export to CSV functionality

### 3. Payment Visualization Charts
- **Cost Breakdown (Pie Chart):** Visual split between principal and total interest paid
- **Balance Over Time (Area Chart):** Shows declining loan balance across payment schedule
- **Technology:** Recharts with responsive containers
- **Theming:** Integrates with application's light/dark mode
- **Optimization:** Area chart samples data points for performance (max 60 points)

### 4. Extra Payment Calculator
- **Payment Types:**
  - Monthly Recurring: Adds extra amount to every payment
  - One-Time Payment: Adds extra amount to first payment only
- **Impact Analysis:**
  - New payoff time (months and years)
  - Months saved compared to original schedule
  - Total interest savings
- **Accuracy:** Properly clamps final payment to avoid overpayment
- **Recalculation:** Updates amortization schedule with extra payments applied

### 5. Loan Comparison Tool
- **Functionality:** Save and compare multiple loan scenarios side-by-side
- **Data Captured:** Scenario name, loan amount, rate, term, monthly payment, totals
- **Features:**
  - Custom scenario naming with auto-incrementing defaults
  - Individual scenario removal
  - Clear all functionality
  - Comparison table with 7 columns
  - Export to CSV
- **Persistence:** Scenarios persist across calculator resets until manually removed

### 6. CSV Export
- **Amortization Schedule Export:**
  - Filename: `amortization_schedule.csv`
  - Columns: Month, Payment, Principal, Interest, Balance
  - Formatting: All monetary values to 2 decimal places
  
- **Comparison Export:**
  - Filename: `loan_comparison.csv`
  - Columns: Scenario, Loan Amount, Rate, Term, Monthly Payment, Total Payment, Total Interest
  - Formatting: Numbers to 2 decimals, scenario names quoted and escaped
  - Handles edge cases: Quotes in scenario names, various decimal inputs

- **Implementation:** Uses Blob API with proper resource cleanup (URL.revokeObjectURL)

## Technical Decisions

### Client-Side Calculation Strategy
All loan calculations run entirely in the browser for:
- Instant feedback without network latency
- Zero server load for computation
- Privacy (no financial data sent to server)
- Simplified architecture (no API endpoints for calculations)

### Amortization Algorithm
- Uses precise month-by-month calculation instead of formula approximation
- Handles floating-point precision with proper rounding
- Prevents overpayment in final month by clamping to remaining balance + interest
- Supports variable payment schedules for extra payment scenarios

### State Management Pattern
- React useState for all calculator state (no external state library needed)
- State includes: inputs, results, schedule, scenarios, UI toggles
- Immutable updates for arrays (scenarios) to prevent bugs
- Clear separation between base calculation and extra payment calculation

### Data Visualization Approach
- Charts source data from calculated results, not live inputs
- Prevents chart/data desynchronization when inputs change
- Sampling strategy for area chart improves performance on long schedules
- Responsive containers adapt to various screen sizes

## Code Quality & Testing

### Bug Fixes Implemented
1. **Extra Payment Overpayment Bug (Critical):**
   - Issue: Final payments exceeded actual balance when extra payments applied
   - Fix: Clamp each payment to `min(scheduled payment, interest + remaining balance)`
   - Impact: Ensures accurate interest savings and payoff calculations

2. **Chart Data Synchronization:**
   - Issue: Charts showed stale data when inputs changed after calculation
   - Fix: Charts now source from computed results state, not inputs
   - Impact: Charts always reflect calculated scenario

### Testing Coverage
- End-to-end tests verify all major features
- Edge case testing for large extra payments
- Input validation prevents calculation errors
- Export functionality tested with various data formats

## Future Enhancement Opportunities

### Potential Features
- Bi-weekly payment schedules
- Adjustable-rate mortgage (ARM) calculations
- Property tax and insurance integration
- Refinancing analysis tool
- Downloadable PDF reports
- Chart customization options
- Historical scenario saving (localStorage/database)
- Print-friendly views

### Technical Improvements
- Unit tests for calculation functions
- Centralized CSV generation utilities
- Enhanced input validation with real-time feedback
- Accessibility improvements (ARIA labels, keyboard navigation)
- Performance monitoring for large schedules
