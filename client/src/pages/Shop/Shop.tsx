import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Bell,
  ChevronDown,
  Home,
  LayoutDashboard,
  Search,
  ShoppingBag,
  Sparkles,
  User,
} from "lucide-react";
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
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
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
  const userLabel = useMemo(() => {
    if (!user) return "";
    return (
      (user.user_metadata?.full_name as string | undefined) ??
      user.email?.split("@")[0] ??
      "User"
    );
  }, [user]);
  const avatarText = useMemo(
    () =>
      userLabel
        .split(" ")
        .filter(Boolean)
        .map((part) => part[0]?.toUpperCase() ?? "")
        .slice(0, 2)
        .join("") || "U",
    [userLabel]
  );

  return (
    <main className="shop-page">
      <header className="shop-navbar">
        <div className="shop-logo">LuxeMart Shop</div>
        <div className="shop-nav-actions">
          <button type="button" className="shop-icon-only-btn" aria-label="Search">
            <Search size={16} />
          </button>
          <button type="button" className="shop-icon-only-btn" aria-label="Alerts">
            <Bell size={16} />
          </button>
          <Link to="/" className="shop-icon-only-btn" aria-label="Home">
            <Home size={16} />
          </Link>
          {role === "admin" ? (
            <Link to="/admin" className="shop-icon-only-btn" aria-label="Admin Dashboard">
              <LayoutDashboard size={16} />
            </Link>
          ) : null}
          {user ? (
            <div className="shop-profile-menu-wrap">
              <button
                type="button"
                className="shop-avatar-btn"
                onClick={() => setIsProfileMenuOpen((previous) => !previous)}
              >
                <span className="shop-avatar-pill">{avatarText}</span>
                <ChevronDown size={14} />
              </button>

              {isProfileMenuOpen ? (
                <div className="shop-profile-menu">
                  <div className="shop-profile-menu-header">
                    <span>{userLabel}</span>
                    <small>{user.email}</small>
                  </div>
                  <Link
                    to="/profile"
                    className="shop-profile-menu-item"
                    onClick={() => setIsProfileMenuOpen(false)}
                  >
                    <User size={14} />
                    Profile
                  </Link>
                  {role === "admin" ? (
                    <Link
                      to="/admin"
                      className="shop-profile-menu-item"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      <LayoutDashboard size={14} />
                      Admin Dashboard
                    </Link>
                  ) : null}
                  <button
                    type="button"
                    className="shop-profile-menu-item"
                    onClick={async () => {
                      setIsProfileMenuOpen(false);
                      await handleSignOut();
                    }}
                  >
                    Sign Out
                  </button>
                </div>
              ) : null}
            </div>
          ) : (
            <Link to="/auth" className="shop-icon-only-btn" aria-label="Sign In">
              <User size={16} />
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
