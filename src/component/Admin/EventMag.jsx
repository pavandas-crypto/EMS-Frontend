import React, { useMemo, useState } from "react";
import { Badge, Button, Card, Col, Form, InputGroup, Modal, Row } from "react-bootstrap";

const initialEvents = [
  {
    id: 1,
    title: "Spring Tech Conference",
    date: "2026-05-21",
    venue: "Convention Center",
    status: "Upcoming",
    description: "A full-day event for networking, workshops, and keynote speeches.",
  },
  {
    id: 2,
    title: "Annual Charity Gala",
    date: "2025-12-15",
    venue: "Grand Ballroom",
    status: "Past",
    description: "An evening of fundraising, dinner, and awards for community causes.",
  },
  {
    id: 3,
    title: "Developer Hackathon",
    date: "2026-06-10",
    venue: "Innovation Lab",
    status: "Upcoming",
    description: "A 48-hour coding challenge for developers to build new products.",
  },
  {
    id: 4,
    title: "Marketing Workshop",
    date: "2026-01-19",
    venue: "Online",
    status: "Past",
    description: "A virtual workshop on digital marketing and growth strategies.",
  },
];

function EventMag() {
  const [events, setEvents] = useState(initialEvents);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("All");
  const [showCreate, setShowCreate] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: "", date: "", venue: "", status: "Upcoming", description: "" });

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.venue.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilter =
        filter === "All" ||
        event.status.toLowerCase() === filter.toLowerCase();

      return matchesSearch && matchesFilter;
    });
  }, [events, filter, searchTerm]);

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    const nextEvent = {
      id: events.length + 1,
      title: newEvent.title || "New Event",
      date: newEvent.date || new Date().toISOString().slice(0, 10),
      venue: newEvent.venue || "TBD",
      status: newEvent.status,
      description: newEvent.description || "Description coming soon.",
    };

    setEvents([nextEvent, ...events]);
    setNewEvent({ title: "", date: "", venue: "", status: "Upcoming", description: "" });
    setShowCreate(false);
  };

  const statusVariant = (status) => (status === "Upcoming" ? "success" : "secondary");

  return (
    <div className="container py-4">
      <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between mb-4 gap-3">
        <div>
          <h1 className="mb-1">Event Management</h1>
          <p className="text-muted mb-0">Manage events, search quickly, and view all past or upcoming sessions.</p>
        </div>

        <Button variant="primary" size="lg" onClick={() => setShowCreate(true)}>
          + Create Event
        </Button>
      </div>

      <Row className="align-items-center gy-3 mb-3">
        <Col xs={12} md={6}>
          <InputGroup>
            <Form.Control
              placeholder="Search events by title or venue"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button variant="outline-secondary" onClick={() => setSearchTerm("")}>Clear</Button>
          </InputGroup>
        </Col>

        <Col xs={12} md={6} className="d-flex flex-wrap gap-2 justify-content-md-end">
          {[{ label: "All", value: "All" }, { label: "Upcoming", value: "Upcoming" }, { label: "Past", value: "Past" }].map((option) => (
            <Button
              key={option.value}
              variant={filter === option.value ? "primary" : "outline-primary"}
              onClick={() => setFilter(option.value)}
            >
              {option.label}
            </Button>
          ))}
        </Col>
      </Row>

      <div className="mb-4">
        <span className="me-3">
          <strong>{filteredEvents.length}</strong> event{filteredEvents.length === 1 ? "" : "s"} found
        </span>
        <Badge bg="info" pill>
          {filter}
        </Badge>
      </div>

      <Row className="gy-4">
        {filteredEvents.map((event) => (
          <Col key={event.id} xs={12} md={6} lg={4}>
            <Card className="h-100 shadow-sm">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <Card.Title>{event.title}</Card.Title>
                  <Badge bg={statusVariant(event.status)}>{event.status}</Badge>
                </div>
                <Card.Subtitle className="mb-2 text-muted">{event.date}</Card.Subtitle>
                <Card.Text className="mb-2">{event.description}</Card.Text>
                <div className="text-secondary">Venue: {event.venue}</div>
              </Card.Body>
              <Card.Footer className="bg-white border-0 pt-0">
                <Button size="sm" variant="outline-primary">View details</Button>
              </Card.Footer>
            </Card>
          </Col>
        ))}

        {filteredEvents.length === 0 && (
          <Col xs={12}>
            <div className="alert alert-warning mb-0" role="alert">
              No events matched your search and filter criteria.
            </div>
          </Col>
        )}
      </Row>

      <Modal show={showCreate} onHide={() => setShowCreate(false)}>
        <Form onSubmit={handleCreateSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>Create Event</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3" controlId="eventTitle">
              <Form.Label>Event Name</Form.Label>
              <Form.Control
                type="text"
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                placeholder="Enter event title"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="eventDate">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                value={newEvent.date}
                onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="eventVenue">
              <Form.Label>Venue</Form.Label>
              <Form.Control
                type="text"
                value={newEvent.venue}
                onChange={(e) => setNewEvent({ ...newEvent, venue: e.target.value })}
                placeholder="Enter venue"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="eventStatus">
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={newEvent.status}
                onChange={(e) => setNewEvent({ ...newEvent, status: e.target.value })}
              >
                <option>Upcoming</option>
                <option>Past</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-0" controlId="eventDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={newEvent.description}
                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                placeholder="Add a short description"
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowCreate(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Event
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}

export default EventMag;
