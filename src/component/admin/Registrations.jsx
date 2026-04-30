import { useState, useMemo, useRef, useEffect } from "react";

const initialRegistrations = [
  { id: 1,  name: "Arjun Mehta",   email: "arjun.mehta@email.com",   event: "Leadership Summit",     registeredAt: "2026-04-30T09:15:00", status: "pending" },
  { id: 2,  name: "Priya Sharma",  email: "priya.sharma@email.com",  event: "Developer Hackathon",   registeredAt: "2026-04-30T10:30:00", status: "pending" },
  { id: 3,  name: "Rahul Verma",   email: "rahul.verma@email.com",   event: "Community Training",    registeredAt: "2026-04-29T14:20:00", status: "pending" },
  { id: 4,  name: "Sneha Patel",   email: "sneha.patel@email.com",   event: "Volunteer Orientation", registeredAt: "2026-04-29T11:45:00", status: "pending" },
  { id: 5,  name: "Kiran Kumar",   email: "kiran.kumar@email.com",   event: "Leadership Summit",     registeredAt: "2026-04-28T16:00:00", status: "pending" },
  { id: 6,  name: "Deepa Nair",    email: "deepa.nair@email.com",    event: "Tech Conference",       registeredAt: "2026-04-25T08:00:00", status: "approved", decidedAt: "2026-04-26T09:00:00" },
  { id: 7,  name: "Amit Singh",    email: "amit.singh@email.com",    event: "Networking Breakfast",  registeredAt: "2026-04-24T10:00:00", status: "rejected", decidedAt: "2026-04-25T11:00:00" },
  { id: 8,  name: "Meera Joshi",   email: "meera.joshi@email.com",   event: "Spring Conference",     registeredAt: "2026-04-23T12:00:00", status: "approved", decidedAt: "2026-04-24T13:00:00" },
  { id: 9,  name: "Vijay Reddy",   email: "vijay.reddy@email.com",   event: "Developer Hackathon",   registeredAt: "2026-04-22T14:00:00", status: "rejected", decidedAt: "2026-04-23T15:00:00" },
  { id: 10, name: "Anita Gupta",   email: "anita.gupta@email.com",   event: "Community Training",    registeredAt: "2026-04-21T16:00:00", status: "approved", decidedAt: "2026-04-22T17:00:00" },
  { id: 11, name: "Ravi Shankar",  email: "ravi.shankar@email.com",  event: "Charity Gala",          registeredAt: "2026-04-20T09:00:00", status: "approved", decidedAt: "2026-04-21T10:00:00" },
  { id: 12, name: "Kavitha Menon", email: "kavitha.menon@email.com", event: "Marketing Workshop",    registeredAt: "2026-04-19T11:00:00", status: "rejected", decidedAt: "2026-04-20T12:00:00" },
  { id: 13, name: "Suresh Babu",   email: "suresh.babu@email.com",   event: "Leadership Summit",     registeredAt: "2026-04-18T10:00:00", status: "approved", decidedAt: "2026-04-19T09:00:00" },
  { id: 14, name: "Nandita Roy",   email: "nandita.roy@email.com",   event: "Spring Conference",     registeredAt: "2026-04-17T11:00:00", status: "rejected", decidedAt: "2026-04-18T10:00:00" },
  { id: 15, name: "Prakash Iyer",  email: "prakash.iyer@email.com",  event: "Tech Conference",       registeredAt: "2026-04-16T09:00:00", status: "approved", decidedAt: "2026-04-17T08:00:00" },
];

const PAGE_SIZE_OPTIONS = [10, 30, 50];

function getInitials(name) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}
function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

