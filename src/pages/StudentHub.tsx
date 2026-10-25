
import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    ArrowRight,
    BadgeCheck,
    BookOpen,
    CalendarDays,
    CheckCircle2,
    ChevronRight,
    CircleHelp,
    Clock3,
    FileCheck2,
    FileText,
    GraduationCap,
    Languages,
    LogOut,
    MapPin,
    Pencil,
    Save,
    ShieldCheck,
    Sparkles,
    Target,
    Trash2,
    UserRound,
    UsersRound,
    WalletCards,
    X,
} from "lucide-react";
import "./StudentHub.css";

type StudentApplication = {
    [key: string]: unknown;
    fullName?: string;
    name?: string;
    firstName?: string;
    lastName?: string;
    mobile?: string;
    phone?: string;
    phoneNumber?: string;
    whatsapp?: string;
    email?: string;
    dob?: string;
    gender?: string;
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
    postalCode?: string;
    educationLevel?: string;
    institution?: string;
    college?: string;
    school?: string;
    course?: string;
    fieldOfStudy?: string;
    specialization?: string;
    currentYear?: string | number;
    graduationYear?: string | number;
    studentId?: string;
    interestedAreas?: string[] | string;
    skills?: string[] | string;
    experienceLevel?: string;
    preferredLanguage?: string;
    learningGoals?: string[] | string;
    learningMode?: string;
    preferredMode?: string;
    learningFormat?: string;
    preferredDays?: string[] | string;
    preferredTime?: string;
    availability?: string;
    weeklyHours?: string | number;
    careerGoal?: string;
    certificationInterest?: string;
    additionalDetails?: string;
    resumeFileName?: string;
    studentProofFileName?: string;
    profilePhotoName?: string;
    applicationStatus?: string;
    status?: string;
    createdAt?: string;
    updatedAt?: string;
};

type FieldDefinition = {
    key: string;
    label: string;
    multiline?: boolean;
    hint?: string;
};

type SectionDefinition = {
    id: string;
    title: string;
    description: string;
    fields: FieldDefinition[];
};

const STORAGE_KEYS = [
    "oneservice_student_application",
    "oneservice_student",
];

const EDIT_SECTIONS: SectionDefinition[] = [
    {
        id: "personal",
        title: "Personal Information",
        description: "Update your name and contact information.",
        fields: [
            { key: "fullName", label: "Full name" },
            { key: "mobile", label: "Mobile number", hint: "Enter your 10-digit mobile number" },
            { key: "whatsapp", label: "WhatsApp number" },
            { key: "email", label: "Email address" },
            { key: "dob", label: "Date of birth", hint: "YYYY-MM-DD" },
            { key: "gender", label: "Gender" },
            { key: "address", label: "Full address", multiline: true },
            { key: "city", label: "City" },
            { key: "state", label: "State" },
            { key: "pincode", label: "PIN code" },
        ],
    },
    {
        id: "education",
        title: "Education Details",
        description: "Update your academic background and institution details.",
        fields: [
            { key: "educationLevel", label: "Education level" },
            { key: "institution", label: "School / college / institution" },
            { key: "course", label: "Course / program" },
            { key: "specialization", label: "Specialization" },
            { key: "currentYear", label: "Current year / semester" },
            { key: "graduationYear", label: "Graduation / completion year" },
            { key: "studentId", label: "Student ID" },
        ],
    },
    {
        id: "skills",
        title: "Skills & Interests",
        description: "Describe your current skills, experience, and areas of interest.",
        fields: [
            { key: "skills", label: "Skills", multiline: true, hint: "Separate multiple skills with commas" },
            { key: "interestedAreas", label: "Interested areas", multiline: true, hint: "Separate areas with commas" },
            { key: "experienceLevel", label: "Experience level" },
            { key: "preferredLanguage", label: "Preferred language" },
        ],
    },
    {
        id: "learning",
        title: "Learning Preferences",
        description: "Update your learning goals, schedule, and career interests.",
        fields: [
            { key: "learningGoals", label: "Learning goals", multiline: true, hint: "Separate multiple goals with commas" },
            { key: "learningFormat", label: "Learning format" },
            { key: "preferredMode", label: "Preferred learning mode" },
            { key: "preferredDays", label: "Preferred learning days", multiline: true, hint: "Separate days with commas" },
            { key: "preferredTime", label: "Preferred time" },
            { key: "availability", label: "Availability", multiline: true },
            { key: "weeklyHours", label: "Weekly learning hours" },
            { key: "careerGoal", label: "Career goal", multiline: true },
            { key: "certificationInterest", label: "Certification interest" },
            { key: "additionalDetails", label: "Additional information", multiline: true },
        ],
    },
];

