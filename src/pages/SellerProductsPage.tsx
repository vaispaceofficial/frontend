
import { useEffect, useMemo, useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
    AlertCircle,
    Archive,
    ArrowDownToLine,
    ArrowLeft,
    ArrowRight,
    BadgeCheck,
    Check,
    CheckCircle2,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    CircleHelp,
    ClipboardList,
    CloudUpload,
    FileImage,
    FileSpreadsheet,
    Image as ImageIcon,
    Info,
    Layers3,
    Package,
    Pencil,
    Plus,
    Search,
    ShieldCheck,
    ShoppingBag,
    Trash2,
    Upload,
    X,
    Eye,
} from "lucide-react";

import {
    getSellerProducts,
    saveSellerProducts,
    subscribeToSellerProducts,
    type SellerProduct as SharedSellerProduct,
} from "../data/sellerProducts";

import "./SellerProductsPage.css";

type ProductStatus =
    | "Active"
    | "Pending Review"
    | "Draft"
    | "Out of Stock"
    | "Inactive"
    | "Rejected";

interface SellerProduct {
    id: string;
    name: string;
    category: string;
    price: number;
    originalPrice?: number;
    stock: number;
    status: ProductStatus;
    images: string[];
    sku: string;
    description: string;
    updatedAt: string;
    adminStatus?: string;
    sellerId?: string;
    sellerName?: string;
    sellerEmail?: string;
    [key: string]: unknown;
}

interface SellerIdentity {
    id: string;
    name: string;
    email: string;
}

const MAX_IMAGES = 5;
const MAX_IMAGE_SIZE_MB = 5;
const PAGE_SIZE = 5;

const PRODUCT_CATEGORIES = [
    "AC & Cooling",
    "Electrical",
    "Home Appliances",
    "Plumbing",
    "Tools & Accessories",
    "Water Purifiers",
    "Other",
];

const VALID_STATUSES: ProductStatus[] = [
    "Active",
    "Pending Review",
    "Draft",
    "Out of Stock",
    "Inactive",
    "Rejected",
];

type TabName = "All Products" | ProductStatus;

type ModalName =
    | "guidelines"
    | "add"
    | "edit"
    | "preview"
    | "delete"
    | "inventory"
    | "bulk"
    | "rejected"
    | "help"
    | null;

const tabs: TabName[] = [
    "All Products",
    "Active",
    "Pending Review",
    "Draft",
    "Out of Stock",
    "Inactive",
    "Rejected",
];

function normalize(value: unknown): string {
    return String(value ?? "").trim().toLowerCase();
}

/* =========================================================
   CURRENT SELLER IDENTITY

   Priority:
   1. Matched seller application ID
   2. Seller profile ID
   3. Logged-in user ID
   4. Email fallback

   This keeps product ownership aligned with the seller
   record used by Admin Marketplace.
========================================================= */

function getCurrentSeller(): SellerIdentity {
    const read = (key: string): unknown => {
        try {
            const value = localStorage.getItem(key);
            return value ? JSON.parse(value) : null;
        } catch {
            return null;
        }
    };

    const user = read("oneservice_user") as Record<string, unknown> | null;

    const profile = read(
        "oneservice_seller-profile",
    ) as Record<string, unknown> | null;

    const applications = [
        read("oneservice_seller_applications"),
        read("oneservice_seller_application"),
        read("oneservice_partner_application"),
    ];

    const email = String(
        profile?.email ?? user?.email ?? "",
    ).trim();

    const userId = String(
        user?.id ?? user?.userId ?? profile?.userId ?? "",
    ).trim();

    let application: Record<string, unknown> | undefined;

    for (const value of applications) {
        const records = Array.isArray(value)
            ? value
            : value && typeof value === "object"
                ? [value]
                : [];

        const match = records.find((item) => {
            if (!item || typeof item !== "object") {
                return false;
            }

            const record = item as Record<string, unknown>;

            const recordEmail = normalize(record.email);
            const recordUserId = String(record.userId ?? "");
            const recordId = String(record.id ?? "");

            return (
                (!!email && recordEmail === normalize(email)) ||
                (!!userId && (
                    recordUserId === userId ||
                    recordId === userId
                ))
            );
        });

        if (match && typeof match === "object") {
            application = match as Record<string, unknown>;
            break;
        }
    }

    return {
        id: String(
            application?.id ??
            profile?.id ??
            user?.id ??
            user?.userId ??
            application?.userId ??
            email ??
            "seller",
        ).trim(),

        name: String(
            application?.businessName ??
            application?.contactName ??
            application?.fullName ??
            profile?.businessName ??
            profile?.name ??
            user?.name ??
            "Seller",
        ).trim(),

        email: String(
            application?.email ??
            profile?.email ??
            user?.email ??
            "",
        ).trim(),
    };
}

/* =========================================================
   PRODUCT NORMALIZATION
========================================================= */

function normalizeProduct(value: SharedSellerProduct): SellerProduct {
    const product = value as SharedSellerProduct &
        Record<string, unknown>;

    const rawStatus = String(product.status ?? "Draft");

    const status = VALID_STATUSES.includes(rawStatus as ProductStatus)
        ? (rawStatus as ProductStatus)
        : "Draft";

    const images = Array.isArray(product.images)
        ? product.images.filter(
            (image): image is string => typeof image === "string",
        )
        : typeof product.image === "string"
            ? [product.image]
            : [];

    return {
        ...product,

        id: String(product.id),

        name: String(product.name ?? "Untitled product"),

        category: String(product.category ?? "Other"),

        price: Number(product.price ?? 0),

        originalPrice:
            product.originalPrice == null
                ? undefined
                : Number(product.originalPrice),

        stock: Math.max(0, Number(product.stock ?? 0)),

        status,

        images,

        sku: String(product.sku ?? ""),

        description: String(product.description ?? ""),

        updatedAt: String(
            product.updatedAt ?? new Date().toISOString(),
        ),

        adminStatus: String(
            product.adminStatus ?? "Pending Review",
        ),

        sellerId:
            typeof product.sellerId === "string"
                ? product.sellerId
                : undefined,

        sellerName:
            typeof product.sellerName === "string"
                ? product.sellerName
                : undefined,

        sellerEmail:
            typeof product.sellerEmail === "string"
                ? product.sellerEmail
                : undefined,
    };
}

/* =========================================================
   READ SHARED PRODUCT CATALOGUE

   No demo products are inserted.
   All products come from the shared seller catalogue.
========================================================= */

function readProducts(): SellerProduct[] {
    try {
        return getSellerProducts().map(normalizeProduct);
    } catch (error) {
        console.error("Could not read seller products:", error);
        return [];
    }
}

/* =========================================================
   SAVE SHARED PRODUCT CATALOGUE
========================================================= */

function persistProducts(products: SellerProduct[]): void {
    const sharedProducts: SharedSellerProduct[] = products.map(
        (product) => ({
            ...product,
            id: String(product.id),
        }),
    );

    saveSellerProducts(sharedProducts);
}

/* =========================================================
   UTILITIES
========================================================= */

function money(amount: number): string {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2,
    }).format(amount);
}

function statusClass(status: ProductStatus): string {
    const classes: Record<ProductStatus, string> = {
        Active: "sp-status-active",
        "Pending Review": "sp-status-pending",
        Draft: "sp-status-draft",
        "Out of Stock": "sp-status-empty",
        Inactive: "sp-status-inactive",
        Rejected: "sp-status-rejected",
    };

    return classes[status];
}

