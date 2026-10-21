import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Ban,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  FileBadge,
  FileText,
  Mail,
  MapPin,
  Phone,
  Search,
  ShieldCheck,
  UsersRound,
  Wrench,
  X,
} from "lucide-react";
import "./Professionals.css";

type ProviderStatus = "Verified" | "Pending";
type DocumentStatus = "Verified" | "Pending" | "Rejected";
type AccountState = "Active" | "Suspended" | "Blocked" | "Rejected";
type ReviewAction = "suspend" | "block" | "reject";

type ProviderDocument = {
  id: string;
  title: string;
  subtitle: string;
  status: DocumentStatus;
  url?: string;
  fileName: string;
};

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
  joinedOn: string;
  rating: string;
  reviewCount: number;
  about: string;
  services: string[];
  phone: string;
  email: string;
  accountState?: AccountState;
  rejectionReason?: string;
  suspensionUntil?: string;
  suspensionDuration?: string;
  documents: ProviderDocument[];
};

const PAGE_SIZE = 5;

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
    accountState: "Active",
    subscriptionExpiry: "30 Nov 2026",
    joinedOn: "30 Nov 2025",
    rating: "4.8",
    reviewCount: 124,
    about:
      "Experienced AC technician with 6+ years of hands-on expertise in installation, repair and maintenance of major AC brands. Committed to providing reliable, timely and professional service.",
    services: [
      "AC Installation",
      "AC Repair",
      "Gas Filling",
      "Annual Maintenance",
    ],
    phone: "+91 98765 43210",
    email: "ananya.rao@example.com",
    documents: [
      {
        id: "id-proof",
        title: "Aadhaar Card (ID Proof)",
        subtitle: "Aadhaar No. •••• 4821",
        status: "Verified",
        fileName: "ananya-rao-id-proof.pdf",
      },
      {
        id: "experience",
        title: "Experience Certificate",
        subtitle: "AC Technician • 6 years",
        status: "Verified",
        fileName: "ananya-rao-experience-certificate.pdf",
      },
    ],
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
    joinedOn: "14 Oct 2025",
    rating: "4.6",
    reviewCount: 86,
    about:
      "Electrician providing residential electrical installation, repair and maintenance services.",
    services: [
      "Electrical Repairs",
      "Wiring",
      "Fan Installation",
      "Safety Checks",
    ],
    phone: "+91 98765 43211",
    email: "vikas.kumar@example.com",
    documents: [
      {
        id: "id-proof",
        title: "Government ID Proof",
        subtitle: "Submitted ID document",
        status: "Pending",
        fileName: "vikas-kumar-id-proof.pdf",
      },
      {
        id: "experience",
        title: "Experience Certificate",
        subtitle: "Electrician • 4 years",
        status: "Pending",
        fileName: "vikas-kumar-experience-certificate.pdf",
      },
    ],
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
    accountState: "Active",
    subscriptionExpiry: "02 Dec 2026",
    joinedOn: "02 Dec 2025",
    rating: "4.9",
    reviewCount: 102,
    about:
      "Experienced tailoring professional offering alterations, custom stitching and fitting services.",
    services: [
      "Custom Stitching",
      "Alterations",
      "Blouse Stitching",
      "Fittings",
    ],
    phone: "+91 98765 43212",
    email: "meera.tailors@example.com",
    documents: [
      {
        id: "id-proof",
        title: "Government ID Proof",
        subtitle: "Identity document",
        status: "Verified",
        fileName: "meera-tailors-id-proof.pdf",
      },
      {
        id: "experience",
        title: "Experience Certificate",
        subtitle: "Tailor • 9 years",
        status: "Verified",
        fileName: "meera-tailors-experience-certificate.pdf",
      },
    ],
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
    accountState: "Active",
    subscriptionExpiry: "18 Dec 2026",
    joinedOn: "18 Dec 2025",
    rating: "4.7",
    reviewCount: 73,
    about:
      "Plumbing professional handling repairs, fittings, leak detection and routine maintenance.",
    services: [
      "Leak Repairs",
      "Pipe Fitting",
      "Tap Installation",
      "Bathroom Maintenance",
    ],
    phone: "+91 98765 43213",
    email: "ravi.kumar@example.com",
    documents: [
      {
        id: "id-proof",
        title: "Government ID Proof",
        subtitle: "Government identity document",
        status: "Verified",
        fileName: "ravi-kumar-id-proof.pdf",
      },
      {
        id: "experience",
        title: "Experience Certificate",
        subtitle: "Plumber • 7 years",
        status: "Verified",
        fileName: "ravi-kumar-experience-certificate.pdf",
      },
    ],
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
    joinedOn: "25 Oct 2025",
    rating: "4.5",
    reviewCount: 59,
    about:
      "Home cleaning provider offering regular housekeeping and deep-cleaning services.",
    services: [
      "Deep Cleaning",
      "Kitchen Cleaning",
      "Bathroom Cleaning",
      "Regular Housekeeping",
    ],
    phone: "+91 98765 43214",
    email: "priya.services@example.com",
    documents: [
      {
        id: "id-proof",
        title: "Government ID Proof",
        subtitle: "Submitted ID document",
        status: "Pending",
        fileName: "priya-services-id-proof.pdf",
      },
      {
        id: "experience",
        title: "Experience Certificate",
        subtitle: "Cleaning • 5 years",
        status: "Pending",
        fileName: "priya-services-experience-certificate.pdf",
      },
    ],
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
    accountState: "Active",
    subscriptionExpiry: "12 Jan 2027",
    joinedOn: "12 Jan 2026",
    rating: "4.8",
    reviewCount: 91,
    about:
      "Carpenter experienced in furniture assembly, repairs, fittings and custom woodwork.",
    services: [
      "Furniture Repair",
      "Door Fitting",
      "Custom Shelving",
      "Assembly",
    ],
    phone: "+91 98765 43215",
    email: "suresh.naidu@example.com",
    documents: [
      {
        id: "id-proof",
        title: "Government ID Proof",
        subtitle: "Government identity document",
        status: "Verified",
        fileName: "suresh-naidu-id-proof.pdf",
      },
      {
        id: "experience",
        title: "Experience Certificate",
        subtitle: "Carpenter • 8 years",
        status: "Verified",
        fileName: "suresh-naidu-experience-certificate.pdf",
      },
    ],
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
  "Pending",
  "Verified",
  "Suspended",
  "Blocked",
  "Rejected",
];

