
import { useEffect, useMemo, useRef, useState } from "react";
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
    products?: string;
    status?: string;
    registeredAt?: string;
};

function readStoredVendorProfile(): StoredVendorProfile | null {
    try {
        const raw =
            localStorage.getItem("oneservice_vendor") ??
            localStorage.getItem("oneservice_user");
        if (!raw) return null;
        const parsed: unknown = JSON.parse(raw);
        if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
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
    const location = [profile.businessAddress, profile.city, profile.state, profile.pincode]
        .map((part) => part?.trim())
        .filter(Boolean)
        .join(", ");
    return {
        ...initialBusiness,
        name: profile.businessName?.trim() || profile.name?.trim() || profile.fullName?.trim() || initialBusiness.name,
        category: profile.businessCategory?.trim() || profile.businessType?.trim() || initialBusiness.category,
        description: profile.productDescription?.trim() || profile.products?.trim() || initialBusiness.description,
        address: location || initialBusiness.address,
        phone: profile.mobile?.trim() || profile.phone?.trim() || "",
        email: profile.email?.trim() || "",
        verified: profile.status?.toLowerCase() === "verified",
    };
}

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

const initialOperatingHours: OperatingHour[] = [
    { id: "hours-mon-fri", day: "Monday – Friday", hours: "09:00 AM – 07:00 PM" },
    { id: "hours-saturday", day: "Saturday", hours: "09:00 AM – 05:00 PM" },
    { id: "hours-sunday", day: "Sunday", hours: "Closed" },
];

const initialAmenities = [
    "Customer support",
    "Appointment assistance",
    "Quality assurance",
    "Professional service",
];

const initialServices: ServiceItem[] = [
    {
        id: "service-1",
        title: "Primary Service",
        category: "Featured service",
        description: "Describe your main service offering here.",
    },
    {
        id: "service-2",
        title: "Additional Service",
        category: "Business service",
        description: "Add details about another service you provide.",
    },
    {
        id: "service-3",
        title: "Consultation",
        category: "Customer support",
        description: "Help customers understand your available options.",
    },
];

const initialProducts: ProductItem[] = [
    {
        id: "product-1",
        name: "Featured Product",
        category: "Popular",
        price: "499",
        stock: "In stock",
        image:
            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=80",
    },
    {
        id: "product-2",
        name: "Business Essential",
        category: "Recommended",
        price: "799",
        stock: "In stock",
        image:
            "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=700&q=80",
    },
    {
        id: "product-3",
        name: "Premium Selection",
        category: "Featured",
        price: "1299",
        stock: "Low stock",
        image:
            "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=700&q=80",
    },
];

const initialGallery: GalleryItem[] = [
    {
        id: "gallery-1",
        title: "Business showcase",
        image:
            "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80",
    },
    {
        id: "gallery-2",
        title: "Workspace",
        image:
            "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=900&q=80",
    },
    {
        id: "gallery-3",
        title: "Products and services",
        image:
            "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=900&q=80",
    },
    {
        id: "gallery-4",
        title: "Customer experience",
        image:
            "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80",
    },
];

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
    const [vendorProfile, setVendorProfile] = useState<StoredVendorProfile | null>(
        () => readStoredVendorProfile(),
    );
    const [business, setBusiness] = useState<BusinessDetails>(() =>
        businessFromVendorProfile(readStoredVendorProfile()),
    );
    const [hours, setHours] =
        useState<OperatingHour[]>(initialOperatingHours);
    const [highlights, setHighlights] = useState<string[]>(initialAmenities);
    const [gallery, setGallery] = useState<GalleryItem[]>(initialGallery);
    const [services, setServices] = useState<ServiceItem[]>(initialServices);
    const [products, setProducts] = useState<ProductItem[]>(initialProducts);
    const [search, setSearch] = useState("");
    const [notice, setNotice] = useState("");

    const [selectedGalleryId, setSelectedGalleryId] = useState<string | null>(
        null,
    );
    const [galleryDeleteId, setGalleryDeleteId] = useState<string | null>(null);

    const [serviceModalOpen, setServiceModalOpen] = useState(false);
    const [editingServiceId, setEditingServiceId] = useState<string | null>(
        null,
    );
    const [serviceDraft, setServiceDraft] = useState<ServiceDraft>({
        title: "",
        category: "",
        description: "",
    });
    const [serviceDeleteId, setServiceDeleteId] = useState<string | null>(null);

    const [productModalOpen, setProductModalOpen] = useState(false);
    const [editingProductId, setEditingProductId] = useState<string | null>(
        null,
    );
    const [productDraft, setProductDraft] = useState<ProductDraft>({
        name: "",
        category: "",
        price: "",
        stock: "In stock",
        image: "",
    });
    const [productDeleteId, setProductDeleteId] = useState<string | null>(null);

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState("");

    const localObjectUrls = useRef<Set<string>>(new Set());

    useEffect(() => {
        return () => {
            localObjectUrls.current.forEach((url) => URL.revokeObjectURL(url));
            localObjectUrls.current.clear();
        };
    }, []);

    // Keep the dashboard connected to the vendor profile created at registration.
    useEffect(() => {
        const refreshVendorProfile = () => {
            const profile = readStoredVendorProfile();
            setVendorProfile(profile);
            if (profile) setBusiness(businessFromVendorProfile(profile));
        };

        window.addEventListener("oneservice-auth-change", refreshVendorProfile);
        window.addEventListener("oneservice-vendor-change", refreshVendorProfile);
        window.addEventListener("storage", refreshVendorProfile);

        return () => {
            window.removeEventListener("oneservice-auth-change", refreshVendorProfile);
            window.removeEventListener("oneservice-vendor-change", refreshVendorProfile);
            window.removeEventListener("storage", refreshVendorProfile);
        };
    }, []);

    // Persist editable business fields to the same local prototype profile.
    // Production persistence should be handled by an authenticated backend.
    useEffect(() => {
        if (!vendorProfile || vendorProfile.role !== "vendor") return;
        try {
            const updatedProfile: StoredVendorProfile = {
                ...vendorProfile,
                businessName: business.name,
                name: vendorProfile.name || vendorProfile.fullName || business.name,
                businessCategory: business.category,
                productDescription: business.description,
                businessAddress: business.address,
                mobile: business.phone,
                email: business.email,
                status: business.verified ? "Verified" : "Pending Verification",
            };
            localStorage.setItem("oneservice_vendor", JSON.stringify(updatedProfile));
            const currentUserRaw = localStorage.getItem("oneservice_user");
            let currentUser: Record<string, unknown> = {};
            if (currentUserRaw) {
                try {
                    const parsed: unknown = JSON.parse(currentUserRaw);
                    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
                        currentUser = parsed as Record<string, unknown>;
                    }
                } catch { /* Recover from invalid demo profile data. */ }
            }
            if (currentUser.role === "vendor") {
                localStorage.setItem(
                    "oneservice_user",
                    JSON.stringify({ ...currentUser, ...updatedProfile }),
                );
            }
        } catch (error) {
            console.error("Unable to save vendor profile preview:", error);
        }
    }, [business, vendorProfile]);

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
        setBusiness((previous) => ({ ...previous, [field]: value }));
    };

    const updateHour = (
        id: string,
        field: keyof OperatingHour,
        value: string,
    ) => {
        setHours((previous) =>
            previous.map((item) =>
                item.id === id ? { ...item, [field]: value } : item,
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
            title: file.name.replace(/\.[^/.]+$/, "") || "Business image",
            image: createObjectUrl(file),
            isLocal: true,
        }));

        setGallery((previous) => [...uploadedItems, ...previous]);
        setSelectedGalleryId(uploadedItems[0].id);
        showNotice(
            `${uploadedItems.length} image${uploadedItems.length === 1 ? "" : "s"} added to your gallery preview.`,
        );
    };

    const confirmGalleryDelete = () => {
        if (!galleryDeleteId) return;

        const item = gallery.find((entry) => entry.id === galleryDeleteId);
        if (item?.isLocal) releaseObjectUrl(item.image);

        setGallery((previous) =>
            previous.filter((entry) => entry.id !== galleryDeleteId),
        );

        if (selectedGalleryId === galleryDeleteId) {
            setSelectedGalleryId(null);
        }

        setGalleryDeleteId(null);
        showNotice("Gallery image removed from the preview.");
    };

    const openAddService = () => {
        setEditingServiceId(null);
        setServiceDraft({ title: "", category: "", description: "" });
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
                                  serviceDraft.category.trim() || "General service",
                              description: serviceDraft.description.trim(),
                          }
                        : service,
                ),
            );
            showNotice("Service updated in the dashboard preview.");
        } else {
            setServices((previous) => [
                ...previous,
                {
                    id: createId("service"),
                    title,
                    category: serviceDraft.category.trim() || "General service",
                    description: serviceDraft.description.trim(),
                },
            ]);
            showNotice("Service added to the dashboard preview.");
        }

        setServiceModalOpen(false);
        setEditingServiceId(null);
    };

    const confirmServiceDelete = () => {
        if (!serviceDeleteId) return;

        setServices((previous) =>
            previous.filter((service) => service.id !== serviceDeleteId),
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

        if (!price || !Number.isFinite(Number(price)) || Number(price) < 0) {
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
            category: productDraft.category.trim() || "General",
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
                    product.id === editingProductId ? updatedProduct : product,
                ),
            );
            showNotice("Product updated in the dashboard preview.");
        } else {
            setProducts((previous) => [...previous, updatedProduct]);
            showNotice("Product added to the dashboard preview.");
        }

        setProductModalOpen(false);
        setEditingProductId(null);
    };

    const confirmProductDelete = () => {
        if (!productDeleteId) return;

        const product = products.find((item) => item.id === productDeleteId);
        if (product?.isLocal) releaseObjectUrl(product.image);

        setProducts((previous) =>
            previous.filter((item) => item.id !== productDeleteId),
        );
        setProductDeleteId(null);
        showNotice("Product removed from the dashboard preview.");
    };

    const handleDeleteAccount = async () => {
        setIsDeleting(true);
        setDeleteError("");

        try {
            const response = await fetch("/api/vendor/account", {
                method: "DELETE",
                credentials: "include",
                headers: { Accept: "application/json" },
            });

            // A 404 means this frontend prototype has no delete endpoint yet.
            // In that case, remove only the local demo account. A configured
            // backend must perform real account deletion server-side.
            if (!response.ok && response.status !== 404) {
                const result = await response.json().catch(() => null);
                throw new Error(
                    result?.message ||
                        "We couldn't delete your account. Please try again.",
                );
            }

            localStorage.removeItem("oneservice_vendor");
            localStorage.removeItem("oneservice_user");
            localStorage.removeItem("oneservice_workspace_role");
            window.dispatchEvent(new Event("oneservice-auth-change"));
            window.dispatchEvent(new Event("oneservice-vendor-change"));
            window.dispatchEvent(new Event("oneservice-workspace-change"));

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
                        Manage the business information, operating hours, and
                        amenities displayed on your NeedOneService listing.
                    </p>
                </div>
            </div>

            <div className="vh-about-form-grid">
                <section className="vh-card">
                    <div className="vh-section-heading">
                        <div className="vh-heading-title">
                            <span className="vh-heading-icon"><Building2 size={18} /></span>
                            <h3>Business Information</h3>
                        </div>
                    </div>
                    <div className="vh-form-grid">
                        <label className="vh-form-field">
                            <span>Business Name</span>
                            <input
                                value={business.name}
                                onChange={(event) => updateBusiness("name", event.target.value)}
                                placeholder="Enter business name"
                            />
                        </label>
                        <label className="vh-form-field">
                            <span>Business Category</span>
                            <input
                                value={business.category}
                                onChange={(event) => updateBusiness("category", event.target.value)}
                                placeholder="Enter business category"
                            />
                        </label>
                        <label className="vh-form-field vh-form-field-full">
                            <span>Business Description</span>
                            <textarea
                                value={business.description}
                                onChange={(event) => updateBusiness("description", event.target.value)}
                                placeholder="Describe your business and services"
                                rows={5}
                            />
                        </label>
                    </div>
                </section>

                <section className="vh-card">
                    <div className="vh-section-heading">
                        <div className="vh-heading-title">
                            <span className="vh-heading-icon"><Phone size={18} /></span>
                            <h3>Contact Information</h3>
                        </div>
                    </div>
                    <div className="vh-form-grid">
                        <label className="vh-form-field vh-form-field-full">
                            <span>Business Address</span>
                            <input
                                value={business.address}
                                onChange={(event) => updateBusiness("address", event.target.value)}
                                placeholder="Enter business address"
                            />
                        </label>
                        <label className="vh-form-field">
                            <span>Phone Number</span>
                            <input
                                type="tel"
                                value={business.phone}
                                onChange={(event) => updateBusiness("phone", event.target.value)}
                                placeholder="Enter phone number"
                            />
                        </label>
                        <label className="vh-form-field">
                            <span>Email Address</span>
                            <input
                                type="email"
                                value={business.email}
                                onChange={(event) => updateBusiness("email", event.target.value)}
                                placeholder="Enter email address"
                            />
                        </label>
                        <label className="vh-form-field vh-form-field-full">
                            <span>Website</span>
                            <input
                                type="url"
                                value={business.website}
                                onChange={(event) => updateBusiness("website", event.target.value)}
                                placeholder="https://yourbusiness.com"
                            />
                        </label>
                    </div>
                </section>

                <section className="vh-card">
                    <div className="vh-section-heading">
                        <div className="vh-heading-title">
                            <span className="vh-heading-icon"><Clock3 size={18} /></span>
                            <h3>Operating Hours</h3>
                        </div>
                        <button
                            className="vh-small-action"
                            type="button"
                            onClick={() => setHours((previous) => [
                                ...previous,
                                { id: createId("hours"), day: "", hours: "" },
                            ])}
                        >
                            <Plus size={13} /> Add day
                        </button>
                    </div>
                    <div className="vh-hours-edit-grid">
                        {hours.map((item) => (
                            <div className="vh-hours-edit-row" key={item.id}>
                                <label className="vh-form-field">
                                    <span>Day</span>
                                    <input
                                        value={item.day}
                                        onChange={(event) => updateHour(item.id, "day", event.target.value)}
                                        placeholder="e.g. Monday"
                                    />
                                </label>
                                <label className="vh-form-field">
                                    <span>Opening hours</span>
                                    <input
                                        value={item.hours}
                                        onChange={(event) => updateHour(item.id, "hours", event.target.value)}
                                        placeholder="e.g. 09:00 AM – 06:00 PM"
                                    />
                                </label>
                                <button
                                    className="vh-highlight-remove"
                                    type="button"
                                    aria-label={`Remove ${item.day || "operating hours"}`}
                                    onClick={() => setHours((previous) => previous.filter((hour) => hour.id !== item.id))}
                                >
                                    <Trash2 size={15} />
                                </button>
                            </div>
                        ))}
                        {hours.length === 0 && <p className="vh-muted-line">No operating hours added yet.</p>}
                    </div>
                    <p className="vh-form-help">
                        Enter “Closed” in Opening hours for days when your business is not operating.
                    </p>
                </section>

                <section className="vh-card">
                    <div className="vh-section-heading">
                        <div className="vh-heading-title">
                            <span className="vh-heading-icon"><CheckCircle2 size={18} /></span>
                            <h3>Key Highlights & Amenities</h3>
                        </div>
                        <button
                            className="vh-small-action"
                            type="button"
                            onClick={() => setHighlights((previous) => [...previous, ""])}
                        >
                            <Plus size={13} /> Add highlight
                        </button>
                    </div>
                    <div className="vh-highlight-edit-list">
                        {highlights.map((highlight, index) => (
                            <div className="vh-highlight-edit-row" key={`highlight-${index}`}>
                                <span className="vh-highlight-check"><Check size={15} /></span>
                                <input
                                    value={highlight}
                                    onChange={(event) => updateHighlight(index, event.target.value)}
                                    placeholder="Enter a business highlight or amenity"
                                    aria-label={`Business highlight ${index + 1}`}
                                />
                                <button
                                    className="vh-highlight-remove"
                                    type="button"
                                    aria-label={`Remove highlight ${index + 1}`}
                                    onClick={() => setHighlights((previous) => previous.filter((_, itemIndex) => itemIndex !== index))}
                                >
                                    <Trash2 size={15} />
                                </button>
                            </div>
                        ))}
                    </div>
                    <p className="vh-form-help">
                        Add amenities, customer benefits, facilities, or qualities that make your business stand out.
                    </p>
                </section>

                <section className="vh-card">
                    <div className="vh-section-heading">
                        <div className="vh-heading-title">
                            <span className="vh-heading-icon"><ShieldCheck size={18} /></span>
                            <h3>Listing Preferences</h3>
                        </div>
                    </div>
                    <label className="vh-about-toggle">
                        <input
                            type="checkbox"
                            checked={business.open}
                            onChange={(event) => updateBusiness("open", event.target.checked)}
                        />
                        <span>
                            <strong>Business currently open</strong>
                            <small>Indicate whether your business is currently accepting customers.</small>
                        </span>
                    </label>
                    <div className="vh-about-verification">
                        <BadgeCheck size={20} />
                        <div>
                            <strong>{business.verified ? "Verified Business" : "Verification Pending"}</strong>
                            <p>{business.verified ? "Your listing is marked as verified." : "Complete verification to build customer trust."}</p>
                        </div>
                    </div>
                </section>

                <div className="vh-about-save-row">
                    <p>Changes update the dashboard preview immediately. Permanent saving requires backend integration.</p>
                    <button
                        className="vh-button vh-button-primary"
                        type="button"
                        onClick={() => showNotice("Your business changes are reflected in this preview. Backend saving is not connected yet.")}
                    >
                        <Check size={15} /> Save Changes
                    </button>
                </div>
            </div>
        </section>
    );

    const renderOverview = () => (
        <>
            <div className="vh-overview-grid">
                <section className="vh-card">
                    <div className="vh-section-heading">
                        <div className="vh-heading-title"><span className="vh-heading-icon"><Building2 size={18} /></span><h3>About Business</h3></div>
                        <button className="vh-small-action" onClick={() => goToTab("about")} type="button"><Pencil size={13} /> Edit</button>
                    </div>
                    <p className="vh-about-text">{business.description}</p>
                    <div className="vh-two-detail">
                        <div><small>Business category</small><strong>{business.category}</strong></div>
                        <div><small>Listing status</small><strong className="vh-open-label"><span className={`vh-status-dot ${business.open ? "" : "is-closed"}`} />{business.open ? "Open" : "Closed"}</strong></div>
                    </div>
                </section>

                <section className="vh-card">
                    <div className="vh-section-heading">
                        <div className="vh-heading-title"><span className="vh-heading-icon"><Clock3 size={18} /></span><h3>Operating Hours</h3></div>
                        <button className="vh-small-action" onClick={() => goToTab("about")} type="button"><Pencil size={13} /> Edit hours</button>
                    </div>
                    <div className="vh-hours-list">
                        {hours.map((item) => <div key={item.id}><span>{item.day || "Day not specified"}</span><strong>{item.hours || "Hours not specified"}</strong></div>)}
                        {hours.length === 0 && <p className="vh-muted-line">No operating hours added yet.</p>}
                    </div>
                </section>

                <section className="vh-card">
                    <div className="vh-section-heading">
                        <div className="vh-heading-title"><span className="vh-heading-icon"><CheckCircle2 size={18} /></span><h3>Key Highlights & Amenities</h3></div>
                        <button className="vh-small-action" onClick={() => goToTab("about")} type="button"><Pencil size={13} /> Edit</button>
                    </div>
                    <ul className="vh-amenities-list">
                        {highlights.filter((item) => item.trim()).map((item, index) => <li key={`${item}-${index}`}><Check size={15} /><span>{item}</span></li>)}
                        {highlights.every((item) => !item.trim()) && <li><Info size={15} /><span>No highlights added yet.</span></li>}
                    </ul>
                </section>

                <section className="vh-card">
                    <div className="vh-section-heading">
                        <div className="vh-heading-title"><span className="vh-heading-icon"><UserRound size={18} /></span><h3>Contact Details</h3></div>
                        <button className="vh-small-action" onClick={() => goToTab("about")} type="button"><Pencil size={13} /> Edit</button>
                    </div>
                    <ul className="vh-contact-list">
                        <li><MapPin size={16} /><span>{business.address || "Address not provided"}</span></li>
                        <li><Phone size={16} /><span>{business.phone || "Phone number not provided"}</span></li>
                        <li><Mail size={16} /><span>{business.email || "Email not provided"}</span></li>
                        <li><ArrowRight size={16} /><span>{business.website || "Website not provided"}</span></li>
                    </ul>
                </section>

                <section className="vh-card">
                    <div className="vh-section-heading">
                        <div className="vh-heading-title"><span className="vh-heading-icon"><BadgeCheck size={18} /></span><h3>Verification</h3></div>
                        <button className="vh-small-action" onClick={() => showNotice("Verification document management is not connected yet.")} type="button">Details</button>
                    </div>
                    <div className="vh-verification-box">
                        <BadgeCheck size={26} />
                        <div><strong>{business.verified ? "Verified Business" : "Verification pending"}</strong><p>{business.verified ? "Your listing is marked as verified." : "Complete verification to build customer trust."}</p></div>
                    </div>
                    <button className="vh-inline-link" onClick={() => showNotice("Verification document management is not connected yet.")} type="button"><FileText size={14} /> View verification details</button>
                </section>

                <section className="vh-card">
                    <div className="vh-section-heading">
                        <div className="vh-heading-title"><span className="vh-heading-icon"><ImageIcon size={18} /></span><h3>Media & Gallery</h3></div>
                        <button className="vh-small-action" onClick={() => goToTab("gallery")} type="button"><Pencil size={13} /> Edit media</button>
                    </div>
                    <div className="vh-gallery-strip">
                        {gallery.slice(0, 3).map((item) => (
                            <button key={item.id} onClick={() => { setSelectedGalleryId(item.id); goToTab("gallery"); }} type="button" aria-label={`View ${item.title}`}>
                                <img src={item.image} alt={item.title} loading="lazy" />
                            </button>
                        ))}
                        {gallery.length === 0 && <p className="vh-muted-line">No gallery images yet.</p>}
                    </div>
                    <p className="vh-muted-line">Showcase your business with quality images.</p>
                    <button className="vh-inline-link" onClick={() => goToTab("gallery")} type="button"><Upload size={14} /> Manage images</button>
                </section>

                <section className="vh-card">
                    <div className="vh-section-heading">
                        <div className="vh-heading-title"><span className="vh-heading-icon"><ShieldCheck size={18} /></span><h3>Services Offered</h3></div>
                        <button className="vh-small-action" onClick={() => goToTab("services")} type="button"><Pencil size={13} /> Edit services</button>
                    </div>
                    <ul className="vh-amenities-list">
                        {services.map((service) => <li key={service.id}><Check size={15} /><span>{service.title}</span></li>)}
                        {services.length === 0 && <li><Info size={15} /><span>No services added yet.</span></li>}
                    </ul>
                    <button className="vh-inline-link" onClick={() => goToTab("services")} type="button">Manage services <ChevronRight size={14} /></button>
                </section>

                <section className="vh-card">
                    <div className="vh-section-heading">
                        <div className="vh-heading-title"><span className="vh-heading-icon"><Package size={18} /></span><h3>Products / Catalogue</h3></div>
                        <button className="vh-small-action" onClick={() => goToTab("products")} type="button"><Pencil size={13} /> Edit catalogue</button>
                    </div>
                    <div className="vh-product-strip">
                        {products.slice(0, 4).map((product) => (
                            <button className="vh-product-thumb" key={product.id} onClick={() => goToTab("products")} type="button" aria-label={`View ${product.name}`}>
                                <img src={product.image} alt={product.name} loading="lazy" />
                            </button>
                        ))}
                        <button className="vh-product-add" onClick={() => { goToTab("products"); openAddProduct(); }} type="button" aria-label="Add product"><Plus size={19} /></button>
                    </div>
                    <p className="vh-muted-line">Keep your catalogue and stock information updated.</p>
                </section>

                <section className="vh-card">
                    <div className="vh-section-heading">
                        <div className="vh-heading-title"><span className="vh-heading-icon"><Star size={18} /></span><h3>Customer Reviews</h3></div>
                        <button className="vh-small-action" onClick={() => goToTab("reviews")} type="button"><Pencil size={13} /> View reviews</button>
                    </div>
                    <div className="vh-review-summary">
                        <div className="vh-review-score"><strong>{business.rating.toFixed(1)}</strong><span className="vh-stars">★★★★★</span><small>{business.reviewCount} reviews</small></div>
                        <div className="vh-review-bars">
                            {[90, 65, 30, 12, 5].map((value, index) => <div className="vh-review-bar-row" key={value}><span>{5 - index} star</span><div><i style={{ width: `${value}%` }} /></div></div>)}
                        </div>
                    </div>
                    <p className="vh-muted-line">Ratings shown are sample data until connected.</p>
                </section>

                <section className="vh-card">
                    <div className="vh-section-heading">
                        <div className="vh-heading-title"><span className="vh-heading-icon"><MapPin size={18} /></span><h3>Location & Map</h3></div>
                        <button className="vh-small-action" onClick={() => goToTab("location")} type="button"><Pencil size={13} /> Edit location</button>
                    </div>
                    <div className="vh-location-preview">
                        <div className="vh-map-placeholder"><MapPin size={25} /><span>Map preview</span></div>
                        <div><strong>{business.address || "Business address not provided"}</strong><button className="vh-inline-link" onClick={() => goToTab("location")} type="button">View location <ChevronRight size={14} /></button></div>
                    </div>
                </section>

                <section className="vh-card">
                    <div className="vh-section-heading">
                        <div className="vh-heading-title"><span className="vh-heading-icon"><TrendingUp size={18} /></span><h3>Business Performance</h3></div>
                        <button className="vh-small-action" onClick={() => goToTab("performance")} type="button"><Pencil size={13} /> View performance</button>
                    </div>
                    <div className="vh-metric-grid">
                        {[["128", "Listing views"], ["24", "Enquiries"], ["18", "Product clicks"], ["12", "New followers"]].map(([value, label]) => (
                            <div key={label}><strong>{value}</strong><small>{label}</small><em><TrendingUp size={11} /> Demo metric</em></div>
                        ))}
                    </div>
                    <p className="vh-muted-line">Sample metrics; connect analytics for real figures.</p>
                </section>
            </div>

            <div className="vh-bottom-grid">
                <section className="vh-card">
                    <div className="vh-section-heading"><div className="vh-heading-title"><span className="vh-heading-icon"><CalendarClock size={18} /></span><h3>Recent Activity</h3></div></div>
                    <div className="vh-activity-list">
                        <div className="vh-activity-row"><span className="vh-activity-icon green"><CheckCircle2 size={16} /></span><div><strong>Business profile overview</strong><small>Review your public listing details and contact information.</small></div><span className="vh-pill vh-pill-verified">Profile</span></div>
                        <div className="vh-activity-row"><span className="vh-activity-icon blue"><Package size={16} /></span><div><strong>Catalogue management</strong><small>Check product details, pricing, and stock availability.</small></div><button className="vh-small-action" onClick={() => goToTab("products")} type="button">Open</button></div>
                        <div className="vh-activity-row"><span className="vh-activity-icon orange"><MessageCircle size={16} /></span><div><strong>Customer feedback</strong><small>Review ratings and improve your customer experience.</small></div><button className="vh-small-action" onClick={() => goToTab("reviews")} type="button">Open</button></div>
                    </div>
                </section>
                <section className="vh-card vh-profile-completion">
                    <div className="vh-section-heading"><div className="vh-heading-title"><span className="vh-heading-icon"><CheckCircle2 size={18} /></span><h3>Profile Completion</h3></div></div>
                    <div className="vh-completion-heading"><strong>75%</strong><span>Demo progress</span></div>
                    <div className="vh-progress-track"><span style={{ width: "75%" }} /></div>
                    <p>Add accurate business details, operating hours, products, and gallery images to help customers understand your business.</p>
                    <button className="vh-button vh-button-outline" onClick={handleEditBusiness} type="button"><Pencil size={14} /> Complete profile</button>
                </section>
            </div>
        </>
    );

    const renderGallery = () => {
        const selectedItem = gallery.find((item) => item.id === selectedGalleryId);

        return (
            <section className="vh-tab-content">
                <div className="vh-content-header">
                    <div><h2>Media & Gallery</h2><p>Upload, preview, select, and remove photos from your business listing.</p></div>
                    <button className="vh-button vh-button-primary" onClick={() => galleryInputRef.current?.click()} type="button"><Upload size={15} /> Upload media</button>
                    <input ref={galleryInputRef} type="file" accept="image/*" multiple hidden onChange={(event) => { handleGalleryUpload(event.target.files); event.currentTarget.value = ""; }} />
                </div>

                <div className="vh-gallery-large-grid">
                    {gallery.map((item) => (
                        <div className={`vh-gallery-large-item ${selectedGalleryId === item.id ? "selected" : ""}`} key={item.id}>
                            <button className="vh-gallery-image-select" type="button" onClick={() => setSelectedGalleryId(item.id)} aria-label={`Select ${item.title}`}>
                                <img src={item.image} alt={item.title} loading="lazy" />
                                <span>{item.title}</span>
                            </button>
                            <button className="vh-gallery-delete" type="button" aria-label={`Delete ${item.title}`} onClick={() => setGalleryDeleteId(item.id)}><Trash2 size={15} /></button>
                        </div>
                    ))}
                    {gallery.length === 0 && <div className="vh-empty-state">No images in your gallery. Use Upload media to add your first image.</div>}
                </div>

                {selectedItem && (
                    <div className="vh-gallery-selection">
                        <strong>Selected: {selectedItem.title}</strong>
                        <button className="vh-button vh-button-outline" onClick={() => setSelectedGalleryId(null)} type="button"><X size={14} /> Clear selection</button>
                    </div>
                )}
                <div className="vh-notice"><Info size={16} /> Image uploads are currently local previews. Connect a media-storage service to keep uploaded files after refresh.</div>
            </section>
        );
    };

    const renderServices = () => (
        <section className="vh-tab-content">
            <div className="vh-content-header">
                <div><h2>Services Offered</h2><p>Add, edit, and remove the services available through your business.</p></div>
                <button className="vh-button vh-button-primary" onClick={openAddService} type="button"><Plus size={15} /> Add service</button>
            </div>

            <div className="vh-detail-grid">
                {visibleServices.map((service) => (
                    <article className="vh-card vh-detail-card" key={service.id}>
                        <span className="vh-heading-icon"><ShieldCheck size={20} /></span>
                        <span className="vh-pill vh-pill-neutral">{service.category || "General service"}</span>
                        <h3>{service.title}</h3>
                        <p>{service.description || "No description provided."}</p>
                        <div className="vh-card-actions">
                            <button className="vh-button vh-button-outline" onClick={() => openEditService(service)} type="button"><Pencil size={14} /> Edit service</button>
                            <button className="vh-button vh-button-danger" onClick={() => setServiceDeleteId(service.id)} type="button"><Trash2 size={14} /> Delete</button>
                        </div>
                    </article>
                ))}
                {visibleServices.length === 0 && <p className="vh-empty-state">{search ? "No services match your search." : "No services have been added yet."}</p>}
            </div>
        </section>
    );

    const renderProducts = () => (
        <section className="vh-tab-content">
            <div className="vh-content-header">
                <div><h2>Products / Catalogue</h2><p>Manage product images, prices, categories, and stock availability.</p></div>
                <button className="vh-button vh-button-primary" onClick={openAddProduct} type="button"><Plus size={15} /> Add product</button>
            </div>

            <div className="vh-product-grid">
                {visibleProducts.map((product) => (
                    <article className="vh-card vh-product-card" key={product.id}>
                        <img src={product.image} alt={product.name} loading="lazy" />
                        <span className="vh-product-badge">{product.category || "General"}</span>
                        <div className="vh-product-card-body">
                            <span className="vh-product-category">Catalogue item</span>
                            <h3>{product.name}</h3>
                            <strong>₹{Number(product.price).toLocaleString("en-IN")}</strong>
                            <p><span className={`vh-status-dot ${product.stock === "Out of stock" ? "is-closed" : ""}`} /> {product.stock}</p>
                            <div className="vh-card-actions">
                                <button className="vh-button vh-button-outline" onClick={() => openEditProduct(product)} type="button"><Pencil size={14} /> Edit product</button>
                                <button className="vh-button vh-button-danger" onClick={() => setProductDeleteId(product.id)} type="button"><Trash2 size={14} /> Delete</button>
                            </div>
                        </div>
                    </article>
                ))}
                {visibleProducts.length === 0 && <p className="vh-empty-state">{search ? "No products match your search." : "No products have been added yet."}</p>}
            </div>
            <div className="vh-notice"><Info size={16} /> Products and image previews are held in local page state. Connect your inventory API and image storage for permanent saving.</div>
        </section>
    );

    const renderLocation = () => (
        <section className="vh-tab-content">
            <div className="vh-content-header">
                <div><h2>Location & Map</h2><p>Make it easy for customers to find your business.</p></div>
                <button className="vh-button vh-button-outline" onClick={handleEditBusiness} type="button"><Pencil size={14} /> Edit address</button>
            </div>
            <div className="vh-location-grid">
                <div className="vh-card">
                    <span className="vh-heading-icon"><MapPin size={19} /></span>
                    <h3 className="vh-location-address">{business.address || "Address not provided"}</h3>
                    <p className="vh-card-description">Confirm your business address so customers can find the right location.</p>
                    <ul className="vh-contact-list"><li><MapPin size={16} /><span>{business.address || "Address not provided"}</span></li><li><Phone size={16} /><span>{business.phone || "Phone number not provided"}</span></li></ul>
                    <button className="vh-button vh-button-outline" onClick={handleEditBusiness} type="button"><Pencil size={14} /> Update address</button>
                </div>
                <div className="vh-map-large"><MapPin size={35} /><strong>Map preview</strong><span>{business.address || "Set your business address"}</span><small>Connect a map provider to display the live location.</small></div>
            </div>
        </section>
    );

    const renderReviews = () => (
        <section className="vh-tab-content">
            <div className="vh-content-header"><div><h2>Customer Reviews</h2><p>Monitor customer satisfaction and build trust.</p></div></div>
            <div className="vh-review-page-grid">
                <div className="vh-card">
                    <div className="vh-big-rating">{business.rating.toFixed(1)}</div>
                    <div className="vh-big-stars vh-stars">★★★★★</div>
                    <p>Based on {business.reviewCount} sample reviews</p>
                    <div className="vh-review-bars vh-review-bars-large">
                        {[90, 65, 30, 12, 5].map((value, index) => <div className="vh-review-bar-row" key={value}><span>{5 - index} stars</span><div><i style={{ width: `${value}%` }} /></div><small>{value}%</small></div>)}
                    </div>
                </div>
                <div className="vh-card">
                    <div className="vh-heading-title"><span className="vh-heading-icon"><MessageCircle size={18} /></span><h3>Customer feedback</h3></div>
                    <p className="vh-card-description">Your connected customer reviews will appear here. Use feedback to identify what customers value and where service can improve.</p>
                    <div className="vh-notice"><Info size={16} /> Review content and rating breakdowns are sample data.</div>
                </div>
            </div>
        </section>
    );

    const renderPerformance = () => (
        <section className="vh-tab-content">
            <div className="vh-content-header"><div><h2>Business Performance</h2><p>Understand how customers interact with your listing.</p></div></div>
            <div className="vh-performance-metrics">
                {[{ label: "Listing views", value: "128", icon: Eye }, { label: "Customer enquiries", value: "24", icon: MessageCircle }, { label: "Product clicks", value: "18", icon: ShoppingBag }].map((metric) => {
                    const Icon = metric.icon;
                    return <div className="vh-card vh-performance-card" key={metric.label}><span className="vh-heading-icon"><Icon size={19} /></span><small>{metric.label}</small><strong>{metric.value}</strong><em><ArrowDownRight size={13} /> Demo data <span> · Sample only</span></em></div>;
                })}
            </div>
            <div className="vh-card vh-performance-note"><h3>Listing insights</h3><p>Once analytics are connected, this section can show date-based trends, customer enquiries, product engagement, and listing performance.</p></div>
        </section>
    );

    const renderActiveTab = () => {
        switch (activeTab) {
            case "about": return renderAbout();
            case "gallery": return renderGallery();
            case "services": return renderServices();
            case "products": return renderProducts();
            case "location": return renderLocation();
            case "reviews": return renderReviews();
            case "performance": return renderPerformance();
            default: return renderOverview();
        }
    };

    return (
        <main className="vendor-hub-page">
            <div className="vh-shell">
                {notice && (
                    <div className="vh-global-notice" role="status">
                        <Info size={17} /><span>{notice}</span>
                        <button type="button" aria-label="Dismiss notice" onClick={() => setNotice("")}><X size={15} /></button>
                    </div>
                )}

                <section className="vh-business-banner">
                    <div className="vh-business-main">
                        <div className="vh-business-logo" aria-label={business.name}>
                            {business.name.trim() && business.name !== "Your Business Name" ? <span className="vh-business-initials">{formatInitials(business.name)}</span> : <Building2 size={38} />}
                        </div>
                        <div className="vh-business-copy">
                            <div className="vh-business-name-line"><h1>{business.name}</h1>{business.verified && <BadgeCheck className="vh-verified-icon" size={20} />}</div>
                            <div className="vh-business-meta"><span><Building2 size={14} />{business.category}</span><span><MapPin size={14} />{business.address}</span></div>
                            <p>{business.description}</p>
                            <div className="vh-rating-line"><Star size={15} fill="currentColor" /><strong>{business.rating.toFixed(1)}</strong><span>({business.reviewCount} reviews · sample data)</span></div>
                        </div>
                    </div>

                    <div className="vh-business-actions">
                        <div className="vh-status-pills">
                            <span className="vh-pill vh-pill-verified"><BadgeCheck size={14} />{business.verified ? "Verified" : "Pending verification"}</span>
                            <span className={`vh-pill ${business.open ? "vh-pill-open" : "vh-pill-closed"}`}><span className="vh-status-dot" />{business.open ? "Open" : "Closed"}</span>
                        </div>
                        <div className="vh-banner-buttons">
                            <button className="vh-button vh-button-primary" onClick={handleEditBusiness} type="button"><Pencil size={14} /> Edit Business</button>
                            <button className="vh-button vh-button-outline" onClick={() => showNotice("Connect this button to your public City Listings preview route.")} type="button"><Eye size={15} /> Preview Listing</button>
                        </div>
                    </div>

                    <div className="vh-banner-gallery">
                        <button className="vh-banner-gallery-main" onClick={() => goToTab("gallery")} type="button" aria-label="Open business gallery">
                            {gallery[0] ? <img src={gallery[0].image} alt={gallery[0].title} /> : <ImageIcon size={35} />}
                        </button>
                        <button className="vh-banner-gallery-side" onClick={() => goToTab("gallery")} type="button" aria-label="View all business photos">
                            {gallery[1] ? <img src={gallery[1].image} alt={gallery[1].title} /> : <ImageIcon size={28} />}
                            <span>+{Math.max(gallery.length - 1, 0)}</span>
                        </button>
                    </div>
                </section>

                <nav className="vh-tabs" aria-label="Vendor dashboard sections">
                    {tabItems.map((tab) => {
                        const Icon = tab.icon;
                        return <button key={tab.id} type="button" className={`vh-tab ${activeTab === tab.id ? "active" : ""}`} onClick={() => goToTab(tab.id)} aria-current={activeTab === tab.id ? "page" : undefined}><Icon size={16} />{tab.label}</button>;
                    })}
                </nav>

                <div className="vh-search-row">
                    <label className="vh-search" htmlFor="vh-dashboard-search">
                        <Eye size={16} />
                        <input id="vh-dashboard-search" type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search products or services..." />
                        {search && <button className="vh-search-clear" type="button" onClick={() => setSearch("")} aria-label="Clear search"><X size={14} /></button>}
                    </label>
                </div>

                {renderActiveTab()}

                <footer className="vh-footer">
                    <button className="vh-back-button" onClick={() => navigate("/profile")} type="button"><ArrowLeft size={16} /> Back to Profile</button>
                    <div className="vh-footer-links">
                        <button type="button" onClick={() => showNotice("Connect Help & Support to your support page.")}><MessageCircle size={13} /> Help & Support</button>
                        <span />
                        <button type="button" onClick={() => showNotice("Connect privacy details to your policy page.")}><ShieldCheck size={13} /> Privacy</button>
                    </div>
                    <button className="vh-remove-account" onClick={() => { setDeleteError(""); setDeleteModalOpen(true); }} type="button"><Trash2 size={15} /> Remove Account</button>
                </footer>
            </div>

            {serviceModalOpen && (
                <div className="vh-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setServiceModalOpen(false); }}>
                    <section className="vh-edit-modal" role="dialog" aria-modal="true" aria-labelledby="vh-service-modal-title">
                        <button className="vh-modal-close" type="button" aria-label="Close dialog" onClick={() => setServiceModalOpen(false)}><X size={18} /></button>
                        <h2 id="vh-service-modal-title">{editingServiceId ? "Edit service" : "Add a service"}</h2>
                        <p>Enter the information customers will see for this service.</p>
                        <div className="vh-form-grid">
                            <label className="vh-form-field vh-form-field-full"><span>Service name *</span><input autoFocus value={serviceDraft.title} onChange={(event) => setServiceDraft((previous) => ({ ...previous, title: event.target.value }))} placeholder="e.g. AC repair" /></label>
                            <label className="vh-form-field vh-form-field-full"><span>Category</span><input value={serviceDraft.category} onChange={(event) => setServiceDraft((previous) => ({ ...previous, category: event.target.value }))} placeholder="e.g. Home services" /></label>
                            <label className="vh-form-field vh-form-field-full"><span>Description</span><textarea rows={4} value={serviceDraft.description} onChange={(event) => setServiceDraft((previous) => ({ ...previous, description: event.target.value }))} placeholder="Describe this service" /></label>
                        </div>
                        <div className="vh-modal-actions">
                            <button className="vh-button vh-button-outline" type="button" onClick={() => setServiceModalOpen(false)}>Cancel</button>
                            <button className="vh-button vh-button-primary" type="button" onClick={saveService}><Check size={15} /> {editingServiceId ? "Save changes" : "Add service"}</button>
                        </div>
                    </section>
                </div>
            )}

            {productModalOpen && (
                <div className="vh-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setProductModalOpen(false); }}>
                    <section className="vh-edit-modal" role="dialog" aria-modal="true" aria-labelledby="vh-product-modal-title">
                        <button className="vh-modal-close" type="button" aria-label="Close dialog" onClick={() => setProductModalOpen(false)}><X size={18} /></button>
                        <h2 id="vh-product-modal-title">{editingProductId ? "Edit product" : "Add a product"}</h2>
                        <p>Enter the product details and optionally choose an image.</p>
                        <div className="vh-product-form-image">
                            {productDraft.image ? <img src={productDraft.image} alt="Product preview" /> : <span><ImageIcon size={30} /> Product image</span>}
                            <button className="vh-button vh-button-outline" type="button" onClick={() => productInputRef.current?.click()}><Upload size={14} /> Choose image</button>
                            <input ref={productInputRef} type="file" accept="image/*" hidden onChange={(event) => { chooseProductImage(event.target.files?.[0]); event.currentTarget.value = ""; }} />
                            <input ref={productEditImageRef} type="file" accept="image/*" hidden onChange={(event) => { chooseProductImage(event.target.files?.[0]); event.currentTarget.value = ""; }} />
                        </div>
                        <div className="vh-form-grid">
                            <label className="vh-form-field vh-form-field-full"><span>Product name *</span><input autoFocus value={productDraft.name} onChange={(event) => setProductDraft((previous) => ({ ...previous, name: event.target.value }))} placeholder="Enter product name" /></label>
                            <label className="vh-form-field"><span>Category</span><input value={productDraft.category} onChange={(event) => setProductDraft((previous) => ({ ...previous, category: event.target.value }))} placeholder="e.g. Accessories" /></label>
                            <label className="vh-form-field"><span>Price (₹) *</span><input type="number" min="0" step="0.01" value={productDraft.price} onChange={(event) => setProductDraft((previous) => ({ ...previous, price: event.target.value }))} placeholder="499" /></label>
                            <label className="vh-form-field vh-form-field-full"><span>Stock status</span><select value={productDraft.stock} onChange={(event) => setProductDraft((previous) => ({ ...previous, stock: event.target.value }))}><option>In stock</option><option>Low stock</option><option>Out of stock</option></select></label>
                        </div>
                        <div className="vh-modal-actions">
                            <button className="vh-button vh-button-outline" type="button" onClick={() => setProductModalOpen(false)}>Cancel</button>
                            <button className="vh-button vh-button-primary" type="button" onClick={saveProduct}><Check size={15} /> {editingProductId ? "Save changes" : "Add product"}</button>
                        </div>
                    </section>
                </div>
            )}

            {(galleryDeleteId || serviceDeleteId || productDeleteId) && (
                <div className="vh-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) { setGalleryDeleteId(null); setServiceDeleteId(null); setProductDeleteId(null); } }}>
                    <section className="vh-delete-modal" role="dialog" aria-modal="true" aria-labelledby="vh-item-delete-title">
                        <button className="vh-modal-close" type="button" aria-label="Close dialog" onClick={() => { setGalleryDeleteId(null); setServiceDeleteId(null); setProductDeleteId(null); }}><X size={18} /></button>
                        <div className="vh-delete-icon"><Trash2 size={25} /></div>
                        <h2 id="vh-item-delete-title">Delete this item?</h2>
                        <p>This removes the selected item from the current dashboard preview. This action cannot be undone here.</p>
                        <div className="vh-modal-actions">
                            <button className="vh-button vh-button-outline" type="button" onClick={() => { setGalleryDeleteId(null); setServiceDeleteId(null); setProductDeleteId(null); }}>Cancel</button>
                            <button className="vh-button vh-button-danger" type="button" onClick={() => { if (galleryDeleteId) confirmGalleryDelete(); else if (serviceDeleteId) confirmServiceDelete(); else if (productDeleteId) confirmProductDelete(); }}><Trash2 size={15} /> Delete</button>
                        </div>
                    </section>
                </div>
            )}

            {deleteModalOpen && (
                <div className="vh-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget && !isDeleting) setDeleteModalOpen(false); }}>
                    <section className="vh-delete-modal" role="dialog" aria-modal="true" aria-labelledby="vh-delete-title">
                        <button className="vh-modal-close" type="button" aria-label="Close dialog" disabled={isDeleting} onClick={() => setDeleteModalOpen(false)}><X size={18} /></button>
                        <div className="vh-delete-icon"><Ban size={26} /></div>
                        <h2 id="vh-delete-title">Remove your vendor account?</h2>
                        <p>This action may permanently remove your vendor account and its associated listing information. Make sure you understand the consequences before continuing.</p>
                        <div className="vh-delete-warning"><Info size={17} /><span>Account removal must be handled by your backend, including related listings, products, and account access. The server must support this operation.</span></div>
                        {deleteError && <div className="vh-delete-error" role="alert">{deleteError}</div>}
                        <div className="vh-modal-actions">
                            <button className="vh-button vh-button-outline" type="button" disabled={isDeleting} onClick={() => setDeleteModalOpen(false)}>Cancel</button>
                            <button className="vh-button vh-button-danger" type="button" disabled={isDeleting} onClick={handleDeleteAccount}><Trash2 size={15} />{isDeleting ? "Removing account..." : "Yes, Remove Account"}</button>
                        </div>
                    </section>
                </div>
            )}
        </main>
    );
}

export default VendorHub;
