import { useState, useEffect } from "react";

const TEMPLATES = [
  {
    id: "classic", name: "Classic White",
    bgColor: "#ffffff", accent: "#4f46e5",
    fields: [
      { id:"name",        label:"Full Name",    x:20, y:30,  fontSize:20, bold:true,  color:"#0f172a" },
      { id:"mobile",      label:"Mobile",       x:20, y:62,  fontSize:13, bold:false, color:"#64748b" },
      { id:"designation", label:"Designation",  x:20, y:82,  fontSize:13, bold:false, color:"#64748b" },
      { id:"company",     label:"Company Name", x:20, y:102, fontSize:13, bold:false, color:"#64748b" },
      { id:"event",       label:"Event Name", x:20, y:122, fontSize:12, bold:false, color:"#64748b" },
      { id:"passcode",    label:"PASS-001234",  x:20, y:140, fontSize:13, bold:true,  color:"#4f46e5", visible:true },
      { id:"qr",          label:"QR",           x:95, y:200, fontSize:12, bold:false, color:"#0f172a", visible:true },
    ],
  },
  {
    id: "dark", name: "Dark Pro",
    bgColor: "#0f172a", accent: "#6366f1",
    fields: [
      { id:"name",        label:"Full Name",    x:20, y:30,  fontSize:20, bold:true,  color:"#f8fafc" },
      { id:"mobile",      label:"Mobile",       x:20, y:62,  fontSize:13, bold:false, color:"#94a3b8" },
      { id:"designation", label:"Designation",  x:20, y:82,  fontSize:13, bold:false, color:"#94a3b8" },
      { id:"company",     label:"Company Name", x:20, y:102, fontSize:13, bold:false, color:"#94a3b8" },
      { id:"event",       label:"Tech Conference", x:20, y:122, fontSize:12, bold:false, color:"#94a3b8" },
      { id:"passcode",    label:"PASS-001234",  x:20, y:140, fontSize:13, bold:true,  color:"#a5b4fc", visible:true },
      { id:"qr",          label:"QR",           x:95, y:200, fontSize:12, bold:false, color:"#f8fafc", visible:true },
    ],
  },
  {
    id: "corporate", name: "Corporate Blue",
    bgColor: "#eff6ff", accent: "#1d4ed8",
    fields: [
      { id:"name",        label:"Full Name",    x:20, y:30,  fontSize:20, bold:true,  color:"#1e3a8a" },
      { id:"mobile",      label:"Mobile",       x:20, y:62,  fontSize:13, bold:false, color:"#3b82f6" },
      { id:"designation", label:"Designation",  x:20, y:82,  fontSize:13, bold:false, color:"#3b82f6" },
      { id:"company",     label:"Company Name", x:20, y:102, fontSize:13, bold:false, color:"#3b82f6" },
      { id:"event",       label:"Developer Hackathon", x:20, y:122, fontSize:12, bold:false, color:"#3b82f6" },
      { id:"passcode",    label:"PASS-001234",  x:20, y:140, fontSize:13, bold:true,  color:"#1d4ed8", visible:true },
      { id:"qr",          label:"QR",           x:95, y:200, fontSize:12, bold:false, color:"#1e3a8a", visible:true },
    ],
  },
];

const REGISTRATIONS = [
  { id:1, name:"Deepa Nair",   mobile:"9876543210", designation:"Engineer",   company:"Infosys",   passcode:"PASS-1001", event:"Leadership Summit" },
  { id:2, name:"Meera Joshi",  mobile:"9123456789", designation:"Manager",    company:"TCS",       passcode:"PASS-1002", event:"Tech Conference" },
  { id:3, name:"Anita Gupta",  mobile:"9001122334", designation:"Director",   company:"Wipro",     passcode:"PASS-1003", event:"Leadership Summit" },
  { id:4, name:"Ravi Shankar", mobile:"9988776655", designation:"Developer",  company:"HCL",       passcode:"PASS-1004", event:"Developer Hackathon" },
  { id:5, name:"Suresh Babu",  mobile:"9765432100", designation:"Consultant", company:"Cognizant", passcode:"PASS-1005", event:"Tech Conference" },
  { id:6, name:"Prakash Iyer", mobile:"9654321099", designation:"Analyst",    company:"Accenture", passcode:"PASS-1006", event:"Developer Hackathon" },
  { id:7, name:"Kavya Menon",  mobile:"9543210988", designation:"Architect",  company:"IBM",       passcode:"PASS-1007", event:"Leadership Summit" },
  { id:8, name:"Arjun Mehta",  mobile:"9432109877", designation:"Lead",       company:"Oracle",    passcode:"PASS-1008", event:"Developer Hackathon" },
];

