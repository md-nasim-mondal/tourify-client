# Tourify - Local Guide Platform

## 🚀 Project Overview
**Tourify** connects travelers with passionate local experts who offer authentic, personalized experiences. Unlike generic tour agencies, this platform empowers individuals to share their city’s hidden gems, culture, and stories. Travelers can find guides who match their interests—whether for a food crawl, a photography walk, or a historical tour—and explore a destination like a local.

This project democratizes travel guiding, allowing locals to monetize their knowledge and travelers to access unique, off-the-beaten-path experiences.

### 🌟 Key Objectives
- **Connect Travelers & Guides**: Bridging the gap between tourists and local experts.
- **Booking System**: Secure and seamless booking workflow for tours.
- **Trust & Verification**: Detailed profiles, reviews, and ratings.
- **User-Friendly Interface**: Engaging UI/UX for easy exploration and management.

---

## 🔗 Live Links & Repository

| Type | Link |
| :--- | :--- |
| **Client Live Deployment** | [Your Client Live Deployment Link] |
| **Server Live Deployment** | [Your Server Live Deployment Link] |
| **GitHub Client Repo** | [Your GitHub Client Repo Link] |
| **GitHub Server Repo** | [Your GitHub Server Repo Link] |
| **Video Explanation** | [Your Video Explanation Link] |

---

## 🛠️ Technology Stack

| Category | Technologies |
| :--- | :--- |
| **Frontend** | Next.js 15, Tailwind CSS, Shadcn UI, Framer Motion, TypeScript |
| **Backend** | Node.js, Express.js, Prisma ORM |
| **Database** | PostgreSQL |
| **Authentication** | JWT (JSON Web Tokens), NextAuth (Optional) |
| **Payment** | SSLCommerz / Stripe |
| **State Management** | React Context / Zustand |
| **Validation** | Zod |
| **Deployment** | Vercel (Client), Render/Railway (Server) |

---

## ✨ Key Features

### 1. User Authentication & Roles
- **Secure Registration/Login**: Email & Password based login with JWT security.
- **Role-Based Access**:
    - **Tourist**: Browse and book tours, manage bookings, review guides.
    - **Guide**: Create services/tours, manage availability, accept bookings.
    - **Admin**: Full control over users, listings, and bookings.

### 2. User Profile Management
- **Universal Fields**: Name, Profile Picture, Bio, Languages.
- **Guide Specifics**: Expertise areas, Daily rates.
- **Tourist Specifics**: Travel preferences.

### 3. Tour Listing Management
- **Create & Manage Tours**: Title, Description, Price, Duration, Meeting Point, Group Size.
- **Rich Media**: Image uploads (Cloudinary/ImgBB).
- **CRUD Operations**: Guides can edit or deactivate their listings.

### 4. Search & Discovery
- **Advanced Filtering**: Filter by City, Language, Category, and Price.
- **Interactive Exploration**: Engaging listing cards and details.

### 5. Booking & Payments
- **Seamless Workflow**: Request -> Accept/Decline -> Confirm -> Complete.
- **Secure Payments**: Integrated payment gateway for safe transactions.

### 6. Reviews & Ratings
- **Trust Building**: Tourists can rate and review guides after completed tours.

---

## 💻 Setup & Usage Instructions

### Prerequisites
- Node.js (v18+)
- npm or yarn
- PostgreSQL Database URL

### 1. Clone the Repositories
```bash
# Clone Client
git clone <your-client-serving-url>
cd tourify-client

# Clone Server (in a separate directory)
git clone <your-server-repo-url>
cd tourify-server
```

### 2. Install Dependencies
Run this in both `tourify-client` and `tourify-server` directories:
```bash
npm install
```

### 3. Environment Configuration

**Client (`tourify-client/.env.local`):**
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_JWT_SECRET=your_jwt_secret
```

**Server (`tourify-server/.env`):**
```env
PORT=5000
DATABASE_URL=your_postgresql_url
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

### 4. Run the Application
**Start Backend:**
```bash
cd tourify-server
npm run dev
```

**Start Frontend:**
```bash
cd tourify-client
npm run dev
```
Access the client at `http://localhost:3000` and server at `http://localhost:5000`.

---

## 🏗️ Project Structure

### Client Structure (`tourify-client`)
```
src/
├── app/
│   ├── (auth)/             # Login, Register
│   ├── (public)/           # Home, Explore, Tours
│   ├── (dashboard)/        # Protected Routes (Tourist, Guide, Admin)
│   ├── components/         # Reusable UI Components
│   ├── lib/                # Utilities, API helpers
│   └── services/           # API Service calls
```

### Server Structure (`tourify-server`)
```
src/
├── app/
│   ├── modules/            # Feature modules (Auth, Users, Listings, Bookings)
│   │   ├── auth/           # Authentication logic
│   │   ├── user/           # User management
│   │   ├── listing/        # Tour listings
│   │   └── booking/        # Booking system
│   ├── routes/             # Main API router
│   └── middleware/         # Auth & Validation middleware
├── config/                 # Environment config
└── shared/                 # Shared specific types/utils
```

---

## 🔑 Admin Credentials
Use these credentials to test Admin features:

- **Email:** `admin@tourify.com`
- **Password:** `123456`

*(Replace with your actual admin credentials if different)*

---

## 📝 Submission Details
**Assignment:** Assignment 8 - Batch 5
**Project Name:** Tourify
**Student Name:** Md. Nasim Mondal
