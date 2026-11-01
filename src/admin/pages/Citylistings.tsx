
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
  Image,
  IndianRupee,
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

type RegistrationStatus = "Paid" | "Pending";

type VendorStatus =
  | "Approved"
  | "Pending"
  | "Rejected"
  | "Suspended";

type VendorRecord = Record<string, unknown> & {
  id?: string;
  vendorId?: string;
  role?: string;
  accountType?: string;
  fullName?: string;
  ownerName?: string;
  name?: string;
  mobile?: string;
  phone?: string;
  email?: string;
  businessName?: string;
  businessType?: string;
  businessCategory?: string;
  businessAddress?: string;
  address?: string;
  locality?: string;
  area?: string;
  businessLocality?: string;
  city?: string;
  state?: string;
  pincode?: string;
  pinCode?: string;
  postalCode?: string;
  productDescription?: string;
  description?: string;
  businessDescription?: string;
  products?: unknown[];
  services?: unknown[];
  serviceAreas?: unknown[];
  coverageAreas?: unknown[];
  projects?: string;
  portfolioDescription?: string;
  registrationStatus?: string;
  paymentStatus?: string;
  feeStatus?: string;
  registrationFeeStatus?: string;
  status?: string;
  vendorStatus?: string;
  registeredAt?: string;
  createdAt?: string;
  established?: string;
  yearEstablished?: string;
  whatsapp?: string;
  whatsappNumber?: string;
  productCount?: number;
  serviceCount?: number;
  workingHours?: string;
  businessHours?: string;
  workingDays?: string;
  delivery?: string;
  deliveryAvailability?: string;
  paymentMethods?: unknown[];
  rating?: string | number;
  reviews?: number;
  views?: number;
  enquiries?: number;
  phoneClicks?: number;
  followers?: number;
};

type Business = {
  id: string;
  name: string;
  type: string;
  projects: string;
  contact: string;
  registrationStatus: RegistrationStatus;

  owner: string;
  email: string;
  phone: string;
  whatsapp: string;
  description: string;
  established: string;

  address: string;
  locality: string;
  city: string;
  state: string;
  pincode: string;

  serviceAreas: string[];
  products: string[];
  services: string[];

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

  vendorStatus: VendorStatus;
  registeredAt: string;
};

type VendorTab =
  | "Overview"
  | "Business"
  | "Products & Services"
  | "Operations"
  | "Documents"
  | "Gallery"
  | "Performance"
  | "Activity";

const VENDORS_STORAGE_KEY = "oneservice_vendors";
const REMARKS_STORAGE_KEY = "oneservice_vendor_admin_remarks";

/* =========================================================
   HELPERS
========================================================= */

const readText = (
  value: unknown,
  fallback = "Not provided",
): string => {
  if (typeof value === "string" && value.trim()) {
    return value.trim();
  }

  if (typeof value === "number" && Number.isFinite(value)) {
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

/* ---------------------------------------------------------
   SAFE STORAGE READING
--------------------------------------------------------- */

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
    console.error(
      "Unable to read registered vendors:",
      error,
    );

    return [];
  }
};

/* ---------------------------------------------------------
   SAFE STORAGE WRITING
--------------------------------------------------------- */

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
    console.error(
      "Unable to save vendor records:",
      error,
    );
  }
};

/* ---------------------------------------------------------
   VENDOR IDENTITY
   One consistent ID is used throughout the page.
--------------------------------------------------------- */

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
  const explicitId =
    vendor.vendorId ??
    vendor.id;

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

  if (identity) {
    return `V-${identity}`;
  }

  const businessName = readText(
    vendor.businessName ?? vendor.name,
    "Unnamed Business",
  );

  return `V-${businessName
    .replace(/[^a-zA-Z0-9]/g, "")
    .slice(0, 12)}`;
};

/* ---------------------------------------------------------
   STATUS NORMALIZATION
--------------------------------------------------------- */

