
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
  ArrowLeft,
  FileCheck,
  LockKeyhole,
} from "lucide-react";

import "./Compliance.css";

// --------------------------------------------------
// TYPES
// --------------------------------------------------

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

type ApiComplianceRecord = {
  id: number;
  partner_type: PartnerType;
  partner_id: string | null;
  partner_name: string;
  record_type: string;
  created_at: string;
  review_status: ReviewStatus;
  detail: string | null;
  document_number: string | null;
  admin_notes: string | null;
  reviewed_by: string | null;
};

type LegalDocumentType =
  | "Terms & Conditions"
  | "Privacy Policy";

type LegalDocumentStatus =
  | "Not configured"
  | "Draft"
  | "Published";

type LegalDocument = {
  id: string;
  partnerType: PartnerType;
  documentType: LegalDocumentType;
  title: string;
  content: string;
  status: LegalDocumentStatus;
  version: number;
  updatedAt: string;
};

type ApiLegalDocument = {
  id: number;
  partner_type: PartnerType;
  document_type: LegalDocumentType;
  title: string;
  content: string;
  status: LegalDocumentStatus;
  current_version: number;
  updated_at: string;
};

// --------------------------------------------------
// API CONFIGURATION
// --------------------------------------------------

const API_URL =
  "http://localhost:5000/api/admin/compliance";

const LEGAL_API_URL =
  "http://localhost:5000/api/legal-documents";

// --------------------------------------------------
// EMPTY COMPLIANCE RECORD
// --------------------------------------------------

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

// --------------------------------------------------
// PARTNER TYPES
// --------------------------------------------------

const partnerTypes: PartnerType[] = [
  "Professional",
  "Vendor",
  "Marketplace Seller",
  "Customer",
  "Student",
];

// --------------------------------------------------
// LEGAL DOCUMENT TYPES
// --------------------------------------------------

const legalDocumentTypes: LegalDocumentType[] = [
  "Terms & Conditions",
  "Privacy Policy",
];

// --------------------------------------------------
// INITIAL LEGAL DOCUMENTS
// --------------------------------------------------

const createInitialLegalDocuments = (): LegalDocument[] =>
  partnerTypes.flatMap((partnerType) =>
    legalDocumentTypes.map((documentType) => ({
      id: `${partnerType}-${documentType}`,
      partnerType,
      documentType,
      title: `${partnerType} ${documentType}`,
      content: "",
      status: "Not configured" as LegalDocumentStatus,
      version: 0,
      updatedAt: "",
    }))
  );

// --------------------------------------------------
// COMPLIANCE RECORD TYPES
// --------------------------------------------------

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

// --------------------------------------------------
// DATE FORMATTER
// --------------------------------------------------

const formatTimestamp = (date: string) =>
  new Date(date)
    .toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
    .replace(",", " ·");

const getCurrentTimestamp = () =>
  formatTimestamp(new Date().toISOString());

// --------------------------------------------------
// API RESPONSE MAPPERS
// --------------------------------------------------

const mapApiRecord = (
  record: ApiComplianceRecord
): ComplianceRecord => ({
  id: String(record.id),
  recordType: record.record_type,
  partnerType: record.partner_type,
  partnerId: record.partner_id || "",
  partnerName: record.partner_name,
  timestamp: formatTimestamp(record.created_at),
  status: record.review_status,
  detail: record.detail || "",
  documentReference: record.document_number || "",
  adminNotes: record.admin_notes || "",
  reviewedBy: record.reviewed_by || "",
});

const mapApiLegalDocument = (
  document: ApiLegalDocument
): LegalDocument => ({
  id: `${document.partner_type}-${document.document_type}`,
  partnerType: document.partner_type,
  documentType: document.document_type,
  title: document.title,
  content: document.content || "",
  status: document.status,
  version: Number(document.current_version) || 0,
  updatedAt: document.updated_at || "",
});

// --------------------------------------------------
// API REQUEST PAYLOAD
// --------------------------------------------------

const getApiPayload = (record: ComplianceRecord) => ({
  partner_type: record.partnerType,
  partner_id: record.partnerId.trim(),
  partner_name: record.partnerName.trim(),
  record_type: record.recordType,
  detail: record.detail.trim(),
  document_number: record.documentReference.trim(),
  admin_notes: record.adminNotes.trim(),
  review_status: record.status,
  reviewed_by:
    record.status === "Reviewed"
      ? record.reviewedBy || "Admin"
      : null,
});

// ==================================================
// MAIN COMPONENT
// ==================================================