function readStudentApplication(): StudentApplication | null {
    if (typeof window === "undefined") return null;

    for (const key of STORAGE_KEYS) {
        try {
            const stored = localStorage.getItem(key);
            if (!stored) continue;

            const parsed: unknown = JSON.parse(stored);

            if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
                const record = parsed as StudentApplication;

                if (
                    record.fullName ||
                    record.name ||
                    record.firstName ||
                    record.email ||
                    record.mobile ||
                    record.phone ||
                    record.educationLevel
                ) {
                    return record;
                }
            }
        } catch {
            // Check the other saved record if this one is malformed.
        }
    }

    return null;
}

function getText(value: unknown, fallback = ""): string {
    if (typeof value === "string" && value.trim()) return value.trim();
    if (typeof value === "number") return String(value);
    return fallback;
}

function getList(value: unknown): string[] {
    if (Array.isArray(value)) {
        return value
            .filter((item): item is string => typeof item === "string")
            .map((item) => item.trim())
            .filter(Boolean);
    }

    if (typeof value === "string" && value.trim()) {
        return value.split(/[,;\n]/).map((item) => item.trim()).filter(Boolean);
    }

    return [];
}

function getStudentName(student: StudentApplication): string {
    const fullName = getText(student.fullName || student.name);
    if (fullName) return fullName;

    return [
        getText(student.firstName),
        getText(student.lastName),
    ].filter(Boolean).join(" ") || "Student";
}

