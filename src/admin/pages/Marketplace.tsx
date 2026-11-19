
import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Clock3,
  Package,
  Search,
  Store,
  X,
  Check,
  Ban,
  Image as ImageIcon,
  Users,
  ClipboardCheck,
  Eye,
  CalendarDays,
  MessageSquare,
  ShieldAlert,
  RotateCcw,
} from "lucide-react";

import {
  getSellerProducts,
  saveSellerProducts,
  subscribeToSellerProducts,
  type SellerProduct as SharedSellerProduct,
} from "../../data/sellerProducts";

import "./Marketplace.css";

// =========================================================
// STORAGE KEYS AND EVENTS
// =========================================================

const SELLER_APPLICATIONS_KEY = "oneservice_seller_applications";
const SELLER_APPLICATION_KEY = "oneservice_seller_application";
const PARTNER_APPLICATION_KEY = "oneservice_partner_application";

const SELLER_EVENT = "oneservice-seller-change";
const WORKSPACE_EVENT = "oneservice-workspace-change";

type AdminStatus =
  | "Pending Review"
  | "Approved"
  | "Rejected"
  | "Removed";

type SellerRemark = {
  id: string;
  text: string;
  createdAt: string;
};

type SuspensionRecord = {
  reason: string;
  suspendedAt: string;
  reactivatedAt?: string;
};

type SellerApplication = {
  id: string;
  role?: string;
  status: string;
  submittedAt?: string;
  contactName?: string;
  fullName?: string;
  designation?: string;
  mobile?: string;
  whatsapp?: string;
  email?: string;
  userId?: string;
  sellerType?: string;
  businessName?: string;
  businessType?: string;
  yearEstablished?: string;
  website?: string;
  categories?: string[];
  brands?: string;
  products?: string;
  productCondition?: string;
  authorizedSeller?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  deliveryCoverage?: string;
  dispatchTime?: string;
  inventory?: string;
  returnPolicy?: string;
  hasBusinessRegistration?: boolean;
  hasPanDocument?: boolean;
  hasGstDocument?: boolean;
  hasAddressProof?: boolean;
  hasBrandAuthorizationDocument?: boolean;
  hasProductCatalogue?: boolean;
  businessRegistrationFileName?: string;
  panDocumentFileName?: string;
  gstDocumentFileName?: string;
  addressProofFileName?: string;
  brandAuthorizationFileName?: string;
  productCatalogueFileName?: string;
  termsAccepted?: boolean;
  verificationConsent?: boolean;
  productAuthenticityConsent?: boolean;
  approvedAt?: string;
  rejectedAt?: string;
  remarks?: SellerRemark[];
  suspensionHistory?: SuspensionRecord[];
  suspensionReason?: string;
  suspendedAt?: string;
  reactivatedAt?: string;
  [key: string]: unknown;
};

type SellerProduct = {
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
  adminStatus?: AdminStatus;
  sellerName?: string;
  sellerId?: string;
  sellerEmail?: string;
  sellerUserId?: string;
  liabilityStatus?: "Acknowledged" | "Pending";
  [key: string]: unknown;
};

type InventoryItem = SellerProduct & {
  vendor: string;
  liabilityStatus: "Acknowledged" | "Pending";
};

type MarketplaceTab = "onboarding" | "sellers" | "products";

// =========================================================
// GENERAL HELPERS
// =========================================================

const normalize = (value: unknown): string =>
  String(value ?? "").trim().toLowerCase();

const getText = (
  value: unknown,
  fallback = "Not provided"
): string => {
  if (value === null || value === undefined || value === "") {
    return fallback;
  }

  if (Array.isArray(value)) {
    return value.length ? value.join(", ") : fallback;
  }

  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  return String(value);
};

const formatDate = (value?: string) => {
  if (!value) return "Not available";

  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
};

const getSellerStatus = (seller: SellerApplication) =>
  String(seller.status || "Pending").trim();

const isPendingSeller = (seller: SellerApplication) =>
  ["pending", "pending review", "submitted"].includes(
    normalize(getSellerStatus(seller))
  );

const isApprovedSeller = (seller: SellerApplication) =>
  normalize(getSellerStatus(seller)) === "approved";

const isSuspendedSeller = (seller: SellerApplication) =>
  normalize(getSellerStatus(seller)) === "suspended";

const isRejectedSeller = (seller: SellerApplication) =>
  normalize(getSellerStatus(seller)) === "rejected";

// Normalize admin status regardless of capitalization.
const normalizeAdminStatus = (value: unknown): AdminStatus => {
  const status = normalize(value);

  if (status === "approved") return "Approved";
  if (status === "rejected") return "Rejected";
  if (status === "removed") return "Removed";

  return "Pending Review";
};

const getAdminStatus = (product: SellerProduct): AdminStatus =>
  normalizeAdminStatus(product.adminStatus);

const normalizeProduct = (
  item: SharedSellerProduct
): SellerProduct => {
  const product = item as SharedSellerProduct & Record<string, unknown>;

  return {
    ...product,
    id: String(product.id ?? ""),
    name: String(product.name || "Unnamed product"),
    category: String(product.category || "Uncategorized"),
    price: Number(product.price || 0),
    originalPrice:
      product.originalPrice === undefined ||
      product.originalPrice === null
        ? undefined
        : Number(product.originalPrice),
    stock: Number(product.stock || 0),
    status: String(product.status || "Pending Review"),
    images: Array.isArray(product.images)
      ? product.images.map(String)
      : [],
    sku: String(product.sku || ""),
    description: String(product.description || ""),
    updatedAt: product.updatedAt
      ? String(product.updatedAt)
      : undefined,
    adminStatus: normalizeAdminStatus(product.adminStatus),
    sellerName: product.sellerName
      ? String(product.sellerName)
      : undefined,
    sellerId: product.sellerId
      ? String(product.sellerId)
      : undefined,
    sellerEmail: product.sellerEmail
      ? String(product.sellerEmail)
      : undefined,
    sellerUserId: product.sellerUserId
      ? String(product.sellerUserId)
      : undefined,
    liabilityStatus:
      normalize(product.liabilityStatus) === "acknowledged"
        ? "Acknowledged"
        : "Pending",
  };
};

