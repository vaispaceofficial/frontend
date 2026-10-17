
import { useState } from "react";
import type { ChangeEvent, FormEvent, ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Eye,
  EyeOff,
  GraduationCap,
  LockKeyhole,
  MapPin,
  ShieldCheck,
  Upload,
  UserRound,
  BookOpen,
  BriefcaseBusiness,
} from "lucide-react";
import "./TutorRegisterPage.css";

type TutorFormData = {
  fullName: string;
  profilePhoto: File | null;
  mobile: string;
  whatsapp: string;
  email: string;
  dob: string;
  gender: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  expertise: string;
  secondaryExpertise: string;
  qualification: string;
  specialization: string;
  certifications: string;
  teachingExperience: string;
  currentOccupation: string;
  previousTeachingExperience: string;
  teachingFormat: string;
  preferredMode: string;
  preferredDays: string;
  preferredTime: string;
  availability: string;
  courseTitle: string;
  courseDescription: string;
  courseLevel: string;
  courseDuration: string;
  sessionFrequency: string;
  practicalTraining: string;
  certificationProvided: string;
  qualificationProof: File | null;
  experienceProof: File | null;
  profileDocument: File | null;
  password: string;
  confirmPassword: string;
  terms: boolean;
  verificationConsent: boolean;
};

const initialForm: TutorFormData = {
  fullName: "",
  profilePhoto: null,
  mobile: "",
  whatsapp: "",
  email: "",
  dob: "",
  gender: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  expertise: "",
  secondaryExpertise: "",
  qualification: "",
  specialization: "",
  certifications: "",
  teachingExperience: "",
  currentOccupation: "",
  previousTeachingExperience: "",
  teachingFormat: "",
  preferredMode: "",
  preferredDays: "",
  preferredTime: "",
  availability: "",
  courseTitle: "",
  courseDescription: "",
  courseLevel: "",
  courseDuration: "",
  sessionFrequency: "",
  practicalTraining: "",
  certificationProvided: "",
  qualificationProof: null,
  experienceProof: null,
  profileDocument: null,
  password: "",
  confirmPassword: "",
  terms: false,
  verificationConsent: false,
};

const expertiseOptions = [
  "AC & Cooling",
  "Electrical",
  "Plumbing",
  "Carpentry",
  "Home Appliances",
  "Refrigeration",
  "Washing Machine Repair",
  "TV Repair",
  "Water Purification",
  "Cleaning & Home Maintenance",
  "Beauty & Personal Services",
  "Other",
];

const experienceOptions = [
  "No teaching experience",
  "Less than 1 year",
  "1–2 years",
  "3–5 years",
  "5–10 years",
  "More than 10 years",
];

const levelOptions = ["Beginner", "Intermediate", "Advanced", "All Levels"];

const steps = [
  { label: "Personal", title: "Personal information", icon: UserRound },
  { label: "Address", title: "Address & location", icon: MapPin },
  { label: "Expertise", title: "Expertise & qualifications", icon: GraduationCap },
  { label: "Experience", title: "Teaching experience", icon: BriefcaseBusiness },
  { label: "Course", title: "Course & documents", icon: BookOpen },
  { label: "Security", title: "Account & consent", icon: LockKeyhole },
];

type StringField = {
  [K in keyof TutorFormData]: TutorFormData[K] extends string ? K : never;
}[keyof TutorFormData];

