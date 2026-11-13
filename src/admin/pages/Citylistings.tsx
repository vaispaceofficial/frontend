
import { useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

import {
  Activity,
  Building2,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Download,
  ExternalLink,
  Eye,
  FileCheck,
  FileText,
  Image as ImageIcon,
  // IndianRupee,
  LayoutDashboard,
  MapPin,
  MessageSquare,
  Package,
  PauseCircle,
  Search,
  ShieldCheck,
  Star,
  Store,
  UserRound,
  Wallet,
  Wrench,
  X,
} from "lucide-react";

import "./Citylistings.css";

/* =========================================================
   TYPES
========================================================= */

type VendorStatus =
  | "Approved"
  | "Pending"
  | "Rejected"
  | "Suspended";

type RegistrationStatus = "Paid" | "Pending";

type VendorRecord = Record<string, unknown> & {
  id?: string;
  vendorId?: string;
  fullName?: string;
  ownerName?: string;
  name?: string;
  businessName?: string;
  businessType?: string;
  businessCategory?: string;
  mobile?: string;
  phone?: string;
  email?: string;
  whatsapp?: string;
  whatsappNumber?: string;
  alternateMobile?: string;
  website?: string;
  businessAddress?: string;
  address?: string;
  locality?: string;
  area?: string;
  city?: string;
  state?: string;
  pincode?: string;
  pinCode?: string;
  postalCode?: string;
  description?: string;
  businessDescription?: string;
  productDescription?: string;
  projects?: string;
  portfolioDescription?: string;
  products?: unknown[];
  services?: unknown[];
  serviceAreas?: unknown[];
  coverageAreas?: unknown[];
  paymentMethods?: unknown[];
  productCount?: number;
  serviceCount?: number;
  workingHours?: string;
  businessHours?: string;
  workingDays?: string;
  delivery?: string;
  deliveryAvailability?: string;
  rating?: string | number;
  reviews?: number;
  views?: number;
  enquiries?: number;
  phoneClicks?: number;
  followers?: number;
  registrationStatus?: string;
  registrationFeeStatus?: string;
  feeStatus?: string;
  paymentStatus?: string;
  status?: string;
  vendorStatus?: string;
  registeredAt?: string;
  createdAt?: string;
  established?: string;
  yearEstablished?: string;
};

type Business = {
  id: string;
  name: string;
  type: string;
  owner: string;
  email: string;
  phone: string;
  whatsapp: string;
  alternateMobile: string;
  website: string;
  description: string;
  established: string;
  address: string;
  locality: string;
  city: string;
  state: string;
  pincode: string;
  products: string[];
  services: string[];
  serviceAreas: string[];
  productCount: number;
  serviceCount: number;
  workingHours: string;
  workingDays: string;
  delivery: string;
  paymentMethods: string[];
  rating: string;
  reviews: number;
  views: number;
  enquiries: number;
  phoneClicks: number;
  followers: number;
  registrationStatus: RegistrationStatus;
  vendorStatus: VendorStatus;
  registeredAt: string;
  projects: string;
  documents: unknown[];
  gallery: unknown[];
  portfolioLinks: unknown[];
};

type VendorTab =
  | "Overview"
  | "Business Details"
  | "Operations"
  | "Documents & Gallery"
  | "Performance & Activity";

const VENDORS_STORAGE_KEY = "oneservice_vendors";
const REMARKS_STORAGE_KEY = "oneservice_vendor_admin_remarks";

/* =========================================================
   HELPERS
========================================================= */

const readText = (
  value: unknown,
  fallback = "Not provided",
): string => {
  if (
    typeof value === "string" &&
    value.trim()
  ) {
    return value.trim();
  }

  if (
    typeof value === "number" &&
    Number.isFinite(value)
  ) {
    return String(value);
  }

  return fallback;
};

const readNumber = (
  value: unknown,
  fallback = 0,
): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const readArray = (value: unknown): string[] => {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => {
      if (typeof item === "string") {
        return item.trim();
      }

      if (item && typeof item === "object") {
        const record = item as Record<string, unknown>;

        return readText(
          record.name ??
            record.title ??
            record.category ??
            record.label,
          "",
        );
      }

      return "";
    })
    .filter(Boolean);
};

const readStoredVendors = (): VendorRecord[] => {
  try {
    const stored = localStorage.getItem(VENDORS_STORAGE_KEY);

    if (!stored) return [];

    const parsed: unknown = JSON.parse(stored);

    if (!Array.isArray(parsed)) return [];

    return parsed.filter(
      (item): item is VendorRecord =>
        Boolean(item) &&
        typeof item === "object" &&
        !Array.isArray(item),
    );
  } catch (error) {
    console.error("Unable to read vendors:", error);
    return [];
  }
};

const writeStoredVendors = (
  vendors: VendorRecord[],
) => {
  try {
    localStorage.setItem(
      VENDORS_STORAGE_KEY,
      JSON.stringify(vendors),
    );

    window.dispatchEvent(
      new CustomEvent("oneservice-vendors-change"),
    );
  } catch (error) {
    console.error("Unable to save vendors:", error);
  }
};

