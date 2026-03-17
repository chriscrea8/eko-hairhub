# 🪒 Eko HairHub — Lagos's Premier Hair Marketplace

A production-ready full-stack marketplace connecting customers with hairstylists, barbers, and salons in Lagos, Nigeria.

---

## 📸 Feature Overview

| Role | Key Features |
|---|---|
| **Customer** | Browse gallery, find stylists, book appointments, pay via Paystack, review |
| **Stylist** | Profile & portfolio, services, availability, booking management, earnings |
| **Admin** | Dashboard, user management, stylist verification, booking & payment monitoring |

---

## 🏗️ Architecture

```
eko-hairhub/           → Next.js 14 Frontend (TypeScript + TailwindCSS)
eko-hairhub-backend/   → Node.js + Express.js API (TypeScript)
docker-compose.yml     → Full-stack container orchestration
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- PostgreSQL 14+
- npm or yarn

### 1. Clone & Install

```bash
# Frontend
cd eko-hairhub
cp .env.example .env.local
npm install

# Backend
cd ../eko-hairhub-backend
cp .env.example .env
npm install
```

### 2. Configure Environment Variables

#### Frontend (`eko-hairhub/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_your_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

#### Backend (`eko-hairhub-backend/.env`)
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/eko_hairhub"
JWT_SECRET=your-minimum-32-char-secret-here
PAYSTACK_SECRET_KEY=sk_test_your_paystack_secret
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
FRONTEND_URL=http://localhost:3000
```

### 3. Database Setup

```bash
cd eko-hairhub-backend

# Create and run migrations
npx prisma migrate dev --name init

# Seed with demo data
npm run seed
```

### 4. Start Development Servers

```bash
# Terminal 1 — Backend API (port 5000)
cd eko-hairhub-backend
npm run dev

# Terminal 2 — Frontend (port 3000)
cd eko-hairhub
npm run dev
```

Open http://localhost:3000

---

## 🐳 Docker (Full Stack)

```bash
# Copy and configure root .env
cp .env.example .env
# Edit .env with your Paystack, Cloudinary keys

# Start everything
docker-compose up -d

# Run migrations inside container
docker-compose exec backend npx prisma migrate deploy
docker-compose exec backend npm run seed
```

Services:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- PostgreSQL: localhost:5432

---

## 🔐 Demo Credentials

| Role | Email | Password |
|---|---|---|
| Admin | admin@ekohairhub.com | Admin@2024! |
| Customer | customer@demo.com | demo123 |
| Stylist | amaka@demo.com | demo123 |

---

## 📡 API Reference

Base URL: `http://localhost:5000/api`

### Authentication
| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Login |
| GET | `/auth/me` | Get current user |
| POST | `/auth/change-password` | Change password |

### Stylists
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/stylists` | — | Search/list stylists |
| GET | `/stylists/:id` | — | Get stylist profile |
| PATCH | `/stylists/profile` | Stylist | Update own profile |
| POST | `/stylists/services` | Stylist | Add service |
| DELETE | `/stylists/services/:id` | Stylist | Remove service |
| PUT | `/stylists/availability` | Stylist | Update schedule |
| GET | `/stylists/my/earnings` | Stylist | View earnings |

### Hairstyles
| Method | Endpoint | Description |
|---|---|---|
| GET | `/hairstyles` | Browse gallery |
| GET | `/hairstyles/:id` | Get style details |
| POST | `/hairstyles` | Add style (Admin) |

### Bookings
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/bookings` | Customer | Create booking |
| GET | `/bookings` | Required | List bookings |
| GET | `/bookings/:id` | Required | Get booking |
| PATCH | `/bookings/:id/status` | Required | Update status |

### Payments
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/payments/initialize` | Customer | Init Paystack |
| GET | `/payments/verify/:ref` | Customer | Verify payment |
| POST | `/payments/webhook` | — | Paystack webhook |
| GET | `/payments/booking/:id` | Required | Get payment |

### Reviews
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/reviews` | Customer | Submit review |
| GET | `/reviews/stylist/:id` | — | Get stylist reviews |

