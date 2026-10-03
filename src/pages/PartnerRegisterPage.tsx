import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  FileText,
  LockKeyhole,
  Mail,
  MapPin,
  Phone,
  Upload,
  UserRound,
} from "lucide-react";
import "./PartnerRegisterPage.css";

type PartnerFormData = {
  contactName: string;
  designation: string;
  mobile: string;
  whatsapp: string;
  email: string;

  businessName: string;
  businessType: string;
  yearEstablished: string;
  website: string;

  services: string[];
  teamSize: string;
  serviceAreas: string;

  address: string;
  city: string;
  state: string;
  pincode: string;

  panNumber: string;
  gstNumber: string;

  businessRegistration: File | null;
  panDocument: File | null;
  gstDocument: File | null;
  addressProof: File | null;

  workingDays: string[];
  startTime: string;
  endTime: string;
  emergencyAvailability: boolean;

  responseTime: string;
  dailyCapacity: string;

  password: string;
  confirmPassword: string;

  terms: boolean;
  verificationConsent: boolean;
};

const serviceOptions = [
  "AC & Cooling",
  "Electrician",
  "Plumbing",
  "Carpentry",
  "Washing Machine",
  "Refrigerator",
  "TV Repair",
  "Water Purifier",
  "Home Appliances",
  "Cleaning",
  "Painting",
  "Other",
];

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const initialFormData: PartnerFormData = {
  contactName: "",
  designation: "",
  mobile: "",
  whatsapp: "",
  email: "",

  businessName: "",
  businessType: "",
  yearEstablished: "",
  website: "",

  services: [],
  teamSize: "",
  serviceAreas: "",

  address: "",
  city: "",
  state: "",
  pincode: "",

  panNumber: "",
  gstNumber: "",

  businessRegistration: null,
  panDocument: null,
  gstDocument: null,
  addressProof: null,

  workingDays: [],
  startTime: "",
  endTime: "",
  emergencyAvailability: false,

  responseTime: "",
  dailyCapacity: "",

  password: "",
  confirmPassword: "",

  terms: false,
  verificationConsent: false,
};

