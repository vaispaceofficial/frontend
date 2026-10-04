import { useState } from "react";
import {
  ChevronDown,
  Eye,
  ShieldCheck,
} from "lucide-react";

import "./Compliance.css";

type ReviewStatus = "Reviewed" | "Pending";

type ComplianceRecord = {
  id: string;
  recordType: string;
  partnerId: string;
  timestamp: string;
  status: ReviewStatus;
  detail: string;
};

const records: ComplianceRecord[] = [
  {
    id: "1",
    recordType: "T&C acceptance",
    partnerId: "P-1041",
    timestamp: "02 Oct 2026 · 09:20",
    status: "Reviewed",
    detail: "Acceptance recorded",
  },
  {
    id: "2",
    recordType: "Intermediary disclaimer",
    partnerId: "P-1042",
    timestamp: "02 Oct 2026 · 08:45",
    status: "Pending",
    detail: "Acknowledgement awaiting review",
  },
  {
    id: "3",
    recordType: "ID/business verification",
    partnerId: "B-302",
    timestamp: "01 Oct 2026 · 16:10",
    status: "Pending",
    detail: "Business verification record",
  },
  {
    id: "4",
    recordType: "Vendor declaration",
    partnerId: "V-208",
    timestamp: "01 Oct 2026 · 14:35",
    status: "Reviewed",
    detail: "Vendor declaration recorded",
  },
  {
    id: "5",
    recordType: "Professional verification",
    partnerId: "P-1038",
    timestamp: "30 Sep 2026 · 17:05",
    status: "Reviewed",
    detail: "Identity verification completed",
  },
];

export default function Compliance() {
  const [visibleRecords, setVisibleRecords] = useState(3);
  const [statusFilter, setStatusFilter] = useState<
    "All statuses" | ReviewStatus
  >("All statuses");

  const filteredRecords = records.filter((record) => {
    if (statusFilter === "All statuses") {
      return true;
    }

    return record.status === statusFilter;
  });

  const displayedRecords = filteredRecords.slice(
    0,
    visibleRecords,
  );

  const loadMore = () => {
    setVisibleRecords((current) =>
      Math.min(current + 3, filteredRecords.length),
    );
  };

  const viewRecord = (record: ComplianceRecord) => {
    console.log("View compliance record:", record);
  };

  return (
    <div className="compliance-admin-page">
      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <section className="compliance-page-header">
        <div>
          <span className="compliance-eyebrow">
            REVIEW REGISTER
          </span>

          <h1>Legal &amp; Compliance Logs</h1>
        </div>
      </section>

      {/* =====================================================
          OPERATIONAL NOTICE
      ===================================================== */}

      <section className="compliance-notice">
        <ShieldCheck size={20} />

        <div>
          <strong>Operational notice:</strong>

          <span>
            The platform facilitates discovery and listing,
            while vendors and professionals remain responsible
            for their own services, products, warranties, and
            compliance. This administrative notice is not legal
            advice.
          </span>
        </div>
      </section>

      {/* =====================================================
          RECORDS CARD
      ===================================================== */}

      <section className="compliance-records-card">
        {/* ===================================================
            TABLE HEADER
        =================================================== */}

        <div className="compliance-table-toolbar">
          <div>
            <h2>Compliance review register</h2>

            <p>
              Review acknowledgements, verification records, and
              operational compliance activity.
            </p>
          </div>

          <div className="compliance-filter">
            <select
              value={statusFilter}
              onChange={(event) => {
                setStatusFilter(
                  event.target.value as
                    | "All statuses"
                    | ReviewStatus,
                );
                setVisibleRecords(3);
              }}
            >
              <option>All statuses</option>
              <option>Reviewed</option>
              <option>Pending</option>
            </select>

            <ChevronDown size={15} />
          </div>
        </div>

        {/* ===================================================
            TABLE
        =================================================== */}

        <div className="compliance-table-wrapper">
          <table className="compliance-table">
            <thead>
              <tr>
                <th>RECORD TYPE</th>
                <th>PARTNER ID</th>
                <th>TIMESTAMP</th>
                <th>REVIEW STATUS</th>
                <th>OPERATIONAL DETAIL</th>
                <th>ACTION</th>
              </tr>
            </thead>

            <tbody>
              {displayedRecords.map((record) => (
                <tr key={record.id}>
                  <td>
                    <span className="compliance-record-type">
                      {record.recordType}
                    </span>
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
                        record.status === "Reviewed"
                          ? "reviewed"
                          : "pending"
                      }`}
                    >
                      {record.status}
                    </span>
                  </td>

                  <td>
                    <span className="compliance-detail">
                      {record.detail}
                    </span>
                  </td>

                  <td>
                    <button
                      type="button"
                      className="compliance-view-button"
                      onClick={() => viewRecord(record)}
                    >
                      <Eye size={14} />
                      View record
                    </button>
                  </td>
                </tr>
              ))}

              {displayedRecords.length === 0 && (
                <tr>
                  <td colSpan={6}>
                    <div className="compliance-empty">
                      No compliance records found.
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ===================================================
            LOAD MORE
        =================================================== */}

        {visibleRecords < filteredRecords.length && (
          <div className="compliance-load-more">
            <button
              type="button"
              onClick={loadMore}
            >
              Load more
            </button>
          </div>
        )}
      </section>
    </div>
  );
}