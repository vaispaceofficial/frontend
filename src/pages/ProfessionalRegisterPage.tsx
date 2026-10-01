import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  MapPin,
  Phone,
  UserRound,
} from "lucide-react";
import "./ProfessionalRegisterPage.css";

function ProfessionalRegisterPage() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    mobile: "",
    email: "",
    category: "",
    experience: "",
    location: "",
    address: "",
    idType: "",
    idNumber: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]:
        type === "checkbox"
          ? (event.target as HTMLInputElement).checked
          : value,
    }));

    if (error) {
      setError("");
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formData.fullName.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!/^[6-9]\d{9}$/.test(formData.mobile)) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    if (!formData.email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!formData.category) {
      setError("Please select your service category.");
      return;
    }

    if (!formData.experience) {
      setError("Please select your experience.");
      return;
    }

    if (!formData.location.trim()) {
      setError("Please enter your service location.");
      return;
    }

    if (!formData.address.trim()) {
      setError("Please enter your service address.");
      return;
    }

    if (!formData.idType) {
      setError("Please select an identification type.");
      return;
    }

    if (!formData.idNumber.trim()) {
      setError("Please enter your identification number.");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!formData.terms) {
      setError("Please accept the Terms & Conditions to continue.");
      return;
    }

    /*
      Backend professional registration will be connected here later.
    */

    alert("Your professional application has been submitted successfully.");

    navigate("/login");
  };

  return (
    <main className="professional-register-page">
      <div className="professional-register-container">

        {/* HEADER */}

        <header className="professional-register-header">

          <div className="professional-header-login">
            <span>Already registered?</span>

            <Link to="/login">
              Sign in
            </Link>
          </div>
        </header>

        {/* PAGE INTRO */}

        <section className="professional-register-intro">
          <span className="professional-register-eyebrow">
            PROFESSIONAL REGISTRATION
          </span>

          <h1>
            Create your professional profile
          </h1>

          <p>
            Join OneService and connect with customers looking for
            reliable service professionals.
          </p>
        </section>

        {/* PROGRESS */}

        <div className="professional-progress">

          <div className="professional-progress-step active">
            <span>01</span>
            <p>Personal</p>
          </div>

          <div className="professional-progress-line" />

          <div className="professional-progress-step active">
            <span>02</span>
            <p>Professional</p>
          </div>

          <div className="professional-progress-line" />

          <div className="professional-progress-step active">
            <span>03</span>
            <p>Security</p>
          </div>

        </div>

        {/* FORM CARD */}

        <section className="professional-register-card">

          {error && (
            <div className="professional-error">
              {error}
            </div>
          )}

          <form
            className="professional-register-form"
            onSubmit={handleSubmit}
          >

            {/* PERSONAL */}

            <div className="professional-form-section">

              <div className="professional-section-heading">
                <span className="professional-section-number">
                  01
                </span>

                <div>
                  <h2>Personal information</h2>
                  <p>
                    Tell us a little about yourself.
                  </p>
                </div>
              </div>

              <div className="professional-fields-grid">

                <div className="professional-field full">
                  <label htmlFor="professional-fullName">
                    Full name
                  </label>

                  <div className="professional-input">
                    <UserRound size={18} />

                    <input
                      id="professional-fullName"
                      name="fullName"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.fullName}
                      onChange={handleChange}
                      autoComplete="name"
                    />
                  </div>
                </div>

                <div className="professional-field">
                  <label htmlFor="professional-mobile">
                    Mobile number
                  </label>

                  <div className="professional-input">
                    <Phone size={18} />

                    <span className="professional-country-code">
                      +91
                    </span>

                    <span className="professional-country-divider" />

                    <input
                      id="professional-mobile"
                      name="mobile"
                      type="tel"
                      inputMode="numeric"
                      maxLength={10}
                      placeholder="10-digit mobile number"
                      value={formData.mobile}
                      onChange={handleChange}
                      autoComplete="tel"
                    />
                  </div>
                </div>

                <div className="professional-field">
                  <label htmlFor="professional-email">
                    Email address
                  </label>

                  <div className="professional-input">
                    <Mail size={18} />

                    <input
                      id="professional-email"
                      name="email"
                      type="email"
                      placeholder="Enter your email address"
                      value={formData.email}
                      onChange={handleChange}
                      autoComplete="email"
                    />
                  </div>
                </div>

              </div>
            </div>

            <div className="professional-section-divider" />

            {/* PROFESSIONAL */}

            <div className="professional-form-section">

              <div className="professional-section-heading">
                <span className="professional-section-number">
                  02
                </span>

                <div>
                  <h2>Professional information</h2>
                  <p>
                    Tell us about the services you provide.
                  </p>
                </div>
              </div>

              <div className="professional-fields-grid">

                <div className="professional-field">
                  <label htmlFor="professional-category">
                    Service category
                  </label>

                  <div className="professional-input">
                    <select
                      id="professional-category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                    >
                      <option value="">
                        Select category
                      </option>

                      <option value="home-appliances">
                        Home Appliances
                      </option>

                      <option value="home-services">
                        Home Services
                      </option>

                      <option value="personal-services">
                        Personal Services
                      </option>

                      <option value="home-staff">
                        Home Staff
                      </option>

                      <option value="electrical">
                        Electrical Services
                      </option>

                      <option value="plumbing">
                        Plumbing Services
                      </option>

                      <option value="other">
                        Other Services
                      </option>
                    </select>
                  </div>
                </div>

                <div className="professional-field">
                  <label htmlFor="professional-experience">
                    Experience
                  </label>

                  <div className="professional-input">
                    <select
                      id="professional-experience"
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                    >
                      <option value="">
                        Select experience
                      </option>

                      <option value="less-than-1">
                        Less than 1 year
                      </option>

                      <option value="1-3">
                        1 - 3 years
                      </option>

                      <option value="3-5">
                        3 - 5 years
                      </option>

                      <option value="5-10">
                        5 - 10 years
                      </option>

                      <option value="10-plus">
                        10+ years
                      </option>
                    </select>
                  </div>
                </div>

                <div className="professional-field">
                  <label htmlFor="professional-location">
                    Service location
                  </label>

                  <div className="professional-input">
                    <MapPin size={18} />

                    <input
                      id="professional-location"
                      name="location"
                      type="text"
                      placeholder="City / Area"
                      value={formData.location}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="professional-field">
                  <label htmlFor="professional-idType">
                    Identification type
                  </label>

                  <div className="professional-input">
                    <select
                      id="professional-idType"
                      name="idType"
                      value={formData.idType}
                      onChange={handleChange}
                    >
                      <option value="">
                        Select identification
                      </option>

                      <option value="aadhaar">
                        Aadhaar
                      </option>

                      <option value="pan">
                        PAN Card
                      </option>

                      <option value="driving-license">
                        Driving License
                      </option>

                      <option value="passport">
                        Passport
                      </option>
                    </select>
                  </div>
                </div>

                <div className="professional-field full">
                  <label htmlFor="professional-idNumber">
                    Identification number
                  </label>

                  <div className="professional-input">
                    <input
                      id="professional-idNumber"
                      name="idNumber"
                      type="text"
                      placeholder="Enter your identification number"
                      value={formData.idNumber}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="professional-field full">
                  <label htmlFor="professional-address">
                    Service address
                  </label>

                  <div className="professional-textarea">
                    <textarea
                      id="professional-address"
                      name="address"
                      placeholder="Enter your complete service address"
                      value={formData.address}
                      onChange={handleChange}
                      rows={4}
                    />
                  </div>
                </div>

              </div>
            </div>

            <div className="professional-section-divider" />

            {/* SECURITY */}

            <div className="professional-form-section">

              <div className="professional-section-heading">
                <span className="professional-section-number">
                  03
                </span>

                <div>
                  <h2>Account security</h2>
                  <p>
                    Create a password for your OneService account.
                  </p>
                </div>
              </div>

              <div className="professional-fields-grid">

                <div className="professional-field">
                  <label htmlFor="professional-password">
                    Password
                  </label>

                  <div className="professional-input">
                    <LockKeyhole size={18} />

                    <input
                      id="professional-password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Minimum 8 characters"
                      value={formData.password}
                      onChange={handleChange}
                      autoComplete="new-password"
                    />

                    <button
                      type="button"
                      className="professional-password-toggle"
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
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>

                <div className="professional-field">
                  <label htmlFor="professional-confirmPassword">
                    Confirm password
                  </label>

                  <div className="professional-input">
                    <LockKeyhole size={18} />

                    <input
                      id="professional-confirmPassword"
                      name="confirmPassword"
                      type={
                        showConfirmPassword
                          ? "text"
                          : "password"
                      }
                      placeholder="Re-enter your password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      autoComplete="new-password"
                    />

                    <button
                      type="button"
                      className="professional-password-toggle"
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
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>

              </div>
            </div>

            {/* TERMS */}

            <label className="professional-terms">

              <span className="professional-checkbox">
                <input
                  type="checkbox"
                  name="terms"
                  checked={formData.terms}
                  onChange={handleChange}
                />

                <span className="professional-checkbox-mark">
                  <Check size={13} />
                </span>
              </span>

              <span>
                I agree to the{" "}
                <Link to="/terms">
                  Terms &amp; Conditions
                </Link>{" "}
                and{" "}
                <Link to="/privacy">
                  Privacy Policy
                </Link>
                .
              </span>

            </label>

            {/* ACTION */}

            <div className="professional-form-actions">

              <button
                type="submit"
                className="professional-submit"
              >
                Submit application
                <ArrowRight size={18} />
              </button>

              <p>
                Your application will be reviewed before your
                professional profile becomes active.
              </p>

            </div>

          </form>

        </section>

        {/* FOOTER */}

        <footer className="professional-register-footer">
          <span>© OneService</span>
          <span>Professional Registration</span>
        </footer>

      </div>
    </main>
  );
}

export default ProfessionalRegisterPage;