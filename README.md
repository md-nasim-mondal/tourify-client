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
 
 ### Prerequisites
 
  - Node.js (v18 or later)
  - npm or yarn

 ### 1. Clone the Repository
 
 ```bash
 git clone <repository-url>
 cd tourify-client
 ```
 
 ### 2. Install Dependencies
 
 ```bash
 npm install
 ```
 
 ### 3. Set Up Environment Variables
 
 Create a `.env.local` file in the root of the `tourify-client` directory.
 
 ```env
 # API Configuration
 NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api/v1
 
 # JWT (must match server's JWT_SECRET)
 NEXT_PUBLIC_JWT_SECRET=your_jwt_secret_key
 
 # Optional
 NEXT_PUBLIC_APP_NAME=Tourify
 NEXT_PUBLIC_APP_URL=http://localhost:3000
 ```
 
 ### 4. Run Development Server
 
 ```bash
 npm run dev
 ```
 
 Open [http://localhost:3000](http://localhost:3000) to view the app.
 
 ### 5. Build for Production

 ```bash
 npm run build
 npm start
 ```

---

## Admin Credentials

To access the admin dashboard and its features, use the following credentials:

- **Email:** `admin@tourify.com`
- **Password:** `super.secret.password`

---

## Video Explanation

[Your Video Explanation Link]
