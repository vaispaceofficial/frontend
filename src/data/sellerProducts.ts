
export type SellerProductStatus =
  | "Active"
  | "Pending Review"
  | "Draft"
  | "Out of Stock"
  | "Inactive"
  | "Rejected";

export interface SellerProduct {
  id: string | number;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  stock: number;
  status: SellerProductStatus;
  images: string[];
  sku: string;
  description: string;
  updatedAt?: string;

  // Admin approval information.
  adminStatus?: string;

  // Seller ownership information.
  sellerId?: string | number;
  sellerName?: string;
  sellerEmail?: string;

  // Preserve additional fields used by other app modules.
  [key: string]: unknown;
}

/* =========================================================
   SHARED STORAGE
========================================================= */

export const SELLER_PRODUCTS_STORAGE_KEY =
  "oneservice_seller_products";

export const SELLER_PRODUCTS_EVENT =
  "oneservice-seller-products-updated";

const LEGACY_SELLER_PRODUCTS_KEY =
  "oneservice-seller-products";

const VALID_STATUSES: SellerProductStatus[] = [
  "Active",
  "Pending Review",
  "Draft",
  "Out of Stock",
  "Inactive",
  "Rejected",
];

/* =========================================================
   HELPERS
========================================================= */

function isObject(
  value: unknown
): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function normalizeText(value: unknown): string {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ");
}

function normalizeStatus(
  value: unknown
): SellerProductStatus {
  const normalized = normalizeText(value);

  const matched = VALID_STATUSES.find(
    (status) =>
      normalizeText(status) === normalized
  );

  return matched ?? "Draft";
}

function isValidProduct(
  value: unknown
): value is SellerProduct {
  if (!isObject(value)) return false;

  const hasValidId =
    typeof value.id === "string" ||
    typeof value.id === "number";

  const hasValidName =
    typeof value.name === "string" &&
    value.name.trim().length > 0;

  const hasValidPrice =
    Number.isFinite(Number(value.price));

  const hasValidStock =
    Number.isFinite(Number(value.stock));

  return (
    hasValidId &&
    hasValidName &&
    hasValidPrice &&
    hasValidStock
  );
}

/**
 * Normalize product values without discarding additional fields.
 *
 * Supports older product records that may not have all
 * newer optional fields.
 *
 * Seller ownership and admin approval metadata are retained.
 */
function normalizeProduct(
  product: SellerProduct
): SellerProduct {
  const rawProduct = product as Record<string, unknown>;

  const rawImages = Array.isArray(rawProduct.images)
    ? rawProduct.images
    : typeof rawProduct.image === "string"
      ? [rawProduct.image]
      : [];

  const images = rawImages.filter(
    (image): image is string =>
      typeof image === "string" &&
      image.trim().length > 0
  );

  const originalPriceValue =
    Number(rawProduct.originalPrice);

  const hasOriginalPrice =
    rawProduct.originalPrice !== undefined &&
    rawProduct.originalPrice !== null &&
    Number.isFinite(originalPriceValue);

  return {
    ...product,

    id: product.id,

    name: String(
      product.name ?? ""
    ).trim(),

    category: String(
      product.category ?? "Other"
    ).trim() || "Other",

    price: Math.max(
      0,
      Number(product.price) || 0
    ),

    originalPrice: hasOriginalPrice
      ? Math.max(0, originalPriceValue)
      : undefined,

    stock: Math.max(
      0,
      Number(product.stock) || 0
    ),

    status: normalizeStatus(product.status),

    images,

    sku: String(
      product.sku ?? ""
    ).trim(),

    description:
      typeof product.description === "string"
        ? product.description
        : "",

    updatedAt:
      typeof product.updatedAt === "string"
        ? product.updatedAt
        : undefined,

    // Preserve seller ownership.
    sellerId: product.sellerId,
    sellerName: product.sellerName,
    sellerEmail: product.sellerEmail,

    // Preserve admin approval.
    adminStatus: product.adminStatus,
  };
}

/* =========================================================
   PARSE STORAGE
========================================================= */

function parseProductStorage(
  saved: string | null
): SellerProduct[] | null {
  if (!saved) return null;

  try {
    const parsed: unknown = JSON.parse(saved);

    if (!Array.isArray(parsed)) {
      return null;
    }

    return parsed
      .filter(isValidProduct)
      .map((product) =>
        normalizeProduct(product)
      );
  } catch {
    return null;
  }
}

/* =========================================================
   READ PRODUCT CATALOGUE
========================================================= */

