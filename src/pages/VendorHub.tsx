
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    ArrowDownRight,
    ArrowLeft,
    ArrowRight,
    BadgeCheck,
    Ban,
    Building2,
    CalendarClock,
    Check,
    CheckCircle2,
    ChevronRight,
    Clock3,
    Eye,
    FileText,
    Image as ImageIcon,
    Info,
    Mail,
    MapPin,
    MessageCircle,
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
    UserRound,
    //   Wallet,
    X,
} from "lucide-react";
import "./VendorHub.css";

type TabId =
    | "overview"
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

const initialBusiness: BusinessDetails = {
    name: "Your Business Name",
    category: "Business & Professional Services",
    description:
        "Tell customers about your business, what makes you different, and how your products or services can help them.",
    address: "Madhurawada, Visakhapatnam",
    phone: "",
    email: "",
    website: "",
    rating: 4.7,
    reviewCount: 98,
    verified: true,
    open: true,
};

const operatingHours = [
    { day: "Monday – Friday", hours: "09:00 AM – 07:00 PM" },
    { day: "Saturday", hours: "09:00 AM – 05:00 PM" },
    { day: "Sunday", hours: "Closed" },
];

const amenities = [
    "Customer support",
    "Appointment assistance",
    "Quality assurance",
    "Professional service",
];

const services = [
    {
        title: "Primary Service",
        category: "Featured service",
        description: "Describe your main service offering here.",
    },
    {
        title: "Additional Service",
        category: "Business service",
        description: "Add details about another service you provide.",
    },
    {
        title: "Consultation",
        category: "Customer support",
        description: "Help customers understand your available options.",
    },
];

const products = [
    {
        id: 1,
        name: "Featured Product",
        category: "Popular",
        price: "₹499",
        stock: "In stock",
        image:
            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=80",
    },
    {
        id: 2,
        name: "Business Essential",
        category: "Recommended",
        price: "₹799",
        stock: "In stock",
        image:
            "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=700&q=80",
    },
    {
        id: 3,
        name: "Premium Selection",
        category: "Featured",
        price: "₹1,299",
        stock: "Low stock",
        image:
            "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=700&q=80",
    },
];

const gallery = [
    {
        title: "Business showcase",
        image:
            "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80",
    },
    {
        title: "Workspace",
        image:
            "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=900&q=80",
    },
    {
        title: "Products and services",
        image:
            "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=900&q=80",
    },
    {
        title: "Customer experience",
        image:
            "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80",
    },
];

const tabItems: { id: TabId; label: string; icon: typeof Building2 }[] = [
    { id: "overview", label: "Overview", icon: Building2 },
    { id: "gallery", label: "Media & Gallery", icon: ImageIcon },
    { id: "services", label: "Services Offered", icon: ShieldCheck },
    { id: "products", label: "Products / Catalogue", icon: Package },
    { id: "location", label: "Location & Map", icon: MapPin },
    { id: "reviews", label: "Customer Reviews", icon: MessageCircle },
    { id: "performance", label: "Performance", icon: TrendingUp },
];

function formatInitials(name: string) {
    return name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() ?? "")
        .join("") || "VB";
}

