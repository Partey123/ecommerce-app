import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../hooks/useCart";
import { useAuth } from "../../features/auth/useAuth";
import { orderService } from "../../services/orderService";
import { formatCurrency } from "../../utils/formatCurrency";
import "./Checkout.css";

const Checkout = () => {
  const { user, session } = useAuth();
  const { items, loading, refresh, removeItem } = useCart();
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    void refresh();
  }, [refresh, user]);

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + Number(item.unit_price_ghs) * item.quantity, 0),
    [items]
  );

  const placeOrder = async () => {
    if (!session?.access_token) {
      setMessage("Sign in before checkout.");
      return;
    }

    if (items.length === 0) {
      setMessage("Your cart is empty.");
      return;
    }

    try {
      setIsPlacingOrder(true);
      setMessage(null);
      const response = await orderService.createOrder(session.access_token, {});
      setMessage(`Order created successfully: ${response.order.id}`);
      await refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to place order");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <main className="checkout-page">
      <section className="checkout-card">
        <div className="checkout-header">
          <h1>Checkout</h1>
          <Link to="/shop">Back to shop</Link>
        </div>
        {!user ? <p>Please sign in to continue checkout.</p> : null}
        {loading ? <p>Loading cart...</p> : null}

        <div className="checkout-items">
          {items.map((item) => (
            <article className="checkout-item" key={item.id}>
              <div>
                <h3>{item.product?.name ?? "Product"}</h3>
                <p>
                  {item.quantity} x {formatCurrency(Number(item.unit_price_ghs))}
                </p>
              </div>
              <button
                type="button"
                onClick={async () => {
                  await removeItem(item.product_id);
                }}
              >
                Remove
              </button>
            </article>
          ))}
          {!loading && items.length === 0 ? <p>Your cart is empty.</p> : null}
        </div>

        <div className="checkout-summary">
          <strong>Total: {formatCurrency(subtotal)}</strong>
          <button type="button" onClick={() => void placeOrder()} disabled={isPlacingOrder}>
            {isPlacingOrder ? "Placing order..." : "Place Order"}
          </button>
        </div>

        {message ? <p className="checkout-message">{message}</p> : null}
      </section>
    </main>
  );
};

export default Checkout;
