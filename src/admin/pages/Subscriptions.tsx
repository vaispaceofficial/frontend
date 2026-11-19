
import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  BadgeCheck,
  Building2,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Download,
  Edit3,
  Filter,
  Plus,
  Search,
  Settings2,
  Store,
  Trash2,
  Users,
  Wallet,
  Wrench,
  X,
} from "lucide-react";

import "./Subscriptions.css";

/* =========================================================
   TYPES
========================================================= */

type SubscriptionCategory =
  | "Professionals"
  | "City Listings"
  | "Marketplace Sellers";

type UserStatus =
  | "Free Trial"
  | "Active"
  | "Expired"
  | "Payment Pending";

type Plan = {
  id: string;
  category: SubscriptionCategory;
  name: string;
  price: number;
  duration: number;
  trialDays: number;
  description: string;
  benefits: string[];
  enabled: boolean;
  featured?: boolean;
};

type SubscriptionUser = {
  id: string;
  name: string;
  email: string;
  phone: string;
  category: SubscriptionCategory;
  plan: string;
  status: UserStatus;
  startDate: string;
  expiryDate: string;
  amount: number;
};

type Payment = {
  id: string;
  partner: string;
  category: SubscriptionCategory;
  plan: string;
  amount: number;
  date: string;
  expiry: string;
  status: "Paid" | "Pending" | "Failed";
};

/* =========================================================
   DEFAULT SUBSCRIPTION PLANS

   Initial values can be changed by the admin.
   Plan changes are saved in localStorage.
========================================================= */

const defaultPlans: Plan[] = [
  // PROFESSIONALS

  {
    id: "pro-basic",
    category: "Professionals",
    name: "Basic",
    price: 199,
    duration: 30,
    trialDays: 30,
    description: "Essential professional visibility",
    benefits: [
      "1 service category",
      "Up to 3 profile photos",
      "1 PIN code coverage",
      "Direct Call and WhatsApp",
      "Professional profile listing",
    ],
    enabled: true,
  },
  {
    id: "pro-exclusive",
    category: "Professionals",
    name: "Exclusive",
    price: 499,
    duration: 30,
    trialDays: 30,
    description: "Enhanced visibility and customer reach",
    benefits: [
      "Up to 3 service categories",
      "Up to 15 profile photos",
      "Video profile support",
      "Priority search placement",
      "Lead alerts",
    ],
    enabled: true,
    featured: true,
  },
  {
    id: "pro-premium",
    category: "Professionals",
    name: "Premium",
    price: 999,
    duration: 30,
    trialDays: 30,
    description: "Maximum visibility and premium benefits",
    benefits: [
      "Unlimited service categories",
      "Multiple location coverage",
      "Top 3 search placement",
      "Verified professional seal",
      "Monthly promotional banner",
      "Dedicated support",
    ],
    enabled: true,
  },

  // CITY LISTINGS

  {
    id: "city-lite",
    category: "City Listings",
    name: "Lite",
    price: 199,
    duration: 30,
    trialDays: 30,
    description: "Basic business and property listing",
    benefits: [
      "Basic business listing",
      "Standard search visibility",
      "Basic gallery",
      "Contact information",
    ],
    enabled: true,
  },
  {
    id: "city-growth",
    category: "City Listings",
    name: "Growth",
    price: 499,
    duration: 30,
    trialDays: 30,
    description: "More visibility for growing businesses",
    benefits: [
      "Enhanced business listing",
      "Priority search visibility",
      "Extended photo gallery",
      "Multiple listing categories",
      "Customer enquiry access",
    ],
    enabled: true,
    featured: true,
  },
  {
    id: "city-pro",
    category: "City Listings",
    name: "Pro",
    price: 999,
    duration: 30,
    trialDays: 30,
    description: "Premium listing and promotional placement",
    benefits: [
      "Premium listing placement",
      "Multiple location coverage",
      "Extended gallery",
      "Featured business visibility",
      "Promotional placement",
      "Priority support",
    ],
    enabled: true,
  },

  // MARKETPLACE SELLERS

  {
    id: "seller-lite",
    category: "Marketplace Sellers",
    name: "Lite",
    price: 299,
    duration: 30,
    trialDays: 30,
    description: "Start selling on the marketplace",
    benefits: [
      "Up to 15 product listings",
      "Seller dashboard access",
      "Basic product analytics",
      "Standard product visibility",
    ],
    enabled: true,
  },
  {
    id: "seller-growth",
    category: "Marketplace Sellers",
    name: "Growth",
    price: 699,
    duration: 30,
    trialDays: 30,
    description: "Grow your marketplace business",
    benefits: [
      "Up to 75 product listings",
      "Enhanced product visibility",
      "Sales analytics",
      "Inventory management",
      "Priority seller support",
    ],
    enabled: true,
    featured: true,
  },
  {
    id: "seller-pro",
    category: "Marketplace Sellers",
    name: "Pro",
    price: 1499,
    duration: 30,
    trialDays: 30,
    description: "Complete marketplace selling experience",
    benefits: [
      "Unlimited product listings",
      "Premium product visibility",
      "Advanced sales analytics",
      "Promotional opportunities",
      "Priority seller support",
      "Enhanced seller profile",
    ],
    enabled: true,
  },
];

