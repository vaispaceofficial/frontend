
import { useEffect, useMemo, useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Activity,
  ArrowLeft,
  BadgeCheck,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  CreditCard,
  Crown,
  FileText,
  IndianRupee,
  MapPin,
  MessageSquareText,
  Pencil,
  Phone,
  Power,
  Plus,
  Save,
  ShieldCheck,
  Sparkles,
  Star,
  Trash2,
  UserRound,
  Wallet,
  Wrench,
  X,
  XCircle,
} from "lucide-react";
import "./ProfessionalHub.css";

type SubscriptionPlan = "Basic" | "Exclusive" | "Premium";

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
  visitingFee?: string;
  about?: string;
  profileImage?: string;
  image?: string;
  photo?: string;
  rating?: number;
  reviews?: number;
  customerReviews?: CustomerReview[];
  reputationLevel?: string;
  trialStartedAt?: string;
  trialEndsAt?: string;
  subscriptionPlan?: SubscriptionPlan;
  subscriptionStartedAt?: string;
  subscriptionEndsAt?: string;
  subscriptionStatus?: string;
};

type CustomerReview = {
  id: string;
  customer: string;
  rating: number;
  comment: string;
  service: string;
  date: string;
};

type ServicePrice = {
  id: string;
  name: string;
  price: string;
};

type JobRequest = {
  id: number;
  title: string;
  location: string;
  distance: string;
  description: string;
  estimate: string;
  urgent?: boolean;
  status: "new" | "accepted" | "declined";
};

type CustomerServiceRequest = {
  id: string;
  customerId?: string | null;
  customerName: string;
  customerPhone: string;
  serviceId?: string;
  serviceName: string;
  commonIssue: string;
  serviceType: string;
  preferredProfessionalId?: string | null;
  preferredProfessionalName?: string | null;
  assignedProfessionalId?: string | null;
  assignedProfessionalName?: string | null;
  requestType?: "booking" | "callback";
  status: "pending" | "accepted" | "rejected" | "completed" | string;
  createdAt: string;
  updatedAt?: string;

  // These fields can be populated when the customer submits feedback.
  rating?: number | string;
  customerRating?: number | string;
  feedbackRating?: number | string;
  review?: string;
  customerFeedback?: string;
  feedback?: string;
  reviewText?: string;
  feedbackText?: string;
  reviewedAt?: string;
};

type CustomerNotification = {
  id: string;
  userId?: string | null;
  customerId?: string | null;
  customerPhone?: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  serviceRequestId: string;
  brand: string;
};

const APPLICATION_KEY = "oneservice_professional_application";
const APPLICATIONS_KEY = "oneservice_professional_applications";
const PROFESSIONALS_KEY = "oneservice_professionals";
const JOBS_KEY = "oneservice_professional_job_requests";
const AVAILABILITY_KEY = "oneservice_professional_accepting_calls";
const PRICING_KEY = "oneservice_professional_service_prices";
const SERVICE_REQUESTS_KEY = "oneservice_service_requests";
const NOTIFICATIONS_KEY = "oneservice_notifications";

const SERVICE_REQUESTS_CHANGE_EVENT = "oneservice-service-requests-change";
const NOTIFICATIONS_CHANGE_EVENT = "oneservice-notifications-change";

const TRIAL_DURATION_DAYS = 30;
const MAX_PROFILE_IMAGE_SIZE = 5 * 1024 * 1024;
const PROFILE_IMAGE_MAX_DIMENSION = 800;

const SUBSCRIPTION_PLANS: {
  name: SubscriptionPlan;
  displayName: string;
  price: number;
  description: string;
  features: string[];
}[] = [
  {
    name: "Basic",
    displayName: "Lite / Basic",
    price: 199,
    description: "For individual professionals and local service providers.",
    features: [
      "0% commission on customer jobs",
      "1 primary category listing",
      "Direct customer Call and WhatsApp connection",
      "Aadhaar / ID verification badge",
      "Up to 3 work portfolio photos",
      "1 local PIN code coverage",
    ],
  },
  {
    name: "Exclusive",
    displayName: "Starter / Pro",
    price: 499,
    description: "For established technicians and service professionals.",
    features: [
      "0% commission on customer jobs",
      "Up to 3 sub-category listings",
      "Priority ranking in search",
      "Up to 15 photos and video catalog",
      "Instant SMS and push lead alerts",
      "City-zone PIN code coverage",
    ],
  },
  {
    name: "Premium",
    displayName: "Growth / Biz",
    price: 999,
    description: "For contractors, agencies and growing service businesses.",
    features: [
      "0% commission on customer jobs",
      "Top 3 featured spot ranking",
      "Unlimited categories and locations",
      "Gold Trusted Partner verified seal",
      "1 in-app category banner advertisement per month",
      "Dedicated support manager",
    ],
  },
];

const INITIAL_JOBS: JobRequest[] = [
  {
    id: 1,
    title: "Short Circuit Repair & DB Box Fix",
    location: "MVP Colony, Sector 4, Visakhapatnam",
    distance: "2.4 km away",
    description:
      "The main trips repeatedly when the MCB is switched on. An electrician is needed.",
    estimate: "₹500–₹800",
    urgent: true,
    status: "new",
  },
  {
    id: 2,
    title: "Ceiling Fan Installation",
    location: "Seethammadhara, Visakhapatnam",
    distance: "4.1 km away",
    description: "Install and test three ceiling fans in a residential property.",
    estimate: "₹600",
    status: "new",
  },
];

