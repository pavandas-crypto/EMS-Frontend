import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const usernameRegex = /^[a-zA-Z0-9_-]{3,}$/;

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
  const [isVerifier, setIsVerifier] = useState(true);

  const handle = e => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
    setErrors(p => ({ ...p, [name]: "" }));
    setApiErr("");
  };

  const validate = () => {
    const next = {};
    if (!form.email) {
      next.email = "Username or email is required.";
    } else if (!emailRegex.test(form.email) && !usernameRegex.test(form.email)) {
      next.email = "Enter a valid email address or username (3+ characters).";
    }
    if (!form.password)                     next.password = "Password is required.";
    else if (form.password.length < 6)      next.password = "Password must be at least 6 characters.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setApiErr("");

    try {
      const data = await api.login({
        email: form.email,
        password: form.password
      });

      if (data.success) {
        // Store token and user data in localStorage
        localStorage.setItem("token", data.data.token);
        localStorage.setItem("user", JSON.stringify(data.data.user));
        localStorage.setItem("userRole", isVerifier ? "verifier" : "admin");
        
        // Create session cookie
        const expiryDate = new Date();
        expiryDate.setTime(expiryDate.getTime() + (24 * 60 * 60 * 1000)); // 24 hours
        const expires = "expires=" + expiryDate.toUTCString();
        document.cookie = `emsSession=${data.data.token}; ${expires}; path=/`;
        document.cookie = `emsUserRole=${isVerifier ? "verifier" : "admin"}; ${expires}; path=/`;
        
        navigate(isVerifier ? "/verifier" : "/admin/dashboard");
      }
    } catch (error) {
      setApiErr(error.message || "Invalid username/email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center",
      fontFamily:"Inter,system-ui,sans-serif",
      background:"linear-gradient(135deg,#f5f7fa 0%,#f0f2f5 50%,#ebeef3 100%)",
      padding:"2rem"
    }}>
      <div style={{ width:"100%", maxWidth:420 }}>
        <div style={{
          background:"#fff",
          border:"1px solid rgba(0,0,0,0.08)", borderRadius:16,
          padding:"3rem 2.5rem", boxShadow:"0 8px 32px rgba(0,0,0,0.08)",
          backdropFilter:"blur(10px)"
        }}>
          {/* Brand mark */}
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:"2.5rem" }}>
            <div style={{
              width:48, height:48, borderRadius:12,
              background: isVerifier
                ? "linear-gradient(135deg,#10b981,#059669)"
                : "linear-gradient(135deg,#3b82f6,#2563eb)",
              display:"flex", alignItems:"center", justifyContent:"center",
              color:"#fff", fontWeight:700, fontSize:22,
              boxShadow: isVerifier
                ? "0 4px 16px rgba(16,185,129,0.3)"
                : "0 4px 16px rgba(59,130,246,0.3)",
              transition:"all 0.3s"
            }}>E</div>
            <div>
              <div style={{ color:"#1a202c", fontWeight:700, fontSize:16, letterSpacing:"-0.01em" }}>EMS</div>
              <div style={{ color:"#718096", fontSize:12, fontWeight:500 }}>Event Management</div>
            </div>
          </div>

          <h2 style={{ color:"#1a202c", fontWeight:700, fontSize:28, margin:"0 0 8px", letterSpacing:"-0.02em" }}>
            Welcome back
          </h2>
          <p style={{ color:"#718096", fontSize:14, margin:"0 0 2rem", fontWeight:500 }}>
            Sign in to your {isVerifier ? "verifier" : "admin"} account
          </p>

          {apiErr && (
            <div style={{
              background:"#fef2f2", border:"1px solid #fecaca",
              color:"#991b1b", borderRadius:10, padding:"12px 14px",
              fontSize:13, marginBottom:"1.5rem", fontWeight:500
            }}>{apiErr}</div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {/* Email or Username */}
            <div style={{ marginBottom:"1.25rem" }}>
              <label style={{ display:"block", fontSize:12, fontWeight:600, color:"#4a5568", textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:8 }}>
                Username or Email
              </label>
              <input
                id="user-input" name="email" type="text"
                value={form.email} onChange={handle}
                placeholder="Enter username or email" autoComplete="username"
                style={{
                  width:"100%", padding:"11px 14px", boxSizing:"border-box",
                  background:"#f7fafc", border:`1px solid ${errors.email?"#f87171":"#e2e8f0"}`,
                  borderRadius:10, color:"#1a202c", fontSize:14, outline:"none",
                  transition:"all 0.2s", fontFamily:"inherit"
                }}
                onFocus={e=>{ 
                  e.target.style.borderColor=isVerifier?"#10b981":"#3b82f6"; 
                  e.target.style.background="#fff";
                  e.target.style.boxShadow=`0 0 0 3px ${isVerifier?"rgba(16,185,129,0.1)":"rgba(59,130,246,0.1)"}`; 
                }}
                onBlur={e=>{ 
                  e.target.style.borderColor=errors.email?"#f87171":"#e2e8f0"; 
                  e.target.style.background="#f7fafc";
                  e.target.style.boxShadow="none"; 
                }}
              />
              {errors.email && <div style={{ color:"#dc2626", fontSize:12, marginTop:6, fontWeight:500 }}>{errors.email}</div>}
            </div>

            {/* Password */}
            <div style={{ marginBottom:"1.75rem" }}>
              <label style={{ display:"block", fontSize:12, fontWeight:600, color:"#4a5568", textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:8 }}>
                Password
              </label>
              <div style={{ position:"relative" }}>
                <input
                  id="user-password" name="password" type={showPw?"text":"password"}
                  value={form.password} onChange={handle}
                  placeholder="Enter your password" autoComplete="current-password"
                  style={{
                    width:"100%", padding:"11px 42px 11px 14px", boxSizing:"border-box",
                    background:"#f7fafc", border:`1px solid ${errors.password?"#f87171":"#e2e8f0"}`,
                    borderRadius:10, color:"#1a202c", fontSize:14, outline:"none",
                    transition:"all 0.2s", fontFamily:"inherit"
                  }}
                  onFocus={e=>{ 
                    e.target.style.borderColor=isVerifier?"#10b981":"#3b82f6"; 
                    e.target.style.background="#fff";
                    e.target.style.boxShadow=`0 0 0 3px ${isVerifier?"rgba(16,185,129,0.1)":"rgba(59,130,246,0.1)"}`; 
                  }}
                  onBlur={e=>{ 
                    e.target.style.borderColor=errors.password?"#f87171":"#e2e8f0"; 
                    e.target.style.background="#f7fafc";
                    e.target.style.boxShadow="none"; 
                  }}
                />
                <button type="button" onClick={()=>setShowPw(p=>!p)} style={{
                  position:"absolute", right:14, top:"50%", transform:"translateY(-50%)",
                  background:"none", border:"none", color:"#a0aec0",
                  cursor:"pointer", display:"flex", alignItems:"center", padding:0,
                  transition:"color 0.2s"
                }}
                onMouseEnter={e=>e.target.style.color="#718096"}
                onMouseLeave={e=>e.target.style.color="#a0aec0"}
                >
                  <EyeIcon open={showPw}/>
                </button>
              </div>
              {errors.password && <div style={{ color:"#dc2626", fontSize:12, marginTop:6, fontWeight:500 }}>{errors.password}</div>}
            </div>

            <button type="submit" disabled={loading} style={{
              width:"100%", padding:"12px", borderRadius:10, border:"none",
              background: loading
                ? isVerifier
                  ? "rgba(16,185,129,0.6)"
                  : "rgba(59,130,246,0.6)"
                : isVerifier
                  ? "linear-gradient(135deg,#10b981,#059669)"
                  : "linear-gradient(135deg,#3b82f6,#2563eb)",
              color:"#fff", fontWeight:600, fontSize:15, cursor: loading?"not-allowed":"pointer",
              boxShadow: isVerifier
                ? "0 4px 12px rgba(16,185,129,0.3)"
                : "0 4px 12px rgba(59,130,246,0.3)",
              transition:"all 0.2s", letterSpacing:"-0.01em"
            }}>
              {loading ? "Signing in…" : `Sign in to ${isVerifier ? "Verifier" : "Admin"}`}
            </button>
          </form>

          <div style={{ marginTop:"2rem", textAlign:"center" }}>
            {isVerifier ? (
              <>
                <span style={{ color:"#a0aec0", fontSize:13 }}>Are you an admin? </span>
                <button
                  type="button"
                  onClick={() => setIsVerifier(false)}
                  style={{
                    background:"none", border:"none", color:"#3b82f6",
                    fontSize:13, fontWeight:600, cursor:"pointer",
                    textDecoration:"none", transition:"color 0.2s",
                    padding:0
                  }}
                  onMouseEnter={e=>e.target.style.color="#2563eb"}
                  onMouseLeave={e=>e.target.style.color="#3b82f6"}
                >
                  Sign in as Admin →
                </button>
              </>
            ) : (
              <>
                <span style={{ color:"#a0aec0", fontSize:13 }}>Are you a verifier? </span>
                <button
                  type="button"
                  onClick={() => setIsVerifier(true)}
                  style={{
                    background:"none", border:"none", color:"#10b981",
                    fontSize:13, fontWeight:600, cursor:"pointer",
                    textDecoration:"none", transition:"color 0.2s",
                    padding:0
                  }}
                  onMouseEnter={e=>e.target.style.color="#059669"}
                  onMouseLeave={e=>e.target.style.color="#10b981"}
                >
                  Sign in as Verifier →
                </button>
              </>
            )}
          </div>
        </div>

        <div style={{ marginTop:"2rem", textAlign:"center" }}>
          <p style={{ color:"#a0aec0", fontSize:12, margin:0 }}>
            Secure Event Management Platform
          </p>
        </div>
      </div>
    </div>
  );
}
