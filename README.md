# Luck Optical - Lenskart-Inspired Eyewear Shop

This is a premium, full-featured eyewear e-commerce web application tailored for local retail businesses. It is inspired by Lenskart's modern layout, offering high-fidelity filtering, custom lens prescription entries, WhatsApp quick chat options, and a comprehensive store operator Admin control panel.

---

## Directory Structure

```
/luckoptical.in
  ├── /backend       # Node.js + Express API server (port 5000)
  │    ├── /config       # Database connection setup
  │    ├── /middleware   # JWT Authentication & role verification
  │    ├── /models       # Mongoose schemas (User, Product, Category, Order)
  │    ├── /routes       # API Endpoints (auth, products, categories, orders, upload)
  │    ├── .env          # Server environment settings
  │    ├── seeder.js     # Mock frames & categories database seeder
  │    └── server.js     # Server entry point
  │
  └── /frontend      # Next.js App Router frontend with Tailwind CSS (port 3000)
       ├── /src
       │    ├── /components   # Shared UI (Header, Footer, CartDrawer, Cards)
       │    ├── /context      # State managers (AuthContext, CartContext)
       │    └── /app          # Pages (Home, PLP, PDP, Checkout, Profile, Orders, Admin)
       └── package.json
```

---

## Features Implemented

### Customer Experience (Frontend)
1. **Home Page**: Premium slider banners, interactive category cards, campaign highlights, featured trending glasses, and testimonials.
2. **Product Listing Page (PLP)**: Advanced sidebar filters (by category, shape, material, type, gender), product tags, sorting tools, and grid hover effects.
3. **Product Detail Page (PDP)**: Slide preview gallery, core frame specification charts, a WhatsApp stock inquiry button, and customized lens selections.
4. **Lens Prescription Modal**: Sphere (SPH), Cylinder (CYL), Axis, and Add details for left/right eyes, along with lens category choices (Zero Power, Single Vision, Progressive).
5. **Dynamic Cart Drawer**: Sliding overlay detail listing prescription badges, pricing breakdowns, and quantity updates.
6. **COD Checkout**: Multi-step checkout selecting saved shipping addresses, confirming Cash on Delivery (COD) payment, and showing a checkout success screen with confetti.
7. **Secure Auth**: Custom login and signup tabs (secures passwords via bcrypt).
8. **Customer Profiles**: Address book editor (add/edit/delete shipping addresses) and account updates.
9. **Order History**: Personal order card detailing status flags (Pending, Shipped, Delivered) and lens prescription logs.

### Admin Operations (Control Panel)
1. **Overview Dashboard**: Quick statistics on revenue, orders, active frames, pending reviews, and automatic low-stock alerts (stock <= 5).
2. **Product Manager**: Grid listing of catalog products, quick inline stock update input, frame deleting, and add/edit forms featuring direct file uploads.
3. **Category Editor**: Categorize collections and upload banner images.
4. **Order Control Desk**: View complete customer details (phone, email, shipping address), extract exact prescription powers, change order tracking milestones, and connect via WhatsApp.

---

## Quick Start Guide

### Prerequisites
- Node.js (v18+)
- MongoDB running locally (`mongodb://127.0.0.1:27017/lenskart_clone`) or a MongoDB Atlas cloud URI.

### 1. Backend Server Setup
1. Open a terminal in `/backend` folder.
2. Configure your environment values in `/backend/.env`.
3. Start the dev server:
   ```bash
   npm run dev
   ```
4. **Seed Mock Data** (To instantly fill your storefront with trending glasses and categories):
   ```bash
   npm run seed
   ```
   *Note: Ensure your MongoDB local daemon or cloud cluster is running before executing seed.*

### 2. Frontend Web App Setup
1. Open a terminal in `/frontend` folder.
2. Start the dev server:
   ```bash
   npm run dev
   ```
3. Open your browser and visit: [http://localhost:3000](http://localhost:3000).

---

## Technical Highlights
- **Direct ImageKit Uploads**: The product manager contacts the backend `/api/upload/auth` endpoint to retrieve a secure HMAC signature. It then uploads files directly from the browser to ImageKit, eliminating server-side binary overhead.
- **Role Verification**: Admin routes and endpoints are protected by verification middlewares checking JWT signatures and user roles (`admin`).
- **Responsive Layout**: Designed for optimal rendering across smartphones, tablets, and wide screens.
