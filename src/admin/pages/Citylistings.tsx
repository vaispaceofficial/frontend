
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

type VendorStatus = "Approved" | "Pending" | "Rejected" | "Suspended";
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
  registrationData: VendorRecord;
};

type VendorTab =
  | "Overview"
  | "Business Profile"
  | "Products & Services"
  | "Operations & Coverage"
  | "Registration Information"
  | "Documents & Gallery"
  | "Performance & Admin";

const VENDORS_STORAGE_KEY = "oneservice_vendors";
const SINGLE_VENDOR_STORAGE_KEY = "oneservice_vendor";
const REMARKS_STORAGE_KEY = "oneservice_vendor_admin_remarks";

/* =========================================================
   GENERAL HELPERS
========================================================= */

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === "object" && !Array.isArray(value);

const readText = (value: unknown, fallback = "Not provided"): string => {
  if (typeof value === "string" && value.trim()) return value.trim();
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  if (typeof value === "boolean") return value ? "Yes" : "No";
  return fallback;
};

const readNumber = (value: unknown, fallback = 0): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const readArray = (value: unknown): string[] => {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => {
      if (typeof item === "string") return item.trim();
      if (typeof item === "number") return String(item);

      if (isRecord(item)) {
        return readText(
          item.name ?? item.title ?? item.category ?? item.label,
          "",
        );
      }

      return "";
    })
    .filter(Boolean);
};

/* =========================================================
   VENDOR IDENTITY
========================================================= */

const getVendorIdentity = (vendor: VendorRecord): string => {
  const identity =
    vendor.vendorId ??
    vendor.id ??
    vendor.mobile ??
    vendor.phone ??
    vendor.email;

  if (typeof identity !== "string" && typeof identity !== "number") {
    return "";
  }

  return String(identity).trim().toLowerCase();
};

const getVendorBusinessId = (vendor: VendorRecord): string => {
  const explicitId = vendor.vendorId ?? vendor.id;

  if (typeof explicitId === "string" && explicitId.trim()) {
    return explicitId.trim();
  }

  if (typeof explicitId === "number" && Number.isFinite(explicitId)) {
    return String(explicitId);
  }

  const identity = getVendorIdentity(vendor);
  if (identity) return `V-${identity}`;

  const name = readText(vendor.businessName ?? vendor.name, "Unnamed Business");
  return `V-${name.replace(/[^a-zA-Z0-9]/g, "").slice(0, 12)}`;
};

/* =========================================================
   LOAD AND SAVE VENDORS
========================================================= */

const readStoredVendors = (): VendorRecord[] => {
  try {
    const storedCollection = localStorage.getItem(VENDORS_STORAGE_KEY);
    const storedSingleVendor = localStorage.getItem(SINGLE_VENDOR_STORAGE_KEY);

    let collection: VendorRecord[] = [];
    let singleVendor: VendorRecord | null = null;

    if (storedCollection) {
      const parsed: unknown = JSON.parse(storedCollection);

      if (Array.isArray(parsed)) {
        collection = parsed.filter(
          (item): item is VendorRecord => isRecord(item),
        );
      }
    }

    if (storedSingleVendor) {
      const parsed: unknown = JSON.parse(storedSingleVendor);

      if (isRecord(parsed)) {
        const nestedVendor = isRecord(parsed.vendor)
          ? parsed.vendor
          : isRecord(parsed.profile)
            ? parsed.profile
            : parsed;

        singleVendor = nestedVendor as VendorRecord;
      }
    }

    if (!singleVendor) return collection;

    const singleIdentity = getVendorIdentity(singleVendor);

    if (!singleIdentity) return [singleVendor, ...collection];

    const existingIndex = collection.findIndex(
      (vendor) => getVendorIdentity(vendor) === singleIdentity,
    );

    if (existingIndex === -1) return [singleVendor, ...collection];

    const merged = [...collection];
    merged[existingIndex] = {
      ...singleVendor,
      ...merged[existingIndex],
    };

    return merged;
  } catch (error) {
    console.error("Unable to read vendors:", error);
    return [];
  }
};

