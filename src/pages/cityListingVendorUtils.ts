
import type {
    CityListing,
    ListingCategory,
} from "./CityListingsPage";

type VendorRecord = Record<string, unknown>;

const normalize = (value: unknown) =>
    typeof value === "string" ? value.trim().toLowerCase() : "";

const getText = (...values: unknown[]): string => {
    for (const value of values) {
        if (typeof value === "string" && value.trim()) {
            return value.trim();
        }
    }
    return "";
};

const getItems = (value: unknown): unknown[] =>
    Array.isArray(value) ? value : [];

const getTextList = (value: unknown): string[] => {
    if (typeof value === "string") {
        return value
            .split(/[,;\n]/)
            .map((item) => item.trim())
            .filter(Boolean);
    }

    return getItems(value).flatMap((item) => {
        if (typeof item === "string" && item.trim()) {
            return [item.trim()];
        }

        if (item && typeof item === "object") {
            const record = item as VendorRecord;
            const text = getText(
                record.title,
                record.name,
                record.label,
                record.description,
            );
            return text ? [text] : [];
        }

        return [];
    });
};

const getGallery = (profile: VendorRecord): string[] => {
    const gallery = getItems(profile.gallery ?? profile.images);

    return gallery.flatMap((item) => {
        if (typeof item === "string" && item.trim()) {
            return [item.trim()];
        }

        if (item && typeof item === "object") {
            const record = item as VendorRecord;
            const image = getText(record.image, record.url);
            return image ? [image] : [];
        }

        return [];
    });
};

const getHours = (profile: VendorRecord) => {
    const hours = getItems(
        profile.operatingHours ?? profile.hours,
    );

    return hours.flatMap((item) => {
        if (!item || typeof item !== "object") return [];

        const record = item as VendorRecord;
        const days = getText(record.day, record.days);
        const time = getText(record.hours, record.time);

        return days || time ? [{ days, time }] : [];
    });
};

const createNumericId = (identity: string): number => {
    let hash = 0;

    for (let index = 0; index < identity.length; index++) {
        hash = (hash * 31 + identity.charCodeAt(index)) | 0;
    }

    return -Math.max(1, Math.abs(hash));
};

export function getPublishedVendorCityListings(
    categories: ListingCategory[],
): CityListing[] {
    try {
        const stored = localStorage.getItem("oneservice_vendors");
        if (!stored) return [];

        const parsed: unknown = JSON.parse(stored);
        if (!Array.isArray(parsed)) return [];

        return parsed.flatMap((rawVendor): CityListing[] => {
            if (
                !rawVendor ||
                typeof rawVendor !== "object" ||
                Array.isArray(rawVendor)
            ) {
                return [];
            }

            const vendor = rawVendor as VendorRecord;

            // Admin listing approval and vendor publication
            // are two separate requirements.
            const listingStatus = normalize(vendor.listingStatus);
            const publicationStatus = normalize(
                vendor.publicationStatus,
            );

            const isApproved = [
                "approved",
                "verified",
                "active",
            ].includes(listingStatus);

            const isPublished =
                vendor.isPublished === true &&
                ["published", "live", "active"].includes(
                    publicationStatus,
                );

            if (!isApproved || !isPublished) return [];

            // Match the vendor's selected City Listings category.
            const selectedCategory = getText(
                vendor.cityListingCategory,
            );

            const category = categories.find(
                (item) =>
                    normalize(item.id) === normalize(selectedCategory) ||
                    normalize(item.name) === normalize(selectedCategory),
            );

            if (!category || category.id === "find-my-property") {
                return [];
            }

            // Match the selected subcategory against that category.
            const selectedSubcategory = getText(
                vendor.cityListingSubcategory,
            );

            const subcategory = category.subcategories.find(
                (item) =>
                    normalize(item) === normalize(selectedSubcategory),
            );

            if (!subcategory) return [];

            const identity = getText(
                vendor.vendorId,
                vendor.id,
                vendor.mobile,
                vendor.phone,
                vendor.email,
            ).toLowerCase();

            if (!identity) return [];

            const name = getText(
                vendor.businessName,
                vendor.name,
                vendor.fullName,
            );

            if (!name) return [];

            const description = getText(
                vendor.businessDescription,
                vendor.productDescription,
                vendor.description,
            );

            const location = [
                getText(vendor.locality, vendor.businessAddress),
                getText(vendor.city),
                getText(vendor.state),
                getText(vendor.pincode),
            ]
                .filter(Boolean)
                .join(", ");

            const gallery = getGallery(vendor);
            const services = getTextList(vendor.services);
            const products = getTextList(vendor.products);
            const amenities = getTextList(
                vendor.highlights ?? vendor.amenities,
            );

            const hours = getHours(vendor);

            return [{
                id: createNumericId(identity),
                name,
                category: category.id,
                subcategory,
                label: subcategory,
                description,
                rating: Number(vendor.rating) || 0,
                reviews: Number(
                    vendor.reviewCount ?? vendor.reviews,
                ) || 0,
                location,
                phone: getText(vendor.mobile, vendor.phone),
                email: getText(vendor.email),
                image:
                    gallery[0] ||
                    getText(vendor.businessImage, vendor.logo),
                verified: true,
                openNow: false,
                about: description,
                hours,
                amenities,
                services,
                products,
                gallery,
            }];
        });
    } catch (error) {
        console.error(
            "Unable to load published vendor City Listings:",
            error,
        );
        return [];
    }
}
