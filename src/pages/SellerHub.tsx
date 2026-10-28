
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { FormEvent } from "react";
import {
  AlertTriangle,
  ArrowRight,
  Bell,
  Box,
  Check,
  ChevronDown,
  ChevronRight,
  IndianRupee,
  MoreVertical,
  Package,
  Plus,
  Search,
  ShoppingBag,
  Truck,
  UserRound,
  X,
  Save,
  Pencil,
  RefreshCw,
  Star,
  MessageSquareText,
  BadgeCheck,
  Trash2,
} from "lucide-react";
import "./SellerHub.css";

type Product = {
  id: number;
  name: string;
  sku: string;
  category: string;
  stock: number;
  price: number;
  icon: "filter" | "capacitor" | "socket" | "other";
};

type ProductForm = {
  name: string;
  sku: string;
  category: string;
  stock: string;
  price: string;
};

type ModalMode = "add" | "edit" | "restock" | null;

type SellerProfileDetails = {
  businessName: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  gstin: string;
};

type LoggedInUser = {
  name?: string;
  fullName?: string;
  businessName?: string;
  email?: string;
  mobile?: string;
  phone?: string;
};

const SELLER_PROFILE_KEY = "oneservice-seller-profile";
const USER_KEY = "oneservice_user";

const emptySellerProfile: SellerProfileDetails = {
  businessName: "",
  contactPerson: "",
  email: "",
  phone: "",
  address: "",
  gstin: "",
};

function getLoggedInUser(): LoggedInUser {
  try {
    const saved = localStorage.getItem(USER_KEY);
    return saved ? (JSON.parse(saved) as LoggedInUser) : {};
  } catch (error) {
    console.error("Could not load logged-in user:", error);
    return {};
  }
}

function getDefaultSellerProfile(): SellerProfileDetails {
  const user = getLoggedInUser();
  const name =
    user.name?.trim() ||
    user.fullName?.trim() ||
    user.mobile ||
    user.phone ||
    "";

  return {
    businessName: user.businessName?.trim() || name,
    contactPerson: name,
    email: user.email?.trim() || "",
    phone: user.mobile || user.phone || "",
    address: "",
    gstin: "",
  };
}

function getInitialSellerProfile(): SellerProfileDetails {
  const defaults = getDefaultSellerProfile();

  try {
    const saved = localStorage.getItem(SELLER_PROFILE_KEY);

    if (!saved) return defaults;

    const parsed = JSON.parse(saved) as Partial<SellerProfileDetails>;

    return {
      ...defaults,
      ...parsed,
      // Keep the logged-in identity when it is available.
      contactPerson: defaults.contactPerson || parsed.contactPerson || "",
      email: defaults.email || parsed.email || "",
      phone: defaults.phone || parsed.phone || "",
    };
  } catch (error) {
    console.error("Could not load seller profile:", error);
    return defaults;
  }
}

const initialProducts: Product[] = [
  {
    id: 1,
    name: "RO Purifier Copper Filter Cartridge (Universal)",
    sku: "RO-001",
    category: "Water Purifier Spares",
    stock: 24,
    price: 499,
    icon: "filter",
  },
  {
    id: 2,
    name: "1.5 Ton AC Capacitor 45 MFD",
    sku: "AC-002",
    category: "AC & Cooling Parts",
    stock: 12,
    price: 320,
    icon: "capacitor",
  },
  {
    id: 3,
    name: "Modular 16A Heavy Socket Switch",
    sku: "EL-003",
    category: "Electrical Fitting",
    stock: 0,
    price: 145,
    icon: "socket",
  },
];

const weeklySales = [
  { label: "Week 1", value: 20 },
  { label: "Week 2", value: 32 },
  { label: "Week 3", value: 38 },
  { label: "Week 4", value: 46 },
];

const emptyForm: ProductForm = {
  name: "",
  sku: "",
  category: "",
  stock: "",
  price: "",
};

function formatPrice(amount: number) {
  return `₹${amount.toLocaleString("en-IN")}`;
}

function ProductThumbnail({ type }: { type: Product["icon"] }) {
  return (
    <div className={`seller-product-thumbnail seller-thumbnail-${type}`}>
      {type === "filter" && (
        <div className="seller-filter-object">
          <span />
          <i />
        </div>
      )}

      {type === "capacitor" && (
        <div className="seller-capacitor-object">
          <span />
          <i />
        </div>
      )}

      {type === "socket" && (
        <div className="seller-socket-object">
          <span />
          <i />
          <b />
        </div>
      )}

      {type === "other" && <Package size={25} />}
    </div>
  );
}

