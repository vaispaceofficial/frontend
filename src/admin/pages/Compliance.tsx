
import { useEffect, useMemo, useState } from "react";
import {
  ShieldCheck,
  Search,
  Plus,
  Eye,
  Edit3,
  Trash2,
  X,
  Check,
  Clock3,
  FileText,
  Users,
  AlertCircle,
  ChevronDown,
  Filter,
  Save,
  BadgeCheck,
} from "lucide-react";

import "./Compliance.css";

type ReviewStatus = "Reviewed" | "Pending" | "Rejected";

type PartnerType =
  | "Professional"
  | "Vendor"
  | "Marketplace Seller"
  | "Customer"
  | "Student";

type ComplianceRecord = {
  id: string;
  recordType: string;
  partnerType: PartnerType;
  partnerId: string;
  partnerName: string;
  timestamp: string;
  status: ReviewStatus;
  detail: string;
  documentReference: string;
  adminNotes: string;
  reviewedBy: string;
};

const STORAGE_KEY = "oneservice_admin_compliance_records";

const initialRecords: ComplianceRecord[] = [
  {
    id: "CMP-1001",
    recordType: "Professional Terms & Conditions",
    partnerType: "Professional",
    partnerId: "P-1041",
    partnerName: "Rajesh Kumar",
    timestamp: "02 Oct 2026 · 09:20",
    status: "Reviewed",
    detail: "Professional terms and conditions accepted.",
    documentReference: "PRO-TERMS-1041",
    adminNotes: "Acceptance verified.",
    reviewedBy: "Admin",
  },
  {
    id: "CMP-1002",
    recordType: "Intermediary Disclaimer",
    partnerType: "Vendor",
    partnerId: "V-208",
    partnerName: "ABC Home Services",
    timestamp: "02 Oct 2026 · 08:45",
    status: "Pending",
    detail: "Vendor acknowledgement awaiting review.",
    documentReference: "VEN-DISC-208",
    adminNotes: "",
    reviewedBy: "",
  },
  {
    id: "CMP-1003",
    recordType: "Business Identity Verification",
    partnerType: "Marketplace Seller",
    partnerId: "S-302",
    partnerName: "Sri Electronics",
    timestamp: "01 Oct 2026 · 16:10",
    status: "Pending",
    detail: "Business verification documentation submitted.",
    documentReference: "SELL-KYC-302",
    adminNotes: "Documents submitted for verification.",
    reviewedBy: "",
  },
  {
    id: "CMP-1004",
    recordType: "Vendor Declaration",
    partnerType: "Vendor",
    partnerId: "V-209",
    partnerName: "QuickFix Services",
    timestamp: "01 Oct 2026 · 14:35",
    status: "Reviewed",
    detail: "Vendor declaration recorded.",
    documentReference: "VEN-DECL-209",
    adminNotes: "Declaration checked.",
    reviewedBy: "Admin",
  },
  {
    id: "CMP-1005",
    recordType: "Customer Privacy Consent",
    partnerType: "Customer",
    partnerId: "C-1038",
    partnerName: "Customer Account",
    timestamp: "30 Sep 2026 · 17:05",
    status: "Reviewed",
    detail: "Privacy policy consent recorded.",
    documentReference: "CUS-PRIV-1038",
    adminNotes: "Consent recorded.",
    reviewedBy: "Admin",
  },
];

const emptyRecord: ComplianceRecord = {
  id: "",
  recordType: "",
  partnerType: "Professional",
  partnerId: "",
  partnerName: "",
  timestamp: "",
  status: "Pending",
  detail: "",
  documentReference: "",
  adminNotes: "",
  reviewedBy: "",
};

const partnerTypes: PartnerType[] = [
  "Professional",
  "Vendor",
  "Marketplace Seller",
  "Customer",
  "Student",
];

const recordTypes: Record<PartnerType, string[]> = {
  Professional: [
    "Professional Terms & Conditions",
    "Identity Verification",
    "Professional Service Declaration",
    "Code of Conduct",
    "Intermediary Disclaimer",
  ],
  Vendor: [
    "Vendor Agreement",
    "Business Identity Verification",
    "Vendor Declaration",
    "Intermediary Disclaimer",
    "Business Compliance",
  ],
  "Marketplace Seller": [
    "Seller Agreement",
    "Business Identity Verification",
    "Product Compliance Declaration",
    "Seller Liability Declaration",
    "Marketplace Terms Acceptance",
  ],
  Customer: [
    "Terms & Conditions Acceptance",
    "Privacy Policy Consent",
    "Customer Declaration",
    "Refund Policy Acknowledgement",
  ],
  Student: [
    "Student Terms Acceptance",
    "Identity Verification",
    "Student Declaration",
    "Privacy Policy Consent",
  ],
};

