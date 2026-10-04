import { useMemo, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Search,
  UserRound,
  X,
} from "lucide-react";

import "./BookServices.css";

type ProviderStatus = "Verified" | "Pending";

type Provider = {
  id: string;
  initials: string;
  name: string;
  designation: string;
  category: string;
  location: string;
  experience: string;
  idProofStatus: ProviderStatus;
  subscriptionExpiry: string;
};

const providers: Provider[] = [
  {
    id: "S-210",
    initials: "AR",
    name: "Ananya Rao",
    designation: "AC Technician",
    category: "AC Technician",
    location: "Visakhapatnam",
    experience: "6 years",
    idProofStatus: "Verified",
    subscriptionExpiry: "30 Nov 2026",
  },
  {
    id: "S-211",
    initials: "VK",
    name: "Vikas Kumar",
    designation: "Electrician",
    category: "Electrician",
    location: "Visakhapatnam",
    experience: "4 years",
    idProofStatus: "Pending",
    subscriptionExpiry: "14 Oct 2026",
  },
  {
    id: "S-212",
    initials: "MT",
    name: "Meera Tailors",
    designation: "Tailor",
    category: "Tailor",
    location: "Vizianagaram",
    experience: "9 years",
    idProofStatus: "Verified",
    subscriptionExpiry: "02 Dec 2026",
  },
  {
    id: "S-213",
    initials: "RK",
    name: "Ravi Kumar",
    designation: "Plumber",
    category: "Plumber",
    location: "Anakapalle",
    experience: "7 years",
    idProofStatus: "Verified",
    subscriptionExpiry: "18 Dec 2026",
  },
  {
    id: "S-214",
    initials: "PS",
    name: "Priya Services",
    designation: "Home Cleaning",
    category: "Cleaning",
    location: "Visakhapatnam",
    experience: "5 years",
    idProofStatus: "Pending",
    subscriptionExpiry: "25 Oct 2026",
  },
  {
    id: "S-215",
    initials: "SN",
    name: "Suresh Naidu",
    designation: "Carpenter",
    category: "Carpenter",
    location: "Gajuwaka",
    experience: "8 years",
    idProofStatus: "Verified",
    subscriptionExpiry: "12 Jan 2027",
  },
];

const serviceTypes = [
  "Service Type",
  "AC Technician",
  "Electrician",
  "Plumber",
  "Tailor",
  "Cleaning",
  "Carpenter",
];

const locations = [
  "Location",
  "Visakhapatnam",
  "Vizianagaram",
  "Anakapalle",
  "Gajuwaka",
];

const statuses = [
  "All statuses",
  "Verified",
  "Pending",
];

