import React, { useState } from "react";

const initialParticipants = [
  {
    id: 1, name: "Arjun Mehta", email: "arjun.mehta@email.com",
    event: "Leadership Summit", registeredAt: "2026-04-30T09:15:00", approval: "Pending",
  },
  {
    id: 2, name: "Priya Sharma", email: "priya.sharma@email.com",
    event: "Developer Hackathon", registeredAt: "2026-04-30T10:30:00", approval: "Pending",
  },
  {
    id: 3, name: "Rahul Verma", email: "rahul.verma@email.com",
    event: "Community Training", registeredAt: "2026-04-29T14:20:00", approval: "Pending",
  },
  {
    id: 4, name: "Sneha Patel", email: "sneha.patel@email.com",
    event: "Volunteer Orientation", registeredAt: "2026-04-29T11:45:00", approval: "Pending",
  },
  {
    id: 5, name: "Kiran Kumar", email: "kiran.kumar@email.com",
    event: "Leadership Summit", registeredAt: "2026-04-28T16:00:00", approval: "Pending",
  },
  {
    id: 6, name: "Deepa Nair", email: "deepa.nair@email.com",
    event: "Tech Conference", registeredAt: "2026-04-25T08:00:00",
    approval: "Approved", decidedAt: "2026-04-26T09:00:00",
  },
  {
    id: 7, name: "Amit Singh", email: "amit.singh@email.com",
    event: "Networking Breakfast", registeredAt: "2026-04-24T10:00:00",
    approval: "Denied", decidedAt: "2026-04-25T11:00:00",
  },
  {
    id: 8, name: "Meera Joshi", email: "meera.joshi@email.com",
    event: "Spring Conference", registeredAt: "2026-04-23T12:00:00",
    approval: "Approved", decidedAt: "2026-04-24T13:00:00",
  },
  {
    id: 9, name: "Vijay Reddy", email: "vijay.reddy@email.com",
    event: "Developer Hackathon", registeredAt: "2026-04-22T14:00:00",
    approval: "Denied", decidedAt: "2026-04-23T15:00:00",
  },
  {
    id: 10, name: "Anita Gupta", email: "anita.gupta@email.com",
    event: "Community Training", registeredAt: "2026-04-21T16:00:00",
    approval: "Approved", decidedAt: "2026-04-22T17:00:00",
  },
  {
    id: 11, name: "Ravi Shankar", email: "ravi.shankar@email.com",
    event: "Charity Gala", registeredAt: "2026-04-20T09:00:00",
    approval: "Approved", decidedAt: "2026-04-21T10:00:00",
  },
  {
    id: 12, name: "Kavitha Menon", email: "kavitha.menon@email.com",
    event: "Marketing Workshop", registeredAt: "2026-04-19T11:00:00",
    approval: "Denied", decidedAt: "2026-04-20T12:00:00",
  },
];

const AVATAR_COLORS = [
  "#3b82f6","#8b5cf6","#ec4899","#f59e0b",
  "#10b981","#6366f1","#ef4444","#0ea5e9",
];

function getInitials(name) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

