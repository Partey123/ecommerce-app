# LuxeMart — Full App Audit Report
**Stack:** React 19 · TypeScript · Vite · Supabase · Express · Paystack · Resend  
**Architecture:** Monorepo (client / server / shared workspaces)  
**Audited:** April 14, 2026

---

## Summary

The project has a **well-designed skeleton** — solid database schema, good RLS policies, clean monorepo layout, and a working auth flow. However, the **entire server layer is scaffolded but unimplemented** (every file exports `{ ready: true }`), and the **entire client feature layer is also stubbed** (cart, hooks, utils, all admin feature hooks, all types). The app is roughly 30–35% built. The audit below documents every gap and ranks them so you can work through them systematically.

---

## Phase 1 — Critical: App is Broken / Non-functional

These are blockers. The app cannot serve its core purpose until all of these are done.

### Server — Everything is a stub

- [ ] **`server/src/config/env.ts` exports `{ ready: true }`** — No env var loading at all. Must read `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `PAYSTACK_SECRET_KEY`, `PAYSTACK_WEBHOOK_SECRET`, `RESEND_API_KEY`, `CLIENT_URL`, `PORT` from `process.env` with validation and early failure.
- [ ] **`server/src/config/supabase.ts` exports `{ ready: true }`** — No Supabase admin client. Must create a `createClient(url, serviceRoleKey)` instance with service role for server-side operations.
- [ ] **`server/src/config/resend.ts` exports `{ ready: true }`** — No Resend client initialised.
- [ ] **`server/src/middleware/authMiddleware.ts` exports `{ ready: true }`** — No JWT verification. Must extract `Authorization: Bearer <token>` from request headers and verify it against Supabase. Any protected route currently has zero auth.
- [ ] **`server/src/middleware/adminMiddleware.ts` exports `{ ready: true }`** — No admin role check. Any user who somehow gets past authMiddleware could hit admin routes.
- [ ] **`server/src/middleware/errorHandler.ts` exports `{ ready: true }`** — No error handling. Unhandled exceptions will crash the process or leak stack traces to clients.
- [ ] **`server/src/middleware/validateWebhook.ts` exports `{ ready: true }`** — No Paystack webhook signature validation (HMAC-SHA512). This is a security hole — anyone can POST to the webhook endpoint and fake payment confirmations.
- [ ] **All 6 route files export `{ ready: true }`** — No routes are registered on the Express app. The app only has a `/health` endpoint.
- [ ] **All 6 controller files export `{ ready: true }`** — No business logic at all.
- [ ] **All 4 service files export `{ ready: true }`** — `cart.service`, `email.service`, `order.service`, `payment.service` are all empty.
- [ ] **All 5 model files export `{ ready: true }`** — No data access layer exists.
- [ ] **`server/src/app.ts` never mounts any routes** — `app.use(cors())` is wildcard — it accepts requests from any origin. Must be locked to `CLIENT_URL` in production.
- [ ] **Express `dependencies` are missing from `server/package.json`** — `express`, `cors`, `@supabase/supabase-js`, `paystack`, `resend` are NOT listed as runtime dependencies. They're currently absent entirely, meaning `npm install` in production will fail.

### Client — Feature layer is all stubs

- [ ] **`cartStore.ts`, `cartTypes.ts`, `cartUtils.ts` all export `{ ready: true }`** — No cart state exists. The "Add to Cart" buttons in `Shop.tsx` do nothing.
- [ ] **`useCart.ts`, `usePaystack.ts`, `useUser.ts` all export `{ ready: true }`** — These hooks are imported nowhere yet, but they need to exist before any cart or payment UI can function.
- [ ] **`useProducts.ts`, `productTypes.ts` export `{ ready: true }`** — Products on the Shop page are hardcoded static arrays, not fetched from Supabase.
- [ ] **`useOrders.ts`, `orderTypes.ts` export `{ ready: true }`** — No order fetching or display.
- [ ] **`formatCurrency.ts`, `helpers.ts` export `{ ready: true }`** — `Shop.tsx` manually inlines `Intl.NumberFormat` instead of using a shared util. Duplicated in multiple places.
- [ ] **All 4 admin feature hooks export `{ ready: true }`** — `useAdminOrders`, `useAdminProducts`, `useAdminStats`, `useAdminUsers` are stubs. The entire admin dashboard runs off `adminData.ts` hardcoded mock data.
- [ ] **`adminTypes.ts` exports `{ ready: true }`** — No types for admin API responses.
- [ ] **`shared/types/` has 5 files, all empty (44–48 bytes)** — `Cart.ts`, `Category.ts`, `Order.ts`, `Product.ts`, `User.ts` under `shared/types/` are stubs. Only `shared/src/index.ts` has 2 bare interfaces.

---

## Phase 2 — Security & Data Integrity

These must be fixed before the app is exposed to real users or real money.

### Webhook — Fake payment attacks possible

- [ ] **Paystack webhook not verified** — `validateWebhook` middleware is a stub. Without HMAC-SHA512 verification of the `x-paystack-signature` header, any bad actor can POST a `charge.success` event and trigger order fulfilment without paying.

### Role assignment — Admin escalation via client metadata

- [ ] **`handle_new_user()` SQL trigger reads `raw_user_meta_data ->> 'role'`** — The trigger that auto-creates a `profiles` row reads the `role` from the user's signup metadata and persists it. A user can call `supabase.auth.signUp({ options: { data: { role: 'admin' } } })` and get admin access. The trigger must ignore the `role` field from `raw_user_meta_data` entirely and always default to `'user'`. Admins should be promoted manually or via a separate trusted mechanism.
- [ ] **`AdminRoute.tsx` reads role from `user_metadata`** — Client-side admin guard trusts `user.user_metadata.role`. Since metadata is user-editable, this guard can be bypassed in the browser. Admin role must always be read from `app_metadata` (set only server-side) or fetched from the `profiles` table.
- [ ] **`Shop.tsx`, `Profile.tsx`, `App.tsx` all read role from `user_metadata` first** — Same problem as above, spread across 3 files.

### Database — Missing RLS policies

- [ ] **`order_items` has no insert policy for users** — Users can read their order items but there's no policy allowing them to be inserted. Order creation will fail at the DB level.
- [ ] **`payment_transactions` has no insert or update policy** — Only `SELECT` for users and no admin write policy. Server-side (service role) bypasses RLS, but this is worth making explicit for auditability.
- [ ] **`orders` has no delete policy** — Fine for now, but should be documented as intentional.
- [ ] **`profiles` has no admin read policy** — Admins cannot query all profiles. The admin user list in the dashboard will fail when wired up.
- [ ] **No index on `payment_transactions.status`** — Useful for querying pending transactions at reconciliation time.

### CORS — Wildcard in production

- [ ] **`app.use(cors())` with no options** — Accepts cross-origin requests from any domain. Must be `cors({ origin: env.CLIENT_URL, credentials: true })`.

### Verification flow — OTP length mismatch

- [ ] **`Verification.tsx` uses `OTP_LENGTH = 8`** — Supabase email OTPs are 6 digits by default. An 8-slot input will never auto-submit correctly unless you've explicitly changed Supabase's OTP length in the dashboard. The UI copy says "6-digit" in `AuthPage.tsx` but the component renders 8 boxes. Decide and align.
- [ ] **Reset password redirect sends user to `/auth/signin`** — After a password reset the user should land on a "set new password" page, not back at signin. Supabase's reset flow sends the user to the `redirectTo` URL with a token in the URL hash that must be consumed with `supabase.auth.updateUser`. This page doesn't exist.

---

## Phase 3 — Missing Features / Broken UX

Core user journeys that exist in the UI but don't work end-to-end.

### Shop page — No real data, no cart

- [ ] **Products are hardcoded in `Shop.tsx`** — `featured` array is static. Must be replaced with `useProducts()` fetching from Supabase `products` table filtered by `is_active = true`.
- [ ] **"Add to Cart" button does nothing** — No `onClick`, no cart state, no feedback. Must wire up `useCart()` → `cartStore`.
- [ ] **No cart sidebar or cart count indicator** — Users have no way to see what's in their cart or proceed to checkout.
- [ ] **Stats grid shows hardcoded numbers** — "42 collections", "17 new this week", "24h delivery" are static. Either fetch real counts or remove them.
- [ ] **Search button does nothing** — `Search` icon button has no handler, no modal, no routing.
- [ ] **Bell (notifications) button does nothing** — No notification system exists.

### Admin panel — All mock data

- [ ] **`Overview.tsx` shows hardcoded revenue / order / user counts** — Must wire up `useAdminStats()` fetching from Supabase.
- [ ] **`ProductList.tsx` shows `adminProducts` mock array** — Must fetch real products via `useAdminProducts()`.
- [ ] **`OrderList.tsx` shows `adminOrders` mock array** — Must fetch real orders via `useAdminOrders()`.
- [ ] **`UserList.tsx` shows `adminUsers` mock array** — Must fetch real users via `useAdminUsers()`.
- [ ] **`OrderDetails.tsx` always shows `adminOrders[0]`** — Ignores the `:id` URL param. Must use `useParams()` and fetch the specific order.
- [ ] **`UserDetails.tsx` always shows `adminUsers[0]`** — Same problem. Must use `useParams()`.
- [ ] **`EditProduct.tsx` always edits `adminProducts[0]`** — Must use `useParams()` to get the product ID and fetch it from Supabase.
- [ ] **`AddProduct.tsx` "Save Product" button does nothing** — `type="button"` prevents form submission, and there's no handler. Must call the API.
- [ ] **`EditProduct.tsx` "Update Product" button does nothing** — Same.
- [ ] **`StoreSettings.tsx` "Save Settings" button does nothing** — Same.
- [ ] **`CategoryManager.tsx` can only display, not create/edit/delete categories** — `useState(adminCategories)` is local and not persisted. Create/edit/delete controls are absent.
- [ ] **`SalesChart.tsx` uses hardcoded bar data** — Not connected to real orders.

### Profile page — Read-only, no edit

- [ ] **No way to update display name, avatar, or phone** — Profile page is purely display. Must add an edit form calling `supabase.auth.updateUser` and updating the `profiles` table.
- [ ] **No order history on profile page** — Users cannot see their past orders anywhere in the client.

### Checkout / Payment — Not implemented

- [ ] **No checkout page exists** — The user journey from cart → address → payment → confirmation is completely absent.
- [ ] **`usePaystack.ts` is a stub** — No Paystack popup integration, no `initialize` call, no callback handling.
- [ ] **No order creation flow** — Nothing calls the order creation endpoint.
- [ ] **No post-payment confirmation page** — After Paystack redirect there's nowhere to land.

---

## Phase 4 — Code Health & Architecture

Things that work but are fragile or will cause pain at scale.

### Role logic duplicated across 5+ files

- [ ] **`getRole()` logic is copy-pasted in `App.tsx`, `AdminRoute.tsx`, `Shop.tsx`, `Profile.tsx`, `Verification.tsx`** — Extract a single `useRole()` hook or a `getRoleFromUser(user)` utility in `src/lib/`. One change needed in one place if the logic ever changes.

### `adminData.ts` is acting as a fake database

- [ ] **`adminData.ts` exports real-looking types alongside mock data** — The types (`AdminProduct`, `AdminOrder`, `AdminUser`) should live in `features/admin/adminTypes.ts`. Mock data should be in a `__mocks__` folder and never imported by page components.

### No loading or error states in admin pages

- [ ] **Every admin page renders instantly from mock data** — Once real async hooks are wired in, there are no `<Skeleton />`, loading spinners, or error boundaries. All pages need loading and error states before wiring up real data.

### `shared` workspace is barely used

- [ ] **`shared/src/index.ts` has only 2 partial interfaces** — `Product` doesn't include `slug`, `images`, `is_active`, `category_id`. `User` is missing `full_name`, `avatar_url`, `phone`. These don't match the DB schema. The shared package exists but isn't being leveraged.
- [ ] **`shared/types/*.ts` files are all stubs** — Same `{ ready: true }` pattern. These were probably meant to be the canonical type definitions used by both client and server.

### `server/src/utils/paystackHelpers.ts` is a stub

- [ ] **Exports `{ ready: true }`** — Paystack signature verification helper is missing.

### Email templates need review

- [ ] **`orderConfirmation.tsx`, `passwordReset.tsx`, `welcomeEmail.tsx` render JSX** — These look like React Email templates, but `react-email` is not listed as a dependency anywhere. They'll fail to render.

### No input validation on server routes

- [ ] **When routes are implemented**, there's no validation library (like `zod`) present in server dependencies. All request bodies should be validated before hitting business logic.

### `server` package.json missing runtime deps

- [ ] **`express`, `cors`, `@supabase/supabase-js`, `resend` not in `dependencies`** — They appear to be assumed present globally or via workspace hoisting. `npm install --workspace server` in a clean environment will break.

---

## Phase 5 — UX & Accessibility

- [ ] **Admin route guard shows a plain `<div>` during load** — "Loading admin area..." has no styling. Use a proper skeleton or spinner.
- [ ] **`DashboardRoute` and `HomeRoute` also show unstyled loading divs** — Consistent loading treatment needed across the app.
- [ ] **Profile page has no loading skeleton** — Shows "Loading profile..." as plain text.
- [ ] **No `<title>` tags on any page** — Browser tab always shows the default Vite title.
- [ ] **No 404 page** — The catch-all `*` route redirects to `/` instead of showing a friendly 404.
- [ ] **`NotFound.tsx` exists but is never used** — The wildcard route should render `<NotFound />` not redirect.
- [ ] **Shop product cards have no keyboard navigation** — "Add to Cart" buttons aren't focusable in a meaningful sequence.
- [ ] **Shop profile menu has no close-on-outside-click handler** — The dropdown stays open if the user clicks elsewhere.
- [ ] **No empty state UI** — When product lists or order lists are empty, nothing tells the user.
- [ ] **Auth form has no password strength indicator** — No minimum length enforced client-side (Supabase default is 6 chars, which is weak).
- [ ] **`SalesChart.tsx` is not a real chart** — It's hand-drawn `<div>` bars with hardcoded heights. No axis labels, no values, no tooltips. Should use `recharts` or similar.

---

## Phase 6 — Tech Debt & Nice-to-Haves

- [ ] **`react.svg` and `vite.svg` in `src/assets/`** — Leftover from `create-vite` scaffold. Not used anywhere. Delete.
- [ ] **`hero.png` (44KB)** — Used only in `landing/` styles. Should be converted to WebP and served via a CDN rather than bundled.
- [ ] **`framer-motion` is a large dep used in one place** — Only `AuthPage.tsx` uses it for a simple fade-in. Consider replacing with a CSS transition to save ~100KB.
- [ ] **No `react-query` / `tanstack-query`** — All data fetching will need manual loading/error/refetch state management. Adding TanStack Query early saves a lot of boilerplate.
- [ ] **`lucide-react@1.8.0`** — This version is pinned unusually high (latest stable as of April 2026 is around 0.4xx). Verify this resolves correctly and isn't a version typo.
- [ ] **No test setup** — No Vitest, no Testing Library, no Playwright. At minimum add unit tests for `getRoleFromUser()` and the Paystack HMAC helper before those go live.
- [ ] **No CI pipeline** — No GitHub Actions or similar to run `lint` and `build` on PRs.
- [ ] **`README.md` is the default Create React App readme** — Replace with actual project setup instructions covering the Supabase migration, env vars, and workspace commands.
- [ ] **Monorepo `package.json` has empty `author` field** — Minor, but worth filling in.

---

## Fix Order Summary

| Phase | Area | Items | Priority |
|---|---|---|---|
| 1 | Server stubs, client stubs | 30+ | 🔴 Do first |
| 2 | Auth escalation, webhook, RLS gaps | 10 | 🔴 Before any real traffic |
| 3 | Missing features (cart, checkout, real data) | 20+ | 🟡 Core product |
| 4 | Code health (duplication, types, deps) | 10 | 🟡 While building phase 3 |
| 5 | UX / accessibility | 10 | 🟡 Alongside phase 3 |
| 6 | Tech debt / nice-to-haves | 10 | 🟢 As time allows |

---

*Report generated by automated codebase audit — April 14, 2026*
