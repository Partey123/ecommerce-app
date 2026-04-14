# eCommerce App — Final Folder Structure
**Stack: React + Vite + TypeScript + Node.js + Express**
**Integrations: Supabase (DB + Auth) | Paystack (Payment) | Resend (Email)**

---

## Root

```
ecommerce-app/
│
├── client/               # Frontend (React + Vite + TypeScript)
├── server/               # Backend (Node.js + Express + TypeScript)
├── shared/               # Shared types used by both client and server
├── .env                  # Root env (optional, or keep per-folder)
├── .gitignore
├── README.md
└── package.json
```

---

## Frontend — `client/`

```
client/
│
├── public/
│
├── src/
│   │
│   ├── assets/                  # Images, icons, fonts
│   │
│   ├── components/
│   │   ├── common/              # Button, Input, Loader, Modal
│   │   ├── layout/              # Navbar, Footer, Sidebar
│   │   ├── product/             # ProductCard, ProductGrid, ProductBadge
│   │   └── admin/               # Admin-only UI components
│   │       ├── AdminSidebar.tsx       # Navigation links for all admin sections
│   │       ├── AdminTopbar.tsx        # Admin header with user info + logout
│   │       ├── StatsCard.tsx          # Revenue / orders / users summary cards
│   │       ├── DataTable.tsx          # Reusable sortable table for lists
│   │       ├── StatusBadge.tsx        # Order status pill (Paid, Shipped etc.)
│   │       └── ConfirmModal.tsx       # Delete confirmation dialog
│   │
│   ├── pages/
│   │   ├── Home/
│   │   ├── Products/
│   │   ├── ProductDetails/
│   │   ├── Cart/
│   │   ├── Checkout/            # Paystack payment trigger lives here
│   │   ├── Orders/              # Order history and status
│   │   ├── Auth/
│   │   │   ├── Login.tsx        # Supabase Auth — email/password + OAuth
│   │   │   ├── Register.tsx
│   │   │   └── ResetPassword.tsx
│   │   ├── Admin/               # Admin dashboard — role-gated
│   │   │   ├── AdminLayout.tsx  # Sidebar + topbar shell for all admin pages
│   │   │   ├── Overview.tsx     # Stats: revenue, orders, users, top products
│   │   │   ├── Products/
│   │   │   │   ├── ProductList.tsx    # Table of all products + search/filter
│   │   │   │   ├── AddProduct.tsx     # Create new product form
│   │   │   │   └── EditProduct.tsx    # Edit existing product
│   │   │   ├── Orders/
│   │   │   │   ├── OrderList.tsx      # All orders with status filters
│   │   │   │   └── OrderDetails.tsx   # Single order view + status update
│   │   │   ├── Users/
│   │   │   │   ├── UserList.tsx       # All registered users
│   │   │   │   └── UserDetails.tsx    # User profile + order history
│   │   │   ├── Categories/
│   │   │   │   └── CategoryManager.tsx # Add, edit, delete categories
│   │   │   ├── Analytics/
│   │   │   │   └── SalesChart.tsx     # Revenue over time, top sellers
│   │   │   └── Settings/
│   │   │       └── StoreSettings.tsx  # Store name, currency, contact info
│   │   └── NotFound.tsx
│   │
│   ├── features/
│   │   ├── auth/
│   │   │   ├── authContext.tsx   # Supabase session + user state
│   │   │   ├── useAuth.ts
│   │   │   └── authTypes.ts
│   │   ├── cart/
│   │   │   ├── cartStore.ts      # Zustand store (guest + logged-in cart)
│   │   │   ├── cartUtils.ts      # Guest cart (localStorage) helpers
│   │   │   └── cartTypes.ts
│   │   ├── products/
│   │   │   ├── useProducts.ts
│   │   │   └── productTypes.ts
│   │   ├── orders/
│   │   │   ├── useOrders.ts
│   │   │   └── orderTypes.ts
│   │   └── admin/
│   │       ├── useAdminStats.ts       # Fetch overview stats (revenue, counts)
│   │       ├── useAdminProducts.ts    # CRUD operations for products
│   │       ├── useAdminOrders.ts      # Fetch all orders, update status
│   │       ├── useAdminUsers.ts       # Fetch and manage users
│   │       └── adminTypes.ts          # Admin-specific TS types
│   │
│   ├── hooks/
│   │   ├── useCart.ts
│   │   ├── useUser.ts
│   │   └── usePaystack.ts       # Paystack popup hook
│   │
│   ├── services/                # All API calls to your backend
│   │   ├── api.ts               # Axios base config
│   │   ├── productService.ts
│   │   ├── cartService.ts
│   │   ├── orderService.ts
│   │   ├── paymentService.ts    # Initiates Paystack payment via backend
│   │   └── adminService.ts      # All admin API calls (stats, CRUD, user mgmt)
│   │
│   ├── lib/
│   │   └── supabaseClient.ts    # Supabase client instance (frontend)
│   │
│   ├── utils/
│   │   ├── formatCurrency.ts    # Format GHS prices
│   │   └── helpers.ts
│   │
│   ├── types/                   # Frontend-only TS types
│   │
│   ├── routes/
│   │   ├── AppRouter.tsx        # React Router config + protected routes
│   │   └── AdminRoute.tsx       # Role guard — blocks non-admin users
│   │
│   ├── App.tsx
│   ├── main.tsx
│   └── vite-env.d.ts
│
├── .env                         # VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY
├── tsconfig.json
├── vite.config.ts
└── package.json
```

