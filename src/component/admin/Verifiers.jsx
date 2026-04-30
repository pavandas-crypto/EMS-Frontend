import { useState, useRef, useEffect } from "react";

const ALL_EVENTS = [
  "Leadership Summit",
  "Developer Hackathon",
  "Community Training",
  "Volunteer Orientation",
  "Tech Conference",
  "Networking Breakfast",
  "Spring Conference",
  "Charity Gala",
  "Marketing Workshop",
];

const initialVerifiers = [
  { id: 1, name: "Ritu Singh",   username: "ritu.singh",   email: "ritu.singh@ems.com",   password: "Pass@123", events: ["Leadership Summit", "Tech Conference"] },
  { id: 2, name: "Deepak Joshi", username: "deepak.joshi", email: "deepak.joshi@ems.com", password: "Joshi@456", events: ["Developer Hackathon", "Spring Conference"] },
  { id: 3, name: "Smita Das",    username: "smita.das",    email: "smita.das@ems.com",    password: "Smita@789", events: ["Charity Gala"] },
];

const EMPTY_FORM = { name: "", username: "", email: "", password: "", events: [] };

function getInitials(name) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

/* ── Icons ───────────────────────────────────────────────────────────────── */
const Icon = {
  Shield: ({ s = 18 }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  ),
  Plus: ({ s = 14 }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  ),
  Edit: ({ s = 14 }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  ),
  Trash: ({ s = 14 }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
      <path d="M10 11v6"/><path d="M14 11v6"/>
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
    </svg>
  ),
  Eye: ({ s = 14 }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  ),
  EyeOff: ({ s = 14 }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  ),
  X: ({ s = 13 }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
  Check: ({ s = 13 }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  Calendar: ({ s = 11 }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  ),
  User: ({ s = 14 }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  ChevronDown: ({ s = 13 }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  ),
  Empty: () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  ),
};

/* ── Event combobox multi-select ─────────────────────────────────────────── */
function EventMultiSelect({ selected, onChange, error }) {
  const [open, setOpen]       = useState(false);
  const [query, setQuery]     = useState("");
  const ref                   = useRef(null);
  const inputRef              = useRef(null);

  useEffect(() => {
    const fn = (e) => { if (ref.current && !ref.current.contains(e.target)) { setOpen(false); setQuery(""); } };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  const filtered = query.trim()
    ? ALL_EVENTS.filter((e) => e.toLowerCase().includes(query.trim().toLowerCase()))
    : ALL_EVENTS;

  const toggle = (ev) => {
    onChange(selected.includes(ev) ? selected.filter((e) => e !== ev) : [...selected, ev]);
    setQuery("");
    inputRef.current?.focus();
  };

  return (
    <div className="vf-combo-wrap" ref={ref}>
      <div className={`vf-combo-field${error ? " vf-input--err" : ""}${open ? " vf-combo-field--open" : ""}`}>
        {/* Selected chips */}
        {selected.map((ev) => (
          <span key={ev} className="vf-chip">
            {ev}
            <button type="button" className="vf-chip-remove"
              onClick={(e) => { e.stopPropagation(); toggle(ev); }}>
              <Icon.X s={10}/>
            </button>
          </span>
        ))}

        {/* Inline type-to-search input */}
        <input
          ref={inputRef}
          className="vf-combo-input"
          placeholder={selected.length === 0 ? "Type or select events…" : "Add more…"}
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
        />

        {/* Dropdown arrow */}
        <button type="button" className="vf-combo-arrow"
          onClick={() => { setOpen((o) => !o); inputRef.current?.focus(); }}>
          <Icon.ChevronDown s={12}/>
        </button>
      </div>

      {open && (
        <ul className="vf-multi-dropdown">
          {filtered.length === 0 ? (
            <li className="vf-multi-option vf-multi-option--empty">No matching events</li>
          ) : (
            filtered.map((ev) => (
              <li
                key={ev}
                className={`vf-multi-option${selected.includes(ev) ? " vf-multi-option--checked" : ""}`}
                onMouseDown={(e) => { e.preventDefault(); toggle(ev); }}
              >
                <span className="vf-checkbox">{selected.includes(ev) && <Icon.Check s={11}/>}</span>
                <Icon.Calendar s={11}/>
                {ev}
                {selected.includes(ev) && <span className="vf-option-tick">✓</span>}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}

/* ── Component ───────────────────────────────────────────────────────────── */
function Verifiers() {
  const [verifiers, setVerifiers]     = useState(initialVerifiers);
  const [showForm, setShowForm]       = useState(false);
  const [editingId, setEditingId]     = useState(null);
  const [form, setForm]               = useState(EMPTY_FORM);
  const [errors, setErrors]           = useState({});
  const [showPass, setShowPass]       = useState(false);
  const [toast, setToast]             = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const openAdd = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setErrors({});
    setShowPass(false);
    setShowForm(true);
  };

  const openEdit = (v) => {
    setEditingId(v.id);
    setForm({ name: v.name, username: v.username, email: v.email, password: v.password, events: [...v.events] });
    setErrors({});
    setShowPass(false);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancel = () => { setShowForm(false); setEditingId(null); setErrors({}); };

  const validate = () => {
    const e = {};
    if (!form.name.trim())     e.name     = "Name is required.";
    if (!form.username.trim()) e.username = "Username is required.";
    else if (/\s/.test(form.username)) e.username = "Username must not contain spaces.";
    if (!form.email.trim())    e.email    = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email.";
    if (!editingId && !form.password.trim()) e.password = "Password is required.";
    else if (form.password && form.password.length < 6) e.password = "Minimum 6 characters.";
    if (form.events.length === 0) e.events = "Assign at least one event.";
    return e;
  };

  const handleSave = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    if (editingId) {
      setVerifiers((prev) =>
        prev.map((v) =>
          v.id === editingId
            ? { ...v, name: form.name, username: form.username, email: form.email,
                password: form.password || v.password, events: form.events }
            : v
        )
      );
      showToast("Verifier updated successfully.");
    } else {
      const dup = verifiers.find((v) => v.username === form.username.trim());
      if (dup) { setErrors({ username: "Username already exists." }); return; }
      setVerifiers((prev) => [
        ...prev,
        { id: Date.now(), name: form.name, username: form.username,
          email: form.email, password: form.password, events: form.events },
      ]);
      showToast("Verifier created successfully.");
    }
    cancel();
  };

  const handleDelete = (id) => {
    setVerifiers((prev) => prev.filter((v) => v.id !== id));
    setDeleteConfirm(null);
    showToast("Verifier removed.", "error");
  };

  const field = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: "" }));
  };

  return (
    <div className="vf-root">

      {/* ── Toast ─────────────────────────────────────────── */}
      {toast && (
        <div className={`vf-toast vf-toast--${toast.type}`}>
          {toast.type === "success" ? <Icon.Check s={14}/> : <Icon.X s={14}/>}
          {toast.msg}
        </div>
      )}

      {/* ── Page header ───────────────────────────────────── */}
      <div className="vf-header">
        <div className="vf-header-left">
          <div className="vf-header-icon"><Icon.Shield s={18}/></div>
          <div>
            <h1 className="vf-title">Verifiers</h1>
            <p className="vf-subtitle">Create and manage event verifier accounts</p>
          </div>
        </div>
        {!showForm && (
          <button className="vf-btn-add" onClick={openAdd}>
            <Icon.Plus s={13}/> Add Verifier
          </button>
        )}
      </div>

      {/* ── Add / Edit form ───────────────────────────────── */}
      {showForm && (
        <div className="vf-form-card">
          <div className="vf-form-head">
            <div className="vf-form-title">
              <Icon.Shield s={14}/>
              {editingId ? "Edit Verifier" : "Create New Verifier"}
            </div>
            <button className="vf-icon-btn" onClick={cancel} title="Close"><Icon.X s={14}/></button>
          </div>

          <form onSubmit={handleSave} className="vf-form-body">
            <div className="vf-form-grid">

              {/* Name */}
              <div className="vf-field">
                <label className="vf-label">Full Name <span className="vf-req">*</span></label>
                <div className="vf-input-wrap">
                  <span className="vf-input-icon"><Icon.User s={13}/></span>
                  <input
                    className={`vf-input${errors.name ? " vf-input--err" : ""}`}
                    placeholder="e.g. Ritu Singh"
                    value={form.name}
                    onChange={(e) => field("name", e.target.value)}
                  />
                </div>
                {errors.name && <span className="vf-err">{errors.name}</span>}
              </div>

              {/* Username */}
              <div className="vf-field">
                <label className="vf-label">Username <span className="vf-req">*</span></label>
                <div className="vf-input-wrap">
                  <span className="vf-input-icon vf-input-prefix">@</span>
                  <input
                    className={`vf-input${errors.username ? " vf-input--err" : ""}`}
                    placeholder="e.g. ritu.singh"
                    value={form.username}
                    onChange={(e) => field("username", e.target.value.replace(/\s/g, ""))}
                  />
                </div>
                {errors.username && <span className="vf-err">{errors.username}</span>}
              </div>

              {/* Email */}
              <div className="vf-field">
                <label className="vf-label">Email Address <span className="vf-req">*</span></label>
                <div className="vf-input-wrap">
                  <input
                    className={`vf-input${errors.email ? " vf-input--err" : ""}`}
                    type="email"
                    placeholder="verifier@example.com"
                    value={form.email}
                    onChange={(e) => field("email", e.target.value)}
                  />
                </div>
                {errors.email && <span className="vf-err">{errors.email}</span>}
              </div>

              {/* Password */}
              <div className="vf-field">
                <label className="vf-label">
                  Password {!editingId && <span className="vf-req">*</span>}
                  {editingId && <span className="vf-hint-inline">Leave blank to keep existing</span>}
                </label>
                <div className="vf-input-wrap">
                  <input
                    className={`vf-input${errors.password ? " vf-input--err" : ""}`}
                    type={showPass ? "text" : "password"}
                    placeholder={editingId ? "Enter new password to change" : "Min. 6 characters"}
                    value={form.password}
                    onChange={(e) => field("password", e.target.value)}
                  />
                  <button type="button" className="vf-pass-toggle" onClick={() => setShowPass((s) => !s)}>
                    {showPass ? <Icon.EyeOff s={14}/> : <Icon.Eye s={14}/>}
                  </button>
                </div>
                {errors.password && <span className="vf-err">{errors.password}</span>}
              </div>

            </div>

            {/* Events */}
            <div className="vf-field vf-field--full">
              <label className="vf-label">
                Assigned Events <span className="vf-req">*</span>
                {form.events.length > 0 && (
                  <span className="vf-hint-inline">{form.events.length} selected</span>
                )}
              </label>
              <EventMultiSelect
                selected={form.events}
                onChange={(evs) => field("events", evs)}
                error={!!errors.events}
              />
              {errors.events && <span className="vf-err">{errors.events}</span>}
            </div>

            <div className="vf-form-actions">
              <button type="button" className="vf-btn-cancel" onClick={cancel}>Cancel</button>
              <button type="submit" className="vf-btn-save">
                {editingId ? "Save Changes" : "Create Verifier"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── Verifiers list ────────────────────────────────── */}
      <div className="vf-section-head">
        <div className="vf-section-title">
          <Icon.Shield s={14}/>
          All Verifiers
          <span className="vf-count">{verifiers.length}</span>
        </div>
      </div>

      {verifiers.length === 0 ? (
        <div className="vf-card">
          <div className="vf-empty">
            <Icon.Empty/>
            <p>No verifiers yet</p>
            <span>Click "Add Verifier" to create the first one</span>
          </div>
        </div>
      ) : (
        <div className="vf-grid">
          {verifiers.map((v) => (
            <div key={v.id} className="vf-vcard">
              {/* Card top */}
              <div className="vf-vcard-top">
                <div className="vf-vcard-avatar">{getInitials(v.name)}</div>
                <div className="vf-vcard-identity">
                  <div className="vf-vcard-name">{v.name}</div>
                  <div className="vf-vcard-username"><span className="vf-at">@</span>{v.username}</div>
                </div>
                <div className="vf-vcard-actions">
                  <button className="vf-icon-action" onClick={() => openEdit(v)} title="Edit verifier">
                    <Icon.Edit s={14}/>
                  </button>
                  <button className="vf-icon-action vf-icon-action--danger" onClick={() => setDeleteConfirm(v.id)} title="Delete verifier">
                    <Icon.Trash s={14}/>
                  </button>
                </div>
              </div>

              {/* Divider */}
              <div className="vf-vcard-divider"/>

              {/* Email row */}
              <div className="vf-vcard-row">
                <span className="vf-vcard-lbl">Email</span>
                <span className="vf-vcard-val">{v.email}</span>
              </div>

              {/* Events */}
              <div className="vf-vcard-row vf-vcard-row--top">
                <span className="vf-vcard-lbl">Events</span>
                <div className="vf-vcard-events">
                  {v.events.map((ev) => (
                    <span key={ev} className="vf-event-chip">
                      <Icon.Calendar s={10}/>{ev}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Delete confirm overlay ────────────────────────── */}
      {deleteConfirm && (
        <div className="vf-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="vf-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="vf-dialog-icon"><Icon.Trash s={20}/></div>
            <h3 className="vf-dialog-title">Remove Verifier?</h3>
            <p className="vf-dialog-body">
              This will permanently remove <strong>{verifiers.find((v) => v.id === deleteConfirm)?.name}</strong> and all their event assignments.
            </p>
            <div className="vf-dialog-actions">
              <button className="vf-btn-cancel" onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button className="vf-btn-delete" onClick={() => handleDelete(deleteConfirm)}>Yes, Remove</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .vf-root { padding-bottom: 48px; font-family: inherit; position: relative; }

        /* Toast */
        .vf-toast {
          position: fixed; top: 20px; right: 24px; z-index: 999;
          display: flex; align-items: center; gap: 8px;
          padding: 10px 16px; border-radius: 8px;
          font-size: 13px; font-weight: 600;
          box-shadow: 0 4px 16px rgba(0,0,0,0.12);
          animation: vf-slide-in 0.2s ease;
        }
        .vf-toast--success { background: #0f172a; color: #fff; }
        .vf-toast--error   { background: #dc2626; color: #fff; }
        @keyframes vf-slide-in { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:translateY(0); } }

        /* Header */
        .vf-header {
          display: flex; align-items: center; justify-content: space-between;
          gap: 16px; margin-bottom: 20px; flex-wrap: wrap;
        }
        .vf-header-left { display: flex; align-items: center; gap: 14px; }
        .vf-header-icon {
          width: 42px; height: 42px; border-radius: 10px;
          background: #f1f5f9; border: 1px solid #e2e8f0;
          display: flex; align-items: center; justify-content: center;
          color: #374151; flex-shrink: 0;
        }
        .vf-title { font-size: 20px; font-weight: 700; color: #0f172a; margin: 0 0 3px; letter-spacing: -0.025em; }
        .vf-subtitle { font-size: 13px; color: #94a3b8; margin: 0; }
        .vf-btn-add {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 8px 16px; background: #0f172a; color: #fff;
          border: none; border-radius: 8px; font-size: 13px; font-weight: 600;
          cursor: pointer; transition: background 0.12s;
        }
        .vf-btn-add:hover { background: #1e293b; }

        /* Form card */
        .vf-form-card {
          background: #fff; border: 1px solid #e2e8f0; border-radius: 12px;
          margin-bottom: 20px; overflow: hidden;
        }
        .vf-form-head {
          display: flex; align-items: center; justify-content: space-between;
          padding: 14px 20px; border-bottom: 1px solid #f1f5f9; background: #fafafa;
        }
        .vf-form-title {
          display: flex; align-items: center; gap: 8px;
          font-size: 13.5px; font-weight: 700; color: #0f172a;
        }
        .vf-icon-btn {
          width: 28px; height: 28px; border-radius: 6px;
          background: transparent; border: 1px solid #e2e8f0;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; color: #64748b; transition: all 0.1s;
        }
        .vf-icon-btn:hover { background: #f1f5f9; color: #0f172a; }
        .vf-form-body { padding: 20px; }
        .vf-form-grid {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 16px; margin-bottom: 16px;
        }

        /* Fields */
        .vf-field { display: flex; flex-direction: column; gap: 6px; }
        .vf-field--full { grid-column: 1 / -1; }
        .vf-label {
          font-size: 12.5px; font-weight: 600; color: #374151;
          display: flex; align-items: center; gap: 6px;
        }
        .vf-req { color: #dc2626; }
        .vf-hint-inline { font-size: 11px; font-weight: 500; color: #94a3b8; margin-left: 2px; }
        .vf-input-wrap { position: relative; display: flex; align-items: center; }
        .vf-input-icon {
          position: absolute; left: 10px; color: #94a3b8;
          display: flex; align-items: center; pointer-events: none;
        }
        .vf-input-prefix {
          font-size: 13px; font-weight: 600; color: #94a3b8;
          position: absolute; left: 10px; pointer-events: none;
        }
        .vf-input {
          width: 100%; padding: 8px 36px 8px 32px;
          border: 1px solid #e2e8f0; border-radius: 7px;
          background: #f8fafc; font-size: 13px; color: #0f172a; outline: none;
          transition: border-color 0.12s, background 0.12s;
        }
        .vf-input:not(:has(~ .vf-pass-toggle)) { padding-right: 12px; }
        .vf-input:focus { border-color: #94a3b8; background: #fff; }
        .vf-input--err { border-color: #ef4444 !important; }
        .vf-pass-toggle {
          position: absolute; right: 10px; background: none; border: none;
          cursor: pointer; color: #94a3b8; display: flex; align-items: center;
        }
        .vf-pass-toggle:hover { color: #475569; }
        .vf-err { font-size: 11.5px; color: #dc2626; }

        /* Event combobox */
        .vf-combo-wrap { position: relative; }
        .vf-combo-field {
          display: flex; align-items: center; flex-wrap: wrap; gap: 6px;
          min-height: 42px; padding: 6px 36px 6px 10px; position: relative;
          border: 1px solid #e2e8f0; border-radius: 7px;
          background: #f8fafc; cursor: text;
          transition: border-color 0.12s, background 0.12s;
        }
        .vf-combo-field:focus-within, .vf-combo-field--open { border-color: #94a3b8; background: #fff; }
        .vf-combo-field.vf-input--err { border-color: #ef4444; }
        .vf-combo-input {
          flex: 1; min-width: 120px; border: none; outline: none;
          background: transparent; font-size: 13px; color: #0f172a;
          padding: 2px 0;
        }
        .vf-combo-input::placeholder { color: #94a3b8; }
        .vf-combo-arrow {
          position: absolute; right: 8px; top: 50%; transform: translateY(-50%);
          background: none; border: none; cursor: pointer;
          color: #94a3b8; display: flex; align-items: center; padding: 2px;
        }
        .vf-combo-arrow:hover { color: #475569; }
        .vf-chip {
          display: inline-flex; align-items: center; gap: 4px;
          padding: 3px 6px 3px 8px; background: #1e293b; color: #fff;
          border-radius: 5px; font-size: 11.5px; font-weight: 600; white-space: nowrap;
        }
        .vf-chip-remove {
          background: none; border: none; cursor: pointer; color: rgba(255,255,255,0.55);
          display: flex; align-items: center; padding: 0; line-height: 1; margin-left: 2px;
        }
        .vf-chip-remove:hover { color: #fff; }
        .vf-multi-dropdown {
          position: absolute; top: calc(100% + 4px); left: 0; right: 0;
          background: #fff; border: 1px solid #e2e8f0; border-radius: 8px;
          box-shadow: 0 8px 24px rgba(15,23,42,0.10); z-index: 100;
          list-style: none; margin: 0; padding: 4px 0;
          max-height: 220px; overflow-y: auto;
        }
        .vf-multi-option {
          display: flex; align-items: center; gap: 8px;
          padding: 8px 14px; font-size: 12.5px; color: #374151;
          cursor: pointer; transition: background 0.08s; position: relative;
        }
        .vf-multi-option:hover { background: #f8fafc; }
        .vf-multi-option--checked { background: #f1f5f9; color: #0f172a; font-weight: 600; }
        .vf-multi-option--empty { color: #94a3b8; font-style: italic; cursor: default; }
        .vf-multi-option--empty:hover { background: transparent; }
        .vf-checkbox {
          width: 16px; height: 16px; border-radius: 4px; flex-shrink: 0;
          border: 1.5px solid #cbd5e1; background: #fff;
          display: flex; align-items: center; justify-content: center;
        }
        .vf-multi-option--checked .vf-checkbox { background: #0f172a; border-color: #0f172a; color: #fff; }
        .vf-option-tick { margin-left: auto; color: #0f172a; font-size: 11px; }

        /* Form actions */
        .vf-form-actions {
          display: flex; align-items: center; justify-content: flex-end;
          gap: 8px; padding-top: 16px; border-top: 1px solid #f1f5f9; margin-top: 16px;
        }
        .vf-btn-cancel {
          padding: 8px 16px; border-radius: 7px; border: 1px solid #e2e8f0;
          background: #fff; font-size: 13px; font-weight: 600; color: #475569; cursor: pointer;
          transition: all 0.1s;
        }
        .vf-btn-cancel:hover { background: #f8fafc; border-color: #cbd5e1; }
        .vf-btn-save {
          padding: 8px 18px; border-radius: 7px; border: none;
          background: #0f172a; color: #fff;
          font-size: 13px; font-weight: 600; cursor: pointer; transition: background 0.12s;
        }
        .vf-btn-save:hover { background: #1e293b; }

        .vf-count {
          display: inline-flex; align-items: center; justify-content: center;
          min-width: 20px; height: 20px; padding: 0 6px;
          background: #0f172a; color: #fff;
          font-size: 11px; font-weight: 700; border-radius: 10px;
        }

        /* Section header */
        .vf-section-head {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 14px;
        }
        .vf-section-title {
          display: flex; align-items: center; gap: 8px;
          font-size: 13.5px; font-weight: 700; color: #0f172a;
        }

        /* Card grid */
        .vf-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 16px;
        }
        .vf-vcard {
          background: #fff; border: 1px solid #e9ecef; border-radius: 12px;
          padding: 18px; display: flex; flex-direction: column; gap: 12px;
          transition: box-shadow 0.15s;
        }
        .vf-vcard:hover { box-shadow: 0 4px 20px rgba(15,23,42,0.08); }

        /* Card top row */
        .vf-vcard-top { display: flex; align-items: center; gap: 12px; }
        .vf-vcard-avatar {
          width: 42px; height: 42px; border-radius: 10px; flex-shrink: 0;
          background: #1e293b; color: #fff;
          display: flex; align-items: center; justify-content: center;
          font-size: 13px; font-weight: 700; letter-spacing: 0.02em;
        }
        .vf-vcard-identity { flex: 1; min-width: 0; }
        .vf-vcard-name { font-size: 14px; font-weight: 700; color: #0f172a; }
        .vf-vcard-username {
          font-size: 12px; color: #94a3b8; margin-top: 2px;
          font-family: monospace;
        }
        .vf-at { color: #cbd5e1; }
        .vf-vcard-actions { display: flex; gap: 6px; flex-shrink: 0; }
        .vf-icon-action {
          width: 30px; height: 30px; border-radius: 7px;
          border: 1px solid #e2e8f0; background: #fff;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; color: #64748b; transition: all 0.1s;
        }
        .vf-icon-action:hover { background: #f1f5f9; border-color: #cbd5e1; color: #0f172a; }
        .vf-icon-action--danger:hover { background: #fff1f2; border-color: #fca5a5; color: #dc2626; }

        .vf-vcard-divider { height: 1px; background: #f1f5f9; }

        /* Info rows */
        .vf-vcard-row {
          display: flex; align-items: flex-start; gap: 10px;
        }
        .vf-vcard-row--top { align-items: flex-start; }
        .vf-vcard-lbl {
          font-size: 11px; font-weight: 700; text-transform: uppercase;
          letter-spacing: 0.06em; color: #94a3b8; flex-shrink: 0; width: 48px;
          padding-top: 1px;
        }
        .vf-vcard-val { font-size: 12.5px; color: #374151; word-break: break-all; }
        .vf-vcard-events { display: flex; flex-wrap: wrap; gap: 5px; }

        .vf-event-chip {
          display: inline-flex; align-items: center; gap: 4px;
          padding: 3px 8px; border-radius: 4px;
          background: #f1f5f9; color: #475569;
          font-size: 11px; font-weight: 500; white-space: nowrap;
          border: 1px solid #e2e8f0;
        }

        /* Fallback card for empty */
        .vf-card {
          background: #fff; border: 1px solid #e9ecef; border-radius: 12px; overflow: hidden;
        }

        /* Empty */
        .vf-empty {
          display: flex; flex-direction: column; align-items: center;
          padding: 56px 24px; gap: 8px; text-align: center;
        }
        .vf-empty p { font-size: 13.5px; font-weight: 600; color: #374151; margin: 4px 0 0; }
        .vf-empty span { font-size: 12px; color: #9ca3af; }

        /* Delete dialog */
        .vf-overlay {
          position: fixed; inset: 0; background: rgba(15,23,42,0.4);
          display: flex; align-items: center; justify-content: center;
          z-index: 200; backdrop-filter: blur(2px);
        }
        .vf-dialog {
          background: #fff; border-radius: 14px; padding: 28px 28px 24px;
          max-width: 380px; width: 90%; text-align: center;
          box-shadow: 0 20px 60px rgba(15,23,42,0.18);
        }
        .vf-dialog-icon {
          width: 48px; height: 48px; border-radius: 12px;
          background: #fff1f2; border: 1px solid #fca5a5;
          color: #dc2626; display: flex; align-items: center; justify-content: center;
          margin: 0 auto 16px;
        }
        .vf-dialog-title { font-size: 16px; font-weight: 700; color: #0f172a; margin: 0 0 8px; }
        .vf-dialog-body { font-size: 13px; color: #64748b; margin: 0 0 20px; line-height: 1.6; }
        .vf-dialog-actions { display: flex; gap: 8px; justify-content: center; }
        .vf-btn-delete {
          padding: 8px 18px; border-radius: 7px; border: none;
          background: #dc2626; color: #fff;
          font-size: 13px; font-weight: 600; cursor: pointer; transition: background 0.12s;
        }
        .vf-btn-delete:hover { background: #b91c1c; }

        /* Responsive */
        @media (max-width: 768px) {
          .vf-form-grid { grid-template-columns: 1fr; }
          .vf-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}

export default Verifiers;
