import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Users as UsersIcon, Search, UserRound, Eye, Mail, Phone, CalendarDays,
  Clock3, Ban, CheckCircle2, X, Activity, Filter, RefreshCw, MapPin,
  ShieldCheck, ShoppingBag, ClipboardList, Settings, LogIn, UserCog, Star, MessageSquareText,
} from "lucide-react";
import "./Users.css";

type UserStatus = "Active" | "Blocked";
type ActivityCategory = "Login" | "Profile" | "Booking" | "Order" | "Other";
interface CustomerActivity {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  category: ActivityCategory;
}
interface CustomerRecord {
  id: string;
  mobile: string;
  name?: string;
  fullName?: string;
  email?: string;
  loggedIn?: boolean;
  mobileVerified?: boolean;
  status?: UserStatus;
  createdAt?: string;
  lastLoginAt?: string;
  loginCount?: number;
  loginHistory?: string[];
  role?: string;
  accountType?: string;
  activity?: CustomerActivity[];
  savedAddress?: string;
  settings?: AccountSettings;
}
interface CustomerReviewRecord {
  id?: string;
  mobile?: string;
  customerMobile?: string;
  userMobile?: string;
  professionalName?: string;
  professional?: string;
  serviceName?: string;
  service?: string;
  rating?: number;
  comment?: string;
  review?: string;
  date?: string;
  createdAt?: string;
}
interface OrderRecord {
  id: string;
  mobile?: string;
  customerMobile?: string;
  title: string;
  type?: string;
  date?: string;
  status: string;
  amount?: number | string;
}
interface AccountSettings {
  language?: string;
  serviceUpdates?: boolean;
  promotionalUpdates?: boolean;
  orderUpdates?: boolean;
}

const DIRECTORY_KEY = "oneservice_customer_directory";
const USER_KEY = "oneservice_user";
const ACTIVITY_KEY = "oneservice_customer_activity";
const ORDER_KEY = "oneservice_order_history";
const REVIEW_KEYS = ["oneservice_customer_reviews", "oneservice_reviews"];

