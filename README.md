# Tourify Client - Next.js Frontend

Modern, responsive Next.js 16 application for the Tourify platform. Connects travelers with local guides for authentic experiences.

**Live Demo**: [Your Vercel Link]  
**API Base**: [Your Backend URL]

---

## 📦 Project Structure

```
src/
├── app/                      # Next.js App Router
│   ├── (commonLayout)/       # Public pages with navbar/footer
│   │   ├── (public)/         # Public routes
│   │   │   ├── (auth)/       # Auth pages (login, register, verify)
│   │   │   ├── explore/      # Tour exploration
│   │   │   ├── tours/        # Tour listings and details
│   │   │   ├── about/        # About page
│   │   │   └── page.tsx      # Home page
│   │   └── profile/          # User profiles
│   ├── (dashboardLayout)/    # Protected dashboard pages
│   │   └── dashboard/        # Role-based dashboards
│   │       ├── tourist/      # Tourist dashboard
│   │       ├── guide/        # Guide dashboard
│   │       └── admin/        # Admin dashboard
│   ├── layout.tsx            # Root layout
│   ├── error.tsx             # Global error boundary
│   └── not-found.tsx         # 404 page
├── components/               # Reusable React components
│   ├── modules/              # Feature-specific components
│   │   ├── auth/             # Authentication forms
│   │   ├── home/             # Home page sections
│   │   ├── layout/           # Navbar, Footer
│   │   ├── dashboard/        # Dashboard components
│   │   ├── explore/          # Search/filter components
│   │   ├── listing/          # Listing components
│   │   └── ...               # Other feature modules
│   ├── shared/               # Shared components (InputFieldError, etc)
│   └── ui/                   # UI primitives (Button, Card, Input, etc)
├── context/                  # React Context (i18n, etc)
├── lib/                      # Utility functions
│   ├── auth-utils.ts         # Auth helpers
│   ├── env.ts                # Environment variables
│   ├── server-fetch.ts       # Server-side fetch wrapper
│   ├── zodValidator.ts       # Zod validation helper
│   └── utils.ts              # General utilities
├── services/                 # API service functions
│   ├── auth/                 # Auth API calls
│   ├── booking/              # Booking API calls
│   ├── listing/              # Listing API calls
│   ├── payment/              # Payment API calls
│   └── ...                   # Other services
├── types/                    # TypeScript interfaces
│   └── index.ts              # Type definitions
├── zod/                      # Zod validation schemas
│   └── auth.validation.ts    # Auth validation schemas
└── public/                   # Static assets
```

---

## 🚀 Quick Start

### Installation

```bash
# Install dependencies
npm install

# Create .env.local
cat > .env.local << EOF
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
NEXT_PUBLIC_JWT_SECRET=your_jwt_secret_here
EOF

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Build & Deploy

```bash
# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

---

## 🎨 Key Features

✅ **User Authentication**

- Email-based registration with verification
- Secure login/logout
- JWT token management
- Password reset via email
- Role-based access control (Tourist/Guide/Admin)

✅ **Tour Management**

- Browse and search tours with filters
- Create tour listings (Guides only)
- Edit and delete listings
- Upload multiple tour photos
- Set pricing and availability

✅ **Booking System**

- Request tours
- Real-time booking status updates
- Cancel bookings
- Track booking history

✅ **Payments**

- Stripe integration for credit cards
- SSLCommerz for local payments
- Secure payment processing
- Payment history tracking

✅ **Reviews & Ratings**

- Leave reviews after tours
- Rate guides (1-5 stars)
- View guide ratings

✅ **User Dashboards**

- Tourist: Manage bookings, reviews, payments
- Guide: Create listings, manage bookings, view earnings
- Admin: Manage users, listings, bookings, payments

✅ **Home Page (7 Sections)**

1. Hero section with search
2. How it works (3-step process)
3. Popular destinations
4. Top-rated guides
5. Tour categories
6. Customer testimonials
7. Call-to-action for guides

---

## 🎨 Key Pages

### Public Pages

- **`/`** - Home page with hero, featured tours, guides, and CTA
- **`/explore`** - Browse tours with filters
- **`/tours/:id`** - Tour details and booking widget
- **`/register`** - Sign up (Tourist/Guide)
- **`/login`** - User login
- **`/verify-email`** - Email verification after registration
- **`/profile/:id`** - Public user profiles
- **`/about`** - About the platform

### Protected Pages (Tourist)

- **`/dashboard/tourist`** - Trip overview and bookings
- **`/dashboard/tourist/bookings`** - Manage bookings
- **`/dashboard/tourist/reviews`** - Written reviews
- **`/dashboard/tourist/payments`** - Payment history
- **`/profile/me`** - Profile settings

### Protected Pages (Guide)

- **`/dashboard/guide`** - Dashboard overview
- **`/dashboard/guide/listings`** - Manage tours
- **`/dashboard/guide/listings/create`** - Create new tour
- **`/dashboard/guide/listings/:id/edit`** - Edit tour
- **`/profile/me`** - Profile and expertise settings

### Protected Pages (Admin)

- **`/dashboard/admin`** - Admin overview
- **`/dashboard/admin/users`** - User management
- **`/dashboard/admin/listings`** - Listing moderation
- **`/dashboard/admin/bookings`** - Booking oversight
- **`/dashboard/admin/payments`** - Payment analytics

### Special Pages

- **`/payment/success`** - Payment confirmation
- **`/payment/fail`** - Payment failure
- **`/404`** - Not found
- **`/error`** - Error boundary page

---

