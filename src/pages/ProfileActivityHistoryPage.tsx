import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
    Activity,
    ArrowLeft,
    Bell,
    Clock3,
    ExternalLink,
    History,
    // Package,
    RefreshCw,
    ShoppingBag,
    Wrench,
} from "lucide-react";
import "./ProfileActivityHistoryPage.css";

type PageVisit = {
    id: string;
    path: string;
    title: string;
    visitedAt: string;
};

type OrderHistoryItem = {
    id: string;
    type?: string;
    title: string;
    date?: string;
    status: string;
    amount?: number | string;
};

type DashboardApplication = {
    id?: string;
    applicationId?: string;
    studentId?: string;
    sellerId?: string;
    vendorId?: string;
    fullName?: string;
    name?: string;
    businessName?: string;
    storeName?: string;
    companyName?: string;
    status?: string;
    submittedAt?: string;
    registeredAt?: string;
};

type ActivityItem = {
    id: string;
    title: string;
    detail: string;
    date: string;
    kind: "page" | "order" | "application";
    path?: string;
};

const PAGE_HISTORY_KEY = "oneservice_page_history";
const ORDER_HISTORY_KEY = "oneservice_order_history";

const APPLICATIONS = [
    {
        key: "oneservice_professional_application",
        label: "Professional application",
    },
    {
        key: "oneservice_seller_application",
        label: "Seller application",
    },
    {
        key: "oneservice_vendor",
        label: "Vendor application",
    },
    {
        key: "oneservice_student_application",
        label: "Student registration",
    },
    {
        key: "oneservice_student",
        label: "Student registration",
    },
];

