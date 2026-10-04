import { useMemo, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  FileCheck2,
  Package,
  Search,
  Store,
  X,
} from "lucide-react";

import "./Products.css";

type VendorStatus = "Active" | "Pending";

type Vendor = {
  id: string;
  initials: string;
  name: string;
  owner: string;
  category: string;
  listings: number;
  status: VendorStatus;
};

type InventoryItem = {
  id: string;
  item: string;
  vendor: string;
  category: string;
  listings: number;
  liabilityStatus: "Acknowledged" | "Pending";
};

const vendors: Vendor[] = [
  {
    id: "V-101",
    initials: "CS",
    name: "Comfort Sofa Studio",
    owner: "Representative vendor",
    category: "Sofas",
    listings: 28,
    status: "Active",
  },
  {
    id: "V-102",
    initials: "ME",
    name: "Metro Electronics",
    owner: "Representative vendor",
    category: "Electronics",
    listings: 42,
    status: "Pending",
  },
  {
    id: "V-103",
    initials: "HS",
    name: "Harbour Spares Hub",
    owner: "Representative vendor",
    category: "Spare Parts",
    listings: 67,
    status: "Active",
  },
];

const inventory: InventoryItem[] = [
  {
    id: "P-001",
    item: "Modular Sofa Set",
    vendor: "Comfort Sofa Studio",
    category: "Sofas",
    listings: 8,
    liabilityStatus: "Acknowledged",
  },
  {
    id: "P-002",
    item: "3-Seater Fabric Sofa",
    vendor: "Comfort Sofa Studio",
    category: "Sofas",
    listings: 6,
    liabilityStatus: "Acknowledged",
  },
  {
    id: "P-003",
    item: "Smart LED Television",
    vendor: "Metro Electronics",
    category: "Electronics",
    listings: 12,
    liabilityStatus: "Pending",
  },
  {
    id: "P-004",
    item: "AC Copper Pipe Kit",
    vendor: "Harbour Spares Hub",
    category: "Spare Parts",
    listings: 15,
    liabilityStatus: "Acknowledged",
  },
  {
    id: "P-005",
    item: "Universal AC Remote",
    vendor: "Harbour Spares Hub",
    category: "Spare Parts",
    listings: 9,
    liabilityStatus: "Pending",
  },
  {
    id: "P-006",
    item: "Washing Machine Drain Hose",
    vendor: "Metro Electronics",
    category: "Home Appliances",
    listings: 7,
    liabilityStatus: "Acknowledged",
  },
];

const categories = [
  "All categories",
  "Sofas",
  "Electronics",
  "Spare Parts",
  "Home Appliances",
];

