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

const mockReports = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@email.com",
    phone: "(555) 123-4567",
    organization: "Tech Corp",
    event: "Spring Conference",
    status: "Registered",
    approval: "Approved",
    registeredDate: "2026-04-15",
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
    registeredDate: "2026-04-14",
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
    registeredDate: "2026-04-13",
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
    registeredDate: "2026-04-12",
  },
  {
    id: 5,
    name: "David Brown",
    email: "david.brown@email.com",
    phone: "(555) 567-8901",
    organization: "Finance Group",
    event: "Spring Conference",
    status: "Registered",
    approval: "Verified",
    registeredDate: "2026-04-11",
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
    registeredDate: "2026-04-10",
  },
  {
    id: 7,
    name: "Christopher Lee",
    email: "chris.lee@email.com",
    phone: "(555) 789-0123",
    organization: "Tech Ventures",
    event: "Charity Gala",
    status: "Registered",
    approval: "Verified",
    registeredDate: "2026-04-09",
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
    registeredDate: "2026-04-08",
  },
  {
    id: 9,
    name: "Robert Taylor",
    email: "robert.t@email.com",
    phone: "(555) 901-2345",
    organization: "Data Systems",
    event: "Spring Conference",
    status: "Registered",
    approval: "Approved",
    registeredDate: "2026-04-07",
  },
  {
    id: 10,
    name: "Amanda White",
    email: "amanda.w@email.com",
    phone: "(555) 012-3456",
    organization: "Design Studio",
    event: "Developer Hackathon",
    status: "Registered",
    approval: "Verified",
    registeredDate: "2026-04-06",
  },
];