export default function SellerHub() {
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [inventorySearch, setInventorySearch] = useState("");
  const [globalSearch, setGlobalSearch] = useState("");
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [activeProductId, setActiveProductId] = useState<number | null>(null);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [formError, setFormError] = useState("");
  const [menuProductId, setMenuProductId] = useState<number | null>(null);
  const [activeSummary, setActiveSummary] = useState<string | null>(null);
  const [showOrders, setShowOrders] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);

  const [showRemoveConfirmation, setShowRemoveConfirmation] = useState(false);
  const [removingAccount, setRemovingAccount] = useState(false);
  const [removeError, setRemoveError] = useState("");

  const [sellerProfile, setSellerProfile] =
    useState<SellerProfileDetails>(getInitialSellerProfile);

  const [draftSellerProfile, setDraftSellerProfile] =
    useState<SellerProfileDetails>(() => ({ ...sellerProfile }));

  const [isEditingSellerProfile, setIsEditingSellerProfile] = useState(false);
  const [sellerProfileSaveMessage, setSellerProfileSaveMessage] = useState("");

  const filteredProducts = useMemo(() => {
    const query = inventorySearch.trim().toLowerCase();

    if (!query) return products;

    return products.filter((product) =>
      [
        product.name,
        product.sku,
        product.category,
        String(product.price),
        String(product.stock),
      ].some((value) => value.toLowerCase().includes(query)),
    );
  }, [products, inventorySearch]);

  const globalMatches = useMemo(() => {
    const query = globalSearch.trim().toLowerCase();

    if (!query) return [];

    return products.filter((product) =>
      `${product.name} ${product.sku} ${product.category} ${product.price}`
        .toLowerCase()
        .includes(query),
    );
  }, [products, globalSearch]);

  const totalStock = products.reduce(
    (total, product) => total + product.stock,
    0,
  );

  const outOfStockCount = products.filter(
    (product) => product.stock === 0,
  ).length;

  const activeProduct = products.find(
    (product) => product.id === activeProductId,
  );

  const closeModal = () => {
    setModalMode(null);
    setActiveProductId(null);
    setForm(emptyForm);
    setFormError("");
  };

  const openProductModal = (
    product: Product,
    mode: "edit" | "restock",
  ) => {
    setActiveProductId(product.id);
    setForm({
      name: product.name,
      sku: product.sku,
      category: product.category,
      stock: mode === "restock" ? "" : String(product.stock),
      price: String(product.price),
    });
    setFormError("");
    setMenuProductId(null);
    setModalMode(mode);
  };

  const saveProduct = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError("");

    if (modalMode === "restock") {
      const quantity = Number(form.stock);

      if (
        form.stock.trim() === "" ||
        !Number.isFinite(quantity) ||
        !Number.isInteger(quantity) ||
        quantity <= 0
      ) {
        setFormError("Enter a whole-number restock quantity greater than zero.");
        return;
      }

      if (activeProductId === null) {
        setFormError("Select a product before updating stock.");
        return;
      }

      setProducts((current) =>
        current.map((product) =>
          product.id === activeProductId
            ? { ...product, stock: product.stock + quantity }
            : product,
        ),
      );

      setFeedback("Stock quantity updated in this session.");
      closeModal();
      return;
    }

    const stock = Number(form.stock);
    const price = Number(form.price);
    const name = form.name.trim();
    const sku = form.sku.trim();
    const category = form.category.trim();

    if (
      !name ||
      !sku ||
      !category ||
      form.stock.trim() === "" ||
      !Number.isFinite(stock) ||
      !Number.isInteger(stock) ||
      stock < 0 ||
      !Number.isFinite(price) ||
      price <= 0
    ) {
      setFormError(
        "Enter a product name, SKU, category, whole-number stock, and valid price.",
      );
      return;
    }

    const duplicateSku = products.some(
      (product) =>
        product.sku.toLowerCase() === sku.toLowerCase() &&
        (modalMode === "add" || product.id !== activeProductId),
    );

    if (duplicateSku) {
      setFormError("This SKU is already in use. Please enter a unique SKU.");
      return;
    }

    if (modalMode === "add") {
      setProducts((current) => [
        ...current,
        {
          id: Date.now(),
          name,
          sku,
          category,
          stock,
          price,
          icon: "other",
        },
      ]);
      setFeedback("Product added to your sample inventory.");
    } else if (modalMode === "edit" && activeProductId !== null) {
      setProducts((current) =>
        current.map((product) =>
          product.id === activeProductId
            ? { ...product, name, sku, category, stock, price }
            : product,
        ),
      );
      setFeedback("Product details updated in this session.");
    }

    closeModal();
  };

  const openSummary = (summary: string) => {
    setActiveSummary((current) => (current === summary ? null : summary));
    setShowOrders(false);
  };

  const selectGlobalMatch = (product: Product) => {
    setInventorySearch(product.sku);
    setGlobalSearch("");
    setActiveSummary("products");
  };

  const saveSellerProfile = () => {
    const businessName = draftSellerProfile.businessName.trim();
    const contactPerson = draftSellerProfile.contactPerson.trim();

    if (!businessName || !contactPerson) {
      setSellerProfileSaveMessage(
        "Business name and contact person are required.",
      );
      return;
    }

    try {
      const updatedProfile: SellerProfileDetails = {
        ...draftSellerProfile,
        businessName,
        contactPerson,
        email: draftSellerProfile.email.trim(),
        phone: draftSellerProfile.phone.replace(/\D/g, "").slice(0, 10),
        address: draftSellerProfile.address.trim(),
        gstin: draftSellerProfile.gstin.trim().toUpperCase().slice(0, 15),
      };

      localStorage.setItem(
        SELLER_PROFILE_KEY,
        JSON.stringify(updatedProfile),
      );

      setSellerProfile(updatedProfile);
      setDraftSellerProfile({ ...updatedProfile });
      setIsEditingSellerProfile(false);
      setSellerProfileSaveMessage("Profile changes saved successfully.");
      setFeedback("Seller profile updated successfully.");

      window.dispatchEvent(new Event("oneservice-seller-change"));
    } catch (error) {
      console.error("Could not save seller profile:", error);
      setSellerProfileSaveMessage(
        "Could not save your profile. Please check browser storage.",
      );
    }
  };

  // Removes seller-specific browser data. Server deletion requires a backend API.
  const removeAccount = () => {
    if (removingAccount) return;

    setRemoveError("");
    setRemovingAccount(true);

    try {
      const sellerKeys = [
        "oneservice-seller-profile",
        "oneservice_seller_profile",
        "oneservice_seller_application",
        "oneservice_partner_application",
        "oneservice_seller_products",
        "oneservice-seller-products",
        "oneservice_workspace_role",
      ];

      sellerKeys.forEach((key) => localStorage.removeItem(key));

      window.dispatchEvent(new Event("oneservice-seller-change"));
      window.dispatchEvent(new Event("oneservice-workspace-change"));

      setSellerProfile({ ...emptySellerProfile });
      setDraftSellerProfile({ ...emptySellerProfile });
      setIsEditingSellerProfile(false);
      setProfileOpen(false);
      setShowRemoveConfirmation(false);
      setFeedback("");

      navigate("/seller/products", { replace: true });
    } catch (error) {
      console.error("Could not remove seller account:", error);
      setRemoveError(
        "Unable to remove seller account data from this browser. Please try again.",
      );
    } finally {
      setRemovingAccount(false);
    }
  };

  const updateDraft = (
    field: keyof SellerProfileDetails,
    value: string,
  ) => {
    setDraftSellerProfile((current) => ({
      ...current,
      [field]: value,
    }));
  };

  return (
    <main className="seller-hub-page">
      <div className="seller-hub-container">
        <div className="seller-hub-topbar">
          <div className="seller-hub-topbar-label">
            <span className="seller-hub-topbar-dot" />
            <span>Seller workspace</span>
          </div>

          <div className="seller-hub-utility-bar">
            <div className="seller-global-search-wrap">
              <label className="seller-global-search">
                <Search size={17} />
                <input
                  type="search"
                  value={globalSearch}
                  onChange={(event) => setGlobalSearch(event.target.value)}
                  placeholder="Search products or SKU..."
                  aria-label="Search products or SKU"
                />
                {globalSearch && (
                  <button
                    type="button"
                    aria-label="Clear search"
                    onClick={() => setGlobalSearch("")}
                  >
                    <X size={15} />
                  </button>
                )}
              </label>

              {globalSearch.trim() && (
                <div className="seller-global-search-results">
                  <strong>Product matches</strong>
                  {globalMatches.map((product) => (
                    <button
                      key={product.id}
                      type="button"
                      onClick={() => selectGlobalMatch(product)}
                    >
                      <span>{product.name}</span>
                      <small>
                        {product.sku} · {formatPrice(product.price)}
                      </small>
                    </button>
                  ))}
                  {globalMatches.length === 0 && (
                    <p>
                      No product matches. Order search will be available when
                      orders are connected.
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="seller-utility-actions">
              <div className="seller-utility-popover-wrap">
                <button
                  className="seller-notification-button"
                  type="button"
                  aria-label="Notifications"
                  aria-expanded={notificationOpen}
                  onClick={() => {
                    setNotificationOpen((current) => !current);
                    setProfileOpen(false);
                  }}
                >
                  <Bell size={20} />
                  <span>3</span>
                </button>

                {notificationOpen && (
                  <div className="seller-utility-popover seller-notification-popover">
                    <strong>Notifications</strong>
                    <p>
                      <AlertTriangle size={16} />
                      <span>Check the out-of-stock item in your inventory.</span>
                    </p>
                    <p>
                      <Truck size={16} />
                      <span>7 sample orders are awaiting delivery.</span>
                    </p>
                    <p>
                      <Package size={16} />
                      <span>Keep your product stock up to date.</span>
                    </p>
                  </div>
                )}
              </div>

              <div className="seller-utility-popover-wrap">
                <button
                  className="seller-profile-button"
                  type="button"
                  aria-expanded={profileOpen}
                  onClick={() => {
                    setProfileOpen((current) => {
                      const next = !current;

                      if (next) {
                        setDraftSellerProfile({ ...sellerProfile });
                        setIsEditingSellerProfile(false);
                        setSellerProfileSaveMessage("");
                      }

                      return next;
                    });
                    setNotificationOpen(false);
                  }}
                >
                  <span className="seller-profile-avatar">
                    <UserRound size={20} />
                  </span>
                  <span className="seller-profile-name">
                    <strong>
                      {sellerProfile.businessName ||
                        sellerProfile.contactPerson ||
                        "Seller Account"}
                    </strong>
                    <small>Seller account</small>
                  </span>
                  <ChevronDown
                    size={16}
                    className={profileOpen ? "seller-profile-chevron-open" : ""}
                  />
                </button>

                {profileOpen && (
                  <div
                    className="seller-profile-details-popover"
                    role="dialog"
                    aria-label="Seller profile details"
                  >
                    <div className="seller-profile-popup-header">
                      <span className="seller-profile-popup-avatar">
                        <UserRound size={23} />
                      </span>
                      <div>
                        <strong>
                          {draftSellerProfile.businessName ||
                            draftSellerProfile.contactPerson ||
                            "Seller Profile"}
                        </strong>
                        <span>Manage your seller account details</span>
                      </div>
                      <button
                        className="seller-profile-close"
                        type="button"
                        aria-label="Close seller profile"
                        onClick={() => {
                          setProfileOpen(false);
                          setIsEditingSellerProfile(false);
                          setSellerProfileSaveMessage("");
                        }}
                      >
                        <X size={17} />
                      </button>
                    </div>

                    <div className="seller-profile-popup-body">
                      <div className="seller-profile-section-title">
                        <strong>Business &amp; Contact Information</strong>
                        <span>
                          {isEditingSellerProfile
                            ? "Editing profile"
                            : "Seller account"}
                        </span>
                      </div>

                      <div className="seller-profile-fields">
                        <label className="seller-profile-field-full">
                          Business name *
                          <input
                            type="text"
                            value={draftSellerProfile.businessName}
                            readOnly={!isEditingSellerProfile}
                            required
                            placeholder="Enter business name"
                            onChange={(event) =>
                              updateDraft("businessName", event.target.value)
                            }
                          />
                        </label>

                        <label>
                          Contact person *
                          <input
                            type="text"
                            value={draftSellerProfile.contactPerson}
                            readOnly={!isEditingSellerProfile}
                            required
                            placeholder="Contact person's name"
                            onChange={(event) =>
                              updateDraft("contactPerson", event.target.value)
                            }
                          />
                        </label>

                        <label>
                          Login email
                          <input
                            type="email"
                            value={draftSellerProfile.email}
                            readOnly={!isEditingSellerProfile}
                            placeholder="Enter email address"
                            onChange={(event) =>
                              updateDraft("email", event.target.value)
                            }
                          />
                        </label>

                        <label>
                          Registered mobile
                          <input
                            type="tel"
                            value={draftSellerProfile.phone}
                            readOnly={!isEditingSellerProfile}
                            placeholder="Enter mobile number"
                            maxLength={10}
                            onChange={(event) =>
                              updateDraft(
                                "phone",
                                event.target.value.replace(/\D/g, "").slice(0, 10),
                              )
                            }
                          />
                        </label>

                        <label>
                          GSTIN
                          <input
                            type="text"
                            value={draftSellerProfile.gstin}
                            readOnly={!isEditingSellerProfile}
                            placeholder="Optional"
                            maxLength={15}
                            onChange={(event) =>
                              updateDraft(
                                "gstin",
                                event.target.value.toUpperCase().slice(0, 15),
                              )
                            }
                          />
                        </label>

                        <label className="seller-profile-field-full">
                          Business address
                          <textarea
                            value={draftSellerProfile.address}
                            readOnly={!isEditingSellerProfile}
                            placeholder="Enter your business address"
                            onChange={(event) =>
                              updateDraft("address", event.target.value)
                            }
                          />
                        </label>
                      </div>

                      <p className="seller-profile-security-note">
                        <AlertTriangle size={14} />
                        Passwords and authentication secrets are never shown
                        here.
                      </p>

                      {sellerProfileSaveMessage && (
                        <p className="seller-profile-save-message" role="status">
                          <Check size={15} />
                          {sellerProfileSaveMessage}
                        </p>
                      )}
                    </div>

                    <div className="seller-profile-popup-actions">
                      {isEditingSellerProfile ? (
                        <>
                          <button
                            className="seller-profile-cancel"
                            type="button"
                            onClick={() => {
                              setDraftSellerProfile({ ...sellerProfile });
                              setIsEditingSellerProfile(false);
                              setSellerProfileSaveMessage("");
                            }}
                          >
                            Cancel
                          </button>
                          <button
                            className="seller-profile-save"
                            type="button"
                            onClick={saveSellerProfile}
                          >
                            <Save size={15} />
                            Save Changes
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className="seller-profile-save"
                            type="button"
                            onClick={() => {
                              setDraftSellerProfile({ ...sellerProfile });
                              setIsEditingSellerProfile(true);
                              setSellerProfileSaveMessage("");
                            }}
                          >
                            <Pencil size={15} />
                            Edit Profile
                          </button>
                          <button
                            className="seller-remove-account-button"
                            type="button"
                            onClick={() => {
                              setRemoveError("");
                              setShowRemoveConfirmation(true);
                            }}
                          >
                            <Trash2 size={15} />
                            Remove Account
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <header className="seller-hub-page-heading">
          <div>
            <span className="seller-hub-eyebrow">SELLER DASHBOARD</span>
            <h1>Products &amp; Spare Parts Seller Hub</h1>
            <p>
              List electrical spares, hardware items, equipment and fulfil
              customer orders.
            </p>
          </div>
          <button
            className="seller-add-product-button"
            type="button"
            onClick={() => navigate("/seller/products")}
          >
            <Plus size={18} />
            <span>View All Products / Spares</span>
          </button>
        </header>

        {feedback && (
          <div className="seller-feedback" role="status">
            <Check size={17} />
            <span>{feedback}</span>
            <button
              type="button"
              aria-label="Dismiss notification"
              onClick={() => setFeedback("")}
            >
              <X size={16} />
            </button>
          </div>
        )}

        <section className="seller-summary-grid" aria-label="Seller business summary">
          <button
            className={`seller-summary-card seller-summary-blue ${activeSummary === "products" ? "is-selected" : ""
              }`}
            type="button"
            onClick={() => openSummary("products")}
          >
            <span className="seller-summary-icon"><Package size={23} /></span>
            <span className="seller-summary-copy">
              <span className="seller-summary-label">Listed Products</span>
              <strong>{products.length}</strong>
              <small>Product records</small>
            </span>
            <ChevronRight className="seller-summary-arrow" size={17} />
          </button>

          <button
            className={`seller-summary-card seller-summary-orange ${activeSummary === "orders" ? "is-selected" : ""
              }`}
            type="button"
            onClick={() => openSummary("orders")}
          >
            <span className="seller-summary-icon"><Truck size={23} /></span>
            <span className="seller-summary-copy">
              <span className="seller-summary-label">Pending Deliveries</span>
              <strong>7</strong>
              <small>Sample orders</small>
            </span>
            <ChevronRight className="seller-summary-arrow" size={17} />
          </button>

          <button
            className={`seller-summary-card seller-summary-green ${activeSummary === "sales" ? "is-selected" : ""
              }`}
            type="button"
            onClick={() => openSummary("sales")}
          >
            <span className="seller-summary-icon"><IndianRupee size={23} /></span>
            <span className="seller-summary-copy">
              <span className="seller-summary-label">Monthly Sales</span>
              <strong>₹89,400</strong>
              <small>Sample sales data</small>
            </span>
            <ChevronRight className="seller-summary-arrow" size={17} />
          </button>

          <button
            className={`seller-summary-card seller-summary-red ${activeSummary === "stock" ? "is-selected" : ""
              }`}
            type="button"
            onClick={() => openSummary("stock")}
          >
            <span className="seller-summary-icon"><AlertTriangle size={23} /></span>
            <span className="seller-summary-copy">
              <span className="seller-summary-label">Out of Stock</span>
              <strong>{outOfStockCount}</strong>
              <small>Items need attention</small>
            </span>
            <ChevronRight className="seller-summary-arrow" size={17} />
          </button>
        </section>

        {activeSummary && (
          <section className="seller-summary-detail" aria-live="polite">
            <div>
              <strong>
                {activeSummary === "products" && "Listed product inventory"}
                {activeSummary === "orders" && "Pending delivery orders"}
                {activeSummary === "sales" && "Monthly sales overview"}
                {activeSummary === "stock" && "Out of stock products"}
              </strong>
              <p>
                {activeSummary === "products" &&
                  `Your sample inventory contains ${products.length} product records and ${totalStock} units in stock.`}
                {activeSummary === "orders" &&
                  "There are 7 sample delivery orders awaiting fulfilment. Connect your order service to show live orders."}
                {activeSummary === "sales" &&
                  "₹89,400 is sample monthly sales data. Connect your backend to display actual sales."}
                {activeSummary === "stock" &&
                  (outOfStockCount
                    ? `${outOfStockCount} product record(s) currently have zero stock.`
                    : "All listed products currently have stock available.")}
              </p>
            </div>
            <button
              type="button"
              aria-label="Close summary details"
              onClick={() => setActiveSummary(null)}
            >
              <X size={17} />
            </button>
          </section>
        )}

        <section className="seller-main-grid">
          <div className="seller-panel seller-inventory-panel">
            <div className="seller-panel-heading">
              <div>
                <h2>Active Product Listings &amp; Spares</h2>
                <p className="seller-panel-subtitle">
                  Manage products, prices and stock levels
                </p>
              </div>
              <label className="seller-inventory-search">
                <Search size={16} />
                <input
                  type="search"
                  value={inventorySearch}
                  onChange={(event) => setInventorySearch(event.target.value)}
                  placeholder="Filter inventory..."
                  aria-label="Filter inventory"
                />
                {inventorySearch && (
                  <button
                    type="button"
                    aria-label="Clear inventory search"
                    onClick={() => setInventorySearch("")}
                  >
                    <X size={14} />
                  </button>
                )}
              </label>
            </div>

            <div className="seller-table-scroll">
              <table className="seller-inventory-table">
                <thead>
                  <tr>
                    <th>Item Name &amp; SKU</th>
                    <th>Category</th>
                    <th>Stock Level</th>
                    <th>Price</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr key={product.id}>
                      <td>
                        <div className="seller-product-cell">
                          <ProductThumbnail type={product.icon} />
                          <div className="seller-product-info">
                            <strong title={product.name}>{product.name}</strong>
                            <span>SKU: {product.sku}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="seller-product-category" title={product.category}>
                          {product.category}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`seller-stock ${product.stock === 0
                              ? "seller-stock-low"
                              : product.stock <= 5
                                ? "seller-stock-warning"
                                : ""
                            }`}
                        >
                          <span className="seller-stock-dot" />
                          {product.stock === 0
                            ? "Out of stock"
                            : `${product.stock} units`}
                        </span>
                      </td>
                      <td className="seller-product-price">
                        {formatPrice(product.price)}
                      </td>
                      <td>
                        <div className="seller-product-actions">
                          <button
                            className="seller-table-action"
                            type="button"
                            onClick={() =>
                              openProductModal(
                                product,
                                product.stock === 0 ? "restock" : "edit",
                              )
                            }
                          >
                            {product.stock === 0 ? "Restock" : "Edit"}
                          </button>
                          <div className="seller-product-menu-wrap">
                            <button
                              className="seller-more-button"
                              type="button"
                              aria-label={`More actions for ${product.name}`}
                              aria-expanded={menuProductId === product.id}
                              onClick={() =>
                                setMenuProductId((current) =>
                                  current === product.id ? null : product.id,
                                )
                              }
                            >
                              <MoreVertical size={17} />
                            </button>
                            {menuProductId === product.id && (
                              <div className="seller-product-menu">
                                <button
                                  type="button"
                                  onClick={() => openProductModal(product, "edit")}
                                >
                                  <Pencil size={14} />
                                  Edit details
                                </button>
                                <button
                                  type="button"
                                  onClick={() => openProductModal(product, "restock")}
                                >
                                  <RefreshCw size={14} />
                                  Restock item
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredProducts.length === 0 && (
                    <tr>
                      <td colSpan={5}>
                        <div className="seller-table-empty">
                          <Search size={23} />
                          <strong>No matching products</strong>
                          <span>
                            Try another name, SKU, category, stock value or price.
                          </span>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="seller-inventory-footer">
              <span>
                Showing <strong>{filteredProducts.length}</strong> of{" "}
                <strong>{products.length}</strong> products
              </span>
              <button
                type="button"
                onClick={() => navigate("/seller/products")}
              >
                <Plus size={15} />
                Add product
              </button>
            </div>
          </div>

          <div className="seller-panel seller-sales-panel">
            <div className="seller-sales-heading">
              <span className="seller-hub-eyebrow">SALES OVERVIEW</span>
              <h2>Weekly Parts Sales Trend</h2>
              <p>Sample fulfilled orders in Visakhapatnam</p>
            </div>
            <div
              className="seller-chart"
              role="img"
              aria-label="Weekly sales trend: Week 1, 20; Week 2, 32; Week 3, 38; Week 4, 46."
            >
              <div className="seller-chart-y-labels">
                {[50, 40, 30, 20, 10, 0].map((value) => (
                  <span key={value}>{value}</span>
                ))}
              </div>
              <div className="seller-chart-plot">
                <div className="seller-chart-grid-lines">
                  {[50, 40, 30, 20, 10, 0].map((value) => (
                    <span key={value} />
                  ))}
                </div>
                <div className="seller-chart-bars">
                  {weeklySales.map((week) => (
                    <div className="seller-chart-column" key={week.label}>
                      <strong>{week.value}</strong>
                      <div
                        className="seller-chart-bar"
                        style={{ height: `${(week.value / 50) * 100}%` }}
                      />
                      <span>{week.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="seller-chart-caption">
              <span>
                <span className="seller-chart-legend-dot" />
                Fulfilled orders
              </span>
              <span>Sample monthly trend</span>
            </div>
            <div className="seller-sales-footnote">
              <span>Highest week</span>
              <strong>Week 4 · 46 orders</strong>
            </div>
          </div>
        </section>

        {showOrders && (
          <section className="seller-orders-panel">
            <div className="seller-orders-icon"><ShoppingBag size={22} /></div>
            <div className="seller-orders-copy">
              <h3>Order management</h3>
              <p>
                Customer orders, delivery status and fulfilment details will
                appear here when your order service is connected.
              </p>
            </div>
            <button
              type="button"
              aria-label="Close order information"
              onClick={() => setShowOrders(false)}
            >
              <X size={17} />
            </button>
          </section>
        )}

        <section className="seller-inventory-banner">
          <div className="seller-banner-icon"><Box size={26} /></div>
          <div className="seller-banner-copy">
            <h2>Keep Your Inventory Fresh</h2>
            <p>
              Maintain stock levels, track orders and grow your business with
              NeedOneService.
            </p>
          </div>
          <button
            className="seller-view-orders-button"
            type="button"
            onClick={() => {
              setShowOrders((current) => !current);
              setActiveSummary(null);
            }}
          >
            {showOrders ? "Hide Orders" : "View Orders"}
            <ArrowRight size={17} />
          </button>
        </section>

        <section className="seller-reviews-section">
          <div className="seller-reviews-header">
            <div>
              <span className="seller-hub-eyebrow">CUSTOMER EXPERIENCE</span>
              <h2>Customer Feedback &amp; Reviews</h2>
              <p>See what customers say about your products and service.</p>
            </div>
            <div className="seller-reviews-total">
              <MessageSquareText size={17} />
              <span>4 customer reviews</span>
            </div>
          </div>

          <div className="seller-reviews-overview">
            <div className="seller-rating-summary">
              <strong className="seller-rating-number">4.5</strong>
              <div className="seller-rating-stars" aria-label="4.5 out of 5 stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={16}
                    fill={star <= 4 ? "currentColor" : "none"}
                  />
                ))}
              </div>
              <span>Based on 4 sample reviews</span>
            </div>
            <div className="seller-rating-breakdown">
              {[
                { stars: 5, count: 2, percentage: 50 },
                { stars: 4, count: 1, percentage: 25 },
                { stars: 3, count: 1, percentage: 25 },
                { stars: 2, count: 0, percentage: 0 },
                { stars: 1, count: 0, percentage: 0 },
              ].map((rating) => (
                <div className="seller-rating-row" key={rating.stars}>
                  <span>{rating.stars} star</span>
                  <div className="seller-rating-track">
                    <span style={{ width: `${rating.percentage}%` }} />
                  </div>
                  <span className="seller-rating-count">{rating.count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="seller-reviews-list-heading">
            <div>
              <h3>Recent Reviews</h3>
              <span>Feedback from your customers</span>
            </div>
            <span className="seller-reviews-latest">
              Latest first <ChevronDown size={14} />
            </span>
          </div>

          <div className="seller-reviews-list">
            <article className="seller-review-card">
              <div className="seller-review-avatar seller-review-avatar-blue">RK</div>
              <div className="seller-review-content">
                <div className="seller-review-customer-row">
                  <div>
                    <h4>Ravi Kumar</h4>
                    <span className="seller-review-date">
                      18 Oct 2026 · RO Purifier Filter
                    </span>
                  </div>
                  <span className="seller-verified-review">
                    <BadgeCheck size={14} /> Verified purchase
                  </span>
                </div>
                <div className="seller-review-stars" aria-label="5 out of 5 stars">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} size={14} fill="currentColor" />
                  ))}
                  <span>5.0</span>
                </div>
                <p>
                  Excellent product quality. The filter fits perfectly and the
                  delivery was quick. Very satisfied with the purchase.
                </p>
                <div className="seller-review-product-tag">
                  <Package size={13} /> RO Purifier Copper Filter Cartridge
                </div>
              </div>
            </article>

            <article className="seller-review-card">
              <div className="seller-review-avatar seller-review-avatar-purple">SP</div>
              <div className="seller-review-content">
                <div className="seller-review-customer-row">
                  <div>
                    <h4>Sai Prasad</h4>
                    <span className="seller-review-date">
                      16 Oct 2026 · AC Capacitor
                    </span>
                  </div>
                  <span className="seller-verified-review">
                    <BadgeCheck size={14} /> Verified purchase
                  </span>
                </div>
                <div className="seller-review-stars" aria-label="4 out of 5 stars">
                  {[1, 2, 3, 4].map((star) => (
                    <Star key={star} size={14} fill="currentColor" />
                  ))}
                  <Star size={14} />
                  <span>4.0</span>
                </div>
                <p>
                  Good quality capacitor at a reasonable price. The product
                  works well. Would appreciate even faster delivery next time.
                </p>
                <div className="seller-review-product-tag">
                  <Package size={13} /> 1.5 Ton AC Capacitor 45 MFD
                </div>
              </div>
            </article>

            {showAllReviews && (
              <>
                <article className="seller-review-card">
                  <div className="seller-review-avatar seller-review-avatar-green">AM</div>
                  <div className="seller-review-content">
                    <div className="seller-review-customer-row">
                      <div>
                        <h4>Anil Mehta</h4>
                        <span className="seller-review-date">
                          14 Oct 2026 · Electrical Fitting
                        </span>
                      </div>
                      <span className="seller-verified-review">
                        <BadgeCheck size={14} /> Verified purchase
                      </span>
                    </div>
                    <div className="seller-review-stars" aria-label="5 out of 5 stars">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} size={14} fill="currentColor" />
                      ))}
                      <span>5.0</span>
                    </div>
                    <p>
                      The product was well packed and arrived in good condition.
                      Great value for money. I would order from this seller again.
                    </p>
                    <div className="seller-review-product-tag">
                      <Package size={13} /> Modular 16A Heavy Socket Switch
                    </div>
                  </div>
                </article>

                <article className="seller-review-card">
                  <div className="seller-review-avatar seller-review-avatar-orange">VK</div>
                  <div className="seller-review-content">
                    <div className="seller-review-customer-row">
                      <div>
                        <h4>Vijay Kumar</h4>
                        <span className="seller-review-date">
                          12 Oct 2026 · Overall Shopping Experience
                        </span>
                      </div>
                      <span className="seller-verified-review">
                        <BadgeCheck size={14} /> Verified purchase
                      </span>
                    </div>
                    <div className="seller-review-stars" aria-label="3 out of 5 stars">
                      {[1, 2, 3].map((star) => (
                        <Star key={star} size={14} fill="currentColor" />
                      ))}
                      <Star size={14} />
                      <Star size={14} />
                      <span>3.0</span>
                    </div>
                    <p>
                      The item was as described and the quality was acceptable.
                      Better delivery updates would improve the overall experience.
                    </p>
                    <div className="seller-review-product-tag">
                      <ShoppingBag size={13} /> General seller feedback
                    </div>
                  </div>
                </article>
              </>
            )}
          </div>

          <div className="seller-reviews-view-all">
            <button
              type="button"
              onClick={() => setShowAllReviews((current) => !current)}
              aria-expanded={showAllReviews}
            >
              {showAllReviews ? "Show Less" : "View All Reviews"}
              <ChevronDown
                size={15}
                className={showAllReviews ? "seller-reviews-chevron-open" : ""}
              />
            </button>
          </div>

          <div className="seller-reviews-footer">
            <span>
              <Check size={14} /> Customer feedback helps improve your seller reputation.
            </span>
            <span className="seller-reviews-demo-note">
              Sample reviews · Not live customer data
            </span>
          </div>
        </section>
      </div>

      {modalMode && (
        <div
          className="seller-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeModal();
          }}
        >
          <section
            className="seller-product-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="seller-product-modal-title"
          >
            <div className="seller-product-modal-header">
              <div>
                <span className="seller-hub-eyebrow">INVENTORY MANAGEMENT</span>
                <h2 id="seller-product-modal-title">
                  {modalMode === "add" && "Add New Product / Spare"}
                  {modalMode === "edit" && "Edit Product"}
                  {modalMode === "restock" && "Restock Product"}
                </h2>
                <p>
                  {modalMode === "add" && "Add a new item to your seller inventory."}
                  {modalMode === "edit" && "Update product details and available stock."}
                  {modalMode === "restock" && "Add units to the current available stock."}
                </p>
              </div>
              <button
                className="seller-modal-close"
                type="button"
                aria-label="Close dialog"
                onClick={closeModal}
              >
                <X size={19} />
              </button>
            </div>

            <form className="seller-product-form" onSubmit={saveProduct}>
              {modalMode !== "restock" && (
                <>
                  <label>
                    Product name
                    <input
                      value={form.name}
                      onChange={(event) =>
                        setForm({ ...form, name: event.target.value })
                      }
                      placeholder="Enter product name"
                      required
                    />
                  </label>
                  <div className="seller-form-two-columns">
                    <label>
                      SKU
                      <input
                        value={form.sku}
                        onChange={(event) =>
                          setForm({ ...form, sku: event.target.value })
                        }
                        placeholder="e.g. AC-004"
                        required
                      />
                    </label>
                    <label>
                      Category
                      <input
                        value={form.category}
                        onChange={(event) =>
                          setForm({ ...form, category: event.target.value })
                        }
                        placeholder="Product category"
                        required
                      />
                    </label>
                  </div>
                </>
              )}

              <div className="seller-form-two-columns">
                <label>
                  {modalMode === "restock" ? "Quantity to add" : "Stock quantity"}
                  <input
                    type="number"
                    min={modalMode === "restock" ? 1 : 0}
                    step="1"
                    value={form.stock}
                    onChange={(event) =>
                      setForm({ ...form, stock: event.target.value })
                    }
                    placeholder={modalMode === "restock" ? "Enter quantity" : "0"}
                    required
                  />
                </label>
                {modalMode !== "restock" && (
                  <label>
                    Price (₹)
                    <input
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={form.price}
                      onChange={(event) =>
                        setForm({ ...form, price: event.target.value })
                      }
                      placeholder="Enter price"
                      required
                    />
                  </label>
                )}
              </div>

              {modalMode === "restock" && activeProduct && (
                <div className="seller-restock-note">
                  <Package size={18} />
                  <span>
                    Current stock: <strong>{activeProduct.stock} units</strong>
                  </span>
                </div>
              )}

              {formError && (
                <p className="seller-form-error" role="alert">{formError}</p>
              )}

              <div className="seller-product-form-actions">
                <button
                  className="seller-cancel-button"
                  type="button"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button className="seller-save-button" type="submit">
                  {modalMode === "restock" ? (
                    <RefreshCw size={16} />
                  ) : modalMode === "edit" ? (
                    <Save size={16} />
                  ) : (
                    <Plus size={17} />
                  )}
                  {modalMode === "restock"
                    ? "Update Stock"
                    : modalMode === "edit"
                      ? "Save Changes"
                      : "Add Product"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {showRemoveConfirmation && (
        <div
          className="seller-remove-overlay"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !removingAccount) {
              setShowRemoveConfirmation(false);
              setRemoveError("");
            }
          }}
        >
          <section
            className="seller-remove-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="seller-remove-title"
            aria-describedby="seller-remove-description"
          >
            <div className="seller-remove-dialog-icon">
              <Trash2 size={24} />
            </div>

            <button
              type="button"
              className="seller-remove-dialog-close"
              aria-label="Close confirmation"
              disabled={removingAccount}
              onClick={() => {
                setShowRemoveConfirmation(false);
                setRemoveError("");
              }}
            >
              <X size={19} />
            </button>

            <h2 id="seller-remove-title">
              Permanently Delete Seller Account?
            </h2>

            <p id="seller-remove-description">
              Are you sure you want to permanently delete your seller account?
              Your seller profile, registration information, and seller product
              records stored in this browser will be removed. This action cannot
              be undone from this browser. Your regular OneService login and
              other account types will remain unaffected.
            </p>

            {removeError && (
              <p className="seller-remove-error" role="alert">{removeError}</p>
            )}

            <div className="seller-remove-dialog-actions">
              <button
                type="button"
                className="seller-remove-cancel"
                disabled={removingAccount}
                onClick={() => {
                  setShowRemoveConfirmation(false);
                  setRemoveError("");
                }}
              >
                Keep Account
              </button>
              <button
                type="button"
                className="seller-remove-confirm"
                disabled={removingAccount}
                onClick={removeAccount}
              >
                <Trash2 size={16} />
                {removingAccount ? "Deleting Account..." : "Permanently Delete"}
              </button>
            </div>

            <small className="seller-remove-note">
              This removes seller data from this browser. Server-side deletion
              requires a connected backend.
            </small>
          </section>
        </div>
      )}
    </main>
  );
}
