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
import "./StudentRegisterPage.css";

type StudentFormData = {
  fullName: string;
  mobile: string;
  whatsapp: string;
  email: string;
  dob: string;
  gender: string;

  address: string;
  city: string;
  state: string;
  pincode: string;

  educationLevel: string;
  course: string;
  institution: string;
  specialization: string;
  graduationYear: string;

  skills: string;
  experienceLevel: string;
  interestedAreas: string[];

  learningFormat: string;
  preferredMode: string;
  preferredDays: string[];
  preferredTime: string;

  availability: string;

  learningGoals: string[];
  careerGoal: string;
  certificationInterest: string;

  profilePhoto: File | null;
  educationProof: File | null;

  password: string;
  confirmPassword: string;

  terms: boolean;
  consent: boolean;
};

const initialFormData: StudentFormData = {
  fullName: "",
  mobile: "",
  whatsapp: "",
  email: "",
  dob: "",
  gender: "",

  address: "",
  city: "",
  state: "",
  pincode: "",

  educationLevel: "",
  course: "",
  institution: "",
  specialization: "",
  graduationYear: "",

  skills: "",
  experienceLevel: "",
  interestedAreas: [],

  learningFormat: "",
  preferredMode: "",
  preferredDays: [],
  preferredTime: "",

  availability: "",

  learningGoals: [],
  careerGoal: "",
  certificationInterest: "",

  profilePhoto: null,
  educationProof: null,

  password: "",
  confirmPassword: "",

  terms: false,
  consent: false,
};

const interestOptions = [
  "AC & Cooling",
  "Electrical",
  "Plumbing",
  "Carpentry",
  "Home Appliances",
  "Cleaning",
  "Water Purification",
  "Refrigeration",
  "Washing Machine Repair",
  "TV Repair",
  "Home Maintenance",
  "Other",
];

