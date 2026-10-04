import { useState } from "react";
import {
  Bell,
  ChevronRight,
  FileCheck2,
  KeyRound,
  ScrollText,
  Settings2,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import "./Settings.css";

export default function Settings() {
  const [verificationAlerts, setVerificationAlerts] = useState(true);
  const [subscriptionAlerts, setSubscriptionAlerts] = useState(true);

  const handleAction = (action: string) => {
    console.log(`${action} clicked`);
  };

  return (
    <div className="settings-admin-page">
      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <section className="settings-page-header">
        <span className="settings-eyebrow">
          WORKSPACE CONTROLS
        </span>

        <h1>Settings &amp; Admin Control</h1>
      </section>

      {/* =====================================================
          SETTINGS GRID
      ===================================================== */}

      <section className="settings-grid">

        {/* ===================================================
            ADMIN PROFILE
        =================================================== */}

        <div className="settings-card">
          <div className="settings-card-content">
            <div className="settings-card-title">
              <UserRound size={18} />
              <h2>Admin profile</h2>
            </div>

            <div className="admin-profile">
              <div className="admin-profile-avatar">
                SA
              </div>

              <div className="admin-profile-details">
                <strong>Super Admin</strong>
                <span>Visakhapatnam HQ</span>
              </div>
            </div>

            <button
              type="button"
              className="settings-button"
              onClick={() => handleAction("Manage profile")}
            >
              Manage profile
            </button>
          </div>
        </div>

        {/* ===================================================
            ROLE PERMISSIONS
        =================================================== */}

        <div className="settings-card">
          <div className="settings-card-content">
            <div className="settings-card-title">
              <ShieldCheck size={18} />
              <h2>Role permissions</h2>
            </div>

            <p className="settings-description">
              Administrative review, verification, subscription
              and audit-log controls.
            </p>

            <button
              type="button"
              className="settings-button"
              onClick={() => handleAction("Review permissions")}
            >
              Review permissions
            </button>
          </div>
        </div>

        {/* ===================================================
            NOTIFICATION PREFERENCES
        =================================================== */}

        <div className="settings-card">
          <div className="settings-card-content">
            <div className="settings-card-title">
              <Bell size={18} />
              <h2>Notification preferences</h2>
            </div>

            <div className="notification-settings">
              <div className="notification-row">
                <span>Pending verification alerts</span>

                <button
                  type="button"
                  className={`settings-toggle ${
                    verificationAlerts ? "active" : ""
                  }`}
                  aria-label="Toggle pending verification alerts"
                  aria-pressed={verificationAlerts}
                  onClick={() =>
                    setVerificationAlerts((current) => !current)
                  }
                >
                  <span />
                </button>
              </div>

              <div className="notification-row">
                <span>Subscription expiry alerts</span>

                <button
                  type="button"
                  className={`settings-toggle ${
                    subscriptionAlerts ? "active" : ""
                  }`}
                  aria-label="Toggle subscription expiry alerts"
                  aria-pressed={subscriptionAlerts}
                  onClick={() =>
                    setSubscriptionAlerts((current) => !current)
                  }
                >
                  <span />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ===================================================
            VERIFICATION RULES
        =================================================== */}

        <div className="settings-card">
          <div className="settings-card-content">
            <div className="settings-card-title">
              <FileCheck2 size={18} />
              <h2>Verification rules</h2>
            </div>

            <p className="settings-description">
              Maintain evidence requirements for provider and
              business review.
            </p>

            <button
              type="button"
              className="settings-button"
              onClick={() => handleAction("Configure rules")}
            >
              Configure rules
            </button>
          </div>
        </div>

        {/* ===================================================
            SUBSCRIPTION PLAN CONTROLS
        =================================================== */}

        <div className="settings-card">
          <div className="settings-card-content">
            <div className="settings-card-title">
              <Settings2 size={18} />
              <h2>Subscription plan controls</h2>
            </div>

            <p className="settings-description">
              Manage plan visibility, listing priorities, and fee
              configurations.
            </p>

            <button
              type="button"
              className="settings-button"
              onClick={() => handleAction("Manage plans")}
            >
              Manage plans
            </button>
          </div>
        </div>

        {/* ===================================================
            AUDIT LOG ACCESS
        =================================================== */}

        <div className="settings-card">
          <div className="settings-card-content">
            <div className="settings-card-title">
              <ScrollText size={18} />
              <h2>Audit-log access</h2>
            </div>

            <p className="settings-description">
              Review recorded administrative actions and
              operational history.
            </p>

            <button
              type="button"
              className="settings-button"
              onClick={() => handleAction("Open audit log")}
            >
              Open audit log
              <ChevronRight size={14} />
            </button>
          </div>
        </div>

      </section>

      {/* =====================================================
          SECURITY FOOTER
      ===================================================== */}

      <div className="settings-security-note">
        <KeyRound size={15} />

        <span>
          Administrative controls are restricted to authorized
          workspace administrators.
        </span>
      </div>
    </div>
  );
}