function readArray<T>(key: string): T[] {
    try {
        const value = localStorage.getItem(key);
        if (!value) return [];

        const parsed: unknown = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

function readPageHistory(): PageVisit[] {
    return readArray<PageVisit>(PAGE_HISTORY_KEY).filter(
        (visit) =>
            visit &&
            typeof visit.id === "string" &&
            typeof visit.path === "string" &&
            typeof visit.title === "string" &&
            typeof visit.visitedAt === "string",
    );
}

function readOrderHistory(): OrderHistoryItem[] {
    return readArray<OrderHistoryItem>(ORDER_HISTORY_KEY).filter(
        (order) =>
            order &&
            typeof order.id === "string" &&
            typeof order.title === "string" &&
            typeof order.status === "string",
    );
}

function readApplications(): ActivityItem[] {
    const results: ActivityItem[] = [];
    const seen = new Set<string>();

    for (const entry of APPLICATIONS) {
        try {
            const saved = localStorage.getItem(entry.key);
            if (!saved) continue;

            const application = JSON.parse(saved) as DashboardApplication;
            if (!application || typeof application !== "object") continue;

            const reference =
                application.id ||
                application.applicationId ||
                application.sellerId ||
                application.vendorId ||
                application.studentId ||
                entry.key;

            if (seen.has(reference)) continue;
            seen.add(reference);

            const status = application.status?.trim() || "Pending Review";
            const normalized = status.toLowerCase();

            if (
                normalized === "approved" ||
                normalized === "verified" ||
                normalized === "active" ||
                normalized === "completed"
            ) {
                continue;
            }

            const date =
                application.submittedAt ||
                application.registeredAt ||
                "";

            results.push({
                id: `application-${reference}`,
                title: `${entry.label}: ${status}`,
                detail:
                    normalized === "rejected"
                        ? "Review your application and next steps."
                        : "Check your dashboard for updates or pending requirements.",
                date,
                kind: "application",
            });
        } catch {
            // Ignore invalid application data.
        }
    }

    return results;
}

function getTimestamp(value?: string): number {
    if (!value) return 0;

    const timestamp = Date.parse(value);
    return Number.isNaN(timestamp) ? 0 : timestamp;
}

function formatDate(value?: string): string {
    if (!value) return "Date unavailable";

    const timestamp = getTimestamp(value);
    if (!timestamp) return value;

    return new Intl.DateTimeFormat("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
    }).format(new Date(timestamp));
}

function getReadablePageTitle(title: string, path: string): string {
    const cleanTitle = title
        .replace(/^visited\s+/i, "")
        .replace(/\/profile(?:\/.*)?$/i, "")
        .trim();

    if (cleanTitle && !/^https?:\/\//i.test(cleanTitle)) {
        return cleanTitle;
    }

    const segments = path
        .split("/")
        .filter(Boolean)
        .filter((segment) => segment.toLowerCase() !== "profile");

    if (!segments.length) return "My Profile";

    const lastSegment = segments[segments.length - 1];

    return lastSegment
        .replace(/[-_]+/g, " ")
        .replace(/\b\w/g, (character) => character.toUpperCase());
}

function getOrderType(type?: string): string {
    const normalized = (type ?? "").trim().toLowerCase();

    return normalized === "service" || normalized === "booking"
        ? "Service booking"
        : "Product order";
}

function ProfileActivityHistoryPage() {
    const [pageHistory, setPageHistory] = useState<PageVisit[]>([]);
    const [orderHistory, setOrderHistory] = useState<OrderHistoryItem[]>([]);
    const [applicationActivity, setApplicationActivity] = useState<ActivityItem[]>([]);

    const refreshData = () => {
        setPageHistory(readPageHistory());
        setOrderHistory(readOrderHistory());
        setApplicationActivity(readApplications());
    };

    useEffect(() => {
        refreshData();

        const handleStorage = () => refreshData();

        window.addEventListener("storage", handleStorage);
        window.addEventListener("oneservice-page-visit", handleStorage);
        window.addEventListener("oneservice-order-change", handleStorage);
        window.addEventListener("oneservice-professional-change", handleStorage);
        window.addEventListener("oneservice-seller-change", handleStorage);
        window.addEventListener("oneservice-vendor-change", handleStorage);
        window.addEventListener("oneservice-student-change", handleStorage);
        window.addEventListener("oneservice-workspace-change", handleStorage);

        return () => {
            window.removeEventListener("storage", handleStorage);
            window.removeEventListener("oneservice-page-visit", handleStorage);
            window.removeEventListener("oneservice-order-change", handleStorage);
            window.removeEventListener("oneservice-professional-change", handleStorage);
            window.removeEventListener("oneservice-seller-change", handleStorage);
            window.removeEventListener("oneservice-vendor-change", handleStorage);
            window.removeEventListener("oneservice-student-change", handleStorage);
            window.removeEventListener("oneservice-workspace-change", handleStorage);
        };
    }, []);

    const activityItems = useMemo<ActivityItem[]>(() => {
        const visits: ActivityItem[] = pageHistory.map((visit) => ({
            id: `visit-${visit.id}`,
            title: `Visited ${getReadablePageTitle(visit.title, visit.path)}`,
            detail: "Page visit",
            date: visit.visitedAt,
            kind: "page",
            path: visit.path,
        }));

        const orders: ActivityItem[] = orderHistory.map((order) => ({
            id: `order-${order.id}`,
            title: order.title,
            detail: `${getOrderType(order.type)} · ${order.status}`,
            date: order.date ?? "",
            kind: "order",
        }));

        return [...visits, ...orders, ...applicationActivity].sort(
            (first, second) =>
                getTimestamp(second.date) - getTimestamp(first.date),
        );
    }, [pageHistory, orderHistory, applicationActivity]);

    const sortedPageHistory = useMemo(
        () =>
            [...pageHistory].sort(
                (first, second) =>
                    getTimestamp(second.visitedAt) -
                    getTimestamp(first.visitedAt),
            ),
        [pageHistory],
    );

    return (
        <main className="profile-activity-history-page">
            <div className="profile-activity-history-container">
                <header className="profile-activity-history-header">
                    <Link
                        to="/profile"
                        className="profile-activity-back-link"
                    >
                        <ArrowLeft size={18} />
                        Back to My Profile
                    </Link>

                    <div className="profile-activity-page-title">
                        <span className="profile-activity-eyebrow">
                            YOUR ONESERVICE ACCOUNT
                        </span>
                        <h1>Activity & History</h1>
                        <p>
                            Review your recent actions, account updates,
                            orders and previously visited pages.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="profile-activity-refresh-button"
                        onClick={refreshData}
                    >
                        <RefreshCw size={16} />
                        Refresh
                    </button>
                </header>

                <div className="profile-activity-history-grid">
                    <section className="profile-content-section profile-activity-card">
                        <div className="profile-content-heading">
                            <div className="profile-heading-icon">
                                <Activity size={21} />
                            </div>
                            <div>
                                <h2>Recent Activity</h2>
                                <p>
                                    Your orders, account updates and recent
                                    page visits.
                                </p>
                            </div>
                        </div>

                        {activityItems.length > 0 ? (
                            <div className="profile-timeline-list">
                                {activityItems.map((item) => (
                                    <article
                                        className="profile-timeline-item"
                                        key={item.id}
                                    >
                                        <span
                                            className={`profile-timeline-dot ${
                                                item.kind === "order"
                                                    ? "is-order"
                                                    : item.kind === "application"
                                                      ? "is-application"
                                                      : "is-page"
                                            }`}
                                        >
                                            {item.kind === "order" ? (
                                                getOrderType(item.detail) ===
                                                "Service booking" ? (
                                                    <Wrench size={16} />
                                                ) : (
                                                    <ShoppingBag size={16} />
                                                )
                                            ) : item.kind === "application" ? (
                                                <Bell size={16} />
                                            ) : (
                                                <Clock3 size={16} />
                                            )}
                                        </span>

                                        <div className="profile-timeline-copy">
                                            <strong>{item.title}</strong>
                                            <small>{item.detail}</small>
                                            {item.date && (
                                                <time dateTime={item.date}>
                                                    {formatDate(item.date)}
                                                </time>
                                            )}
                                        </div>

                                        {item.kind === "page" && item.path && (
                                            <Link
                                                to={item.path}
                                                className="profile-history-open"
                                                aria-label={`Open ${getReadablePageTitle(
                                                    item.title,
                                                    item.path,
                                                )}`}
                                                title="Open page"
                                            >
                                                <ExternalLink size={16} />
                                            </Link>
                                        )}
                                    </article>
                                ))}
                            </div>
                        ) : (
                            <div className="profile-history-empty">
                                <Activity size={25} />
                                <h3>No recent activity yet</h3>
                                <p>
                                    Your orders, page visits and account
                                    updates will appear here when available.
                                </p>
                            </div>
                        )}

                        <div className="profile-activity-section-footer">
                            <span>
                                {activityItems.length}{" "}
                                {activityItems.length === 1
                                    ? "activity item"
                                    : "activity items"}
                            </span>
                        </div>
                    </section>

                    <section className="profile-content-section profile-history-card">
                        <div className="profile-content-heading">
                            <div className="profile-heading-icon">
                                <History size={21} />
                            </div>
                            <div>
                                <h2>History</h2>
                                <p>
                                    Pages you have visited on NeedOneService.
                                </p>
                            </div>
                        </div>

                        {sortedPageHistory.length > 0 ? (
                            <div className="profile-page-history-list">
                                {sortedPageHistory.map((visit) => (
                                    <article
                                        className="profile-page-history-item"
                                        key={visit.id}
                                    >
                                        <div className="profile-page-history-icon">
                                            <History size={17} />
                                        </div>

                                        <div className="profile-page-history-copy">
                                            <strong>
                                                {getReadablePageTitle(
                                                    visit.title,
                                                    visit.path,
                                                )}
                                            </strong>
                                            <time dateTime={visit.visitedAt}>
                                                {formatDate(visit.visitedAt)}
                                            </time>
                                        </div>

                                        <Link
                                            to={visit.path}
                                            className="profile-history-open"
                                            aria-label={`Reopen ${getReadablePageTitle(
                                                visit.title,
                                                visit.path,
                                            )}`}
                                            title="Reopen page"
                                        >
                                            <ExternalLink size={16} />
                                        </Link>
                                    </article>
                                ))}
                            </div>
                        ) : (
                            <div className="profile-history-empty">
                                <History size={25} />
                                <h3>No page history yet</h3>
                                <p>
                                    Pages you visit will appear here once
                                    page tracking is enabled.
                                </p>
                            </div>
                        )}

                        <div className="profile-activity-section-footer">
                            <span>
                                {sortedPageHistory.length}{" "}
                                {sortedPageHistory.length === 1
                                    ? "visited page"
                                    : "visited pages"}
                            </span>
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
}

export default ProfileActivityHistoryPage;
