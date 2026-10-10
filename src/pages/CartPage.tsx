import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Minus,
  Plus,
  ShoppingBag,
  ShoppingCart,
  Trash2,
  ShieldCheck,
  Truck,
} from "lucide-react";

import type { CartItem } from "../data/cart";

import {
  clearCart,
  getCart,
  removeFromCart,
  subscribeToCart,
  updateCartQuantity,
} from "../data/cart";

import "./CartPage.css";

const formatPrice = (price: number) =>
  `₹${price.toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  })}`;

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const refreshCart = () => setItems(getCart());

    refreshCart();
    return subscribeToCart(refreshCart);
  }, []);

  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const totalItems = items.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  const handleCheckout = () => {
    // Connect this to your checkout flow when it is ready.
    alert("Your cart is ready! Checkout integration will be added next.");
  };

  return (
    <main className="oneservice-cart-page">
      <div className="cart-page-container">
        <div className="cart-breadcrumb">
          <Link to="/accessories-sales">
            <ArrowLeft size={16} />
            Continue shopping
          </Link>
          <span>/</span>
          <span>Shopping Cart</span>
        </div>

        <header className="cart-page-heading">
          <div>
            <span className="cart-eyebrow">NEEDONESERVICE MARKETPLACE</span>
            <h1>Shopping Cart</h1>
            <p>
              Review your items and get everything you need in one place.
            </p>
          </div>

          {items.length > 0 && (
            <span className="cart-item-count">
              {totalItems} {totalItems === 1 ? "item" : "items"}
            </span>
          )}
        </header>

        {items.length === 0 ? (
          <section className="cart-empty-state">
            <div className="cart-empty-icon">
              <ShoppingCart size={34} />
            </div>
            <h2>Your cart is waiting for you</h2>
            <p>
              You haven't added any products yet. Explore the marketplace
              and find something you need.
            </p>
            <Link
              to="/accessories-sales"
              className="cart-primary-button"
            >
              <ShoppingBag size={18} />
              Start shopping
            </Link>
          </section>
        ) : (
          <div className="cart-layout">
            <section className="cart-items-panel">
              <div className="cart-items-heading">
                <h2>Your items</h2>
                <button
                  type="button"
                  className="cart-clear-button"
                  onClick={() => {
                    clearCart();
                    setItems([]);
                  }}
                >
                  Clear cart
                </button>
              </div>

              <div className="cart-items-list">
                {items.map((item) => (
                  <article className="cart-item" key={item.cartId}>
                    <div className="cart-product-image">
                      {item.image &&
                      (item.image.startsWith("/") ||
                        item.image.startsWith("http")) ? (
                        <img src={item.image} alt={item.name} />
                      ) : (
                        <span>{item.image || "📦"}</span>
                      )}
                    </div>

                    <div className="cart-product-details">
                      {item.category && (
                        <span className="cart-product-category">
                          {item.category}
                        </span>
                      )}

                      <h3>{item.name}</h3>
                      <strong className="cart-product-price">
                        {formatPrice(item.price)}
                      </strong>

                      <div className="cart-item-actions">
                        <div
                          className="cart-quantity-control"
                          aria-label={`Quantity for ${item.name}`}
                        >
                          <button
                            type="button"
                            aria-label="Decrease quantity"
                            disabled={item.quantity <= 1}
                            onClick={() =>
                              updateCartQuantity(
                                item.cartId,
                                item.quantity - 1,
                              )
                            }
                          >
                            <Minus size={14} />
                          </button>

                          <span>{item.quantity}</span>

                          <button
                            type="button"
                            aria-label="Increase quantity"
                            onClick={() =>
                              updateCartQuantity(
                                item.cartId,
                                item.quantity + 1,
                              )
                            }
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        <button
                          type="button"
                          className="cart-remove-button"
                          onClick={() => removeFromCart(item.cartId)}
                        >
                          <Trash2 size={15} />
                          Remove
                        </button>
                      </div>
                    </div>

                    <strong className="cart-line-total">
                      {formatPrice(item.price * item.quantity)}
                    </strong>
                  </article>
                ))}
              </div>

              <div className="cart-assurance-row">
                <div>
                  <ShieldCheck size={19} />
                  <span>Secure shopping</span>
                </div>
                <div>
                  <Truck size={19} />
                  <span>Delivery details at checkout</span>
                </div>
              </div>
            </section>

            <aside className="cart-summary-panel">
              <h2>Order summary</h2>

              <div className="cart-summary-line">
                <span>Subtotal ({totalItems} items)</span>
                <strong>{formatPrice(subtotal)}</strong>
              </div>

              <div className="cart-summary-line">
                <span>Delivery</span>
                <span className="cart-delivery-note">
                  Calculated at checkout
                </span>
              </div>

              <div className="cart-summary-total">
                <span>Subtotal</span>
                <strong>{formatPrice(subtotal)}</strong>
              </div>

              <button
                type="button"
                className="cart-checkout-button"
                onClick={handleCheckout}
              >
                Proceed to checkout
              </button>

              <p className="cart-summary-note">
                Delivery charges and final order total will be confirmed
                during checkout.
              </p>

              <Link
                to="/accessories-sales"
                className="cart-continue-link"
              >
                <ArrowLeft size={15} />
                Continue shopping
              </Link>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}