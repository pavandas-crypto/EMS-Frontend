import { useState, useMemo } from "react";

/* ── Mock data ───────────────────────────────────────────────────────────── */
const PARTICIPANTS = [
  { id: 1,  name: "Arjun Mehta",      email: "arjun.mehta@corp.com",      phone: "+91 98765 43210", company: "Tech Corp",          designation: "Software Engineer",   membership: "Member",     event: "Leadership Summit",    qrPass: "QR-2026-001", status: "attended",  verifiedBy: "Ritu Singh",   registeredAt: "2026-04-20", attendedAt: "2026-04-28" },
  { id: 2,  name: "Priya Sharma",     email: "priya.sharma@innovate.com",  phone: "+91 87654 32109", company: "Innovate Labs",       designation: "Product Manager",      membership: "Non-Member", event: "Leadership Summit",    qrPass: "QR-2026-002", status: "approved",  verifiedBy: "",             registeredAt: "2026-04-21", attendedAt: "" },
  { id: 3,  name: "Rahul Verma",      email: "rahul.verma@globalind.com",  phone: "+91 76543 21098", company: "Global Industries",   designation: "Operations Head",      membership: "Member",     event: "Developer Hackathon",  qrPass: "QR-2026-003", status: "attended",  verifiedBy: "Deepak Joshi", registeredAt: "2026-04-18", attendedAt: "2026-04-25" },
  { id: 4,  name: "Sneha Patel",      email: "sneha.patel@creative.com",   phone: "+91 65432 10987", company: "Creative Studios",    designation: "UX Designer",          membership: "Member",     event: "Developer Hackathon",  qrPass: "QR-2026-004", status: "attended",  verifiedBy: "Deepak Joshi", registeredAt: "2026-04-19", attendedAt: "2026-04-25" },
  { id: 5,  name: "Kiran Kumar",      email: "kiran.kumar@finance.com",    phone: "+91 54321 09876", company: "Finance Group",       designation: "CFO",                  membership: "Member",     event: "Leadership Summit",    qrPass: "QR-2026-005", status: "approved",  verifiedBy: "",             registeredAt: "2026-04-22", attendedAt: "" },
  { id: 6,  name: "Deepa Nair",       email: "deepa.nair@health.com",      phone: "+91 43210 98765", company: "Health Solutions",    designation: "Doctor",               membership: "Non-Member", event: "Tech Conference",       qrPass: "QR-2026-006", status: "attended",  verifiedBy: "Smita Das",    registeredAt: "2026-04-17", attendedAt: "2026-04-24" },
  { id: 7,  name: "Amit Singh",       email: "amit.singh@techv.com",       phone: "+91 32109 87654", company: "Tech Ventures",       designation: "CEO",                  membership: "Member",     event: "Networking Breakfast",  qrPass: "QR-2026-007", status: "attended",  verifiedBy: "Ritu Singh",   registeredAt: "2026-04-16", attendedAt: "2026-04-23" },
  { id: 8,  name: "Meera Joshi",      email: "meera.joshi@mktg.com",       phone: "+91 21098 76543", company: "Marketing Hub",       designation: "Marketing Lead",       membership: "Non-Member", event: "Spring Conference",     qrPass: "QR-2026-008", status: "attended",  verifiedBy: "Smita Das",    registeredAt: "2026-04-15", attendedAt: "2026-04-22" },
  { id: 9,  name: "Vijay Reddy",      email: "vijay.reddy@data.com",       phone: "+91 10987 65432", company: "Data Systems",        designation: "Data Scientist",       membership: "Member",     event: "Developer Hackathon",  qrPass: "QR-2026-009", status: "approved",  verifiedBy: "",             registeredAt: "2026-04-20", attendedAt: "" },
  { id: 10, name: "Anita Gupta",      email: "anita.gupta@design.com",     phone: "+91 09876 54321", company: "Design Studio",       designation: "Creative Director",    membership: "Member",     event: "Spring Conference",     qrPass: "QR-2026-010", status: "attended",  verifiedBy: "Ritu Singh",   registeredAt: "2026-04-14", attendedAt: "2026-04-21" },
  { id: 11, name: "Ravi Shankar",     email: "ravi.shankar@charity.com",   phone: "+91 98761 23456", company: "Charity Foundation",  designation: "Director",             membership: "Member",     event: "Charity Gala",          qrPass: "QR-2026-011", status: "attended",  verifiedBy: "Deepak Joshi", registeredAt: "2026-04-13", attendedAt: "2026-04-20" },
  { id: 12, name: "Kavitha Menon",    email: "kavitha.menon@law.com",      phone: "+91 87652 34567", company: "Legal Associates",    designation: "Lawyer",               membership: "Non-Member", event: "Marketing Workshop",    qrPass: "QR-2026-012", status: "attended",  verifiedBy: "Smita Das",    registeredAt: "2026-04-12", attendedAt: "2026-04-19" },
  { id: 13, name: "Suresh Babu",      email: "suresh.babu@techcorp.com",   phone: "+91 76543 45678", company: "Tech Corp",           designation: "DevOps Lead",          membership: "Member",     event: "Tech Conference",       qrPass: "QR-2026-013", status: "approved",  verifiedBy: "",             registeredAt: "2026-04-11", attendedAt: "" },
  { id: 14, name: "Nandita Roy",      email: "nandita.roy@innovate.com",   phone: "+91 65432 56789", company: "Innovate Labs",       designation: "Business Analyst",     membership: "Non-Member", event: "Leadership Summit",     qrPass: "QR-2026-014", status: "attended",  verifiedBy: "Ritu Singh",   registeredAt: "2026-04-10", attendedAt: "2026-04-28" },
  { id: 15, name: "Prakash Iyer",     email: "prakash.iyer@global.com",    phone: "+91 54321 67890", company: "Global Industries",   designation: "VP Operations",        membership: "Member",     event: "Networking Breakfast",  qrPass: "QR-2026-015", status: "attended",  verifiedBy: "Deepak Joshi", registeredAt: "2026-04-09", attendedAt: "2026-04-23" },
];

