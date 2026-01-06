# Nike E-commerce Application

A modern e-commerce application built with Next.js, featuring server-side rendering, GSAP animations, and JWT authentication.

## Features

- **Server-Side Rendering (SSR)** for Navbar, Product Details, and Footer
- **GSAP Animations** on product cards with hover effects
- **JWT Authentication** with phone/OTP login
- **Protected Routes** using middleware
- **State Management** with Zustand
- **Responsive Design** with Tailwind CSS
- **API Integration** with secure SSRF protection
- **Image Optimization** with Next.js Image component
- **Error Handling** with proper TypeScript types

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **State Management**: Zustand with persistence
- **Animations**: GSAP
- **Authentication**: JWT tokens with secure cookies
- **Language**: TypeScript
- **Security**: SSRF protection, URL validation

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   Create a `.env.local` file in the root directory:
   ```bash
   NEXT_PUBLIC_API_BASE_URL=https://skilltestnextjs.evidam.zybotechlab.com/api
   ALLOWED_DOMAINS=skilltestnextjs.evidam.zybotechlab.com
   ALLOWED_IMAGE_DOMAINS=skilltestnextjs.evidam.zybotechlab.com,localhost
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser** and navigate to `http://localhost:3000`

## Project Structure

```
├── app/
│   ├── globals.css          # Global styles with Tailwind
│   ├── layout.tsx           # Root layout with SSR navbar/footer
│   ├── page.tsx             # Home page redirects to login
│   ├── login/
│   │   └── page.tsx         # Authentication flow
│   ├── products/
│   │   └── page.tsx         # Product listing page
│   ├── profile/
│   │   └── page.tsx         # Protected user profile
│   └── success/
│       └── page.tsx         # Order success page
├── components/
│   ├── AuthProvider.tsx     # Client-side auth initialization
│   ├── Footer.tsx           # SSR footer component
│   ├── Navbar.tsx           # SSR navbar component
│   ├── NavbarClient.tsx     # Client-side navbar logic
│   └── ProductCard.tsx      # Product card with GSAP animations
├── lib/
│   └── api.ts               # API utility functions with security
├── store/
│   └── index.ts             # Zustand store for state management
├── public/
│   └── images/              # Static assets
└── middleware.ts            # Route protection middleware
```

## Key Features Implementation

### 1. Server-Side Rendering
- Navbar, Footer, and Product listing are server-rendered
- SEO-friendly with proper meta tags
- Fast initial page loads with Next.js optimization

### 2. GSAP Animations
- Product cards have smooth hover animations
- Image moves upward on hover with easing
- Interactive color and size selection

### 3. Authentication Flow
- Phone number input → OTP verification → Registration (if new user)
- JWT tokens stored securely in cookies
- Protected routes with middleware validation
- Proper error handling for malformed data

### 4. State Management
- Zustand for lightweight state management
- Separate stores for auth and app state
- Persistent authentication across page reloads
- Local storage for cart data

### 5. Security Features
- SSRF protection with domain allowlists
- URL validation for all external requests
- Secure cookie handling
- Input sanitization and validation

### 6. Performance Optimizations
- Next.js Image component for automatic optimization
- Lazy loading and responsive images
- Efficient state management
- Minimal re-renders with proper React patterns

## API Endpoints Used

- `POST /api/verify/` - Phone verification
- `POST /api/login-register/` - User registration
- `POST /api/purchase-product/` - Product purchase
- `GET /api/user-orders/` - User order history
- `GET /api/new-products/` - Product listing

## Environment

The application uses environment variables for configuration:

- `NEXT_PUBLIC_API_BASE_URL` - API base URL (default: https://skilltestnextjs.evidam.zybotechlab.com/api)
- `ALLOWED_DOMAINS` - Comma-separated list of allowed domains for SSRF protection
- `ALLOWED_IMAGE_DOMAINS` - Comma-separated list of allowed image domains

## Build for Production

```bash
npm run build
npm start
```

## Design Compliance

The UI closely matches the provided Figma designs with:
- Exact color schemes and typography
- Proper spacing and layout
- Mobile-responsive design
- Nike branding elements
- Consistent user experience across devices
