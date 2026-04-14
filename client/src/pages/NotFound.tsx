import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "1.5rem",
        background: "#f8fafc",
      }}
    >
      <section
        style={{
          width: "min(560px, 100%)",
          background: "#fff",
          border: "1px solid #e2e8f0",
          borderRadius: "1rem",
          padding: "1.4rem",
        }}
      >
        <h1 style={{ margin: 0 }}>Page not found</h1>
        <p style={{ marginTop: "0.7rem", color: "#64748b" }}>
          The page you requested does not exist or may have moved.
        </p>
        <div style={{ marginTop: "1rem", display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
          <Link to="/" className="shop-link-btn">
            Go Home
          </Link>
          <Link to="/shop" className="shop-primary-btn">
            Browse Shop
          </Link>
        </div>
      </section>
    </main>
  );
};

export default NotFound;

