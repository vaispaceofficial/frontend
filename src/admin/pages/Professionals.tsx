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

type ProfessionalApplication = {
  id?: string;
  fullName?: string;
  name?: string;
  mobile?: string;
  phone?: string;
  email?: string;
  city?: string;
  state?: string;
  category?: string;
  designation?: string;
  services?: string[];
  experience?: string | number;
  workType?: string;
  workingDays?: string[];
  serviceArea?: string;
  about?: string;
  visitingFee?: string | number;
  profileImage?: string;
  image?: string;
  photo?: string;
  submittedAt?: string;
  joinedOn?: string;
  status?: string;
  accountState?: AccountState;
  rejectionReason?: string;
  suspensionUntil?: string;
  suspensionDuration?: string;
  documents?: Array<{
    id?: string;
    title?: string;
    name?: string;
    subtitle?: string;
    description?: string;
    status?: DocumentStatus;
    url?: string;
    fileUrl?: string;
    fileName?: string;
  }>;
  idProof?: string;
  idProofUrl?: string;
  experienceCertificate?: string;
  experienceCertificateUrl?: string;
  [key: string]: unknown;
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
  profileImage?: string;
  accountState?: AccountState;
  rejectionReason?: string;
  suspensionUntil?: string;
  suspensionDuration?: string;
  documents: ProviderDocument[];
};

const PAGE_SIZE = 5;

const APPLICATION_KEY = "oneservice_professional_application";
const APPLICATIONS_KEY = "oneservice_professional_applications";
const PROFESSIONALS_KEY = "oneservice_professionals";
const CHANGE_EVENT = "oneservice-professional-change";

const serviceTypes = [
  "Service Type",
  "AC Technician",
  "Electrician",
  "Plumber",
  "Tailor",
  "Cleaning",
  "Carpenter",
  "Home Appliances",
  "Home Services",
  "Personal Services",
  "Professional Services",
  "Home Staff",
  "EduTech & Home Tutors",
];

const locations = [
  "Location",
  "Visakhapatnam",
  "Vizianagaram",
  "Anakapalle",
  "Gajuwaka",
  "Madhurawada",
  "MVP Colony",
  "Dwaraka Nagar",
  "Siripuram",
];

const statuses = [
  "All statuses",
  "Pending",
  "Verified",
  "Suspended",
  "Blocked",
  "Rejected",
];

