
import { useEffect, useState } from "react";
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
} from "lucide-react";
import "./ProfilePage.css";

type ServiceUser = {
    mobile: string;
    loggedIn: boolean;
    mobileVerified?: boolean;
    name?: string;
    email?: string;
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
    mobile: string;
    email: string;
    city: string;
    state: string;
    category: string;
    services: string[];
    experience: string;
    workType: string;
    workingDays: string[];
    serviceArea: string;
    submittedAt: string;
    status: string;
};

const DEFAULT_SETTINGS: AccountSettings = {
    language: "English",
    serviceUpdates: true,
    promotionalUpdates: false,
    orderUpdates: true,
};

const PROFESSIONAL_APPLICATION_KEY =
    "oneservice_professional_application";

const PROFESSIONAL_NOTICE_KEY =
    "oneservice_professional_notice";

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
        path: "/accessories-sales",
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
            !application.fullName ||
            !application.id
        ) {
            return null;
        }

        return application;
    } catch {
        return null;
    }
}

function ProfilePage() {
    const navigate = useNavigate();

    const [user, setUser] = useState<ServiceUser | null>(null);
    const [settings, setSettings] = useState<AccountSettings>(DEFAULT_SETTINGS);
    const [activeModal, setActiveModal] = useState<
        "personal" | "address" | "privacy" | "help" | null
    >(null);
    const [displayName, setDisplayName] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");
    const [savedAddress, setSavedAddress] = useState("");
    const [notice, setNotice] = useState("");
    const [professionalApplication, setProfessionalApplication] =
        useState<ProfessionalApplication | null>(null);

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
            setDisplayName(parsed.name ?? "");
            setEmail(parsed.email ?? "");
            setSettings(readSettings());

            const storedAddress =
                localStorage.getItem("oneservice_saved_address") ?? "";

            setSavedAddress(storedAddress);
            setAddress(storedAddress);
            setProfessionalApplication(readProfessionalApplication());

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

        window.addEventListener(
            "oneservice-professional-change",
            refreshProfessionalApplication,
        );
        window.addEventListener("storage", refreshProfessionalApplication);

        return () => {
            window.removeEventListener(
                "oneservice-professional-change",
                refreshProfessionalApplication,
            );
            window.removeEventListener("storage", refreshProfessionalApplication);
        };
    }, []);

    const updateSettings = (next: AccountSettings) => {
        setSettings(next);
        localStorage.setItem("oneservice_profile_settings", JSON.stringify(next));
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

    if (!user) return null;

    const application = professionalApplication;

    const applicationStatus =
        application?.status?.toLowerCase() === "approved"
            ? "Approved"
            : application?.status?.toLowerCase() === "rejected"
                ? "Rejected"
                : "Pending Review";

    return (
        <main className="profile-page">
            <div className="profile-container">
                <header className="profile-page-header">
                    <div>
                        <span className="profile-eyebrow">NEED ONE SERVICE</span>
                        <h1>My Profile</h1>
                        <p>
                            Manage your account, explore opportunities and view your activity.
                        </p>
                    </div>

                    <Link to="/services" className="profile-header-link">
                        Explore services <ArrowRight size={17} />
                    </Link>
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

                {/* Main dashboard: welcome card on the left, compact account panel on the right. */}
                <div className="profile-dashboard-top">
                    <section className="profile-welcome-card">
                        <div className="profile-welcome-decoration" />

                        <div className="profile-avatar">
                            <UserRound size={39} strokeWidth={1.6} />
                        </div>

                        <span className="profile-eyebrow">YOUR ONESERVICE ACCOUNT</span>

                        <h2>
                            Welcome to <span>NEED ONE SERVICE</span>
                        </h2>

                        {(displayName || user.name) && (
                            <p className="profile-greeting-name">
                                Hello, {displayName || user.name}
                            </p>
                        )}

                        <div className="profile-mobile">
                            <Phone size={17} />
                            <span>+91 {user.mobile}</span>
                            {user.mobileVerified === true && (
                                <span className="profile-verified-badge">
                                    <ShieldCheck size={14} /> Verified
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
                        {application ? (
                            <div className="professional-hub">
                                <div className="professional-hub-heading">
                                    <div className="profile-section-heading">
                                        <span className="profile-section-eyebrow">
                                            YOUR PROFESSIONAL ACCOUNT
                                        </span>
                                        <h2>Professional Hub</h2>
                                        <p>
                                            Your professional account and application status.
                                        </p>
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
                                            <p>
                                                {application.category || "Professional applicant"}
                                            </p>
                                        </div>

                                        <span
                                            className={`professional-status professional-status-${applicationStatus
                                                .toLowerCase()
                                                .replace(/\s+/g, "-")}`}
                                        >
                                            <span className="professional-status-dot" />
                                            {applicationStatus}
                                        </span>
                                    </div>

                                    <div className="professional-hub-reference">
                                        <span>Application ID</span>
                                        <strong>{application.id}</strong>
                                    </div>

                                    <div className="professional-hub-summary-details">
                                        <div>
                                            <Phone size={16} />
                                            <span>{application.mobile || "Not provided"}</span>
                                        </div>

                                        <div>
                                            <Mail size={16} />
                                            <span>{application.email || "Not provided"}</span>
                                        </div>

                                        <div>
                                            <MapPin size={16} />
                                            <span>
                                                {[application.city, application.state]
                                                    .filter(Boolean)
                                                    .join(", ") || "Location not provided"}
                                            </span>
                                        </div>
                                    </div>

                                    <Link
                                        to="/profile/professional-hub"
                                        className="professional-hub-open-link"
                                    >
                                        <LayoutDashboard size={16} />
                                        View Your Account
                                        <ArrowRight size={16} />
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="profile-section-heading">
                                    <span className="profile-section-eyebrow">GROW WITH US</span>
                                    <h2>Join the OneService Network</h2>
                                    <p>
                                        Choose how you want to be part of our community.
                                    </p>
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
                                                    <ArrowRight
                                                        className="profile-network-arrow"
                                                        size={17}
                                                    />
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
                <section className="profile-content-section profile-order-section">
                    <div className="profile-content-heading">
                        <div className="profile-heading-icon">
                            <ClipboardList size={21} />
                        </div>
                        <div>
                            <h2>Order History</h2>
                            <p>
                                Keep track of your service bookings and product orders.
                            </p>
                        </div>
                    </div>

                    <div className="profile-order-content">
                        <div className="profile-order-empty-icon">
                            <Package size={27} />
                        </div>
                        <div className="profile-order-empty-copy">
                            <h3>Your orders will appear here</h3>
                            <p>
                                Once you book a service or place a product order, you can
                                view its details and track its status here.
                            </p>
                        </div>
                        <Link to="/services" className="profile-outline-button">
                            Browse services <ArrowRight size={16} />
                        </Link>
                    </div>
                </section>

                {/* Website-specific account settings */}
                <section className="profile-content-section profile-settings-section">
                    <div className="profile-content-heading">
                        <div className="profile-heading-icon">
                            <SettingsIcon size={21} />
                        </div>
                        <div>
                            <h2>Settings</h2>
                            <p>
                                Personalise your account and manage your preferences.
                            </p>
                        </div>
                    </div>

                    <div className="profile-settings-layout">
                        <div className="profile-settings-group">
                            <h3>Account</h3>

                            <button
                                type="button"
                                className="profile-setting-row"
                                onClick={() => setActiveModal("personal")}
                            >
                                <span className="profile-setting-icon">
                                    <UserCog size={19} />
                                </span>
                                <span className="profile-setting-copy">
                                    <strong>Personal details</strong>
                                    <small>Update your name and email address</small>
                                </span>
                                <ChevronRight size={18} />
                            </button>

                            <button
                                type="button"
                                className="profile-setting-row"
                                onClick={() => setActiveModal("address")}
                            >
                                <span className="profile-setting-icon">
                                    <MapPin size={19} />
                                </span>
                                <span className="profile-setting-copy">
                                    <strong>Saved address</strong>
                                    <small>
                                        {savedAddress || "Add your preferred service address"}
                                    </small>
                                </span>
                                <ChevronRight size={18} />
                            </button>

                            <button
                                type="button"
                                className="profile-setting-row"
                                onClick={() => setActiveModal("privacy")}
                            >
                                <span className="profile-setting-icon">
                                    <LockKeyhole size={19} />
                                </span>
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
                                <span className="profile-setting-icon">
                                    <Bell size={19} />
                                </span>
                                <span className="profile-setting-copy">
                                    <strong>Service updates</strong>
                                    <small>Receive important service notifications</small>
                                </span>
                                <button
                                    type="button"
                                    role="switch"
                                    aria-checked={settings.serviceUpdates}
                                    aria-label="Service updates"
                                    className={`profile-toggle ${settings.serviceUpdates ? "is-on" : ""}`}
                                    onClick={() =>
                                        updateSettings({
                                            ...settings,
                                            serviceUpdates: !settings.serviceUpdates,
                                        })
                                    }
                                >
                                    <span />
                                </button>
                            </div>

                            <div className="profile-setting-row">
                                <span className="profile-setting-icon">
                                    <Package size={19} />
                                </span>
                                <span className="profile-setting-copy">
                                    <strong>Order notifications</strong>
                                    <small>Updates about bookings and product orders</small>
                                </span>
                                <button
                                    type="button"
                                    role="switch"
                                    aria-checked={settings.orderUpdates}
                                    aria-label="Order notifications"
                                    className={`profile-toggle ${settings.orderUpdates ? "is-on" : ""}`}
                                    onClick={() =>
                                        updateSettings({
                                            ...settings,
                                            orderUpdates: !settings.orderUpdates,
                                        })
                                    }
                                >
                                    <span />
                                </button>
                            </div>

                            <div className="profile-setting-row">
                                <span className="profile-setting-icon">
                                    <Bell size={19} />
                                </span>
                                <span className="profile-setting-copy">
                                    <strong>Offers and promotions</strong>
                                    <small>Hear about offers and new services</small>
                                </span>
                                <button
                                    type="button"
                                    role="switch"
                                    aria-checked={settings.promotionalUpdates}
                                    aria-label="Offers and promotions"
                                    className={`profile-toggle ${settings.promotionalUpdates ? "is-on" : ""}`}
                                    onClick={() =>
                                        updateSettings({
                                            ...settings,
                                            promotionalUpdates: !settings.promotionalUpdates,
                                        })
                                    }
                                >
                                    <span />
                                </button>
                            </div>
                        </div>

                        <div className="profile-settings-group profile-support-group">
                            <h3>Support</h3>

                            <button
                                type="button"
                                className="profile-setting-row"
                                onClick={() => setActiveModal("help")}
                            >
                                <span className="profile-setting-icon">
                                    <CircleHelp size={19} />
                                </span>
                                <span className="profile-setting-copy">
                                    <strong>Help and support</strong>
                                    <small>Get help with your OneService account</small>
                                </span>
                                <ChevronRight size={18} />
                            </button>

                            <button
                                type="button"
                                className="profile-setting-row profile-logout-row"
                                onClick={handleLogout}
                            >
                                <span className="profile-setting-icon">
                                    <LogOut size={19} />
                                </span>
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

            {activeModal && (
                <div
                    className="profile-modal-backdrop"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) {
                            setActiveModal(null);
                        }
                    }}
                >
                    <section
                        className="profile-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="profile-modal-title"
                    >
                        <div className="profile-modal-header">
                            <div>
                                <span className="profile-section-eyebrow">
                                    ACCOUNT SETTINGS
                                </span>
                                <h2 id="profile-modal-title">
                                    {activeModal === "personal" && "Personal details"}
                                    {activeModal === "address" && "Saved address"}
                                    {activeModal === "privacy" && "Privacy and security"}
                                    {activeModal === "help" && "Help and support"}
                                </h2>
                            </div>

                            <button
                                type="button"
                                className="profile-modal-close"
                                aria-label="Close dialog"
                                onClick={() => setActiveModal(null)}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {activeModal === "personal" && (
                            <div className="profile-modal-body">
                                <label className="profile-form-label" htmlFor="profile-name">
                                    Full name
                                </label>
                                <input
                                    id="profile-name"
                                    className="profile-form-input"
                                    value={displayName}
                                    onChange={(event) => setDisplayName(event.target.value)}
                                    placeholder="Enter your full name"
                                />

                                <label className="profile-form-label" htmlFor="profile-email">
                                    Email address
                                </label>
                                <input
                                    id="profile-email"
                                    type="email"
                                    className="profile-form-input"
                                    value={email}
                                    onChange={(event) => setEmail(event.target.value)}
                                    placeholder="Enter your email address"
                                />

                                <label className="profile-form-label" htmlFor="profile-mobile">
                                    Registered mobile number
                                </label>
                                <input
                                    id="profile-mobile"
                                    className="profile-form-input is-readonly"
                                    value={`+91 ${user.mobile}`}
                                    readOnly
                                />

                                <button
                                    type="button"
                                    className="profile-primary-button profile-modal-submit"
                                    onClick={handlePersonalSave}
                                >
                                    Save details <Check size={17} />
                                </button>
                            </div>
                        )}

                        {activeModal === "address" && (
                            <div className="profile-modal-body">
                                <p className="profile-modal-description">
                                    Add the address you usually use for home services and deliveries.
                                </p>
                                <label
                                    className="profile-form-label"
                                    htmlFor="profile-address"
                                >
                                    Complete address
                                </label>
                                <textarea
                                    id="profile-address"
                                    className="profile-form-input profile-address-input"
                                    value={address}
                                    onChange={(event) => setAddress(event.target.value)}
                                    placeholder="House/flat, street, area, city and PIN code"
                                    rows={4}
                                />
                                <button
                                    type="button"
                                    className="profile-primary-button profile-modal-submit"
                                    disabled={!address.trim()}
                                    onClick={handleAddressSave}
                                >
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
                                            Your account is currently signed in on this device.
                                            Keep your login details private and sign out when using a
                                            shared device.
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
                                    This frontend page does not change server-side security,
                                    password, or authentication settings.
                                </p>
                            </div>
                        )}

                        {activeModal === "help" && (
                            <div className="profile-modal-body">
                                <div className="profile-info-panel">
                                    <CircleHelp size={23} />
                                    <div>
                                        <strong>Need help with OneService?</strong>
                                        <p>
                                            For booking, order or account assistance, visit our
                                            Contact page.
                                        </p>
                                        <Link
                                            to="/contact"
                                            className="profile-modal-text-link"
                                            onClick={() => setActiveModal(null)}
                                        >
                                            Contact OneService <ArrowRight size={15} />
                                        </Link>
                                    </div>
                                </div>

                                <div className="profile-info-panel">
                                    <MapPin size={22} />
                                    <div>
                                        <strong>Before booking</strong>
                                        <p>
                                            Keep your contact number and service address up to date
                                            so providers can reach you.
                                        </p>
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