const getVendorIdentity = (
  vendor: VendorRecord,
): string => {
  const identity =
    vendor.vendorId ??
    vendor.id ??
    vendor.mobile ??
    vendor.phone ??
    vendor.email;

  if (
    typeof identity !== "string" &&
    typeof identity !== "number"
  ) {
    return "";
  }

  return String(identity).trim().toLowerCase();
};

const getVendorBusinessId = (
  vendor: VendorRecord,
): string => {
  const explicitId = vendor.vendorId ?? vendor.id;

  if (
    typeof explicitId === "string" &&
    explicitId.trim()
  ) {
    return explicitId.trim();
  }

  if (
    typeof explicitId === "number" &&
    Number.isFinite(explicitId)
  ) {
    return String(explicitId);
  }

  const identity = getVendorIdentity(vendor);

  if (identity) return `V-${identity}`;

  const name = readText(
    vendor.businessName ?? vendor.name,
    "Unnamed Business",
  );

  return `V-${name.replace(/[^a-zA-Z0-9]/g, "").slice(0, 12)}`;
};

const normalizeStatus = (
  status: unknown,
): VendorStatus => {
  const value = readText(status, "Pending").toLowerCase();

  if (
    value.includes("approved") ||
    value === "active" ||
    value === "verified"
  ) {
    return "Approved";
  }

  if (value.includes("reject")) return "Rejected";
  if (value.includes("suspend")) return "Suspended";

  return "Pending";
};

const normalizeRegistrationStatus = (
  vendor: VendorRecord,
): RegistrationStatus => {
  const value = readText(
    vendor.registrationStatus ??
      vendor.registrationFeeStatus ??
      vendor.feeStatus ??
      vendor.paymentStatus,
    "Pending",
  ).toLowerCase();

  return ["paid", "completed", "success"].includes(value)
    ? "Paid"
    : "Pending";
};

/* =========================================================
   NORMALIZE VENDOR
========================================================= */

const normalizeBusiness = (
  vendor: VendorRecord,
): Business => {
  const products = readArray(vendor.products);
  const services = readArray(vendor.services);

  return {
    id: getVendorBusinessId(vendor),

    name: readText(
      vendor.businessName ?? vendor.name,
      "Unnamed Business",
    ),

    type: readText(
      vendor.businessType ?? vendor.businessCategory,
      "Business & Professional Services",
    ),

    owner: readText(
      vendor.fullName ?? vendor.ownerName,
    ),

    email: readText(vendor.email),
    phone: readText(vendor.mobile ?? vendor.phone),

    whatsapp: readText(
      vendor.whatsapp ?? vendor.whatsappNumber,
    ),

    alternateMobile: readText(vendor.alternateMobile),
    website: readText(vendor.website),

    description: readText(
      vendor.productDescription ??
        vendor.description ??
        vendor.businessDescription,
    ),

    established: readText(
      vendor.established ?? vendor.yearEstablished,
    ),

    address: readText(
      vendor.businessAddress ?? vendor.address,
    ),

    locality: readText(
      vendor.locality ?? vendor.area,
      "",
    ),

    city: readText(vendor.city, "Visakhapatnam"),
    state: readText(vendor.state, "Andhra Pradesh"),

    pincode: readText(
      vendor.pincode ?? vendor.pinCode ?? vendor.postalCode,
    ),

    products,
    services,

    serviceAreas: readArray(
      vendor.serviceAreas ?? vendor.coverageAreas,
    ),

    productCount: readNumber(
      vendor.productCount,
      products.length,
    ),

    serviceCount: readNumber(
      vendor.serviceCount,
      services.length,
    ),

    workingHours: readText(
      vendor.workingHours ?? vendor.businessHours,
    ),

    workingDays: readText(vendor.workingDays),

    delivery: readText(
      vendor.delivery ?? vendor.deliveryAvailability,
    ),

    paymentMethods: readArray(vendor.paymentMethods),

    rating: readText(vendor.rating, "Not available"),
    reviews: readNumber(vendor.reviews),
    views: readNumber(vendor.views),
    enquiries: readNumber(vendor.enquiries),
    phoneClicks: readNumber(vendor.phoneClicks),
    followers: readNumber(vendor.followers),

    registrationStatus: normalizeRegistrationStatus(vendor),

    vendorStatus: normalizeStatus(
      vendor.status ?? vendor.vendorStatus,
    ),

    registeredAt: readText(
      vendor.registeredAt ?? vendor.createdAt,
    ),

    projects: readText(
      vendor.projects ?? vendor.portfolioDescription,
    ),

    documents: [
      ...(Array.isArray(vendor.documents) ? vendor.documents : []),
      ...(Array.isArray(vendor.uploadedDocuments)
        ? vendor.uploadedDocuments
        : []),
      ...(Array.isArray(vendor.businessDocuments)
        ? vendor.businessDocuments
        : []),
    ],

    gallery: [
      ...(Array.isArray(vendor.gallery) ? vendor.gallery : []),
      ...(Array.isArray(vendor.images) ? vendor.images : []),
      ...(Array.isArray(vendor.photos) ? vendor.photos : []),
    ],

    portfolioLinks: Array.isArray(vendor.portfolioLinks)
      ? vendor.portfolioLinks
      : [],
  };
};

