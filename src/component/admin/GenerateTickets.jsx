import { useState, useEffect, useRef } from "react";
import api from "../../api/api";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { QRCodeSVG } from "qrcode.react";

const TEMPLATES = [
  {
    id: "classic", name: "Classic White",
    bgColor: "#ffffff", accent: "#4f46e5",
    fields: [
      { id:"name",        label:"Full Name",    x:180, y:180, fontSize:24, bold:true,  color:"#0f172a", align:"center" },
      { id:"event",       label:"Event Name",   x:180, y:60,  fontSize:28, bold:true,  color:"#0f172a", align:"center" },
      { id:"date",        label:"April 22, 2026",x:180, y:110, fontSize:14, bold:false, color:"#64748b", align:"center" },
      { id:"passcode",    label:"TSSIA-001",    x:180, y:230, fontSize:14, bold:true,  color:"#2563eb", align:"center" },
      { id:"qr",          label:"QR",           x:180, y:360, fontSize:12, bold:false, color:"#0f172a", align:"center" },
      { id:"address",     label:"Venue Address",x:180, y:480, fontSize:11, bold:false, color:"#64748b", align:"center" },
    ],
  },
  {
    id: "tssia", name: "TSSIA Premium",
    bgColor: "linear-gradient(180deg, #000000 0%, #000000 70%, #d90429 100%)", accent: "#ef4444",
    fields: [
      { id:"event",       label:"MSME Business Summit",x:180, y:80,  fontSize:32, bold:true,  color:"#ffffff", align:"center" },
      { id:"date",        label:"April 22, 2026",       x:180, y:150, fontSize:16, bold:false, color:"#cccccc", align:"center" },
      { id:"name",        label:"Full Name",    x:180, y:220, fontSize:42, bold:true,  color:"#ffffff", align:"center" },
      { id:"passcode",    label:"TSSIA-2-0001",         x:180, y:290, fontSize:18, bold:true,  color:"#3b82f6", align:"center" },
      { id:"qr",          label:"QR",                   x:180, y:400, fontSize:12, bold:false, color:"#ffffff", align:"center" },
      { id:"address",     label:"TSSIA House, Plot No. P-26, MIDC", x:180, y:510, fontSize:11, bold:false, color:"#ffffff", align:"center" },
      { id:"branding",    label:"Sponsored by TSSIA",   x:180, y:540, fontSize:10, bold:false, color:"#ffffff", align:"center", isBranding:true },
    ],
  },
  {
    id: "dark", name: "Dark Pro",
    bgColor: "#0f172a", accent: "#6366f1",
    fields: [
      { id:"name",        label:"Full Name",    x:180, y:220, fontSize:24, bold:true,  color:"#f8fafc", align:"center" },
      { id:"event",       label:"Tech Event",   x:180, y:80,  fontSize:28, bold:true,  color:"#ffffff", align:"center" },
      { id:"passcode",    label:"PASS-001234",  x:180, y:280, fontSize:14, bold:true,  color:"#a5b4fc", align:"center" },
      { id:"qr",          label:"QR",           x:180, y:400, fontSize:12, bold:false, color:"#f8fafc", align:"center" },
    ],
  },
];