const writeStoredVendors = (vendors: VendorRecord[]) => {
  try {
    localStorage.setItem(VENDORS_STORAGE_KEY, JSON.stringify(vendors));
    window.dispatchEvent(new CustomEvent("oneservice-vendors-change"));
  } catch (error) {
    console.error("Unable to save vendors:", error);
  }
};

/* =========================================================
   STATUS HELPERS
========================================================= */

const normalizeStatus = (status: unknown): VendorStatus => {
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
   NORMALIZE VENDOR DATA
========================================================= */

const normalizeBusiness = (vendor: VendorRecord): Business => {
  const products = readArray(vendor.products);
  const services = readArray(vendor.services);

  return {
    id: getVendorBusinessId(vendor),

    name: readText(vendor.businessName ?? vendor.name, "Unnamed Business"),
    type: readText(
      vendor.businessType ?? vendor.businessCategory,
      "Business & Professional Services",
    ),

    owner: readText(vendor.fullName ?? vendor.ownerName),
    email: readText(vendor.email),
    phone: readText(vendor.mobile ?? vendor.phone),
    whatsapp: readText(vendor.whatsapp ?? vendor.whatsappNumber),
    alternateMobile: readText(vendor.alternateMobile),
    website: readText(vendor.website),

    description: readText(
      vendor.productDescription ??
      vendor.description ??
      vendor.businessDescription,
    ),

    established: readText(vendor.established ?? vendor.yearEstablished),

    address: readText(vendor.businessAddress ?? vendor.address),
    locality: readText(vendor.locality ?? vendor.area, ""),
    city: readText(vendor.city, "Visakhapatnam"),
    state: readText(vendor.state, "Andhra Pradesh"),

    pincode: readText(
      vendor.pincode ?? vendor.pinCode ?? vendor.postalCode,
    ),

    products,
    services,
    serviceAreas: readArray(vendor.serviceAreas ?? vendor.coverageAreas),

    productCount: readNumber(vendor.productCount, products.length),
    serviceCount: readNumber(vendor.serviceCount, services.length),

    workingHours: readText(vendor.workingHours ?? vendor.businessHours),
    workingDays: readText(vendor.workingDays),
    delivery: readText(vendor.delivery ?? vendor.deliveryAvailability),
    paymentMethods: readArray(vendor.paymentMethods),

    rating: readText(vendor.rating, "Not available"),
    reviews: readNumber(vendor.reviews),
    views: readNumber(vendor.views),
    enquiries: readNumber(vendor.enquiries),
    phoneClicks: readNumber(vendor.phoneClicks),
    followers: readNumber(vendor.followers),

    registrationStatus: normalizeRegistrationStatus(vendor),
    vendorStatus: normalizeStatus(vendor.status ?? vendor.vendorStatus),

    registeredAt: readText(vendor.registeredAt ?? vendor.createdAt),
    projects: readText(vendor.projects ?? vendor.portfolioDescription),

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

    registrationData: vendor,
  };
};

/* =========================================================
   REGISTRATION INFORMATION
========================================================= */

const registrationExcludedKeys = new Set([
  "id",
  "vendorId",
  "status",
  "vendorStatus",
  "registrationStatus",
  "registrationFeeStatus",
  "feeStatus",
  "paymentStatus",
  "registeredAt",
  "createdAt",
  "adminStatusUpdatedAt",
  "rating",
  "reviews",
  "views",
  "enquiries",
  "phoneClicks",
  "followers",
  "documents",
  "uploadedDocuments",
  "businessDocuments",
  "gallery",
  "images",
  "photos",
  "portfolioLinks",
  "products",
  "services",
  "serviceAreas",
  "coverageAreas",
  "paymentMethods",
  "productCount",
  "serviceCount",
  "workingHours",
  "businessHours",
  "workingDays",
  "delivery",
  "deliveryAvailability",
  "businessName",
  "businessType",
  "businessCategory",
  "fullName",
  "ownerName",
  "name",
  "email",
  "mobile",
  "phone",
  "whatsapp",
  "whatsappNumber",
  "alternateMobile",
  "website",
  "businessAddress",
  "address",
  "locality",
  "area",
  "city",
  "state",
  "pincode",
  "pinCode",
  "postalCode",
  "description",
  "businessDescription",
  "productDescription",
  "projects",
  "portfolioDescription",
  "established",
  "yearEstablished",
]);

const isSensitiveRegistrationKey = (key: string) =>
  /password|passcode|secret|token|authorization|bank|account.?number|ifsc|aadhaar|aadhar|pan.?number|otp|security.?answer/i.test(
    key,
  );

const formatRegistrationLabel = (key: string): string =>
  key
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (character) => character.toUpperCase());