const learningGoals = [
  "Learn a new skill",
  "Improve existing skills",
  "Get certified",
  "Become a technician",
  "Find employment",
  "Start a service business",
  "Work as a freelancer",
  "Build practical experience",
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

function StudentRegisterPage() {
  const navigate = useNavigate();

  const [formData, setFormData] =
    useState<StudentFormData>(initialFormData);

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
    field: "profilePhoto" | "educationProof"
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

  const toggleInterest = (value: string) => {
    setFormData((previous) => {
      const exists = previous.interestedAreas.includes(value);

      return {
        ...previous,
        interestedAreas: exists
          ? previous.interestedAreas.filter(
              (item) => item !== value
            )
          : [...previous.interestedAreas, value],
      };
    });

    setError("");
  };

  const toggleDay = (day: string) => {
    setFormData((previous) => {
      const exists = previous.preferredDays.includes(day);

      return {
        ...previous,
        preferredDays: exists
          ? previous.preferredDays.filter(
              (item) => item !== day
            )
          : [...previous.preferredDays, day],
      };
    });

    setError("");
  };

  const toggleGoal = (goal: string) => {
    setFormData((previous) => {
      const exists = previous.learningGoals.includes(goal);

      return {
        ...previous,
        learningGoals: exists
          ? previous.learningGoals.filter(
              (item) => item !== goal
            )
          : [...previous.learningGoals, goal],
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

    if (!formData.email.trim()) {
      return "Please enter your email address.";
    }

    if (!formData.dob) {
      return "Please enter your date of birth.";
    }

    if (!formData.gender) {
      return "Please select your gender.";
    }

    if (!formData.address.trim()) {
      return "Please enter your address.";
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

    if (!formData.educationLevel) {
      return "Please select your education level.";
    }

    if (!formData.course.trim()) {
      return "Please enter your current or most recent course.";
    }

    if (!formData.institution.trim()) {
      return "Please enter your institution.";
    }

    if (!formData.experienceLevel) {
      return "Please select your experience level.";
    }

    if (!formData.interestedAreas.length) {
      return "Please select at least one area you are interested in.";
    }

    if (!formData.learningFormat) {
      return "Please select your preferred learning format.";
    }

    if (!formData.preferredMode) {
      return "Please select your preferred learning mode.";
    }

    if (!formData.preferredDays.length) {
      return "Please select your preferred learning days.";
    }

    if (!formData.preferredTime) {
      return "Please select your preferred learning time.";
    }

    if (!formData.availability.trim()) {
      return "Please describe your availability.";
    }

    if (!formData.learningGoals.length) {
      return "Please select at least one learning goal.";
    }

    if (!formData.careerGoal.trim()) {
      return "Please describe your career goal.";
    }

    if (!formData.certificationInterest) {
      return "Please select your certification preference.";
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

    if (!formData.consent) {
      return "Please provide consent for your information to be reviewed.";
    }

    return "";
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
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
      <main className="student-register-page">
        <section className="student-success-section">
          <div className="student-success-card">
            <div className="student-success-icon">
              <Check size={34} />
            </div>

            <span className="student-eyebrow">
              REGISTRATION SUBMITTED
            </span>

            <h1>
              Your learning journey starts here.
            </h1>

            <p>
              Your student registration has been submitted
              successfully. Our team can review your profile
              and help connect you with relevant learning and
              training opportunities.
            </p>

            <div className="student-success-summary">
              <div>
                <span>Student</span>
                <strong>{formData.fullName}</strong>
              </div>

              <div>
                <span>Interest</span>
                <strong>
                  {formData.interestedAreas[0]}
                </strong>
              </div>

              <div>
                <span>Goal</span>
                <strong>
                  {formData.learningGoals[0]}
                </strong>
              </div>
            </div>

            <div className="student-success-actions">
              <Link
                to="/"
                className="student-secondary-button"
              >
                Back to Home
              </Link>

              <button
                type="button"
                className="student-primary-button"
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
    <main className="student-register-page">
      {/* HERO */}
      <section className="student-register-hero">
        <div className="student-register-hero-inner">
          <div>
            <span className="student-eyebrow">
              STUDENT REGISTRATION
            </span>

            <h1>
              Learn skills.
              <br />
              Build your <span>future.</span>
            </h1>

            <p>
              Join the NeedOneService learning network to develop
              practical skills, gain experience, get trained
              and explore career opportunities.
            </p>
          </div>

          <div className="student-hero-badge">
            <div className="student-hero-badge-icon">
              <FileText size={21} />
            </div>

            <div>
              <strong>Learning Network</strong>
              <span>
                Skills, training & career development
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="student-register-content">
        <div className="student-register-container">
          <div className="student-register-top">
            <div>
              <span className="student-section-label">
                JOIN OUR NETWORK
              </span>

              <h2>Create your student profile</h2>

              <p>
                Tell us about yourself and what you want to
                learn.
              </p>
            </div>

            <div className="student-login-note">
              Already registered?
              <Link to="/login"> Sign in</Link>
            </div>
          </div>

          {/* PROGRESS */}
          <div className="student-progress">
            <ProgressItem number="01" label="Personal" />
            <ProgressLine />
            <ProgressItem number="02" label="Education" />
            <ProgressLine />
            <ProgressItem number="03" label="Skills" />
            <ProgressLine />
            <ProgressItem number="04" label="Learning" />
            <ProgressLine />
            <ProgressItem number="05" label="Goals" />
          </div>

          <form
            className="student-register-form"
            onSubmit={handleSubmit}
          >
            {error && (
              <div className="student-form-error">
                {error}
              </div>
            )}

            {/* PERSONAL */}
            <section className="student-form-section">
              <SectionHeading
                number="01"
                title="Personal information"
                description="Tell us a little about yourself."
              />

              <div className="student-form-grid">
                <label className="student-field student-field-full">
                  <span>Full name *</span>

                  <div className="student-input-wrap">
                    <UserRound size={17} />

                    <input
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleTextChange}
                      placeholder="Enter your full name"
                    />
                  </div>
                </label>

                <label className="student-field">
                  <span>Mobile number *</span>

                  <div className="student-input-wrap">
                    <Phone size={17} />

                    <span className="student-country-code">
                      +91
                    </span>

                    <input
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleTextChange}
                      maxLength={10}
                      placeholder="10-digit mobile"
                    />
                  </div>
                </label>

                <label className="student-field">
                  <span>WhatsApp number</span>

                  <input
                    name="whatsapp"
                    value={formData.whatsapp}
                    onChange={handleTextChange}
                    maxLength={10}
                    placeholder="WhatsApp number"
                  />
                </label>

                <label className="student-field student-field-full">
                  <span>Email address *</span>

                  <div className="student-input-wrap">
                    <Mail size={17} />

                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleTextChange}
                      placeholder="student@example.com"
                    />
                  </div>
                </label>

                <label className="student-field">
                  <span>Date of birth *</span>

                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleTextChange}
                  />
                </label>

                <label className="student-field">
                  <span>Gender *</span>

                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleTextChange}
                  >
                    <option value="">
                      Select gender
                    </option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer-not-to-say">
                      Prefer not to say
                    </option>
                  </select>
                </label>

                <label className="student-field student-field-full">
                  <span>Address *</span>

                  <div className="student-input-wrap student-textarea-wrap">
                    <MapPin size={17} />

                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleTextChange}
                      placeholder="Enter your complete address"
                      rows={4}
                    />
                  </div>
                </label>

                <label className="student-field">
                  <span>City *</span>

                  <input
                    name="city"
                    value={formData.city}
                    onChange={handleTextChange}
                    placeholder="Enter city"
                  />
                </label>

                <label className="student-field">
                  <span>State *</span>

                  <input
                    name="state"
                    value={formData.state}
                    onChange={handleTextChange}
                    placeholder="Enter state"
                  />
                </label>

                <label className="student-field">
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

            {/* EDUCATION */}
            <section className="student-form-section">
              <SectionHeading
                number="02"
                title="Education"
                description="Tell us about your current or most recent education."
              />

              <div className="student-form-grid">
                <label className="student-field">
                  <span>Education level *</span>

                  <select
                    name="educationLevel"
                    value={formData.educationLevel}
                    onChange={handleTextChange}
                  >
                    <option value="">
                      Select education level
                    </option>
                    <option value="school">
                      School
                    </option>
                    <option value="intermediate">
                      Intermediate / 12th
                    </option>
                    <option value="iti">ITI</option>
                    <option value="diploma">Diploma</option>
                    <option value="undergraduate">
                      Undergraduate
                    </option>
                    <option value="postgraduate">
                      Postgraduate
                    </option>
                    <option value="vocational">
                      Vocational Training
                    </option>
                    <option value="other">Other</option>
                  </select>
                </label>

                <label className="student-field">
                  <span>Course / program *</span>

                  <input
                    name="course"
                    value={formData.course}
                    onChange={handleTextChange}
                    placeholder="e.g. Diploma in Electrical"
                  />
                </label>

                <label className="student-field">
                  <span>Institution *</span>

                  <input
                    name="institution"
                    value={formData.institution}
                    onChange={handleTextChange}
                    placeholder="College / school / institute"
                  />
                </label>

                <label className="student-field">
                  <span>Specialization</span>

                  <input
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleTextChange}
                    placeholder="Your specialization"
                  />
                </label>

                <label className="student-field">
                  <span>Graduation / completion year</span>

                  <input
                    name="graduationYear"
                    value={formData.graduationYear}
                    onChange={handleTextChange}
                    placeholder="e.g. 2027"
                  />
                </label>

                <FileUpload
                  label="Education proof"
                  file={formData.educationProof}
                  onChange={(event) =>
                    handleFileChange(
                      event,
                      "educationProof"
                    )
                  }
                  hint="Optional — PDF, JPG or PNG"
                />
              </div>
            </section>

            {/* SKILLS */}
            <section className="student-form-section">
              <SectionHeading
                number="03"
                title="Skills & interests"
                description="Choose the service areas you want to learn or develop."
              />

              <div className="student-form-grid">
                <label className="student-field">
                  <span>Experience level *</span>

                  <select
                    name="experienceLevel"
                    value={formData.experienceLevel}
                    onChange={handleTextChange}
                  >
                    <option value="">
                      Select experience
                    </option>
                    <option value="beginner">
                      Beginner
                    </option>
                    <option value="some-knowledge">
                      Some knowledge
                    </option>
                    <option value="intermediate">
                      Intermediate
                    </option>
                    <option value="experienced">
                      Experienced
                    </option>
                  </select>
                </label>

                <label className="student-field">
                  <span>Current skills</span>

                  <input
                    name="skills"
                    value={formData.skills}
                    onChange={handleTextChange}
                    placeholder="e.g. basic wiring, tools"
                  />
                </label>

                <div className="student-field student-field-full">
                  <span>
                    Areas you are interested in *
                  </span>

                  <div className="student-chip-grid">
                    {interestOptions.map((interest) => {
                      const selected =
                        formData.interestedAreas.includes(
                          interest
                        );

                      return (
                        <button
                          key={interest}
                          type="button"
                          className={`student-chip ${
                            selected ? "selected" : ""
                          }`}
                          onClick={() =>
                            toggleInterest(interest)
                          }
                        >
                          {selected && <Check size={14} />}
                          {interest}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </section>

            {/* LEARNING */}
            <section className="student-form-section">
              <SectionHeading
                number="04"
                title="Learning preferences"
                description="Help us understand how and when you prefer to learn."
              />

              <div className="student-form-grid">
                <label className="student-field">
                  <span>Learning format *</span>

                  <select
                    name="learningFormat"
                    value={formData.learningFormat}
                    onChange={handleTextChange}
                  >
                    <option value="">
                      Select format
                    </option>
                    <option value="online">
                      Online
                    </option>
                    <option value="offline">
                      Offline
                    </option>
                    <option value="both">
                      Online & Offline
                    </option>
                  </select>
                </label>

                <label className="student-field">
                  <span>Preferred mode *</span>

                  <select
                    name="preferredMode"
                    value={formData.preferredMode}
                    onChange={handleTextChange}
                  >
                    <option value="">
                      Select mode
                    </option>
                    <option value="live">
                      Live classes
                    </option>
                    <option value="self-paced">
                      Self-paced learning
                    </option>
                    <option value="practical">
                      Practical training
                    </option>
                    <option value="mixed">
                      Mixed learning
                    </option>
                  </select>
                </label>

                <div className="student-field student-field-full">
                  <span>Preferred learning days *</span>

                  <div className="student-chip-grid">
                    {days.map((day) => {
                      const selected =
                        formData.preferredDays.includes(day);

                      return (
                        <button
                          key={day}
                          type="button"
                          className={`student-chip ${
                            selected ? "selected" : ""
                          }`}
                          onClick={() => toggleDay(day)}
                        >
                          {selected && <Check size={14} />}
                          {day}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <label className="student-field">
                  <span>Preferred time *</span>

                  <select
                    name="preferredTime"
                    value={formData.preferredTime}
                    onChange={handleTextChange}
                  >
                    <option value="">
                      Select time
                    </option>
                    <option value="morning">
                      Morning
                    </option>
                    <option value="afternoon">
                      Afternoon
                    </option>
                    <option value="evening">
                      Evening
                    </option>
                    <option value="weekends">
                      Weekends
                    </option>
                  </select>
                </label>

                <label className="student-field">
                  <span>Availability *</span>

                  <input
                    name="availability"
                    value={formData.availability}
                    onChange={handleTextChange}
                    placeholder="e.g. 6 PM to 9 PM on weekdays"
                  />
                </label>
              </div>
            </section>

            {/* GOALS */}
            <section className="student-form-section">
              <SectionHeading
                number="05"
                title="Goals & career direction"
                description="Tell us what you want to achieve through OneService."
              />

              <div className="student-form-grid">
                <div className="student-field student-field-full">
                  <span>What do you want to achieve? *</span>

                  <div className="student-chip-grid">
                    {learningGoals.map((goal) => {
                      const selected =
                        formData.learningGoals.includes(goal);

                      return (
                        <button
                          key={goal}
                          type="button"
                          className={`student-chip ${
                            selected ? "selected" : ""
                          }`}
                          onClick={() => toggleGoal(goal)}
                        >
                          {selected && <Check size={14} />}
                          {goal}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <label className="student-field student-field-full">
                  <span>Career goal *</span>

                  <textarea
                    name="careerGoal"
                    value={formData.careerGoal}
                    onChange={handleTextChange}
                    placeholder="Tell us what kind of career or work you want to build..."
                    rows={4}
                  />
                </label>

                <label className="student-field">
                  <span>Certification interest *</span>

                  <select
                    name="certificationInterest"
                    value={formData.certificationInterest}
                    onChange={handleTextChange}
                  >
                    <option value="">
                      Select preference
                    </option>
                    <option value="yes">
                      Yes, I want certification
                    </option>
                    <option value="maybe">
                      Maybe, depending on the course
                    </option>
                    <option value="no">
                      No, skills are my priority
                    </option>
                  </select>
                </label>

                <FileUpload
                  label="Profile photo"
                  file={formData.profilePhoto}
                  onChange={(event) =>
                    handleFileChange(
                      event,
                      "profilePhoto"
                    )
                  }
                  hint="Optional — JPG or PNG"
                />
              </div>
            </section>

            {/* SECURITY */}
            <section className="student-form-section">
              <SectionHeading
                number="06"
                title="Account security"
                description="Create your secure OneService student account."
              />

              <div className="student-form-grid">
                <label className="student-field">
                  <span>Password *</span>

                  <div className="student-input-wrap">
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
                      className="student-password-button"
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

                <label className="student-field">
                  <span>Confirm password *</span>

                  <div className="student-input-wrap">
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
                      className="student-password-button"
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

            {/* CONSENT */}
            <section className="student-consent-section">
              <label className="student-check-row">
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

              <label className="student-check-row">
                <input
                  type="checkbox"
                  name="consent"
                  checked={formData.consent}
                  onChange={handleCheckboxChange}
                />

                <span>
                  I consent to NeedOneService reviewing my
                  registration information for learning,
                  training and career opportunities.
                </span>
              </label>
            </section>

            {/* SUBMIT */}
            <div className="student-submit-area">
              <div className="student-submit-note">
                <FileText size={17} />

                <span>
                  You can update your student profile after
                  registration.
                </span>
              </div>

              <button
                type="submit"
                className="student-submit-button"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? "Submitting..."
                  : "Create Student Profile"}

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

/* =========================================================
   REUSABLE UI
========================================================= */

function SectionHeading({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="student-form-heading">
      <div className="student-form-number">{number}</div>

      <div>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

function ProgressItem({
  number,
  label,
}: {
  number: string;
  label: string;
}) {
  return (
    <div className="student-progress-item active">
      <span>{number}</span>
      <strong>{label}</strong>
    </div>
  );
}

function ProgressLine() {
  return <div className="student-progress-line" />;
}

function FileUpload({
  label,
  file,
  onChange,
  hint,
}: {
  label: string;
  file: File | null;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  hint: string;
}) {
  return (
    <label className="student-file-upload">
      <span>{label}</span>

      <div className="student-file-box">
        <Upload size={18} />

        <div>
          <strong>
            {file ? file.name : "Choose a document"}
          </strong>

          <small>
            {file
              ? `${Math.round(file.size / 1024)} KB`
              : hint}
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

export default StudentRegisterPage;