// =========================================================
// SHARED PRODUCT STORAGE
// =========================================================

const readProducts = (): SellerProduct[] => {
  try {
    const saved = getSellerProducts();

    if (!Array.isArray(saved)) return [];

    return saved
      .filter(
        (item) =>
          item &&
          typeof item === "object" &&
          item.id !== undefined &&
          item.id !== null
      )
      .map(normalizeProduct);
  } catch (error) {
    console.error("Unable to read marketplace products:", error);
    return [];
  }
};

// =========================================================
// SELLER APPLICATION STORAGE
// Supports arrays, single records, and common wrapper objects.
// =========================================================

const parseApplicationValue = (
  raw: string | null
): SellerApplication[] => {
  if (!raw) return [];

  try {
    const parsed: unknown = JSON.parse(raw);

    const isSellerRecord = (
      value: unknown
    ): value is SellerApplication =>
      Boolean(
        value &&
          typeof value === "object" &&
          !Array.isArray(value) &&
          (value as Record<string, unknown>).id !== undefined
      );

    if (Array.isArray(parsed)) {
      return parsed.filter(isSellerRecord);
    }

    if (isSellerRecord(parsed)) {
      return [parsed];
    }

    if (parsed && typeof parsed === "object") {
      const wrapper = parsed as Record<string, unknown>;

      const possibleArrays = [
        wrapper.applications,
        wrapper.sellers,
        wrapper.data,
        wrapper.records,
      ];

      for (const value of possibleArrays) {
        if (Array.isArray(value)) {
          return value.filter(isSellerRecord);
        }
      }
    }
  } catch {
    console.warn("Could not parse seller application storage.");
  }

  return [];
};

const readSellerApplications = (): SellerApplication[] => {
  try {
    const all = [
      ...parseApplicationValue(
        localStorage.getItem(SELLER_APPLICATIONS_KEY)
      ),
      ...parseApplicationValue(
        localStorage.getItem(SELLER_APPLICATION_KEY)
      ),
      ...parseApplicationValue(
        localStorage.getItem(PARTNER_APPLICATION_KEY)
      ),
    ];

    const unique = new Map<string, SellerApplication>();

    all.forEach((seller) => {
      const id = String(seller.id || "").trim();

      if (!id) return;

      const existing = unique.get(id);

      unique.set(id, {
        ...existing,
        ...seller,
      });
    });

    return [...unique.values()];
  } catch (error) {
    console.error("Unable to read seller applications:", error);
    return [];
  }
};

const saveSellerApplications = (
  applications: SellerApplication[]
) => {
  try {
    localStorage.setItem(
      SELLER_APPLICATIONS_KEY,
      JSON.stringify(applications)
    );

    // Keep the latest record available for legacy pages.
    const latest = applications[applications.length - 1];

    if (latest) {
      localStorage.setItem(
        SELLER_APPLICATION_KEY,
        JSON.stringify(latest)
      );

      localStorage.setItem(
        PARTNER_APPLICATION_KEY,
        JSON.stringify(latest)
      );
    }

    window.dispatchEvent(new Event(SELLER_EVENT));
    window.dispatchEvent(new Event(WORKSPACE_EVENT));
  } catch (error) {
    console.error("Unable to save seller applications:", error);
  }
};

// =========================================================
// SELLER / PRODUCT MATCHING
// =========================================================

const productBelongsToSeller = (
  product: SellerProduct,
  seller: SellerApplication
): boolean => {
  const productIds = [
    product.sellerId,
    product.sellerUserId,
    product.ownerId,
    product.userId,
  ]
    .map(normalize)
    .filter(Boolean);

  const sellerIds = [
    seller.id,
    seller.userId,
    seller.user_id,
  ]
    .map(normalize)
    .filter(Boolean);

  if (
    productIds.some((id) => sellerIds.includes(id))
  ) {
    return true;
  }

  const productEmail = normalize(product.sellerEmail);
  const sellerEmail = normalize(seller.email);

  if (
    productEmail &&
    sellerEmail &&
    productEmail === sellerEmail
  ) {
    return true;
  }

  const productName = normalize(product.sellerName);

  if (!productName) return false;

  const sellerNames = [
    seller.businessName,
    seller.contactName,
    seller.fullName,
  ]
    .map(normalize)
    .filter(Boolean);

  return sellerNames.includes(productName);
};

// =========================================================
// SELLER PROFILE SECTIONS
// =========================================================

const sellerDetailSections = [
  {
    title: "Contact Information",
    fields: [
      ["Contact Person", "contactName"],
      ["Full Name", "fullName"],
      ["Designation", "designation"],
      ["Mobile Number", "mobile"],
      ["WhatsApp Number", "whatsapp"],
      ["Email Address", "email"],
    ],
  },
  {
    title: "Business Information",
    fields: [
      ["Seller Type", "sellerType"],
      ["Business Name", "businessName"],
      ["Business Type", "businessType"],
      ["Year Established", "yearEstablished"],
      ["Website", "website"],
    ],
  },
  {
    title: "Products and Brands",
    fields: [
      ["Categories", "categories"],
      ["Brands", "brands"],
      ["Products", "products"],
      ["Product Condition", "productCondition"],
      ["Authorized Seller", "authorizedSeller"],
    ],
  },
  {
    title: "Address and Fulfilment",
    fields: [
      ["Business Address", "address"],
      ["City", "city"],
      ["State", "state"],
      ["Pincode", "pincode"],
      ["Delivery Coverage", "deliveryCoverage"],
      ["Dispatch Time", "dispatchTime"],
      ["Inventory Capacity", "inventory"],
      ["Return Policy", "returnPolicy"],
    ],
  },
  {
    title: "Submitted Documents",
    fields: [
      ["Business Registration", "businessRegistrationFileName"],
      ["PAN Document", "panDocumentFileName"],
      ["GST Document", "gstDocumentFileName"],
      ["Address Proof", "addressProofFileName"],
      ["Brand Authorization", "brandAuthorizationFileName"],
      ["Product Catalogue", "productCatalogueFileName"],
    ],
  },
  {
    title: "Declarations and Consent",
    fields: [
      ["Terms Accepted", "termsAccepted"],
      ["Verification Consent", "verificationConsent"],
      ["Product Authenticity Consent", "productAuthenticityConsent"],
    ],
  },
] as const;

