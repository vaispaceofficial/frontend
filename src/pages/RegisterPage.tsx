
import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Phone,
  UserRound,
} from "lucide-react";
import "./RegisterPage.css";

function RegisterPage() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    mobile: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });

  const [error, setError] = useState("");

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value, type, checked } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
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
      Backend registration will be connected here later.
    */

    navigate("/login");
  };

  return (
    <main className="register-page">
      <div className="register-layout">

        {/* =========================================
            LEFT BRAND PANEL
        ========================================= */}

        <section className="register-brand-panel">
          <div className="register-brand-content">

            <Link to="/" className="register-logo">
              <span className="register-logo-mark">O</span>
              <span>OneService</span>
            </Link>

            <div className="register-brand-main">
              <span className="register-overline">
                WELCOME TO ONESERVICE
              </span>

              <h1>
                One account.
                <br />
                <span>Everything you need.</span>
              </h1>

              <p>
                Create your OneService account and get access to
                trusted home services, maintenance support and
                products — all in one place.
              </p>

              <div className="register-benefits">

                <div className="register-benefit">
                  <div className="register-benefit-icon">
                    <CheckCircle2 size={19} />
                  </div>

                  <div>
                    <strong>Manage your services</strong>
                    <span>
                      Keep your service requests organized in one place.
                    </span>
                  </div>
                </div>

                <div className="register-benefit">
                  <div className="register-benefit-icon">
                    <CheckCircle2 size={19} />
                  </div>

                  <div>
                    <strong>Easy service booking</strong>
                    <span>
                      Book trusted services whenever you need them.
                    </span>
                  </div>
                </div>

                <div className="register-benefit">
                  <div className="register-benefit-icon">
                    <CheckCircle2 size={19} />
                  </div>

                  <div>
                    <strong>One simple account</strong>
                    <span>
                      Access your services, products and requests easily.
                    </span>
                  </div>
                </div>

              </div>
            </div>

            <div className="register-brand-footer">
              <span>Trusted home support</span>
              <span className="register-footer-dot" />
              <span>Simple. Reliable. Convenient.</span>
            </div>

          </div>
        </section>


        {/* =========================================
            REGISTER FORM
        ========================================= */}

        <section className="register-form-panel">

          <div className="register-form-wrapper">

            <div className="register-heading">

              <div className="register-mobile-logo">
                <Link to="/" className="register-logo">
                  <span className="register-logo-mark">O</span>
                  <span>OneService</span>
                </Link>
              </div>

              <span className="register-form-label">
                CREATE YOUR ACCOUNT
              </span>

              <h2>Get started with OneService.</h2>

              <p>
                Enter your details below to create your account.
              </p>

            </div>


            {error && (
              <div className="register-error">
                {error}
              </div>
            )}


            <form
              className="register-form"
              onSubmit={handleSubmit}
            >

              {/* FULL NAME */}

              <div className="register-field">
                <label htmlFor="fullName">
                  Full name
                </label>

                <div className="register-input-wrapper">

                  <UserRound size={18} />

                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={handleChange}
                    autoComplete="name"
                  />

                </div>
              </div>


              {/* MOBILE */}

              <div className="register-field">
                <label htmlFor="mobile">
                  Mobile number
                </label>

                <div className="register-input-wrapper">

                  <Phone size={18} />

                  <span className="country-code">
                    +91
                  </span>

                  <span className="country-divider" />

                  <input
                    id="mobile"
                    name="mobile"
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    placeholder="Enter 10-digit mobile number"
                    value={formData.mobile}
                    onChange={handleChange}
                    autoComplete="tel"
                  />

                </div>
              </div>


              {/* EMAIL */}

              <div className="register-field">
                <label htmlFor="email">
                  Email address
                </label>

                <div className="register-input-wrapper">

                  <Mail size={18} />

                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={handleChange}
                    autoComplete="email"
                  />

                </div>
              </div>


              {/* PASSWORD ROW */}

              <div className="register-password-row">

                <div className="register-field">

                  <label htmlFor="password">
                    Password
                  </label>

                  <div className="register-input-wrapper">

                    <LockKeyhole size={18} />

                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Minimum 8 characters"
                      value={formData.password}
                      onChange={handleChange}
                      autoComplete="new-password"
                    />

                    <button
                      type="button"
                      className="password-toggle"
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


                <div className="register-field">

                  <label htmlFor="confirmPassword">
                    Confirm password
                  </label>

                  <div className="register-input-wrapper">

                    <LockKeyhole size={18} />

                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={
                        showConfirmPassword
                          ? "text"
                          : "password"
                      }
                      placeholder="Re-enter password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      autoComplete="new-password"
                    />

                    <button
                      type="button"
                      className="password-toggle"
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


              {/* TERMS */}

              <label className="register-terms">

                <input
                  type="checkbox"
                  name="terms"
                  checked={formData.terms}
                  onChange={handleChange}
                />

                <span className="custom-checkbox">
                  <CheckCircle2 size={14} />
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


              {/* SUBMIT */}

              <button
                type="submit"
                className="register-submit"
              >
                Create account
                <ArrowRight size={18} />
              </button>

            </form>


            <div className="register-divider">
              <span />
              <p>Already registered?</p>
              <span />
            </div>


            <Link
              to="/login"
              className="register-login-button"
            >
              Sign in to your account
            </Link>


            <p className="register-security-note">
              <LockKeyhole size={14} />
              Your account information is securely handled.
            </p>

          </div>

        </section>

      </div>
    </main>
  );
}

export default RegisterPage;