/* =========================================================
   DEMONSTRATION USERS

   Replace with actual registration/subscription records
   when backend integration is implemented.
========================================================= */

const initialUsers: SubscriptionUser[] = [
  {
    id: "USR-1001",
    name: "Rajesh Kumar",
    email: "rajesh@example.com",
    phone: "9876543210",
    category: "Professionals",
    plan: "Premium",
    status: "Free Trial",
    startDate: "2026-11-05",
    expiryDate: "2026-12-05",
    amount: 0,
  },
  {
    id: "USR-1002",
    name: "Ananya Rao",
    email: "ananya@example.com",
    phone: "9876543211",
    category: "City Listings",
    plan: "Growth",
    status: "Active",
    startDate: "2026-10-20",
    expiryDate: "2026-11-20",
    amount: 499,
  },
  {
    id: "USR-1003",
    name: "Metro Electronics",
    email: "metro@example.com",
    phone: "9876543212",
    category: "Marketplace Sellers",
    plan: "Pro",
    status: "Active",
    startDate: "2026-11-01",
    expiryDate: "2026-12-01",
    amount: 1499,
  },
  {
    id: "USR-1004",
    name: "Sai Home Services",
    email: "sai@example.com",
    phone: "9876543213",
    category: "Professionals",
    plan: "Basic",
    status: "Expired",
    startDate: "2026-09-01",
    expiryDate: "2026-10-01",
    amount: 199,
  },
  {
    id: "USR-1005",
    name: "Harbour Spares Hub",
    email: "harbour@example.com",
    phone: "9876543214",
    category: "Marketplace Sellers",
    plan: "Growth",
    status: "Payment Pending",
    startDate: "2026-11-15",
    expiryDate: "2026-12-15",
    amount: 699,
  },
  {
    id: "USR-1006",
    name: "Horizon Interiors",
    email: "horizon@example.com",
    phone: "9876543215",
    category: "City Listings",
    plan: "Lite",
    status: "Free Trial",
    startDate: "2026-11-12",
    expiryDate: "2026-12-12",
    amount: 0,
  },
];

/* =========================================================
   DEMONSTRATION PAYMENT DATA
========================================================= */

const initialPayments: Payment[] = [
  {
    id: "TXN-78421",
    partner: "Ananya Rao",
    category: "City Listings",
    plan: "Growth",
    amount: 499,
    date: "2026-10-20",
    expiry: "2026-11-20",
    status: "Paid",
  },
  {
    id: "TXN-78422",
    partner: "Metro Electronics",
    category: "Marketplace Sellers",
    plan: "Pro",
    amount: 1499,
    date: "2026-11-01",
    expiry: "2026-12-01",
    status: "Paid",
  },
  {
    id: "TXN-78423",
    partner: "Sai Home Services",
    category: "Professionals",
    plan: "Basic",
    amount: 199,
    date: "2026-09-01",
    expiry: "2026-10-01",
    status: "Paid",
  },
  {
    id: "TXN-78424",
    partner: "Harbour Spares Hub",
    category: "Marketplace Sellers",
    plan: "Growth",
    amount: 699,
    date: "2026-11-15",
    expiry: "2026-12-15",
    status: "Pending",
  },
];

/* =========================================================
   CONSTANTS
========================================================= */

const categories: SubscriptionCategory[] = [
  "Professionals",
  "City Listings",
  "Marketplace Sellers",
];

const userStatuses: UserStatus[] = [
  "Free Trial",
  "Active",
  "Expired",
  "Payment Pending",
];

const formatCurrency = (amount: number) =>
  `₹${amount.toLocaleString("en-IN")}`;

const formatDate = (date: string) => {
  if (!date) return "—";

  return new Date(`${date}T00:00:00`).toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
};

/* =========================================================
   COMPONENT
========================================================= */

