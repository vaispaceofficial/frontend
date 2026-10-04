import { useState } from "react";
import type { FormEvent } from "react";
import { Eye, EyeOff, LockKeyhole, ShieldCheck, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

import "./AdminLogin.css";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [adminId, setAdminId] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
  event.preventDefault();

  setError("");

  if (!adminId.trim() || !password.trim()) {
    setError("Please enter your admin ID and password.");
    return;
  }

  // Temporary admin credentials
  const validAdminId = "admin";
  const validPassword = "N0s!Admin@2026";

  if (
    adminId.trim() !== validAdminId ||
    password !== validPassword
  ) {
    setError("Invalid admin ID or password.");
    return;
  }

  // Mark admin as authenticated
  localStorage.setItem("adminAuthenticated", "true");

  // Open dashboard
  navigate("/admin", { replace: true });
};

  return (
    <div className="admin-login-page">

      {/* =====================================================
          BACKGROUND
      ===================================================== */}

      <div className="admin-login-background">
        <div className="admin-login-glow admin-login-glow-one" />
        <div className="admin-login-glow admin-login-glow-two" />
        <div className="admin-login-grid" />
      </div>

      {/* =====================================================
          TOP BRAND
      ===================================================== */}

      <header className="admin-login-brand">

        <div className="admin-login-brand-mark">
          N
        </div>

        <div className="admin-login-brand-text">
          <strong>NEED ONE</strong>
          <span>SERVICE LLP</span>
        </div>

      </header>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="admin-login-main">

        {/* ===================================================
            LEFT INFORMATION
        =================================================== */}

        <section className="admin-login-intro">

          <div className="admin-login-eyebrow">
            <span className="admin-login-eyebrow-line" />
            ADMINISTRATIVE ACCESS
          </div>

          <h1>
            Manage your
            <span> service operations.</span>
          </h1>

          <p>
            Access the NEED ONE SERVICE administrative control
            center to manage partners, services, businesses,
            subscriptions and compliance.
          </p>

          <div className="admin-login-features">

            <div className="admin-login-feature">
              <div className="admin-login-feature-icon">
                <ShieldCheck size={19} />
              </div>

              <div>
                <strong>Secure Admin Access</strong>
                <span>
                  Protected access for authorized administrators.
                </span>
              </div>
            </div>

            <div className="admin-login-feature">
              <div className="admin-login-feature-icon">
                <LockKeyhole size={19} />
              </div>

              <div>
                <strong>Operational Control</strong>
                <span>
                  Manage your complete platform from one place.
                </span>
              </div>
            </div>

          </div>

        </section>

        {/* ===================================================
            LOGIN CARD
        =================================================== */}

        <section className="admin-login-card">

          <div className="admin-login-card-header">

            <div className="admin-login-card-icon">
              <LockKeyhole size={21} />
            </div>

            <div>
              <span>NEED ONE SERVICE</span>
              <h2>Admin Portal</h2>
            </div>

          </div>

          <div className="admin-login-welcome">
            <h3>Welcome back</h3>

            <p>
              Sign in to continue to your admin workspace.
            </p>
          </div>

          <form onSubmit={handleSubmit}>

            {/* ADMIN ID */}

            <div className="admin-login-field">

              <label htmlFor="admin-id">
                Admin ID / Email
              </label>

              <input
                id="admin-id"
                type="text"
                value={adminId}
                onChange={(event) => setAdminId(event.target.value)}
                placeholder="Enter your admin ID"
                autoComplete="username"
              />

            </div>

            {/* PASSWORD */}

            <div className="admin-login-field">

              <label htmlFor="admin-password">
                Password
              </label>

              <div className="admin-password-wrapper">

                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                />

                <button
                  type="button"
                  className="admin-password-toggle"
                  onClick={() =>
                    setShowPassword((current) => !current)
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

            {/* OPTIONS */}

            <div className="admin-login-options">

              <label className="admin-remember">

                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(event) =>
                    setRememberMe(event.target.checked)
                  }
                />

                <span>Remember me</span>

              </label>

              <button
                type="button"
                className="admin-forgot-button"
              >
                Forgot password?
              </button>

            </div>

            {/* ERROR */}

            {error && (
              <div className="admin-login-error">
                {error}
              </div>
            )}

            {/* SUBMIT */}

            <button
              type="submit"
              className="admin-login-submit"
            >
              <span>Sign in to Admin Portal</span>

              <ArrowRight size={18} />
            </button>

          </form>

          {/* SECURITY */}

          <div className="admin-login-security">

            <ShieldCheck size={16} />

            <span>
              Authorized administrative access only
            </span>

          </div>

        </section>

      </main>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="admin-login-footer">

        <span>
          NEED ONE SERVICE LLP
        </span>

        <span className="admin-login-footer-dot">
          •
        </span>

        <span>
          Operational Control Center
        </span>

      </footer>

    </div>
  );
}