function VendorHub() {
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState<TabId>("overview");
    const [business, setBusiness] = useState(initialBusiness);
    const [search, setSearch] = useState("");
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState("");
    const [notice, setNotice] = useState("");
    const [selectedGallery, setSelectedGallery] = useState<number | null>(null);

    const visibleProducts = useMemo(() => {
        const term = search.trim().toLowerCase();
        if (!term) return products;

        return products.filter(
            (product) =>
                product.name.toLowerCase().includes(term) ||
                product.category.toLowerCase().includes(term),
        );
    }, [search]);

    const visibleServices = useMemo(() => {
        const term = search.trim().toLowerCase();
        if (!term) return services;

        return services.filter(
            (service) =>
                service.title.toLowerCase().includes(term) ||
                service.category.toLowerCase().includes(term) ||
                service.description.toLowerCase().includes(term),
        );
    }, [search]);

    const showNotice = (message: string) => {
        setNotice(message);
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

    const handleBackToProfile = () => {
        navigate("/profile");
    };

    const handleDeleteAccount = async () => {
        setIsDeleting(true);
        setDeleteError("");

        try {
            const response = await fetch("/api/vendor/account", {
                method: "DELETE",
                credentials: "include",
                headers: {
                    Accept: "application/json",
                },
            });

            if (!response.ok) {
                const result = await response.json().catch(() => null);
                throw new Error(
                    result?.message ||
                    "We couldn't delete your account. Please try again.",
                );
            }

            setDeleteModalOpen(false);

            // Clear any vendor-specific local session values if your app uses them.
            // Do not clear unrelated application data.
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

    const handleEditBusiness = () => {
        showNotice(
            "Connect this action to your existing business profile editing form.",
        );
    };

    const renderOverview = () => (
        <>
            <div className="vh-overview-grid">
                <section className="vh-card">
                    <div className="vh-section-heading">
                        <div className="vh-heading-title">
                            <span className="vh-heading-icon">
                                <Building2 size={18} />
                            </span>
                            <h3>About Business</h3>
                        </div>
                        <button
                            className="vh-small-action"
                            onClick={handleEditBusiness}
                            type="button"
                        >
                            <Pencil size={13} /> Edit
                        </button>
                    </div>
                    <p className="vh-about-text">{business.description}</p>
                    <div className="vh-two-detail">
                        <div>
                            <small>Business category</small>
                            <strong>{business.category}</strong>
                        </div>
                        <div>
                            <small>Listing status</small>
                            <strong className="vh-open-label">
                                <span
                                    className={`vh-status-dot ${business.open ? "" : "is-closed"}`}
                                />
                                {business.open ? "Open" : "Closed"}
                            </strong>
                        </div>
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
                            onClick={() => showNotice("Connect operating hours to your edit form.")}
                            type="button"
                        >
                            Edit hours
                        </button>
                    </div>
                    <div className="vh-hours-list">
                        {operatingHours.map((item) => (
                            <div key={item.day}>
                                <span>{item.day}</span>
                                <strong>{item.hours}</strong>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="vh-card">
                    <div className="vh-section-heading">
                        <div className="vh-heading-title">
                            <span className="vh-heading-icon">
                                <CheckCircle2 size={18} />
                            </span>
                            <h3>Key Highlights & Amenities</h3>
                        </div>
                    </div>
                    <ul className="vh-amenities-list">
                        {amenities.map((amenity) => (
                            <li key={amenity}>
                                <Check size={15} />
                                <span>{amenity}</span>
                            </li>
                        ))}
                    </ul>
                </section>

                <section className="vh-card">
                    <div className="vh-section-heading">
                        <div className="vh-heading-title">
                            <span className="vh-heading-icon">
                                <UserRound size={18} />
                            </span>
                            <h3>Contact Details</h3>
                        </div>
                        <button
                            className="vh-small-action"
                            onClick={handleEditBusiness}
                            type="button"
                        >
                            Edit
                        </button>
                    </div>
                    <ul className="vh-contact-list">
                        <li>
                            <MapPin size={16} />
                            <span>{business.address || "Address not provided"}</span>
                        </li>
                        <li>
                            <Phone size={16} />
                            <span>{business.phone || "Phone number not provided"}</span>
                        </li>
                        <li>
                            <Mail size={16} />
                            <span>{business.email || "Email not provided"}</span>
                        </li>
                        <li>
                            <ArrowRight size={16} />
                            <span>{business.website || "Website not provided"}</span>
                        </li>
                    </ul>
                </section>

                <section className="vh-card">
                    <div className="vh-section-heading">
                        <div className="vh-heading-title">
                            <span className="vh-heading-icon">
                                <BadgeCheck size={18} />
                            </span>
                            <h3>Verification</h3>
                        </div>
                    </div>
                    <div className="vh-verification-box">
                        <BadgeCheck size={26} />
                        <div>
                            <strong>
                                {business.verified ? "Verified Business" : "Verification pending"}
                            </strong>
                            <p>
                                {business.verified
                                    ? "Your listing is marked as verified."
                                    : "Complete verification to build customer trust."}
                            </p>
                        </div>
                    </div>
                    <button
                        className="vh-inline-link"
                        onClick={() => showNotice("Connect this section to your verification documents.")}
                        type="button"
                    >
                        <FileText size={14} /> View verification details
                    </button>
                </section>

                <section className="vh-card">
                    <div className="vh-section-heading">
                        <div className="vh-heading-title">
                            <span className="vh-heading-icon">
                                <ImageIcon size={18} />
                            </span>
                            <h3>Media & Gallery</h3>
                        </div>
                        <button
                            className="vh-small-action"
                            onClick={() => setActiveTab("gallery")}
                            type="button"
                        >
                            View all
                        </button>
                    </div>
                    <div className="vh-gallery-strip">
                        {gallery.slice(0, 3).map((item, index) => (
                            <button
                                key={item.title}
                                onClick={() => {
                                    setSelectedGallery(index);
                                    setActiveTab("gallery");
                                }}
                                type="button"
                                aria-label={`View ${item.title}`}
                            >
                                <img src={item.image} alt={item.title} loading="lazy" />
                            </button>
                        ))}
                    </div>
                    <p className="vh-muted-line">Showcase your business with quality images.</p>
                    <button
                        className="vh-inline-link"
                        onClick={() => showNotice("Connect gallery uploads to your media API.")}
                        type="button"
                    >
                        <Upload size={14} /> Manage images
                    </button>
                </section>

                <section className="vh-card">
                    <div className="vh-section-heading">
                        <div className="vh-heading-title">
                            <span className="vh-heading-icon">
                                <Package size={18} />
                            </span>
                            <h3>Products / Catalogue</h3>
                        </div>
                        <button
                            className="vh-small-action"
                            onClick={() => setActiveTab("products")}
                            type="button"
                        >
                            View all
                        </button>
                    </div>
                    <div className="vh-product-strip">
                        {products.map((product) => (
                            <button
                                className="vh-product-thumb"
                                key={product.id}
                                onClick={() => setActiveTab("products")}
                                type="button"
                                aria-label={`View ${product.name}`}
                            >
                                <img src={product.image} alt={product.name} loading="lazy" />
                            </button>
                        ))}
                        <button
                            className="vh-product-add"
                            onClick={() => showNotice("Connect this action to your product creation form.")}
                            type="button"
                            aria-label="Add product"
                        >
                            <Plus size={19} />
                        </button>
                    </div>
                    <p className="vh-muted-line">Keep your catalogue and stock information updated.</p>
                </section>

                <section className="vh-card">
                    <div className="vh-section-heading">
                        <div className="vh-heading-title">
                            <span className="vh-heading-icon">
                                <Star size={18} />
                            </span>
                            <h3>Customer Reviews</h3>
                        </div>
                        <button
                            className="vh-small-action"
                            onClick={() => setActiveTab("reviews")}
                            type="button"
                        >
                            View reviews
                        </button>
                    </div>
                    <div className="vh-review-summary">
                        <div className="vh-review-score">
                            <strong>{business.rating.toFixed(1)}</strong>
                            <span className="vh-stars">★★★★★</span>
                            <small>{business.reviewCount} reviews</small>
                        </div>
                        <div className="vh-review-bars">
                            {[90, 65, 30, 12, 5].map((value, index) => (
                                <div className="vh-review-bar-row" key={value}>
                                    <span>{5 - index} star</span>
                                    <div>
                                        <i style={{ width: `${value}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <p className="vh-muted-line">Ratings shown are sample data until connected.</p>
                </section>

                <section className="vh-card">
                    <div className="vh-section-heading">
                        <div className="vh-heading-title">
                            <span className="vh-heading-icon">
                                <MapPin size={18} />
                            </span>
                            <h3>Location & Map</h3>
                        </div>
                        <button
                            className="vh-small-action"
                            onClick={() => setActiveTab("location")}
                            type="button"
                        >
                            View map
                        </button>
                    </div>
                    <div className="vh-location-preview">
                        <div className="vh-map-placeholder">
                            <MapPin size={25} />
                            <span>Map preview</span>
                        </div>
                        <div>
                            <strong>{business.address || "Business address not provided"}</strong>
                            <button
                                className="vh-inline-link"
                                onClick={() => setActiveTab("location")}
                                type="button"
                            >
                                View location <ChevronRight size={14} />
                            </button>
                        </div>
                    </div>
                </section>

                <section className="vh-card">
                    <div className="vh-section-heading">
                        <div className="vh-heading-title">
                            <span className="vh-heading-icon">
                                <TrendingUp size={18} />
                            </span>
                            <h3>Business Performance</h3>
                        </div>
                        <button
                            className="vh-small-action"
                            onClick={() => setActiveTab("performance")}
                            type="button"
                        >
                            Details
                        </button>
                    </div>
                    <div className="vh-metric-grid">
                        <div>
                            <strong>128</strong>
                            <small>Listing views</small>
                            <em><TrendingUp size={11} /> Demo metric</em>
                        </div>
                        <div>
                            <strong>24</strong>
                            <small>Enquiries</small>
                            <em><TrendingUp size={11} /> Demo metric</em>
                        </div>
                        <div>
                            <strong>18</strong>
                            <small>Product clicks</small>
                        </div>
                        <div>
                            <strong>12</strong>
                            <small>New followers</small>
                        </div>
                    </div>
                    <p className="vh-muted-line">Sample metrics; connect analytics for real figures.</p>
                </section>
            </div>

            <div className="vh-bottom-grid">
                <section className="vh-card">
                    <div className="vh-section-heading">
                        <div className="vh-heading-title">
                            <span className="vh-heading-icon">
                                <CalendarClock size={18} />
                            </span>
                            <h3>Recent Activity</h3>
                        </div>
                    </div>
                    <div className="vh-activity-list">
                        <div className="vh-activity-row">
                            <span className="vh-activity-icon green">
                                <CheckCircle2 size={16} />
                            </span>
                            <div>
                                <strong>Business profile overview</strong>
                                <small>Review your public listing details and contact information.</small>
                            </div>
                            <span className="vh-pill vh-pill-verified">Profile</span>
                        </div>
                        <div className="vh-activity-row">
                            <span className="vh-activity-icon blue">
                                <Package size={16} />
                            </span>
                            <div>
                                <strong>Catalogue management</strong>
                                <small>Check product details, pricing, and stock availability.</small>
                            </div>
                            <button
                                className="vh-small-action"
                                onClick={() => setActiveTab("products")}
                                type="button"
                            >
                                Open
                            </button>
                        </div>
                        <div className="vh-activity-row">
                            <span className="vh-activity-icon orange">
                                <MessageCircle size={16} />
                            </span>
                            <div>
                                <strong>Customer feedback</strong>
                                <small>Review ratings and improve your customer experience.</small>
                            </div>
                            <button
                                className="vh-small-action"
                                onClick={() => setActiveTab("reviews")}
                                type="button"
                            >
                                Open
                            </button>
                        </div>
                    </div>
                </section>

                <section className="vh-card vh-profile-completion">
                    <div className="vh-section-heading">
                        <div className="vh-heading-title">
                            <span className="vh-heading-icon">
                                <CheckCircle2 size={18} />
                            </span>
                            <h3>Profile Completion</h3>
                        </div>
                    </div>
                    <div className="vh-completion-heading">
                        <strong>75%</strong>
                        <span>Demo progress</span>
                    </div>
                    <div className="vh-progress-track">
                        <span style={{ width: "75%" }} />
                    </div>
                    <p>
                        Add accurate business details, operating hours, products, and gallery
                        images to help customers understand your business.
                    </p>
                    <button
                        className="vh-button vh-button-outline"
                        onClick={handleEditBusiness}
                        type="button"
                    >
                        <Pencil size={14} /> Complete profile
                    </button>
                </section>
            </div>
        </>
    );

    const renderGallery = () => (
        <section className="vh-tab-content">
            <div className="vh-content-header">
                <div>
                    <h2>Media & Gallery</h2>
                    <p>Manage the photos customers see on your business listing.</p>
                </div>
                <button
                    className="vh-button vh-button-primary"
                    onClick={() => showNotice("Connect this button to your image-upload flow.")}
                    type="button"
                >
                    <Upload size={15} /> Upload media
                </button>
            </div>

            <div className="vh-gallery-large-grid">
                {gallery.map((item, index) => (
                    <button
                        className={`vh-gallery-large-item ${selectedGallery === index ? "selected" : ""}`}
                        key={item.title}
                        onClick={() => setSelectedGallery(index)}
                        type="button"
                    >
                        <img src={item.image} alt={item.title} loading="lazy" />
                        <span>{item.title}</span>
                    </button>
                ))}
            </div>

            {selectedGallery !== null && (
                <div className="vh-gallery-selection">
                    <strong>Selected: {gallery[selectedGallery].title}</strong>
                    <button
                        className="vh-button vh-button-outline"
                        onClick={() => setSelectedGallery(null)}
                        type="button"
                    >
                        <X size={14} /> Clear selection
                    </button>
                </div>
            )}
        </section>
    );

    const renderServices = () => (
        <section className="vh-tab-content">
            <div className="vh-content-header">
                <div>
                    <h2>Services Offered</h2>
                    <p>Present the services and expertise available through your business.</p>
                </div>
                <button
                    className="vh-button vh-button-primary"
                    onClick={() => showNotice("Connect this action to your service creation form.")}
                    type="button"
                >
                    <Plus size={15} /> Add service
                </button>
            </div>

            <div className="vh-detail-grid">
                {visibleServices.map((service) => (
                    <article className="vh-card vh-detail-card" key={service.title}>
                        <span className="vh-heading-icon"><ShieldCheck size={20} /></span>
                        <span className="vh-pill vh-pill-neutral">{service.category}</span>
                        <h3>{service.title}</h3>
                        <p>{service.description}</p>
                        <button
                            className="vh-button vh-button-outline"
                            onClick={() => showNotice(`Connect editing for "${service.title}".`)}
                            type="button"
                        >
                            <Pencil size={14} /> Edit service
                        </button>
                    </article>
                ))}
                {visibleServices.length === 0 && (
                    <p className="vh-empty-state">No services match your search.</p>
                )}
            </div>
        </section>
    );

    const renderProducts = () => (
        <section className="vh-tab-content">
            <div className="vh-content-header">
                <div>
                    <h2>Products / Catalogue</h2>
                    <p>Manage product information, pricing, and stock status.</p>
                </div>
                <button
                    className="vh-button vh-button-primary"
                    onClick={() => showNotice("Connect this action to your product creation form.")}
                    type="button"
                >
                    <Plus size={15} /> Add product
                </button>
            </div>

            <div className="vh-product-grid">
                {visibleProducts.map((product) => (
                    <article className="vh-card vh-product-card" key={product.id}>
                        <img src={product.image} alt={product.name} loading="lazy" />
                        <span className="vh-product-badge">{product.category}</span>
                        <div className="vh-product-card-body">
                            <span className="vh-product-category">Catalogue item</span>
                            <h3>{product.name}</h3>
                            <strong>{product.price}</strong>
                            <p>
                                <span className="vh-status-dot" />
                                {product.stock}
                            </p>
                            <button
                                className="vh-button vh-button-outline"
                                onClick={() => showNotice(`Connect editing for "${product.name}".`)}
                                type="button"
                            >
                                <Pencil size={14} /> Edit product
                            </button>
                        </div>
                    </article>
                ))}
                {visibleProducts.length === 0 && (
                    <p className="vh-empty-state">No products match your search.</p>
                )}
            </div>

            <div className="vh-notice">
                <Info size={16} />
                Product names, images, prices, and inventory here are examples. Replace
                them with products loaded from your vendor inventory API.
            </div>
        </section>
    );

    const renderLocation = () => (
        <section className="vh-tab-content">
            <div className="vh-content-header">
                <div>
                    <h2>Location & Map</h2>
                    <p>Make it easy for customers to find your business.</p>
                </div>
                <button
                    className="vh-button vh-button-outline"
                    onClick={() => showNotice("Connect location editing to your business profile form.")}
                    type="button"
                >
                    <Pencil size={14} /> Edit location
                </button>
            </div>

            <div className="vh-location-grid">
                <div className="vh-card">
                    <span className="vh-heading-icon"><MapPin size={19} /></span>
                    <h3 className="vh-location-address">{business.address || "Address not provided"}</h3>
                    <p className="vh-card-description">
                        Confirm your business address so customers can find the right location.
                    </p>
                    <ul className="vh-contact-list">
                        <li><MapPin size={16} /><span>{business.address || "Address not provided"}</span></li>
                        <li><Phone size={16} /><span>{business.phone || "Phone number not provided"}</span></li>
                    </ul>
                </div>
                <div className="vh-map-large">
                    <MapPin size={35} />
                    <strong>Map preview</strong>
                    <span>{business.address || "Set your business address"}</span>
                    <small>Connect a map provider to display the live location.</small>
                </div>
            </div>
        </section>
    );

    const renderReviews = () => (
        <section className="vh-tab-content">
            <div className="vh-content-header">
                <div>
                    <h2>Customer Reviews</h2>
                    <p>Monitor customer satisfaction and build trust.</p>
                </div>
            </div>

            <div className="vh-review-page-grid">
                <div className="vh-card">
                    <div className="vh-big-rating">{business.rating.toFixed(1)}</div>
                    <div className="vh-big-stars vh-stars">★★★★★</div>
                    <p>Based on {business.reviewCount} sample reviews</p>
                    <div className="vh-review-bars vh-review-bars-large">
                        {[90, 65, 30, 12, 5].map((value, index) => (
                            <div className="vh-review-bar-row" key={value}>
                                <span>{5 - index} stars</span>
                                <div><i style={{ width: `${value}%` }} /></div>
                                <small>{value}%</small>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="vh-card">
                    <div className="vh-heading-title">
                        <span className="vh-heading-icon"><MessageCircle size={18} /></span>
                        <h3>Customer feedback</h3>
                    </div>
                    <p className="vh-card-description">
                        Your connected customer reviews will appear here. Use feedback to
                        identify what customers value and where service can improve.
                    </p>
                    <div className="vh-notice">
                        <Info size={16} />
                        Review content and rating breakdowns are sample presentation data.
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
                    <p>Understand how customers interact with your listing.</p>
                </div>
            </div>

            <div className="vh-performance-metrics">
                {[
                    { label: "Listing views", value: "128", icon: Eye },
                    { label: "Customer enquiries", value: "24", icon: MessageCircle },
                    { label: "Product clicks", value: "18", icon: ShoppingBag },
                ].map((metric) => {
                    const Icon = metric.icon;
                    return (
                        <div className="vh-card vh-performance-card" key={metric.label}>
                            <span className="vh-heading-icon"><Icon size={19} /></span>
                            <small>{metric.label}</small>
                            <strong>{metric.value}</strong>
                            <em><ArrowDownRight size={13} /> Demo data <span>· Sample only</span></em>
                        </div>
                    );
                })}
            </div>
            <div className="vh-card vh-performance-note">
                <h3>Listing insights</h3>
                <p>
                    Once analytics are connected, this section can show date-based trends,
                    customer enquiries, product engagement, and listing performance.
                </p>
            </div>
        </section>
    );

    const renderActiveTab = () => {
        switch (activeTab) {
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

    return (
        <main className="vendor-hub-page">
            <div className="vh-shell">
                {notice && (
                    <div className="vh-global-notice" role="status">
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
                        <div className="vh-business-logo" aria-label={business.name}>
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
                                    <BadgeCheck className="vh-verified-icon" size={20} />
                                )}
                            </div>
                            <div className="vh-business-meta">
                                <span><Building2 size={14} /> {business.category}</span>
                                <span><MapPin size={14} /> {business.address}</span>
                            </div>
                            <p>{business.description}</p>
                            <div className="vh-rating-line">
                                <Star size={15} fill="currentColor" />
                                <strong>{business.rating.toFixed(1)}</strong>
                                <span>({business.reviewCount} reviews · sample data)</span>
                            </div>
                        </div>
                    </div>

                    <div className="vh-business-actions">
                        <div className="vh-status-pills">
                            <span className="vh-pill vh-pill-verified">
                                <BadgeCheck size={14} />
                                {business.verified ? "Verified" : "Pending verification"}
                            </span>
                            <span className={`vh-pill ${business.open ? "vh-pill-open" : "vh-pill-closed"}`}>
                                <span className="vh-status-dot" />
                                {business.open ? "Open" : "Closed"}
                            </span>
                        </div>
                        <div className="vh-banner-buttons">
                            <button
                                className="vh-button vh-button-primary"
                                onClick={handleEditBusiness}
                                type="button"
                            >
                                <Pencil size={14} /> Edit Business
                            </button>
                            <button
                                className="vh-button vh-button-outline"
                                onClick={() => showNotice("Connect this button to your public City Listings preview route.")}
                                type="button"
                            >
                                <Eye size={15} /> Preview Listing
                            </button>
                        </div>
                    </div>

                    <div className="vh-banner-gallery">
                        <button
                            className="vh-banner-gallery-main"
                            onClick={() => setActiveTab("gallery")}
                            type="button"
                            aria-label="Open business gallery"
                        >
                            <img src={gallery[0].image} alt="Business gallery preview" />
                        </button>
                        <button
                            className="vh-banner-gallery-side"
                            onClick={() => setActiveTab("gallery")}
                            type="button"
                            aria-label="View all business photos"
                        >
                            <img src={gallery[1].image} alt="Additional business photo" />
                            <span>+{gallery.length - 1}</span>
                        </button>
                    </div>
                </section>

                <nav className="vh-tabs" aria-label="Vendor dashboard sections">
                    {tabItems.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                type="button"
                                className={`vh-tab ${activeTab === tab.id ? "active" : ""}`}
                                onClick={() => setActiveTab(tab.id)}
                                aria-current={activeTab === tab.id ? "page" : undefined}
                            >
                                <Icon size={16} />
                                {tab.label}
                            </button>
                        );
                    })}
                </nav>

                <div className="vh-search-row">
                    <label className="vh-search" htmlFor="vh-dashboard-search">
                        <Eye size={16} />
                        <input
                            id="vh-dashboard-search"
                            type="search"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Search products or services..."
                        />
                        {search && (
                            <button
                                className="vh-search-clear"
                                type="button"
                                onClick={() => setSearch("")}
                                aria-label="Clear search"
                            >
                                <X size={14} />
                            </button>
                        )}
                    </label>
                </div>

                {renderActiveTab()}

                <footer className="vh-footer">
                    <button
                        className="vh-back-button"
                        onClick={handleBackToProfile}
                        type="button"
                    >
                        <ArrowLeft size={16} /> Back to Profile
                    </button>

                    <div className="vh-footer-links">
                        <button
                            type="button"
                            onClick={() => showNotice("Connect Help & Support to your support page.")}
                        >
                            <MessageCircle size={13} /> Help & Support
                        </button>
                        <span />
                        <button
                            type="button"
                            onClick={() => showNotice("Connect privacy details to your policy page.")}
                        >
                            <ShieldCheck size={13} /> Privacy
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

            {deleteModalOpen && (
                <div
                    className="vh-modal-backdrop"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget && !isDeleting) {
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
                            onClick={() => setDeleteModalOpen(false)}
                        >
                            <X size={18} />
                        </button>

                        <div className="vh-delete-icon">
                            <Ban size={26} />
                        </div>

                        <h2 id="vh-delete-title">Remove your vendor account?</h2>
                        <p>
                            This action may permanently remove your vendor account and its
                            associated listing information. Make sure you understand the
                            consequences before continuing.
                        </p>

                        <div className="vh-delete-warning">
                            <Info size={17} />
                            <span>
                                Account removal should be handled by your backend, including
                                related listings, products, and account access. This action
                                cannot be completed unless the server supports it.
                            </span>
                        </div>

                        {deleteError && (
                            <div className="vh-delete-error" role="alert">
                                {deleteError}
                            </div>
                        )}

                        <div className="vh-modal-actions">
                            <button
                                className="vh-button vh-button-outline"
                                type="button"
                                disabled={isDeleting}
                                onClick={() => setDeleteModalOpen(false)}
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
                                {isDeleting ? "Removing account..." : "Yes, Remove Account"}
                            </button>
                        </div>
                    </section>
                </div>
            )}
        </main>
    );
}

export default VendorHub;