function safeReadJson<T>(key: string, fallback: T): T {
  try {
    const value = localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("") || "PR";
}

function formatDate(value?: string): string {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function normalizeDocumentStatus(
  status?: string,
): DocumentStatus {
  const normalized = (status || "").toLowerCase();

  if (normalized === "verified" || normalized === "approved") {
    return "Verified";
  }

  if (normalized === "rejected") {
    return "Rejected";
  }

  return "Pending";
}

function normalizeDocuments(
  application: ProfessionalApplication,
): ProviderDocument[] {
  const suppliedDocuments = Array.isArray(application.documents)
    ? application.documents
    : [];

  const documents: ProviderDocument[] = suppliedDocuments.map(
    (document, index) => ({
      id: document.id || `document-${index + 1}`,
      title: document.title || document.name || `Document ${index + 1}`,
      subtitle:
        document.subtitle ||
        document.description ||
        document.fileName ||
        "Submitted document",
      status: normalizeDocumentStatus(document.status),
      url: document.url || document.fileUrl,
      fileName:
        document.fileName ||
        `${(document.title || document.name || "document")
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")}.pdf`,
    }),
  );

  if (documents.length > 0) return documents;

  if (application.idProofUrl || application.idProof) {
    documents.push({
      id: "id-proof",
      title: "Government ID Proof",
      subtitle: "Identity document submitted during registration",
      status: "Pending",
      url: application.idProofUrl || application.idProof,
      fileName: "professional-id-proof.pdf",
    });
  }

  if (
    application.experienceCertificateUrl ||
    application.experienceCertificate
  ) {
    documents.push({
      id: "experience",
      title: "Experience Certificate",
      subtitle: "Professional experience document",
      status: "Pending",
      url:
        application.experienceCertificateUrl ||
        application.experienceCertificate,
      fileName: "professional-experience-certificate.pdf",
    });
  }

  if (documents.length === 0) {
    documents.push({
      id: "registration",
      title: "Registration Details",
      subtitle: "Professional registration information",
      status: "Pending",
      fileName: "professional-registration.pdf",
    });
  }

  return documents;
}

function normalizeAccountState(
  application: ProfessionalApplication,
): AccountState | undefined {
  if (application.accountState) return application.accountState;

  const status = (application.status || "").toLowerCase();

  if (status === "approved" || status === "verified" || status === "active") {
    return "Active";
  }

  if (status === "rejected") return "Rejected";
  if (status === "blocked") return "Blocked";
  if (status === "suspended") return "Suspended";

  return undefined;
}

function normalizeProvider(
  application: ProfessionalApplication,
  index: number,
): Provider {
  const name =
    application.fullName ||
    application.name ||
    "Unnamed Professional";

  const category =
    application.category ||
    application.designation ||
    "Professional Services";

  const id = application.id || `PRO-${index + 1}`;

  const accountState = normalizeAccountState(application);

  const isApproved = accountState === "Active";

  return {
    id,
    initials: getInitials(name),
    name,
    designation: application.designation || category,
    category,
    location: [
      application.city,
      application.state,
    ]
      .filter(Boolean)
      .join(", ") || application.serviceArea || "Location not provided",
    experience:
      application.experience !== undefined &&
      application.experience !== ""
        ? `${application.experience}${
            typeof application.experience === "number" ||
            /^\d+$/.test(String(application.experience))
              ? " years"
              : ""
          }`
        : "Not provided",
    idProofStatus: isApproved ? "Verified" : "Pending",
    subscriptionExpiry: "—",
    joinedOn: formatDate(application.submittedAt || application.joinedOn),
    rating: "—",
    reviewCount: 0,
    about: application.about || "No professional description provided.",
    services: Array.isArray(application.services)
      ? application.services
      : [],
    phone: application.mobile || application.phone || "—",
    email: application.email || "—",
    profileImage:
      application.profileImage ||
      application.image ||
      application.photo,
    accountState,
    rejectionReason: application.rejectionReason,
    suspensionUntil: application.suspensionUntil,
    suspensionDuration: application.suspensionDuration,
    documents: normalizeDocuments(application),
  };
}

function readApplications(): ProfessionalApplication[] {
  const multiple = safeReadJson<unknown>(APPLICATIONS_KEY, []);
  const professionals = safeReadJson<unknown>(PROFESSIONALS_KEY, []);
  const single = safeReadJson<unknown>(APPLICATION_KEY, null);

  const combined: ProfessionalApplication[] = [];

  if (Array.isArray(multiple)) {
    combined.push(
      ...(multiple as ProfessionalApplication[]),
    );
  }

  if (Array.isArray(professionals)) {
    combined.push(
      ...(professionals as ProfessionalApplication[]),
    );
  }

  if (
    single &&
    typeof single === "object" &&
    !Array.isArray(single)
  ) {
    combined.push(single as ProfessionalApplication);
  }

  const unique = new Map<string, ProfessionalApplication>();

  combined.forEach((record, index) => {
    const id =
      record.id ||
      `${record.mobile || record.phone || record.fullName || record.name || "professional"}-${index}`;

    unique.set(id, record);
  });

  return Array.from(unique.values());
}

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

function persistProviderUpdate(
  provider: Provider,
  updatedState: AccountState,
  reason?: string,
  suspensionDuration?: string,
  suspensionUntil?: string,
) {
  const updateRecord = (
    application: ProfessionalApplication,
  ): ProfessionalApplication => {
    if (application.id !== provider.id) return application;

    return {
      ...application,
      status:
        updatedState === "Active"
          ? "Approved"
          : updatedState,
      accountState: updatedState,
      rejectionReason: reason,
      suspensionDuration,
      suspensionUntil,
    };
  };

  const applications = safeReadJson<ProfessionalApplication[]>(
    APPLICATIONS_KEY,
    [],
  );

  if (Array.isArray(applications)) {
    localStorage.setItem(
      APPLICATIONS_KEY,
      JSON.stringify(applications.map(updateRecord)),
    );
  }

  const professionals = safeReadJson<ProfessionalApplication[]>(
    PROFESSIONALS_KEY,
    [],
  );

  if (Array.isArray(professionals)) {
    localStorage.setItem(
      PROFESSIONALS_KEY,
      JSON.stringify(professionals.map(updateRecord)),
    );
  }

  const single = safeReadJson<ProfessionalApplication | null>(
    APPLICATION_KEY,
    null,
  );

  if (single?.id === provider.id) {
    localStorage.setItem(
      APPLICATION_KEY,
      JSON.stringify(updateRecord(single)),
    );
  }

  window.dispatchEvent(new Event(CHANGE_EVENT));
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

  const [providerList, setProviderList] = useState<Provider[]>([]);

  useEffect(() => {
    const loadProviders = () => {
      const registeredApplications = readApplications();

      const mappedProviders = registeredApplications.map(
        (application, index) =>
          normalizeProvider(application, index),
      );

      setProviderList(mappedProviders);
    };

    loadProviders();

    window.addEventListener("storage", loadProviders);
    window.addEventListener(CHANGE_EVENT, loadProviders);

    return () => {
      window.removeEventListener("storage", loadProviders);
      window.removeEventListener(CHANGE_EVENT, loadProviders);
    };
  }, []);

  const filteredProviders = useMemo(() => {
    const query = search.trim().toLowerCase();

    return providerList.filter((provider) => {
      const matchesService =
        serviceType === "Service Type" ||
        provider.category.toLowerCase() === serviceType.toLowerCase() ||
        provider.services.some(
          (service) =>
            service.toLowerCase() === serviceType.toLowerCase(),
        );

      const matchesLocation =
        location === "Location" ||
        provider.location.toLowerCase().includes(location.toLowerCase());

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
        ...provider.services,
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

  const updateProvider = (
    updated: Provider,
    nextState: AccountState,
    reason?: string,
    duration?: string,
    until?: string,
  ) => {
    persistProviderUpdate(
      updated,
      nextState,
      reason,
      duration,
      until,
    );

    setProviderList((current) =>
      current.map((provider) =>
        provider.id === updated.id
          ? {
              ...updated,
              accountState: nextState,
              rejectionReason: reason,
              suspensionDuration: duration,
              suspensionUntil: until,
              idProofStatus:
                nextState === "Active" ? "Verified" : "Pending",
            }
          : provider,
      ),
    );

    setSelectedProvider((current) =>
      current?.id === updated.id
        ? {
            ...updated,
            accountState: nextState,
            rejectionReason: reason,
            suspensionDuration: duration,
            suspensionUntil: until,
          }
        : current,
    );

    setReviewTarget(null);
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
      window.setTimeout(
        () => downloadDocument(document),
        index * 250,
      );
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

    updateProvider(updatedProvider, "Active");
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

    const nextState: AccountState =
      action === "reject"
        ? "Rejected"
        : action === "block"
          ? "Blocked"
          : "Suspended";

    const updatedProvider: Provider = {
      ...target,
      accountState: nextState,
      rejectionReason: reason,
      suspensionDuration:
        action === "suspend" ? `${suspensionDays} days` : undefined,
      suspensionUntil:
        action === "suspend" ? suspensionUntil : undefined,
    };

    updateProvider(
      updatedProvider,
      nextState,
      reason,
      updatedProvider.suspensionDuration,
      suspensionUntil,
    );

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
                        {provider.profileImage ? (
                          <img
                            src={provider.profileImage}
                            alt={provider.name}
                          />
                        ) : (
                          provider.initials
                        )}
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
                          onClick={() => {
                            setSelectedProvider(provider);
                            setNotice("");
                          }}
                        >
                          <Eye size={13} />
                          View Profile
                        </button>

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
                        {providerList.length === 0
                          ? "Professional registrations will appear here when applicants submit their forms."
                          : "Try changing your filters or search term."}
                      </span>
                      {hasFilters && (
                        <button type="button" onClick={clearFilters}>
                          Clear Filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

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

            {Array.from(
              { length: pageCount },
              (_, index) => index + 1,
            ).map((pageNumber) => (
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
            ))}

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
                      Review the applicant's details and submitted
                      documents before approving this professional.
                    </p>
                  </div>
                </div>
              )}

              <div className="book-services-profile-top">
                <div className="book-services-modal-avatar">
                  {selectedProvider.profileImage ? (
                    <img
                      src={selectedProvider.profileImage}
                      alt={selectedProvider.name}
                    />
                  ) : (
                    selectedProvider.initials
                  )}
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
                  <div aria-label="No customer rating available">
                    ★★★★★
                  </div>
                  <span>
                    {selectedProvider.rating === "—"
                      ? "No customer reviews yet"
                      : `${selectedProvider.rating} (${selectedProvider.reviewCount} reviews)`}
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
                          {formatDate(selectedProvider.suspensionUntil)}
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
                  {selectedProvider.services.length > 0 ? (
                    selectedProvider.services.map((service) => (
                      <span key={service}>{service}</span>
                    ))
                  ) : (
                    <span>No services submitted</span>
                  )}
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