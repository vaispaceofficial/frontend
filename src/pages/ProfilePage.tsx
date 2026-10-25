
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    ArrowRight,
    Bell,
    Check,
    ChevronRight,
    CircleHelp,
    GraduationCap,
    LockKeyhole,
    LogOut,
    MapPin,
    Package,
    Phone,
    ShieldCheck,
    ShoppingBag,
    Store,
    UserRound,
    Wrench,
    X,
    Settings as SettingsIcon,
    ClipboardList,
    UserCog,
    Mail,
    Eye,
    LayoutDashboard,
    Search,
} from "lucide-react";
import "./ProfilePage.css";

type ServiceUser = {
    id?: string;
    mobile: string;
    loggedIn: boolean;
    mobileVerified?: boolean;
    name?: string;
    fullName?: string;
    email?: string;
    role?: string;
    accountType?: string;
    [key: string]: unknown;
};

type AccountSettings = {
    language: string;
    serviceUpdates: boolean;
    promotionalUpdates: boolean;
    orderUpdates: boolean;
};

type ProfessionalApplication = {
    id: string;
    fullName: string;
    mobile?: string;
    email?: string;
    city?: string;
    state?: string;
    category?: string;
    services?: string[];
    experience?: string;
    workType?: string;
    workingDays?: string[];
    serviceArea?: string;
    submittedAt?: string;
    status?: string;
};

type SellerApplication = {
    id?: string;
    applicationId?: string;
    sellerId?: string;
    fullName?: string;
    name?: string;
    ownerName?: string;
    businessName?: string;
    storeName?: string;
    companyName?: string;
    mobile?: string;
    phone?: string;
    email?: string;
    category?: string;
    businessType?: string;
    city?: string;
    state?: string;
    address?: string;
    status?: string;
    submittedAt?: string;
};

type VendorApplication = {
    id?: string;
    vendorId?: string;
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
    status?: string;
    registeredAt?: string;
};

type StudentApplication = {
    id?: string;
    studentId?: string;
    applicationId?: string;
    fullName?: string;
    name?: string;
    mobile?: string;
    phone?: string;
    email?: string;
    city?: string;
    state?: string;
    status?: string;
    registeredAt?: string;
    submittedAt?: string;
    [key: string]: unknown;
};

type OrderHistoryItem = {
    id: string;
    type?: string;
    title: string;
    date?: string;
    status: string;
    amount?: number | string;
};

type OrderTypeFilter = "all" | "service" | "product";
type OrderDateSort = "newest" | "oldest";
type ProfileModal = "personal" | "address" | "privacy" | "help" | null;

const DEFAULT_SETTINGS: AccountSettings = {
    language: "English",
    serviceUpdates: true,
    promotionalUpdates: false,
    orderUpdates: true,
};

const PROFESSIONAL_APPLICATION_KEY = "oneservice_professional_application";
const SELLER_APPLICATION_KEY = "oneservice_seller_application";
const VENDOR_APPLICATION_KEY = "oneservice_vendor";
const STUDENT_APPLICATION_KEYS = [
    "oneservice_student_application",
    "oneservice_student",
];
const PROFESSIONAL_NOTICE_KEY = "oneservice_professional_notice";
const ORDER_HISTORY_KEY = "oneservice_order_history";

