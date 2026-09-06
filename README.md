# BarterHub — Modern Circular Peer-to-Peer Product & Book Exchange Platform

![Next.js](https://img.shields.io/badge/Next.js-14.2-black?logo=next.js) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?logo=postgresql&logoColor=white) ![Prisma](https://img.shields.io/badge/Prisma-5.22-2D3748?logo=prisma) ![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-06B6D4?logo=tailwindcss) ![Design System](https://img.shields.io/badge/Design_System-Stitch_Soft_Modernism-4648D4)

**BarterHub** is a production-grade circular classifieds and exchange platform engineered for swapping, buying, and selling second-hand books, academic textbooks, and high-performance tech gear. It delivers a zero-cash peer economy through direct item-for-item bartering, hybrid cash top-ups, in-thread deal negotiation cards, and physical 6-digit PIN handshake verification tokens.

---

## 🗺️ Platform Architecture & Site Map

```mermaid
graph TD
  Home["🏠 Homepage (/)<br/>• Hero & Value Proposition<br/>• Trending Search Pills<br/>• Featured Barters & Circular Bento"]
  Browse["🔍 Catalog & Filters (/listings)<br/>• Faceted Filter Rail<br/>• Valuation Histogram<br/>• Search & Active Chips<br/>• Soft Modern Cards"]
  NewListing["➕ Post Barter Ad (/listings/new)<br/>• Step 1-4 Wizard<br/>• Adaptable Category Specs<br/>• Valuation Slider & Wishlist Tags<br/>• Sticky Live Marketplace Preview"]
  ListingDetail["📦 Item Detail (/listings/:id)<br/>• Concentric Media Gallery<br/>• Barter / Cash CTAs<br/>• Trader Trust Dossier<br/>• Barter Modal / Offer Modal"]
  Offers["🤝 Offers & Swaps (/offers)<br/>• Inbound & Outbound Tabs<br/>• 6-Digit Handshake PIN Banner<br/>• Delivery Code Verification<br/>• Counter-Offer Actions"]
  Messages["💬 Trade Chat (/messages)<br/>• Real-Time Polling Engine<br/>• In-Thread Cash Offer Cards<br/>• In-Thread Barter Proposal Cards<br/>• Conversation Rail"]
  Dashboard["📊 Management Desk (/dashboard)<br/>• 4 Bento Analytics Cards<br/>• Views Sparkline Graph<br/>• Inventory Manager & Status Toggles<br/>• Quick Actions"]
  Favorites["❤️ Saved Watchlist (/favorites)<br/>• Mutual Match Recommendation Alert<br/>• Saved Listing Grid<br/>• Quick Propose Actions"]
  Compare["⚖️ Comparison Matrix (/compare)<br/>• Side-by-Side Analysis Table<br/>• Valuation & Condition Alignment<br/>• Safe Meetup & Direct CTAs"]
  Profile["👤 Trader Reputation (/profile/:id)<br/>• Trust Scorecard (100% Meets)<br/>• Verified Campus Badges<br/>• Completed Trades & Reviews"]
  Auth["🔐 Auth & Persona Sandbox (/login & /register)<br/>• 1-Click Rapid Persona Switcher<br/>• Barter Guarantee Standards<br/>• Secure Email / Password"]

  Home --> Browse
  Home --> NewListing
  Home --> Auth
  Browse --> ListingDetail
  Browse --> Compare
  ListingDetail --> Offers
  ListingDetail --> Messages
  Offers --> Messages
  Offers --> Dashboard
  Dashboard --> NewListing
  Browse --> Favorites
  ListingDetail --> Profile
```

---

## 📱 Detailed Screen Specifications

| # | Screen / Route | Purpose | Key Modules |
|---|---|---|---|
| 1 | **Homepage** (`/`) | Main landing & discovery | Hero gradient, trending pills, featured trades grid, circular economy bento |
| 2 | **Catalog** (`/listings`) | Faceted marketplace browse | Filter rail, valuation histogram, search, active filter chips, soft-modern cards |
| 3 | **Post Barter** (`/listings/new`) | Listing creation wizard | 4-step wizard, adaptable book/tech specs, valuation slider, sticky live preview |
| 4 | **Listing Detail** (`/listings/:id`) | Specifications & proposal launcher | Image gallery, barter wishlist, trade action CTAs, trader trust dossier |
| 5 | **Offers & Swaps** (`/offers`) | Swap negotiation hub | 6-digit PIN verification banner, inbound/outbound tabs, deal cards |
| 6 | **Trade Chats** (`/messages`) | Real-time negotiation chat | Polling chat engine, in-thread cash offer cards, barter proposal cards |
| 7 | **Management Desk** (`/dashboard`) | Seller inventory & stats | 4 bento metric cards, views sparkline, inventory status toggles |
| 8 | **Saved Listings** (`/favorites`) | Wishlist & match alert | Mutual match banner, saved cards, quick trade actions |
| 9 | **Compare Matrix** (`/compare`) | Side-by-side analysis | Spec comparison table, valuation alignment, direct CTAs |
| 10 | **Trader Reputation** (`/profile/:id`) | Public trust scorecard | Verification badges, 99.4% meetup rate, past reviews & trades |
| 11 | **Authentication** (`/login` & `/register`) | Login & testing sandbox | 1-click Rapid Persona Switcher, guarantee standards cards, tab switcher |

---

## ✨ Core Platform Capabilities

| Feature | Description |
|---|---|
| **Exchange Modes** | Triple exchange engine supporting **Cash Sales**, **True Barter** (Item-for-Item), and **Hybrid Deals** (Item + Cash Top-Up). |
| **In-Thread Negotiation** | Interactive negotiation directly inside chat threads with live offer cards for accepting, countering, or declining. |
| **Academic & Tech Specs** | Rich domain-specific schemas: ISBN-10/13, course codes (e.g. CS 440), academic subjects, annotations, and tech box/cable status. |
| **Handshake Verification** | Synchronized 6-digit PIN delivery codes (`TRD-XXXX`) requiring mutual in-person confirmation before reviews and ratings unlock. |
| **Faceted Search Rail** | Interactive valuation histogram distribution, category pills, condition rubrics, and instant filter tags. |
| **1-Click Persona Switcher** | Switch identities with one click to simulate both buyer and seller sides of negotiations without password entry. |

---

## 🗄️ Database Architecture & Schema Structure

BarterHub runs on **PostgreSQL 16** managed through **Prisma ORM**. The database comprises 16 models and 13 enums:

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
| **`User`** | Platform user profiles, trust stats, reputation | `email`, `reputationScore`, `totalTrades`, `role`, `city`, `state` |
| **`Listing`** | Classified items listed for sale or swap | `listingType` (BOOK/PRODUCT), `exchangeType` (CASH/BARTER/HYBRID), `status` |
| **`BookDetails`** | Academic & literary metadata | `isbn`, `author`, `academicSubject`, `courseCode`, `hasAnnotations`, `format` |
| **`ProductDetails`** | Electronics & general gear metadata | `category`, `brand`, `model`, `includesOriginalBox`, `includesAccessories` |
| **`CashOffer`** | Price negotiation and counter-offers | `offerAmount`, `counterAmount`, `status` (PENDING/COUNTERED/ACCEPTED/DECLINED) |
| **`BarterProposal`** | Item-for-item and hybrid barter deals | `targetListingId`, `cashTopUp`, `exchangeCode`, `status` |
| **`BarterItem`** | Multi-item barter mapping table | `proposalId`, `listingId` |
| **`Conversation`** | Chat thread between 2 traders | `participantAId`, `participantBId`, `listingId` |
| **`Message`** | In-thread text or actionable offer card | `messageType` (TEXT/CASH_OFFER_CARD/BARTER_PROPOSAL_CARD), `metadata` |
| **`Review`** | Verified dual-sided trader rating | `overallRating`, `communicationRating`, `punctualityRating`, `isVerified` |
| **`SavedListing`** | User bookmarking / favorites | Unique constraint on `[userId, listingId]` |
| **`Notification`** | In-app activity notifications | `type` (OFFER/BARTER/MESSAGE/PRICE_DROP), `isRead` |

---

## ⚡ Quick Start Guide

### Prerequisites
- **Node.js**: v18.x or v20.x+
- **PostgreSQL**: v16+ (Local service or Docker container)

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/H4R5H1L-27/BaterHub.git
cd BaterHub
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Verify `.env` settings:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/productexchange?schema=public"
JWT_SECRET="dev-super-secret-jwt-key-replace-in-production-random-32-chars"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Setup Database & Seed Realistic Personas
```bash
npx prisma generate
npx prisma db push
npm run seed
```

### 4. Run Development Server
```bash
npm run dev
```

Visit **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🎭 Pre-Configured Test Personas

All demo accounts share the password: **`password123`**

You can switch between these profiles with **1-click** on the `/login` screen:

| Persona | Email | Focus & Role | Location | Completed Swaps |
|---|---|---|---|---|
| **Marcus Chen** | `marcus@example.com` | Tech & Electronics (Sony Headphones, Keychron) | San Francisco, CA | 14 Swaps |
| **Alex Turner** | `alex@example.com` | Software Engineering & Tech Books | New York, NY | 19 Swaps |
| **Sarah Jenkins** | `sarah@example.com` | Neuroscience & Medical Textbooks | Boston, MA | 18 Swaps |
| **Elena Rostova** | `elena@example.com` | Computer Science Graduate Scholar | Austin, TX | 35 Swaps |
| **David Miller** | `david@example.com` | Audio Engineer & Studio Gear | Seattle, WA | 6 Swaps |

---

## 🛠️ Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 3.4 with custom Stitch design system tokens
- **ORM**: Prisma 5.22
- **Database**: PostgreSQL 16
- **Auth**: JWT tokens + bcryptjs encryption
- **Icons**: Lucide React + Material Symbols
- **Containerization**: Docker + Docker Compose

---

## 📋 Available Scripts

```bash
npm run dev           # Start Next.js local development server
npm run build         # Compile production bundle and type-check
npm run start         # Start production server
npm run seed          # Seed PostgreSQL with test personas & listings
npm run lint          # Run ESLint validation
npx prisma studio     # Open Prisma visual database inspector
npx prisma db push    # Synchronize Prisma schema with PostgreSQL
```

---

## 🐳 Docker Deployment

To launch BarterHub along with an isolated PostgreSQL 16 instance via Docker:

```bash
docker-compose up --build -d
```

---

## 📄 License

Distributed under the **MIT License**.
