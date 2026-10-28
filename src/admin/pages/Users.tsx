
import { useEffect, useMemo, useState } from "react";
import {
  Users as UsersIcon,
  Search,
  UserRound,
  Eye,
  ShieldCheck,
  Mail,
  Phone,
  CalendarDays,
  Clock3,
  CreditCard,
  Ban,
  CheckCircle2,
  X,
  Activity,
  Filter,
  RefreshCw,
  Hourglass,
  Wallet,
  CalendarClock,
  CircleAlert,
} from "lucide-react";
import "./Users.css";

type UserStatus = "Active" | "Blocked";
type ActivityCategory = "Login" | "Booking" | "Profile" | "Subscription";
type PaymentMode = "UPI" | "Credit Card" | "Debit Card" | "Net Banking" | "Wallet";
type PlanName = "Free" | "Basic" | "Premium" | "Professional";

interface UserActivity {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  category: ActivityCategory;
}

interface UserSubscription {
  plan: PlanName;
  paymentMode: PaymentMode;
  amount: number;
  currency: string;
  purchaseDate: string;
  expiryDate: string;
  status: "Active" | "Expired" | "Cancelled";
  transactionId: string;
}

interface UserRecord {
  id: string;
  name: string;
  email: string;
  mobile: string;
  status: UserStatus;
  joined: string;
  trialStartDate: string;
  location: string;
  lastLogin: string;
  activities: UserActivity[];
  subscription: UserSubscription | null;
}

const TRIAL_DAYS = 30;

const subscriptionPlans = [
  {
    name: "Basic",
    price: 199,
    duration: "month",
    description: "Essential features for everyday customers.",
  },
  {
    name: "Premium",
    price: 499,
    duration: "month",
    description: "Enhanced access and premium customer benefits.",
  },
  {
    name: "Professional",
    price: 999,
    duration: "month",
    description: "Advanced features and priority support.",
  },
] as const;