function makeId(): string {
    return `OS-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

function formatDate(date: string): string {
    const value = new Date(date);

    if (Number.isNaN(value.getTime())) {
        return "—";
    }

    return value.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

function blankProduct(): SellerProduct {
    return {
        id: "",
        name: "",
        category: "Home Appliances",
        price: 0,
        originalPrice: undefined,
        stock: 0,
        status: "Draft",
        adminStatus: "Pending Review",
        images: [],
        sku: "",
        description: "",
        updatedAt: new Date().toISOString(),
    };
}

function getStockStatus(
    product: SellerProduct,
    stock: number,
): ProductStatus {
    if (stock === 0) {
        return "Out of Stock";
    }

    if (
        product.status === "Out of Stock" &&
        normalize(product.adminStatus) === "approved"
    ) {
        return "Active";
    }

    return product.status;
}

/* =========================================================
   SELLER PRODUCTS PAGE
========================================================= */

export default function SellerProductsPage() {
    const navigate = useNavigate();

    const fileInputRef = useRef<HTMLInputElement>(null);
    const csvInputRef = useRef<HTMLInputElement>(null);

    const [products, setProducts] = useState<SellerProduct[]>(
        readProducts,
    );

    const [activeTab, setActiveTab] = useState<TabName>("All Products");
    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("All Categories");
    const [sortBy, setSortBy] = useState("recent");

    const [modal, setModal] = useState<ModalName>(null);

    const [selectedProduct, setSelectedProduct] =
        useState<SellerProduct | null>(null);

    const [formProduct, setFormProduct] =
        useState<SellerProduct>(blankProduct);

    const [editingId, setEditingId] = useState<string | null>(null);

    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    const [toast, setToast] = useState("");
    const [formError, setFormError] = useState("");
    const [imageError, setImageError] = useState("");
    const [bulkText, setBulkText] = useState("");

    const [stockDrafts, setStockDrafts] =
        useState<Record<string, string>>({});

    const [page, setPage] = useState(1);

    /* =====================================================
       PERSIST PRODUCT CHANGES

       The page writes only the actual shared catalogue.
       It no longer creates demo listings.
    ===================================================== */

    useEffect(() => {
        try {
            persistProducts(products);
        } catch (error) {
            console.error("Could not save seller products:", error);

            setToast(
                "Could not save products. Check browser storage space.",
            );
        }
    }, [products]);

    /* =====================================================
       LISTEN FOR ADMIN / SELLER HUB UPDATES
    ===================================================== */

    useEffect(() => {
        return subscribeToSellerProducts((sharedProducts) => {
            const normalized = sharedProducts.map(normalizeProduct);

            setProducts((current) =>
                JSON.stringify(current) === JSON.stringify(normalized)
                    ? current
                    : normalized,
            );
        });
    }, []);

    /* =====================================================
       TOAST TIMER
    ===================================================== */

    useEffect(() => {
        if (!toast) {
            return;
        }

        const timer = window.setTimeout(
            () => setToast(""),
            3200,
        );

        return () => window.clearTimeout(timer);
    }, [toast]);

    /* =====================================================
       RESET PAGINATION WHEN FILTERS CHANGE
    ===================================================== */

    useEffect(() => {
        setPage(1);
    }, [activeTab, search, categoryFilter, sortBy]);

    /* =====================================================
       PRODUCT COUNTS
    ===================================================== */

    const counts = useMemo(
        () => ({
            all: products.length,

            active: products.filter(
                (product) => product.status === "Active",
            ).length,

            pending: products.filter(
                (product) => product.status === "Pending Review",
            ).length,

            drafts: products.filter(
                (product) => product.status === "Draft",
            ).length,

            lowStock: products.filter(
                (product) =>
                    product.stock > 0 &&
                    product.stock <= 5 &&
                    product.status === "Active",
            ).length,

            outOfStock: products.filter(
                (product) =>
                    product.stock === 0 ||
                    product.status === "Out of Stock",
            ).length,

            rejected: products.filter(
                (product) => product.status === "Rejected",
            ).length,
        }),
        [products],
    );

    /* =====================================================
       FILTER AND SORT PRODUCTS
    ===================================================== */

    const filteredProducts = useMemo(() => {
        const query = search.trim().toLowerCase();

        const result = products.filter((product) => {
            const matchesTab =
                activeTab === "All Products" ||
                product.status === activeTab;

            const matchesCategory =
                categoryFilter === "All Categories" ||
                product.category === categoryFilter;

            const matchesSearch =
                !query ||
                product.name.toLowerCase().includes(query) ||
                product.sku.toLowerCase().includes(query) ||
                product.category.toLowerCase().includes(query) ||
                product.id.toLowerCase().includes(query);

            return (
                matchesTab &&
                matchesCategory &&
                matchesSearch
            );
        });

        return result.sort((a, b) => {
            if (sortBy === "name") {
                return a.name.localeCompare(b.name);
            }

            if (sortBy === "price-low") {
                return a.price - b.price;
            }

            if (sortBy === "price-high") {
                return b.price - a.price;
            }

            if (sortBy === "stock-low") {
                return a.stock - b.stock;
            }

            return (
                new Date(b.updatedAt).getTime() -
                new Date(a.updatedAt).getTime()
            );
        });
    }, [
        products,
        activeTab,
        categoryFilter,
        search,
        sortBy,
    ]);

    const totalPages = Math.max(
        1,
        Math.ceil(filteredProducts.length / PAGE_SIZE),
    );

    const currentPage = Math.min(page, totalPages);

    const visibleProducts = filteredProducts.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE,
    );

    const allVisibleSelected =
        visibleProducts.length > 0 &&
        visibleProducts.every((product) =>
            selectedIds.includes(product.id),
        );

    /* =====================================================
       MODAL HELPERS
    ===================================================== */

    const closeModal = () => {
        setModal(null);
        setSelectedProduct(null);
        setFormError("");
        setImageError("");
    };

    const openAddModal = () => {
        setEditingId(null);
        setFormProduct(blankProduct());
        setFormError("");
        setImageError("");
        setModal("add");
    };

    const openEditModal = (product: SellerProduct) => {
        setEditingId(product.id);

        setFormProduct({
            ...product,
            images: [...product.images],
        });

        setFormError("");
        setImageError("");
        setModal("edit");
    };

    const updateForm = <K extends keyof SellerProduct>(
        key: K,
        value: SellerProduct[K],
    ) => {
        setFormProduct((previous) => ({
            ...previous,
            [key]: value,
        }));
    };

    /* =====================================================
       IMAGE UPLOAD
    ===================================================== */

    const handleImageFiles = async (
        event: ChangeEvent<HTMLInputElement>,
    ) => {
        const files = Array.from(event.target.files ?? []);

        event.target.value = "";

        if (files.length === 0) {
            return;
        }

        const remaining =
            MAX_IMAGES - formProduct.images.length;

        if (remaining <= 0) {
            setImageError(
                `You can upload up to ${MAX_IMAGES} product images.`,
            );
            return;
        }

        const validFiles = files
            .slice(0, remaining)
            .filter((file) => {
                if (!file.type.startsWith("image/")) {
                    setImageError("Only image files are allowed.");
                    return false;
                }

                if (
                    file.size >
                    MAX_IMAGE_SIZE_MB * 1024 * 1024
                ) {
                    setImageError(
                        `${file.name} is larger than ${MAX_IMAGE_SIZE_MB} MB.`,
                    );
                    return false;
                }

                return true;
            });

        try {
            const dataUrls = await Promise.all(
                validFiles.map(
                    (file) =>
                        new Promise<string>((resolve, reject) => {
                            const reader = new FileReader();

                            reader.onload = () => {
                                if (typeof reader.result === "string") {
                                    resolve(reader.result);
                                } else {
                                    reject(
                                        new Error("Could not read image."),
                                    );
                                }
                            };

                            reader.onerror = () => {
                                reject(
                                    new Error("Could not read image."),
                                );
                            };

                            reader.readAsDataURL(file);
                        }),
                ),
            );

            setFormProduct((previous) => ({
                ...previous,
                images: [
                    ...previous.images,
                    ...dataUrls,
                ].slice(0, MAX_IMAGES),
            }));

            setImageError("");
        } catch {
            setImageError(
                "One or more images could not be loaded.",
            );
        }
    };

    const removeFormImage = (index: number) => {
        setFormProduct((previous) => ({
            ...previous,
            images: previous.images.filter(
                (_, imageIndex) => imageIndex !== index,
            ),
        }));

        setImageError("");
    };

    /* =====================================================
       SAVE PRODUCT

       New products:
       - Linked to the current seller application.
       - Submitted for admin review.

       Edited products:
       - Retain their existing seller ownership.
       - Retain their product information.
       - Return to admin review after changes.
    ===================================================== */

    const saveProduct = (
        event: FormEvent<HTMLFormElement>,
    ) => {
        event.preventDefault();

        setFormError("");

        const name = formProduct.name.trim();
        const sku = formProduct.sku.trim();

        if (!name) {
            return setFormError("Enter a product name.");
        }

        if (!sku) {
            return setFormError(
                "Enter a unique SKU or product code.",
            );
        }

        if (
            !Number.isFinite(formProduct.price) ||
            formProduct.price <= 0
        ) {
            return setFormError(
                "Enter a selling price greater than zero.",
            );
        }

        if (
            !Number.isInteger(formProduct.stock) ||
            formProduct.stock < 0
        ) {
            return setFormError(
                "Stock must be a whole number of zero or more.",
            );
        }

        if (
            formProduct.originalPrice !== undefined &&
            (
                !Number.isFinite(formProduct.originalPrice) ||
                formProduct.originalPrice < 0
            )
        ) {
            return setFormError(
                "Enter a valid original price.",
            );
        }

        const duplicateSku = products.some(
            (product) =>
                product.sku.toLowerCase() === sku.toLowerCase() &&
                product.id !== editingId,
        );

        if (duplicateSku) {
            return setFormError(
                "That SKU is already being used by another product.",
            );
        }

        const existing = editingId
            ? products.find(
                (product) => product.id === editingId,
            )
            : undefined;

        const seller = getCurrentSeller();

        const adminStatus = existing
            ? normalize(existing.adminStatus) === "approved"
                ? "Pending Review"
                : existing.adminStatus ?? "Pending Review"
            : "Pending Review";

        const savedProduct: SellerProduct = {
            ...(existing ?? {}),
            ...formProduct,

            id: editingId ?? makeId(),

            name,
            sku,

            description: formProduct.description.trim(),

            sellerId:
                existing?.sellerId ?? seller.id,

            sellerName:
                existing?.sellerName ?? seller.name,

            sellerEmail:
                existing?.sellerEmail ?? seller.email,

            adminStatus,

            status:
                formProduct.stock === 0
                    ? "Out of Stock"
                    : "Pending Review",

            updatedAt: new Date().toISOString(),
        };

        setProducts((previous) =>
            editingId
                ? previous.map((product) =>
                    product.id === editingId
                        ? savedProduct
                        : product,
                )
                : [savedProduct, ...previous],
        );

        closeModal();

        setActiveTab("All Products");
        setSearch("");
        setCategoryFilter("All Categories");
        setPage(1);

        setToast(
            existing
                ? "Product changes saved. The listing is awaiting admin review."
                : "Product submitted for admin review.",
        );
    };

    /* =====================================================
       DELETE PRODUCT
    ===================================================== */

    const confirmDelete = () => {
        if (!selectedProduct) {
            return;
        }

        setProducts((previous) =>
            previous.filter(
                (product) =>
                    product.id !== selectedProduct.id,
            ),
        );

        setSelectedIds((previous) =>
            previous.filter(
                (id) => id !== selectedProduct.id,
            ),
        );

        closeModal();

        setToast("Product deleted successfully.");
    };

    /* =====================================================
       SELECTION
    ===================================================== */

    const toggleSelected = (id: string) => {
        setSelectedIds((previous) =>
            previous.includes(id)
                ? previous.filter((item) => item !== id)
                : [...previous, id],
        );
    };

    const toggleVisibleSelection = () => {
        if (allVisibleSelected) {
            setSelectedIds((previous) =>
                previous.filter(
                    (id) =>
                        !visibleProducts.some(
                            (product) => product.id === id,
                        ),
                ),
            );
        } else {
            setSelectedIds((previous) =>
                Array.from(
                    new Set([
                        ...previous,
                        ...visibleProducts.map(
                            (product) => product.id,
                        ),
                    ]),
                ),
            );
        }
    };

    /* =====================================================
       BULK STATUS UPDATE
    ===================================================== */

    const bulkChangeStatus = (status: ProductStatus) => {
        let blocked = 0;

        setProducts((previous) =>
            previous.map((product) => {
                if (!selectedIds.includes(product.id)) {
                    return product;
                }

                if (
                    status === "Active" &&
                    normalize(product.adminStatus) !== "approved"
                ) {
                    blocked += 1;
                    return product;
                }

                return {
                    ...product,

                    status:
                        status === "Active" &&
                        product.stock === 0
                            ? "Out of Stock"
                            : status,

                    updatedAt: new Date().toISOString(),
                };
            }),
        );

        setSelectedIds([]);

        setToast(
            blocked > 0
                ? `${blocked} product(s) could not be activated because admin approval is pending.`
                : "Selected products updated.",
        );
    };

    /* =====================================================
       BULK DELETE
    ===================================================== */

    const bulkDelete = () => {
        if (selectedIds.length === 0) {
            return;
        }

        const confirmed = window.confirm(
            `Delete ${selectedIds.length} selected product(s)? This cannot be undone.`,
        );

        if (!confirmed) {
            return;
        }

        setProducts((previous) =>
            previous.filter(
                (product) =>
                    !selectedIds.includes(product.id),
            ),
        );

        setSelectedIds([]);

        setToast("Selected products deleted.");
    };

    /* =====================================================
       CSV EXPORT
    ===================================================== */

    const exportCsv = () => {
        const rows = [
            [
                "Product ID",
                "Product Name",
                "SKU",
                "Category",
                "Price",
                "Stock",
                "Status",
                "Description",
            ],

            ...filteredProducts.map((product) => [
                product.id,
                product.name,
                product.sku,
                product.category,
                String(product.price),
                String(product.stock),
                product.status,
                product.description,
            ]),
        ];

        const csv = rows
            .map((row) =>
                row
                    .map(
                        (value) =>
                            `"${String(value).replace(/"/g, '""')}"`,
                    )
                    .join(","),
            )
            .join("\r\n");

        const blob = new Blob(
            ["\uFEFF", csv],
            {
                type: "text/csv;charset=utf-8;",
            },
        );

        const url = URL.createObjectURL(blob);

        const anchor = document.createElement("a");

        anchor.href = url;
        anchor.download = "oneservice-products.csv";
        anchor.click();

        URL.revokeObjectURL(url);

        setToast("Product CSV exported.");
    };

    /* =====================================================
       CSV PARSER
    ===================================================== */

    const splitCsvLine = (line: string): string[] => {
        const result: string[] = [];

        let current = "";
        let quoted = false;

        for (let i = 0; i < line.length; i += 1) {
            const char = line[i];

            if (
                char === '"' &&
                line[i + 1] === '"' &&
                quoted
            ) {
                current += '"';
                i += 1;
            } else if (char === '"') {
                quoted = !quoted;
            } else if (char === "," && !quoted) {
                result.push(current.trim());
                current = "";
            } else {
                current += char;
            }
        }

        result.push(current.trim());

        return result;
    };

    /* =====================================================
       CSV IMPORT
    ===================================================== */

    const importCsv = () => {
        const lines = bulkText
            .trim()
            .split(/\r?\n/)
            .filter(Boolean);

        if (lines.length < 2) {
            setToast(
                "Add a CSV header and at least one product row.",
            );
            return;
        }

        const headers = splitCsvLine(lines[0]).map(
            (header) => header.trim().toLowerCase(),
        );

        const indexOf = (...names: string[]) =>
            headers.findIndex(
                (header) => names.includes(header),
            );

        const nameIndex = indexOf(
            "name",
            "product name",
            "title",
        );

        const skuIndex = indexOf(
            "sku",
            "product code",
        );

        const categoryIndex = indexOf("category");

        const priceIndex = indexOf(
            "price",
            "selling price",
        );

        const stockIndex = indexOf(
            "stock",
            "quantity",
        );

        const descriptionIndex = indexOf("description");

        if (nameIndex < 0 || priceIndex < 0) {
            setToast(
                "CSV must contain Product Name and Price columns.",
            );
            return;
        }

        const seller = getCurrentSeller();

        const newProducts: SellerProduct[] = [];

        for (const line of lines.slice(1)) {
            const columns = splitCsvLine(line);

            const name = columns[nameIndex] ?? "";

            const price = Number(
                columns[priceIndex] ?? 0,
            );

            const stock = Number(
                columns[stockIndex] ?? 0,
            );

            const sku =
                columns[skuIndex]?.trim() ||
                `SKU-${Date.now()}-${newProducts.length}`;

            if (
                !name.trim() ||
                !Number.isFinite(price) ||
                price <= 0
            ) {
                continue;
            }

            if (
                !Number.isInteger(stock) ||
                stock < 0
            ) {
                continue;
            }

            if (
                products.some(
                    (product) =>
                        product.sku.toLowerCase() ===
                        sku.toLowerCase(),
                ) ||
                newProducts.some(
                    (product) =>
                        product.sku.toLowerCase() ===
                        sku.toLowerCase(),
                )
            ) {
                continue;
            }

            const category = columns[categoryIndex] ?? "";

            newProducts.push({
                ...blankProduct(),

                id: makeId(),

                name: name.trim(),

                sku,

                category: PRODUCT_CATEGORIES.includes(category)
                    ? category
                    : "Other",

                price,

                stock,

                status:
                    stock === 0
                        ? "Out of Stock"
                        : "Pending Review",

                adminStatus: "Pending Review",

                sellerId: seller.id,
                sellerName: seller.name,
                sellerEmail: seller.email,

                description: (
                    columns[descriptionIndex] ?? ""
                ).trim(),

                updatedAt: new Date().toISOString(),
            });
        }

        if (newProducts.length === 0) {
            setToast(
                "No valid new product rows found. Check your CSV values and SKUs.",
            );
            return;
        }

        setProducts((previous) => [
            ...newProducts,
            ...previous,
        ]);

        setActiveTab("All Products");
        setBulkText("");

        closeModal();

        setToast(
            `${newProducts.length} product(s) imported and submitted for review.`,
        );
    };

    /* =====================================================
       DOWNLOAD CSV TEMPLATE
    ===================================================== */

    const downloadCsvTemplate = () => {
        const template =
            "Product Name,SKU,Category,Price,Stock,Description\r\nUniversal AC Remote,AC-RMT-101,AC & Cooling,499,20,Compatible remote for selected AC models";

        const blob = new Blob(
            ["\uFEFF", template],
            {
                type: "text/csv;charset=utf-8;",
            },
        );

        const url = URL.createObjectURL(blob);

        const anchor = document.createElement("a");

        anchor.href = url;
        anchor.download = "oneservice-product-template.csv";
        anchor.click();

        URL.revokeObjectURL(url);
    };

    /* =====================================================
       CSV FILE UPLOAD
    ===================================================== */

    const handleCsvFile = async (
        event: ChangeEvent<HTMLInputElement>,
    ) => {
        const file = event.target.files?.[0];

        event.target.value = "";

        if (!file) {
            return;
        }

        if (!file.name.toLowerCase().endsWith(".csv")) {
            setToast("Please select a .csv file.");
            return;
        }

        setBulkText(await file.text());
        setModal("bulk");

        setToast(
            "CSV loaded. Review it and select Import Products.",
        );
    };

    /* =====================================================
       INVENTORY MANAGEMENT
    ===================================================== */

    const saveInventory = () => {
        const invalid = Object.values(stockDrafts).some(
            (value) => {
                const stock = Number(value);

                return (
                    value.trim() === "" ||
                    !Number.isInteger(stock) ||
                    stock < 0
                );
            },
        );

        if (invalid) {
            setToast(
                "Enter a valid whole-number stock quantity for every product.",
            );
            return;
        }

        setProducts((previous) =>
            previous.map((product) => {
                if (!(product.id in stockDrafts)) {
                    return product;
                }

                const stock = Number(
                    stockDrafts[product.id],
                );

                return {
                    ...product,

                    stock,

                    status: getStockStatus(
                        product,
                        stock,
                    ),

                    updatedAt: new Date().toISOString(),
                };
            }),
        );

        setStockDrafts({});
        setModal(null);

        setToast("Inventory changes saved.");
    };

    /* =====================================================
       PREVIEW / DELETE HELPERS
    ===================================================== */

    const openDeleteModal = (product: SellerProduct) => {
        setSelectedProduct(product);
        setModal("delete");
    };

    const openPreview = (product: SellerProduct) => {
        setSelectedProduct(product);
        setModal("preview");
    };

    const tabCount = (tab: TabName) => {
        if (tab === "All Products") {
            return counts.all;
        }

        return products.filter(
            (product) => product.status === tab,
        ).length;
    };

    /* =====================================================
       PAGE UI
    ===================================================== */

    return (
        <main className="seller-products-page">
            <div className="sp-container">

                <header className="sp-page-heading">
                    <div>
                        <div className="sp-eyebrow">
                            SELLER CENTRE / CATALOGUE
                        </div>

                        <h1>Seller Products</h1>

                        <p>
                            Manage your listings, update stock, and keep your NeedOneService
                            Marketplace catalogue up to date.
                        </p>
                    </div>

                    <div className="sp-heading-actions">
                        <button
                            type="button"
                            className="sp-back-button"
                            onClick={() => navigate("/seller-hub")}
                        >
                            <ArrowLeft size={18} />
                            <span>Back to Seller Hub</span>
                        </button>

                        <button
                            type="button"
                            className="sp-primary-button sp-add-button"
                            onClick={openAddModal}
                        >
                            <Plus size={18} />
                            <span>Add New Product</span>
                        </button>
                    </div>
                </header>

                <section
                    className="sp-stats-grid"
                    aria-label="Product summary"
                >
                    {[
                        {
                            label: "All Products",
                            value: counts.all,
                            foot: "Products in your catalogue",
                            icon: <Package size={19} />,
                            color: "sp-icon-blue",
                        },
                        {
                            label: "Published",
                            value: counts.active,
                            foot: "Active Marketplace products",
                            icon: <CheckCircle2 size={19} />,
                            color: "sp-icon-green",
                        },
                        {
                            label: "Under review",
                            value: counts.pending,
                            foot: "Awaiting approval",
                            icon: <ShieldCheck size={19} />,
                            color: "sp-icon-orange",
                        },
                        {
                            label: "Unfinished",
                            value: counts.drafts,
                            foot: "Drafts not submitted",
                            icon: <FileImage size={19} />,
                            color: "sp-icon-purple",
                        },
                        {
                            label: "Low stock",
                            value: counts.lowStock,
                            foot: "Five units or fewer",
                            icon: <AlertCircle size={19} />,
                            color: "sp-icon-amber",
                        },
                        {
                            label: "Out of stock",
                            value: counts.outOfStock,
                            foot: "Restock to sell again",
                            icon: <Archive size={19} />,
                            color: "sp-icon-red",
                        },
                    ].map((item) => (
                        <article
                            className="sp-stat-card"
                            key={item.label}
                        >
                            <div className="sp-stat-top">
                                <span
                                    className={`sp-stat-icon ${item.color}`}
                                >
                                    {item.icon}
                                </span>

                                <span className="sp-stat-caption">
                                    {item.label}
                                </span>
                            </div>

                            <strong>{item.value}</strong>

                            <span className="sp-stat-foot">
                                {item.foot}
                            </span>
                        </article>
                    ))}
                </section>

                <section className="sp-workspace">

                    <div className="sp-catalogue-panel">

                        <div className="sp-catalogue-heading">
                            <div>
                                <h2>Product catalogue</h2>
                                <p>
                                    View and manage the products you have listed.
                                </p>
                            </div>

                            <button
                                type="button"
                                className="sp-outline-button sp-guidelines-button"
                                onClick={() => setModal("guidelines")}
                            >
                                <CircleHelp size={16} />
                                View Guidelines
                            </button>
                        </div>

                        <div
                            className="sp-tabs"
                            role="tablist"
                            aria-label="Filter products"
                        >
                            {tabs.map((tab) => (
                                <button
                                    type="button"
                                    role="tab"
                                    aria-selected={activeTab === tab}
                                    className={`sp-tab ${activeTab === tab ? "is-active" : ""}`}
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                >
                                    {tab}
                                    <span>{tabCount(tab)}</span>
                                </button>
                            ))}
                        </div>

                        <div className="sp-filter-row">

                            <label className="sp-search-box">
                                <Search size={17} />

                                <input
                                    type="search"
                                    placeholder="Search product name, SKU or ID..."
                                    value={search}
                                    onChange={(event) =>
                                        setSearch(event.target.value)
                                    }
                                />

                                {search && (
                                    <button
                                        type="button"
                                        aria-label="Clear search"
                                        onClick={() => setSearch("")}
                                    >
                                        <X size={15} />
                                    </button>
                                )}
                            </label>

                            <label className="sp-select-box">
                                <select
                                    value={categoryFilter}
                                    onChange={(event) =>
                                        setCategoryFilter(event.target.value)
                                    }
                                    aria-label="Filter by category"
                                >
                                    <option>All Categories</option>

                                    {PRODUCT_CATEGORIES.map((category) => (
                                        <option key={category}>
                                            {category}
                                        </option>
                                    ))}
                                </select>

                                <ChevronDown size={15} />
                            </label>

                            <label className="sp-select-box sp-sort-select">
                                <select
                                    value={sortBy}
                                    onChange={(event) =>
                                        setSortBy(event.target.value)
                                    }
                                    aria-label="Sort products"
                                >
                                    <option value="recent">
                                        Recently updated
                                    </option>

                                    <option value="name">
                                        Name: A to Z
                                    </option>

                                    <option value="price-low">
                                        Price: low to high
                                    </option>

                                    <option value="price-high">
                                        Price: high to low
                                    </option>

                                    <option value="stock-low">
                                        Stock: low to high
                                    </option>
                                </select>

                                <ChevronDown size={15} />
                            </label>

                            <button
                                type="button"
                                className="sp-text-button"
                                onClick={() => {
                                    setSearch("");
                                    setCategoryFilter("All Categories");
                                    setSortBy("recent");
                                    setActiveTab("All Products");
                                }}
                            >
                                Reset
                            </button>
                        </div>

                        {selectedIds.length > 0 && (
                            <div className="sp-bulk-toolbar">
                                <span>
                                    <CheckCircle2 size={16} />
                                    {selectedIds.length} selected
                                </span>

                                <div>
                                    <button
                                        type="button"
                                        onClick={() => bulkChangeStatus("Active")}
                                    >
                                        Activate
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => bulkChangeStatus("Inactive")}
                                    >
                                        Deactivate
                                    </button>

                                    <button
                                        type="button"
                                        className="sp-bulk-delete"
                                        onClick={bulkDelete}
                                    >
                                        <Trash2 size={14} />
                                        Delete
                                    </button>

                                    <button
                                        type="button"
                                        aria-label="Clear selection"
                                        className="sp-clear-selection"
                                        onClick={() => setSelectedIds([])}
                                    >
                                        <X size={15} />
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="sp-table-scroll">
                            <table className="sp-product-table">

                                <thead>
                                    <tr>
                                        <th className="sp-check-column">
                                            <input
                                                type="checkbox"
                                                aria-label="Select visible products"
                                                checked={allVisibleSelected}
                                                onChange={toggleVisibleSelection}
                                            />
                                        </th>

                                        <th>PRODUCT</th>
                                        <th>SKU / ID</th>
                                        <th>CATEGORY</th>
                                        <th>PRICE</th>
                                        <th>STOCK</th>
                                        <th>STATUS</th>
                                        <th className="sp-actions-heading">
                                            ACTIONS
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {visibleProducts.map((product) => (
                                        <tr key={product.id}>

                                            <td className="sp-check-column">
                                                <input
                                                    type="checkbox"
                                                    aria-label={`Select ${product.name}`}
                                                    checked={selectedIds.includes(product.id)}
                                                    onChange={() =>
                                                        toggleSelected(product.id)
                                                    }
                                                />
                                            </td>

                                            <td>
                                                <div className="sp-product-cell">
                                                    <div className="sp-product-image">
                                                        {product.images[0] ? (
                                                            <img
                                                                src={product.images[0]}
                                                                alt={product.name}
                                                            />
                                                        ) : (
                                                            <ImageIcon size={21} />
                                                        )}
                                                    </div>

                                                    <div className="sp-product-name">
                                                        <strong title={product.name}>
                                                            {product.name}
                                                        </strong>

                                                        <span>
                                                            Updated {formatDate(product.updatedAt)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>

                                            <td>
                                                <div className="sp-id-cell">
                                                    <strong>
                                                        {product.sku || "—"}
                                                    </strong>

                                                    <span>{product.id}</span>
                                                </div>
                                            </td>

                                            <td>
                                                <span className="sp-category-cell">
                                                    {product.category}
                                                </span>
                                            </td>

                                            <td>
                                                <strong className="sp-price">
                                                    {money(product.price)}
                                                </strong>

                                                {product.originalPrice !== undefined &&
                                                    product.originalPrice > product.price && (
                                                        <span className="sp-old-price">
                                                            {money(product.originalPrice)}
                                                        </span>
                                                    )}
                                            </td>

                                            <td>
                                                <span
                                                    className={`sp-stock ${product.stock === 0
                                                        ? "is-empty"
                                                        : product.stock <= 5
                                                            ? "is-low"
                                                            : ""
                                                        }`}
                                                >
                                                    {product.stock}
                                                </span>
                                            </td>

                                            <td>
                                                <span
                                                    className={`sp-status ${statusClass(product.status)}`}
                                                >
                                                    <span />
                                                    {product.status}
                                                </span>

                                                {normalize(product.adminStatus) !== "approved" && (
                                                    <small className="sp-admin-review-note">
                                                        Admin approval pending
                                                    </small>
                                                )}
                                            </td>

                                            <td>
                                                <div className="sp-row-actions">
                                                    <button
                                                        type="button"
                                                        title="Preview product"
                                                        aria-label={`Preview ${product.name}`}
                                                        onClick={() => openPreview(product)}
                                                    >
                                                        <Eye size={16} />
                                                    </button>

                                                    <button
                                                        type="button"
                                                        title="Edit product"
                                                        aria-label={`Edit ${product.name}`}
                                                        onClick={() => openEditModal(product)}
                                                    >
                                                        <Pencil size={16} />
                                                    </button>

                                                    <button
                                                        type="button"
                                                        title="Delete product"
                                                        aria-label={`Delete ${product.name}`}
                                                        className="sp-delete-action"
                                                        onClick={() => openDeleteModal(product)}
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>

                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {visibleProducts.length === 0 && (
                                <div className="sp-empty-state">
                                    <div className="sp-empty-icon">
                                        <ShoppingBag size={27} />
                                    </div>

                                    <h3>No products found</h3>

                                    <p>
                                        Try changing your search or filters, or add a product to your catalogue.
                                    </p>

                                    <button
                                        type="button"
                                        className="sp-primary-button"
                                        onClick={openAddModal}
                                    >
                                        <Plus size={16} />
                                        Add Product
                                    </button>
                                </div>
                            )}
                        </div>

                        <footer className="sp-table-footer">
                            <span>
                                Showing{" "}
                                {filteredProducts.length === 0
                                    ? 0
                                    : (currentPage - 1) * PAGE_SIZE + 1}
                                –{Math.min(
                                    currentPage * PAGE_SIZE,
                                    filteredProducts.length,
                                )}{" "}
                                of {filteredProducts.length} products
                            </span>

                            <div className="sp-pagination">
                                <button
                                    type="button"
                                    aria-label="Previous page"
                                    disabled={currentPage <= 1}
                                    onClick={() =>
                                        setPage((value) =>
                                            Math.max(1, value - 1),
                                        )
                                    }
                                >
                                    <ChevronLeft size={16} />
                                </button>

                                <span>
                                    {currentPage} / {totalPages}
                                </span>

                                <button
                                    type="button"
                                    aria-label="Next page"
                                    disabled={currentPage >= totalPages}
                                    onClick={() =>
                                        setPage((value) =>
                                            Math.min(totalPages, value + 1),
                                        )
                                    }
                                >
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        </footer>
                    </div>

                    {/* RIGHT SIDEBAR */}

                    <aside className="sp-side-content">

                        <section className="sp-side-card sp-guidelines-card">
                            <div className="sp-side-title">
                                <span className="sp-side-title-icon sp-guidelines-icon">
                                    <ShieldCheck size={19} />
                                </span>

                                <div>
                                    <h2>Product Guidelines</h2>
                                    <p>Get your listings ready for review.</p>
                                </div>
                            </div>

                            <ul className="sp-guidelines-list">
                                <li>
                                    <Check size={14} />
                                    <span>Use clear, genuine product photos.</span>
                                </li>

                                <li>
                                    <Check size={14} />
                                    <span>Provide accurate specifications and descriptions.</span>
                                </li>

                                <li>
                                    <Check size={14} />
                                    <span>Keep prices and available stock up to date.</span>
                                </li>

                                <li>
                                    <Check size={14} />
                                    <span>Include compatibility and warranty information.</span>
                                </li>
                            </ul>

                            <button
                                type="button"
                                className="sp-link-button"
                                onClick={() => setModal("guidelines")}
                            >
                                View all guidelines
                                <ArrowRight size={15} />
                            </button>
                        </section>

                        <section className="sp-side-card sp-quick-card">
                            <div className="sp-side-title">
                                <span className="sp-side-title-icon sp-quick-icon">
                                    <Layers3 size={19} />
                                </span>

                                <div>
                                    <h2>Quick Actions</h2>
                                    <p>Manage your catalogue faster.</p>
                                </div>
                            </div>

                            <button
                                type="button"
                                className="sp-quick-action"
                                onClick={() => {
                                    setStockDrafts(
                                        Object.fromEntries(
                                            products.map((product) => [
                                                product.id,
                                                String(product.stock),
                                            ]),
                                        ),
                                    );

                                    setModal("inventory");
                                }}
                            >
                                <span className="sp-quick-action-icon">
                                    <Package size={17} />
                                </span>

                                <span>
                                    <strong>Manage Inventory</strong>
                                    <small>Update stock quantities</small>
                                </span>

                                <ChevronRight size={16} />
                            </button>

                            <button
                                type="button"
                                className="sp-quick-action"
                                onClick={() => setModal("bulk")}
                            >
                                <span className="sp-quick-action-icon">
                                    <FileSpreadsheet size={17} />
                                </span>

                                <span>
                                    <strong>Bulk Import</strong>
                                    <small>Add products using CSV</small>
                                </span>

                                <ChevronRight size={16} />
                            </button>

                            <button
                                type="button"
                                className="sp-quick-action"
                                onClick={exportCsv}
                            >
                                <span className="sp-quick-action-icon">
                                    <ArrowDownToLine size={17} />
                                </span>

                                <span>
                                    <strong>Export Products</strong>
                                    <small>Download your catalogue</small>
                                </span>

                                <ChevronRight size={16} />
                            </button>

                            {counts.rejected > 0 && (
                                <button
                                    type="button"
                                    className="sp-quick-action"
                                    onClick={() => setModal("rejected")}
                                >
                                    <span className="sp-quick-action-icon sp-quick-icon-red">
                                        <AlertCircle size={17} />
                                    </span>

                                    <span>
                                        <strong>Rejected Products</strong>
                                        <small>
                                            {counts.rejected} need attention
                                        </small>
                                    </span>

                                    <ChevronRight size={16} />
                                </button>
                            )}
                        </section>

                        <section className="sp-side-card sp-help-card">
                            <span className="sp-help-icon">
                                <Info size={19} />
                            </span>

                            <div>
                                <h2>Need a hand?</h2>

                                <p>
                                    Have questions about listing products or getting approval?
                                </p>

                                <button
                                    type="button"
                                    className="sp-outline-button sp-help-button"
                                    onClick={() => setModal("help")}
                                >
                                    Contact Seller Support
                                </button>
                            </div>
                        </section>

                        <div className="sp-catalogue-note">
                            <BadgeCheck size={16} />

                            <p>
                                Keep your catalogue accurate to help customers shop with confidence.
                            </p>
                        </div>

                    </aside>
                </section>
            </div>

            {/* TOAST */}

            {toast && (
                <div className="sp-toast" role="status">
                    <CheckCircle2 size={18} />

                    <span>{toast}</span>

                    <button
                        type="button"
                        aria-label="Dismiss notification"
                        onClick={() => setToast("")}
                    >
                        <X size={16} />
                    </button>
                </div>
            )}

            {/* ADD / EDIT PRODUCT MODAL */}

            {(modal === "add" || modal === "edit") && (
                <div
                    className="sp-modal-backdrop"
                    onMouseDown={closeModal}
                >
                    <section
                        className="sp-modal sp-product-form-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="sp-product-form-title"
                        onMouseDown={(event) => event.stopPropagation()}
                    >
                        <header className="sp-modal-header">
                            <div>
                                <span className="sp-modal-eyebrow">
                                    SELLER CATALOGUE
                                </span>

                                <h2 id="sp-product-form-title">
                                    {modal === "edit"
                                        ? "Edit product"
                                        : "Add a new product"}
                                </h2>

                                <p>
                                    Complete the details below. Your listing will be submitted for admin review.
                                </p>
                            </div>

                            <button
                                type="button"
                                className="sp-modal-close"
                                aria-label="Close"
                                onClick={closeModal}
                            >
                                <X size={19} />
                            </button>
                        </header>

                        <form
                            className="sp-product-form"
                            onSubmit={saveProduct}
                        >
                            <div className="sp-form-section-title">
                                <span>01</span>

                                <div>
                                    <h3>Basic information</h3>
                                    <p>Tell customers exactly what you are selling.</p>
                                </div>
                            </div>

                            <div className="sp-form-grid">

                                <label className="sp-field sp-field-full">
                                    <span>
                                        Product name <b>*</b>
                                    </span>

                                    <input
                                        value={formProduct.name}
                                        onChange={(event) =>
                                            updateForm("name", event.target.value)
                                        }
                                        placeholder="e.g. Universal AC Remote"
                                        maxLength={120}
                                        required
                                    />
                                </label>

                                <label className="sp-field">
                                    <span>
                                        Product category <b>*</b>
                                    </span>

                                    <select
                                        value={formProduct.category}
                                        onChange={(event) =>
                                            updateForm("category", event.target.value)
                                        }
                                        required
                                    >
                                        {PRODUCT_CATEGORIES.map((category) => (
                                            <option key={category}>
                                                {category}
                                            </option>
                                        ))}
                                    </select>
                                </label>

                                <label className="sp-field">
                                    <span>
                                        SKU / Product code <b>*</b>
                                    </span>

                                    <input
                                        value={formProduct.sku}
                                        onChange={(event) =>
                                            updateForm("sku", event.target.value)
                                        }
                                        placeholder="e.g. AC-RMT-001"
                                        maxLength={60}
                                        required
                                    />
                                </label>

                                <label className="sp-field">
                                    <span>
                                        Selling price (₹) <b>*</b>
                                    </span>

                                    <input
                                        type="number"
                                        min="0.01"
                                        step="0.01"
                                        value={formProduct.price || ""}
                                        onChange={(event) =>
                                            updateForm(
                                                "price",
                                                Number(event.target.value),
                                            )
                                        }
                                        placeholder="499"
                                        required
                                    />
                                </label>

                                <label className="sp-field">
                                    <span>Original price (₹)</span>

                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={formProduct.originalPrice ?? ""}
                                        onChange={(event) =>
                                            updateForm(
                                                "originalPrice",
                                                event.target.value
                                                    ? Number(event.target.value)
                                                    : undefined,
                                            )
                                        }
                                        placeholder="Optional"
                                    />
                                </label>

                                <label className="sp-field">
                                    <span>
                                        Available stock <b>*</b>
                                    </span>

                                    <input
                                        type="number"
                                        min="0"
                                        step="1"
                                        value={formProduct.stock}
                                        onChange={(event) =>
                                            updateForm(
                                                "stock",
                                                Number(event.target.value),
                                            )
                                        }
                                        required
                                    />
                                </label>

                                <label className="sp-field">
                                    <span>Listing status</span>

                                    <select
                                        value={formProduct.status}
                                        onChange={(event) =>
                                            updateForm(
                                                "status",
                                                event.target.value as ProductStatus,
                                            )
                                        }
                                    >
                                        <option value="Draft">Draft</option>

                                        <option value="Active">
                                            Active (requires admin approval)
                                        </option>

                                        <option value="Inactive">Inactive</option>

                                        <option value="Out of Stock">
                                            Out of Stock
                                        </option>
                                    </select>

                                    <small>
                                        New or edited products must pass admin review before publishing.
                                    </small>
                                </label>

                                <label className="sp-field sp-field-full">
                                    <span>Product description</span>

                                    <textarea
                                        value={formProduct.description}
                                        onChange={(event) =>
                                            updateForm(
                                                "description",
                                                event.target.value,
                                            )
                                        }
                                        placeholder="Describe the product, key specifications, compatibility, warranty and what is included..."
                                        maxLength={2000}
                                        rows={4}
                                    />

                                    <small>
                                        {formProduct.description.length}/2000 characters
                                    </small>
                                </label>
                            </div>

                            <div className="sp-form-section-title sp-image-section-title">
                                <span>02</span>

                                <div>
                                    <h3>Product images</h3>

                                    <p>
                                        Add up to {MAX_IMAGES} clear images, each up to {MAX_IMAGE_SIZE_MB} MB.
                                    </p>
                                </div>
                            </div>

                            <div className="sp-upload-guidance">
                                <Info size={17} />

                                <p>
                                    Recommended: square images around{" "}
                                    <strong>1200 × 1200 px</strong>. Use JPG, PNG or WebP.
                                </p>
                            </div>

                            <div className="sp-image-grid">
                                {formProduct.images.map((image, index) => (
                                    <div
                                        className="sp-image-preview"
                                        key={`${image.slice(0, 32)}-${index}`}
                                    >
                                        <img
                                            src={image}
                                            alt={`Product image ${index + 1}`}
                                        />

                                        {index === 0 && (
                                            <span className="sp-primary-image-label">
                                                Main image
                                            </span>
                                        )}

                                        <button
                                            type="button"
                                            aria-label={`Remove image ${index + 1}`}
                                            onClick={() => removeFormImage(index)}
                                        >
                                            <X size={15} />
                                        </button>
                                    </div>
                                ))}

                                {formProduct.images.length < MAX_IMAGES && (
                                    <button
                                        type="button"
                                        className="sp-image-upload-tile"
                                        onClick={() =>
                                            fileInputRef.current?.click()
                                        }
                                    >
                                        <CloudUpload size={23} />

                                        <strong>Add image</strong>

                                        <span>
                                            {formProduct.images.length}/{MAX_IMAGES} uploaded
                                        </span>
                                    </button>
                                )}
                            </div>

                            <input
                                ref={fileInputRef}
                                className="sp-hidden-input"
                                type="file"
                                accept="image/jpeg,image/png,image/webp,image/gif"
                                multiple
                                onChange={handleImageFiles}
                            />

                            {imageError && (
                                <p className="sp-form-error">
                                    <AlertCircle size={15} />
                                    {imageError}
                                </p>
                            )}

                            {formError && (
                                <p className="sp-form-error">
                                    <AlertCircle size={15} />
                                    {formError}
                                </p>
                            )}

                            <footer className="sp-modal-footer">
                                <button
                                    type="button"
                                    className="sp-outline-button"
                                    onClick={closeModal}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="sp-primary-button"
                                >
                                    <Check size={16} />

                                    {modal === "edit"
                                        ? "Save Changes"
                                        : "Submit for Review"}
                                </button>
                            </footer>
                        </form>
                    </section>
                </div>
            )}

            {/* GUIDELINES MODAL */}

            {modal === "guidelines" && (
                <div
                    className="sp-modal-backdrop"
                    onMouseDown={closeModal}
                >
                    <section
                        className="sp-modal sp-guidelines-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="sp-guidelines-title"
                        onMouseDown={(event) => event.stopPropagation()}
                    >
                        <header className="sp-modal-header">
                            <div>
                                <span className="sp-modal-eyebrow">
                                    SELLER RESOURCE
                                </span>

                                <h2 id="sp-guidelines-title">
                                    Product listing guidelines
                                </h2>

                                <p>
                                    Follow these recommendations to create a clear, trustworthy listing.
                                </p>
                            </div>

                            <button
                                type="button"
                                className="sp-modal-close"
                                aria-label="Close guidelines"
                                onClick={closeModal}
                            >
                                <X size={19} />
                            </button>
                        </header>

                        <div className="sp-guidelines-modal-body">

                            <div className="sp-guideline-highlight">
                                <span className="sp-guideline-highlight-icon">
                                    <ImageIcon size={22} />
                                </span>

                                <div>
                                    <strong>Product image requirements</strong>

                                    <p>
                                        Use genuine images that show the actual product. Use clear, well-lit images with a clean background.
                                    </p>
                                </div>
                            </div>

                            <div className="sp-guideline-spec-grid">
                                <article>
                                    <span>Recommended dimensions</span>
                                    <strong>1200 × 1200 px</strong>
                                    <small>Square images work well for catalogue cards.</small>
                                </article>

                                <article>
                                    <span>Image quantity</span>
                                    <strong>1–5 images</strong>
                                    <small>Use a main image and additional views.</small>
                                </article>

                                <article>
                                    <span>Maximum file size</span>
                                    <strong>5 MB each</strong>
                                    <small>Smaller files help pages load faster.</small>
                                </article>

                                <article>
                                    <span>Accepted formats</span>
                                    <strong>JPG, PNG, WebP</strong>
                                    <small>Use clear, high-quality images.</small>
                                </article>
                            </div>

                            <div className="sp-guideline-section">
                                <h3>
                                    <CheckCircle2 size={18} />
                                    Product details checklist
                                </h3>

                                <ul>
                                    <li>
                                        <Check size={15} />
                                        <span>
                                            <strong>Product title:</strong> use a specific, accurate name.
                                        </span>
                                    </li>

                                    <li>
                                        <Check size={15} />
                                        <span>
                                            <strong>Description:</strong> include material, size, model, dimensions and features.
                                        </span>
                                    </li>

                                    <li>
                                        <Check size={15} />
                                        <span>
                                            <strong>Compatibility:</strong> list supported brands and models where relevant.
                                        </span>
                                    </li>

                                    <li>
                                        <Check size={15} />
                                        <span>
                                            <strong>Price:</strong> enter the correct selling price.
                                        </span>
                                    </li>

                                    <li>
                                        <Check size={15} />
                                        <span>
                                            <strong>Stock and SKU:</strong> use a unique product code and accurate quantity.
                                        </span>
                                    </li>

                                    <li>
                                        <Check size={15} />
                                        <span>
                                            <strong>Warranty:</strong> explain applicable warranty and return conditions.
                                        </span>
                                    </li>
                                </ul>
                            </div>

                            <div className="sp-guideline-warning">
                                <AlertCircle size={19} />

                                <div>
                                    <strong>Products that should not be listed</strong>

                                    <p>
                                        Do not list counterfeit or stolen goods, prohibited or unsafe items, misleading offers or products that violate applicable law or marketplace policy.
                                    </p>
                                </div>
                            </div>

                            <div className="sp-guideline-section">
                                <h3>
                                    <ClipboardList size={18} />
                                    Before submitting
                                </h3>

                                <ul className="sp-guideline-final-checks">
                                    <li>
                                        <CheckCircle2 size={16} />
                                        Product title and category are correct.
                                    </li>

                                    <li>
                                        <CheckCircle2 size={16} />
                                        Price, SKU and inventory are accurate.
                                    </li>

                                    <li>
                                        <CheckCircle2 size={16} />
                                        Images clearly represent the product.
                                    </li>

                                    <li>
                                        <CheckCircle2 size={16} />
                                        Description contains useful customer information.
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <footer className="sp-modal-footer">
                            <button
                                type="button"
                                className="sp-outline-button"
                                onClick={closeModal}
                            >
                                Close
                            </button>

                            <button
                                type="button"
                                className="sp-primary-button"
                                onClick={() => {
                                    closeModal();
                                    openAddModal();
                                }}
                            >
                                <Plus size={16} />
                                Add a Product
                            </button>
                        </footer>
                    </section>
                </div>
            )}

            {/* PRODUCT PREVIEW MODAL */}

            {modal === "preview" && selectedProduct && (
                <div
                    className="sp-modal-backdrop"
                    onMouseDown={closeModal}
                >
                    <section
                        className="sp-modal sp-preview-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="sp-preview-title"
                        onMouseDown={(event) => event.stopPropagation()}
                    >
                        <header className="sp-modal-header">
                            <div>
                                <span className="sp-modal-eyebrow">
                                    PRODUCT PREVIEW
                                </span>

                                <h2 id="sp-preview-title">
                                    {selectedProduct.name}
                                </h2>
                            </div>

                            <button
                                type="button"
                                className="sp-modal-close"
                                aria-label="Close preview"
                                onClick={closeModal}
                            >
                                <X size={19} />
                            </button>
                        </header>

                        <div className="sp-preview-body">
                            <div className="sp-preview-gallery">
                                {selectedProduct.images.length > 0
                                    ? selectedProduct.images.map(
                                        (image, index) => (
                                            <img
                                                src={image}
                                                alt={`${selectedProduct.name} ${index + 1}`}
                                                key={`${image.slice(0, 30)}-${index}`}
                                            />
                                        ),
                                    )
                                    : (
                                        <div className="sp-preview-no-image">
                                            <ImageIcon size={38} />
                                            <span>No product images uploaded</span>
                                        </div>
                                    )}
                            </div>

                            <div className="sp-preview-details">
                                <span
                                    className={`sp-status ${statusClass(selectedProduct.status)}`}
                                >
                                    <span />
                                    {selectedProduct.status}
                                </span>

                                <p className="sp-preview-category">
                                    {selectedProduct.category}
                                </p>

                                <strong className="sp-preview-price">
                                    {money(selectedProduct.price)}
                                </strong>

                                {selectedProduct.originalPrice !== undefined &&
                                    selectedProduct.originalPrice > selectedProduct.price && (
                                        <del>
                                            {money(selectedProduct.originalPrice)}
                                        </del>
                                    )}

                                <p className="sp-preview-description">
                                    {selectedProduct.description ||
                                        "No description added yet."}
                                </p>

                                <dl>
                                    <div>
                                        <dt>Product ID</dt>
                                        <dd>{selectedProduct.id}</dd>
                                    </div>

                                    <div>
                                        <dt>SKU</dt>
                                        <dd>{selectedProduct.sku || "—"}</dd>
                                    </div>

                                    <div>
                                        <dt>Available stock</dt>
                                        <dd>{selectedProduct.stock} units</dd>
                                    </div>

                                    <div>
                                        <dt>Admin approval</dt>
                                        <dd>
                                            {selectedProduct.adminStatus ??
                                                "Pending Review"}
                                        </dd>
                                    </div>

                                    <div>
                                        <dt>Last updated</dt>
                                        <dd>
                                            {formatDate(selectedProduct.updatedAt)}
                                        </dd>
                                    </div>
                                </dl>
                            </div>
                        </div>

                        <footer className="sp-modal-footer">
                            <button
                                type="button"
                                className="sp-outline-button"
                                onClick={closeModal}
                            >
                                Close
                            </button>

                            <button
                                type="button"
                                className="sp-primary-button"
                                onClick={() =>
                                    openEditModal(selectedProduct)
                                }
                            >
                                <Pencil size={15} />
                                Edit Product
                            </button>
                        </footer>
                    </section>
                </div>
            )}

            {/* DELETE CONFIRMATION MODAL */}

            {modal === "delete" && selectedProduct && (
                <div
                    className="sp-modal-backdrop"
                    onMouseDown={closeModal}
                >
                    <section
                        className="sp-modal sp-confirm-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="sp-delete-title"
                        onMouseDown={(event) => event.stopPropagation()}
                    >
                        <div className="sp-confirm-icon">
                            <Trash2 size={23} />
                        </div>

                        <h2 id="sp-delete-title">
                            Delete this product?
                        </h2>

                        <p>
                            You are about to delete{" "}
                            <strong>{selectedProduct.name}</strong>. This removes it from your shared Seller Products catalogue. This action cannot be undone.
                        </p>

                        <div className="sp-confirm-actions">
                            <button
                                type="button"
                                className="sp-outline-button"
                                onClick={closeModal}
                            >
                                Keep Product
                            </button>

                            <button
                                type="button"
                                className="sp-danger-button"
                                onClick={confirmDelete}
                            >
                                <Trash2 size={15} />
                                Delete Product
                            </button>
                        </div>
                    </section>
                </div>
            )}

            {/* INVENTORY MODAL */}

            {modal === "inventory" && (
                <div
                    className="sp-modal-backdrop"
                    onMouseDown={closeModal}
                >
                    <section
                        className="sp-modal sp-inventory-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="sp-inventory-title"
                        onMouseDown={(event) => event.stopPropagation()}
                    >
                        <header className="sp-modal-header">
                            <div>
                                <span className="sp-modal-eyebrow">
                                    STOCK MANAGEMENT
                                </span>

                                <h2 id="sp-inventory-title">
                                    Manage inventory
                                </h2>

                                <p>
                                    Update quantities and save all changes together.
                                </p>
                            </div>

                            <button
                                type="button"
                                className="sp-modal-close"
                                aria-label="Close inventory"
                                onClick={closeModal}
                            >
                                <X size={19} />
                            </button>
                        </header>

                        <div className="sp-inventory-list">
                            {products.map((product) => (
                                <div
                                    className="sp-inventory-row"
                                    key={product.id}
                                >
                                    <div className="sp-inventory-product-image">
                                        {product.images[0] ? (
                                            <img
                                                src={product.images[0]}
                                                alt=""
                                            />
                                        ) : (
                                            <Package size={19} />
                                        )}
                                    </div>

                                    <div className="sp-inventory-product-name">
                                        <strong>{product.name}</strong>
                                        <span>{product.sku}</span>
                                    </div>

                                    <label className="sp-inventory-quantity">
                                        <span>Stock</span>

                                        <input
                                            type="number"
                                            min="0"
                                            step="1"
                                            value={
                                                stockDrafts[product.id] ??
                                                String(product.stock)
                                            }
                                            onChange={(event) =>
                                                setStockDrafts((previous) => ({
                                                    ...previous,
                                                    [product.id]: event.target.value,
                                                }))
                                            }
                                        />
                                    </label>
                                </div>
                            ))}

                            {products.length === 0 && (
                                <div className="sp-empty-state">
                                    <Package size={26} />
                                    <p>
                                        Add a product before managing inventory.
                                    </p>
                                </div>
                            )}
                        </div>

                        <footer className="sp-modal-footer">
                            <button
                                type="button"
                                className="sp-outline-button"
                                onClick={closeModal}
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                className="sp-primary-button"
                                onClick={saveInventory}
                            >
                                <Check size={16} />
                                Save Inventory
                            </button>
                        </footer>
                    </section>
                </div>
            )}

            {/* BULK IMPORT MODAL */}

            {modal === "bulk" && (
                <div
                    className="sp-modal-backdrop"
                    onMouseDown={closeModal}
                >
                    <section
                        className="sp-modal sp-bulk-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="sp-bulk-title"
                        onMouseDown={(event) => event.stopPropagation()}
                    >
                        <header className="sp-modal-header">
                            <div>
                                <span className="sp-modal-eyebrow">
                                    CATALOGUE TOOLS
                                </span>

                                <h2 id="sp-bulk-title">
                                    Import products
                                </h2>

                                <p>
                                    Upload a CSV file or paste CSV content. Imported products are submitted for admin review.
                                </p>
                            </div>

                            <button
                                type="button"
                                className="sp-modal-close"
                                aria-label="Close import"
                                onClick={closeModal}
                            >
                                <X size={19} />
                            </button>
                        </header>

                        <div className="sp-bulk-body">
                            <div className="sp-bulk-instructions">
                                <FileSpreadsheet size={24} />

                                <div>
                                    <strong>Prepare your CSV file</strong>

                                    <p>
                                        Required columns: Product Name and Price. Recommended: SKU, Category, Stock and Description.
                                    </p>

                                    <button
                                        type="button"
                                        className="sp-link-button"
                                        onClick={downloadCsvTemplate}
                                    >
                                        <ArrowDownToLine size={15} />
                                        Download CSV template
                                    </button>
                                </div>
                            </div>

                            <button
                                type="button"
                                className="sp-csv-upload-button"
                                onClick={() =>
                                    csvInputRef.current?.click()
                                }
                            >
                                <Upload size={19} />

                                <span>
                                    <strong>Choose CSV file</strong>
                                    <small>Select a .csv file from your device</small>
                                </span>

                                <ArrowRight size={17} />
                            </button>

                            <input
                                ref={csvInputRef}
                                className="sp-hidden-input"
                                type="file"
                                accept=".csv,text/csv"
                                onChange={handleCsvFile}
                            />

                            <label className="sp-field sp-csv-textarea">
                                <span>Or paste CSV content</span>

                                <textarea
                                    rows={7}
                                    value={bulkText}
                                    onChange={(event) =>
                                        setBulkText(event.target.value)
                                    }
                                    placeholder={
                                        "Product Name,SKU,Category,Price,Stock,Description\nUniversal AC Remote,AC-RMT-101,AC & Cooling,499,20,Compatible remote"
                                    }
                                />
                            </label>

                            <p className="sp-muted-note">
                                Imported items will be submitted for admin review. Images can be added afterward by editing each product.
                            </p>
                        </div>

                        <footer className="sp-modal-footer">
                            <button
                                type="button"
                                className="sp-outline-button"
                                onClick={closeModal}
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                className="sp-primary-button"
                                onClick={importCsv}
                            >
                                <Upload size={16} />
                                Import Products
                            </button>
                        </footer>
                    </section>
                </div>
            )}

            {/* REJECTED PRODUCTS MODAL */}

            {modal === "rejected" && (
                <div
                    className="sp-modal-backdrop"
                    onMouseDown={closeModal}
                >
                    <section
                        className="sp-modal sp-inventory-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="sp-rejected-title"
                        onMouseDown={(event) => event.stopPropagation()}
                    >
                        <header className="sp-modal-header">
                            <div>
                                <span className="sp-modal-eyebrow">
                                    LISTING REVIEW
                                </span>

                                <h2 id="sp-rejected-title">
                                    Rejected products
                                </h2>

                                <p>
                                    Edit a listing to correct its information before resubmission.
                                </p>
                            </div>

                            <button
                                type="button"
                                className="sp-modal-close"
                                aria-label="Close rejected products"
                                onClick={closeModal}
                            >
                                <X size={19} />
                            </button>
                        </header>

                        <div className="sp-rejected-list">
                            {products
                                .filter(
                                    (product) =>
                                        product.status === "Rejected",
                                )
                                .map((product) => (
                                    <div
                                        className="sp-rejected-row"
                                        key={product.id}
                                    >
                                        <div>
                                            <strong>{product.name}</strong>

                                            <span>
                                                {product.sku} · {product.category}
                                            </span>
                                        </div>

                                        <button
                                            type="button"
                                            className="sp-outline-button"
                                            onClick={() =>
                                                openEditModal(product)
                                            }
                                        >
                                            <Pencil size={14} />
                                            Edit
                                        </button>
                                    </div>
                                ))}

                            {counts.rejected === 0 && (
                                <div className="sp-empty-state">
                                    <CheckCircle2 size={28} />

                                    <h3>No rejected products</h3>

                                    <p>
                                        There are no rejected listings in your current catalogue.
                                    </p>
                                </div>
                            )}
                        </div>

                        <footer className="sp-modal-footer">
                            <button
                                type="button"
                                className="sp-outline-button"
                                onClick={closeModal}
                            >
                                Close
                            </button>
                        </footer>
                    </section>
                </div>
            )}

            {/* SELLER SUPPORT MODAL */}

            {modal === "help" && (
                <div
                    className="sp-modal-backdrop"
                    onMouseDown={closeModal}
                >
                    <section
                        className="sp-modal sp-help-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="sp-help-title"
                        onMouseDown={(event) => event.stopPropagation()}
                    >
                        <header className="sp-modal-header">
                            <div>
                                <span className="sp-modal-eyebrow">
                                    SELLER ASSISTANCE
                                </span>

                                <h2 id="sp-help-title">
                                    Seller support
                                </h2>

                                <p>
                                    Choose a topic to see what you can do next.
                                </p>
                            </div>

                            <button
                                type="button"
                                className="sp-modal-close"
                                aria-label="Close support"
                                onClick={closeModal}
                            >
                                <X size={19} />
                            </button>
                        </header>

                        <div className="sp-help-options">
                            <button
                                type="button"
                                onClick={() => setModal("guidelines")}
                            >
                                <span>
                                    <ShieldCheck size={19} />
                                </span>

                                <div>
                                    <strong>Listing and image requirements</strong>
                                    <small>
                                        Review accepted images and product information.
                                    </small>
                                </div>

                                <ChevronRight size={17} />
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    closeModal();
                                    openAddModal();
                                }}
                            >
                                <span>
                                    <Plus size={19} />
                                </span>

                                <div>
                                    <strong>Adding or editing a product</strong>
                                    <small>
                                        Open the product form and update your listing.
                                    </small>
                                </div>

                                <ChevronRight size={17} />
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    closeModal();

                                    setToast(
                                        "Your product catalogue is shared with Seller Hub and Marketplace through browser storage.",
                                    );
                                }}
                            >
                                <span>
                                    <Info size={19} />
                                </span>

                                <div>
                                    <strong>Storage and publishing</strong>
                                    <small>
                                        Understand how this page currently saves changes.
                                    </small>
                                </div>

                                <ChevronRight size={17} />
                            </button>
                        </div>

                        <footer className="sp-modal-footer">
                            <button
                                type="button"
                                className="sp-outline-button"
                                onClick={closeModal}
                            >
                                Close
                            </button>
                        </footer>
                    </section>
                </div>
            )}

        </main>
    );
}