const ALL_EVENTS = [...new Set(PARTICIPANTS.map((p) => p.event))].sort();
const PAGE_SIZES  = [10, 25, 50];

/* ── Helpers ─────────────────────────────────────────────────────────────── */
function exportCSV(rows, filename) {
  if (!rows.length) return;
  const headers = Object.keys(rows[0]);
  const csv = [headers, ...rows.map((r) => headers.map((h) => `"${r[h] ?? ""}"`))]
    .map((r) => r.join(",")).join("\n");
  const a = Object.assign(document.createElement("a"), {
    href: URL.createObjectURL(new Blob([csv], { type: "text/csv" })),
    download: filename,
  });
  a.click(); URL.revokeObjectURL(a.href);
}

/* ── Icons ───────────────────────────────────────────────────────────────── */
const I = {
  Report:    () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>,
  Users:     () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  Check:     () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
  Shield:    () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  Building:  () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>,
  Download:  () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  Search:    () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  Sort:      ({ asc }) => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points={asc ? "6 9 12 15 18 9" : "18 15 12 9 6 15"}/></svg>,
  SortNone:  () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{opacity:0.35}}><polyline points="6 9 12 4 18 9"/><polyline points="6 15 12 20 18 15"/></svg>,
  X:         () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Qr:        () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
  Chevron:   ({ l }) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points={l ? "15 18 9 12 15 6" : "9 18 15 12 9 6"}/></svg>,
  Calendar:  () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
};

const TABS = [
  { key: "participants", label: "Participant Report" },
  { key: "company",      label: "Company-wise" },
  { key: "member",       label: "Member-wise" },
];