const initialUsers: UserRecord[] = [
  {
    id: "NOS-1001",
    name: "Rahul Kumar",
    email: "rahul@example.com",
    mobile: "9876543210",
    status: "Active",
    joined: "28 Oct 2026",
    trialStartDate: "2026-10-28T09:15:00",
    location: "Visakhapatnam, Andhra Pradesh",
    lastLogin: "28 Oct 2026, 10:42 AM",
    subscription: null,
    activities: [
      {
        id: "A-1001",
        title: "Logged in",
        description: "User accessed their OneService account.",
        timestamp: "28 Oct 2026, 10:42 AM",
        category: "Login",
      },
      {
        id: "A-1002",
        title: "Viewed home services",
        description: "User explored available home service categories.",
        timestamp: "28 Oct 2026, 10:35 AM",
        category: "Profile",
      },
      {
        id: "A-1003",
        title: "Free trial started",
        description: "The 30-day introductory trial started.",
        timestamp: "28 Oct 2026, 09:15 AM",
        category: "Subscription",
      },
    ],
  },
  {
    id: "NOS-1002",
    name: "Priya Sharma",
    email: "priya@example.com",
    mobile: "9876501234",
    status: "Active",
    joined: "27 Oct 2026",
    trialStartDate: "2026-09-01T10:00:00",
    location: "Madhurawada, Visakhapatnam",
    lastLogin: "28 Oct 2026, 11:20 AM",
    subscription: {
      plan: "Premium",
      paymentMode: "UPI",
      amount: 499,
      currency: "INR",
      purchaseDate: "2026-10-01",
      expiryDate: "2026-11-01",
      status: "Active",
      transactionId: "NOS-TXN-2002",
    },
    activities: [
      {
        id: "A-2001",
        title: "Logged in",
        description: "User accessed their OneService account.",
        timestamp: "28 Oct 2026, 11:20 AM",
        category: "Login",
      },
      {
        id: "A-2002",
        title: "Premium subscription purchased",
        description: "Premium monthly plan purchased using UPI.",
        timestamp: "01 Oct 2026, 10:00 AM",
        category: "Subscription",
      },
      {
        id: "A-2003",
        title: "Profile registered",
        description: "User account was created.",
        timestamp: "01 Sep 2026, 10:00 AM",
        category: "Profile",
      },
    ],
  },
  {
    id: "NOS-1003",
    name: "Anil Reddy",
    email: "anil@example.com",
    mobile: "9123456780",
    status: "Active",
    joined: "25 Oct 2026",
    trialStartDate: "2026-10-25T09:00:00",
    location: "MVP Colony, Visakhapatnam",
    lastLogin: "27 Oct 2026, 06:15 PM",
    subscription: null,
    activities: [
      {
        id: "A-3001",
        title: "Logged in",
        description: "User accessed their OneService account.",
        timestamp: "27 Oct 2026, 06:15 PM",
        category: "Login",
      },
      {
        id: "A-3002",
        title: "Explored marketplace",
        description: "User viewed products and accessories.",
        timestamp: "27 Oct 2026, 06:08 PM",
        category: "Booking",
      },
    ],
  },
  {
    id: "NOS-1004",
    name: "Sneha Rao",
    email: "sneha@example.com",
    mobile: "9988776655",
    status: "Blocked",
    joined: "20 Oct 2026",
    trialStartDate: "2026-09-10T14:00:00",
    location: "Gajuwaka, Visakhapatnam",
    lastLogin: "26 Oct 2026, 02:10 PM",
    subscription: {
      plan: "Basic",
      paymentMode: "Debit Card",
      amount: 199,
      currency: "INR",
      purchaseDate: "2026-10-10",
      expiryDate: "2026-11-10",
      status: "Active",
      transactionId: "NOS-TXN-4004",
    },
    activities: [
      {
        id: "A-4001",
        title: "Logged in",
        description: "User accessed their OneService account.",
        timestamp: "26 Oct 2026, 02:10 PM",
        category: "Login",
      },
      {
        id: "A-4002",
        title: "Basic subscription purchased",
        description: "Basic monthly plan purchased using a debit card.",
        timestamp: "10 Oct 2026, 02:00 PM",
        category: "Subscription",
      },
    ],
  },
];

const activityIcons = {
  Login: UserRound,
  Booking: CalendarDays,
  Profile: UserRound,
  Subscription: CreditCard,
};

