
import { useEffect, useMemo, useState } from "react";

import {
  AlertTriangle,
  Ban,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  Clock,
  CreditCard,
  Crown,
  Download,
  Eye,
  FileBadge,
  FileText,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  UsersRound,
  Wrench,
  X,
} from "lucide-react";

import "./Professionals.css";

/* =========================================================
   TYPES
========================================================= */

type ProviderStatus = "Verified" | "Pending";
type DocumentStatus = "Verified" | "Pending" | "Rejected";
type AccountState = "Active" | "Suspended" | "Blocked" | "Rejected";
type ReviewAction = "suspend" | "block" | "reject";
type ProfessionalAdminTab = "onboarding" | "professionals";

type SubscriptionPlan = "Basic" | "Exclusive" | "Premium";

type SubscriptionStatus =
  | "Not Started"
  | "Free Trial"
  | "Trial Expired"
  | "Active"
  | "Expired";

type RemarkType = "note" | "warning" | "final-warning";

type AdminRemark = {
  id: string;
  message: string;
  createdAt: string;
  createdBy: string;
  type: RemarkType;
  warningNumber?: number;
  readAt?: string;
  adminReviewRequired?: boolean;
  adminReviewStatus?: "Pending" | "Reviewed";
  reviewedAt?: string;
};

type ProfessionalServicePrice = {
  id?: string;
  name: string;
  price: string | number;
};

type ProviderDocument = {
  id: string;
  title: string;
  subtitle: string;
  status: DocumentStatus;
  url?: string;
  fileName: string;
};

type ProfessionalApplication = {
  id?: string;
  fullName?: string;
  name?: string;
  mobile?: string;
  phone?: string;
  email?: string;
  city?: string;
  state?: string;
  category?: string;
  designation?: string;
  services?: string[];

  servicePrices?: unknown;
  servicePricing?: unknown;
  servicePricesByService?: unknown;
  visitingFee?: string | number;

  experience?: string | number;
  workType?: string;
  workingDays?: string[];
  serviceArea?: string;
  about?: string;
  profileImage?: string;
  image?: string;
  photo?: string;
  submittedAt?: string;
  joinedOn?: string;
  status?: string;
  accountState?: AccountState;
  rejectionReason?: string;
  suspensionUntil?: string;
  suspensionDuration?: string;

  trialStartedAt?: string;
  trialEndsAt?: string;

  subscriptionPlan?: SubscriptionPlan;
  subscriptionStartedAt?: string;
  subscriptionEndsAt?: string;
  subscriptionStatus?: SubscriptionStatus;

  adminRemarks?: AdminRemark[];
  adminReviewRequired?: boolean;
  adminReviewStatus?: "Pending" | "Reviewed";
  adminReviewRequestedAt?: string;
  adminReviewCompletedAt?: string;

  documents?: Array<{
    id?: string;
    title?: string;
    name?: string;
    subtitle?: string;
    description?: string;
    status?: DocumentStatus;
    url?: string;
    fileUrl?: string;
    fileName?: string;
  }>;

  idProof?: string;
  idProofUrl?: string;
  experienceCertificate?: string;
  experienceCertificateUrl?: string;

  [key: string]: unknown;
};

type Provider = {
  id: string;
  initials: string;
  name: string;
  designation: string;
  category: string;
  location: string;
  experience: string;
  idProofStatus: ProviderStatus;
  subscriptionExpiry: string;
  joinedOn: string;
  rating: string;
  reviewCount: number;
  about: string;
  services: string[];
  servicePrices: ProfessionalServicePrice[];
  visitingFee?: string | number;
  phone: string;
  email: string;
  profileImage?: string;

  accountState?: AccountState;
  rejectionReason?: string;
  suspensionUntil?: string;
  suspensionDuration?: string;

  trialStartedAt?: string;
  trialEndsAt?: string;

  subscriptionPlan?: SubscriptionPlan;
  subscriptionStartedAt?: string;
  subscriptionEndsAt?: string;
  subscriptionStatus?: SubscriptionStatus;

  adminRemarks: AdminRemark[];
  adminReviewRequired?: boolean;
  adminReviewStatus?: "Pending" | "Reviewed";
  adminReviewRequestedAt?: string;
  adminReviewCompletedAt?: string;

  documents: ProviderDocument[];
};

/* =========================================================
   CONSTANTS
========================================================= */

const PAGE_SIZE = 5;
const TRIAL_DURATION_DAYS = 30;
const MAX_FORMAL_WARNINGS = 3;
const ADMIN_DISPLAY_NAME = "Edmund";

const APPLICATION_KEY = "oneservice_professional_application";
const APPLICATIONS_KEY = "oneservice_professional_applications";
const PROFESSIONALS_KEY = "oneservice_professionals";

const CHANGE_EVENT = "oneservice-professional-change";
const REMARK_EVENT = "oneservice-professional-remark";

const SUBSCRIPTION_PLANS: {
  name: SubscriptionPlan;
  price: number;
  description: string;
  features: string[];
}[] = [
    {
      name: "Basic",
      price: 199,
      description: "Essential professional visibility",
      features: [
        "Professional profile listing",
        "Service enquiries",
        "Basic profile management",
      ],
    },
    {
      name: "Exclusive",
      price: 499,
      description: "More visibility for your business",
      features: [
        "Everything in Basic",
        "Priority profile visibility",
        "Enhanced professional listing",
        "Customer enquiry management",
      ],
    },
    {
      name: "Premium",
      price: 999,
      description: "Maximum professional exposure",
      features: [
        "Everything in Exclusive",
        "Premium profile visibility",
        "Featured professional listing",
        "Priority support",
        "Lead Analytics & Profile View Insights",
      ],
    },
  ];

const serviceTypes = [
  "Service Type",
  "AC Technician",
  "Electrician",
  "Plumber",
  "Tailor",
  "Cleaning",
  "Carpenter",
  "Home Appliances",
  "Home Services",
  "Personal Services",
  "Professional Services",
  "Home Staff",
  "EduTech & Home Tutors",
];

const locations = [
  "Location",
  "Visakhapatnam",
  "Vizianagaram",
  "Anakapalle",
  "Gajuwaka",
  "Madhurawada",
  "MVP Colony",
  "Dwaraka Nagar",
  "Siripuram",
];

const statuses = [
  "All statuses",
  "Pending",
  "Verified",
  "Suspended",
  "Blocked",
  "Rejected",
];

/* =========================================================
   GENERAL HELPERS
========================================================= */

