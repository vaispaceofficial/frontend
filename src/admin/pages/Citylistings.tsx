
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

type VendorStatus =
  | "Approved"
  | "Pending"
  | "Rejected"
  | "Suspended"
  | "Banned";

type AdminDirectoryTab = "onboarding" | "vendors" | "analytics";
type RegistrationStatus = "Pending" | "Approved" | "Rejected";
type RegistrationFeeStatus = "Paid" | "Pending";

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
  listingStatus?: string;
  adminStatusUpdatedAt?: string;
  registeredAt?: string;
  createdAt?: string;
  established?: string;
  yearEstablished?: string;
  applicationStatus?: string;
  isPublished?: boolean;
  publicationStatus?: string;
  suspensionCount?: number;
  suspensionReason?: string;
  suspendedAt?: string;
  reactivationDate?: string;
  suspensionHistory?: {
    reason: string;
    suspendedAt: string;
    reactivationDate: string;
    suspendedBy?: string;
  }[];

  banned?: boolean;
  bannedAt?: string;
  banReason?: string;
  wasPublishedBeforeSuspension?: boolean;
  publicationStatusBeforeSuspension?: string;
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
  registrationFeeStatus: RegistrationFeeStatus;
  vendorStatus: VendorStatus;
  isPublished: boolean;
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

    const storedSingleVendor = localStorage.getItem(
      SINGLE_VENDOR_STORAGE_KEY,
    );

    if (storedSingleVendor) {
      const parsed: unknown = JSON.parse(storedSingleVendor);

      if (isRecord(parsed)) {
        const nestedKey = isRecord(parsed.vendor)
          ? "vendor"
          : isRecord(parsed.profile)
            ? "profile"
            : null;

        const singleVendor = nestedKey
          ? (parsed[nestedKey] as VendorRecord)
          : (parsed as VendorRecord);

        const matchingVendor = vendors.find((vendor) => {
          const identifiers = [
            vendor.vendorId,
            vendor.id,
            vendor.mobile,
            vendor.phone,
            vendor.email,
          ]
            .filter(Boolean)
            .map((value) => String(value).trim().toLowerCase());

          const singleIdentifiers = [
            singleVendor.vendorId,
            singleVendor.id,
            singleVendor.mobile,
            singleVendor.phone,
            singleVendor.email,
          ]
            .filter(Boolean)
            .map((value) => String(value).trim().toLowerCase());

          return identifiers.some((value) =>
            singleIdentifiers.includes(value),
          );
        });

        if (matchingVendor) {
          const updatedSingle = {
            ...singleVendor,
            ...matchingVendor,
          };

          const updatedStoredValue = nestedKey
            ? {
              ...parsed,
              [nestedKey]: updatedSingle,
            }
            : updatedSingle;

          localStorage.setItem(
            SINGLE_VENDOR_STORAGE_KEY,
            JSON.stringify(updatedStoredValue),
          );
        }
      }
    }

    window.dispatchEvent(new Event("oneservice-vendors-change"));
    window.dispatchEvent(new Event("oneservice-vendor-change"));
    window.dispatchEvent(new Event("oneservice-auth-change"));
    window.dispatchEvent(new Event("oneservice-workspace-change"));
  } catch (error) {
    console.error("Unable to save vendors:", error);
  }
};

/* =========================================================
   STATUS HELPERS
========================================================= */

const normalizeStatus = (status: unknown): VendorStatus => {
  const value = readText(status, "Pending").toLowerCase();

  if (value.includes("ban")) return "Banned";
  if (value.includes("suspend")) return "Suspended";

  if (
    value.includes("approved") ||
    value === "active" ||
    value === "verified"
  ) {
    return "Approved";
  }

  if (value.includes("reject")) return "Rejected";

  return "Pending";
};

const normalizeRegistrationStatus = (
  vendor: VendorRecord,
): RegistrationStatus => {
  const raw = readText(
    vendor.registrationStatus,
    "",
  ).toLowerCase();

  if (raw.includes("approved") || raw === "active") {
    return "Approved";
  }

  if (raw.includes("reject")) {
    return "Rejected";
  }

  if (raw.includes("pending") || raw.includes("review")) {
    return "Pending";
  }

  // Legacy records may have stored payment status in registrationStatus.
  // Use applicationStatus as a fallback for their initial admin approval.
  const legacyStatus = readText(
    vendor.applicationStatus,
    "Pending",
  ).toLowerCase();

  if (legacyStatus.includes("approved") || legacyStatus === "active") {
    return "Approved";
  }

  if (legacyStatus.includes("reject")) {
    return "Rejected";
  }

  return "Pending";
};

const normalizeRegistrationFeeStatus = (
  vendor: VendorRecord,
): RegistrationFeeStatus => {
  const value = readText(
    vendor.registrationFeeStatus ??
    vendor.feeStatus ??
    vendor.paymentStatus,
    "Pending",
  ).toLowerCase();

  return ["paid", "completed", "success"].includes(value)
    ? "Paid"
    : "Pending";
};