## 🔐 Authentication Flow

1. **Register**: User selects role (Tourist/Guide)
2. **Verification**: Email sent with token link
3. **Verify Email**: Visit `/verify-email?token=xyz`
4. **Login**: Use credentials to authenticate
5. **Session**: JWT tokens stored in secure cookies
6. **Auto-refresh**: Automatic token refresh on expiry

---

## 🛠️ Development Features

### Forms & Validation

- React Hook Form for form management
- Zod for schema validation
- Real-time field-level error display
- Conditional fields based on user role

### State Management

- React Hooks (useState, useContext)
- Context API for global state
- Server-side data fetching where possible

### API Integration

- Custom fetch wrapper with token handling
- Automatic request/response logging
- Token refresh on 401 errors
- Centralized error handling

### UI Components

- Shadcn/ui components via Radix UI
- Custom styled Button, Card, Input, etc.
- Accessible forms and inputs
- Responsive grid layouts

### Notifications

- Sonner Toast notifications
- Success, error, info, warning toasts
- Custom toast styles

---

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Tailwind CSS for styling
- Touch-friendly interactions
- Proper spacing and typography

---

## 🌐 Environment Variables

Required `.env.local` variables:

```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api

# JWT (for client-side token verification)
NEXT_PUBLIC_JWT_SECRET=your_jwt_secret_key

# Optional
NEXT_PUBLIC_APP_NAME=Tourify
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 🔄 API Client

The `server-fetch` utility provides:

```typescript
import { serverFetch } from "@/lib/server-fetch";

// GET request
const data = await serverFetch.get("/listings?limit=10");

// POST request
const result = await serverFetch.post("/bookings", {
  body: JSON.stringify({ listingId: "123", date: "2025-01-15" }),
  headers: { "Content-Type": "application/json" },
});

// PUT request with auth
const updated = await serverFetch.put("/listings/456", {
  body: JSON.stringify({ title: "New Title" }),
});

// DELETE request
await serverFetch.delete("/bookings/789");
```

Features:

- Automatic JWT token injection
- Token refresh on expiry
- Proper error handling
- Request/response logging
- Cookie management

---

## 🎯 Performance Optimizations

- Code splitting with Next.js
- Image optimization with next/image
- Server-side rendering for public pages
- Client-side rendering for interactive features
- CSS-in-JS with Tailwind (no runtime overhead)
- Preloading critical routes

---

## 🧪 Testing & Linting

```bash
# Lint with ESLint
npm run lint

# Fix linting issues
npm run lint -- --fix

# Type checking
npx tsc --noEmit
```

---

## 📦 Dependencies

### Core

- `next` - React framework
- `react` - UI library
- `typescript` - Type safety

### Styling

- `tailwindcss` - Utility-first CSS
- `tailwind-merge` - Merge Tailwind classes
- `class-variance-authority` - Component variants

### Forms & Validation

- `react-hook-form` - Form state management
- `zod` - Schema validation
- `@hookform/resolvers` - Form validation resolvers

### UI Components

- `@radix-ui/*` - Accessible components
- `lucide-react` - Icon library

### HTTP & Auth

- `axios` - HTTP client
- `jwt-decode` - JWT decoding
- `jsonwebtoken` - JWT utilities
- `js-cookie` - Cookie management

### Notifications

- `sonner` - Toast notifications

### Animations

- `framer-motion` - Animation library
- `swiper` - Carousel component

### Date & Time

- `date-fns` - Date utilities
- `react-day-picker` - Calendar component

---

## 🚀 Deployment to Vercel

```bash
# Push to GitHub
git push origin main

# Connect to Vercel
# 1. Go to vercel.com
# 2. Import your repository
# 3. Add environment variables in Project Settings
# 4. Deploy

# Or use Vercel CLI
npm i -g vercel
vercel --prod
```

---

## 🐛 Common Issues

### CORS Errors

- Ensure backend CORS is configured
- Check `NEXT_PUBLIC_API_BASE_URL` matches backend

### Authentication Failures

- Clear cookies and localStorage
- Check token expiry
- Verify JWT_SECRET matches backend

### Image Loading Issues

- Configure Cloudinary domain in next.config.ts
- Check image URLs are accessible

### Form Validation

- Ensure Zod schemas match backend validation
- Check field names in form data

---

## 📚 Documentation

- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Zod Documentation](https://zod.dev)
- [Radix UI](https://www.radix-ui.com)

---

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/feature-name`
2. Commit changes: `git commit -am 'Add feature'`
3. Push to branch: `git push origin feature/feature-name`
4. Create Pull Request

---

## 📄 License

Proprietary - All rights reserved

---

## 📞 Support

- Email: support@tourify.com
- Issue Tracker: GitHub Issues
- Documentation: See main README.md

---

_Last Updated: December 2025_

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the root of the `tourify-client` directory and add the following variables.

```env
# URL of the backend server
NEXT_PUBLIC_BASE_API_URL=<Your Backend Live URL or http://localhost:5000/api/v1>

# The base URL of this client application (for payment redirects, etc.)
NEXT_PUBLIC_CLIENT_URL=<Your Client Live URL or http://localhost:3000>

# JWT Secret for verifying tokens (must match the server's secret)
JWT_SECRET=<Your JWT Secret - must match server's JWT secret>
```

### 4. Run the Development Server

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

---

## Admin Credentials

To access the admin dashboard and its features, use the following credentials:

- **Email:** `admin@tourify.com`
- **Password:** `super.secret.password`

---

## Video Explanation

[Your Video Explanation Link]
