
import {
  ArrowRight,
  LockKeyhole,
  Phone,
  Play,
  ShieldCheck,
} from "lucide-react";
import { Link } from "react-router-dom";
import "./LoginPage.css";

function LoginPage() {
  return (
    <main className="login-page">
      <div className="login-layout">

        {/* =========================================
            LEFT — BRAND / VIDEO EXPERIENCE
        ========================================= */}
        <section className="login-video-section">
          <div className="login-video-wrapper">

            {/* Replace this block with your actual video later */}
            <div className="login-video-placeholder">

              <div className="video-gradient" />

              <div className="video-grid" />

              <div className="video-placeholder-content">

                <div className="video-top-row">
                  <span className="video-brand-label">
                    NEED ONE SERVICE
                  </span>

                  <span className="video-status">
                    <span className="video-status-dot" />
                    Trusted service
                  </span>
                </div>

                <div className="video-main-content">

                  <div className="video-play-icon">
                    <Play
                      size={21}
                      fill="currentColor"
                      strokeWidth={1.5}
                    />
                  </div>

                  <span className="video-eyebrow">
                    YOUR HOME. ONE CONNECTION.
                  </span>

                  <h2>
                    Everything your home needs.
                    <br />
                    <span>In need one service.</span>
                  </h2>

                  <p>
                    From everyday essentials to trusted professionals,
                    NEED ONE SERVICE brings everything your home needs
                    together in one simple experience.
                  </p>

                </div>

                <div className="video-bottom-row">
                  <span>
                    Home services
                  </span>

                  <span className="video-bottom-line" />

                  <span>
                    Trusted professionals
                  </span>

                  <span className="video-bottom-line" />

                  <span>
                    One platform
                  </span>
                </div>

              </div>
            </div>

            {/* Decorative floating element */}
            <div className="video-floating-card">
              <div className="floating-card-icon">
                <ShieldCheck size={17} />
              </div>

              <div>
                <strong>Trusted professionals</strong>
                <span>For your everyday needs</span>
              </div>
            </div>

          </div>
        </section>

        {/* =========================================
            RIGHT — LOGIN
        ========================================= */}
        <section className="login-form-section">
          <div className="login-content">

            {/* Login Card */}
            <div className="login-card">

              <div className="login-card-header">

                <div className="login-icon">
                  <LockKeyhole size={21} strokeWidth={1.8} />
                </div>

                <span className="login-eyebrow">
                  NEED ONE SERVICE ACCOUNT
                </span>

                <h1>
                  Welcome back.
                </h1>

                <p className="login-description">
                  Login with your mobile number to continue
                  to NEED ONE SERVICE.
                </p>

              </div>

              <form className="login-form">

                <div className="form-field">

                  <label htmlFor="phone">
                    Mobile Number
                  </label>

                  <div className="phone-input">

                    <span className="country-code">
                      +91
                    </span>

                    <span className="phone-divider" />

                    <Phone
                      size={18}
                      strokeWidth={1.8}
                    />

                    <input
                      id="phone"
                      type="tel"
                      inputMode="numeric"
                      placeholder="Enter your mobile number"
                      maxLength={10}
                    />

                  </div>

                </div>

                <button
                  type="submit"
                  className="login-continue-button"
                >
                  <span>
                    Continue
                  </span>

                  <span className="button-arrow">
                    <ArrowRight size={17} />
                  </span>
                </button>

              </form>

              <div className="login-note">
                <span>
                  By continuing, you agree to the NEED ONE SERVICE
                  terms and privacy policy.
                </span>
              </div>

            </div>

            <Link
              to="/"
              className="login-home-link"
            >
              <span>←</span>
              Back to Home
            </Link>

            <div className="login-footer">
              <span>© NEED ONE SERVICE</span>
              <span className="footer-dot" />
              <span>Secure access</span>
            </div>

          </div>
        </section>

      </div>
    </main>
  );
}

export default LoginPage;