function safeReadJson<T>(key: string, fallback: T): T {
  try {
    const value = localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

function getInitials(name: string): string {
  return (
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("") || "PR"
  );
}

function normalizePhone(value?: string): string {
  return String(value || "").replace(/\D/g, "");
}

function formatDate(value?: string): string {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatDateTime(value?: string): string {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function normalizeDocumentStatus(status?: string): DocumentStatus {
  const normalized = (status || "").toLowerCase();

  if (normalized === "verified" || normalized === "approved") {
    return "Verified";
  }

  if (normalized === "rejected") {
    return "Rejected";
  }

  return "Pending";
}

/* =========================================================
   SERVICE PRICE HELPERS
========================================================= */

function normalizeServicePriceItems(
  value: unknown,
): ProfessionalServicePrice[] {
  if (!value) return [];

  const normalizeItem = (
    item: unknown,
    fallbackName?: string,
  ): ProfessionalServicePrice | null => {
    if (typeof item === "number" || typeof item === "string") {
      if (!fallbackName) return null;

      return {
        name: fallbackName,
        price: item,
      };
    }

    if (!item || typeof item !== "object" || Array.isArray(item)) {
      return null;
    }

    const record = item as Record<string, unknown>;

    const name =
      record.name ??
      record.serviceName ??
      record.service ??
      record.title ??
      record.label ??
      fallbackName;

    const price =
      record.price ??
      record.servicePrice ??
      record.amount ??
      record.rate ??
      record.value;

    if (
      typeof name !== "string" ||
      price === undefined ||
      price === null ||
      price === ""
    ) {
      return null;
    }

    return {
      id: typeof record.id === "string" ? record.id : undefined,
      name,
      price: price as string | number,
    };
  };

  if (Array.isArray(value)) {
    return value
      .map((item) => normalizeItem(item))
      .filter(
        (item): item is ProfessionalServicePrice => item !== null,
      );
  }

  if (typeof value === "object") {
    return Object.entries(value as Record<string, unknown>)
      .map(([name, item]) => normalizeItem(item, name))
      .filter(
        (item): item is ProfessionalServicePrice => item !== null,
      );
  }

  return [];
}

function normalizeServicePrices(
  application: ProfessionalApplication,
): ProfessionalServicePrice[] {
  const id = application.id;

  const directPrices = normalizeServicePriceItems(
    application.servicePrices ??
    application.servicePricing ??
    application.servicePricesByService,
  );

  if (directPrices.length > 0) return directPrices;

  if (id) {
    const individualPrices = safeReadJson<unknown>(
      `oneservice_professional_service_prices_${id}`,
      null,
    );

    const normalizedIndividual =
      normalizeServicePriceItems(individualPrices);

    if (normalizedIndividual.length > 0) return normalizedIndividual;
  }

  const sharedPrices = safeReadJson<unknown>(
    "oneservice_professional_service_prices",
    null,
  );

  if (Array.isArray(sharedPrices)) {
    const matchingRecords = sharedPrices.filter((item) => {
      if (!item || typeof item !== "object") return false;

      const record = item as Record<string, unknown>;

      return (
        record.professionalId === id ||
        record.applicationId === id ||
        record.providerId === id
      );
    });

    const normalizedShared =
      normalizeServicePriceItems(matchingRecords);

    if (normalizedShared.length > 0) return normalizedShared;
  }

  if (
    sharedPrices &&
    typeof sharedPrices === "object" &&
    !Array.isArray(sharedPrices) &&
    id
  ) {
    const priceRecord = (
      sharedPrices as Record<string, unknown>
    )[id];

    const normalizedShared =
      normalizeServicePriceItems(priceRecord);

    if (normalizedShared.length > 0) return normalizedShared;
  }

  const servicePricesFromServices =
    normalizeServicePriceItems(application.services);

  if (servicePricesFromServices.length > 0) {
    return servicePricesFromServices;
  }

  return [];
}

function formatRupee(value?: string | number): string {
  if (value === undefined || value === null || value === "") {
    return "Not provided";
  }

  const numericValue = Number(value);

  if (Number.isFinite(numericValue)) {
    return `₹${numericValue.toLocaleString("en-IN")}`;
  }

  return `₹${String(value)}`;
}

/* =========================================================
   DOCUMENT HELPERS
========================================================= */

function normalizeDocuments(
  application: ProfessionalApplication,
): ProviderDocument[] {
  const suppliedDocuments = Array.isArray(application.documents)
    ? application.documents
    : [];

  const documents: ProviderDocument[] = suppliedDocuments.map(
    (document, index) => ({
      id: document.id || `document-${index + 1}`,
      title: document.title || document.name || `Document ${index + 1}`,
      subtitle:
        document.subtitle ||
        document.description ||
        document.fileName ||
        "Submitted document",
      status: normalizeDocumentStatus(document.status),
      url: document.url || document.fileUrl,
      fileName:
        document.fileName ||
        `${(document.title || document.name || "document")
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")}.pdf`,
    }),
  );

  if (documents.length > 0) return documents;

  if (application.idProofUrl || application.idProof) {
    documents.push({
      id: "id-proof",
      title: "Government ID Proof",
      subtitle: "Identity document submitted during registration",
      status: "Pending",
      url: application.idProofUrl || application.idProof,
      fileName: "professional-id-proof.pdf",
    });
  }

  if (
    application.experienceCertificateUrl ||
    application.experienceCertificate
  ) {
    documents.push({
      id: "experience",
      title: "Experience Certificate",
      subtitle: "Professional experience document",
      status: "Pending",
      url:
        application.experienceCertificateUrl ||
        application.experienceCertificate,
      fileName: "professional-experience-certificate.pdf",
    });
  }

  if (documents.length === 0) {
    documents.push({
      id: "registration",
      title: "Registration Details",
      subtitle: "Professional registration information",
      status: "Pending",
      fileName: "professional-registration.pdf",
    });
  }

  return documents;
}

/* =========================================================
   ACCOUNT STATUS AND PROVIDER NORMALIZATION
========================================================= */

function normalizeAccountState(
  application: ProfessionalApplication,
): AccountState | undefined {
  if (application.accountState) return application.accountState;

  const status = (application.status || "").toLowerCase();

  if (
    status === "approved" ||
    status === "verified" ||
    status === "active"
  ) {
    return "Active";
  }

  if (status === "rejected") return "Rejected";
  if (status === "blocked") return "Blocked";
  if (status === "suspended") return "Suspended";

  return undefined;
}

function normalizeProvider(
  application: ProfessionalApplication,
  index: number,
): Provider {
  const name =
    application.fullName ||
    application.name ||
    "Unnamed Professional";

  const category =
    application.category ||
    application.designation ||
    "Professional Services";

  const phone = application.mobile || application.phone || "—";

  const id =
    application.id ||
    (phone !== "—" ? `PRO-${normalizePhone(phone)}` : `PRO-${index + 1}`);

  const accountState = normalizeAccountState(application);
  const isApproved = accountState === "Active";

  return {
    id,
    initials: getInitials(name),
    name,
    designation: application.designation || category,
    category,

    location:
      [application.city, application.state].filter(Boolean).join(", ") ||
      application.serviceArea ||
      "Location not provided",

    experience:
      application.experience !== undefined &&
        application.experience !== ""
        ? `${application.experience}${typeof application.experience === "number" ||
          /^\d+$/.test(String(application.experience))
          ? " years"
          : ""
        }`
        : "Not provided",

    idProofStatus: isApproved ? "Verified" : "Pending",
    subscriptionExpiry: formatDate(application.subscriptionEndsAt),
    joinedOn: formatDate(application.submittedAt || application.joinedOn),
    rating: "—",
    reviewCount: 0,
    about: application.about || "No professional description provided.",

    services: Array.isArray(application.services)
      ? application.services.filter(
        (service): service is string =>
          typeof service === "string",
      )
      : [],

    servicePrices: normalizeServicePrices(application),
    visitingFee: application.visitingFee,

    phone,
    email: application.email || "—",

    profileImage:
      application.profileImage ||
      application.image ||
      application.photo,

    accountState,
    rejectionReason: application.rejectionReason,
    suspensionUntil: application.suspensionUntil,
    suspensionDuration: application.suspensionDuration,

    trialStartedAt: application.trialStartedAt,
    trialEndsAt: application.trialEndsAt,

    subscriptionPlan: application.subscriptionPlan,
    subscriptionStartedAt: application.subscriptionStartedAt,
    subscriptionEndsAt: application.subscriptionEndsAt,
    subscriptionStatus: application.subscriptionStatus,

    adminRemarks: Array.isArray(application.adminRemarks)
      ? application.adminRemarks
      : [],

    adminReviewRequired: application.adminReviewRequired,
    adminReviewStatus: application.adminReviewStatus,
    adminReviewRequestedAt: application.adminReviewRequestedAt,
    adminReviewCompletedAt: application.adminReviewCompletedAt,

    documents: normalizeDocuments(application),
  };
}

/* =========================================================
   READ AND MERGE PROFESSIONAL RECORDS
========================================================= */

function getApplicationIdentity(
  record: ProfessionalApplication,
  index: number,
): string {
  const phone = normalizePhone(record.mobile || record.phone);

  if (phone) return `phone:${phone}`;
  if (record.id) return `id:${record.id}`;

  return `record:${record.fullName || record.name || "professional"}:${index}`;
}

function readApplications(): ProfessionalApplication[] {
  const multiple = safeReadJson<unknown>(APPLICATIONS_KEY, []);
  const professionals = safeReadJson<unknown>(PROFESSIONALS_KEY, []);
  const single = safeReadJson<unknown>(APPLICATION_KEY, null);

  const combined: ProfessionalApplication[] = [];

  if (Array.isArray(multiple)) {
    combined.push(...(multiple as ProfessionalApplication[]));
  }

  /*
   * The professional directory is the source of truth for existing
   * accounts. Legacy directory entries without a status are treated
   * as active unless explicitly marked pending or rejected.
   */
  if (Array.isArray(professionals)) {
    combined.push(
      ...(professionals as ProfessionalApplication[]).map((record) => {
        if (record.accountState || record.status) return record;

        return {
          ...record,
          accountState: "Active" as AccountState,
          status: "Approved",
        };
      }),
    );
  }

  if (single && typeof single === "object" && !Array.isArray(single)) {
    combined.push(single as ProfessionalApplication);
  }

  const unique = new Map<string, ProfessionalApplication>();

  combined.forEach((record, index) => {
    const identity = getApplicationIdentity(record, index);
    const previous = unique.get(identity);

    unique.set(identity, {
      ...previous,
      ...record,
    });
  });

  return Array.from(unique.values());
}

/* =========================================================
   TAB CLASSIFICATION
========================================================= */

function isPending(provider: Provider): boolean {
  return provider.accountState === undefined;
}

function isOnboardingProvider(provider: Provider): boolean {
  return (
    provider.accountState === undefined ||
    provider.accountState === "Rejected"
  );
}

function isDirectoryProfessional(provider: Provider): boolean {
  return (
    provider.accountState === "Active" ||
    provider.accountState === "Suspended" ||
    provider.accountState === "Blocked"
  );
}

function getDisplayedStatus(provider: Provider): string {
  if (provider.accountState) {
    return provider.accountState === "Active"
      ? "Verified"
      : provider.accountState;
  }

  return provider.idProofStatus;
}

function getStatusClass(provider: Provider): string {
  return getDisplayedStatus(provider).toLowerCase();
}

function getReasonLabel(provider: Provider): string {
  switch (provider.accountState) {
    case "Rejected":
      return "Rejection reason";
    case "Blocked":
      return "Block reason";
    case "Suspended":
      return "Suspension reason";
    default:
      return "Reason";
  }
}

/* =========================================================
   REMARK AND WARNING HELPERS
========================================================= */

function getFormalWarningCount(remarks: AdminRemark[]): number {
  return remarks.filter(
    (remark) =>
      remark.type === "warning" ||
      remark.type === "final-warning",
  ).length;
}

function getWarningLabel(count: number): string {
  if (count >= MAX_FORMAL_WARNINGS) return "Final Warning";
  return `Warning ${count} of ${MAX_FORMAL_WARNINGS}`;
}

/* =========================================================
   SUBSCRIPTION HELPERS
========================================================= */

function calculateTrialEnd(startDate: string): string {
  const start = new Date(startDate);
  const end = new Date(start);

  end.setDate(end.getDate() + TRIAL_DURATION_DAYS);

  return end.toISOString();
}

function getTrialRemaining(endDate?: string) {
  if (!endDate) return null;

  const difference = new Date(endDate).getTime() - Date.now();

  if (!Number.isFinite(difference) || difference <= 0) {
    return {
      expired: true,
      days: 0,
      hours: 0,
      minutes: 0,
    };
  }

  const totalMinutes = Math.floor(difference / 60000);

  return {
    expired: false,
    days: Math.floor(totalMinutes / 1440),
    hours: Math.floor((totalMinutes % 1440) / 60),
    minutes: totalMinutes % 60,
  };
}

function getSubscriptionStatus(
  provider: Provider,
  currentTime: number,
): SubscriptionStatus {
  if (
    provider.subscriptionStartedAt &&
    provider.subscriptionEndsAt
  ) {
    return new Date(provider.subscriptionEndsAt).getTime() > currentTime
      ? "Active"
      : "Expired";
  }

  if (!provider.trialStartedAt || !provider.trialEndsAt) {
    return "Not Started";
  }

  return new Date(provider.trialEndsAt).getTime() > currentTime
    ? "Free Trial"
    : "Trial Expired";
}

/* =========================================================
   RECORD MATCHING
========================================================= */

function matchesProvider(
  application: ProfessionalApplication,
  provider: Provider,
): boolean {
  if (application.id && application.id === provider.id) {
    return true;
  }

  const applicationPhone = normalizePhone(
    application.mobile || application.phone,
  );

  const providerPhone = normalizePhone(provider.phone);

  return Boolean(
    applicationPhone &&
    providerPhone &&
    applicationPhone === providerPhone,
  );
}

/* =========================================================
   PERSIST APPLICATION UPDATES
========================================================= */

function persistApplicationUpdates(
  provider: Provider,
  updates: Partial<ProfessionalApplication>,
) {
  const updateRecords = (
    records: ProfessionalApplication[],
  ) =>
    records.map((application) =>
      matchesProvider(application, provider)
        ? { ...application, ...updates }
        : application,
    );

  const applications = safeReadJson<ProfessionalApplication[]>(
    APPLICATIONS_KEY,
    [],
  );

  if (Array.isArray(applications)) {
    localStorage.setItem(
      APPLICATIONS_KEY,
      JSON.stringify(updateRecords(applications)),
    );
  }

  const professionals = safeReadJson<ProfessionalApplication[]>(
    PROFESSIONALS_KEY,
    [],
  );

  if (Array.isArray(professionals)) {
    localStorage.setItem(
      PROFESSIONALS_KEY,
      JSON.stringify(updateRecords(professionals)),
    );
  }

  const single = safeReadJson<ProfessionalApplication | null>(
    APPLICATION_KEY,
    null,
  );

  if (single && matchesProvider(single, provider)) {
    localStorage.setItem(
      APPLICATION_KEY,
      JSON.stringify({ ...single, ...updates }),
    );
  }

  window.dispatchEvent(new Event(CHANGE_EVENT));
}

/* =========================================================
   PROMOTE APPROVED APPLICANT TO PROFESSIONAL DIRECTORY
========================================================= */

function promoteProviderToDirectory(
  provider: Provider,
  updates: Partial<ProfessionalApplication>,
) {
  const allApplications = readApplications();

  const sourceRecord =
    allApplications.find((application) =>
      matchesProvider(application, provider),
    ) || {};

  const promotedRecord: ProfessionalApplication = {
    ...sourceRecord,
    ...updates,

    id: sourceRecord.id || provider.id,

    fullName:
      sourceRecord.fullName ||
      sourceRecord.name ||
      provider.name,

    name: provider.name,

    mobile:
      sourceRecord.mobile ||
      sourceRecord.phone ||
      provider.phone,

    email: provider.email,
    category: provider.category,
    designation: provider.designation,

    services: provider.services,
    servicePrices: provider.servicePrices,
    visitingFee: provider.visitingFee,

    experience: sourceRecord.experience || provider.experience,
    about: provider.about,
    profileImage: provider.profileImage,

    status: "Approved",
    accountState: "Active",

    rejectionReason: undefined,
    suspensionUntil: undefined,
    suspensionDuration: undefined,

    trialStartedAt: provider.trialStartedAt,
    trialEndsAt: provider.trialEndsAt,

    subscriptionPlan: provider.subscriptionPlan,
    subscriptionStartedAt: provider.subscriptionStartedAt,
    subscriptionEndsAt: provider.subscriptionEndsAt,
    subscriptionStatus: provider.subscriptionStatus,

    documents: provider.documents.map((document) => ({
      id: document.id,
      title: document.title,
      subtitle: document.subtitle,
      status: "Verified",
      url: document.url,
      fileName: document.fileName,
    })),

    adminRemarks: provider.adminRemarks,
  };

  const existingProfessionals = safeReadJson<
    ProfessionalApplication[]
  >(PROFESSIONALS_KEY, []);

  const professionalIndex = existingProfessionals.findIndex(
    (professional) =>
      matchesProvider(professional, provider),
  );

  const updatedProfessionals = [...existingProfessionals];

  if (professionalIndex >= 0) {
    updatedProfessionals[professionalIndex] = {
      ...updatedProfessionals[professionalIndex],
      ...promotedRecord,
    };
  } else {
    updatedProfessionals.push(promotedRecord);
  }

  localStorage.setItem(
    PROFESSIONALS_KEY,
    JSON.stringify(updatedProfessionals),
  );

  window.dispatchEvent(new Event(CHANGE_EVENT));
}

/* =========================================================
   PERSIST PROFESSIONAL STATUS
========================================================= */

function persistProviderUpdate(
  provider: Provider,
  updatedState: AccountState,
  reason?: string,
  suspensionDuration?: string,
  suspensionUntil?: string,
) {
  persistApplicationUpdates(provider, {
    status: updatedState === "Active" ? "Approved" : updatedState,
    accountState: updatedState,
    rejectionReason: reason,
    suspensionDuration,
    suspensionUntil,

    trialStartedAt: provider.trialStartedAt,
    trialEndsAt: provider.trialEndsAt,

    subscriptionPlan: provider.subscriptionPlan,
    subscriptionStartedAt: provider.subscriptionStartedAt,
    subscriptionEndsAt: provider.subscriptionEndsAt,
    subscriptionStatus: provider.subscriptionStatus,
  });
}

/* =========================================================
   PERSIST SUBSCRIPTION DATA
========================================================= */

function persistSubscriptionUpdate(
  provider: Provider,
  updates: Partial<ProfessionalApplication>,
) {
  persistApplicationUpdates(provider, updates);
}

/* =========================================================
   PERSIST ADMIN REMARK
========================================================= */

function persistProfessionalRemark(
  provider: Provider,
  remark: AdminRemark,
  updatedRemarks: AdminRemark[],
) {
  const isFinalWarning = remark.type === "final-warning";

  persistApplicationUpdates(provider, {
    adminRemarks: updatedRemarks,

    ...(isFinalWarning
      ? {
        adminReviewRequired: true,
        adminReviewStatus: "Pending",
        adminReviewRequestedAt: remark.createdAt,
        adminReviewCompletedAt: undefined,
      }
      : {}),
  });

  window.dispatchEvent(
    new CustomEvent(REMARK_EVENT, {
      detail: {
        professionalId: provider.id,
        professionalName: provider.name,
        remark,
      },
    }),
  );
}

/* =========================================================
   COMPLETE FINAL WARNING ADMIN REVIEW
========================================================= */

function persistAdminReviewCompleted(provider: Provider) {
  const now = new Date().toISOString();

  const updatedRemarks = provider.adminRemarks.map((remark) =>
    remark.type === "final-warning" &&
      remark.adminReviewRequired
      ? {
        ...remark,
        adminReviewStatus: "Reviewed" as const,
        reviewedAt: now,
      }
      : remark,
  );

  persistApplicationUpdates(provider, {
    adminRemarks: updatedRemarks,
    adminReviewRequired: false,
    adminReviewStatus: "Reviewed",
    adminReviewCompletedAt: now,
  });

  return updatedRemarks;
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function BookServices() {
  const [activeTab, setActiveTab] =
    useState<ProfessionalAdminTab>("onboarding");

  const [serviceType, setServiceType] = useState("Service Type");
  const [location, setLocation] = useState("Location");
  const [status, setStatus] = useState("All statuses");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [selectedProvider, setSelectedProvider] =
    useState<Provider | null>(null);

  const [selectedPlan, setSelectedPlan] =
    useState<SubscriptionPlan>("Basic");

  const [notice, setNotice] = useState("");

  const [reviewTarget, setReviewTarget] =
    useState<Provider | null>(null);

  const [reviewAction, setReviewAction] =
    useState<ReviewAction>("suspend");

  const [reviewReason, setReviewReason] = useState("");
  const [reviewError, setReviewError] = useState("");
  const [suspensionDuration, setSuspensionDuration] = useState("7");

  const [providerList, setProviderList] = useState<Provider[]>([]);
  const [currentTime, setCurrentTime] = useState(Date.now());

  const [remarkModalOpen, setRemarkModalOpen] = useState(false);
  const [remarkMessage, setRemarkMessage] = useState("");
  const [remarkType, setRemarkType] =
    useState<"note" | "warning">("note");
  const [remarkError, setRemarkError] = useState("");

  /* =====================================================
     LOAD AND REFRESH PROFESSIONAL RECORDS
  ===================================================== */

  useEffect(() => {
    const loadProviders = () => {
      const registeredApplications = readApplications();

      const mappedProviders = registeredApplications.map(
        (application, index) =>
          normalizeProvider(application, index),
      );

      setProviderList(mappedProviders);

      setSelectedProvider((current) => {
        if (!current) return current;

        return (
          mappedProviders.find(
            (provider) => provider.id === current.id,
          ) ?? current
        );
      });
    };

    loadProviders();

    window.addEventListener("storage", loadProviders);
    window.addEventListener(CHANGE_EVENT, loadProviders);

    return () => {
      window.removeEventListener("storage", loadProviders);
      window.removeEventListener(CHANGE_EVENT, loadProviders);
    };
  }, []);

  /* =====================================================
     LIVE SUBSCRIPTION COUNTDOWN
  ===================================================== */

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  /* =====================================================
     TAB COUNTS
  ===================================================== */

  const onboardingCount = providerList.filter(
    isOnboardingProvider,
  ).length;

  const pendingCount = providerList.filter(
    (provider) => isPending(provider),
  ).length;

  const professionalsCount = providerList.filter(
    isDirectoryProfessional,
  ).length;

  const activeProfessionalsCount = providerList.filter(
    (provider) => provider.accountState === "Active",
  ).length;

  const restrictedProfessionalsCount = providerList.filter(
    (provider) =>
      provider.accountState === "Suspended" ||
      provider.accountState === "Blocked",
  ).length;

  /* =====================================================
     FILTER RECORDS BY ACTIVE TAB
  ===================================================== */

  const filteredProviders = useMemo(() => {
    const query = search.trim().toLowerCase();

    return providerList.filter((provider) => {
      const matchesTab =
        activeTab === "onboarding"
          ? isOnboardingProvider(provider)
          : isDirectoryProfessional(provider);

      if (!matchesTab) return false;

      const matchesService =
        serviceType === "Service Type" ||
        provider.category.toLowerCase() === serviceType.toLowerCase() ||
        provider.services.some(
          (service) =>
            service.toLowerCase() === serviceType.toLowerCase(),
        );

      const matchesLocation =
        location === "Location" ||
        provider.location.toLowerCase().includes(location.toLowerCase());

      const matchesStatus =
        status === "All statuses" ||
        getDisplayedStatus(provider) === status;

      const searchableValues = [
        provider.name,
        provider.designation,
        provider.category,
        provider.id,
        provider.location,
        provider.phone,
        provider.email,
        ...provider.services,
        ...provider.servicePrices.map((item) => item.name),
      ];

      const matchesSearch =
        !query ||
        searchableValues.some((value) =>
          value.toLowerCase().includes(query),
        );

      return (
        matchesService &&
        matchesLocation &&
        matchesStatus &&
        matchesSearch
      );
    });
  }, [
    providerList,
    activeTab,
    serviceType,
    location,
    status,
    search,
  ]);

  /* =====================================================
     PAGINATION
  ===================================================== */

  const pageCount = Math.max(
    1,
    Math.ceil(filteredProviders.length / PAGE_SIZE),
  );

  const currentPage = Math.min(page, pageCount);

  const paginatedProviders = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredProviders.slice(start, start + PAGE_SIZE);
  }, [filteredProviders, currentPage]);

  const firstItem =
    filteredProviders.length === 0
      ? 0
      : (currentPage - 1) * PAGE_SIZE + 1;

  const lastItem = Math.min(
    currentPage * PAGE_SIZE,
    filteredProviders.length,
  );

  useEffect(() => {
    if (page !== currentPage) {
      setPage(currentPage);
    }
  }, [page, currentPage]);

  const hasFilters =
    serviceType !== "Service Type" ||
    location !== "Location" ||
    status !== "All statuses" ||
    search.trim() !== "";

  const clearFilters = () => {
    setServiceType("Service Type");
    setLocation("Location");
    setStatus("All statuses");
    setSearch("");
    setPage(1);
  };

  const changeTab = (tab: ProfessionalAdminTab) => {
    setActiveTab(tab);
    setPage(1);
    clearFilters();
    setSelectedProvider(null);
    setNotice("");
  };

  /* =====================================================
     UPDATE PROVIDER
  ===================================================== */

  const updateProvider = (
    updated: Provider,
    nextState: AccountState,
    reason?: string,
    duration?: string,
    until?: string,
  ) => {
    const finalProvider: Provider = {
      ...updated,
      accountState: nextState,
      rejectionReason: reason,
      suspensionDuration: duration,
      suspensionUntil: until,
      idProofStatus:
        nextState === "Active" ? "Verified" : "Pending",
    };

    persistProviderUpdate(
      finalProvider,
      nextState,
      reason,
      duration,
      until,
    );

    setProviderList((current) =>
      current.map((provider) =>
        provider.id === updated.id ? finalProvider : provider,
      ),
    );

    setSelectedProvider((current) =>
      current?.id === updated.id ? finalProvider : current,
    );

    setReviewTarget(null);
    setPage(1);
  };

  /* =====================================================
     OPEN PROFILE
  ===================================================== */

  const openProviderProfile = (provider: Provider) => {
    let updatedProvider = provider;

    if (
      provider.accountState === "Active" &&
      !provider.trialStartedAt &&
      !provider.subscriptionStartedAt
    ) {
      const now = new Date().toISOString();
      const trialEndsAt = calculateTrialEnd(now);

      updatedProvider = {
        ...provider,
        trialStartedAt: now,
        trialEndsAt,
        subscriptionStatus: "Free Trial",
      };

      persistSubscriptionUpdate(provider, {
        trialStartedAt: now,
        trialEndsAt,
        subscriptionStatus: "Free Trial",
      });

      setProviderList((current) =>
        current.map((item) =>
          item.id === provider.id ? updatedProvider : item,
        ),
      );
    }

    setSelectedProvider(updatedProvider);
    setNotice("");
  };

  /* =====================================================
     REVIEW DIALOG
  ===================================================== */

  const openReviewDialog = (
    provider: Provider,
    action: ReviewAction,
  ) => {
    setReviewTarget(provider);
    setReviewAction(action);
    setReviewReason("");
    setReviewError("");
    setSuspensionDuration("7");
  };

  const closeReviewDialog = () => {
    setReviewTarget(null);
    setReviewReason("");
    setReviewError("");
    setSuspensionDuration("7");
  };

  /* =====================================================
     DOCUMENT ACTIONS
  ===================================================== */

  const openDocument = (document: ProviderDocument) => {
    if (!document.url) {
      setNotice(
        `The uploaded file URL for "${document.title}" has not been connected yet.`,
      );
      return;
    }

    window.open(document.url, "_blank", "noopener,noreferrer");
  };

  const downloadDocument = (document: ProviderDocument) => {
    if (!document.url) {
      setNotice(
        `The uploaded file URL for "${document.title}" has not been connected yet.`,
      );
      return;
    }

    const link = window.document.createElement("a");

    link.href = document.url;
    link.download = document.fileName;
    link.target = "_blank";
    link.rel = "noopener noreferrer";

    window.document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const downloadAllDocuments = () => {
    if (!selectedProvider) return;

    const available = selectedProvider.documents.filter(
      (document) => Boolean(document.url),
    );

    if (available.length === 0) {
      setNotice(
        "No uploaded document URLs are connected yet. Add the real URLs to enable downloads.",
      );
      return;
    }

    available.forEach((document, index) => {
      window.setTimeout(
        () => downloadDocument(document),
        index * 250,
      );
    });

    if (available.length < selectedProvider.documents.length) {
      setNotice(
        "Downloading available documents. Some uploaded file URLs are still missing.",
      );
    } else {
      setNotice("Your documents are being downloaded.");
    }
  };

  /* =====================================================
     VERIFY AND APPROVE PROFESSIONAL
  ===================================================== */

  const verifyProvider = (provider: Provider) => {
    const now = new Date().toISOString();
    const trialEndsAt = calculateTrialEnd(now);

    const updatedProvider: Provider = {
      ...provider,

      idProofStatus: "Verified",
      accountState: "Active",

      rejectionReason: undefined,
      suspensionUntil: undefined,
      suspensionDuration: undefined,

      trialStartedAt: now,
      trialEndsAt,
      subscriptionStatus: "Free Trial",

      documents: provider.documents.map((document) => ({
        ...document,
        status: "Verified",
      })),
    };

    updateProvider(updatedProvider, "Active");

    const documentUpdates = updatedProvider.documents.map(
      (document) => ({
        id: document.id,
        title: document.title,
        subtitle: document.subtitle,
        status: "Verified" as DocumentStatus,
        url: document.url,
        fileName: document.fileName,
      }),
    );

    persistApplicationUpdates(updatedProvider, {
      documents: documentUpdates,
    });

    /*
     * Promote the approved registration into the professional directory.
     * The applicant's original identity and registration details are kept.
     */
    promoteProviderToDirectory(updatedProvider, {
      status: "Approved",
      accountState: "Active",
      rejectionReason: undefined,
      trialStartedAt: now,
      trialEndsAt,
      subscriptionStatus: "Free Trial",
      documents: documentUpdates,
    });

    const approvedProvider = {
      ...updatedProvider,
      accountState: "Active" as AccountState,
    };

    setSelectedProvider(approvedProvider);

    setNotice(
      `${provider.name} has been approved. Their professional account has been added to the Professionals directory and their 30-day free trial has started.`,
    );
  };

  /* =====================================================
     REJECT / SUSPEND / BLOCK
  ===================================================== */

  const submitReviewAction = () => {
    if (!reviewTarget) return;

    const reason = reviewReason.trim();

    if (!reason) {
      setReviewError(
        reviewAction === "reject"
          ? "Please enter a reason for rejecting this application."
          : reviewAction === "block"
            ? "Please enter a reason for blocking this professional."
            : "Please enter a reason for suspending this professional.",
      );
      return;
    }

    const target = reviewTarget;
    const action = reviewAction;
    const suspensionDays = Number(suspensionDuration);

    if (
      action === "suspend" &&
      (!Number.isInteger(suspensionDays) || suspensionDays < 1)
    ) {
      setReviewError("Please select a valid suspension period.");
      return;
    }

    let suspensionUntil: string | undefined;

    if (action === "suspend") {
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + suspensionDays);
      suspensionUntil = expiryDate.toISOString();
    }

    const nextState: AccountState =
      action === "reject"
        ? "Rejected"
        : action === "block"
          ? "Blocked"
          : "Suspended";

    const updatedProvider: Provider = {
      ...target,
      accountState: nextState,
      rejectionReason: reason,
      suspensionDuration:
        action === "suspend" ? `${suspensionDays} days` : undefined,
      suspensionUntil:
        action === "suspend" ? suspensionUntil : undefined,
    };

    updateProvider(
      updatedProvider,
      nextState,
      reason,
      updatedProvider.suspensionDuration,
      suspensionUntil,
    );

    closeReviewDialog();

    if (action === "reject") {
      setSelectedProvider(null);
      setNotice(`${target.name}'s application has been rejected.`);
    } else if (action === "block") {
      setNotice(`${target.name} has been blocked successfully.`);
    } else {
      setNotice(
        `${target.name} has been suspended for ${suspensionDays} days.`,
      );
    }
  };

  /* =====================================================
     ADMIN REMARKS
  ===================================================== */

  const openRemarkModal = () => {
    setRemarkMessage("");
    setRemarkType("note");
    setRemarkError("");
    setRemarkModalOpen(true);
  };

  const closeRemarkModal = () => {
    setRemarkModalOpen(false);
    setRemarkMessage("");
    setRemarkError("");
  };

  const submitAdminRemark = () => {
    if (!selectedProvider) return;

    const message = remarkMessage.trim();

    if (!message) {
      setRemarkError("Please enter a remark before sending.");
      return;
    }

    const existingRemarks = selectedProvider.adminRemarks || [];
    const currentWarningCount =
      getFormalWarningCount(existingRemarks);

    if (
      remarkType === "warning" &&
      currentWarningCount >= MAX_FORMAL_WARNINGS
    ) {
      setRemarkError(
        "This professional has already received three formal warnings. The final warning has been recorded and requires admin review.",
      );
      return;
    }

    const isFormalWarning = remarkType === "warning";

    const warningNumber = isFormalWarning
      ? currentWarningCount + 1
      : undefined;

    const isFinalWarning =
      isFormalWarning &&
      warningNumber === MAX_FORMAL_WARNINGS;

    const now = new Date().toISOString();

    const newRemark: AdminRemark = {
      id:
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `remark-${Date.now()}-${Math.random()
            .toString(36)
            .slice(2, 9)}`,

      message,
      createdAt: now,
      createdBy: ADMIN_DISPLAY_NAME,

      type: isFinalWarning
        ? "final-warning"
        : isFormalWarning
          ? "warning"
          : "note",

      warningNumber,
      adminReviewRequired: isFinalWarning,

      ...(isFinalWarning
        ? { adminReviewStatus: "Pending" as const }
        : {}),
    };

    const updatedRemarks = [...existingRemarks, newRemark];

    const updatedProvider: Provider = {
      ...selectedProvider,
      adminRemarks: updatedRemarks,

      ...(isFinalWarning
        ? {
          adminReviewRequired: true,
          adminReviewStatus: "Pending" as const,
          adminReviewRequestedAt: now,
          adminReviewCompletedAt: undefined,
        }
        : {}),
    };

    persistProfessionalRemark(
      selectedProvider,
      newRemark,
      updatedRemarks,
    );

    setProviderList((current) =>
      current.map((provider) =>
        provider.id === selectedProvider.id
          ? updatedProvider
          : provider,
      ),
    );

    setSelectedProvider(updatedProvider);

    closeRemarkModal();

    if (isFinalWarning) {
      setNotice(
        `Final warning sent to ${selectedProvider.name}. Admin review is now required. The professional has not been automatically suspended or blocked.`,
      );
    } else if (isFormalWarning && warningNumber === 2) {
      setNotice(
        `Second formal warning sent to ${selectedProvider.name}. The next warning will be a final warning requiring admin review.`,
      );
    } else if (isFormalWarning) {
      setNotice(
        `First formal warning sent to ${selectedProvider.name}.`,
      );
    } else {
      setNotice(`Remark sent to ${selectedProvider.name}.`);
    }
  };

  /* =====================================================
     COMPLETE FINAL WARNING ADMIN REVIEW
  ===================================================== */

  const completeAdminReview = () => {
    if (!selectedProvider) return;
    if (!selectedProvider.adminReviewRequired) return;

    const updatedRemarks =
      persistAdminReviewCompleted(selectedProvider);

    const updatedProvider: Provider = {
      ...selectedProvider,
      adminRemarks: updatedRemarks,
      adminReviewRequired: false,
      adminReviewStatus: "Reviewed",
      adminReviewCompletedAt: new Date().toISOString(),
    };

    setSelectedProvider(updatedProvider);

    setProviderList((current) =>
      current.map((provider) =>
        provider.id === selectedProvider.id
          ? updatedProvider
          : provider,
      ),
    );

    setNotice(
      `Final warning review for ${selectedProvider.name} has been marked as reviewed. Their account status has not been changed.`,
    );
  };

  /* =====================================================
     SUBSCRIPTION STATE
  ===================================================== */

  const selectedSubscriptionStatus = selectedProvider
    ? getSubscriptionStatus(selectedProvider, currentTime)
    : "Not Started";

  const trialRemaining = selectedProvider
    ? getTrialRemaining(selectedProvider.trialEndsAt)
    : null;

  const trialProgress =
    selectedProvider?.trialStartedAt &&
      selectedProvider?.trialEndsAt
      ? Math.min(
        100,
        Math.max(
          0,
          ((currentTime -
            new Date(selectedProvider.trialStartedAt).getTime()) /
            (new Date(selectedProvider.trialEndsAt).getTime() -
              new Date(selectedProvider.trialStartedAt).getTime())) *
          100,
        ),
      )
      : 0;

  /* =====================================================
     PAYMENT SELECTION
  ===================================================== */

  const proceedToPayment = () => {
    if (!selectedProvider) return;

    const plan = SUBSCRIPTION_PLANS.find(
      (item) => item.name === selectedPlan,
    );

    if (!plan) return;

    setNotice(
      `${plan.name} plan selected for ₹${plan.price}/month. Connect a payment gateway to complete activation.`,
    );
  };

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <div className="book-services-page">

      {/* PAGE HEADER */}


      {/* PAGE HEADER + NAVIGATION CARDS */}

      <section className="book-services-header professional-page-header">

        <div className="professional-page-heading">
          <div className="book-services-eyebrow">
            PARTNER MANAGEMENT
          </div>

          <h1>Professionals</h1>

          <p>
            Manage professional registrations, onboarding approvals,
            and existing service provider accounts.
          </p>
        </div>

        <div className="professional-admin-tabs">

          <button
            type="button"
            className={`professional-admin-tab ${activeTab === "onboarding" ? "active" : ""
              }`}
            onClick={() => changeTab("onboarding")}
          >
            <span className="professional-admin-tab-icon">
              <ClipboardCheck size={20} />
            </span>

            <span className="professional-admin-tab-content">
              <strong>Onboarding Requests</strong>
            </span>

            <span className="professional-admin-tab-count">
              {onboardingCount}
            </span>
          </button>

          <button
            type="button"
            className={`professional-admin-tab ${activeTab === "professionals" ? "active" : ""
              }`}
            onClick={() => changeTab("professionals")}
          >
            <span className="professional-admin-tab-icon">
              <UsersRound size={20} />
            </span>

            <span className="professional-admin-tab-content">
              <strong>Professionals</strong>
            </span>

            <span className="professional-admin-tab-count">
              {professionalsCount}
            </span>
          </button>

        </div>

      </section>


      {/* OVERVIEW COUNTS */}

      <section className="professional-admin-overview">

        <div className="professional-overview-card">
          <div className="professional-overview-icon onboarding">
            <ClipboardCheck size={20} />
          </div>

          <div>
            <span>Onboarding requests</span>
            <strong>{onboardingCount}</strong>
            <small>{pendingCount} awaiting approval</small>
          </div>
        </div>

        <div className="professional-overview-card">
          <div className="professional-overview-icon approved">
            <UsersRound size={20} />
          </div>

          <div>
            <span>Total professionals</span>
            <strong>{professionalsCount}</strong>
            <small>{activeProfessionalsCount} active accounts</small>
          </div>
        </div>

        <div className="professional-overview-card">
          <div className="professional-overview-icon restricted">
            <ShieldCheck size={20} />
          </div>

          <div>
            <span>Restricted accounts</span>
            <strong>{restrictedProfessionalsCount}</strong>
            <small>Suspended or blocked</small>
          </div>
        </div>

      </section>


      {/* ACTIVE TAB DESCRIPTION */}

      <div className="professional-admin-section-heading">
        <div>
          <h2>
            {activeTab === "onboarding"
              ? "Professional Onboarding"
              : "Professional Directory"}
          </h2>

          <p>
            {activeTab === "onboarding"
              ? "Review submitted registrations, check documents, and approve or reject new professionals."
              : "View and manage approved professionals, their services, subscriptions, and account status."}
          </p>
        </div>

        <span className="professional-admin-section-total">
          {filteredProviders.length} records
        </span>
      </div>

      {/* FILTERS */}

      <section className="book-services-filter-card">

        <div className="book-services-select">
          <select
            aria-label="Filter by service type"
            value={serviceType}
            onChange={(event) => {
              setServiceType(event.target.value);
              setPage(1);
            }}
          >
            {serviceTypes.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <ChevronDown size={17} />
        </div>

        <div className="book-services-select">
          <select
            aria-label="Filter by location"
            value={location}
            onChange={(event) => {
              setLocation(event.target.value);
              setPage(1);
            }}
          >
            {locations.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <ChevronDown size={17} />
        </div>

        <div className="book-services-search">
          <Search size={17} />

          <input
            type="text"
            placeholder={
              activeTab === "onboarding"
                ? "Search applicants"
                : "Search professionals"
            }
            aria-label="Search professionals"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
          />
        </div>

        <div className="book-services-select book-services-status-filter">
          <select
            aria-label="Filter by status"
            value={status}
            onChange={(event) => {
              setStatus(event.target.value);
              setPage(1);
            }}
          >
            {statuses.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <ChevronDown size={17} />
        </div>

        {hasFilters && (
          <button
            type="button"
            className="book-services-clear"
            onClick={clearFilters}
            aria-label="Clear filters"
            title="Clear filters"
          >
            <X size={15} />
          </button>
        )}

      </section>

      {/* PROFESSIONAL TABLE */}

      <section className="book-services-table-card">

        <div className="book-services-table-wrapper">
          <table className="book-services-table">

            <thead>
              <tr>
                <th>PHOTO / AVATAR</th>
                <th>NAME &amp; DESIGNATION</th>
                <th>CATEGORY</th>
                <th>EXPERIENCE</th>
                <th>STATUS</th>
                <th>
                  {activeTab === "onboarding"
                    ? "SUBMITTED ON"
                    : "SUBSCRIPTION EXPIRY"}
                </th>
                <th>ACTIONS</th>
              </tr>
            </thead>

            <tbody>

              {paginatedProviders.map((provider) => {
                const pending = isPending(provider);
                const displayedStatus = getDisplayedStatus(provider);

                const warningCount = getFormalWarningCount(
                  provider.adminRemarks,
                );

                return (
                  <tr key={provider.id}>

                    <td>
                      <div className="book-services-avatar">
                        {provider.profileImage ? (
                          <img
                            src={provider.profileImage}
                            alt={provider.name}
                          />
                        ) : (
                          provider.initials
                        )}
                      </div>
                    </td>

                    <td>
                      <div className="book-services-provider">
                        <strong>{provider.name}</strong>

                        <span>
                          {provider.designation} · {provider.id}
                        </span>

                        {warningCount > 0 && (
                          <small className="professional-warning-count">
                            <AlertTriangle size={12} />
                            {warningCount}/{MAX_FORMAL_WARNINGS} warnings
                          </small>
                        )}

                        {provider.adminReviewRequired && (
                          <small className="professional-review-required">
                            <ClipboardCheck size={12} />
                            Final warning · Review required
                          </small>
                        )}

                        {provider.rejectionReason && (
                          <small
                            className="book-services-reason-preview"
                            title={provider.rejectionReason}
                          >
                            Reason: {provider.rejectionReason}
                          </small>
                        )}
                      </div>
                    </td>

                    <td>
                      <span className="book-services-category">
                        {provider.category}
                      </span>
                    </td>

                    <td>
                      <span className="book-services-experience">
                        {provider.experience}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`book-services-status ${getStatusClass(
                          provider,
                        )}`}
                      >
                        {displayedStatus === "Verified" ? (
                          <CheckCircle2 size={14} />
                        ) : ["Suspended", "Blocked", "Rejected"].includes(
                          displayedStatus,
                        ) ? (
                          <Ban size={14} />
                        ) : (
                          <span className="book-services-pending-dot" />
                        )}

                        {displayedStatus}
                      </span>
                    </td>

                    <td>
                      <div className="book-services-expiry">
                        <span>
                          {activeTab === "onboarding"
                            ? provider.joinedOn
                            : provider.subscriptionEndsAt
                              ? formatDate(provider.subscriptionEndsAt)
                              : provider.trialEndsAt
                                ? formatDate(provider.trialEndsAt)
                                : "—"}
                        </span>
                      </div>
                    </td>

                    <td>
                      <div className="book-services-actions">

                        <button
                          type="button"
                          className="book-services-action secondary"
                          onClick={() => openProviderProfile(provider)}
                        >
                          <Eye size={13} />
                          View Profile
                        </button>

                        {activeTab === "onboarding" && pending && (
                          <>
                            <button
                              type="button"
                              className="book-services-action primary"
                              onClick={() => openProviderProfile(provider)}
                            >
                              <ShieldCheck size={13} />
                              Verify Docs
                            </button>

                            <button
                              type="button"
                              className="book-services-action danger"
                              onClick={() =>
                                openReviewDialog(provider, "reject")
                              }
                            >
                              <X size={13} />
                              Reject
                            </button>
                          </>
                        )}

                        {activeTab === "professionals" &&
                          provider.accountState === "Active" && (
                            <>
                              <button
                                type="button"
                                className="book-services-action warning"
                                onClick={() =>
                                  openReviewDialog(provider, "suspend")
                                }
                              >
                                <Clock size={13} />
                                Suspend
                              </button>

                              <button
                                type="button"
                                className="book-services-action danger"
                                onClick={() =>
                                  openReviewDialog(provider, "block")
                                }
                              >
                                <Ban size={13} />
                                Block
                              </button>
                            </>
                          )}

                        {activeTab === "professionals" &&
                          ["Suspended", "Blocked"].includes(
                            provider.accountState ?? "",
                          ) && (
                            <span className="book-services-action-disabled">
                              {provider.accountState}
                            </span>
                          )}

                        {activeTab === "onboarding" &&
                          provider.accountState === "Rejected" && (
                            <span className="book-services-action-disabled">
                              Rejected
                            </span>
                          )}

                      </div>
                    </td>

                  </tr>
                );
              })}

              {paginatedProviders.length === 0 && (
                <tr>
                  <td colSpan={7}>
                    <div className="book-services-empty">
                      <Search size={26} />

                      <strong>
                        {activeTab === "onboarding"
                          ? "No onboarding requests found"
                          : "No professionals found"}
                      </strong>

                      <span>
                        {activeTab === "onboarding"
                          ? providerList.length === 0
                            ? "New professional registrations will appear here when applicants submit their forms."
                            : "There are no pending or rejected applications matching these filters."
                          : "Approved professional accounts will appear here after onboarding is completed."}
                      </span>

                      {hasFilters && (
                        <button
                          type="button"
                          onClick={clearFilters}
                        >
                          Clear Filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}

            </tbody>
          </table>
        </div>

        {/* PAGINATION */}

        <div className="book-services-pagination">

          <span>
            Showing <strong>{firstItem}–{lastItem}</strong> of{" "}
            <strong>{filteredProviders.length}</strong> records
          </span>

          <div className="book-services-pagination-buttons">

            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() =>
                setPage((current) => Math.max(1, current - 1))
              }
              aria-label="Previous page"
            >
              <ChevronLeft size={15} />
            </button>

            {Array.from(
              { length: pageCount },
              (_, index) => index + 1,
            ).map((pageNumber) => (
              <button
                key={pageNumber}
                type="button"
                className={currentPage === pageNumber ? "active" : ""}
                aria-current={
                  currentPage === pageNumber ? "page" : undefined
                }
                onClick={() => setPage(pageNumber)}
              >
                {pageNumber}
              </button>
            ))}

            <button
              type="button"
              disabled={currentPage >= pageCount}
              onClick={() =>
                setPage((current) =>
                  Math.min(pageCount, current + 1),
                )
              }
              aria-label="Next page"
            >
              <ChevronRight size={15} />
            </button>

          </div>
        </div>

      </section>

      {/* NOTIFICATION */}

      {notice && (
        <div className="book-services-toast" role="status">
          <span>{notice}</span>

          <button
            type="button"
            aria-label="Dismiss message"
            onClick={() => setNotice("")}
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* =====================================================
         VIEW PROFILE MODAL
      ===================================================== */}

      {selectedProvider && (
        <div
          className="book-services-modal-backdrop"
          onClick={() => setSelectedProvider(null)}
        >
          <section
            className="book-services-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="provider-profile-title"
            onClick={(event) => event.stopPropagation()}
          >

            <header className="book-services-modal-header">
              <h2 id="provider-profile-title">
                {isPending(selectedProvider)
                  ? "Verify Professional Documents"
                  : "View Profile"}
              </h2>

              <button
                type="button"
                className="book-services-modal-close"
                onClick={() => setSelectedProvider(null)}
                aria-label="Close profile"
              >
                <X size={20} />
              </button>
            </header>

            <div className="book-services-modal-body">

              {isPending(selectedProvider) && (
                <div className="book-services-verification-notice">
                  <ShieldCheck size={19} />

                  <div>
                    <strong>Verification required</strong>

                    <p>
                      Review the applicant's details and submitted
                      documents before approving this professional.
                    </p>
                  </div>
                </div>
              )}

              {/* PROFILE HEADER */}

              <div className="book-services-profile-top">

                <div className="book-services-modal-avatar">
                  {selectedProvider.profileImage ? (
                    <img
                      src={selectedProvider.profileImage}
                      alt={selectedProvider.name}
                    />
                  ) : (
                    selectedProvider.initials
                  )}
                </div>

                <div className="book-services-profile-name">

                  <h3>
                    {selectedProvider.name}

                    {selectedProvider.accountState === "Active" && (
                      <ShieldCheck
                        className="book-services-name-shield"
                        size={19}
                      />
                    )}
                  </h3>

                  <p>
                    {selectedProvider.designation}
                    <span>•</span>
                    {selectedProvider.id}
                  </p>

                  <span
                    className={`book-services-status ${getStatusClass(
                      selectedProvider,
                    )}`}
                  >
                    {getDisplayedStatus(selectedProvider)}
                  </span>

                </div>

                <div className="book-services-rating">
                  <div aria-label="No customer rating available">
                    ★★★★★
                  </div>

                  <span>
                    {selectedProvider.rating === "—"
                      ? "No customer reviews yet"
                      : `${selectedProvider.rating} (${selectedProvider.reviewCount} reviews)`}
                  </span>
                </div>

              </div>

              {/* ACCOUNT REASON */}

              {selectedProvider.rejectionReason && (
                <div className="book-services-account-reason">

                  <strong>{getReasonLabel(selectedProvider)}</strong>

                  <p>{selectedProvider.rejectionReason}</p>

                  {selectedProvider.accountState === "Suspended" &&
                    selectedProvider.suspensionUntil && (
                      <div className="book-services-suspension-details">

                        <span>
                          <CalendarDays size={15} />
                          Duration: {selectedProvider.suspensionDuration}
                        </span>

                        <span>
                          <CalendarDays size={15} />
                          Suspension ends:{" "}
                          {formatDate(selectedProvider.suspensionUntil)}
                        </span>

                      </div>
                    )}

                </div>
              )}

              {/* PROFILE META */}

              <div className="book-services-profile-meta">

                <div>
                  <MapPin size={19} />

                  <span>
                    <small>Location</small>
                    <strong>{selectedProvider.location}</strong>
                  </span>
                </div>

                <div>
                  <CalendarDays size={19} />

                  <span>
                    <small>Joined on</small>
                    <strong>{selectedProvider.joinedOn}</strong>
                  </span>
                </div>

                <div>
                  <Wrench size={19} />

                  <span>
                    <small>Experience</small>
                    <strong>{selectedProvider.experience}</strong>
                  </span>
                </div>

              </div>

              {/* ABOUT */}

              <section className="book-services-about">
                <h4>
                  <ShieldCheck size={19} />
                  About
                </h4>

                <p>{selectedProvider.about}</p>
              </section>

              {/* DOCUMENTS */}

              <section className="book-services-documents">

                <div className="book-services-documents-heading">

                  <h4>
                    <FileText size={19} />
                    ID Proofs &amp; Documents
                  </h4>

                  <button
                    type="button"
                    className="book-services-download-all"
                    onClick={downloadAllDocuments}
                  >
                    <Download size={14} />
                    Download All
                  </button>

                </div>

                <div className="book-services-document-list">

                  {selectedProvider.documents.map((document) => (
                    <div
                      className="book-services-document-row"
                      key={document.id}
                    >

                      <div className="book-services-document-icon">
                        {document.id === "id-proof" ? (
                          <FileBadge size={25} />
                        ) : (
                          <FileText size={25} />
                        )}
                      </div>

                      <div className="book-services-document-info">
                        <strong>{document.title}</strong>
                        <span>{document.subtitle}</span>
                      </div>

                      <div className="book-services-document-actions">

                        <button
                          type="button"
                          className="book-services-doc-view"
                          onClick={() => openDocument(document)}
                        >
                          <Eye size={14} />
                          View
                        </button>

                        <button
                          type="button"
                          className="book-services-doc-download"
                          onClick={() => downloadDocument(document)}
                        >
                          <Download size={14} />
                          Download
                        </button>

                      </div>

                      <span
                        className={`book-services-doc-status ${document.status.toLowerCase()}`}
                      >
                        {document.status === "Verified" ? (
                          <CheckCircle2 size={13} />
                        ) : document.status === "Rejected" ? (
                          <X size={13} />
                        ) : (
                          <span className="book-services-pending-dot" />
                        )}

                        {document.status}
                      </span>

                    </div>
                  ))}

                </div>

                <p className="book-services-document-note">
                  Document previews and downloads require a valid uploaded
                  file URL in each document's <code>url</code> property.
                </p>

              </section>

              {/* SERVICES AND PRICING */}

              <section className="book-services-selected-services">

                <h4>
                  <UsersRound size={18} />
                  Selected Services &amp; Pricing
                </h4>

                {selectedProvider.servicePrices.length > 0 ? (
                  <div className="book-services-service-price-list">

                    {selectedProvider.servicePrices.map(
                      (service, index) => (
                        <div
                          className="book-services-service-price-row"
                          key={service.id || `${service.name}-${index}`}
                        >
                          <span className="book-services-service-price-name">
                            {service.name}
                          </span>

                          <strong className="book-services-service-price-value">
                            {formatRupee(service.price)}
                          </strong>
                        </div>
                      ),
                    )}

                  </div>
                ) : selectedProvider.services.length > 0 ? (
                  <div className="book-services-service-price-list">

                    {selectedProvider.services.map((service) => (
                      <div
                        className="book-services-service-price-row"
                        key={service}
                      >
                        <span className="book-services-service-price-name">
                          {service}
                        </span>

                        <strong className="book-services-service-price-value">
                          Price not provided
                        </strong>
                      </div>
                    ))}

                  </div>
                ) : (
                  <div className="book-services-service-price-empty">
                    No services submitted
                  </div>
                )}

                <div className="book-services-visiting-fee">
                  <span>
                    <MapPin size={15} />
                    Visiting Fee
                  </span>

                  <strong>
                    {formatRupee(selectedProvider.visitingFee)}
                  </strong>
                </div>

              </section>

              {/* CONTACT */}

              <section className="book-services-contact">

                <h4>Contact Information</h4>

                <div>
                  <span>
                    <Phone size={17} />
                    {selectedProvider.phone}
                  </span>

                  <span>
                    <Mail size={17} />
                    {selectedProvider.email}
                  </span>
                </div>

              </section>

              {/* ADMIN REMARKS AND WARNINGS */}

              {selectedProvider.accountState !== undefined &&
                selectedProvider.accountState !== "Rejected" && (
                  <section className="professional-admin-remarks">

                    <div className="professional-admin-remarks-heading">
                      <div>
                        <h4>
                          <MessageSquare size={19} />
                          Admin Remarks &amp; Warnings
                        </h4>

                        <p>
                          Send an individual remark or formal warning to
                          this professional.
                        </p>
                      </div>

                      <button
                        type="button"
                        className="professional-send-remark-button"
                        onClick={openRemarkModal}
                      >
                        <Send size={14} />
                        Send Remark
                      </button>
                    </div>

                    <div className="professional-warning-summary">

                      <div>
                        <span>Formal warnings</span>

                        <strong>
                          {getFormalWarningCount(
                            selectedProvider.adminRemarks,
                          )}{" "}
                          / {MAX_FORMAL_WARNINGS}
                        </strong>
                      </div>

                      <div>
                        <span>General remarks</span>

                        <strong>
                          {
                            selectedProvider.adminRemarks.filter(
                              (remark) => remark.type === "note",
                            ).length
                          }
                        </strong>
                      </div>

                      <div>
                        <span>Admin review</span>

                        <strong>
                          {selectedProvider.adminReviewRequired
                            ? "Required"
                            : selectedProvider.adminReviewStatus ===
                              "Reviewed"
                              ? "Reviewed"
                              : "Not required"}
                        </strong>
                      </div>

                    </div>

                    {selectedProvider.adminReviewRequired && (
                      <div className="professional-final-warning-review">

                        <div className="professional-final-warning-review-icon">
                          <AlertTriangle size={20} />
                        </div>

                        <div className="professional-final-warning-review-content">
                          <strong>
                            Final Warning — Admin Review Required
                          </strong>

                          <p>
                            This professional has received three formal
                            warnings. The account has not been automatically
                            suspended or blocked. Please review the warning
                            history and decide whether further action is
                            necessary.
                          </p>

                          <span>
                            Review requested:{" "}
                            {formatDateTime(
                              selectedProvider.adminReviewRequestedAt,
                            )}
                          </span>

                          <button
                            type="button"
                            onClick={completeAdminReview}
                          >
                            <ClipboardCheck size={15} />
                            Mark Review Completed
                          </button>
                        </div>

                      </div>
                    )}

                    {selectedProvider.adminReviewStatus === "Reviewed" &&
                      !selectedProvider.adminReviewRequired && (
                        <div className="professional-review-completed">
                          <CheckCircle2 size={16} />

                          <span>
                            Final warning review completed on{" "}
                            {formatDateTime(
                              selectedProvider.adminReviewCompletedAt,
                            )}
                          </span>
                        </div>
                      )}

                    <div className="professional-admin-remark-list">

                      {selectedProvider.adminRemarks.length > 0 ? (
                        [...selectedProvider.adminRemarks]
                          .sort(
                            (a, b) =>
                              new Date(b.createdAt).getTime() -
                              new Date(a.createdAt).getTime(),
                          )
                          .map((remark) => (
                            <article
                              key={remark.id}
                              className={`professional-admin-remark-item ${remark.type}`}
                            >

                              <div className="professional-admin-remark-top">

                                <div>
                                  {remark.type === "note" ? (
                                    <MessageSquare size={15} />
                                  ) : remark.type === "final-warning" ? (
                                    <AlertTriangle size={15} />
                                  ) : (
                                    <ShieldCheck size={15} />
                                  )}

                                  <strong>
                                    {remark.type === "note"
                                      ? "General Remark"
                                      : remark.type === "final-warning"
                                        ? "Final Warning"
                                        : `Formal Warning ${remark.warningNumber}`}
                                  </strong>
                                </div>

                                <span>
                                  {formatDateTime(remark.createdAt)}
                                </span>

                              </div>

                              <p>{remark.message}</p>

                              <div className="professional-admin-remark-meta">
                                <span>Sent by {remark.createdBy}</span>

                                {remark.type === "final-warning" && (
                                  <span>
                                    {remark.adminReviewStatus === "Reviewed"
                                      ? "Admin review completed"
                                      : "Admin review pending"}
                                  </span>
                                )}
                              </div>

                            </article>
                          ))
                      ) : (
                        <div className="professional-no-remarks">
                          <MessageSquare size={22} />

                          <strong>No remarks yet</strong>

                          <span>
                            Admin remarks and formal warnings sent to this
                            professional will appear here.
                          </span>
                        </div>
                      )}

                    </div>

                    {getFormalWarningCount(
                      selectedProvider.adminRemarks,
                    ) === 2 && (
                        <div className="professional-next-warning-notice">
                          <AlertTriangle size={16} />

                          <span>
                            One more formal warning will result in a final
                            warning and mandatory admin review. It will not
                            automatically suspend or block the account.
                          </span>
                        </div>
                      )}

                    {getFormalWarningCount(
                      selectedProvider.adminRemarks,
                    ) >= MAX_FORMAL_WARNINGS && (
                        <div className="professional-warning-limit-notice">
                          <ShieldCheck size={16} />

                          <span>
                            The three-warning limit has been reached. Further
                            formal warnings are disabled. The professional
                            remains subject to admin review.
                          </span>
                        </div>
                      )}

                  </section>
                )}

              {/* SUBSCRIPTION */}

              {selectedProvider.accountState === "Active" && (
                <section className="book-services-subscription">

                  <div className="book-services-subscription-heading">

                    <div>
                      <h4>
                        <CreditCard size={19} />
                        Professional Subscription
                      </h4>

                      <p>
                        Manage professional membership and subscription.
                      </p>
                    </div>

                    <span
                      className={`book-services-subscription-badge ${selectedSubscriptionStatus === "Free Trial"
                          ? "trial"
                          : selectedSubscriptionStatus === "Active"
                            ? "active"
                            : "expired"
                        }`}
                    >
                      {selectedSubscriptionStatus}
                    </span>

                  </div>

                  {/* FREE TRIAL */}

                  {selectedSubscriptionStatus === "Free Trial" &&
                    trialRemaining && (

                      <div className="book-services-trial-card">

                        <div className="book-services-trial-top">

                          <div className="book-services-trial-icon">
                            <Sparkles size={22} />
                          </div>

                          <div>
                            <strong>30-Day Free Trial</strong>
                            <span>
                              Enjoy OneService professional membership.
                            </span>
                          </div>

                        </div>

                        <div className="book-services-trial-countdown">

                          <div className="book-services-trial-days">
                            <strong>{trialRemaining.days}</strong>
                            <span>Days</span>
                          </div>

                          <div className="book-services-trial-days">
                            <strong>{trialRemaining.hours}</strong>
                            <span>Hours</span>
                          </div>

                          <div className="book-services-trial-days">
                            <strong>{trialRemaining.minutes}</strong>
                            <span>Minutes</span>
                          </div>

                        </div>

                        <div className="book-services-trial-progress">

                          <div className="book-services-trial-progress-label">
                            <span>Trial period used</span>
                            <strong>{Math.round(trialProgress)}%</strong>
                          </div>

                          <div className="book-services-trial-progress-track">
                            <div
                              style={{
                                width: `${trialProgress}%`,
                              }}
                            />
                          </div>

                        </div>

                        <div className="book-services-trial-dates">

                          <div>
                            <span>Trial started</span>
                            <strong>
                              {formatDate(selectedProvider.trialStartedAt)}
                            </strong>
                          </div>

                          <div>
                            <span>Trial expires</span>
                            <strong>
                              {formatDate(selectedProvider.trialEndsAt)}
                            </strong>
                          </div>

                        </div>

                        <div className="book-services-trial-free">
                          <span>Current subscription charge</span>
                          <strong>₹0</strong>
                        </div>

                        <p className="book-services-trial-note">
                          Payment options will become available
                          automatically after the 30-day trial expires.
                        </p>

                      </div>
                    )}

                  {/* EXPIRED NOTICE */}

                  {(selectedSubscriptionStatus === "Trial Expired" ||
                    selectedSubscriptionStatus === "Expired") && (

                      <div className="book-services-subscription-expired">

                        <div className="book-services-expired-icon">
                          <Clock size={23} />
                        </div>

                        <div>
                          <strong>Your free trial has expired</strong>

                          <p>
                            The 30-day free trial is over. Choose a
                            subscription plan to continue with your
                            OneService professional membership.
                          </p>
                        </div>

                      </div>
                    )}

                  {/* ACTIVE SUBSCRIPTION */}

                  {selectedSubscriptionStatus === "Active" && (

                    <div className="book-services-active-subscription">

                      <CheckCircle2 size={22} />

                      <div>
                        <strong>
                          {selectedProvider.subscriptionPlan} Plan Active
                        </strong>

                        <p>
                          Subscription started:{" "}
                          {formatDate(
                            selectedProvider.subscriptionStartedAt,
                          )}
                        </p>

                        <p>
                          Subscription expires:{" "}
                          {formatDate(
                            selectedProvider.subscriptionEndsAt,
                          )}
                        </p>
                      </div>

                    </div>
                  )}

                  {/* PAYMENT PLANS */}

                  {(selectedSubscriptionStatus === "Trial Expired" ||
                    selectedSubscriptionStatus === "Expired") && (

                      <div className="book-services-payment-section">

                        <div className="book-services-payment-heading">

                          <h4>Choose Your Subscription Plan</h4>

                          <p>
                            Select the membership that suits your
                            professional requirements.
                          </p>

                        </div>

                        <div className="book-services-plan-list">

                          {SUBSCRIPTION_PLANS.map((plan) => (

                            <button
                              type="button"
                              key={plan.name}
                              className={`book-services-plan-card ${selectedPlan === plan.name ? "selected" : ""
                                } ${plan.name.toLowerCase()}`}
                              onClick={() => setSelectedPlan(plan.name)}
                              aria-pressed={selectedPlan === plan.name}
                            >

                              <div className="book-services-plan-top">

                                <div className="book-services-plan-icon">

                                  {plan.name === "Basic" ? (
                                    <ShieldCheck size={20} />
                                  ) : plan.name === "Exclusive" ? (
                                    <Sparkles size={20} />
                                  ) : (
                                    <Crown size={20} />
                                  )}

                                </div>

                                <span className="book-services-plan-radio">
                                  {selectedPlan === plan.name && (
                                    <Check size={13} />
                                  )}
                                </span>

                              </div>

                              <strong className="book-services-plan-name">
                                {plan.name}
                              </strong>

                              <div className="book-services-plan-price">
                                ₹{plan.price}
                                <span>/ month</span>
                              </div>

                              <p className="book-services-plan-description">
                                {plan.description}
                              </p>

                              <div className="book-services-plan-features">

                                {plan.features.map((feature) => (
                                  <span key={feature}>
                                    <CheckCircle2 size={14} />
                                    {feature}
                                  </span>
                                ))}

                              </div>

                              <span className="book-services-plan-select">
                                {selectedPlan === plan.name
                                  ? "Selected Plan"
                                  : "Select Plan"}
                              </span>

                            </button>
                          ))}

                        </div>

                        <div className="book-services-payment-summary">

                          <div>
                            <span>Selected subscription</span>
                            <strong>{selectedPlan}</strong>
                          </div>

                          <div>
                            <span>Monthly subscription fee</span>

                            <strong>
                              ₹
                              {
                                SUBSCRIPTION_PLANS.find(
                                  (plan) => plan.name === selectedPlan,
                                )?.price
                              }
                            </strong>
                          </div>

                        </div>

                        <button
                          type="button"
                          className="book-services-payment-button"
                          onClick={proceedToPayment}
                        >
                          <CreditCard size={17} />
                          Proceed to Payment
                        </button>

                        <p className="book-services-payment-note">
                          Subscription activation will take place only
                          after successful payment verification.
                        </p>

                      </div>
                    )}

                </section>
              )}

            </div>

            {/* MODAL FOOTER */}

            <footer className="book-services-modal-footer">

              <button
                type="button"
                className="book-services-modal-secondary"
                onClick={() => setSelectedProvider(null)}
              >
                Close
              </button>

              {isPending(selectedProvider) && (
                <>
                  <button
                    type="button"
                    className="book-services-action danger"
                    onClick={() =>
                      openReviewDialog(selectedProvider, "reject")
                    }
                  >
                    <X size={13} />
                    Reject Application
                  </button>

                  <button
                    type="button"
                    className="book-services-action primary"
                    onClick={() => verifyProvider(selectedProvider)}
                  >
                    <Check size={13} />
                    Verify &amp; Approve
                  </button>
                </>
              )}

              {selectedProvider.accountState === "Active" && (
                <>
                  <button
                    type="button"
                    className="book-services-action warning"
                    onClick={() =>
                      openReviewDialog(selectedProvider, "suspend")
                    }
                  >
                    <CalendarDays size={13} />
                    Suspend
                  </button>

                  <button
                    type="button"
                    className="book-services-action danger"
                    onClick={() =>
                      openReviewDialog(selectedProvider, "block")
                    }
                  >
                    <Ban size={13} />
                    Block
                  </button>
                </>
              )}

              {["Suspended", "Blocked"].includes(
                selectedProvider.accountState ?? "",
              ) && (
                  <span className="book-services-action-disabled">
                    {selectedProvider.accountState}
                  </span>
                )}

            </footer>

          </section>
        </div>
      )}

      {/* =====================================================
         SEND REMARK MODAL
      ===================================================== */}

      {remarkModalOpen && selectedProvider && (
        <div
          className="professional-remark-backdrop"
          onClick={closeRemarkModal}
        >
          <section
            className="professional-remark-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="professional-remark-title"
            onClick={(event) => event.stopPropagation()}
          >

            <header className="professional-remark-dialog-header">
              <div>
                <span className="professional-remark-dialog-icon">
                  <MessageSquare size={20} />
                </span>

                <div>
                  <h2 id="professional-remark-title">
                    Send Admin Remark
                  </h2>

                  <p>
                    To: <strong>{selectedProvider.name}</strong>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={closeRemarkModal}
                aria-label="Close remark dialog"
              >
                <X size={19} />
              </button>
            </header>

            <div className="professional-remark-dialog-body">

              <label htmlFor="professional-remark-type">
                Remark type
              </label>

              <select
                id="professional-remark-type"
                value={remarkType}
                onChange={(event) => {
                  setRemarkType(
                    event.target.value as "note" | "warning",
                  );
                  setRemarkError("");
                }}
              >
                <option value="note">
                  General Remark — Does not count as a warning
                </option>

                <option value="warning">
                  Formal Warning — Counts toward 3-warning limit
                </option>
              </select>

              {remarkType === "warning" && (
                <div className="professional-remark-warning-preview">
                  <AlertTriangle size={17} />

                  <div>
                    <strong>
                      {getWarningLabel(
                        getFormalWarningCount(
                          selectedProvider.adminRemarks,
                        ) + 1,
                      )}
                    </strong>

                    <p>
                      {getFormalWarningCount(
                        selectedProvider.adminRemarks,
                      ) === 0
                        ? "This will be the first formal warning."
                        : getFormalWarningCount(
                          selectedProvider.adminRemarks,
                        ) === 1
                          ? "This will be the second warning. The next formal warning will become a final warning and require admin review."
                          : "This will be the final warning. It will flag the account for admin review, without automatically suspending or blocking the professional."}
                    </p>
                  </div>
                </div>
              )}

              <label htmlFor="professional-remark-message">
                Message <span>*</span>
              </label>

              <textarea
                id="professional-remark-message"
                rows={5}
                maxLength={1000}
                value={remarkMessage}
                onChange={(event) => {
                  setRemarkMessage(event.target.value);
                  setRemarkError("");
                }}
                placeholder="Write the remark or explain the reason for this warning..."
              />

              <div className="professional-remark-character-count">
                {remarkMessage.length}/1000 characters
              </div>

              {remarkError && (
                <span className="professional-remark-error" role="alert">
                  {remarkError}
                </span>
              )}

              <div className="professional-remark-dialog-note">
                <ShieldCheck size={16} />

                <span>
                  This remark will be saved in the professional's
                  registration record. A notification event will also
                  be dispatched for the professional profile to handle.
                </span>
              </div>

            </div>

            <footer className="professional-remark-dialog-footer">

              <button
                type="button"
                className="book-services-modal-secondary"
                onClick={closeRemarkModal}
              >
                Cancel
              </button>

              <button
                type="button"
                className="professional-send-remark-button"
                onClick={submitAdminRemark}
              >
                <Send size={15} />
                Send to Professional
              </button>

            </footer>

          </section>
        </div>
      )}

      {/* =====================================================
         REJECT / SUSPEND / BLOCK DIALOG
      ===================================================== */}

      {reviewTarget && (
        <div
          className="book-services-reject-backdrop"
          onClick={closeReviewDialog}
        >

          <section
            className="book-services-reject-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="review-dialog-title"
            onClick={(event) => event.stopPropagation()}
          >

            <div className={`book-services-reject-icon ${reviewAction}`}>
              {reviewAction === "reject" ? (
                <X size={22} />
              ) : reviewAction === "block" ? (
                <Ban size={22} />
              ) : (
                <CalendarDays size={22} />
              )}
            </div>

            <h2 id="review-dialog-title">
              {reviewAction === "reject"
                ? "Reject Professional Request"
                : reviewAction === "block"
                  ? "Block Professional"
                  : "Suspend Professional"}
            </h2>

            <p>
              {reviewAction === "reject"
                ? "Provide a reason for rejecting the application of"
                : reviewAction === "block"
                  ? "Provide a reason for blocking"
                  : "Provide a reason and select a suspension period for"}{" "}
              <strong>{reviewTarget.name}</strong>.
            </p>

            <label htmlFor="review-reason">
              {reviewAction === "reject"
                ? "Reason for rejection"
                : reviewAction === "block"
                  ? "Reason for blocking"
                  : "Reason for suspension"}{" "}
              <span>*</span>
            </label>

            <textarea
              id="review-reason"
              rows={4}
              value={reviewReason}
              onChange={(event) => {
                setReviewReason(event.target.value);
                setReviewError("");
              }}
              placeholder={
                reviewAction === "reject"
                  ? "Explain why this application is being rejected..."
                  : reviewAction === "block"
                    ? "Explain why this professional is being blocked..."
                    : "Explain why this professional needs to be suspended..."
              }
              aria-invalid={Boolean(reviewError)}
              aria-describedby={
                reviewError ? "review-reason-error" : undefined
              }
            />

            {reviewAction === "suspend" && (
              <div className="book-services-suspension-period">

                <label htmlFor="suspension-duration">
                  Suspension period <span>*</span>
                </label>

                <select
                  id="suspension-duration"
                  value={suspensionDuration}
                  onChange={(event) => {
                    setSuspensionDuration(event.target.value);
                    setReviewError("");
                  }}
                >
                  <option value="7">7 days</option>
                  <option value="15">15 days</option>
                  <option value="30">30 days</option>
                  <option value="60">60 days</option>
                  <option value="90">90 days</option>
                </select>

                <p>
                  The suspension expiry date will be calculated from
                  the date you submit this action.
                </p>

              </div>
            )}

            {reviewError && (
              <span
                id="review-reason-error"
                className="book-services-rejection-error"
                role="alert"
              >
                {reviewError}
              </span>
            )}

            <div className="book-services-reject-actions">

              <button
                type="button"
                className="book-services-modal-secondary"
                onClick={closeReviewDialog}
              >
                Cancel
              </button>

              <button
                type="button"
                className={`book-services-action ${reviewAction === "suspend" ? "warning" : "danger"
                  }`}
                onClick={submitReviewAction}
              >

                {reviewAction === "reject" ? (
                  <X size={13} />
                ) : reviewAction === "block" ? (
                  <Ban size={13} />
                ) : (
                  <CalendarDays size={13} />
                )}

                {reviewAction === "reject"
                  ? "Submit & Reject"
                  : reviewAction === "block"
                    ? "Confirm Block"
                    : "Confirm Suspension"}

              </button>

            </div>

          </section>
        </div>
      )}

    </div>
  );
}