function isPending(provider: Provider): boolean {
  return (
    provider.idProofStatus === "Pending" &&
    provider.accountState === undefined
  );
}

function getDisplayedStatus(provider: Provider): string {
  if (provider.accountState) {
    return provider.accountState === "Active"
      ? "Verified"
      : provider.accountState;
  }

  return provider.idProofStatus;
}

function getStatusClass(provider: Provider): string {
  return getDisplayedStatus(provider).toLowerCase();
}

function getReasonLabel(provider: Provider): string {
  switch (provider.accountState) {
    case "Rejected":
      return "Rejection reason";
    case "Blocked":
      return "Block reason";
    case "Suspended":
      return "Suspension reason";
    default:
      return "Reason";
  }
}

export default function BookServices() {
  const [serviceType, setServiceType] = useState("Service Type");
  const [location, setLocation] = useState("Location");
  const [status, setStatus] = useState("All statuses");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [selectedProvider, setSelectedProvider] =
    useState<Provider | null>(null);
  const [notice, setNotice] = useState("");

  const [reviewTarget, setReviewTarget] =
    useState<Provider | null>(null);
  const [reviewAction, setReviewAction] =
    useState<ReviewAction>("suspend");
  const [reviewReason, setReviewReason] = useState("");
  const [reviewError, setReviewError] = useState("");
  const [suspensionDuration, setSuspensionDuration] = useState("7");

  const [providerList, setProviderList] =
    useState<Provider[]>(providers);

  const filteredProviders = useMemo(() => {
    const query = search.trim().toLowerCase();

    return providerList.filter((provider) => {
      const matchesService =
        serviceType === "Service Type" ||
        provider.category === serviceType;

      const matchesLocation =
        location === "Location" ||
        provider.location === location;

      const matchesStatus =
        status === "All statuses" ||
        getDisplayedStatus(provider) === status;

      const searchableValues = [
        provider.name,
        provider.designation,
        provider.category,
        provider.id,
        provider.location,
        provider.phone,
        provider.email,
      ];

      const matchesSearch =
        !query ||
        searchableValues.some((value) =>
          value.toLowerCase().includes(query),
        );

      return (
        matchesService &&
        matchesLocation &&
        matchesStatus &&
        matchesSearch
      );
    });
  }, [providerList, serviceType, location, status, search]);

  const pageCount = Math.max(
    1,
    Math.ceil(filteredProviders.length / PAGE_SIZE),
  );

  const currentPage = Math.min(page, pageCount);

  const paginatedProviders = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredProviders.slice(start, start + PAGE_SIZE);
  }, [filteredProviders, currentPage]);

  const firstItem =
    filteredProviders.length === 0
      ? 0
      : (currentPage - 1) * PAGE_SIZE + 1;

  const lastItem = Math.min(
    currentPage * PAGE_SIZE,
    filteredProviders.length,
  );

  useEffect(() => {
    if (page !== currentPage) {
      setPage(currentPage);
    }
  }, [page, currentPage]);

  const hasFilters =
    serviceType !== "Service Type" ||
    location !== "Location" ||
    status !== "All statuses" ||
    search.trim() !== "";

  const clearFilters = () => {
    setServiceType("Service Type");
    setLocation("Location");
    setStatus("All statuses");
    setSearch("");
    setPage(1);
  };

  const updateProvider = (updated: Provider) => {
    setProviderList((current) =>
      current.map((provider) =>
        provider.id === updated.id ? updated : provider,
      ),
    );

    setSelectedProvider((current) =>
      current?.id === updated.id ? updated : current,
    );

    setReviewTarget((current) =>
      current?.id === updated.id ? updated : current,
    );

    setPage(1);
  };

  const openReviewDialog = (
    provider: Provider,
    action: ReviewAction,
  ) => {
    setReviewTarget(provider);
    setReviewAction(action);
    setReviewReason("");
    setReviewError("");
    setSuspensionDuration("7");
  };

  const closeReviewDialog = () => {
    setReviewTarget(null);
    setReviewReason("");
    setReviewError("");
    setSuspensionDuration("7");
  };

  const openDocument = (document: ProviderDocument) => {
    if (!document.url) {
      setNotice(
        `The uploaded file URL for "${document.title}" has not been connected yet.`,
      );
      return;
    }

    window.open(document.url, "_blank", "noopener,noreferrer");
  };

  const downloadDocument = (document: ProviderDocument) => {
    if (!document.url) {
      setNotice(
        `The uploaded file URL for "${document.title}" has not been connected yet.`,
      );
      return;
    }

    const link = window.document.createElement("a");
    link.href = document.url;
    link.download = document.fileName;
    link.target = "_blank";
    link.rel = "noopener noreferrer";

    window.document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const downloadAllDocuments = () => {
    if (!selectedProvider) return;

    const available = selectedProvider.documents.filter(
      (document) => Boolean(document.url),
    );

    if (available.length === 0) {
      setNotice(
        "No uploaded document URLs are connected yet. Add the real URLs to enable downloads.",
      );
      return;
    }

    available.forEach((document, index) => {
      window.setTimeout(() => downloadDocument(document), index * 250);
    });

    if (available.length < selectedProvider.documents.length) {
      setNotice(
        "Downloading available documents. Some uploaded file URLs are still missing.",
      );
    } else {
      setNotice("Your documents are being downloaded.");
    }
  };

  const verifyProvider = (provider: Provider) => {
    const updatedProvider: Provider = {
      ...provider,
      idProofStatus: "Verified",
      accountState: "Active",
      rejectionReason: undefined,
      suspensionUntil: undefined,
      suspensionDuration: undefined,
      documents: provider.documents.map((document) => ({
        ...document,
        status: "Verified",
      })),
    };

    updateProvider(updatedProvider);
    setSelectedProvider(null);

    setNotice(
      `${provider.name} has been verified and approved successfully.`,
    );
  };

  const submitReviewAction = () => {
    if (!reviewTarget) return;

    const reason = reviewReason.trim();

    if (!reason) {
      setReviewError(
        reviewAction === "reject"
          ? "Please enter a reason for rejecting this application."
          : reviewAction === "block"
            ? "Please enter a reason for blocking this professional."
            : "Please enter a reason for suspending this professional.",
      );
      return;
    }

    const target = reviewTarget;
    const action = reviewAction;
    const suspensionDays = Number(suspensionDuration);

    if (
      action === "suspend" &&
      (!Number.isInteger(suspensionDays) || suspensionDays < 1)
    ) {
      setReviewError("Please select a valid suspension period.");
      return;
    }

    let suspensionUntil: string | undefined;

    if (action === "suspend") {
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + suspensionDays);
      suspensionUntil = expiryDate.toISOString();
    }

    const updatedProvider: Provider = {
      ...target,
      accountState:
        action === "reject"
          ? "Rejected"
          : action === "block"
            ? "Blocked"
            : "Suspended",
      rejectionReason: reason,
      suspensionDuration:
        action === "suspend" ? `${suspensionDays} days` : undefined,
      suspensionUntil:
        action === "suspend" ? suspensionUntil : undefined,
    };

    updateProvider(updatedProvider);
    closeReviewDialog();

    if (action === "reject") {
      setSelectedProvider(null);
      setNotice(`${target.name}'s application has been rejected.`);
    } else if (action === "block") {
      setNotice(`${target.name} has been blocked successfully.`);
    } else {
      setNotice(
        `${target.name} has been suspended for ${suspensionDays} days.`,
      );
    }
  };

  return (
    <div className="book-services-page">
      <section className="book-services-header">
        <div>
          <div className="book-services-eyebrow">
            PARTNER MANAGEMENT · TAB 1
          </div>
          <h1>Professionals</h1>
          <p>
            Manage individual service providers such as technicians,
            cleaners, tutors, tailors, and cooks.
          </p>
        </div>
      </section>

      {/* FILTERS */}
      <section className="book-services-filter-card">
        <div className="book-services-select">
          <select
            aria-label="Filter by service type"
            value={serviceType}
            onChange={(event) => {
              setServiceType(event.target.value);
              setPage(1);
            }}
          >
            {serviceTypes.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <ChevronDown size={17} />
        </div>

        <div className="book-services-select">
          <select
            aria-label="Filter by location"
            value={location}
            onChange={(event) => {
              setLocation(event.target.value);
              setPage(1);
            }}
          >
            {locations.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <ChevronDown size={17} />
        </div>

        <div className="book-services-search">
          <Search size={17} />
          <input
            type="text"
            placeholder="Search provider"
            aria-label="Search providers"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
          />
        </div>

        <div className="book-services-select book-services-status-filter">
          <select
            aria-label="Filter by status"
            value={status}
            onChange={(event) => {
              setStatus(event.target.value);
              setPage(1);
            }}
          >
            {statuses.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
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
            title="Clear filters"
          >
            <X size={15} />
          </button>
        )}
      </section>

      {/* PROVIDERS TABLE */}
      <section className="book-services-table-card">
        <div className="book-services-table-wrapper">
          <table className="book-services-table">
            <thead>
              <tr>
                <th>PHOTO / AVATAR</th>
                <th>NAME &amp; DESIGNATION</th>
                <th>CATEGORY</th>
                <th>EXPERIENCE</th>
                <th>STATUS</th>
                <th>SUBSCRIPTION EXPIRY</th>
                <th>ACTIONS</th>
              </tr>
            </thead>

            <tbody>
              {paginatedProviders.map((provider) => {
                const pending = isPending(provider);
                const displayedStatus = getDisplayedStatus(provider);

                return (
                  <tr key={provider.id}>
                    <td>
                      <div className="book-services-avatar">
                        {provider.initials}
                      </div>
                    </td>

                    <td>
                      <div className="book-services-provider">
                        <strong>{provider.name}</strong>
                        <span>
                          {provider.designation} · {provider.id}
                        </span>

                        {provider.rejectionReason && (
                          <small
                            className="book-services-reason-preview"
                            title={provider.rejectionReason}
                          >
                            Reason: {provider.rejectionReason}
                          </small>
                        )}
                      </div>
                    </td>

                    <td>
                      <span className="book-services-category">
                        {provider.category}
                      </span>
                    </td>

                    <td>
                      <span className="book-services-experience">
                        {provider.experience}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`book-services-status ${getStatusClass(
                          provider,
                        )}`}
                      >
                        {displayedStatus === "Verified" ? (
                          <CheckCircle2 size={14} />
                        ) : ["Suspended", "Blocked", "Rejected"].includes(
                            displayedStatus,
                          ) ? (
                          <Ban size={14} />
                        ) : (
                          <span className="book-services-pending-dot" />
                        )}
                        {displayedStatus}
                      </span>
                    </td>

                    <td>
                      <div className="book-services-expiry">
                        <span>{provider.subscriptionExpiry}</span>
                      </div>
                    </td>

                    <td>
                      <div className="book-services-actions">
                        <button
                          type="button"
                          className="book-services-action secondary"
                          disabled={pending}
                          onClick={() => {
                            setSelectedProvider(provider);
                            setNotice("");
                          }}
                        >
                          <Eye size={13} />
                          View Profile
                        </button>

                        {/* New applicants: verify or reject */}
                        {pending && (
                          <>
                            <button
                              type="button"
                              className="book-services-action primary"
                              onClick={() => {
                                setSelectedProvider(provider);
                                setNotice("");
                              }}
                            >
                              <ShieldCheck size={13} />
                              Verify Docs
                            </button>

                            <button
                              type="button"
                              className="book-services-action danger"
                              onClick={() =>
                                openReviewDialog(provider, "reject")
                              }
                            >
                              <X size={13} />
                              Reject
                            </button>
                          </>
                        )}

                        {/* Existing active professionals: block beside View Profile */}
                        {provider.accountState === "Active" && (
                          <button
                            type="button"
                            className="book-services-action danger"
                            onClick={() =>
                              openReviewDialog(provider, "block")
                            }
                          >
                            <Ban size={13} />
                            Block
                          </button>
                        )}

                        {["Suspended", "Blocked", "Rejected"].includes(
                          provider.accountState ?? "",
                        ) && (
                          <span className="book-services-action-disabled">
                            {provider.accountState}
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}

              {paginatedProviders.length === 0 && (
                <tr>
                  <td colSpan={7}>
                    <div className="book-services-empty">
                      <Search size={26} />
                      <strong>No service providers found</strong>
                      <span>
                        Try changing your filters or search term.
                      </span>
                      <button type="button" onClick={clearFilters}>
                        Clear Filters
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* REAL PAGINATION */}
        <div className="book-services-pagination">
          <span>
            Showing <strong>{firstItem}–{lastItem}</strong> of{" "}
            <strong>{filteredProviders.length}</strong> matching providers
          </span>

          <div className="book-services-pagination-buttons">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() =>
                setPage((current) => Math.max(1, current - 1))
              }
              aria-label="Previous page"
            >
              <ChevronLeft size={15} />
            </button>

            {Array.from({ length: pageCount }, (_, index) => index + 1).map(
              (pageNumber) => (
                <button
                  key={pageNumber}
                  type="button"
                  className={currentPage === pageNumber ? "active" : ""}
                  aria-current={
                    currentPage === pageNumber ? "page" : undefined
                  }
                  onClick={() => setPage(pageNumber)}
                >
                  {pageNumber}
                </button>
              ),
            )}

            <button
              type="button"
              disabled={currentPage >= pageCount}
              onClick={() =>
                setPage((current) =>
                  Math.min(pageCount, current + 1),
                )
              }
              aria-label="Next page"
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </section>

      {/* NOTIFICATION */}
      {notice && (
        <div className="book-services-toast" role="status">
          <span>{notice}</span>
          <button
            type="button"
            aria-label="Dismiss message"
            onClick={() => setNotice("")}
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* PROFILE MODAL */}
      {selectedProvider && (
        <div
          className="book-services-modal-backdrop"
          onClick={() => setSelectedProvider(null)}
        >
          <section
            className="book-services-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="provider-profile-title"
            onClick={(event) => event.stopPropagation()}
          >
            <header className="book-services-modal-header">
              <h2 id="provider-profile-title">
                {isPending(selectedProvider)
                  ? "Verify Professional Documents"
                  : "View Profile"}
              </h2>

              <button
                type="button"
                className="book-services-modal-close"
                onClick={() => setSelectedProvider(null)}
                aria-label="Close profile"
              >
                <X size={20} />
              </button>
            </header>

            <div className="book-services-modal-body">
              {isPending(selectedProvider) && (
                <div className="book-services-verification-notice">
                  <ShieldCheck size={19} />
                  <div>
                    <strong>Verification required</strong>
                    <p>
                      Review the applicant's details and submitted documents
                      before approving this professional.
                    </p>
                  </div>
                </div>
              )}

              <div className="book-services-profile-top">
                <div className="book-services-modal-avatar">
                  {selectedProvider.initials}
                </div>

                <div className="book-services-profile-name">
                  <h3>
                    {selectedProvider.name}
                    <ShieldCheck
                      className="book-services-name-shield"
                      size={19}
                    />
                  </h3>

                  <p>
                    {selectedProvider.designation}
                    <span>•</span>
                    {selectedProvider.id}
                  </p>

                  <span
                    className={`book-services-status ${getStatusClass(
                      selectedProvider,
                    )}`}
                  >
                    {getDisplayedStatus(selectedProvider)}
                  </span>
                </div>

                <div className="book-services-rating">
                  <div
                    aria-label={`${selectedProvider.rating} out of 5 stars`}
                  >
                    ★★★★★
                  </div>
                  <span>
                    {selectedProvider.rating} (
                    {selectedProvider.reviewCount} reviews)
                  </span>
                </div>
              </div>

              {selectedProvider.rejectionReason && (
                <div className="book-services-account-reason">
                  <strong>{getReasonLabel(selectedProvider)}</strong>
                  <p>{selectedProvider.rejectionReason}</p>

                  {selectedProvider.accountState === "Suspended" &&
                    selectedProvider.suspensionUntil && (
                      <div className="book-services-suspension-details">
                        <span>
                          <CalendarDays size={15} />
                          Duration: {selectedProvider.suspensionDuration}
                        </span>

                        <span>
                          <CalendarDays size={15} />
                          Suspension ends:{" "}
                          {new Date(
                            selectedProvider.suspensionUntil,
                          ).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    )}
                </div>
              )}

              <div className="book-services-profile-meta">
                <div>
                  <MapPin size={19} />
                  <span>
                    <small>Location</small>
                    <strong>{selectedProvider.location}</strong>
                  </span>
                </div>

                <div>
                  <CalendarDays size={19} />
                  <span>
                    <small>Joined on</small>
                    <strong>{selectedProvider.joinedOn}</strong>
                  </span>
                </div>

                <div>
                  <Wrench size={19} />
                  <span>
                    <small>Experience</small>
                    <strong>{selectedProvider.experience}</strong>
                  </span>
                </div>
              </div>

              <section className="book-services-about">
                <h4>
                  <ShieldCheck size={19} />
                  About
                </h4>
                <p>{selectedProvider.about}</p>
              </section>

              {/* DOCUMENTS */}
              <section className="book-services-documents">
                <div className="book-services-documents-heading">
                  <h4>
                    <FileText size={19} />
                    ID Proofs &amp; Documents
                  </h4>

                  <button
                    type="button"
                    className="book-services-download-all"
                    onClick={downloadAllDocuments}
                  >
                    <Download size={14} />
                    Download All
                  </button>
                </div>

                <div className="book-services-document-list">
                  {selectedProvider.documents.map((document) => (
                    <div
                      className="book-services-document-row"
                      key={document.id}
                    >
                      <div className="book-services-document-icon">
                        {document.id === "id-proof" ? (
                          <FileBadge size={25} />
                        ) : (
                          <FileText size={25} />
                        )}
                      </div>

                      <div className="book-services-document-info">
                        <strong>{document.title}</strong>
                        <span>{document.subtitle}</span>
                      </div>

                      <div className="book-services-document-actions">
                        <button
                          type="button"
                          className="book-services-doc-view"
                          onClick={() => openDocument(document)}
                        >
                          <Eye size={14} />
                          View
                        </button>

                        <button
                          type="button"
                          className="book-services-doc-download"
                          onClick={() => downloadDocument(document)}
                        >
                          <Download size={14} />
                          Download
                        </button>
                      </div>

                      <span
                        className={`book-services-doc-status ${document.status.toLowerCase()}`}
                      >
                        {document.status === "Verified" ? (
                          <CheckCircle2 size={13} />
                        ) : document.status === "Rejected" ? (
                          <X size={13} />
                        ) : (
                          <span className="book-services-pending-dot" />
                        )}
                        {document.status}
                      </span>
                    </div>
                  ))}
                </div>

                <p className="book-services-document-note">
                  Document previews and downloads require a valid uploaded
                  file URL in each document's <code>url</code> property.
                </p>
              </section>

              <section className="book-services-selected-services">
                <h4>
                  <UsersRound size={18} />
                  Selected Services
                </h4>

                <div>
                  {selectedProvider.services.map((service) => (
                    <span key={service}>{service}</span>
                  ))}
                </div>
              </section>

              <section className="book-services-contact">
                <h4>Contact Information</h4>

                <div>
                  <span>
                    <Phone size={17} />
                    {selectedProvider.phone}
                  </span>

                  <span>
                    <Mail size={17} />
                    {selectedProvider.email}
                  </span>
                </div>
              </section>
            </div>

            <footer className="book-services-modal-footer">
              <button
                type="button"
                className="book-services-modal-secondary"
                onClick={() => setSelectedProvider(null)}
              >
                Close
              </button>

              {isPending(selectedProvider) && (
                <>
                  <button
                    type="button"
                    className="book-services-action danger"
                    onClick={() =>
                      openReviewDialog(selectedProvider, "reject")
                    }
                  >
                    <X size={13} />
                    Reject Application
                  </button>

                  <button
                    type="button"
                    className="book-services-action primary"
                    onClick={() => verifyProvider(selectedProvider)}
                  >
                    <Check size={13} />
                    Verify &amp; Approve
                  </button>
                </>
              )}

              {selectedProvider.accountState === "Active" && (
                <>
                  <button
                    type="button"
                    className="book-services-action warning"
                    onClick={() =>
                      openReviewDialog(selectedProvider, "suspend")
                    }
                  >
                    <CalendarDays size={13} />
                    Suspend
                  </button>

                  <button
                    type="button"
                    className="book-services-action danger"
                    onClick={() =>
                      openReviewDialog(selectedProvider, "block")
                    }
                  >
                    <Ban size={13} />
                    Block
                  </button>
                </>
              )}

              {["Suspended", "Blocked"].includes(
                selectedProvider.accountState ?? "",
              ) && (
                <span className="book-services-action-disabled">
                  {selectedProvider.accountState}
                </span>
              )}
            </footer>
          </section>
        </div>
      )}

      {/* REJECT / BLOCK / SUSPEND DIALOG */}
      {reviewTarget && (
        <div
          className="book-services-reject-backdrop"
          onClick={closeReviewDialog}
        >
          <section
            className="book-services-reject-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="review-dialog-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className={`book-services-reject-icon ${reviewAction}`}>
              {reviewAction === "reject" ? (
                <X size={22} />
              ) : reviewAction === "block" ? (
                <Ban size={22} />
              ) : (
                <CalendarDays size={22} />
              )}
            </div>

            <h2 id="review-dialog-title">
              {reviewAction === "reject"
                ? "Reject Professional Request"
                : reviewAction === "block"
                  ? "Block Professional"
                  : "Suspend Professional"}
            </h2>

            <p>
              {reviewAction === "reject"
                ? "Provide a reason for rejecting the application of"
                : reviewAction === "block"
                  ? "Provide a reason for blocking"
                  : "Provide a reason and select a suspension period for"}{" "}
              <strong>{reviewTarget.name}</strong>.
            </p>

            <label htmlFor="review-reason">
              {reviewAction === "reject"
                ? "Reason for rejection"
                : reviewAction === "block"
                  ? "Reason for blocking"
                  : "Reason for suspension"}{" "}
              <span>*</span>
            </label>

            <textarea
              id="review-reason"
              rows={4}
              value={reviewReason}
              onChange={(event) => {
                setReviewReason(event.target.value);
                setReviewError("");
              }}
              placeholder={
                reviewAction === "reject"
                  ? "Explain why this application is being rejected..."
                  : reviewAction === "block"
                    ? "Explain why this professional is being blocked..."
                    : "Explain why this professional needs to be suspended..."
              }
              aria-invalid={Boolean(reviewError)}
              aria-describedby={
                reviewError ? "review-reason-error" : undefined
              }
            />

            {reviewAction === "suspend" && (
              <div className="book-services-suspension-period">
                <label htmlFor="suspension-duration">
                  Suspension period <span>*</span>
                </label>

                <select
                  id="suspension-duration"
                  value={suspensionDuration}
                  onChange={(event) => {
                    setSuspensionDuration(event.target.value);
                    setReviewError("");
                  }}
                >
                  <option value="7">7 days</option>
                  <option value="15">15 days</option>
                  <option value="30">30 days</option>
                  <option value="60">60 days</option>
                  <option value="90">90 days</option>
                </select>

                <p>
                  The suspension expiry date will be calculated from the
                  date you submit this action.
                </p>
              </div>
            )}

            {reviewError && (
              <span
                id="review-reason-error"
                className="book-services-rejection-error"
                role="alert"
              >
                {reviewError}
              </span>
            )}

            <div className="book-services-reject-actions">
              <button
                type="button"
                className="book-services-modal-secondary"
                onClick={closeReviewDialog}
              >
                Cancel
              </button>

              <button
                type="button"
                className={`book-services-action ${
                  reviewAction === "suspend" ? "warning" : "danger"
                }`}
                onClick={submitReviewAction}
              >
                {reviewAction === "reject" ? (
                  <X size={13} />
                ) : reviewAction === "block" ? (
                  <Ban size={13} />
                ) : (
                  <CalendarDays size={13} />
                )}

                {reviewAction === "reject"
                  ? "Submit & Reject"
                  : reviewAction === "block"
                    ? "Confirm Block"
                    : "Confirm Suspension"}
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}