/* ── Icons ───────────────────────────────────────────────────────────────── */
const Icon = {
  Users: ({ s = 18 }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  Search: ({ s = 14 }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  ),
  Clock: ({ s = 13 }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  Check: ({ s = 13 }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  X: ({ s = 13 }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
  Calendar: ({ s = 11 }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  ),
  ChevronDown: ({ s = 13 }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  ),
  ChevronLeft: ({ s = 14 }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6"/>
    </svg>
  ),
  ChevronRight: ({ s = 14 }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6"/>
    </svg>
  ),
  Empty: () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
};

const STATUS_TABS = [
  { key: "all",      label: "All" },
  { key: "pending",  label: "Pending" },
  { key: "approved", label: "Approved" },
  { key: "rejected", label: "Rejected" },
];

/* ── Component ───────────────────────────────────────────────────────────── */
function Registrations() {
  const [registrations, setRegistrations] = useState(initialRegistrations);
  const [search, setSearch]               = useState("");
  const [statusFilter, setStatusFilter]   = useState("all");
  const [eventFilter, setEventFilter]     = useState("");   // locked selection
  const [eventInput, setEventInput]       = useState("");   // typed text in combobox
  const [dropdownOpen, setDropdownOpen]   = useState(false);
  const [page, setPage]                   = useState(1);
  const [pageSize, setPageSize]           = useState(10);
  const comboRef                          = useRef(null);

  const pendingCount = registrations.filter((r) => r.status === "pending").length;
  const allEvents    = useMemo(
    () => [...new Set(initialRegistrations.map((r) => r.event))].sort(),
    []
  );
  const visibleEvents = useMemo(
    () => eventInput.trim()
      ? allEvents.filter((e) => e.toLowerCase().includes(eventInput.trim().toLowerCase()))
      : allEvents,
    [allEvents, eventInput]
  );

  /* close dropdown on outside click */
  useEffect(() => {
    const handler = (e) => { if (comboRef.current && !comboRef.current.contains(e.target)) setDropdownOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* filtered list */
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return registrations.filter((r) => {
      const matchStatus = statusFilter === "all" || r.status === statusFilter;
      const matchSearch = !q || r.name.toLowerCase().includes(q) || r.email.toLowerCase().includes(q) || r.event.toLowerCase().includes(q);
      const matchEvent  = !eventFilter || r.event === eventFilter;
      return matchStatus && matchSearch && matchEvent;
    });
  }, [registrations, search, statusFilter, eventFilter]);

  /* reset page when filters change */
  const resetPage = () => setPage(1);

  const selectEvent = (ev) => {
    setEventFilter(ev);
    setEventInput(ev);
    setDropdownOpen(false);
    setPage(1);
  };
  const clearEvent = () => {
    setEventFilter("");
    setEventInput("");
    setDropdownOpen(false);
    setPage(1);
  };

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated  = filtered.slice((page - 1) * pageSize, page * pageSize);

  const handleApprove = (id) => {
    setRegistrations((prev) =>
      prev.map((r) => r.id === id ? { ...r, status: "approved", decidedAt: new Date().toISOString() } : r)
    );
  };
  const handleReject = (id) => {
    setRegistrations((prev) =>
      prev.map((r) => r.id === id ? { ...r, status: "rejected", decidedAt: new Date().toISOString() } : r)
    );
  };

  const counts = {
    all:      registrations.length,
    pending:  registrations.filter((r) => r.status === "pending").length,
    approved: registrations.filter((r) => r.status === "approved").length,
    rejected: registrations.filter((r) => r.status === "rejected").length,
  };

  return (
    <div className="rg-root">

      {/* ── Page Header ────────────────────────────────────── */}
      <div className="rg-header">
        <div className="rg-header-left">
          <div className="rg-header-icon"><Icon.Users s={18}/></div>
          <div>
            <h1 className="rg-title">Registrations</h1>
            <p className="rg-subtitle">Review and manage participant registration requests</p>
          </div>
        </div>
        {pendingCount > 0 && (
          <div className="rg-badge-pending">
            <Icon.Clock s={12}/>{pendingCount} pending review
          </div>
        )}
      </div>

      {/* ── Card ───────────────────────────────────────────── */}
      <div className="rg-card">

        {/* Toolbar */}
        <div className="rg-toolbar">
          <div className="rg-toolbar-row">
            {/* Search */}
            <div className="rg-search-wrap">
              <span className="rg-search-icon"><Icon.Search s={14}/></span>
              <input
                className="rg-search"
                type="text"
                placeholder="Search by name, email or event…"
                value={search}
                onChange={(e) => { setSearch(e.target.value); resetPage(); }}
              />
              {search && (
                <button className="rg-search-clear" onClick={() => { setSearch(""); resetPage(); }}>
                  <Icon.X s={12}/>
                </button>
              )}
            </div>

            {/* Event combobox */}
            <div className="rg-combo-wrap" ref={comboRef}>
              <div className={`rg-combo-box${eventFilter ? " rg-combo-box--active" : ""}`}>
                <span className="rg-combo-icon"><Icon.Calendar s={13}/></span>
                <input
                  className="rg-combo-input"
                  type="text"
                  placeholder="Filter by event…"
                  value={eventInput}
                  onChange={(e) => {
                    setEventInput(e.target.value);
                    setEventFilter("");
                    setDropdownOpen(true);
                    setPage(1);
                  }}
                  onFocus={() => setDropdownOpen(true)}
                />
                {(eventInput || eventFilter) && (
                  <button className="rg-search-clear" onClick={clearEvent} title="Clear event filter">
                    <Icon.X s={12}/>
                  </button>
                )}
                <span className="rg-combo-divider"/>
                <button
                  className="rg-combo-arrow"
                  onClick={() => setDropdownOpen((o) => !o)}
                  title="Show event list"
                >
                  <Icon.ChevronDown s={12}/>
                </button>
              </div>

              {dropdownOpen && (
                <ul className="rg-combo-dropdown">
                  <li
                    className={`rg-combo-option rg-combo-option--all${!eventFilter ? " rg-combo-option--selected" : ""}`}
                    onMouseDown={() => selectEvent("")}
                  >
                    All Events
                  </li>
                  {visibleEvents.length === 0 ? (
                    <li className="rg-combo-option rg-combo-option--empty">No matching events</li>
                  ) : (
                    visibleEvents.map((ev) => (
                      <li
                        key={ev}
                        className={`rg-combo-option${eventFilter === ev ? " rg-combo-option--selected" : ""}`}
                        onMouseDown={() => selectEvent(ev)}
                      >
                        <Icon.Calendar s={11}/>
                        {ev}
                      </li>
                    ))
                  )}
                </ul>
              )}
            </div>
          </div>

          {/* Status tabs */}
          <div className="rg-tabs">
            {STATUS_TABS.map((t) => (
              <button
                key={t.key}
                className={`rg-tab${statusFilter === t.key ? " rg-tab--active" : ""}`}
                onClick={() => { setStatusFilter(t.key); resetPage(); }}
              >
                {t.label}
                <span className={`rg-tab-count${statusFilter === t.key ? " rg-tab-count--active" : ""}`}>
                  {counts[t.key]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="rg-table-wrap">
          {paginated.length === 0 ? (
            <div className="rg-empty">
              <Icon.Empty/>
              <p>No registrations found</p>
              <span>Try adjusting your search or filter</span>
            </div>
          ) : (
            <table className="rg-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Participant</th>
                  <th>Event</th>
                  <th>Status</th>
                  <th>Registered</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((r, idx) => (
                  <tr key={r.id}>
                    <td className="rg-td-num">{(page - 1) * pageSize + idx + 1}</td>
                    <td>
                      <div className="rg-person">
                        <div className="rg-avatar">{getInitials(r.name)}</div>
                        <div>
                          <div className="rg-name">{r.name}</div>
                          <div className="rg-email">{r.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="rg-tag"><Icon.Calendar s={10}/>{r.event}</span>
                    </td>
                    <td>
                      {r.status === "pending"  && <span className="rg-status rg-status--pending"><Icon.Clock s={11}/>Pending</span>}
                      {r.status === "approved" && <span className="rg-status rg-status--approved"><Icon.Check s={11}/>Approved</span>}
                      {r.status === "rejected" && <span className="rg-status rg-status--rejected"><Icon.X s={11}/>Rejected</span>}
                    </td>
                    <td>
                      <span className="rg-time"><Icon.Clock s={10}/>{timeAgo(r.registeredAt)}</span>
                    </td>
                    <td>
                      <div className="rg-actions">
                        {r.status === "pending" && (
                          <>
                            <button className="rg-btn-ok" onClick={() => handleApprove(r.id)}>
                              <Icon.Check s={12}/> Approve
                            </button>
                            <button className="rg-btn-no" onClick={() => handleReject(r.id)}>
                              <Icon.X s={12}/> Reject
                            </button>
                          </>
                        )}
                        {r.status === "approved" && (
                          <button className="rg-btn-change" onClick={() => handleReject(r.id)}>
                            <Icon.X s={11}/> Change to Reject
                          </button>
                        )}
                        {r.status === "rejected" && (
                          <button className="rg-btn-change" onClick={() => handleApprove(r.id)}>
                            <Icon.Check s={11}/> Change to Approve
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination footer */}
        {filtered.length > 0 && (
          <div className="rg-footer">
            <div className="rg-footer-left">
              <span className="rg-footer-info">
                {filtered.length === 0 ? "0 results" : `${(page - 1) * pageSize + 1}–${Math.min(page * pageSize, filtered.length)} of ${filtered.length}`}
              </span>
              <div className="rg-page-size">
                <span className="rg-footer-info">Rows:</span>
                {PAGE_SIZE_OPTIONS.map((n) => (
                  <button
                    key={n}
                    className={`rg-size-btn${pageSize === n ? " rg-size-btn--active" : ""}`}
                    onClick={() => { setPageSize(n); setPage(1); }}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            <div className="rg-pagination">
              <button
                className="rg-page-btn"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                <Icon.ChevronLeft s={14}/> Prev
              </button>
              <div className="rg-page-pills">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((n) => n === 1 || n === totalPages || Math.abs(n - page) <= 1)
                  .reduce((acc, n, i, arr) => {
                    if (i > 0 && n - arr[i - 1] > 1) acc.push("…");
                    acc.push(n);
                    return acc;
                  }, [])
                  .map((item, i) =>
                    item === "…" ? (
                      <span key={`ellipsis-${i}`} className="rg-page-ellipsis">…</span>
                    ) : (
                      <button
                        key={item}
                        className={`rg-page-pill${page === item ? " rg-page-pill--active" : ""}`}
                        onClick={() => setPage(item)}
                      >
                        {item}
                      </button>
                    )
                  )}
              </div>
              <button
                className="rg-page-btn"
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next <Icon.ChevronRight s={14}/>
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .rg-root { padding-bottom: 48px; font-family: inherit; }

        /* Header */
        .rg-header {
          display: flex; align-items: center; justify-content: space-between;
          gap: 16px; margin-bottom: 20px; flex-wrap: wrap;
        }
        .rg-header-left { display: flex; align-items: center; gap: 14px; }
        .rg-header-icon {
          width: 42px; height: 42px; border-radius: 10px;
          background: #f1f5f9; border: 1px solid #e2e8f0;
          display: flex; align-items: center; justify-content: center;
          color: #374151; flex-shrink: 0;
        }
        .rg-title { font-size: 20px; font-weight: 700; color: #0f172a; margin: 0 0 3px; letter-spacing: -0.025em; }
        .rg-subtitle { font-size: 13px; color: #94a3b8; margin: 0; }
        .rg-badge-pending {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 6px 12px; background: #f8fafc;
          border: 1px solid #e2e8f0; border-radius: 6px;
          font-size: 12px; font-weight: 600; color: #475569;
        }

        /* Card */
        .rg-card {
          background: #fff; border: 1px solid #e9ecef;
          border-radius: 12px; overflow: hidden;
        }

        /* Toolbar layout */
        .rg-toolbar { border-bottom: 1px solid #f1f5f9; }
        .rg-toolbar-row {
          display: flex; align-items: center; gap: 10px;
          padding: 14px 20px 10px; flex-wrap: wrap;
        }
        .rg-tabs {
          display: flex; align-items: center; gap: 4px;
          padding: 0 20px 12px; flex-wrap: wrap;
        }

        /* Search */
        .rg-search-wrap {
          position: relative; display: flex; align-items: center;
          flex: 1; max-width: 340px; min-width: 180px;
        }
        .rg-search-icon {
          position: absolute; left: 10px; color: #94a3b8;
          display: flex; align-items: center; pointer-events: none;
        }
        .rg-search {
          width: 100%; padding: 7px 32px 7px 32px;
          border: 1px solid #e2e8f0; border-radius: 7px;
          background: #f8fafc; font-size: 13px; color: #0f172a;
          outline: none; transition: border-color 0.12s, background 0.12s;
        }
        .rg-search::placeholder { color: #94a3b8; }
        .rg-search:focus { border-color: #94a3b8; background: #fff; }
        .rg-search-clear {
          position: absolute; right: 8px;
          background: none; border: none; cursor: pointer;
          color: #94a3b8; display: flex; align-items: center;
          padding: 2px;
          border-radius: 4px;
        }
        .rg-search-clear:hover { color: #475569; background: #f1f5f9; }

        /* Event combobox */
        .rg-combo-wrap {
          position: relative; min-width: 200px; flex: 1; max-width: 280px;
        }
        .rg-combo-box {
          display: flex; align-items: center;
          border: 1px solid #e2e8f0; border-radius: 7px;
          background: #f8fafc; overflow: hidden;
          transition: border-color 0.12s, background 0.12s;
        }
        .rg-combo-box:focus-within { border-color: #94a3b8; background: #fff; }
        .rg-combo-box--active { border-color: #0f172a; background: #fff; }
        .rg-combo-icon {
          padding: 0 6px 0 10px; color: #94a3b8;
          display: flex; align-items: center; flex-shrink: 0;
        }
        .rg-combo-input {
          flex: 1; border: none; background: transparent; outline: none;
          font-size: 13px; color: #0f172a; padding: 7px 4px;
          min-width: 0;
        }
        .rg-combo-input::placeholder { color: #94a3b8; }
        .rg-combo-divider {
          width: 1px; height: 18px; background: #e2e8f0; flex-shrink: 0; margin: 0 2px;
        }
        .rg-combo-arrow {
          padding: 0 8px; background: none; border: none; cursor: pointer;
          color: #94a3b8; display: flex; align-items: center;
          transition: color 0.1s;
        }
        .rg-combo-arrow:hover { color: #475569; }
        .rg-combo-dropdown {
          position: absolute; top: calc(100% + 4px); left: 0; right: 0;
          background: #fff; border: 1px solid #e2e8f0; border-radius: 8px;
          box-shadow: 0 8px 24px rgba(15,23,42,0.10);
          z-index: 50; list-style: none; margin: 0; padding: 4px 0;
          max-height: 220px; overflow-y: auto;
        }
        .rg-combo-option {
          display: flex; align-items: center; gap: 7px;
          padding: 8px 14px; font-size: 12.5px; color: #374151;
          cursor: pointer; transition: background 0.08s; white-space: nowrap;
        }
        .rg-combo-option:hover { background: #f8fafc; }
        .rg-combo-option--selected { background: #f1f5f9; font-weight: 600; color: #0f172a; }
        .rg-combo-option--all { font-weight: 600; color: #0f172a; border-bottom: 1px solid #f1f5f9; margin-bottom: 2px; }
        .rg-combo-option--empty { color: #94a3b8; font-style: italic; cursor: default; }
        .rg-combo-option--empty:hover { background: transparent; }

        /* Status tabs */
        .rg-tabs { display: flex; align-items: center; gap: 4px; }
        .rg-tab {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 6px 12px; border-radius: 6px; border: 1px solid transparent;
          font-size: 12.5px; font-weight: 600; cursor: pointer;
          background: transparent; color: #64748b;
          transition: all 0.12s; white-space: nowrap;
        }
        .rg-tab:hover { background: #f8fafc; color: #0f172a; }
        .rg-tab--active {
          background: #0f172a; color: #fff; border-color: #0f172a;
        }
        .rg-tab--active:hover { background: #1e293b; }
        .rg-tab-count {
          font-size: 10.5px; font-weight: 700;
          background: #f1f5f9; color: #64748b;
          padding: 1px 6px; border-radius: 10px; line-height: 1.5;
        }
        .rg-tab-count--active { background: rgba(255,255,255,0.2); color: #fff; }

        /* Table */
        .rg-table-wrap { overflow-x: auto; }
        .rg-table { width: 100%; border-collapse: collapse; font-size: 13px; }
        .rg-table thead tr { background: #f8fafc; border-bottom: 1px solid #f1f5f9; }
        .rg-table th {
          padding: 10px 16px; font-size: 11px; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.06em;
          color: #94a3b8; white-space: nowrap; text-align: left;
        }
        .rg-table td {
          padding: 13px 16px; border-bottom: 1px solid #f8fafc;
          vertical-align: middle; color: #374151;
        }
        .rg-table tbody tr:last-child td { border-bottom: none; }
        .rg-table tbody tr:hover td { background: #fafafa; }
        .rg-td-num { color: #cbd5e1; font-size: 12px; font-weight: 600; width: 36px; }

        /* Person */
        .rg-person { display: flex; align-items: center; gap: 10px; }
        .rg-avatar {
          width: 34px; height: 34px; border-radius: 8px;
          background: #1e293b; color: #fff;
          display: flex; align-items: center; justify-content: center;
          font-size: 11.5px; font-weight: 700; flex-shrink: 0;
        }
        .rg-name { font-size: 13px; font-weight: 600; color: #0f172a; }
        .rg-email { font-size: 11.5px; color: #94a3b8; margin-top: 1px; }

        .rg-tag {
          display: inline-flex; align-items: center; gap: 4px;
          font-size: 11px; color: #64748b; background: #f1f5f9;
          padding: 3px 8px; border-radius: 4px; font-weight: 500; white-space: nowrap;
        }
        .rg-time {
          display: inline-flex; align-items: center; gap: 3px;
          font-size: 11.5px; color: #94a3b8; white-space: nowrap;
        }

        /* Status badge */
        .rg-status {
          display: inline-flex; align-items: center; gap: 4px;
          padding: 3px 9px; border-radius: 5px;
          font-size: 11.5px; font-weight: 600; white-space: nowrap;
        }
        .rg-status--pending  { background: #f8fafc; color: #64748b; border: 1px solid #e2e8f0; }
        .rg-status--approved { background: #f0fdf4; color: #166534; border: 1px solid #bbf7d0; }
        .rg-status--rejected { background: #fafafa; color: #94a3b8; border: 1px solid #e2e8f0; }

        /* Action buttons */
        .rg-actions { display: flex; align-items: center; gap: 6px; justify-content: flex-end; }
        .rg-btn-ok, .rg-btn-no {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 5px 12px; border-radius: 6px;
          font-size: 12px; font-weight: 600; cursor: pointer;
          transition: all 0.12s; line-height: 1; white-space: nowrap;
        }
        .rg-btn-ok {
          background: #0f172a; color: #fff; border: 1px solid #0f172a;
        }
        .rg-btn-ok:hover { background: #1e293b; transform: translateY(-1px); }
        .rg-btn-no {
          background: transparent; color: #475569; border: 1px solid #e2e8f0;
        }
        .rg-btn-no:hover { background: #f8fafc; border-color: #cbd5e1; color: #0f172a; transform: translateY(-1px); }
        .rg-btn-change {
          display: inline-flex; align-items: center; gap: 4px;
          padding: 4px 10px; border-radius: 5px; font-size: 11.5px; font-weight: 600;
          cursor: pointer; border: 1px dashed #cbd5e1;
          background: transparent; color: #94a3b8;
          transition: all 0.12s; white-space: nowrap; line-height: 1;
        }
        .rg-btn-change:hover { border-color: #94a3b8; color: #475569; background: #f8fafc; }

        /* Empty */
        .rg-empty {
          display: flex; flex-direction: column; align-items: center;
          padding: 52px 24px; gap: 8px; text-align: center;
        }
        .rg-empty p { font-size: 13.5px; font-weight: 600; color: #374151; margin: 4px 0 0; }
        .rg-empty span { font-size: 12px; color: #9ca3af; }

        /* Footer / Pagination */
        .rg-footer {
          display: flex; align-items: center; justify-content: space-between;
          padding: 12px 20px; border-top: 1px solid #f1f5f9;
          background: #fafafa; gap: 12px; flex-wrap: wrap;
        }
        .rg-footer-left { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
        .rg-footer-info { font-size: 12px; color: #94a3b8; white-space: nowrap; }
        .rg-page-size { display: flex; align-items: center; gap: 4px; }
        .rg-size-btn {
          padding: 4px 9px; border-radius: 5px; border: 1px solid #e2e8f0;
          background: #fff; font-size: 12px; font-weight: 600; color: #64748b;
          cursor: pointer; transition: all 0.1s;
        }
        .rg-size-btn:hover { border-color: #94a3b8; color: #0f172a; }
        .rg-size-btn--active {
          background: #0f172a; border-color: #0f172a; color: #fff;
        }
        .rg-pagination { display: flex; align-items: center; gap: 4px; }
        .rg-page-btn {
          display: inline-flex; align-items: center; gap: 4px;
          padding: 5px 12px; border-radius: 6px; border: 1px solid #e2e8f0;
          background: #fff; font-size: 12px; font-weight: 600; color: #374151;
          cursor: pointer; transition: all 0.1s; white-space: nowrap;
        }
        .rg-page-btn:disabled { opacity: 0.35; cursor: not-allowed; }
        .rg-page-btn:not(:disabled):hover { background: #f1f5f9; border-color: #cbd5e1; }
        .rg-page-pills { display: flex; align-items: center; gap: 3px; }
        .rg-page-pill {
          width: 30px; height: 30px; border-radius: 6px; border: 1px solid #e2e8f0;
          background: #fff; font-size: 12px; font-weight: 600; color: #374151;
          cursor: pointer; transition: all 0.1s; display: flex; align-items: center; justify-content: center;
        }
        .rg-page-pill:hover { background: #f1f5f9; }
        .rg-page-pill--active { background: #0f172a; border-color: #0f172a; color: #fff; }
        .rg-page-ellipsis { width: 24px; text-align: center; font-size: 12px; color: #94a3b8; }

        /* Responsive */
        @media (max-width: 768px) {
          .rg-toolbar-row { flex-direction: column; align-items: stretch; }
          .rg-search-wrap { max-width: 100%; }
          .rg-combo-wrap { max-width: 100%; }
          .rg-footer { flex-direction: column; align-items: flex-start; }
        }
      `}</style>
    </div>
  );
}

export default Registrations;
