
import { useEffect, useMemo, useState } from "react";
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
  FileText,
  MapPin,
  MessageSquareText,
  Pencil,
  Phone,
  Power,
  Save,
  ShieldCheck,
  Star,
  Trash2,
  UserRound,
  Wallet,
  Wrench,
  X,
  XCircle,
} from "lucide-react";
import "./ProfessionalHub.css";

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

type Feedback = {
  id: number;
  customer: string;
  service: string;
  rating: number;
  comment: string;
  date: string;
};

const APPLICATION_KEY = "oneservice_professional_application";
const JOBS_KEY = "oneservice_professional_job_requests";
const AVAILABILITY_KEY = "oneservice_professional_accepting_calls";

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

const EMPTY_FEEDBACK: Feedback[] = [];

function readApplication(): ProfessionalApplication | null {
  try {
    const stored = localStorage.getItem(APPLICATION_KEY);
    if (!stored) return null;

    const parsed = JSON.parse(stored) as ProfessionalApplication;
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

function getInitialAvailability() {
  try {
    return localStorage.getItem(AVAILABILITY_KEY) !== "false";
  } catch {
    return true;
  }
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

export default function ProfessionalHub() {
  const navigate = useNavigate();

  const [application, setApplication] =
    useState<ProfessionalApplication | null>(null);
  const [jobs, setJobs] = useState<JobRequest[]>(INITIAL_JOBS);
  const [acceptingCalls, setAcceptingCalls] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [activePeriod, setActivePeriod] = useState<"week" | "month">("week");
  const [showRemoveConfirmation, setShowRemoveConfirmation] = useState(false);
  const [removingAccount, setRemovingAccount] = useState(false);
  const [removeError, setRemoveError] = useState("");

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

  useEffect(() => {
    const loadApplication = () => {
      const saved = readApplication();
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
      }
    };

    loadApplication();
    setJobs(readJobs());
    setAcceptingCalls(getInitialAvailability());

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
    };

    const onProfessionalChange = () => loadApplication();

    window.addEventListener("storage", onStorage);
    window.addEventListener(
      "oneservice-professional-change",
      onProfessionalChange
    );

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(
        "oneservice-professional-change",
        onProfessionalChange
      );
    };
  }, []);

  const applicationApproved =
    application?.status?.toLowerCase() === "approved";

  const displayName = application?.fullName || "Professional";
  const displayCategory =
    application?.category || "Professional service provider";
  const displayLocation = [application?.city, application?.state]
    .filter(Boolean)
    .join(", ");

  const newJobs = useMemo(
    () => jobs.filter((job) => job.status === "new"),
    [jobs]
  );

  const acceptedJobs = useMemo(
    () => jobs.filter((job) => job.status === "accepted"),
    [jobs]
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
        : "Availability paused. New requests are paused locally."
    );
  };

  const updateJob = (jobId: number, status: JobRequest["status"]) => {
    if (status === "accepted" && !acceptingCalls) {
      setActionMessage("Turn on availability before accepting a request.");
      return;
    }

    if (status === "accepted" && !applicationApproved) {
      setActionMessage(
        "Your professional account must be approved before accepting customer requests."
      );
      return;
    }

    const updated = jobs.map((job) =>
      job.id === jobId ? { ...job, status } : job
    );

    setJobs(updated);
    setActionMessage(
      status === "accepted"
        ? "Request accepted locally. Customer contact and booking confirmation require backend integration."
        : "Request declined locally."
    );

    try {
      localStorage.setItem(JOBS_KEY, JSON.stringify(updated));
    } catch {
      setActionMessage(
        "The request changed for this session but could not be saved."
      );
    }
  };

  const saveCredentials = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaveMessage("");

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
      localStorage.setItem(
        APPLICATION_KEY,
        JSON.stringify(updatedApplication)
      );
      setApplication(updatedApplication);
      window.dispatchEvent(new Event("oneservice-professional-change"));
      setEditing(false);
      setSaveMessage("Professional credentials saved in this browser.");
    } catch {
      setSaveMessage("Unable to save changes. Please try again.");
    }
  };

  const removeAccount = () => {
    setRemoveError("");

    try {
      setRemovingAccount(true);

      // Remove only the Professional Hub's locally stored data.
      localStorage.removeItem(APPLICATION_KEY);
      localStorage.removeItem(JOBS_KEY);
      localStorage.removeItem(AVAILABILITY_KEY);

      // Notify other components, including the Profile page.
      window.dispatchEvent(new Event("oneservice-professional-change"));

      setShowRemoveConfirmation(false);

      // Return to Profile after removing the professional application.
      navigate("/profile", { replace: true });
    } catch {
      setRemoveError(
        "Unable to remove your professional account from this browser. Please try again."
      );
      setRemovingAccount(false);
    }
  };

  const feedback = EMPTY_FEEDBACK;

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
            profile and requests from one place.
          </p>
          <Link to="/register-professional" className="ph-primary-button">
            Register as a Professional <ChevronRight size={17} />
          </Link>
          <Link to="/profile" className="ph-back-link">
            <ArrowLeft size={16} /> Back to Profile
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="ph-page">
      <div className="ph-container">
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
            <div className="ph-avatar">
              <UserRound size={23} />
            </div>
          </div>
        </header>

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
                : "You can review your details while the OneService team verifies your application."}
            </p>
          </div>
          <span className="ph-status-pill">
            {applicationApproved ? "Approved" : "Pending review"}
          </span>
        </section>

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
            {acceptingCalls ? "Accepting Requests" : "Availability Paused"}
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

        <section className="ph-section">
          <div className="ph-section-heading">
            <div>
              <h2>
                <Activity size={20} /> Analytics Overview
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
              value={String(newJobs.length)}
              note="Requests awaiting your response"
              tone="blue"
            />
            <MetricCard
              icon={CheckCircle2}
              label="Accepted Jobs"
              value={String(acceptedJobs.length)}
              note="Accepted in this browser"
              tone="green"
            />
            <MetricCard
              icon={Wallet}
              label="Total Earnings"
              value="—"
              note="Awaiting verified payment data"
              tone="purple"
            />
            <MetricCard
              icon={Star}
              label="Customer Rating"
              value="—"
              note="Appears when reviews are available"
              tone="orange"
            />
          </div>
        </section>

        <div className="ph-main-grid">
          <section className="ph-panel ph-requests-panel">
            <div className="ph-panel-heading">
              <div>
                <p className="ph-eyebrow">CUSTOMER WORK</p>
                <h2>
                  Incoming Requests{" "}
                  <span className="ph-count">{newJobs.length}</span>
                </h2>
                <p>Review the service details before responding.</p>
              </div>
              <BriefcaseBusiness size={22} className="ph-heading-icon" />
            </div>

            {!acceptingCalls && (
              <div className="ph-paused-note">
                <Power size={16} />
                Availability is paused. Turn it on to accept new requests.
              </div>
            )}

            {!applicationApproved && (
              <div className="ph-review-note">
                <ShieldCheck size={17} />
                Accepting customer jobs becomes available after account approval.
              </div>
            )}

            {newJobs.length === 0 ? (
              <div className="ph-empty-list">
                <div className="ph-empty-icon small">
                  <CheckCircle2 size={23} />
                </div>
                <strong>You're all caught up</strong>
                <p>New customer requests will appear here when available.</p>
              </div>
            ) : (
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
                          <span className="ph-new-badge">New request</span>
                        </div>
                      </div>
                      <strong className="ph-estimate">{job.estimate}</strong>
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
                        <XCircle size={16} /> Decline
                      </button>
                      <button
                        type="button"
                        className="ph-primary-button"
                        onClick={() => updateJob(job.id, "accepted")}
                        disabled={!acceptingCalls || !applicationApproved}
                      >
                        <Check size={16} /> Accept Request
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {acceptedJobs.length > 0 && (
              <div className="ph-accepted-summary">
                <CheckCircle2 size={17} />
                <span>
                  {acceptedJobs.length} request(s) accepted in this browser.
                </span>
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

              <div
                className="ph-period-control"
                role="group"
                aria-label="Analytics period"
              >
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
                  <i className="ph-legend-dot blue" /> Requests
                </span>
                <span>
                  <i className="ph-legend-dot green" /> Completed jobs
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
                <MessageSquareText size={21} className="ph-heading-icon" />
              </div>

              {feedback.length === 0 ? (
                <div className="ph-feedback-empty">
                  <div className="ph-feedback-icon">
                    <Star size={22} />
                  </div>
                  <strong>Your reviews will appear here</strong>
                  <p>
                    After completed services, customer ratings and written
                    feedback will be displayed in this section.
                  </p>
                </div>
              ) : (
                <div className="ph-feedback-list">
                  {feedback.map((item) => (
                    <article className="ph-feedback-item" key={item.id}>
                      <div className="ph-feedback-item-top">
                        <strong>{item.customer}</strong>
                        <span>
                          <Star size={14} fill="currentColor" />{" "}
                          {item.rating.toFixed(1)}
                        </span>
                      </div>
                      <p>{item.comment}</p>
                      <small>
                        {item.service} · {item.date}
                      </small>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>

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
                Keep your contact details, skills and service information up to
                date.
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
                <Pencil size={16} /> Edit Credentials
              </button>
            )}
          </div>

          {saveMessage && (
            <div className="ph-save-message" role="status">
              <CheckCircle2 size={16} /> {saveMessage}
            </div>
          )}

          {editing ? (
            <form className="ph-credentials-form" onSubmit={saveCredentials}>
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
                  onClick={() => setEditing(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="ph-primary-button">
                  <Save size={16} /> Save Credentials
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

        <footer className="ph-footer">
          <span>
            <ShieldCheck size={15} /> OneService Professional Workspace
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

      {showRemoveConfirmation && (
        <div
          className="ph-remove-overlay"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !removingAccount) {
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

            <h2 id="ph-remove-title">Remove Professional Account?</h2>
            <p id="ph-remove-description">
              This will remove your saved professional application, job request
              history and availability settings from this browser. Your other
              OneService account types will not be affected.
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
