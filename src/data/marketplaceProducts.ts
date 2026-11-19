
import {
  accessoryCategories,
  accessoryProducts,
  type AccessoryCategory,
  type AccessoryProduct,
} from "./accessoriesProducts";

export const SELLER_PRODUCTS_STORAGE_KEY = "oneservice_seller_products";
export const SELLER_PRODUCTS_EVENT = "oneservice-seller-products-updated";

export interface SharedSellerProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  stock: number;
  status: string;
  images: string[];
  sku: string;
  description: string;
  updatedAt?: string;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function getSellerProducts(): SharedSellerProduct[] {
  try {
    const saved = localStorage.getItem(SELLER_PRODUCTS_STORAGE_KEY);

    if (!saved) return [];

    const parsed = JSON.parse(saved);

    if (!Array.isArray(parsed)) return [];

    return parsed;
  } catch {
    return [];
  }
}

export function getMarketplaceProducts(): AccessoryProduct[] {
  const sellerProducts = getSellerProducts()
    .filter(
      (product) =>
        product.status === "Active" &&
        Number(product.stock) > 0
    )
    .map((product) => {
      const image =
        product.images?.find(
          (item) => typeof item === "string" && item.trim()
        ) || "🛠️";

      return {
        id: Number(product.id),
        name: product.name,
        category: product.category,
        categorySlug: slugify(product.category),
        price: Number(product.price) || 0,
        oldPrice: Number(product.originalPrice) || Number(product.price) || 0,
        image,
        images: product.images?.length ? product.images : [image],
        rating: 0,
        reviews: 0,
        badge: "Seller Product",
        description:
          product.description || "Product listed by a OneService seller.",
        highlights: [
          product.description || "Listed by a OneService seller.",
          `SKU: ${product.sku || "Not specified"}`,
          "Check product details before ordering.",
        ],
        specifications: [
          { label: "Product category", value: product.category },
          { label: "SKU", value: product.sku || "Not specified" },
          { label: "Available stock", value: String(product.stock) },
        ],
        inStock: Number(product.stock) > 0,
        fastDelivery: false,
        installationAvailable: false,
      } satisfies AccessoryProduct;
    });

  return [...accessoryProducts, ...sellerProducts];
}

export function getMarketplaceCategories(): AccessoryCategory[] {
  const categories = [...accessoryCategories];
  const existingSlugs = new Set(categories.map((item) => item.slug));

  getSellerProducts().forEach((product) => {
    const name = product.category?.trim();

    if (!name) return;

    const slug = slugify(name);

    if (existingSlugs.has(slug)) return;

    categories.push({
      name,
      slug,
      subcategories: [],
    });

    existingSlugs.add(slug);
  });

  return categories;
}

export function notifySellerProductsUpdated(): void {
  window.dispatchEvent(new Event(SELLER_PRODUCTS_EVENT));
}

export function subscribeToSellerProducts(
  callback: () => void
): () => void {
  window.addEventListener(SELLER_PRODUCTS_EVENT, callback);
  window.addEventListener("storage", callback);

  return () => {
    window.removeEventListener(SELLER_PRODUCTS_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}
