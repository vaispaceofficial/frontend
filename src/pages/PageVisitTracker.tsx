import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const PAGE_HISTORY_KEY = "oneservice_page_history";
const MAX_PAGE_HISTORY = 50;

type PageVisit = {
    id: string;
    path: string;
    title: string;
    visitedAt: string;
};

function getPageTitle(pathname: string): string {
    const knownPages: Record<string, string> = {
        "/": "Home",
        "/services": "Services",
        "/marketplace": "Marketplace",
        "/city-listings": "City Listings",
        "/contact": "Contact",
        "/profile": "My Profile",
        "/amc": "Annual Maintenance Plans",
        "/accessories/all": "Accessories Marketplace",
        "/accessories-sales": "Products & Spares",
        "/register-professional": "Professional Registration",
        "/register-seller": "Seller Registration",
        "/register-vendor": "Vendor Registration",
        "/register-student": "Student Registration",
        "/login": "Login",
    };

    if (knownPages[pathname]) return knownPages[pathname];

    const finalSegment = pathname.split("/").filter(Boolean).pop();
    if (!finalSegment) return "Home";

    return decodeURIComponent(finalSegment)
        .replace(/[-_]+/g, " ")
        .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default function PageVisitTracker() {
    const location = useLocation();

    useEffect(() => {
        // Keep authentication routes out of the account's browsing history.
        if (["/login", "/logout"].includes(location.pathname)) return;

        const userRaw = localStorage.getItem("oneservice_user");
        if (!userRaw) return;

        try {
            const user = JSON.parse(userRaw) as { loggedIn?: boolean };
            if (!user.loggedIn) return;
        } catch {
            return;
        }

        const path = `${location.pathname}${location.search}${location.hash}`;
        const visit: PageVisit = {
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            path,
            title: getPageTitle(location.pathname),
            visitedAt: new Date().toISOString(),
        };

        try {
            const stored = localStorage.getItem(PAGE_HISTORY_KEY);
            const previous: PageVisit[] = stored ? JSON.parse(stored) : [];
            const safePrevious = Array.isArray(previous) ? previous : [];

            // Avoid duplicating a route when only the query/hash changes immediately.
            const lastVisit = safePrevious[0];
            const sameRecentPath = lastVisit?.path === path &&
                Date.now() - Date.parse(lastVisit.visitedAt) < 3000;
            if (sameRecentPath) return;

            localStorage.setItem(
                PAGE_HISTORY_KEY,
                JSON.stringify([visit, ...safePrevious].slice(0, MAX_PAGE_HISTORY)),
            );
            window.dispatchEvent(new Event("oneservice-page-visit"));
        } catch {
            // Tracking should never interrupt navigation if local storage is unavailable.
        }
    }, [location.pathname, location.search, location.hash]);

    return null;
}