const normalizeStatus = (
  status: unknown,
): VendorStatus => {
  const value = readText(
    status,
    "Pending",
  ).toLowerCase();

  if (
    value.includes("approved") ||
    value === "active" ||
    value === "verified"
  ) {
    return "Approved";
  }

  if (value.includes("reject")) {
    return "Rejected";
  }

  if (value.includes("suspend")) {
    return "Suspended";
  }

  return "Pending";
};

/* ---------------------------------------------------------
   REGISTRATION PAYMENT STATUS
--------------------------------------------------------- */

const normalizeRegistrationStatus = (
  vendor: VendorRecord,
): RegistrationStatus => {
  const rawStatus = readText(
    vendor.registrationStatus ??
      vendor.registrationFeeStatus ??
      vendor.feeStatus ??
      vendor.paymentStatus,
    "Pending",
  ).toLowerCase();

  return rawStatus === "paid" ||
    rawStatus === "completed" ||
    rawStatus === "success"
    ? "Paid"
    : "Pending";
};

/* ---------------------------------------------------------
   NORMALIZE VENDOR INTO BUSINESS
--------------------------------------------------------- */

const normalizeBusiness = (
  vendor: VendorRecord,
): Business => {
  const products = readArray(vendor.products);
  const services = readArray(vendor.services);

  const businessName = readText(
    vendor.businessName ?? vendor.name,
    "Unnamed Business",
  );

  const phone = readText(
    vendor.mobile ?? vendor.phone,
  );

  const address = readText(
    vendor.businessAddress ?? vendor.address,
  );

  const locality = readText(
    vendor.locality ??
      vendor.area ??
      vendor.businessLocality,
    "",
  );

  const city = readText(
    vendor.city,
    "Visakhapatnam",
  );

  const state = readText(
    vendor.state,
    "Andhra Pradesh",
  );

  const id = getVendorBusinessId(vendor);

  return {
    id,
    name: businessName,

    type: readText(
      vendor.businessType ??
        vendor.businessCategory,
      "Business & Professional Services",
    ),

    projects: readText(
      vendor.projects ??
        vendor.portfolioDescription,
      "Portfolio not provided",
    ),

    contact: phone,

    registrationStatus:
      normalizeRegistrationStatus(vendor),

    owner: readText(
      vendor.fullName ??
        vendor.ownerName ??
        vendor.name,
    ),

    email: readText(vendor.email),
    phone,

    whatsapp: readText(
      vendor.whatsapp ??
        vendor.whatsappNumber,
    ),

    description: readText(
      vendor.productDescription ??
        vendor.description ??
        vendor.businessDescription,
    ),

    established: readText(
      vendor.established ??
        vendor.yearEstablished,
    ),

    address,
    locality,
    city,
    state,

    pincode: readText(
      vendor.pincode ??
        vendor.pinCode ??
        vendor.postalCode,
    ),

    serviceAreas: readArray(
      vendor.serviceAreas ??
        vendor.coverageAreas,
    ),

    products,
    services,

    productCount: readNumber(
      vendor.productCount,
      products.length,
    ),

    serviceCount: readNumber(
      vendor.serviceCount,
      services.length,
    ),

    workingHours: readText(
      vendor.workingHours ??
        vendor.businessHours,
    ),

    workingDays: readText(
      vendor.workingDays,
    ),

    delivery: readText(
      vendor.delivery ??
        vendor.deliveryAvailability,
    ),

    paymentMethods: readArray(
      vendor.paymentMethods,
    ),

    rating: readText(
      vendor.rating,
      "Not available",
    ),

    reviews: readNumber(vendor.reviews),
    views: readNumber(vendor.views),
    enquiries: readNumber(vendor.enquiries),
    phoneClicks: readNumber(vendor.phoneClicks),
    followers: readNumber(vendor.followers),

    vendorStatus: normalizeStatus(
      vendor.status ??
        vendor.vendorStatus,
    ),

    registeredAt: readText(
      vendor.registeredAt ??
        vendor.createdAt,
    ),
  };
};