type RegistrationEntry = {
  label: string;
  value: string;
};

type RegistrationGroup = {
  title: string;
  entries: RegistrationEntry[];
};

const formatRegistrationValue = (value: unknown): string => {
  if (typeof value === "string") return value.trim();

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (typeof item === "string" || typeof item === "number") {
          return String(item);
        }

        if (isRecord(item)) {
          return [
            item.name,
            item.title,
            item.label,
            item.value,
          ]
            .filter(
              (part) =>
                typeof part === "string" || typeof part === "number",
            )
            .join(" · ");
        }

        return "";
      })
      .filter(Boolean)
      .join(", ");
  }

  return "";
};

const getRegistrationGroups = (
  vendor: VendorRecord,
): RegistrationGroup[] => {
  const groups: RegistrationGroup[] = [];

  const addEntry = (
    groupTitle: string,
    label: string,
    value: unknown,
  ) => {
    const formattedValue = formatRegistrationValue(value);
    if (!formattedValue) return;

    let group = groups.find((item) => item.title === groupTitle);

    if (!group) {
      group = { title: groupTitle, entries: [] };
      groups.push(group);
    }

    group.entries.push({ label, value: formattedValue });
  };

  Object.entries(vendor).forEach(([key, value]) => {
    if (
      registrationExcludedKeys.has(key) ||
      isSensitiveRegistrationKey(key) ||
      value === null ||
      value === undefined ||
      value === ""
    ) {
      return;
    }

    if (isRecord(value)) {
      Object.entries(value).forEach(([nestedKey, nestedValue]) => {
        if (
          isSensitiveRegistrationKey(nestedKey) ||
          nestedValue === null ||
          nestedValue === undefined ||
          nestedValue === "" ||
          isRecord(nestedValue) ||
          (Array.isArray(nestedValue) && nestedValue.some(isRecord))
        ) {
          return;
        }

        addEntry(
          formatRegistrationLabel(key),
          formatRegistrationLabel(nestedKey),
          nestedValue,
        );
      });

      return;
    }

    if (Array.isArray(value) && value.some(isRecord)) return;

    addEntry(
      "Additional Registration Information",
      formatRegistrationLabel(key),
      value,
    );
  });

  return groups.filter((group) => group.entries.length > 0);
};

/* =========================================================
   FILTERS AND NAVIGATION
========================================================= */

const contractorTypes = [
  "All contractor types",
  "Interior Designer",
  "Plywood Store",
  "Construction Contractor",
  "Modular Furniture",
  "Civil Contractor",
];

const vendorTabs: {
  label: VendorTab;
  icon: typeof LayoutDashboard;
  description: string;
}[] = [
    {
      label: "Overview",
      icon: LayoutDashboard,
      description: "Summary and key business information",
    },
    {
      label: "Business Profile",
      icon: Building2,
      description: "Business identity, contact and address",
    },
    {
      label: "Products & Services",
      icon: Package,
      description: "Listings, categories and portfolio",
    },
    {
      label: "Operations & Coverage",
      icon: Clock3,
      description: "Working schedule, payments and service areas",
    },
    {
      label: "Registration Information",
      icon: FileText,
      description: "Information submitted during registration",
    },
    {
      label: "Documents & Gallery",
      icon: FileCheck,
      description: "Uploaded files, images and portfolio links",
    },
    {
      label: "Performance & Admin",
      icon: Activity,
      description: "Activity, feedback and internal remarks",
    },
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
    value !== undefined && value !== null && value !== ""
      ? value
      : "Not provided";

  return (
    <div className="vendor-detail-item">
      <span>{label}</span>
      <strong>{displayValue}</strong>
    </div>
  );
}