const getDateInputValue = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const getDefaultReactivationDate = (): string => {
  const date = new Date();
  date.setDate(date.getDate() + 7);

  return getDateInputValue(date);
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

    registrationFeeStatus: normalizeRegistrationFeeStatus(vendor),

    vendorStatus: vendor.banned
      ? "Banned"
      : normalizeStatus(
        vendor.listingStatus ??
        vendor.vendorStatus ??
        vendor.status,
      ),

    isPublished: vendor.isPublished === true,

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
  "listingStatus",
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
  "applicationStatus",
  "suspensionCount",
  "suspensionReason",
  "suspendedAt",
  "reactivationDate",
  "suspensionHistory",
  "banned",
  "bannedAt",
  "banReason",
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

  const [activeDirectoryTab, setActiveDirectoryTab] =
    useState<AdminDirectoryTab>("onboarding");

  const [showSuspensionModal, setShowSuspensionModal] =
    useState(false);

  const [suspensionReason, setSuspensionReason] = useState("");

  const [reactivationDate, setReactivationDate] = useState(
    getDefaultReactivationDate(),
  );

  /* =====================================================
     LOAD DATA
  ===================================================== */

  const loadVendors = useCallback(() => {
    const storedVendors = readStoredVendors();
    const today = getDateInputValue(new Date());

    let hasReactivatedVendor = false;

    const synchronizedVendors = storedVendors.map((vendor) => {
      const status = normalizeStatus(
        vendor.listingStatus ?? vendor.vendorStatus ?? vendor.status,
      );

      const expiryDate = readText(vendor.reactivationDate, "");

      // Do not automatically reactivate permanently banned vendors.
      if (
        status === "Suspended" &&
        vendor.banned !== true &&
        expiryDate &&
        expiryDate <= today
      ) {
        hasReactivatedVendor = true;

        return {
          ...vendor,
          listingStatus: "Approved",
          vendorStatus: "Approved",
          status: "Approved",
          isPublished: vendor.wasPublishedBeforeSuspension === true,
          publicationStatus:
            vendor.publicationStatusBeforeSuspension ||
            (vendor.wasPublishedBeforeSuspension === true
              ? "Published"
              : "Draft"),
          listingStatusUpdatedAt: new Date().toISOString(),
          suspensionReason: "",
          suspendedAt: "",
          reactivationDate: "",
          adminStatusUpdatedAt: new Date().toISOString(),
          wasPublishedBeforeSuspension: undefined,
          publicationStatusBeforeSuspension: undefined,
        };
      }

      return vendor;
    });

    if (hasReactivatedVendor) {
      writeStoredVendors(synchronizedVendors);
    }

    setRegisteredVendors(synchronizedVendors);

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
  const onboardingBusinesses = useMemo(
    () =>
      businesses.filter(
        (business) =>
          business.registrationStatus === "Pending" ||
          business.registrationStatus === "Rejected",
      ),
    [businesses],
  );

  const approvedVendors = useMemo(
    () =>
      businesses.filter(
        (business) =>
          business.registrationStatus === "Approved",
      ),
    [businesses],
  );

  const analytics = useMemo(() => {
    const total = businesses.length;

    const approvedRegistrations = businesses.filter(
      (business) => business.registrationStatus === "Approved",
    ).length;

    const pendingRegistrations = businesses.filter(
      (business) => business.registrationStatus === "Pending",
    ).length;

    const rejectedRegistrations = businesses.filter(
      (business) => business.registrationStatus === "Rejected",
    ).length;

    const publishedListings = businesses.filter(
      (business) =>
        business.isPublished &&
        business.vendorStatus === "Approved",
    ).length;

    const unpublishedListings = businesses.filter(
      (business) => !business.isPublished,
    ).length;

    const suspendedVendors = businesses.filter(
      (business) => business.vendorStatus === "Suspended",
    ).length;

    const bannedVendors = businesses.filter(
      (business) => business.vendorStatus === "Banned",
    ).length;

    const paidRegistrations = businesses.filter(
      (business) => business.registrationFeeStatus === "Paid",
    ).length;

    const pendingPayments = businesses.filter(
      (business) => business.registrationFeeStatus === "Pending",
    ).length;

    const totalViews = businesses.reduce(
      (sum, business) => sum + business.views,
      0,
    );

    const totalEnquiries = businesses.reduce(
      (sum, business) => sum + business.enquiries,
      0,
    );

    const totalPhoneClicks = businesses.reduce(
      (sum, business) => sum + business.phoneClicks,
      0,
    );

    const totalFollowers = businesses.reduce(
      (sum, business) => sum + business.followers,
      0,
    );

    const totalProducts = businesses.reduce(
      (sum, business) => sum + business.productCount,
      0,
    );

    const totalServices = businesses.reduce(
      (sum, business) => sum + business.serviceCount,
      0,
    );

    const categoryCounts = businesses.reduce<Record<string, number>>(
      (counts, business) => {
        const category = business.type || "Uncategorized";
        counts[category] = (counts[category] || 0) + 1;
        return counts;
      },
      {},
    );

    const areaCounts = businesses.reduce<Record<string, number>>(
      (counts, business) => {
        const area = business.locality || business.city || "Not specified";
        counts[area] = (counts[area] || 0) + 1;
        return counts;
      },
      {},
    );

    return {
      total,
      approvedRegistrations,
      pendingRegistrations,
      rejectedRegistrations,
      publishedListings,
      unpublishedListings,
      suspendedVendors,
      bannedVendors,
      paidRegistrations,
      pendingPayments,
      totalViews,
      totalEnquiries,
      totalPhoneClicks,
      totalFollowers,
      totalProducts,
      totalServices,
      categoryCounts: Object.entries(categoryCounts).sort(
        (a, b) => b[1] - a[1],
      ),
      areaCounts: Object.entries(areaCounts).sort(
        (a, b) => b[1] - a[1],
      ),
    };
  }, [businesses]);

  const directoryBusinesses =
    activeDirectoryTab === "onboarding"
      ? onboardingBusinesses
      : activeDirectoryTab === "vendors"
        ? approvedVendors
        : [];

  /* =====================================================
     FILTERING
  ===================================================== */

  const filteredBusinesses = useMemo(() => {
    const query = search.trim().toLowerCase();

    return directoryBusinesses.filter((business) => {
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
  }, [directoryBusinesses, search, contractorType]);

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

  const updateRegistrationStatus = (
    status: RegistrationStatus,
  ) => {
    if (!selectedBusiness) return;

    const updatedAt = new Date().toISOString();

    const updatedVendors = registeredVendors.map((vendor) => {
      if (getVendorBusinessId(vendor) !== selectedBusiness.id) {
        return vendor;
      }

      return {
        ...vendor,

        // Initial vendor account approval only.
        registrationStatus: status,

        registrationStatusUpdatedAt: updatedAt,
        adminStatusUpdatedAt: updatedAt,

        // Do not approve or publish the public listing here.
        isPublished: vendor.isPublished === true,
      };
    });

    writeStoredVendors(updatedVendors);
    setRegisteredVendors(updatedVendors);

    setSelectedBusiness((previous) =>
      previous
        ? {
          ...previous,
          registrationStatus: status,
          registrationData: {
            ...previous.registrationData,
            registrationStatus: status,
            registrationStatusUpdatedAt: updatedAt,
            adminStatusUpdatedAt: updatedAt,
          },
        }
        : null,
    );
  };

  /* =====================================================
     UPDATE VENDOR STATUS
  ===================================================== */


  const updateVendorStatus = (status: VendorStatus) => {
    if (!selectedBusiness) return;

    const existingVendor = findVendorRecord(selectedBusiness);
    if (!existingVendor) return;

    if (
      normalizeRegistrationStatus(existingVendor) !== "Approved"
    ) {
      window.alert(
        "The vendor's initial registration must be approved before managing the public listing.",
      );
      return;
    }

    const currentListingStatus = normalizeStatus(
      existingVendor.listingStatus ??
      existingVendor.vendorStatus ??
      existingVendor.status,
    );

    const isPermanentlyBanned =
      existingVendor.banned === true ||
      currentListingStatus === "Banned";

    if (isPermanentlyBanned && status !== "Banned") {
      window.alert(
        "This vendor is permanently banned and cannot be reactivated.",
      );
      return;
    }

    const updatedAt = new Date().toISOString();

    const isReactivating =
      currentListingStatus === "Suspended" &&
      status === "Approved";

    // Restore the publication state that existed before suspension.
    // A listing that was never published must remain unpublished.
    const restoredIsPublished = isReactivating
      ? existingVendor.wasPublishedBeforeSuspension === true
      : existingVendor.isPublished === true;

    const restoredPublicationStatus = isReactivating
      ? readText(
        existingVendor.publicationStatusBeforeSuspension,
        restoredIsPublished ? "Published" : "Draft",
      )
      : readText(
        existingVendor.publicationStatus,
        restoredIsPublished ? "Published" : "Draft",
      );

    const updatedVendors = registeredVendors.map((vendor) => {
      if (getVendorBusinessId(vendor) !== selectedBusiness.id) {
        return vendor;
      }

      const isBlocked =
        status === "Suspended" ||
        status === "Rejected" ||
        status === "Banned";

      return {
        ...vendor,

        // Admin controls listing moderation.
        listingStatus: status,
        vendorStatus: status,
        status,

        // Approval alone must not publish a listing.
        isPublished: isBlocked ? false : restoredIsPublished,

        publicationStatus: isBlocked
          ? status
          : restoredPublicationStatus,

        // Retain the original publication timestamp.
        publishedAt: vendor.publishedAt,

        listingStatusUpdatedAt: updatedAt,
        adminStatusUpdatedAt: updatedAt,

        banned: status === "Banned",
        bannedAt:
          status === "Banned"
            ? vendor.bannedAt ?? updatedAt
            : vendor.bannedAt,

        // Clear the temporary suspension snapshot after reactivation.
        ...(isReactivating
          ? {
            wasPublishedBeforeSuspension: undefined,
            publicationStatusBeforeSuspension: undefined,
          }
          : {}),
      };
    });

    writeStoredVendors(updatedVendors);
    setRegisteredVendors(updatedVendors);

    const updatedVendor = updatedVendors.find(
      (vendor) => getVendorBusinessId(vendor) === selectedBusiness.id,
    );

    setSelectedBusiness((previous) =>
      previous && updatedVendor
        ? {
          ...previous,
          vendorStatus: status,
          isPublished: updatedVendor.isPublished === true,
          registrationData: {
            ...previous.registrationData,
            listingStatus: status,
            vendorStatus: status,
            status,
            isPublished: updatedVendor.isPublished === true,
            publicationStatus: updatedVendor.publicationStatus,
            publishedAt: updatedVendor.publishedAt,
            listingStatusUpdatedAt: updatedAt,
            banned: status === "Banned",
            bannedAt: updatedVendor.bannedAt,
            adminStatusUpdatedAt: updatedAt,
          },
        }
        : previous,
    );
  };



  const confirmVendorSuspension = () => {
    if (!selectedBusiness) return;

    const reason = suspensionReason.trim();

    if (!reason) {
      window.alert("Please enter a reason for suspending this vendor.");
      return;
    }

    const today = getDateInputValue(new Date());

    if (!reactivationDate || reactivationDate <= today) {
      window.alert("Please select a reactivation date after today.");
      return;
    }

    const updatedAt = new Date().toISOString();

    const updatedVendors = registeredVendors.map((vendor) => {
      if (getVendorBusinessId(vendor) !== selectedBusiness.id) {
        return vendor;
      }

      const previousCount = readNumber(vendor.suspensionCount);
      const previousHistory = Array.isArray(vendor.suspensionHistory)
        ? vendor.suspensionHistory
        : [];

      const newHistory = [
        ...previousHistory,
        {
          reason,
          suspendedAt: updatedAt,
          reactivationDate,
          suspendedBy: "Admin",
        },
      ];

      return {
        ...vendor,

        // Save the state before suspension so it can be restored later.
        wasPublishedBeforeSuspension: vendor.isPublished === true,
        publicationStatusBeforeSuspension:
          vendor.publicationStatus ||
          (vendor.isPublished === true ? "Published" : "Draft"),

        // Suspend the public listing without destroying its history.
        listingStatus: "Suspended",
        vendorStatus: "Suspended",
        status: "Suspended",

        isPublished: false,
        publicationStatus: "Suspended",

        listingStatusUpdatedAt: updatedAt,
        suspensionCount: previousCount + 1,
        suspensionReason: reason,
        suspendedAt: updatedAt,
        reactivationDate,
        suspensionHistory: newHistory,
        adminStatusUpdatedAt: updatedAt,
      };
    });

    writeStoredVendors(updatedVendors);
    setRegisteredVendors(updatedVendors);

    setSelectedBusiness((previous) => {
      if (!previous) return null;

      const updatedVendor = updatedVendors.find(
        (vendor) => getVendorBusinessId(vendor) === selectedBusiness.id,
      );

      return {
        ...previous,
        vendorStatus: "Suspended",
        isPublished: false,
        registrationData: {
          ...previous.registrationData,
          listingStatus: "Suspended",
          vendorStatus: "Suspended",
          status: "Suspended",
          isPublished: false,
          publicationStatus: "Suspended",
          wasPublishedBeforeSuspension:
            updatedVendor?.wasPublishedBeforeSuspension,
          publicationStatusBeforeSuspension:
            updatedVendor?.publicationStatusBeforeSuspension,
          suspensionCount:
            readNumber(previous.registrationData.suspensionCount) + 1,
          suspensionReason: reason,
          suspendedAt: updatedAt,
          reactivationDate,
          adminStatusUpdatedAt: updatedAt,
        },
      };
    });

    setShowSuspensionModal(false);
    setSuspensionReason("");
    setReactivationDate(getDefaultReactivationDate());
  };


  const permanentlyBanVendor = () => {
    if (!selectedBusiness) return;

    const vendor = findVendorRecord(selectedBusiness);
    const suspensionCount = readNumber(vendor?.suspensionCount);

    if (suspensionCount < 3) {
      window.alert(
        "A vendor must have at least three recorded suspensions before this ban action is available.",
      );
      return;
    }

    const reason = window.prompt(
      "Enter the reason for permanently banning this vendor:",
    );

    if (!reason?.trim()) return;

    const updatedAt = new Date().toISOString();

    const updatedVendors = registeredVendors.map((item) => {
      if (getVendorBusinessId(item) !== selectedBusiness.id) {
        return item;
      }

      return {
        ...item,
        listingStatus: "Banned",
        vendorStatus: "Banned",
        status: "Banned",
        isPublished: false,
        publicationStatus: "Banned",
        listingStatusUpdatedAt: updatedAt,
        banned: true,
        bannedAt: updatedAt,
        banReason: reason.trim(),
        adminStatusUpdatedAt: updatedAt,
      };
    });

    writeStoredVendors(updatedVendors);
    setRegisteredVendors(updatedVendors);

    setSelectedBusiness((previous) =>
      previous
        ? {
          ...previous,
          vendorStatus: "Banned",
          registrationData: {
            ...previous.registrationData,
            listingStatus: "Banned",
            vendorStatus: "Banned",
            status: "Banned",
            applicationStatus: "Approved",
            banned: true,
            bannedAt: updatedAt,
            banReason: reason.trim(),
            adminStatusUpdatedAt: updatedAt,
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

  const currentRegistrationStatus = selectedBusiness
    ? selectedBusiness.registrationStatus
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
                    value={business.registrationFeeStatus}
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
                    value={business.registrationFeeStatus}
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

  const renderAnalytics = () => (
    <section className="city-analytics">
      <div className="city-analytics-heading">
        <div>
          <span>CITY LISTINGS OVERVIEW</span>
          <h2>Business Analytics</h2>
          <p>
            Registration, listing publication, payment and engagement
            statistics from your registered vendor records.
          </p>
        </div>

        <div className="city-analytics-total">
          <span>Total registered businesses</span>
          <strong>{analytics.total}</strong>
        </div>
      </div>

      <div className="city-analytics-grid">
        <div className="city-analytics-card">
          <span>Total businesses</span>
          <strong>{analytics.total}</strong>
          <Building2 size={20} />
          <small>All registered vendor records</small>
        </div>

        <div className="city-analytics-card">
          <span>Approved registrations</span>
          <strong>{analytics.approvedRegistrations}</strong>
          <CheckCircle2 size={20} />
          <small>Initial vendor approval completed</small>
        </div>

        <div className="city-analytics-card">
          <span>Pending registrations</span>
          <strong>{analytics.pendingRegistrations}</strong>
          <Clock3 size={20} />
          <small>Awaiting initial admin review</small>
        </div>

        <div className="city-analytics-card">
          <span>Rejected registrations</span>
          <strong>{analytics.rejectedRegistrations}</strong>
          <X size={20} />
          <small>Initial applications rejected</small>
        </div>

        <div className="city-analytics-card">
          <span>Published listings</span>
          <strong>{analytics.publishedListings}</strong>
          <Store size={20} />
          <small>Approved and published businesses</small>
        </div>

        <div className="city-analytics-card">
          <span>Unpublished listings</span>
          <strong>{analytics.unpublishedListings}</strong>
          <Eye size={20} />
          <small>Listings not currently published</small>
        </div>

        <div className="city-analytics-card">
          <span>Suspended vendors</span>
          <strong>{analytics.suspendedVendors}</strong>
          <PauseCircle size={20} />
          <small>Temporarily suspended listings</small>
        </div>

        <div className="city-analytics-card">
          <span>Permanently banned</span>
          <strong>{analytics.bannedVendors}</strong>
          <ShieldCheck size={20} />
          <small>Vendor records permanently banned</small>
        </div>
      </div>

      <div className="city-analytics-section-grid">
        <div className="city-analytics-panel">
          <div className="city-analytics-panel-heading">
            <div>
              <h3>Registration payments</h3>
              <p>Payment status across registered businesses</p>
            </div>
            <Wallet size={19} />
          </div>

          <div className="city-analytics-stat-row">
            <span>Paid registrations</span>
            <strong>{analytics.paidRegistrations}</strong>
          </div>

          <div className="city-analytics-progress">
            <span
              style={{
                width: `${analytics.total
                    ? (analytics.paidRegistrations / analytics.total) * 100
                    : 0
                  }%`,
              }}
            />
          </div>

          <div className="city-analytics-stat-row">
            <span>Pending payments</span>
            <strong>{analytics.pendingPayments}</strong>
          </div>

          <div className="city-analytics-progress pending">
            <span
              style={{
                width: `${analytics.total
                    ? (analytics.pendingPayments / analytics.total) * 100
                    : 0
                  }%`,
              }}
            />
          </div>
        </div>

        <div className="city-analytics-panel">
          <div className="city-analytics-panel-heading">
            <div>
              <h3>Listing engagement</h3>
              <p>Engagement totals recorded in vendor profiles</p>
            </div>
            <Activity size={19} />
          </div>

          <div className="city-analytics-stat-row">
            <span>Profile views</span>
            <strong>{analytics.totalViews.toLocaleString()}</strong>
          </div>

          <div className="city-analytics-stat-row">
            <span>Customer enquiries</span>
            <strong>{analytics.totalEnquiries.toLocaleString()}</strong>
          </div>

          <div className="city-analytics-stat-row">
            <span>Phone clicks</span>
            <strong>{analytics.totalPhoneClicks.toLocaleString()}</strong>
          </div>

          <div className="city-analytics-stat-row">
            <span>Followers</span>
            <strong>{analytics.totalFollowers.toLocaleString()}</strong>
          </div>
        </div>

        <div className="city-analytics-panel">
          <div className="city-analytics-panel-heading">
            <div>
              <h3>Business offerings</h3>
              <p>Products and services submitted by vendors</p>
            </div>
            <Package size={19} />
          </div>

          <div className="city-analytics-stat-row">
            <span>Total products</span>
            <strong>{analytics.totalProducts}</strong>
          </div>

          <div className="city-analytics-stat-row">
            <span>Total services</span>
            <strong>{analytics.totalServices}</strong>
          </div>
        </div>
      </div>

      <div className="city-analytics-section-grid">
        <div className="city-analytics-panel">
          <div className="city-analytics-panel-heading">
            <div>
              <h3>Businesses by category</h3>
              <p>Distribution of registered business categories</p>
            </div>
            <Building2 size={19} />
          </div>

          {analytics.categoryCounts.length ? (
            analytics.categoryCounts.map(([category, count]) => (
              <div className="city-analytics-breakdown" key={category}>
                <div>
                  <span>{category}</span>
                  <strong>{count}</strong>
                </div>
                <div className="city-analytics-progress">
                  <span
                    style={{
                      width: `${analytics.total
                          ? (count / analytics.total) * 100
                          : 0
                        }%`,
                    }}
                  />
                </div>
              </div>
            ))
          ) : (
            <p className="city-analytics-empty">
              No category data available yet.
            </p>
          )}
        </div>

        <div className="city-analytics-panel">
          <div className="city-analytics-panel-heading">
            <div>
              <h3>Businesses by area</h3>
              <p>Distribution by registered locality or city</p>
            </div>
            <MapPin size={19} />
          </div>

          {analytics.areaCounts.length ? (
            analytics.areaCounts.map(([area, count]) => (
              <div className="city-analytics-breakdown" key={area}>
                <div>
                  <span>{area}</span>
                  <strong>{count}</strong>
                </div>
                <div className="city-analytics-progress">
                  <span
                    style={{
                      width: `${analytics.total
                          ? (count / analytics.total) * 100
                          : 0
                        }%`,
                    }}
                  />
                </div>
              </div>
            ))
          ) : (
            <p className="city-analytics-empty">
              No location data available yet.
            </p>
          )}
        </div>
      </div>

      {analytics.total === 0 && (
        <div className="city-analytics-empty-state">
          <Activity size={30} />
          <strong>No analytics data available</strong>
          <p>
            Analytics will populate automatically when vendor registration
            records are saved in the shared vendor collection.
          </p>
        </div>
      )}
    </section>
  );

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


      {activeDirectoryTab === "analytics" ? (
        <section className="businesses-directory-card businesses-analytics-card">
          <div className="businesses-analytics-header">
            <div>
              <span className="businesses-eyebrow">CITY LISTINGS OVERVIEW</span>
              <h2>Business Analytics</h2>
              <p>
                Track vendor registrations, listing approvals and business
                performance across City Listings.
              </p>
            </div>

            <button
              type="button"
              className="businesses-clear-button"
              onClick={loadVendors}
            >
              <Activity size={15} />
              Refresh Analytics
            </button>
          </div>

          {/* REGISTRATION METRICS */}
          <div className="businesses-analytics-grid">
            <div className="businesses-analytics-metric">
              <span>
                <Store size={18} />
                Total Businesses
              </span>
              <strong>{businesses.length}</strong>
              <small>All registered businesses</small>
            </div>

            <div className="businesses-analytics-metric">
              <span>
                <CheckCircle2 size={18} />
                Approved Registrations
              </span>
              <strong>{approvedVendors.length}</strong>
              <small>Vendor accounts approved</small>
            </div>

            <div className="businesses-analytics-metric">
              <span>
                <Clock3 size={18} />
                Pending Registrations
              </span>
              <strong>
                {
                  businesses.filter(
                    (business) => business.registrationStatus === "Pending"
                  ).length
                }
              </strong>
              <small>Awaiting admin review</small>
            </div>

            <div className="businesses-analytics-metric">
              <span>
                <X size={18} />
                Rejected Registrations
              </span>
              <strong>
                {
                  businesses.filter(
                    (business) => business.registrationStatus === "Rejected"
                  ).length
                }
              </strong>
              <small>Registrations rejected</small>
            </div>

            <div className="businesses-analytics-metric">
              <span>
                <Eye size={18} />
                Published Listings
              </span>
              <strong>
                {
                  businesses.filter(
                    (business) =>
                      business.isPublished &&
                      business.registrationStatus === "Approved" &&
                      business.vendorStatus === "Approved"
                  ).length
                }
              </strong>
              <small>Approved and published businesses</small>
            </div>

            <div className="businesses-analytics-metric">
              <span>
                <FileText size={18} />
                Unpublished Listings
              </span>
              <strong>
                {
                  businesses.filter(
                    (business) => !business.isPublished
                  ).length
                }
              </strong>
              <small>Not currently published</small>
            </div>

            <div className="businesses-analytics-metric">
              <span>
                <PauseCircle size={18} />
                Suspended Listings
              </span>
              <strong>
                {
                  businesses.filter(
                    (business) => business.vendorStatus === "Suspended"
                  ).length
                }
              </strong>
              <small>Temporarily suspended</small>
            </div>

            <div className="businesses-analytics-metric">
              <span>
                <ShieldCheck size={18} />
                Banned Vendors
              </span>
              <strong>
                {
                  businesses.filter(
                    (business) => business.vendorStatus === "Banned"
                  ).length
                }
              </strong>
              <small>Permanently banned</small>
            </div>
          </div>

          {/* BUSINESS PERFORMANCE */}
          <div className="businesses-analytics-section">
            <div className="businesses-analytics-section-heading">
              <div>
                <h3>Business Performance</h3>
                <p>Engagement recorded across registered business profiles.</p>
              </div>
            </div>

            <div className="businesses-analytics-grid businesses-performance-grid">
              <div className="businesses-analytics-metric">
                <span>
                  <Eye size={18} />
                  Total Profile Views
                </span>
                <strong>
                  {businesses.reduce(
                    (total, business) => total + business.views,
                    0
                  ).toLocaleString("en-IN")}
                </strong>
                <small>Combined business profile views</small>
              </div>

              <div className="businesses-analytics-metric">
                <span>
                  <MessageSquare size={18} />
                  Total Enquiries
                </span>
                <strong>
                  {businesses.reduce(
                    (total, business) => total + business.enquiries,
                    0
                  ).toLocaleString("en-IN")}
                </strong>
                <small>Customer enquiries received</small>
              </div>

              <div className="businesses-analytics-metric">
                <span>
                  <UserRound size={18} />
                  Total Phone Clicks
                </span>
                <strong>
                  {businesses.reduce(
                    (total, business) => total + business.phoneClicks,
                    0
                  ).toLocaleString("en-IN")}
                </strong>
                <small>Customer contact clicks</small>
              </div>

              <div className="businesses-analytics-metric">
                <span>
                  <Star size={18} />
                  Total Reviews
                </span>
                <strong>
                  {businesses.reduce(
                    (total, business) => total + business.reviews,
                    0
                  ).toLocaleString("en-IN")}
                </strong>
                <small>Customer reviews recorded</small>
              </div>
            </div>
          </div>

          {/* REGISTRATION FEE SUMMARY */}
          <div className="businesses-analytics-section">
            <div className="businesses-analytics-section-heading">
              <div>
                <h3>Registration Fee Summary</h3>
                <p>Payment status across all registered businesses.</p>
              </div>
            </div>

            <div className="businesses-analytics-grid businesses-payment-grid">
              <div className="businesses-analytics-metric">
                <span>
                  <CheckCircle2 size={18} />
                  Paid Registrations
                </span>
                <strong>
                  {
                    businesses.filter(
                      (business) =>
                        business.registrationFeeStatus === "Paid"
                    ).length
                  }
                </strong>
                <small>Registration fee marked as paid</small>
              </div>

              <div className="businesses-analytics-metric">
                <span>
                  <Wallet size={18} />
                  Pending Payments
                </span>
                <strong>
                  {
                    businesses.filter(
                      (business) =>
                        business.registrationFeeStatus === "Pending"
                    ).length
                  }
                </strong>
                <small>Registration fee not yet marked as paid</small>
              </div>
            </div>
          </div>

          {/* EMPTY STATE */}
          {businesses.length === 0 && (
            <div className="businesses-empty-state">
              <Activity size={28} />
              <strong>No analytics data available yet</strong>
              <span>
                Analytics will appear here after vendor registrations are
                added to the shared vendor collection.
              </span>
            </div>
          )}
        </section>
      ) : (
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
                        className={`business-payment-status ${business.registrationFeeStatus.toLowerCase()}`}
                      >
                        {business.registrationFeeStatus === "Paid" && (
                          <CheckCircle2 size={13} />
                        )}
                        {business.registrationFeeStatus}
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

              {Array.from(
                { length: totalPages },
                (_, index) => index + 1
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
                    Math.min(totalPages, current + 1)
                  )
                }
                aria-label="Next page"
              >
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        </section>
      )}


      <section className="businesses-admin-tabs">
        <button
          type="button"
          className={activeDirectoryTab === "onboarding" ? "active" : ""}
          onClick={() => {
            setActiveDirectoryTab("onboarding");
            setPage(1);
            closeModal();
          }}
        >
          <FileCheck size={16} />
          Onboarding Requests
          <span>{onboardingBusinesses.length}</span>
        </button>

        <button
          type="button"
          className={activeDirectoryTab === "vendors" ? "active" : ""}
          onClick={() => {
            setActiveDirectoryTab("vendors");
            setPage(1);
            closeModal();
          }}
        >
          <Store size={16} />
          Vendors
          <span>{approvedVendors.length}</span>
        </button>

        <button
          type="button"
          className={activeDirectoryTab === "analytics" ? "active" : ""}
          onClick={() => {
            setActiveDirectoryTab("analytics");
            setPage(1);
            closeModal();
          }}
        >
          <Activity size={16} />
          Analytics
        </button>
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
                  {activeDirectoryTab === "onboarding"
                    ? currentRegistrationStatus
                    : currentStatus}
                </span>
              </div>

              <div className="vendor-verification-controls">
                <div className="vendor-verification-current">
                  {activeDirectoryTab === "onboarding" ? (
                    <>
                      <span>Initial registration status</span>
                      <strong>{currentRegistrationStatus}</strong>
                      <small>
                        Registration fee: {selectedBusiness.registrationFeeStatus}
                      </small>
                    </>
                  ) : (
                    <>
                      <span>Public listing status</span>
                      <strong>{currentStatus}</strong>
                      <small>
                        Registration: {currentRegistrationStatus} · Fee:{" "}
                        {selectedBusiness.registrationFeeStatus}
                      </small>
                    </>
                  )}
                </div>

                <div className="vendor-admin-actions">
                  {activeDirectoryTab === "onboarding" ? (
                    <>
                      {currentRegistrationStatus !== "Approved" && (
                        <button
                          type="button"
                          className="vendor-admin-approve"
                          onClick={() => updateRegistrationStatus("Approved")}
                        >
                          <CheckCircle2 size={15} />
                          Approve Registration
                        </button>
                      )}

                      {currentRegistrationStatus !== "Rejected" && (
                        <button
                          type="button"
                          className="vendor-admin-reject"
                          onClick={() => updateRegistrationStatus("Rejected")}
                        >
                          <X size={15} />
                          Reject Registration
                        </button>
                      )}

                      {currentRegistrationStatus === "Approved" && (
                        <div className="vendor-suspension-summary">
                          <ShieldCheck size={16} />
                          <span>
                            Vendor account approved. Public listing approval is separate.
                          </span>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      {currentStatus !== "Approved" &&
                        currentStatus !== "Banned" && (
                          <button
                            type="button"
                            className="vendor-admin-approve"
                            onClick={() => updateVendorStatus("Approved")}
                          >
                            <CheckCircle2 size={15} />
                            {currentStatus === "Suspended"
                              ? "Reactivate Listing"
                              : "Approve Listing"}
                          </button>
                        )}

                      {currentStatus === "Pending" && (
                        <button
                          type="button"
                          className="vendor-admin-reject"
                          onClick={() => updateVendorStatus("Rejected")}
                        >
                          <X size={15} />
                          Reject Listing
                        </button>
                      )}

                      {currentStatus === "Approved" && (
                        <button
                          type="button"
                          className="vendor-admin-suspend"
                          onClick={() => {
                            setSuspensionReason("");
                            setReactivationDate(getDefaultReactivationDate());
                            setShowSuspensionModal(true);
                          }}
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
                          Review Listing Again
                        </button>
                      )}

                      {currentStatus === "Banned" && (
                        <div className="vendor-suspension-summary">
                          <ShieldCheck size={16} />
                          <span>This vendor is permanently banned.</span>
                        </div>
                      )}

                      {currentStatus === "Suspended" && (
                        <div className="vendor-suspension-summary">
                          <PauseCircle size={16} />
                          <span>
                            Suspensions:{" "}
                            {selectedBusiness.registrationData.suspensionCount ?? 0}
                            {selectedBusiness.registrationData.reactivationDate && (
                              <>
                                {" "}· Reactivation date:{" "}
                                {selectedBusiness.registrationData.reactivationDate}
                              </>
                            )}
                          </span>
                        </div>
                      )}

                      {(selectedBusiness.registrationData.suspensionCount ?? 0) >= 3 &&
                        currentStatus !== "Banned" && (
                          <button
                            type="button"
                            className="vendor-admin-reject"
                            onClick={permanentlyBanVendor}
                          >
                            <ShieldCheck size={15} />
                            Permanently Ban Vendor
                          </button>
                        )}
                    </>
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

      {showSuspensionModal && selectedBusiness && (
        <div
          className="business-modal-backdrop"
          onClick={() => setShowSuspensionModal(false)}
        >
          <div
            className="business-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="suspension-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="business-modal-header">
              <div>
                <span>VENDOR LISTING</span>
                <h2 id="suspension-modal-title">Suspend listing</h2>
                <small>{selectedBusiness.name}</small>
              </div>
              <button
                type="button"
                onClick={() => setShowSuspensionModal(false)}
                aria-label="Close suspension dialog"
              >
                <X size={18} />
              </button>
            </div>

            <div className="business-modal-content">
              <label htmlFor="suspension-reason">Reason for suspension</label>
              <textarea
                id="suspension-reason"
                value={suspensionReason}
                onChange={(event) => setSuspensionReason(event.target.value)}
                placeholder="Enter a reason"
                required
              />

              <label htmlFor="reactivation-date">Reactivation date</label>
              <input
                id="reactivation-date"
                type="date"
                value={reactivationDate}
                min={getDateInputValue(new Date())}
                onChange={(event) => setReactivationDate(event.target.value)}
                required
              />
            </div>

            <div className="business-modal-footer">
              <button
                type="button"
                className="business-modal-cancel"
                onClick={() => setShowSuspensionModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmVendorSuspension}
              >
                Confirm suspension
              </button>
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
                      <strong>{selectedBusiness.registrationFeeStatus}</strong>
                    </div>

                    <div>
                      <span>VENDOR STATUS</span>
                      <strong>{currentRegistrationStatus}</strong>
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
