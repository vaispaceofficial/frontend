import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { getCartCount, subscribeToCart } from "../data/cart";
import "./CartShortcut.css";

export default function CartShortcut() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const refreshCount = () => setCount(getCartCount());

    refreshCount();
    return subscribeToCart(refreshCount);
  }, []);

  return (
    <div className="cart-shortcut-bar">
      <Link to="/cart" className="cart-shortcut-button">
        <span className="cart-shortcut-icon">
          <ShoppingCart size={21} />
          {count > 0 && (
            <span className="cart-shortcut-count">
              {count > 99 ? "99+" : count}
            </span>
          )}
        </span>

        <span className="cart-shortcut-label">
          <strong>My Cart</strong>
          <small>
            {count === 0
              ? "Your cart is empty"
              : `${count} ${count === 1 ? "item" : "items"}`}
          </small>
        </span>
      </Link>
    </div>
  );
}