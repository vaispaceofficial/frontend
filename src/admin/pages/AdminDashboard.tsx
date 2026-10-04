import {
  CalendarDays,
  Users,
  Wrench,
  Store,
  Building2,
  IndianRupee,
  ArrowUpRight,
  Plus,
  UserPlus,
  FileText,
} from "lucide-react";

import "./AdminDashboard.css";

const kpis = [
  {
    title: "Total Registered Partners",
    value: "1,420",
    subtitle: "Active Subscriptions",
    icon: Users,
  },
  {
    title: "Providers (Services)",
    value: "650",
    subtitle: "Technicians / Professionals",
    icon: Wrench,
  },
  {
    title: "Vendors (Products / Spares)",
    value: "430",
    subtitle: "Retailers",
    icon: Store,
  },
  {
    title: "Businesses",
    value: "340",
    subtitle: "Contractors / Firms",
    icon: Building2,
  },
  {
    title: "Monthly Listing Revenue",
    value: "₹2,84,000",
    subtitle: "Subscription / Registration Fees",
    icon: IndianRupee,
  },
];

const registrations = [
  {
    name: "Ananya Rao",
    category: "Service Provider",
    location: "Visakhapatnam",
    status: "Verified",
  },
  {
    name: "Coastal Spares",
    category: "Product Vendor",
    location: "Visakhapatnam",
    status: "Verified",
  },
  {
    name: "Horizon Interiors",
    category: "Business / Contractor",
    location: "Vijayawada",
    status: "Pending",
  },
];

const monthlyRevenue = [
  { month: "May", value: 62 },
  { month: "Jun", value: 74 },
  { month: "Jul", value: 58 },
  { month: "Aug", value: 82 },
  { month: "Sep", value: 91 },
  { month: "Oct", value: 100 },
];

export default function AdminDashboard() {
  return (
    <div className="admin-dashboard">
      {/* PAGE HEADER */}
      <div className="admin-page-header">
        <div>
          <div className="admin-page-eyebrow">
            OPERATIONS DASHBOARD
          </div>

          <h1>Dashboard Overview</h1>

          <p>
            Monitor partners, services, businesses and platform
            operations from one place.
          </p>
        </div>

        <button className="admin-date-button">
          <CalendarDays size={17} />
          <span>This Month</span>
        </button>
      </div>

      {/* KPI CARDS */}
      <section className="admin-kpi-grid">
        {kpis.map((item) => {
          const Icon = item.icon;

          return (
            <div className="admin-kpi-card" key={item.title}>
              <div className="admin-kpi-top">
                <div className="admin-kpi-icon">
                  <Icon size={19} />
                </div>

                <ArrowUpRight size={16} />
              </div>

              <div className="admin-kpi-value">
                {item.value}
              </div>

              <div className="admin-kpi-title">
                {item.title}
              </div>

              <div className="admin-kpi-subtitle">
                {item.subtitle}
              </div>
            </div>
          );
        })}
      </section>

      {/* MIDDLE SECTION */}
      <section className="admin-dashboard-grid">
        {/* REVENUE CHART */}
        <div className="admin-chart-card">
          <div className="admin-card-header">
            <div>
              <h2>Monthly Listing Revenue</h2>

              <p>
                Subscription / Registration Fees collected
                at 0% commission
              </p>
            </div>

            <strong>₹2,84,000</strong>
          </div>

          <div className="admin-chart">
            <div className="admin-chart-y">
              <span>₹3L</span>
              <span>₹2L</span>
              <span>₹1L</span>
              <span>₹0</span>
            </div>

            <div className="admin-chart-area">
              <div className="admin-chart-grid-line" />
              <div className="admin-chart-grid-line" />
              <div className="admin-chart-grid-line" />
              <div className="admin-chart-grid-line" />

              <div className="admin-chart-bars">
                {monthlyRevenue.map((item) => (
                  <div
                    className="admin-chart-column"
                    key={item.month}
                  >
                    <div
                      className="admin-chart-bar"
                      style={{
                        height: `${item.value}%`,
                      }}
                    />

                    <span>{item.month}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* QUICK ACTIONS */}
        <div className="admin-quick-card">
          <div className="admin-card-header">
            <div>
              <h2>Quick Actions</h2>
              <p>Common administrative tasks</p>
            </div>
          </div>

          <div className="admin-quick-actions">
            <button className="admin-quick-action">
              <div>
                <UserPlus size={18} />
              </div>

              <span>
                Review New Partner
                <small>Verify registration</small>
              </span>

              <ArrowUpRight size={16} />
            </button>

            <button className="admin-quick-action">
              <div>
                <Wrench size={18} />
              </div>

              <span>
                Manage Services
                <small>View service providers</small>
              </span>

              <ArrowUpRight size={16} />
            </button>

            <button className="admin-quick-action">
              <div>
                <FileText size={18} />
              </div>

              <span>
                Compliance Review
                <small>Check pending documents</small>
              </span>

              <ArrowUpRight size={16} />
            </button>

            <button className="admin-quick-action">
              <div>
                <Plus size={18} />
              </div>

              <span>
                Add Subscription Plan
                <small>Create new plan</small>
              </span>

              <ArrowUpRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* RECENT REGISTRATIONS */}
      <section className="admin-table-card">
        <div className="admin-card-header">
          <div>
            <h2>Recent Partner Registrations</h2>

            <p>
              Latest providers, vendors and businesses
              joining the platform.
            </p>
          </div>

          <button className="admin-view-all">
            View All
            <ArrowUpRight size={15} />
          </button>
        </div>

        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>PARTNER NAME</th>
                <th>CATEGORY TYPE</th>
                <th>LOCATION</th>
                <th>STATUS</th>
                <th>ACTION</th>
              </tr>
            </thead>

            <tbody>
              {registrations.map((partner) => (
                <tr key={partner.name}>
                  <td>
                    <div className="admin-partner-name">
                      <div className="admin-partner-avatar">
                        {partner.name.charAt(0)}
                      </div>

                      <strong>{partner.name}</strong>
                    </div>
                  </td>

                  <td>{partner.category}</td>

                  <td>{partner.location}</td>

                  <td>
                    <span
                      className={`admin-status ${
                        partner.status === "Verified"
                          ? "verified"
                          : "pending"
                      }`}
                    >
                      {partner.status}
                    </span>
                  </td>

                  <td>
                    <button className="admin-action-button">
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}