export default function TutorRegisterPage() {
  const [form, setForm] = useState<TutorFormData>(initialForm);
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const progress = Math.round(((step + 1) / steps.length) * 100);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const target = event.target;
    const { name, value } = target;

    setForm((previous) => ({
      ...previous,
      [name]: target instanceof HTMLInputElement && target.type === "checkbox"
        ? target.checked
        : value,
    }));

    setErrors((previous) => ({ ...previous, [name]: "" }));
  };

  const handleFileChange = (
    event: ChangeEvent<HTMLInputElement>,
    field: "profilePhoto" | "qualificationProof" | "experienceProof" | "profileDocument",
  ) => {
    const file = event.target.files?.[0] ?? null;
    if (!file) return;

    const isImage = field === "profilePhoto";
    const allowedTypes = isImage
      ? ["image/jpeg", "image/png", "image/webp"]
      : ["application/pdf", "image/jpeg", "image/png"];

    if (!allowedTypes.includes(file.type)) {
      setErrors((previous) => ({
        ...previous,
        [field]: isImage
          ? "Upload a JPG, PNG, or WEBP image."
          : "Upload a PDF, JPG, or PNG file.",
      }));
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors((previous) => ({ ...previous, [field]: "File size must be 5 MB or less." }));
      event.target.value = "";
      return;
    }

    setForm((previous) => ({ ...previous, [field]: file }));
    setErrors((previous) => ({ ...previous, [field]: "" }));
  };

  const validateStep = (stepIndex: number) => {
    const nextErrors: Record<string, string> = {};

    const required = (key: keyof TutorFormData, message: string) => {
      const value = form[key];
      if (typeof value === "string" && !value.trim()) nextErrors[key] = message;
    };

    if (stepIndex === 0) {
      required("fullName", "Enter your full name.");
      required("mobile", "Enter your mobile number.");
      required("email", "Enter your email address.");

      if (form.mobile && !/^[6-9]\d{9}$/.test(form.mobile.trim())) {
        nextErrors.mobile = "Enter a valid 10-digit Indian mobile number.";
      }
      if (form.whatsapp && !/^[6-9]\d{9}$/.test(form.whatsapp.trim())) {
        nextErrors.whatsapp = "Enter a valid 10-digit Indian mobile number.";
      }
      if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
        nextErrors.email = "Enter a valid email address.";
      }
    }

    if (stepIndex === 1) {
      required("address", "Enter your address.");
      required("city", "Enter your city.");
      required("state", "Enter your state.");
      required("pincode", "Enter your PIN code.");
      if (form.pincode && !/^\d{6}$/.test(form.pincode.trim())) {
        nextErrors.pincode = "Enter a valid 6-digit PIN code.";
      }
    }

    if (stepIndex === 2) {
      required("expertise", "Choose your primary area of expertise.");
      required("qualification", "Enter your highest qualification.");
    }

    if (stepIndex === 3) {
      required("teachingExperience", "Select your teaching experience.");
      required("teachingFormat", "Select your teaching format.");
      required("preferredMode", "Choose your preferred teaching mode.");
    }

    if (stepIndex === 4) {
      required("courseTitle", "Enter a course or training title.");
      required("courseDescription", "Describe what you will teach.");
    }

    if (stepIndex === 5) {
      required("password", "Create a password.");
      required("confirmPassword", "Confirm your password.");

      if (form.password && form.password.length < 8) {
        nextErrors.password = "Use at least 8 characters.";
      }
      if (form.confirmPassword && form.password !== form.confirmPassword) {
        nextErrors.confirmPassword = "Passwords do not match.";
      }
      if (!form.terms) nextErrors.terms = "You must accept the terms to continue.";
      if (!form.verificationConsent) {
        nextErrors.verificationConsent = "Please provide consent for document verification.";
      }
    }

    setErrors((previous) => {
      const updated = { ...previous };
      Object.keys(updated).forEach((key) => {
        if (key in nextErrors || fieldsForStep(stepIndex).includes(key as keyof TutorFormData)) {
          delete updated[key];
        }
      });
      return { ...updated, ...nextErrors };
    });

    return Object.keys(nextErrors).length === 0;
  };

  const fieldsForStep = (stepIndex: number): (keyof TutorFormData)[] => {
    const groups: (keyof TutorFormData)[][] = [
      ["fullName", "mobile", "whatsapp", "email", "dob", "gender", "profilePhoto"],
      ["address", "city", "state", "pincode"],
      ["expertise", "secondaryExpertise", "qualification", "specialization", "certifications"],
      [
        "teachingExperience",
        "currentOccupation",
        "previousTeachingExperience",
        "teachingFormat",
        "preferredMode",
        "preferredDays",
        "preferredTime",
        "availability",
      ],
      [
        "courseTitle",
        "courseDescription",
        "courseLevel",
        "courseDuration",
        "sessionFrequency",
        "practicalTraining",
        "certificationProvided",
        "qualificationProof",
        "experienceProof",
        "profileDocument",
      ],
      ["password", "confirmPassword", "terms", "verificationConsent"],
    ];
    return groups[stepIndex] ?? [];
  };

  const goNext = () => {
    if (!validateStep(step)) return;
    setStep((current) => Math.min(current + 1, steps.length - 1));
  };

  const goBack = () => {
    setErrors({});
    setStep((current) => Math.max(current - 1, 0));
  };

  const goToStep = (targetStep: number) => {
    if (targetStep < step) {
      setErrors({});
      setStep(targetStep);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateStep(5)) return;
    setSubmitted(true);
  };

  const field = (
    name: StringField,
    label: string,
    placeholder = "",
    type = "text",
    options?: string[],
    fullWidth = false,
    required = false,
  ): ReactNode => (
    <div className={`tutor-form-group${fullWidth ? " tutor-full-width" : ""}`} key={name}>
      <label className="tutor-label" htmlFor={name}>
        {label}{required && <span className="tutor-required"> *</span>}
      </label>
      {options ? (
        <select
          id={name}
          name={name}
          value={form[name] as string}
          onChange={handleChange}
          className={`tutor-input tutor-select${errors[name] ? " tutor-input-error" : ""}`}
          aria-invalid={Boolean(errors[name])}
        >
          <option value="">Select {label.toLowerCase()}</option>
          {options.map((option) => <option key={option} value={option}>{option}</option>)}
        </select>
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          value={form[name] as string}
          onChange={handleChange}
          placeholder={placeholder}
          className={`tutor-input${errors[name] ? " tutor-input-error" : ""}`}
          aria-invalid={Boolean(errors[name])}
          autoComplete={name === "email" ? "email" : name === "mobile" ? "tel" : undefined}
        />
      )}
      {errors[name] && <span className="tutor-error-text">{errors[name]}</span>}
    </div>
  );

  const textarea = (
    name: "courseDescription" | "address",
    label: string,
    placeholder: string,
    required = false,
  ) => (
    <div className="tutor-form-group tutor-full-width" key={name}>
      <label className="tutor-label" htmlFor={name}>
        {label}{required && <span className="tutor-required"> *</span>}
      </label>
      <textarea
        id={name}
        name={name}
        value={form[name]}
        onChange={handleChange}
        placeholder={placeholder}
        className={`tutor-input tutor-textarea${errors[name] ? " tutor-input-error" : ""}`}
        aria-invalid={Boolean(errors[name])}
      />
      {errors[name] && <span className="tutor-error-text">{errors[name]}</span>}
    </div>
  );

  const fileField = (
    name: "profilePhoto" | "qualificationProof" | "experienceProof" | "profileDocument",
    label: string,
    description: string,
  ) => {
    const isPhoto = name === "profilePhoto";
    const selectedFile = form[name];

    return (
      <div className="tutor-form-group" key={name}>
        <span className="tutor-label">{label}</span>
        <label className="tutor-upload-box" htmlFor={name}>
          <input
            className="tutor-file-input"
            id={name}
            name={name}
            type="file"
            accept={isPhoto ? "image/png,image/jpeg,image/webp" : ".pdf,.png,.jpg,.jpeg"}
            onChange={(event) => handleFileChange(event, name)}
          />
          {selectedFile ? (
            <CheckCircle2 size={25} />
          ) : (
            <Upload size={25} />
          )}
          <span className={`tutor-upload-name${selectedFile ? " tutor-uploaded" : ""}`}>
            {selectedFile ? selectedFile.name : "Choose a file to upload"}
          </span>
          <small>{description}</small>
        </label>
        {errors[name] && <span className="tutor-error-text">{errors[name]}</span>}
      </div>
    );
  };

  const passwordField = (
    name: "password" | "confirmPassword",
    label: string,
    visible: boolean,
    toggle: () => void,
  ) => (
    <div className="tutor-form-group" key={name}>
      <label className="tutor-label" htmlFor={name}>{label} <span className="tutor-required">*</span></label>
      <div className="tutor-password-wrap">
        <input
          id={name}
          name={name}
          type={visible ? "text" : "password"}
          value={form[name]}
          onChange={handleChange}
          autoComplete={name === "password" ? "new-password" : "new-password"}
          placeholder={name === "password" ? "At least 8 characters" : "Re-enter your password"}
          className={`tutor-input${errors[name] ? " tutor-input-error" : ""}`}
          aria-invalid={Boolean(errors[name])}
        />
        <button
          type="button"
          className="tutor-password-toggle"
          onClick={toggle}
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      {errors[name] && <span className="tutor-error-text">{errors[name]}</span>}
    </div>
  );

  if (submitted) {
    return (
      <main className="tutor-register-page">
        <div className="tutor-register-shell">
          <section className="tutor-register-card tutor-success-card">
            <div className="tutor-success-icon"><CheckCircle2 size={38} /></div>
            <span className="tutor-eyebrow">REGISTRATION COMPLETE</span>
            <h1>Thank you for registering!</h1>
            <p className="tutor-success-description">
              Your tutor registration details have been captured. Your profile can be reviewed
              once the registration form is connected to the OneService backend.
            </p>
            <div className="tutor-summary">
              <h3>Registration summary</h3>
              <p><strong>Name</strong><span>{form.fullName}</span></p>
              <p><strong>Email</strong><span>{form.email}</span></p>
              <p><strong>Primary expertise</strong><span>{form.expertise}</span></p>
              <p><strong>Teaching experience</strong><span>{form.teachingExperience}</span></p>
            </div>
            <p className="tutor-success-note">
              This screen currently confirms completion in the frontend only; it does not itself
              submit your details to a server.
            </p>
            <Link to="/" className="tutor-primary-button">
              Back to Home <ArrowRight size={17} />
            </Link>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="tutor-register-page">
      <div className="tutor-register-shell">
        <header className="tutor-register-header">
          <div className="tutor-header-topline">
            <span className="tutor-eyebrow"><GraduationCap size={15} /> ONESERVICE TUTOR NETWORK</span>
            <Link to="/" className="tutor-home-link">Back to home</Link>
          </div>
          <h1>Share your skills. Shape someone’s future.</h1>
          <p>
            Register as a tutor or trainer on OneService. Complete each short step to tell us
            about your expertise, availability, and the training you offer.
          </p>
        </header>

        <section className="tutor-register-card">
          <div className="tutor-progress-header">
            <div className="tutor-progress-copy">
              <span>STEP {step + 1} OF {steps.length}</span>
              <strong>{steps[step].title}</strong>
            </div>
            <span className="tutor-progress-percentage">{progress}%</span>
          </div>
          <div
            className="tutor-progress-track"
            role="progressbar"
            aria-label="Registration progress"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progress}
          >
            <div className="tutor-progress-fill" style={{ width: `${progress}%` }} />
          </div>

          <nav className="tutor-step-navigation" aria-label="Registration steps">
            {steps.map((item, index) => {
              const StepIcon = item.icon;
              const completed = index < step;
              const active = index === step;

              return (
                <button
                  type="button"
                  key={item.label}
                  className={`tutor-step-indicator${active ? " active" : ""}${completed ? " completed" : ""}`}
                  onClick={() => goToStep(index)}
                  disabled={index >= step}
                  aria-current={active ? "step" : undefined}
                  aria-label={`${item.title}${completed ? ", completed" : active ? ", current step" : ""}`}
                >
                  <span className="tutor-step-icon">
                    {completed ? <Check size={18} /> : <StepIcon size={18} />}
                  </span>
                  <span className="tutor-step-label">{item.label}</span>
                </button>
              );
            })}
          </nav>

          <form className="tutor-form-content" onSubmit={handleSubmit} noValidate>
            <div className="tutor-step-heading">
              <span className="tutor-section-kicker">STEP {step + 1} · {steps[step].label.toUpperCase()}</span>
              <h2>{steps[step].title}</h2>
              <p>
                {[
                  "Start with your basic contact details so we know how to reach you.",
                  "Tell us where you are based so learners can find relevant local training.",
                  "Share your core skills, education, and any professional credentials.",
                  "Tell us about your teaching background and when you are available.",
                  "Describe your course or training offer and add supporting documents.",
                  "Create secure login details and review the required consent statements.",
                ][step]}
              </p>
            </div>

            {step === 0 && (
              <div className="tutor-form-grid">
                {field("fullName", "Full name", "Enter your full name", "text", undefined, false, true)}
                {field("mobile", "Mobile number", "10-digit mobile number", "tel", undefined, false, true)}
                {field("whatsapp", "WhatsApp number", "If different from mobile", "tel")}
                {field("email", "Email address", "you@example.com", "email", undefined, false, true)}
                {field("dob", "Date of birth", "", "date")}
                {field("gender", "Gender", "", "text", ["Female", "Male", "Non-binary", "Prefer not to say"])}
                {fileField("profilePhoto", "Profile photo", "JPG, PNG, WEBP · Max 5 MB")}
              </div>
            )}

            {step === 1 && (
              <div className="tutor-form-grid">
                {textarea("address", "Full address", "House / street, area, and landmark", true)}
                {field("city", "City", "Enter your city", "text", undefined, false, true)}
                {field("state", "State", "Enter your state", "text", undefined, false, true)}
                {field("pincode", "PIN code", "6-digit PIN code", "text", undefined, false, true)}
              </div>
            )}

            {step === 2 && (
              <div className="tutor-form-grid">
                {field("expertise", "Primary expertise", "", "text", expertiseOptions, false, true)}
                {field("secondaryExpertise", "Secondary expertise", "", "text", expertiseOptions)}
                {field("qualification", "Highest qualification", "e.g. Diploma, B.Tech, ITI", "text", undefined, false, true)}
                {field("specialization", "Specialization", "Your subject or technical specialty")}
                {field("certifications", "Certifications", "List relevant certifications", "text", undefined, true)}
              </div>
            )}

            {step === 3 && (
              <div className="tutor-form-grid">
                {field("teachingExperience", "Teaching experience", "", "text", experienceOptions, false, true)}
                {field("currentOccupation", "Current occupation", "Your current role")}
                {field("previousTeachingExperience", "Previous teaching experience", "Describe your teaching background", "text", undefined, true)}
                {field("teachingFormat", "Teaching format", "", "text", ["One-to-one", "Group classes", "Both"], false, true)}
                {field("preferredMode", "Preferred teaching mode", "", "text", ["Online", "In-person", "Hybrid"], false, true)}
                {field("preferredDays", "Preferred days", "e.g. Weekdays, weekends, Monday–Friday")}
                {field("preferredTime", "Preferred time", "", "text", ["Morning", "Afternoon", "Evening", "Flexible"])}
                {field("availability", "Availability details", "e.g. 10 hours per week")}
              </div>
            )}

            {step === 4 && (
              <div className="tutor-form-grid">
                {field("courseTitle", "Course / training title", "e.g. Basic AC Repair", "text", undefined, true, true)}
                {textarea("courseDescription", "Course description", "What will learners learn from you?", true)}
                {field("courseLevel", "Course level", "", "text", levelOptions)}
                {field("courseDuration", "Course duration", "e.g. 4 weeks or 20 hours")}
                {field("sessionFrequency", "Session frequency", "", "text", ["Daily", "2–3 times a week", "Weekly", "Flexible"])}
                {field("practicalTraining", "Practical training included?", "", "text", ["Yes", "No", "Depends on course"])}
                {field("certificationProvided", "Certificate provided?", "", "text", ["Yes", "No", "Not applicable"])}
                {fileField("qualificationProof", "Qualification proof", "Certificate or qualification document · Max 5 MB")}
                {fileField("experienceProof", "Experience proof", "Experience letter or related evidence · Max 5 MB")}
                {fileField("profileDocument", "Additional profile document", "Optional supporting document · Max 5 MB")}
              </div>
            )}

            {step === 5 && (
              <>
                <div className="tutor-form-grid">
                  {passwordField("password", "Create password", showPassword, () => setShowPassword((value) => !value))}
                  {passwordField("confirmPassword", "Confirm password", showConfirmPassword, () => setShowConfirmPassword((value) => !value))}
                </div>

                <div className="tutor-consent-list">
                  <label className="tutor-consent">
                    <input
                      type="checkbox"
                      name="terms"
                      checked={form.terms}
                      onChange={handleChange}
                      aria-invalid={Boolean(errors.terms)}
                    />
                    <span>
                      I agree to the OneService <Link to="/terms" target="_blank" rel="noreferrer">Terms and Conditions</Link> and confirm that the information I provided is accurate.
                      <span className="tutor-required"> *</span>
                      {errors.terms && <small className="tutor-error-text">{errors.terms}</small>}
                    </span>
                  </label>
                  <label className="tutor-consent">
                    <input
                      type="checkbox"
                      name="verificationConsent"
                      checked={form.verificationConsent}
                      onChange={handleChange}
                      aria-invalid={Boolean(errors.verificationConsent)}
                    />
                    <span>
                      I consent to OneService reviewing my submitted details and documents for tutor verification.
                      <span className="tutor-required"> *</span>
                      {errors.verificationConsent && <small className="tutor-error-text">{errors.verificationConsent}</small>}
                    </span>
                  </label>
                </div>

                <div className="tutor-info-note">
                  <ShieldCheck size={18} />
                  <span>Use a strong password and upload only documents you are authorized to share. Your documents may be used for verification.</span>
                </div>
              </>
            )}

            <div className="tutor-form-actions">
              {step > 0 ? (
                <button type="button" className="tutor-secondary-button" onClick={goBack}>
                  <ArrowLeft size={17} /> Back
                </button>
              ) : (
                <Link to="/login" className="tutor-secondary-button">
                  Already registered? Sign in
                </Link>
              )}

              {step < steps.length - 1 ? (
                <button type="button" className="tutor-primary-button" onClick={goNext}>
                  Continue <ArrowRight size={17} />
                </button>
              ) : (
                <button type="submit" className="tutor-primary-button">
                  Complete registration <CheckCircle2 size={17} />
                </button>
              )}
            </div>
          </form>
        </section>

        <footer className="tutor-register-footer">
          <LockKeyhole size={14} />
          <span>Your information is intended for tutor registration and verification.</span>
        </footer>
      </div>
    </main>
  );
}