function Report() {
  const [reports, setReports] = useState(mockReports);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEvent, setSelectedEvent] = useState("All");
  const [selectedApproval, setSelectedApproval] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const stats = useMemo(() => {
    const total = reports.length;
    const approved = reports.filter((r) => r.approval === "Approved").length;
    const pending = reports.filter((r) => r.approval === "Pending").length;
    const verified = reports.filter((r) => r.approval === "Verified").length;
    return { total, approved, pending, verified };
  }, [reports]);

  const filteredReports = useMemo(() => {
    return reports.filter((r) => {
      const matchesSearch =
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.organization.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesEvent = selectedEvent === "All" || r.event === selectedEvent;
      const matchesApproval = selectedApproval === "All" || r.approval === selectedApproval;
      const matchesStatus = selectedStatus === "All" || r.status === selectedStatus;

      return matchesSearch && matchesEvent && matchesApproval && matchesStatus;
    });
  }, [reports, searchTerm, selectedEvent, selectedApproval, selectedStatus]);

  const paginatedReports = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredReports.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredReports, currentPage]);

  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);

  const handleDownloadExcel = () => {
    // Mock Excel download - in real app, this would generate actual Excel file
    const csv = [
      ["Name", "Email", "Phone", "Organization", "Event", "Status", "Approval", "Registered Date"],
      ...filteredReports.map((r) => [
        r.name,
        r.email,
        r.phone,
        r.organization,
        r.event,
        r.status,
        r.approval,
        r.registeredDate,
      ]),
    ]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `reports_${new Date().toISOString().slice(0, 10)}.xlsx`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getApprovalBadge = (approval) => {
    const variants = {
      Approved: "success",
      Pending: "warning",
      Denied: "danger",
      Verified: "info",
    };
    return <Badge bg={variants[approval] || "secondary"}>{approval}</Badge>;
  };

  const events = Array.from(new Set(reports.map((r) => r.event)));

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Button
          key={i}
          variant={currentPage === i ? "primary" : "outline-primary"}
          size="sm"
          className="mx-1"
          onClick={() => setCurrentPage(i)}
        >
          {i}
        </Button>
      );
    }

    return (
      <div className="d-flex justify-content-center align-items-center mt-4">
        <Button
          variant="outline-primary"
          size="sm"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
          className="me-2"
        >
          <i className="bi bi-chevron-left"></i> Previous
        </Button>
        {pages}
        <Button
          variant="outline-primary"
          size="sm"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
          className="ms-2"
        >
          Next <i className="bi bi-chevron-right"></i>
        </Button>
      </div>
    );
  };

  return (
    <div className="container py-4">
      <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between mb-4 gap-3">
        <div>
          <h1 className="mb-1">Reports</h1>
          <p className="text-muted mb-0">Generate and download comprehensive participant reports</p>
        </div>

        <Button variant="success" onClick={handleDownloadExcel}>
          <i className="bi bi-file-earmark-excel me-2"></i>Download Excel (.xlsx)
        </Button>
      </div>

      {/* Summary Cards */}
      <Row className="mb-4 gy-3">
        {[
          { label: "Total Shown", value: stats.total, variant: "primary", icon: "bi-people" },
          { label: "Approved", value: stats.approved, variant: "success", icon: "bi-check-circle" },
          { label: "Pending", value: stats.pending, variant: "warning", icon: "bi-clock" },
          { label: "Verified", value: stats.verified, variant: "info", icon: "bi-shield-check" },
        ].map((stat, idx) => (
          <Col key={idx} xs={12} sm={6} lg={3}>
            <Card className="text-center shadow-sm">
              <Card.Body>
                <div className="d-flex align-items-center justify-content-center mb-2">
                  <i className={`bi ${stat.icon} fs-2 text-${stat.variant} me-2`}></i>
                  <div>
                    <div className="h4 mb-0 text-primary">{stat.value}</div>
                  </div>
                </div>
                <Card.Text className="text-muted mb-0">{stat.label}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Filters and Search */}
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Row className="gy-3">
            {/* Search Bar */}
            <Col xs={12} md={4}>
              <InputGroup>
                <InputGroup.Text>
                  <i className="bi bi-search"></i>
                </InputGroup.Text>
                <Form.Control
                  placeholder="Search name, email, org…"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>

            {/* Event Filter */}
            <Col xs={12} sm={6} md={2}>
              <Form.Select
                value={selectedEvent}
                onChange={(e) => setSelectedEvent(e.target.value)}
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
              >
                <option>All Approvals</option>
                <option>Approved</option>
                <option>Pending</option>
                <option>Denied</option>
                <option>Verified</option>
              </Form.Select>
            </Col>

            {/* Status Filter */}
            <Col xs={12} sm={6} md={2}>
              <Form.Select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option>All Status</option>
                <option>Registered</option>
                <option>Cancelled</option>
              </Form.Select>
            </Col>

            {/* Download Excel Button */}
            <Col xs={12} md={2} className="d-flex">
              <Button variant="success" onClick={handleDownloadExcel} className="w-100">
                <i className="bi bi-file-earmark-excel me-2"></i>Download Excel (.xlsx)
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Results Count */}
      <div className="mb-3">
        <span className="me-3">
          <strong>{filteredReports.length}</strong> report{filteredReports.length === 1 ? "" : "s"} found
        </span>
        <Badge bg="info" pill>
          Page {currentPage} of {totalPages}
        </Badge>
      </div>

      {/* Reports Table */}
      <Card className="shadow-sm">
        <div style={{ overflowX: "auto" }}>
          <Table hover responsive className="mb-0">
            <thead className="table-light">
              <tr>
                <th>Name</th>
                <th>Email & Phone</th>
                <th>Organization</th>
                <th>Event</th>
                <th>Status</th>
                <th>Approval</th>
                <th>Registered Date</th>
              </tr>
            </thead>
            <tbody>
              {paginatedReports.map((report) => (
                <tr key={report.id}>
                  <td>
                    <strong>{report.name}</strong>
                  </td>
                  <td>
                    <div className="small">{report.email}</div>
                    <div className="text-muted small">{report.phone}</div>
                  </td>
                  <td>{report.organization}</td>
                  <td>{report.event}</td>
                  <td>
                    <Badge bg={report.status === "Registered" ? "info" : "secondary"}>
                      {report.status}
                    </Badge>
                  </td>
                  <td>{getApprovalBadge(report.approval)}</td>
                  <td>{new Date(report.registeredDate).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>

        {paginatedReports.length === 0 && (
          <div className="text-center py-5">
            <i className="bi bi-file-earmark-x fs-1 text-muted mb-3 d-block"></i>
            <h5 className="text-muted mb-2">No reports found</h5>
            <p className="text-muted mb-0">Try adjusting your search criteria or filters to see more results.</p>
          </div>
        )}
      </Card>

      {/* Pagination */}
      {filteredReports.length > itemsPerPage && renderPagination()}
    </div>
  );
}

export default Report;