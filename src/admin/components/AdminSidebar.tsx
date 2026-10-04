import { NavLink, useNavigate } from "react-router-dom";

import {
  LayoutDashboard,
  Wrench,
  ShoppingBag,
  Building2,
  CreditCard,
  ShieldCheck,
  Settings,
  LogOut,
} from "lucide-react";

const menuItems = [
  {
    label: "Dashboard",
    path: "/admin",
    icon: LayoutDashboard,
    end: true,
  },
  {
    label: "Book Services",
    path: "/admin/book-services",
    icon: Wrench,
  },
  {
    label: "Buy Products / Spares",
    path: "/admin/products",
    icon: ShoppingBag,
  },
  {
    label: "Businesses / Contractors",
    path: "/admin/businesses",
    icon: Building2,
  },
  {
    label: "Subscription & Fees",
    path: "/admin/subscriptions",
    icon: CreditCard,
  },
  {
    label: "Legal & Compliance",
    path: "/admin/compliance",
    icon: ShieldCheck,
  },
  {
    label: "Settings",
    path: "/admin/settings",
    icon: Settings,
  },
];

export default function AdminSidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminAuthenticated");

    navigate("/admin/login", {
      replace: true,
    });
  };

  return (
    <aside className="admin-sidebar">

      {/* =====================================================
          BRAND
      ===================================================== */}

      <div className="admin-sidebar-brand">
        <div className="admin-brand-mark">
          N
        </div>

        <div className="admin-brand-text">
          <div className="admin-brand-name">
            NEED ONE
          </div>

          <div className="admin-brand-service">
            SERVICE LLP
          </div>
        </div>
      </div>

      {/* =====================================================
          DIVIDER
      ===================================================== */}

      <div className="admin-sidebar-divider" />

      {/* =====================================================
          NAVIGATION
      ===================================================== */}

      <nav className="admin-sidebar-nav">
        <div className="admin-nav-label">
          MAIN MENU
        </div>

        <div className="admin-nav-list">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  `admin-nav-item ${
                    isActive ? "active" : ""
                  }`
                }
              >
                <span className="admin-nav-icon">
                  <Icon
                    size={18}
                    strokeWidth={2}
                  />
                </span>

                <span className="admin-nav-text">
                  {item.label}
                </span>
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* =====================================================
          BOTTOM AREA
      ===================================================== */}

      <div className="admin-sidebar-bottom">

        {/* WORKSPACE CARD */}

        <div className="admin-workspace-card">

          <div className="admin-workspace-top">
            <span className="admin-workspace-status" />

            <span className="admin-workspace-label">
              WORKSPACE
            </span>
          </div>

          <strong>
            Operational Control
          </strong>

          <span className="admin-workspace-description">
            Admin Control Center
          </span>

          <div className="admin-workspace-footer">
            <span>
              0% commission model
            </span>

            <span className="admin-workspace-live">
              LIVE
            </span>
          </div>

        </div>

        {/* LOGOUT */}

        <button
          type="button"
          className="admin-logout-button"
          onClick={handleLogout}
        >
          <span className="admin-logout-icon">
            <LogOut
              size={18}
              strokeWidth={2}
            />
          </span>

          <span className="admin-logout-text">
            Logout
          </span>
        </button>

      </div>
    </aside>
  );
}