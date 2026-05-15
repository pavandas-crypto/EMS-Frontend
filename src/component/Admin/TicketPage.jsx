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
        {/* Content Area */}
        <div style={{ flex: 1, overflow: "hidden" }}>
          {activeTab === "designer" 
            ? <TicketDesigner onSwitchToManagement={() => setActiveTab("management")} activeTab={activeTab} /> 
            : <TicketManagement onSwitchToDesigner={() => setActiveTab("designer")} activeTab={activeTab} />
          }
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default TicketPage;