const ORDER_STATUS_OPTIONS = [
    { value: "all", label: "All statuses" },
    { value: "pending", label: "Pending" },
    { value: "confirmed", label: "Confirmed" },
    { value: "in progress", label: "In progress" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
    { value: "delivered", label: "Delivered" },
    { value: "rejected", label: "Rejected" },
];

const NETWORK_OPTIONS = [
    {
        title: "Professional",
        description: "Offer your skills and connect with customers.",
        path: "/register-professional",
        icon: Wrench,
    },
    {
        title: "Seller",
        description: "Grow your product business with OneService.",
        path: "/register-seller",
        icon: ShoppingBag,
    },
    {
        title: "Vendor",
        description: "Bring your business to our network.",
        path: "/register-vendor",
        icon: Store,
    },
    {
        title: "Student",
        description: "Explore learning and training opportunities.",
        path: "/register-student",
        icon: GraduationCap,
    },
];

function readSettings(): AccountSettings {
    try {
        const saved = localStorage.getItem("oneservice_profile_settings");

        if (saved) {
            return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
        }
    } catch {
        // Use default settings when saved preferences are invalid.
    }

    return DEFAULT_SETTINGS;
}

function readProfessionalApplication(): ProfessionalApplication | null {
    try {
        const saved = localStorage.getItem(PROFESSIONAL_APPLICATION_KEY);
        if (!saved) return null;

        const application = JSON.parse(saved) as ProfessionalApplication;

        if (
            !application ||
            typeof application !== "object" ||
            typeof application.fullName !== "string" ||
            !application.fullName.trim() ||
            typeof application.id !== "string" ||
            !application.id.trim()
        ) {
            return null;
        }

        return application;
    } catch {
        return null;
    }
}

function readSellerApplication(): SellerApplication | null {
    try {
        const saved = localStorage.getItem(SELLER_APPLICATION_KEY);
        if (!saved) return null;

        const application = JSON.parse(saved) as SellerApplication;

        if (!application || typeof application !== "object") return null;

        const hasSellerDetails = Boolean(
            application.businessName?.trim() ||
            application.storeName?.trim() ||
            application.companyName?.trim() ||
            application.ownerName?.trim() ||
            application.fullName?.trim() ||
            application.name?.trim(),
        );

        return hasSellerDetails ? application : null;
    } catch {
        return null;
    }
}

function readVendorApplication(): VendorApplication | null {
    try {
        const saved = localStorage.getItem(VENDOR_APPLICATION_KEY);
        if (!saved) return null;

        const application = JSON.parse(saved) as VendorApplication;

        if (!application || typeof application !== "object") return null;

        const hasVendorDetails = Boolean(
            application.businessName?.trim() ||
            application.fullName?.trim() ||
            application.name?.trim() ||
            application.mobile?.trim() ||
            application.phone?.trim(),
        );

        return hasVendorDetails ? application : null;
    } catch {
        return null;
    }
}

function readStudentApplication(): StudentApplication | null {
    try {
        for (const key of STUDENT_APPLICATION_KEYS) {
            const saved = localStorage.getItem(key);
            if (!saved) continue;

            const application = JSON.parse(saved) as StudentApplication;

            if (!application || typeof application !== "object") continue;

            const hasStudentDetails = Boolean(
                application.fullName?.trim() ||
                application.name?.trim() ||
                application.studentId?.trim() ||
                application.applicationId?.trim() ||
                application.mobile?.trim() ||
                application.phone?.trim(),
            );

            if (hasStudentDetails) return application;
        }

        return null;
    } catch {
        return null;
    }
}

function readOrderHistory(): OrderHistoryItem[] {
    try {
        const saved = localStorage.getItem(ORDER_HISTORY_KEY);
        if (!saved) return [];

        const parsed: unknown = JSON.parse(saved);
        if (!Array.isArray(parsed)) return [];

        return parsed.filter(
            (order): order is OrderHistoryItem =>
                order !== null &&
                typeof order === "object" &&
                typeof order.id === "string" &&
                typeof order.title === "string" &&
                typeof order.status === "string",
        );
    } catch {
        return [];
    }
}

function normalizeStatus(status: string): string {
    return status
        .trim()
        .toLowerCase()
        .replace(/[-_]+/g, " ")
        .replace(/\s+/g, " ");
}

function getApplicationStatus(status?: string): string {
    const normalized = normalizeStatus(status ?? "");

    if (["approved", "verified", "active"].includes(normalized)) {
        return "Approved";
    }

    if (normalized === "rejected") return "Rejected";

    if (normalized === "suspended" || normalized === "blocked") {
        return "Suspended";
    }

    return "Pending Review";
}

function getOrderTimestamp(date?: string): number {
    if (!date) return 0;

    const timestamp = Date.parse(date);
    return Number.isNaN(timestamp) ? 0 : timestamp;
}

function formatOrderDate(date?: string): string {
    if (!date) return "";

    const timestamp = getOrderTimestamp(date);
    if (!timestamp) return date;

    return new Intl.DateTimeFormat("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    }).format(new Date(timestamp));
}

function formatOrderAmount(amount: number | string): string {
    if (typeof amount === "number") {
        return `₹${amount.toLocaleString("en-IN")}`;
    }

    const trimmed = amount.trim();
    if (!trimmed) return "";

    return trimmed.startsWith("₹") ? trimmed : trimmed;
}

function ProfilePage() {
    const navigate = useNavigate();

    const [user, setUser] = useState<ServiceUser | null>(null);
    const [settings, setSettings] =
        useState<AccountSettings>(DEFAULT_SETTINGS);

    const [activeModal, setActiveModal] = useState<ProfileModal>(null);

    const [displayName, setDisplayName] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");
    const [savedAddress, setSavedAddress] = useState("");
    const [notice, setNotice] = useState("");

    const [professionalApplication, setProfessionalApplication] =
        useState<ProfessionalApplication | null>(null);

    const [sellerApplication, setSellerApplication] =
        useState<SellerApplication | null>(null);

    const [vendorApplication, setVendorApplication] =
        useState<VendorApplication | null>(null);

    const [studentApplication, setStudentApplication] =
        useState<StudentApplication | null>(null);

    const [orderHistory, setOrderHistory] = useState<OrderHistoryItem[]>([]);
    const [showAllOrders, setShowAllOrders] = useState(false);

    const [orderTypeFilter, setOrderTypeFilter] =
        useState<OrderTypeFilter>("all");
    const [orderStatusFilter, setOrderStatusFilter] = useState("all");
    const [orderSearch, setOrderSearch] = useState("");
    const [orderDateSort, setOrderDateSort] =
        useState<OrderDateSort>("newest");

    useEffect(() => {
        const storedUser = localStorage.getItem("oneservice_user");

        if (!storedUser) {
            navigate("/login", { replace: true });
            return;
        }

        try {
            const parsed = JSON.parse(storedUser) as ServiceUser;

            if (!parsed.loggedIn || !parsed.mobile) {
                navigate("/login", { replace: true });
                return;
            }

            setUser(parsed);
            setDisplayName(parsed.name ?? parsed.fullName ?? "");
            setEmail(parsed.email ?? "");
            setSettings(readSettings());

            const storedAddress =
                localStorage.getItem("oneservice_saved_address") ?? "";

            setSavedAddress(storedAddress);
            setAddress(storedAddress);

            setProfessionalApplication(readProfessionalApplication());
            setSellerApplication(readSellerApplication());
            setVendorApplication(readVendorApplication());
            setStudentApplication(readStudentApplication());
            setOrderHistory(readOrderHistory());

            const shouldShowProfessionalNotice =
                localStorage.getItem(PROFESSIONAL_NOTICE_KEY) === "true";

            if (shouldShowProfessionalNotice) {
                localStorage.removeItem(PROFESSIONAL_NOTICE_KEY);
                setNotice(
                    "Your request has been submitted successfully. Please wait while we review your details and provide access.",
                );
            }
        } catch {
            localStorage.removeItem("oneservice_user");
            navigate("/login", { replace: true });
        }
    }, [navigate]);

    useEffect(() => {
        const refreshProfessionalApplication = () => {
            setProfessionalApplication(readProfessionalApplication());
        };

        const refreshSellerApplication = () => {
            setSellerApplication(readSellerApplication());
        };

        const refreshVendorApplication = () => {
            setVendorApplication(readVendorApplication());
        };

        const refreshStudentApplication = () => {
            setStudentApplication(readStudentApplication());
        };

        const refreshOrderHistory = () => {
            setOrderHistory(readOrderHistory());
        };

        const refreshWorkspaceData = () => {
            refreshProfessionalApplication();
            refreshSellerApplication();
            refreshVendorApplication();
            refreshStudentApplication();
        };

        window.addEventListener(
            "oneservice-professional-change",
            refreshProfessionalApplication,
        );
        window.addEventListener(
            "oneservice-seller-change",
            refreshSellerApplication,
        );
        window.addEventListener(
            "oneservice-vendor-change",
            refreshVendorApplication,
        );
        window.addEventListener(
            "oneservice-student-change",
            refreshStudentApplication,
        );
        window.addEventListener(
            "oneservice-order-change",
            refreshOrderHistory,
        );
        window.addEventListener(
            "oneservice-workspace-change",
            refreshWorkspaceData,
        );

        window.addEventListener("storage", refreshProfessionalApplication);
        window.addEventListener("storage", refreshSellerApplication);
        window.addEventListener("storage", refreshVendorApplication);
        window.addEventListener("storage", refreshStudentApplication);
        window.addEventListener("storage", refreshOrderHistory);

        return () => {
            window.removeEventListener(
                "oneservice-professional-change",
                refreshProfessionalApplication,
            );
            window.removeEventListener(
                "oneservice-seller-change",
                refreshSellerApplication,
            );
            window.removeEventListener(
                "oneservice-vendor-change",
                refreshVendorApplication,
            );
            window.removeEventListener(
                "oneservice-student-change",
                refreshStudentApplication,
            );
            window.removeEventListener(
                "oneservice-order-change",
                refreshOrderHistory,
            );
            window.removeEventListener(
                "oneservice-workspace-change",
                refreshWorkspaceData,
            );

            window.removeEventListener("storage", refreshProfessionalApplication);
            window.removeEventListener("storage", refreshSellerApplication);
            window.removeEventListener("storage", refreshVendorApplication);
            window.removeEventListener("storage", refreshStudentApplication);
            window.removeEventListener("storage", refreshOrderHistory);
        };
    }, []);

    const updateSettings = (next: AccountSettings) => {
        setSettings(next);
        localStorage.setItem(
            "oneservice_profile_settings",
            JSON.stringify(next),
        );
        setNotice("Your preferences have been saved.");
        window.setTimeout(() => setNotice(""), 2600);
    };

    const handlePersonalSave = () => {
        if (!user) return;

        const updatedUser: ServiceUser = {
            ...user,
            name: displayName.trim(),
            email: email.trim(),
        };

        localStorage.setItem("oneservice_user", JSON.stringify(updatedUser));
        setUser(updatedUser);
        window.dispatchEvent(new Event("oneservice-auth-change"));
        setActiveModal(null);
        setNotice("Personal details saved.");
        window.setTimeout(() => setNotice(""), 2600);
    };

    const handleAddressSave = () => {
        const cleanAddress = address.trim();
        if (!cleanAddress) return;

        localStorage.setItem("oneservice_saved_address", cleanAddress);
        setSavedAddress(cleanAddress);
        setActiveModal(null);
        setNotice("Saved address updated.");
        window.setTimeout(() => setNotice(""), 2600);
    };

    const handleLogout = () => {
        localStorage.removeItem("oneservice_user");
        window.dispatchEvent(new Event("oneservice-auth-change"));
        navigate("/login", { replace: true });
    };

    const clearOrderFilters = () => {
        setOrderTypeFilter("all");
        setOrderStatusFilter("all");
        setOrderSearch("");
        setOrderDateSort("newest");
        setShowAllOrders(false);
    };

    const filteredOrders = useMemo(() => {
        const search = orderSearch.trim().toLowerCase();

        return orderHistory
            .filter((order) => {
                const type = (order.type ?? "product").trim().toLowerCase();
                const isService = type === "service" || type === "booking";

                const matchesType =
                    orderTypeFilter === "all" ||
                    (orderTypeFilter === "service" && isService) ||
                    (orderTypeFilter === "product" && !isService);

                const matchesStatus =
                    orderStatusFilter === "all" ||
                    normalizeStatus(order.status) ===
                        normalizeStatus(orderStatusFilter);

                const matchesSearch =
                    !search ||
                    order.title.toLowerCase().includes(search) ||
                    order.id.toLowerCase().includes(search);

                return matchesType && matchesStatus && matchesSearch;
            })
            .sort((a, b) => {
                const difference =
                    getOrderTimestamp(a.date) - getOrderTimestamp(b.date);

                return orderDateSort === "newest"
                    ? -difference
                    : difference;
            });
    }, [
        orderHistory,
        orderTypeFilter,
        orderStatusFilter,
        orderSearch,
        orderDateSort,
    ]);

    const visibleOrders = showAllOrders
        ? filteredOrders
        : filteredOrders.slice(0, 3);

    const hasActiveOrderFilters =
        orderTypeFilter !== "all" ||
        orderStatusFilter !== "all" ||
        orderSearch.trim() !== "" ||
        orderDateSort !== "newest";

    const toggleOrderHistory = () => {
        setShowAllOrders((previous) => !previous);
    };

    if (!user) return null;

    const application = professionalApplication;
    const seller = sellerApplication;
    const vendor = vendorApplication;
    const student = studentApplication;

    const applicationStatus = getApplicationStatus(application?.status);
    const sellerStatus = getApplicationStatus(seller?.status);
    const vendorStatus = getApplicationStatus(vendor?.status);
    const studentStatus = getApplicationStatus(student?.status);

    const sellerName =
        seller?.businessName ||
        seller?.storeName ||
        seller?.companyName ||
        seller?.ownerName ||
        seller?.fullName ||
        seller?.name ||
        "Seller Account";

    const sellerOwnerName =
        seller?.ownerName || seller?.fullName || seller?.name || "";

    const sellerReference =
        seller?.sellerId || seller?.applicationId || seller?.id || "Submitted";

    const vendorName =
        vendor?.businessName ||
        vendor?.fullName ||
        vendor?.name ||
        "Vendor Account";

    const vendorReference =
        vendor?.vendorId || vendor?.id || "Submitted";

    const studentName =
        student?.fullName ||
        student?.name ||
        "Student Account";

    const studentReference =
        student?.studentId ||
        student?.applicationId ||
        student?.id ||
        "Submitted";

    const hasApplications = Boolean(
        application || seller || vendor || student,
    );

    return (
        <main className="profile-page">
            <div className="profile-container">
                <header className="profile-page-header">
                    <div>
                        <span className="profile-eyebrow">NEED ONE SERVICE</span>
                        <h1>My Profile</h1>
                        <p>
                            Manage your account, explore opportunities and view your
                            activity.
                        </p>
                    </div>
                </header>

                {notice && (
                    <div className="profile-notice" role="status">
                        <Check size={17} />
                        <span>{notice}</span>
                        <button
                            type="button"
                            aria-label="Dismiss notification"
                            onClick={() => setNotice("")}
                        >
                            <X size={16} />
                        </button>
                    </div>
                )}

                <div className="profile-dashboard-top">
                    <section className="profile-welcome-card">
                        <div className="profile-welcome-decoration" />

                        <div className="profile-avatar">
                            <UserRound size={39} strokeWidth={1.6} />
                        </div>

                        <span className="profile-eyebrow">
                            YOUR ONESERVICE ACCOUNT
                        </span>

                        <h2>
                            Welcome to <span>NEED ONE SERVICE</span>
                        </h2>

                        {(displayName || user.name || user.fullName) && (
                            <p className="profile-greeting-name">
                                Hello, {displayName || user.name || user.fullName}
                            </p>
                        )}

                        <div className="profile-mobile">
                            <Phone size={17} />
                            <span>+91 {user.mobile}</span>

                            {user.mobileVerified === true && (
                                <span className="profile-verified-badge">
                                    <ShieldCheck size={14} />
                                    Verified
                                </span>
                            )}
                        </div>

                        <p className="profile-welcome-subtitle">
                            Your services, orders and account — all in one place.
                        </p>

                        <div className="profile-welcome-divider" />

                        <div className="profile-account-benefit">
                            <span className="profile-account-benefit-icon">
                                <ShieldCheck size={21} />
                            </span>
                            <span>
                                <strong>Your OneService account</strong>
                                <small>
                                    Explore services and manage your activity with ease.
                                </small>
                            </span>
                        </div>

                        <Link to="/services" className="profile-primary-button">
                            View Services <ArrowRight size={18} />
                        </Link>
                    </section>

                    <section className="profile-network-section">
                        {hasApplications ? (
                            <div className="profile-registered-accounts">
                                <div className="profile-section-heading">
                                    <span className="profile-section-eyebrow">
                                        YOUR ONESERVICE NETWORK
                                    </span>
                                    <h2>Your Registered Accounts</h2>
                                    <p>
                                        View all the roles and applications linked to your account.
                                    </p>
                                </div>

                                <div className="profile-network-grid">
                                    {application && (
                                        <article className="professional-hub" key="professional">
                                            <div className="professional-hub-heading">
                                                <div className="profile-section-heading">
                                                    <span className="profile-section-eyebrow">
                                                        YOUR PROFESSIONAL ACCOUNT
                                                    </span>
                                                    <h2>Professional Hub</h2>
                                                    <p>Your professional application status.</p>
                                                </div>
                                                <Link
                                                    to="/profile/professional-hub"
                                                    className="professional-hub-view-button"
                                                    aria-label="View your Professional Hub"
                                                    title="View your Professional Hub"
                                                >
                                                    <Eye size={17} />
                                                </Link>
                                            </div>

                                            <div className="professional-hub-summary">
                                                <div className="professional-hub-summary-main">
                                                    <div className="professional-hub-avatar">
                                                        <Wrench size={24} />
                                                    </div>
                                                    <div className="professional-hub-identity">
                                                        <h3>{application.fullName}</h3>
                                                        <p>{application.category || "Professional applicant"}</p>
                                                    </div>
                                                    <span className={`professional-status professional-status-${applicationStatus.toLowerCase().replace(/\s+/g, "-")}`}>
                                                        <span className="professional-status-dot" />
                                                        {applicationStatus}
                                                    </span>
                                                </div>

                                                <div className="professional-hub-reference">
                                                    <span>Application ID</span>
                                                    <strong>{application.id}</strong>
                                                </div>

                                                <div className="professional-hub-summary-details">
                                                    <div><Phone size={16} /><span>{application.mobile || "Not provided"}</span></div>
                                                    <div><Mail size={16} /><span>{application.email || "Not provided"}</span></div>
                                                    <div><MapPin size={16} /><span>{[application.city, application.state].filter(Boolean).join(", ") || "Location not provided"}</span></div>
                                                </div>

                                                <Link to="/profile/professional-hub" className="professional-hub-open-link">
                                                    <LayoutDashboard size={16} />
                                                    View Your Account
                                                    <ArrowRight size={16} />
                                                </Link>
                                            </div>
                                        </article>
                                    )}

                                    {seller && (
                                        <article className="professional-hub seller-hub" key="seller">
                                            <div className="professional-hub-heading">
                                                <div className="profile-section-heading">
                                                    <span className="profile-section-eyebrow">
                                                        YOUR SELLER ACCOUNT
                                                    </span>
                                                    <h2>Seller Hub</h2>
                                                    <p>Your seller application status.</p>
                                                </div>
                                                <Link
                                                    to="/profile/seller-hub"
                                                    className="professional-hub-view-button"
                                                    aria-label="View your Seller Hub"
                                                    title="View your Seller Hub"
                                                >
                                                    <Eye size={17} />
                                                </Link>
                                            </div>

                                            <div className="professional-hub-summary">
                                                <div className="professional-hub-summary-main">
                                                    <div className="professional-hub-avatar">
                                                        <ShoppingBag size={24} />
                                                    </div>
                                                    <div className="professional-hub-identity">
                                                        <h3>{sellerName}</h3>
                                                        <p>{seller.category || seller.businessType || "Registered Seller"}</p>
                                                        {sellerOwnerName && sellerOwnerName !== sellerName && (
                                                            <p>Owner: {sellerOwnerName}</p>
                                                        )}
                                                    </div>
                                                    <span className={`professional-status professional-status-${sellerStatus.toLowerCase().replace(/\s+/g, "-")}`}>
                                                        <span className="professional-status-dot" />
                                                        {sellerStatus}
                                                    </span>
                                                </div>

                                                <div className="professional-hub-reference">
                                                    <span>Seller Reference</span>
                                                    <strong>{sellerReference}</strong>
                                                </div>

                                                <div className="professional-hub-summary-details">
                                                    <div><Phone size={16} /><span>{seller.mobile || seller.phone || "Not provided"}</span></div>
                                                    <div><Mail size={16} /><span>{seller.email || "Not provided"}</span></div>
                                                    <div><MapPin size={16} /><span>{[seller.city, seller.state].filter(Boolean).join(", ") || seller.address || "Location not provided"}</span></div>
                                                </div>

                                                <Link to="/seller-hub" className="professional-hub-open-link">
                                                    <LayoutDashboard size={16} />
                                                    View Your Seller Account
                                                    <ArrowRight size={16} />
                                                </Link>
                                            </div>
                                        </article>
                                    )}

                                    {vendor && (
                                        <article className="professional-hub" key="vendor">
                                            <div className="professional-hub-heading">
                                                <div className="profile-section-heading">
                                                    <span className="profile-section-eyebrow">
                                                        YOUR VENDOR ACCOUNT
                                                    </span>
                                                    <h2>Vendor Hub</h2>
                                                    <p>Your vendor application status.</p>
                                                </div>
                                                <Link
                                                    to="/vendor-hub"
                                                    className="professional-hub-view-button"
                                                    aria-label="View your Vendor Hub"
                                                    title="View your Vendor Hub"
                                                >
                                                    <Eye size={17} />
                                                </Link>
                                            </div>

                                            <div className="professional-hub-summary">
                                                <div className="professional-hub-summary-main">
                                                    <div className="professional-hub-avatar">
                                                        <Store size={24} />
                                                    </div>
                                                    <div className="professional-hub-identity">
                                                        <h3>{vendorName}</h3>
                                                        <p>{vendor.businessCategory || vendor.businessType || "Registered Vendor"}</p>
                                                    </div>
                                                    <span className={`professional-status professional-status-${vendorStatus.toLowerCase().replace(/\s+/g, "-")}`}>
                                                        <span className="professional-status-dot" />
                                                        {vendorStatus}
                                                    </span>
                                                </div>

                                                <div className="professional-hub-reference">
                                                    <span>Vendor Reference</span>
                                                    <strong>{vendorReference}</strong>
                                                </div>

                                                <div className="professional-hub-summary-details">
                                                    <div><Phone size={16} /><span>{vendor.mobile || vendor.phone || "Not provided"}</span></div>
                                                    <div><Mail size={16} /><span>{vendor.email || "Not provided"}</span></div>
                                                    <div><MapPin size={16} /><span>{[vendor.city, vendor.state].filter(Boolean).join(", ") || vendor.businessAddress || "Location not provided"}</span></div>
                                                </div>

                                                <Link to="/vendor-hub" className="professional-hub-open-link">
                                                    <LayoutDashboard size={16} />
                                                    View Your Vendor Account
                                                    <ArrowRight size={16} />
                                                </Link>
                                            </div>
                                        </article>
                                    )}

                                    {student && (
                                        <article className="professional-hub" key="student">
                                            <div className="professional-hub-heading">
                                                <div className="profile-section-heading">
                                                    <span className="profile-section-eyebrow">
                                                        YOUR STUDENT ACCOUNT
                                                    </span>
                                                    <h2>Student Hub</h2>
                                                    <p>Your student registration status.</p>
                                                </div>
                                                <Link
                                                    to="/student-hub"
                                                    className="professional-hub-view-button"
                                                    aria-label="View your Student Hub"
                                                    title="View your Student Hub"
                                                >
                                                    <Eye size={17} />
                                                </Link>
                                            </div>

                                            <div className="professional-hub-summary">
                                                <div className="professional-hub-summary-main">
                                                    <div className="professional-hub-avatar">
                                                        <GraduationCap size={24} />
                                                    </div>
                                                    <div className="professional-hub-identity">
                                                        <h3>{studentName}</h3>
                                                        <p>Registered Student</p>
                                                    </div>
                                                    <span className={`professional-status professional-status-${studentStatus.toLowerCase().replace(/\s+/g, "-")}`}>
                                                        <span className="professional-status-dot" />
                                                        {studentStatus}
                                                    </span>
                                                </div>

                                                <div className="professional-hub-reference">
                                                    <span>Student Reference</span>
                                                    <strong>{studentReference}</strong>
                                                </div>

                                                <div className="professional-hub-summary-details">
                                                    <div><Phone size={16} /><span>{student.mobile || student.phone || "Not provided"}</span></div>
                                                    <div><Mail size={16} /><span>{student.email || "Not provided"}</span></div>
                                                    <div><MapPin size={16} /><span>{[student.city, student.state].filter(Boolean).join(", ") || "Location not provided"}</span></div>
                                                </div>

                                                <Link to="/student-hub" className="professional-hub-open-link">
                                                    <LayoutDashboard size={16} />
                                                    View Your Student Account
                                                    <ArrowRight size={16} />
                                                </Link>
                                            </div>
                                        </article>
                                    )}
                                </div>

                                <div className="profile-section-heading profile-add-another-role">
                                    <h2>Join in another role</h2>
                                    <p>You can register for more than one OneService opportunity.</p>
                                </div>

                                <div className="profile-network-grid">
                                    {NETWORK_OPTIONS.filter((option) => {
                                        const title = option.title.toLowerCase();
                                        return !(
                                            (title === "professional" && application) ||
                                            (title === "seller" && seller) ||
                                            (title === "vendor" && vendor) ||
                                            (title === "student" && student)
                                        );
                                    }).map((option) => {
                                        const Icon = option.icon;

                                        return (
                                            <Link
                                                to={option.path}
                                                className="profile-network-card"
                                                key={option.title}
                                            >
                                                <div className="profile-network-card-top">
                                                    <span className="profile-network-icon">
                                                        <Icon size={20} strokeWidth={1.8} />
                                                    </span>
                                                    <ArrowRight className="profile-network-arrow" size={17} />
                                                </div>
                                                <h3>Join as a {option.title}</h3>
                                                <p>{option.description}</p>
                                                <span className="profile-network-link">
                                                    Get started <ArrowRight size={14} />
                                                </span>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="profile-section-heading">
                                    <span className="profile-section-eyebrow">GROW WITH US</span>
                                    <h2>Join the OneService Network</h2>
                                    <p>Choose how you want to be part of our community.</p>
                                </div>

                                <div className="profile-network-grid">
                                    {NETWORK_OPTIONS.map((option) => {
                                        const Icon = option.icon;

                                        return (
                                            <Link
                                                to={option.path}
                                                className="profile-network-card"
                                                key={option.title}
                                            >
                                                <div className="profile-network-card-top">
                                                    <span className="profile-network-icon">
                                                        <Icon size={20} strokeWidth={1.8} />
                                                    </span>
                                                    <ArrowRight className="profile-network-arrow" size={17} />
                                                </div>
                                                <h3>Join as a {option.title}</h3>
                                                <p>{option.description}</p>
                                                <span className="profile-network-link">
                                                    Get started <ArrowRight size={14} />
                                                </span>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </>
                        )}
                    </section>
                </div>

                {/* Order History */}
                <section className={`profile-content-section profile-order-section ${showAllOrders ? "profile-order-section-expanded" : ""}`}>
                    <div className="profile-order-heading-row">
                        <div className="profile-content-heading">
                            <div className="profile-heading-icon">
                                <ClipboardList size={21} />
                            </div>
                            <div>
                                <h2>Order History</h2>
                                <p>Keep track of your service bookings and product orders.</p>
                            </div>
                        </div>

                        <div className="profile-order-compact-filters">
                            <div className="profile-order-search">
                                <Search size={17} aria-hidden="true" />
                                <input
                                    type="search"
                                    value={orderSearch}
                                    onChange={(event) => setOrderSearch(event.target.value)}
                                    placeholder="Search orders..."
                                    aria-label="Search orders by name or ID"
                                />
                                {orderSearch && (
                                    <button type="button" onClick={() => setOrderSearch("")} aria-label="Clear search">
                                        <X size={15} />
                                    </button>
                                )}
                            </div>

                            <div className="profile-order-filter-field">
                                <label htmlFor="profile-order-type">Order type</label>
                                <select
                                    id="profile-order-type"
                                    value={orderTypeFilter}
                                    onChange={(event) => setOrderTypeFilter(event.target.value as OrderTypeFilter)}
                                >
                                    <option value="all">All orders</option>
                                    <option value="service">Service bookings</option>
                                    <option value="product">Product orders</option>
                                </select>
                            </div>

                            <div className="profile-order-filter-field">
                                <label htmlFor="profile-order-status">Status</label>
                                <select
                                    id="profile-order-status"
                                    value={orderStatusFilter}
                                    onChange={(event) => setOrderStatusFilter(event.target.value)}
                                >
                                    {ORDER_STATUS_OPTIONS.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="profile-order-filter-field">
                                <label htmlFor="profile-order-sort">Sort by date</label>
                                <select
                                    id="profile-order-sort"
                                    value={orderDateSort}
                                    onChange={(event) => setOrderDateSort(event.target.value as OrderDateSort)}
                                >
                                    <option value="newest">Newest first</option>
                                    <option value="oldest">Oldest first</option>
                                </select>
                            </div>

                            <button
                                type="button"
                                className="profile-order-clear-filters"
                                onClick={clearOrderFilters}
                                disabled={!hasActiveOrderFilters}
                            >
                                Clear
                            </button>
                        </div>
                    </div>

                    <div className="profile-order-content">
                        <div className="profile-order-results">
                            <span>
                                Showing <strong>{visibleOrders.length}</strong> of{" "}
                                <strong>{filteredOrders.length}</strong>{" "}
                                {filteredOrders.length === 1 ? "matching order" : "matching orders"}
                            </span>

                            {orderHistory.length > 0 && (
                                <span className="profile-order-total">
                                    Total orders: {orderHistory.length}
                                </span>
                            )}
                        </div>

                        {orderHistory.length === 0 ? (
                            <div className="profile-order-empty">
                                <div className="profile-order-empty-icon">
                                    <Package size={29} />
                                </div>
                                <div className="profile-order-empty-copy">
                                    <h3>Your orders will appear here</h3>
                                    <p>
                                        Once you book a service or place a product order,
                                        you can view its details and track its status here.
                                    </p>
                                </div>
                            </div>
                        ) : filteredOrders.length === 0 ? (
                            <div className="profile-order-no-results">
                                <div className="profile-order-empty-icon">
                                    <Search size={25} />
                                </div>
                                <h3>No matching orders</h3>
                                <p>Try changing your search or selecting different filters.</p>
                                <button type="button" className="profile-outline-button" onClick={clearOrderFilters}>
                                    Clear filters
                                </button>
                            </div>
                        ) : (
                            <div className="profile-order-list">
                                <div className="profile-order-items">
                                    {visibleOrders.map((order) => {
                                        const isService = ["service", "booking"].includes(
                                            (order.type ?? "").toLowerCase(),
                                        );
                                        const amount = order.amount === undefined ? "" : formatOrderAmount(order.amount);

                                        return (
                                            <article className="profile-order-item" key={order.id}>
                                                <div className="profile-order-item-icon">
                                                    {isService ? <Wrench size={21} /> : <Package size={21} />}
                                                </div>
                                                <div className="profile-order-item-details">
                                                    <h4>{order.title}</h4>
                                                    <p>Order ID: {order.id}</p>
                                                    {order.date && <p>{formatOrderDate(order.date)}</p>}
                                                    <p>{isService ? "Service booking" : "Product order"}</p>
                                                </div>
                                                <div className="profile-order-item-meta">
                                                    <span className="profile-order-status">{order.status}</span>
                                                    {amount && <strong>{amount}</strong>}
                                                </div>
                                            </article>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="profile-order-footer">
                        <span className="profile-order-footer-count">
                            Showing {visibleOrders.length} of {filteredOrders.length}{" "}
                            {filteredOrders.length === 1 ? "order" : "orders"}
                        </span>
                        <button
                            type="button"
                            className="profile-outline-button profile-view-all-orders"
                            aria-expanded={showAllOrders}
                            onClick={toggleOrderHistory}
                            disabled={filteredOrders.length === 0}
                        >
                            {showAllOrders ? "Show Less" : "View All"}
                            <ChevronRight size={17} className={showAllOrders ? "profile-orders-chevron-open" : ""} />
                        </button>
                    </div>
                </section>

                {/* Account Settings */}
                <section className="profile-content-section profile-settings-section">
                    <div className="profile-content-heading">
                        <div className="profile-heading-icon">
                            <SettingsIcon size={21} />
                        </div>
                        <div>
                            <h2>Settings</h2>
                            <p>Personalise your account and manage your preferences.</p>
                        </div>
                    </div>

                    <div className="profile-settings-layout">
                        <div className="profile-settings-group">
                            <h3>Account</h3>

                            <button type="button" className="profile-setting-row" onClick={() => setActiveModal("personal")}>
                                <span className="profile-setting-icon"><UserCog size={19} /></span>
                                <span className="profile-setting-copy">
                                    <strong>Personal details</strong>
                                    <small>Update your name and email address</small>
                                </span>
                                <ChevronRight size={18} />
                            </button>

                            <button type="button" className="profile-setting-row" onClick={() => setActiveModal("address")}>
                                <span className="profile-setting-icon"><MapPin size={19} /></span>
                                <span className="profile-setting-copy">
                                    <strong>Saved address</strong>
                                    <small>{savedAddress || "Add your preferred service address"}</small>
                                </span>
                                <ChevronRight size={18} />
                            </button>

                            <button type="button" className="profile-setting-row" onClick={() => setActiveModal("privacy")}>
                                <span className="profile-setting-icon"><LockKeyhole size={19} /></span>
                                <span className="profile-setting-copy">
                                    <strong>Privacy and security</strong>
                                    <small>Review account and privacy information</small>
                                </span>
                                <ChevronRight size={18} />
                            </button>
                        </div>

                        <div className="profile-settings-group">
                            <h3>Preferences</h3>

                            <div className="profile-setting-row">
                                <span className="profile-setting-icon"><Bell size={19} /></span>
                                <span className="profile-setting-copy">
                                    <strong>Service updates</strong>
                                    <small>Receive important service notifications</small>
                                </span>
                                <button type="button" role="switch" aria-checked={settings.serviceUpdates} aria-label="Service updates" className={`profile-toggle ${settings.serviceUpdates ? "is-on" : ""}`} onClick={() => updateSettings({ ...settings, serviceUpdates: !settings.serviceUpdates })}>
                                    <span />
                                </button>
                            </div>

                            <div className="profile-setting-row">
                                <span className="profile-setting-icon"><Package size={19} /></span>
                                <span className="profile-setting-copy">
                                    <strong>Order notifications</strong>
                                    <small>Updates about bookings and product orders</small>
                                </span>
                                <button type="button" role="switch" aria-checked={settings.orderUpdates} aria-label="Order notifications" className={`profile-toggle ${settings.orderUpdates ? "is-on" : ""}`} onClick={() => updateSettings({ ...settings, orderUpdates: !settings.orderUpdates })}>
                                    <span />
                                </button>
                            </div>

                            <div className="profile-setting-row">
                                <span className="profile-setting-icon"><Bell size={19} /></span>
                                <span className="profile-setting-copy">
                                    <strong>Offers and promotions</strong>
                                    <small>Hear about offers and new services</small>
                                </span>
                                <button type="button" role="switch" aria-checked={settings.promotionalUpdates} aria-label="Offers and promotions" className={`profile-toggle ${settings.promotionalUpdates ? "is-on" : ""}`} onClick={() => updateSettings({ ...settings, promotionalUpdates: !settings.promotionalUpdates })}>
                                    <span />
                                </button>
                            </div>
                        </div>

                        <div className="profile-settings-group profile-support-group">
                            <h3>Support</h3>

                            <button type="button" className="profile-setting-row" onClick={() => setActiveModal("help")}>
                                <span className="profile-setting-icon"><CircleHelp size={19} /></span>
                                <span className="profile-setting-copy">
                                    <strong>Help and support</strong>
                                    <small>Get help with your OneService account</small>
                                </span>
                                <ChevronRight size={18} />
                            </button>

                            <button type="button" className="profile-setting-row profile-logout-row" onClick={handleLogout}>
                                <span className="profile-setting-icon"><LogOut size={19} /></span>
                                <span className="profile-setting-copy">
                                    <strong>Logout</strong>
                                    <small>Sign out of your OneService account</small>
                                </span>
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                </section>

                <footer className="profile-page-footer">
                    <ShieldCheck size={15} />
                    Your account preferences are saved on this device.
                </footer>
            </div>

            {/* Account Settings Modals */}
            {activeModal && (
                <div
                    className="profile-modal-backdrop"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) {
                            setActiveModal(null);
                        }
                    }}
                >
                    <section className="profile-modal" role="dialog" aria-modal="true" aria-labelledby="profile-modal-title">
                        <div className="profile-modal-header">
                            <div>
                                <span className="profile-section-eyebrow">ACCOUNT SETTINGS</span>
                                <h2 id="profile-modal-title">
                                    {activeModal === "personal" && "Personal details"}
                                    {activeModal === "address" && "Saved address"}
                                    {activeModal === "privacy" && "Privacy and security"}
                                    {activeModal === "help" && "Help and support"}
                                </h2>
                            </div>
                            <button type="button" className="profile-modal-close" aria-label="Close dialog" onClick={() => setActiveModal(null)}>
                                <X size={20} />
                            </button>
                        </div>

                        {activeModal === "personal" && (
                            <div className="profile-modal-body">
                                <label className="profile-form-label" htmlFor="profile-name">Full name</label>
                                <input id="profile-name" className="profile-form-input" value={displayName} onChange={(event) => setDisplayName(event.target.value)} placeholder="Enter your full name" />

                                <label className="profile-form-label" htmlFor="profile-email">Email address</label>
                                <input id="profile-email" type="email" className="profile-form-input" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Enter your email address" />

                                <label className="profile-form-label" htmlFor="profile-mobile">Registered mobile number</label>
                                <input id="profile-mobile" className="profile-form-input is-readonly" value={`+91 ${user.mobile}`} readOnly />

                                <button type="button" className="profile-primary-button profile-modal-submit" onClick={handlePersonalSave}>
                                    Save details <Check size={17} />
                                </button>
                            </div>
                        )}

                        {activeModal === "address" && (
                            <div className="profile-modal-body">
                                <p className="profile-modal-description">
                                    Add the address you usually use for home services and deliveries.
                                </p>
                                <label className="profile-form-label" htmlFor="profile-address">Complete address</label>
                                <textarea id="profile-address" className="profile-form-input profile-address-input" value={address} onChange={(event) => setAddress(event.target.value)} placeholder="House/flat, street, area, city and PIN code" rows={4} />
                                <button type="button" className="profile-primary-button profile-modal-submit" disabled={!address.trim()} onClick={handleAddressSave}>
                                    Save address <Check size={17} />
                                </button>
                            </div>
                        )}

                        {activeModal === "privacy" && (
                            <div className="profile-modal-body">
                                <div className="profile-info-panel">
                                    <ShieldCheck size={23} />
                                    <div>
                                        <strong>Account protection</strong>
                                        <p>
                                            Your account is currently signed in on this device. Keep your login details private and sign out when using a shared device.
                                        </p>
                                    </div>
                                </div>
                                <div className="profile-info-panel">
                                    <Phone size={22} />
                                    <div>
                                        <strong>Registered mobile</strong>
                                        <p>+91 {user.mobile}</p>
                                        <small>
                                            {user.mobileVerified === true
                                                ? "This account has a verified mobile flag."
                                                : "Mobile verification status is not confirmed in this account record."}
                                        </small>
                                    </div>
                                </div>
                                <p className="profile-modal-description">
                                    This frontend page does not change server-side security, password, or authentication settings.
                                </p>
                            </div>
                        )}

                        {activeModal === "help" && (
                            <div className="profile-modal-body">
                                <div className="profile-info-panel">
                                    <CircleHelp size={23} />
                                    <div>
                                        <strong>Need help with OneService?</strong>
                                        <p>For booking, order or account assistance, visit our Contact page.</p>
                                        <Link to="/contact" className="profile-modal-text-link" onClick={() => setActiveModal(null)}>
                                            Contact OneService <ArrowRight size={15} />
                                        </Link>
                                    </div>
                                </div>
                                <div className="profile-info-panel">
                                    <MapPin size={22} />
                                    <div>
                                        <strong>Before booking</strong>
                                        <p>Keep your contact number and service address up to date so providers can reach you.</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </section>
                </div>
            )}
        </main>
    );
}

export default ProfilePage;