function safeParse<T>(key: string, fallback: T): T {
  try {
    const value = localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}
function formatDate(value?: string) {
  if (!value) return "Not provided";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}
function formatDateTime(value?: string) {
  if (!value) return "No login recorded";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}
function initials(name?: string, mobile?: string) {
  const clean = (name || "").trim();
  if (clean) return clean.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase();
  return (mobile || "U").slice(-2);
}
function readDirectory(): CustomerRecord[] {
  const parsed = safeParse<unknown>(DIRECTORY_KEY, []);
  if (!Array.isArray(parsed)) return [];
  return parsed.filter((item): item is CustomerRecord => !!item && typeof item === "object" && typeof (item as CustomerRecord).mobile === "string");
}
function readCurrentCustomer(): CustomerRecord | null {
  const user = safeParse<CustomerRecord | null>(USER_KEY, null);
  if (!user?.mobile || user.loggedIn !== true) return null;
  return user;
}
function syncCurrentCustomer(directory: CustomerRecord[]) {
  const current = readCurrentCustomer();
  if (!current) return directory;
  const existing = directory.find((item) => item.mobile === current.mobile);
  const merged = { ...existing, ...current, id: existing?.id || current.id || `NOS-${current.mobile}`, status: existing?.status || "Active" };
  const next = directory.filter((item) => item.mobile !== current.mobile);
  next.unshift(merged);
  localStorage.setItem(DIRECTORY_KEY, JSON.stringify(next));
  return next;
}
function readOrders(): OrderRecord[] {
  const parsed = safeParse<unknown>(ORDER_KEY, []);
  if (!Array.isArray(parsed)) return [];
  return parsed.filter((item): item is OrderRecord => !!item && typeof item === "object" && typeof (item as OrderRecord).id === "string" && typeof (item as OrderRecord).title === "string" && typeof (item as OrderRecord).status === "string");
}
function readCustomerReviews(mobile: string): CustomerReviewRecord[] {
  const records = REVIEW_KEYS.flatMap((key) => {
    const parsed = safeParse<unknown>(key, []);
    return Array.isArray(parsed) ? parsed : [];
  });
  const unique = new Map<string, CustomerReviewRecord>();
  records.forEach((item, index) => {
    if (!item || typeof item !== "object") return;
    const review = item as CustomerReviewRecord;
    const ownerMobile = review.mobile || review.customerMobile || review.userMobile;
    if (ownerMobile !== mobile) return;
    const id = review.id || `${ownerMobile}-${review.createdAt || review.date || index}-${review.professionalName || review.professional || "review"}`;
    unique.set(id, review);
  });
  return [...unique.values()].sort((a, b) => Date.parse(b.createdAt || b.date || "") - Date.parse(a.createdAt || a.date || ""));
}
function readActivity(mobile: string): CustomerActivity[] {
  const parsed = safeParse<unknown>(ACTIVITY_KEY, []);
  if (!Array.isArray(parsed)) return [];
  return parsed.filter((item): item is CustomerActivity & { mobile?: string } => !!item && typeof item === "object" && (item as { mobile?: string }).mobile === mobile)
    .sort((a, b) => Date.parse(b.timestamp) - Date.parse(a.timestamp));
}

export default function UsersPage() {
  const [users, setUsers] = useState<CustomerRecord[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | UserStatus>("All");
  const [selectedMobile, setSelectedMobile] = useState<string | null>(null);
  const [confirmUser, setConfirmUser] = useState<CustomerRecord | null>(null);

  const refreshUsers = useCallback(() => {
    setUsers(syncCurrentCustomer(readDirectory()));
  }, []);
  useEffect(() => {
    refreshUsers();
    const onChange = () => refreshUsers();
    window.addEventListener("storage", onChange);
    window.addEventListener("oneservice-auth-change", onChange);
    window.addEventListener("oneservice-customer-change", onChange);
    window.addEventListener("oneservice-order-change", onChange);
    return () => {
      window.removeEventListener("storage", onChange);
      window.removeEventListener("oneservice-auth-change", onChange);
      window.removeEventListener("oneservice-customer-change", onChange);
      window.removeEventListener("oneservice-order-change", onChange);
    };
  }, [refreshUsers]);
  useEffect(() => {
    if (!selectedMobile && !confirmUser) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setSelectedMobile(null); setConfirmUser(null); }
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [selectedMobile, confirmUser]);

  const selectedUser = useMemo(() => users.find((user) => user.mobile === selectedMobile) || null, [users, selectedMobile]);
  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();
    return users.filter((user) => {
      const matches = [user.name, user.email, user.mobile, user.id].join(" ").toLowerCase().includes(query);
      return matches && (statusFilter === "All" || (user.status || "Active") === statusFilter);
    });
  }, [users, search, statusFilter]);
  const activeCount = users.filter((user) => (user.status || "Active") === "Active").length;
  const blockedCount = users.length - activeCount;
  const emailCount = users.filter((user) => Boolean(user.email?.trim())).length;
  const profileCount = users.filter((user) => Boolean(user.name?.trim() && user.email?.trim())).length;

  const updateDirectory = (next: CustomerRecord[]) => {
    localStorage.setItem(DIRECTORY_KEY, JSON.stringify(next));
    setUsers(next);
    window.dispatchEvent(new Event("oneservice-customer-change"));
  };
  const toggleBlock = (user: CustomerRecord) => {
    const status: UserStatus = user.status === "Blocked" ? "Active" : "Blocked";
    updateDirectory(users.map((item) => item.mobile === user.mobile ? { ...item, status } : item));
    setConfirmUser(null);
  };
  const resetFilters = () => { setSearch(""); setStatusFilter("All"); };

  const selectedOrders = selectedUser ? readOrders().filter((order) => order.mobile === selectedUser.mobile || order.customerMobile === selectedUser.mobile) : [];
  const selectedActivity = selectedUser ? readActivity(selectedUser.mobile) : [];
  const selectedReviews = selectedUser ? readCustomerReviews(selectedUser.mobile) : [];
  const selectedServiceOrders = selectedOrders.filter((order) => ["service", "booking"].includes((order.type || "").toLowerCase()));
  const averageReviewRating = selectedReviews.length
    ? selectedReviews.reduce((total, review) => total + (Number(review.rating) || 0), 0) / selectedReviews.length
    : 0;
  const address = selectedUser?.savedAddress || "";
  const settings = selectedUser?.settings || {};
  const fullName = selectedUser?.name || selectedUser?.fullName || "Name not added";

  return (
    <main className="nos-users-page">
      <header className="nos-users-heading">
        <div>
          <span className="nos-users-kicker">ADMINISTRATION / USERS</span>
          <h1>Users Management</h1>
          <p>Manage customer accounts, review customer profiles and monitor account activity.</p>
        </div>
        <div className="nos-users-heading-badge"><UsersIcon size={18} /><span>Customer Directory</span></div>
      </header>

      <section className="nos-users-stats">
        <article className="nos-users-stat"><div className="nos-users-stat-top"><span className="nos-users-stat-icon blue"><UsersIcon size={22} /></span><span className="nos-users-stat-caption">All accounts</span></div><div className="nos-users-stat-value">{users.length}</div><div className="nos-users-stat-bottom"><span>Total Users</span><small>Customer accounts recorded</small></div></article>
        <article className="nos-users-stat"><div className="nos-users-stat-top"><span className="nos-users-stat-icon green"><CheckCircle2 size={22} /></span><span className="nos-users-stat-caption">Available</span></div><div className="nos-users-stat-value">{activeCount}</div><div className="nos-users-stat-bottom"><span>Active Users</span><small>Accounts with access</small></div></article>
        <article className="nos-users-stat"><div className="nos-users-stat-top"><span className="nos-users-stat-icon red"><Ban size={22} /></span><span className="nos-users-stat-caption">Restricted</span></div><div className="nos-users-stat-value">{blockedCount}</div><div className="nos-users-stat-bottom"><span>Blocked Users</span><small>Accounts restricted by admin</small></div></article>
        <article className="nos-users-stat"><div className="nos-users-stat-top"><span className="nos-users-stat-icon blue"><Mail size={22} /></span><span className="nos-users-stat-caption">Contact details</span></div><div className="nos-users-stat-value">{emailCount}</div><div className="nos-users-stat-bottom"><span>Email Provided</span><small>Users with an email address</small></div></article>
        <article className="nos-users-stat"><div className="nos-users-stat-top"><span className="nos-users-stat-icon green"><ShieldCheck size={22} /></span><span className="nos-users-stat-caption">Profile details</span></div><div className="nos-users-stat-value">{profileCount}</div><div className="nos-users-stat-bottom"><span>Profiles Completed</span><small>Name and email are available</small></div></article>
      </section>

      <section className="nos-users-panel">
        <div className="nos-users-panel-header"><div><h2>Registered Users</h2><p>Customer accounts created through the NeedOneService login and profile experience.</p></div><span className="nos-users-count">{filteredUsers.length} {filteredUsers.length === 1 ? "user" : "users"}</span></div>
        <div className="nos-users-toolbar">
          <label className="nos-users-search"><Search size={18} /><input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name, email, mobile or ID..." aria-label="Search users" />{search && <button type="button" className="nos-users-search-clear" onClick={() => setSearch("")} aria-label="Clear search"><X size={15} /></button>}</label>
          <label className="nos-users-filter"><Filter size={17} /><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as "All" | UserStatus)} aria-label="Filter users by status"><option value="All">All statuses</option><option value="Active">Active</option><option value="Blocked">Blocked</option></select></label>
          <button type="button" className="nos-users-reset-button" onClick={resetFilters}><RefreshCw size={16} />Reset</button>
        </div>
        <div className="nos-users-table-wrap"><table className="nos-users-table"><thead><tr><th>Customer</th><th>Contact Information</th><th>Last Login</th><th>Status</th><th>Date Joined</th><th>Actions</th></tr></thead>
          <tbody>
            {filteredUsers.length ? filteredUsers.map((user) => <tr key={user.mobile}>
              <td><div className="nos-users-identity"><span className="nos-users-avatar">{initials(user.name || user.fullName, user.mobile)}</span><div className="nos-users-identity-text"><strong>{user.name || user.fullName || "Name not added"}</strong><small>{user.id || `NOS-${user.mobile}`}</small></div></div></td>
              <td><div className="nos-users-contact-cell"><span><Phone size={13} />{user.mobile}</span><span><Mail size={13} />{user.email || "Email not added"}</span></div></td>
              <td><span className="nos-users-joined"><Clock3 size={14} />{formatDateTime(user.lastLoginAt)}</span></td>
              <td><span className={`nos-users-status ${(user.status || "Active").toLowerCase()}`}><span className="nos-users-status-dot" />{user.status || "Active"}</span></td>
              <td><span className="nos-users-joined"><CalendarDays size={14} />{formatDate(user.createdAt)}</span></td>
              <td><div className="nos-users-row-actions"><button type="button" className="nos-users-button view" onClick={() => setSelectedMobile(user.mobile)}><Eye size={14} />View Profile</button><button type="button" className={`nos-users-button ${user.status === "Blocked" ? "unblock" : "block"}`} onClick={() => setConfirmUser(user)}>{user.status === "Blocked" ? <CheckCircle2 size={14} /> : <Ban size={14} />}{user.status === "Blocked" ? "Unblock" : "Block"}</button></div></td>
            </tr>) : <tr><td colSpan={6} className="nos-users-empty"><div className="nos-users-empty-icon"><UsersIcon size={22} /></div><strong>{users.length ? "No matching users" : "No customer accounts yet"}</strong><p>{users.length ? "Try changing your search or filters." : "Customer accounts will appear here after they log in through the OneService login page in this browser."}</p>{(search || statusFilter !== "All") && <button type="button" className="nos-users-button close" onClick={resetFilters}>Clear filters</button>}</td></tr>}
          </tbody></table></div>
        <footer className="nos-users-panel-footer"><span>Showing {filteredUsers.length} of {users.length} customer accounts</span><span className="nos-users-demo-note"><span />Browser-stored customer directory</span></footer>
      </section>

      {selectedUser && <div className="nos-users-overlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedMobile(null); }}><section className="nos-users-modal" role="dialog" aria-modal="true" aria-labelledby="nos-user-modal-title">
        <header className="nos-users-modal-header"><div><span className="nos-users-modal-kicker">CUSTOMER ACCOUNT / PROFILE</span><h2 id="nos-user-modal-title">View Customer Profile</h2></div><button type="button" className="nos-users-icon-button" onClick={() => setSelectedMobile(null)} aria-label="Close profile"><X size={19} /></button></header>
        <div className="nos-users-modal-body">
          <div className="nos-users-profile-hero">
            <span className="nos-users-profile-avatar">{initials(fullName, selectedUser.mobile)}</span>
            <div className="nos-users-profile-name">
              <h3>{fullName}</h3>
              <span>Customer ID: {selectedUser.id || `NOS-${selectedUser.mobile}`}</span>
              <div className="nos-users-profile-badges">
                <span className={`nos-users-status ${(selectedUser.status || "Active").toLowerCase()}`}><span className="nos-users-status-dot" />{selectedUser.status || "Active"}</span>
                {selectedUser.mobileVerified && <span className="nos-users-plan free"><ShieldCheck size={12} />Mobile verified</span>}
              </div>
            </div>
            <div className="nos-users-profile-contact">
              <div className="nos-users-customer-rating" aria-label={`${selectedReviews.length} customer reviews`}>
                <div className="nos-users-customer-stars" aria-hidden="true">
                  {[1, 2, 3, 4, 5].map((star) => <Star key={star} size={16} fill={star <= Math.round(averageReviewRating) ? "currentColor" : "none"} />)}
                </div>
                <strong>{selectedReviews.length ? `${averageReviewRating.toFixed(1)} / 5` : "No reviews yet"}</strong>
                <small>{selectedReviews.length} {selectedReviews.length === 1 ? "review given" : "reviews given"}</small>
              </div>
              <span><Phone size={14} /> +91 {selectedUser.mobile}</span>
              <span><Mail size={14} /> {selectedUser.email || "Email not provided"}</span>
            </div>
          </div>

          <div className="nos-users-profile-meta">
            <div><MapPin size={19} /><span><small>Location</small><strong>{address || "Location not provided"}</strong></span></div>
            <div><CalendarDays size={19} /><span><small>Joined on</small><strong>{formatDate(selectedUser.createdAt)}</strong></span></div>
            <div><Clock3 size={19} /><span><small>Last active</small><strong>{formatDateTime(selectedUser.lastLoginAt)}</strong></span></div>
          </div>

          <section className="nos-users-about-card">
            <div className="nos-users-section-title"><ShieldCheck size={19} /><div><h3>Account Overview</h3><p>Customer account information and access status.</p></div></div>
            <p>{selectedUser.status === "Blocked" ? "This customer account is currently restricted by an administrator." : "This customer has a NeedOneService account and can access customer services from their profile."}</p>
            <div className="nos-users-about-tags"><span>{selectedUser.accountType || "Customer account"}</span><span>{selectedUser.mobileVerified ? "Mobile verified" : "Mobile verification not recorded"}</span><span>{selectedUser.loginCount || selectedUser.loginHistory?.length || (selectedUser.lastLoginAt ? 1 : 0)} recorded logins</span></div>
          </section>

          <section className="nos-users-detail-section"><div className="nos-users-section-title"><UserRound size={19} /><div><h3>Personal Information</h3><p>Customer details available in their NeedOneService account.</p></div></div><div className="nos-users-detail-grid">
            <div className="nos-users-detail-item"><span>Full name</span><strong>{selectedUser.name || selectedUser.fullName || "Not provided"}</strong></div>
            <div className="nos-users-detail-item"><span>Mobile number</span><strong>+91 {selectedUser.mobile}</strong></div>
            <div className="nos-users-detail-item"><span>Email address</span><strong>{selectedUser.email || "Not provided"}</strong></div>
            <div className="nos-users-detail-item"><span>Account type</span><strong>Customer account</strong></div>
            <div className="nos-users-detail-item"><span>Registration date</span><strong>{formatDateTime(selectedUser.createdAt)}</strong></div>
            <div className="nos-users-detail-item"><span>Last login</span><strong>{formatDateTime(selectedUser.lastLoginAt)}</strong></div>
            <div className="nos-users-detail-item"><span>Total recorded logins</span><strong>{selectedUser.loginCount || selectedUser.loginHistory?.length || (selectedUser.lastLoginAt ? 1 : 0)}</strong></div>
            <div className="nos-users-detail-item"><span>Mobile verification</span><strong>{selectedUser.mobileVerified ? "Verified" : "Not verified / not recorded"}</strong></div>
            <div className="nos-users-detail-item full"><span>Saved service / delivery address</span><strong>{address || "No saved address recorded"}</strong></div>
          </div></section>

          <section className="nos-users-detail-section"><div className="nos-users-section-title"><Settings size={19} /><div><h3>Account Preferences</h3><p>Preferences currently stored in this browser's Profile page.</p></div></div><div className="nos-users-detail-grid">
            <div className="nos-users-detail-item"><span>Language</span><strong>{settings.language || "English (default)"}</strong></div>
            <div className="nos-users-detail-item"><span>Service updates</span><strong>{settings.serviceUpdates === undefined ? "Default" : settings.serviceUpdates ? "Enabled" : "Disabled"}</strong></div>
            <div className="nos-users-detail-item"><span>Order updates</span><strong>{settings.orderUpdates === undefined ? "Default" : settings.orderUpdates ? "Enabled" : "Disabled"}</strong></div>
            <div className="nos-users-detail-item"><span>Promotional updates</span><strong>{settings.promotionalUpdates === undefined ? "Default" : settings.promotionalUpdates ? "Enabled" : "Disabled"}</strong></div>
          </div></section>

          <section className="nos-users-detail-section"><div className="nos-users-section-title"><ClipboardList size={19} /><div><h3>Bookings & Orders</h3><p>Order history currently stored in the Profile page.</p></div></div>{selectedOrders.length ? <div className="nos-users-order-list">{selectedOrders.map((order) => <article className="nos-users-order-item" key={order.id}><span className="nos-users-order-icon">{order.type?.toLowerCase() === "service" ? <ClipboardList size={17} /> : <ShoppingBag size={17} />}</span><div><strong>{order.title}</strong><small>Order ID: {order.id} · {order.type || "Order"} · {order.status}</small></div><time>{formatDate(order.date)}</time></article>)}</div> : <div className="nos-users-empty-activity">No bookings or product orders are recorded for this account yet.</div>}</section>

          <section className="nos-users-detail-section nos-users-reviews-section">
            <div className="nos-users-section-title"><MessageSquareText size={19} /><div><h3>Reviews & Services Taken</h3><p>Customer feedback shared with professionals and completed or recorded service bookings.</p></div></div>
            <div className="nos-users-review-summary">
              <article><span className="nos-users-review-summary-icon"><Star size={17} /></span><div><strong>{selectedReviews.length}</strong><small>Reviews given</small></div></article>
              <article><span className="nos-users-review-summary-icon"><ClipboardList size={17} /></span><div><strong>{selectedServiceOrders.length}</strong><small>Service bookings</small></div></article>
              <article><span className="nos-users-review-summary-icon"><Star size={17} /></span><div><strong>{selectedReviews.length ? `${averageReviewRating.toFixed(1)}/5` : "—"}</strong><small>Average rating given</small></div></article>
            </div>
            <div className="nos-users-review-subsection"><h4>Reviews given to professionals</h4>
              {selectedReviews.length ? <div className="nos-users-customer-review-list">{selectedReviews.map((review, index) => <article className="nos-users-customer-review" key={review.id || `${review.professionalName || review.professional || "review"}-${index}`}>
                <div className="nos-users-customer-review-top"><strong>{review.professionalName || review.professional || "Professional"}</strong><span className="nos-users-review-rating"><Star size={13} fill="currentColor" /> {Number(review.rating || 0).toFixed(1)} / 5</span></div>
                <small>{review.serviceName || review.service || "Service not specified"} · {formatDate(review.createdAt || review.date)}</small>
                <p>{review.comment || review.review || "No written feedback provided."}</p>
              </article>)}</div> : <div className="nos-users-empty-activity">No customer-submitted professional reviews are recorded for this account yet.</div>}
            </div>
            <div className="nos-users-review-subsection"><h4>Services taken</h4>
              {selectedServiceOrders.length ? <div className="nos-users-order-list">{selectedServiceOrders.map((order) => <article className="nos-users-order-item" key={`service-${order.id}`}><span className="nos-users-order-icon"><ClipboardList size={17} /></span><div><strong>{order.title}</strong><small>Booking ID: {order.id} · {order.status}</small></div><time>{formatDate(order.date)}</time></article>)}</div> : <div className="nos-users-empty-activity">No service bookings are linked to this customer yet.</div>}
            </div>
          </section>

          <section className="nos-users-detail-section"><div className="nos-users-section-title"><Activity size={19} /><div><h3>Recent Account Activity</h3><p>Login and profile events recorded for this customer.</p></div></div>
            <div className="nos-users-last-login"><span className="nos-users-last-login-icon"><LogIn size={18} /></span><div><span>Last recorded login</span><strong>{formatDateTime(selectedUser.lastLoginAt)}</strong></div></div>
            {selectedActivity.length ? <div className="nos-users-activity-list">{selectedActivity.map((item) => <article className="nos-users-activity-item" key={item.id}><span className="nos-users-activity-icon">{item.category === "Login" ? <LogIn size={16} /> : item.category === "Booking" || item.category === "Order" ? <ClipboardList size={16} /> : <UserCog size={16} />}</span><div className="nos-users-activity-content"><div className="nos-users-activity-heading"><strong>{item.title}</strong><span>{item.category}</span></div><p>{item.description}</p><time>{formatDateTime(item.timestamp)}</time></div></article>)}</div> : <div className="nos-users-empty-activity">No additional activity events have been recorded yet.</div>}
          </section>
        </div>
        <footer className="nos-users-modal-footer"><button type="button" className="nos-users-button close" onClick={() => setSelectedMobile(null)}>Close</button><button type="button" className={`nos-users-button ${selectedUser.status === "Blocked" ? "unblock" : "block"}`} onClick={() => { setSelectedMobile(null); setConfirmUser(selectedUser); }}>{selectedUser.status === "Blocked" ? "Unblock account" : "Block account"}</button></footer>
      </section></div>}

      {confirmUser && <div className="nos-users-overlay nos-users-confirm-overlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setConfirmUser(null); }}><section className="nos-users-confirm-modal" role="dialog" aria-modal="true" aria-labelledby="nos-users-confirm-title"><span className={`nos-users-confirm-icon ${confirmUser.status === "Blocked" ? "success" : "danger"}`}>{confirmUser.status === "Blocked" ? <CheckCircle2 size={24} /> : <Ban size={24} />}</span><h2 id="nos-users-confirm-title">{confirmUser.status === "Blocked" ? "Unblock customer?" : "Block customer?"}</h2><p>{confirmUser.status === "Blocked" ? "This customer will regain access in this browser-stored account directory." : "This marks the customer as blocked in the admin directory. It does not yet revoke login access through a server-side authentication system."}</p><div className="nos-users-confirm-user"><span className="nos-users-avatar">{initials(confirmUser.name || confirmUser.fullName, confirmUser.mobile)}</span><div><strong>{confirmUser.name || confirmUser.fullName || "Customer"}</strong><small>+91 {confirmUser.mobile}</small></div></div><div className="nos-users-confirm-actions"><button type="button" className="nos-users-button close" onClick={() => setConfirmUser(null)}>Cancel</button><button type="button" className={`nos-users-button ${confirmUser.status === "Blocked" ? "unblock" : "block"}`} onClick={() => toggleBlock(confirmUser)}>{confirmUser.status === "Blocked" ? "Yes, unblock" : "Yes, block"}</button></div></section></div>}
    </main>
  );
}