function getAvatarColor(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

/* ── SVG Icons ─────────────────────────────────────────────────────────── */
const ClockIcon = ({ size = 14, color = "currentColor" }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none"
    stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
);

const CalendarIcon = ({ size = 12, color = "currentColor" }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none"
    stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const CheckIcon = ({ size = 14 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const CrossIcon = ({ size = 14 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const PenIcon = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="none"
    stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
  </svg>
);

const UsersIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const XCircleIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="15" y1="9" x2="9" y2="15" />
    <line x1="9" y1="9" x2="15" y2="15" />
  </svg>
);

const EmptyUsersIcon = () => (
  <svg viewBox="0 0 24 24" width="40" height="40" fill="none"
    stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const EmptyDocIcon = () => (
  <svg viewBox="0 0 24 24" width="40" height="40" fill="none"
    stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
  </svg>
);

/* ── Component ─────────────────────────────────────────────────────────── */
function Participant() {
  const [participants, setParticipants] = useState(initialParticipants);

  const pending = participants.filter((p) => p.approval === "Pending");
  const decided = participants
    .filter((p) => p.approval !== "Pending")
    .sort((a, b) => new Date(b.decidedAt) - new Date(a.decidedAt))
    .slice(0, 5);

  const totalApproved = participants.filter((p) => p.approval === "Approved").length;
  const totalDenied = participants.filter((p) => p.approval === "Denied").length;

  const handleApprove = (id) => {
    setParticipants((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, approval: "Approved", decidedAt: new Date().toISOString() } : p
      )
    );
  };

  const handleReject = (id) => {
    setParticipants((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, approval: "Denied", decidedAt: new Date().toISOString() } : p
      )
    );
  };

  const stats = [
    { label: "Awaiting Approval", value: pending.length, color: "#d97706", bg: "#fffbeb", border: "#f59e0b", icon: <ClockIcon size={22} /> },
    { label: "Approved",          value: totalApproved,  color: "#16a34a", bg: "#f0fdf4", border: "#22c55e", icon: <CheckCircleIcon /> },
    { label: "Rejected",          value: totalDenied,    color: "#dc2626", bg: "#fff1f2", border: "#ef4444", icon: <XCircleIcon /> },
  ];

  return (
    <div className="pa-root">
      {/* Page Header */}
      <div className="mb-4">
        <h1 className="h3 fw-bold mb-1">Participant Approvals</h1>
        <p className="text-muted mb-0">Review and manage participant registration requests</p>
      </div>

      {/* Stats */}
      <div className="pa-stats-grid mb-4">
        {stats.map((s, i) => (
          <div key={i} className="pa-stat-card" style={{ borderTop: `3px solid ${s.border}`, background: s.bg }}>
            <div style={{ color: s.color, flexShrink: 0 }}>{s.icon}</div>
            <div>
              <div className="pa-stat-label">{s.label}</div>
              <div className="pa-stat-value" style={{ color: s.color }}>{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Two-panel grid */}
      <div className="pa-grid">

        {/* ── Awaiting Approval ─────────────────────────────────────── */}
        <div className="pa-card">
          <div className="pa-card-header">
            <div className="pa-card-title">
              <span style={{ color: "#f59e0b", display: "flex" }}><ClockIcon size={15} /></span>
              Awaiting Approval
              {pending.length > 0 && (
                <span className="pa-count-badge">{pending.length}</span>
              )}
            </div>
            {pending.length > 0 && (
              <span className="pa-header-hint">Approve or reject each request</span>
            )}
          </div>

          <div className="pa-card-body">
            {pending.length === 0 ? (
              <div className="pa-empty">
                <EmptyUsersIcon />
                <p>No pending approvals</p>
                <span>All registrations have been reviewed</span>
              </div>
            ) : (
              <div className="pa-list">
                {pending.map((p) => (
                  <div key={p.id} className="pa-item">
                    <div className="pa-avatar" style={{ background: getAvatarColor(p.name) }}>
                      {getInitials(p.name)}
                    </div>

                    <div className="pa-item-info">
                      <div className="pa-item-name">{p.name}</div>
                      <div className="pa-item-email">{p.email}</div>
                      <div className="pa-item-meta">
                        <span className="pa-meta-chip">
                          <CalendarIcon />{p.event}
                        </span>
                        <span className="pa-meta-time">
                          <ClockIcon size={11} />{timeAgo(p.registeredAt)}
                        </span>
                      </div>
                    </div>

                    <div className="pa-item-actions">
                      <button className="pa-btn-approve" onClick={() => handleApprove(p.id)}>
                        <CheckIcon size={13} /> Approve
                      </button>
                      <button className="pa-btn-reject" onClick={() => handleReject(p.id)}>
                        <CrossIcon size={13} /> Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Recent Decisions ──────────────────────────────────────── */}
        <div className="pa-card">
          <div className="pa-card-header">
            <div className="pa-card-title">
              <span style={{ color: "#6366f1", display: "flex" }}><PenIcon /></span>
              Recent Decisions
              <span className="pa-label-muted">last 5</span>
            </div>
          </div>

          <div className="pa-card-body">
            {decided.length === 0 ? (
              <div className="pa-empty">
                <EmptyDocIcon />
                <p>No decisions yet</p>
                <span>Review pending approvals to see history here</span>
              </div>
            ) : (
              <div className="pa-list">
                {decided.map((p) => (
                  <div key={p.id} className="pa-item">
                    <div className="pa-avatar" style={{ background: getAvatarColor(p.name) }}>
                      {getInitials(p.name)}
                    </div>

                    <div className="pa-item-info">
                      <div className="pa-item-name">{p.name}</div>
                      <div className="pa-item-email">{p.email}</div>
                      <div className="pa-item-meta">
                        <span className="pa-meta-chip">
                          <CalendarIcon />{p.event}
                        </span>
                      </div>
                    </div>

                    <div className="pa-decision-col">
                      {p.approval === "Approved" ? (
                        <span className="pa-badge-approved">
                          <CheckIcon size={11} /> Approved
                        </span>
                      ) : (
                        <span className="pa-badge-denied">
                          <CrossIcon size={11} /> Rejected
                        </span>
                      )}
                      <div className="pa-decision-time">
                        <ClockIcon size={10} color="#9ca3af" />
                        {timeAgo(p.decidedAt)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer note */}
          {decided.length > 0 && (
            <div className="pa-card-footer">
              <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="#9ca3af"
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              Showing the 5 most recent decisions
            </div>
          )}
        </div>

      </div>

      <style>{`
        .pa-root { padding-bottom: 40px; }

        /* Stats row */
        .pa-stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }
        .pa-stat-card {
          border-radius: 12px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.07), 0 4px 16px rgba(0,0,0,0.04);
          padding: 20px 22px;
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .pa-stat-label {
          font-size: 11.5px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.055em;
          color: #6b7280;
          margin-bottom: 5px;
        }
        .pa-stat-value { font-size: 30px; font-weight: 800; line-height: 1; }

        /* Two-panel grid */
        .pa-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          align-items: start;
        }

        /* Card shell */
        .pa-card {
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.07), 0 4px 16px rgba(0,0,0,0.04);
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }
        .pa-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          border-bottom: 1px solid #f0f0f0;
        }
        .pa-card-title {
          display: flex;
          align-items: center;
          gap: 7px;
          font-size: 14px;
          font-weight: 700;
          color: #1a202c;
        }
        .pa-count-badge {
          background: #fef3c7;
          color: #d97706;
          font-size: 11px;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 20px;
        }
        .pa-label-muted {
          font-size: 11px;
          font-weight: 500;
          color: #9ca3af;
        }
        .pa-header-hint { font-size: 12px; color: #9ca3af; }
        .pa-card-body { overflow-y: auto; max-height: 520px; }
        .pa-card-footer {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 11px 20px;
          border-top: 1px solid #f3f4f6;
          font-size: 12px;
          color: #9ca3af;
          background: #fafafa;
        }

        /* List + items */
        .pa-list { padding: 4px 0; }
        .pa-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 20px;
          border-bottom: 1px solid #f9fafb;
          transition: background 0.1s;
        }
        .pa-item:last-child { border-bottom: none; }
        .pa-item:hover { background: #fafafa; }

        /* Avatar */
        .pa-avatar {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          font-weight: 700;
          color: #fff;
          flex-shrink: 0;
          letter-spacing: 0.03em;
        }

        /* Item info */
        .pa-item-info { flex: 1; min-width: 0; }
        .pa-item-name {
          font-size: 13.5px;
          font-weight: 600;
          color: #111827;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .pa-item-email {
          font-size: 12px;
          color: #9ca3af;
          margin-top: 1px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .pa-item-meta {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 6px;
          flex-wrap: wrap;
        }
        .pa-meta-chip {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 11px;
          color: #6b7280;
          background: #f3f4f6;
          padding: 2px 8px;
          border-radius: 6px;
          font-weight: 500;
        }
        .pa-meta-time {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 11px;
          color: #9ca3af;
        }

        /* Approve / Reject buttons */
        .pa-item-actions { display: flex; flex-direction: column; gap: 6px; flex-shrink: 0; }
        .pa-btn-approve, .pa-btn-reject {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 5px 13px;
          border-radius: 7px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          border: none;
          transition: all 0.12s;
          line-height: 1;
          white-space: nowrap;
        }
        .pa-btn-approve { background: #dcfce7; color: #16a34a; }
        .pa-btn-approve:hover { background: #bbf7d0; transform: translateY(-1px); }
        .pa-btn-reject { background: #fee2e2; color: #dc2626; }
        .pa-btn-reject:hover { background: #fecaca; transform: translateY(-1px); }

        /* Decision column */
        .pa-decision-col {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 5px;
          flex-shrink: 0;
        }
        .pa-badge-approved, .pa-badge-denied {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 11.5px;
          font-weight: 700;
          white-space: nowrap;
        }
        .pa-badge-approved { background: #dcfce7; color: #16a34a; }
        .pa-badge-denied   { background: #fee2e2; color: #dc2626; }
        .pa-decision-time {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 11px;
          color: #9ca3af;
        }

        /* Empty state */
        .pa-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 52px 24px;
          gap: 8px;
          text-align: center;
        }
        .pa-empty p { font-size: 14px; font-weight: 600; color: #374151; margin: 0; }
        .pa-empty span { font-size: 12px; color: #9ca3af; }

        @media (max-width: 900px) {
          .pa-grid { grid-template-columns: 1fr; }
          .pa-stats-grid { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 560px) {
          .pa-stats-grid { grid-template-columns: 1fr; }
          .pa-item-actions { flex-direction: row; }
        }
      `}</style>
    </div>
  );
}

export default Participant;