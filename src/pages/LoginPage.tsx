import { ArrowRight, LockKeyhole, Phone, Play } from "lucide-react";
import { Link } from "react-router-dom";
import "./LoginPage.css";

function LoginPage() {
  return (
    <main className="login-page">
      <div className="login-layout">

        {/* LEFT — VIDEO AREA */}
        <section className="login-video-section">
          <div className="login-video-placeholder">
            <div className="video-placeholder-content">
              <div className="video-play-icon">
                <Play size={24} fill="currentColor" />
              </div>

              <span className="video-placeholder-label">
                ONE SERVICE
              </span>

              <h2>
                Everything your home needs.
                <br />
                <span>In one service.</span>
              </h2>

              <p>
                Professional home services, trusted professionals
                and convenient solutions — all in one place.
              </p>
            </div>

            <div className="video-placeholder-overlay" />
          </div>
        </section>

        {/* RIGHT — LOGIN */}
        <section className="login-form-section">
          <div className="login-content">

            <Link to="/" className="login-logo">
              <span className="login-logo-mark">1</span>

              <span className="login-logo-text">
                ONE
                <strong>SERVICE</strong>
              </span>
            </Link>

            <div className="login-card">

              <div className="login-icon">
                <LockKeyhole size={22} />
              </div>

              <span className="login-eyebrow">
                ONE SERVICE ACCOUNT
              </span>

              <h1>
                Welcome back.
              </h1>

              <p className="login-description">
                Login with your mobile number to continue
                to ONE SERVICE.
              </p>

              <form className="login-form">

                <label htmlFor="phone">
                  Mobile Number
                </label>

                <div className="phone-input">
                  <span className="country-code">
                    +91
                  </span>

                  <span className="phone-divider" />

                  <Phone size={18} />

                  <input
                    id="phone"
                    type="tel"
                    placeholder="Enter your mobile number"
                    maxLength={10}
                  />
                </div>

                <button
                  type="submit"
                  className="login-continue-button"
                >
                  Continue
                  <ArrowRight size={18} />
                </button>

              </form>

              <div className="login-note">
                <span>
                  By continuing, you agree to the ONE SERVICE
                  terms and privacy policy.
                </span>
              </div>

              <Link
                to="/"
                className="login-home-link"
              >
                ← Back to Home
              </Link>

            </div>

          </div>
        </section>

      </div>
    </main>
  );
}

export default LoginPage;