export default function Compliance() {
  // ----------------------------------------------
  // COMPLIANCE STATE
  // ----------------------------------------------

  const [records, setRecords] = useState<ComplianceRecord[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [apiError, setApiError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState("All statuses");

  const [partnerFilter, setPartnerFilter] =
    useState("All partners");

  const [visibleRecords, setVisibleRecords] = useState(5);

  const [modalMode, setModalMode] = useState<
    "add" | "edit" | "view" | null
  >(null);

  const [selectedRecord, setSelectedRecord] =
    useState<ComplianceRecord | null>(null);

  const [formData, setFormData] =
    useState<ComplianceRecord>(emptyRecord);

  const [formError, setFormError] = useState("");

  // ----------------------------------------------
  // PAGE VIEW
  // ----------------------------------------------

  const [activeView, setActiveView] = useState<
    "register" | "documents"
  >("register");

  // ----------------------------------------------
  // LEGAL DOCUMENT STATE
  // ----------------------------------------------

  const [legalDocuments, setLegalDocuments] = useState<
    LegalDocument[]
  >(createInitialLegalDocuments);

  const [documentSearch, setDocumentSearch] = useState("");

  const [editingLegalDocument, setEditingLegalDocument] =
    useState<LegalDocument | null>(null);

  const [legalDocumentContent, setLegalDocumentContent] =
    useState("");

  const [legalDocumentTitle, setLegalDocumentTitle] =
    useState("");

  const [legalDocumentError, setLegalDocumentError] =
    useState("");

  const [documentSaving, setDocumentSaving] = useState(false);

  const [documentsLoading, setDocumentsLoading] = useState(false);

  // ----------------------------------------------
  // FETCH COMPLIANCE RECORDS
  // ----------------------------------------------

  const fetchRecords = async (showLoading = false) => {
    if (showLoading) {
      setLoading(true);
    }

    try {
      setApiError("");

      const response = await fetch(API_URL);
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to load compliance records."
        );
      }

      const mappedRecords = (
        data.records as ApiComplianceRecord[]
      ).map(mapApiRecord);

      setRecords(mappedRecords);
    } catch (error) {
      console.error("Compliance fetch error:", error);

      setApiError(
        error instanceof Error
          ? error.message
          : "Could not connect to the compliance server."
      );
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------------------------
  // FETCH LEGAL DOCUMENTS
  // ----------------------------------------------

  const fetchLegalDocuments = async () => {
    try {
      setDocumentsLoading(true);

      const response = await fetch(
        `${LEGAL_API_URL}/admin`
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to load legal documents."
        );
      }

      const mappedDocuments = (
        data.documents as ApiLegalDocument[]
      ).map(mapApiLegalDocument);

      setLegalDocuments(mappedDocuments);

      return true;
    } catch (error) {
      console.error("Legal documents fetch error:", error);

      setLegalDocumentError(
        error instanceof Error
          ? error.message
          : "Could not load legal documents."
      );

      return false;
    } finally {
      setDocumentsLoading(false);
    }
  };

  // ----------------------------------------------
  // INITIAL PAGE LOAD
  // ----------------------------------------------

  useEffect(() => {
    void fetchRecords(true);
    void fetchLegalDocuments();
  }, []);

  // ----------------------------------------------
  // COMPLIANCE STATISTICS
  // ----------------------------------------------

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

  // ----------------------------------------------
  // COMPLIANCE SEARCH AND FILTERING
  // ----------------------------------------------

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

  // ----------------------------------------------
  // LEGAL DOCUMENT SEARCH
  // ----------------------------------------------

  const filteredLegalDocuments = useMemo(() => {
    const searchValue = documentSearch.toLowerCase().trim();

    return legalDocuments.filter((document) => {
      return (
        document.partnerType.toLowerCase().includes(searchValue) ||
        document.documentType.toLowerCase().includes(searchValue) ||
        document.title.toLowerCase().includes(searchValue) ||
        document.status.toLowerCase().includes(searchValue)
      );
    });
  }, [legalDocuments, documentSearch]);

  const publishedDocumentCount = legalDocuments.filter(
    (document) => document.status === "Published"
  ).length;

  const draftDocumentCount = legalDocuments.filter(
    (document) => document.status === "Draft"
  ).length;

  const unconfiguredDocumentCount = legalDocuments.filter(
    (document) => document.status === "Not configured"
  ).length;

  // ----------------------------------------------
  // COMPLIANCE MODAL FUNCTIONS
  // ----------------------------------------------

  const openAddModal = () => {
    setFormData({
      ...emptyRecord,
      timestamp: getCurrentTimestamp(),
    });

    setFormError("");
    setModalMode("add");
  };

  const openEditModal = (record: ComplianceRecord) => {
    setFormData({ ...record });
    setFormError("");
    setModalMode("edit");
  };

  const openViewModal = (record: ComplianceRecord) => {
    setSelectedRecord(record);
    setModalMode("view");
  };

  const closeModal = () => {
    if (saving) return;

    setModalMode(null);
    setSelectedRecord(null);
    setFormError("");
  };

  // ----------------------------------------------
  // UPDATE COMPLIANCE FORM FIELDS
  // ----------------------------------------------

  const updateField = (
    field: keyof ComplianceRecord,
    value: string
  ) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  };

  // ----------------------------------------------
  // ADD / EDIT COMPLIANCE RECORD
  // ----------------------------------------------

  const saveRecord = async () => {
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

    if (saving) return;

    try {
      setSaving(true);
      setFormError("");

      const isEditing = modalMode === "edit";

      const url = isEditing
        ? `${API_URL}/${formData.id}`
        : API_URL;

      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(getApiPayload(formData)),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to save compliance record."
        );
      }

      await fetchRecords();

      setModalMode(null);
      setSelectedRecord(null);
      setFormError("");
    } catch (error) {
      console.error("Save compliance record error:", error);

      setFormError(
        error instanceof Error
          ? error.message
          : "Failed to save compliance record."
      );
    } finally {
      setSaving(false);
    }
  };

  // ----------------------------------------------
  // UPDATE REVIEW STATUS
  // ----------------------------------------------

  const updateStatus = async (
    record: ComplianceRecord,
    status: ReviewStatus
  ) => {
    try {
      setApiError("");

      const response = await fetch(
        `${API_URL}/${record.id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            review_status: status,
            reviewed_by:
              status === "Reviewed" ? "Admin" : null,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to update review status."
        );
      }

      await fetchRecords();

      setModalMode(null);
      setSelectedRecord(null);
    } catch (error) {
      console.error("Update compliance status error:", error);

      setApiError(
        error instanceof Error
          ? error.message
          : "Failed to update review status."
      );
    }
  };

  // ----------------------------------------------
  // DELETE COMPLIANCE RECORD
  // ----------------------------------------------

  const deleteRecord = async (record: ComplianceRecord) => {
    const confirmed = window.confirm(
      `Delete compliance record ${record.id}? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      setApiError("");

      const response = await fetch(
        `${API_URL}/${record.id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to delete compliance record."
        );
      }

      await fetchRecords();
    } catch (error) {
      console.error("Delete compliance record error:", error);

      setApiError(
        error instanceof Error
          ? error.message
          : "Failed to delete compliance record."
      );
    }
  };

  // ----------------------------------------------
  // OPEN LEGAL DOCUMENT EDITOR
  // ----------------------------------------------

  const openLegalDocumentEditor = (
    document: LegalDocument
  ) => {
    setEditingLegalDocument(document);
    setLegalDocumentTitle(document.title);
    setLegalDocumentContent(document.content);
    setLegalDocumentError("");
  };

  // ----------------------------------------------
  // CLOSE LEGAL DOCUMENT EDITOR
  // ----------------------------------------------

  const closeLegalDocumentEditor = () => {
    if (documentSaving) return;

    setEditingLegalDocument(null);
    setLegalDocumentTitle("");
    setLegalDocumentContent("");
    setLegalDocumentError("");
  };

  // ----------------------------------------------
  // SAVE / PUBLISH LEGAL DOCUMENT
  // ----------------------------------------------

  const saveLegalDocument = async (publish = false) => {
    if (!editingLegalDocument || documentSaving) return;

    if (
      !legalDocumentTitle.trim() ||
      !legalDocumentContent.trim()
    ) {
      setLegalDocumentError(
        "Please enter the document title and complete document content."
      );
      return;
    }

    if (publish) {
      const confirmed = window.confirm(
        `Publish "${legalDocumentTitle.trim()}" for ${editingLegalDocument.partnerType}?`
      );

      if (!confirmed) return;
    }

    try {
      setDocumentSaving(true);
      setLegalDocumentError("");

      const partnerType = encodeURIComponent(
        editingLegalDocument.partnerType
      );

      const documentType = encodeURIComponent(
        editingLegalDocument.documentType
      );

      const documentUrl =
        `${LEGAL_API_URL}/admin/${partnerType}/${documentType}`;

      // SAVE DOCUMENT AS DRAFT
      const saveResponse = await fetch(documentUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: legalDocumentTitle.trim(),
          content: legalDocumentContent.trim(),
        }),
      });

      const saveData = await saveResponse.json();

      if (!saveResponse.ok || !saveData.success) {
        throw new Error(
          saveData.message || "Unable to save legal document."
        );
      }

      // PUBLISH DOCUMENT
      if (publish) {
        const publishResponse = await fetch(
          `${documentUrl}/publish`,
          {
            method: "POST",
          }
        );

        const publishData = await publishResponse.json();

        if (!publishResponse.ok || !publishData.success) {
          throw new Error(
            publishData.message || "Unable to publish legal document."
          );
        }
      }

      // RELOAD DOCUMENTS FROM DATABASE
      const refreshed = await fetchLegalDocuments();

      if (!refreshed) {
        throw new Error(
          "The document was saved, but the document list could not be refreshed. Please reload the page."
        );
      }

      setEditingLegalDocument(null);
      setLegalDocumentTitle("");
      setLegalDocumentContent("");
      setLegalDocumentError("");
    } catch (error) {
      console.error("Save/publish legal document error:", error);

      setLegalDocumentError(
        error instanceof Error
          ? error.message
          : "Failed to save legal document."
      );
    } finally {
      setDocumentSaving(false);
    }
  };

  // ==================================================
  // JSX
  // ==================================================

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

        <div className="compliance-header-actions">

          {activeView === "register" ? (
            <>
              <button
                className="compliance-secondary-button"
                type="button"
                onClick={() => {
                  setDocumentSearch("");
                  setLegalDocumentError("");
                  setActiveView("documents");
                  void fetchLegalDocuments();
                }}
              >
                <FileText size={17} />
                Policies & Documents
              </button>

              <button
                className="compliance-primary-button"
                onClick={openAddModal}
                type="button"
              >
                <Plus size={17} />
                Add compliance record
              </button>
            </>
          ) : (
            <button
              className="compliance-secondary-button"
              type="button"
              onClick={() => setActiveView("register")}
            >
              <ArrowLeft size={17} />
              Back to Compliance Register
            </button>
          )}

        </div>
      </section>

      {/* ==========================================
          COMPLIANCE REGISTER VIEW
      ========================================== */}

      {activeView === "register" && (
        <>

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

          {/* API ERROR */}

          {apiError && (
            <div className="compliance-form-error">
              <AlertCircle size={16} />
              <span>{apiError}</span>

              <button
                type="button"
                onClick={() => void fetchRecords(true)}
              >
                Retry
              </button>
            </div>
          )}

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

                  {loading && (
                    <tr>
                      <td colSpan={6}>
                        <div className="compliance-empty">
                          Loading compliance records...
                        </div>
                      </td>
                    </tr>
                  )}

                  {!loading && displayedRecords.map((record) => (
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
                          className={`compliance-status ${record.status.toLowerCase()}`}
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
                            onClick={() => void deleteRecord(record)}
                          >
                            <Trash2 size={16} />
                          </button>

                        </div>
                      </td>

                    </tr>
                  ))}

                  {!loading && displayedRecords.length === 0 && (
                    <tr>
                      <td colSpan={6}>
                        <div className="compliance-empty">
                          <FileText size={30} />

                          <strong>
                            No compliance records found
                          </strong>

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

            {!loading &&
              visibleRecords < filteredRecords.length && (
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

        </>
      )}

      {/* ==========================================
          POLICIES & DOCUMENTS VIEW
      ========================================== */}

      {activeView === "documents" && (
        <>

          {/* DOCUMENT NOTICE */}

          <section className="compliance-notice">
            <LockKeyhole size={21} />

            <div>
              <strong>Centralized legal document management</strong>

              <span>
                Manage the Terms & Conditions and Privacy Policies
                presented to users and partners during registration.
                Each registration category has its own document settings.
              </span>
            </div>
          </section>

          {/* DOCUMENT ERROR */}

          {legalDocumentError && !editingLegalDocument && (
            <div className="compliance-form-error">
              <AlertCircle size={16} />
              <span>{legalDocumentError}</span>

              <button
                type="button"
                onClick={() => {
                  setLegalDocumentError("");
                  void fetchLegalDocuments();
                }}
              >
                Retry
              </button>
            </div>
          )}

          {/* DOCUMENT STATISTICS */}

          <section className="compliance-stats-grid">

            <div className="compliance-stat-card">
              <div className="compliance-stat-icon blue">
                <FileText size={21} />
              </div>

              <span>Total documents</span>
              <strong>{legalDocuments.length}</strong>
              <small>Across all registration categories</small>
            </div>

            <div className="compliance-stat-card">
              <div className="compliance-stat-icon green">
                <FileCheck size={21} />
              </div>

              <span>Published</span>
              <strong>{publishedDocumentCount}</strong>
              <small>Published documents</small>
            </div>

            <div className="compliance-stat-card">
              <div className="compliance-stat-icon orange">
                <Clock3 size={21} />
              </div>

              <span>Drafts</span>
              <strong>{draftDocumentCount}</strong>
              <small>Awaiting publication</small>
            </div>

            <div className="compliance-stat-card">
              <div className="compliance-stat-icon red">
                <AlertCircle size={21} />
              </div>

              <span>Not configured</span>
              <strong>{unconfiguredDocumentCount}</strong>
              <small>Documents not yet created</small>
            </div>

          </section>

          {/* DOCUMENT TABLE */}

          <section className="compliance-records-card legal-documents-section">

            <div className="compliance-table-toolbar">
              <div>
                <h2>Policies & Documents</h2>

                <p>
                  Create, edit and publish legal documents for each
                  registration category.
                </p>
              </div>
            </div>

            {/* DOCUMENT SEARCH */}

            <div className="compliance-controls">

              <div className="compliance-search">
                <Search size={17} />

                <input
                  type="text"
                  placeholder="Search category, document or status..."
                  value={documentSearch}
                  onChange={(event) =>
                    setDocumentSearch(event.target.value)
                  }
                />
              </div>

            </div>

            {/* DOCUMENT TABLE */}

            <div className="compliance-table-wrapper">
              <table className="compliance-table">

                <thead>
                  <tr>
                    <th>REGISTRATION CATEGORY</th>
                    <th>DOCUMENT</th>
                    <th>VERSION</th>
                    <th>LAST UPDATED</th>
                    <th>STATUS</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>

                <tbody>

                  {documentsLoading && (
                    <tr>
                      <td colSpan={6}>
                        <div className="compliance-empty">
                          Loading legal documents...
                        </div>
                      </td>
                    </tr>
                  )}

                  {!documentsLoading &&
                    filteredLegalDocuments.map((document) => (
                      <tr key={document.id}>

                        <td>
                          <div className="compliance-partner">
                            <strong>{document.partnerType}</strong>
                            <small>Registration document</small>
                          </div>
                        </td>

                        <td>
                          <div className="compliance-record-type">
                            <strong>{document.documentType}</strong>
                            <small>{document.title}</small>
                          </div>
                        </td>

                        <td>
                          {document.version > 0
                            ? `v${document.version}`
                            : "—"}
                        </td>

                        <td>
                          <span className="compliance-timestamp">
                            {document.updatedAt
                              ? formatTimestamp(document.updatedAt)
                              : "Not updated"}
                          </span>
                        </td>

                        <td>
                          <span
                            className={`compliance-status ${
                              document.status === "Published"
                                ? "reviewed"
                                : document.status === "Draft"
                                  ? "pending"
                                  : "rejected"
                            }`}
                          >
                            {document.status}
                          </span>
                        </td>

                        <td>
                          <div className="compliance-actions">

                            <button
                              type="button"
                              title="View document"
                              disabled={!document.content}
                              onClick={() =>
                                openLegalDocumentEditor(document)
                              }
                            >
                              <Eye size={16} />
                            </button>

                            <button
                              type="button"
                              title="Edit document"
                              onClick={() =>
                                openLegalDocumentEditor(document)
                              }
                            >
                              <Edit3 size={16} />
                            </button>

                          </div>
                        </td>

                      </tr>
                    ))}

                  {!documentsLoading &&
                    filteredLegalDocuments.length === 0 && (
                      <tr>
                        <td colSpan={6}>
                          <div className="compliance-empty">
                            <FileText size={30} />

                            <strong>
                              No legal documents found
                            </strong>

                            <span>
                              Try searching with another category or document name.
                            </span>
                          </div>
                        </td>
                      </tr>
                    )}

                </tbody>

              </table>
            </div>

            <div className="compliance-register-footer">
              Showing {filteredLegalDocuments.length} of {legalDocuments.length} documents
            </div>

          </section>

        </>
      )}

      {/* ==========================================
          ADD / EDIT COMPLIANCE MODAL
      ========================================== */}

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

              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
              >
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
                      updateField(
                        "status",
                        event.target.value as ReviewStatus
                      )
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
                disabled={saving}
              >
                Cancel
              </button>

              <button
                type="button"
                className="compliance-primary-button"
                onClick={() => void saveRecord()}
                disabled={saving}
              >
                <Save size={16} />

                {saving
                  ? "Saving..."
                  : modalMode === "add"
                    ? "Save record"
                    : "Save changes"}
              </button>

            </div>

          </div>
        </div>
      )}

      {/* ==========================================
          VIEW COMPLIANCE DETAILS MODAL
      ========================================== */}

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

              <button
                type="button"
                onClick={closeModal}
              >
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
                    className={`compliance-status ${selectedRecord.status.toLowerCase()}`}
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

                <p>
                  {selectedRecord.reviewedBy || "Awaiting review"}
                </p>
              </div>

            </div>

            <div className="compliance-modal-footer">

              {selectedRecord.status === "Pending" && (
                <>
                  <button
                    type="button"
                    className="compliance-reject-button"
                    onClick={() =>
                      void updateStatus(selectedRecord, "Rejected")
                    }
                  >
                    Reject
                  </button>

                  <button
                    type="button"
                    className="compliance-primary-button"
                    onClick={() =>
                      void updateStatus(selectedRecord, "Reviewed")
                    }
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
                    const record = selectedRecord;
                    setModalMode(null);
                    openEditModal(record);
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

      {/* ==========================================
          LEGAL DOCUMENT EDITOR MODAL
      ========================================== */}

      {editingLegalDocument && (
        <div
          className="compliance-modal-overlay"
          onClick={closeLegalDocumentEditor}
        >
          <div
            className="compliance-modal legal-document-editor"
            onClick={(event) => event.stopPropagation()}
          >

            <div className="compliance-modal-header">
              <div>
                <span>LEGAL DOCUMENT MANAGEMENT</span>

                <h2>
                  {editingLegalDocument.documentType}
                </h2>

                <p>
                  {editingLegalDocument.partnerType} registration
                </p>
              </div>

              <button
                type="button"
                onClick={closeLegalDocumentEditor}
                disabled={documentSaving}
              >
                <X size={20} />
              </button>
            </div>

            <div className="compliance-modal-body">

              <div className="compliance-form-grid">

                <div className="compliance-form-field">
                  <label>Registration category</label>

                  <input
                    value={editingLegalDocument.partnerType}
                    disabled
                  />
                </div>

                <div className="compliance-form-field">
                  <label>Document type</label>

                  <input
                    value={editingLegalDocument.documentType}
                    disabled
                  />
                </div>

                <div className="compliance-form-field full">
                  <label>Document title *</label>

                  <input
                    value={legalDocumentTitle}
                    onChange={(event) =>
                      setLegalDocumentTitle(event.target.value)
                    }
                    placeholder="Enter document title"
                  />
                </div>

                <div className="compliance-form-field full">
                  <label>Document content *</label>

                  <textarea
                    rows={14}
                    value={legalDocumentContent}
                    onChange={(event) =>
                      setLegalDocumentContent(event.target.value)
                    }
                    placeholder="Write or paste the complete legal document here..."
                  />

                  <small>
                    Enter the complete approved legal wording.
                    Avoid publishing placeholder or incomplete content.
                  </small>
                </div>

              </div>

              <div className="compliance-detail-description">
                <small>CURRENT DOCUMENT STATUS</small>

                <p>
                  {editingLegalDocument.status}
                  {editingLegalDocument.version > 0 &&
                    ` · Version ${editingLegalDocument.version}`}
                </p>
              </div>

              {legalDocumentError && (
                <div className="compliance-form-error">
                  <AlertCircle size={16} />
                  {legalDocumentError}
                </div>
              )}

            </div>

            <div className="compliance-modal-footer">

              <button
                type="button"
                className="compliance-secondary-button"
                onClick={closeLegalDocumentEditor}
                disabled={documentSaving}
              >
                Cancel
              </button>

              <button
                type="button"
                className="compliance-secondary-button"
                onClick={() => void saveLegalDocument(false)}
                disabled={documentSaving}
              >
                <Save size={16} />

                {documentSaving
                  ? "Saving..."
                  : "Save draft"}
              </button>

              <button
                type="button"
                className="compliance-primary-button"
                onClick={() => void saveLegalDocument(true)}
                disabled={documentSaving}
              >
                <Check size={16} />

                {documentSaving
                  ? "Publishing..."
                  : "Publish document"}
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
