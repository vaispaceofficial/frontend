import { useState, type FormEvent } from "react";
import { ArrowRight, LockKeyhole, Phone, Play, ShieldCheck } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import "./LoginPage.css";

type CustomerActivity = {
  id: string;
  mobile: string;
  title: string;
  description: string;
  timestamp: string;
  category: "Login" | "Profile" | "Booking" | "Order" | "Other";
};
type CustomerRecord = {
  id: string;
  mobile: string;
  loggedIn: boolean;
  name?: string;
  email?: string;
  mobileVerified?: boolean;
  status: "Active" | "Blocked";
  createdAt: string;
  lastLoginAt: string;
  loginCount: number;
  loginHistory: string[];
  savedAddress?: string;
  settings?: { language?: string; serviceUpdates?: boolean; promotionalUpdates?: boolean; orderUpdates?: boolean };
};

const USER_KEY = "oneservice_user";
const DIRECTORY_KEY = "oneservice_customer_directory";
const ACTIVITY_KEY = "oneservice_customer_activity";

function readArray<T>(key: string): T[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(parsed) ? parsed as T[] : [];
  } catch {
    return [];
  }
}
function recordCustomerLogin(mobile: string) {
  const now = new Date().toISOString();
  let previous: Partial<CustomerRecord> = {};
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(USER_KEY) || "null");
    if (parsed && typeof parsed === "object") previous = parsed as Partial<CustomerRecord>;
  } catch { /* Start a clean customer session if saved data is malformed. */ }

  const user = {
    ...previous,
    id: previous.id || `NOS-${mobile}`,
    mobile,
    loggedIn: true,
    name: previous.name || "",
    email: previous.email || "",
    mobileVerified: false,
    createdAt: previous.createdAt || now,
    lastLoginAt: now,
    loginCount: Number(previous.loginCount || 0) + 1,
    loginHistory: [...(Array.isArray(previous.loginHistory) ? previous.loginHistory : []), now].slice(-50),
    savedAddress: localStorage.getItem("oneservice_saved_address") || previous.savedAddress || "",
    settings: (() => { try { return JSON.parse(localStorage.getItem("oneservice_profile_settings") || "{}"); } catch { return previous.settings || {}; } })(),
  };
  localStorage.setItem(USER_KEY, JSON.stringify(user));

  const directory = readArray<CustomerRecord>(DIRECTORY_KEY);
  const existing = directory.find((item) => item.mobile === mobile);
  const record: CustomerRecord = {
    ...existing,
    ...user,
    status: existing?.status || "Active",
  };
  localStorage.setItem(DIRECTORY_KEY, JSON.stringify([
    record,
    ...directory.filter((item) => item.mobile !== mobile),
  ]));

  const activity = readArray<CustomerActivity>(ACTIVITY_KEY);
  activity.unshift({
    id: `LOGIN-${Date.now()}`,
    mobile,
    title: "Logged in",
    description: "Customer signed in through the OneService mobile login page.",
    timestamp: now,
    category: "Login",
  });
  localStorage.setItem(ACTIVITY_KEY, JSON.stringify(activity.slice(0, 1000)));
  window.dispatchEvent(new Event("oneservice-auth-change"));
  window.dispatchEvent(new Event("oneservice-customer-change"));
}

function LoginPage() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const mobile = phone.replace(/\D/g, "");
    if (!/^[6-9]\d{9}$/.test(mobile)) {
      setError("Enter a valid 10-digit Indian mobile number.");
      return;
    }
    // Frontend prototype only: this validates the number's format, not ownership.
    recordCustomerLogin(mobile);
    navigate("/profile", { replace: true });
  };

  return (
    <main className="login-page">
      <div className="login-layout">
        <section className="login-video-section">
          <div className="login-video-wrapper">
            <div className="login-video-placeholder">
              <div className="video-gradient" /><div className="video-grid" />
              <div className="video-placeholder-content">
                <div className="video-top-row"><span className="video-brand-label">NEED ONE SERVICE</span><span className="video-status"><span className="video-status-dot" />Trusted service</span></div>
                <div className="video-main-content"><div className="video-play-icon"><Play size={21} fill="currentColor" strokeWidth={1.5} /></div><span className="video-eyebrow">YOUR HOME. ONE CONNECTION.</span><h2>Everything your home needs.<br /><span>In need one service.</span></h2><p>From everyday essentials to trusted professionals, NEED ONE SERVICE brings everything your home needs together in one simple experience.</p></div>
                <div className="video-bottom-row"><span>Home services</span><span className="video-bottom-line" /><span>Trusted professionals</span><span className="video-bottom-line" /><span>One platform</span></div>
              </div>
            </div>
            <div className="video-floating-card"><div className="floating-card-icon"><ShieldCheck size={17} /></div><div><strong>Trusted professionals</strong><span>For your everyday needs</span></div></div>
          </div>
        </section>
        <section className="login-form-section"><div className="login-content"><div className="login-card">
          <div className="login-card-header"><div className="login-icon"><LockKeyhole size={21} strokeWidth={1.8} /></div><span className="login-eyebrow">NEED ONE SERVICE ACCOUNT</span><h1>Welcome back.</h1><p className="login-description">Login with your mobile number to continue to NEED ONE SERVICE.</p></div>
          <form className="login-form" onSubmit={handleLogin}><div className="form-field"><label htmlFor="phone">Mobile Number</label><div className="phone-input"><span className="country-code">+91</span><span className="phone-divider" /><Phone size={18} strokeWidth={1.8} /><input id="phone" name="phone" type="tel" inputMode="numeric" autoComplete="tel-national" placeholder="Enter your mobile number" value={phone} maxLength={10} onChange={(event) => { setPhone(event.target.value.replace(/\D/g, "").slice(0, 10)); setError(""); }} aria-invalid={Boolean(error)} aria-describedby={error ? "phone-error" : undefined} /></div>{error && <p id="phone-error" role="alert">{error}</p>}</div><button type="submit" className="login-continue-button"><span>Continue</span><span className="button-arrow"><ArrowRight size={17} /></span></button></form>
          <div className="login-note"><span>By continuing, you agree to the NEED ONE SERVICE terms and privacy policy.</span></div>
        </div><Link to="/" className="login-home-link"><span>←</span>Back to Home</Link><div className="login-footer"><span>© NEED ONE SERVICE</span><span className="footer-dot" /><span>Secure access</span></div></div></section>
      </div>
    </main>
  );
}
export default LoginPage;
