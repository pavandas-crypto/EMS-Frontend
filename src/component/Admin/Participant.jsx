import React, { useMemo, useState } from "react";
import {
  Badge,
  Button,
  Card,
  Col,
  Container,
  Dropdown,
  Form,
  InputGroup,
  Row,
  Table,
} from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

const mockParticipants = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@email.com",
    phone: "(555) 123-4567",
    organization: "Tech Corp",
    event: "Spring Conference",
    status: "Registered",
    approval: "Approved",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@email.com",
    phone: "(555) 234-5678",
    organization: "Innovation Labs",
    event: "Developer Hackathon",
    status: "Registered",
    approval: "Pending",
  },
  {
    id: 3,
    name: "Michael Johnson",
    email: "michael.j@email.com",
    phone: "(555) 345-6789",
    organization: "Global Industries",
    event: "Spring Conference",
    status: "Registered",
    approval: "Approved",
  },
  {
    id: 4,
    name: "Sarah Wilson",
    email: "sarah.w@email.com",
    phone: "(555) 456-7890",
    organization: "Creative Studios",
    event: "Marketing Workshop",
    status: "Cancelled",
    approval: "Denied",
  },
  {
    id: 5,
    name: "David Brown",
    email: "david.brown@email.com",
    phone: "(555) 567-8901",
    organization: "Finance Group",
    event: "Spring Conference",
    status: "Registered",
    approval: "Pending",
  },
  {
    id: 6,
    name: "Emily Davis",
    email: "emily.davis@email.com",
    phone: "(555) 678-9012",
    organization: "Health Solutions",
    event: "Developer Hackathon",
    status: "Registered",
    approval: "Approved",
  },
  {
    id: 7,
    name: "Christopher Lee",
    email: "chris.lee@email.com",
    phone: "(555) 789-0123",
    organization: "Tech Ventures",
    event: "Charity Gala",
    status: "Registered",
    approval: "Approved",
  },
  {
    id: 8,
    name: "Jessica Martinez",
    email: "jessica.m@email.com",
    phone: "(555) 890-1234",
    organization: "Marketing Hub",
    event: "Marketing Workshop",
    status: "Registered",
    approval: "Pending",
  },
];

