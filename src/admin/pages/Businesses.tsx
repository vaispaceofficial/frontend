import { useMemo, useState } from "react";
import {
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Search,
  X,
} from "lucide-react";

import "./Businesses.css";

type RegistrationStatus = "Paid" | "Pending";

type Business = {
  id: string;
  name: string;
  type: string;
  projects: string;
  contact: string;
  registrationStatus: RegistrationStatus;
};

const businesses: Business[] = [
  {
    id: "B-301",
    name: "Horizon Interiors",
    type: "Interior Designer",
    projects: "12 illustrative projects",
    contact: "Contact record on file",
    registrationStatus: "Paid",
  },
  {
    id: "B-302",
    name: "Coastal Plywood Store",
    type: "Plywood Store",
    projects: "8 illustrative projects",
    contact: "Contact record on file",
    registrationStatus: "Pending",
  },
  {
    id: "B-303",
    name: "East Coast Buildworks",
    type: "Construction Contractor",
    projects: "19 illustrative projects",
    contact: "Contact record on file",
    registrationStatus: "Paid",
  },
  {
    id: "B-304",
    name: "Harbour Modular Works",
    type: "Modular Furniture",
    projects: "15 illustrative projects",
    contact: "Contact record on file",
    registrationStatus: "Paid",
  },
  {
    id: "B-305",
    name: "Vizag Civil Solutions",
    type: "Civil Contractor",
    projects: "11 illustrative projects",
    contact: "Contact record on file",
    registrationStatus: "Pending",
  },
];

const contractorTypes = [
  "All contractor types",
  "Interior Designer",
  "Plywood Store",
  "Construction Contractor",
  "Modular Furniture",
  "Civil Contractor",
];