/* ── Main component ──────────────────────────────────────────────────────── */
export default function Report() {
  const [eventFilter, setEventFilter]     = useState("all");
  const [statusFilter, setStatusFilter]   = useState("all");
  const [search, setSearch]               = useState("");
  const [tab, setTab]                     = useState("participants");
  const [sortKey, setSortKey]             = useState("name");
  const [sortAsc, setSortAsc]             = useState(true);
  const [page, setPage]                   = useState(1);
  const [pageSize, setPageSize]           = useState(10);

  /* base filtered list (event + status + search) */
  const base = useMemo(() => {
    const q = search.trim().toLowerCase();
    return PARTICIPANTS.filter((p) => {
      const eMatch = eventFilter === "all" || p.event === eventFilter;
      const sMatch = statusFilter === "all" || p.status === statusFilter;
      const qMatch = !q || p.name.toLowerCase().includes(q)
        || p.email.toLowerCase().includes(q)
        || p.company.toLowerCase().includes(q)
        || p.qrPass.toLowerCase().includes(q);
      return eMatch && sMatch && qMatch;
    });
  }, [eventFilter, statusFilter, search]);

  /* stats from base */
  const stats = useMemo(() => ({
    registered: base.length,
    approved:   base.filter((p) => p.status === "approved" || p.status === "attended").length,
    attended:   base.filter((p) => p.status === "attended").length,
  }), [base]);

  /* sorted participants */
  const sorted = useMemo(() => {
    return [...base].sort((a, b) => {
      const av = (a[sortKey] ?? "").toString().toLowerCase();
      const bv = (b[sortKey] ?? "").toString().toLowerCase();
      return sortAsc ? av.localeCompare(bv) : bv.localeCompare(av);
    });
  }, [base, sortKey, sortAsc]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const paginated  = sorted.slice((page - 1) * pageSize, page * pageSize);

  const handleSort = (key) => {
    if (sortKey === key) setSortAsc((a) => !a);
    else { setSortKey(key); setSortAsc(true); }
    setPage(1);
  };

  const resetPage = () => setPage(1);

  /* company-wise summary */
  const companyGroups = useMemo(() => {
    const map = {};
    base.forEach((p) => {
      if (!map[p.company]) map[p.company] = { company: p.company, total: 0, approved: 0, attended: 0, members: new Set() };
      map[p.company].total++;
      if (p.status === "approved" || p.status === "attended") map[p.company].approved++;
      if (p.status === "attended") map[p.company].attended++;
      map[p.company].members.add(p.name);
    });
    return Object.values(map).map((r) => ({ ...r, members: r.members.size }))
      .sort((a, b) => b.total - a.total);
  }, [base]);

  /* member-wise summary */
  const memberGroups = useMemo(() => {
    const map = {};
    base.forEach((p) => {
      const k = p.membership;
      if (!map[k]) map[k] = { membership: k, total: 0, approved: 0, attended: 0 };
      map[k].total++;
      if (p.status === "approved" || p.status === "attended") map[k].approved++;
      if (p.status === "attended") map[k].attended++;
    });
    return Object.values(map);
  }, [base]);

  /* export */
  const handleExport = () => {
    if (tab === "participants") {
      exportCSV(sorted.map(({ id, ...r }) => ({
        Name: r.name, Email: r.email, Phone: r.phone, Company: r.company,
        Designation: r.designation, Membership: r.membership, Event: r.event,
        "QR Pass": r.qrPass, Status: r.status,
        "Verified By": r.verifiedBy, "Registered At": r.registeredAt, "Attended At": r.attendedAt,
      })), `participants_${eventFilter}_${new Date().toISOString().slice(0,10)}.csv`);
    } else if (tab === "company") {
      exportCSV(companyGroups.map(({ company, total, approved, attended, members }) =>
        ({ Company: company, "Total Registered": total, "Total Approved": approved, "Total Attended": attended, Participants: members })
      ), `company_wise_${new Date().toISOString().slice(0,10)}.csv`);
    } else {
      exportCSV(memberGroups.map(({ membership, total, approved, attended }) =>
        ({ Membership: membership, "Total Registered": total, "Total Approved": approved, "Total Attended": attended })
      ), `member_wise_${new Date().toISOString().slice(0,10)}.csv`);
    }
  };

  /* sort indicator */
  const SortBtn = ({ col }) => (
    <button className="rp-sort-btn" onClick={() => handleSort(col)}>
      {sortKey === col ? <I.Sort asc={sortAsc}/> : <I.SortNone/>}
    </button>
  );

  return (
    <div className="rp-root">

      {/* ── Header ──────────────────────────────────────────── */}
      <div className="rp-header">
        <div className="rp-header-left">
          <div className="rp-header-icon"><I.Report/></div>
          <div>
            <h1 className="rp-title">Reports</h1>
            <p className="rp-subtitle">Generate, filter and export event participant reports</p>
          </div>
        </div>
        <button className="rp-btn-export" onClick={handleExport}>
          <I.Download/> Export CSV
        </button>
      </div>

      {/* ── Stat cards ──────────────────────────────────────── */}
      <div className="rp-stats">
        {[
          { label: "Total Registered",  value: stats.registered, icon: <I.Users/> },
          { label: "Total Approved",    value: stats.approved,   icon: <I.Check/> },
          { label: "Total Attended",    value: stats.attended,   icon: <I.Shield/> },
          { label: "Companies",         value: companyGroups.length, icon: <I.Building/> },
        ].map((s, i) => (
          <div key={i} className="rp-stat">
            <div className="rp-stat-accent"/>
            <div className="rp-stat-icon">{s.icon}</div>
            <div>
              <div className="rp-stat-val">{s.value}</div>
              <div className="rp-stat-lbl">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Filters ─────────────────────────────────────────── */}
      <div className="rp-filters-card">
        <div className="rp-filters-row">
          {/* Search */}
          <div className="rp-search-wrap">
            <span className="rp-search-icon"><I.Search/></span>
            <input
              className="rp-search"
              placeholder="Search name, email, company, QR…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); resetPage(); }}
            />
            {search && (
              <button className="rp-search-clear" onClick={() => { setSearch(""); resetPage(); }}>
                <I.X/>
              </button>
            )}
          </div>

          {/* Event */}
          <div className="rp-select-wrap">
            <I.Calendar/>
            <select className="rp-select" value={eventFilter}
              onChange={(e) => { setEventFilter(e.target.value); resetPage(); }}>
              <option value="all">All Events</option>
              {ALL_EVENTS.map((e) => <option key={e} value={e}>{e}</option>)}
            </select>
          </div>

          {/* Status */}
          <div className="rp-select-wrap">
            <I.Shield/>
            <select className="rp-select" value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); resetPage(); }}>
              <option value="all">All Status</option>
              <option value="approved">Approved</option>
              <option value="attended">Attended</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── Tabs ────────────────────────────────────────────── */}
      <div className="rp-tabs">
        {TABS.map((t) => (
          <button key={t.key}
            className={`rp-tab${tab === t.key ? " rp-tab--active" : ""}`}
            onClick={() => setTab(t.key)}>
            {t.label}
          </button>
        ))}
        <div className="rp-tabs-meta">
          {tab === "participants" && (
            <>
              <span className="rp-meta-txt">{sorted.length} participant{sorted.length !== 1 ? "s" : ""}</span>
              <div className="rp-page-size">
                Rows:
                {PAGE_SIZES.map((n) => (
                  <button key={n}
                    className={`rp-size-btn${pageSize === n ? " rp-size-btn--active" : ""}`}
                    onClick={() => { setPageSize(n); setPage(1); }}>{n}</button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── Participant table ────────────────────────────────── */}
      {tab === "participants" && (
        <div className="rp-card">
          <div className="rp-table-wrap">
            {paginated.length === 0 ? (
              <div className="rp-empty">
                <I.Report/>
                <p>No participants found</p>
                <span>Try adjusting your filters</span>
              </div>
            ) : (
              <table className="rp-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th onClick={() => handleSort("name")} className="rp-th-sort">
                      Participant <SortBtn col="name"/>
                    </th>
                    <th onClick={() => handleSort("qrPass")} className="rp-th-sort">
                      QR Pass <SortBtn col="qrPass"/>
                    </th>
                    <th onClick={() => handleSort("company")} className="rp-th-sort">
                      Company <SortBtn col="company"/>
                    </th>
                    <th onClick={() => handleSort("designation")} className="rp-th-sort">
                      Designation <SortBtn col="designation"/>
                    </th>
                    <th onClick={() => handleSort("membership")} className="rp-th-sort">
                      Membership <SortBtn col="membership"/>
                    </th>
                    <th onClick={() => handleSort("status")} className="rp-th-sort">
                      Status <SortBtn col="status"/>
                    </th>
                    <th onClick={() => handleSort("verifiedBy")} className="rp-th-sort">
                      Verified By <SortBtn col="verifiedBy"/>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((p, i) => (
                    <tr key={p.id}>
                      <td className="rp-td-num">{(page - 1) * pageSize + i + 1}</td>
                      <td>
                        <div className="rp-person">
                          <div className="rp-avatar">{p.name.split(" ").map((n) => n[0]).join("").slice(0,2)}</div>
                          <div>
                            <div className="rp-name">{p.name}</div>
                            <div className="rp-email">{p.email}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="rp-qr"><I.Qr/>{p.qrPass}</span>
                      </td>
                      <td><span className="rp-cell">{p.company}</span></td>
                      <td><span className="rp-cell rp-desig">{p.designation}</span></td>
                      <td>
                        <span className={`rp-badge ${p.membership === "Member" ? "rp-badge--member" : "rp-badge--non"}`}>
                          {p.membership}
                        </span>
                      </td>
                      <td>
                        <span className={`rp-badge ${
                          p.status === "attended" ? "rp-badge--attended"
                          : p.status === "approved" ? "rp-badge--approved"
                          : "rp-badge--pending"}`}>
                          {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                        </span>
                      </td>
                      <td>
                        {p.verifiedBy
                          ? <span className="rp-verifier"><I.Shield/>{p.verifiedBy}</span>
                          : <span className="rp-na">—</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination */}
          {sorted.length > pageSize && (
            <div className="rp-pagination">
              <span className="rp-pg-info">
                {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, sorted.length)} of {sorted.length}
              </span>
              <div className="rp-pg-btns">
                <button className="rp-pg-btn" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
                  <I.Chevron l/> Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((n) => n === 1 || n === totalPages || Math.abs(n - page) <= 1)
                  .reduce((acc, n, i, arr) => { if (i > 0 && n - arr[i-1] > 1) acc.push("…"); acc.push(n); return acc; }, [])
                  .map((item, i) => item === "…"
                    ? <span key={`e${i}`} className="rp-pg-ellipsis">…</span>
                    : <button key={item} className={`rp-pg-pill${page === item ? " rp-pg-pill--active" : ""}`} onClick={() => setPage(item)}>{item}</button>
                  )}
                <button className="rp-pg-btn" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>
                  Next <I.Chevron/>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Company-wise table ───────────────────────────────── */}
      {tab === "company" && (
        <div className="rp-card">
          <div className="rp-table-wrap">
            {companyGroups.length === 0 ? (
              <div className="rp-empty"><I.Report/><p>No data</p><span>Adjust filters</span></div>
            ) : (
              <table className="rp-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Company</th>
                    <th className="rp-tc">Total Registered</th>
                    <th className="rp-tc">Total Approved</th>
                    <th className="rp-tc">Total Attended</th>
                    <th className="rp-tc">Participants</th>
                  </tr>
                </thead>
                <tbody>
                  {companyGroups.map((g, i) => (
                    <tr key={g.company}>
                      <td className="rp-td-num">{i + 1}</td>
                      <td>
                        <div className="rp-company-cell">
                          <div className="rp-company-dot"/>
                          <span className="rp-name">{g.company}</span>
                        </div>
                      </td>
                      <td className="rp-tc"><span className="rp-num-chip">{g.total}</span></td>
                      <td className="rp-tc"><span className="rp-num-chip rp-num-chip--green">{g.approved}</span></td>
                      <td className="rp-tc"><span className="rp-num-chip rp-num-chip--yellow">{g.attended}</span></td>
                      <td className="rp-tc"><span className="rp-num-chip">{g.members}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* ── Member-wise table ────────────────────────────────── */}
      {tab === "member" && (
        <div className="rp-card">
          <div className="rp-table-wrap">
            {memberGroups.length === 0 ? (
              <div className="rp-empty"><I.Report/><p>No data</p><span>Adjust filters</span></div>
            ) : (
              <table className="rp-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Membership Type</th>
                    <th className="rp-tc">Total Registered</th>
                    <th className="rp-tc">Total Approved</th>
                    <th className="rp-tc">Total Attended</th>
                    <th className="rp-tc">Attendance Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {memberGroups.map((g, i) => {
                    const rate = g.total ? Math.round((g.attended / g.total) * 100) : 0;
                    return (
                      <tr key={g.membership}>
                        <td className="rp-td-num">{i + 1}</td>
                        <td>
                          <span className={`rp-badge ${g.membership === "Member" ? "rp-badge--member" : "rp-badge--non"}`} style={{ fontSize: 12.5 }}>
                            {g.membership}
                          </span>
                        </td>
                        <td className="rp-tc"><span className="rp-num-chip">{g.total}</span></td>
                        <td className="rp-tc"><span className="rp-num-chip rp-num-chip--green">{g.approved}</span></td>
                        <td className="rp-tc"><span className="rp-num-chip rp-num-chip--yellow">{g.attended}</span></td>
                        <td className="rp-tc">
                          <div className="rp-rate-wrap">
                            <div className="rp-rate-bar">
                              <div className="rp-rate-fill" style={{ width: `${rate}%` }}/>
                            </div>
                            <span className="rp-rate-txt">{rate}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      <style>{`
        /* ── Root ────────────────────────────────────── */
        .rp-root { padding-bottom: 48px; font-family: inherit; }

        /* ── Header ──────────────────────────────────── */
        .rp-header {
          display: flex; align-items: center; justify-content: space-between;
          gap: 16px; margin-bottom: 24px; flex-wrap: wrap;
        }
        .rp-header-left { display: flex; align-items: center; gap: 14px; }
        .rp-header-icon {
          width: 42px; height: 42px; border-radius: 10px;
          background: #111827; color: #fbbf24;
          border: 1px solid #1f2937;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .rp-title { font-size: 20px; font-weight: 700; color: #111827; margin: 0 0 3px; letter-spacing: -0.025em; }
        .rp-subtitle { font-size: 13px; color: #9ca3af; margin: 0; }
        .rp-btn-export {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 9px 18px; border-radius: 8px; border: none;
          background: #fbbf24; color: #111827;
          font-size: 13px; font-weight: 700; cursor: pointer;
          transition: background 0.12s; white-space: nowrap;
        }
        .rp-btn-export:hover { background: #f59e0b; }

        /* ── Stats ───────────────────────────────────── */
        .rp-stats {
          display: grid; grid-template-columns: repeat(4, 1fr);
          gap: 12px; margin-bottom: 20px;
        }
        .rp-stat {
          background: #fff; border: 1px solid #e9ecef; border-radius: 12px;
          padding: 18px 18px 18px 0;
          display: flex; align-items: center; gap: 14px; overflow: hidden;
          position: relative;
        }
        .rp-stat-accent {
          width: 4px; height: 100%; background: #fbbf24;
          position: absolute; left: 0; top: 0; border-radius: 12px 0 0 12px;
        }
        .rp-stat-icon {
          width: 40px; height: 40px; border-radius: 10px;
          background: #111827; color: #fbbf24;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
          margin-left: 14px;
        }
        .rp-stat-val { font-size: 26px; font-weight: 800; color: #111827; line-height: 1; letter-spacing: -0.03em; }
        .rp-stat-lbl { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; color: #9ca3af; margin-top: 3px; }

        /* ── Filters ─────────────────────────────────── */
        .rp-filters-card {
          background: #fff; border: 1px solid #e9ecef; border-radius: 10px;
          padding: 14px 18px; margin-bottom: 16px;
        }
        .rp-filters-row { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
        .rp-search-wrap {
          position: relative; flex: 1; min-width: 200px; max-width: 360px;
          display: flex; align-items: center;
        }
        .rp-search-icon { position: absolute; left: 10px; color: #9ca3af; display: flex; pointer-events: none; }
        .rp-search {
          width: 100%; padding: 7px 30px 7px 30px;
          border: 1px solid #e2e8f0; border-radius: 7px;
          background: #f8fafc; font-size: 13px; color: #111827; outline: none;
          transition: border-color 0.12s, background 0.12s;
        }
        .rp-search::placeholder { color: #9ca3af; }
        .rp-search:focus { border-color: #fbbf24; background: #fff; box-shadow: 0 0 0 3px rgba(251,191,36,0.15); }
        .rp-search-clear {
          position: absolute; right: 8px; background: none; border: none;
          cursor: pointer; color: #9ca3af; display: flex; padding: 2px; border-radius: 4px;
        }
        .rp-search-clear:hover { color: #374151; background: #f1f5f9; }
        .rp-select-wrap {
          display: flex; align-items: center; gap: 7px;
          padding: 7px 12px; border: 1px solid #e2e8f0; border-radius: 7px;
          background: #f8fafc; color: #9ca3af; min-width: 150px;
          transition: border-color 0.12s;
        }
        .rp-select-wrap:focus-within { border-color: #fbbf24; box-shadow: 0 0 0 3px rgba(251,191,36,0.15); }
        .rp-select {
          border: none; background: transparent; outline: none;
          font-size: 13px; color: #374151; font-weight: 500; width: 100%; cursor: pointer;
        }

        /* ── Tabs ────────────────────────────────────── */
        .rp-tabs {
          display: flex; align-items: center; gap: 4px;
          margin-bottom: 14px; flex-wrap: wrap;
        }
        .rp-tab {
          padding: 7px 16px; border-radius: 7px; border: 1px solid transparent;
          font-size: 13px; font-weight: 600; color: #6b7280; background: transparent;
          cursor: pointer; transition: all 0.12s; white-space: nowrap;
        }
        .rp-tab:hover { background: #f9fafb; color: #111827; }
        .rp-tab--active { background: #111827; color: #fbbf24; border-color: #111827; }
        .rp-tabs-meta { margin-left: auto; display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
        .rp-meta-txt { font-size: 12px; color: #9ca3af; }
        .rp-page-size { display: flex; align-items: center; gap: 4px; font-size: 12px; color: #9ca3af; }
        .rp-size-btn {
          padding: 3px 9px; border-radius: 5px; border: 1px solid #e2e8f0;
          background: #fff; font-size: 12px; font-weight: 600; color: #6b7280; cursor: pointer; transition: all 0.1s;
        }
        .rp-size-btn:hover { border-color: #fbbf24; color: #111827; }
        .rp-size-btn--active { background: #111827; border-color: #111827; color: #fbbf24; }

        /* ── Card + Table ────────────────────────────── */
        .rp-card { background: #fff; border: 1px solid #e9ecef; border-radius: 12px; overflow: hidden; }
        .rp-table-wrap { overflow-x: auto; }
        .rp-table { width: 100%; border-collapse: collapse; font-size: 13px; }
        .rp-table thead tr { background: #111827; }
        .rp-table th {
          padding: 11px 16px; font-size: 11px; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.06em;
          color: #fbbf24; white-space: nowrap; text-align: left;
        }
        .rp-th-sort { cursor: pointer; user-select: none; }
        .rp-th-sort:hover { color: #fff; }
        .rp-sort-btn {
          background: none; border: none; cursor: pointer; color: inherit;
          display: inline-flex; align-items: center; margin-left: 4px; vertical-align: middle; padding: 0;
        }
        .rp-table td {
          padding: 13px 16px; border-bottom: 1px solid #f8fafc;
          vertical-align: middle; color: #374151;
        }
        .rp-table tbody tr:last-child td { border-bottom: none; }
        .rp-table tbody tr:hover td { background: #fffdf0; }
        .rp-td-num { color: #d1d5db; font-size: 12px; font-weight: 600; width: 36px; }
        .rp-tc { text-align: center; }

        /* Person */
        .rp-person { display: flex; align-items: center; gap: 10px; }
        .rp-avatar {
          width: 34px; height: 34px; border-radius: 8px;
          background: #111827; color: #fbbf24; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          font-size: 11.5px; font-weight: 700;
        }
        .rp-name { font-size: 13px; font-weight: 600; color: #111827; }
        .rp-email { font-size: 11.5px; color: #9ca3af; margin-top: 1px; }
        .rp-cell { font-size: 12.5px; color: #374151; }
        .rp-desig { font-style: italic; color: #6b7280; }
        .rp-na { color: #d1d5db; font-size: 18px; }
        .rp-qr {
          display: inline-flex; align-items: center; gap: 5px;
          font-size: 11.5px; font-family: monospace; color: #374151;
          background: #f1f5f9; padding: 3px 8px; border-radius: 4px;
          border: 1px solid #e2e8f0; font-weight: 600;
        }
        .rp-verifier {
          display: inline-flex; align-items: center; gap: 5px;
          font-size: 12px; color: #374151; font-weight: 500;
        }

        /* Badges */
        .rp-badge {
          display: inline-flex; align-items: center; gap: 4px;
          padding: 3px 10px; border-radius: 20px; font-size: 11.5px; font-weight: 700; white-space: nowrap;
        }
        .rp-badge--member    { background: #111827; color: #fbbf24; }
        .rp-badge--non       { background: #f1f5f9; color: #6b7280; border: 1px solid #e2e8f0; }
        .rp-badge--attended  { background: #fefce8; color: #854d0e; border: 1px solid #fde047; }
        .rp-badge--approved  { background: #f0fdf4; color: #166534; border: 1px solid #bbf7d0; }
        .rp-badge--pending   { background: #f8fafc; color: #9ca3af; border: 1px solid #e2e8f0; }

        /* Number chips */
        .rp-num-chip {
          display: inline-flex; align-items: center; justify-content: center;
          min-width: 32px; padding: 3px 10px; border-radius: 20px;
          font-size: 12.5px; font-weight: 700; background: #f1f5f9; color: #374151;
          border: 1px solid #e2e8f0;
        }
        .rp-num-chip--green { background: #f0fdf4; color: #166534; border-color: #bbf7d0; }
        .rp-num-chip--yellow { background: #fefce8; color: #854d0e; border-color: #fde047; }

        /* Company cell */
        .rp-company-cell { display: flex; align-items: center; gap: 10px; }
        .rp-company-dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: #fbbf24; flex-shrink: 0;
        }

        /* Attendance rate bar */
        .rp-rate-wrap { display: flex; align-items: center; gap: 10px; justify-content: center; }
        .rp-rate-bar {
          width: 80px; height: 6px; background: #f1f5f9; border-radius: 99px; overflow: hidden;
        }
        .rp-rate-fill { height: 100%; background: #fbbf24; border-radius: 99px; transition: width 0.3s; }
        .rp-rate-txt { font-size: 12px; font-weight: 700; color: #374151; min-width: 32px; }

        /* Pagination */
        .rp-pagination {
          display: flex; align-items: center; justify-content: space-between;
          padding: 12px 20px; border-top: 1px solid #f1f5f9; background: #fafafa; flex-wrap: wrap; gap: 10px;
        }
        .rp-pg-info { font-size: 12px; color: #9ca3af; }
        .rp-pg-btns { display: flex; align-items: center; gap: 4px; }
        .rp-pg-btn {
          display: inline-flex; align-items: center; gap: 4px;
          padding: 5px 12px; border-radius: 6px; border: 1px solid #e2e8f0;
          background: #fff; font-size: 12px; font-weight: 600; color: #374151;
          cursor: pointer; transition: all 0.1s; white-space: nowrap;
        }
        .rp-pg-btn:disabled { opacity: 0.35; cursor: not-allowed; }
        .rp-pg-btn:not(:disabled):hover { background: #fefce8; border-color: #fbbf24; color: #111827; }
        .rp-pg-pill {
          width: 30px; height: 30px; border-radius: 6px; border: 1px solid #e2e8f0;
          background: #fff; font-size: 12px; font-weight: 600; color: #374151;
          cursor: pointer; transition: all 0.1s; display: flex; align-items: center; justify-content: center;
        }
        .rp-pg-pill:hover { background: #fefce8; border-color: #fbbf24; }
        .rp-pg-pill--active { background: #111827; border-color: #111827; color: #fbbf24; }
        .rp-pg-ellipsis { width: 24px; text-align: center; font-size: 12px; color: #9ca3af; }

        /* Empty */
        .rp-empty {
          display: flex; flex-direction: column; align-items: center;
          padding: 52px 24px; gap: 8px; text-align: center; color: #d1d5db;
        }
        .rp-empty p { font-size: 13.5px; font-weight: 600; color: #374151; margin: 6px 0 0; }
        .rp-empty span { font-size: 12px; color: #9ca3af; }

        /* Responsive */
        @media (max-width: 1024px) { .rp-stats { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 640px) {
          .rp-stats { grid-template-columns: 1fr 1fr; }
          .rp-filters-row { flex-direction: column; align-items: stretch; }
          .rp-search-wrap { max-width: 100%; }
        }
      `}</style>
    </div>
  );
}
