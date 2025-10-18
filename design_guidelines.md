# Design Guidelines: Loan & Mortgage Calculator

## Design Approach
**System-Based Approach**: Clean, professional financial calculator interface inspired by modern fintech applications (Stripe, Plaid, NerdWallet calculators). Focus on clarity, trust, and functionality with a polished, minimal aesthetic.

## Core Design Principles
- **Clarity First**: Every element serves the calculation flow
- **Financial Trust**: Professional appearance that inspires confidence
- **Efficient Interaction**: Minimal friction from input to results
- **Visual Calm**: No distracting elements, focus on the task

## Color Palette

### Light Mode
- **Background**: 220 15% 97% (soft neutral)
- **Surface/Card**: 0 0% 100% (pure white)
- **Primary Brand**: 220 90% 56% (trustworthy blue)
- **Primary Hover**: 220 90% 48%
- **Text Primary**: 220 15% 15%
- **Text Secondary**: 220 10% 45%
- **Border**: 220 13% 91%
- **Success/Green**: 142 71% 45%
- **Input Focus Ring**: 220 90% 56% with opacity

### Dark Mode
- **Background**: 220 15% 9%
- **Surface/Card**: 220 13% 13%
- **Primary Brand**: 220 90% 60%
- **Primary Hover**: 220 90% 68%
- **Text Primary**: 220 15% 95%
- **Text Secondary**: 220 10% 65%
- **Border**: 220 13% 20%
- **Success/Green**: 142 71% 50%

## Typography
- **Font Stack**: 'Inter', system-ui, -apple-system, sans-serif (via Google Fonts)
- **Headings**: 
  - H1: 2rem (32px), font-weight 700, letter-spacing tight
  - H3 (Results): 1.25rem (20px), font-weight 600
- **Body/Labels**: 0.875rem (14px), font-weight 500
- **Input Text**: 1rem (16px), font-weight 400
- **Results Values**: 1.5rem (24px), font-weight 600

## Layout System
- **Container Max Width**: max-w-2xl (672px) - contained, focused interface
- **Spacing Primitives**: Use Tailwind units of 2, 4, 6, 8, 12, 16
- **Card Padding**: p-8 (desktop), p-6 (mobile)
- **Input Vertical Spacing**: space-y-6
- **Vertical Rhythm**: Consistent 6-unit spacing between form elements

## Component Library

### Main Container
- Centered layout with max-w-2xl
- Vertical centering: min-h-screen with flex items-center justify-center
- Padding: px-4 for mobile safety margins

### Calculator Card
- White background (dark: dark surface) with subtle shadow
- Rounded corners: rounded-2xl
- Border: 1px solid border color
- Elevated appearance: shadow-lg (subtle)

### Input Groups
- Label above input, left-aligned
- Label styling: text-sm font-medium mb-2
- Stacked layout with consistent spacing (space-y-2)

### Input Fields
- Height: h-12
- Full width: w-full
- Rounded: rounded-lg
- Border: 1.5px solid border color
- Padding: px-4
- Font size: text-base
- Focus state: ring-2 ring-primary with ring-offset-2
- Placeholder: text-secondary with opacity-60
- Dark mode: Background slightly lighter than card surface

### Buttons
- **Primary (Calculate)**:
  - Background: Primary brand color
  - Text: White
  - Height: h-12
  - Padding: px-8
  - Rounded: rounded-lg
  - Font: font-semibold
  - Hover: Darker primary color with smooth transition
  - Full width on mobile, inline on desktop
  
- **Secondary (Reset)**:
  - Background: Transparent
  - Text: Text primary
  - Border: 1.5px solid border color
  - Same dimensions as primary
  - Hover: Light gray background

### Button Group
- Flexbox layout: flex gap-4
- Mobile: flex-col (stacked)
- Desktop: flex-row

### Results Display
- Margin top: mt-8 (clear separation from inputs)
- Border top: 1.5px solid border color with pt-8
- Background: Subtle gray tint (optional card within card)
- Padding: p-6 with rounded-lg

### Results Items
- Each result row: flex justify-between items-baseline
- Label: text-sm font-medium text-secondary
- Value: text-2xl font-semibold text-primary
- Spacing between rows: space-y-4
- Currency symbol: text-base (smaller than value)

## Visual Hierarchy
1. **Page Title**: Centered, bold, prominent (mb-8)
2. **Input Fields**: Clear labels, generous touch targets
3. **Action Buttons**: Prominent, well-spaced
4. **Results**: Visually separated, emphasized values with clear labels

## Responsive Behavior
- **Mobile (< 640px)**: 
  - Full-width inputs and buttons
  - Stacked button layout
  - Reduced padding (p-6 on card)
  - Smaller typography scale
  
- **Desktop (≥ 640px)**:
  - Constrained width for optimal reading
  - Side-by-side buttons
  - Generous spacing

## Accessibility
- All inputs have associated labels (not placeholders alone)
- Focus states clearly visible with ring indication
- Color contrast meets WCAG AA standards
- Touch targets minimum 44px height
- Consistent dark mode throughout all inputs and text fields

## Animations
**Minimal and Purposeful**:
- Input focus: Smooth ring transition (150ms)
- Button hover: Background color transition (150ms)
- Results appearance: Subtle fade-in (200ms) when displayed
- No loading spinners needed (instant calculation)

## Images
**No hero image required** - This is a focused utility tool. The clean, professional interface speaks for itself without marketing imagery.