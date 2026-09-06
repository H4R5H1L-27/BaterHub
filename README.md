# BarterHub — Full-Stack OLX-Inspired Product & Book Exchange Platform

![Next.js](https://img.shields.io/badge/Next.js-14.2-black?logo=next.js) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?logo=postgresql&logoColor=white) ![Prisma](https://img.shields.io/badge/Prisma-5.22-2D3748?logo=prisma) ![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-06B6D4?logo=tailwindcss)

A production-grade circular classifieds marketplace for buying, selling, and swapping second-hand books, academic textbooks, and tech gear.

---

## 📸 Screenshots & Highlights

<div align="center">

### Marketplace Homepage
![BarterHub Homepage](public/screenshots/homepage.png)
*Modern marketplace design featuring dynamic search bar, categories grid, featured items, and quick action bar.*

<br/>

### Browse & Faceted Search
![Browse & Search](public/screenshots/browse.png)
*Advanced filtering by category, price, location, condition, and exchange type.*

<br/>

### Product Details & Trade Actions
![Product Detail](public/screenshots/detail.png)
*Detailed item views with multi-image gallery, condition details, trade proposal tools, and seller trust stats.*

<br/>

### Authentication & Persona Switcher
![Login & Persona Switcher](public/screenshots/login.png)
*One-click test persona switcher for frictionless trade side testing.*

</div>

---

## Inspired by OLX — Upgraded Far Beyond

This project started as a clone of the [sijeeshmiziha/olx](https://github.com/sijeeshmiziha/olx) reference (React.js + Firebase SPA) and has been fully rebuilt as a production-grade full-stack platform.

| Feature | Base OLX Clone | BarterHub |
|---|---|---|
| **Architecture** | Client-side React 17 + Firebase | Next.js 14 App Router, TypeScript, PostgreSQL, Prisma |
| **Exchange Modes** | Cash only | Cash, True Barter (Item-for-Item), Hybrid (Item + Cash Top-Up) |
| **Negotiation** | Static chat | In-thread live offer cards with accept/counter/decline |
| **Academic Engine** | None | ISBN, course code, academic subject, annotation flags |
| **Trust & Safety** | None | Mutual 6-digit handover codes, verified dual-sided reviews |
| **Search** | Basic text | Faceted filters, voice search, trending and saved searches |
| **Testing** | Manual signup | 1-click persona switcher for both trade sides |

---

## 🗄️ Database Architecture & Schema Structure

BarterHub runs on **PostgreSQL 16** managed via **Prisma ORM**. The database contains 16 models and 13 enums:

```mermaid
erDiagram
    User ||--o{ Listing : "owns"
    User ||--o{ CashOffer : "sends/receives"
    User ||--o{ BarterProposal : "initiates/receives"
    User ||--o{ Message : "sends/receives"
    User ||--o{ Review : "writes/receives"
    
    Listing ||--o| BookDetails : "has optional"
    Listing ||--o| ProductDetails : "has optional"
    Listing ||--o{ CashOffer : "receives"
    Listing ||--o{ BarterProposal : "target of"
    
    BarterProposal ||--o{ BarterItem : "contains items offered"
    Listing ||--o{ BarterItem : "offered in"
    
    Conversation ||--o{ Message : "contains"
    User ||--o{ Conversation : "participates in"
```

### Core Entities

| Model | Description | Key Fields & Relations |
|---|---|---|
| **`User`** | Platform user profiles, trust stats, reputation | `email`, `reputationScore`, `totalTrades`, `role` |
| **`Listing`** | Classified items listed for sale/trade | `listingType` (BOOK/PRODUCT), `exchangeType` (CASH/BARTER/HYBRID), `status` |
| **`BookDetails`** | Academic & literary metadata | `isbn`, `author`, `academicSubject`, `courseCode`, `hasAnnotations` |
| **`ProductDetails`** | Electronics & general item metadata | `category`, `brand`, `model`, `includesOriginalBox` |
| **`CashOffer`** | Price negotiation and counter-offers | `offerAmount`, `counterAmount`, `status` (PENDING/COUNTERED/ACCEPTED/DECLINED) |
| **`BarterProposal`** | Item-for-item and hybrid barter deals | `targetListingId`, `cashTopUp`, `exchangeCode`, `status` |
| **`BarterItem`** | Multi-item barter mapping table | `proposalId`, `listingId` |
| **`Conversation`** | Chat thread between 2 traders | `participantAId`, `participantBId`, `listingId` |
| **`Message`** | In-thread text or actionable offer card | `messageType` (TEXT/CASH_OFFER_CARD/BARTER_PROPOSAL_CARD), `metadata` |
| **`Review`** | Verified dual-sided trader rating | `overallRating`, `communicationRating`, `punctualityRating`, `isVerified` |
| **`SavedListing`** | User bookmarking / favorites | Unique constraint on `[userId, listingId]` |
| **`Notification`** | In-app activity notifications | `type` (OFFER/BARTER/MESSAGE/PRICE_DROP), `isRead` |

---

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 16

### 1. Clone and Install
```bash
git clone https://github.com/H4R5H1L-27/BaterHub.git
cd BaterHub
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
```

Edit `.env`:
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/productexchange?schema=public"
JWT_SECRET="your-super-secret-jwt-key-32-chars-min"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Setup Database
```bash
npx prisma db push
npm run seed
```

### 4. Start Dev Server
```bash
npm run dev
```

Open http://localhost:3000

---

## Test User Personas

All accounts use password: **password123**

Use the one-click persona switcher on the /login page.

| Name | Email | City | Rating |
|---|---|---|---|
| Alex Turner | alex@example.com | New York, NY | 4.95 |
| Sarah Jenkins | sarah@example.com | Boston, MA | 5.0 |
| Marcus Chen | marcus@example.com | San Francisco, CA | 4.88 |
| Elena Rostova | elena@example.com | Austin, TX | 4.75 |
| David Miller | david@example.com | Seattle, WA | 4.92 |

---

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 3.4 with custom design tokens
- **ORM**: Prisma 5.22
- **Database**: PostgreSQL 16
- **Auth**: JWT + bcryptjs
- **Icons**: Lucide React
- **Deployment**: Docker + Docker Compose

---

## Scripts

```bash
npm run dev       # Development server
npm run build     # Production build
npm run start     # Production server
npm run seed      # Seed database with demo data
npm run lint      # Run ESLint
npx prisma db push    # Sync schema to DB
npx prisma studio     # Visual DB browser
```

---

## Docker Deployment

```bash
docker-compose up --build -d
```

---

## API Reference

| Endpoint | Method | Description |
|---|---|---|
| /api/auth/register | POST | Register user |
| /api/auth/login | POST | Login |
| /api/auth/me | GET | Current user |
| /api/auth/logout | POST | Logout |
| /api/listings | GET, POST | Search listings / Create listing |
| /api/listings/[id] | GET, DELETE | Listing detail / Delete |
| /api/listings/[id]/promote | PATCH | Feature/Urgent/Top promotion |
| /api/listings/my | GET | My listings |
| /api/offers | GET, POST | List / Submit cash offers |
| /api/offers/[id] | PATCH | Accept/Counter/Decline offer |
| /api/barters | GET, POST | List / Submit barter proposals |
| /api/barters/[id] | PATCH | Accept/Reject/Complete barter |
| /api/conversations | GET | Chat threads |
| /api/messages | GET, POST | Messages |
| /api/reviews | GET, POST | Reviews |
| /api/favorites | GET, POST, DELETE | Saved listings |
| /api/notifications | GET, PATCH | Notifications |
| /api/health | GET | System health |
| /api/seed | GET, POST | Re-seed database |

---

## License

MIT
