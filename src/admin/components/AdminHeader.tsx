import {
  Search,
  ChevronDown,
  Bell,
} from "lucide-react";

export default function AdminHeader() {
  return (
    <header className="admin-header">
      {/* LEFT */}
      <div className="admin-header-left">
        <div className="admin-header-title">
          <span>NEED ONE SERVICE</span>
          <strong>Admin Portal</strong>
        </div>
      </div>

      {/* RIGHT */}
      <div className="admin-header-right">
        {/* SEARCH */}
        <div className="admin-header-search">
          <Search size={18} />

          <input
            type="text"
            placeholder="Search anything..."
          />
        </div>

        {/* NOTIFICATIONS */}
        <button
          type="button"
          className="admin-icon-button"
        >
          <Bell size={19} />

          <span className="admin-notification-dot" />
        </button>

        {/* PROFILE */}
        <button
          type="button"
          className="admin-profile-button"
        >
          <div className="admin-avatar">
            SA
          </div>

          <div className="admin-profile-info">
            <strong>Super Admin</strong>
            <span>Visakhapatnam HQ</span>
          </div>

          <ChevronDown size={17} />
        </button>
      </div>
    </header>
  );
}