---

## Backend — `server/`

```
server/
│
├── src/
│   │
│   ├── config/
│   │   ├── supabase.ts          # Supabase admin client (service role key)
│   │   ├── resend.ts            # Resend client instance
│   │   └── env.ts               # Validated env variables
│   │
│   ├── controllers/
│   │   ├── auth.controller.ts   # Handles auth events (post-signup hooks etc.)
│   │   ├── product.controller.ts
│   │   ├── cart.controller.ts
│   │   ├── order.controller.ts
│   │   ├── payment.controller.ts # Paystack initialize + webhook
│   │   └── admin.controller.ts  # Admin-only: stats, user role changes, bulk ops
│   │
│   ├── models/                  # Mirrors your Supabase table structure
│   │   ├── User.ts
│   │   ├── Product.ts
│   │   ├── Category.ts
│   │   ├── Cart.ts              # Cart model (for logged-in cart sync)
│   │   └── Order.ts
│   │
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── product.routes.ts
│   │   ├── cart.routes.ts
│   │   ├── order.routes.ts
│   │   ├── payment.routes.ts    # POST /payment/initialize, POST /payment/webhook
│   │   └── admin.routes.ts      # All /admin/* endpoints — double-guarded
│   │
│   ├── middleware/
│   │   ├── authMiddleware.ts    # Verify Supabase JWT on protected routes
│   │   ├── adminMiddleware.ts   # Check user role === 'admin' after auth
│   │   ├── errorHandler.ts
│   │   └── validateWebhook.ts  # Verify Paystack webhook signature
│   │
│   ├── services/
│   │   ├── payment.service.ts  # Paystack API — initialize, verify transaction
│   │   ├── email.service.ts    # Resend — send order, welcome, reset emails
│   │   ├── cart.service.ts     # Cart sync logic (guest → logged-in)
│   │   └── order.service.ts    # Order creation after payment verified
│   │
│   ├── templates/              # Email templates (React Email or plain HTML)
│   │   ├── orderConfirmation.tsx
│   │   ├── welcomeEmail.tsx
│   │   └── passwordReset.tsx
│   │
│   ├── utils/
│   │   ├── paystackHelpers.ts  # HMAC signature check for webhooks
│   │   └── helpers.ts
│   │
│   ├── types/
│   │   └── express.d.ts        # Extend Express Request with user type
│   │
│   ├── app.ts                  # Express app — middleware, routes
│   └── server.ts               # Entry point
│
├── .env                        # SUPABASE_URL, SUPABASE_SERVICE_KEY,
│                               # PAYSTACK_SECRET_KEY, RESEND_API_KEY
├── tsconfig.json
└── package.json
```

---

## Shared — `shared/`

```
shared/
│
├── types/
│   ├── User.ts
│   ├── Product.ts
│   ├── Category.ts
│   ├── Cart.ts        # Shared cart type (guest + synced)
│   └── Order.ts
│
└── constants/
    ├── orderStatus.ts  # PENDING | PAID | SHIPPED | DELIVERED
    └── paymentStatus.ts
```

---