export default function Products() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All categories");

  const [selectedVendor, setSelectedVendor] =
    useState<Vendor | null>(null);

  const [selectedItem, setSelectedItem] =
    useState<InventoryItem | null>(null);

  const [page, setPage] = useState(1);

  const filteredInventory = useMemo(() => {
    const query = search.trim().toLowerCase();

    return inventory.filter((item) => {
      const matchesCategory =
        category === "All categories" ||
        item.category === category;

      const matchesSearch =
        !query ||
        item.item.toLowerCase().includes(query) ||
        item.vendor.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [search, category]);

  const clearFilters = () => {
    setSearch("");
    setCategory("All categories");
    setPage(1);
  };

  const hasFilters =
    search.trim() !== "" ||
    category !== "All categories";

  return (
    <div className="products-admin-page">
      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <section className="products-admin-header">
        <div>
          <div className="products-admin-eyebrow">
            VENDOR MANAGEMENT · TAB 2
          </div>

          <h1>Buy Products / Spares</h1>

          <p>
            Manage product sellers, spare-part vendors, and retail
            showrooms.
          </p>
        </div>
      </section>

      {/* =====================================================
          ZERO COMMISSION BANNER
      ===================================================== */}

      <section className="products-liability-banner">
        <div className="products-liability-icon">
          <AlertCircle size={18} />
        </div>

        <div>
          <strong>
            Zero Commission Store – Direct Vendor Responsibility
          </strong>

          <span>
            The platform is not liable for product warranties.
          </span>
        </div>
      </section>

      {/* =====================================================
          VENDOR CARDS
      ===================================================== */}

      <section className="products-vendor-grid">
        {vendors.map((vendor) => (
          <article
            className="products-vendor-card"
            key={vendor.id}
          >
            <div
              className={`products-vendor-badge ${
                vendor.status === "Active"
                  ? "active"
                  : "pending"
              }`}
            >
              {vendor.status === "Active" ? (
                <>
                  <CheckCircle2 size={13} />
                  Seller liability active
                </>
              ) : (
                <>
                  <AlertCircle size={13} />
                  License review pending
                </>
              )}
            </div>

            <div className="products-vendor-heading">
              <div className="products-vendor-avatar">
                {vendor.initials}
              </div>

              <div>
                <h2>{vendor.name}</h2>

                <span>
                  Owner: {vendor.owner}
                </span>
              </div>
            </div>

            <div className="products-vendor-meta">
              <span>{vendor.category}</span>

              <strong>
                {vendor.listings} listed items
              </strong>
            </div>

            <div className="products-vendor-actions">
              <button
                type="button"
                className="products-secondary-button"
                onClick={() => setSelectedVendor(vendor)}
              >
                <Eye size={14} />
                View Catalog
              </button>

              <button
                type="button"
                className="products-secondary-button"
                onClick={() => setSelectedVendor(vendor)}
              >
                <FileCheck2 size={14} />
                Verify Business License
              </button>
            </div>
          </article>
        ))}
      </section>

      {/* =====================================================
          INVENTORY CARD
      ===================================================== */}

      <section className="products-inventory-card">
        {/* FILTER BAR */}

        <div className="products-inventory-filter">
          <div className="products-inventory-search">
            <Search size={17} />

            <input
              type="text"
              placeholder="Search inventory"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
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
                <option key={item}>{item}</option>
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

        {/* TABLE */}

        <div className="products-inventory-table-wrapper">
          <table className="products-inventory-table">
            <thead>
              <tr>
                <th>ITEM</th>
                <th>VENDOR</th>
                <th>CATEGORY</th>
                <th>LISTINGS</th>
                <th>SELLER LIABILITY STATUS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>

            <tbody>
              {filteredInventory.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div className="products-item-name">
                      <div className="products-item-icon">
                        <Package size={16} />
                      </div>

                      <div>
                        <strong>{item.item}</strong>
                        <span>{item.id}</span>
                      </div>
                    </div>
                  </td>

                  <td>
                    <span className="products-vendor-name">
                      {item.vendor}
                    </span>
                  </td>

                  <td>
                    <span className="products-table-category">
                      {item.category}
                    </span>
                  </td>

                  <td>
                    <span className="products-listing-count">
                      {item.listings}
                    </span>
                  </td>

                  <td>
                    <span
                      className={`products-liability-status ${
                        item.liabilityStatus ===
                        "Acknowledged"
                          ? "acknowledged"
                          : "pending"
                      }`}
                    >
                      {item.liabilityStatus}
                    </span>
                  </td>

                  <td>
                    <button
                      type="button"
                      className="products-remove-button"
                      onClick={() => setSelectedItem(item)}
                    >
                      Remove Listings
                    </button>
                  </td>
                </tr>
              ))}

              {filteredInventory.length === 0 && (
                <tr>
                  <td colSpan={6}>
                    <div className="products-empty-state">
                      <Package size={28} />

                      <strong>
                        No inventory found
                      </strong>

                      <span>
                        Try changing your search or category.
                      </span>

                      <button
                        type="button"
                        onClick={clearFilters}
                      >
                        Clear filters
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}

        <div className="products-pagination">
          <span>
            Showing{" "}
            <strong>{filteredInventory.length}</strong>{" "}
            of <strong>{inventory.length}</strong> items
          </span>

          <div className="products-pagination-controls">
            <button
              type="button"
              disabled={page === 1}
              onClick={() =>
                setPage((current) =>
                  Math.max(1, current - 1),
                )
              }
            >
              <ChevronLeft size={15} />
            </button>

            <button
              type="button"
              className="active"
            >
              1
            </button>

            <button type="button">2</button>

            <span>...</span>

            <button type="button">4</button>

            <button
              type="button"
              onClick={() =>
                setPage((current) =>
                  Math.min(4, current + 1),
                )
              }
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </section>

      {/* =====================================================
          VENDOR MODAL
      ===================================================== */}

      {selectedVendor && (
        <div
          className="products-modal-backdrop"
          onClick={() => setSelectedVendor(null)}
        >
          <div
            className="products-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="products-modal-header">
              <div>
                <span>VENDOR PROFILE</span>
                <h2>{selectedVendor.name}</h2>
              </div>

              <button
                type="button"
                onClick={() => setSelectedVendor(null)}
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="products-modal-profile">
              <div className="products-modal-avatar">
                {selectedVendor.initials}
              </div>

              <div>
                <strong>{selectedVendor.owner}</strong>

                <span>
                  {selectedVendor.category} ·{" "}
                  {selectedVendor.id}
                </span>
              </div>
            </div>

            <div className="products-modal-grid">
              <div>
                <span>CATEGORY</span>
                <strong>
                  {selectedVendor.category}
                </strong>
              </div>

              <div>
                <span>LISTED ITEMS</span>
                <strong>
                  {selectedVendor.listings}
                </strong>
              </div>

              <div>
                <span>SELLER LIABILITY</span>
                <strong>
                  {selectedVendor.status === "Active"
                    ? "Acknowledged"
                    : "Pending"}
                </strong>
              </div>

              <div>
                <span>VENDOR ID</span>
                <strong>{selectedVendor.id}</strong>
              </div>
            </div>

            <div className="products-modal-footer">
              <button
                type="button"
                className="products-modal-secondary"
                onClick={() => setSelectedVendor(null)}
              >
                Close
              </button>

              <button
                type="button"
                className="products-modal-primary"
                onClick={() => setSelectedVendor(null)}
              >
                <Store size={15} />
                Open Vendor Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          INVENTORY MODAL
      ===================================================== */}

      {selectedItem && (
        <div
          className="products-modal-backdrop"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="products-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="products-modal-header">
              <div>
                <span>LISTING MANAGEMENT</span>
                <h2>{selectedItem.item}</h2>
              </div>

              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="products-modal-grid">
              <div>
                <span>VENDOR</span>
                <strong>{selectedItem.vendor}</strong>
              </div>

              <div>
                <span>CATEGORY</span>
                <strong>{selectedItem.category}</strong>
              </div>

              <div>
                <span>LISTINGS</span>
                <strong>{selectedItem.listings}</strong>
              </div>

              <div>
                <span>LIABILITY STATUS</span>
                <strong>
                  {selectedItem.liabilityStatus}
                </strong>
              </div>
            </div>

            <div className="products-warning-box">
              <AlertCircle size={16} />

              <span>
                Removing this listing will hide it from the
                marketplace. Vendor responsibility remains
                unchanged.
              </span>
            </div>

            <div className="products-modal-footer">
              <button
                type="button"
                className="products-modal-secondary"
                onClick={() => setSelectedItem(null)}
              >
                Cancel
              </button>

              <button
                type="button"
                className="products-modal-danger"
                onClick={() => setSelectedItem(null)}
              >
                Remove Listings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}