
import { useMemo, useState } from "react";
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
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [inventorySearch, setInventorySearch] = useState("");
  const [globalSearch, setGlobalSearch] = useState("");
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [activeProductId, setActiveProductId] = useState<number | null>(null);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [formError, setFormError] = useState("");
  const [menuProductId, setMenuProductId] = useState<number | null>(null);
  const [activeSummary, setActiveSummary] = useState<string | null>(null);
  const [showOrders, setShowOrders] = useState(false);
  const [feedback, setFeedback] = useState("");

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

  const openAddModal = () => {
    setForm(emptyForm);
    setActiveProductId(null);
    setFormError("");
    setMenuProductId(null);
    setModalMode("add");
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

  return (
    <main className="seller-hub-page">
      <div className="seller-hub-container">
        {/* Top utility bar */}
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
                      <span>
                        Check the out-of-stock item in your inventory.
                      </span>
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
                    setProfileOpen((current) => !current);
                    setNotificationOpen(false);
                  }}
                >
                  <span className="seller-profile-avatar">
                    <UserRound size={20} />
                  </span>
                  <span className="seller-profile-name">
                    <strong>Rahul Traders</strong>
                    <small>Seller account</small>
                  </span>
                  <ChevronDown size={16} />
                </button>

                {profileOpen && (
                  <div className="seller-utility-popover seller-profile-popover">
                    <strong>Rahul Traders</strong>
                    <span>Seller account</span>
                    <button
                      type="button"
                      onClick={() => {
                        setProfileOpen(false);
                        setFeedback(
                          "Seller profile settings can be connected in the next step.",
                        );
                      }}
                    >
                      <UserRound size={15} />
                      View seller profile
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Page heading */}
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
            onClick={openAddModal}
          >
            <Plus size={18} />
            <span>Add New Product / Spare</span>
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

        {/* Summary cards */}
        <section
          className="seller-summary-grid"
          aria-label="Seller business summary"
        >
          <button
            className={`seller-summary-card seller-summary-blue ${
              activeSummary === "products" ? "is-selected" : ""
            }`}
            type="button"
            onClick={() => openSummary("products")}
          >
            <span className="seller-summary-icon">
              <Package size={23} />
            </span>
            <span className="seller-summary-copy">
              <span className="seller-summary-label">Listed Products</span>
              <strong>{products.length}</strong>
              <small>Product records</small>
            </span>
            <ChevronRight className="seller-summary-arrow" size={17} />
          </button>

          <button
            className={`seller-summary-card seller-summary-orange ${
              activeSummary === "orders" ? "is-selected" : ""
            }`}
            type="button"
            onClick={() => openSummary("orders")}
          >
            <span className="seller-summary-icon">
              <Truck size={23} />
            </span>
            <span className="seller-summary-copy">
              <span className="seller-summary-label">Pending Deliveries</span>
              <strong>7</strong>
              <small>Sample orders</small>
            </span>
            <ChevronRight className="seller-summary-arrow" size={17} />
          </button>

          <button
            className={`seller-summary-card seller-summary-green ${
              activeSummary === "sales" ? "is-selected" : ""
            }`}
            type="button"
            onClick={() => openSummary("sales")}
          >
            <span className="seller-summary-icon">
              <IndianRupee size={23} />
            </span>
            <span className="seller-summary-copy">
              <span className="seller-summary-label">Monthly Sales</span>
              <strong>₹89,400</strong>
              <small>Sample sales data</small>
            </span>
            <ChevronRight className="seller-summary-arrow" size={17} />
          </button>

          <button
            className={`seller-summary-card seller-summary-red ${
              activeSummary === "stock" ? "is-selected" : ""
            }`}
            type="button"
            onClick={() => openSummary("stock")}
          >
            <span className="seller-summary-icon">
              <AlertTriangle size={23} />
            </span>
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

        {/* Inventory and sales */}
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
                            <strong title={product.name}>
                              {product.name}
                            </strong>
                            <span>SKU: {product.sku}</span>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span
                          className="seller-product-category"
                          title={product.category}
                        >
                          {product.category}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`seller-stock ${
                            product.stock === 0
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
                                  onClick={() =>
                                    openProductModal(product, "edit")
                                  }
                                >
                                  <Pencil size={14} />
                                  Edit details
                                </button>
                                <button
                                  type="button"
                                  onClick={() =>
                                    openProductModal(product, "restock")
                                  }
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
                            Try another name, SKU, category, stock value or
                            price.
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
              <button type="button" onClick={openAddModal}>
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
            <div className="seller-orders-icon">
              <ShoppingBag size={22} />
            </div>
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
          <div className="seller-banner-icon">
            <Box size={26} />
          </div>
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
      </div>

      {/* Add, edit and restock modal */}
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
                <span className="seller-hub-eyebrow">
                  INVENTORY MANAGEMENT
                </span>
                <h2 id="seller-product-modal-title">
                  {modalMode === "add" && "Add New Product / Spare"}
                  {modalMode === "edit" && "Edit Product"}
                  {modalMode === "restock" && "Restock Product"}
                </h2>
                <p>
                  {modalMode === "add" &&
                    "Add a new item to your seller inventory."}
                  {modalMode === "edit" &&
                    "Update product details and available stock."}
                  {modalMode === "restock" &&
                    "Add units to the current available stock."}
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
                    placeholder={
                      modalMode === "restock" ? "Enter quantity" : "0"
                    }
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
                    Current stock:{" "}
                    <strong>{activeProduct.stock} units</strong>
                  </span>
                </div>
              )}

              {formError && (
                <p className="seller-form-error" role="alert">
                  {formError}
                </p>
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
    </main>
  );
}
