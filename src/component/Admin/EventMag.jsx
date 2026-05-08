import React, { useMemo, useState, useEffect } from "react";
import { Badge, Button, Card, Col, Form, InputGroup, Modal, Row } from "react-bootstrap";
import api from "../../api/api";

function EventMag() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("All");
  const [showCreate, setShowCreate] = useState(false);
  const [newEvent, setNewEvent] = useState({ 
    title: "", 
    date: "", 
    venue: "", 
    status: "Upcoming", 
    description: "",
    address: ""
  });

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await api.getEvents(1, 100);
      if (response.success) {
        setEvents(response.data.map(ev => ({
          id: ev.event_id,
          title: ev.event_name,
          date: ev.start_date_time.split('T')[0],
          venue: ev.address || "TBD",
          status: new Date(ev.start_date_time) > new Date() ? "Upcoming" : "Past",
          description: ev.description || "No description available."
        })));
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      const start = new Date(newEvent.date);
      const end = new Date(start.getTime() + 2 * 60 * 60 * 1000); // Default 2 hours duration

      const response = await api.createEvent({
        event_name: newEvent.title,
        description: newEvent.description,
        start_date_time: start.toISOString(),
        end_date_time: end.toISOString(),
        address: newEvent.venue,
        event_for: 'all'
      });

      if (response.success) {
        fetchEvents();
        setNewEvent({ title: "", date: "", venue: "", status: "Upcoming", description: "", address: "" });
        setShowCreate(false);
      }
    } catch (error) {
      alert("Failed to create event: " + error.message);
    }
  };

  const filteredEvents = useMemo(() => {
    return (events || []).filter((event) => {
      const matchesSearch = (event.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (event.venue || "").toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilter =
        filter === "All" ||
        (event.status || "").toLowerCase() === filter.toLowerCase();

      return matchesSearch && matchesFilter;
    });
  }, [events, filter, searchTerm]);

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
        {loading ? (
          <Col xs={12} className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2 text-muted">Fetching events from database...</p>
          </Col>
        ) : filteredEvents.length === 0 ? (
          <Col xs={12}>
            <div className="alert alert-warning mb-0" role="alert">
              No events matched your search and filter criteria.
            </div>
          </Col>
        ) : (
          filteredEvents.map((event) => (
            <Col key={event.id} xs={12} md={6} lg={4}>
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <Card.Title>{event.title}</Card.Title>
                    <Badge bg={statusVariant(event.status)}>{event.status}</Badge>
                  </div>
                  <Card.Subtitle className="mb-2 text-muted">{event.date}</Card.Subtitle>
                  <Card.Text className="mb-2 text-truncate-3">{event.description}</Card.Text>
                  <div className="text-secondary small">Venue: {event.venue}</div>
                </Card.Body>
                <Card.Footer className="bg-white border-0 pt-0 d-flex gap-2">
                  <Button size="sm" variant="outline-primary" href={`/admin/events/edit/${event.id}`}>Edit</Button>
                  <Button size="sm" variant="outline-secondary" href={`/event/${event.id}`} target="_blank">Preview</Button>
                </Card.Footer>
              </Card>
            </Col>
          ))
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