const ALL_EVENTS = ["All Events", ...new Set(REGISTRATIONS.map(r => r.event))];

const QRPlaceholder = ({ size = 120 }) => (
  <svg width={size} height={size} viewBox="0 0 120 120" style={{ display:"block" }}>
    <rect width="120" height="120" fill="#f1f5f9" rx="8"/>
    <rect x="8" y="8" width="40" height="40" fill="none" stroke="#0f172a" strokeWidth="3" rx="3"/>
    <rect x="16" y="16" width="24" height="24" fill="#0f172a" rx="2"/>
    <rect x="72" y="8" width="40" height="40" fill="none" stroke="#0f172a" strokeWidth="3" rx="3"/>
    <rect x="80" y="16" width="24" height="24" fill="#0f172a" rx="2"/>
    <rect x="8" y="72" width="40" height="40" fill="none" stroke="#0f172a" strokeWidth="3" rx="3"/>
    <rect x="16" y="80" width="24" height="24" fill="#0f172a" rx="2"/>
    {[0,1,2,3,4,5,6].map(r=>[0,1,2,3,4,5,6].map(c=>(
      Math.random()>0.5 && <rect key={`${r}-${c}`} x={72+c*7} y={72+r*7} width="6" height="6" fill="#0f172a"/>
    )))}
  </svg>
);

function TicketCanvas({ bgColor, bgImage, selectedId, onSelect, onDragStart, draggingId, fields }) {
  return (
    <div style={{
      width:360, height:560, borderRadius:16, overflow:"hidden", position:"relative",
      background: bgImage ? `url(${bgImage}) center/cover` : bgColor,
      boxShadow:"0 24px 64px rgba(15,23,42,0.22)", cursor:"default", flexShrink:0,
      border:"1px solid rgba(148,163,184,0.2)", padding:16
    }}>
      {fields.filter(f=>f.visible!==false).map(f => (
        <div key={f.id} onMouseDown={(event)=>{
            if (event.button !== 0) return;
            onSelect(f.id);
            if (onDragStart) onDragStart(f, event);
          }}
          onClick={()=>onSelect(f.id)}
          style={{
            position:"absolute", left:f.x, top:f.y,
            cursor: draggingId===f.id ? "grabbing" : "grab", userSelect:"none",
            outline: selectedId===f.id ? "2px dashed #6366f1" : "2px solid transparent",
            outlineOffset:4, borderRadius:4, padding:"2px 4px"
          }}>
          {f.id==="qr"
            ? <QRPlaceholder size={150}/>
            : <span style={{ fontSize:f.fontSize, fontWeight:f.bold?"700":"400", color:f.color }}>
                {f.id==="passcode"
                  ? <span style={{
                      background:"#eef2ff", color:f.color, padding:"4px 14px",
                      borderRadius:20, fontFamily:"monospace", fontWeight:700,
                      fontSize:13, letterSpacing:"0.08em", border:`1px solid ${f.color}22`
                    }}>{f.label}</span>
                  : f.label}
              </span>}
        </div>
      ))}
    </div>
  );
}

