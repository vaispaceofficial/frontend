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
import "./ProfessionalRegisterPage.css";

type FormData = {
  fullName: string;
  profilePhoto: File | null;

  mobile: string;
  whatsapp: string;
  email: string;

  dob: string;
  gender: string;

  category: string;
  services: string[];
  experience: string;
  currentOccupation: string;
  previousEmployer: string;
  previousExperience: string;
  serviceArea: string;

  address: string;
  city: string;
  state: string;
  pincode: string;

  idType: string;
  idNumber: string;
  governmentId: File | null;
  addressProof: File | null;
  experienceCertificate: File | null;
  qualificationCertificate: File | null;

  workType: string;
  workingDays: string[];
  startTime: string;
  endTime: string;
  emergencyAvailability: string;

  password: string;
  confirmPassword: string;

  terms: boolean;
  verificationConsent: boolean;
};

const serviceOptions: Record<string, string[]> = {
  "AC & Cooling": [
    "AC Installation",
    "AC Repair",
    "AC Service",
    "AC Gas Filling",
    "AC Maintenance",
  ],
  Electrician: [
    "Electrical Repair",
    "Wiring",
    "Switch & Socket Repair",
    "Fan Installation",
    "Lighting Installation",
  ],
  Plumber: [
    "Pipe Repair",
    "Tap Repair",
    "Bathroom Plumbing",
    "Kitchen Plumbing",
    "Water Leakage Repair",
  ],
  Carpenter: [
    "Furniture Repair",
    "Furniture Assembly",
    "Door Repair",
    "Woodwork",
    "Modular Furniture",
  ],
  "Washing Machine": [
    "Washing Machine Repair",
    "Installation",
    "Maintenance",
    "Drainage Repair",
  ],
  Refrigerator: [
    "Refrigerator Repair",
    "Gas Filling",
    "Cooling Issue",
    "Maintenance",
  ],
  "TV Repair": [
    "TV Repair",
    "Screen Issue",
    "Sound Issue",
    "Installation",
  ],
  "Water Purifier": [
    "RO Service",
    "RO Repair",
    "Filter Replacement",
    "Installation",
  ],
  Cleaning: [
    "Home Cleaning",
    "Deep Cleaning",
    "Kitchen Cleaning",
    "Bathroom Cleaning",
  ],
  "Home Appliances": [
    "Microwave Repair",
    "Mixer Repair",
    "Chimney Service",
    "Appliance Installation",
  ],
};

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const initialFormData: FormData = {
  fullName: "",
  profilePhoto: null,

  mobile: "",
  whatsapp: "",
  email: "",

  dob: "",
  gender: "",

  category: "",
  services: [],
  experience: "",
  currentOccupation: "",
  previousEmployer: "",
  previousExperience: "",
  serviceArea: "",

  address: "",
  city: "",
  state: "",
  pincode: "",

  idType: "",
  idNumber: "",
  governmentId: null,
  addressProof: null,
  experienceCertificate: null,
  qualificationCertificate: null,

  workType: "",
  workingDays: [],
  startTime: "",
  endTime: "",
  emergencyAvailability: "",

  password: "",
  confirmPassword: "",

  terms: false,
  verificationConsent: false,
};

function ProfessionalRegisterPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>(initialFormData);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTextChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
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
    field: keyof FormData
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
    if (!formData.fullName.trim()) {
      return "Please enter your full name.";
    }

    if (!/^[6-9]\d{9}$/.test(formData.mobile)) {
      return "Please enter a valid 10-digit mobile number.";
    }

    if (formData.whatsapp && !/^[6-9]\d{9}$/.test(formData.whatsapp)) {
      return "Please enter a valid WhatsApp number.";
    }

    if (!formData.email.trim()) {
      return "Please enter your email address.";
    }

    if (!formData.dob) {
      return "Please enter your date of birth.";
    }

    if (!formData.gender) {
      return "Please select your gender.";
    }

    if (!formData.category) {
      return "Please select your primary service category.";
    }

    if (formData.services.length === 0) {
      return "Please select at least one service or skill.";
    }

    if (!formData.experience) {
      return "Please select your years of experience.";
    }

    if (!formData.currentOccupation.trim()) {
      return "Please enter your current occupation.";
    }

    if (!formData.serviceArea.trim()) {
      return "Please enter your service area.";
    }

    if (!formData.address.trim()) {
      return "Please enter your complete address.";
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

    if (!formData.idType) {
      return "Please select your government ID type.";
    }

    if (!formData.idNumber.trim()) {
      return "Please enter your government ID number.";
    }

    if (!formData.governmentId) {
      return "Please upload your government ID.";
    }

    if (!formData.addressProof) {
      return "Please upload your address proof.";
    }

    if (!formData.workType) {
      return "Please select your preferred work type.";
    }

    if (formData.workingDays.length === 0) {
      return "Please select at least one working day.";
    }

    if (!formData.startTime || !formData.endTime) {
      return "Please select your working hours.";
    }

    if (!formData.emergencyAvailability) {
      return "Please select your emergency availability.";
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
      return "Please provide consent for profile verification.";
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

    setIsSubmitting(true);
    setError("");

    /*
      API integration can be added here later.

      Example:
      const response = await fetch("/api/register/professional", {
        method: "POST",
        body: formDataObject,
      });
    */

    await new Promise((resolve) => setTimeout(resolve, 900));

    setIsSubmitting(false);
    setSuccess(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (success) {
    return (
      <main className="professional-register-page">
        <section className="professional-success-page">
          <div className="professional-success-card">
            <div className="professional-success-icon">
              <Check size={34} strokeWidth={2.4} />
            </div>

            <span className="professional-eyebrow">
              APPLICATION SUBMITTED
            </span>

            <h1>Thank you for registering with NeedOneService</h1>

            <p>
              Your professional application has been submitted successfully.
              Our team will review your information and contact you after the
              verification process.
            </p>

            <div className="professional-success-details">
              <div>
                <span>Applicant</span>
                <strong>{formData.fullName}</strong>
              </div>

              <div>
                <span>Mobile</span>
                <strong>+91 {formData.mobile}</strong>
              </div>

              <div>
                <span>Category</span>
                <strong>{formData.category}</strong>
              </div>
            </div>

            <div className="professional-success-actions">
              <button
                type="button"
                onClick={() => navigate("/")}
                className="professional-primary-button"
              >
                Back to Home
                <ArrowRight size={17} />
              </button>

              <button
                type="button"
                onClick={() => navigate("/login")}
                className="professional-secondary-button"
              >
                Go to Login
              </button>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="professional-register-page">
      <section className="professional-register-header">
        <div className="professional-register-header-inner">
          <div>
            <span className="professional-eyebrow">
              PROFESSIONAL REGISTRATION
            </span>

            <h1>Create your professional profile</h1>

            <p>
              Join NeedOneService and connect with customers looking for trusted
              home service professionals.
            </p>
          </div>

          <div className="professional-login-link">
            <span>Already registered?</span>
            <Link to="/login">Sign in</Link>
          </div>
        </div>
      </section>

      <section className="professional-register-content">
        <div className="professional-progress">
          <div className="professional-progress-item active">
            <span>01</span>
            <div>
              <strong>Personal</strong>
              <small>Your basic information</small>
            </div>
          </div>

          <div className="professional-progress-line active" />

          <div className="professional-progress-item active">
            <span>02</span>
            <div>
              <strong>Professional</strong>
              <small>Your skills & experience</small>
            </div>
          </div>

          <div className="professional-progress-line active" />

          <div className="professional-progress-item active">
            <span>03</span>
            <div>
              <strong>Verification</strong>
              <small>Documents & availability</small>
            </div>
          </div>

          <div className="professional-progress-line active" />

          <div className="professional-progress-item active">
            <span>04</span>
            <div>
              <strong>Security</strong>
              <small>Create your account</small>
            </div>
          </div>
        </div>

        <form
          className="professional-register-form"
          onSubmit={handleSubmit}
        >
          {error && (
            <div className="professional-form-error">
              <strong>Please check the following:</strong>
              <span>{error}</span>
            </div>
          )}

          {/* =========================================================
              SECTION 01 — PERSONAL INFORMATION
          ========================================================= */}

          <section className="professional-form-section">
            <div className="professional-section-heading">
              <div className="professional-section-number">01</div>

              <div>
                <span>PERSONAL INFORMATION</span>
                <h2>Tell us about yourself</h2>
                <p>
                  Provide your basic details so customers can know who they
                  are booking.
                </p>
              </div>
            </div>

            <div className="professional-form-grid">
              <div className="professional-field full-width">
                <label>Full Name *</label>

                <div className="professional-input-icon">
                  <UserRound size={17} />

                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleTextChange}
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              <div className="professional-field">
                <label>Mobile Number *</label>

                <div className="professional-phone-input">
                  <span>+91</span>

                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleTextChange}
                    maxLength={10}
                    placeholder="10-digit mobile number"
                  />
                </div>
              </div>

              <div className="professional-field">
                <label>WhatsApp Number</label>

                <div className="professional-phone-input">
                  <span>+91</span>

                  <input
                    type="tel"
                    name="whatsapp"
                    value={formData.whatsapp}
                    onChange={handleTextChange}
                    maxLength={10}
                    placeholder="WhatsApp number"
                  />
                </div>
              </div>

              <div className="professional-field full-width">
                <label>Email Address *</label>

                <div className="professional-input-icon">
                  <Mail size={17} />

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleTextChange}
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div className="professional-field">
                <label>Date of Birth *</label>

                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleTextChange}
                />
              </div>

              <div className="professional-field">
                <label>Gender *</label>

                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleTextChange}
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer-not-to-say">
                    Prefer not to say
                  </option>
                </select>
              </div>

              <div className="professional-field full-width">
                <label>Profile Photo</label>

                <label className="professional-upload-box">
                  <Upload size={19} />

                  <div>
                    <strong>
                      {formData.profilePhoto
                        ? formData.profilePhoto.name
                        : "Upload your profile photo"}
                    </strong>

                    <span>
                      JPG, JPEG or PNG. Use a clear photo of yourself.
                    </span>
                  </div>

                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    onChange={(event) =>
                      handleFileChange(event, "profilePhoto")
                    }
                  />
                </label>
              </div>
            </div>
          </section>

          {/* =========================================================
              SECTION 02 — PROFESSIONAL INFORMATION
          ========================================================= */}

          <section className="professional-form-section">
            <div className="professional-section-heading">
              <div className="professional-section-number">02</div>

              <div>
                <span>PROFESSIONAL INFORMATION</span>
                <h2>Tell us about your skills</h2>
                <p>
                  Help us understand the services you provide and your
                  professional experience.
                </p>
              </div>
            </div>

            <div className="professional-form-grid">
              <div className="professional-field">
                <label>Primary Service Category *</label>

                <select
                  name="category"
                  value={formData.category}
                  onChange={(event) => {
                    handleTextChange(event);

                    setFormData((previous) => ({
                      ...previous,
                      services: [],
                    }));
                  }}
                >
                  <option value="">Select category</option>

                  {Object.keys(serviceOptions).map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="professional-field">
                <label>Years of Experience *</label>

                <select
                  name="experience"
                  value={formData.experience}
                  onChange={handleTextChange}
                >
                  <option value="">Select experience</option>
                  <option value="less-than-1">Less than 1 year</option>
                  <option value="1-2">1–2 years</option>
                  <option value="3-5">3–5 years</option>
                  <option value="6-10">6–10 years</option>
                  <option value="10-plus">10+ years</option>
                </select>
              </div>

              {formData.category && (
                <div className="professional-field full-width">
                  <label>Select Services / Skills *</label>

                  <div className="professional-checkbox-grid">
                    {serviceOptions[formData.category]?.map((service) => (
                      <label
                        key={service}
                        className={`professional-skill-option ${
                          formData.services.includes(service)
                            ? "selected"
                            : ""
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={formData.services.includes(service)}
                          onChange={() => toggleService(service)}
                        />

                        <span className="professional-custom-check">
                          {formData.services.includes(service) && (
                            <Check size={13} />
                          )}
                        </span>

                        <span>{service}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div className="professional-field">
                <label>Current Occupation *</label>

                <input
                  type="text"
                  name="currentOccupation"
                  value={formData.currentOccupation}
                  onChange={handleTextChange}
                  placeholder="e.g. Independent Technician"
                />
              </div>

              <div className="professional-field">
                <label>Previous Employer / Company</label>

                <input
                  type="text"
                  name="previousEmployer"
                  value={formData.previousEmployer}
                  onChange={handleTextChange}
                  placeholder="Company name, if applicable"
                />
              </div>

              <div className="professional-field full-width">
                <label>Previous Experience</label>

                <textarea
                  name="previousExperience"
                  value={formData.previousExperience}
                  onChange={handleTextChange}
                  rows={4}
                  placeholder="Briefly describe your previous professional experience..."
                />
              </div>

              <div className="professional-field full-width">
                <label>Service Areas *</label>

                <div className="professional-input-icon">
                  <MapPin size={17} />

                  <input
                    type="text"
                    name="serviceArea"
                    value={formData.serviceArea}
                    onChange={handleTextChange}
                    placeholder="e.g. Madhurawada, Gajuwaka, MVP Colony"
                  />
                </div>

                <small className="professional-field-help">
                  Mention the localities or areas where you are willing to
                  accept service requests.
                </small>
              </div>
            </div>
          </section>

          {/* =========================================================
              SECTION 03 — ADDRESS
          ========================================================= */}

          <section className="professional-form-section">
            <div className="professional-section-heading">
              <div className="professional-section-number">03</div>

              <div>
                <span>ADDRESS INFORMATION</span>
                <h2>Where are you based?</h2>
                <p>
                  Your address helps us assign relevant service requests.
                </p>
              </div>
            </div>

            <div className="professional-form-grid">
              <div className="professional-field full-width">
                <label>Complete Address *</label>

                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleTextChange}
                  rows={4}
                  placeholder="House / Flat number, street, area..."
                />
              </div>

              <div className="professional-field">
                <label>City *</label>

                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleTextChange}
                  placeholder="Enter your city"
                />
              </div>

              <div className="professional-field">
                <label>State *</label>

                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleTextChange}
                  placeholder="Enter your state"
                />
              </div>

              <div className="professional-field">
                <label>Pincode *</label>

                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleTextChange}
                  maxLength={6}
                  placeholder="6-digit pincode"
                />
              </div>
            </div>
          </section>

          {/* =========================================================
              SECTION 04 — DOCUMENT VERIFICATION
          ========================================================= */}

          <section className="professional-form-section">
            <div className="professional-section-heading">
              <div className="professional-section-number">04</div>

              <div>
                <span>DOCUMENT VERIFICATION</span>
                <h2>Verify your identity</h2>
                <p>
                  Upload the documents required for professional verification.
                </p>
              </div>
            </div>

            <div className="professional-form-grid">
              <div className="professional-field">
                <label>Government ID Type *</label>

                <select
                  name="idType"
                  value={formData.idType}
                  onChange={handleTextChange}
                >
                  <option value="">Select ID type</option>
                  <option value="aadhaar">Aadhaar Card</option>
                  <option value="pan">PAN Card</option>
                  <option value="driving-license">
                    Driving Licence
                  </option>
                  <option value="voter-id">Voter ID</option>
                  <option value="passport">Passport</option>
                </select>
              </div>

              <div className="professional-field">
                <label>ID Number *</label>

                <div className="professional-input-icon">
                  <FileText size={17} />

                  <input
                    type="text"
                    name="idNumber"
                    value={formData.idNumber}
                    onChange={handleTextChange}
                    placeholder="Enter ID number"
                  />
                </div>
              </div>

              <div className="professional-field full-width">
                <label>Government ID *</label>

                <label className="professional-upload-box">
                  <Upload size={19} />

                  <div>
                    <strong>
                      {formData.governmentId
                        ? formData.governmentId.name
                        : "Upload government ID"}
                    </strong>

                    <span>
                      Upload a clear JPG, PNG or PDF document.
                    </span>
                  </div>

                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={(event) =>
                      handleFileChange(event, "governmentId")
                    }
                  />
                </label>
              </div>

              <div className="professional-field full-width">
                <label>Address Proof *</label>

                <label className="professional-upload-box">
                  <Upload size={19} />

                  <div>
                    <strong>
                      {formData.addressProof
                        ? formData.addressProof.name
                        : "Upload address proof"}
                    </strong>

                    <span>
                      Upload a clear JPG, PNG or PDF document.
                    </span>
                  </div>

                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={(event) =>
                      handleFileChange(event, "addressProof")
                    }
                  />
                </label>
              </div>

              <div className="professional-field">
                <label>Experience Certificate</label>

                <label className="professional-mini-upload">
                  <Upload size={17} />

                  <span>
                    {formData.experienceCertificate
                      ? formData.experienceCertificate.name
                      : "Upload certificate"}
                  </span>

                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={(event) =>
                      handleFileChange(event, "experienceCertificate")
                    }
                  />
                </label>
              </div>

              <div className="professional-field">
                <label>Qualification / Skill Certificate</label>

                <label className="professional-mini-upload">
                  <Upload size={17} />

                  <span>
                    {formData.qualificationCertificate
                      ? formData.qualificationCertificate.name
                      : "Upload certificate"}
                  </span>

                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={(event) =>
                      handleFileChange(event, "qualificationCertificate")
                    }
                  />
                </label>
              </div>
            </div>

            <div className="professional-document-note">
              <FileText size={18} />

              <div>
                <strong>Document verification</strong>

                <p>
                  Your uploaded documents will be used only for professional
                  verification and account onboarding.
                </p>
              </div>
            </div>
          </section>

          {/* =========================================================
              SECTION 05 — AVAILABILITY
          ========================================================= */}

          <section className="professional-form-section">
            <div className="professional-section-heading">
              <div className="professional-section-number">05</div>

              <div>
                <span>AVAILABILITY</span>
                <h2>When can customers book you?</h2>
                <p>
                  Set your normal working schedule and emergency availability.
                </p>
              </div>
            </div>

            <div className="professional-form-grid">
              <div className="professional-field full-width">
                <label>Preferred Work Type *</label>

                <div className="professional-radio-grid">
                  {[
                    {
                      value: "full-time",
                      title: "Full Time",
                      description: "Available for regular service requests.",
                    },
                    {
                      value: "part-time",
                      title: "Part Time",
                      description: "Available during selected hours.",
                    },
                    {
                      value: "both",
                      title: "Flexible",
                      description: "Available based on request and schedule.",
                    },
                  ].map((option) => (
                    <label
                      key={option.value}
                      className={`professional-radio-card ${
                        formData.workType === option.value
                          ? "selected"
                          : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name="workType"
                        value={option.value}
                        checked={formData.workType === option.value}
                        onChange={handleTextChange}
                      />

                      <div>
                        <strong>{option.title}</strong>
                        <span>{option.description}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="professional-field full-width">
                <label>Working Days *</label>

                <div className="professional-days-grid">
                  {days.map((day) => (
                    <label
                      key={day}
                      className={`professional-day-option ${
                        formData.workingDays.includes(day)
                          ? "selected"
                          : ""
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.workingDays.includes(day)}
                        onChange={() => toggleWorkingDay(day)}
                      />

                      <span>{day.slice(0, 3)}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="professional-field">
                <label>Start Time *</label>

                <input
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleTextChange}
                />
              </div>

              <div className="professional-field">
                <label>End Time *</label>

                <input
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleTextChange}
                />
              </div>

              <div className="professional-field full-width">
                <label>Emergency Service Availability *</label>

                <div className="professional-radio-grid">
                  <label
                    className={`professional-radio-card ${
                      formData.emergencyAvailability === "yes"
                        ? "selected"
                        : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="emergencyAvailability"
                      value="yes"
                      checked={
                        formData.emergencyAvailability === "yes"
                      }
                      onChange={handleTextChange}
                    />

                    <div>
                      <strong>Yes, I can take emergency requests</strong>
                      <span>
                        You may receive urgent service requests outside
                        regular hours.
                      </span>
                    </div>
                  </label>

                  <label
                    className={`professional-radio-card ${
                      formData.emergencyAvailability === "no"
                        ? "selected"
                        : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="emergencyAvailability"
                      value="no"
                      checked={
                        formData.emergencyAvailability === "no"
                      }
                      onChange={handleTextChange}
                    />

                    <div>
                      <strong>No, regular requests only</strong>
                      <span>
                        You will receive requests within your selected
                        schedule.
                      </span>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </section>

          {/* =========================================================
              SECTION 06 — ACCOUNT SECURITY
          ========================================================= */}

          <section className="professional-form-section">
            <div className="professional-section-heading">
              <div className="professional-section-number">06</div>

              <div>
                <span>ACCOUNT SECURITY</span>
                <h2>Create your login</h2>
                <p>
                  Use these credentials to access your professional dashboard.
                </p>
              </div>
            </div>

            <div className="professional-form-grid">
              <div className="professional-field">
                <label>Password *</label>

                <div className="professional-password-input">
                  <LockKeyhole size={17} />

                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleTextChange}
                    placeholder="Minimum 8 characters"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((previous) => !previous)
                    }
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={17} />
                    ) : (
                      <Eye size={17} />
                    )}
                  </button>
                </div>
              </div>

              <div className="professional-field">
                <label>Confirm Password *</label>

                <div className="professional-password-input">
                  <LockKeyhole size={17} />

                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleTextChange}
                    placeholder="Re-enter your password"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        (previous) => !previous
                      )
                    }
                    aria-label={
                      showConfirmPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={17} />
                    ) : (
                      <Eye size={17} />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* =========================================================
              TERMS & SUBMISSION
          ========================================================= */}

          <section className="professional-submit-section">
            <div className="professional-consent-box">
              <label>
                <input
                  type="checkbox"
                  name="terms"
                  checked={formData.terms}
                  onChange={handleCheckboxChange}
                />

                <span className="professional-custom-check">
                  {formData.terms && <Check size={13} />}
                </span>

                <span>
                  I agree to the{" "}
                  <Link to="/terms">Terms & Conditions</Link> and{" "}
                  <Link to="/privacy">Privacy Policy</Link>.
                </span>
              </label>

              <label>
                <input
                  type="checkbox"
                  name="verificationConsent"
                  checked={formData.verificationConsent}
                  onChange={handleCheckboxChange}
                />

                <span className="professional-custom-check">
                  {formData.verificationConsent && (
                    <Check size={13} />
                  )}
                </span>

                <span>
                  I consent to NeedOneService verifying the information and
                  documents submitted in this application.
                </span>
              </label>
            </div>

            <div className="professional-submit-footer">
              <div className="professional-submit-note">
                <Phone size={16} />

                <span>
                  Our team may contact you after reviewing your application.
                </span>
              </div>

              <button
                type="submit"
                className="professional-submit-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="professional-spinner" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Application
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </div>
          </section>
        </form>
      </section>

      <footer className="professional-register-footer">
        <span>© OneService</span>
        <span>Professional Registration</span>
      </footer>
    </main>
  );
}

export default ProfessionalRegisterPage;