export default function Businesses() {
  const [search, setSearch] = useState("");
  const [contractorType, setContractorType] =
    useState("All contractor types");

  const [selectedBusiness, setSelectedBusiness] =
    useState<Business | null>(null);

  const [action, setAction] = useState<
    "approve" | "portfolio" | "subscription" | null
  >(null);

  const [page, setPage] = useState(1);

  const filteredBusinesses = useMemo(() => {
    const query = search.trim().toLowerCase();

    return businesses.filter((business) => {
      const matchesSearch =
        !query ||
        business.name.toLowerCase().includes(query) ||
        business.type.toLowerCase().includes(query) ||
        business.id.toLowerCase().includes(query);

      const matchesType =
        contractorType === "All contractor types" ||
        business.type === contractorType;

      return matchesSearch && matchesType;
    });
  }, [search, contractorType]);

  const clearFilters = () => {
    setSearch("");
    setContractorType("All contractor types");
    setPage(1);
  };

  const openAction = (
    business: Business,
    selectedAction:
      | "approve"
      | "portfolio"
      | "subscription",
  ) => {
    setSelectedBusiness(business);
    setAction(selectedAction);
  };

  const closeModal = () => {
    setSelectedBusiness(null);
    setAction(null);
  };

  return (
    <div className="businesses-admin-page">
      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <section className="businesses-page-header">
        <div>
          <div className="businesses-eyebrow">
            CORPORATE DIRECTORY · TAB 3
          </div>

          <h1>Find Businesses / Contractors</h1>

          <p>
            Manage B2B businesses, interior designers, wholesale
            plywood stores, and construction contractors.
          </p>
        </div>
      </section>

      {/* =====================================================
          DIRECTORY CARD
      ===================================================== */}

      <section className="businesses-directory-card">
        {/* =================================================
            FILTER BAR
        ================================================= */}

        <div className="businesses-filter-bar">
          <div className="businesses-search">
            <Search size={17} />

            <input
              type="text"
              value={search}
              placeholder="Search business, contractor or ID"
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

          <div className="businesses-type-select">
            <select
              value={contractorType}
              onChange={(event) => {
                setContractorType(event.target.value);
                setPage(1);
              }}
            >
              {contractorTypes.map((type) => (
                <option key={type}>{type}</option>
              ))}
            </select>

            <ChevronDown size={16} />
          </div>

          {(search ||
            contractorType !== "All contractor types") && (
            <button
              type="button"
              className="businesses-clear-button"
              onClick={clearFilters}
            >
              Clear
            </button>
          )}
        </div>

        {/* =================================================
            TABLE
        ================================================= */}

        <div className="businesses-table-wrapper">
          <table className="businesses-table">
            <thead>
              <tr>
                <th>BUSINESS NAME</th>
                <th>CONTRACTOR TYPE</th>
                <th>PROJECTS PORTFOLIO</th>
                <th>CONTACT INFO</th>
                <th>REGISTRATION FEE STATUS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>

            <tbody>
              {filteredBusinesses.map((business) => (
                <tr key={business.id}>
                  {/* BUSINESS */}

                  <td>
                    <div className="business-name-cell">
                      <strong>{business.name}</strong>
                      <span>{business.id}</span>
                    </div>
                  </td>

                  {/* TYPE */}

                  <td>
                    <span className="business-type">
                      {business.type}
                    </span>
                  </td>

                  {/* PROJECTS */}

                  <td>
                    <span className="business-projects">
                      {business.projects}
                    </span>
                  </td>

                  {/* CONTACT */}

                  <td>
                    <span className="business-contact">
                      {business.contact}
                    </span>
                  </td>

                  {/* PAYMENT STATUS */}

                  <td>
                    <span
                      className={`business-payment-status ${
                        business.registrationStatus ===
                        "Paid"
                          ? "paid"
                          : "pending"
                      }`}
                    >
                      {business.registrationStatus ===
                      "Paid" ? (
                        <CheckCircle2 size={13} />
                      ) : null}

                      {business.registrationStatus}
                    </span>
                  </td>

                  {/* ACTIONS */}

                  <td>
                    <div className="business-actions">
                      <button
                        type="button"
                        className="business-primary-action"
                        onClick={() =>
                          openAction(
                            business,
                            "approve",
                          )
                        }
                      >
                        Approve Listing
                      </button>

                      <button
                        type="button"
                        className="business-secondary-action"
                        onClick={() =>
                          openAction(
                            business,
                            "portfolio",
                          )
                        }
                      >
                        View Portfolio Links
                        <ExternalLink size={13} />
                      </button>

                      <button
                        type="button"
                        className="business-secondary-action subscription"
                        onClick={() =>
                          openAction(
                            business,
                            "subscription",
                          )
                        }
                      >
                        Manage Subscription
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {/* EMPTY STATE */}

              {filteredBusinesses.length === 0 && (
                <tr>
                  <td colSpan={6}>
                    <div className="businesses-empty-state">
                      <Search size={26} />

                      <strong>
                        No businesses found
                      </strong>

                      <span>
                        Try changing your search or contractor
                        type.
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
            FOOTER / PAGINATION
        ================================================= */}

        <div className="businesses-table-footer">
          <span>
            Showing{" "}
            <strong>
              {filteredBusinesses.length}
            </strong>{" "}
            of <strong>{businesses.length}</strong>{" "}
            businesses
          </span>

          <div className="businesses-pagination">
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
          ACTION MODAL
      ===================================================== */}

      {selectedBusiness && action && (
        <div
          className="business-modal-backdrop"
          onClick={closeModal}
        >
          <div
            className="business-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="business-modal-header">
              <div>
                <span>CORPORATE DIRECTORY</span>

                <h2>{selectedBusiness.name}</h2>

                <small>
                  {selectedBusiness.id} ·{" "}
                  {selectedBusiness.type}
                </small>
              </div>

              <button
                type="button"
                onClick={closeModal}
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* APPROVE */}

            {action === "approve" && (
              <div className="business-modal-content">
                <div className="business-modal-icon success">
                  <CheckCircle2 size={22} />
                </div>

                <h3>Approve Business Listing?</h3>

                <p>
                  You are about to approve{" "}
                  <strong>
                    {selectedBusiness.name}
                  </strong>{" "}
                  for the Need One Service corporate
                  directory.
                </p>

                <div className="business-modal-info">
                  <div>
                    <span>BUSINESS</span>
                    <strong>
                      {selectedBusiness.name}
                    </strong>
                  </div>

                  <div>
                    <span>REGISTRATION STATUS</span>
                    <strong>
                      {selectedBusiness.registrationStatus}
                    </strong>
                  </div>
                </div>
              </div>
            )}

            {/* PORTFOLIO */}

            {action === "portfolio" && (
              <div className="business-modal-content">
                <div className="business-modal-icon">
                  <ExternalLink size={22} />
                </div>

                <h3>Portfolio Links</h3>

                <p>
                  Portfolio references submitted by{" "}
                  <strong>
                    {selectedBusiness.name}
                  </strong>{" "}
                  will appear here for administrative
                  review.
                </p>

                <div className="business-portfolio-placeholder">
                  <ExternalLink size={18} />

                  <span>
                    Portfolio links available for review
                  </span>
                </div>
              </div>
            )}

            {/* SUBSCRIPTION */}

            {action === "subscription" && (
              <div className="business-modal-content">
                <div className="business-modal-icon">
                  <CheckCircle2 size={22} />
                </div>

                <h3>Manage Subscription</h3>

                <p>
                  Review registration and listing
                  subscription details for{" "}
                  <strong>
                    {selectedBusiness.name}
                  </strong>
                  .
                </p>

                <div className="business-modal-info">
                  <div>
                    <span>PLAN</span>
                    <strong>
                      Business Listing
                    </strong>
                  </div>

                  <div>
                    <span>FEE STATUS</span>
                    <strong>
                      {selectedBusiness.registrationStatus}
                    </strong>
                  </div>
                </div>
              </div>
            )}

            <div className="business-modal-footer">
              <button
                type="button"
                className="business-modal-cancel"
                onClick={closeModal}
              >
                Cancel
              </button>

              {action === "approve" && (
                <button
                  type="button"
                  className="business-modal-confirm"
                  onClick={closeModal}
                >
                  Approve Listing
                </button>
              )}

              {action === "portfolio" && (
                <button
                  type="button"
                  className="business-modal-confirm"
                  onClick={closeModal}
                >
                  Close
                </button>
              )}

              {action === "subscription" && (
                <button
                  type="button"
                  className="business-modal-confirm"
                  onClick={closeModal}
                >
                  Open Subscription
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}