function ExpandableDetailItem({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) {
  const [expanded, setExpanded] = useState(false);

  const displayValue =
    value !== undefined && value !== null && value !== ""
      ? String(value)
      : "Not provided";

  const isLong = displayValue.length > 90;

  return (
    <div className="vendor-detail-item vendor-address-detail-item">
      <span>{label}</span>

      <div className="vendor-address-value">
        <strong className={expanded ? "expanded" : ""}>
          {displayValue}
        </strong>

        {isLong && (
          <button
            type="button"
            className="vendor-address-toggle"
            onClick={() => setExpanded((previous) => !previous)}
          >
            {expanded ? "Read less" : "Read more"}
          </button>
        )}
      </div>
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
          <Icon size={16} />
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
  icon: Icon,
}: {
  label: string;
  value: string | number;
  icon?: typeof Package;
}) {
  return (
    <div className="vendor-metric">
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
      {Icon && <Icon size={18} />}
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="vendor-section-heading">
      <span>{eyebrow}</span>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

/* =========================================================
   DOCUMENT AND GALLERY HELPERS
========================================================= */

function getMediaDetails(item: unknown) {
  if (typeof item === "string") {
    return {
      name: item.split("/").pop() || item,
      url: item,
    };
  }

  if (isRecord(item)) {
    return {
      name: readText(
        item.name ?? item.title ?? item.filename,
        "Uploaded file",
      ),
      url: readText(
        item.url ?? item.fileUrl ?? item.image ?? item.src,
        "",
      ),
    };
  }

  return {
    name: "Uploaded file",
    url: "",
  };
}

/* =========================================================
   MAIN ADMIN COMPONENT
========================================================= */

export default function Businesses() {
  const [search, setSearch] = useState("");
  const [contractorType, setContractorType] = useState(
    "All contractor types",
  );

  const [registeredVendors, setRegisteredVendors] = useState<
    VendorRecord[]
  >([]);

  const [selectedBusiness, setSelectedBusiness] =
    useState<Business | null>(null);

  const [activeTab, setActiveTab] = useState<VendorTab>("Overview");

  const [action, setAction] = useState<
    "portfolio" | "subscription" | null
  >(null);

  const [page, setPage] = useState(1);

  const [remarks, setRemarks] = useState<Record<string, string>>({});
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

      if (isRecord(parsed)) {
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

  const findVendorRecord = (business: Business) =>
    registeredVendors.find(
      (vendor) => getVendorBusinessId(vendor) === business.id,
    );

  /* =====================================================
     UPDATE VENDOR STATUS
  ===================================================== */

  const updateVendorStatus = (status: VendorStatus) => {
    if (!selectedBusiness) return;

    const matchingVendor = findVendorRecord(selectedBusiness);
    if (!matchingVendor) return;

    const updatedVendors = registeredVendors.map((vendor) => {
      if (getVendorBusinessId(vendor) !== selectedBusiness.id) {
        return vendor;
      }

      return {
        ...vendor,
        status,
        vendorStatus: status,
        adminStatusUpdatedAt: new Date().toISOString(),
      };
    });

    writeStoredVendors(updatedVendors);
    setRegisteredVendors(updatedVendors);

    setSelectedBusiness((previous) =>
      previous
        ? {
          ...previous,
          vendorStatus: status,
          registrationData: {
            ...previous.registrationData,
            status,
            vendorStatus: status,
          },
        }
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
     TAB CONTENT
  ===================================================== */

  const renderVendorContent = (business: Business) => {
    switch (activeTab) {
      case "Overview":
        return (
          <div className="vendor-tab-page">
            <SectionHeading
              eyebrow="VENDOR SUMMARY"
              title="Business overview"
              description="A quick snapshot of the vendor's profile, registration and current listing."
            />

            <div className="vendor-metric-grid vendor-overview-metrics">
              <Metric
                label="Products listed"
                value={business.productCount}
                icon={Package}
              />
              <Metric
                label="Services offered"
                value={business.serviceCount}
                icon={Wrench}
              />
              <Metric
                label="Customer enquiries"
                value={business.enquiries}
                icon={MessageSquare}
              />
              <Metric
                label="Average rating"
                value={business.rating}
                icon={Star}
              />
            </div>

            <div className="vendor-detail-grid">
              <DetailCard title="Business at a glance" icon={Store}>
                <div className="vendor-detail-items">
                  <DetailItem label="Business name" value={business.name} />
                  <DetailItem label="Category" value={business.type} />
                  <DetailItem label="Business owner" value={business.owner} />
                  <DetailItem
                    label="Year established"
                    value={business.established}
                  />
                </div>
              </DetailCard>

              <DetailCard title="Primary contact" icon={UserRound}>
                <div className="vendor-detail-items">
                  <DetailItem label="Mobile number" value={business.phone} />
                  <DetailItem label="Email address" value={business.email} />
                  <DetailItem label="WhatsApp" value={business.whatsapp} />
                  <DetailItem label="Website" value={business.website} />
                </div>
              </DetailCard>

              <DetailCard title="Business location" icon={MapPin}>
                <div className="vendor-detail-items">
                  <ExpandableDetailItem
                    label="Address"
                    value={business.address}
                  />
                  <DetailItem label="Locality" value={business.locality} />
                  <DetailItem label="City" value={business.city} />
                  <DetailItem
                    label="State / PIN"
                    value={`${business.state} - ${business.pincode}`}
                  />
                </div>
              </DetailCard>

              <DetailCard title="Registration summary" icon={ShieldCheck}>
                <div className="vendor-detail-items">
                  <DetailItem label="Business ID" value={business.id} />
                  <DetailItem
                    label="Registration fee"
                    value={business.registrationStatus}
                  />
                  <DetailItem
                    label="Listing status"
                    value={business.vendorStatus}
                  />
                  <DetailItem
                    label="Registered on"
                    value={business.registeredAt}
                  />
                </div>
              </DetailCard>
            </div>
          </div>
        );

      case "Business Profile":
        return (
          <div className="vendor-tab-page">
            <SectionHeading
              eyebrow="BUSINESS INFORMATION"
              title="Business profile"
              description="Review the vendor's identity, contact information and registered address."
            />

            <div className="vendor-detail-grid">
              <DetailCard title="Business identity" icon={Building2}>
                <div className="vendor-detail-items">
                  <DetailItem label="Business name" value={business.name} />
                  <DetailItem label="Business category" value={business.type} />
                  <DetailItem
                    label="Year established"
                    value={business.established}
                  />
                  <DetailItem label="Business ID" value={business.id} />
                </div>
                <div className="vendor-description">
                  <span>Business description</span>
                  <p>{business.description}</p>
                </div>
              </DetailCard>

              <DetailCard title="Owner and contact details" icon={UserRound}>
                <div className="vendor-detail-items">
                  <DetailItem label="Owner name" value={business.owner} />
                  <DetailItem label="Mobile number" value={business.phone} />
                  <DetailItem
                    label="Alternate mobile"
                    value={business.alternateMobile}
                  />
                  <DetailItem label="Email address" value={business.email} />
                  <DetailItem label="WhatsApp" value={business.whatsapp} />
                  <DetailItem label="Website" value={business.website} />
                </div>
              </DetailCard>

              <DetailCard title="Registered business address" icon={MapPin}>
                <div className="vendor-detail-items">
                  <ExpandableDetailItem
                    label="Address"
                    value={business.address}
                  />
                  <DetailItem label="Locality" value={business.locality} />
                  <DetailItem label="City" value={business.city} />
                  <DetailItem label="State" value={business.state} />
                  <DetailItem label="PIN code" value={business.pincode} />
                </div>
              </DetailCard>
            </div>
          </div>
        );

      case "Products & Services":
        return (
          <div className="vendor-tab-page">
            <SectionHeading
              eyebrow="BUSINESS OFFERINGS"
              title="Products and services"
              description="Review the products, service categories and portfolio submitted by this business."
            />

            <div className="vendor-metric-grid">
              <Metric
                label="Total products"
                value={business.productCount}
                icon={Package}
              />
              <Metric
                label="Total services"
                value={business.serviceCount}
                icon={Wrench}
              />
              <Metric
                label="Portfolio links"
                value={business.portfolioLinks.length}
                icon={ExternalLink}
              />
            </div>

            <div className="vendor-detail-grid">
              <DetailCard title="Product categories" icon={Package}>
                <div className="vendor-tag-list">
                  {business.products.length ? (
                    business.products.map((item, index) => (
                      <span key={`${item}-${index}`}>{item}</span>
                    ))
                  ) : (
                    <p className="vendor-inline-empty">
                      No product categories provided.
                    </p>
                  )}
                </div>
              </DetailCard>

              <DetailCard title="Services offered" icon={Wrench}>
                <div className="vendor-tag-list">
                  {business.services.length ? (
                    business.services.map((item, index) => (
                      <span key={`${item}-${index}`}>{item}</span>
                    ))
                  ) : (
                    <p className="vendor-inline-empty">
                      No service categories provided.
                    </p>
                  )}
                </div>
              </DetailCard>

              <DetailCard title="Portfolio information" icon={ExternalLink}>
                <div className="vendor-detail-items">
                  <DetailItem
                    label="Portfolio description"
                    value={business.projects}
                  />
                  <DetailItem
                    label="Portfolio references"
                    value={business.portfolioLinks.length}
                  />
                </div>
              </DetailCard>
            </div>
          </div>
        );

      case "Operations & Coverage":
        return (
          <div className="vendor-tab-page">
            <SectionHeading
              eyebrow="BUSINESS OPERATIONS"
              title="Operations and service coverage"
              description="Check the business schedule, delivery options, accepted payments and operating areas."
            />

            <div className="vendor-detail-grid">
              <DetailCard title="Working schedule" icon={Clock3}>
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

              <DetailCard title="Delivery and payments" icon={Wallet}>
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

              <DetailCard title="Service coverage areas" icon={MapPin}>
                <div className="vendor-tag-list">
                  {business.serviceAreas.length ? (
                    business.serviceAreas.map((area, index) => (
                      <span key={`${area}-${index}`}>{area}</span>
                    ))
                  ) : (
                    <p className="vendor-inline-empty">
                      No service coverage areas provided.
                    </p>
                  )}
                </div>
              </DetailCard>

              <DetailCard title="Operational contact" icon={UserRound}>
                <div className="vendor-detail-items">
                  <DetailItem
                    label="Primary mobile"
                    value={business.phone}
                  />
                  <DetailItem
                    label="Alternate mobile"
                    value={business.alternateMobile}
                  />
                  <DetailItem label="WhatsApp" value={business.whatsapp} />
                  <DetailItem label="Email" value={business.email} />
                </div>
              </DetailCard>
            </div>
          </div>
        );

      case "Registration Information": {
        const registrationGroups = getRegistrationGroups(
          business.registrationData,
        );

        return (
          <div className="vendor-tab-page">
            <SectionHeading
              eyebrow="APPLICATION RECORD"
              title="Submitted registration information"
              description="Review the additional information saved from the vendor registration form."
            />

            {registrationGroups.length > 0 ? (
              <div className="vendor-detail-grid">
                {registrationGroups.map((group) => (
                  <DetailCard
                    key={group.title}
                    title={group.title}
                    icon={FileText}
                  >
                    <div className="vendor-detail-items">
                      {group.entries.map((entry) => (
                        <DetailItem
                          key={`${group.title}-${entry.label}`}
                          label={entry.label}
                          value={entry.value}
                        />
                      ))}
                    </div>
                  </DetailCard>
                ))}
              </div>
            ) : (
              <div className="vendor-gallery-empty">
                <FileText size={28} />
                <strong>No additional registration details found</strong>
                <span>
                  Additional fields will appear here when they are saved
                  with the vendor application.
                </span>
              </div>
            )}

            <div className="vendor-registration-note">
              <ShieldCheck size={15} />
              Sensitive credentials are excluded from this view.
            </div>
          </div>
        );
      }

      case "Documents & Gallery":
        return (
          <div className="vendor-tab-page">
            <SectionHeading
              eyebrow="SUBMITTED FILES"
              title="Documents and gallery"
              description="Review the business documents, uploaded images and portfolio references."
            />

            <div className="vendor-detail-grid">
              <DetailCard title="Verification documents" icon={FileCheck}>
                {business.documents.length ? (
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
                    <FileText size={26} />
                    <strong>No documents uploaded</strong>
                    <span>
                      Business verification documents will appear here.
                    </span>
                  </div>
                )}
              </DetailCard>

              <DetailCard title="Business gallery" icon={ImageIcon}>
                {business.gallery.length ? (
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
                    <ImageIcon size={26} />
                    <strong>No gallery images available</strong>
                    <span>
                      Business photos and images will appear here.
                    </span>
                  </div>
                )}
              </DetailCard>

              <DetailCard title="Portfolio links" icon={ExternalLink}>
                {business.portfolioLinks.length ? (
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
                    <ExternalLink size={26} />
                    <strong>No portfolio links</strong>
                    <span>
                      Portfolio references have not been submitted.
                    </span>
                  </div>
                )}
              </DetailCard>
            </div>
          </div>
        );

      case "Performance & Admin":
        return (
          <div className="vendor-tab-page">
            <SectionHeading
              eyebrow="LISTING ACTIVITY"
              title="Performance and admin"
              description="Monitor listing engagement, customer feedback and internal review notes."
            />

            <div className="vendor-metric-grid">
              <Metric
                label="Profile views"
                value={business.views}
                icon={Eye}
              />
              <Metric
                label="Customer enquiries"
                value={business.enquiries}
                icon={MessageSquare}
              />
              <Metric
                label="Phone clicks"
                value={business.phoneClicks}
                icon={UserRound}
              />
              <Metric
                label="Followers"
                value={business.followers}
                icon={Star}
              />
            </div>

            <div className="vendor-detail-grid">
              <DetailCard title="Customer feedback" icon={Star}>
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

              <DetailCard title="Registration activity" icon={Activity}>
                <div className="vendor-detail-items">
                  <DetailItem
                    label="Registration date"
                    value={business.registeredAt}
                  />
                  <DetailItem
                    label="Listing status"
                    value={business.vendorStatus}
                  />
                  <DetailItem
                    label="Registration payment"
                    value={business.registrationStatus}
                  />
                </div>
              </DetailCard>

              <DetailCard title="Internal admin remarks" icon={MessageSquare}>
                <div className="vendor-admin-remark-editor">
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
                </div>

                <div className="vendor-saved-remark">
                  <span>Latest internal remark</span>
                  <p>
                    {remarks[business.id] ||
                      "No admin remarks recorded."}
                  </p>
                </div>
              </DetailCard>
            </div>
          </div>
        );
    }
  };

  /* =====================================================
     MAIN PAGE
  ===================================================== */

  return (
    <div className="businesses-admin-page">
      <section className="businesses-page-header">
        <div>
          <div className="businesses-eyebrow">
            CORPORATE DIRECTORY · TAB 3
          </div>
          <h1>Find City Listings</h1>
          <p>Manage registered businesses and city listings.</p>
        </div>
      </section>

      <section className="businesses-directory-card">
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

          {(search || contractorType !== "All contractor types") && (
            <button
              type="button"
              className="businesses-clear-button"
              onClick={clearFilters}
            >
              Clear
            </button>
          )}
        </div>

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
                          <button type="button" onClick={clearFilters}>
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

        <div className="businesses-table-footer">
          <span>
            Showing{" "}
            <strong>
              {filteredBusinesses.length === 0
                ? 0
                : (page - 1) * pageSize + 1}
              {"–"}
              {Math.min(page * pageSize, filteredBusinesses.length)}
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

            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (pageNumber) => (
                <button
                  type="button"
                  key={pageNumber}
                  className={page === pageNumber ? "active" : ""}
                  onClick={() => setPage(pageNumber)}
                >
                  {pageNumber}
                </button>
              ),
            )}

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
          REDESIGNED VENDOR DETAILS MODAL
      ================================================= */}

      {selectedBusiness && !action && (
        <div
          className="business-modal-backdrop vendor-redesign-backdrop"
          onClick={closeModal}
        >
          <div
            className="vendor-details-modal vendor-details-modal-redesign"
            onClick={(event) => event.stopPropagation()}
          >
            {/* MODAL HEADER */}

            <div className="vendor-redesign-topbar">
              <div>
                <span className="vendor-modal-breadcrumb">
                  CITY LISTINGS <span>/</span> VENDORS <span>/</span>{" "}
                  {selectedBusiness.id}
                </span>
                <h2>Vendor Details</h2>
                <p>Vendor profile, registration and listing management</p>
              </div>

              <button
                type="button"
                className="vendor-redesign-close"
                onClick={closeModal}
                aria-label="Close vendor details"
              >
                <X size={19} />
              </button>
            </div>

            {/* BUSINESS IDENTITY */}

            <div className="vendor-redesign-identity">
              <div className="vendor-redesign-avatar">
                <Store size={25} />
              </div>

              <div className="vendor-redesign-identity-main">
                <div className="vendor-redesign-title-line">
                  <div>
                    <h2>{selectedBusiness.name}</h2>
                    <p>
                      {selectedBusiness.type}
                      <span>·</span>
                      {selectedBusiness.id}
                    </p>
                  </div>
                </div>

                <div className="vendor-redesign-contact">
                  <span>
                    <UserRound size={14} />
                    {selectedBusiness.owner}
                  </span>

                  <span>
                    <MapPin size={14} />
                    {selectedBusiness.locality ||
                      selectedBusiness.city}
                    , {selectedBusiness.state}
                  </span>

                  <span>
                    <MessageSquare size={14} />
                    {selectedBusiness.phone}
                  </span>
                </div>
              </div>

              <button
                type="button"
                className="vendor-report-button"
                onClick={() => window.print()}
              >
                <Download size={14} />
                Export
              </button>
            </div>

            {/* MAIN PROFILE WORKSPACE */}

            <div className="vendor-redesign-workspace">
              {/* LEFT NAVIGATION */}

              <aside className="vendor-redesign-sidebar">
                <div className="vendor-sidebar-label">
                  PROFILE SECTIONS
                </div>

                <nav className="vendor-sidebar-nav">
                  {vendorTabs.map(({ label, icon: Icon, description }) => (
                    <button
                      type="button"
                      key={label}
                      className={
                        activeTab === label
                          ? "vendor-sidebar-link active"
                          : "vendor-sidebar-link"
                      }
                      onClick={() => setActiveTab(label)}
                      title={description}
                    >
                      <span className="vendor-sidebar-link-icon">
                        <Icon size={17} />
                      </span>

                      <span className="vendor-sidebar-link-text">
                        <strong>{label}</strong>
                        <small>{description}</small>
                      </span>
                    </button>
                  ))}
                </nav>
              </aside>

              {/* MAIN DETAIL CONTENT */}

              <main className="vendor-redesign-main">
                {renderVendorContent(selectedBusiness)}
              </main>
            </div>

            {/* VERIFICATION AND LISTING CONTROLS */}

            <div className="vendor-redesign-verification">
              <div className="vendor-verification-heading">
                <div className="vendor-verification-heading-icon">
                  <ShieldCheck size={19} />
                </div>

                <div>
                  <h3>Verification & Listing Controls</h3>
                  <p>
                    Review the submitted business information and update
                    its listing status.
                  </p>
                </div>

                <span
                  className={`vendor-status-badge ${statusClass(currentStatus)}`}
                >
                  {currentStatus}
                </span>
              </div>

              <div className="vendor-verification-controls">
                <div className="vendor-verification-current">
                  <span>Current listing status</span>
                  <strong>{currentStatus}</strong>
                  <small>
                    Registration fee: {selectedBusiness.registrationStatus}
                  </small>
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
              </div>

              <div className="vendor-admin-disclaimer">
                <ShieldCheck size={14} />
                Vendor-submitted information is read-only. Status changes
                are saved to the shared vendor collection.
              </div>
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
                      <strong>{selectedBusiness.registrationStatus}</strong>
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
