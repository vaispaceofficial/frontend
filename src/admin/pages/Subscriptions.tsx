import { useMemo, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
  Filter,
  Search,
  X,
} from "lucide-react";

import "./Subscriptions.css";

type Category = "Tab 1" | "Tab 2" | "Tab 3";

type Payment = {
  id: string;
  partner: string;
  category: Category;
  amount: string;
  expiry: string;
};

type Plan = {
  name: string;
  price: string;
  description: string;
  featured?: boolean;
};

const plans: Plan[] = [
  {
    name: "Basic Listing",
    price: "₹999/month",
    description: "Standard directory placement",
  },
  {
    name: "Featured Vendor",
    price: "₹2,499/month",
    description: "Top priority search placement",
    featured: true,
  },
];

const payments: Payment[] = [
  {
    id: "TXN-78421",
    partner: "Ananya Rao",
    category: "Tab 1",
    amount: "₹999",
    expiry: "30 Nov 2026",
  },
  {
    id: "TXN-78422",
    partner: "Metro Electronics",
    category: "Tab 2",
    amount: "₹2,499",
    expiry: "18 Dec 2026",
  },
  {
    id: "TXN-78423",
    partner: "Horizon Interiors",
    category: "Tab 3",
    amount: "₹999",
    expiry: "12 Dec 2026",
  },
  {
    id: "TXN-78424",
    partner: "Sai Home Services",
    category: "Tab 1",
    amount: "₹999",
    expiry: "24 Dec 2026",
  },
  {
    id: "TXN-78425",
    partner: "Harbour Spares Hub",
    category: "Tab 2",
    amount: "₹2,499",
    expiry: "08 Jan 2027",
  },
];

const categories = [
  "All category tabs",
  "Tab 1",
  "Tab 2",
  "Tab 3",
];

export default function Subscriptions() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All category tabs");
  const [filterOpen, setFilterOpen] = useState(false);
  const [page, setPage] = useState(1);

  const filteredPayments = useMemo(() => {
    const query = search.trim().toLowerCase();

    return payments.filter((payment) => {
      const matchesSearch =
        !query ||
        payment.id.toLowerCase().includes(query) ||
        payment.partner.toLowerCase().includes(query);

      const matchesCategory =
        category === "All category tabs" ||
        payment.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [search, category]);

  const clearFilters = () => {
    setSearch("");
    setCategory("All category tabs");
    setPage(1);
    setFilterOpen(false);
  };

  const downloadInvoice = (payment: Payment) => {
    // Placeholder for future backend invoice generation.
    console.log(`Downloading invoice for ${payment.id}`);
  };

  return (
    <div className="subscriptions-admin-page">
      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <section className="subscriptions-page-header">
        <div>
          <div className="subscriptions-eyebrow">
            REVENUE OPERATIONS
          </div>

          <h1>Subscription &amp; Fee Management</h1>

          <p>
            Revenue comes from registration and listing fees with
            0% commission.
          </p>
        </div>
      </section>

      {/* =====================================================
          PLAN CARDS
      ===================================================== */}

      <section className="subscription-plans">
        {plans.map((plan) => (
          <article
            key={plan.name}
            className={`subscription-plan-card ${
              plan.featured ? "featured" : ""
            }`}
          >
            <span className="subscription-plan-label">
              PLAN TIER
            </span>

            <h2>{plan.name}</h2>

            <strong>{plan.price}</strong>

            <p>{plan.description}</p>
          </article>
        ))}
      </section>

      {/* =====================================================
          PAYMENT LOGS
      ===================================================== */}

      <section className="payment-logs-card">
        <div className="payment-logs-header">
          <div>
            <h2>Payment logs</h2>

            <p>
              Collected fees summary:{" "}
              <strong>₹2,84,000</strong>
            </p>
          </div>

          <div className="payment-logs-controls">
            <div className="payment-category-select">
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

              <ChevronDown size={15} />
            </div>

            <button
              type="button"
              className={`payment-filter-button ${
                filterOpen ? "active" : ""
              }`}
              onClick={() => setFilterOpen((value) => !value)}
            >
              <Filter size={14} />
              Filter
            </button>
          </div>
        </div>

        {/* =================================================
            OPTIONAL SEARCH FILTER
        ================================================= */}

        {filterOpen && (
          <div className="payment-filter-panel">
            <div className="payment-search">
              <Search size={16} />

              <input
                type="text"
                value={search}
                placeholder="Search transaction ID or partner"
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

            <button
              type="button"
              className="payment-clear-button"
              onClick={clearFilters}
            >
              Clear
            </button>
          </div>
        )}

        {/* =================================================
            TABLE
        ================================================= */}

        <div className="payment-table-wrapper">
          <table className="payment-table">
            <thead>
              <tr>
                <th>TRANSACTION ID</th>
                <th>PARTNER NAME</th>
                <th>CATEGORY TAB 1 / 2 / 3</th>
                <th>AMOUNT PAID</th>
                <th>INVOICE DOWNLOAD</th>
                <th>EXPIRY DATE</th>
              </tr>
            </thead>

            <tbody>
              {filteredPayments.map((payment) => (
                <tr key={payment.id}>
                  <td>
                    <span className="transaction-id">
                      {payment.id}
                    </span>
                  </td>

                  <td>
                    <span className="payment-partner">
                      {payment.partner}
                    </span>
                  </td>

                  <td>
                    <span className="payment-category">
                      {payment.category}
                    </span>
                  </td>

                  <td>
                    <strong className="payment-amount">
                      {payment.amount}
                    </strong>
                  </td>

                  <td>
                    <button
                      type="button"
                      className="invoice-button"
                      onClick={() =>
                        downloadInvoice(payment)
                      }
                    >
                      <Download size={14} />
                      Download invoice
                    </button>
                  </td>

                  <td>
                    <span className="payment-expiry">
                      {payment.expiry}
                    </span>
                  </td>
                </tr>
              ))}

              {filteredPayments.length === 0 && (
                <tr>
                  <td colSpan={6}>
                    <div className="payment-empty-state">
                      <Search size={25} />

                      <strong>No payment records found</strong>

                      <span>
                        Try changing your search or category
                        filter.
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

        {/* =================================================
            FOOTER
        ================================================= */}

        <div className="payment-table-footer">
          <span>
            Showing{" "}
            <strong>{filteredPayments.length}</strong>{" "}
            of <strong>{payments.length}</strong> payment
            records
          </span>

          <div className="payment-pagination">
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

            <button type="button">3</button>

            <button
              type="button"
              onClick={() =>
                setPage((current) =>
                  Math.min(3, current + 1),
                )
              }
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </section>

      {/* =====================================================
          RECONCILIATION NOTE
      ===================================================== */}

      <div className="subscription-footer-note">
        <div className="subscription-footer-icon">
          <CheckCircle2 size={17} />
        </div>

        <div>
          <strong>0% commission model</strong>

          <span>
            All registration and listing fees are collected as
            platform revenue. Service providers, vendors, and
            businesses manage their own customer transactions.
          </span>
        </div>

        <CalendarDays size={18} />
      </div>
    </div>
  );
}