const getCurrentTimestamp = () =>
  new Date().toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).replace(",", " ·");

export default function Compliance() {
  const [records, setRecords] = useState<ComplianceRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : initialRecords;
    } catch {
      return initialRecords;
    }
  });

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All statuses");
  const [partnerFilter, setPartnerFilter] = useState("All partners");

  const [visibleRecords, setVisibleRecords] = useState(5);

  const [modalMode, setModalMode] = useState<
    "add" | "edit" | "view" | null
  >(null);

  const [selectedRecord, setSelectedRecord] =
    useState<ComplianceRecord | null>(null);

  const [formData, setFormData] =
    useState<ComplianceRecord>(emptyRecord);

  const [formError, setFormError] = useState("");

  // Persist admin changes locally.
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  }, [records]);

  // Statistics.
  const totalRecords = records.length;

  const reviewedCount = records.filter(
    (record) => record.status === "Reviewed"
  ).length;

  const pendingCount = records.filter(
    (record) => record.status === "Pending"
  ).length;

  const rejectedCount = records.filter(
    (record) => record.status === "Rejected"
  ).length;

  // Search and filtering.
  const filteredRecords = useMemo(() => {
    return records.filter((record) => {
      const searchValue = search.toLowerCase();

      const matchesSearch =
        record.recordType.toLowerCase().includes(searchValue) ||
        record.partnerId.toLowerCase().includes(searchValue) ||
        record.partnerName.toLowerCase().includes(searchValue) ||
        record.documentReference.toLowerCase().includes(searchValue);

      const matchesStatus =
        statusFilter === "All statuses" ||
        record.status === statusFilter;

      const matchesPartner =
        partnerFilter === "All partners" ||
        record.partnerType === partnerFilter;

      return matchesSearch && matchesStatus && matchesPartner;
    });
  }, [records, search, statusFilter, partnerFilter]);

  const displayedRecords = filteredRecords.slice(
    0,
    visibleRecords
  );

  // Open add form.
  const openAddModal = () => {
    setFormData({
      ...emptyRecord,
      timestamp: getCurrentTimestamp(),
    });
    setFormError("");
    setModalMode("add");
  };

  // Open edit form.
  const openEditModal = (record: ComplianceRecord) => {
    setFormData({ ...record });
    setFormError("");
    setModalMode("edit");
  };

  // Open record details.
  const openViewModal = (record: ComplianceRecord) => {
    setSelectedRecord(record);
    setModalMode("view");
  };

  // Close modal.
  const closeModal = () => {
    setModalMode(null);
    setSelectedRecord(null);
    setFormError("");
  };

  // Update form.
  const updateField = (
    field: keyof ComplianceRecord,
    value: string
  ) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  };

  // Save new or edited record.
  const saveRecord = () => {
    if (
      !formData.recordType.trim() ||
      !formData.partnerId.trim() ||
      !formData.partnerName.trim() ||
      !formData.detail.trim()
    ) {
      setFormError(
        "Please complete the record type, partner ID, partner name and operational detail."
      );
      return;
    }

    if (modalMode === "add") {
      const newRecord: ComplianceRecord = {
        ...formData,
        id: `CMP-${Date.now()}`,
        timestamp: getCurrentTimestamp(),
        reviewedBy:
          formData.status === "Reviewed" ? "Admin" : "",
      };

      setRecords((current) => [newRecord, ...current]);
    }

    if (modalMode === "edit") {
      setRecords((current) =>
        current.map((record) =>
          record.id === formData.id
            ? {
                ...formData,
                reviewedBy:
                  formData.status === "Reviewed"
                    ? formData.reviewedBy || "Admin"
                    : "",
              }
            : record
        )
      );
    }

    closeModal();
  };

  // Quick review action.
  const updateStatus = (
    record: ComplianceRecord,
    status: ReviewStatus
  ) => {
    setRecords((current) =>
      current.map((item) =>
        item.id === record.id
          ? {
              ...item,
              status,
              reviewedBy:
                status === "Reviewed" ? "Admin" : "",
            }
          : item
      )
    );
  };

  // Delete record.
  const deleteRecord = (record: ComplianceRecord) => {
    const confirmed = window.confirm(
      `Delete compliance record ${record.id}? This action cannot be undone.`
    );

    if (!confirmed) return;

    setRecords((current) =>
      current.filter((item) => item.id !== record.id)
    );
  };

  return (
    <div className="compliance-admin-page">

      {/* PAGE HEADER */}

      <section className="compliance-page-header">
        <div>
          <span className="compliance-eyebrow">
            NEED ONE SERVICE · ADMINISTRATION
          </span>

          <h1>Legal & Compliance</h1>

          <p>
            Manage legal acknowledgements, partner declarations,
            verification records and platform compliance.
          </p>
        </div>

        <button
          className="compliance-primary-button"
          onClick={openAddModal}
          type="button"
        >
          <Plus size={17} />
          Add compliance record
        </button>
      </section>

      {/* OPERATIONAL NOTICE */}

      <section className="compliance-notice">
        <ShieldCheck size={21} />

        <div>
          <strong>Platform compliance notice</strong>
          <span>
            Need One Service facilitates service discovery,
            marketplace listings and connections between users
            and partners. Vendors, professionals and sellers
            remain responsible for their own services, products,
            warranties and applicable legal obligations.
            This administrative register does not replace legal advice.
          </span>
        </div>
      </section>

      {/* STATISTICS */}

      <section className="compliance-stats-grid">

        <div className="compliance-stat-card">
          <div className="compliance-stat-icon blue">
            <FileText size={21} />
          </div>
          <span>Total records</span>
          <strong>{totalRecords}</strong>
          <small>All compliance entries</small>
        </div>

        <div className="compliance-stat-card">
          <div className="compliance-stat-icon green">
            <BadgeCheck size={21} />
          </div>
          <span>Reviewed</span>
          <strong>{reviewedCount}</strong>
          <small>Completed reviews</small>
        </div>

        <div className="compliance-stat-card">
          <div className="compliance-stat-icon orange">
            <Clock3 size={21} />
          </div>
          <span>Pending review</span>
          <strong>{pendingCount}</strong>
          <small>Awaiting admin action</small>
        </div>

        <div className="compliance-stat-card">
          <div className="compliance-stat-icon red">
            <AlertCircle size={21} />
          </div>
          <span>Rejected</span>
          <strong>{rejectedCount}</strong>
          <small>Requires attention</small>
        </div>

      </section>

      {/* COMPLIANCE REGISTER */}

      <section className="compliance-records-card">

        <div className="compliance-table-toolbar">
          <div>
            <h2>Compliance review register</h2>
            <p>
              Review and manage records across all Need One Service
              partner and customer accounts.
            </p>
          </div>
        </div>

        {/* FILTERS */}

        <div className="compliance-controls">

          <div className="compliance-search">
            <Search size={17} />
            <input
              type="text"
              placeholder="Search ID, name or record..."
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setVisibleRecords(5);
              }}
            />
          </div>

          <div className="compliance-filter">
            <Filter size={15} />
            <select
              value={statusFilter}
              onChange={(event) => {
                setStatusFilter(event.target.value);
                setVisibleRecords(5);
              }}
            >
              <option>All statuses</option>
              <option>Reviewed</option>
              <option>Pending</option>
              <option>Rejected</option>
            </select>
            <ChevronDown size={14} />
          </div>

          <div className="compliance-filter">
            <Users size={15} />
            <select
              value={partnerFilter}
              onChange={(event) => {
                setPartnerFilter(event.target.value);
                setVisibleRecords(5);
              }}
            >
              <option>All partners</option>
              {partnerTypes.map((type) => (
                <option key={type}>{type}</option>
              ))}
            </select>
            <ChevronDown size={14} />
          </div>

        </div>

        {/* TABLE */}

        <div className="compliance-table-wrapper">
          <table className="compliance-table">

            <thead>
              <tr>
                <th>RECORD TYPE</th>
                <th>PARTNER</th>
                <th>PARTNER ID</th>
                <th>DATE</th>
                <th>STATUS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>

            <tbody>

              {displayedRecords.map((record) => (
                <tr key={record.id}>

                  <td>
                    <div className="compliance-record-type">
                      <strong>{record.recordType}</strong>
                      <small>{record.id}</small>
                    </div>
                  </td>

                  <td>
                    <div className="compliance-partner">
                      <strong>{record.partnerName}</strong>
                      <small>{record.partnerType}</small>
                    </div>
                  </td>

                  <td>
                    <span className="compliance-partner-id">
                      {record.partnerId}
                    </span>
                  </td>

                  <td>
                    <span className="compliance-timestamp">
                      {record.timestamp}
                    </span>
                  </td>

                  <td>
                    <span
                      className={`compliance-status ${
                        record.status.toLowerCase()
                      }`}
                    >
                      {record.status}
                    </span>
                  </td>

                  <td>
                    <div className="compliance-actions">

                      <button
                        type="button"
                        title="View record"
                        onClick={() => openViewModal(record)}
                      >
                        <Eye size={16} />
                      </button>

                      <button
                        type="button"
                        title="Edit record"
                        onClick={() => openEditModal(record)}
                      >
                        <Edit3 size={16} />
                      </button>

                      <button
                        type="button"
                        title="Delete record"
                        onClick={() => deleteRecord(record)}
                      >
                        <Trash2 size={16} />
                      </button>

                    </div>
                  </td>

                </tr>
              ))}

              {displayedRecords.length === 0 && (
                <tr>
                  <td colSpan={6}>
                    <div className="compliance-empty">
                      <FileText size={30} />
                      <strong>No compliance records found</strong>
                      <span>
                        Try changing your filters or add a new record.
                      </span>
                    </div>
                  </td>
                </tr>
              )}

            </tbody>

          </table>
        </div>

        {/* LOAD MORE */}

        {visibleRecords < filteredRecords.length && (
          <div className="compliance-load-more">
            <button
              type="button"
              onClick={() =>
                setVisibleRecords((current) => current + 5)
              }
            >
              Load more records
            </button>
          </div>
        )}

        <div className="compliance-register-footer">
          Showing {displayedRecords.length} of {filteredRecords.length} records
        </div>

      </section>

      {/* ADD / EDIT MODAL */}

      {(modalMode === "add" || modalMode === "edit") && (
        <div
          className="compliance-modal-overlay"
          onClick={closeModal}
        >
          <div
            className="compliance-modal"
            onClick={(event) => event.stopPropagation()}
          >

            <div className="compliance-modal-header">
              <div>
                <span>ADMIN MANAGEMENT</span>
                <h2>
                  {modalMode === "add"
                    ? "Add compliance record"
                    : "Edit compliance record"}
                </h2>
                <p>
                  Enter the partner and compliance information below.
                </p>
              </div>

              <button type="button" onClick={closeModal}>
                <X size={20} />
              </button>
            </div>

            <div className="compliance-modal-body">

              <div className="compliance-form-grid">

                <div className="compliance-form-field">
                  <label>Partner type *</label>
                  <select
                    value={formData.partnerType}
                    onChange={(event) => {
                      const type = event.target.value as PartnerType;
                      setFormData((current) => ({
                        ...current,
                        partnerType: type,
                        recordType: "",
                      }));
                    }}
                  >
                    {partnerTypes.map((type) => (
                      <option key={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div className="compliance-form-field">
                  <label>Record type *</label>
                  <select
                    value={formData.recordType}
                    onChange={(event) =>
                      updateField("recordType", event.target.value)
                    }
                  >
                    <option value="">Select record type</option>
                    {recordTypes[formData.partnerType].map((type) => (
                      <option key={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div className="compliance-form-field">
                  <label>Partner ID *</label>
                  <input
                    value={formData.partnerId}
                    onChange={(event) =>
                      updateField("partnerId", event.target.value)
                    }
                    placeholder="e.g. P-1041"
                  />
                </div>

                <div className="compliance-form-field">
                  <label>Partner name *</label>
                  <input
                    value={formData.partnerName}
                    onChange={(event) =>
                      updateField("partnerName", event.target.value)
                    }
                    placeholder="Enter partner name"
                  />
                </div>

                <div className="compliance-form-field">
                  <label>Review status</label>
                  <select
                    value={formData.status}
                    onChange={(event) =>
                      updateField("status", event.target.value)
                    }
                  >
                    <option>Pending</option>
                    <option>Reviewed</option>
                    <option>Rejected</option>
                  </select>
                </div>

                <div className="compliance-form-field">
                  <label>Document reference</label>
                  <input
                    value={formData.documentReference}
                    onChange={(event) =>
                      updateField(
                        "documentReference",
                        event.target.value
                      )
                    }
                    placeholder="Enter document reference"
                  />
                </div>

                <div className="compliance-form-field full">
                  <label>Operational detail *</label>
                  <textarea
                    rows={3}
                    value={formData.detail}
                    onChange={(event) =>
                      updateField("detail", event.target.value)
                    }
                    placeholder="Describe the compliance record..."
                  />
                </div>

                <div className="compliance-form-field full">
                  <label>Admin review notes</label>
                  <textarea
                    rows={3}
                    value={formData.adminNotes}
                    onChange={(event) =>
                      updateField("adminNotes", event.target.value)
                    }
                    placeholder="Add internal admin remarks..."
                  />
                </div>

              </div>

              {formError && (
                <div className="compliance-form-error">
                  <AlertCircle size={16} />
                  {formError}
                </div>
              )}

            </div>

            <div className="compliance-modal-footer">
              <button
                type="button"
                className="compliance-secondary-button"
                onClick={closeModal}
              >
                Cancel
              </button>

              <button
                type="button"
                className="compliance-primary-button"
                onClick={saveRecord}
              >
                <Save size={16} />
                {modalMode === "add"
                  ? "Save record"
                  : "Save changes"}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* VIEW DETAILS MODAL */}

      {modalMode === "view" && selectedRecord && (
        <div
          className="compliance-modal-overlay"
          onClick={closeModal}
        >
          <div
            className="compliance-modal compliance-details-modal"
            onClick={(event) => event.stopPropagation()}
          >

            <div className="compliance-modal-header">
              <div>
                <span>COMPLIANCE RECORD DETAILS</span>
                <h2>{selectedRecord.recordType}</h2>
                <p>{selectedRecord.id}</p>
              </div>

              <button type="button" onClick={closeModal}>
                <X size={20} />
              </button>
            </div>

            <div className="compliance-modal-body">

              <div className="compliance-detail-grid">

                <div>
                  <small>PARTNER NAME</small>
                  <strong>{selectedRecord.partnerName}</strong>
                </div>

                <div>
                  <small>PARTNER ID</small>
                  <strong>{selectedRecord.partnerId}</strong>
                </div>

                <div>
                  <small>PARTNER CATEGORY</small>
                  <strong>{selectedRecord.partnerType}</strong>
                </div>

                <div>
                  <small>RECORD DATE</small>
                  <strong>{selectedRecord.timestamp}</strong>
                </div>

                <div>
                  <small>DOCUMENT REFERENCE</small>
                  <strong>
                    {selectedRecord.documentReference || "Not provided"}
                  </strong>
                </div>

                <div>
                  <small>REVIEW STATUS</small>
                  <span
                    className={`compliance-status ${
                      selectedRecord.status.toLowerCase()
                    }`}
                  >
                    {selectedRecord.status}
                  </span>
                </div>

              </div>

              <div className="compliance-detail-description">
                <small>OPERATIONAL DETAIL</small>
                <p>{selectedRecord.detail}</p>
              </div>

              <div className="compliance-detail-description">
                <small>ADMIN REVIEW NOTES</small>
                <p>
                  {selectedRecord.adminNotes || "No admin notes added."}
                </p>
              </div>

              <div className="compliance-detail-description">
                <small>REVIEWED BY</small>
                <p>{selectedRecord.reviewedBy || "Awaiting review"}</p>
              </div>

            </div>

            <div className="compliance-modal-footer">

              {selectedRecord.status === "Pending" && (
                <>
                  <button
                    type="button"
                    className="compliance-reject-button"
                    onClick={() => {
                      updateStatus(selectedRecord, "Rejected");
                      closeModal();
                    }}
                  >
                    Reject
                  </button>

                  <button
                    type="button"
                    className="compliance-primary-button"
                    onClick={() => {
                      updateStatus(selectedRecord, "Reviewed");
                      closeModal();
                    }}
                  >
                    <Check size={16} />
                    Mark as reviewed
                  </button>
                </>
              )}

              {selectedRecord.status !== "Pending" && (
                <button
                  type="button"
                  className="compliance-secondary-button"
                  onClick={() => {
                    closeModal();
                    openEditModal(selectedRecord);
                  }}
                >
                  <Edit3 size={15} />
                  Edit record
                </button>
              )}

              <button
                type="button"
                className="compliance-secondary-button"
                onClick={closeModal}
              >
                Close
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