function PartnerRegisterPage() {
  const navigate = useNavigate();

  const [formData, setFormData] =
    useState<PartnerFormData>(initialFormData);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTextChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  };

  const handleFileChange = (
    event: ChangeEvent<HTMLInputElement>,
    field: keyof PartnerFormData
  ) => {
    const file = event.target.files?.[0] ?? null;

    setFormData((previous) => ({
      ...previous,
      [field]: file,
    }));

    setError("");
  };

  const handleCheckboxChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const { name, checked } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: checked,
    }));

    setError("");
  };

  const toggleService = (service: string) => {
    setFormData((previous) => {
      const exists = previous.services.includes(service);

      return {
        ...previous,
        services: exists
          ? previous.services.filter((item) => item !== service)
          : [...previous.services, service],
      };
    });

    setError("");
  };

  const toggleWorkingDay = (day: string) => {
    setFormData((previous) => {
      const exists = previous.workingDays.includes(day);

      return {
        ...previous,
        workingDays: exists
          ? previous.workingDays.filter((item) => item !== day)
          : [...previous.workingDays, day],
      };
    });

    setError("");
  };

  const validateForm = () => {
    if (!formData.contactName.trim()) {
      return "Please enter the contact person's name.";
    }

    if (!/^[6-9]\d{9}$/.test(formData.mobile)) {
      return "Please enter a valid 10-digit mobile number.";
    }

    if (!formData.email.trim()) {
      return "Please enter your email address.";
    }

    if (!formData.businessName.trim()) {
      return "Please enter your business name.";
    }

    if (!formData.businessType) {
      return "Please select your business type.";
    }

    if (!formData.services.length) {
      return "Please select at least one service.";
    }

    if (!formData.teamSize) {
      return "Please select your team size.";
    }

    if (!formData.serviceAreas.trim()) {
      return "Please enter your service areas.";
    }

    if (!formData.address.trim()) {
      return "Please enter your business address.";
    }

    if (!formData.city.trim()) {
      return "Please enter your city.";
    }

    if (!formData.state.trim()) {
      return "Please enter your state.";
    }

    if (!/^\d{6}$/.test(formData.pincode)) {
      return "Please enter a valid 6-digit pincode.";
    }

    if (!formData.panNumber.trim()) {
      return "Please enter your PAN number.";
    }

    if (!formData.businessRegistration) {
      return "Please upload your business registration document.";
    }

    if (!formData.panDocument) {
      return "Please upload your PAN document.";
    }

    if (!formData.addressProof) {
      return "Please upload your address proof.";
    }

    if (!formData.workingDays.length) {
      return "Please select at least one working day.";
    }

    if (!formData.startTime || !formData.endTime) {
      return "Please select your working hours.";
    }

    if (!formData.responseTime) {
      return "Please select your expected response time.";
    }

    if (!formData.dailyCapacity) {
      return "Please select your daily service capacity.";
    }

    if (formData.password.length < 8) {
      return "Password must contain at least 8 characters.";
    }

    if (formData.password !== formData.confirmPassword) {
      return "Passwords do not match.";
    }

    if (!formData.terms) {
      return "Please accept the Terms & Conditions.";
    }

    if (!formData.verificationConsent) {
      return "Please provide verification consent.";
    }

    return "";
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      return;
    }

    setError("");
    setIsSubmitting(true);

    // API integration will be connected here later.
    await new Promise((resolve) => setTimeout(resolve, 900));

    setIsSubmitting(false);
    setSubmitted(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (submitted) {
    return (
      <main className="partner-register-page">
        <section className="partner-success-section">
          <div className="partner-success-card">
            <div className="partner-success-icon">
              <Check size={34} />
            </div>

            <span className="partner-eyebrow">
              APPLICATION SUBMITTED
            </span>

            <h1>Thank you for joining OneService.</h1>

            <p>
              Your service partner application has been submitted
              successfully. Our team will review your details and
              contact you after verification.
            </p>

            <div className="partner-success-summary">
              <div>
                <span>Business</span>
                <strong>{formData.businessName}</strong>
              </div>

              <div>
                <span>Contact</span>
                <strong>{formData.contactName}</strong>
              </div>

              <div>
                <span>Mobile</span>
                <strong>+91 {formData.mobile}</strong>
              </div>
            </div>

            <div className="partner-success-actions">
              <Link to="/" className="partner-secondary-button">
                Back to Home
              </Link>

              <button
                type="button"
                className="partner-primary-button"
                onClick={() => navigate("/login")}
              >
                Go to Login
                <ArrowRight size={17} />
              </button>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="partner-register-page">
      <section className="partner-register-hero">
        <div className="partner-register-hero-inner">
          <div>
            <span className="partner-eyebrow">
              SERVICE PARTNER REGISTRATION
            </span>

            <h1>
              Grow your service business
              <br />
              with <span>NeedOneService.</span>
            </h1>

            <p>
              Register your business with NeedOneService and connect
              with customers looking for reliable home services.
            </p>
          </div>

          <div className="partner-hero-badge">
            <div className="partner-hero-badge-icon">
              <UserRound size={21} />
            </div>

            <div>
              <strong>Service Partner</strong>
              <span>
                Business onboarding & verification
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="partner-register-content">
        <div className="partner-register-container">

          <div className="partner-register-top">
            <div>
              <span className="partner-section-label">
                JOIN OUR NETWORK
              </span>

              <h2>Create your partner profile</h2>

              <p>
                Tell us about your business, services and
                operating capabilities.
              </p>
            </div>

            <div className="partner-login-note">
              Already registered?
              <Link to="/login"> Sign in</Link>
            </div>
          </div>

          <div className="partner-progress">
            <div className="partner-progress-item active">
              <span>01</span>
              <strong>Contact</strong>
            </div>

            <div className="partner-progress-line" />

            <div className="partner-progress-item active">
              <span>02</span>
              <strong>Business</strong>
            </div>

            <div className="partner-progress-line" />

            <div className="partner-progress-item active">
              <span>03</span>
              <strong>Operations</strong>
            </div>

            <div className="partner-progress-line" />

            <div className="partner-progress-item active">
              <span>04</span>
              <strong>Verification</strong>
            </div>
          </div>

          <form
            className="partner-register-form"
            onSubmit={handleSubmit}
          >
            {error && (
              <div className="partner-form-error">
                {error}
              </div>
            )}

            {/* CONTACT */}
            <section className="partner-form-section">
              <div className="partner-form-heading">
                <div className="partner-form-number">01</div>

                <div>
                  <h3>Contact person</h3>
                  <p>
                    Tell us who we should contact regarding the
                    partnership.
                  </p>
                </div>
              </div>

              <div className="partner-form-grid">

                <label className="partner-field">
                  <span>Full name *</span>

                  <div className="partner-input-wrap">
                    <UserRound size={17} />

                    <input
                      name="contactName"
                      value={formData.contactName}
                      onChange={handleTextChange}
                      placeholder="Enter full name"
                    />
                  </div>
                </label>

                <label className="partner-field">
                  <span>Designation</span>

                  <input
                    name="designation"
                    value={formData.designation}
                    onChange={handleTextChange}
                    placeholder="Owner / Manager / Director"
                  />
                </label>

                <label className="partner-field">
                  <span>Mobile number *</span>

                  <div className="partner-input-wrap">
                    <Phone size={17} />

                    <span className="partner-country-code">
                      +91
                    </span>

                    <input
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleTextChange}
                      maxLength={10}
                      placeholder="10-digit mobile number"
                    />
                  </div>
                </label>

                <label className="partner-field">
                  <span>WhatsApp number</span>

                  <input
                    name="whatsapp"
                    value={formData.whatsapp}
                    onChange={handleTextChange}
                    maxLength={10}
                    placeholder="WhatsApp number"
                  />
                </label>

                <label className="partner-field partner-field-full">
                  <span>Email address *</span>

                  <div className="partner-input-wrap">
                    <Mail size={17} />

                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleTextChange}
                      placeholder="business@example.com"
                    />
                  </div>
                </label>

              </div>
            </section>

            {/* BUSINESS */}
            <section className="partner-form-section">
              <div className="partner-form-heading">
                <div className="partner-form-number">02</div>

                <div>
                  <h3>Business information</h3>
                  <p>
                    Provide the basic information about your
                    service business.
                  </p>
                </div>
              </div>

              <div className="partner-form-grid">

                <label className="partner-field">
                  <span>Business / Company name *</span>

                  <input
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleTextChange}
                    placeholder="Enter business name"
                  />
                </label>

                <label className="partner-field">
                  <span>Business type *</span>

                  <select
                    name="businessType"
                    value={formData.businessType}
                    onChange={handleTextChange}
                  >
                    <option value="">
                      Select business type
                    </option>
                    <option value="sole-proprietorship">
                      Sole Proprietorship
                    </option>
                    <option value="partnership">
                      Partnership
                    </option>
                    <option value="private-limited">
                      Private Limited
                    </option>
                    <option value="llp">LLP</option>
                    <option value="other">Other</option>
                  </select>
                </label>

                <label className="partner-field">
                  <span>Year established</span>

                  <input
                    name="yearEstablished"
                    value={formData.yearEstablished}
                    onChange={handleTextChange}
                    placeholder="e.g. 2020"
                  />
                </label>

                <label className="partner-field">
                  <span>Website</span>

                  <input
                    name="website"
                    value={formData.website}
                    onChange={handleTextChange}
                    placeholder="https://yourbusiness.com"
                  />
                </label>

                <div className="partner-field partner-field-full">
                  <span>Services offered *</span>

                  <div className="partner-chip-grid">
                    {serviceOptions.map((service) => {
                      const selected =
                        formData.services.includes(service);

                      return (
                        <button
                          key={service}
                          type="button"
                          className={`partner-service-chip ${
                            selected ? "selected" : ""
                          }`}
                          onClick={() =>
                            toggleService(service)
                          }
                        >
                          {selected && <Check size={14} />}
                          {service}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <label className="partner-field">
                  <span>Team size *</span>

                  <select
                    name="teamSize"
                    value={formData.teamSize}
                    onChange={handleTextChange}
                  >
                    <option value="">
                      Select team size
                    </option>
                    <option value="1-2">1–2 people</option>
                    <option value="3-5">3–5 people</option>
                    <option value="6-10">6–10 people</option>
                    <option value="11-25">11–25 people</option>
                    <option value="26-50">26–50 people</option>
                    <option value="50+">50+ people</option>
                  </select>
                </label>

                <label className="partner-field">
                  <span>Service areas *</span>

                  <input
                    name="serviceAreas"
                    value={formData.serviceAreas}
                    onChange={handleTextChange}
                    placeholder="Cities / areas you serve"
                  />
                </label>

              </div>
            </section>

            {/* ADDRESS */}
            <section className="partner-form-section">
              <div className="partner-form-heading">
                <div className="partner-form-number">03</div>

                <div>
                  <h3>Business address</h3>
                  <p>
                    Add your primary business or operating
                    location.
                  </p>
                </div>
              </div>

              <div className="partner-form-grid">

                <label className="partner-field partner-field-full">
                  <span>Address *</span>

                  <div className="partner-input-wrap partner-textarea-wrap">
                    <MapPin size={17} />

                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleTextChange}
                      placeholder="Enter complete business address"
                      rows={4}
                    />
                  </div>
                </label>

                <label className="partner-field">
                  <span>City *</span>

                  <input
                    name="city"
                    value={formData.city}
                    onChange={handleTextChange}
                    placeholder="Enter city"
                  />
                </label>

                <label className="partner-field">
                  <span>State *</span>

                  <input
                    name="state"
                    value={formData.state}
                    onChange={handleTextChange}
                    placeholder="Enter state"
                  />
                </label>

                <label className="partner-field">
                  <span>Pincode *</span>

                  <input
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleTextChange}
                    maxLength={6}
                    placeholder="6-digit pincode"
                  />
                </label>

              </div>
            </section>

            {/* OPERATIONS */}
            <section className="partner-form-section">
              <div className="partner-form-heading">
                <div className="partner-form-number">04</div>

                <div>
                  <h3>Operations & availability</h3>
                  <p>
                    Help us understand your service capacity
                    and working schedule.
                  </p>
                </div>
              </div>

              <div className="partner-form-grid">

                <div className="partner-field partner-field-full">
                  <span>Working days *</span>

                  <div className="partner-days-grid">
                    {days.map((day) => {
                      const selected =
                        formData.workingDays.includes(day);

                      return (
                        <button
                          key={day}
                          type="button"
                          className={`partner-day-button ${
                            selected ? "selected" : ""
                          }`}
                          onClick={() =>
                            toggleWorkingDay(day)
                          }
                        >
                          {selected && <Check size={14} />}
                          {day.slice(0, 3)}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <label className="partner-field">
                  <span>Start time *</span>

                  <input
                    type="time"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleTextChange}
                  />
                </label>

                <label className="partner-field">
                  <span>End time *</span>

                  <input
                    type="time"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleTextChange}
                  />
                </label>

                <label className="partner-field">
                  <span>Typical response time *</span>

                  <select
                    name="responseTime"
                    value={formData.responseTime}
                    onChange={handleTextChange}
                  >
                    <option value="">
                      Select response time
                    </option>
                    <option value="<30">
                      Less than 30 minutes
                    </option>
                    <option value="30-60">
                      30–60 minutes
                    </option>
                    <option value="1-2">
                      1–2 hours
                    </option>
                    <option value="2-4">
                      2–4 hours
                    </option>
                    <option value="4+">
                      More than 4 hours
                    </option>
                  </select>
                </label>

                <label className="partner-field">
                  <span>Daily service capacity *</span>

                  <select
                    name="dailyCapacity"
                    value={formData.dailyCapacity}
                    onChange={handleTextChange}
                  >
                    <option value="">
                      Select capacity
                    </option>
                    <option value="1-5">1–5 jobs</option>
                    <option value="6-10">6–10 jobs</option>
                    <option value="11-20">11–20 jobs</option>
                    <option value="21-50">21–50 jobs</option>
                    <option value="50+">50+ jobs</option>
                  </select>
                </label>

                <label className="partner-toggle-field partner-field-full">
                  <input
                    type="checkbox"
                    name="emergencyAvailability"
                    checked={formData.emergencyAvailability}
                    onChange={handleCheckboxChange}
                  />

                  <span className="partner-toggle-box">
                    <strong>
                      Emergency service availability
                    </strong>

                    <small>
                      We can handle urgent service requests
                      outside normal working hours.
                    </small>
                  </span>
                </label>

              </div>
            </section>

            {/* DOCUMENTS */}
            <section className="partner-form-section">
              <div className="partner-form-heading">
                <div className="partner-form-number">05</div>

                <div>
                  <h3>Business verification</h3>
                  <p>
                    Upload the documents required for partner
                    verification.
                  </p>
                </div>
              </div>

              <div className="partner-form-grid">

                <label className="partner-field">
                  <span>PAN number *</span>

                  <input
                    name="panNumber"
                    value={formData.panNumber}
                    onChange={handleTextChange}
                    placeholder="Enter PAN number"
                  />
                </label>

                <label className="partner-field">
                  <span>GST number</span>

                  <input
                    name="gstNumber"
                    value={formData.gstNumber}
                    onChange={handleTextChange}
                    placeholder="If applicable"
                  />
                </label>

                <FileUpload
                  label="Business registration *"
                  file={formData.businessRegistration}
                  onChange={(event) =>
                    handleFileChange(
                      event,
                      "businessRegistration"
                    )
                  }
                />

                <FileUpload
                  label="PAN document *"
                  file={formData.panDocument}
                  onChange={(event) =>
                    handleFileChange(event, "panDocument")
                  }
                />

                <FileUpload
                  label="GST document"
                  file={formData.gstDocument}
                  onChange={(event) =>
                    handleFileChange(event, "gstDocument")
                  }
                />

                <FileUpload
                  label="Business address proof *"
                  file={formData.addressProof}
                  onChange={(event) =>
                    handleFileChange(event, "addressProof")
                  }
                />

              </div>
            </section>

            {/* SECURITY */}
            <section className="partner-form-section">
              <div className="partner-form-heading">
                <div className="partner-form-number">06</div>

                <div>
                  <h3>Account security</h3>
                  <p>
                    Create secure login credentials for your
                    partner account.
                  </p>
                </div>
              </div>

              <div className="partner-form-grid">

                <label className="partner-field">
                  <span>Password *</span>

                  <div className="partner-input-wrap">
                    <LockKeyhole size={17} />

                    <input
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      name="password"
                      value={formData.password}
                      onChange={handleTextChange}
                      placeholder="Minimum 8 characters"
                    />

                    <button
                      type="button"
                      className="partner-password-button"
                      onClick={() =>
                        setShowPassword(
                          (previous) => !previous
                        )
                      }
                    >
                      {showPassword ? (
                        <EyeOff size={17} />
                      ) : (
                        <Eye size={17} />
                      )}
                    </button>
                  </div>
                </label>

                <label className="partner-field">
                  <span>Confirm password *</span>

                  <div className="partner-input-wrap">
                    <LockKeyhole size={17} />

                    <input
                      type={
                        showConfirmPassword
                          ? "text"
                          : "password"
                      }
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleTextChange}
                      placeholder="Re-enter password"
                    />

                    <button
                      type="button"
                      className="partner-password-button"
                      onClick={() =>
                        setShowConfirmPassword(
                          (previous) => !previous
                        )
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={17} />
                      ) : (
                        <Eye size={17} />
                      )}
                    </button>
                  </div>
                </label>

              </div>
            </section>

            {/* TERMS */}
            <section className="partner-consent-section">

              <label className="partner-check-row">
                <input
                  type="checkbox"
                  name="terms"
                  checked={formData.terms}
                  onChange={handleCheckboxChange}
                />

                <span>
                  I agree to the{" "}
                  <Link to="/terms">
                    Terms & Conditions
                  </Link>{" "}
                  and{" "}
                  <Link to="/privacy">
                    Privacy Policy
                  </Link>
                  .
                </span>
              </label>

              <label className="partner-check-row">
                <input
                  type="checkbox"
                  name="verificationConsent"
                  checked={formData.verificationConsent}
                  onChange={handleCheckboxChange}
                />

                <span>
                  I authorize NeedOneService to verify the
                  business and documents submitted in this
                  application.
                </span>
              </label>

            </section>

            <div className="partner-submit-area">
              <div className="partner-submit-note">
                <FileText size={17} />

                <span>
                  Your application will be reviewed before
                  partner activation.
                </span>
              </div>

              <button
                type="submit"
                className="partner-submit-button"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? "Submitting..."
                  : "Submit Partner Application"}

                {!isSubmitting && (
                  <ArrowRight size={18} />
                )}
              </button>
            </div>

          </form>
        </div>
      </section>
    </main>
  );
}

type FileUploadProps = {
  label: string;
  file: File | null;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

function FileUpload({
  label,
  file,
  onChange,
}: FileUploadProps) {
  return (
    <label className="partner-file-upload">
      <span>{label}</span>

      <div className="partner-file-box">
        <Upload size={18} />

        <div>
          <strong>
            {file ? file.name : "Choose a document"}
          </strong>

          <small>
            {file
              ? `${Math.round(file.size / 1024)} KB`
              : "PDF, JPG or PNG"}
          </small>
        </div>
      </div>

      <input
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        onChange={onChange}
      />
    </label>
  );
}

export default PartnerRegisterPage;