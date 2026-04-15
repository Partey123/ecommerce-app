import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Bell,
  ChevronDown,
  Home,
  LayoutDashboard,
  Search,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  User,
} from "lucide-react";
import { useAuth } from "../../features/auth/useAuth";
import { useProducts } from "../../features/products/useProducts";
import { useCart } from "../../hooks/useCart";
import { supabaseClient } from "../../lib/supabaseClient";
import { formatCurrency } from "../../utils/formatCurrency";
import "./Shop.css";

const Shop = () => {
  const { user } = useAuth();
  const { products, loading: productsLoading, error: productsError } = useProducts();
  const { items, refresh, addItem } = useCart();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const [addingProductId, setAddingProductId] = useState<string | null>(null);
  const profileMenuRef = useRef<HTMLDivElement | null>(null);
  const notificationsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!user) return;
    void refresh();
  }, [refresh, user]);

  useEffect(() => {
    if (!isSearchOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsSearchOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isSearchOpen]);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (profileMenuRef.current && !profileMenuRef.current.contains(target)) {
        setIsProfileMenuOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(target)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

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
  const cartCount = useMemo(
    () => items.reduce((total, item) => total + item.quantity, 0),
    [items]
  );
  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return products.slice(0, 12);
    return products.filter((product) => {
      const haystack = `${product.name} ${product.description ?? ""} ${product.slug}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [products, searchQuery]);

  const scrollToProducts = () => {
    document.getElementById("shop-products")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleAddToCart = async (productId: string) => {
    if (!user) {
      setAddError("Sign in to add products to cart.");
      return;
    }

    try {
      setAddError(null);
      setAddingProductId(productId);
      await addItem(productId, 1);
    } catch (error) {
      setAddError(error instanceof Error ? error.message : "Failed to add item");
    } finally {
      setAddingProductId(null);
    }
  };

  return (
    <main className="shop-page">
      {isSearchOpen ? (
        <div
          className="shop-modal-backdrop"
          role="presentation"
          onClick={() => setIsSearchOpen(false)}
        />
      ) : null}
      {isSearchOpen ? (
        <div className="shop-search-modal" role="dialog" aria-label="Search products">
          <div className="shop-search-modal-inner" onClick={(e) => e.stopPropagation()}>
            <label className="shop-search-label">
              <Search size={18} />
              <input
                type="search"
                autoFocus
                placeholder="Search by name or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </label>
            <ul className="shop-search-results">
              {searchResults.length === 0 ? (
                <li className="shop-search-empty">No products match your search.</li>
              ) : (
                searchResults.map((product) => (
                  <li key={product.id}>
                    <button
                      type="button"
                      className="shop-search-result-row"
                      onClick={() => {
                        setIsSearchOpen(false);
                        setSearchQuery("");
                        document.getElementById(`product-${product.id}`)?.scrollIntoView({ behavior: "smooth" });
                      }}
                    >
                      <span>{product.name}</span>
                      <span>{formatCurrency(Number(product.price_ghs))}</span>
                    </button>
                  </li>
                ))
              )}
            </ul>
            <button type="button" className="shop-search-close" onClick={() => setIsSearchOpen(false)}>
              Close
            </button>
          </div>
        </div>
      ) : null}

      <div className="shop-shell">
        <header className="shop-navbar">
          <div className="shop-logo-wrap">
            <div className="shop-logo-mark">L</div>
            <div className="shop-logo-copy">
              <strong>LuxeMart</strong>
              <span>Premium Storefront</span>
            </div>
          </div>
          <div className="shop-nav-actions">
            <button
              type="button"
              className="shop-icon-only-btn"
              aria-label="Search"
              aria-expanded={isSearchOpen}
              onClick={() => setIsSearchOpen((open) => !open)}
            >
              <Search size={16} />
            </button>
            <div className="shop-notifications-wrap" ref={notificationsRef}>
              <button
                type="button"
                className="shop-icon-only-btn"
                aria-label="Notifications"
                aria-expanded={isNotificationsOpen}
                onClick={() => setIsNotificationsOpen((open) => !open)}
              >
                <Bell size={16} />
              </button>
              {isNotificationsOpen ? (
                <div className="shop-notifications-panel" role="menu">
                  <p className="shop-notifications-title">Updates</p>
                  {cartCount > 0 ? (
                    <p className="shop-notifications-item">
                      You have {cartCount} item{cartCount === 1 ? "" : "s"} in your cart.{" "}
                      <Link to="/checkout" onClick={() => setIsNotificationsOpen(false)}>
                        Go to checkout
                      </Link>
                    </p>
                  ) : (
                    <p className="shop-notifications-item">Your cart is empty. Browse products below.</p>
                  )}
                  <p className="shop-notifications-item muted">
                    Tip: sign in to sync your cart and see order updates here.
                  </p>
                </div>
              ) : null}
            </div>
            <Link to="/checkout" className="shop-icon-only-btn shop-cart-btn" aria-label="Cart and checkout">
              <ShoppingCart size={16} />
              {cartCount > 0 ? <span className="shop-cart-count">{cartCount}</span> : null}
            </Link>
            <Link to="/" className="shop-icon-only-btn" aria-label="Home">
              <Home size={16} />
            </Link>
            {role === "admin" ? (
              <Link to="/admin" className="shop-icon-only-btn" aria-label="Admin Dashboard">
                <LayoutDashboard size={16} />
              </Link>
            ) : null}
            {user ? (
              <div className="shop-profile-menu-wrap" ref={profileMenuRef}>
                <button
                  type="button"
                  className="shop-avatar-btn"
                  aria-haspopup="menu"
                  aria-expanded={isProfileMenuOpen}
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
            <button type="button" className="shop-primary-btn" onClick={scrollToProducts}>
              <ShoppingBag size={16} /> Start Shopping
            </button>
            {user ? (
              <Link to="/profile" className="shop-link-btn">
                <LayoutDashboard size={16} /> Open My Dashboard
              </Link>
            ) : (
              <Link to="/auth/signup" className="shop-link-btn">
                Create Account
              </Link>
            )}
          </div>
        </section>

        <section className="shop-stats-grid">
          <article>
            <span>Active Products</span>
            <strong>{products.length}</strong>
          </article>
          <article>
            <span>In Cart</span>
            <strong>{cartCount}</strong>
          </article>
          <article>
            <span>Low Stock</span>
            <strong>{products.filter((product) => product.stock <= 5).length}</strong>
          </article>
          <article>
            <span>Avg Price</span>
            <strong>
              {products.length
                ? formatCurrency(
                    products.reduce((sum, product) => sum + Number(product.price_ghs), 0) / products.length
                  )
                : formatCurrency(0)}
            </strong>
          </article>
        </section>

        <section id="shop-products" className="shop-products-grid">
          {productsLoading ? <div className="shop-state-message">Loading products...</div> : null}
          {productsError ? <div className="shop-state-message shop-state-error">{productsError}</div> : null}
          {addError ? <div className="shop-state-message shop-state-error">{addError}</div> : null}
          {products.map((product) => (
            <article
              key={product.id}
              id={`product-${product.id}`}
              className="shop-product-card"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  void handleAddToCart(product.id);
                }
              }}
            >
              <img
                src={
                  product.images[0] ??
                  "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=1200&q=80"
                }
                alt={product.name}
              />
              <div className="shop-product-meta">
                <h3>{product.name}</h3>
                <strong>{formatCurrency(Number(product.price_ghs))}</strong>
                <button
                  type="button"
                  className="shop-primary-btn"
                  disabled={!user || addingProductId === product.id}
                  onClick={() => void handleAddToCart(product.id)}
                >
                  {addingProductId === product.id ? "Adding..." : "Add to Cart"}
                </button>
              </div>
            </article>
          ))}
          {!productsLoading && products.length === 0 ? (
            <div className="shop-state-message">No products available yet.</div>
          ) : null}
        </section>
      </div>
    </main>
  );
};

export default Shop;
