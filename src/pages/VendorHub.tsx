
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    ArrowDownRight,
    ArrowLeft,
    ArrowRight,
    BadgeCheck,
    Ban,
    Building2,
    // CalendarClock,
    Check,
    CheckCircle2,
    ChevronRight,
    CreditCard,
    Crown,
    Sparkles,
    Clock3,
    Eye,
    // FileText,
    Image as ImageIcon,
    Info,
    Mail,
    MapPin,
    MessageCircle,
    Send,
    ClipboardList,
    ListChecks,
    Package,
    Pencil,
    Phone,
    Plus,
    ShieldCheck,
    ShoppingBag,
    Star,
    Trash2,
    TrendingUp,
    Upload,
    // UserRound,
    X,
} from "lucide-react";
import "./VendorHub.css";

type TabId =
    | "overview"
    | "about"
    | "gallery"
    | "services"
    | "products"
    | "location"
    | "reviews"
    | "performance";

type BusinessDetails = {
    name: string;
    category: string;
    description: string;
    address: string;
    phone: string;
    email: string;
    website: string;
    rating: number;
    reviewCount: number;
    verified: boolean;
    open: boolean;
};

type OperatingHour = {
    id: string;
    day: string;
    hours: string;
};

type GalleryItem = {
    id: string;
    title: string;
    image: string;
    isLocal?: boolean;
};

type ServiceItem = {
    id: string;
    title: string;
    category: string;
    description: string;
};

type ProductItem = {
    id: string;
    name: string;
    category: string;
    price: string;
    stock: string;
    image: string;
    isLocal?: boolean;
};

type ServiceDraft = Omit<ServiceItem, "id">;
type ProductDraft = Omit<ProductItem, "id" | "isLocal">;


type StoredVendorProfile = {
    id?: string;
    vendorId?: string;
    role?: string;
    accountType?: string;

    fullName?: string;
    name?: string;
    mobile?: string;
    phone?: string;
    email?: string;

    businessName?: string;
    businessType?: string;
    businessCategory?: string;
    businessAddress?: string;
    city?: string;
    state?: string;
    pincode?: string;

    productDescription?: string;
    products?: ProductItem[] | string;

    // Application review status
    status?: string;
    vendorStatus?: string;
    listingStatus?: string;
    applicationStatus?: string;
    reviewStatus?: string;
    registrationStatus?: string;

    // Admin-controlled account access
    accountState?: string;
    accountStatus?: string;
    vendorAccountStatus?: string;

    // Rejection information
    rejectionReason?: string;

    // Suspension information
    suspensionReason?: string;
    suspensionUntil?: string;
    suspensionEndDate?: string;
    suspendedAt?: string;
    suspensionDuration?: string;
    suspendedReason?: string;
    suspendedUntil?: string;
    suspendedUntilDate?: string;
    reactivationDate?: string;
    banReason?: string;

    // Admin information
    adminRemarks?: string;
    adminStatusUpdatedAt?: string;

    registeredAt?: string;

    // Subscription information
    trialStartedAt?: string;
    trialEndsAt?: string;
    subscriptionPlan?: string;
    subscriptionStartedAt?: string;
    subscriptionEndsAt?: string;
    subscriptionStatus?: string;

    [key: string]: unknown;
};


type VendorAccessState = "approved" | "pending" | "rejected" | "suspended" | "banned";
type VendorPlanName = "Basic" | "Exclusive" | "Premium";

const VENDOR_TRIAL_DAYS = 30;
const VENDOR_PLANS: { name: VendorPlanName; displayName: string; price: number; description: string; features: string[] }[] = [
    { name: "Basic", displayName: "Lite / Basic", price: 199, description: "For individual vendors and local businesses.", features: ["0% commission on customer enquiries", "1 primary business category", "Direct customer Call and WhatsApp connection", "Business verification badge", "Up to 3 gallery photos", "1 local PIN code coverage"] },
    { name: "Exclusive", displayName: "Starter / Pro", price: 499, description: "For established vendors and growing local businesses.", features: ["0% commission on customer enquiries", "Up to 3 business categories", "Priority listing in search", "Up to 15 photos and video catalogue", "Customer enquiry alerts", "City-zone PIN code coverage"] },
    { name: "Premium", displayName: "Growth / Biz", price: 999, description: "For larger businesses and expanding service providers.", features: ["0% commission on customer enquiries", "Featured listing placement", "Multiple categories and locations", "Premium trusted business seal", "Promotional banner eligibility", "Priority support"] },
];

const ADMIN_VENDOR_FIELDS = [
    "status", "vendorStatus", "listingStatus", "applicationStatus", "reviewStatus", "registrationStatus",
    "accountState", "accountStatus", "vendorAccountStatus", "rejectionReason",
    "suspensionReason", "suspendedReason", "suspensionUntil", "suspensionEndDate", "suspendedUntil", "suspendedUntilDate", "reactivationDate", "suspendedAt", "suspensionDuration", "banReason",
    "adminRemarks", "adminStatusUpdatedAt",
] as const;

function normalizeVendorStatus(value: unknown): string {
    return typeof value === "string" ? value.trim().toLowerCase().replace(/[_-]+/g, " ") : "";
}

function getVendorAccessState(
    profile: StoredVendorProfile | null,
): VendorAccessState {
    if (!profile) return "pending";

    const normalize = (value: unknown) =>
        normalizeVendorStatus(value);

    // Only account-level restrictions can block dashboard access.
    // Listing approval is a separate, second review process.
    const restrictionStatuses = [
        profile.accountState,
        profile.accountStatus,
        profile.vendorAccountStatus,
    ].map(normalize);

    if (
        restrictionStatuses.some((status) =>
            ["banned", "ban", "permanently banned", "blocked permanently"].includes(status),
        )
    ) {
        return "banned";
    }

    if (
        restrictionStatuses.some((status) =>
            ["suspended", "temporarily suspended", "blocked", "disabled"].includes(status),
        )
    ) {
        return "suspended";
    }

    // First approval controls dashboard access. Never use listingStatus
    // to decide whether the vendor account itself is approved.
    const hasExplicitRegistrationStatus =
        typeof profile.registrationStatus === "string" &&
        profile.registrationStatus.trim() !== "";

    const registrationStatus = normalize(
        hasExplicitRegistrationStatus
            ? profile.registrationStatus
            : profile.listingStatus
                ? "pending"
                : profile.applicationStatus ||
                profile.reviewStatus ||
                profile.vendorStatus ||
                profile.status,
    );

    if (["approved", "verified", "active", "reactivated"].includes(registrationStatus)) {
        return "approved";
    }

    if (["rejected", "declined", "application rejected"].includes(registrationStatus)) {
        return "rejected";
    }

    return "pending";
}

function getVendorSuspensionReason(profile: StoredVendorProfile | null): string {
    if (!profile) return "No suspension details are available.";
    const reason = profile.suspensionReason || profile.suspendedReason || profile.banReason || profile.rejectionReason || profile.adminRemarks;
    return typeof reason === "string" && reason.trim() ? reason.trim() : "The Admin team has restricted access to this vendor account. Please contact support for more information.";
}

function getVendorSuspensionEnd(profile: StoredVendorProfile | null): string {
    if (!profile) return "";
    const value = profile.suspensionUntil || profile.suspensionEndDate || profile.suspendedUntil || profile.suspendedUntilDate || profile.reactivationDate;
    return typeof value === "string" ? value : "";
}

function formatVendorDate(value: string): string {
    if (!value) return "Not specified";
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}

function mergeAdminVendorFields(local: StoredVendorProfile, admin: StoredVendorProfile): StoredVendorProfile {
    const merged = { ...local } as StoredVendorProfile;
    ADMIN_VENDOR_FIELDS.forEach((key) => {
        if (Object.prototype.hasOwnProperty.call(admin, key)) merged[key] = admin[key];
    });
    return merged;
}

function getVendorSubscriptionStatus(profile: StoredVendorProfile | null, now: number): "Not Started" | "Free Trial" | "Trial Expired" | "Active" | "Expired" {
    if (!profile) return "Not Started";
    if (profile.subscriptionStartedAt && profile.subscriptionEndsAt) return new Date(profile.subscriptionEndsAt).getTime() > now ? "Active" : "Expired";
    if (!profile.trialStartedAt || !profile.trialEndsAt) return "Not Started";
    return new Date(profile.trialEndsAt).getTime() > now ? "Free Trial" : "Trial Expired";
}

function getVendorTrialRemaining(endDate: string | undefined, now: number) {
    if (!endDate) return null;
    const diff = new Date(endDate).getTime() - now;
    if (!Number.isFinite(diff) || diff <= 0) return { days: 0, hours: 0, minutes: 0 };
    const minutes = Math.floor(diff / 60000);
    return { days: Math.floor(minutes / 1440), hours: Math.floor((minutes % 1440) / 60), minutes: minutes % 60 };
}

function readStoredVendorProfile(): StoredVendorProfile | null {
    try {
        const raw =
            localStorage.getItem("oneservice_vendor") ??
            localStorage.getItem("oneservice_user");

        if (!raw) return null;

        const parsed: unknown = JSON.parse(raw);

        if (
            !parsed ||
            typeof parsed !== "object" ||
            Array.isArray(parsed)
        ) {
            return null;
        }

        const profile = parsed as StoredVendorProfile;

        return profile.role === "vendor" ? profile : null;
    } catch {
        return null;
    }
}



function businessFromVendorProfile(
    profile: StoredVendorProfile | null,
): BusinessDetails {
    if (!profile) return initialBusiness;

    const location = [
        profile.businessAddress,
        profile.city,
        profile.state,
        profile.pincode,
    ]
        .map((part) =>
            typeof part === "string" ? part.trim() : "",
        )
        .filter(Boolean)
        .join(", ");

    const status = String(
        profile.listingStatus ??
        profile.vendorStatus ??
        profile.status ??
        "",
    ).toLowerCase().trim();

    return {
        ...initialBusiness,
        name:
            profile.businessName?.trim() ||
            profile.name?.trim() ||
            profile.fullName?.trim() ||
            initialBusiness.name,
        category:
            profile.businessCategory?.trim() ||
            profile.businessType?.trim() ||
            initialBusiness.category,
        description:
            profile.productDescription?.trim() ||
            (typeof profile.products === "string"
                ? profile.products.trim()
                : "") ||
            initialBusiness.description,
        address: location || initialBusiness.address,
        phone:
            profile.mobile?.trim() ||
            profile.phone?.trim() ||
            "",
        email: profile.email?.trim() || "",
        verified:
            status === "verified" ||
            status === "approved",
    };
}

/* =========================================================
   SHARED VENDOR COLLECTION
   Synchronizes VendorHub with City Listings Admin.
========================================================= */