function safeReadArray<T>(key: string): T[] {
  try {
    const stored = localStorage.getItem(key);
    if (!stored) return [];

    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function readApplication(): ProfessionalApplication | null {
  try {
    const stored = localStorage.getItem(APPLICATION_KEY);
    if (!stored) return null;

    const parsed = JSON.parse(stored);
    return parsed?.id && parsed?.fullName ? parsed : null;
  } catch {
    return null;
  }
}

function readJobs(): JobRequest[] {
  try {
    const stored = localStorage.getItem(JOBS_KEY);
    if (!stored) return INITIAL_JOBS;

    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : INITIAL_JOBS;
  } catch {
    return INITIAL_JOBS;
  }
}

function readServiceRequests(): CustomerServiceRequest[] {
  return safeReadArray<CustomerServiceRequest>(SERVICE_REQUESTS_KEY);
}

function readServicePrices(): ServicePrice[] | null {
  try {
    const stored = localStorage.getItem(PRICING_KEY);
    if (!stored) return null;

    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function getInitialAvailability() {
  try {
    return localStorage.getItem(AVAILABILITY_KEY) !== "false";
  } catch {
    return true;
  }
}

function createId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `oneservice-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function formatDate(value?: string) {
  if (!value) return "Not available";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatDateTime(value?: string) {
  if (!value) return "Not available";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function createServicePrices(services: string[]): ServicePrice[] {
  return services.map((service, index) => ({
    id: `service-${Date.now()}-${index}`,
    name: service,
    price: "",
  }));
}

function calculateTrialEnd(startDate: string) {
  const end = new Date(startDate);
  end.setDate(end.getDate() + TRIAL_DURATION_DAYS);
  return end.toISOString();
}

function getSubscriptionStatus(
  application: ProfessionalApplication,
  currentTime: number,
): "Not Started" | "Free Trial" | "Trial Expired" | "Active" | "Expired" {
  if (application.subscriptionStartedAt && application.subscriptionEndsAt) {
    return new Date(application.subscriptionEndsAt).getTime() > currentTime
      ? "Active"
      : "Expired";
  }

  if (!application.trialStartedAt || !application.trialEndsAt) {
    return "Not Started";
  }

  return new Date(application.trialEndsAt).getTime() > currentTime
    ? "Free Trial"
    : "Trial Expired";
}

function getTrialRemaining(endDate?: string, currentTime = Date.now()) {
  if (!endDate) return null;

  const difference = new Date(endDate).getTime() - currentTime;

  if (!Number.isFinite(difference) || difference <= 0) {
    return { days: 0, hours: 0, minutes: 0 };
  }

  const totalMinutes = Math.floor(difference / 60000);

  return {
    days: Math.floor(totalMinutes / 1440),
    hours: Math.floor((totalMinutes % 1440) / 60),
    minutes: totalMinutes % 60,
  };
}

function getRequestRating(request: CustomerServiceRequest): number {
  const raw =
    request.rating ??
    request.customerRating ??
    request.feedbackRating;

  const rating = Number(raw);

  return Number.isFinite(rating) && rating >= 1 && rating <= 5
    ? rating
    : 0;
}

function getRequestFeedback(request: CustomerServiceRequest): string {
  return (
    request.customerFeedback ||
    request.feedback ||
    request.review ||
    request.reviewText ||
    request.feedbackText ||
    ""
  ).trim();
}

function getRequestReviewDate(request: CustomerServiceRequest): string {
  return request.reviewedAt || request.updatedAt || request.createdAt;
}

function getProfessionalReviewData(
  requests: CustomerServiceRequest[],
  professionalId: string,
) {
  const reviews: CustomerReview[] = requests
    .filter(
      (request) =>
        request.assignedProfessionalId === professionalId ||
        request.preferredProfessionalId === professionalId,
    )
    .map((request) => {
      const rating = getRequestRating(request);
      const comment = getRequestFeedback(request);

      if (!rating && !comment) return null;

      return {
        id: request.id,
        customer: request.customerName || "Customer",
        rating,
        comment,
        service: request.serviceName || "Service",
        date: getRequestReviewDate(request),
      };
    })
    .filter((review): review is CustomerReview => review !== null);

  const ratedReviews = reviews.filter((review) => review.rating > 0);

  const averageRating = ratedReviews.length
    ? Number(
        (
          ratedReviews.reduce((total, review) => total + review.rating, 0) /
          ratedReviews.length
        ).toFixed(1),
      )
    : 0;

  let reputationLevel = "New Professional";

  if (ratedReviews.length >= 20 && averageRating >= 4.8) {
    reputationLevel = "Top Rated Professional";
  } else if (ratedReviews.length >= 10 && averageRating >= 4.5) {
    reputationLevel = "Highly Rated Professional";
  } else if (ratedReviews.length >= 3 && averageRating >= 4) {
    reputationLevel = "Trusted Professional";
  } else if (ratedReviews.length > 0) {
    reputationLevel = "Reviewed Professional";
  }

  return {
    reviews,
    averageRating,
    reviewCount: ratedReviews.length,
    reputationLevel,
  };
}

/**
 * Keep the professional's profile image and review data synchronized
 * with the application records read by ServiceDetailPage.
 */
function saveProfessionalApplication(application: ProfessionalApplication) {
  localStorage.setItem(APPLICATION_KEY, JSON.stringify(application));

  const applications = safeReadArray<ProfessionalApplication>(APPLICATIONS_KEY);
  const applicationIndex = applications.findIndex(
    (item) => item.id === application.id,
  );

  if (applicationIndex >= 0) {
    applications[applicationIndex] = {
      ...applications[applicationIndex],
      ...application,
    };

    localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(applications));
  }

  const professionals = safeReadArray<ProfessionalApplication>(PROFESSIONALS_KEY);
  const professionalIndex = professionals.findIndex(
    (item) => item.id === application.id,
  );

  if (professionalIndex >= 0) {
    professionals[professionalIndex] = {
      ...professionals[professionalIndex],
      ...application,
    };

    localStorage.setItem(PROFESSIONALS_KEY, JSON.stringify(professionals));
  }

  window.dispatchEvent(new Event("oneservice-professional-change"));
}

function MetricCard({
  icon: Icon,
  label,
  value,
  note,
  tone = "blue",
}: {
  icon: typeof Activity;
  label: string;
  value: string;
  note: string;
  tone?: "blue" | "green" | "orange" | "purple";
}) {
  return (
    <article className={`ph-metric-card ph-tone-${tone}`}>
      <div className="ph-metric-top">
        <span className="ph-metric-icon">
          <Icon size={19} />
        </span>
        <span className="ph-metric-indicator">
          <Activity size={14} />
        </span>
      </div>

      <p className="ph-metric-label">{label}</p>
      <h3>{value}</h3>
      <p className="ph-metric-note">{note}</p>
    </article>
  );
}

function ProfessionalProfileImage({
  src,
  name,
}: {
  src?: string;
  name: string;
}) {
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    setImageFailed(false);
  }, [src]);

  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

  return (
    <div className="ph-avatar" aria-label={`${name} profile photo`}>
      {src && !imageFailed ? (
        <img
          src={src}
          alt={`${name} profile`}
          onError={() => setImageFailed(true)}
        />
      ) : (
        <span className="ph-avatar-initials">
          {initials || <UserRound size={23} />}
        </span>
      )}
    </div>
  );
}

export default function ProfessionalHub() {
  const navigate = useNavigate();
  const profileImageInputRef = useRef<HTMLInputElement>(null);

  const [application, setApplication] =
    useState<ProfessionalApplication | null>(null);

  const [jobs, setJobs] = useState<JobRequest[]>(INITIAL_JOBS);
  const [customerRequests, setCustomerRequests] = useState<CustomerServiceRequest[]>([]);
  const [acceptingCalls, setAcceptingCalls] = useState(true);

  const [editing, setEditing] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [actionMessage, setActionMessage] = useState("");

  const [activePeriod, setActivePeriod] =
    useState<"week" | "month">("week");

  const [showRemoveConfirmation, setShowRemoveConfirmation] = useState(false);
  const [removingAccount, setRemovingAccount] = useState(false);
  const [removeError, setRemoveError] = useState("");

  const [servicePrices, setServicePrices] = useState<ServicePrice[]>([]);
  const [editingPrices, setEditingPrices] = useState(false);
  const [pricingMessage, setPricingMessage] = useState("");

  const [currentTime, setCurrentTime] = useState(Date.now());
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>("Exclusive");
  const [subscriptionMessage, setSubscriptionMessage] = useState("");
  const [viewingPlan, setViewingPlan] = useState<SubscriptionPlan | null>(null);

  const [showAcceptedRequests, setShowAcceptedRequests] = useState(false);
  const [profileImageUploading, setProfileImageUploading] = useState(false);
  const [profileImageMessage, setProfileImageMessage] = useState("");

  const [form, setForm] = useState({
    fullName: "",
    mobile: "",
    email: "",
    category: "",
    services: "",
    experience: "",
    city: "",
    state: "",
    serviceArea: "",
    visitingFee: "200",
    about: "",
  });

  const loadApplication = () => {
    let saved = readApplication();

    if (
      saved?.status?.toLowerCase() === "approved" &&
      !saved.trialStartedAt &&
      !saved.subscriptionStartedAt
    ) {
      const startedAt = new Date().toISOString();

      saved = {
        ...saved,
        trialStartedAt: startedAt,
        trialEndsAt: calculateTrialEnd(startedAt),
        subscriptionStatus: "Free Trial",
      };

      try {
        saveProfessionalApplication(saved);
      } catch {
        // Continue displaying the application if storage is unavailable.
      }
    }

    setApplication(saved);

    if (saved) {
      setForm({
        fullName: saved.fullName || "",
        mobile: saved.mobile || "",
        email: saved.email || "",
        category: saved.category || "",
        services: (saved.services || []).join(", "),
        experience: saved.experience || "",
        city: saved.city || "",
        state: saved.state || "",
        serviceArea: saved.serviceArea || "",
        visitingFee: saved.visitingFee || "200",
        about: saved.about || "",
      });

      const savedPrices = readServicePrices();

      setServicePrices(
        savedPrices ??
          createServicePrices(
            saved.services?.length
              ? saved.services
              : [saved.category || "Professional Service"],
          ),
      );
    } else {
      setServicePrices([]);
    }
  };

  const refreshCustomerRequests = () => {
    setCustomerRequests(readServiceRequests());
  };

  useEffect(() => {
    loadApplication();
    setJobs(readJobs());
    setAcceptingCalls(getInitialAvailability());
    refreshCustomerRequests();

    const onStorage = (event: StorageEvent) => {
      if (!event.key || event.key === APPLICATION_KEY) {
        loadApplication();
      }

      if (event.key === JOBS_KEY) {
        setJobs(readJobs());
      }

      if (event.key === AVAILABILITY_KEY) {
        setAcceptingCalls(getInitialAvailability());
      }

      if (event.key === PRICING_KEY) {
        const saved = readServicePrices();
        if (saved !== null) setServicePrices(saved);
      }

      if (event.key === SERVICE_REQUESTS_KEY) {
        refreshCustomerRequests();
      }
    };

    const onProfessionalChange = () => loadApplication();
    const onRequestsChange = () => refreshCustomerRequests();

    window.addEventListener("storage", onStorage);
    window.addEventListener(
      "oneservice-professional-change",
      onProfessionalChange,
    );
    window.addEventListener(
      SERVICE_REQUESTS_CHANGE_EVENT,
      onRequestsChange,
    );

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(
        "oneservice-professional-change",
        onProfessionalChange,
      );
      window.removeEventListener(
        SERVICE_REQUESTS_CHANGE_EVENT,
        onRequestsChange,
      );
    };
  }, []);

  useEffect(() => {
    const timer = window.setInterval(
      () => setCurrentTime(Date.now()),
      1000,
    );

    return () => window.clearInterval(timer);
  }, []);

  // Automatically synchronize genuine customer feedback with the
  // professional profile consumed by the Service Details page.
  useEffect(() => {
    if (!application) return;

    const reviewData = getProfessionalReviewData(
      customerRequests,
      application.id,
    );

    const currentReviews = application.customerReviews || [];

    const reviewsChanged =
      JSON.stringify(currentReviews) !== JSON.stringify(reviewData.reviews);

    const changed =
      Number(application.rating || 0) !== reviewData.averageRating ||
      Number(application.reviews || 0) !== reviewData.reviewCount ||
      application.reputationLevel !== reviewData.reputationLevel ||
      reviewsChanged;

    if (!changed) return;

    const updatedApplication: ProfessionalApplication = {
      ...application,
      rating: reviewData.averageRating,
      reviews: reviewData.reviewCount,
      customerReviews: reviewData.reviews,
      reputationLevel: reviewData.reputationLevel,
    };

    setApplication(updatedApplication);

    try {
      saveProfessionalApplication(updatedApplication);
    } catch {
      setActionMessage(
        "Customer feedback was loaded, but the updated rating could not be saved.",
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customerRequests, application?.id]);

  const applicationApproved =
    application?.status?.toLowerCase() === "approved";

  const subscriptionStatus = application
    ? getSubscriptionStatus(application, currentTime)
    : "Not Started";

  const trialRemaining = application
    ? getTrialRemaining(application.trialEndsAt, currentTime)
    : null;

  const viewingPlanDetails =
    SUBSCRIPTION_PLANS.find((plan) => plan.name === viewingPlan) ?? null;

  const displayName = application?.fullName || "Professional";
  const displayCategory = application?.category || "Professional service provider";

  const displayLocation = [application?.city, application?.state]
    .filter(Boolean)
    .join(", ");

  const profileImage =
    application?.profileImage ||
    application?.image ||
    application?.photo ||
    "";

  const reviewData = useMemo(() => {
    if (!application) {
      return {
        reviews: [] as CustomerReview[],
        averageRating: 0,
        reviewCount: 0,
        reputationLevel: "New Professional",
      };
    }

    return getProfessionalReviewData(customerRequests, application.id);
  }, [customerRequests, application]);

  const visibleCustomerRequests = useMemo(() => {
    if (!application) return [];

    return customerRequests.filter((request) => {
      const preferredId = request.preferredProfessionalId;
      const assignedId = request.assignedProfessionalId;

      if (assignedId && assignedId !== application.id) return false;
      if (preferredId && preferredId !== application.id) return false;

      return true;
    });
  }, [customerRequests, application]);

  const pendingCustomerRequests = useMemo(
    () =>
      visibleCustomerRequests.filter(
        (request) => request.status === "pending",
      ),
    [visibleCustomerRequests],
  );

  const acceptedCustomerRequests = useMemo(
    () =>
      visibleCustomerRequests.filter(
        (request) =>
          request.status === "accepted" ||
          request.status === "completed",
      ),
    [visibleCustomerRequests],
  );

  const newJobs = useMemo(
    () => jobs.filter((job) => job.status === "new"),
    [jobs],
  );

  const acceptedJobs = useMemo(
    () => jobs.filter((job) => job.status === "accepted"),
    [jobs],
  );

  const updateAvailability = () => {
    const nextValue = !acceptingCalls;

    setAcceptingCalls(nextValue);

    try {
      localStorage.setItem(AVAILABILITY_KEY, String(nextValue));
    } catch {
      setActionMessage("Could not save availability in this browser.");
      return;
    }

    setActionMessage(
      nextValue
        ? "Availability set to accepting requests."
        : "Availability paused. New requests are paused locally.",
    );
  };

  const handleProfileImageUpload = async (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    // Allow selecting the same image again after an upload.
    event.target.value = "";

    if (!file || !application) return;

    if (!file.type.startsWith("image/")) {
      setProfileImageMessage("Please select a valid image file.");
      return;
    }

    if (file.size > MAX_PROFILE_IMAGE_SIZE) {
      setProfileImageMessage("Please choose an image smaller than 5 MB.");
      return;
    }

    setProfileImageUploading(true);
    setProfileImageMessage("");

    try {
      const imageData = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
          if (typeof reader.result === "string") {
            resolve(reader.result);
          } else {
            reject(new Error("Unable to read image."));
          }
        };

        reader.onerror = () => reject(new Error("Unable to read image."));
        reader.readAsDataURL(file);
      });

      const compressedImage = await new Promise<string>((resolve, reject) => {
        const image = new Image();

        image.onload = () => {
          const scale = Math.min(
            1,
            PROFILE_IMAGE_MAX_DIMENSION / Math.max(image.width, image.height),
          );

          const canvas = document.createElement("canvas");
          canvas.width = Math.max(1, Math.round(image.width * scale));
          canvas.height = Math.max(1, Math.round(image.height * scale));

          const context = canvas.getContext("2d");

          if (!context) {
            reject(new Error("Image processing is not supported."));
            return;
          }

          // Use a white background when converting transparent images to JPEG.
          context.fillStyle = "#ffffff";
          context.fillRect(0, 0, canvas.width, canvas.height);
          context.drawImage(image, 0, 0, canvas.width, canvas.height);

          resolve(canvas.toDataURL("image/jpeg", 0.82));
        };

        image.onerror = () => reject(new Error("Invalid image file."));
        image.src = imageData;
      });

      const updatedApplication: ProfessionalApplication = {
        ...application,
        profileImage: compressedImage,
        image: compressedImage,
      };

      saveProfessionalApplication(updatedApplication);
      setApplication(updatedApplication);
      setProfileImageMessage("Profile photo updated successfully.");
    } catch (error) {
      setProfileImageMessage(
        error instanceof Error
          ? error.message
          : "Unable to update your profile photo.",
      );
    } finally {
      setProfileImageUploading(false);
    }
  };

  const removeProfileImage = () => {
    if (!application) return;

    const updatedApplication: ProfessionalApplication = {
      ...application,
      profileImage: "",
      image: "",
      photo: "",
    };

    try {
      saveProfessionalApplication(updatedApplication);
      setApplication(updatedApplication);
      setProfileImageMessage("Profile photo removed.");
    } catch {
      setProfileImageMessage("Unable to remove the profile photo.");
    }
  };

  const updateCustomerRequest = (
    requestId: string,
    nextStatus: "accepted" | "rejected",
  ) => {
    if (!application) return;

    if (!applicationApproved) {
      setActionMessage(
        "Your professional account must be approved before responding to customer requests.",
      );
      return;
    }

    if (!acceptingCalls) {
      setActionMessage(
        "Turn on availability before responding to customer requests.",
      );
      return;
    }

    const requests = readServiceRequests();
    const requestIndex = requests.findIndex(
      (request) => request.id === requestId,
    );

    if (requestIndex === -1) {
      refreshCustomerRequests();
      setActionMessage("This request could not be found. Please refresh.");
      return;
    }

    const request = requests[requestIndex];

    if (request.status !== "pending") {
      refreshCustomerRequests();
      setActionMessage("This request has already been responded to.");
      return;
    }

    if (
      request.preferredProfessionalId &&
      request.preferredProfessionalId !== application.id
    ) {
      setActionMessage("This request was selected for another professional.");
      return;
    }

    if (
      request.assignedProfessionalId &&
      request.assignedProfessionalId !== application.id
    ) {
      setActionMessage("This request has already been assigned to another professional.");
      return;
    }

    const now = new Date().toISOString();

    const updatedRequest: CustomerServiceRequest = {
      ...request,
      status: nextStatus,
      assignedProfessionalId: application.id,
      assignedProfessionalName: application.fullName,
      updatedAt: now,
    };

    const updatedRequests = [...requests];
    updatedRequests[requestIndex] = updatedRequest;

    try {
      localStorage.setItem(
        SERVICE_REQUESTS_KEY,
        JSON.stringify(updatedRequests),
      );

      if (nextStatus === "accepted") {
        const notifications = safeReadArray<CustomerNotification>(
          NOTIFICATIONS_KEY,
        );

        const notification: CustomerNotification = {
          id: createId(),
          userId: request.customerId || null,
          customerId: request.customerId || null,
          customerPhone: request.customerPhone || "",
          type: "service_request_accepted",
          title: "Your service request has been accepted!",
          message:
            "Your request has been accepted by the professional. Please wait 10–20 minutes to receive a call from the professional.",
          read: false,
          createdAt: now,
          serviceRequestId: request.id,
          brand: "NEED ONE SERVICE",
        };

        notifications.unshift(notification);

        localStorage.setItem(
          NOTIFICATIONS_KEY,
          JSON.stringify(notifications),
        );
      }

      setCustomerRequests(updatedRequests);

      window.dispatchEvent(
        new CustomEvent(SERVICE_REQUESTS_CHANGE_EVENT, {
          detail: updatedRequest,
        }),
      );

      window.dispatchEvent(
        new CustomEvent(NOTIFICATIONS_CHANGE_EVENT),
      );

      setActionMessage(
        nextStatus === "accepted"
          ? "Request accepted. The customer notification has been created."
          : "Customer request rejected.",
      );
    } catch {
      setActionMessage(
        "Unable to save your response in this browser. Please try again.",
      );
    }
  };

  const updateJob = (
    jobId: number,
    status: JobRequest["status"],
  ) => {
    if (status === "accepted" && !acceptingCalls) {
      setActionMessage("Turn on availability before accepting a request.");
      return;
    }

    if (status === "accepted" && !applicationApproved) {
      setActionMessage("Your professional account must be approved first.");
      return;
    }

    const updated = jobs.map((job) =>
      job.id === jobId ? { ...job, status } : job,
    );

    setJobs(updated);

    try {
      localStorage.setItem(JOBS_KEY, JSON.stringify(updated));
      setActionMessage(
        status === "accepted"
          ? "Demo request accepted."
          : "Demo request declined.",
      );
    } catch {
      setActionMessage("Unable to save the request response.");
    }
  };

  const addServicePrice = () => {
    setServicePrices((previous) => [
      ...previous,
      {
        id: `service-${Date.now()}-${previous.length}`,
        name: "",
        price: "",
      },
    ]);
  };

  const updateServicePrice = (
    id: string,
    field: "name" | "price",
    value: string,
  ) => {
    setServicePrices((previous) =>
      previous.map((service) =>
        service.id === id ? { ...service, [field]: value } : service,
      ),
    );
  };

  const removeServicePrice = (id: string) => {
    setServicePrices((previous) =>
      previous.filter((service) => service.id !== id),
    );
  };

  const saveServicePrices = () => {
    setPricingMessage("");

    const validServices = servicePrices.filter(
      (service) =>
        service.name.trim() !== "" &&
        service.price.trim() !== "",
    );

    if (!validServices.length) {
      setPricingMessage("Add at least one service with its name and price.");
      return;
    }

    const invalidPrice = validServices.some(
      (service) =>
        !Number.isFinite(Number(service.price)) ||
        Number(service.price) < 0,
    );

    if (invalidPrice) {
      setPricingMessage("Please enter valid service prices.");
      return;
    }

    try {
      localStorage.setItem(PRICING_KEY, JSON.stringify(validServices));
      setServicePrices(validServices);
      setEditingPrices(false);
      setPricingMessage("Service pricing saved successfully.");
    } catch {
      setPricingMessage("Unable to save service pricing.");
    }
  };

  const saveCredentials = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!application) return;

    const updatedApplication: ProfessionalApplication = {
      ...application,
      fullName: form.fullName.trim(),
      mobile: form.mobile.trim(),
      email: form.email.trim(),
      category: form.category.trim(),
      services: form.services
        .split(",")
        .map((service) => service.trim())
        .filter(Boolean),
      experience: form.experience.trim(),
      city: form.city.trim(),
      state: form.state.trim(),
      serviceArea: form.serviceArea.trim(),
      visitingFee: form.visitingFee.trim(),
      about: form.about.trim(),
    };

    try {
      saveProfessionalApplication(updatedApplication);
      setApplication(updatedApplication);
      setEditing(false);
      setSaveMessage("Professional credentials saved successfully.");
    } catch {
      setSaveMessage("Unable to save changes. Please try again.");
    }
  };

  const restoreCredentials = () => {
    if (!application) return;

    setForm({
      fullName: application.fullName || "",
      mobile: application.mobile || "",
      email: application.email || "",
      category: application.category || "",
      services: (application.services || []).join(", "),
      experience: application.experience || "",
      city: application.city || "",
      state: application.state || "",
      serviceArea: application.serviceArea || "",
      visitingFee: application.visitingFee || "200",
      about: application.about || "",
    });
  };

  const removeAccount = () => {
    setRemoveError("");

    try {
      setRemovingAccount(true);

      localStorage.removeItem(APPLICATION_KEY);
      localStorage.removeItem(JOBS_KEY);
      localStorage.removeItem(AVAILABILITY_KEY);
      localStorage.removeItem(PRICING_KEY);

      // Keep historical customer requests and notifications intact.
      window.dispatchEvent(new Event("oneservice-professional-change"));

      setShowRemoveConfirmation(false);
      navigate("/profile", { replace: true });
    } catch {
      setRemoveError("Unable to remove your account. Please try again.");
      setRemovingAccount(false);
    }
  };

  const proceedToSubscriptionPayment = () => {
    const plan = SUBSCRIPTION_PLANS.find(
      (item) => item.name === selectedPlan,
    );

    if (!plan || !application) return;

    setSubscriptionMessage(
      `${plan.name} plan selected for ₹${plan.price}/month. Payment gateway integration is required to complete activation.`,
    );
  };

  if (!application) {
    return (
      <main className="ph-page">
        <div className="ph-empty-state">
          <div className="ph-empty-icon">
            <Wrench size={30} />
          </div>

          <h1>Your Professional Hub</h1>

          <p>
            Complete your professional registration to manage your service
            profile and customer requests.
          </p>

          <Link to="/register-professional" className="ph-primary-button">
            Register as a Professional
            <ChevronRight size={17} />
          </Link>

          <Link to="/profile" className="ph-back-link">
            <ArrowLeft size={16} />
            Back to Profile
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="ph-page">
      <div className="ph-container">
        {/* HEADER */}
        <header className="ph-topbar">
          <div className="ph-brand">
            <Link
              to="/profile"
              className="ph-back-button"
              aria-label="Back to profile"
            >
              <ArrowLeft size={18} />
            </Link>

            <div>
              <p className="ph-eyebrow">ONESERVICE</p>
              <h1>Professional Hub</h1>
            </div>
          </div>

          <div className="ph-account">
            <div className="ph-account-copy">
              <span>Professional Account</span>
              <strong>{displayName}</strong>
              <small>
                {applicationApproved
                  ? "Approved professional"
                  : "Application under review"}
              </small>
            </div>

            <button
              type="button"
              className="ph-avatar-upload-trigger"
              onClick={() => profileImageInputRef.current?.click()}
              title="Change profile photo"
              aria-label="Change profile photo"
            >
              <ProfessionalProfileImage
                src={profileImage}
                name={displayName}
              />
              <span className="ph-avatar-edit-icon">
                <Pencil size={13} />
              </span>
            </button>

            <input
              ref={profileImageInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={handleProfileImageUpload}
            />
          </div>
        </header>

        {profileImageMessage && (
          <div className="ph-inline-message" role="status">
            <span>{profileImageMessage}</span>
            <button
              type="button"
              onClick={() => setProfileImageMessage("")}
              aria-label="Dismiss photo message"
            >
              <X size={15} />
            </button>
          </div>
        )}

        {profileImageUploading && (
          <div className="ph-inline-message">
            Uploading and processing your profile photo...
          </div>
        )}

        {/* ACCOUNT STATUS */}
        <section
          className={`ph-status-banner ${
            applicationApproved ? "is-approved" : "is-pending"
          }`}
        >
          <div className="ph-status-icon">
            {applicationApproved ? (
              <BadgeCheck size={22} />
            ) : (
              <Clock3 size={22} />
            )}
          </div>

          <div className="ph-status-copy">
            <strong>
              {applicationApproved
                ? "Your professional account is approved"
                : "Your professional application is under review"}
            </strong>

            <p>
              {applicationApproved
                ? "Keep your credentials and service areas up to date."
                : "You can review your details while the NeedOneService team verifies your application."}
            </p>
          </div>

          <span className="ph-status-pill">
            {applicationApproved ? "Approved" : "Pending review"}
          </span>
        </section>

        {/* HEADING */}
        <section className="ph-heading-row">
          <div>
            <p className="ph-eyebrow">YOUR WORKSPACE</p>
            <h2>Good to see you, {displayName.split(" ")[0]}!</h2>
            <p className="ph-section-subtitle">
              Manage your service requests, performance and professional details.
            </p>
          </div>

          <button
            type="button"
            className={`ph-availability ${
              acceptingCalls ? "is-on" : "is-off"
            }`}
            onClick={updateAvailability}
          >
            <Power size={16} />
            {acceptingCalls
              ? "Accepting Requests"
              : "Availability Paused"}
          </button>
        </section>

        {actionMessage && (
          <div className="ph-inline-message" role="status">
            <span>{actionMessage}</span>
            <button
              type="button"
              onClick={() => setActionMessage("")}
              aria-label="Dismiss message"
            >
              <X size={15} />
            </button>
          </div>
        )}

        {/* ANALYTICS */}
        <section className="ph-section">
          <div className="ph-section-heading">
            <div>
              <h2>
                <Activity size={20} />
                Analytics Overview
              </h2>
              <p>A quick overview of your professional activity.</p>
            </div>

            <span className="ph-data-note">
              Live data appears after backend integration
            </span>
          </div>

          <div className="ph-metrics-grid">
            <MetricCard
              icon={BriefcaseBusiness}
              label="Open Requests"
              value={String(
                pendingCustomerRequests.length + newJobs.length,
              )}
              note="Requests awaiting your response"
              tone="blue"
            />

            <MetricCard
              icon={CheckCircle2}
              label="Accepted Requests"
              value={String(
                acceptedCustomerRequests.length + acceptedJobs.length,
              )}
              note="Accepted in this browser"
              tone="green"
            />

            <MetricCard
              icon={Wallet}
              label="Average Rating"
              value={
                reviewData.reviewCount
                  ? reviewData.averageRating.toFixed(1)
                  : "—"
              }
              note={`${reviewData.reviewCount} verified rating(s)`}
              tone="purple"
            />

            <MetricCard
              icon={Star}
              label="Customer Reviews"
              value={String(reviewData.reviewCount)}
              note={reviewData.reputationLevel}
              tone="orange"
            />
          </div>
        </section>

        {/* REQUESTS AND ANALYTICS */}
        <div className="ph-main-grid">
          <section className="ph-panel ph-requests-panel">
            <div className="ph-panel-heading">
              <div>
                <p className="ph-eyebrow">CUSTOMER WORK</p>
                <h2>
                  Incoming Requests{" "}
                  <span className="ph-count">
                    {pendingCustomerRequests.length + newJobs.length}
                  </span>
                </h2>
                <p>Review the service details before responding.</p>
              </div>

              <div className="ph-request-header-actions">
                <button
                  type="button"
                  className="ph-outline-button"
                  onClick={() => setShowAcceptedRequests(true)}
                >
                  <CheckCircle2 size={16} />
                  Accepted Requests
                  <span className="ph-count">
                    {acceptedCustomerRequests.length}
                  </span>
                </button>
              </div>
            </div>

            {!acceptingCalls && (
              <div className="ph-paused-note">
                <Power size={16} />
                Availability is paused. Turn it on to accept requests.
              </div>
            )}

            {!applicationApproved && (
              <div className="ph-review-note">
                <ShieldCheck size={17} />
                Accepting customer jobs becomes available after account approval.
              </div>
            )}

            {pendingCustomerRequests.length > 0 && (
              <div className="ph-request-list">
                {pendingCustomerRequests.map((request) => (
                  <article className="ph-request-card" key={request.id}>
                    <div className="ph-request-top">
                      <div className="ph-request-symbol">
                        <Wrench size={19} />
                      </div>

                      <div className="ph-request-title">
                        <h3>{request.serviceName || "Service request"}</h3>

                        <div className="ph-request-badges">
                          <span className="ph-new-badge">
                            New customer request
                          </span>

                          {request.requestType === "callback" && (
                            <span className="ph-urgent-badge">
                              Callback request
                            </span>
                          )}
                        </div>
                      </div>

                      <span className="ph-new-badge">Pending</span>
                    </div>

                    <div className="ph-request-description">
                      <strong>Customer:</strong>{" "}
                      {request.customerName || "Customer"}
                    </div>

                    <div className="ph-request-location">
                      <Phone size={15} />
                      <a href={`tel:${request.customerPhone}`}>
                        {request.customerPhone || "Phone not provided"}
                      </a>
                    </div>

                    <div className="ph-request-description">
                      <strong>Issue:</strong>{" "}
                      {request.commonIssue || "Not specified"}
                    </div>

                    <div className="ph-request-description">
                      <strong>Service type:</strong>{" "}
                      {request.serviceType || "Not specified"}
                    </div>

                    <div className="ph-request-description">
                      <strong>Request received:</strong>{" "}
                      {formatDateTime(request.createdAt)}
                    </div>

                    {request.preferredProfessionalName && (
                      <div className="ph-request-description">
                        <strong>Preferred professional:</strong>{" "}
                        {request.preferredProfessionalName}
                      </div>
                    )}

                    <div className="ph-request-actions">
                      <button
                        type="button"
                        className="ph-secondary-button"
                        onClick={() =>
                          updateCustomerRequest(request.id, "rejected")
                        }
                        disabled={!applicationApproved || !acceptingCalls}
                      >
                        <XCircle size={16} />
                        Reject
                      </button>

                      <button
                        type="button"
                        className="ph-primary-button"
                        onClick={() =>
                          updateCustomerRequest(request.id, "accepted")
                        }
                        disabled={!applicationApproved || !acceptingCalls}
                      >
                        <Check size={16} />
                        Accept Request
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {newJobs.length > 0 && (
              <>
                <div className="ph-panel-heading compact">
                  <div>
                    <p className="ph-eyebrow">SAMPLE REQUESTS</p>
                    <h2>Demo Requests</h2>
                  </div>
                </div>

                <div className="ph-request-list">
                  {newJobs.map((job) => (
                    <article className="ph-request-card" key={job.id}>
                      <div className="ph-request-top">
                        <div className="ph-request-symbol">
                          <Wrench size={19} />
                        </div>

                        <div className="ph-request-title">
                          <h3>{job.title}</h3>
                          <div className="ph-request-badges">
                            {job.urgent && (
                              <span className="ph-urgent-badge">Urgent</span>
                            )}
                            <span className="ph-new-badge">Demo request</span>
                          </div>
                        </div>

                        <strong className="ph-estimate">
                          {job.estimate}
                        </strong>
                      </div>

                      <p className="ph-request-description">
                        {job.description}
                      </p>

                      <div className="ph-request-location">
                        <MapPin size={15} />
                        <span>{job.location}</span>
                        <span className="ph-distance">{job.distance}</span>
                      </div>

                      <div className="ph-request-actions">
                        <button
                          type="button"
                          className="ph-secondary-button"
                          onClick={() => updateJob(job.id, "declined")}
                        >
                          <XCircle size={16} />
                          Decline
                        </button>

                        <button
                          type="button"
                          className="ph-primary-button"
                          onClick={() => updateJob(job.id, "accepted")}
                          disabled={!acceptingCalls || !applicationApproved}
                        >
                          <Check size={16} />
                          Accept Request
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              </>
            )}

            {pendingCustomerRequests.length === 0 &&
              newJobs.length === 0 && (
                <div className="ph-empty-list">
                  <div className="ph-empty-icon small">
                    <CheckCircle2 size={23} />
                  </div>
                  <strong>You're all caught up</strong>
                  <p>
                    New customer requests will appear here when available.
                  </p>
                </div>
              )}
          </section>

          <div className="ph-right-column">
            <section className="ph-panel ph-graph-panel">
              <div className="ph-panel-heading compact">
                <div>
                  <p className="ph-eyebrow">PERFORMANCE</p>
                  <h2>Analytics Graph</h2>
                </div>

                <Activity size={21} className="ph-heading-icon" />
              </div>

              <div className="ph-period-control">
                <button
                  type="button"
                  className={activePeriod === "week" ? "active" : ""}
                  onClick={() => setActivePeriod("week")}
                >
                  This week
                </button>

                <button
                  type="button"
                  className={activePeriod === "month" ? "active" : ""}
                  onClick={() => setActivePeriod("month")}
                >
                  This month
                </button>
              </div>

              <div className="ph-chart">
                <div className="ph-chart-y-labels">
                  <span>—</span>
                  <span>—</span>
                  <span>—</span>
                  <span>—</span>
                </div>

                <div className="ph-chart-plot">
                  {[0, 1, 2, 3].map((line) => (
                    <div className="ph-chart-gridline" key={line} />
                  ))}

                  <div className="ph-chart-empty">
                    <Activity size={24} />
                    <span>Performance data will appear here</span>
                  </div>
                </div>
              </div>

              <div className="ph-chart-legend">
                <span>
                  <i className="ph-legend-dot blue" />
                  Requests
                </span>
                <span>
                  <i className="ph-legend-dot green" />
                  Completed jobs
                </span>
              </div>

              <p className="ph-chart-footnote">
                {activePeriod === "week" ? "Weekly" : "Monthly"} analytics
                require verified job records.
              </p>
            </section>

            <section className="ph-panel ph-feedback-panel">
              <div className="ph-panel-heading compact">
                <div>
                  <p className="ph-eyebrow">CUSTOMER EXPERIENCE</p>
                  <h2>Customer Feedback</h2>
                </div>

                <MessageSquareText
                  size={21}
                  className="ph-heading-icon"
                />
              </div>

              {reviewData.reviews.length === 0 ? (
                <div className="ph-feedback-empty">
                  <div className="ph-feedback-icon">
                    <Star size={22} />
                  </div>

                  <strong>Your reviews will appear here</strong>

                  <p>
                    Customer ratings and written feedback will be displayed
                    after customers submit reviews for completed services.
                  </p>
                </div>
              ) : (
                <div className="ph-feedback-list">
                  {reviewData.reviews.slice(0, 3).map((review) => (
                    <article
                      className="ph-feedback-item"
                      key={review.id}
                    >
                      <div className="ph-feedback-item-top">
                        <strong>{review.customer}</strong>
                        <span>
                          <Star size={14} fill="currentColor" />
                          {review.rating || "—"}
                        </span>
                      </div>

                      <p>{review.comment || "Rating submitted."}</p>
                      <small>
                        {review.service} · {formatDate(review.date)}
                      </small>
                    </article>
                  ))}
                </div>
              )}

              <div className="ph-reputation-summary">
                <span>Professional reputation</span>
                <strong>{reviewData.reputationLevel}</strong>
                <small>
                  {reviewData.averageRating
                    ? `${reviewData.averageRating.toFixed(1)} / 5 from ${reviewData.reviewCount} ratings`
                    : "Waiting for customer ratings"}
                </small>
              </div>
            </section>
          </div>
        </div>

        {/* SERVICE PRICING */}
        <section className="ph-panel ph-pricing-panel" id="service-pricing">
          <div className="ph-credentials-heading">
            <div className="ph-credentials-icon">
              <IndianRupee size={23} />
            </div>

            <div>
              <p className="ph-eyebrow">YOUR SERVICE RATE CARD</p>
              <h2>Service Pricing</h2>
              <p>
                Set the prices you charge customers for each professional service.
              </p>
            </div>

            {!editingPrices && (
              <button
                type="button"
                className="ph-outline-button"
                onClick={() => {
                  setPricingMessage("");
                  setEditingPrices(true);
                }}
              >
                <Pencil size={16} />
                Edit Pricing
              </button>
            )}
          </div>

          {pricingMessage && (
            <div className="ph-save-message" role="status">
              <CheckCircle2 size={16} />
              {pricingMessage}
            </div>
          )}

          {editingPrices ? (
            <>
              <div className="ph-pricing-description">
                <Wallet size={18} />
                <p>
                  Enter your service name and technician charge. You can add
                  as many services as required.
                </p>
              </div>

              <div className="ph-pricing-list">
                {servicePrices.map((service, index) => (
                  <div className="ph-pricing-row" key={service.id}>
                    <div className="ph-pricing-number">{index + 1}</div>

                    <label className="ph-pricing-name">
                      <span>Service name</span>
                      <input
                        type="text"
                        value={service.name}
                        placeholder="e.g. AC Repair"
                        onChange={(event) =>
                          updateServicePrice(
                            service.id,
                            "name",
                            event.target.value,
                          )
                        }
                      />
                    </label>

                    <label className="ph-pricing-amount">
                      <span>Technician price (₹)</span>
                      <div className="ph-price-input">
                        <IndianRupee size={16} />
                        <input
                          type="number"
                          min="0"
                          step="1"
                          value={service.price}
                          placeholder="Enter amount"
                          onChange={(event) =>
                            updateServicePrice(
                              service.id,
                              "price",
                              event.target.value,
                            )
                          }
                        />
                      </div>
                    </label>

                    <button
                      type="button"
                      className="ph-remove-service"
                      onClick={() => removeServicePrice(service.id)}
                      aria-label={`Remove ${service.name || "service"}`}
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                ))}
              </div>

              <button
                type="button"
                className="ph-add-service-button"
                onClick={addServicePrice}
              >
                <Plus size={17} />
                Add Another Service
              </button>

              <div className="ph-form-actions ph-pricing-actions">
                <button
                  type="button"
                  className="ph-secondary-button"
                  onClick={() => {
                    setServicePrices(
                      readServicePrices() ??
                        createServicePrices(
                          application.services?.length
                            ? application.services
                            : [application.category],
                        ),
                    );
                    setEditingPrices(false);
                  }}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="ph-primary-button"
                  onClick={saveServicePrices}
                >
                  <Save size={16} />
                  Save Pricing
                </button>
              </div>
            </>
          ) : (
            <div className="ph-pricing-display">
              {servicePrices.length > 0 ? (
                <>
                  <div className="ph-pricing-display-header">
                    <span>Service / Work Description</span>
                    <span>Technician Charges</span>
                  </div>

                  {servicePrices.map((service, index) => (
                    <div
                      className="ph-pricing-display-row"
                      key={service.id}
                    >
                      <div className="ph-pricing-display-name">
                        <span className="ph-pricing-number">
                          {index + 1}
                        </span>
                        <strong>{service.name}</strong>
                      </div>

                      <strong className="ph-pricing-display-price">
                        ₹{Number(service.price).toLocaleString("en-IN")}
                      </strong>
                    </div>
                  ))}

                  <div className="ph-pricing-footer-note">
                    <ShieldCheck size={16} />
                    Your service charges are saved in your professional profile.
                  </div>
                </>
              ) : (
                <div className="ph-pricing-empty">
                  <Wallet size={27} />
                  <strong>No service prices added yet</strong>
                  <p>
                    Add your services and corresponding technician charges
                    to create your rate card.
                  </p>

                  <button
                    type="button"
                    className="ph-primary-button"
                    onClick={() => setEditingPrices(true)}
                  >
                    <Plus size={16} />
                    Add Service Pricing
                  </button>
                </div>
              )}
            </div>
          )}
        </section>

        {/* MODIFY CREDENTIALS */}
        <section
          className="ph-panel ph-credentials-panel"
          id="modify-credentials"
        >
          <div className="ph-credentials-heading">
            <div className="ph-credentials-icon">
              <ShieldCheck size={23} />
            </div>

            <div>
              <p className="ph-eyebrow">YOUR PROFESSIONAL PROFILE</p>
              <h2>Modify Credentials</h2>
              <p>
                Update your profile photo, contact details, skills and service information.
              </p>
            </div>

            {!editing && (
              <button
                type="button"
                className="ph-outline-button"
                onClick={() => {
                  setSaveMessage("");
                  setEditing(true);
                }}
              >
                <Pencil size={16} />
                Edit Credentials
              </button>
            )}
          </div>

          {/* PROFILE PHOTO UPLOAD */}
          <div className="ph-profile-photo-editor">
            <button
              type="button"
              className="ph-profile-photo-button"
              onClick={() => profileImageInputRef.current?.click()}
              disabled={profileImageUploading}
            >
              <ProfessionalProfileImage
                src={profileImage}
                name={displayName}
              />

              <span className="ph-profile-photo-edit">
                <Pencil size={14} />
              </span>
            </button>

            <div className="ph-profile-photo-copy">
              <strong>Professional Profile Photo</strong>
              <p>
                This photo is also displayed on your professional card
                in the Service Details page.
              </p>

              <div className="ph-profile-photo-actions">
                <button
                  type="button"
                  className="ph-outline-button"
                  onClick={() => profileImageInputRef.current?.click()}
                  disabled={profileImageUploading}
                >
                  <Pencil size={15} />
                  {profileImage ? "Change Photo" : "Upload Photo"}
                </button>

                {profileImage && (
                  <button
                    type="button"
                    className="ph-secondary-button"
                    onClick={removeProfileImage}
                  >
                    <Trash2 size={15} />
                    Remove
                  </button>
                )}
              </div>
            </div>
          </div>

          {profileImageMessage && (
            <div className="ph-save-message" role="status">
              {profileImageMessage}
            </div>
          )}

          {saveMessage && (
            <div className="ph-save-message" role="status">
              <CheckCircle2 size={16} />
              {saveMessage}
            </div>
          )}

          {editing ? (
            <form
              className="ph-credentials-form"
              onSubmit={saveCredentials}
            >
              <div className="ph-form-grid">
                <label>
                  Full name
                  <input
                    required
                    value={form.fullName}
                    onChange={(event) =>
                      setForm({ ...form, fullName: event.target.value })
                    }
                  />
                </label>

                <label>
                  Mobile number
                  <input
                    required
                    value={form.mobile}
                    inputMode="tel"
                    onChange={(event) =>
                      setForm({ ...form, mobile: event.target.value })
                    }
                  />
                </label>

                <label>
                  Email address
                  <input
                    type="email"
                    value={form.email}
                    onChange={(event) =>
                      setForm({ ...form, email: event.target.value })
                    }
                  />
                </label>

                <label>
                  Primary profession
                  <input
                    required
                    value={form.category}
                    onChange={(event) =>
                      setForm({ ...form, category: event.target.value })
                    }
                  />
                </label>

                <label>
                  Services / skills
                  <input
                    value={form.services}
                    placeholder="Electrical repair, wiring, installation"
                    onChange={(event) =>
                      setForm({ ...form, services: event.target.value })
                    }
                  />
                  <small>Separate services with commas.</small>
                </label>

                <label>
                  Experience
                  <input
                    value={form.experience}
                    placeholder="e.g. 3 years"
                    onChange={(event) =>
                      setForm({ ...form, experience: event.target.value })
                    }
                  />
                </label>

                <label>
                  City
                  <input
                    value={form.city}
                    onChange={(event) =>
                      setForm({ ...form, city: event.target.value })
                    }
                  />
                </label>

                <label>
                  State
                  <input
                    value={form.state}
                    onChange={(event) =>
                      setForm({ ...form, state: event.target.value })
                    }
                  />
                </label>

                <label>
                  Service areas
                  <input
                    value={form.serviceArea}
                    placeholder="Areas or localities you cover"
                    onChange={(event) =>
                      setForm({ ...form, serviceArea: event.target.value })
                    }
                  />
                </label>

                <label>
                  Visiting fee (₹)
                  <input
                    type="number"
                    min="0"
                    value={form.visitingFee}
                    onChange={(event) =>
                      setForm({ ...form, visitingFee: event.target.value })
                    }
                  />
                </label>

                <label className="ph-form-full">
                  About your services
                  <textarea
                    rows={3}
                    value={form.about}
                    placeholder="Briefly describe your experience and the services you provide."
                    onChange={(event) =>
                      setForm({ ...form, about: event.target.value })
                    }
                  />
                </label>
              </div>

              <div className="ph-form-actions">
                <button
                  type="button"
                  className="ph-secondary-button"
                  onClick={() => {
                    setEditing(false);
                    restoreCredentials();
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="ph-primary-button"
                >
                  <Save size={16} />
                  Save Credentials
                </button>
              </div>
            </form>
          ) : (
            <>
              <div className="ph-credentials-grid">
                <div className="ph-credential-item">
                  <span className="ph-credential-icon">
                    <UserRound size={17} />
                  </span>
                  <div>
                    <small>Full name</small>
                    <strong>{application.fullName || "Not provided"}</strong>
                  </div>
                </div>

                <div className="ph-credential-item">
                  <span className="ph-credential-icon">
                    <BriefcaseBusiness size={17} />
                  </span>
                  <div>
                    <small>Primary profession</small>
                    <strong>{displayCategory}</strong>
                  </div>
                </div>

                <div className="ph-credential-item">
                  <span className="ph-credential-icon">
                    <Phone size={17} />
                  </span>
                  <div>
                    <small>Mobile number</small>
                    <strong>{application.mobile || "Not provided"}</strong>
                  </div>
                </div>

                <div className="ph-credential-item">
                  <span className="ph-credential-icon">
                    <FileText size={17} />
                  </span>
                  <div>
                    <small>Email address</small>
                    <strong>{application.email || "Not provided"}</strong>
                  </div>
                </div>

                <div className="ph-credential-item">
                  <span className="ph-credential-icon">
                    <MapPin size={17} />
                  </span>
                  <div>
                    <small>Location</small>
                    <strong>{displayLocation || "Not provided"}</strong>
                  </div>
                </div>

                <div className="ph-credential-item">
                  <span className="ph-credential-icon">
                    <CalendarDays size={17} />
                  </span>
                  <div>
                    <small>Experience</small>
                    <strong>{application.experience || "Not provided"}</strong>
                  </div>
                </div>

                <div className="ph-credential-item">
                  <span className="ph-credential-icon">
                    <Wallet size={17} />
                  </span>
                  <div>
                    <small>Visiting fee</small>
                    <strong>
                      {application.visitingFee
                        ? `₹${application.visitingFee}`
                        : "Not set"}
                    </strong>
                  </div>
                </div>

                <div className="ph-credential-item">
                  <span className="ph-credential-icon">
                    <Star size={17} />
                  </span>
                  <div>
                    <small>Customer rating</small>
                    <strong>
                      {reviewData.reviewCount
                        ? `${reviewData.averageRating.toFixed(1)} / 5`
                        : "Not rated yet"}
                    </strong>
                  </div>
                </div>

                <div className="ph-credential-item">
                  <span className="ph-credential-icon">
                    <Clock3 size={17} />
                  </span>
                  <div>
                    <small>Registered on</small>
                    <strong>{formatDate(application.submittedAt)}</strong>
                  </div>
                </div>
              </div>

              <div className="ph-services-row">
                <div>
                  <strong>Registered services</strong>
                  <p>Services associated with your professional account.</p>
                </div>

                <div className="ph-service-chips">
                  {(application.services || []).length > 0 ? (
                    application.services.map((service) => (
                      <span key={service}>{service}</span>
                    ))
                  ) : (
                    <span>{displayCategory}</span>
                  )}
                </div>
              </div>

              {application.about && (
                <div className="ph-about-row">
                  <strong>About your services</strong>
                  <p>{application.about}</p>
                </div>
              )}
            </>
          )}
        </section>

        {/* SUBSCRIPTION */}
        {applicationApproved && (
          <section
            className="ph-panel ph-subscription-panel ph-subscription-panel-bottom"
            id="professional-subscription"
          >
            <div className="ph-subscription-heading">
              <div className="ph-subscription-title-wrap">
                <span className="ph-subscription-heading-icon">
                  <CreditCard size={21} />
                </span>

                <div>
                  <p className="ph-eyebrow">MEMBERSHIP &amp; VISIBILITY</p>
                  <h2>Professional Subscription</h2>
                  <p>
                    Track your free trial and manage your NeedOneService membership.
                  </p>
                </div>
              </div>

              <span
                className={`ph-subscription-status ${subscriptionStatus
                  .toLowerCase()
                  .replaceAll(" ", "-")}`}
              >
                {subscriptionStatus}
              </span>
            </div>

            {subscriptionStatus === "Free Trial" && trialRemaining && (
              <div className="ph-trial-compact">
                <div className="ph-trial-compact-copy">
                  <span className="ph-trial-sparkle">
                    <Sparkles size={17} />
                  </span>

                  <div>
                    <strong>30-day free trial</strong>
                    <p>
                      {trialRemaining.days} days, {trialRemaining.hours} hours
                      and {trialRemaining.minutes} minutes remaining · Ends{" "}
                      {formatDate(application.trialEndsAt)}
                    </p>
                  </div>
                </div>

                <span className="ph-trial-price">
                  <strong>₹0</strong>
                  <small>during trial</small>
                </span>
              </div>
            )}

            {(subscriptionStatus === "Free Trial" ||
              subscriptionStatus === "Trial Expired" ||
              subscriptionStatus === "Expired") && (
              <>
                {subscriptionStatus !== "Free Trial" && (
                  <div className="ph-subscription-expired">
                    <Clock3 size={20} />
                    <div>
                      <strong>Your free trial has expired</strong>
                      <p>
                        Choose a plan to continue your NeedOneService professional membership.
                      </p>
                    </div>
                  </div>
                )}

                <div className="ph-subscription-plans-heading">
                  <div>
                    <h3>Plans after your trial</h3>
                    <p>
                      Choose a membership that suits your professional requirements.
                    </p>
                  </div>
                </div>

                <div className="ph-subscription-plan-grid compact">
                  {SUBSCRIPTION_PLANS.map((plan) => (
                    <button
                      type="button"
                      key={plan.name}
                      className={`ph-subscription-plan-card ${plan.name.toLowerCase()} ${
                        selectedPlan === plan.name ? "selected" : ""
                      }`}
                      onClick={() => {
                        setViewingPlan(plan.name);
                        setSubscriptionMessage("");
                      }}
                    >
                      <span className="ph-plan-card-top">
                        <span className="ph-plan-icon">
                          {plan.name === "Basic" ? (
                            <ShieldCheck size={17} />
                          ) : plan.name === "Exclusive" ? (
                            <Sparkles size={17} />
                          ) : (
                            <Crown size={17} />
                          )}
                        </span>

                        <span className="ph-plan-radio">
                          {selectedPlan === plan.name ? (
                            <Check size={12} />
                          ) : null}
                        </span>
                      </span>

                      <strong className="ph-plan-name">
                        {plan.displayName}
                      </strong>

                      <span className="ph-plan-price">
                        ₹{plan.price}
                        <small>/ month</small>
                      </span>

                      <span className="ph-plan-description">
                        {plan.description}
                      </span>

                      <span className="ph-plan-select-label">
                        View Plan Details <ChevronRight size={14} />
                      </span>
                    </button>
                  ))}
                </div>

                {subscriptionStatus !== "Free Trial" && (
                  <div className="ph-subscription-payment-row">
                    <div>
                      <span>Selected plan</span>
                      <strong>
                        {
                          SUBSCRIPTION_PLANS.find(
                            (plan) => plan.name === selectedPlan,
                          )?.displayName
                        }
                      </strong>
                    </div>

                    <div>
                      <span>Monthly subscription</span>
                      <strong>
                        ₹
                        {
                          SUBSCRIPTION_PLANS.find(
                            (plan) => plan.name === selectedPlan,
                          )?.price
                        }
                      </strong>
                    </div>

                    <button
                      type="button"
                      className="ph-primary-button"
                      onClick={proceedToSubscriptionPayment}
                    >
                      <CreditCard size={16} />
                      Proceed to Payment
                    </button>
                  </div>
                )}

                {subscriptionMessage && (
                  <div className="ph-subscription-message" role="status">
                    {subscriptionMessage}
                  </div>
                )}

                <p className="ph-subscription-footnote">
                  No charge is made during the free trial. A plan is activated
                  only after successful payment verification.
                </p>
              </>
            )}

            {subscriptionStatus === "Active" && (
              <div className="ph-active-subscription">
                <span>
                  <CheckCircle2 size={22} />
                </span>

                <div>
                  <strong>
                    {application.subscriptionPlan || "Subscription"} Plan Active
                  </strong>
                  <p>
                    Subscription started:{" "}
                    {formatDate(application.subscriptionStartedAt)}
                  </p>
                  <p>
                    Subscription expires:{" "}
                    {formatDate(application.subscriptionEndsAt)}
                  </p>
                </div>
              </div>
            )}

            {subscriptionStatus === "Not Started" && (
              <div className="ph-subscription-pending">
                <Clock3 size={19} />
                <span>
                  Your subscription trial will begin once your professional
                  account is approved.
                </span>
              </div>
            )}
          </section>
        )}

        {/* PLAN DETAILS MODAL */}
        {viewingPlanDetails && (
          <div
            className="ph-plan-modal-overlay"
            role="presentation"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                setViewingPlan(null);
              }
            }}
          >
            <section
              className={`ph-plan-modal-dialog ${viewingPlanDetails.name.toLowerCase()}`}
              role="dialog"
              aria-modal="true"
              aria-labelledby="ph-plan-modal-title"
            >
              <button
                type="button"
                className="ph-plan-modal-close"
                onClick={() => setViewingPlan(null)}
                aria-label="Close membership details"
              >
                <X size={20} />
              </button>

              <div className="ph-plan-modal-header">
                <span className="ph-plan-modal-icon">
                  {viewingPlanDetails.name === "Basic" ? (
                    <ShieldCheck size={25} />
                  ) : viewingPlanDetails.name === "Exclusive" ? (
                    <Sparkles size={25} />
                  ) : (
                    <Crown size={25} />
                  )}
                </span>

                <div>
                  <span className="ph-eyebrow">
                    PROFESSIONAL MEMBERSHIP
                  </span>
                  <h2 id="ph-plan-modal-title">
                    {viewingPlanDetails.displayName}
                  </h2>
                  <p>{viewingPlanDetails.description}</p>
                </div>
              </div>

              <div className="ph-plan-modal-price">
                <div>
                  <strong>
                    ₹{viewingPlanDetails.price.toLocaleString("en-IN")}
                  </strong>
                  <span>/ month</span>
                </div>
                <small>0% commission on customer jobs</small>
              </div>

              <div className="ph-plan-modal-features">
                <h3>Membership Benefits</h3>
                <ul>
                  {viewingPlanDetails.features.map((feature, index) => (
                    <li key={`${viewingPlanDetails.name}-${index}`}>
                      <span>
                        <Check size={15} />
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="ph-plan-modal-discounts">
                <h3>Save with upfront subscriptions</h3>

                <div className="ph-plan-discount-grid">
                  <div>
                    <strong>10% OFF</strong>
                    <span>3 months</span>
                  </div>
                  <div>
                    <strong>15% OFF</strong>
                    <span>6 months</span>
                  </div>
                  <div>
                    <strong>2 Months FREE</strong>
                    <span>12 months</span>
                  </div>
                </div>
              </div>

              <div className="ph-plan-modal-actions">
                <button
                  type="button"
                  className="ph-secondary-button"
                  onClick={() => setViewingPlan(null)}
                >
                  Close
                </button>

                <button
                  type="button"
                  className="ph-primary-button"
                  onClick={() => {
                    setSelectedPlan(viewingPlanDetails.name);
                    setSubscriptionMessage("");
                    setViewingPlan(null);
                  }}
                >
                  <CheckCircle2 size={17} />
                  Select This Plan
                </button>
              </div>

              <p className="ph-plan-modal-note">
                Your 30-day free trial remains unchanged. Subscription
                activation requires successful payment verification.
              </p>
            </section>
          </div>
        )}

        {/* ACCEPTED REQUESTS MODAL */}
        {showAcceptedRequests && (
          <div
            className="ph-accepted-overlay"
            role="presentation"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                setShowAcceptedRequests(false);
              }
            }}
          >
            <section
              className="ph-accepted-dialog"
              role="dialog"
              aria-modal="true"
              aria-labelledby="ph-accepted-title"
            >
              <div className="ph-accepted-dialog-header">
                <div>
                  <p className="ph-eyebrow">YOUR CUSTOMER HISTORY</p>
                  <h2 id="ph-accepted-title">Accepted Requests</h2>
                  <p>
                    View customer details, accepted services and feedback
                    received for your work.
                  </p>
                </div>

                <button
                  type="button"
                  className="ph-accepted-close"
                  onClick={() => setShowAcceptedRequests(false)}
                  aria-label="Close accepted requests"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="ph-accepted-summary-grid">
                <div>
                  <span>Total accepted requests</span>
                  <strong>{acceptedCustomerRequests.length}</strong>
                </div>

                <div>
                  <span>Customer ratings</span>
                  <strong>{reviewData.reviewCount}</strong>
                </div>

                <div>
                  <span>Average rating</span>
                  <strong>
                    {reviewData.reviewCount
                      ? `${reviewData.averageRating.toFixed(1)} / 5`
                      : "—"}
                  </strong>
                </div>
              </div>

              {acceptedCustomerRequests.length > 0 ? (
                <div className="ph-accepted-request-list">
                  {acceptedCustomerRequests
                    .slice()
                    .sort(
                      (a, b) =>
                        new Date(b.updatedAt || b.createdAt).getTime() -
                        new Date(a.updatedAt || a.createdAt).getTime(),
                    )
                    .map((request) => {
                      const rating = getRequestRating(request);
                      const feedback = getRequestFeedback(request);

                      return (
                        <article
                          className="ph-accepted-request-card"
                          key={request.id}
                        >
                          <div className="ph-accepted-card-heading">
                            <div className="ph-request-symbol">
                              <Wrench size={19} />
                            </div>

                            <div>
                              <h3>
                                {request.serviceName || "Service request"}
                              </h3>
                              <span className="ph-accepted-status">
                                <CheckCircle2 size={14} />
                                {request.status === "completed"
                                  ? "Completed"
                                  : "Accepted"}
                              </span>
                            </div>

                            <small>
                              {formatDateTime(
                                request.updatedAt || request.createdAt,
                              )}
                            </small>
                          </div>

                          <div className="ph-accepted-details-grid">
                            <div>
                              <span>Customer name</span>
                              <strong>
                                {request.customerName || "Not provided"}
                              </strong>
                            </div>

                            <div>
                              <span>Mobile number</span>
                              <strong>
                                {request.customerPhone ? (
                                  <a href={`tel:${request.customerPhone}`}>
                                    {request.customerPhone}
                                  </a>
                                ) : (
                                  "Not provided"
                                )}
                              </strong>
                            </div>

                            <div>
                              <span>Service</span>
                              <strong>
                                {request.serviceName || "Not provided"}
                              </strong>
                            </div>

                            <div>
                              <span>Service type</span>
                              <strong>
                                {request.serviceType || "Not provided"}
                              </strong>
                            </div>

                            <div>
                              <span>Customer issue</span>
                              <strong>
                                {request.commonIssue || "Not provided"}
                              </strong>
                            </div>

                            <div>
                              <span>Request type</span>
                              <strong>
                                {request.requestType === "callback"
                                  ? "Callback"
                                  : "Booking"}
                              </strong>
                            </div>

                            <div>
                              <span>Request submitted</span>
                              <strong>{formatDateTime(request.createdAt)}</strong>
                            </div>

                            <div>
                              <span>Accepted by</span>
                              <strong>
                                {request.assignedProfessionalName ||
                                  application.fullName}
                              </strong>
                            </div>
                          </div>

                          <div className="ph-accepted-feedback">
                            <div className="ph-accepted-feedback-heading">
                              <MessageSquareText size={17} />
                              <strong>Customer Feedback</strong>
                            </div>

                            {rating > 0 || feedback ? (
                              <>
                                {rating > 0 && (
                                  <div className="ph-accepted-rating">
                                    <span>
                                      {Array.from({ length: 5 }).map(
                                        (_, index) => (
                                          <Star
                                            key={index}
                                            size={17}
                                            fill={
                                              index < rating
                                                ? "currentColor"
                                                : "none"
                                            }
                                          />
                                        ),
                                      )}
                                    </span>
                                    <strong>{rating} / 5</strong>
                                  </div>
                                )}

                                {feedback && (
                                  <p className="ph-accepted-review-text">
                                    “{feedback}”
                                  </p>
                                )}

                                <small>
                                  Review date:{" "}
                                  {formatDate(getRequestReviewDate(request))}
                                </small>
                              </>
                            ) : (
                              <p className="ph-no-review">
                                No customer rating or written feedback has
                                been submitted for this request yet.
                              </p>
                            )}
                          </div>
                        </article>
                      );
                    })}
                </div>
              ) : (
                <div className="ph-empty-list ph-accepted-empty">
                  <div className="ph-empty-icon small">
                    <BriefcaseBusiness size={23} />
                  </div>
                  <strong>No accepted customer requests yet</strong>
                  <p>
                    Requests you accept will be listed here with their customer
                    details and feedback.
                  </p>
                </div>
              )}

              <div className="ph-accepted-dialog-footer">
                <p>
                  Ratings are calculated from customer feedback submitted
                  against these service requests.
                </p>

                <button
                  type="button"
                  className="ph-primary-button"
                  onClick={() => setShowAcceptedRequests(false)}
                >
                  Close
                </button>
              </div>
            </section>
          </div>
        )}

        {/* FOOTER */}
        <footer className="ph-footer">
          <span>
            <ShieldCheck size={15} />
            NeedOneService Professional Workspace
          </span>

          <span>Application ID: {application.id}</span>

          <button
            type="button"
            className="ph-remove-account-button"
            onClick={() => {
              setRemoveError("");
              setShowRemoveConfirmation(true);
            }}
          >
            <Trash2 size={16} />
            Remove Account
          </button>
        </footer>
      </div>

      {/* REMOVE ACCOUNT CONFIRMATION */}
      {showRemoveConfirmation && (
        <div
          className="ph-remove-overlay"
          role="presentation"
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget &&
              !removingAccount
            ) {
              setShowRemoveConfirmation(false);
              setRemoveError("");
            }
          }}
        >
          <section
            className="ph-remove-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="ph-remove-title"
            aria-describedby="ph-remove-description"
          >
            <div className="ph-remove-dialog-icon">
              <Trash2 size={24} />
            </div>

            <button
              type="button"
              className="ph-remove-dialog-close"
              aria-label="Close confirmation"
              disabled={removingAccount}
              onClick={() => {
                setShowRemoveConfirmation(false);
                setRemoveError("");
              }}
            >
              <X size={19} />
            </button>

            <h2 id="ph-remove-title">
              Remove Professional Account?
            </h2>

            <p id="ph-remove-description">
              This will remove your saved professional application, demo job
              history, service pricing and availability settings from this
              browser. Your customer service request history and notifications
              will not be deleted.
            </p>

            {removeError && (
              <p className="ph-remove-error" role="alert">
                {removeError}
              </p>
            )}

            <div className="ph-remove-dialog-actions">
              <button
                type="button"
                className="ph-secondary-button"
                disabled={removingAccount}
                onClick={() => {
                  setShowRemoveConfirmation(false);
                  setRemoveError("");
                }}
              >
                Keep Account
              </button>

              <button
                type="button"
                className="ph-remove-confirm-button"
                disabled={removingAccount}
                onClick={removeAccount}
              >
                <Trash2 size={16} />
                {removingAccount ? "Removing..." : "Remove Account"}
              </button>
            </div>

            <small className="ph-remove-dialog-note">
              This action cannot be undone from this browser.
            </small>
          </section>
        </div>
      )}
    </main>
  );
}