const QRPlaceholder = ({ value = "TSSIA-SAMPLE", size = 150 }) => (
  <div style={{ background: "#fff", padding: 8, borderRadius: 8, display: "inline-block", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
    <QRCodeSVG 
      value={value} 
      size={size} 
      level="H" 
      includeMargin={false}
      imageSettings={{
        src: "/tssia-logo-icon.png", // If you have a small icon
        x: undefined, y: undefined, height: 24, width: 24, excavate: true,
      }}
    />
  </div>
);

function TicketCanvas({ bgColor, bgImage, selectedId, onSelect, onDragStart, draggingId, fields, previewData, canvasRef }) {
  return (
    <div 
      ref={canvasRef}
      style={{
        width:360, height:560, borderRadius:0, overflow:"hidden", position:"relative",
        background: bgImage ? `url(${bgImage}) center/cover` : bgColor,
        boxShadow:"0 24px 64px rgba(0,0,0,0.3)", cursor:"default", flexShrink:0,
        border:"none", padding:16
      }}>
      {fields.filter(f=>f.visible!==false).map(f => {
        const value = previewData[f.id] || f.label;
        const isCentered = f.align === "center";
        
        return (
          <div key={f.id} onMouseDown={(event)=>{
              if (event.button !== 0) return;
              onSelect(f.id);
              if (onDragStart) onDragStart(f, event);
            }}
            onClick={()=>onSelect(f.id)}
            style={{
              position:"absolute", 
              left: isCentered ? "50%" : f.x, 
              top: f.y,
              transform: isCentered ? "translateX(-50%)" : "none",
              cursor: draggingId===f.id ? "grabbing" : "grab", userSelect:"none",
              outline: selectedId===f.id ? "2px dashed #6366f1" : "none",
              outlineOffset:4, borderRadius:4, padding:"2px 4px",
              textAlign: isCentered ? "center" : "left",
              width: isCentered ? "90%" : "auto",
              zIndex: f.id === "qr" ? 10 : 1
            }}>
            {f.id === "branding" ? (
               <div style={{ textAlign:"center" }}>
                 <p style={{ fontSize:10, color:"rgba(255,255,255,0.5)", margin:"0 0 4px 0", textTransform:"uppercase", letterSpacing:"0.1em" }}>Sponsored by</p>
                 <div style={{ background:"#fff", padding:4, borderRadius:6, display:"inline-block" }}>
                   <svg width="50" height="20" viewBox="0 0 100 40">
                      <text x="50%" y="25" textAnchor="middle" fill="#1d4ed8" fontSize="16" fontWeight="900">TSSIA</text>
                   </svg>
                 </div>
               </div>
            ) : f.id === "image" || f.type === "image" ? (
               <div style={{ 
                 width: f.width || 100, height: f.height || 100,
                 background: f.url ? `url(${f.url}) center/contain no-repeat` : "#e2e8f0",
                 borderRadius: f.borderRadius || 0
               }}>
                 {!f.url && <div style={{ height:"100%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, color:"#94a3b8" }}>No Image</div>}
               </div>
            ) : f.id==="qr"
              ? <QRPlaceholder value={previewData.passcode || "TSSIA-DEMO"} size={160}/>
              : <span style={{ 
                  fontSize:f.fontSize, 
                  fontWeight:f.bold?"700":"400", 
                  color:f.color,
                  lineHeight:1.1,
                  display:"block"
                }}>
                  {f.id==="passcode"
                    ? <span style={{
                        color:f.color, fontFamily:"monospace", fontWeight:700,
                        fontSize:f.fontSize, letterSpacing:"0.05em"
                      }}>{value}</span>
                    : value}
                </span>}
          </div>
        );
      })}
    </div>
  );
}

function DesignerSection({ rawEvents, fields, setFields, bgColor, setBgColor, bgImage, setBgImage, activeTpl, setActiveTpl }) {
  const [selected, setSelected]   = useState(null);
  const [saved, setSaved]         = useState(false);
  const [dragState, setDragState] = useState(null);
  const canvasRef = useRef(null);
  
  // Preview Data
  const [previewEventId, setPreviewEventId] = useState("");
  const selectedEvent = rawEvents.find(e => e.event_id.toString() === previewEventId);
  
  const previewData = {
    event: selectedEvent?.event_name || "MSME Business Summit",
    date: selectedEvent ? new Date(selectedEvent.start_date_time).toLocaleDateString("en-US", { month: 'long', day: 'numeric', year: 'numeric' }) : "April 22, 2026",
    address: selectedEvent?.address || "TSSIA House, Plot No. P-26, MIDC",
    name: "John Participant",
    passcode: "TSSIA-2024-001"
  };

  const applyTemplate = (id) => {
    const t = TEMPLATES.find(x => x.id === id);
    setActiveTpl(id); setFields(t.fields.map(f => ({...f}))); setBgColor(t.bgColor);
    setBgImage(null); setSelected(null);
  };

  const addElement = () => {
    const id = `custom_${Date.now()}`;
    setFields(prev => [...prev, {
      id, label: "New Text Element", x: 180, y: 300, fontSize: 16, bold: false, color: "#ffffff", align: "center", type: "text"
    }]);
    setSelected(id);
  };

  const addImageElement = () => {
    const id = `image_${Date.now()}`;
    setFields(prev => [...prev, {
      id, type: "image", x: 130, y: 300, width: 100, height: 100, url: null, borderRadius: 0, align: "left"
    }]);
    setSelected(id);
  };

  const handleImageUpload = (id, file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      update(id, "url", e.target.result);
    };
    reader.readAsDataURL(file);
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

      {/* ── Event Picker ── */}
      <div style={{display:"flex", gap:16, alignItems:"center", padding:"12px 16px", background:"#fff", borderRadius:12, border:"1px solid #e2e8f0"}}>
        <span style={{fontSize:12, fontWeight:700, color:"#475569"}}>Preview Event Data:</span>
        <select 
          value={previewEventId} 
          onChange={e => setPreviewEventId(e.target.value)}
          style={{
            padding:"6px 12px", borderRadius:8, border:"1px solid #e2e8f0", 
            fontSize:13, color:"#1e293b", fontWeight:600, outline:"none",
            minWidth: 200
          }}
        >
          <option value="">Select an event...</option>
          {rawEvents.map(ev => (
            <option key={ev.event_id} value={ev.event_id}>{ev.event_name}</option>
          ))}
        </select>
        <div style={{fontSize:11, color:"#94a3b8"}}>Selecting an event will populate the ticket with real data</div>
      </div>

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
            <div key={f.id} style={{ display:"flex", alignItems:"center", gap:6 }}>
              <label style={{
                flex:1, display:"flex", alignItems:"center", gap:10, padding:"8px 10px",
                borderRadius:8, cursor:"pointer", background: f.visible===false?"#f8fafc":"#f0f4ff",
                border:`1px solid ${f.visible===false?"#e2e8f0":"#c7d2fe"}`
              }}>
                <input type="checkbox" checked={f.visible!==false}
                  onChange={e=>update(f.id,"visible",e.target.checked)}
                  style={{accentColor:"#6366f1", width:14, height:14}}/>
                <span style={{fontSize:11, fontWeight:600, color: f.visible===false?"#94a3b8":"#1e293b", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap"}}>
                  {f.id==="qr"?"QR Code":f.id==="branding"?"Logo":f.type==="image"?"Image":f.label}
                </span>
              </label>
              {(f.id.startsWith("custom_") || f.id.startsWith("image_")) && (
                <button onClick={() => setFields(prev => prev.filter(x => x.id !== f.id))} style={{ border:"none", background:"none", color:"#ef4444", cursor:"pointer", padding:4 }}>✕</button>
              )}
            </div>
          ))}
          <div style={{ display:"flex", gap:6, marginTop:4 }}>
            <button onClick={addElement} style={{
              flex:1, padding:"8px", borderRadius:8, border:"1px dashed #6366f1",
              background:"#f5f7ff", color:"#6366f1", fontSize:11, fontWeight:700, cursor:"pointer"
            }}>+ Text</button>
            <button onClick={addImageElement} style={{
              flex:1, padding:"8px", borderRadius:8, border:"1px dashed #6366f1",
              background:"#f5f7ff", color:"#6366f1", fontSize:11, fontWeight:700, cursor:"pointer"
            }}>+ Image</button>
          </div>
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
          previewData={previewData}
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
            {sel.type === "image" && (
              <label style={{fontSize:12, fontWeight:600, color:"#475569"}}>
                Upload Image
                <input type="file" accept="image/*"
                  onChange={e => handleImageUpload(sel.id, e.target.files[0])}
                  style={{
                    width:"100%", marginTop:4, fontSize:11,
                    padding:8, border:"1px solid #e2e8f0", borderRadius:8
                  }}/>
              </label>
            )}
            {sel.id.startsWith("custom_") && (
              <label style={{fontSize:12, fontWeight:600, color:"#475569"}}>
                Text Content
                <input type="text" value={sel.label}
                  onChange={e=>update(sel.id,"label",e.target.value)}
                  style={{
                    width:"100%", marginTop:4, padding:"6px 8px",
                    border:"1px solid #e2e8f0", borderRadius:8,
                    fontSize:12, outline:"none"
                  }}/>
              </label>
            )}
            {sel.type === "image" ? (
              <>
                <div style={{ display:"flex", gap:8 }}>
                  <label style={{flex:1, fontSize:11, fontWeight:600, color:"#475569"}}>
                    Width
                    <input type="number" value={sel.width} onChange={e=>update(sel.id,"width",parseInt(e.target.value))}
                      style={{ width:"100%", padding:6, border:"1px solid #e2e8f0", borderRadius:8 }}/>
                  </label>
                  <label style={{flex:1, fontSize:11, fontWeight:600, color:"#475569"}}>
                    Height
                    <input type="number" value={sel.height} onChange={e=>update(sel.id,"height",parseInt(e.target.value))}
                      style={{ width:"100%", padding:6, border:"1px solid #e2e8f0", borderRadius:8 }}/>
                  </label>
                </div>
              </>
            ) : (
              <label style={{fontSize:12, fontWeight:600, color:"#475569"}}>
                Alignment
                <div style={{display:"flex", gap:6, marginTop:6}}>
                  {["Left","Center"].map(a=>(
                    <button key={a} onClick={()=>update(sel.id,"align",a.toLowerCase())} style={{
                      flex:1, padding:"6px", borderRadius:8, fontSize:12, fontWeight:600,
                      cursor:"pointer", border:"1px solid",
                      background: a.toLowerCase()===sel.align?"#0f172a":"#fff",
                      color:      a.toLowerCase()===sel.align?"#fff":"#64748b",
                      borderColor:a.toLowerCase()===sel.align?"#0f172a":"#e2e8f0"
                    }}>{a}</button>
                  ))}
                </div>
              </label>
            )}
            {sel.type !== "image" && (
              <label style={{fontSize:12, fontWeight:600, color:"#475569"}}>
                Font Size: {sel.fontSize}px
                <input type="range" min={10} max={48} value={sel.fontSize}
                  onChange={e=>update(sel.id,"fontSize",parseInt(e.target.value))}
                  style={{width:"100%", marginTop:4}}/>
              </label>
            )}
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

function MiniTicket({ reg, designerState }) {
  const { fields, bgColor, bgImage } = designerState;
  
  return (
    <div style={{
      width:"100%", aspectRatio:"9/16", borderRadius:14, overflow:"hidden",
      background: bgImage ? `url(${bgImage}) center/cover` : bgColor,
      boxShadow:"0 8px 24px rgba(0,0,0,0.15)",
      border:"1px solid #e2e8f0", display:"flex", flexDirection:"column", position:"relative",
      transform:"scale(0.44)", transformOrigin:"top left", width:360, height:560
    }}>
      {fields.filter(f=>f.visible!==false).map(f => {
        const value = reg[f.id] || (f.id === "date" ? reg.eventDate : f.label);
        const isCentered = f.align === "center";
        return (
          <div key={f.id} style={{
            position:"absolute", left: isCentered ? "50%" : f.x, top: f.y,
            transform: isCentered ? "translateX(-50%)" : "none",
            textAlign: isCentered ? "center" : "left", width: isCentered ? "90%" : "auto"
          }}>
            {f.id === "branding" ? (
               <div style={{ background:"#fff", padding:4, borderRadius:4, display:"inline-block" }}>
                 <text style={{ fontSize:12, fontWeight:900, color:"#1d4ed8" }}>TSSIA</text>
               </div>
            ) : f.type === "image" ? (
               <div style={{ 
                 width: f.width || 60, height: f.height || 60,
                 background: f.url ? `url(${f.url}) center/contain no-repeat` : "none"
               }}/>
            ) : f.id==="qr"
              ? <QRPlaceholder value={reg.passcode} size={140}/>
              : <span style={{ fontSize:f.fontSize, fontWeight:f.bold?"700":"400", color:f.color }}>{value}</span>}
          </div>
        );
      })}
    </div>
  );
}

function ManagementSection({ registrations, eventsList, loading, designerState, printData, setPrintData }) {
  const [search, setSearch]     = useState("");
  const [eventFilter, setEvent] = useState("All Events");
  const [selected, setSelected] = useState(new Set());
  const downloadRef = useRef(null);
  const [isBulkLoading, setIsBulkLoading] = useState(false);

  const handleDownloadPDF = async (reg) => {
    setPrintData(reg);
    // Give time for state to update and hidden div to render
    setTimeout(async () => {
      const element = document.getElementById("ticket-print-capture");
      if (!element) return;
      
      const canvas = await html2canvas(element, {
        scale: 3,
        useCORS: true,
        backgroundColor: null
      });
      
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [360, 560]
      });
      
      pdf.addImage(imgData, "PNG", 0, 0, 360, 560);
      pdf.save(`Ticket_${reg.name.replace(/\s+/g, '_')}.pdf`);
      setPrintData(null);
    }, 100);
  };

  const handleDownloadBulk = async (list) => {
    if (!list || list.length === 0) return;
    setIsBulkLoading(true);
    
    try {
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [360, 560]
      });

      for (let i = 0; i < list.length; i++) {
        const reg = list[i];
        setPrintData(reg);
        
        // Wait for render
        await new Promise(resolve => setTimeout(resolve, 150));
        
        const element = document.getElementById("ticket-print-capture");
        if (element) {
          const canvas = await html2canvas(element, {
            scale: 2, // slightly lower scale for bulk to save memory
            useCORS: true,
            backgroundColor: null
          });
          
          const imgData = canvas.toDataURL("image/png");
          if (i > 0) pdf.addPage([360, 560], "portrait");
          pdf.addImage(imgData, "PNG", 0, 0, 360, 560);
        }
      }
      
      pdf.save(`Bulk_Tickets_${Date.now()}.pdf`);
    } catch (error) {
      console.error("Bulk download error:", error);
      alert("Error generating bulk PDF. Please try a smaller batch.");
    } finally {
      setIsBulkLoading(false);
      setPrintData(null);
    }
  };

  const filtered = registrations.filter(r => {
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
          <option value="All Events">All Events</option>
          {eventsList.map(ev => <option key={ev} value={ev}>{ev}</option>)}
        </select>

        <div style={{
          padding:"6px 12px", background:"#f0f4ff", border:"1px solid #c7d2fe",
          borderRadius:10, fontSize:12, fontWeight:700, color:"#4f46e5"
        }}>
          {filtered.length} tickets
        </div>

        {/* Select All Toggle */}
        <button 
          onClick={() => {
            if (allSelected) setSelected(new Set());
            else setSelected(new Set(filtered.map(r => r.id)));
          }}
          style={{
            padding:"9px 12px", background:"#fff", border:"1px solid #e2e8f0", 
            borderRadius:10, fontWeight:700, fontSize:12, color:"#6366f1",
            cursor:"pointer"
          }}>
          {allSelected ? "Deselect All" : "Select All"}
        </button>

        <button 
          disabled={filtered.length === 0 || isBulkLoading}
          onClick={() => handleDownloadBulk(filtered)}
          style={{
            padding:"9px 18px", background:"linear-gradient(135deg,#6366f1,#4f46e5)",
            color:"#fff", border:"none", borderRadius:10, fontWeight:700, fontSize:13,
            cursor: (filtered.length > 0 && !isBulkLoading) ? "pointer" : "not-allowed", 
            display:"flex", alignItems:"center", gap:8, opacity: isBulkLoading ? 0.7 : 1
          }}>
          {isBulkLoading && selected.size === 0 ? (
            "Generating..."
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Download All PDF
            </>
          )}
        </button>

        {selected.size > 0 && (
          <button 
            disabled={isBulkLoading}
            onClick={() => handleDownloadBulk(filtered.filter(r => selected.has(r.id)))}
            style={{
              padding:"9px 18px", background:"#0f172a",
              color:"#fff", border:"none", borderRadius:10, fontWeight:700, fontSize:13,
              cursor: isBulkLoading ? "not-allowed" : "pointer"
            }}>
            {isBulkLoading && selected.size > 0 ? "Generating..." : `Download Selected (${selected.size})`}
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
        {loading ? (
          <div style={{gridColumn:"1/-1", textAlign:"center", padding:40, color:"#94a3b8"}}>Loading tickets...</div>
        ) : filtered.map(reg => (
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
              <div style={{ width: 160, height: 250, overflow: "hidden", borderRadius: 12 }}>
                <MiniTicket reg={reg} designerState={designerState}/>
              </div>
            </div>

            {/* Download button */}
            <button 
              onClick={() => handleDownloadPDF(reg)}
              style={{
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

      {!loading && filtered.length === 0 && (
        <div style={{
          textAlign:"center", padding:"48px 24px", color:"#94a3b8"
        }}>
          <div style={{fontSize:32, marginBottom:8}}>🎫</div>
          <div style={{fontWeight:700, fontSize:14, color:"#475569"}}>No tickets found</div>
          <div style={{fontSize:12, marginTop:4}}>Try adjusting your search</div>
        </div>
      )}

      {/* Hidden div for PDF generation */}
      <div style={{ position:"absolute", left:"-9999px", top:"-9999px" }}>
        {printData && (
          <div id="ticket-print-capture">
             <div style={{
              width:360, height:560, position:"relative",
              background: designerState.bgImage ? `url(${designerState.bgImage}) center/cover` : designerState.bgColor,
              padding:16
            }}>
              {designerState.fields.filter(f=>f.visible!==false).map(f => {
                const value = printData[f.id] || (f.id === "date" ? printData.eventDate : f.label);
                const isCentered = f.align === "center";
                return (
                  <div key={f.id} style={{
                    position:"absolute", left: isCentered ? "50%" : f.x, top: f.y,
                    transform: isCentered ? "translateX(-50%)" : "none",
                    textAlign: isCentered ? "center" : "left", width: isCentered ? "90%" : "auto"
                  }}>
                    {f.id === "branding" ? (
                       <div style={{ textAlign:"center" }}>
                         <p style={{ fontSize:10, color:"rgba(255,255,255,0.5)", margin:"0 0 4px 0", textTransform:"uppercase", letterSpacing:"0.1em" }}>Sponsored by</p>
                         <div style={{ background:"#fff", padding:4, borderRadius:6, display:"inline-block" }}>
                            <span style={{ fontSize:16, fontWeight:900, color:"#1d4ed8" }}>TSSIA</span>
                         </div>
                       </div>
                    ) : f.type === "image" ? (
                       <div style={{ 
                         width: f.width, height: f.height,
                         background: f.url ? `url(${f.url}) center/contain no-repeat` : "none"
                       }}/>
                    ) : f.id==="qr"
                      ? <QRPlaceholder value={printData.passcode} size={160}/>
                      : <span style={{ fontSize:f.fontSize, fontWeight:f.bold?"700":"400", color:f.color }}>{value}</span>}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function GenerateTickets() {
  const [tab, setTab] = useState("designer");
  const [registrations, setRegistrations] = useState([]);
  const [eventsList, setEventsList]       = useState([]);
  const [rawEvents, setRawEvents]         = useState([]);
  const [loading, setLoading]             = useState(true);

  // Shared Designer State
  const defaultTpl = TEMPLATES.find(t => t.id === "tssia");
  const [fields, setFields]     = useState(defaultTpl.fields.map(f => ({...f})));
  const [bgColor, setBgColor]   = useState(defaultTpl.bgColor);
  const [bgImage, setBgImage]   = useState(null);
  const [activeTpl, setActiveTpl] = useState("tssia");
  const [printData, setPrintData] = useState(null);

  const designerState = { fields, bgColor, bgImage };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [regRes, eventsRes] = await Promise.all([
          api.getAllRegistrations(1, 1000),
          api.getEvents(1, 100)
        ]);

        if (regRes.success) {
          // Filter only approved/attended for tickets
          setRegistrations(regRes.data
            .filter(r => r.status_name.toLowerCase() === "approved" || r.status_name.toLowerCase() === "attended")
            .map(r => ({
              id: r.registration_id,
              name: r.participant_name,
              mobile: r.participant_phone,
              designation: r.designation || "N/A",
              company: r.organization || "N/A",
              passcode: r.pass_number || `PASS-${r.registration_id}`,
              event: r.event_name,
              eventDate: new Date(r.event_start_date).toLocaleDateString("en-US", { month: 'long', day: 'numeric', year: 'numeric' }),
              address: r.event_address || "TSSIA House, MIDC"
            }))
          );
        }

        if (eventsRes.success) {
          setRawEvents(eventsRes.data);
          setEventsList(eventsRes.data.map(e => e.event_name));
        }
      } catch (error) {
        console.error("Error fetching ticket data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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
      {tab==="designer"   && (
        <DesignerSection 
          rawEvents={rawEvents}
          fields={fields} setFields={setFields}
          bgColor={bgColor} setBgColor={setBgColor}
          bgImage={bgImage} setBgImage={setBgImage}
          activeTpl={activeTpl} setActiveTpl={setActiveTpl}
        />
      )}
      {tab==="management" && (
        <ManagementSection 
          registrations={registrations} 
          eventsList={eventsList} 
          loading={loading}
          designerState={designerState}
          printData={printData}
          setPrintData={setPrintData}
        />
      )}
    </div>
  );
}