/* =========================================================
   FILTER OPTIONS
========================================================= */

const contractorTypes = [
  "All contractor types",
  "Interior Designer",
  "Plywood Store",
  "Construction Contractor",
  "Modular Furniture",
  "Civil Contractor",
];

/* =========================================================
   FIVE COMPACT TABS
========================================================= */

const vendorTabs: {
  label: VendorTab;
  icon: typeof LayoutDashboard;
}[] = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "Business Details", icon: Building2 },
  { label: "Operations", icon: Clock3 },
  { label: "Documents & Gallery", icon: FileCheck },
  { label: "Performance & Activity", icon: Activity },
];

/* =========================================================
   REUSABLE DETAIL COMPONENTS
========================================================= */

function DetailItem({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) {
  const displayValue =
    value !== undefined &&
    value !== null &&
    value !== ""
      ? value
      : "Not provided";

  return (
    <div className="vendor-detail-item">
      <span>{label}</span>
      <strong>{displayValue}</strong>
    </div>
  );
}

function DetailCard({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: typeof Building2;
  children: ReactNode;
}) {
  return (
    <section className="vendor-detail-card">
      <div className="vendor-detail-card-heading">
        <span className="vendor-detail-card-icon">
          <Icon size={17} />
        </span>

        <h3>{title}</h3>
      </div>

      {children}
    </section>
  );
}

function Metric({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="vendor-metric">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

/* =========================================================
   DOCUMENT / GALLERY HELPERS
========================================================= */

function getMediaDetails(item: unknown) {
  if (typeof item === "string") {
    return {
      name: item.split("/").pop() || item,
      url: item,
    };
  }

  if (item && typeof item === "object") {
    const record = item as Record<string, unknown>;

    return {
      name: readText(
        record.name ?? record.title ?? record.filename,
        "Uploaded file",
      ),
      url: readText(
        record.url ??
          record.fileUrl ??
          record.image ??
          record.src,
        "",
      ),
    };
  }

  return {
    name: "Uploaded file",
    url: "",
  };
}

// function isImageUrl(url: string) {
//   return /\.(png|jpe?g|webp|gif|avif)(\?.*)?$/i.test(url);
// }

/* =========================================================
   MAIN ADMIN COMPONENT
========================================================= */

export default function Businesses() {
  const [search, setSearch] = useState("");

  const [contractorType, setContractorType] =
    useState("All contractor types");

  const [registeredVendors, setRegisteredVendors] =
    useState<VendorRecord[]>([]);

  const [selectedBusiness, setSelectedBusiness] =
    useState<Business | null>(null);

  const [activeTab, setActiveTab] =
    useState<VendorTab>("Overview");

  const [action, setAction] = useState<
    "portfolio" | "subscription" | null
  >(null);

  const [page, setPage] = useState(1);

  const [remarks, setRemarks] = useState<
    Record<string, string>
  >({});

  const [remarkInput, setRemarkInput] = useState("");

  /* =====================================================
     LOAD DATA
  ===================================================== */

  const loadVendors = useCallback(() => {
    setRegisteredVendors(readStoredVendors());

    try {
      const stored = localStorage.getItem(REMARKS_STORAGE_KEY);

      if (!stored) {
        setRemarks({});
        return;
      }

      const parsed: unknown = JSON.parse(stored);

      if (
        parsed &&
        typeof parsed === "object" &&
        !Array.isArray(parsed)
      ) {
        setRemarks(parsed as Record<string, string>);
      } else {
        setRemarks({});
      }
    } catch (error) {
      console.error("Unable to read remarks:", error);
      setRemarks({});
    }
  }, []);

  useEffect(() => {
    loadVendors();

    window.addEventListener(
      "oneservice-vendors-change",
      loadVendors,
    );

    window.addEventListener("storage", loadVendors);

    return () => {
      window.removeEventListener(
        "oneservice-vendors-change",
        loadVendors,
      );

      window.removeEventListener("storage", loadVendors);
    };
  }, [loadVendors]);

  /* =====================================================
     NORMALIZED BUSINESS COLLECTION
  ===================================================== */

  const businesses = useMemo(
    () => registeredVendors.map(normalizeBusiness),
    [registeredVendors],
  );

  const vendorStatuses = useMemo(
    () =>
      Object.fromEntries(
        businesses.map((business) => [
          business.id,
          business.vendorStatus,
        ]),
      ) as Record<string, VendorStatus>,
    [businesses],
  );

  /* =====================================================
     FILTERING
  ===================================================== */

  const filteredBusinesses = useMemo(() => {
    const query = search.trim().toLowerCase();

    return businesses.filter((business) => {
      const matchesSearch =
        !query ||
        business.name.toLowerCase().includes(query) ||
        business.type.toLowerCase().includes(query) ||
        business.id.toLowerCase().includes(query) ||
        business.phone.toLowerCase().includes(query) ||
        business.owner.toLowerCase().includes(query);

      const matchesType =
        contractorType === "All contractor types" ||
        business.type === contractorType;

      return matchesSearch && matchesType;
    });
  }, [businesses, search, contractorType]);

  /* =====================================================
     PAGINATION
  ===================================================== */

  const pageSize = 10;

  const totalPages = Math.max(
    1,
    Math.ceil(filteredBusinesses.length / pageSize),
  );

  const paginatedBusinesses = filteredBusinesses.slice(
    (page - 1) * pageSize,
    page * pageSize,
  );

  useEffect(() => {
    setPage((current) => Math.min(current, totalPages));
  }, [totalPages]);

  const clearFilters = () => {
    setSearch("");
    setContractorType("All contractor types");
    setPage(1);
  };

  /* =====================================================
     MODAL CONTROLS
  ===================================================== */

  const openDetails = (business: Business) => {
    setSelectedBusiness(business);
    setActiveTab("Overview");
    setRemarkInput("");
    setAction(null);
  };

  const closeModal = () => {
    setSelectedBusiness(null);
    setAction(null);
    setRemarkInput("");
  };

  const findVendorRecord = (
    business: Business,
  ) => {
    return registeredVendors.find(
      (vendor) =>
        getVendorBusinessId(vendor) === business.id,
    );
  };

  /* =====================================================
     UPDATE VENDOR STATUS
  ===================================================== */

  const updateVendorStatus = (
    status: VendorStatus,
  ) => {
    if (!selectedBusiness) return;

    const matchingVendor = findVendorRecord(
      selectedBusiness,
    );

    if (!matchingVendor) return;

    const updatedVendors = registeredVendors.map(
      (vendor) => {
        if (
          getVendorBusinessId(vendor) !==
          selectedBusiness.id
        ) {
          return vendor;
        }

        return {
          ...vendor,
          status,
          vendorStatus: status,
          adminStatusUpdatedAt: new Date().toISOString(),
        };
      },
    );

    writeStoredVendors(updatedVendors);
    setRegisteredVendors(updatedVendors);

    setSelectedBusiness((previous) =>
      previous
        ? { ...previous, vendorStatus: status }
        : null,
    );
  };

  /* =====================================================
     SAVE ADMIN REMARK
  ===================================================== */

  const saveRemark = () => {
    if (!selectedBusiness || !remarkInput.trim()) return;

    const updatedRemarks = {
      ...remarks,
      [selectedBusiness.id]: remarkInput.trim(),
    };

    setRemarks(updatedRemarks);

    try {
      localStorage.setItem(
        REMARKS_STORAGE_KEY,
        JSON.stringify(updatedRemarks),
      );
    } catch (error) {
      console.error("Unable to save remark:", error);
    }

    setRemarkInput("");
  };

  /* =====================================================
     STATUS HELPERS
  ===================================================== */

  const statusClass = (status: VendorStatus) =>
    status.toLowerCase().replace(/\s+/g, "-");

  const currentStatus = selectedBusiness
    ? vendorStatuses[selectedBusiness.id] ??
      selectedBusiness.vendorStatus
    : "Pending";

  /* =====================================================
     COMPACT TAB CONTENT
  ===================================================== */

  const renderVendorContent = (business: Business) => {
    switch (activeTab) {
      /* ================================================
         OVERVIEW
      ================================================ */

      case "Overview":
        return (
          <>
            <div className="vendor-metric-grid">
              <Metric
                label="Products"
                value={business.productCount}
              />

              <Metric
                label="Services"
                value={business.serviceCount}
              />

              <Metric
                label="Enquiries"
                value={business.enquiries}
              />

              <Metric
                label="Rating"
                value={business.rating}
              />
            </div>

            <div className="vendor-detail-grid">
              <DetailCard
                title="Business Information"
                icon={Store}
              >
                <div className="vendor-detail-items">
                  <DetailItem
                    label="Business name"
                    value={business.name}
                  />

                  <DetailItem
                    label="Category"
                    value={business.type}
                  />

                  <DetailItem
                    label="Owner"
                    value={business.owner}
                  />

                  <DetailItem
                    label="Established"
                    value={business.established}
                  />
                </div>
              </DetailCard>

              <DetailCard
                title="Contact Information"
                icon={UserRound}
              >
                <div className="vendor-detail-items">
                  <DetailItem
                    label="Mobile"
                    value={business.phone}
                  />

                  <DetailItem
                    label="Email"
                    value={business.email}
                  />

                  <DetailItem
                    label="WhatsApp"
                    value={business.whatsapp}
                  />

                  <DetailItem
                    label="Website"
                    value={business.website}
                  />
                </div>
              </DetailCard>

              <DetailCard
                title="Business Location"
                icon={MapPin}
              >
                <div className="vendor-detail-items">
                  <DetailItem
                    label="Address"
                    value={business.address}
                  />

                  <DetailItem
                    label="Locality"
                    value={business.locality}
                  />

                  <DetailItem
                    label="City"
                    value={business.city}
                  />

                  <DetailItem
                    label="State / PIN"
                    value={`${business.state} - ${business.pincode}`}
                  />
                </div>
              </DetailCard>

              <DetailCard
                title="Registration"
                icon={ShieldCheck}
              >
                <div className="vendor-detail-items">
                  <DetailItem
                    label="Business ID"
                    value={business.id}
                  />

                  <DetailItem
                    label="Registration fee"
                    value={business.registrationStatus}
                  />

                  <DetailItem
                    label="Vendor status"
                    value={business.vendorStatus}
                  />

                  <DetailItem
                    label="Registered on"
                    value={business.registeredAt}
                  />
                </div>
              </DetailCard>
            </div>
          </>
        );

      /* ================================================
         BUSINESS DETAILS
      ================================================ */

      case "Business Details":
        return (
          <div className="vendor-detail-grid">
            <DetailCard
              title="About the Business"
              icon={Building2}
            >
              <div className="vendor-detail-items">
                <DetailItem
                  label="Business name"
                  value={business.name}
                />

                <DetailItem
                  label="Business category"
                  value={business.type}
                />

                <DetailItem
                  label="Year established"
                  value={business.established}
                />
              </div>

              <div className="vendor-description">
                <span>Business description</span>
                <p>{business.description}</p>
              </div>
            </DetailCard>

            <DetailCard
              title="Products & Services"
              icon={Package}
            >
              <div className="vendor-detail-items">
                <DetailItem
                  label="Products listed"
                  value={business.productCount}
                />

                <DetailItem
                  label="Product categories"
                  value={business.products.join(", ")}
                />

                <DetailItem
                  label="Services offered"
                  value={business.serviceCount}
                />

                <DetailItem
                  label="Service categories"
                  value={business.services.join(", ")}
                />
              </div>
            </DetailCard>

            <DetailCard
              title="Business Address"
              icon={MapPin}
            >
              <div className="vendor-detail-items">
                <DetailItem
                  label="Address"
                  value={business.address}
                />

                <DetailItem
                  label="Locality"
                  value={business.locality}
                />

                <DetailItem
                  label="City"
                  value={business.city}
                />

                <DetailItem
                  label="State"
                  value={business.state}
                />

                <DetailItem
                  label="PIN code"
                  value={business.pincode}
                />
              </div>
            </DetailCard>

            <DetailCard
              title="Portfolio"
              icon={ExternalLink}
            >
              <div className="vendor-detail-items">
                <DetailItem
                  label="Portfolio description"
                  value={business.projects}
                />

                <DetailItem
                  label="Portfolio links"
                  value={business.portfolioLinks.length}
                />
              </div>
            </DetailCard>
          </div>
        );

      /* ================================================
         OPERATIONS
      ================================================ */

      case "Operations":
        return (
          <div className="vendor-detail-grid">
            <DetailCard
              title="Working Schedule"
              icon={Clock3}
            >
              <div className="vendor-detail-items">
                <DetailItem
                  label="Working days"
                  value={business.workingDays}
                />

                <DetailItem
                  label="Working hours"
                  value={business.workingHours}
                />
              </div>
            </DetailCard>

            <DetailCard
              title="Delivery & Payments"
              icon={Wallet}
            >
              <div className="vendor-detail-items">
                <DetailItem
                  label="Delivery availability"
                  value={business.delivery}
                />

                <DetailItem
                  label="Payment methods"
                  value={business.paymentMethods.join(", ")}
                />
              </div>
            </DetailCard>

            <DetailCard
              title="Service Coverage"
              icon={MapPin}
            >
              <div className="vendor-description">
                <span>Areas served</span>
                <p>
                  {business.serviceAreas.length
                    ? business.serviceAreas.join(", ")
                    : "Not provided"}
                </p>
              </div>
            </DetailCard>

            <DetailCard
              title="Business Contact"
              icon={Wrench}
            >
              <div className="vendor-detail-items">
                <DetailItem
                  label="Primary mobile"
                  value={business.phone}
                />

                <DetailItem
                  label="Alternate mobile"
                  value={business.alternateMobile}
                />

                <DetailItem
                  label="WhatsApp"
                  value={business.whatsapp}
                />

                <DetailItem
                  label="Email"
                  value={business.email}
                />
              </div>
            </DetailCard>
          </div>
        );

      /* ================================================
         DOCUMENTS & GALLERY
      ================================================ */

      case "Documents & Gallery":
        return (
          <div className="vendor-detail-grid">
            <DetailCard
              title="Uploaded Documents"
              icon={FileCheck}
            >
              {business.documents.length > 0 ? (
                <div className="vendor-upload-list">
                  {business.documents.map((item, index) => {
                    const file = getMediaDetails(item);

                    return (
                      <div
                        className="vendor-document-row"
                        key={`${file.name}-${index}`}
                      >
                        <div>
                          <FileText size={17} />
                          <span>{file.name}</span>
                        </div>

                        {file.url ? (
                          <a
                            href={file.url}
                            target="_blank"
                            rel="noreferrer"
                          >
                            View <ExternalLink size={13} />
                          </a>
                        ) : (
                          <span className="vendor-not-provided">
                            File unavailable
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="vendor-gallery-empty">
                  <FileText size={27} />
                  <strong>No documents uploaded</strong>
                  <span>
                    Uploaded business documents will appear here.
                  </span>
                </div>
              )}
            </DetailCard>

            <DetailCard
              title="Business Gallery"
              icon={ImageIcon}
            >
              {business.gallery.length > 0 ? (
                <div className="vendor-upload-list">
                  {business.gallery.map((item, index) => {
                    const file = getMediaDetails(item);

                    return (
                      <div
                        className="vendor-document-row"
                        key={`${file.name}-${index}`}
                      >
                        <div>
                          <ImageIcon size={17} />
                          <span>{file.name}</span>
                        </div>

                        {file.url ? (
                          <a
                            href={file.url}
                            target="_blank"
                            rel="noreferrer"
                          >
                            View <ExternalLink size={13} />
                          </a>
                        ) : (
                          <span className="vendor-not-provided">
                            File unavailable
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="vendor-gallery-empty">
                  <ImageIcon size={27} />
                  <strong>No gallery images available</strong>
                  <span>
                    Business photos and uploaded images will appear here.
                  </span>
                </div>
              )}
            </DetailCard>

            <DetailCard
              title="Portfolio Links"
              icon={ExternalLink}
            >
              {business.portfolioLinks.length > 0 ? (
                <div className="vendor-upload-list">
                  {business.portfolioLinks.map((item, index) => {
                    const file = getMediaDetails(item);

                    return (
                      <div
                        className="vendor-document-row"
                        key={`${file.name}-${index}`}
                      >
                        <div>
                          <ExternalLink size={16} />
                          <span>{file.name}</span>
                        </div>

                        {file.url ? (
                          <a
                            href={file.url}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Open <ExternalLink size={13} />
                          </a>
                        ) : (
                          <span className="vendor-not-provided">
                            Link unavailable
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="vendor-gallery-empty">
                  <ExternalLink size={27} />
                  <strong>No portfolio links</strong>
                  <span>
                    Portfolio references have not been submitted.
                  </span>
                </div>
              )}
            </DetailCard>
          </div>
        );

      /* ================================================
         PERFORMANCE & ACTIVITY
      ================================================ */

      case "Performance & Activity":
        return (
          <>
            <div className="vendor-metric-grid">
              <Metric
                label="Profile views"
                value={business.views}
              />

              <Metric
                label="Enquiries"
                value={business.enquiries}
              />

              <Metric
                label="Phone clicks"
                value={business.phoneClicks}
              />

              <Metric
                label="Followers"
                value={business.followers}
              />
            </div>

            <div className="vendor-detail-grid">
              <DetailCard
                title="Customer Feedback"
                icon={Star}
              >
                <div className="vendor-detail-items">
                  <DetailItem
                    label="Average rating"
                    value={business.rating}
                  />

                  <DetailItem
                    label="Total reviews"
                    value={business.reviews}
                  />
                </div>
              </DetailCard>

              <DetailCard
                title="Registration Activity"
                icon={Activity}
              >
                <div className="vendor-detail-items">
                  <DetailItem
                    label="Registration date"
                    value={business.registeredAt}
                  />

                  <DetailItem
                    label="Vendor status"
                    value={business.vendorStatus}
                  />

                  <DetailItem
                    label="Registration payment"
                    value={business.registrationStatus}
                  />
                </div>
              </DetailCard>

              <DetailCard
                title="Admin Remarks"
                icon={MessageSquare}
              >
                <textarea
                  className="vendor-remarks-input"
                  placeholder="Add an internal admin remark..."
                  value={remarkInput}
                  onChange={(event) =>
                    setRemarkInput(event.target.value)
                  }
                />

                <button
                  type="button"
                  className="vendor-save-remark"
                  onClick={saveRemark}
                  disabled={!remarkInput.trim()}
                >
                  Save Remark
                </button>

                <div className="vendor-saved-remark">
                  <span>Latest internal remark</span>
                  <p>
                    {remarks[business.id] ||
                      "No admin remarks recorded."}
                  </p>
                </div>
              </DetailCard>
            </div>
          </>
        );
    }
  };

  /* =====================================================
     MAIN PAGE
  ===================================================== */

  return (
    <div className="businesses-admin-page">

      {/* PAGE HEADER */}

      <section className="businesses-page-header">
        <div>
          <div className="businesses-eyebrow">
            CORPORATE DIRECTORY · TAB 3
          </div>

          <h1>Find City Listings</h1>

          <p>
            Manage registered businesses and city listings.
          </p>
        </div>
      </section>

      {/* DIRECTORY */}

      <section className="businesses-directory-card">

        {/* FILTER BAR */}

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

          <div className="businesses-type-select">
            <select
              value={contractorType}
              onChange={(event) => {
                setContractorType(event.target.value);
                setPage(1);
              }}
            >
              {contractorTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
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

        {/* BUSINESS TABLE */}

        <div className="businesses-table-wrapper">
          <table className="businesses-table">
            <thead>
              <tr>
                <th>BUSINESS NAME</th>
                <th>CONTRACTOR TYPE</th>
                <th>PROJECTS PORTFOLIO</th>
                <th>CONTACT INFO</th>
                <th>REGISTRATION FEE</th>
                <th>ACTIONS</th>
              </tr>
            </thead>

            <tbody>
              {paginatedBusinesses.map((business) => (
                <tr key={business.id}>
                  <td>
                    <div className="business-name-cell">
                      <strong>{business.name}</strong>
                      <span>{business.id}</span>
                    </div>
                  </td>

                  <td>
                    <span className="business-type">
                      {business.type}
                    </span>
                  </td>

                  <td>
                    <span className="business-projects">
                      {business.projects}
                    </span>
                  </td>

                  <td>
                    <span className="business-contact">
                      {business.phone}
                    </span>
                  </td>

                  <td>
                    <span
                      className={`business-payment-status ${business.registrationStatus.toLowerCase()}`}
                    >
                      {business.registrationStatus === "Paid" && (
                        <CheckCircle2 size={13} />
                      )}
                      {business.registrationStatus}
                    </span>
                  </td>

                  <td>
                    <div className="business-actions">
                      <button
                        type="button"
                        className="business-primary-action"
                        onClick={() => openDetails(business)}
                      >
                        <Eye size={14} />
                        View Details
                      </button>

                      <button
                        type="button"
                        className="business-secondary-action"
                        onClick={() => {
                          setSelectedBusiness(business);
                          setAction("portfolio");
                        }}
                      >
                        Portfolio
                        <ExternalLink size={13} />
                      </button>

                      <button
                        type="button"
                        className="business-secondary-action subscription"
                        onClick={() => {
                          setSelectedBusiness(business);
                          setAction("subscription");
                        }}
                      >
                        Subscription
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {paginatedBusinesses.length === 0 && (
                <tr>
                  <td colSpan={6}>
                    <div className="businesses-empty-state">
                      <Search size={26} />

                      <strong>
                        {registeredVendors.length === 0
                          ? "No registered businesses yet"
                          : "No businesses found"}
                      </strong>

                      <span>
                        {registeredVendors.length === 0
                          ? "New vendor registrations will appear here when added to the shared vendor collection."
                          : "Try changing your search or contractor type."}
                      </span>

                      {(search ||
                        contractorType !== "All contractor types") && (
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

        {/* TABLE FOOTER */}

        <div className="businesses-table-footer">
          <span>
            Showing{" "}
            <strong>
              {filteredBusinesses.length === 0
                ? 0
                : (page - 1) * pageSize + 1}
              {"–"}
              {Math.min(
                page * pageSize,
                filteredBusinesses.length,
              )}
            </strong>{" "}
            of <strong>{filteredBusinesses.length}</strong> businesses
          </span>

          <div className="businesses-pagination">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() =>
                setPage((current) => Math.max(1, current - 1))
              }
              aria-label="Previous page"
            >
              <ChevronLeft size={15} />
            </button>

            {Array.from(
              { length: totalPages },
              (_, index) => index + 1,
            ).map((pageNumber) => (
              <button
                type="button"
                key={pageNumber}
                className={page === pageNumber ? "active" : ""}
                onClick={() => setPage(pageNumber)}
              >
                {pageNumber}
              </button>
            ))}

            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() =>
                setPage((current) =>
                  Math.min(totalPages, current + 1),
                )
              }
              aria-label="Next page"
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </section>

      {/* =================================================
          VENDOR DETAILS MODAL
      ================================================= */}

      {selectedBusiness && !action && (
        <div
          className="business-modal-backdrop"
          onClick={closeModal}
        >
          <div
            className="vendor-details-modal"
            onClick={(event) => event.stopPropagation()}
          >

            {/* TOP BAR */}

            <div className="vendor-details-topbar">
              <div>
                <span>
                  CITY LISTINGS / VENDORS / {selectedBusiness.id}
                </span>

                <h2>Vendor Details</h2>
              </div>

              <button
                type="button"
                onClick={closeModal}
                aria-label="Close vendor details"
              >
                <X size={20} />
              </button>
            </div>

            {/* PROFILE HEADER */}

            <div className="vendor-profile-header">
              <div className="vendor-profile-avatar">
                <Store size={30} />
              </div>

              <div className="vendor-profile-main">
                <h2>{selectedBusiness.name}</h2>

                <p>
                  {selectedBusiness.id} · {selectedBusiness.type}
                </p>

                <span>
                  <MapPin size={13} />
                  {selectedBusiness.locality ||
                    selectedBusiness.city}
                </span>

                <div className="vendor-profile-badges">
                  <span
                    className={`vendor-status-badge ${statusClass(currentStatus)}`}
                  >
                    {currentStatus}
                  </span>

                  <span className="vendor-status-badge neutral">
                    {selectedBusiness.registrationStatus} Registration Fee
                  </span>
                </div>
              </div>

              <button
                type="button"
                className="vendor-report-button"
                onClick={() => window.print()}
              >
                <Download size={15} />
                Print / Save
              </button>
            </div>

            {/* FIVE TABS */}

            <div className="vendor-tabs">
              {vendorTabs.map(({ label, icon: Icon }) => (
                <button
                  type="button"
                  key={label}
                  className={activeTab === label ? "active" : ""}
                  onClick={() => setActiveTab(label)}
                >
                  <Icon size={15} />
                  {label}
                </button>
              ))}
            </div>

            {/* CONTENT */}

            <div className="vendor-details-content">
              {renderVendorContent(selectedBusiness)}
            </div>

            {/* ADMIN MANAGEMENT */}

            <div className="vendor-admin-panel">
              <div className="vendor-admin-heading">
                <div>
                  <h3>Admin Management</h3>
                  <p>Manage this business listing.</p>
                </div>

                <span
                  className={`vendor-status-badge ${statusClass(currentStatus)}`}
                >
                  {currentStatus}
                </span>
              </div>

              <div className="vendor-admin-actions">
                {currentStatus !== "Approved" && (
                  <button
                    type="button"
                    className="vendor-admin-approve"
                    onClick={() => updateVendorStatus("Approved")}
                  >
                    <CheckCircle2 size={15} />
                    {currentStatus === "Suspended"
                      ? "Reactivate Listing"
                      : "Approve Vendor"}
                  </button>
                )}

                {currentStatus === "Pending" && (
                  <button
                    type="button"
                    className="vendor-admin-reject"
                    onClick={() => updateVendorStatus("Rejected")}
                  >
                    <X size={15} />
                    Reject Application
                  </button>
                )}

                {currentStatus === "Approved" && (
                  <button
                    type="button"
                    className="vendor-admin-suspend"
                    onClick={() => updateVendorStatus("Suspended")}
                  >
                    <PauseCircle size={15} />
                    Suspend Listing
                  </button>
                )}

                {currentStatus === "Rejected" && (
                  <button
                    type="button"
                    className="vendor-admin-approve"
                    onClick={() => updateVendorStatus("Pending")}
                  >
                    <FileCheck size={15} />
                    Review Again
                  </button>
                )}
              </div>

              <p className="vendor-admin-disclaimer">
                <ShieldCheck size={14} />
                Vendor information is read-only. Admin actions update
                the shared vendor listing status.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* =================================================
          PORTFOLIO / SUBSCRIPTION MODAL
      ================================================= */}

      {selectedBusiness && action && (
        <div
          className="business-modal-backdrop"
          onClick={closeModal}
        >
          <div
            className="business-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="business-modal-header">
              <div>
                <span>CORPORATE DIRECTORY</span>

                <h2>{selectedBusiness.name}</h2>

                <small>
                  {selectedBusiness.id} · {selectedBusiness.type}
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

            <div className="business-modal-content">
              {action === "portfolio" ? (
                <>
                  <div className="business-modal-icon">
                    <ExternalLink size={22} />
                  </div>

                  <h3>Portfolio Links</h3>

                  <p>
                    Portfolio information submitted by{" "}
                    <strong>{selectedBusiness.name}</strong>.
                  </p>

                  {selectedBusiness.portfolioLinks.length > 0 ? (
                    <div className="business-portfolio-placeholder">
                      {selectedBusiness.portfolioLinks.map(
                        (item, index) => {
                          const file = getMediaDetails(item);

                          return (
                            <div key={index}>
                              {file.url ? (
                                <a
                                  href={file.url}
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  {file.name}
                                  <ExternalLink size={13} />
                                </a>
                              ) : (
                                <span>{file.name}</span>
                              )}
                            </div>
                          );
                        },
                      )}
                    </div>
                  ) : (
                    <div className="business-portfolio-placeholder">
                      <ExternalLink size={18} />
                      <span>No portfolio links available.</span>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="business-modal-icon">
                    <Wallet size={22} />
                  </div>

                  <h3>Manage Subscription</h3>

                  <p>
                    Review the registration and listing fee status.
                  </p>

                  <div className="business-modal-info">
                    <div>
                      <span>PLAN</span>
                      <strong>Business Listing</strong>
                    </div>

                    <div>
                      <span>FEE STATUS</span>
                      <strong>
                        {selectedBusiness.registrationStatus}
                      </strong>
                    </div>

                    <div>
                      <span>VENDOR STATUS</span>
                      <strong>{currentStatus}</strong>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="business-modal-footer">
              <button
                type="button"
                className="business-modal-cancel"
                onClick={closeModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
