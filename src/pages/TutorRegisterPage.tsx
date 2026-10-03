import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Link } from "react-router-dom";
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

const levelOptions = [
  "Beginner",
  "Intermediate",
  "Advanced",
  "All Levels",
];

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

const inputClass = "tutor-input";

export default function TutorRegisterPage() {

  const [formData, setFormData] = useState<TutorFormData>(initialForm);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = event.target;

    if (type === "checkbox") {
      const checked = (event.target as HTMLInputElement).checked;

      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));

      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (
    event: ChangeEvent<HTMLInputElement>,
    field: keyof TutorFormData
  ) => {
    const file = event.target.files?.[0] ?? null;

    setFormData((prev) => ({
      ...prev,
      [field]: file,
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    if (!formData.terms || !formData.verificationConsent) {
      alert("Please accept the required terms and verification consent.");
      return;
    }

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <main className="tutor-page tutor-success-page">
        <div className="tutor-success-card">
          <div className="tutor-success-icon">
            <Check size={34} />
          </div>

          <span className="tutor-success-label">
            REGISTRATION SUBMITTED
          </span>

          <h1>Welcome to the OneService Tutor Network</h1>

          <p>
            Your tutor registration has been submitted successfully. Our team
            will review your profile and verification details before activation.
          </p>

          <div className="tutor-success-actions">
            <Link to="/" className="tutor-primary-button">
              Back to Home
              <ArrowRight size={17} />
            </Link>

            <Link to="/login" className="tutor-secondary-button">
              Go to Login
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="tutor-page">
      <section className="tutor-hero">
        <div className="tutor-hero-content">
          <span className="tutor-eyebrow">JOIN OUR NETWORK</span>

          <h1>
            Share Your Knowledge.
            <br />
            <span>Teach. Inspire. Grow.</span>
          </h1>

          <p>
            Register as a tutor and help students build practical skills,
            knowledge and careers through NeedOneService.
          </p>

          <div className="tutor-hero-points">
            <div>
              <Check size={15} />
              Teach your expertise
            </div>

            <div>
              <Check size={15} />
              Flexible teaching options
            </div>

            <div>
              <Check size={15} />
              Build your tutor profile
            </div>
          </div>
        </div>
      </section>

      <section className="tutor-form-section">
        <form className="tutor-form" onSubmit={handleSubmit}>
          {/* PERSONAL INFORMATION */}

          <div className="tutor-form-header">
            <span>STEP 01</span>
            <h2>Personal Information</h2>
            <p>Tell us a little about yourself.</p>
          </div>

          <div className="tutor-form-grid">
            <div className="tutor-field tutor-field-full">
              <label>Full Name *</label>
              <div className="tutor-input-icon">
                <UserRound size={17} />
                <input
                  className={inputClass}
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>
            </div>

            <div className="tutor-field">
              <label>Mobile Number *</label>
              <div className="tutor-input-icon">
                <Phone size={17} />
                <input
                  className={inputClass}
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  placeholder="Enter mobile number"
                  type="tel"
                  required
                />
              </div>
            </div>

            <div className="tutor-field">
              <label>WhatsApp Number</label>
              <div className="tutor-input-icon">
                <Phone size={17} />
                <input
                  className={inputClass}
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleChange}
                  placeholder="WhatsApp number"
                  type="tel"
                />
              </div>
            </div>

            <div className="tutor-field">
              <label>Email Address *</label>
              <div className="tutor-input-icon">
                <Mail size={17} />
                <input
                  className={inputClass}
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email address"
                  type="email"
                  required
                />
              </div>
            </div>

            <div className="tutor-field">
              <label>Date of Birth</label>
              <input
                className={inputClass}
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                type="date"
              />
            </div>

            <div className="tutor-field">
              <label>Gender</label>
              <select
                className={inputClass}
                name="gender"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="">Select gender</option>
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="other">Other</option>
                <option value="prefer-not-to-say">
                  Prefer not to say
                </option>
              </select>
            </div>

            <div className="tutor-field tutor-field-full">
              <label>Profile Photo</label>

              <label className="tutor-upload-box">
                <Upload size={20} />
                <span>
                  {formData.profilePhoto
                    ? formData.profilePhoto.name
                    : "Upload a professional profile photo"}
                </span>

                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(event) =>
                    handleFileChange(event, "profilePhoto")
                  }
                />
              </label>
            </div>
          </div>

          {/* ADDRESS */}

          <div className="tutor-form-header tutor-section-gap">
            <span>STEP 02</span>
            <h2>Address Information</h2>
            <p>Where are you based?</p>
          </div>

          <div className="tutor-form-grid">
            <div className="tutor-field tutor-field-full">
              <label>Address *</label>

              <div className="tutor-input-icon tutor-textarea-icon">
                <MapPin size={17} />

                <textarea
                  className={inputClass}
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter your complete address"
                  rows={3}
                  required
                />
              </div>
            </div>

            <div className="tutor-field">
              <label>City *</label>
              <input
                className={inputClass}
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="City"
                required
              />
            </div>

            <div className="tutor-field">
              <label>State *</label>
              <input
                className={inputClass}
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="State"
                required
              />
            </div>

            <div className="tutor-field">
              <label>Pincode *</label>
              <input
                className={inputClass}
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                placeholder="Pincode"
                inputMode="numeric"
                required
              />
            </div>
          </div>

          {/* EXPERTISE */}

          <div className="tutor-form-header tutor-section-gap">
            <span>STEP 03</span>
            <h2>Expertise & Qualifications</h2>
            <p>Tell us what you can teach.</p>
          </div>

          <div className="tutor-form-grid">
            <div className="tutor-field">
              <label>Primary Expertise *</label>
              <select
                className={inputClass}
                name="expertise"
                value={formData.expertise}
                onChange={handleChange}
                required
              >
                <option value="">Select expertise</option>
                {expertiseOptions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className="tutor-field">
              <label>Secondary Expertise</label>
              <select
                className={inputClass}
                name="secondaryExpertise"
                value={formData.secondaryExpertise}
                onChange={handleChange}
              >
                <option value="">Select expertise</option>
                {expertiseOptions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className="tutor-field">
              <label>Highest Qualification *</label>
              <input
                className={inputClass}
                name="qualification"
                value={formData.qualification}
                onChange={handleChange}
                placeholder="e.g. Diploma, B.Tech, ITI"
                required
              />
            </div>

            <div className="tutor-field">
              <label>Specialization</label>
              <input
                className={inputClass}
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                placeholder="Your specialization"
              />
            </div>

            <div className="tutor-field tutor-field-full">
              <label>Certifications</label>
              <textarea
                className={inputClass}
                name="certifications"
                value={formData.certifications}
                onChange={handleChange}
                placeholder="List relevant certifications or training"
                rows={3}
              />
            </div>
          </div>

          {/* TEACHING EXPERIENCE */}

          <div className="tutor-form-header tutor-section-gap">
            <span>STEP 04</span>
            <h2>Teaching Experience</h2>
            <p>Help us understand your teaching background.</p>
          </div>

          <div className="tutor-form-grid">
            <div className="tutor-field">
              <label>Teaching Experience *</label>
              <select
                className={inputClass}
                name="teachingExperience"
                value={formData.teachingExperience}
                onChange={handleChange}
                required
              >
                <option value="">Select experience</option>
                {experienceOptions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className="tutor-field">
              <label>Current Occupation</label>
              <input
                className={inputClass}
                name="currentOccupation"
                value={formData.currentOccupation}
                onChange={handleChange}
                placeholder="Current profession"
              />
            </div>

            <div className="tutor-field tutor-field-full">
              <label>Previous Teaching Experience</label>
              <textarea
                className={inputClass}
                name="previousTeachingExperience"
                value={formData.previousTeachingExperience}
                onChange={handleChange}
                placeholder="Describe your previous teaching, training or mentoring experience"
                rows={4}
              />
            </div>
          </div>

          {/* TEACHING PREFERENCES */}

          <div className="tutor-form-header tutor-section-gap">
            <span>STEP 05</span>
            <h2>Teaching Preferences</h2>
            <p>Tell us how you would like to teach.</p>
          </div>

          <div className="tutor-form-grid">
            <div className="tutor-field">
              <label>Teaching Format *</label>
              <select
                className={inputClass}
                name="teachingFormat"
                value={formData.teachingFormat}
                onChange={handleChange}
                required
              >
                <option value="">Select format</option>
                <option value="individual">Individual Classes</option>
                <option value="group">Group Classes</option>
                <option value="both">Individual & Group</option>
              </select>
            </div>

            <div className="tutor-field">
              <label>Preferred Mode *</label>
              <select
                className={inputClass}
                name="preferredMode"
                value={formData.preferredMode}
                onChange={handleChange}
                required
              >
                <option value="">Select mode</option>
                <option value="online">Online</option>
                <option value="offline">Offline</option>
                <option value="both">Online & Offline</option>
              </select>
            </div>

            <div className="tutor-field">
              <label>Preferred Days</label>
              <input
                className={inputClass}
                name="preferredDays"
                value={formData.preferredDays}
                onChange={handleChange}
                placeholder="e.g. Mon–Fri"
              />
            </div>

            <div className="tutor-field">
              <label>Preferred Time</label>
              <input
                className={inputClass}
                name="preferredTime"
                value={formData.preferredTime}
                onChange={handleChange}
                placeholder="e.g. 6 PM – 9 PM"
              />
            </div>

            <div className="tutor-field tutor-field-full">
              <label>Availability</label>
              <textarea
                className={inputClass}
                name="availability"
                value={formData.availability}
                onChange={handleChange}
                placeholder="Describe your general availability"
                rows={3}
              />
            </div>
          </div>

          {/* COURSE DETAILS */}

          <div className="tutor-form-header tutor-section-gap">
            <span>STEP 06</span>
            <h2>Course & Training Details</h2>
            <p>Describe what you would like to teach.</p>
          </div>

          <div className="tutor-form-grid">
            <div className="tutor-field tutor-field-full">
              <label>Course / Training Title *</label>
              <input
                className={inputClass}
                name="courseTitle"
                value={formData.courseTitle}
                onChange={handleChange}
                placeholder="e.g. Basic AC Repair Training"
                required
              />
            </div>

            <div className="tutor-field tutor-field-full">
              <label>Course Description *</label>
              <textarea
                className={inputClass}
                name="courseDescription"
                value={formData.courseDescription}
                onChange={handleChange}
                placeholder="Describe what students will learn"
                rows={5}
                required
              />
            </div>

            <div className="tutor-field">
              <label>Course Level *</label>
              <select
                className={inputClass}
                name="courseLevel"
                value={formData.courseLevel}
                onChange={handleChange}
                required
              >
                <option value="">Select level</option>
                {levelOptions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className="tutor-field">
              <label>Course Duration</label>
              <input
                className={inputClass}
                name="courseDuration"
                value={formData.courseDuration}
                onChange={handleChange}
                placeholder="e.g. 4 weeks"
              />
            </div>

            <div className="tutor-field">
              <label>Session Frequency</label>
              <input
                className={inputClass}
                name="sessionFrequency"
                value={formData.sessionFrequency}
                onChange={handleChange}
                placeholder="e.g. 3 sessions/week"
              />
            </div>

            <div className="tutor-field">
              <label>Practical Training</label>
              <select
                className={inputClass}
                name="practicalTraining"
                value={formData.practicalTraining}
                onChange={handleChange}
              >
                <option value="">Select</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
                <option value="partially">Partially</option>
              </select>
            </div>

            <div className="tutor-field">
              <label>Certification Provided</label>
              <select
                className={inputClass}
                name="certificationProvided"
                value={formData.certificationProvided}
                onChange={handleChange}
              >
                <option value="">Select</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
                <option value="planned">Planned</option>
              </select>
            </div>
          </div>

          {/* DOCUMENTS */}

          <div className="tutor-form-header tutor-section-gap">
            <span>STEP 07</span>
            <h2>Document Verification</h2>
            <p>Upload documents that support your qualifications.</p>
          </div>

          <div className="tutor-document-grid">
            <label className="tutor-document-card">
              <FileText size={22} />

              <strong>Qualification Proof</strong>

              <span>
                {formData.qualificationProof
                  ? formData.qualificationProof.name
                  : "Upload certificate or qualification document"}
              </span>

              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(event) =>
                  handleFileChange(event, "qualificationProof")
                }
              />
            </label>

            <label className="tutor-document-card">
              <FileText size={22} />

              <strong>Experience Proof</strong>

              <span>
                {formData.experienceProof
                  ? formData.experienceProof.name
                  : "Upload teaching or work experience proof"}
              </span>

              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(event) =>
                  handleFileChange(event, "experienceProof")
                }
              />
            </label>

            <label className="tutor-document-card">
              <FileText size={22} />

              <strong>Supporting Document</strong>

              <span>
                {formData.profileDocument
                  ? formData.profileDocument.name
                  : "Upload any relevant supporting document"}
              </span>

              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(event) =>
                  handleFileChange(event, "profileDocument")
                }
              />
            </label>
          </div>

          {/* ACCOUNT */}

          <div className="tutor-form-header tutor-section-gap">
            <span>STEP 08</span>
            <h2>Account Security</h2>
            <p>Create your NeedOneService tutor account.</p>
          </div>

          <div className="tutor-form-grid">
            <div className="tutor-field">
              <label>Password *</label>

              <div className="tutor-input-icon tutor-password-field">
                <LockKeyhole size={17} />

                <input
                  className={inputClass}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create password"
                  type={showPassword ? "text" : "password"}
                  minLength={6}
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? (
                    <EyeOff size={17} />
                  ) : (
                    <Eye size={17} />
                  )}
                </button>
              </div>
            </div>

            <div className="tutor-field">
              <label>Confirm Password *</label>

              <div className="tutor-input-icon tutor-password-field">
                <LockKeyhole size={17} />

                <input
                  className={inputClass}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm password"
                  type={showConfirmPassword ? "text" : "password"}
                  minLength={6}
                  required
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword((prev) => !prev)
                  }
                  aria-label="Toggle confirm password visibility"
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

          {/* CONSENT */}

          <div className="tutor-consent-section">
            <label className="tutor-checkbox">
              <input
                type="checkbox"
                name="terms"
                checked={formData.terms}
                onChange={handleChange}
                required
              />

              <span>
                I agree to the{" "}
                <Link to="/terms">Terms & Conditions</Link> and
                NeedOneService tutor guidelines.
              </span>
            </label>

            <label className="tutor-checkbox">
              <input
                type="checkbox"
                name="verificationConsent"
                checked={formData.verificationConsent}
                onChange={handleChange}
                required
              />

              <span>
                I consent to NeedOneService verifying the information and
                documents submitted in this registration.
              </span>
            </label>
          </div>

          <div className="tutor-submit-area">
            <button type="submit" className="tutor-submit-button">
              Submit Tutor Registration
              <ArrowRight size={18} />
            </button>

            <p>
              Already have an account?{" "}
              <Link to="/login">Login here</Link>
            </p>
          </div>
        </form>
      </section>
    </main>
  );
}