function formatDate(value: unknown): string {
    const dateString = getText(value);
    if (!dateString) return "Not available";

    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return dateString;

    return new Intl.DateTimeFormat("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    }).format(date);
}

function getStatus(status: unknown): string {
    return getText(status, "Submitted")
        .replace(/[-_]/g, " ")
        .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function getProfileCompletion(student: StudentApplication): number {
    const checks: unknown[] = [
        student.fullName || student.name || student.firstName,
        student.mobile || student.phone || student.phoneNumber,
        student.email,
        student.address,
        student.city,
        student.educationLevel,
        student.institution || student.college || student.school,
        student.skills,
        student.learningGoals,
    ];

    const completed = checks.filter((value) => {
        if (Array.isArray(value)) return value.length > 0;
        return value !== undefined && value !== null && String(value).trim() !== "";
    }).length;

    return Math.round((completed / checks.length) * 100);
}

function InfoItem({
    label,
    value,
    icon,
}: {
    label: string;
    value: string;
    icon: ReactNode;
}) {
    return (
        <div className="sh-info-item">
            <span className="sh-info-icon">{icon}</span>
            <div className="sh-info-copy">
                <span className="sh-info-label">{label}</span>
                <span className="sh-info-value">{value || "Not provided"}</span>
            </div>
        </div>
    );
}

function SectionHeading({
    eyebrow,
    title,
    description,
    icon,
}: {
    eyebrow: string;
    title: string;
    description: string;
    icon: ReactNode;
}) {
    return (
        <div className="sh-section-heading">
            <span className="sh-section-icon">{icon}</span>
            <div>
                <span className="sh-eyebrow">{eyebrow}</span>
                <h2>{title}</h2>
                <p>{description}</p>
            </div>
        </div>
    );
}

function getFieldValue(student: StudentApplication, key: string): string {
    if (key === "fullName") return getStudentName(student);

    if (key === "mobile") {
        return getText(student.mobile || student.phone || student.phoneNumber);
    }

    if (key === "address") return getText(student.address);
    if (key === "pincode") return getText(student.pincode || student.postalCode);

    if (key === "institution") {
        return getText(student.institution || student.college || student.school);
    }

    if (key === "course") {
        return getText(student.course || student.fieldOfStudy);
    }

    if (key === "skills" || key === "interestedAreas" || key === "learningGoals" || key === "preferredDays") {
        return getList(student[key]).join(", ");
    }

    if (key === "preferredMode") {
        return getText(student.preferredMode || student.learningMode);
    }

    return getText(student[key]);
}

function EditField({
    field,
    value,
    onChange,
}: {
    field: FieldDefinition;
    value: string;
    onChange: (value: string) => void;
}) {
    const id = `sh-edit-${field.key}`;

    return (
        <label className={`sh-edit-field${field.multiline ? " sh-edit-field-full" : ""}`} htmlFor={id}>
            <span>{field.label}</span>
            {field.multiline ? (
                <textarea
                    id={id}
                    value={value}
                    rows={3}
                    placeholder={field.hint || `Enter ${field.label.toLowerCase()}`}
                    onChange={(event) => onChange(event.target.value)}
                />
            ) : (
                <input
                    id={id}
                    value={value}
                    placeholder={field.hint || `Enter ${field.label.toLowerCase()}`}
                    onChange={(event) => onChange(event.target.value)}
                />
            )}
            {field.hint && field.multiline && <small>{field.hint}</small>}
        </label>
    );
}

export default function StudentHub() {
    const navigate = useNavigate();

    const [student, setStudent] = useState<StudentApplication | null>(() => readStudentApplication());
    const [activeEdit, setActiveEdit] = useState<string | null>(null);
    const [draft, setDraft] = useState<StudentApplication>({});
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState("");
    const [saveSuccess, setSaveSuccess] = useState("");
    const [showRemoveModal, setShowRemoveModal] = useState(false);
    const [isRemoving, setIsRemoving] = useState(false);

    const refreshStudent = useCallback(() => {
        setStudent(readStudentApplication());
    }, []);

    useEffect(() => {
        window.addEventListener("oneservice-student-change", refreshStudent);
        window.addEventListener("storage", refreshStudent);

        return () => {
            window.removeEventListener("oneservice-student-change", refreshStudent);
            window.removeEventListener("storage", refreshStudent);
        };
    }, [refreshStudent]);

    const openEdit = useCallback((sectionId: string) => {
        const current = readStudentApplication();
        if (!current) return;

        setDraft({ ...current });
        setSaveError("");
        setSaveSuccess("");
        setActiveEdit(sectionId);
    }, []);

    const closeEdit = useCallback(() => {
        if (isSaving) return;
        setActiveEdit(null);
        setSaveError("");
        setSaveSuccess("");
    }, [isSaving]);

    const updateDraftField = (key: string, value: string) => {
        setDraft((previous) => ({ ...previous, [key]: value }));
    };

    const saveEdits = () => {
        if (!activeEdit) return;

        setIsSaving(true);
        setSaveError("");

        try {
            const current = readStudentApplication() || {};
            const section = EDIT_SECTIONS.find((item) => item.id === activeEdit);
            const fields = activeEdit === "all"
                ? EDIT_SECTIONS.flatMap((item) => item.fields)
                : section?.fields ?? [];

            const updated: StudentApplication = { ...current };

            fields.forEach(({ key }) => {
                const value = draft[key];

                // Keep multi-value fields compatible with the registration form.
                if (
                    ["skills", "interestedAreas", "learningGoals", "preferredDays"].includes(key)
                ) {
                    const values = getList(value);
                    updated[key] = Array.isArray(current[key]) ? values : values.join(", ");
                } else {
                    updated[key] = typeof value === "string" ? value.trim() : value;
                }
            });

            // Keep commonly used alias fields in sync.
            if (fields.some((field) => field.key === "fullName")) {
                updated.fullName = getText(draft.fullName);
                updated.name = updated.fullName;
                delete updated.firstName;
                delete updated.lastName;
            }

            if (fields.some((field) => field.key === "mobile")) {
                updated.mobile = getText(draft.mobile);
                updated.phone = updated.mobile;
                updated.phoneNumber = updated.mobile;
            }

            if (fields.some((field) => field.key === "pincode")) {
                updated.pincode = getText(draft.pincode);
                updated.postalCode = updated.pincode;
            }

            if (fields.some((field) => field.key === "institution")) {
                updated.institution = getText(draft.institution);
                updated.college = updated.institution;
                updated.school = updated.institution;
            }

            if (fields.some((field) => field.key === "course")) {
                updated.course = getText(draft.course);
                updated.fieldOfStudy = updated.course;
            }

            if (fields.some((field) => field.key === "preferredMode")) {
                updated.preferredMode = getText(draft.preferredMode);
                updated.learningMode = updated.preferredMode;
            }

            updated.updatedAt = new Date().toISOString();

            const serialized = JSON.stringify(updated);

            STORAGE_KEYS.forEach((key) => {
                localStorage.setItem(key, serialized);
            });

            setStudent(updated);
            setDraft(updated);
            window.dispatchEvent(new Event("oneservice-student-change"));
            window.dispatchEvent(new Event("storage"));

            setSaveSuccess("Your student details have been saved.");
            setActiveEdit(null);
        } catch (error) {
            console.error("Unable to save student details:", error);
            setSaveError("Unable to save your changes. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleRemoveAccount = () => {
        setIsRemoving(true);

        try {
            STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));
            window.dispatchEvent(new Event("oneservice-student-change"));
            setShowRemoveModal(false);
            navigate("/profile", { replace: true });
        } catch (error) {
            console.error("Unable to remove locally saved student data:", error);
            window.alert("We could not remove the saved student data. Please try again.");
        } finally {
            setIsRemoving(false);
        }
    };

    const profile = useMemo(() => {
        if (!student) return null;

        return {
            name: getStudentName(student),
            mobile: getText(student.mobile || student.phone || student.phoneNumber, "Not provided"),
            email: getText(student.email, "Not provided"),
            address: [
                getText(student.address),
                getText(student.city),
                getText(student.state),
                getText(student.pincode || student.postalCode),
            ].filter(Boolean).join(", "),
            city: getText(student.city, "Location not provided"),
            state: getText(student.state),
            educationLevel: getText(student.educationLevel, "Not provided"),
            institution: getText(student.institution || student.college || student.school, "Not provided"),
            course: getText(student.course || student.fieldOfStudy, "Not provided"),
            currentYear: getText(student.currentYear, "Not provided"),
            graduationYear: getText(student.graduationYear, "Not provided"),
            studentId: getText(student.studentId, "Not assigned"),
            skills: getList(student.skills),
            interests: getList(student.interestedAreas),
            goals: getList(student.learningGoals),
            experience: getText(student.experienceLevel, "Not provided"),
            language: getText(student.preferredLanguage, "Not provided"),
            learningMode: getText(student.preferredMode || student.learningMode, "Not provided"),
            availability: getText(student.availability, "Not provided"),
            weeklyHours: getText(student.weeklyHours, "Not provided"),
            additionalDetails: getText(student.additionalDetails),
            resume: getText(student.resumeFileName),
            studentProof: getText(student.studentProofFileName),
            profilePhoto: getText(student.profilePhotoName),
            status: getStatus(student.applicationStatus || student.status),
            createdAt: formatDate(student.createdAt),
            updatedAt: formatDate(student.updatedAt),
            completion: getProfileCompletion(student),
        };
    }, [student]);

    const activeSection = activeEdit === "all"
        ? null
        : EDIT_SECTIONS.find((section) => section.id === activeEdit);

    const fieldsToShow = activeEdit === "all"
        ? EDIT_SECTIONS
        : activeSection
            ? [activeSection]
            : [];

    const hasDocuments = Boolean(profile?.resume || profile?.studentProof || profile?.profilePhoto);

    if (!student || !profile) {
        return (
            <main className="student-hub-page">
                <div className="sh-empty-shell">
                    <Link to="/profile" className="sh-back-link">
                        <ArrowLeft size={17} />
                        Back to Profile
                    </Link>
                    <div className="sh-empty-card">
                        <span className="sh-empty-icon"><GraduationCap size={36} /></span>
                        <span className="sh-eyebrow">STUDENT PORTAL</span>
                        <h1>Your student hub starts here</h1>
                        <p>
                            We couldn't find saved student registration details.
                            Complete your student registration to see your education
                            profile, skills, and learning preferences here.
                        </p>
                        <Link to="/student-register" className="sh-primary-btn">
                            Complete Registration <ArrowRight size={18} />
                        </Link>
                        <Link to="/profile" className="sh-secondary-link">Return to Profile</Link>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="student-hub-page">
            <div className="sh-container">
                <div className="sh-topbar">
                    <Link to="/profile" className="sh-back-link">
                        <ArrowLeft size={17} /> My Profile
                    </Link>
                    <button type="button" className="sh-top-edit" onClick={() => openEdit("all")}>
                        <Pencil size={15} /> Edit Details
                    </button>
                </div>

                <section className="sh-welcome-banner">
                    <div className="sh-welcome-content">
                        <span className="sh-welcome-tag">
                            <Sparkles size={14} /> YOUR STUDENT SPACE
                        </span>
                        <h1>Welcome back,<br /><span>{profile.name}</span></h1>
                        <p>Keep your student profile up to date and make your learning preferences easy to manage.</p>
                        <div className="sh-welcome-actions">
                            <button type="button" className="sh-banner-btn" onClick={() => openEdit("all")}>
                                Update My Details <ArrowRight size={17} />
                            </button>
                            <a href="#sh-profile" className="sh-banner-text-link">View my profile</a>
                        </div>
                    </div>
                    <div className="sh-welcome-art" aria-hidden="true">
                        <div className="sh-art-orbit sh-art-orbit-one" />
                        <div className="sh-art-orbit sh-art-orbit-two" />
                        <div className="sh-art-circle"><GraduationCap size={70} strokeWidth={1.5} /></div>
                        <span className="sh-art-float sh-art-float-one"><BookOpen size={22} /></span>
                        <span className="sh-art-float sh-art-float-two"><Target size={22} /></span>
                        <span className="sh-art-float sh-art-float-three"><Sparkles size={20} /></span>
                    </div>
                </section>

                {saveSuccess && (
                    <div className="sh-save-notice" role="status">
                        <CheckCircle2 size={18} /> {saveSuccess}
                        <button type="button" aria-label="Dismiss notification" onClick={() => setSaveSuccess("")}><X size={16} /></button>
                    </div>
                )}

                <section className="sh-overview-grid" aria-label="Student overview">
                    <article className="sh-overview-card sh-completion-card">
                        <div className="sh-overview-top">
                            <span className="sh-overview-icon"><UserRound size={20} /></span>
                            <span className="sh-card-caption">PROFILE</span>
                        </div>
                        <div className="sh-completion-value">{profile.completion}%</div>
                        <p>Profile completion</p>
                        <div className="sh-progress-track" role="progressbar" aria-label="Profile completion" aria-valuemin={0} aria-valuemax={100} aria-valuenow={profile.completion}>
                            <span style={{ width: `${profile.completion}%` }} />
                        </div>
                        <span className="sh-small-note">{profile.completion === 100 ? "Your key details are complete." : "Add missing details to complete your profile."}</span>
                    </article>

                    <article className="sh-overview-card">
                        <div className="sh-overview-top">
                            <span className="sh-overview-icon sh-purple-icon"><GraduationCap size={20} /></span>
                            <span className="sh-card-caption">EDUCATION</span>
                        </div>
                        <h3 className="sh-overview-main-text">{profile.educationLevel}</h3>
                        <p>Current education level</p>
                        <span className="sh-overview-footer"><BookOpen size={15} /> {profile.course}</span>
                    </article>

                    <article className="sh-overview-card">
                        <div className="sh-overview-top">
                            <span className="sh-overview-icon sh-green-icon"><ShieldCheck size={20} /></span>
                            <span className="sh-card-caption">REGISTRATION</span>
                        </div>
                        <h3 className="sh-overview-main-text sh-status-text">{profile.status}</h3>
                        <p>Student registration status</p>
                        <span className="sh-overview-footer"><CalendarDays size={15} /> Submitted: {profile.createdAt}</span>
                    </article>
                </section>

                <div className="sh-content-grid">
                    <div className="sh-main-column">
                        <section className="sh-section-card" id="sh-profile">
                            <SectionHeading eyebrow="YOUR DETAILS" title="Personal Information" description="Your basic contact and location information." icon={<UserRound size={21} />} />
                            <div className="sh-info-grid">
                                <InfoItem label="Full name" value={profile.name} icon={<UserRound size={18} />} />
                                <InfoItem label="Mobile number" value={profile.mobile} icon={<UsersRound size={18} />} />
                                <InfoItem label="Email address" value={profile.email} icon={<FileText size={18} />} />
                                <InfoItem label="City" value={profile.city} icon={<MapPin size={18} />} />
                                <InfoItem label="State" value={profile.state || "Not provided"} icon={<MapPin size={18} />} />
                                <InfoItem label="Full address" value={profile.address || "Not provided"} icon={<MapPin size={18} />} />
                            </div>
                            <button type="button" className="sh-section-action" onClick={() => openEdit("personal")}>
                                Edit personal details <ChevronRight size={17} />
                            </button>
                        </section>

                        <section className="sh-section-card">
                            <SectionHeading eyebrow="ACADEMIC BACKGROUND" title="Education Details" description="Your current studies and academic information." icon={<GraduationCap size={21} />} />
                            <div className="sh-education-panel">
                                <span className="sh-education-icon"><GraduationCap size={29} /></span>
                                <div className="sh-education-main">
                                    <span className="sh-education-label">EDUCATION LEVEL</span>
                                    <h3>{profile.educationLevel}</h3>
                                    <p>{profile.institution}</p>
                                </div>
                                <span className="sh-academic-chip">{profile.currentYear !== "Not provided" ? profile.currentYear : "Student"}</span>
                            </div>
                            <div className="sh-info-grid sh-education-details">
                                <InfoItem label="Course / Field of study" value={profile.course} icon={<BookOpen size={18} />} />
                                <InfoItem label="Current year" value={profile.currentYear} icon={<CalendarDays size={18} />} />
                                <InfoItem label="Expected graduation" value={profile.graduationYear} icon={<CalendarDays size={18} />} />
                                <InfoItem label="Student ID" value={profile.studentId} icon={<BadgeCheck size={18} />} />
                            </div>
                            <button type="button" className="sh-section-action" onClick={() => openEdit("education")}>
                                Update education <ChevronRight size={17} />
                            </button>
                        </section>

                        <section className="sh-section-card">
                            <SectionHeading eyebrow="GROW YOUR POTENTIAL" title="Skills & Interests" description="The skills and areas you are interested in developing." icon={<Sparkles size={21} />} />
                            <div className="sh-tag-section">
                                <h3>Skills</h3>
                                {profile.skills.length > 0 ? (
                                    <div className="sh-tag-list">
                                        {profile.skills.map((skill, index) => (
                                            <span className="sh-tag sh-skill-tag" key={`${skill}-${index}`}><CheckCircle2 size={14} /> {skill}</span>
                                        ))}
                                    </div>
                                ) : <p className="sh-muted-message">No skills added yet. Use Edit to add your skills.</p>}
                            </div>
                            <div className="sh-tag-section">
                                <h3>Interested areas</h3>
                                {profile.interests.length > 0 ? (
                                    <div className="sh-tag-list">
                                        {profile.interests.map((interest, index) => (
                                            <span className="sh-tag sh-interest-tag" key={`${interest}-${index}`}>{interest}</span>
                                        ))}
                                    </div>
                                ) : <p className="sh-muted-message">No interests added yet.</p>}
                            </div>
                            <div className="sh-info-grid sh-skills-details">
                                <InfoItem label="Experience level" value={profile.experience} icon={<Sparkles size={18} />} />
                                <InfoItem label="Preferred language" value={profile.language} icon={<Languages size={18} />} />
                            </div>
                            <button type="button" className="sh-section-action" onClick={() => openEdit("skills")}>
                                Update skills and interests <ChevronRight size={17} />
                            </button>
                        </section>

                        <section className="sh-section-card">
                            <SectionHeading eyebrow="YOUR LEARNING JOURNEY" title="Learning Preferences" description="How you prefer to learn and plan your time." icon={<Target size={21} />} />
                            <div className="sh-preference-grid">
                                <div className="sh-preference-card">
                                    <span className="sh-preference-icon"><Target size={20} /></span>
                                    <h3>Learning goals</h3>
                                    {profile.goals.length > 0 ? (
                                        <ul className="sh-goal-list">
                                            {profile.goals.map((goal, index) => <li key={`${goal}-${index}`}><CheckCircle2 size={15} /> {goal}</li>)}
                                        </ul>
                                    ) : <p>Not provided</p>}
                                </div>
                                <div className="sh-preference-card">
                                    <span className="sh-preference-icon sh-preference-icon-purple"><BookOpen size={20} /></span>
                                    <h3>Learning mode</h3><p>{profile.learningMode}</p>
                                </div>
                                <div className="sh-preference-card">
                                    <span className="sh-preference-icon sh-preference-icon-green"><CalendarDays size={20} /></span>
                                    <h3>Availability</h3><p>{profile.availability}</p>
                                </div>
                                <div className="sh-preference-card">
                                    <span className="sh-preference-icon sh-preference-icon-orange"><Clock3 size={20} /></span>
                                    <h3>Weekly learning hours</h3>
                                    <p>{profile.weeklyHours === "Not provided" ? profile.weeklyHours : `${profile.weeklyHours} hours`}</p>
                                </div>
                            </div>
                            {profile.additionalDetails && (
                                <div className="sh-additional-details">
                                    <strong>Additional information</strong><p>{profile.additionalDetails}</p>
                                </div>
                            )}
                            <button type="button" className="sh-section-action" onClick={() => openEdit("learning")}>
                                Update learning preferences <ChevronRight size={17} />
                            </button>
                        </section>
                    </div>

                    <aside className="sh-side-column">
                        <section className="sh-side-card sh-registration-card">
                            <div className="sh-side-heading"><span className="sh-side-icon"><FileCheck2 size={20} /></span><h2>Registration Summary</h2></div>
                            <div className="sh-summary-row"><span>Application status</span><strong className="sh-summary-status">{profile.status}</strong></div>
                            <div className="sh-summary-row"><span>Registration date</span><strong>{profile.createdAt}</strong></div>
                            <div className="sh-summary-row"><span>Last updated</span><strong>{profile.updatedAt}</strong></div>
                            <div className="sh-summary-note"><ShieldCheck size={18} /><p>Your displayed status reflects the registration data saved in your account.</p></div>
                        </section>

                        <section className="sh-side-card">
                            <div className="sh-side-heading"><span className="sh-side-icon sh-doc-icon"><WalletCards size={20} /></span><h2>My Documents</h2></div>
                            {hasDocuments ? (
                                <div className="sh-document-list">
                                    {profile.profilePhoto && <div className="sh-document-item"><span className="sh-document-icon"><UserRound size={18} /></span><div><strong>Profile photo</strong><span>{profile.profilePhoto}</span></div></div>}
                                    {profile.resume && <div className="sh-document-item"><span className="sh-document-icon"><FileText size={18} /></span><div><strong>Resume</strong><span>{profile.resume}</span></div></div>}
                                    {profile.studentProof && <div className="sh-document-item"><span className="sh-document-icon"><FileCheck2 size={18} /></span><div><strong>Student proof</strong><span>{profile.studentProof}</span></div></div>}
                                </div>
                            ) : (
                                <div className="sh-no-documents"><FileText size={25} /><p>No document filenames are available.</p><span>If you uploaded documents, ensure the registration form saves their filenames.</span></div>
                            )}
                            <button type="button" className="sh-section-action" onClick={() => openEdit("all")}>
                                Manage registration details <ChevronRight size={17} />
                            </button>
                        </section>

                        <section className="sh-help-card">
                            <span className="sh-help-icon"><CircleHelp size={24} /></span>
                            <h2>Need a little help?</h2>
                            <p>Keep your information accurate so your student profile reflects your current needs.</p>
                            <Link to="/contact" className="sh-help-link">Contact Support <ArrowRight size={16} /></Link>
                        </section>

                        <section className="sh-account-card">
                            <div className="sh-side-heading"><span className="sh-account-icon"><UserRound size={20} /></span><h2>Account & Settings</h2></div>
                            <Link to="/profile" className="sh-account-action"><UserRound size={17} /><span>Go to main profile</span><ChevronRight size={16} /></Link>
                            <button type="button" className="sh-account-action" onClick={() => navigate("/login")}><LogOut size={17} /><span>Go to Login</span><ChevronRight size={16} /></button>
                            <button type="button" className="sh-account-action sh-remove-action" onClick={() => setShowRemoveModal(true)}><Trash2 size={17} /><span>Remove Account</span><ChevronRight size={16} /></button>
                            <p className="sh-remove-caption">Removes the student registration data saved on this device.</p>
                        </section>
                    </aside>
                </div>

                <footer className="sh-footer">
                    <span>NeedOneService Student Hub</span>
                    <span>One Service. One Call Away.</span>
                </footer>
            </div>

            {activeEdit && (
                <div
                    className="sh-modal-backdrop sh-edit-backdrop"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) closeEdit();
                    }}
                >
                    <section
                        className={`sh-edit-modal${activeEdit === "all" ? " sh-edit-modal-large" : " sh-edit-modal-compact"}`}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="sh-edit-modal-title"
                    >
                        <header className="sh-edit-modal-header">
                            <div>
                                <span className="sh-eyebrow">{activeEdit === "all" ? "STUDENT PROFILE" : "EDIT YOUR DETAILS"}</span>
                                <h2 id="sh-edit-modal-title">{activeEdit === "all" ? "Edit Student Details" : activeSection?.title}</h2>
                                <p>{activeEdit === "all" ? "Update your information in one place. Choose Save Changes when you're done." : activeSection?.description}</p>
                            </div>
                            <button type="button" className="sh-modal-close" aria-label="Close edit modal" onClick={closeEdit} disabled={isSaving}>
                                <X size={19} />
                            </button>
                        </header>

                        <div className="sh-edit-modal-body">
                            {fieldsToShow.map((section) => (
                                <section className="sh-edit-group" key={section.id}>
                                    {activeEdit === "all" && (
                                        <div className="sh-edit-group-heading">
                                            <span>{section.title}</span>
                                            <button type="button" onClick={() => openEdit(section.id)}>
                                                Edit section <Pencil size={13} />
                                            </button>
                                        </div>
                                    )}
                                    <div className="sh-edit-fields-grid">
                                        {section.fields.map((field) => (
                                            <EditField
                                                key={field.key}
                                                field={field}
                                                value={getFieldValue(draft, field.key)}
                                                onChange={(value) => updateDraftField(field.key, value)}
                                            />
                                        ))}
                                    </div>
                                </section>
                            ))}

                            {saveError && <p className="sh-edit-error" role="alert">{saveError}</p>}
                        </div>

                        <footer className="sh-edit-modal-footer">
                            <span className="sh-edit-save-hint"><ShieldCheck size={15} /> Changes are saved in this browser.</span>
                            <div className="sh-modal-actions">
                                <button type="button" className="sh-cancel-btn" onClick={closeEdit} disabled={isSaving}>Cancel</button>
                                <button type="button" className="sh-save-btn" onClick={saveEdits} disabled={isSaving}>
                                    {isSaving ? <><Clock3 size={16} /> Saving...</> : <><Save size={16} /> Save Changes</>}
                                </button>
                            </div>
                        </footer>
                    </section>
                </div>
            )}

            {showRemoveModal && (
                <div
                    className="sh-modal-backdrop"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget && !isRemoving) setShowRemoveModal(false);
                    }}
                >
                    <section className="sh-confirm-modal" role="dialog" aria-modal="true" aria-labelledby="sh-remove-title">
                        <button type="button" className="sh-modal-close" aria-label="Close confirmation" onClick={() => setShowRemoveModal(false)} disabled={isRemoving}><X size={19} /></button>
                        <span className="sh-delete-illustration"><Trash2 size={27} /></span>
                        <span className="sh-eyebrow">ACCOUNT SETTINGS</span>
                        <h2 id="sh-remove-title">Remove student account?</h2>
                        <p>This will delete the student registration data stored in this browser and return you to your main profile. This action cannot be undone from this page.</p>
                        <div className="sh-modal-actions">
                            <button type="button" className="sh-cancel-btn" onClick={() => setShowRemoveModal(false)} disabled={isRemoving}>Keep Account</button>
                            <button type="button" className="sh-confirm-delete-btn" onClick={handleRemoveAccount} disabled={isRemoving}>
                                <Trash2 size={16} /> {isRemoving ? "Removing..." : "Remove Account"}
                            </button>
                        </div>
                    </section>
                </div>
            )}
        </main>
    );
}