---

## 💳 Paystack Integration

The booking flow:
1. Customer selects stylist, service, date, and location
2. POST `/api/payments/initialize` → Returns `authorization_url`
3. Redirect customer to Paystack checkout
4. Paystack redirects to `/payment/verify?reference=REF`
5. GET `/api/payments/verify/:reference` confirms transaction
6. Booking status updated; notifications sent

**Webhook setup**: In your Paystack dashboard, set webhook URL to:
`https://your-domain.com/api/payments/webhook`

---

## ☁️ Cloudinary Setup

1. Create account at cloudinary.com
2. Add credentials to backend `.env`
3. Create upload presets in Cloudinary dashboard:
   - `eko_portfolios` — for stylist portfolio images
   - `eko_avatars` — for user avatars

---

## 📁 Project Structure

```
eko-hairhub/                          # Frontend
├── src/
│   ├── app/
│   │   ├── (public)/                 # Login, Register, Hairstyles, Stylists
│   │   ├── (customer)/               # Dashboard, Bookings, Profile
│   │   ├── (stylist)/stylist-dashboard/ # Full stylist suite
│   │   ├── (admin)/admin/            # Admin panel
│   │   ├── stylists/[id]/            # Stylist profile page
│   │   └── book/[stylistId]/         # Multi-step booking flow
│   ├── components/
│   │   ├── ui/                       # Button, Input, Badge, etc.
│   │   └── layout/                   # Navbar, Footer
│   ├── lib/
│   │   ├── mock-data.ts              # Demo data
│   │   └── utils.ts                  # Helpers
│   └── types/index.ts                # TypeScript types

eko-hairhub-backend/                   # Backend API
├── prisma/
│   ├── schema.prisma                 # Full DB schema
│   └── seed.ts                       # Demo seed data
├── src/
│   ├── config/index.ts               # Environment config
│   ├── middleware/auth.ts             # JWT + RBAC middleware
│   ├── controllers/
│   │   ├── auth.controller.ts        # Register, login, me
│   │   ├── stylist.controller.ts     # Stylist CRUD
│   │   ├── booking.controller.ts     # Booking flow
│   │   └── payment.controller.ts     # Paystack integration
│   └── routes/index.ts               # All API routes
```

---

## 🗄️ Database Models

| Model | Description |
|---|---|
| `User` | All users (customer, stylist, admin) |
| `StylistProfile` | Extended stylist data, rating, earnings |
| `PortfolioImage` | Cloudinary-stored portfolio photos |
| `Service` | Services offered by stylists with pricing |
| `Hairstyle` | Curated hairstyle gallery |
| `Availability` | Weekly stylist schedule |
| `Booking` | Appointment records with full lifecycle |
| `Payment` | Paystack transaction records |
| `Review` | Post-booking customer reviews |
| `Notification` | In-app notifications |

---

## 🛡️ Security Features

- **bcrypt** password hashing (12 rounds)
- **JWT** tokens with expiry
- **Role-based access control** (CUSTOMER / STYLIST / ADMIN)
- **Rate limiting** on all endpoints, stricter on auth
- **Helmet.js** security headers
- **Input validation** on all endpoints
- **Paystack webhook signature verification**
- **Conflict detection** for double-bookings

---

## 🔜 Next Steps (Production Readiness)

- [ ] Add email notifications (Nodemailer / Resend)
- [ ] SMS notifications via Termii or Twilio
- [ ] Real-time notifications via Socket.io
- [ ] Image optimization pipeline in Cloudinary
- [ ] Redis caching for stylist search results
- [ ] Elasticsearch for advanced search
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] SSL certificates (Let's Encrypt)
- [ ] Monitoring (Sentry, Datadog)
- [ ] Admin analytics dashboard with real charts

---

## 📄 License

MIT License — Built with ❤️ for Lagos.