const saveVendorToSharedCollection = (
    vendor: StoredVendorProfile,
    forceListingStatus = false,
) => {
    const storageKey = "oneservice_vendors";

    try {
        const parsed: unknown = JSON.parse(
            localStorage.getItem(storageKey) || "[]",
        );

        const existing: StoredVendorProfile[] =
            Array.isArray(parsed)
                ? parsed.filter(
                    (item): item is StoredVendorProfile =>
                        item !== null &&
                        typeof item === "object" &&
                        !Array.isArray(item),
                )
                : [];

        const identity = String(
            vendor.vendorId ||
            vendor.id ||
            vendor.mobile ||
            vendor.phone ||
            vendor.email ||
            "",
        )
            .trim()
            .toLowerCase();

        if (!identity) {
            console.warn(
                "Vendor synchronization skipped: no vendor ID, mobile number, or email found.",
            );
            return;
        }

        const index = existing.findIndex((item) => {
            const existingIdentity = String(
                item.vendorId ||
                item.id ||
                item.mobile ||
                item.phone ||
                item.email ||
                "",
            )
                .trim()
                .toLowerCase();

            return (
                existingIdentity !== "" &&
                existingIdentity === identity
            );
        });

        if (index >= 0) {
            const existingVendor = existing[index];

            // Admin-managed status takes priority over the
            // possibly outdated VendorHub profile.
            const adminStatus = forceListingStatus
                ? vendor.listingStatus || "Pending"
                : existingVendor.listingStatus ||
                existingVendor.vendorStatus ||
                existingVendor.status ||
                vendor.listingStatus ||
                vendor.vendorStatus ||
                vendor.status ||
                "Pending";


            existing[index] = {
                ...existingVendor,
                ...vendor,
                // Preserve Admin-controlled registration approval.
                registrationStatus:
                    existingVendor.registrationStatus ||
                    vendor.registrationStatus ||
                    "Pending",

                registrationStatusUpdatedAt:
                    existingVendor.registrationStatusUpdatedAt ||
                    vendor.registrationStatusUpdatedAt,

                // Admin approval and account restrictions always win.
                listingStatus: adminStatus,
                vendorStatus: adminStatus,
                status: adminStatus,

                accountState: existingVendor.accountState,
                accountStatus: existingVendor.accountStatus,
                vendorAccountStatus: existingVendor.vendorAccountStatus,

                applicationStatus:
                    existingVendor.applicationStatus || vendor.applicationStatus,

                rejectionReason: existingVendor.rejectionReason,

                suspensionReason: existingVendor.suspensionReason,
                suspensionUntil: existingVendor.suspensionUntil,
                suspensionEndDate: existingVendor.suspensionEndDate,
                suspendedAt: existingVendor.suspendedAt,
                suspensionDuration: existingVendor.suspensionDuration,
                reactivationDate: existingVendor.reactivationDate,
                suspensionCount: existingVendor.suspensionCount,
                suspensionHistory: existingVendor.suspensionHistory,

                banned: existingVendor.banned,
                bannedAt: existingVendor.bannedAt,
                banReason: existingVendor.banReason,

                adminRemarks: existingVendor.adminRemarks,
                adminStatusUpdatedAt: existingVendor.adminStatusUpdatedAt,
            };

        } else {
            const initialStatus =
                vendor.listingStatus ||
                vendor.vendorStatus ||
                vendor.status ||
                "Pending";

            existing.push({
                ...vendor,
                listingStatus: initialStatus,
                vendorStatus: initialStatus,
                status: initialStatus,
            });
        }

        localStorage.setItem(
            storageKey,
            JSON.stringify(existing),
        );

        window.dispatchEvent(
            new CustomEvent("oneservice-vendors-change"),
        );
    } catch (error) {
        console.error(
            "Unable to synchronize vendor with shared collection:",
            error,
        );
    }
};

const initialBusiness: BusinessDetails = {
    name: "Your Business Name",
    category: "Business & Professional Services",
    description:
        "Tell customers about your business, what makes you different, and how your products or services can help them.",
    address: "",
    phone: "",
    email: "",
    website: "",
    rating: 0,
    reviewCount: 0,
    verified: false,
    open: true,
};

const tabItems: {
    id: TabId;
    label: string;
    icon: typeof Building2;
}[] = [
        { id: "overview", label: "Overview", icon: Building2 },
        { id: "about", label: "About", icon: Info },
        { id: "gallery", label: "Media & Gallery", icon: ImageIcon },
        { id: "services", label: "Services Offered", icon: ShieldCheck },
        { id: "products", label: "Products / Catalogue", icon: Package },
        { id: "location", label: "Location & Map", icon: MapPin },
        { id: "reviews", label: "Customer Reviews", icon: MessageCircle },
        { id: "performance", label: "Performance", icon: TrendingUp },
    ];