function formatDate(date: Date) {
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatDateTime(date: Date) {
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getTrialDetails(trialStartDate: string) {
  const start = new Date(trialStartDate);
  const end = new Date(start);
  end.setDate(end.getDate() + TRIAL_DAYS);

  const now = new Date();
  const millisecondsRemaining = end.getTime() - now.getTime();
  const daysRemaining = Math.max(
    0,
    Math.ceil(millisecondsRemaining / (1000 * 60 * 60 * 24)),
  );

  const expired = now.getTime() >= end.getTime();

  return {
    start,
    end,
    daysRemaining,
    expired,
    totalDays: TRIAL_DAYS,
  };
}

function getSubscriptionState(user: UserRecord) {
  const trial = getTrialDetails(user.trialStartDate);

  if (user.subscription?.status === "Active") {
    return {
      type: "paid" as const,
      label: user.subscription.plan,
      trial,
    };
  }

  if (user.subscription?.status === "Expired") {
    return {
      type: "expired" as const,
      label: "Subscription expired",
      trial,
    };
  }

  if (user.subscription?.status === "Cancelled") {
    return {
      type: "cancelled" as const,
      label: "Subscription cancelled",
      trial,
    };
  }

  if (trial.expired) {
    return {
      type: "trial-expired" as const,
      label: "Trial expired",
      trial,
    };
  }

  return {
    type: "trial" as const,
    label: "Free trial",
    trial,
  };
}

function getPlanPrice(plan: PlanName) {
  if (plan === "Basic") return 199;
  if (plan === "Premium") return 499;
  if (plan === "Professional") return 999;
  return 0;
}

export default function UsersPage() {
  const [users, setUsers] = useState<UserRecord[]>(initialUsers);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | UserStatus>("All");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [confirmUser, setConfirmUser] = useState<UserRecord | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<PlanName>("Premium");
  const [selectedPaymentMode, setSelectedPaymentMode] =
    useState<PaymentMode>("UPI");
  const [subscriptionMessage, setSubscriptionMessage] = useState("");

  const selectedUser = useMemo(
    () => users.find((user) => user.id === selectedUserId) ?? null,
    [users, selectedUserId],
  );

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return users.filter((user) => {
      const matchesSearch = [
        user.name,
        user.email,
        user.mobile,
        user.id,
      ]
        .join(" ")
        .toLowerCase()
        .includes(query);

      const matchesStatus =
        statusFilter === "All" || user.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [users, search, statusFilter]);

  const activeCount = users.filter((user) => user.status === "Active").length;
  const blockedCount = users.filter((user) => user.status === "Blocked").length;
  const trialCount = users.filter(
    (user) => getSubscriptionState(user).type === "trial",
  ).length;
  const expiredTrialCount = users.filter(
    (user) => getSubscriptionState(user).type === "trial-expired",
  ).length;
  const paidCount = users.filter(
    (user) => getSubscriptionState(user).type === "paid",
  ).length;

  useEffect(() => {
    if (!selectedUserId && !confirmUser) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedUserId(null);
        setConfirmUser(null);
        setSubscriptionMessage("");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedUserId, confirmUser]);

  const toggleBlock = (user: UserRecord) => {
    const nextStatus: UserStatus =
      user.status === "Active" ? "Blocked" : "Active";

    setUsers((previous) =>
      previous.map((item) =>
        item.id === user.id ? { ...item, status: nextStatus } : item,
      ),
    );

    setConfirmUser(null);
  };

  const openBlockConfirmation = (user: UserRecord) => {
    setConfirmUser(user);
  };

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("All");
  };

  const getInitials = (name: string) =>
    name
      .trim()
      .split(/\s+/)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  const purchaseDemoSubscription = (user: UserRecord) => {
    const today = new Date();
    const expiry = new Date(today);
    expiry.setMonth(expiry.getMonth() + 1);

    const subscription: UserSubscription = {
      plan: selectedPlan,
      paymentMode: selectedPaymentMode,
      amount: getPlanPrice(selectedPlan),
      currency: "INR",
      purchaseDate: today.toISOString().slice(0, 10),
      expiryDate: expiry.toISOString().slice(0, 10),
      status: "Active",
      transactionId: `DEMO-${Date.now()}`,
    };

    const activity: UserActivity = {
      id: `A-${Date.now()}`,
      title: `${selectedPlan} plan selected`,
      description: `${selectedPlan} monthly subscription recorded with ${selectedPaymentMode}. This is a demo record, not a real payment.`,
      timestamp: formatDateTime(today),
      category: "Subscription",
    };

    setUsers((previous) =>
      previous.map((item) =>
        item.id === user.id
          ? {
              ...item,
              subscription,
              activities: [activity, ...item.activities],
            }
          : item,
      ),
    );

    setSubscriptionMessage(
      `${selectedPlan} demo subscription was recorded. No real payment was processed.`,
    );
  };

  return (
    <main className="nos-users-page">
      <header className="nos-users-heading">
        <div>
          <span className="nos-users-kicker">ADMINISTRATION / USERS</span>
          <h1>Users Management</h1>
          <p>
            Manage customer accounts, review profiles, and monitor trial and
            subscription information.
          </p>
        </div>

        <div className="nos-users-heading-badge">
          <UsersIcon size={18} />
          <span>Customer Directory</span>
        </div>
      </header>

      <section className="nos-users-stats">
        <article className="nos-users-stat">
          <div className="nos-users-stat-top">
            <span className="nos-users-stat-icon blue">
              <UsersIcon size={22} />
            </span>
            <span className="nos-users-stat-caption">All accounts</span>
          </div>
          <div className="nos-users-stat-value">{users.length}</div>
          <div className="nos-users-stat-bottom">
            <span>Total Users</span>
            <small>Registered demo accounts</small>
          </div>
        </article>

        <article className="nos-users-stat">
          <div className="nos-users-stat-top">
            <span className="nos-users-stat-icon green">
              <CheckCircle2 size={22} />
            </span>
            <span className="nos-users-stat-caption">Available</span>
          </div>
          <div className="nos-users-stat-value">{activeCount}</div>
          <div className="nos-users-stat-bottom">
            <span>Active Users</span>
            <small>Accounts marked active</small>
          </div>
        </article>

        <article className="nos-users-stat">
          <div className="nos-users-stat-top">
            <span className="nos-users-stat-icon red">
              <Ban size={22} />
            </span>
            <span className="nos-users-stat-caption">Restricted</span>
          </div>
          <div className="nos-users-stat-value">{blockedCount}</div>
          <div className="nos-users-stat-bottom">
            <span>Blocked Users</span>
            <small>Accounts marked blocked</small>
          </div>
        </article>

        <article className="nos-users-stat">
          <div className="nos-users-stat-top">
            <span className="nos-users-stat-icon blue">
              <Hourglass size={22} />
            </span>
            <span className="nos-users-stat-caption">Trial period</span>
          </div>
          <div className="nos-users-stat-value">{trialCount}</div>
          <div className="nos-users-stat-bottom">
            <span>Free Trials</span>
            <small>Users currently in trial</small>
          </div>
        </article>

        <article className="nos-users-stat">
          <div className="nos-users-stat-top">
            <span className="nos-users-stat-icon green">
              <CreditCard size={22} />
            </span>
            <span className="nos-users-stat-caption">Paid accounts</span>
          </div>
          <div className="nos-users-stat-value">{paidCount}</div>
          <div className="nos-users-stat-bottom">
            <span>Subscribed Users</span>
            <small>{expiredTrialCount} trials expired</small>
          </div>
        </article>
      </section>

      <section className="nos-users-panel">
        <div className="nos-users-panel-header">
          <div>
            <h2>Registered Users</h2>
            <p>
              Search accounts, check trial status, review subscriptions, and
              manage user access.
            </p>
          </div>

          <span className="nos-users-count">
            {filteredUsers.length}{" "}
            {filteredUsers.length === 1 ? "user" : "users"}
          </span>
        </div>

        <div className="nos-users-toolbar">
          <label className="nos-users-search">
            <Search size={18} />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search name, email, mobile or ID..."
              aria-label="Search users"
            />
            {search && (
              <button
                type="button"
                className="nos-users-search-clear"
                aria-label="Clear search"
                onClick={() => setSearch("")}
              >
                <X size={15} />
              </button>
            )}
          </label>

          <label className="nos-users-filter">
            <Filter size={17} />
            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value as "All" | UserStatus)
              }
              aria-label="Filter users by status"
            >
              <option value="All">All statuses</option>
              <option value="Active">Active</option>
              <option value="Blocked">Blocked</option>
            </select>
          </label>

          <button
            type="button"
            className="nos-users-reset-button"
            onClick={resetFilters}
            title="Reset search and filters"
          >
            <RefreshCw size={16} />
            Reset
          </button>
        </div>

        <div className="nos-users-table-wrap">
          <table className="nos-users-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Contact Information</th>
                <th>Subscription</th>
                <th>Status</th>
                <th>Date Joined</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map((user) => {
                const subscriptionState = getSubscriptionState(user);

                return (
                  <tr key={user.id}>
                    <td>
                      <div className="nos-users-identity">
                        <span className="nos-users-avatar">
                          {getInitials(user.name)}
                        </span>
                        <div className="nos-users-identity-text">
                          <strong>{user.name}</strong>
                          <small>{user.id}</small>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div className="nos-users-contact-cell">
                        <span>
                          <Phone size={13} />
                          {user.mobile}
                        </span>
                        <span>
                          <Mail size={13} />
                          {user.email}
                        </span>
                      </div>
                    </td>

                    <td>
                      <span
                        className={`nos-users-plan ${
                          subscriptionState.type === "paid"
                            ? "premium"
                            : "free"
                        }`}
                      >
                        {subscriptionState.type === "paid" ? (
                          <ShieldCheck size={14} />
                        ) : (
                          <Hourglass size={14} />
                        )}
                        {subscriptionState.label}
                      </span>
                      {subscriptionState.type === "trial" && (
                        <small className="nos-users-subscription-hint">
                          {subscriptionState.trial.daysRemaining} days left
                        </small>
                      )}
                      {subscriptionState.type === "trial-expired" && (
                        <small className="nos-users-subscription-hint expired">
                          Choose a plan
                        </small>
                      )}
                    </td>

                    <td>
                      <span
                        className={`nos-users-status ${
                          user.status === "Active" ? "active" : "blocked"
                        }`}
                      >
                        <span className="nos-users-status-dot" />
                        {user.status}
                      </span>
                    </td>

                    <td>
                      <span className="nos-users-joined">
                        <CalendarDays size={14} />
                        {user.joined}
                      </span>
                    </td>

                    <td>
                      <div className="nos-users-row-actions">
                        <button
                          type="button"
                          className="nos-users-button view"
                          onClick={() => {
                            setSelectedUserId(user.id);
                            setSubscriptionMessage("");
                          }}
                        >
                          <Eye size={15} />
                          View Profile
                        </button>

                        <button
                          type="button"
                          className={`nos-users-button ${
                            user.status === "Active" ? "block" : "unblock"
                          }`}
                          onClick={() => openBlockConfirmation(user)}
                        >
                          {user.status === "Active" ? (
                            <Ban size={14} />
                          ) : (
                            <CheckCircle2 size={14} />
                          )}
                          {user.status === "Active" ? "Block" : "Unblock"}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={6}>
                    <div className="nos-users-empty">
                      <span className="nos-users-empty-icon">
                        <Search size={24} />
                      </span>
                      <strong>No users found</strong>
                      <p>
                        Try a different search term or change the status
                        filter.
                      </p>
                      <button
                        type="button"
                        className="nos-users-button view"
                        onClick={resetFilters}
                      >
                        Reset filters
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="nos-users-panel-footer">
          <span>
            Showing {filteredUsers.length} of {users.length} demo accounts
          </span>
          <span className="nos-users-demo-note">
            <span />
            Sample data
          </span>
        </div>
      </section>

      {selectedUser && (
        <div
          className="nos-users-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedUserId(null);
              setSubscriptionMessage("");
            }
          }}
        >
          <section
            className="nos-users-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="nos-user-profile-title"
          >
            <header className="nos-users-modal-header">
              <div>
                <span className="nos-users-modal-kicker">ACCOUNT OVERVIEW</span>
                <h2 id="nos-user-profile-title">User Profile</h2>
              </div>

              <button
                type="button"
                className="nos-users-icon-button"
                aria-label="Close profile"
                onClick={() => {
                  setSelectedUserId(null);
                  setSubscriptionMessage("");
                }}
              >
                <X size={20} />
              </button>
            </header>

            <div className="nos-users-modal-body">
              <div className="nos-users-profile-hero">
                <span className="nos-users-profile-avatar">
                  {getInitials(selectedUser.name)}
                </span>

                <div className="nos-users-profile-name">
                  <h3>{selectedUser.name}</h3>
                  <span>{selectedUser.id}</span>
                  <div className="nos-users-profile-badges">
                    <span
                      className={`nos-users-status ${
                        selectedUser.status === "Active" ? "active" : "blocked"
                      }`}
                    >
                      <span className="nos-users-status-dot" />
                      {selectedUser.status}
                    </span>
                  </div>
                </div>
              </div>

              <section className="nos-users-detail-section">
                <div className="nos-users-section-title">
                  <UserRound size={19} />
                  <div>
                    <h3>Personal Information</h3>
                    <p>Contact and registration details</p>
                  </div>
                </div>

                <div className="nos-users-detail-grid">
                  <div className="nos-users-detail-item">
                    <span>Full Name</span>
                    <strong>{selectedUser.name}</strong>
                  </div>
                  <div className="nos-users-detail-item">
                    <span>Email Address</span>
                    <strong className="nos-users-break-word">
                      {selectedUser.email}
                    </strong>
                  </div>
                  <div className="nos-users-detail-item">
                    <span>Mobile Number</span>
                    <strong>{selectedUser.mobile}</strong>
                  </div>
                  <div className="nos-users-detail-item">
                    <span>Registration Date</span>
                    <strong>{selectedUser.joined}</strong>
                  </div>
                  <div className="nos-users-detail-item full">
                    <span>Location</span>
                    <strong>{selectedUser.location}</strong>
                  </div>
                </div>
              </section>

              <section className="nos-users-detail-section">
                <div className="nos-users-section-title">
                  <CreditCard size={19} />
                  <div>
                    <h3>Subscription & Free Trial</h3>
                    <p>30-day trial and payment plan information</p>
                  </div>
                </div>

                {(() => {
                  const state = getSubscriptionState(selectedUser);
                  const trial = state.trial;

                  if (state.type === "paid" && selectedUser.subscription) {
                    const subscription = selectedUser.subscription;

                    return (
                      <div className="nos-users-subscription-card">
                        <div className="nos-users-subscription-icon">
                          <ShieldCheck size={23} />
                        </div>
                        <div className="nos-users-subscription-info">
                          <span className="nos-users-subscription-label">
                            ACTIVE PAID SUBSCRIPTION
                          </span>
                          <h4>{subscription.plan} Plan</h4>
                          <p>
                            ₹{subscription.amount.toLocaleString("en-IN")} per
                            month
                          </p>
                          <div className="nos-users-subscription-details">
                            <span>
                              <Wallet size={14} />
                              Payment: {subscription.paymentMode}
                            </span>
                            <span>
                              <CalendarDays size={14} />
                              Purchased: {formatDate(new Date(subscription.purchaseDate))}
                            </span>
                            <span>
                              <CalendarClock size={14} />
                              Expires: {formatDate(new Date(subscription.expiryDate))}
                            </span>
                            <span>
                              <CheckCircle2 size={14} />
                              Status: {subscription.status}
                            </span>
                            <span className="nos-users-break-word">
                              Transaction: {subscription.transactionId}
                            </span>
                          </div>
                        </div>
                        <span className="nos-users-subscription-tag">Paid</span>
                      </div>
                    );
                  }

                  if (state.type === "trial") {
                    const elapsed = TRIAL_DAYS - trial.daysRemaining;
                    const progress = Math.min(
                      100,
                      Math.max(0, (elapsed / TRIAL_DAYS) * 100),
                    );

                    return (
                      <div className="nos-users-trial-card">
                        <div className="nos-users-trial-header">
                          <span className="nos-users-trial-icon">
                            <Hourglass size={23} />
                          </span>
                          <div>
                            <span className="nos-users-subscription-label">
                              INTRODUCTORY OFFER
                            </span>
                            <h4>30-Day Free Trial</h4>
                            <p>
                              {trial.daysRemaining}{" "}
                              {trial.daysRemaining === 1 ? "day" : "days"}{" "}
                              remaining
                            </p>
                          </div>
                          <span className="nos-users-subscription-tag">
                            Free
                          </span>
                        </div>

                        <div className="nos-users-trial-progress">
                          <div>
                            <span>Trial progress</span>
                            <strong>{Math.round(progress)}%</strong>
                          </div>
                          <div className="nos-users-trial-track">
                            <span style={{ width: `${progress}%` }} />
                          </div>
                        </div>

                        <div className="nos-users-trial-dates">
                          <span>
                            <CalendarDays size={14} />
                            Started: {formatDate(trial.start)}
                          </span>
                          <span>
                            <CalendarClock size={14} />
                            Ends: {formatDate(trial.end)}
                          </span>
                        </div>

                        <p className="nos-users-disclaimer">
                          Trial timing is calculated from the account's trial
                          start date. This demo does not enforce access limits.
                        </p>
                      </div>
                    );
                  }

                  return (
                    <div className="nos-users-trial-expired">
                      <span className="nos-users-trial-expired-icon">
                        <CircleAlert size={22} />
                      </span>
                      <div>
                        <h4>
                          {state.type === "cancelled"
                            ? "Subscription cancelled"
                            : state.type === "expired"
                              ? "Subscription expired"
                              : "30-day free trial expired"}
                        </h4>
                        <p>
                          {state.type === "cancelled"
                            ? "This user's subscription has been cancelled."
                            : state.type === "expired"
                              ? "This user's paid subscription has expired."
                              : "The introductory trial has ended. Select a plan below to record a demo subscription."}
                        </p>
                      </div>
                    </div>
                  );
                })()}

                {getSubscriptionState(selectedUser).type !== "paid" && (
                  <div className="nos-users-plans">
                    <div className="nos-users-plans-heading">
                      <div>
                        <h4>Available Subscription Plans</h4>
                        <p>Select a plan and payment mode for this demo.</p>
                      </div>
                    </div>

                    <div className="nos-users-plan-options">
                      {subscriptionPlans.map((plan) => (
                        <button
                          type="button"
                          key={plan.name}
                          className={`nos-users-plan-option ${
                            selectedPlan === plan.name ? "selected" : ""
                          }`}
                          onClick={() => {
                            setSelectedPlan(plan.name);
                            setSubscriptionMessage("");
                          }}
                        >
                          <span className="nos-users-plan-option-top">
                            <strong>{plan.name}</strong>
                            {selectedPlan === plan.name && (
                              <CheckCircle2 size={17} />
                            )}
                          </span>
                          <span className="nos-users-plan-price">
                            ₹{plan.price}
                            <small>/month</small>
                          </span>
                          <span className="nos-users-plan-description">
                            {plan.description}
                          </span>
                        </button>
                      ))}
                    </div>

                    <label className="nos-users-payment-label">
                      Payment Mode
                      <select
                        value={selectedPaymentMode}
                        onChange={(event) =>
                          setSelectedPaymentMode(
                            event.target.value as PaymentMode,
                          )
                        }
                      >
                        <option value="UPI">UPI</option>
                        <option value="Credit Card">Credit Card</option>
                        <option value="Debit Card">Debit Card</option>
                        <option value="Net Banking">Net Banking</option>
                        <option value="Wallet">Wallet</option>
                      </select>
                    </label>

                    <button
                      type="button"
                      className="nos-users-button view nos-users-record-plan"
                      onClick={() => purchaseDemoSubscription(selectedUser)}
                    >
                      <CreditCard size={16} />
                      Record Demo Subscription — ₹
                      {getPlanPrice(selectedPlan).toLocaleString("en-IN")}
                    </button>

                    <p className="nos-users-disclaimer">
                      This action records sample subscription data only. It
                      does not charge the user or contact a payment gateway.
                    </p>

                    {subscriptionMessage && (
                      <p className="nos-users-subscription-message" role="status">
                        <CheckCircle2 size={16} />
                        {subscriptionMessage}
                      </p>
                    )}
                  </div>
                )}
              </section>

              <section className="nos-users-detail-section">
                <div className="nos-users-section-title">
                  <Activity size={19} />
                  <div>
                    <h3>Recent Activity</h3>
                    <p>Latest sample events with their timestamps</p>
                  </div>
                </div>

                <div className="nos-users-last-login">
                  <span className="nos-users-last-login-icon">
                    <Clock3 size={17} />
                  </span>
                  <div>
                    <span>Last login</span>
                    <strong>{selectedUser.lastLogin}</strong>
                  </div>
                </div>

                {selectedUser.activities.length > 0 ? (
                  <div className="nos-users-activity-list">
                    {selectedUser.activities.map((activity) => {
                      const ActivityIcon = activityIcons[activity.category];

                      return (
                        <article
                          className="nos-users-activity-item"
                          key={activity.id}
                        >
                          <span className="nos-users-activity-icon">
                            <ActivityIcon size={16} />
                          </span>
                          <div className="nos-users-activity-content">
                            <div className="nos-users-activity-heading">
                              <strong>{activity.title}</strong>
                              <span>{activity.category}</span>
                            </div>
                            <p>{activity.description}</p>
                            <time>{activity.timestamp}</time>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                ) : (
                  <div className="nos-users-empty-activity">
                    No activity records are available for this user.
                  </div>
                )}

                <p className="nos-users-disclaimer">
                  Activity records are illustrative demo data, not verified
                  tracking history.
                </p>
              </section>
            </div>

            <footer className="nos-users-modal-footer">
              <button
                type="button"
                className="nos-users-button close"
                onClick={() => {
                  setSelectedUserId(null);
                  setSubscriptionMessage("");
                }}
              >
                Close
              </button>

              <button
                type="button"
                className={`nos-users-button ${
                  selectedUser.status === "Active" ? "block" : "unblock"
                }`}
                onClick={() => openBlockConfirmation(selectedUser)}
              >
                {selectedUser.status === "Active" ? (
                  <Ban size={15} />
                ) : (
                  <CheckCircle2 size={15} />
                )}
                {selectedUser.status === "Active" ? "Block User" : "Unblock User"}
              </button>
            </footer>
          </section>
        </div>
      )}

      {confirmUser && (
        <div
          className="nos-users-overlay nos-users-confirm-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setConfirmUser(null);
          }}
        >
          <section
            className="nos-users-confirm-modal"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="nos-users-confirm-title"
            aria-describedby="nos-users-confirm-description"
          >
            <span
              className={`nos-users-confirm-icon ${
                confirmUser.status === "Active" ? "danger" : "success"
              }`}
            >
              {confirmUser.status === "Active" ? (
                <Ban size={24} />
              ) : (
                <ShieldCheck size={24} />
              )}
            </span>

            <h2 id="nos-users-confirm-title">
              {confirmUser.status === "Active"
                ? "Block this user?"
                : "Unblock this user?"}
            </h2>

            <p id="nos-users-confirm-description">
              {confirmUser.status === "Active"
                ? `You are about to mark ${confirmUser.name}'s account as blocked.`
                : `You are about to restore ${confirmUser.name}'s account to active status.`}
            </p>

            <div className="nos-users-confirm-user">
              <span className="nos-users-avatar">
                {getInitials(confirmUser.name)}
              </span>
              <div>
                <strong>{confirmUser.name}</strong>
                <small>{confirmUser.id}</small>
              </div>
            </div>

            <div className="nos-users-confirm-actions">
              <button
                type="button"
                className="nos-users-button close"
                onClick={() => setConfirmUser(null)}
              >
                Cancel
              </button>

              <button
                type="button"
                className={`nos-users-button ${
                  confirmUser.status === "Active" ? "block" : "unblock"
                }`}
                onClick={() => toggleBlock(confirmUser)}
              >
                {confirmUser.status === "Active"
                  ? "Confirm Block"
                  : "Confirm Unblock"}
              </button>
            </div>

            <p className="nos-users-confirm-note">
              This demo changes the account status in the current page only.
            </p>
          </section>
        </div>
      )}
    </main>
  );
}
