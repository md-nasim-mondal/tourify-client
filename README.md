# Local Guide Platform (Client)

Welcome to the client-side of the Local Guide Platform, designed to connect travelers with passionate local guides for authentic, personalized experiences.

**GitHub Client Repo:** [Your GitHub Client Repo Link]
**Live Deployment:** [Your Client Live Deployment Link]

---

## Features

- **User Authentication:** Secure registration and login for Tourists, Guides, and Admins using JWT.
- **Role-Based Dashboards:** Separate, feature-rich dashboards for each user role (Tourist, Guide, Admin).
- **Profile Management:** Users can update their profile information, including bio and profile picture.
- **Tour Listing Management:** Guides can create, update, and delete their tour listings with detailed information and images.
- **Advanced Search & Filtering:** Tourists can easily find tours by destination, category, price range, and language.
- **Complete Booking System:** A full booking workflow where tourists can request tours and guides can accept or decline them.
- **Review & Rating System:** Tourists can leave reviews and ratings on tours they have completed.
- **Secure Payment Integration:** Seamless payment flow powered by Stripe/SSLCommerz for booking confirmations.
- **Admin Management:** Admins have a global overview of the platform with capabilities to manage users, listings, and bookings.
- **Global Error Handling:** Friendly error messages (toasts, alerts) for a smooth user experience.
- **Global Not Found Page:** Custom 404 page for non-existent routes.

---

## Technology Stack

- **Framework:** Next.js (with Server Components and Server Actions)
- **Styling:** Tailwind CSS
- **UI Components:** Shadcn/UI
- **State Management:** React Hooks (`useState`, `useActionState`)
- **Form Validation:** Zod
- **Deployment:** Vercel
- **Others:** Any other required npm packages will be listed in `package.json`.

---

## Setup & Usage

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