## Integration Summary

| Service     | Where It Lives                                      | What It Does                                      |
|-------------|-----------------------------------------------------|---------------------------------------------------|
| Supabase DB | `server/config/supabase.ts` + all models            | PostgreSQL database for all app data              |
| Supabase Auth | `client/lib/supabaseClient.ts` + authMiddleware   | User sessions, JWT, OAuth                         |
| Paystack    | `server/services/payment.service.ts` + webhook route | Payment init, verification, webhook handling     |
| Resend      | `server/services/email.service.ts` + templates      | Order confirmation, welcome, password reset emails |

---

## Key Environment Variables

```env
# client/.env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=

# server/.env
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
PAYSTACK_SECRET_KEY=
PAYSTACK_WEBHOOK_SECRET=
RESEND_API_KEY=
CLIENT_URL=
PORT=5000
```

---

## Payment Flow (Paystack)

```
User clicks "Pay"
→ client calls POST /payment/initialize (backend)
→ backend calls Paystack API → returns payment URL
→ client redirects user to Paystack checkout
→ Paystack calls POST /payment/webhook (backend)
→ backend verifies HMAC signature
→ backend confirms payment → creates Order in Supabase
→ backend triggers Resend → sends order confirmation email
→ client polls order status → shows success page
```

---

## Email Triggers (Resend)

| Event              | Template                  |
|--------------------|---------------------------|
| User registers     | `welcomeEmail.tsx`        |
| Order paid         | `orderConfirmation.tsx`   |
| Password reset     | `passwordReset.tsx`       |
| Order shipped      | Add `shippingUpdate.tsx`  |

---

## Admin Dashboard

```
client/src/pages/Admin/
│
├── AdminLayout.tsx        # Persistent shell — sidebar + topbar
├── Overview.tsx           # KPI cards: revenue, orders, users, top products
│
├── Products/
│   ├── ProductList.tsx    # Searchable table of all products
│   ├── AddProduct.tsx     # Form: name, price, category, images, stock
│   └── EditProduct.tsx    # Same form pre-filled for updates
│
├── Orders/
│   ├── OrderList.tsx      # All orders — filter by status, date range
│   └── OrderDetails.tsx   # Single order — update status, view items + payment
│
├── Users/
│   ├── UserList.tsx       # All registered users + search
│   └── UserDetails.tsx    # User info, order history, role management
│
├── Categories/
│   └── CategoryManager.tsx # Add, rename, delete product categories
│
├── Analytics/
│   └── SalesChart.tsx     # Revenue chart, best selling products, order trends
│
└── Settings/
    └── StoreSettings.tsx  # Store name, contact, currency, shipping info
```

---

## Admin Access Control

**How it works — two layers of protection:**

```
User visits /admin/*
→ AdminRoute.tsx checks if user is authenticated (Supabase session)
→ AdminRoute.tsx checks if user.role === 'admin' (from Supabase user_metadata)
→ If not admin → redirect to /403 or home

API call hits /admin/* backend route
→ authMiddleware.ts verifies JWT
→ adminMiddleware.ts checks role claim in JWT payload
→ If role !== 'admin' → 403 Forbidden
```

**Setting admin role in Supabase:**

You assign roles directly from the Supabase dashboard or via the service role key in your backend. Never let the frontend set its own role.

```ts
// server — promote a user to admin (service role only)
await supabaseAdmin.auth.admin.updateUserById(userId, {
  user_metadata: { role: 'admin' }
})
```

---

## Admin API Endpoints

| Method | Endpoint                        | What It Does                    |
|--------|---------------------------------|---------------------------------|
| GET    | /admin/stats                    | Revenue, order and user counts  |
| GET    | /admin/products                 | All products with stock levels  |
| POST   | /admin/products                 | Create a new product            |
| PUT    | /admin/products/:id             | Update product details          |
| DELETE | /admin/products/:id             | Delete a product                |
| GET    | /admin/orders                   | All orders with filters         |
| PUT    | /admin/orders/:id/status        | Update order status             |
| GET    | /admin/users                    | All users                       |
| PUT    | /admin/users/:id/role           | Promote or demote a user        |
| GET    | /admin/categories               | All categories                  |
| POST   | /admin/categories               | Create a category               |
| DELETE | /admin/categories/:id           | Delete a category               |
