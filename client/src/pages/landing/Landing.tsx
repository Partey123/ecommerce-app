import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Headset,
  ShieldCheck,
  ShoppingBag,
  Truck,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import "./Landing.css";
import { useAuth } from "../../features/auth/useAuth";
import { supabaseClient } from "../../lib/supabaseClient";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const products = [
  { id: 1, name: "Italian Leather Weekender", price: 3490, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80", large: true },
  { id: 2, name: "Signature Timepiece", price: 5290, image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=1200&q=80" },
  { id: 3, name: "Artisan Scent Collection", price: 880, image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=1200&q=80" },
  { id: 4, name: "Minimalist Loafers", price: 1240, image: "https://images.unsplash.com/photo-1614252369475-531eba835eb1?auto=format&fit=crop&w=1200&q=80", wide: true },
  { id: 5, name: "Crystal Glassware Set", price: 960, image: "https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?auto=format&fit=crop&w=1200&q=80" },
];

const Landing = () => {
  const { user } = useAuth();
  const [cartCount, setCartCount] = useState(0);
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

  return (
    <main className="landing-page">
      <header className="landing-nav">
        <div className="landing-brand">LuxeMart</div>
        <nav className="landing-links">
          <a href="#featured">Featured</a>
          <a href="#benefits">Why LuxeMart</a>
          <a href="#newsletter">Newsletter</a>
        </nav>
        <div className="landing-nav-actions">
          {user ? (
            <button type="button" className="landing-auth-link landing-auth-btn" onClick={handleSignOut}>
              Sign Out
            </button>
          ) : (
            <Link to="/auth" className="landing-auth-link">
              Sign In
            </Link>
          )}
          <button className="landing-cart-btn" aria-label="Shopping cart">
            <ShoppingBag size={18} />
            <span className="landing-cart-badge">{cartCount}</span>
          </button>
        </div>
      </header>

      <section className="landing-hero" id="top">
        <motion.p
          className="landing-kicker"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.45 }}
        >
          Curated Luxury Essentials
        </motion.p>

        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.55, delay: 0.05 }}
        >
          Elevate Your <em>Lifestyle</em>
        </motion.h1>

        <motion.p
          className="landing-subtitle"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.55, delay: 0.1 }}
        >
          Discover refined pieces designed for modern living, selected from
          world-class makers with the quality you can feel.
        </motion.p>

        <motion.div
          className="landing-cta-row"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <Link className="landing-pill-btn landing-pill-btn-primary" to="/shop">
            Shop Now
          </Link>
          <a className="landing-pill-btn landing-pill-btn-secondary" href="#categories">
            Explore Categories
          </a>
        </motion.div>
      </section>

      <section className="landing-value-grid" id="benefits">
        <article className="landing-value-card">
          <Truck size={20} />
          <h4>Fast Shipping</h4>
          <p>Doorstep delivery in record time, beautifully packaged.</p>
        </article>
        <article className="landing-value-card">
          <ShieldCheck size={20} />
          <h4>Secure Payment</h4>
          <p>Bank-level encryption for every card and wallet transaction.</p>
        </article>
        <article className="landing-value-card">
          <Headset size={20} />
          <h4>Instant Support</h4>
          <p>Concierge-level help available when you need it most.</p>
        </article>
        <article className="landing-value-card">
          <ShoppingBag size={20} />
          <h4>Premium Quality</h4>
          <p>Each product is vetted for craftsmanship and longevity.</p>
        </article>
      </section>

      <section className="landing-products" id="featured">
        <div className="landing-products-header">
          <h2>Featured Products</h2>
          <a href="#top">
            View All <ArrowRight size={16} />
          </a>
        </div>
        <div className="landing-products-grid" id="categories">
          {products.map((product) => (
            <article
              key={product.id}
              className={`landing-product-card ${product.large ? "large" : ""} ${product.wide ? "wide" : ""}`}
            >
              <div className="landing-product-image-wrap">
                <img src={product.image} alt={product.name} className="landing-product-image" />
              </div>
              <div className="landing-product-meta">
                <h3>{product.name}</h3>
                <strong>{currency.format(product.price)}</strong>
                <button
                  type="button"
                  className="landing-pill-btn landing-pill-btn-primary"
                  onClick={() => setCartCount((count) => count + 1)}
                >
                  Add to Cart
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="landing-newsletter" id="newsletter">
        <div className="landing-newsletter-content">
          <h2>Join the Luxe Circle</h2>
          <p>
            Get first access to limited collections, private offers, and editor
            picks curated for your lifestyle.
          </p>
          <div className="landing-newsletter-actions">
            <input type="email" placeholder="Enter your email" />
            <button className="landing-pill-btn landing-pill-btn-primary">
              Sign Up Now
            </button>
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <div>
          <h4>LuxeMart</h4>
          <p>Luxury essentials. Timeless quality.</p>
        </div>
        <div>
          <h5>Shop</h5>
          <a href="#featured">New Arrivals</a>
          <a href="#featured">Top Rated</a>
          <a href="#featured">Collections</a>
        </div>
        <div>
          <h5>Company</h5>
          <a href="#top">About</a>
          <a href="#newsletter">Journal</a>
          <a href="#newsletter">Contact</a>
        </div>
        <div>
          <h5>Newsletter</h5>
          <p>Product drops and style stories, once a week.</p>
        </div>
      </footer>
    </main>
  );
};

export default Landing;