const documentFlagMap: Record<string, string> = {
  businessRegistrationFileName: "hasBusinessRegistration",
  panDocumentFileName: "hasPanDocument",
  gstDocumentFileName: "hasGstDocument",
  addressProofFileName: "hasAddressProof",
  brandAuthorizationFileName: "hasBrandAuthorizationDocument",
  productCatalogueFileName: "hasProductCatalogue",
};

// =========================================================
// MAIN COMPONENT
// =========================================================

export default function Products() {
  const [activeTab, setActiveTab] =
    useState<MarketplaceTab>("onboarding");

  const [products, setProducts] =
    useState<SellerProduct[]>(readProducts);

  const [sellerApplications, setSellerApplications] =
    useState<SellerApplication[]>(readSellerApplications);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All categories");

  const [selectedItem, setSelectedItem] =
    useState<InventoryItem | null>(null);

  const [selectedSeller, setSelectedSeller] =
    useState<SellerApplication | null>(null);

  const [page, setPage] = useState(1);
  const [remarkText, setRemarkText] = useState("");
  const [suspensionReason, setSuspensionReason] = useState("");
  const [showSuspendForm, setShowSuspendForm] = useState(false);

  const pageSize = 8;

  // =======================================================
  // LIVE PRODUCT AND SELLER SYNCHRONIZATION
  // =======================================================

  useEffect(() => {
    const unsubscribe = subscribeToSellerProducts(() => {
      // Always re-read from the shared catalogue so that
      // all product metadata is normalized consistently.
      setProducts(readProducts());
    });

    const refreshSellers = () => {
      setSellerApplications(readSellerApplications());
    };

    const refreshProducts = () => {
      setProducts(readProducts());
    };

    window.addEventListener(SELLER_EVENT, refreshSellers);
    window.addEventListener(WORKSPACE_EVENT, refreshSellers);
    window.addEventListener("storage", refreshSellers);
    window.addEventListener("storage", refreshProducts);

    return () => {
      unsubscribe();
      window.removeEventListener(SELLER_EVENT, refreshSellers);
      window.removeEventListener(WORKSPACE_EVENT, refreshSellers);
      window.removeEventListener("storage", refreshSellers);
      window.removeEventListener("storage", refreshProducts);
    };
  }, []);

  // =======================================================
  // SELLER FILTERS
  // =======================================================

  const pendingSellers = useMemo(
    () => sellerApplications.filter(isPendingSeller),
    [sellerApplications]
  );

  const approvedSellers = useMemo(
    () => sellerApplications.filter(isApprovedSeller),
    [sellerApplications]
  );

  const suspendedSellers = useMemo(
    () => sellerApplications.filter(isSuspendedSeller),
    [sellerApplications]
  );

  const rejectedSellers = useMemo(
    () => sellerApplications.filter(isRejectedSeller),
    [sellerApplications]
  );

  // =======================================================
  // PRODUCT INVENTORY
  // IMPORTANT: show ALL seller products to admin.
  // Do not filter by seller account approval here.
  // =======================================================

  const inventory: InventoryItem[] = useMemo(() => {
    return products.map((product) => {
      const matchedSeller = sellerApplications.find((seller) =>
        productBelongsToSeller(product, seller)
      );

      const vendor =
        product.sellerName ||
        matchedSeller?.businessName ||
        matchedSeller?.contactName ||
        matchedSeller?.fullName ||
        "Unmatched seller";

      return {
        ...product,
        vendor,
        liabilityStatus:
          product.liabilityStatus === "Acknowledged"
            ? "Acknowledged"
            : "Pending",
      };
    });
  }, [products, sellerApplications]);

  // Products from approved seller accounts.
  // Used for publication statistics, not admin visibility.
  const eligibleProducts = useMemo(
    () =>
      products.filter((product) =>
        approvedSellers.some((seller) =>
          productBelongsToSeller(product, seller)
        )
      ),
    [products, approvedSellers]
  );

  const categories = useMemo(
    () => [
      "All categories",
      ...Array.from(
        new Set(
          inventory
            .map((item) => String(item.category || "").trim())
            .filter(Boolean)
        )
      ).sort(),
    ],
    [inventory]
  );

  const filteredInventory = useMemo(() => {
    const query = search.trim().toLowerCase();

    return inventory.filter((item) => {
      const matchesCategory =
        category === "All categories" ||
        item.category === category;

      const matchesSearch =
        !query ||
        [
          item.name,
          item.id,
          item.sku,
          item.vendor,
          item.category,
        ].some((value) => normalize(value).includes(query));

      return matchesCategory && matchesSearch;
    });
  }, [inventory, search, category]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredInventory.length / pageSize)
  );

  const safePage = Math.min(page, totalPages);

  const paginatedInventory = filteredInventory.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize
  );

  const pendingProductCount = products.filter(
    (product) => getAdminStatus(product) === "Pending Review"
  ).length;

  // Approved products can retain their original seller-side
  // status of "Pending Review". Admin approval is separate.
  const approvedProducts = eligibleProducts.filter(
    (product) =>
      getAdminStatus(product) === "Approved" &&
      ["active", "pending review"].includes(
        normalize(product.status)
      ) &&
      Number(product.stock) > 0
  );

  // =======================================================
  // SAVE PRODUCTS TO SHARED CATALOGUE
  // =======================================================

  const saveProducts = (updated: SellerProduct[]) => {
    try {
      saveSellerProducts(
        updated.map((product) => ({
          ...product,
          id: String(product.id),
          adminStatus: normalizeAdminStatus(product.adminStatus),
        })) as unknown as SharedSellerProduct[]
      );

      setProducts(updated);
    } catch (error) {
      console.error("Unable to save marketplace products:", error);
    }
  };

  // =======================================================
  // PRODUCT ADMIN APPROVAL
  // =======================================================

  const updateAdminStatus = (
    id: string,
    adminStatus: AdminStatus
  ) => {
    const updated = products.map((product) =>
      String(product.id) === String(id)
        ? {
            ...product,
            adminStatus,
            updatedAt: new Date().toISOString(),
          }
        : product
    );

    saveProducts(updated);
    setSelectedItem(null);
  };

  // =======================================================
  // SELLER UPDATE
  // =======================================================

  const persistSellerUpdate = (
    sellerId: string,
    updater: (seller: SellerApplication) => SellerApplication
  ) => {
    const updated = sellerApplications.map((seller) =>
      String(seller.id) === String(sellerId)
        ? updater(seller)
        : seller
    );

    saveSellerApplications(updated);
    setSellerApplications(updated);

    const refreshed = updated.find(
      (seller) => String(seller.id) === String(sellerId)
    );

    setSelectedSeller(refreshed || null);
  };

  const updateSellerStatus = (
    sellerId: string,
    status: "Approved" | "Rejected"
  ) => {
    const now = new Date().toISOString();

    persistSellerUpdate(sellerId, (seller) => ({
      ...seller,
      status,
      ...(status === "Approved"
        ? {
            approvedAt: now,
            rejectedAt: undefined,
          }
        : {
            rejectedAt: now,
            approvedAt: undefined,
          }),
    }));

    setSelectedSeller(null);
  };

  // =======================================================
  // SELLER REMARKS
  // =======================================================

  const addSellerRemark = () => {
    const text = remarkText.trim();

    if (!text || !selectedSeller) return;

    persistSellerUpdate(selectedSeller.id, (seller) => ({
      ...seller,
      remarks: [
        ...(Array.isArray(seller.remarks) ? seller.remarks : []),
        {
          id: `${Date.now()}`,
          text,
          createdAt: new Date().toISOString(),
        },
      ],
    }));

    setRemarkText("");
  };

  // =======================================================
  // SUSPEND SELLER
  // =======================================================

  const suspendSeller = () => {
    const reason = suspensionReason.trim();

    if (!reason || !selectedSeller) return;

    const now = new Date().toISOString();

    persistSellerUpdate(selectedSeller.id, (seller) => ({
      ...seller,
      status: "Suspended",
      suspensionReason: reason,
      suspendedAt: now,
      suspensionHistory: [
        ...(Array.isArray(seller.suspensionHistory)
          ? seller.suspensionHistory
          : []),
        {
          reason,
          suspendedAt: now,
        },
      ],
    }));

    setSuspensionReason("");
    setShowSuspendForm(false);
  };

  // =======================================================
  // REACTIVATE SELLER
  // =======================================================

  const reactivateSeller = () => {
    if (!selectedSeller) return;

    const now = new Date().toISOString();

    persistSellerUpdate(selectedSeller.id, (seller) => {
      const history = Array.isArray(seller.suspensionHistory)
        ? [...seller.suspensionHistory]
        : [];

      if (
        history.length &&
        !history[history.length - 1].reactivatedAt
      ) {
        history[history.length - 1] = {
          ...history[history.length - 1],
          reactivatedAt: now,
        };
      }

      return {
        ...seller,
        status: "Approved",
        reactivatedAt: now,
        suspensionHistory: history,
      };
    });

    setShowSuspendForm(false);
  };

  // =======================================================
  // UI HELPERS
  // =======================================================

  const clearFilters = () => {
    setSearch("");
    setCategory("All categories");
    setPage(1);
  };

  const hasFilters =
    search.trim() !== "" || category !== "All categories";

  const selectedStatus = selectedItem
    ? getAdminStatus(selectedItem)
    : null;

  const changeTab = (tab: MarketplaceTab) => {
    setActiveTab(tab);
    setSelectedItem(null);
    setSelectedSeller(null);
    setPage(1);
  };

  const openSeller = (seller: SellerApplication) => {
    setSelectedSeller(seller);
    setRemarkText("");
    setSuspensionReason("");
    setShowSuspendForm(false);
  };

  // =======================================================
  // RENDER
  // =======================================================

  return (
    <div className="products-admin-page">
      <section className="products-admin-header">
        <div>
          <div className="products-admin-eyebrow">
            MARKETPLACE MANAGEMENT
          </div>
          <h1>Marketplace</h1>
          <p>
            Manage seller onboarding, approved seller accounts,
            and product publishing.
          </p>
        </div>
      </section>

      <section className="products-liability-banner">
        <div className="products-liability-icon">
          <AlertCircle size={18} />
        </div>
        <div>
          <strong>
            Zero Commission Store – Direct Seller Responsibility
          </strong>
          <span>
            Sellers remain responsible for product warranties,
            authenticity, and fulfilment.
          </span>
        </div>
      </section>

      {/* MARKETPLACE STATISTICS */}

      <section className="products-vendor-grid marketplace-kpi-grid">
        <article className="products-vendor-card marketplace-kpi-card">
          <div className="marketplace-kpi-icon blue">
            <Store size={22} />
          </div>
          <div className="marketplace-kpi-content">
            <span>Active Sellers</span>
            <strong>{approvedSellers.length}</strong>
            <small>
              <CheckCircle2 size={12} />
              Approved seller accounts
            </small>
          </div>
        </article>

        <article className="products-vendor-card marketplace-kpi-card">
          <div className="marketplace-kpi-icon purple">
            <Package size={22} />
          </div>
          <div className="marketplace-kpi-content">
            <span>Total Products</span>
            <strong>{products.length}</strong>
            <small>
              <TrendingUp size={12} />
              All submitted products
            </small>
          </div>
        </article>

        <article className="products-vendor-card marketplace-kpi-card">
          <div className="marketplace-kpi-icon orange">
            <Clock3 size={22} />
          </div>
          <div className="marketplace-kpi-content">
            <span>Onboarding Requests</span>
            <strong>{pendingSellers.length}</strong>
            <small className="marketplace-kpi-pending">
              Awaiting verification
            </small>
          </div>
        </article>

        <article className="products-vendor-card marketplace-kpi-card">
          <div className="marketplace-kpi-icon green">
            <CheckCircle2 size={22} />
          </div>
          <div className="marketplace-kpi-content">
            <span>Approved Products</span>
            <strong>{approvedProducts.length}</strong>
            <small>
              <CheckCircle2 size={12} />
              Active and in stock
            </small>
          </div>
        </article>

        <article className="products-vendor-card marketplace-kpi-card">
          <div className="marketplace-kpi-icon teal">
            <ShieldAlert size={22} />
          </div>
          <div className="marketplace-kpi-content">
            <span>Suspended Sellers</span>
            <strong>{suspendedSellers.length}</strong>
            <small>Temporarily restricted accounts</small>
          </div>
        </article>
      </section>

      {/* MARKETPLACE TABS */}

      <div className="products-marketplace-tabs">
        <button
          type="button"
          className={`products-marketplace-tab ${
            activeTab === "onboarding" ? "active" : ""
          }`}
          onClick={() => changeTab("onboarding")}
        >
          <ClipboardCheck size={17} />
          Onboarding Requests
          <span className="products-marketplace-tab-count pending">
            {pendingSellers.length}
          </span>
        </button>

        <button
          type="button"
          className={`products-marketplace-tab ${
            activeTab === "sellers" ? "active" : ""
          }`}
          onClick={() => changeTab("sellers")}
        >
          <Users size={17} />
          Sellers
          <span className="products-marketplace-tab-count">
            {approvedSellers.length + suspendedSellers.length}
          </span>
        </button>

        <button
          type="button"
          className={`products-marketplace-tab ${
            activeTab === "products" ? "active" : ""
          }`}
          onClick={() => changeTab("products")}
        >
          <Package size={17} />
          Products
          <span className="products-marketplace-tab-count">
            {products.length}
          </span>
        </button>
      </div>

      {/* ===================================================
          ONBOARDING REQUESTS
      =================================================== */}

      {activeTab === "onboarding" && (
        <section className="products-inventory-card">
          <div className="products-section-heading">
            <div>
              <h2>Seller Onboarding Requests</h2>
              <p>
                Review submitted seller credentials before
                activating their Marketplace account.
              </p>
            </div>
            <span className="products-liability-status pending">
              {pendingSellers.length} Pending
            </span>
          </div>

          <div className="products-inventory-table-wrapper">
            <table className="products-inventory-table">
              <thead>
                <tr>
                  <th>SELLER / BUSINESS</th>
                  <th>CONTACT</th>
                  <th>BUSINESS TYPE</th>
                  <th>CATEGORIES</th>
                  <th>SUBMITTED</th>
                  <th>STATUS</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>

              <tbody>
                {pendingSellers.map((seller) => (
                  <tr key={seller.id}>
                    <td>
                      <div className="products-item-name">
                        <div className="products-item-icon">
                          <Store size={16} />
                        </div>
                        <div>
                          <strong>
                            {getText(
                              seller.businessName,
                              getText(seller.contactName, "Seller")
                            )}
                          </strong>
                          <span>{seller.id}</span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div className="products-vendor-name">
                        {getText(seller.contactName)}
                      </div>
                      <span className="products-secondary-line">
                        {getText(seller.mobile)}
                      </span>
                    </td>

                    <td>
                      {getText(
                        seller.businessType,
                        getText(seller.sellerType)
                      )}
                    </td>

                    <td>{getText(seller.categories)}</td>
                    <td>{formatDate(seller.submittedAt)}</td>

                    <td>
                      <span className="products-liability-status pending">
                        Pending Review
                      </span>
                    </td>

                    <td>
                      <button
                        type="button"
                        className="products-remove-button"
                        onClick={() => openSeller(seller)}
                      >
                        <Eye size={14} />
                        View Profile
                      </button>
                    </td>
                  </tr>
                ))}

                {!pendingSellers.length && (
                  <tr>
                    <td colSpan={7}>
                      <div className="products-empty-state">
                        <ClipboardCheck size={28} />
                        <strong>No onboarding requests</strong>
                        <span>
                          New seller registrations will appear
                          here when submitted.
                        </span>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* ===================================================
          SELLER ACCOUNTS
      =================================================== */}

      {activeTab === "sellers" && (
        <section className="products-inventory-card">
          <div className="products-section-heading">
            <div>
              <h2>Seller Accounts</h2>
              <p>
                View seller details, add internal remarks, and
                manage account access.
              </p>
            </div>

            <div className="products-seller-counts">
              <span className="products-liability-status acknowledged">
                {approvedSellers.length} Active
              </span>
              <span className="products-liability-status suspended">
                {suspendedSellers.length} Suspended
              </span>
            </div>
          </div>

          <div className="products-inventory-table-wrapper">
            <table className="products-inventory-table">
              <thead>
                <tr>
                  <th>SELLER / BUSINESS</th>
                  <th>OWNER</th>
                  <th>BUSINESS TYPE</th>
                  <th>LOCATION</th>
                  <th>PRODUCTS</th>
                  <th>STATUS</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>

              <tbody>
                {[...approvedSellers, ...suspendedSellers].map(
                  (seller) => {
                    const sellerProducts = products.filter((product) =>
                      productBelongsToSeller(product, seller)
                    );

                    const approvedCount = sellerProducts.filter(
                      (product) =>
                        getAdminStatus(product) === "Approved"
                    ).length;

                    return (
                      <tr key={seller.id}>
                        <td>
                          <div className="products-item-name">
                            <div className="products-item-icon">
                              <Store size={16} />
                            </div>
                            <div>
                              <strong>
                                {getText(seller.businessName, "Seller")}
                              </strong>
                              <span>{seller.id}</span>
                            </div>
                          </div>
                        </td>

                        <td>
                          {getText(
                            seller.contactName || seller.fullName
                          )}
                        </td>

                        <td>
                          {getText(
                            seller.businessType,
                            getText(seller.sellerType)
                          )}
                        </td>

                        <td>
                          {[seller.city, seller.state]
                            .filter(Boolean)
                            .join(", ") || "Not provided"}
                        </td>

                        <td>
                          <span className="products-listing-count">
                            {sellerProducts.length} submitted /{" "}
                            {approvedCount} approved
                          </span>
                        </td>

                        <td>
                          <span
                            className={`products-liability-status ${
                              isSuspendedSeller(seller)
                                ? "suspended"
                                : "acknowledged"
                            }`}
                          >
                            {isSuspendedSeller(seller)
                              ? "Suspended"
                              : "Active"}
                          </span>
                        </td>

                        <td>
                          <button
                            type="button"
                            className="products-remove-button"
                            onClick={() => openSeller(seller)}
                          >
                            <Eye size={14} />
                            View Profile
                          </button>
                        </td>
                      </tr>
                    );
                  }
                )}

                {!approvedSellers.length &&
                  !suspendedSellers.length && (
                    <tr>
                      <td colSpan={7}>
                        <div className="products-empty-state">
                          <Users size={28} />
                          <strong>No approved sellers yet</strong>
                          <span>
                            Approved seller accounts will appear
                            here after onboarding verification.
                          </span>
                        </div>
                      </td>
                    </tr>
                  )}
              </tbody>
            </table>
          </div>

          {rejectedSellers.length > 0 && (
            <div className="products-table-note">
              Rejected applications:{" "}
              <strong>{rejectedSellers.length}</strong>
            </div>
          )}
        </section>
      )}

      {/* ===================================================
          PRODUCT REVIEW
          Shows products from ALL sellers.
      =================================================== */}

      {activeTab === "products" && (
        <section className="products-inventory-card">
          <div className="products-section-heading">
            <div>
              <h2>Product Review and Management</h2>
              <p>
                Review submitted products. Seller approval and
                product approval are separate checks.
              </p>
            </div>

            <span className="products-liability-status pending">
              {pendingProductCount} Pending Review
            </span>
          </div>

          <div className="products-inventory-filter">
            <div className="products-inventory-search">
              <Search size={17} />

              <input
                placeholder="Search products or sellers"
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
              />

              {search && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setPage(1);
                  }}
                  aria-label="Clear search"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <div className="products-category-select">
              <select
                value={category}
                onChange={(event) => {
                  setCategory(event.target.value);
                  setPage(1);
                }}
              >
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
              <ChevronDown size={16} />
            </div>

            {hasFilters && (
              <button
                type="button"
                className="products-clear-filter"
                onClick={clearFilters}
              >
                Clear
              </button>
            )}
          </div>

          <div className="products-inventory-table-wrapper">
            <table className="products-inventory-table">
              <thead>
                <tr>
                  <th>ITEM</th>
                  <th>SELLER</th>
                  <th>CATEGORY</th>
                  <th>PRICE</th>
                  <th>STOCK</th>
                  <th>ADMIN STATUS</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>

              <tbody>
                {paginatedInventory.map((item) => {
                  const status = getAdminStatus(item);

                  return (
                    <tr key={item.id}>
                      <td>
                        <div className="products-item-name">
                          <div className="products-item-icon">
                            <Package size={16} />
                          </div>
                          <div>
                            <strong>{item.name}</strong>
                            <span>{item.sku || item.id}</span>
                          </div>
                        </div>
                      </td>

                      <td>{item.vendor}</td>
                      <td>{item.category}</td>

                      <td>
                        ₹
                        {Number(item.price || 0).toLocaleString(
                          "en-IN"
                        )}
                      </td>

                      <td>{item.stock}</td>

                      <td>
                        <span
                          className={`products-liability-status ${
                            status === "Approved"
                              ? "acknowledged"
                              : status === "Rejected" ||
                                  status === "Removed"
                                ? "rejected"
                                : "pending"
                          }`}
                        >
                          {status}
                        </span>
                      </td>

                      <td>
                        <button
                          type="button"
                          className="products-remove-button"
                          onClick={() => setSelectedItem(item)}
                        >
                          View Listing
                        </button>
                      </td>
                    </tr>
                  );
                })}

                {!filteredInventory.length && (
                  <tr>
                    <td colSpan={7}>
                      <div className="products-empty-state">
                        <Package size={28} />
                        <strong>No products found</strong>
                        <span>
                          {products.length === 0
                            ? "Products submitted by sellers will appear here when saved to the shared catalogue."
                            : "No matching products were found."}
                        </span>

                        {hasFilters && (
                          <button
                            type="button"
                            onClick={clearFilters}
                          >
                            Clear filters
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="products-pagination">
            <span>
              Showing{" "}
              <strong>
                {filteredInventory.length
                  ? (safePage - 1) * pageSize + 1
                  : 0}
                –
                {Math.min(
                  safePage * pageSize,
                  filteredInventory.length
                )}
              </strong>{" "}
              of <strong>{filteredInventory.length}</strong> items
            </span>

            <div className="products-pagination-controls">
              <button
                type="button"
                disabled={safePage === 1}
                onClick={() =>
                  setPage((current) => Math.max(1, current - 1))
                }
                aria-label="Previous page"
              >
                <ChevronLeft size={15} />
              </button>

              <button type="button" className="active">
                {safePage}
              </button>

              <button
                type="button"
                disabled={safePage >= totalPages}
                onClick={() =>
                  setPage((current) =>
                    Math.min(totalPages, current + 1)
                  )
                }
                aria-label="Next page"
              >
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ===================================================
          SELLER PROFILE MODAL
      =================================================== */}

      {selectedSeller && (
        <div
          className="products-modal-backdrop"
          onClick={() => setSelectedSeller(null)}
        >
          <div
            className="products-modal products-seller-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="products-modal-header">
              <div>
                <span>SELLER ACCOUNT PROFILE</span>
                <h2>
                  {getText(
                    selectedSeller.businessName,
                    getText(
                      selectedSeller.contactName,
                      "Seller Profile"
                    )
                  )}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setSelectedSeller(null)}
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="products-seller-summary">
              <div className="products-seller-summary-icon">
                <Store size={25} />
              </div>

              <div className="products-seller-summary-info">
                <strong>
                  {getText(
                    selectedSeller.contactName ||
                      selectedSeller.fullName
                  )}
                </strong>
                <span>{getText(selectedSeller.email)}</span>
                <span>
                  Application ID: {selectedSeller.id}
                </span>
              </div>

              <span
                className={`products-liability-status ${
                  isSuspendedSeller(selectedSeller)
                    ? "suspended"
                    : isApprovedSeller(selectedSeller)
                      ? "acknowledged"
                      : isRejectedSeller(selectedSeller)
                        ? "rejected"
                        : "pending"
                }`}
              >
                {getSellerStatus(selectedSeller)}
              </span>
            </div>

            {sellerDetailSections.map((section) => {
              const visibleFields = section.fields.filter(
                ([, key]) =>
                  selectedSeller[key] !== undefined &&
                  selectedSeller[key] !== null &&
                  selectedSeller[key] !== ""
              );

              if (!visibleFields.length) return null;

              return (
                <div
                  className="products-seller-profile-section"
                  key={section.title}
                >
                  <h3>{section.title}</h3>

                  <div className="products-modal-grid">
                    {visibleFields.map(([label, key]) => {
                      let value: unknown = selectedSeller[key];

                      if (documentFlagMap[key]) {
                        value = value
                          ? String(value)
                          : selectedSeller[
                                documentFlagMap[key]
                              ]
                            ? "Submitted (file not stored in browser)"
                            : "Not supplied";
                      }

                      return (
                        <div key={key}>
                          <span>{label}</span>
                          <strong>{getText(value)}</strong>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {/* ACCOUNT TIMELINE */}

            <div className="products-seller-profile-section">
              <h3>Account Timeline</h3>

              <div className="products-modal-grid">
                <div>
                  <span>APPLICATION SUBMITTED</span>
                  <strong>
                    <CalendarDays size={14} />
                    {formatDate(selectedSeller.submittedAt)}
                  </strong>
                </div>

                {selectedSeller.approvedAt && (
                  <div>
                    <span>APPROVED ON</span>
                    <strong>
                      {formatDate(selectedSeller.approvedAt)}
                    </strong>
                  </div>
                )}

                {selectedSeller.rejectedAt && (
                  <div>
                    <span>REJECTED ON</span>
                    <strong>
                      {formatDate(selectedSeller.rejectedAt)}
                    </strong>
                  </div>
                )}

                {selectedSeller.suspendedAt && (
                  <div>
                    <span>LAST SUSPENDED ON</span>
                    <strong>
                      {formatDate(selectedSeller.suspendedAt)}
                    </strong>
                  </div>
                )}

                {selectedSeller.reactivatedAt && (
                  <div>
                    <span>LAST REACTIVATED ON</span>
                    <strong>
                      {formatDate(selectedSeller.reactivatedAt)}
                    </strong>
                  </div>
                )}
              </div>
            </div>

            {/* SUSPENSION HISTORY */}

            {(isSuspendedSeller(selectedSeller) ||
              (Array.isArray(selectedSeller.suspensionHistory) &&
                selectedSeller.suspensionHistory.length > 0)) && (
              <div className="products-seller-profile-section">
                <h3>Suspension Details and History</h3>

                {isSuspendedSeller(selectedSeller) && (
                  <div className="products-suspension-alert">
                    <ShieldAlert size={18} />
                    <div>
                      <strong>
                        This seller account is suspended
                      </strong>
                      <span>
                        Reason:{" "}
                        {getText(selectedSeller.suspensionReason)}
                      </span>
                      <span>
                        Suspended on:{" "}
                        {formatDate(selectedSeller.suspendedAt)}
                      </span>
                    </div>
                  </div>
                )}

                <div className="products-history-list">
                  {(
                    Array.isArray(selectedSeller.suspensionHistory)
                      ? selectedSeller.suspensionHistory
                      : []
                  ).map((record, index) => (
                    <div
                      className="products-history-item"
                      key={`${record.suspendedAt}-${index}`}
                    >
                      <div>
                        <strong>Suspension {index + 1}</strong>
                        <span>{record.reason}</span>
                      </div>

                      <small>
                        Suspended: {formatDate(record.suspendedAt)}
                      </small>

                      {record.reactivatedAt && (
                        <small>
                          Reactivated:{" "}
                          {formatDate(record.reactivatedAt)}
                        </small>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* INTERNAL REMARKS */}

            <div className="products-seller-profile-section">
              <h3>Internal Admin Remarks</h3>

              <div className="products-remark-composer">
                <textarea
                  value={remarkText}
                  onChange={(event) =>
                    setRemarkText(event.target.value)
                  }
                  placeholder="Add an internal remark about this seller..."
                  rows={3}
                />

                <button
                  type="button"
                  className="products-modal-primary"
                  disabled={!remarkText.trim()}
                  onClick={addSellerRemark}
                >
                  <MessageSquare size={15} />
                  Save Remark
                </button>
              </div>

              <div className="products-remarks-list">
                {(
                  Array.isArray(selectedSeller.remarks)
                    ? selectedSeller.remarks
                    : []
                ).length ? (
                  [...(selectedSeller.remarks as SellerRemark[])]
                    .reverse()
                    .map((remark) => (
                      <article
                        className="products-remark-item"
                        key={remark.id}
                      >
                        <p>{remark.text}</p>
                        <time>
                          {formatDate(remark.createdAt)}
                        </time>
                      </article>
                    ))
                ) : (
                  <p className="products-no-remarks">
                    No remarks have been added for this seller.
                  </p>
                )}
              </div>
            </div>

            <div className="products-warning-box">
              <AlertCircle size={16} />
              <span>
                Document submission indicators are shown when
                available. Actual file previews require secure
                backend document storage. Remarks and account
                actions are saved in this browser's local storage.
              </span>
            </div>

            {/* SELLER ACTIONS */}

            <div className="products-modal-footer">
              <button
                type="button"
                className="products-modal-secondary"
                onClick={() => setSelectedSeller(null)}
              >
                Close
              </button>

              {isPendingSeller(selectedSeller) && (
                <>
                  <button
                    type="button"
                    className="products-modal-danger"
                    onClick={() =>
                      updateSellerStatus(
                        selectedSeller.id,
                        "Rejected"
                      )
                    }
                  >
                    <Ban size={15} />
                    Reject Application
                  </button>

                  <button
                    type="button"
                    className="products-modal-primary"
                    onClick={() =>
                      updateSellerStatus(
                        selectedSeller.id,
                        "Approved"
                      )
                    }
                  >
                    <Check size={15} />
                    Approve Seller
                  </button>
                </>
              )}

              {isApprovedSeller(selectedSeller) &&
                !showSuspendForm && (
                  <button
                    type="button"
                    className="products-modal-danger"
                    onClick={() => setShowSuspendForm(true)}
                  >
                    <ShieldAlert size={15} />
                    Suspend Seller
                  </button>
                )}

              {isSuspendedSeller(selectedSeller) && (
                <button
                  type="button"
                  className="products-modal-primary"
                  onClick={reactivateSeller}
                >
                  <RotateCcw size={15} />
                  Reactivate Seller
                </button>
              )}
            </div>

            {/* SUSPENSION FORM */}

            {showSuspendForm &&
              isApprovedSeller(selectedSeller) && (
                <div className="products-suspend-panel">
                  <div>
                    <strong>Suspend seller account</strong>
                    <span>
                      The seller will be removed from active seller
                      access until reactivated.
                    </span>
                  </div>

                  <textarea
                    rows={3}
                    value={suspensionReason}
                    onChange={(event) =>
                      setSuspensionReason(event.target.value)
                    }
                    placeholder="Enter the reason for suspension (required)..."
                  />

                  <div className="products-suspend-actions">
                    <button
                      type="button"
                      className="products-modal-secondary"
                      onClick={() => {
                        setShowSuspendForm(false);
                        setSuspensionReason("");
                      }}
                    >
                      Cancel
                    </button>

                    <button
                      type="button"
                      className="products-modal-danger"
                      disabled={!suspensionReason.trim()}
                      onClick={suspendSeller}
                    >
                      <ShieldAlert size={15} />
                      Confirm Suspension
                    </button>
                  </div>
                </div>
              )}
          </div>
        </div>
      )}

      {/* ===================================================
          PRODUCT DETAILS AND APPROVAL MODAL
      =================================================== */}

      {selectedItem && (
        <div
          className="products-modal-backdrop"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="products-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="products-modal-header">
              <div>
                <span>PRODUCT REVIEW</span>
                <h2>{selectedItem.name}</h2>
              </div>

              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            {selectedItem.images?.[0] && (
              <div className="products-product-image-wrap">
                {selectedItem.images[0].startsWith("http") ||
                selectedItem.images[0].startsWith("data:") ? (
                  <img
                    src={selectedItem.images[0]}
                    alt={selectedItem.name}
                  />
                ) : (
                  <div>
                    <ImageIcon size={18} />
                    {selectedItem.images[0]}
                  </div>
                )}
              </div>
            )}

            <div className="products-modal-grid">
              {[
                ["SELLER", selectedItem.vendor],
                ["CATEGORY", selectedItem.category],
                [
                  "PRICE",
                  `₹${Number(
                    selectedItem.price || 0
                  ).toLocaleString("en-IN")}`,
                ],
                [
                  "ORIGINAL PRICE",
                  `₹${Number(
                    selectedItem.originalPrice ||
                      selectedItem.price ||
                      0
                  ).toLocaleString("en-IN")}`,
                ],
                ["AVAILABLE STOCK", String(selectedItem.stock)],
                ["PRODUCT STATUS", selectedItem.status],
                ["ADMIN STATUS", String(selectedStatus)],
                ["SKU", selectedItem.sku || "Not provided"],
                ["LISTING ID", selectedItem.id],
              ].map(([label, value]) => (
                <div key={label}>
                  <span>{label}</span>
                  <strong>{value}</strong>
                </div>
              ))}
            </div>

            <div className="products-product-description">
              <span>PRODUCT DESCRIPTION</span>
              <p>
                {selectedItem.description ||
                  "No description provided."}
              </p>
            </div>

            <div className="products-warning-box">
              <AlertCircle size={16} />
              <span>
                Products can be reviewed even when their seller
                account is awaiting approval. Public listings
                still require an approved seller, Approved admin
                product status, Active product status, and
                available stock.
              </span>
            </div>

            <div className="products-modal-footer">
              <button
                type="button"
                className="products-modal-secondary"
                onClick={() => setSelectedItem(null)}
              >
                Close
              </button>

              {selectedStatus !== "Approved" && (
                <button
                  type="button"
                  className="products-modal-danger"
                  onClick={() =>
                    updateAdminStatus(
                      selectedItem.id,
                      "Rejected"
                    )
                  }
                >
                  <Ban size={15} />
                  Reject
                </button>
              )}

              {selectedStatus !== "Approved" && (
                <button
                  type="button"
                  className="products-modal-primary"
                  onClick={() =>
                    updateAdminStatus(
                      selectedItem.id,
                      "Approved"
                    )
                  }
                >
                  <Check size={15} />
                  Approve Product
                </button>
              )}

              {selectedStatus === "Approved" && (
                <button
                  type="button"
                  className="products-modal-secondary"
                  onClick={() =>
                    updateAdminStatus(
                      selectedItem.id,
                      "Pending Review"
                    )
                  }
                >
                  <Clock3 size={15} />
                  Move to Review
                </button>
              )}

              {selectedStatus !== "Removed" && (
                <button
                  type="button"
                  className="products-modal-danger"
                  onClick={() =>
                    updateAdminStatus(
                      selectedItem.id,
                      "Removed"
                    )
                  }
                >
                  Remove Listing
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