export function getSellerProducts(): SellerProduct[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const primary = localStorage.getItem(
      SELLER_PRODUCTS_STORAGE_KEY
    );

    /*
     * If the primary key exists and contains a valid array,
     * it is the authoritative catalogue—even if it is empty.
     *
     * Only use the legacy key when the primary key is absent
     * or invalid.
     */
    const primaryProducts =
      parseProductStorage(primary);

    if (primaryProducts !== null) {
      return primaryProducts;
    }

    const legacy = localStorage.getItem(
      LEGACY_SELLER_PRODUCTS_KEY
    );

    const legacyProducts =
      parseProductStorage(legacy);

    if (legacyProducts === null) {
      return [];
    }

    /*
     * Migrate legacy records into the canonical key.
     * This ensures every page reads the same catalogue.
     */
    localStorage.setItem(
      SELLER_PRODUCTS_STORAGE_KEY,
      JSON.stringify(legacyProducts)
    );

    return legacyProducts;
  } catch (error) {
    console.error(
      "Could not load seller products:",
      error
    );

    return [];
  }
}

/* =========================================================
   SAVE COMPLETE SHARED CATALOGUE
========================================================= */

export function saveSellerProducts(
  products: SellerProduct[]
): void {
  if (typeof window === "undefined") return;

  try {
    const normalized = products
      .filter(isValidProduct)
      .map((product) =>
        normalizeProduct(product)
      );

    localStorage.setItem(
      SELLER_PRODUCTS_STORAGE_KEY,
      JSON.stringify(normalized)
    );

    notifySellerProductsUpdated();
  } catch (error) {
    console.error(
      "Could not save seller products:",
      error
    );

    throw error;
  }
}

/* =========================================================
   UPDATE EXISTING PRODUCT
========================================================= */

export function updateSellerProduct(
  productId: string | number,
  updates: Partial<SellerProduct>
): SellerProduct[] {
  const products = getSellerProducts();

  const updated = products.map((product) => {
    if (
      String(product.id) !==
      String(productId)
    ) {
      return product;
    }

    return normalizeProduct({
      ...product,
      ...updates,

      // Never allow an update to replace the original ID.
      id: product.id,

      updatedAt: new Date().toISOString(),
    });
  });

  saveSellerProducts(updated);

  return updated;
}

/* =========================================================
   ADD NEW PRODUCT
========================================================= */

export function addSellerProduct(
  product: SellerProduct
): SellerProduct[] {
  const products = getSellerProducts();

  const productId = String(
    product.id
  ).trim();

  const productSku = normalizeText(
    product.sku
  );

  const duplicate = products.some((item) => {
    return (
      String(item.id).trim() === productId ||
      (
        !!productSku &&
        normalizeText(item.sku) === productSku
      )
    );
  });

  if (duplicate) {
    throw new Error(
      "A product with this ID or SKU already exists."
    );
  }

  const newProduct = normalizeProduct({
    ...product,
    updatedAt: new Date().toISOString(),
  });

  const updated = [
    ...products,
    newProduct,
  ];

  saveSellerProducts(updated);

  return updated;
}

/* =========================================================
   DELETE PRODUCT
========================================================= */

export function deleteSellerProduct(
  productId: string | number
): SellerProduct[] {
  const updated = getSellerProducts().filter(
    (product) =>
      String(product.id) !== String(productId)
  );

  saveSellerProducts(updated);

  return updated;
}

/* =========================================================
   PRODUCT APPROVAL HELPERS
========================================================= */

export function isSellerProductAdminApproved(
  product: SellerProduct
): boolean {
  return (
    normalizeText(product.adminStatus) ===
    "approved"
  );
}

export function isSellerProductInStock(
  product: SellerProduct
): boolean {
  const stock = Number(product.stock);

  return (
    Number.isFinite(stock) &&
    stock > 0
  );
}

/**
 * Product-level eligibility.
 *
 * Seller account approval is checked separately by
 * marketplaceProducts.ts.
 *
 * Pending Review is accepted only when the admin has
 * explicitly approved the product.
 */
export function getApprovedSellerProducts():
  SellerProduct[] {
  return getSellerProducts().filter((product) => {
    const approved =
      isSellerProductAdminApproved(product);

    const status = normalizeText(
      product.status
    );

    const publishable =
      status === "active" ||
      status === "pending review";

    return (
      approved &&
      publishable &&
      isSellerProductInStock(product)
    );
  });
}

/* =========================================================
   MARKETPLACE UPDATE EVENT
========================================================= */

export function notifySellerProductsUpdated(): void {
  if (typeof window === "undefined") return;

  window.dispatchEvent(
    new Event(SELLER_PRODUCTS_EVENT)
  );
}

/* =========================================================
   SUBSCRIBE TO PRODUCT CHANGES
========================================================= */

export function subscribeToSellerProducts(
  callback: (products: SellerProduct[]) => void
): () => void {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const handleUpdate = () => {
    callback(getSellerProducts());
  };

  window.addEventListener(
    SELLER_PRODUCTS_EVENT,
    handleUpdate
  );

  window.addEventListener(
    "storage",
    handleUpdate
  );

  return () => {
    window.removeEventListener(
      SELLER_PRODUCTS_EVENT,
      handleUpdate
    );

    window.removeEventListener(
      "storage",
      handleUpdate
    );
  };
}
