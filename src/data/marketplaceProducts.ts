
import {
  accessoryCategories,
  accessoryProducts,
  type AccessoryCategory,
  type AccessoryProduct,
} from "./accessoriesProducts";

/* =========================================================
   SHARED MARKETPLACE STORAGE
========================================================= */

export const SELLER_PRODUCTS_STORAGE_KEY =
  "oneservice_seller_products";

export const SELLER_PRODUCTS_EVENT =
  "oneservice-seller-products-updated";

const SELLER_APPLICATION_KEYS = [
  "oneservice_seller_applications",
  "oneservice_seller_application",
  "oneservice_partner_application",
];

const SELLER_EVENT = "oneservice-seller-change";
const WORKSPACE_EVENT = "oneservice-workspace-change";

export interface SharedSellerProduct {
  id: string | number;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  stock: number;
  status: string;
  adminStatus?: string;
  images: string[];
  sku: string;
  description: string;
  updatedAt?: string;

  sellerId?: string | number;
  sellerName?: string;
  sellerEmail?: string;

  [key: string]: unknown;
}

interface SellerApplication {
  id?: string | number;
  status?: string;
  approvalStatus?: string;
  applicationStatus?: string;
  sellerStatus?: string;
  accountStatus?: string;

  userId?: string | number;
  sellerId?: string | number;
  profileId?: string | number;

  contactName?: string;
  fullName?: string;
  name?: string;
  businessName?: string;
  ownerName?: string;

  email?: string;
  ownerEmail?: string;
  contactEmail?: string;
  businessEmail?: string;

  [key: string]: unknown;
}

/* =========================================================
   GENERAL HELPERS
========================================================= */

