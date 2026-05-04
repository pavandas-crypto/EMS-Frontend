import { useState } from "react";
import { useNavigate } from "react-router-dom";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function EyeIcon({ open }) {
  return open ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );
}

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm]       = useState({ email: "", password: "" });
  const [errors, setErrors]   = useState({});
  const [showPw, setShowPw]   = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiErr, setApiErr]   = useState("");

  const handle = e => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
    setErrors(p => ({ ...p, [name]: "" }));
    setApiErr("");
  };

  const validate = () => {
    const next = {};
    if (!form.email)                        next.email    = "Email is required.";
    else if (!emailRegex.test(form.email))  next.email    = "Enter a valid email address.";
    if (!form.password)                     next.password = "Password is required.";
    else if (form.password.length < 6)      next.password = "Password must be at least 6 characters.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setLoading(false);
    navigate("/admin/dashboard");
  };

  return (
    <div style={{
      minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center",
      fontFamily:"Inter,system-ui,sans-serif",
      background:"linear-gradient(135deg,#0f172a 0%,#1e1b4b 50%,#0f172a 100%)",
      padding:"2rem"
    }}>
      <div style={{ width:"100%", maxWidth:420 }}>
        <div style={{
          background:"rgba(255,255,255,0.04)", backdropFilter:"blur(24px)",
          border:"1px solid rgba(255,255,255,0.1)", borderRadius:24,
          padding:"2.5rem", boxShadow:"0 32px 80px rgba(0,0,0,0.4)"
        }}>
          {/* Brand mark (mobile) */}
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:"2rem" }}>
            <div style={{
              width:44, height:44, borderRadius:14,
              background:"linear-gradient(135deg,#6366f1,#4f46e5)",
              display:"flex", alignItems:"center", justifyContent:"center",
              color:"#fff", fontWeight:800, fontSize:18,
              boxShadow:"0 8px 24px rgba(99,102,241,0.4)"
            }}>E</div>
            <div>
              <div style={{ color:"#fff", fontWeight:700, fontSize:15 }}>EMS Admin</div>
              <div style={{ color:"rgba(255,255,255,0.4)", fontSize:12 }}>Event Management System</div>
            </div>
          </div>

          <h2 style={{ color:"#fff", fontWeight:800, fontSize:24, margin:"0 0 4px", letterSpacing:"-0.03em" }}>
            Welcome back
          </h2>
          <p style={{ color:"rgba(255,255,255,0.45)", fontSize:13, margin:"0 0 1.75rem" }}>
            Sign in to your admin account
          </p>

          {apiErr && (
            <div style={{
              background:"rgba(220,38,38,0.12)", border:"1px solid rgba(220,38,38,0.25)",
              color:"#fca5a5", borderRadius:10, padding:"10px 14px",
              fontSize:13, marginBottom:"1.25rem"
            }}>{apiErr}</div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {/* Email */}
            <div style={{ marginBottom:"1.1rem" }}>
              <label style={{ display:"block", fontSize:12, fontWeight:700, color:"rgba(255,255,255,0.55)", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:8 }}>
                Email address
              </label>
              <input
                id="admin-email" name="email" type="email"
                value={form.email} onChange={handle}
                placeholder="admin@example.com" autoComplete="email"
                style={{
                  width:"100%", padding:"12px 14px", boxSizing:"border-box",
                  background:"rgba(255,255,255,0.06)", border:`1px solid ${errors.email?"rgba(248,113,113,0.6)":"rgba(255,255,255,0.12)"}`,
                  borderRadius:12, color:"#fff", fontSize:14, outline:"none",
                  transition:"border-color 0.2s",
                }}
                onFocus={e=>{ e.target.style.borderColor="rgba(99,102,241,0.7)"; e.target.style.background="rgba(255,255,255,0.08)"; }}
                onBlur={e=>{  e.target.style.borderColor=errors.email?"rgba(248,113,113,0.6)":"rgba(255,255,255,0.12)"; e.target.style.background="rgba(255,255,255,0.06)"; }}
              />
              {errors.email && <div style={{ color:"#f87171", fontSize:12, marginTop:5 }}>{errors.email}</div>}
            </div>

            {/* Password */}
            <div style={{ marginBottom:"1.5rem" }}>
              <label style={{ display:"block", fontSize:12, fontWeight:700, color:"rgba(255,255,255,0.55)", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:8 }}>
                Password
              </label>
              <div style={{ position:"relative" }}>
                <input
                  id="admin-password" name="password" type={showPw?"text":"password"}
                  value={form.password} onChange={handle}
                  placeholder="••••••••" autoComplete="current-password"
                  style={{
                    width:"100%", padding:"12px 42px 12px 14px", boxSizing:"border-box",
                    background:"rgba(255,255,255,0.06)", border:`1px solid ${errors.password?"rgba(248,113,113,0.6)":"rgba(255,255,255,0.12)"}`,
                    borderRadius:12, color:"#fff", fontSize:14, outline:"none",
                    transition:"border-color 0.2s",
                  }}
                  onFocus={e=>{ e.target.style.borderColor="rgba(99,102,241,0.7)"; e.target.style.background="rgba(255,255,255,0.08)"; }}
                  onBlur={e=>{  e.target.style.borderColor=errors.password?"rgba(248,113,113,0.6)":"rgba(255,255,255,0.12)"; e.target.style.background="rgba(255,255,255,0.06)"; }}
                />
                <button type="button" onClick={()=>setShowPw(p=>!p)} style={{
                  position:"absolute", right:12, top:"50%", transform:"translateY(-50%)",
                  background:"none", border:"none", color:"rgba(255,255,255,0.4)",
                  cursor:"pointer", display:"flex", alignItems:"center", padding:0
                }}>
                  <EyeIcon open={showPw}/>
                </button>
              </div>
              {errors.password && <div style={{ color:"#f87171", fontSize:12, marginTop:5 }}>{errors.password}</div>}
            </div>

            <button type="submit" disabled={loading} style={{
              width:"100%", padding:"13px", borderRadius:12, border:"none",
              background: loading
                ? "rgba(99,102,241,0.5)"
                : "linear-gradient(135deg,#6366f1,#4f46e5)",
              color:"#fff", fontWeight:700, fontSize:15, cursor: loading?"not-allowed":"pointer",
              boxShadow:"0 8px 24px rgba(99,102,241,0.35)",
              transition:"all 0.2s", letterSpacing:"-0.01em"
            }}>
              {loading ? "Signing in…" : "Sign in to Admin"}
            </button>
          </form>

          <div style={{ marginTop:"1.5rem", textAlign:"center" }}>
            <a href="/verifier" style={{
              color:"rgba(255,255,255,0.35)", fontSize:12,
              textDecoration:"none", transition:"color 0.2s"
            }}
              onMouseEnter={e=>e.target.style.color="rgba(255,255,255,0.7)"}
              onMouseLeave={e=>e.target.style.color="rgba(255,255,255,0.35)"}
            >
              Are you a verifier? Sign in here →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