/* =========================================================
   CONTRACTOR TYPES
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
   VENDOR TABS
========================================================= */

const vendorTabs: {
  label: VendorTab;
  icon: typeof LayoutDashboard;
}[] = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "Business", icon: Building2 },
  { label: "Products & Services", icon: Package },
  { label: "Operations", icon: Clock3 },
  { label: "Documents", icon: FileCheck },
  { label: "Gallery", icon: Image },
  { label: "Performance", icon: Activity },
  { label: "Activity", icon: MessageSquare },
];

/* =========================================================
   DETAIL COMPONENTS
========================================================= */

function DetailItem({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) {
  return (
    <div className="vendor-detail-item">
      <span>{label}</span>

      <strong>
        {value !== undefined &&
        value !== null &&
        value !== ""
          ? value
          : "Not provided"}
      </strong>
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
    "approve" | "portfolio" | "subscription" | null
  >(null);

  const [page, setPage] = useState(1);

  const [remarks, setRemarks] = useState<
    Record<string, string>
  >({});

  const [remarkInput, setRemarkInput] = useState("");

  /* -------------------------------------------------------
     LOAD VENDORS AND ADMIN REMARKS
  ------------------------------------------------------- */

  const loadVendors = useCallback(() => {
    setRegisteredVendors(readStoredVendors());

    try {
      const storedRemarks = localStorage.getItem(
        REMARKS_STORAGE_KEY,
      );

      if (storedRemarks) {
        const parsed: unknown = JSON.parse(storedRemarks);

        if (
          parsed &&
          typeof parsed === "object" &&
          !Array.isArray(parsed)
        ) {
          setRemarks(
            parsed as Record<string, string>,
          );
        } else {
          setRemarks({});
        }
      } else {
        setRemarks({});
      }
    } catch (error) {
      console.error(
        "Unable to read admin remarks:",
        error,
      );

      setRemarks({});
    }
  }, []);

  /* -------------------------------------------------------
     REAL-TIME SHARED COLLECTION LISTENER
  ------------------------------------------------------- */

  useEffect(() => {
    loadVendors();

    window.addEventListener(
      "oneservice-vendors-change",
      loadVendors,
    );

    window.addEventListener(
      "storage",
      loadVendors,
    );

    return () => {
      window.removeEventListener(
        "oneservice-vendors-change",
        loadVendors,
      );

      window.removeEventListener(
        "storage",
        loadVendors,
      );
    };
  }, [loadVendors]);

  /* -------------------------------------------------------
     MAP SHARED RECORDS TO BUSINESS DATA

     No sample businesses are shown here.
     Only actual registered vendor records are displayed.
  ------------------------------------------------------- */

  const businesses = useMemo(() => {
    return registeredVendors.map(normalizeBusiness);
  }, [registeredVendors]);

  /* -------------------------------------------------------
     VENDOR STATUS LOOKUP
  ------------------------------------------------------- */

  const vendorStatuses = useMemo(() => {
    return Object.fromEntries(
      businesses.map((business) => [
        business.id,
        business.vendorStatus,
      ]),
    ) as Record<string, VendorStatus>;
  }, [businesses]);

  /* -------------------------------------------------------
     FILTERING
  ------------------------------------------------------- */

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
  }, [
    businesses,
    search,
    contractorType,
  ]);

  /* -------------------------------------------------------
     PAGINATION
  ------------------------------------------------------- */

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
    setPage((current) =>
      Math.min(current, totalPages),
    );
  }, [totalPages]);

  const clearFilters = () => {
    setSearch("");
    setContractorType("All contractor types");
    setPage(1);
  };

  /* -------------------------------------------------------
     SELECT BUSINESS
  ------------------------------------------------------- */

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

  /* -------------------------------------------------------
     FIND MATCHING VENDOR RECORD
  ------------------------------------------------------- */

  const findVendorRecord = (
    business: Business,
  ): VendorRecord | undefined => {
    return registeredVendors.find(
      (vendor) =>
        getVendorBusinessId(vendor) === business.id,
    );
  };

  /* -------------------------------------------------------
     UPDATE VENDOR STATUS

     Admin status is written to the shared collection.
     Registration payment status remains unchanged.
  ------------------------------------------------------- */

  const updateVendorStatus = (
    status: VendorStatus,
  ) => {
    if (!selectedBusiness) return;

    const matchingVendor = findVendorRecord(
      selectedBusiness,
    );

    if (!matchingVendor) {
      console.warn(
        "Vendor record could not be found in the shared collection.",
      );

      return;
    }

    const updatedVendors = registeredVendors.map(
      (vendor) => {
        const matches =
          getVendorBusinessId(vendor) ===
          selectedBusiness.id;

        if (!matches) return vendor;

        return {
          ...vendor,
          status,
          vendorStatus: status,
          adminStatusUpdatedAt:
            new Date().toISOString(),
        };
      },
    );

    writeStoredVendors(updatedVendors);

    setRegisteredVendors(updatedVendors);

    setSelectedBusiness((previous) =>
      previous
        ? {
            ...previous,
            vendorStatus: status,
          }
        : null,
    );
  };

  /* -------------------------------------------------------
     SAVE ADMIN REMARK
  ------------------------------------------------------- */

  const saveRemark = () => {
    if (
      !selectedBusiness ||
      !remarkInput.trim()
    ) {
      return;
    }

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
      console.error(
        "Unable to save admin remark:",
        error,
      );
    }

    setRemarkInput("");
  };

  /* -------------------------------------------------------
     STATUS CSS CLASS
  ------------------------------------------------------- */

  const statusClass = (
    status: VendorStatus,
  ) => {
    return status
      .toLowerCase()
      .replace(/\s+/g, "-");
  };

  /* -------------------------------------------------------
     VENDOR DETAIL CONTENT
  ------------------------------------------------------- */

  const renderVendorContent = (
    business: Business,
  ) => {
    switch (activeTab) {
      /* ================================================
         OVERVIEW
      ================================================ */

      case "Overview":
        return (
          <>
            <div className="vendor-metric-grid">
              <div className="vendor-metric">
                <span>Products</span>
                <strong>
                  {business.productCount}
                </strong>
              </div>

              <div className="vendor-metric">
                <span>Services</span>
                <strong>
                  {business.serviceCount}
                </strong>
              </div>

              <div className="vendor-metric">
                <span>Enquiries</span>
                <strong>
                  {business.enquiries}
                </strong>
              </div>

              <div className="vendor-metric">
                <span>Rating</span>
                <strong>
                  {business.rating}
                </strong>
              </div>
            </div>

            <div className="vendor-detail-grid">
              <DetailCard
                title="Business & Owner"
                icon={Building2}
              >
                <div className="vendor-detail-items">
                  <DetailItem
                    label="Business name"
                    value={business.name}
                  />

                  <DetailItem
                    label="Business type"
                    value={business.type}
                  />

                  <DetailItem
                    label="Owner name"
                    value={business.owner}
                  />

                  <DetailItem
                    label="Established"
                    value={business.established}
                  />

                  <DetailItem
                    label="Mobile number"
                    value={business.phone}
                  />

                  <DetailItem
                    label="Email address"
                    value={business.email}
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
                    label="State"
                    value={business.state}
                  />

                  <DetailItem
                    label="PIN code"
                    value={business.pincode}
                  />

                  <DetailItem
                    label="Service areas"
                    value={business.serviceAreas.join(", ")}
                  />
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
                    label="Services offered"
                    value={business.serviceCount}
                  />

                  <DetailItem
                    label="Product categories"
                    value={business.products.join(", ")}
                  />

                  <DetailItem
                    label="Service categories"
                    value={business.services.join(", ")}
                  />
                </div>
              </DetailCard>

              <DetailCard
                title="Business Operations"
                icon={Clock3}
              >
                <div className="vendor-detail-items">
                  <DetailItem
                    label="Working hours"
                    value={business.workingHours}
                  />

                  <DetailItem
                    label="Working days"
                    value={business.workingDays}
                  />

                  <DetailItem
                    label="Delivery"
                    value={business.delivery}
                  />

                  <DetailItem
                    label="Payment methods"
                    value={business.paymentMethods.join(", ")}
                  />
                </div>
              </DetailCard>
            </div>
          </>
        );

      /* ================================================
         BUSINESS
      ================================================ */

      case "Business":
        return (
          <div className="vendor-detail-grid">
            <DetailCard
              title="Business Information"
              icon={Building2}
            >
              <div className="vendor-detail-items">
                <DetailItem
                  label="Business name"
                  value={business.name}
                />

                <DetailItem
                  label="Business ID"
                  value={business.id}
                />

                <DetailItem
                  label="Business type"
                  value={business.type}
                />

                <DetailItem
                  label="Year established"
                  value={business.established}
                />

                <DetailItem
                  label="Business description"
                  value={business.description}
                />

                <DetailItem
                  label="Registration fee"
                  value={business.registrationStatus}
                />
              </div>
            </DetailCard>

            <DetailCard
              title="Owner & Contact Information"
              icon={UserRound}
            >
              <div className="vendor-detail-items">
                <DetailItem
                  label="Owner name"
                  value={business.owner}
                />

                <DetailItem
                  label="Primary mobile"
                  value={business.phone}
                />

                <DetailItem
                  label="Alternate mobile"
                />

                <DetailItem
                  label="WhatsApp number"
                  value={business.whatsapp}
                />

                <DetailItem
                  label="Email"
                  value={business.email}
                />

                <DetailItem
                  label="Website"
                />
              </div>
            </DetailCard>

            <DetailCard
              title="Address & Coverage"
              icon={MapPin}
            >
              <div className="vendor-detail-items">
                <DetailItem
                  label="Street address"
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
                  label="District"
                />

                <DetailItem
                  label="State"
                  value={business.state}
                />

                <DetailItem
                  label="PIN code"
                  value={business.pincode}
                />

                <DetailItem
                  label="Google Maps location"
                />

                <DetailItem
                  label="Service areas"
                  value={business.serviceAreas.join(", ")}
                />
              </div>
            </DetailCard>
          </div>
        );

      /* ================================================
         PRODUCTS & SERVICES
      ================================================ */

      case "Products & Services":
        return (
          <div className="vendor-detail-grid">
            <DetailCard
              title="Product Catalogue"
              icon={Package}
            >
              <div className="vendor-detail-items">
                <DetailItem
                  label="Total products"
                  value={business.productCount}
                />

                <DetailItem
                  label="Categories"
                  value={business.products.join(", ")}
                />

                <DetailItem
                  label="Brands / manufacturers"
                />

                <DetailItem
                  label="Price range"
                />

                <DetailItem
                  label="Stock availability"
                />

                <DetailItem
                  label="Warranty details"
                />

                <DetailItem
                  label="Delivery availability"
                  value={business.delivery}
                />

                <DetailItem
                  label="Product catalogue upload"
                />
              </div>
            </DetailCard>

            <DetailCard
              title="Service Catalogue"
              icon={Wrench}
            >
              <div className="vendor-detail-items">
                <DetailItem
                  label="Total services"
                  value={business.serviceCount}
                />

                <DetailItem
                  label="Service categories"
                  value={business.services.join(", ")}
                />

                <DetailItem
                  label="Service description"
                />

                <DetailItem
                  label="Service coverage"
                  value={business.serviceAreas.join(", ")}
                />

                <DetailItem
                  label="Service charges"
                />

                <DetailItem
                  label="Estimated completion time"
                />

                <DetailItem
                  label="Availability"
                />
              </div>
            </DetailCard>

            <DetailCard
              title="Pricing & Charges"
              icon={IndianRupee}
            >
              <div className="vendor-detail-items">
                <DetailItem
                  label="Minimum order value"
                />

                <DetailItem
                  label="Product price range"
                />

                <DetailItem
                  label="Labour charges"
                />

                <DetailItem
                  label="Visiting charges"
                />

                <DetailItem
                  label="Installation charges"
                />

                <DetailItem
                  label="Delivery charges"
                />

                <DetailItem
                  label="Discounts / offers"
                />

                <DetailItem
                  label="Platform commission"
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
                  label="Opening / closing hours"
                  value={business.workingHours}
                />

                <DetailItem
                  label="Weekly holidays"
                />

                <DetailItem
                  label="Order acceptance status"
                />

                <DetailItem
                  label="Customer support availability"
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
                  label="Pickup availability"
                />

                <DetailItem
                  label="Payment methods"
                  value={business.paymentMethods.join(", ")}
                />

                <DetailItem
                  label="Return policy"
                />

                <DetailItem
                  label="Replacement policy"
                />
              </div>
            </DetailCard>
          </div>
        );

      /* ================================================
         DOCUMENTS
      ================================================ */

      case "Documents":
        return (
          <div className="vendor-detail-grid">
            <DetailCard
              title="Business Documents"
              icon={FileCheck}
            >
              {[
                "PAN Card",
                "GST Certificate / GSTIN",
                "Business Registration",
                "Shop Establishment Certificate",
                "Trade Licence",
                "Other Applicable Licences",
              ].map((document) => (
                <div
                  className="vendor-document-row"
                  key={document}
                >
                  <div>
                    <FileText size={17} />
                    <span>{document}</span>
                  </div>

                  <span className="vendor-not-provided">
                    Not uploaded
                  </span>
                </div>
              ))}
            </DetailCard>

            <DetailCard
              title="Owner Identity & Bank Verification"
              icon={ShieldCheck}
            >
              <div className="vendor-detail-items">
                <DetailItem
                  label="Owner identity proof"
                />

                <DetailItem
                  label="Document submission date"
                />

                <DetailItem
                  label="Document verification"
                />

                <DetailItem
                  label="Verification remarks"
                />

                <DetailItem
                  label="Bank account holder"
                />

                <DetailItem
                  label="Bank name"
                />

                <DetailItem
                  label="Account number"
                />

                <DetailItem
                  label="IFSC code"
                />

                <DetailItem
                  label="UPI ID"
                />

                <DetailItem
                  label="Bank verification status"
                />
              </div>

              <p className="vendor-private-note">
                <ShieldCheck size={14} />

                Sensitive identity and banking information is
                restricted to authorized administrators.
              </p>
            </DetailCard>
          </div>
        );

      /* ================================================
         GALLERY
      ================================================ */

      case "Gallery":
        return (
          <DetailCard
            title="Business Gallery & Media"
            icon={Image}
          >
            <div className="vendor-gallery-empty">
              <Image size={30} />

              <strong>
                No gallery images available
              </strong>

              <span>
                Business logos, shop photos, product images,
                work samples and videos will appear here when
                uploaded by the vendor.
              </span>
            </div>
          </DetailCard>
        );

      /* ================================================
         PERFORMANCE
      ================================================ */

      case "Performance":
        return (
          <>
            <div className="vendor-metric-grid">
              {[
                ["Profile views", business.views],
                ["Customer enquiries", business.enquiries],
                ["Phone clicks", business.phoneClicks],
                ["Followers", business.followers],
              ].map(([label, value]) => (
                <div
                  className="vendor-metric"
                  key={String(label)}
                >
                  <span>{label}</span>
                  <strong>{value}</strong>
                </div>
              ))}
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

                  <DetailItem
                    label="Customer complaints"
                  />

                  <DetailItem
                    label="Vendor responses"
                  />

                  <DetailItem
                    label="Reported reviews"
                  />

                  <DetailItem
                    label="Moderation status"
                  />
                </div>
              </DetailCard>

              <DetailCard
                title="Listing Engagement"
                icon={Activity}
              >
                <div className="vendor-detail-items">
                  <DetailItem
                    label="Profile views"
                    value={business.views}
                  />

                  <DetailItem
                    label="Product views"
                  />

                  <DetailItem
                    label="Service views"
                  />

                  <DetailItem
                    label="Customer enquiries"
                    value={business.enquiries}
                  />

                  <DetailItem
                    label="Phone clicks"
                    value={business.phoneClicks}
                  />

                  <DetailItem
                    label="Followers"
                    value={business.followers}
                  />
                </div>
              </DetailCard>
            </div>
          </>
        );

      /* ================================================
         ACTIVITY
      ================================================ */

      case "Activity":
        return (
          <div className="vendor-detail-grid">
            <DetailCard
              title="Vendor Activity"
              icon={Activity}
            >
              <div className="vendor-detail-items">
                <DetailItem
                  label="Registration date"
                  value={business.registeredAt}
                />

                <DetailItem
                  label="Last profile update"
                />

                <DetailItem
                  label="Last login"
                />

                <DetailItem
                  label="Product changes"
                />

                <DetailItem
                  label="Service changes"
                />

                <DetailItem
                  label="Document submissions"
                />

                <DetailItem
                  label="Approval history"
                />

                <DetailItem
                  label="Suspension history"
                />
              </div>
            </DetailCard>

            <DetailCard
              title="Admin Remarks & History"
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
                Save Internal Remark
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
        );
    }
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="businesses-admin-page">
      <section className="businesses-page-header">
        <div>
          <div className="businesses-eyebrow">
            CORPORATE DIRECTORY · TAB 3
          </div>

          <h1>Find City Listings</h1>

          <p>
            Manage city listings and registered business
            information.
          </p>
        </div>
      </section>

      <section className="businesses-directory-card">
        {/* ================================================
            FILTER BAR
        ================================================ */}

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
                <option
                  key={type}
                  value={type}
                >
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

        {/* ================================================
            BUSINESS TABLE
        ================================================ */}

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
                      <strong>
                        {business.name}
                      </strong>

                      <span>
                        {business.id}
                      </span>
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
                      {business.contact}
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
                        onClick={() =>
                          openDetails(business)
                        }
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
                        Portfolio Links
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
                        Manage Subscription
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {/* ==========================================
                  EMPTY STATE
              ========================================== */}

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
                          ? "New vendor registrations will appear here automatically when they are added to the shared vendor collection."
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

        {/* ================================================
            TABLE FOOTER
        ================================================ */}

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
            of{" "}
            <strong>
              {filteredBusinesses.length}
            </strong>{" "}
            businesses
          </span>

          <div className="businesses-pagination">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() =>
                setPage((current) =>
                  Math.max(1, current - 1),
                )
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
                className={
                  page === pageNumber ? "active" : ""
                }
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

      {/* ===================================================
          COMPLETE VENDOR DETAILS MODAL
      =================================================== */}

      {selectedBusiness && !action && (
        <div
          className="business-modal-backdrop"
          onClick={closeModal}
        >
          <div
            className="vendor-details-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            {/* TOP BAR */}

            <div className="vendor-details-topbar">
              <div>
                <span>
                  CITY LISTINGS / VENDORS /{" "}
                  {selectedBusiness.id}
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
                <h2>
                  {selectedBusiness.name}
                </h2>

                <p>
                  {selectedBusiness.id} ·{" "}
                  {selectedBusiness.type}
                </p>

                <span>
                  <MapPin size={13} />

                  {selectedBusiness.locality ||
                    selectedBusiness.city}
                </span>

                <div className="vendor-profile-badges">
                  <span
                    className={`vendor-status-badge ${statusClass(
                      vendorStatuses[selectedBusiness.id] ??
                        selectedBusiness.vendorStatus,
                    )}`}
                  >
                    {vendorStatuses[selectedBusiness.id] ??
                      selectedBusiness.vendorStatus}
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

            {/* VENDOR TABS */}

            <div className="vendor-tabs">
              {vendorTabs.map(
                ({ label, icon: Icon }) => (
                  <button
                    type="button"
                    key={label}
                    className={
                      activeTab === label ? "active" : ""
                    }
                    onClick={() =>
                      setActiveTab(label)
                    }
                  >
                    <Icon size={15} />
                    {label}
                  </button>
                ),
              )}
            </div>

            {/* TAB CONTENT */}

            <div className="vendor-details-content">
              {renderVendorContent(selectedBusiness)}
            </div>

            {/* ADMIN MANAGEMENT */}

            <div className="vendor-admin-panel">
              <div className="vendor-admin-heading">
                <div>
                  <h3>Admin Management</h3>

                  <p>
                    Administrative controls for this vendor
                    listing.
                  </p>
                </div>

                <span
                  className={`vendor-status-badge ${statusClass(
                    vendorStatuses[selectedBusiness.id] ??
                      selectedBusiness.vendorStatus,
                  )}`}
                >
                  {vendorStatuses[selectedBusiness.id] ??
                    selectedBusiness.vendorStatus}
                </span>
              </div>

              <div className="vendor-admin-actions">
                {(vendorStatuses[selectedBusiness.id] ??
                  selectedBusiness.vendorStatus) !== "Approved" && (
                  <button
                    type="button"
                    className="vendor-admin-approve"
                    onClick={() =>
                      updateVendorStatus("Approved")
                    }
                  >
                    <CheckCircle2 size={15} />
                    Approve Vendor
                  </button>
                )}

                {(vendorStatuses[selectedBusiness.id] ??
                  selectedBusiness.vendorStatus) === "Pending" && (
                  <button
                    type="button"
                    className="vendor-admin-reject"
                    onClick={() =>
                      updateVendorStatus("Rejected")
                    }
                  >
                    <X size={15} />
                    Reject Application
                  </button>
                )}

                {(vendorStatuses[selectedBusiness.id] ??
                  selectedBusiness.vendorStatus) === "Approved" && (
                  <button
                    type="button"
                    className="vendor-admin-suspend"
                    onClick={() =>
                      updateVendorStatus("Suspended")
                    }
                  >
                    <PauseCircle size={15} />
                    Suspend Listing
                  </button>
                )}

                {(vendorStatuses[selectedBusiness.id] ??
                  selectedBusiness.vendorStatus) === "Suspended" && (
                  <button
                    type="button"
                    className="vendor-admin-approve"
                    onClick={() =>
                      updateVendorStatus("Approved")
                    }
                  >
                    <CheckCircle2 size={15} />
                    Reactivate Listing
                  </button>
                )}

                {(vendorStatuses[selectedBusiness.id] ??
                  selectedBusiness.vendorStatus) === "Rejected" && (
                  <button
                    type="button"
                    className="vendor-admin-approve"
                    onClick={() =>
                      updateVendorStatus("Pending")
                    }
                  >
                    <FileCheck size={15} />
                    Review Again
                  </button>
                )}
              </div>

              <p className="vendor-admin-disclaimer">
                <ShieldCheck size={14} />

                Vendor information is read-only. Admin actions
                update the shared vendor listing status.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================
          PORTFOLIO AND SUBSCRIPTION MODALS
      =================================================== */}

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

                <h2>
                  {selectedBusiness.name}
                </h2>

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

            <div className="business-modal-content">
              {action === "portfolio" ? (
                <>
                  <div className="business-modal-icon">
                    <ExternalLink size={22} />
                  </div>

                  <h3>Portfolio Links</h3>

                  <p>
                    Portfolio references submitted by{" "}
                    <strong>
                      {selectedBusiness.name}
                    </strong>{" "}
                    will be available here for administrative
                    review.
                  </p>

                  <div className="business-portfolio-placeholder">
                    <ExternalLink size={18} />

                    <span>
                      No portfolio links available in the
                      current record.
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div className="business-modal-icon">
                    <Wallet size={22} />
                  </div>

                  <h3>Manage Subscription</h3>

                  <p>
                    Review registration and listing
                    subscription details for{" "}
                    <strong>
                      {selectedBusiness.name}
                    </strong>.
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