function DesignerSection() {
  const [activeTpl, setActiveTpl] = useState("classic");
  const tpl = TEMPLATES.find(t => t.id === activeTpl);
  const [fields, setFields]       = useState(tpl.fields);
  const [selected, setSelected]   = useState(null);
  const [bgColor, setBgColor]     = useState(tpl.bgColor);
  const [bgImage, setBgImage]     = useState(null);
  const [saved, setSaved]         = useState(false);
  const [dragState, setDragState] = useState(null);

  const applyTemplate = (id) => {
    const t = TEMPLATES.find(x => x.id === id);
    setActiveTpl(id); setFields(t.fields); setBgColor(t.bgColor);
    setBgImage(null); setSelected(null);
  };

  const sel = fields.find(f=>f.id===selected);
  const update = (id, key, val) =>
    setFields(prev=>prev.map(f=>f.id===id?{...f,[key]:val}:f));

  useEffect(() => {
    if (!dragState) return undefined;

    const onMouseMove = (event) => {
      const dx = event.clientX - dragState.startX;
      const dy = event.clientY - dragState.startY;
      update(dragState.id, "x", Math.max(0, dragState.origX + dx));
      update(dragState.id, "y", Math.max(0, dragState.origY + dy));
    };

    const onMouseUp = () => setDragState(null);

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    document.body.style.cursor = "grabbing";

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
      document.body.style.cursor = "";
    };
  }, [dragState]);

  return (
    <div style={{display:"flex", flexDirection:"column", gap:16}}>

      {/* ── Template Picker ── */}
      <div style={{display:"flex", gap:10, flexWrap:"wrap", alignItems:"center"}}>
        <span style={{fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.1em", color:"#64748b", marginRight:4}}>Template:</span>
        {TEMPLATES.map(t => (
          <button key={t.id} onClick={()=>applyTemplate(t.id)} style={{
            padding:"7px 16px", borderRadius:10, border:`2px solid ${activeTpl===t.id ? t.accent : "#e2e8f0"}`,
            background: activeTpl===t.id ? t.accent+"18" : "#fff",
            color: activeTpl===t.id ? t.accent : "#64748b",
            fontWeight:700, fontSize:13, cursor:"pointer", transition:"all 0.15s"
          }}>
            {activeTpl===t.id ? "✓ " : ""}{t.name}
          </button>
        ))}
      </div>

      {/* ── Three-panel layout ── */}
      <div style={{display:"flex", gap:20, alignItems:"flex-start"}}>

      {/* ── Left Toolbox ── */}
      <div style={{
        width:220, background:"#fff", borderRadius:16,
        border:"1px solid #e2e8f0", overflow:"hidden", flexShrink:0
      }}>
        <div style={{padding:"14px 16px", borderBottom:"1px solid #f1f5f9", background:"#f8fafc"}}>
          <div style={{fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.1em", color:"#64748b"}}>
            Field Visibility
          </div>
        </div>
        <div style={{padding:12, display:"flex", flexDirection:"column", gap:6}}>
          {fields.map(f=>(
            <label key={f.id} style={{
              display:"flex", alignItems:"center", gap:10, padding:"8px 10px",
              borderRadius:8, cursor:"pointer", background: f.visible===false?"#f8fafc":"#f0f4ff",
              border:`1px solid ${f.visible===false?"#e2e8f0":"#c7d2fe"}`
            }}>
              <input type="checkbox" checked={f.visible!==false}
                onChange={e=>update(f.id,"visible",e.target.checked)}
                style={{accentColor:"#6366f1", width:14, height:14}}/>
              <span style={{fontSize:12.5, fontWeight:600, color: f.visible===false?"#94a3b8":"#1e293b"}}>
                {f.id==="qr"?"QR Code":f.id==="event"?"Event Name":f.id.charAt(0).toUpperCase()+f.id.slice(1)}
              </span>
            </label>
          ))}
        </div>

        <div style={{padding:"14px 16px", borderTop:"1px solid #f1f5f9", borderBottom:"1px solid #f1f5f9", background:"#f8fafc"}}>
          <div style={{fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.1em", color:"#64748b"}}>
            Background
          </div>
        </div>
        <div style={{padding:14, display:"flex", flexDirection:"column", gap:10}}>
          <label style={{fontSize:12, fontWeight:600, color:"#475569"}}>
            Color
            <div style={{display:"flex", alignItems:"center", gap:8, marginTop:6}}>
              <input type="color" value={bgColor} onChange={e=>setBgColor(e.target.value)}
                style={{width:32, height:32, border:"none", borderRadius:8, cursor:"pointer", padding:2}}/>
              <span style={{fontFamily:"monospace", fontSize:12, color:"#64748b"}}>{bgColor}</span>
            </div>
          </label>
          <label style={{fontSize:12, fontWeight:600, color:"#475569", cursor:"pointer"}}>
            Background Image
            <div style={{
              marginTop:6, padding:"8px 12px", border:"1px dashed #c7d2fe",
              borderRadius:8, textAlign:"center", background:"#f0f4ff", color:"#6366f1",
              fontSize:12, fontWeight:600
            }}>
              {bgImage ? "✓ Image set" : "+ Upload image"}
            </div>
            <input type="file" accept="image/*" style={{display:"none"}}
              onChange={e=>{
                const file=e.target.files[0];
                if(file) setBgImage(URL.createObjectURL(file));
              }}/>
          </label>
          {bgImage && (
            <button onClick={()=>setBgImage(null)} style={{
              fontSize:11, color:"#ef4444", background:"none", border:"none",
              cursor:"pointer", textAlign:"left", padding:0
            }}>✕ Remove image</button>
          )}
        </div>

        <div style={{padding:12, borderTop:"1px solid #f1f5f9"}}>
          <button onClick={()=>{setSaved(true);setTimeout(()=>setSaved(false),2000);}} style={{
            width:"100%", padding:"10px", borderRadius:10,
            background:"linear-gradient(135deg,#6366f1,#4f46e5)", color:"#fff",
            border:"none", fontWeight:700, fontSize:13, cursor:"pointer"
          }}>
            {saved ? "✓ Template Saved!" : "Save Template"}
          </button>
          <button onClick={()=>{applyTemplate(activeTpl);setSaved(false);}} style={{
            width:"100%", marginTop:6, padding:"8px", borderRadius:10,
            background:"transparent", color:"#94a3b8", border:"1px solid #e2e8f0",
            fontWeight:600, fontSize:12, cursor:"pointer"
          }}>Reset</button>
        </div>
      </div>

      {/* ── Center Canvas ── */}
      <div style={{flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:12}}>
        <div style={{
          fontSize:11, color:"#94a3b8", fontWeight:600,
          textTransform:"uppercase", letterSpacing:"0.1em"
        }}>
          Click any element to select · Drag to reposition
        </div>
        <TicketCanvas
          bgColor={bgColor} bgImage={bgImage}
          selectedId={selected} onSelect={setSelected} onDragStart={(field,event)=>{
            setSelected(field.id);
            setDragState({
              id: field.id,
              startX: event.clientX,
              startY: event.clientY,
              origX: field.x,
              origY: field.y
            });
          }}
          draggingId={dragState?.id}
          fields={fields}
        />
      </div>

      {/* ── Right Properties ── */}
      <div style={{
        width:220, background:"#fff", borderRadius:16,
        border:"1px solid #e2e8f0", overflow:"hidden", flexShrink:0
      }}>
        <div style={{padding:"14px 16px", borderBottom:"1px solid #f1f5f9", background:"#f8fafc"}}>
          <div style={{fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.1em", color:"#64748b"}}>
            Properties
          </div>
        </div>
        {!sel ? (
          <div style={{padding:20, textAlign:"center", color:"#94a3b8", fontSize:12}}>
            Select an element on the canvas to edit its properties
          </div>
        ) : (
          <div style={{padding:14, display:"flex", flexDirection:"column", gap:14}}>
            <label style={{fontSize:12, fontWeight:600, color:"#475569"}}>
              Font Size: {sel.fontSize}px
              <input type="range" min={10} max={48} value={sel.fontSize}
                onChange={e=>update(sel.id,"fontSize",+e.target.value)}
                style={{width:"100%", marginTop:6, accentColor:"#6366f1"}}/>
            </label>
            <label style={{fontSize:12, fontWeight:600, color:"#475569"}}>
              Text Color
              <div style={{display:"flex", alignItems:"center", gap:8, marginTop:6}}>
                <input type="color" value={sel.color}
                  onChange={e=>update(sel.id,"color",e.target.value)}
                  style={{width:32, height:32, border:"none", borderRadius:8, cursor:"pointer", padding:2}}/>
                <span style={{fontFamily:"monospace", fontSize:12, color:"#64748b"}}>{sel.color}</span>
              </div>
            </label>
            <label style={{fontSize:12, fontWeight:600, color:"#475569"}}>
              Font Weight
              <div style={{display:"flex", gap:6, marginTop:6}}>
                {["Normal","Bold"].map(w=>(
                  <button key={w} onClick={()=>update(sel.id,"bold",w==="Bold")} style={{
                    flex:1, padding:"6px", borderRadius:8, fontSize:12, fontWeight:600,
                    cursor:"pointer", border:"1px solid",
                    background: (w==="Bold")===sel.bold?"#0f172a":"#fff",
                    color:     (w==="Bold")===sel.bold?"#fff":"#64748b",
                    borderColor:(w==="Bold")===sel.bold?"#0f172a":"#e2e8f0"
                  }}>{w}</button>
                ))}
              </div>
            </label>
            <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:8}}>
              {["x","y"].map(axis=>(
                <label key={axis} style={{fontSize:12, fontWeight:600, color:"#475569"}}>
                  {axis.toUpperCase()} position
                  <input type="number" value={sel[axis]}
                    onChange={e=>update(sel.id,axis,+e.target.value)}
                    style={{
                      width:"100%", marginTop:4, padding:"6px 8px",
                      border:"1px solid #e2e8f0", borderRadius:8,
                      fontSize:12, outline:"none"
                    }}/>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
    </div>
  );
}

function MiniTicket({ reg }) {
  return (
    <div style={{
      width:"100%", aspectRatio:"9/16", borderRadius:14, overflow:"hidden",
      background:"#fff", boxShadow:"0 8px 24px rgba(15,23,42,0.10)",
      border:"1px solid #e2e8f0", display:"flex", flexDirection:"column", padding:10
    }}>
      <div style={{fontWeight:700, fontSize:12, color:"#0f172a", marginBottom:2}}>{reg.name}</div>
      <div style={{fontSize:9, color:"#64748b"}}>{reg.mobile}</div>
      <div style={{fontSize:9, color:"#64748b"}}>{reg.designation}</div>
      <div style={{fontSize:9, color:"#64748b", marginBottom:6}}>{reg.company}</div>
      <div style={{
        display:"inline-block", background:"#eef2ff", color:"#4f46e5",
        padding:"2px 8px", borderRadius:20, fontSize:8, fontWeight:700,
        fontFamily:"monospace", letterSpacing:"0.06em", marginBottom:8, width:"fit-content"
      }}>{reg.passcode}</div>
      <div style={{display:"flex", justifyContent:"center", marginTop:"auto"}}>
        <QRPlaceholder size={60}/>
      </div>
    </div>
  );
}

function ManagementSection() {
  const [search, setSearch]     = useState("");
  const [eventFilter, setEvent] = useState("All Events");
  const [selected, setSelected] = useState(new Set());

  const filtered = REGISTRATIONS.filter(r => {
    const q = search.toLowerCase();
    const matchSearch = !q || r.name.toLowerCase().includes(q) || r.company.toLowerCase().includes(q);
    const matchEvent  = eventFilter === "All Events" || r.event === eventFilter;
    return matchSearch && matchEvent;
  });

  const toggleSelect = id =>
    setSelected(prev => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });

  const allSelected = filtered.length > 0 && filtered.every(r => selected.has(r.id));

  return (
    <div>
      {/* Toolbar */}
      <div style={{
        display:"flex", gap:10, alignItems:"center", marginBottom:20, flexWrap:"wrap"
      }}>
        {/* Search */}
        <div style={{
          flex:1, minWidth:180, display:"flex", alignItems:"center", gap:8,
          background:"#fff", border:"1px solid #e2e8f0", borderRadius:10, padding:"8px 12px"
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input value={search} onChange={e=>setSearch(e.target.value)}
            placeholder="Search name or company…"
            style={{border:"none", outline:"none", fontSize:13, color:"#0f172a", width:"100%", background:"transparent"}}/>
        </div>

        {/* Event filter */}
        <select value={eventFilter} onChange={e=>setEvent(e.target.value)} style={{
          padding:"8px 12px", border:"1px solid #e2e8f0", borderRadius:10,
          fontSize:13, color:"#0f172a", background:"#fff", outline:"none",
          fontWeight:600, cursor:"pointer", minWidth:160
        }}>
          {ALL_EVENTS.map(ev => <option key={ev} value={ev}>{ev}</option>)}
        </select>

        <div style={{
          padding:"6px 12px", background:"#f0f4ff", border:"1px solid #c7d2fe",
          borderRadius:10, fontSize:12, fontWeight:700, color:"#4f46e5"
        }}>
          {filtered.length} tickets
        </div>

        <button style={{
          padding:"9px 18px", background:"linear-gradient(135deg,#6366f1,#4f46e5)",
          color:"#fff", border:"none", borderRadius:10, fontWeight:700, fontSize:13,
          cursor:"pointer", display:"flex", alignItems:"center", gap:8
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          Download All PDF
        </button>

        {selected.size > 0 && (
          <button style={{
            padding:"9px 18px", background:"#0f172a",
            color:"#fff", border:"none", borderRadius:10, fontWeight:700, fontSize:13,
            cursor:"pointer"
          }}>
            Download Selected ({selected.size})
          </button>
        )}
      </div>

      {/* Select all row */}
      <div style={{
        display:"flex", alignItems:"center", gap:10, marginBottom:14,
        padding:"8px 14px", background:"#f8fafc", borderRadius:10,
        border:"1px solid #f1f5f9"
      }}>
        <input type="checkbox" checked={allSelected}
          onChange={()=>
            allSelected
              ? setSelected(new Set())
              : setSelected(new Set(filtered.map(r=>r.id)))
          }
          style={{accentColor:"#6366f1", width:14, height:14}}/>
        <span style={{fontSize:12, fontWeight:600, color:"#64748b"}}>
          Select all visible tickets
        </span>
      </div>

      {/* Grid */}
      <div style={{
        display:"grid",
        gridTemplateColumns:"repeat(auto-fill, minmax(160px, 1fr))",
        gap:16
      }}>
        {filtered.map(reg => (
          <div key={reg.id} style={{display:"flex", flexDirection:"column", gap:8}}>
            <div style={{position:"relative"}}>
              {/* Select checkbox overlay */}
              <div style={{
                position:"absolute", top:8, left:8, zIndex:2,
                width:20, height:20, borderRadius:6,
                background: selected.has(reg.id)?"#6366f1":"rgba(255,255,255,0.85)",
                border:`2px solid ${selected.has(reg.id)?"#6366f1":"#e2e8f0"}`,
                display:"flex", alignItems:"center", justifyContent:"center",
                cursor:"pointer", boxShadow:"0 2px 8px rgba(0,0,0,0.08)"
              }} onClick={()=>toggleSelect(reg.id)}>
                {selected.has(reg.id) && (
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="1.5 5 4 7.5 8.5 2.5"/>
                  </svg>
                )}
              </div>
              <MiniTicket reg={reg}/>
            </div>

            {/* Download button */}
            <button style={{
              width:"100%", padding:"8px", borderRadius:10,
              background:"#fff", border:"1px solid #e2e8f0",
              color:"#4f46e5", fontWeight:700, fontSize:12,
              cursor:"pointer", display:"flex", alignItems:"center",
              justifyContent:"center", gap:6,
              transition:"all 0.15s"
            }}
              onMouseEnter={e=>{e.currentTarget.style.background="#f0f4ff";e.currentTarget.style.borderColor="#c7d2fe";}}
              onMouseLeave={e=>{e.currentTarget.style.background="#fff";e.currentTarget.style.borderColor="#e2e8f0";}}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Download PDF
            </button>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{
          textAlign:"center", padding:"48px 24px", color:"#94a3b8"
        }}>
          <div style={{fontSize:32, marginBottom:8}}>🎫</div>
          <div style={{fontWeight:700, fontSize:14, color:"#475569"}}>No tickets found</div>
          <div style={{fontSize:12, marginTop:4}}>Try adjusting your search</div>
        </div>
      )}
    </div>
  );
}

export default function GenerateTickets() {
  const [tab, setTab] = useState("designer");

  return (
    <div style={{fontFamily:"inherit", paddingBottom:48}}>
      {/* Header */}
      <div style={{
        display:"flex", alignItems:"flex-start",
        justifyContent:"space-between", marginBottom:24, flexWrap:"wrap", gap:12
      }}>
        <div>
          <div style={{
            fontSize:11, fontWeight:700, textTransform:"uppercase",
            letterSpacing:"0.14em", color:"#6366f1", marginBottom:6
          }}>Ticket Tools</div>
          <h1 style={{
            margin:0, fontSize:24, fontWeight:800,
            color:"#0f172a", letterSpacing:"-0.03em"
          }}>Generate Tickets</h1>
          <p style={{margin:"4px 0 0", fontSize:13, color:"#94a3b8"}}>
            Design your ticket template and download passes for approved participants
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display:"flex", gap:4, marginBottom:24,
        background:"#f1f5f9", padding:4, borderRadius:12,
        width:"fit-content"
      }}>
        {[
          { key:"designer",   label:"🎨  Ticket Designer"   },
          { key:"management", label:"📥  Ticket Management" },
        ].map(t => (
          <button key={t.key} onClick={()=>setTab(t.key)} style={{
            padding:"9px 20px", borderRadius:9, border:"none", cursor:"pointer",
            fontWeight:700, fontSize:13, transition:"all 0.15s",
            background: tab===t.key?"#fff":"transparent",
            color:       tab===t.key?"#0f172a":"#64748b",
            boxShadow:   tab===t.key?"0 2px 8px rgba(15,23,42,0.08)":"none"
          }}>{t.label}</button>
        ))}
      </div>

      {/* Content */}
      {tab==="designer"   && <DesignerSection/>}
      {tab==="management" && <ManagementSection/>}
    </div>
  );
}