export default function BookServices() {
  const [serviceType, setServiceType] = useState("Service Type");
  const [location, setLocation] = useState("Location");
  const [status, setStatus] = useState("All statuses");
  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);
  const [selectedProvider, setSelectedProvider] =
    useState<Provider | null>(null);

  const filteredProviders = useMemo(() => {
    const query = search.trim().toLowerCase();

    return providers.filter((provider) => {
      const matchesService =
        serviceType === "Service Type" ||
        provider.category === serviceType;

      const matchesLocation =
        location === "Location" ||
        provider.location === location;

      const matchesStatus =
        status === "All statuses" ||
        provider.idProofStatus === status;

      const matchesSearch =
        !query ||
        provider.name.toLowerCase().includes(query) ||
        provider.designation.toLowerCase().includes(query) ||
        provider.category.toLowerCase().includes(query) ||
        provider.id.toLowerCase().includes(query);

      return (
        matchesService &&
        matchesLocation &&
        matchesStatus &&
        matchesSearch
      );
    });
  }, [serviceType, location, status, search]);

  const clearFilters = () => {
    setServiceType("Service Type");
    setLocation("Location");
    setStatus("All statuses");
    setSearch("");
    setPage(1);
  };

  const hasFilters =
    serviceType !== "Service Type" ||
    location !== "Location" ||
    status !== "All statuses" ||
    search.trim() !== "";

  return (
    <div className="book-services-page">
      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <section className="book-services-header">
        <div>
          <div className="book-services-eyebrow">
            PARTNER MANAGEMENT · TAB 1
          </div>

          <h1>Book Services</h1>

          <p>
            Manage individual service providers such as technicians,
            cleaners, tutors, tailors, and cooks.
          </p>
        </div>
      </section>

      {/* =====================================================
          FILTER BAR
      ===================================================== */}

      <section className="book-services-filter-card">
        <div className="book-services-select">
          <select
            value={serviceType}
            onChange={(event) => {
              setServiceType(event.target.value);
              setPage(1);
            }}
          >
            {serviceTypes.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>

          <ChevronDown size={17} />
        </div>

        <div className="book-services-select">
          <select
            value={location}
            onChange={(event) => {
              setLocation(event.target.value);
              setPage(1);
            }}
          >
            {locations.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>

          <ChevronDown size={17} />
        </div>

        <div className="book-services-search">
          <Search size={17} />

          <input
            type="text"
            placeholder="Search provider"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
          />
        </div>

        <div className="book-services-select book-services-status-filter">
          <select
            value={status}
            onChange={(event) => {
              setStatus(event.target.value);
              setPage(1);
            }}
          >
            {statuses.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>

          <ChevronDown size={17} />
        </div>

        {hasFilters && (
          <button
            type="button"
            className="book-services-clear"
            onClick={clearFilters}
            aria-label="Clear filters"
          >
            <X size={15} />
          </button>
        )}
      </section>

      {/* =====================================================
          PROVIDER TABLE
      ===================================================== */}

      <section className="book-services-table-card">
        <div className="book-services-table-wrapper">
          <table className="book-services-table">
            <thead>
              <tr>
                <th>PHOTO / AVATAR</th>
                <th>NAME &amp; DESIGNATION</th>
                <th>CATEGORY</th>
                <th>EXPERIENCE</th>
                <th>ID PROOF STATUS</th>
                <th>SUBSCRIPTION EXPIRY</th>
                <th>ACTIONS</th>
              </tr>
            </thead>

            <tbody>
              {filteredProviders.map((provider) => (
                <tr key={provider.id}>
                  {/* PHOTO */}
                  <td>
                    <div className="book-services-avatar">
                      {provider.initials}
                    </div>
                  </td>

                  {/* NAME */}
                  <td>
                    <div className="book-services-provider">
                      <strong>{provider.name}</strong>

                      <span>
                        {provider.designation} · {provider.id}
                      </span>
                    </div>
                  </td>

                  {/* CATEGORY */}
                  <td>
                    <span className="book-services-category">
                      {provider.category}
                    </span>
                  </td>

                  {/* EXPERIENCE */}
                  <td>
                    <span className="book-services-experience">
                      {provider.experience}
                    </span>
                  </td>

                  {/* ID STATUS */}
                  <td>
                    <span
                      className={`book-services-status ${
                        provider.idProofStatus === "Verified"
                          ? "verified"
                          : "pending"
                      }`}
                    >
                      {provider.idProofStatus === "Verified" ? (
                        <CheckCircle2 size={14} />
                      ) : (
                        <span className="book-services-pending-dot" />
                      )}

                      {provider.idProofStatus}
                    </span>
                  </td>

                  {/* EXPIRY */}
                  <td>
                    <div className="book-services-expiry">
                      <span>{provider.subscriptionExpiry}</span>
                    </div>
                  </td>

                  {/* ACTIONS */}
                  <td>
                    <div className="book-services-actions">
                      <button
                        type="button"
                        className="book-services-action secondary"
                        onClick={() => setSelectedProvider(provider)}
                      >
                        View Profile
                      </button>

                      <button
                        type="button"
                        className={`book-services-action ${
                          provider.idProofStatus === "Pending"
                            ? "primary"
                            : "secondary"
                        }`}
                        onClick={() => setSelectedProvider(provider)}
                      >
                        Verify Docs
                      </button>

                      <button
                        type="button"
                        className="book-services-action danger"
                        onClick={() => setSelectedProvider(provider)}
                      >
                        Suspend / Block
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredProviders.length === 0 && (
                <tr>
                  <td colSpan={7}>
                    <div className="book-services-empty">
                      <Search size={26} />

                      <strong>No service providers found</strong>

                      <span>
                        Try changing your filters or search term.
                      </span>

                      <button
                        type="button"
                        onClick={clearFilters}
                      >
                        Clear Filters
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* =====================================================
            PAGINATION
        ===================================================== */}

        <div className="book-services-pagination">
          <span>
            Showing{" "}
            <strong>{filteredProviders.length}</strong> of{" "}
            <strong>{providers.length}</strong> providers
          </span>

          <div className="book-services-pagination-buttons">
            <button
              type="button"
              disabled={page === 1}
              onClick={() =>
                setPage((current) => Math.max(1, current - 1))
              }
            >
              <ChevronLeft size={16} />
            </button>

            <button
              type="button"
              className="active"
              onClick={() => setPage(1)}
            >
              1
            </button>

            <button
              type="button"
              onClick={() => setPage(2)}
            >
              2
            </button>

            <span>...</span>

            <button
              type="button"
              onClick={() => setPage(4)}
            >
              4
            </button>

            <button
              type="button"
              disabled={page === 4}
              onClick={() =>
                setPage((current) => Math.min(4, current + 1))
              }
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* =====================================================
          PROVIDER MODAL
      ===================================================== */}

      {selectedProvider && (
        <div
          className="book-services-modal-backdrop"
          onClick={() => setSelectedProvider(null)}
        >
          <div
            className="book-services-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="book-services-modal-header">
              <div>
                <span>PARTNER PROFILE</span>
                <h2>{selectedProvider.name}</h2>
              </div>

              <button
                type="button"
                onClick={() => setSelectedProvider(null)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="book-services-modal-profile">
              <div className="book-services-modal-avatar">
                {selectedProvider.initials}
              </div>

              <div>
                <strong>{selectedProvider.designation}</strong>

                <span>
                  {selectedProvider.category} ·{" "}
                  {selectedProvider.id}
                </span>
              </div>
            </div>

            <div className="book-services-modal-grid">
              <div>
                <span>LOCATION</span>
                <strong>
                  <MapPin size={14} />
                  {selectedProvider.location}
                </strong>
              </div>

              <div>
                <span>EXPERIENCE</span>
                <strong>{selectedProvider.experience}</strong>
              </div>

              <div>
                <span>ID PROOF</span>
                <strong>
                  {selectedProvider.idProofStatus}
                </strong>
              </div>

              <div>
                <span>SUBSCRIPTION</span>
                <strong>
                  <CalendarDays size={14} />
                  {selectedProvider.subscriptionExpiry}
                </strong>
              </div>
            </div>

            <div className="book-services-modal-footer">
              <button
                type="button"
                className="book-services-modal-secondary"
                onClick={() => setSelectedProvider(null)}
              >
                Close
              </button>

              <button
                type="button"
                className="book-services-modal-primary"
                onClick={() => setSelectedProvider(null)}
              >
                <UserRound size={15} />
                Open Partner Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}