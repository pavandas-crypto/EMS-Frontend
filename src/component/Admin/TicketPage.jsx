import { useState, Component } from "react";
import TicketDesigner from "./TicketDesigner";
import TicketManagement from "./TicketManagement";

// Simple Error Boundary to prevent white screen
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Ticketing System Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "4rem", textAlign: "center", background: "#181818", color: "#fff", height: "100vh" }}>
          <h2 style={{ color: "#ef4444" }}>Something went wrong in the Ticket System.</h2>
          <pre style={{ background: "#121212", padding: "1rem", borderRadius: "8px", marginTop: "1rem", overflow: "auto", maxWidth: "600px", margin: "1rem auto" }}>
            {this.state.error?.toString()}
          </pre>
          <button 
            onClick={() => window.location.reload()}
            style={{ padding: "0.75rem 1.5rem", borderRadius: "8px", background: "#6366f1", color: "#fff", border: "none", cursor: "pointer", fontWeight: 700 }}
          >
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const TicketPage = () => {
  const [activeTab, setActiveTab] = useState("designer");

  return (
    <ErrorBoundary>
      <div style={{ 
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex", 
        flexDirection: "column", 
        background: "#181818",
        zIndex: 10
      }}>
        {/* Sub-header with Tabs */}
        <div style={{ 
          background: "#121212", 
          padding: "1rem 2rem", 
          borderBottom: "1px solid #333", 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "space-between",
          flexShrink: 0
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "2.5rem" }}>
            <h1 style={{ fontSize: "1.2rem", fontWeight: 900, color: "#fff", margin: 0, letterSpacing: "-0.02em" }}>EMS Ticketing</h1>
            
            <nav style={{ display: "flex", gap: "1rem" }}>
              <button 
                onClick={() => setActiveTab("designer")}
                style={{ 
                  padding: "0.5rem 1rem", borderRadius: "8px", border: activeTab === "designer" ? "1px solid #6366f1" : "1px solid transparent", 
                  cursor: "pointer",
                  background: activeTab === "designer" ? "rgba(99, 102, 241, 0.1)" : "transparent",
                  color: activeTab === "designer" ? "#6366f1" : "#888",
                  fontWeight: 700, fontSize: "0.85rem",
                  transition: "all 0.2s"
                }}
              >
                Ticket Designer
              </button>
              <button 
                onClick={() => setActiveTab("management")}
                style={{ 
                  padding: "0.5rem 1rem", borderRadius: "8px", border: activeTab === "management" ? "1px solid #6366f1" : "1px solid transparent", 
                  cursor: "pointer",
                  background: activeTab === "management" ? "rgba(99, 102, 241, 0.1)" : "transparent",
                  color: activeTab === "management" ? "#6366f1" : "#888",
                  fontWeight: 700, fontSize: "0.85rem",
                  transition: "all 0.2s"
                }}
              >
                Ticket Management
              </button>
            </nav>
          </div>
          
          <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "#888", fontSize: "0.8rem" }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981" }}></div>
            Active System
          </div>
        </div>

        {/* Content Area */}
        <div style={{ flex: 1, overflow: "hidden" }}>
          {activeTab === "designer" ? <TicketDesigner /> : <TicketManagement />}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default TicketPage;