const createId = (prefix: string) =>
    `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

function formatInitials(name: string) {
    return (
        name
            .trim()
            .split(/\s+/)
            .slice(0, 2)
            .map((part) => part[0]?.toUpperCase() ?? "")
            .join("") || "VB"
    );
}

function VendorHub() {
    const navigate = useNavigate();

    const galleryInputRef = useRef<HTMLInputElement>(null);
    const productInputRef = useRef<HTMLInputElement>(null);
    const productEditImageRef = useRef<HTMLInputElement>(null);

    const [activeTab, setActiveTab] = useState<TabId>("overview");

    const [vendorProfile, setVendorProfile] =
        useState<StoredVendorProfile | null>(
            () => readStoredVendorProfile(),
        );

    const [business, setBusiness] = useState<BusinessDetails>(() =>
        businessFromVendorProfile(readStoredVendorProfile()),
    );

    const [hours, setHours] = useState<OperatingHour[]>(() => {
        const profile = readStoredVendorProfile();
        const saved = Array.isArray(profile?.operatingHours) ? profile.operatingHours as OperatingHour[] : [];
        return saved.filter(item => !["hours-mon-fri", "hours-saturday", "hours-sunday"].includes(item.id));
    });

    const [highlights, setHighlights] = useState<string[]>(() => {
        const profile = readStoredVendorProfile();
        const saved = Array.isArray(profile?.highlights) ? profile.highlights : Array.isArray(profile?.amenities) ? profile.amenities : [];
        const demoValues = ["Customer support", "Appointment assistance", "Quality assurance", "Professional service"];
        return saved.filter((item): item is string => typeof item === "string" && !demoValues.includes(item));
    });

    const [gallery, setGallery] = useState<GalleryItem[]>(() => {
        const profile = readStoredVendorProfile();
        const saved = Array.isArray(profile?.gallery) ? profile.gallery : Array.isArray(profile?.images) ? profile.images : [];
        return saved.flatMap((raw, index) => {
            if (!raw || typeof raw !== "object") return [];
            const item = raw as Record<string, unknown>;
            const id = typeof item.id === "string" ? item.id : `gallery-saved-${index}`;
            const title = typeof item.title === "string" ? item.title : typeof item.name === "string" ? item.name : "Business image";
            const image = typeof item.image === "string" ? item.image : typeof item.url === "string" ? item.url : "";
            if (!image || ["gallery-1", "gallery-2", "gallery-3", "gallery-4"].includes(id) || ["Business showcase", "Workspace", "Products and services", "Customer experience"].includes(title)) return [];
            return [{ id, title, image }];
        });
    });

    const [services, setServices] = useState<ServiceItem[]>(() => {
        const profile = readStoredVendorProfile();
        const saved = Array.isArray(profile?.services) ? profile.services : [];
        return saved.filter((item): item is ServiceItem => Boolean(item && typeof item === "object" && !["service-1", "service-2", "service-3"].includes(String((item as ServiceItem).id)) && !["Primary Service", "Additional Service", "Consultation"].includes(String((item as ServiceItem).title))));
    });

    const [products, setProducts] = useState<ProductItem[]>(() => {
        const profile = readStoredVendorProfile();
        const saved = Array.isArray(profile?.products) ? profile.products : [];
        return saved.filter((item): item is ProductItem => Boolean(item && typeof item === "object" && !["product-1", "product-2", "product-3"].includes(String((item as ProductItem).id)) && !["Featured Product", "Business Essential", "Premium Selection"].includes(String((item as ProductItem).name))));
    });

    const [search, setSearch] = useState("");
    const [notice, setNotice] = useState("");

    const [selectedGalleryId, setSelectedGalleryId] =
        useState<string | null>(null);

    const [galleryDeleteId, setGalleryDeleteId] =
        useState<string | null>(null);

    const [serviceModalOpen, setServiceModalOpen] =
        useState(false);

    const [editingServiceId, setEditingServiceId] =
        useState<string | null>(null);

    const [serviceDraft, setServiceDraft] =
        useState<ServiceDraft>({
            title: "",
            category: "",
            description: "",
        });

    const [serviceDeleteId, setServiceDeleteId] =
        useState<string | null>(null);

    const [productModalOpen, setProductModalOpen] =
        useState(false);

    const [editingProductId, setEditingProductId] =
        useState<string | null>(null);

    const [productDraft, setProductDraft] =
        useState<ProductDraft>({
            name: "",
            category: "",
            price: "",
            stock: "In stock",
            image: "",
        });

    const [productDeleteId, setProductDeleteId] =
        useState<string | null>(null);

    const [deleteModalOpen, setDeleteModalOpen] =
        useState(false);

    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState("");

    const localObjectUrls = useRef<Set<string>>(new Set());
    const [subscriptionClock, setSubscriptionClock] = useState(Date.now());
    const [selectedVendorPlan, setSelectedVendorPlan] = useState<VendorPlanName>("Exclusive");
    const [viewingVendorPlan, setViewingVendorPlan] = useState<VendorPlanName | null>(null);
    const [vendorSubscriptionMessage, setVendorSubscriptionMessage] = useState("");
    const [showListingPreview, setShowListingPreview] = useState(false);
    const [supportOpen, setSupportOpen] = useState(false);
    const [supportDraft, setSupportDraft] = useState("");
    const [supportMessages, setSupportMessages] = useState<Array<{ id: string; sender: "vendor" | "admin"; text: string; createdAt: string }>>([]);

    const vendorAccessState = getVendorAccessState(vendorProfile);
    const vendorSubscriptionStatus = getVendorSubscriptionStatus(vendorProfile, subscriptionClock);
    const vendorTrialRemaining = getVendorTrialRemaining(vendorProfile?.trialEndsAt, subscriptionClock);
    const viewingVendorPlanDetails = VENDOR_PLANS.find(plan => plan.name === viewingVendorPlan) || null;

    const publishVendorListing = () => {
        if (profileCompletionPercentage < 100) {
            showNotice(
                `Complete your profile first. ${completedProfileFields} of ${profileCompletionItems.length} fields are complete.`
            );
            goToTab("about");
            return;
        }

        if (!vendorProfile) return;

        const submittedAt = new Date().toISOString();

        // This is the second approval: submitting does not make the
        // listing public. Admin must approve listingStatus separately.
        const updatedProfile = {
            ...vendorProfile,
            isPublished: false,
            publicationStatus: "Pending Review",
            listingStatus: "Pending",
            listingSubmittedAt: submittedAt,
            listingStatusUpdatedAt: submittedAt,
            vendorStatus: "Pending",
            status: "Pending",
        };

        try {
            localStorage.setItem(
                "oneservice_vendor",
                JSON.stringify(updatedProfile)
            );

            const userRaw = localStorage.getItem("oneservice_user");

            if (userRaw) {
                const user = JSON.parse(userRaw);

                if (user?.role === "vendor") {
                    localStorage.setItem(
                        "oneservice_user",
                        JSON.stringify({
                            ...user,
                            ...updatedProfile,
                        })
                    );
                }
            }

            saveVendorToSharedCollection(updatedProfile, true);

            setVendorProfile(updatedProfile);

            window.dispatchEvent(
                new Event("oneservice-vendor-change")
            );

            window.dispatchEvent(
                new Event("oneservice-vendors-change")
            );

            showNotice("Your listing has been submitted for Admin approval. It will become public only after approval.");
        } catch (error) {
            console.error("Unable to publish vendor listing:", error);
            showNotice("Unable to publish your listing. Please try again.");
        }
    };

    useEffect(() => {
        const timer = window.setInterval(() => setSubscriptionClock(Date.now()), 60000);
        return () => window.clearInterval(timer);
    }, []);

    const supportStorageKey = `oneservice_vendor_support_${vendorProfile?.id || vendorProfile?.vendorId || "current"}`;

    useEffect(() => {
        try {
            const stored = localStorage.getItem(supportStorageKey);
            setSupportMessages(stored ? JSON.parse(stored) : []);
        } catch {
            setSupportMessages([]);
        }
    }, [supportStorageKey]);

    useEffect(() => {
        const syncSupportMessages = (event: StorageEvent) => {
            if (event.key !== supportStorageKey) return;
            try {
                setSupportMessages(event.newValue ? JSON.parse(event.newValue) : []);
            } catch {
                setSupportMessages([]);
            }
        };
        window.addEventListener("storage", syncSupportMessages);
        return () => window.removeEventListener("storage", syncSupportMessages);
    }, [supportStorageKey]);

    const sendSupportMessage = () => {
        const text = supportDraft.trim();
        if (!text) return;
        const next = [...supportMessages, {
            id: `vendor-${Date.now()}`,
            sender: "vendor" as const,
            text,
            createdAt: new Date().toISOString(),
        }];
        setSupportMessages(next);
        setSupportDraft("");
        try {
            localStorage.setItem(supportStorageKey, JSON.stringify(next));
            window.dispatchEvent(new Event("oneservice-vendor-support-change"));
        } catch (error) {
            console.error("Unable to save support message", error);
            showNotice("Your message could not be saved. Please try again.");
        }
    };

    useEffect(() => {
        if (!vendorProfile || vendorAccessState !== "approved" || vendorProfile.trialStartedAt || vendorProfile.subscriptionStartedAt) return;
        const startedAt = new Date().toISOString();
        const end = new Date(startedAt);
        end.setDate(end.getDate() + VENDOR_TRIAL_DAYS);
        const updated = { ...vendorProfile, trialStartedAt: startedAt, trialEndsAt: end.toISOString(), subscriptionStatus: "Free Trial" };
        setVendorProfile(updated);
        try {
            localStorage.setItem("oneservice_vendor", JSON.stringify(updated));
            const userRaw = localStorage.getItem("oneservice_user");
            if (userRaw) { const user = JSON.parse(userRaw); if (user?.role === "vendor") localStorage.setItem("oneservice_user", JSON.stringify({ ...user, ...updated })); }
            saveVendorToSharedCollection(updated);
        } catch (error) { console.error("Unable to start vendor trial:", error); }
    }, [vendorProfile, vendorAccessState]);

    useEffect(() => {
        return () => {
            localObjectUrls.current.forEach((url) =>
                URL.revokeObjectURL(url),
            );

            localObjectUrls.current.clear();
        };
    }, []);

    // Keep VendorHub synchronized with the Admin vendor collection.
    useEffect(() => {
        const refreshVendorProfile = () => {
            const profile = readStoredVendorProfile();



            if (!profile) {
                setVendorProfile(null);
                return;
            }

            let sharedVendor: StoredVendorProfile | null = null;

            try {
                const parsed: unknown = JSON.parse(
                    localStorage.getItem("oneservice_vendors") || "[]",
                );

                if (Array.isArray(parsed)) {
                    const getIdentity = (vendor: StoredVendorProfile) =>
                        String(
                            vendor.vendorId ||
                            vendor.id ||
                            vendor.mobile ||
                            vendor.phone ||
                            vendor.email ||
                            "",
                        )
                            .trim()
                            .toLowerCase();

                    const profileIdentity = getIdentity(profile);

                    sharedVendor =
                        parsed.find((item): item is StoredVendorProfile => {
                            if (
                                !item ||
                                typeof item !== "object" ||
                                Array.isArray(item)
                            ) {
                                return false;
                            }

                            return (
                                getIdentity(item as StoredVendorProfile) ===
                                profileIdentity
                            );
                        }) || null;
                }
            } catch (error) {
                console.error(
                    "Unable to read shared vendor status:",
                    error,
                );
            }

            if (!sharedVendor) return;

            const adminStatus = sharedVendor.listingStatus || sharedVendor.vendorStatus || sharedVendor.status || "Pending";
            const updatedProfile: StoredVendorProfile = {
                ...mergeAdminVendorFields(profile, sharedVendor),
                listingStatus: adminStatus,
                vendorStatus: adminStatus,
                status: adminStatus,
            };
            if (JSON.stringify(updatedProfile) === JSON.stringify(profile)) return;
            try {
                localStorage.setItem("oneservice_vendor", JSON.stringify(updatedProfile));
                const userRaw = localStorage.getItem("oneservice_user");
                if (userRaw) { const user = JSON.parse(userRaw); if (user?.role === "vendor") localStorage.setItem("oneservice_user", JSON.stringify({ ...user, ...updatedProfile })); }
            } catch (error) { console.error("Unable to persist Admin vendor status:", error); }

            setVendorProfile(updatedProfile);

            setBusiness((previous) => {
                const normalizedStatus = String(adminStatus)
                    .toLowerCase()
                    .trim();

                const verified =
                    normalizedStatus === "approved" ||
                    normalizedStatus === "verified";

                if (previous.verified === verified) {
                    return previous;
                }

                return {
                    ...previous,
                    verified,
                };
            });
        };

        window.addEventListener(
            "oneservice-auth-change",
            refreshVendorProfile,
        );

        window.addEventListener(
            "oneservice-vendor-change",
            refreshVendorProfile,
        );

        window.addEventListener(
            "oneservice-vendors-change",
            refreshVendorProfile,
        );

        window.addEventListener("storage", refreshVendorProfile);

        return () => {
            window.removeEventListener(
                "oneservice-auth-change",
                refreshVendorProfile,
            );

            window.removeEventListener(
                "oneservice-vendor-change",
                refreshVendorProfile,
            );

            window.removeEventListener(
                "oneservice-vendors-change",
                refreshVendorProfile,
            );

            window.removeEventListener(
                "storage",
                refreshVendorProfile,
            );
        };
    }, []);

    /* =====================================================
       SAVE VENDOR PROFILE + SHARED ADMIN COLLECTION
    ===================================================== */


    useEffect(() => {
        if (!vendorProfile || vendorProfile.role !== "vendor") {
            return;
        }

        try {
            const workingHoursText = hours
                .filter((item) => item.day.trim() || item.hours.trim())
                .map((item) => `${item.day}: ${item.hours}`)
                .join(" | ");

            const workingDaysText = hours
                .filter((item) => item.day.trim())
                .map((item) => item.day)
                .join(", ");

            const savedGallery = gallery.map((item) => ({
                id: item.id,
                title: item.title,
                name: item.title,
                image: item.image,
                url: item.image,
            }));

            const savedProducts = products.map((item) => ({
                ...item,
                isLocal: undefined,
            }));

            const savedServices = services.map((item) => ({
                ...item,
            }));

            const updatedProfile: StoredVendorProfile = {
                ...vendorProfile,

                // Business profile
                businessName: business.name,
                name:
                    vendorProfile.name ||
                    vendorProfile.fullName ||
                    business.name,
                businessType: business.category,
                businessCategory: business.category,
                productDescription: business.description,
                businessDescription: business.description,
                description: business.description,
                businessAddress: business.address,
                mobile: business.phone,
                phone: business.phone,
                email: business.email,
                website: business.website,

                // Products and services
                products: savedProducts,
                services: savedServices,
                productCount: savedProducts.length,
                serviceCount: savedServices.length,

                // Gallery
                gallery: savedGallery,
                images: savedGallery,

                // Operating information
                operatingHours: hours,
                workingHours: workingHoursText,
                businessHours: workingHoursText,
                workingDays: workingDaysText,

                // Business highlights
                highlights: highlights.filter((item) => item.trim()),
                amenities: highlights.filter((item) => item.trim()),

                // Preserve Admin-controlled status
                listingStatus:
                    vendorProfile.listingStatus ||
                    vendorProfile.vendorStatus ||
                    vendorProfile.status ||
                    "Pending",
                vendorStatus:
                    vendorProfile.listingStatus ||
                    vendorProfile.vendorStatus ||
                    vendorProfile.status ||
                    "Pending",
                status:
                    vendorProfile.listingStatus ||
                    vendorProfile.vendorStatus ||
                    vendorProfile.status ||
                    "Pending",
                adminStatusUpdatedAt:
                    vendorProfile.adminStatusUpdatedAt,
            };

            // 1. Save the vendor's own profile.
            localStorage.setItem(
                "oneservice_vendor",
                JSON.stringify(updatedProfile),
            );

            // 2. Synchronize the logged-in vendor profile.
            const currentUserRaw =
                localStorage.getItem("oneservice_user");

            if (currentUserRaw) {
                try {
                    const currentUser = JSON.parse(currentUserRaw);

                    if (currentUser?.role === "vendor") {
                        localStorage.setItem(
                            "oneservice_user",
                            JSON.stringify({
                                ...currentUser,
                                ...updatedProfile,
                            }),
                        );
                    }
                } catch (error) {
                    console.error(
                        "Unable to synchronize vendor user profile:",
                        error,
                    );
                }
            }

            // 3. Synchronize the complete profile with City Listings Admin.
            saveVendorToSharedCollection({
                ...updatedProfile,

                vendorId:
                    updatedProfile.vendorId ||
                    updatedProfile.id ||
                    updatedProfile.mobile ||
                    updatedProfile.email,

                id:
                    updatedProfile.id ||
                    updatedProfile.vendorId ||
                    updatedProfile.mobile ||
                    updatedProfile.email,

                fullName:
                    updatedProfile.fullName ||
                    updatedProfile.name ||
                    business.name,

                businessName: business.name,
                businessType: business.category,
                businessCategory: business.category,
                businessAddress: business.address,
                phone: business.phone,
                mobile: business.phone,
                email: business.email,
                productDescription: business.description,
            });

            // 4. Notify Admin and other connected screens.
            window.dispatchEvent(
                new CustomEvent("oneservice-vendor-change"),
            );

            window.dispatchEvent(
                new CustomEvent("oneservice-vendors-change"),
            );
        } catch (error) {
            console.error(
                "Unable to save complete vendor profile:",
                error,
            );
        }
    }, [
        business,
        vendorProfile,
        hours,
        highlights,
        gallery,
        services,
        products,
    ]);


    const visibleProducts = useMemo(() => {
        const term = search.trim().toLowerCase();

        if (!term) return products;

        return products.filter(
            (product) =>
                product.name.toLowerCase().includes(term) ||
                product.category.toLowerCase().includes(term) ||
                product.stock.toLowerCase().includes(term),
        );
    }, [products, search]);

    const visibleServices = useMemo(() => {
        const term = search.trim().toLowerCase();

        if (!term) return services;

        return services.filter(
            (service) =>
                service.title.toLowerCase().includes(term) ||
                service.category.toLowerCase().includes(term) ||
                service.description.toLowerCase().includes(term),
        );
    }, [services, search]);

    const showNotice = (message: string) => setNotice(message);

    const goToTab = (tab: TabId) => {
        setActiveTab(tab);
        setNotice("");
    };

    const updateBusiness = <K extends keyof BusinessDetails>(
        field: K,
        value: BusinessDetails[K],
    ) => {
        setBusiness((previous) => ({
            ...previous,
            [field]: value,
        }));
    };

    const updateHour = (
        id: string,
        field: keyof OperatingHour,
        value: string,
    ) => {
        setHours((previous) =>
            previous.map((item) =>
                item.id === id
                    ? { ...item, [field]: value }
                    : item,
            ),
        );
    };

    const updateHighlight = (index: number, value: string) => {
        setHighlights((previous) =>
            previous.map((item, itemIndex) =>
                itemIndex === index ? value : item,
            ),
        );
    };

    const handleEditBusiness = () => goToTab("about");

    const createObjectUrl = (file: File) => {
        const url = URL.createObjectURL(file);
        localObjectUrls.current.add(url);
        return url;
    };

    const releaseObjectUrl = (url: string) => {
        if (localObjectUrls.current.has(url)) {
            URL.revokeObjectURL(url);
            localObjectUrls.current.delete(url);
        }
    };

    const handleGalleryUpload = (files: FileList | null) => {
        if (!files?.length) return;

        const validFiles = Array.from(files).filter((file) =>
            file.type.startsWith("image/"),
        );

        if (!validFiles.length) {
            showNotice("Please select one or more image files.");
            return;
        }

        const uploadedItems = validFiles.map((file) => ({
            id: createId("gallery"),
            title:
                file.name.replace(/\.[^/.]+$/, "") ||
                "Business image",
            image: createObjectUrl(file),
            isLocal: true,
        }));

        setGallery((previous) => [
            ...uploadedItems,
            ...previous,
        ]);

        setSelectedGalleryId(uploadedItems[0].id);

        showNotice(
            `${uploadedItems.length} image${uploadedItems.length === 1 ? "" : "s"} added to your gallery preview.`,
        );
    };

    const confirmGalleryDelete = () => {
        if (!galleryDeleteId) return;

        const item = gallery.find(
            (entry) => entry.id === galleryDeleteId,
        );

        if (item?.isLocal) {
            releaseObjectUrl(item.image);
        }

        setGallery((previous) =>
            previous.filter(
                (entry) => entry.id !== galleryDeleteId,
            ),
        );

        if (selectedGalleryId === galleryDeleteId) {
            setSelectedGalleryId(null);
        }

        setGalleryDeleteId(null);

        showNotice("Gallery image removed from the preview.");
    };

    const openAddService = () => {
        setEditingServiceId(null);

        setServiceDraft({
            title: "",
            category: "",
            description: "",
        });

        setServiceModalOpen(true);
    };

    const openEditService = (service: ServiceItem) => {
        setEditingServiceId(service.id);

        setServiceDraft({
            title: service.title,
            category: service.category,
            description: service.description,
        });

        setServiceModalOpen(true);
    };

    const saveService = () => {
        const title = serviceDraft.title.trim();

        if (!title) {
            showNotice("Enter a service name before saving.");
            return;
        }

        if (editingServiceId) {
            setServices((previous) =>
                previous.map((service) =>
                    service.id === editingServiceId
                        ? {
                            ...service,
                            ...serviceDraft,
                            title,
                            category:
                                serviceDraft.category.trim() ||
                                "General service",
                            description:
                                serviceDraft.description.trim(),
                        }
                        : service,
                ),
            );

            showNotice(
                "Service updated in the dashboard preview.",
            );
        } else {
            setServices((previous) => [
                ...previous,
                {
                    id: createId("service"),
                    title,
                    category:
                        serviceDraft.category.trim() ||
                        "General service",
                    description:
                        serviceDraft.description.trim(),
                },
            ]);

            showNotice(
                "Service added to the dashboard preview.",
            );
        }

        setServiceModalOpen(false);
        setEditingServiceId(null);
    };

    const confirmServiceDelete = () => {
        if (!serviceDeleteId) return;

        setServices((previous) =>
            previous.filter(
                (service) => service.id !== serviceDeleteId,
            ),
        );

        setServiceDeleteId(null);

        showNotice("Service removed from the dashboard preview.");
    };

    const openAddProduct = () => {
        setEditingProductId(null);

        setProductDraft({
            name: "",
            category: "",
            price: "",
            stock: "In stock",
            image: "",
        });

        setProductModalOpen(true);
    };

    const openEditProduct = (product: ProductItem) => {
        setEditingProductId(product.id);

        setProductDraft({
            name: product.name,
            category: product.category,
            price: product.price.replace(/^₹\s?/, ""),
            stock: product.stock,
            image: product.image,
        });

        setProductModalOpen(true);
    };

    const chooseProductImage = (file: File | undefined) => {
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            showNotice("Please choose a valid image file.");
            return;
        }

        setProductDraft((previous) => ({
            ...previous,
            image: createObjectUrl(file),
        }));
    };

    const saveProduct = () => {
        const name = productDraft.name.trim();
        const price = productDraft.price.trim();

        if (!name) {
            showNotice("Enter a product name before saving.");
            return;
        }

        if (
            !price ||
            !Number.isFinite(Number(price)) ||
            Number(price) < 0
        ) {
            showNotice("Enter a valid product price.");
            return;
        }

        const existingProduct = products.find(
            (product) => product.id === editingProductId,
        );

        if (
            editingProductId &&
            existingProduct?.isLocal &&
            existingProduct.image !== productDraft.image
        ) {
            releaseObjectUrl(existingProduct.image);
        }

        const updatedProduct: ProductItem = {
            id: editingProductId || createId("product"),
            name,
            category:
                productDraft.category.trim() || "General",
            price: Number(price).toString(),
            stock: productDraft.stock,
            image:
                productDraft.image ||
                "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=80",
            isLocal: productDraft.image.startsWith("blob:"),
        };

        if (editingProductId) {
            setProducts((previous) =>
                previous.map((product) =>
                    product.id === editingProductId
                        ? updatedProduct
                        : product,
                ),
            );

            showNotice(
                "Product updated in the dashboard preview.",
            );
        } else {
            setProducts((previous) => [
                ...previous,
                updatedProduct,
            ]);

            showNotice(
                "Product added to the dashboard preview.",
            );
        }

        setProductModalOpen(false);
        setEditingProductId(null);
    };

    const confirmProductDelete = () => {
        if (!productDeleteId) return;

        const product = products.find(
            (item) => item.id === productDeleteId,
        );

        if (product?.isLocal) {
            releaseObjectUrl(product.image);
        }

        setProducts((previous) =>
            previous.filter(
                (item) => item.id !== productDeleteId,
            ),
        );

        setProductDeleteId(null);

        showNotice("Product removed from the dashboard preview.");
    };

    const handleDeleteAccount = async () => {
        setIsDeleting(true);
        setDeleteError("");

        try {
            const response = await fetch(
                "/api/vendor/account",
                {
                    method: "DELETE",
                    credentials: "include",
                    headers: {
                        Accept: "application/json",
                    },
                },
            );

            // A 404 means this frontend prototype has no delete endpoint yet.
            // In that case, remove only the local demo account.
            if (!response.ok && response.status !== 404) {
                const result = await response
                    .json()
                    .catch(() => null);

                throw new Error(
                    result?.message ||
                    "We couldn't delete your account. Please try again.",
                );
            }

            localStorage.removeItem("oneservice_vendor");
            localStorage.removeItem("oneservice_user");
            localStorage.removeItem(
                "oneservice_workspace_role",
            );

            // Remove this vendor from the shared local collection too.
            const profileIdentity = String(
                vendorProfile?.vendorId ||
                vendorProfile?.id ||
                vendorProfile?.mobile ||
                vendorProfile?.phone ||
                vendorProfile?.email ||
                "",
            )
                .trim()
                .toLowerCase();

            if (profileIdentity) {
                try {
                    const parsed: unknown = JSON.parse(
                        localStorage.getItem("oneservice_vendors") ||
                        "[]",
                    );

                    if (Array.isArray(parsed)) {
                        const remaining = parsed.filter(
                            (item) => {
                                if (
                                    !item ||
                                    typeof item !== "object"
                                ) {
                                    return false;
                                }

                                const vendor =
                                    item as StoredVendorProfile;

                                const identity = String(
                                    vendor.vendorId ||
                                    vendor.id ||
                                    vendor.mobile ||
                                    vendor.phone ||
                                    vendor.email ||
                                    "",
                                )
                                    .trim()
                                    .toLowerCase();

                                return identity !== profileIdentity;
                            },
                        );

                        localStorage.setItem(
                            "oneservice_vendors",
                            JSON.stringify(remaining),
                        );
                    }
                } catch (error) {
                    console.error(
                        "Unable to update shared vendor collection after account removal:",
                        error,
                    );
                }
            }

            window.dispatchEvent(
                new Event("oneservice-auth-change"),
            );

            window.dispatchEvent(
                new Event("oneservice-vendor-change"),
            );

            window.dispatchEvent(
                new Event("oneservice-vendors-change"),
            );

            window.dispatchEvent(
                new Event("oneservice-workspace-change"),
            );

            setDeleteModalOpen(false);

            navigate("/profile", { replace: true });
        } catch (error) {
            setDeleteError(
                error instanceof Error
                    ? error.message
                    : "Something went wrong. Please try again.",
            );
        } finally {
            setIsDeleting(false);
        }
    };

    const renderAbout = () => (
        <section className="vh-tab-content">
            <div className="vh-content-header">
                <div>
                    <h2>About Your Business</h2>
                    <p>
                        Manage the business information, operating
                        hours, and amenities displayed on your
                        NeedOneService listing.
                    </p>
                </div>
            </div>

            <div className="vh-about-form-grid">
                <section className="vh-card">
                    <div className="vh-section-heading">
                        <div className="vh-heading-title">
                            <span className="vh-heading-icon">
                                <Building2 size={18} />
                            </span>
                            <h3>Business Information</h3>
                        </div>
                    </div>

                    <div className="vh-form-grid">
                        <label className="vh-form-field">
                            <span>Business Name</span>
                            <input
                                value={business.name}
                                onChange={(event) =>
                                    updateBusiness(
                                        "name",
                                        event.target.value,
                                    )
                                }
                                placeholder="Enter business name"
                            />
                        </label>

                        <label className="vh-form-field">
                            <span>Business Category</span>
                            <input
                                value={business.category}
                                onChange={(event) =>
                                    updateBusiness(
                                        "category",
                                        event.target.value,
                                    )
                                }
                                placeholder="Enter business category"
                            />
                        </label>

                        <label className="vh-form-field vh-form-field-full">
                            <span>Business Description</span>
                            <textarea
                                value={business.description}
                                onChange={(event) =>
                                    updateBusiness(
                                        "description",
                                        event.target.value,
                                    )
                                }
                                placeholder="Describe your business and services"
                                rows={5}
                            />
                        </label>
                    </div>
                </section>

                <section className="vh-card">
                    <div className="vh-section-heading">
                        <div className="vh-heading-title">
                            <span className="vh-heading-icon">
                                <Phone size={18} />
                            </span>
                            <h3>Contact Information</h3>
                        </div>
                    </div>

                    <div className="vh-form-grid">
                        <label className="vh-form-field vh-form-field-full">
                            <span>Business Address</span>
                            <input
                                value={business.address}
                                onChange={(event) =>
                                    updateBusiness(
                                        "address",
                                        event.target.value,
                                    )
                                }
                                placeholder="Enter business address"
                            />
                        </label>

                        <label className="vh-form-field">
                            <span>Phone Number</span>
                            <input
                                type="tel"
                                value={business.phone}
                                onChange={(event) =>
                                    updateBusiness(
                                        "phone",
                                        event.target.value,
                                    )
                                }
                                placeholder="Enter phone number"
                            />
                        </label>

                        <label className="vh-form-field">
                            <span>Email Address</span>
                            <input
                                type="email"
                                value={business.email}
                                onChange={(event) =>
                                    updateBusiness(
                                        "email",
                                        event.target.value,
                                    )
                                }
                                placeholder="Enter email address"
                            />
                        </label>

                        <label className="vh-form-field vh-form-field-full">
                            <span>Website</span>
                            <input
                                type="url"
                                value={business.website}
                                onChange={(event) =>
                                    updateBusiness(
                                        "website",
                                        event.target.value,
                                    )
                                }
                                placeholder="https://yourbusiness.com"
                            />
                        </label>
                    </div>
                </section>

                <section className="vh-card">
                    <div className="vh-section-heading">
                        <div className="vh-heading-title">
                            <span className="vh-heading-icon">
                                <Clock3 size={18} />
                            </span>
                            <h3>Operating Hours</h3>
                        </div>

                        <button
                            className="vh-small-action"
                            type="button"
                            onClick={() =>
                                setHours((previous) => [
                                    ...previous,
                                    {
                                        id: createId("hours"),
                                        day: "",
                                        hours: "",
                                    },
                                ])
                            }
                        >
                            <Plus size={13} /> Add day
                        </button>
                    </div>

                    <div className="vh-hours-edit-grid">
                        {hours.map((item) => (
                            <div
                                className="vh-hours-edit-row"
                                key={item.id}
                            >
                                <label className="vh-form-field">
                                    <span>Day</span>
                                    <input
                                        value={item.day}
                                        onChange={(event) =>
                                            updateHour(
                                                item.id,
                                                "day",
                                                event.target.value,
                                            )
                                        }
                                        placeholder="e.g. Monday"
                                    />
                                </label>

                                <label className="vh-form-field">
                                    <span>Opening hours</span>
                                    <input
                                        value={item.hours}
                                        onChange={(event) =>
                                            updateHour(
                                                item.id,
                                                "hours",
                                                event.target.value,
                                            )
                                        }
                                        placeholder="e.g. 09:00 AM – 06:00 PM"
                                    />
                                </label>

                                <button
                                    className="vh-highlight-remove"
                                    type="button"
                                    aria-label={`Remove ${item.day || "operating hours"}`}
                                    onClick={() =>
                                        setHours((previous) =>
                                            previous.filter(
                                                (hour) =>
                                                    hour.id !== item.id,
                                            ),
                                        )
                                    }
                                >
                                    <Trash2 size={15} />
                                </button>
                            </div>
                        ))}

                        {hours.length === 0 && (
                            <p className="vh-muted-line">
                                No operating hours added yet.
                            </p>
                        )}
                    </div>

                    <p className="vh-form-help">
                        Enter “Closed” in Opening hours for days
                        when your business is not operating.
                    </p>
                </section>

                <section className="vh-card">
                    <div className="vh-section-heading">
                        <div className="vh-heading-title">
                            <span className="vh-heading-icon">
                                <CheckCircle2 size={18} />
                            </span>
                            <h3>Key Highlights & Amenities</h3>
                        </div>

                        <button
                            className="vh-small-action"
                            type="button"
                            onClick={() =>
                                setHighlights((previous) => [
                                    ...previous,
                                    "",
                                ])
                            }
                        >
                            <Plus size={13} /> Add highlight
                        </button>
                    </div>

                    <div className="vh-highlight-edit-list">
                        {highlights.map((highlight, index) => (
                            <div
                                className="vh-highlight-edit-row"
                                key={`highlight-${index}`}
                            >
                                <span className="vh-highlight-check">
                                    <Check size={15} />
                                </span>

                                <input
                                    value={highlight}
                                    onChange={(event) =>
                                        updateHighlight(
                                            index,
                                            event.target.value,
                                        )
                                    }
                                    placeholder="Enter a business highlight or amenity"
                                    aria-label={`Business highlight ${index + 1}`}
                                />

                                <button
                                    className="vh-highlight-remove"
                                    type="button"
                                    aria-label={`Remove highlight ${index + 1}`}
                                    onClick={() =>
                                        setHighlights((previous) =>
                                            previous.filter(
                                                (_, itemIndex) =>
                                                    itemIndex !== index,
                                            ),
                                        )
                                    }
                                >
                                    <Trash2 size={15} />
                                </button>
                            </div>
                        ))}
                    </div>

                    <p className="vh-form-help">
                        Add amenities, customer benefits, facilities,
                        or qualities that make your business stand out.
                    </p>
                </section>

                <section className="vh-card">
                    <div className="vh-section-heading">
                        <div className="vh-heading-title">
                            <span className="vh-heading-icon">
                                <ShieldCheck size={18} />
                            </span>
                            <h3>Listing Preferences</h3>
                        </div>
                    </div>

                    <label className="vh-about-toggle">
                        <input
                            type="checkbox"
                            checked={business.open}
                            onChange={(event) =>
                                updateBusiness(
                                    "open",
                                    event.target.checked,
                                )
                            }
                        />

                        <span>
                            <strong>Business currently open</strong>
                            <small>
                                Indicate whether your business is
                                currently accepting customers.
                            </small>
                        </span>
                    </label>

                    <div className="vh-about-verification">
                        <BadgeCheck size={20} />
                        <div>
                            <strong>
                                {business.verified
                                    ? "Verified Business"
                                    : "Verification Pending"}
                            </strong>
                            <p>
                                {business.verified
                                    ? "Your listing is marked as verified."
                                    : "Complete verification to build customer trust."}
                            </p>
                        </div>
                    </div>
                </section>

                <div className="vh-about-save-row">
                    <p>
                        Changes update the dashboard preview immediately.
                        Permanent saving requires backend integration.
                    </p>

                    <button
                        className="vh-button vh-button-primary"
                        type="button"
                        onClick={() =>
                            showNotice(
                                "Your business changes are reflected in this preview. Backend saving is not connected yet.",
                            )
                        }
                    >
                        <Check size={15} /> Save Changes
                    </button>
                </div>
            </div>
        </section>
    );


    const isMeaningfulValue = (value: unknown) => {
        if (typeof value !== "string") return false;

        const cleaned = value.trim();

        return Boolean(
            cleaned &&
            ![
                "Your Business Name",
                "Business & Professional Services",
                "Tell customers about your business, what makes you different, and how your products or services can help them.",
            ].includes(cleaned)
        );
    };

    const profileCompletionItems = [
        isMeaningfulValue(business.name),
        isMeaningfulValue(business.category),
        isMeaningfulValue(vendorProfile?.fullName || vendorProfile?.name),
        isMeaningfulValue(business.phone),
        isMeaningfulValue(business.email),
        isMeaningfulValue(business.address),
        isMeaningfulValue(business.description),
        isMeaningfulValue(business.website),
        hours.some(item =>
            isMeaningfulValue(item.day) &&
            isMeaningfulValue(item.hours)
        ),
        services.some(item =>
            isMeaningfulValue(item.title) &&
            isMeaningfulValue(item.description)
        ),
        products.some(item =>
            isMeaningfulValue(item.name) &&
            isMeaningfulValue(item.price)
        ),
        gallery.some(item => isMeaningfulValue(item.image)),
        highlights.some(item => isMeaningfulValue(item)),
    ];

    const completedProfileFields = profileCompletionItems.filter(Boolean).length;

    const profileCompletionPercentage = Math.round(
        (completedProfileFields / profileCompletionItems.length) * 100
    );


    const profileCompletionLabels = [
        "Business name",
        "Business category",
        "Owner / contact person",
        "Phone number",
        "Email address",
        "Business address",
        "Business description",
        "Website or online presence",
        "Operating hours",
        "At least one service",
        "At least one product",
        "Business gallery photo",
        "Business highlights",
    ];
    const missingProfileTasks = profileCompletionItems
        .map((complete, index) => ({ complete, label: profileCompletionLabels[index] || `Profile detail ${index + 1}` }))
        .filter(item => !item.complete);
    const listingStatusText = String(vendorProfile?.listingStatus || vendorProfile?.publicationStatus || "Not submitted");
    const listingStatusNormalized = normalizeVendorStatus(listingStatusText);
    const listingIsLive = ["approved", "published", "live", "active"].includes(listingStatusNormalized) || vendorProfile?.isPublished === true;
    const listingIsPending = ["pending", "pending review", "under review", "submitted"].includes(listingStatusNormalized);

    const registrationDetails = [
        ["Applicant name", vendorProfile?.fullName || vendorProfile?.name],
        ["Registered mobile", vendorProfile?.mobile || vendorProfile?.phone],
        ["Registered email", vendorProfile?.email],
        ["Business name", vendorProfile?.businessName || business.name],
        ["Business type", vendorProfile?.businessType],
        ["Business category", vendorProfile?.businessCategory || business.category],
        ["Address", vendorProfile?.businessAddress || business.address],
        ["City", vendorProfile?.city],
        ["State", vendorProfile?.state],
        ["PIN code", vendorProfile?.pincode],
        ["Products / brands supplied", vendorProfile?.productDescription || (typeof vendorProfile?.products === "string" ? vendorProfile.products : "")],
    ].filter(([, value]) => value !== undefined && value !== null && String(value).trim() !== "");

    const renderOverview = () => (
        <div className="vh-new-dashboard">
            <section className="vh-welcome-panel">
                <div className="vh-welcome-copy">
                    <span className="vh-eyebrow">YOUR VENDOR WORKSPACE</span>
                    <h2>Let’s get your business listed.</h2>
                    <p>Your registration details are below. Complete the remaining profile steps to publish your business on NeedOneService City Listings.</p>
                    <div className="vh-welcome-status">
                        <span className="vh-status-dot" /> Vendor account approved
                        <span className="vh-welcome-divider" />
                        <span className={listingIsLive ? "is-live" : listingIsPending ? "is-pending" : "is-draft"}>{listingIsLive ? "Listing is live" : listingIsPending ? "Listing under admin review" : "Listing not submitted"}</span>
                    </div>
                </div>
                <div className="vh-welcome-mark"><Building2 size={34} /></div>
            </section>

            <section className="vh-registration-card">
                <div className="vh-registration-heading">
                    <div><span className="vh-eyebrow">STEP 1 · ALREADY PROVIDED</span><h3>Your registration details</h3><p>These are the details you submitted when you registered as a vendor.</p></div>
                    <span className="vh-registration-lock"><ClipboardList size={19} /> Registration record</span>
                </div>
                {registrationDetails.length > 0 ? (
                    <div className="vh-registration-grid">
                        {registrationDetails.map(([label, value]) => (
                            <div className="vh-registration-field" key={String(label)}><small>{String(label)}</small><strong>{String(value)}</strong></div>
                        ))}
                    </div>
                ) : (
                    <p className="vh-empty-state">Your original registration details could not be found in this vendor profile.</p>
                )}
                <p className="vh-registration-note"><Info size={15} /> Your original registration information is shown here. Add any missing public-facing details in the profile completion section above.</p>
            </section>

            <section className="vh-journey-card">
                <div className="vh-journey-heading">
                    <div>
                        <span className="vh-eyebrow">YOUR NEXT STEP</span>
                        <h3>{profileCompletionPercentage === 100 ? "Your profile is complete" : "Complete your business profile"}</h3>
                        <p>{profileCompletionPercentage === 100 ? "Preview your listing and submit it for the final admin approval." : "A complete profile helps customers understand and trust your business."}</p>
                    </div>
                    <div className="vh-completion-number"><strong>{profileCompletionPercentage}%</strong><span>completed</span></div>
                </div>
                <div className="vh-progress-track vh-progress-track-large" role="progressbar" aria-valuenow={profileCompletionPercentage} aria-valuemin={0} aria-valuemax={100}>
                    <span style={{ width: `${profileCompletionPercentage}%` }} />
                </div>
                <div className="vh-journey-meta"><span>{completedProfileFields} of {profileCompletionItems.length} profile requirements complete</span><span>{missingProfileTasks.length} remaining</span></div>
                {missingProfileTasks.length > 0 ? (
                    <div className="vh-next-steps">
                        <div className="vh-next-steps-title"><ListChecks size={17} /><strong>What you still need to complete</strong></div>
                        <div className="vh-task-list">
                            {missingProfileTasks.map((task, index) => (
                                <div className="vh-task-item" key={`${task.label}-${index}`}><span className="vh-task-number">{index + 1}</span><span>{task.label}</span><CheckCircle2 size={16} /></div>
                            ))}
                        </div>
                        <button type="button" className="vh-button vh-button-primary" onClick={handleEditBusiness}><Pencil size={15} /> Complete my profile <ArrowRight size={15} /></button>
                    </div>
                ) : (
                    <div className="vh-publish-ready">
                        <div><CheckCircle2 size={22} /><span><strong>Ready to publish</strong><small>Review how your listing will appear before submitting it for admin approval.</small></span></div>
                        {listingIsLive ? (
                            <button type="button" className="vh-button vh-button-primary" onClick={() => navigate("/city-listings")}><Eye size={15} /> View City Listings</button>
                        ) : listingIsPending ? (
                            <span className="vh-review-pending"><Clock3 size={16} /> Waiting for admin approval</span>
                        ) : (
                            <button type="button" className="vh-button vh-button-primary" onClick={() => setShowListingPreview(true)}><Eye size={15} /> Preview & publish listing</button>
                        )}
                    </div>
                )}
            </section>

            <section className="vh-listing-status-card">
                <div className="vh-listing-status-copy"><span className="vh-eyebrow">CITY LISTING</span><h3>{listingIsLive ? "Your business is visible to customers" : listingIsPending ? "Your listing is being reviewed" : "Your listing is not public yet"}</h3><p>{listingIsLive ? "Your approved listing is now available in City Listings." : listingIsPending ? "Your profile has been submitted. The listing will appear publicly only after the admin approves it." : "Complete your profile and submit it for the final listing review."}</p></div>
                <span className={`vh-listing-state ${listingIsLive ? "live" : listingIsPending ? "pending" : "draft"}`}>{listingIsLive ? "Live" : listingIsPending ? "Pending approval" : "Draft"}</span>
                {listingIsLive && <button type="button" className="vh-button vh-button-outline" onClick={() => navigate("/city-listings")}>Go to City Listings <ArrowRight size={15} /></button>}
            </section>

            <section className="vh-card vh-registration-tools">
                <div className="vh-section-heading"><div className="vh-heading-title"><span className="vh-heading-icon"><Building2 size={18} /></span><h3>Manage your business information</h3></div></div>
                <div className="vh-tool-links">
                    <button type="button" onClick={() => goToTab("about")}><Pencil size={17} /><span><strong>Business profile</strong><small>About, contact details and opening hours</small></span><ChevronRight size={17} /></button>
                    <button type="button" onClick={() => goToTab("gallery")}><ImageIcon size={17} /><span><strong>Photos & gallery</strong><small>Show customers your business</small></span><ChevronRight size={17} /></button>
                    <button type="button" onClick={() => goToTab("services")}><CheckCircle2 size={17} /><span><strong>Services</strong><small>Add what your business offers</small></span><ChevronRight size={17} /></button>
                    <button type="button" onClick={() => goToTab("products")}><Package size={17} /><span><strong>Products</strong><small>Manage your products and catalogue</small></span><ChevronRight size={17} /></button>
                    <button type="button" onClick={() => goToTab("location")}><MapPin size={17} /><span><strong>Location</strong><small>Help customers find your business</small></span><ChevronRight size={17} /></button>
                    <button type="button" onClick={() => goToTab("reviews")}><Star size={17} /><span><strong>Customer reviews</strong><small>See feedback on your business</small></span><ChevronRight size={17} /></button>
                </div>
            </section>
        </div>
    );

    const renderGallery = () => {
        const selectedItem = gallery.find(
            (item) => item.id === selectedGalleryId,
        );

        return (
            <section className="vh-tab-content">
                <div className="vh-content-header">
                    <div>
                        <h2>Media & Gallery</h2>
                        <p>
                            Upload, preview, select, and remove photos
                            from your business listing.
                        </p>
                    </div>

                    <button
                        className="vh-button vh-button-primary"
                        onClick={() =>
                            galleryInputRef.current?.click()
                        }
                        type="button"
                    >
                        <Upload size={15} /> Upload media
                    </button>

                    <input
                        ref={galleryInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        hidden
                        onChange={(event) => {
                            handleGalleryUpload(
                                event.target.files,
                            );
                            event.currentTarget.value = "";
                        }}
                    />
                </div>

                <div className="vh-gallery-large-grid">
                    {gallery.map((item) => (
                        <div
                            className={`vh-gallery-large-item ${selectedGalleryId === item.id ? "selected" : ""}`}
                            key={item.id}
                        >
                            <button
                                className="vh-gallery-image-select"
                                type="button"
                                onClick={() =>
                                    setSelectedGalleryId(item.id)
                                }
                                aria-label={`Select ${item.title}`}
                            >
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    loading="lazy"
                                />
                                <span>{item.title}</span>
                            </button>

                            <button
                                className="vh-gallery-delete"
                                type="button"
                                aria-label={`Delete ${item.title}`}
                                onClick={() =>
                                    setGalleryDeleteId(item.id)
                                }
                            >
                                <Trash2 size={15} />
                            </button>
                        </div>
                    ))}

                    {gallery.length === 0 && (
                        <div className="vh-empty-state">
                            No images in your gallery. Use Upload
                            media to add your first image.
                        </div>
                    )}
                </div>

                {selectedItem && (
                    <div className="vh-gallery-selection">
                        <strong>
                            Selected: {selectedItem.title}
                        </strong>

                        <button
                            className="vh-button vh-button-outline"
                            onClick={() =>
                                setSelectedGalleryId(null)
                            }
                            type="button"
                        >
                            <X size={14} /> Clear selection
                        </button>
                    </div>
                )}

                <div className="vh-notice">
                    <Info size={16} />
                    Image uploads are currently local previews.
                    Connect a media-storage service to keep uploaded
                    files after refresh.
                </div>
            </section>
        );
    };

    const renderServices = () => (
        <section className="vh-tab-content">
            <div className="vh-content-header">
                <div>
                    <h2>Services Offered</h2>
                    <p>
                        Add, edit, and remove the services available
                        through your business.
                    </p>
                </div>

                <button
                    className="vh-button vh-button-primary"
                    onClick={openAddService}
                    type="button"
                >
                    <Plus size={15} /> Add service
                </button>
            </div>

            <div className="vh-detail-grid">
                {visibleServices.map((service) => (
                    <article
                        className="vh-card vh-detail-card"
                        key={service.id}
                    >
                        <span className="vh-heading-icon">
                            <ShieldCheck size={20} />
                        </span>

                        <span className="vh-pill vh-pill-neutral">
                            {service.category || "General service"}
                        </span>

                        <h3>{service.title}</h3>

                        <p>
                            {service.description ||
                                "No description provided."}
                        </p>

                        <div className="vh-card-actions">
                            <button
                                className="vh-button vh-button-outline"
                                onClick={() =>
                                    openEditService(service)
                                }
                                type="button"
                            >
                                <Pencil size={14} /> Edit service
                            </button>

                            <button
                                className="vh-button vh-button-danger"
                                onClick={() =>
                                    setServiceDeleteId(service.id)
                                }
                                type="button"
                            >
                                <Trash2 size={14} /> Delete
                            </button>
                        </div>
                    </article>
                ))}

                {visibleServices.length === 0 && (
                    <p className="vh-empty-state">
                        {search
                            ? "No services match your search."
                            : "No services have been added yet."}
                    </p>
                )}
            </div>
        </section>
    );

    const renderProducts = () => (
        <section className="vh-tab-content">
            <div className="vh-content-header">
                <div>
                    <h2>Products / Catalogue</h2>
                    <p>
                        Manage product images, prices, categories,
                        and stock availability.
                    </p>
                </div>

                <button
                    className="vh-button vh-button-primary"
                    onClick={openAddProduct}
                    type="button"
                >
                    <Plus size={15} /> Add product
                </button>
            </div>

            <div className="vh-product-grid">
                {visibleProducts.map((product) => (
                    <article
                        className="vh-card vh-product-card"
                        key={product.id}
                    >
                        <img
                            src={product.image}
                            alt={product.name}
                            loading="lazy"
                        />

                        <span className="vh-product-badge">
                            {product.category || "General"}
                        </span>

                        <div className="vh-product-card-body">
                            <span className="vh-product-category">
                                Catalogue item
                            </span>

                            <h3>{product.name}</h3>

                            <strong>
                                ₹
                                {Number(
                                    product.price,
                                ).toLocaleString("en-IN")}
                            </strong>

                            <p>
                                <span
                                    className={`vh-status-dot ${product.stock === "Out of stock" ? "is-closed" : ""}`}
                                />
                                {product.stock}
                            </p>

                            <div className="vh-card-actions">
                                <button
                                    className="vh-button vh-button-outline"
                                    onClick={() =>
                                        openEditProduct(product)
                                    }
                                    type="button"
                                >
                                    <Pencil size={14} /> Edit product
                                </button>

                                <button
                                    className="vh-button vh-button-danger"
                                    onClick={() =>
                                        setProductDeleteId(product.id)
                                    }
                                    type="button"
                                >
                                    <Trash2 size={14} /> Delete
                                </button>
                            </div>
                        </div>
                    </article>
                ))}

                {visibleProducts.length === 0 && (
                    <p className="vh-empty-state">
                        {search
                            ? "No products match your search."
                            : "No products have been added yet."}
                    </p>
                )}
            </div>

            <div className="vh-notice">
                <Info size={16} />
                Products and image previews are held in local page
                state. Connect your inventory API and image storage
                for permanent saving.
            </div>
        </section>
    );

    const renderLocation = () => (
        <section className="vh-tab-content">
            <div className="vh-content-header">
                <div>
                    <h2>Location & Map</h2>
                    <p>
                        Make it easy for customers to find your business.
                    </p>
                </div>

                <button
                    className="vh-button vh-button-outline"
                    onClick={handleEditBusiness}
                    type="button"
                >
                    <Pencil size={14} /> Edit address
                </button>
            </div>

            <div className="vh-location-grid">
                <div className="vh-card">
                    <span className="vh-heading-icon">
                        <MapPin size={19} />
                    </span>

                    <h3 className="vh-location-address">
                        {business.address || "Address not provided"}
                    </h3>

                    <p className="vh-card-description">
                        Confirm your business address so customers
                        can find the right location.
                    </p>

                    <ul className="vh-contact-list">
                        <li>
                            <MapPin size={16} />
                            <span>
                                {business.address ||
                                    "Address not provided"}
                            </span>
                        </li>

                        <li>
                            <Phone size={16} />
                            <span>
                                {business.phone ||
                                    "Phone number not provided"}
                            </span>
                        </li>
                    </ul>

                    <button
                        className="vh-button vh-button-outline"
                        onClick={handleEditBusiness}
                        type="button"
                    >
                        <Pencil size={14} /> Update address
                    </button>
                </div>

                <div className="vh-map-large">
                    <MapPin size={35} />
                    <strong>Map preview</strong>
                    <span>
                        {business.address ||
                            "Set your business address"}
                    </span>
                    <small>
                        Connect a map provider to display the live
                        location.
                    </small>
                </div>
            </div>
        </section>
    );

    const renderReviews = () => (
        <section className="vh-tab-content">
            <div className="vh-content-header">
                <div>
                    <h2>Customer Reviews</h2>
                    <p>
                        Monitor customer satisfaction and build trust.
                    </p>
                </div>
            </div>

            <div className="vh-review-page-grid">
                <div className="vh-card">
                    <div className="vh-big-rating">
                        {business.rating.toFixed(1)}
                    </div>

                    <div className="vh-big-stars vh-stars">
                        ★★★★★
                    </div>

                    <p>
                        Based on {business.reviewCount} sample reviews
                    </p>

                    <div className="vh-review-bars vh-review-bars-large">
                        {[90, 65, 30, 12, 5].map(
                            (value, index) => (
                                <div
                                    className="vh-review-bar-row"
                                    key={value}
                                >
                                    <span>{5 - index} stars</span>
                                    <div>
                                        <i
                                            style={{
                                                width: `${value}%`,
                                            }}
                                        />
                                    </div>
                                    <small>{value}%</small>
                                </div>
                            ),
                        )}
                    </div>
                </div>

                <div className="vh-card">
                    <div className="vh-heading-title">
                        <span className="vh-heading-icon">
                            <MessageCircle size={18} />
                        </span>
                        <h3>Customer feedback</h3>
                    </div>

                    <p className="vh-card-description">
                        Your connected customer reviews will appear
                        here. Use feedback to identify what customers
                        value and where service can improve.
                    </p>

                    <div className="vh-notice">
                        <Info size={16} />
                        Review content and rating breakdowns are
                        sample data.
                    </div>
                </div>
            </div>
        </section>
    );

    const renderPerformance = () => (
        <section className="vh-tab-content">
            <div className="vh-content-header">
                <div>
                    <h2>Business Performance</h2>
                    <p>
                        Understand how customers interact with your listing.
                    </p>
                </div>
            </div>

            <div className="vh-performance-metrics">
                {[
                    {
                        label: "Listing views",
                        value: "128",
                        icon: Eye,
                    },
                    {
                        label: "Customer enquiries",
                        value: "24",
                        icon: MessageCircle,
                    },
                    {
                        label: "Product clicks",
                        value: "18",
                        icon: ShoppingBag,
                    },
                ].map((metric) => {
                    const Icon = metric.icon;

                    return (
                        <div
                            className="vh-card vh-performance-card"
                            key={metric.label}
                        >
                            <span className="vh-heading-icon">
                                <Icon size={19} />
                            </span>

                            <small>{metric.label}</small>
                            <strong>{metric.value}</strong>

                            <em>
                                <ArrowDownRight size={13} />
                                Demo data
                                <span> · Sample only</span>
                            </em>
                        </div>
                    );
                })}
            </div>

            <div className="vh-card vh-performance-note">
                <h3>Listing insights</h3>
                <p>
                    Once analytics are connected, this section can
                    show date-based trends, customer enquiries,
                    product engagement, and listing performance.
                </p>
            </div>
        </section>
    );

    const saveVendorPlanSelection = () => {
        const plan = VENDOR_PLANS.find(item => item.name === selectedVendorPlan);
        if (!plan || !vendorProfile) return;
        setVendorSubscriptionMessage(`${plan.displayName} selected for ₹${plan.price}/month. Payment gateway integration is required before activation.`);
    };

    const renderVendorAccessScreen = () => {
        const isSuspended = vendorAccessState === "suspended";
        const isBanned = vendorAccessState === "banned";
        const isRejected = vendorAccessState === "rejected";
        const title = isBanned ? "Vendor Account Banned" : isSuspended ? "Vendor Account Suspended" : isRejected ? "Application Not Approved" : "Application Under Review";
        const description = isBanned ? "Admin has permanently restricted access to this vendor account." : isSuspended ? "Your vendor dashboard is temporarily unavailable while this account restriction is active." : isRejected ? "Your vendor application was not approved. Please contact the Admin team for clarification." : "Your vendor registration is being reviewed by the NeedOneService team. Your dashboard will become available after approval.";
        return (
            <main className="vh-access-page">
                <section className={`vh-access-card ${isBanned ? "is-banned" : isSuspended ? "is-suspended" : isRejected ? "is-rejected" : "is-pending"}`}>
                    <div className="vh-access-icon">{isBanned || isSuspended ? <Ban size={30} /> : isRejected ? <X size={30} /> : <Clock3 size={30} />}</div>
                    <span className="vh-access-eyebrow">NEEDONESERVICE · VENDOR ACCOUNT</span>
                    <h1>{title}</h1>
                    <p>{description}</p>
                    {(isSuspended || isBanned) && <div className="vh-access-detail"><strong>Admin reason</strong><span>{getVendorSuspensionReason(vendorProfile)}</span></div>}
                    {isSuspended && <div className="vh-access-detail"><strong>Suspension end date</strong><span>{formatVendorDate(getVendorSuspensionEnd(vendorProfile))}</span><small>Your dashboard will remain blocked after this date until Admin explicitly reactivates your account.</small></div>}
                    {isRejected && vendorProfile?.rejectionReason && <div className="vh-access-detail"><strong>Admin feedback</strong><span>{vendorProfile.rejectionReason}</span></div>}
                    <div className="vh-access-actions"><button type="button" className="vh-access-back" onClick={() => navigate("/profile")}>Back to Profile</button><a href="mailto:support@needoneservice.com">Contact Support</a></div>
                </section>
            </main>
        );
    };

    const renderActiveTab = () => {
        switch (activeTab) {
            case "about":
                return renderAbout();

            case "gallery":
                return renderGallery();

            case "services":
                return renderServices();

            case "products":
                return renderProducts();

            case "location":
                return renderLocation();

            case "reviews":
                return renderReviews();

            case "performance":
                return renderPerformance();

            default:
                return renderOverview();
        }
    };

    if (vendorAccessState !== "approved") return renderVendorAccessScreen();

    return (
        <main className="vendor-hub-page">
            <div className="vh-shell">
                {notice && (
                    <div
                        className="vh-global-notice"
                        role="status"
                    >
                        <Info size={17} />
                        <span>{notice}</span>

                        <button
                            type="button"
                            aria-label="Dismiss notice"
                            onClick={() => setNotice("")}
                        >
                            <X size={15} />
                        </button>
                    </div>
                )}

                <section className="vh-business-banner">
                    <div className="vh-business-main">
                        <div
                            className="vh-business-logo"
                            aria-label={business.name}
                        >
                            {business.name.trim() &&
                                business.name !== "Your Business Name" ? (
                                <span className="vh-business-initials">
                                    {formatInitials(business.name)}
                                </span>
                            ) : (
                                <Building2 size={38} />
                            )}
                        </div>

                        <div className="vh-business-copy">
                            <div className="vh-business-name-line">
                                <h1>{business.name}</h1>

                                {business.verified && (
                                    <BadgeCheck
                                        className="vh-verified-icon"
                                        size={20}
                                    />
                                )}
                            </div>

                            <div className="vh-business-meta">
                                <span>
                                    <Building2 size={14} />
                                    {business.category}
                                </span>

                                <span>
                                    <MapPin size={14} />
                                    {business.address}
                                </span>
                            </div>

                            <p>{business.description}</p>

                            {business.reviewCount > 0 && (
                                <div className="vh-rating-line">
                                    <Star size={15} fill="currentColor" />
                                    <strong>{business.rating.toFixed(1)}</strong>
                                    <span>({business.reviewCount} reviews)</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="vh-business-actions">
                        <div className="vh-status-pills">
                            <span className="vh-pill vh-pill-verified">
                                <BadgeCheck size={14} />
                                {business.verified
                                    ? "Verified"
                                    : "Pending verification"}
                            </span>

                            <span
                                className={`vh-pill ${business.open ? "vh-pill-open" : "vh-pill-closed"}`}
                            >
                                <span className="vh-status-dot" />
                                {business.open ? "Open" : "Closed"}
                            </span>
                        </div>

                        <div className="vh-banner-buttons">
                            <button
                                className="vh-button vh-button-primary"
                                onClick={() => profileCompletionPercentage === 100 ? setShowListingPreview(true) : handleEditBusiness()}
                                type="button"
                            >
                                <CheckCircle2 size={15} /> {profileCompletionPercentage === 100 ? "Preview & publish" : "Complete profile"}
                            </button>

                            <button
                                className="vh-button vh-button-outline"
                                onClick={() => setShowListingPreview(true)}
                                type="button"
                            >
                                <Eye size={15} /> Preview Listing
                            </button>
                        </div>
                    </div>

                    <div className="vh-banner-gallery">
                        <button
                            className="vh-banner-gallery-main"
                            onClick={() => goToTab("gallery")}
                            type="button"
                            aria-label="Open business gallery"
                        >
                            {gallery[0] ? (
                                <img
                                    src={gallery[0].image}
                                    alt={gallery[0].title}
                                />
                            ) : (
                                <ImageIcon size={35} />
                            )}
                        </button>

                        <button
                            className="vh-banner-gallery-side"
                            onClick={() => goToTab("gallery")}
                            type="button"
                            aria-label="View all business photos"
                        >
                            {gallery[1] ? (
                                <img
                                    src={gallery[1].image}
                                    alt={gallery[1].title}
                                />
                            ) : (
                                <ImageIcon size={28} />
                            )}

                            <span>
                                +{Math.max(gallery.length - 1, 0)}
                            </span>
                        </button>
                    </div>
                </section>

                <nav
                    className="vh-tabs"
                    aria-label="Vendor dashboard sections"
                >
                    {tabItems.map((tab) => {
                        const Icon = tab.icon;

                        return (
                            <button
                                key={tab.id}
                                type="button"
                                className={`vh-tab ${activeTab === tab.id ? "active" : ""}`}
                                onClick={() => goToTab(tab.id)}
                                aria-current={
                                    activeTab === tab.id
                                        ? "page"
                                        : undefined
                                }
                            >
                                <Icon size={16} />
                                {tab.label}
                            </button>
                        );
                    })}
                </nav>

                {activeTab !== "overview" && (
                    <div className="vh-search-row">
                        <label className="vh-search" htmlFor="vh-dashboard-search">
                            <Eye size={16} />
                            <input id="vh-dashboard-search" type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search products or services..." />
                            {search && <button className="vh-search-clear" type="button" onClick={() => setSearch("")} aria-label="Clear search"><X size={14} /></button>}
                        </label>
                    </div>
                )}

                {renderActiveTab()}

                {activeTab === "overview" && (
                    <section className="vh-card vh-vendor-subscription" id="vendor-subscription">
                        <div className="vh-vendor-subscription-heading"><div><span className="vh-eyebrow">MEMBERSHIP &amp; VISIBILITY</span><h2><CreditCard size={20} /> Vendor Subscription</h2><p>Manage your 30-day trial and choose a business visibility plan.</p></div><span className={`vh-vendor-subscription-status ${vendorSubscriptionStatus.toLowerCase().replaceAll(" ", "-")}`}>{vendorSubscriptionStatus}</span></div>
                        {vendorSubscriptionStatus === "Free Trial" && vendorTrialRemaining && <div className="vh-vendor-trial"><Sparkles size={19} /><div><strong>30-day free trial</strong><p>{vendorTrialRemaining.days} days, {vendorTrialRemaining.hours} hours and {vendorTrialRemaining.minutes} minutes remaining · Ends {formatVendorDate(vendorProfile?.trialEndsAt || "")}</p></div><strong>₹0</strong></div>}
                        {(vendorSubscriptionStatus === "Trial Expired" || vendorSubscriptionStatus === "Expired") && <div className="vh-vendor-expired"><Clock3 size={18} /><span>Your free trial has expired. Choose a plan to continue your vendor membership.</span></div>}
                        {(vendorSubscriptionStatus === "Free Trial" || vendorSubscriptionStatus === "Trial Expired" || vendorSubscriptionStatus === "Expired") && <><div className="vh-vendor-plan-grid">{VENDOR_PLANS.map(plan => <button type="button" key={plan.name} className={`vh-vendor-plan ${plan.name.toLowerCase()} ${selectedVendorPlan === plan.name ? "selected" : ""}`} onClick={() => { setSelectedVendorPlan(plan.name); setViewingVendorPlan(plan.name); setVendorSubscriptionMessage(""); }}><span>{plan.name === "Basic" ? <ShieldCheck size={18} /> : plan.name === "Exclusive" ? <Sparkles size={18} /> : <Crown size={18} />}</span><strong>{plan.displayName}</strong><b>₹{plan.price}<small> / month</small></b><p>{plan.description}</p><em>View plan details <ChevronRight size={14} /></em></button>)}</div>{vendorSubscriptionStatus !== "Free Trial" && <div className="vh-vendor-payment"><div><small>Selected plan</small><strong>{VENDOR_PLANS.find(plan => plan.name === selectedVendorPlan)?.displayName}</strong></div><div><small>Monthly price</small><strong>₹{VENDOR_PLANS.find(plan => plan.name === selectedVendorPlan)?.price}</strong></div><button type="button" className="vh-button vh-button-primary" onClick={saveVendorPlanSelection}><CreditCard size={16} /> Proceed to Payment</button></div>}</>}
                        {vendorSubscriptionStatus === "Active" && <div className="vh-vendor-active"><CheckCircle2 size={20} /><div><strong>{vendorProfile?.subscriptionPlan || "Vendor"} plan active</strong><p>Expires {formatVendorDate(vendorProfile?.subscriptionEndsAt || "")}</p></div></div>}
                        {vendorSubscriptionStatus === "Not Started" && <p className="vh-vendor-pending">Your free trial will begin when your vendor account is approved.</p>}
                        {vendorSubscriptionMessage && <p className="vh-vendor-subscription-message" role="status">{vendorSubscriptionMessage}</p>}
                        <small className="vh-vendor-subscription-note">No charge is made during the free trial. A paid plan is activated only after successful payment verification.</small>
                    </section>
                )}

                {viewingVendorPlanDetails && <div className="vh-vendor-plan-overlay" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) setViewingVendorPlan(null); }}><section className="vh-vendor-plan-dialog" role="dialog" aria-modal="true" aria-labelledby="vh-vendor-plan-title"><button type="button" className="vh-vendor-plan-close" onClick={() => setViewingVendorPlan(null)} aria-label="Close plan details"><X size={19} /></button><span className="vh-eyebrow">VENDOR MEMBERSHIP</span><h2 id="vh-vendor-plan-title">{viewingVendorPlanDetails.displayName}</h2><p>{viewingVendorPlanDetails.description}</p><strong className="vh-vendor-plan-modal-price">₹{viewingVendorPlanDetails.price.toLocaleString("en-IN")} <small>/ month</small></strong><h3>Membership Benefits</h3><ul>{viewingVendorPlanDetails.features.map((feature, index) => <li key={`${viewingVendorPlanDetails.name}-${index}`}><Check size={15} />{feature}</li>)}</ul><div className="vh-vendor-plan-discounts"><span><b>10% OFF</b><small>3 months</small></span><span><b>15% OFF</b><small>6 months</small></span><span><b>2 Months FREE</b><small>12 months</small></span></div><div className="vh-vendor-plan-actions"><button type="button" className="vh-button vh-button-outline" onClick={() => setViewingVendorPlan(null)}>Close</button><button type="button" className="vh-button vh-button-primary" onClick={() => { setSelectedVendorPlan(viewingVendorPlanDetails.name); setViewingVendorPlan(null); }}>Select This Plan</button></div><small>Your 30-day free trial remains unchanged. Subscription activation requires successful payment verification.</small></section></div>}

                <footer className="vh-footer">
                    <button
                        className="vh-back-button"
                        onClick={() => navigate("/profile")}
                        type="button"
                    >
                        <ArrowLeft size={16} /> Back to Profile
                    </button>

                    <div className="vh-footer-links">
                        <button
                            type="button"
                            onClick={() => setSupportOpen(true)}
                        >
                            <MessageCircle size={13} />
                            Help & Support
                        </button>

                        <span />

                        <button
                            type="button"
                            onClick={() =>
                                showNotice(
                                    "Connect privacy details to your policy page.",
                                )
                            }
                        >
                            <ShieldCheck size={13} />
                            Privacy
                        </button>
                    </div>

                    <button
                        className="vh-remove-account"
                        onClick={() => {
                            setDeleteError("");
                            setDeleteModalOpen(true);
                        }}
                        type="button"
                    >
                        <Trash2 size={15} /> Remove Account
                    </button>
                </footer>
            </div>

            {serviceModalOpen && (
                <div
                    className="vh-modal-backdrop"
                    onMouseDown={(event) => {
                        if (
                            event.target === event.currentTarget
                        ) {
                            setServiceModalOpen(false);
                        }
                    }}
                >
                    <section
                        className="vh-edit-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="vh-service-modal-title"
                    >
                        <button
                            className="vh-modal-close"
                            type="button"
                            aria-label="Close dialog"
                            onClick={() =>
                                setServiceModalOpen(false)
                            }
                        >
                            <X size={18} />
                        </button>

                        <h2 id="vh-service-modal-title">
                            {editingServiceId
                                ? "Edit service"
                                : "Add a service"}
                        </h2>

                        <p>
                            Enter the information customers will see
                            for this service.
                        </p>

                        <div className="vh-form-grid">
                            <label className="vh-form-field vh-form-field-full">
                                <span>Service name *</span>
                                <input
                                    autoFocus
                                    value={serviceDraft.title}
                                    onChange={(event) =>
                                        setServiceDraft((previous) => ({
                                            ...previous,
                                            title: event.target.value,
                                        }))
                                    }
                                    placeholder="e.g. AC repair"
                                />
                            </label>

                            <label className="vh-form-field vh-form-field-full">
                                <span>Category</span>
                                <input
                                    value={serviceDraft.category}
                                    onChange={(event) =>
                                        setServiceDraft((previous) => ({
                                            ...previous,
                                            category: event.target.value,
                                        }))
                                    }
                                    placeholder="e.g. Home services"
                                />
                            </label>

                            <label className="vh-form-field vh-form-field-full">
                                <span>Description</span>
                                <textarea
                                    rows={4}
                                    value={serviceDraft.description}
                                    onChange={(event) =>
                                        setServiceDraft((previous) => ({
                                            ...previous,
                                            description: event.target.value,
                                        }))
                                    }
                                    placeholder="Describe this service"
                                />
                            </label>
                        </div>

                        <div className="vh-modal-actions">
                            <button
                                className="vh-button vh-button-outline"
                                type="button"
                                onClick={() =>
                                    setServiceModalOpen(false)
                                }
                            >
                                Cancel
                            </button>

                            <button
                                className="vh-button vh-button-primary"
                                type="button"
                                onClick={saveService}
                            >
                                <Check size={15} />
                                {editingServiceId
                                    ? "Save changes"
                                    : "Add service"}
                            </button>
                        </div>
                    </section>
                </div>
            )}

            {productModalOpen && (
                <div
                    className="vh-modal-backdrop"
                    onMouseDown={(event) => {
                        if (
                            event.target === event.currentTarget
                        ) {
                            setProductModalOpen(false);
                        }
                    }}
                >
                    <section
                        className="vh-edit-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="vh-product-modal-title"
                    >
                        <button
                            className="vh-modal-close"
                            type="button"
                            aria-label="Close dialog"
                            onClick={() =>
                                setProductModalOpen(false)
                            }
                        >
                            <X size={18} />
                        </button>

                        <h2 id="vh-product-modal-title">
                            {editingProductId
                                ? "Edit product"
                                : "Add a product"}
                        </h2>

                        <p>
                            Enter the product details and optionally
                            choose an image.
                        </p>

                        <div className="vh-product-form-image">
                            {productDraft.image ? (
                                <img
                                    src={productDraft.image}
                                    alt="Product preview"
                                />
                            ) : (
                                <span>
                                    <ImageIcon size={30} />
                                    Product image
                                </span>
                            )}

                            <button
                                className="vh-button vh-button-outline"
                                type="button"
                                onClick={() =>
                                    productInputRef.current?.click()
                                }
                            >
                                <Upload size={14} /> Choose image
                            </button>

                            <input
                                ref={productInputRef}
                                type="file"
                                accept="image/*"
                                hidden
                                onChange={(event) => {
                                    chooseProductImage(
                                        event.target.files?.[0],
                                    );
                                    event.currentTarget.value = "";
                                }}
                            />

                            <input
                                ref={productEditImageRef}
                                type="file"
                                accept="image/*"
                                hidden
                                onChange={(event) => {
                                    chooseProductImage(
                                        event.target.files?.[0],
                                    );
                                    event.currentTarget.value = "";
                                }}
                            />
                        </div>

                        <div className="vh-form-grid">
                            <label className="vh-form-field vh-form-field-full">
                                <span>Product name *</span>
                                <input
                                    autoFocus
                                    value={productDraft.name}
                                    onChange={(event) =>
                                        setProductDraft((previous) => ({
                                            ...previous,
                                            name: event.target.value,
                                        }))
                                    }
                                    placeholder="Enter product name"
                                />
                            </label>

                            <label className="vh-form-field">
                                <span>Category</span>
                                <input
                                    value={productDraft.category}
                                    onChange={(event) =>
                                        setProductDraft((previous) => ({
                                            ...previous,
                                            category: event.target.value,
                                        }))
                                    }
                                    placeholder="e.g. Accessories"
                                />
                            </label>

                            <label className="vh-form-field">
                                <span>Price (₹) *</span>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={productDraft.price}
                                    onChange={(event) =>
                                        setProductDraft((previous) => ({
                                            ...previous,
                                            price: event.target.value,
                                        }))
                                    }
                                    placeholder="499"
                                />
                            </label>

                            <label className="vh-form-field vh-form-field-full">
                                <span>Stock status</span>
                                <select
                                    value={productDraft.stock}
                                    onChange={(event) =>
                                        setProductDraft((previous) => ({
                                            ...previous,
                                            stock: event.target.value,
                                        }))
                                    }
                                >
                                    <option>In stock</option>
                                    <option>Low stock</option>
                                    <option>Out of stock</option>
                                </select>
                            </label>
                        </div>

                        <div className="vh-modal-actions">
                            <button
                                className="vh-button vh-button-outline"
                                type="button"
                                onClick={() =>
                                    setProductModalOpen(false)
                                }
                            >
                                Cancel
                            </button>

                            <button
                                className="vh-button vh-button-primary"
                                type="button"
                                onClick={saveProduct}
                            >
                                <Check size={15} />
                                {editingProductId
                                    ? "Save changes"
                                    : "Add product"}
                            </button>
                        </div>
                    </section>
                </div>
            )}

            {(galleryDeleteId ||
                serviceDeleteId ||
                productDeleteId) && (
                    <div
                        className="vh-modal-backdrop"
                        onMouseDown={(event) => {
                            if (
                                event.target === event.currentTarget
                            ) {
                                setGalleryDeleteId(null);
                                setServiceDeleteId(null);
                                setProductDeleteId(null);
                            }
                        }}
                    >
                        <section
                            className="vh-delete-modal"
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby="vh-item-delete-title"
                        >
                            <button
                                className="vh-modal-close"
                                type="button"
                                aria-label="Close dialog"
                                onClick={() => {
                                    setGalleryDeleteId(null);
                                    setServiceDeleteId(null);
                                    setProductDeleteId(null);
                                }}
                            >
                                <X size={18} />
                            </button>

                            <div className="vh-delete-icon">
                                <Trash2 size={25} />
                            </div>

                            <h2 id="vh-item-delete-title">
                                Delete this item?
                            </h2>

                            <p>
                                This removes the selected item from the
                                current dashboard preview. This action
                                cannot be undone here.
                            </p>

                            <div className="vh-modal-actions">
                                <button
                                    className="vh-button vh-button-outline"
                                    type="button"
                                    onClick={() => {
                                        setGalleryDeleteId(null);
                                        setServiceDeleteId(null);
                                        setProductDeleteId(null);
                                    }}
                                >
                                    Cancel
                                </button>

                                <button
                                    className="vh-button vh-button-danger"
                                    type="button"
                                    onClick={() => {
                                        if (galleryDeleteId) {
                                            confirmGalleryDelete();
                                        } else if (serviceDeleteId) {
                                            confirmServiceDelete();
                                        } else if (productDeleteId) {
                                            confirmProductDelete();
                                        }
                                    }}
                                >
                                    <Trash2 size={15} /> Delete
                                </button>
                            </div>
                        </section>
                    </div>
                )}

            {deleteModalOpen && (
                <div
                    className="vh-modal-backdrop"
                    onMouseDown={(event) => {
                        if (
                            event.target === event.currentTarget &&
                            !isDeleting
                        ) {
                            setDeleteModalOpen(false);
                        }
                    }}
                >
                    <section
                        className="vh-delete-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="vh-delete-title"
                    >
                        <button
                            className="vh-modal-close"
                            type="button"
                            aria-label="Close dialog"
                            disabled={isDeleting}
                            onClick={() =>
                                setDeleteModalOpen(false)
                            }
                        >
                            <X size={18} />
                        </button>

                        <div className="vh-delete-icon">
                            <Ban size={26} />
                        </div>

                        <h2 id="vh-delete-title">
                            Remove your vendor account?
                        </h2>

                        <p>
                            This action may permanently remove your
                            vendor account and its associated listing
                            information. Make sure you understand
                            the consequences before continuing.
                        </p>

                        <div className="vh-delete-warning">
                            <Info size={17} />
                            <span>
                                Account removal must be handled by
                                your backend, including related
                                listings, products, and account
                                access. The server must support this
                                operation.
                            </span>
                        </div>

                        {deleteError && (
                            <div
                                className="vh-delete-error"
                                role="alert"
                            >
                                {deleteError}
                            </div>
                        )}

                        <div className="vh-modal-actions">
                            <button
                                className="vh-button vh-button-outline"
                                type="button"
                                disabled={isDeleting}
                                onClick={() =>
                                    setDeleteModalOpen(false)
                                }
                            >
                                Cancel
                            </button>

                            <button
                                className="vh-button vh-button-danger"
                                type="button"
                                disabled={isDeleting}
                                onClick={handleDeleteAccount}
                            >
                                <Trash2 size={15} />
                                {isDeleting
                                    ? "Removing account..."
                                    : "Yes, Remove Account"}
                            </button>
                        </div>
                    </section>
                </div>
            )}


            {supportOpen && (
                <div className="vh-modal-backdrop vh-support-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setSupportOpen(false); }}>
                    <section className="vh-support-dialog" role="dialog" aria-modal="true" aria-labelledby="vh-support-title">
                        <header className="vh-support-header"><div className="vh-support-avatar"><MessageCircle size={20} /></div><div><h2 id="vh-support-title">Help & Support</h2><p>Message the NeedOneService admin team</p></div><button type="button" className="vh-modal-close" onClick={() => setSupportOpen(false)} aria-label="Close support"><X size={18} /></button></header>
                        <div className="vh-support-thread" aria-live="polite">
                            {supportMessages.length === 0 ? <div className="vh-support-empty"><MessageCircle size={28} /><strong>How can we help?</strong><p>Send your question and the admin team can respond in this conversation.</p></div> : supportMessages.map(message => <div key={message.id} className={`vh-support-message ${message.sender === "admin" ? "from-admin" : "from-vendor"}`}><span>{message.sender === "admin" ? "NeedOneService Admin" : "You"}</span><p>{message.text}</p><small>{formatVendorDate(message.createdAt)}</small></div>)}
                        </div>
                        <form className="vh-support-compose" onSubmit={(event) => { event.preventDefault(); sendSupportMessage(); }}><textarea value={supportDraft} onChange={(event) => setSupportDraft(event.target.value)} placeholder="Type your message..." rows={2} aria-label="Your support message" /><button type="submit" className="vh-button vh-button-primary" disabled={!supportDraft.trim()}><Send size={15} /> Send</button></form>
                        <p className="vh-support-footnote">Admin replies will appear in this conversation when the support inbox is connected.</p>
                    </section>
                </div>
            )}

            {showListingPreview && (
                <div
                    className="vh-modal-backdrop"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) {
                            setShowListingPreview(false);
                        }
                    }}
                >
                    <section
                        className="vh-listing-preview"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="vh-preview-title"
                    >
                        <button
                            className="vh-modal-close"
                            type="button"
                            onClick={() => setShowListingPreview(false)}
                            aria-label="Close preview"
                        >
                            <X size={18} />
                        </button>

                        <div className="vh-preview-header">
                            <span>LISTING PREVIEW</span>
                            <h2 id="vh-preview-title">
                                {business.name}
                            </h2>
                            <p>
                                This is how your business information will
                                appear to customers on City Listings.
                            </p>
                        </div>

                        <div className="vh-preview-gallery">
                            {gallery
                                .filter(item => item.image)
                                .slice(0, 4)
                                .map(item => (
                                    <img
                                        key={item.id}
                                        src={item.image}
                                        alt={item.title}
                                    />
                                ))}
                        </div>

                        <div className="vh-preview-content">
                            <span className="vh-preview-category">
                                {business.category}
                            </span>

                            <h3>{business.name}</h3>

                            <p>{business.description}</p>

                            <div className="vh-preview-contact">
                                <span>
                                    <MapPin size={15} />
                                    {business.address}
                                </span>
                                <span>
                                    <Phone size={15} />
                                    {business.phone || "Contact not provided"}
                                </span>
                                <span>
                                    <Mail size={15} />
                                    {business.email || "Email not provided"}
                                </span>
                            </div>

                            {services.length > 0 && (
                                <div>
                                    <h3>Services Offered</h3>
                                    {services.map(item => (
                                        <div key={item.id} className="vh-preview-item">
                                            <strong>{item.title}</strong>
                                            <p>{item.description}</p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {products.length > 0 && (
                                <div>
                                    <h3>Products & Catalogue</h3>
                                    <div className="vh-preview-products">
                                        {products.map(item => (
                                            <article key={item.id}>
                                                {item.image && (
                                                    <img
                                                        src={item.image}
                                                        alt={item.name}
                                                    />
                                                )}
                                                <strong>{item.name}</strong>
                                                <span>₹{item.price}</span>
                                            </article>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {highlights.length > 0 && (
                                <div>
                                    <h3>Business Highlights</h3>
                                    <ul>
                                        {highlights
                                            .filter(item => item.trim())
                                            .map((item, index) => (
                                                <li key={index}>{item}</li>
                                            ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                        <div className="vh-preview-footer">
                            <button
                                className="vh-button vh-button-outline"
                                type="button"
                                onClick={() => {
                                    setShowListingPreview(false);
                                    goToTab("about");
                                }}
                            >
                                <Pencil size={14} /> Edit Details
                            </button>

                            <button
                                className="vh-button vh-button-outline"
                                type="button"
                                onClick={() => setShowListingPreview(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="vh-button vh-button-primary"
                                type="button"
                                onClick={() => {
                                    setShowListingPreview(false);
                                    publishVendorListing();
                                }}
                            >
                                <CheckCircle2 size={15} /> Submit for admin approval
                            </button>
                        </div>
                    </section>
                </div>
            )}

        </main>
    );
}

export default VendorHub;
