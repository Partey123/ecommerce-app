import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Bell, LayoutDashboard, Search, ShoppingBag, Sparkles } from "lucide-react";
import { useAuth } from "../../features/auth/useAuth";
import { supabaseClient } from "../../lib/supabaseClient";
import "./Shop.css";

const featured = [
  {
    id: "a1",
    name: "Aurum Wristwatch",
    price: 3450,
    image:
      "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "a2",
    name: "Noir Leather Brief",
    price: 2280,
    image:
      "https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "a3",
    name: "Classic Loafers",
    price: 1310,
    image:
      "https://images.unsplash.com/photo-1614252369475-531eba835eb1?auto=format&fit=crop&w=1200&q=80",
  },
];

const Shop = () => {
  const { user } = useAuth();
  const currency = useMemo(
    () =>
      new Intl.NumberFormat("en-GH", {
        style: "currency",
        currency: "GHS",
        maximumFractionDigits: 0,
      }),
    []
  );

  const handleSignOut = async () => {
    await supabaseClient.auth.signOut();
  };
  const role =
    (user?.user_metadata?.role as string | undefined) ??
    (user?.app_metadata?.role as string | undefined) ??
    "user";

  return (
    <main className="shop-page">
      <header className="shop-navbar">
        <div className="shop-logo">LuxeMart Shop</div>
        <div className="shop-nav-center">
          <button type="button" className="shop-icon-btn">
            <Search size={16} />
            Search
          </button>
          <button type="button" className="shop-icon-btn">
            <Bell size={16} />
            Alerts
          </button>
        </div>
        <div className="shop-nav-actions">
          <Link to="/" className="shop-link-btn">
            Home
          </Link>
          {role === "admin" ? (
            <Link to="/admin" className="shop-link-btn">
              Admin
            </Link>
          ) : null}
          {user ? (
            <button type="button" className="shop-primary-btn" onClick={handleSignOut}>
              Sign Out
            </button>
          ) : (
            <Link to="/auth" className="shop-primary-btn">
              Sign In
            </Link>
          )}
        </div>
      </header>

      <section className="shop-hero-card">
        <p className="shop-kicker">
          <Sparkles size={14} /> Premium Commerce Dashboard
        </p>
        <h1>{user ? "Welcome back to your LuxeMart dashboard." : "Explore LuxeMart like a member."}</h1>
        <p>
          {user
            ? "Track your latest activity, discover new arrivals, and continue shopping with a personalized experience."
            : "Browse premium collections as a guest, then sign in to unlock saved carts, order tracking, and member-only drops."}
        </p>
        <div className="shop-hero-actions">
          <button type="button" className="shop-primary-btn">
            <ShoppingBag size={16} /> Start Shopping
          </button>
          {user ? (
            <button type="button" className="shop-link-btn">
              <LayoutDashboard size={16} /> Open My Dashboard
            </button>
          ) : (
            <Link to="/auth/signup" className="shop-link-btn">
              Create Account
            </Link>
          )}
        </div>
      </section>

      <section className="shop-stats-grid">
        <article>
          <span>Collections</span>
          <strong>42</strong>
        </article>
        <article>
          <span>New This Week</span>
          <strong>17</strong>
        </article>
        <article>
          <span>Avg Delivery</span>
          <strong>24h</strong>
        </article>
        <article>
          <span>Member Savings</span>
          <strong>Up to 18%</strong>
        </article>
      </section>

      <section className="shop-products-grid">
        {featured.map((product) => (
          <article key={product.id} className="shop-product-card">
            <img src={product.image} alt={product.name} />
            <div className="shop-product-meta">
              <h3>{product.name}</h3>
              <strong>{currency.format(product.price)}</strong>
              <button type="button" className="shop-primary-btn">
                Add to Cart
              </button>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
};

export default Shop;