function Participant() {
  const [participants, setParticipants] = useState(mockParticipants);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEvent, setSelectedEvent] = useState("All");
  const [selectedApproval, setSelectedApproval] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  const stats = useMemo(() => {
    const total = participants.length;
    const approved = participants.filter((p) => p.approval === "Approved").length;
    const pending = participants.filter((p) => p.approval === "Pending").length;
    const denied = participants.filter((p) => p.approval === "Denied").length;
    return { total, approved, pending, denied };
  }, [participants]);

  const filteredParticipants = useMemo(() => {
    return participants.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.organization.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesEvent = selectedEvent === "All" || p.event === selectedEvent;
      const matchesApproval = selectedApproval === "All" || p.approval === selectedApproval;
      const matchesStatus = selectedStatus === "All" || p.status === selectedStatus;

      return matchesSearch && matchesEvent && matchesApproval && matchesStatus;
    });
  }, [participants, searchTerm, selectedEvent, selectedApproval, selectedStatus]);

  const handleApprove = (id) => {
    setParticipants(
      participants.map((p) =>
        p.id === id ? { ...p, approval: "Approved" } : p
      )
    );
  };

  const handleReject = (id) => {
    setParticipants(
      participants.map((p) =>
        p.id === id ? { ...p, approval: "Denied" } : p
      )
    );
  };

  const handleDelete = (id) => {
    setParticipants(participants.filter((p) => p.id !== id));
  };

  const handleExport = () => {
    const csv = [
      ["Name", "Email", "Phone", "Organization", "Event", "Status", "Approval"],
      ...filteredParticipants.map((p) => [
        p.name,
        p.email,
        p.phone,
        p.organization,
        p.event,
        p.status,
        p.approval,
      ]),
    ]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `participants_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getApprovalBadge = (approval) => {
    const variants = {
      Approved: "success",
      Pending: "warning",
      Denied: "danger",
    };
    return <Badge bg={variants[approval] || "secondary"}>{approval}</Badge>;
  };

  const events = Array.from(new Set(participants.map((p) => p.event)));

  return (
    <div style={{ backgroundColor: "#f5f3f0", minHeight: "100vh", paddingBottom: "40px" }}>
      {/* Header */}
      <div style={{ backgroundColor: "#1e3a5f", color: "white", padding: "40px 0" }}>
        <Container>
          <h1 className="mb-2" style={{ fontSize: "2.5rem", fontWeight: "700" }}>
            Participants
          </h1>
          <p className="mb-0" style={{ fontSize: "1rem", opacity: 0.9 }}>
            Manage event registrations, approvals, and participant details
          </p>
        </Container>
      </div>

      <Container style={{ paddingTop: "40px" }}>
        {/* Summary Cards */}
        <Row className="mb-5 gy-4">
          {[
            { label: "Total Participants", value: stats.total, color: "#1e3a5f", icon: "bi-people" },
            { label: "Approved", value: stats.approved, color: "#22c55e", icon: "bi-check-circle" },
            { label: "Pending", value: stats.pending, color: "#eab308", icon: "bi-clock" },
            { label: "Denied", value: stats.denied, color: "#ef4444", icon: "bi-x-circle" },
          ].map((stat, idx) => (
            <Col key={idx} xs={12} sm={6} lg={3}>
              <Card
                style={{
                  border: "none",
                  borderRadius: "12px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
                }}
              >
                <Card.Body className="p-4">
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <p className="text-muted mb-2" style={{ fontSize: "0.9rem" }}>
                        {stat.label}
                      </p>
                      <h2 style={{ color: stat.color, fontWeight: "700", margin: "0" }}>
                        {stat.value}
                      </h2>
                    </div>
                    <div
                      style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "10px",
                        backgroundColor: `${stat.color}20`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <i className={`bi ${stat.icon}`} style={{ color: stat.color, fontSize: "1.5rem" }}></i>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Filters and Search */}
        <Card
          style={{
            border: "none",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
            marginBottom: "30px",
          }}
        >
          <Card.Body className="p-4">
            <Row className="gy-3">
              {/* Search Bar */}
              <Col xs={12} md={4}>
                <InputGroup>
                  <InputGroup.Text style={{ backgroundColor: "white", border: "1px solid #ddd" }}>
                    <i className="bi bi-search"></i>
                  </InputGroup.Text>
                  <Form.Control
                    placeholder="Search name, email, org…"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ border: "1px solid #ddd" }}
                  />
                </InputGroup>
              </Col>

              {/* Event Filter */}
              <Col xs={12} sm={6} md={2}>
                <Form.Select
                  value={selectedEvent}
                  onChange={(e) => setSelectedEvent(e.target.value)}
                  style={{ borderRadius: "6px", border: "1px solid #ddd" }}
                >
                  <option>All Events</option>
                  {events.map((event) => (
                    <option key={event} value={event}>
                      {event}
                    </option>
                  ))}
                </Form.Select>
              </Col>

              {/* Approval Filter */}
              <Col xs={12} sm={6} md={2}>
                <Form.Select
                  value={selectedApproval}
                  onChange={(e) => setSelectedApproval(e.target.value)}
                  style={{ borderRadius: "6px", border: "1px solid #ddd" }}
                >
                  <option>All Approvals</option>
                  <option>Approved</option>
                  <option>Pending</option>
                  <option>Denied</option>
                </Form.Select>
              </Col>

              {/* Status Filter */}
              <Col xs={12} sm={6} md={2}>
                <Form.Select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  style={{ borderRadius: "6px", border: "1px solid #ddd" }}
                >
                  <option>All Status</option>
                  <option>Registered</option>
                  <option>Cancelled</option>
                </Form.Select>
              </Col>

              {/* Export Button */}
              <Col xs={12} md={2} className="d-flex gap-2">
                <Button
                  variant="outline-secondary"
                  onClick={handleExport}
                  style={{ borderRadius: "6px", flex: 1 }}
                >
                  <i className="bi bi-download me-2"></i>Export
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Results Count */}
        <div className="mb-3">
          <p className="mb-0 text-muted">
            Showing <strong>{filteredParticipants.length}</strong> of{" "}
            <strong>{participants.length}</strong> participants
          </p>
        </div>

        {/* Participants Table */}
        <Card
          style={{
            border: "none",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
            overflow: "hidden",
          }}
        >
          <div style={{ overflowX: "auto" }}>
            <Table hover responsive className="mb-0">
              <thead style={{ backgroundColor: "#f9f7f5" }}>
                <tr>
                  <th style={{ borderBottom: "1px solid #e5e0d9", padding: "16px", fontWeight: "600", color: "#333" }}>
                    Name
                  </th>
                  <th style={{ borderBottom: "1px solid #e5e0d9", padding: "16px", fontWeight: "600", color: "#333" }}>
                    Email & Phone
                  </th>
                  <th style={{ borderBottom: "1px solid #e5e0d9", padding: "16px", fontWeight: "600", color: "#333" }}>
                    Organization
                  </th>
                  <th style={{ borderBottom: "1px solid #e5e0d9", padding: "16px", fontWeight: "600", color: "#333" }}>
                    Event
                  </th>
                  <th style={{ borderBottom: "1px solid #e5e0d9", padding: "16px", fontWeight: "600", color: "#333" }}>
                    Status
                  </th>
                  <th style={{ borderBottom: "1px solid #e5e0d9", padding: "16px", fontWeight: "600", color: "#333" }}>
                    Approval
                  </th>
                  <th style={{ borderBottom: "1px solid #e5e0d9", padding: "16px", fontWeight: "600", color: "#333" }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredParticipants.map((participant) => (
                  <tr key={participant.id}>
                    <td style={{ padding: "16px", borderBottom: "1px solid #e5e0d9" }}>
                      <strong>{participant.name}</strong>
                    </td>
                    <td style={{ padding: "16px", borderBottom: "1px solid #e5e0d9" }}>
                      <div style={{ fontSize: "0.9rem" }}>{participant.email}</div>
                      <div style={{ fontSize: "0.85rem", color: "#888" }}>{participant.phone}</div>
                    </td>
                    <td style={{ padding: "16px", borderBottom: "1px solid #e5e0d9" }}>
                      {participant.organization}
                    </td>
                    <td style={{ padding: "16px", borderBottom: "1px solid #e5e0d9" }}>
                      <span style={{ fontSize: "0.9rem" }}>{participant.event}</span>
                    </td>
                    <td style={{ padding: "16px", borderBottom: "1px solid #e5e0d9" }}>
                      <Badge bg={participant.status === "Registered" ? "info" : "secondary"}>
                        {participant.status}
                      </Badge>
                    </td>
                    <td style={{ padding: "16px", borderBottom: "1px solid #e5e0d9" }}>
                      {getApprovalBadge(participant.approval)}
                    </td>
                    <td style={{ padding: "16px", borderBottom: "1px solid #e5e0d9" }}>
                      <div className="d-flex gap-2">
                        <Button
                          variant="link"
                          size="sm"
                          title="View details"
                          style={{ color: "#1e3a5f", textDecoration: "none" }}
                        >
                          <i className="bi bi-eye"></i>
                        </Button>
                        {participant.approval !== "Approved" && (
                          <Button
                            variant="link"
                            size="sm"
                            title="Approve"
                            onClick={() => handleApprove(participant.id)}
                            style={{ color: "#22c55e", textDecoration: "none" }}
                          >
                            <i className="bi bi-check-circle"></i>
                          </Button>
                        )}
                        {participant.approval !== "Denied" && (
                          <Button
                            variant="link"
                            size="sm"
                            title="Reject"
                            onClick={() => handleReject(participant.id)}
                            style={{ color: "#ef4444", textDecoration: "none" }}
                          >
                            <i className="bi bi-x-circle"></i>
                          </Button>
                        )}
                        <Button
                          variant="link"
                          size="sm"
                          title="Delete"
                          onClick={() => handleDelete(participant.id)}
                          style={{ color: "#888", textDecoration: "none" }}
                        >
                          <i className="bi bi-trash"></i>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>

          {filteredParticipants.length === 0 && (
            <div style={{ padding: "40px", textAlign: "center", backgroundColor: "#fafaf8" }}>
              <i className="bi bi-inbox" style={{ fontSize: "2rem", color: "#ccc", marginBottom: "10px", display: "block" }}></i>
              <p className="text-muted mb-0">No participants found matching your filters</p>
            </div>
          )}
        </Card>
      </Container>
    </div>
  );
}

export default Participant;
