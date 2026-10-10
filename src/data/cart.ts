// src/data/cart.ts

export interface CartItem {
  cartId: string;
  id: string | number;
  name: string;
  price: number;
  image?: string;
  category?: string;
  quantity: number;
}

const CART_STORAGE_KEY = "oneservice-cart";
const CART_EVENT = "oneservice-cart-updated";

export function getCart(): CartItem[] {
  try {
    const saved = localStorage.getItem(CART_STORAGE_KEY);
    return saved ? (JSON.parse(saved) as CartItem[]) : [];
  } catch {
    return [];
  }
}

function saveCart(items: CartItem[]) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event(CART_EVENT));
}

export function getCartCount(): number {
  return getCart().reduce((total, item) => total + item.quantity, 0);
}

export function addToCart(product: {
  id: string | number;
  name?: string;
  title?: string;
  price: number | string;
  image?: string;
  category?: string;
  cartId?: string;
}) {
  const numericPrice =
    typeof product.price === "number"
      ? product.price
      : Number(String(product.price).replace(/[^\d.]/g, ""));

  if (!Number.isFinite(numericPrice) || numericPrice < 0) {
    return;
  }

  const name = product.name ?? product.title ?? "Product";
  const cartId =
    product.cartId ?? `${product.category ?? "product"}-${product.id}`;

  const items = getCart();
  const existing = items.find((item) => item.cartId === cartId);

  if (existing) {
    existing.quantity += 1;
  } else {
    items.push({
      cartId,
      id: product.id,
      name,
      price: numericPrice,
      image: product.image,
      category: product.category,
      quantity: 1,
    });
  }

  saveCart(items);
}

export function updateCartQuantity(cartId: string, quantity: number) {
  const items = getCart()
    .map((item) =>
      item.cartId === cartId
        ? { ...item, quantity: Math.max(1, Math.floor(quantity)) }
        : item,
    );

  saveCart(items);
}

export function removeFromCart(cartId: string) {
  saveCart(getCart().filter((item) => item.cartId !== cartId));
}

export function clearCart() {
  saveCart([]);
}

export function subscribeToCart(callback: () => void) {
  window.addEventListener(CART_EVENT, callback);
  window.addEventListener("storage", callback);

  return () => {
    window.removeEventListener(CART_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}