export default function Subscriptions() {
  const [activeCategory, setActiveCategory] =
    useState<SubscriptionCategory>("Professionals");

  const [activeSection, setActiveSection] = useState<
    "overview" | "plans" | "users" | "payments"
  >("overview");

  const [plans, setPlans] = useState<Plan[]>(() => {
    try {
      const saved = localStorage.getItem(
        "oneservice_subscription_plans"
      );

      return saved ? JSON.parse(saved) : defaultPlans;
    } catch {
      return defaultPlans;
    }
  });

  const [users] = useState<SubscriptionUser[]>(initialUsers);
  const [payments] = useState<Payment[]>(initialPayments);

  const [editingPlan, setEditingPlan] = useState<Plan | null>(
    null
  );

  const [showPlanEditor, setShowPlanEditor] = useState(false);

  const [userSearch, setUserSearch] = useState("");
  const [userStatus, setUserStatus] = useState("All");
  const [userCategory, setUserCategory] = useState("All");

  const [paymentSearch, setPaymentSearch] = useState("");
  const [paymentCategory, setPaymentCategory] = useState("All");
  const [paymentFilterOpen, setPaymentFilterOpen] =
    useState(false);

  const [selectedUser, setSelectedUser] =
    useState<SubscriptionUser | null>(null);

  const [benefitInput, setBenefitInput] = useState("");

  /* =====================================================
     SAVE PLAN CHANGES
  ===================================================== */

  useEffect(() => {
    localStorage.setItem(
      "oneservice_subscription_plans",
      JSON.stringify(plans)
    );
  }, [plans]);

  /* =====================================================
     CATEGORY PLANS
  ===================================================== */

  const categoryPlans = useMemo(
    () =>
      plans.filter(
        (plan) => plan.category === activeCategory
      ),
    [plans, activeCategory]
  );

  /* =====================================================
     STATISTICS
  ===================================================== */

  const activeSubscriptions = users.filter(
    (user) => user.status === "Active"
  ).length;

  const freeTrialUsers = users.filter(
    (user) => user.status === "Free Trial"
  ).length;

  const expiredUsers = users.filter(
    (user) => user.status === "Expired"
  ).length;

  const pendingUsers = users.filter(
    (user) => user.status === "Payment Pending"
  ).length;

  const totalRevenue = payments
    .filter((payment) => payment.status === "Paid")
    .reduce((total, payment) => total + payment.amount, 0);

  /* =====================================================
     USER FILTERING
  ===================================================== */

  const filteredUsers = useMemo(() => {
    const query = userSearch.toLowerCase().trim();

    return users.filter((user) => {
      const matchesSearch =
        !query ||
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.id.toLowerCase().includes(query) ||
        user.phone.includes(query);

      const matchesStatus =
        userStatus === "All" ||
        user.status === userStatus;

      const matchesCategory =
        userCategory === "All" ||
        user.category === userCategory;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesCategory
      );
    });
  }, [users, userSearch, userStatus, userCategory]);

  /* =====================================================
     PAYMENT FILTERING
  ===================================================== */

  const filteredPayments = useMemo(() => {
    const query = paymentSearch.toLowerCase().trim();

    return payments.filter((payment) => {
      const matchesSearch =
        !query ||
        payment.id.toLowerCase().includes(query) ||
        payment.partner.toLowerCase().includes(query);

      const matchesCategory =
        paymentCategory === "All" ||
        payment.category === paymentCategory;

      return matchesSearch && matchesCategory;
    });
  }, [payments, paymentSearch, paymentCategory]);

  /* =====================================================
     PLAN EDITOR
  ===================================================== */

  const openNewPlan = () => {
    setEditingPlan({
      id: `plan-${Date.now()}`,
      category: activeCategory,
      name: "",
      price: 0,
      duration: 30,
      trialDays: 30,
      description: "",
      benefits: [],
      enabled: true,
    });

    setBenefitInput("");
    setShowPlanEditor(true);
  };

  const openEditPlan = (plan: Plan) => {
    setEditingPlan({ ...plan });
    setBenefitInput("");
    setShowPlanEditor(true);
  };

  const savePlan = () => {
    if (!editingPlan) return;

    if (!editingPlan.name.trim()) {
      alert("Please enter a plan name.");
      return;
    }

    if (editingPlan.price < 0) {
      alert("Price cannot be negative.");
      return;
    }

    if (
      editingPlan.duration <= 0 ||
      editingPlan.trialDays < 0
    ) {
      alert("Please enter valid duration and trial values.");
      return;
    }

    setPlans((current) => {
      const exists = current.some(
        (plan) => plan.id === editingPlan.id
      );

      if (exists) {
        return current.map((plan) =>
          plan.id === editingPlan.id
            ? editingPlan
            : plan
        );
      }

      return [...current, editingPlan];
    });

    setShowPlanEditor(false);
    setEditingPlan(null);
  };

  const togglePlan = (id: string) => {
    setPlans((current) =>
      current.map((plan) =>
        plan.id === id
          ? { ...plan, enabled: !plan.enabled }
          : plan
      )
    );
  };

  const deletePlan = (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this plan? Existing subscriptions will not be automatically cancelled."
    );

    if (!confirmed) return;

    setPlans((current) =>
      current.filter((plan) => plan.id !== id)
    );
  };

  const addBenefit = () => {
    if (!editingPlan || !benefitInput.trim()) return;

    setEditingPlan({
      ...editingPlan,
      benefits: [
        ...editingPlan.benefits,
        benefitInput.trim(),
      ],
    });

    setBenefitInput("");
  };

  const removeBenefit = (index: number) => {
    if (!editingPlan) return;

    setEditingPlan({
      ...editingPlan,
      benefits: editingPlan.benefits.filter(
        (_, i) => i !== index
      ),
    });
  };

  /* =====================================================
     INVOICE DOWNLOAD

     Demo invoice. Replace with backend-generated invoice
     when payment integration is connected.
  ===================================================== */

  const downloadInvoice = (payment: Payment) => {
    const content = [
      "NEED ONE SERVICE",
      "SUBSCRIPTION PAYMENT RECEIPT",
      "--------------------------------",
      `Transaction ID: ${payment.id}`,
      `Partner: ${payment.partner}`,
      `Category: ${payment.category}`,
      `Plan: ${payment.plan}`,
      `Amount: ${formatCurrency(payment.amount)}`,
      `Payment Date: ${formatDate(payment.date)}`,
      `Expiry Date: ${formatDate(payment.expiry)}`,
      `Payment Status: ${payment.status}`,
      "--------------------------------",
      "Computer-generated demonstration receipt.",
    ].join("\n");

    const blob = new Blob([content], {
      type: "text/plain",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `${payment.id}-receipt.txt`;
    link.click();

    URL.revokeObjectURL(url);
  };

  /* =====================================================
     RESET FILTERS
  ===================================================== */

  const clearUserFilters = () => {
    setUserSearch("");
    setUserStatus("All");
    setUserCategory("All");
  };

  const clearPaymentFilters = () => {
    setPaymentSearch("");
    setPaymentCategory("All");
    setPaymentFilterOpen(false);
  };

  /* =====================================================
     STATUS BADGE
  ===================================================== */

  const getStatusClass = (status: UserStatus | Payment["status"]) => {
    switch (status) {
      case "Active":
      case "Paid":
        return "status-active";

      case "Free Trial":
        return "status-trial";

      case "Expired":
      case "Failed":
        return "status-expired";

      case "Payment Pending":
      case "Pending":
        return "status-pending";

      default:
        return "";
    }
  };

  /* =====================================================
     CATEGORY ICON
  ===================================================== */

  const CategoryIcon = ({ category }: {
    category: SubscriptionCategory;
  }) => {
    if (category === "Professionals") {
      return <Wrench size={19} />;
    }

    if (category === "City Listings") {
      return <Building2 size={19} />;
    }

    return <Store size={19} />;
  };

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <div className="subscriptions-admin-page">

      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <section className="subscriptions-page-header">
        <div>
          <div className="subscriptions-eyebrow">
            REVENUE OPERATIONS
          </div>

          <h1>Subscription Management</h1>

          <p>
            Manage subscription plans, free trials, users,
            renewals and platform revenue.
          </p>
        </div>

        <div className="subscriptions-header-actions">
          <span className="subscription-admin-label">
            <Settings2 size={15} />
            Admin Control Panel
          </span>
        </div>
      </section>

      {/* =================================================
          NAVIGATION
      ================================================= */}

      <div className="subscription-navigation">
        <button
          className={activeSection === "overview" ? "active" : ""}
          onClick={() => setActiveSection("overview")}
        >
          <Activity size={16} />
          Overview
        </button>

        <button
          className={activeSection === "plans" ? "active" : ""}
          onClick={() => setActiveSection("plans")}
        >
          <Settings2 size={16} />
          Manage Plans
        </button>

        <button
          className={activeSection === "users" ? "active" : ""}
          onClick={() => setActiveSection("users")}
        >
          <Users size={16} />
          Subscription Users
        </button>

        <button
          className={activeSection === "payments" ? "active" : ""}
          onClick={() => setActiveSection("payments")}
        >
          <Wallet size={16} />
          Payment Logs
        </button>
      </div>

      {/* =================================================
          OVERVIEW
      ================================================= */}

      {activeSection === "overview" && (
        <>
          <section className="subscription-stats-grid">

            <article className="subscription-stat-card">
              <div className="subscription-stat-icon blue">
                <Users size={21} />
              </div>

              <span>Total Users</span>

              <strong>{users.length}</strong>

              <small>Across all categories</small>
            </article>

            <article className="subscription-stat-card">
              <div className="subscription-stat-icon green">
                <BadgeCheck size={21} />
              </div>

              <span>Active Subscriptions</span>

              <strong>{activeSubscriptions}</strong>

              <small>Currently subscribed</small>
            </article>

            <article className="subscription-stat-card">
              <div className="subscription-stat-icon orange">
                <Clock3 size={21} />
              </div>

              <span>Free Trial Users</span>

              <strong>{freeTrialUsers}</strong>

              <small>Using trial access</small>
            </article>

            <article className="subscription-stat-card">
              <div className="subscription-stat-icon red">
                <CalendarDays size={21} />
              </div>

              <span>Expired Subscriptions</span>

              <strong>{expiredUsers}</strong>

              <small>Require renewal</small>
            </article>

            <article className="subscription-stat-card">
              <div className="subscription-stat-icon purple">
                <Wallet size={21} />
              </div>

              <span>Total Revenue</span>

              <strong>{formatCurrency(totalRevenue)}</strong>

              <small>Successful demo payments</small>
            </article>

            <article className="subscription-stat-card">
              <div className="subscription-stat-icon orange">
                <Activity size={21} />
              </div>

              <span>Payment Pending</span>

              <strong>{pendingUsers}</strong>

              <small>Awaiting payment</small>
            </article>

          </section>

          {/* CATEGORY SUMMARY */}

          <section className="subscription-category-section">

            <div className="subscription-section-heading">
              <div>
                <h2>Subscription Categories</h2>

                <p>
                  Manage pricing and conditions for each
                  platform category.
                </p>
              </div>
            </div>

            <div className="subscription-category-grid">

              {categories.map((category) => {
                const count = users.filter(
                  (user) => user.category === category
                ).length;

                const categoryPlanCount = plans.filter(
                  (plan) =>
                    plan.category === category && plan.enabled
                ).length;

                return (
                  <article
                    key={category}
                    className="subscription-category-card"
                  >
                    <div className="subscription-category-icon">
                      <CategoryIcon category={category} />
                    </div>

                    <h3>{category}</h3>

                    <div className="subscription-category-info">
                      <span>
                        {categoryPlanCount} active plans
                      </span>

                      <span>{count} users</span>
                    </div>

                    <button
                      onClick={() => {
                        setActiveCategory(category);
                        setActiveSection("plans");
                      }}
                    >
                      Manage Plans
                      <ChevronRight size={15} />
                    </button>
                  </article>
                );
              })}

            </div>
          </section>

          {/* RECENT USERS */}

          <section className="subscription-overview-card">

            <div className="subscription-section-heading">
              <div>
                <h2>Recent Subscription Users</h2>

                <p>
                  Latest user subscription activity.
                </p>
              </div>

              <button
                className="subscription-text-button"
                onClick={() => setActiveSection("users")}
              >
                View all users
                <ChevronRight size={15} />
              </button>
            </div>

            <div className="subscription-user-list">
              {users.slice(0, 4).map((user) => (
                <div
                  key={user.id}
                  className="subscription-user-row"
                >
                  <div className="subscription-user-avatar">
                    {user.name.charAt(0).toUpperCase()}
                  </div>

                  <div className="subscription-user-main">
                    <strong>{user.name}</strong>

                    <span>
                      {user.category} · {user.plan}
                    </span>
                  </div>

                  <span
                    className={`subscription-status ${getStatusClass(user.status)}`}
                  >
                    {user.status}
                  </span>

                  <button
                    className="subscription-icon-button"
                    onClick={() => setSelectedUser(user)}
                    aria-label="View user"
                  >
                    <ChevronRight size={17} />
                  </button>
                </div>
              ))}
            </div>

          </section>
        </>
      )}

      {/* =================================================
          MANAGE PLANS
      ================================================= */}

      {activeSection === "plans" && (
        <section className="subscription-management-section">

          <div className="subscription-section-heading">
            <div>
              <h2>Manage Subscription Plans</h2>

              <p>
                Edit prices, conditions, trial duration
                and subscription benefits.
              </p>
            </div>
          </div>

          {/* CATEGORY SELECTOR */}

          <div className="subscription-category-tabs">

            {categories.map((category) => (
              <button
                key={category}
                className={
                  activeCategory === category ? "active" : ""
                }
                onClick={() => setActiveCategory(category)}
              >
                <CategoryIcon category={category} />
                {category}
              </button>
            ))}

          </div>

          {/* PLAN HEADER */}

          <div className="subscription-plans-toolbar">

            <div>
              <h3>{activeCategory} Plans</h3>

              <span>
                {categoryPlans.length} plans configured
              </span>
            </div>

            <button
              className="subscription-primary-button"
              onClick={openNewPlan}
            >
              <Plus size={16} />
              Add New Plan
            </button>

          </div>

          {/* PLAN CARDS */}

          <div className="subscription-plan-grid">

            {categoryPlans.map((plan) => (
              <article
                key={plan.id}
                className={`subscription-plan-card ${
                  plan.featured ? "featured" : ""
                } ${!plan.enabled ? "disabled-plan" : ""}`}
              >

                <div className="subscription-plan-top">

                  <span className="subscription-plan-label">
                    {plan.featured ? "FEATURED PLAN" : "PLAN TIER"}
                  </span>

                  <span
                    className={`subscription-plan-state ${
                      plan.enabled ? "enabled" : "disabled"
                    }`}
                  >
                    {plan.enabled ? "Enabled" : "Disabled"}
                  </span>

                </div>

                <h3>{plan.name}</h3>

                <div className="subscription-plan-price">
                  {formatCurrency(plan.price)}
                  <span> / {plan.duration} days</span>
                </div>

                <p className="subscription-plan-description">
                  {plan.description}
                </p>

                <div className="subscription-trial-info">
                  <Clock3 size={15} />

                  {plan.trialDays} days free trial
                </div>

                <div className="subscription-benefits-list">
                  <strong>Plan Conditions & Benefits</strong>

                  {plan.benefits.map((benefit, index) => (
                    <div key={`${plan.id}-${index}`}>
                      <CheckCircle2 size={15} />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>

                <div className="subscription-plan-actions">

                  <button
                    className="subscription-edit-button"
                    onClick={() => openEditPlan(plan)}
                  >
                    <Edit3 size={15} />
                    Edit Plan
                  </button>

                  <button
                    className="subscription-toggle-button"
                    onClick={() => togglePlan(plan.id)}
                  >
                    {plan.enabled ? "Disable" : "Enable"}
                  </button>

                  <button
                    className="subscription-delete-button"
                    onClick={() => deletePlan(plan.id)}
                    aria-label="Delete plan"
                  >
                    <Trash2 size={15} />
                  </button>

                </div>

              </article>
            ))}

            {categoryPlans.length === 0 && (
              <div className="subscription-empty-state">
                <Settings2 size={28} />

                <strong>No plans available</strong>

                <span>
                  Add a subscription plan to get started.
                </span>
              </div>
            )}

          </div>

          <div className="subscription-admin-note">
            <CheckCircle2 size={18} />

            <div>
              <strong>Admin pricing control</strong>

              <span>
                Changes are saved locally in this browser.
                Existing subscriptions should retain their
                original purchased pricing when backend
                billing is connected.
              </span>
            </div>
          </div>

        </section>
      )}

      {/* =================================================
          SUBSCRIPTION USERS
      ================================================= */}

      {activeSection === "users" && (
        <section className="subscription-users-section">

          <div className="subscription-section-heading">
            <div>
              <h2>Subscription Users</h2>

              <p>
                Monitor free trials, active subscriptions,
                renewals and expired accounts.
              </p>
            </div>
          </div>

          {/* USER STATUS FILTERS */}

          <div className="subscription-user-status-tabs">

            <button
              className={userStatus === "All" ? "active" : ""}
              onClick={() => setUserStatus("All")}
            >
              All Users
              <span>{users.length}</span>
            </button>

            {userStatuses.map((status) => (
              <button
                key={status}
                className={userStatus === status ? "active" : ""}
                onClick={() => setUserStatus(status)}
              >
                {status}
                <span>
                  {
                    users.filter(
                      (user) => user.status === status
                    ).length
                  }
                </span>
              </button>
            ))}

          </div>

          {/* USER FILTERS */}

          <div className="subscription-table-toolbar">

            <div className="subscription-search">
              <Search size={16} />

              <input
                value={userSearch}
                onChange={(event) =>
                  setUserSearch(event.target.value)
                }
                placeholder="Search name, email, phone or user ID"
              />

              {userSearch && (
                <button onClick={() => setUserSearch("")}>
                  <X size={14} />
                </button>
              )}
            </div>

            <select
              value={userCategory}
              onChange={(event) =>
                setUserCategory(event.target.value)
              }
            >
              <option value="All">All Categories</option>

              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <button
              className="subscription-clear-button"
              onClick={clearUserFilters}
            >
              Clear Filters
            </button>

          </div>

          {/* USER TABLE */}

          <div className="subscription-table-wrapper">

            <table className="subscription-data-table">

              <thead>
                <tr>
                  <th>USER</th>
                  <th>CATEGORY</th>
                  <th>PLAN</th>
                  <th>START DATE</th>
                  <th>EXPIRY DATE</th>
                  <th>AMOUNT</th>
                  <th>STATUS</th>
                  <th>ACTION</th>
                </tr>
              </thead>

              <tbody>

                {filteredUsers.map((user) => (
                  <tr key={user.id}>

                    <td>
                      <div className="subscription-table-user">
                        <div className="subscription-user-avatar">
                          {user.name.charAt(0)}
                        </div>

                        <div>
                          <strong>{user.name}</strong>
                          <span>{user.id}</span>
                        </div>
                      </div>
                    </td>

                    <td>{user.category}</td>

                    <td>
                      <strong>{user.plan}</strong>
                    </td>

                    <td>{formatDate(user.startDate)}</td>

                    <td>{formatDate(user.expiryDate)}</td>

                    <td>
                      <strong>
                        {formatCurrency(user.amount)}
                      </strong>
                    </td>

                    <td>
                      <span
                        className={`subscription-status ${getStatusClass(user.status)}`}
                      >
                        {user.status}
                      </span>
                    </td>

                    <td>
                      <button
                        className="subscription-view-button"
                        onClick={() => setSelectedUser(user)}
                      >
                        View
                      </button>
                    </td>

                  </tr>
                ))}

                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={8}>
                      <div className="subscription-empty-state">
                        <Search size={25} />

                        <strong>No users found</strong>

                        <span>
                          Try changing your search or filters.
                        </span>

                        <button onClick={clearUserFilters}>
                          Clear Filters
                        </button>
                      </div>
                    </td>
                  </tr>
                )}

              </tbody>

            </table>

          </div>

          <div className="subscription-table-footer">
            Showing {filteredUsers.length} of {users.length} users
          </div>

        </section>
      )}

      {/* =================================================
          PAYMENT LOGS
      ================================================= */}

      {activeSection === "payments" && (
        <section className="payment-logs-card">

          <div className="payment-logs-header">

            <div>
              <h2>Payment Logs</h2>

              <p>
                Collected subscription revenue:{" "}
                <strong>{formatCurrency(totalRevenue)}</strong>
              </p>
            </div>

            <div className="payment-logs-controls">

              <select
                value={paymentCategory}
                onChange={(event) =>
                  setPaymentCategory(event.target.value)
                }
              >
                <option value="All">All Categories</option>

                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              <button
                className={`payment-filter-button ${
                  paymentFilterOpen ? "active" : ""
                }`}
                onClick={() =>
                  setPaymentFilterOpen((value) => !value)
                }
              >
                <Filter size={14} />
                Filter
              </button>

            </div>

          </div>

          {paymentFilterOpen && (
            <div className="payment-filter-panel">

              <div className="payment-search">
                <Search size={16} />

                <input
                  value={paymentSearch}
                  placeholder="Search transaction ID or partner"
                  onChange={(event) =>
                    setPaymentSearch(event.target.value)
                  }
                />

                {paymentSearch && (
                  <button
                    onClick={() => setPaymentSearch("")}
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              <button
                className="payment-clear-button"
                onClick={clearPaymentFilters}
              >
                Clear
              </button>

            </div>
          )}

          <div className="payment-table-wrapper">

            <table className="payment-table">

              <thead>
                <tr>
                  <th>TRANSACTION ID</th>
                  <th>PARTNER NAME</th>
                  <th>CATEGORY</th>
                  <th>PLAN</th>
                  <th>AMOUNT PAID</th>
                  <th>PAYMENT DATE</th>
                  <th>EXPIRY DATE</th>
                  <th>STATUS</th>
                  <th>INVOICE</th>
                </tr>
              </thead>

              <tbody>

                {filteredPayments.map((payment) => (
                  <tr key={payment.id}>

                    <td>
                      <span className="transaction-id">
                        {payment.id}
                      </span>
                    </td>

                    <td>
                      <span className="payment-partner">
                        {payment.partner}
                      </span>
                    </td>

                    <td>{payment.category}</td>

                    <td>{payment.plan}</td>

                    <td>
                      <strong className="payment-amount">
                        {formatCurrency(payment.amount)}
                      </strong>
                    </td>

                    <td>{formatDate(payment.date)}</td>

                    <td>{formatDate(payment.expiry)}</td>

                    <td>
                      <span
                        className={`subscription-status ${getStatusClass(payment.status)}`}
                      >
                        {payment.status}
                      </span>
                    </td>

                    <td>
                      <button
                        className="invoice-button"
                        onClick={() => downloadInvoice(payment)}
                      >
                        <Download size={14} />
                        Download
                      </button>
                    </td>

                  </tr>
                ))}

                {filteredPayments.length === 0 && (
                  <tr>
                    <td colSpan={9}>
                      <div className="payment-empty-state">
                        <Search size={25} />

                        <strong>No payment records found</strong>

                        <button onClick={clearPaymentFilters}>
                          Clear Filters
                        </button>
                      </div>
                    </td>
                  </tr>
                )}

              </tbody>

            </table>

          </div>

          <div className="payment-table-footer">
            Showing {filteredPayments.length} of {payments.length} payment records
          </div>

        </section>
      )}

      {/* =================================================
          PLAN EDITOR MODAL
      ================================================= */}

      {showPlanEditor && editingPlan && (
        <div
          className="subscription-modal-overlay"
          onClick={() => setShowPlanEditor(false)}
        >

          <div
            className="subscription-editor-modal"
            onClick={(event) => event.stopPropagation()}
          >

            <div className="subscription-modal-header">

              <div>
                <span>ADMIN PLAN CONFIGURATION</span>

                <h2>
                  {plans.some(
                    (plan) => plan.id === editingPlan.id
                  )
                    ? "Edit Subscription Plan"
                    : "Create Subscription Plan"}
                </h2>

                <p>
                  Configure the price, duration and conditions.
                </p>
              </div>

              <button
                onClick={() => setShowPlanEditor(false)}
                aria-label="Close editor"
              >
                <X size={20} />
              </button>

            </div>

            <div className="subscription-editor-content">

              <div className="subscription-editor-field">
                <label>Subscription Category</label>

                <select
                  value={editingPlan.category}
                  onChange={(event) =>
                    setEditingPlan({
                      ...editingPlan,
                      category: event.target.value as SubscriptionCategory,
                    })
                  }
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="subscription-editor-field">
                <label>Plan Name</label>

                <input
                  value={editingPlan.name}
                  onChange={(event) =>
                    setEditingPlan({
                      ...editingPlan,
                      name: event.target.value,
                    })
                  }
                  placeholder="Enter plan name"
                />
              </div>

              <div className="subscription-editor-two-columns">

                <div className="subscription-editor-field">
                  <label>Subscription Price (₹)</label>

                  <input
                    type="number"
                    min="0"
                    value={editingPlan.price}
                    onChange={(event) =>
                      setEditingPlan({
                        ...editingPlan,
                        price: Number(event.target.value),
                      })
                    }
                  />
                </div>

                <div className="subscription-editor-field">
                  <label>Subscription Duration (Days)</label>

                  <input
                    type="number"
                    min="1"
                    value={editingPlan.duration}
                    onChange={(event) =>
                      setEditingPlan({
                        ...editingPlan,
                        duration: Number(event.target.value),
                      })
                    }
                  />
                </div>

              </div>

              <div className="subscription-editor-field">
                <label>Free Trial Duration (Days)</label>

                <input
                  type="number"
                  min="0"
                  value={editingPlan.trialDays}
                  onChange={(event) =>
                    setEditingPlan({
                      ...editingPlan,
                      trialDays: Number(event.target.value),
                    })
                  }
                />

                <small>
                  Enter 0 if the plan does not provide a free trial.
                </small>
              </div>

              <div className="subscription-editor-field">
                <label>Plan Description</label>

                <textarea
                  value={editingPlan.description}
                  onChange={(event) =>
                    setEditingPlan({
                      ...editingPlan,
                      description: event.target.value,
                    })
                  }
                  placeholder="Describe this subscription plan"
                  rows={3}
                />
              </div>

              <div className="subscription-editor-field">

                <label>Plan Conditions & Benefits</label>

                <div className="subscription-benefit-input">

                  <input
                    value={benefitInput}
                    onChange={(event) =>
                      setBenefitInput(event.target.value)
                    }
                    placeholder="Enter a plan benefit"
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        addBenefit();
                      }
                    }}
                  />

                  <button onClick={addBenefit}>
                    <Plus size={16} />
                    Add
                  </button>

                </div>

                <div className="subscription-editor-benefits">

                  {editingPlan.benefits.map(
                    (benefit, index) => (
                      <div key={`${index}-${benefit}`}>
                        <CheckCircle2 size={15} />

                        <span>{benefit}</span>

                        <button
                          onClick={() => removeBenefit(index)}
                          aria-label="Remove benefit"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    )
                  )}

                  {editingPlan.benefits.length === 0 && (
                    <span>
                      No benefits added yet.
                    </span>
                  )}

                </div>

              </div>

              <div className="subscription-editor-checkbox">
                <input
                  type="checkbox"
                  checked={editingPlan.featured || false}
                  onChange={(event) =>
                    setEditingPlan({
                      ...editingPlan,
                      featured: event.target.checked,
                    })
                  }
                  id="featured-plan"
                />

                <label htmlFor="featured-plan">
                  Mark as featured plan
                </label>
              </div>

              <div className="subscription-editor-checkbox">
                <input
                  type="checkbox"
                  checked={editingPlan.enabled}
                  onChange={(event) =>
                    setEditingPlan({
                      ...editingPlan,
                      enabled: event.target.checked,
                    })
                  }
                  id="enabled-plan"
                />

                <label htmlFor="enabled-plan">
                  Make this plan available for new subscriptions
                </label>
              </div>

            </div>

            <div className="subscription-modal-footer">

              <button
                className="subscription-cancel-button"
                onClick={() => setShowPlanEditor(false)}
              >
                Cancel
              </button>

              <button
                className="subscription-primary-button"
                onClick={savePlan}
              >
                <Check size={16} />
                Save Plan
              </button>

            </div>

          </div>

        </div>
      )}

      {/* =================================================
          USER DETAILS MODAL
      ================================================= */}

      {selectedUser && (
        <div
          className="subscription-modal-overlay"
          onClick={() => setSelectedUser(null)}
        >

          <div
            className="subscription-user-modal"
            onClick={(event) => event.stopPropagation()}
          >

            <div className="subscription-modal-header">

              <div>
                <span>SUBSCRIPTION USER DETAILS</span>

                <h2>{selectedUser.name}</h2>

                <p>{selectedUser.id}</p>
              </div>

              <button
                onClick={() => setSelectedUser(null)}
                aria-label="Close details"
              >
                <X size={20} />
              </button>

            </div>

            <div className="subscription-user-details">

              <div>
                <span>Email Address</span>
                <strong>{selectedUser.email}</strong>
              </div>

              <div>
                <span>Phone Number</span>
                <strong>{selectedUser.phone}</strong>
              </div>

              <div>
                <span>Subscription Category</span>
                <strong>{selectedUser.category}</strong>
              </div>

              <div>
                <span>Selected Plan</span>
                <strong>{selectedUser.plan}</strong>
              </div>

              <div>
                <span>Subscription Start</span>
                <strong>{formatDate(selectedUser.startDate)}</strong>
              </div>

              <div>
                <span>Expiry Date</span>
                <strong>{formatDate(selectedUser.expiryDate)}</strong>
              </div>

              <div>
                <span>Amount Paid</span>
                <strong>{formatCurrency(selectedUser.amount)}</strong>
              </div>

              <div>
                <span>Current Status</span>

                <strong>
                  <span
                    className={`subscription-status ${getStatusClass(selectedUser.status)}`}
                  >
                    {selectedUser.status}
                  </span>
                </strong>
              </div>

            </div>

            <div className="subscription-user-modal-footer">

              <button
                className="subscription-primary-button"
                onClick={() => setSelectedUser(null)}
              >
                Close Details
              </button>

            </div>

          </div>

        </div>
      )}

      {/* =================================================
          FOOTER NOTE
      ================================================= */}

      <div className="subscription-footer-note">

        <div className="subscription-footer-icon">
          <CheckCircle2 size={18} />
        </div>

        <div>
          <strong>0% Commission Model</strong>

          <span>
            Subscription and listing fees are collected as
            platform revenue. Professionals, sellers and
            businesses manage their own customer transactions.
          </span>
        </div>

        <CalendarDays size={19} />

      </div>

    </div>
  );
}