function normalize(value: unknown): string {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function normalizeId(value: unknown): string {
  return String(value ?? "").trim();
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function isObject(
  value: unknown
): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function safeParse(value: string | null): unknown {
  if (!value) return null;

  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function getFirstNonEmpty(
  ...values: unknown[]
): string {
  for (const value of values) {
    const result = String(value ?? "").trim();

    if (result) return result;
  }

  return "";
}

/* =========================================================
   SELLER APPLICATION PARSING

   Supports:
   - Array of applications
   - Single application object
   - { applications: [...] }
   - { data: [...] }
   - { seller: {...} }
   - Object maps containing seller records

   Records are not required to have an id if they have
   another usable seller identity.
========================================================= */

function isSellerRecord(
  value: unknown
): value is SellerApplication {
  if (!isObject(value)) return false;

  const identityValues = [
    value.id,
    value.userId,
    value.user_id,
    value.sellerId,
    value.seller_id,
    value.profileId,
    value.email,
    value.ownerEmail,
    value.contactEmail,
    value.businessName,
    value.contactName,
    value.fullName,
  ];

  return identityValues.some(
    (item) => String(item ?? "").trim() !== ""
  );
}

function extractSellerRecords(
  parsed: unknown
): SellerApplication[] {
  if (Array.isArray(parsed)) {
    return parsed.filter(isSellerRecord);
  }

  if (!isObject(parsed)) return [];

  if (Array.isArray(parsed.applications)) {
    return parsed.applications.filter(isSellerRecord);
  }

  if (Array.isArray(parsed.data)) {
    return parsed.data.filter(isSellerRecord);
  }

  if (isObject(parsed.seller)) {
    return isSellerRecord(parsed.seller)
      ? [parsed.seller as SellerApplication]
      : [];
  }

  if (isSellerRecord(parsed)) {
    return [parsed as SellerApplication];
  }

  /*
   * Also support records saved as an object map:
   * {
   *   "seller-1": { ... },
   *   "seller-2": { ... }
   * }
   */
  return Object.values(parsed).filter(isSellerRecord);
}

function parseSellerApplications(
  raw: string | null
): SellerApplication[] {
  return extractSellerRecords(safeParse(raw));
}

/* =========================================================
   SELLER APPLICATION IDENTITY
========================================================= */

function getSellerIdentityIds(
  seller: SellerApplication
): Set<string> {
  const possibleIds = [
    seller.id,
    seller.userId,
    seller.user_id,
    seller.sellerId,
    seller.seller_id,
    seller.profileId,
    seller.profile_id,
    seller.accountId,
    seller.ownerId,
  ];

  return new Set(
    possibleIds
      .map(normalizeId)
      .filter(Boolean)
  );
}

function getSellerIdentityEmails(
  seller: SellerApplication
): Set<string> {
  const possibleEmails = [
    seller.email,
    seller.ownerEmail,
    seller.contactEmail,
    seller.businessEmail,
    seller.owner_email,
    seller.contact_email,
  ];

  return new Set(
    possibleEmails
      .map(normalize)
      .filter(Boolean)
  );
}

function getSellerIdentityNames(
  seller: SellerApplication
): Set<string> {
  const possibleNames = [
    seller.businessName,
    seller.contactName,
    seller.fullName,
    seller.name,
    seller.ownerName,
  ];

  return new Set(
    possibleNames
      .map(normalize)
      .filter(Boolean)
  );
}

/* =========================================================
   READ AND MERGE SELLER APPLICATIONS

   Merge copies using any shared identity:
   application ID, user ID, or email.

   Later records can update the approval status of
   an existing seller record.
========================================================= */

function getSellerApplications(): SellerApplication[] {
  if (typeof window === "undefined") return [];

  try {
    const merged = new Map<string, SellerApplication>();

    SELLER_APPLICATION_KEYS.forEach((key) => {
      const records = parseSellerApplications(
        localStorage.getItem(key)
      );

      records.forEach((seller) => {
        const ids = Array.from(
          getSellerIdentityIds(seller)
        );

        const emails = Array.from(
          getSellerIdentityEmails(seller)
        );

        const existingEntry = Array.from(
          merged.entries()
        ).find(([, existing]) => {
          const existingIds =
            getSellerIdentityIds(existing);

          const existingEmails =
            getSellerIdentityEmails(existing);

          return (
            ids.some((id) => existingIds.has(id)) ||
            emails.some((email) =>
              existingEmails.has(email)
            )
          );
        });

        const identityKey =
          existingEntry?.[0] ||
          ids[0] ||
          emails[0] ||
          `seller-${merged.size}`;

        const existing = existingEntry?.[1];

        merged.set(identityKey, {
          ...existing,
          ...seller,
        });
      });
    });

    return Array.from(merged.values());
  } catch (error) {
    console.error(
      "Could not load seller applications:",
      error
    );

    return [];
  }
}

/* =========================================================
   SELLER IDENTITY MATCHING

   A product can belong to a seller through:
   - Seller application ID
   - User ID
   - Seller ID
   - Profile ID
   - Seller email
   - Registered business/contact name

   Exact normalized matching is used.
========================================================= */

function productBelongsToSeller(
  product: SharedSellerProduct,
  seller: SellerApplication
): boolean {
  const sellerIds = getSellerIdentityIds(seller);
  const sellerEmails = getSellerIdentityEmails(seller);
  const sellerNames = getSellerIdentityNames(seller);

  const productSellerId = normalizeId(
    product.sellerId
  );

  const productSellerEmail = normalize(
    product.sellerEmail
  );

  const productSellerName = normalize(
    product.sellerName
  );

  if (
    productSellerId &&
    sellerIds.has(productSellerId)
  ) {
    return true;
  }

  if (
    productSellerEmail &&
    sellerEmails.has(productSellerEmail)
  ) {
    return true;
  }

  if (
    productSellerName &&
    sellerNames.has(productSellerName)
  ) {
    return true;
  }

  return false;
}

/* =========================================================
   SELLER APPROVAL
========================================================= */

function isApprovedSeller(
  seller: SellerApplication
): boolean {
  const possibleStatuses = [
    seller.status,
    seller.approvalStatus,
    seller.applicationStatus,
    seller.sellerStatus,
    seller.accountStatus,
  ];

  return possibleStatuses.some(
    (status) => normalize(status) === "approved"
  );
}

function hasApprovedSellerAccount(
  product: SharedSellerProduct,
  sellers: SellerApplication[]
): boolean {
  return sellers.some(
    (seller) =>
      isApprovedSeller(seller) &&
      productBelongsToSeller(product, seller)
  );
}

/* =========================================================
   PRODUCT PUBLISHING ELIGIBILITY

   A seller product appears publicly only when:

   1. The matching seller registration is approved.
   2. Admin product approval is Approved.
   3. Product status is Active or Pending Review.
   4. Available stock is greater than zero.

   IMPORTANT:
   Admin approval is controlled by adminStatus.
   The seller-side status can still be Pending Review
   because the current Admin flow updates adminStatus.
========================================================= */

function isPubliclyEligibleProduct(
  product: SharedSellerProduct,
  sellers: SellerApplication[]
): boolean {
  const sellerApproved =
    hasApprovedSellerAccount(product, sellers);

  const adminApproved =
    normalize(product.adminStatus) === "approved";

  const productStatus = normalize(product.status);

  const productStatusAllowed = [
    "active",
    "pending review",
  ].includes(productStatus);

  const stock = Number(product.stock);

  const hasAvailableStock =
    Number.isFinite(stock) && stock > 0;

  return (
    sellerApproved &&
    adminApproved &&
    productStatusAllowed &&
    hasAvailableStock
  );
}

/* =========================================================
   READ SHARED SELLER PRODUCTS

   This key must match the key used by SellerProductsPage
   and Admin Marketplace.
========================================================= */

export function getSellerProducts(): SharedSellerProduct[] {
  if (typeof window === "undefined") return [];

  try {
    const saved = localStorage.getItem(
      SELLER_PRODUCTS_STORAGE_KEY
    );

    if (!saved) return [];

    const parsed: unknown = JSON.parse(saved);

    if (!Array.isArray(parsed)) return [];

    return parsed.filter(
      (product): product is SharedSellerProduct =>
        isObject(product) &&
        (
          typeof product.id === "string" ||
          typeof product.id === "number"
        ) &&
        typeof product.name === "string"
    );
  } catch (error) {
    console.error(
      "Could not load marketplace seller products:",
      error
    );

    return [];
  }
}

/* =========================================================
   GET APPROVED SELLER PRODUCTS
========================================================= */

export function getApprovedMarketplaceSellerProducts():
  SharedSellerProduct[] {
  const products = getSellerProducts();
  const sellers = getSellerApplications();

  return products.filter((product) =>
    isPubliclyEligibleProduct(product, sellers)
  );
}

/* =========================================================
   CONVERT SELLER PRODUCT TO MARKETPLACE PRODUCT
========================================================= */

function toMarketplaceProduct(
  product: SharedSellerProduct
): AccessoryProduct {
  const validImages = Array.isArray(product.images)
    ? product.images.filter(
        (image): image is string =>
          typeof image === "string" &&
          image.trim().length > 0
      )
    : [];

  const image = validImages[0] || "🛠️";

  const price = Math.max(
    0,
    Number(product.price) || 0
  );

  const originalPriceValue = Number(
    product.originalPrice
  );

  const originalPrice =
    Number.isFinite(originalPriceValue) &&
    originalPriceValue > price
      ? originalPriceValue
      : price;

  const stock = Math.max(
    0,
    Number(product.stock) || 0
  );

  const category = getFirstNonEmpty(
    product.category,
    "Other"
  );

  const productName = getFirstNonEmpty(
    product.name,
    "Seller Product"
  );

  /*
   * Prefix seller IDs to prevent collisions with
   * static accessory catalogue IDs.
   */
  const marketplaceId =
    `seller-${String(product.id)}`;

  const description = getFirstNonEmpty(
    product.description,
    "Product listed by an approved OneService seller."
  );

  return {
    id: marketplaceId,

    name: productName,
    category,
    categorySlug: slugify(category),

    price,
    oldPrice: originalPrice,

    image,

    images: validImages.length
      ? validImages
      : [image],

    rating: 0,
    reviews: 0,

    badge: "Seller Product",

    description,

    highlights: [
      description,
      `SKU: ${product.sku || "Not specified"}`,
      "Check product details before ordering.",
    ],

    specifications: [
      {
        label: "Product category",
        value: category,
      },
      {
        label: "SKU",
        value: product.sku || "Not specified",
      },
      {
        label: "Available stock",
        value: String(stock),
      },
    ],

    inStock: stock > 0,

    fastDelivery: false,
    installationAvailable: false,
  } satisfies AccessoryProduct;
}

/* =========================================================
   PUBLIC MARKETPLACE PRODUCTS

   Static catalogue + approved seller products.
========================================================= */

export function getMarketplaceProducts():
  AccessoryProduct[] {
  const approvedSellerProducts =
    getApprovedMarketplaceSellerProducts();

  const marketplaceSellerProducts =
    approvedSellerProducts.map(
      toMarketplaceProduct
    );

  const allProducts = [
    ...accessoryProducts,
    ...marketplaceSellerProducts,
  ];

  const uniqueProducts = new Map<
    string,
    AccessoryProduct
  >();

  allProducts.forEach((product) => {
    uniqueProducts.set(
      String(product.id),
      product
    );
  });

  return Array.from(uniqueProducts.values());
}

/* =========================================================
   PUBLIC MARKETPLACE CATEGORIES
========================================================= */

export function getMarketplaceCategories():
  AccessoryCategory[] {
  const categories = [...accessoryCategories];

  const existingSlugs = new Set(
    categories.map((item) => normalize(item.slug))
  );

  const approvedProducts =
    getApprovedMarketplaceSellerProducts();

  approvedProducts.forEach((product) => {
    const name = getFirstNonEmpty(
      product.category
    );

    if (!name) return;

    const slug = slugify(name);

    if (
      !slug ||
      existingSlugs.has(normalize(slug))
    ) {
      return;
    }

    categories.push({
      name,
      slug,
      subcategories: [],
    });

    existingSlugs.add(normalize(slug));
  });

  return categories;
}

/* =========================================================
   MARKETPLACE UPDATE EVENTS
========================================================= */

export function notifySellerProductsUpdated(): void {
  if (typeof window === "undefined") return;

  window.dispatchEvent(
    new Event(SELLER_PRODUCTS_EVENT)
  );
}

/* =========================================================
   SUBSCRIBE TO MARKETPLACE CHANGES

   Refresh when:
   - Seller creates or edits a product.
   - Admin approves, rejects or removes a product.
   - Seller registration changes.
   - Another browser tab changes localStorage.
========================================================= */

export function subscribeToSellerProducts(
  callback: () => void
): () => void {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const events = [
    SELLER_PRODUCTS_EVENT,
    SELLER_EVENT,
    WORKSPACE_EVENT,
    "storage",
  ];

  events.forEach((eventName) => {
    window.addEventListener(
      eventName,
      callback
    );
  });

  return () => {
    events.forEach((eventName) => {
      window.removeEventListener(
        eventName,
        callback
      );
    });
  };
}
