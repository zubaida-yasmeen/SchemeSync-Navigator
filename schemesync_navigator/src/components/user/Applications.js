import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Table, Button, Modal, Alert } from 'react-bootstrap';
import { FiFileText, FiTrendingUp, FiClock, FiDownload } from 'react-icons/fi';
import api from '../../services/api';

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await api.get('/applications/');
      // Handle both array and paginated responses
      if (Array.isArray(response.data)) {
        setApplications(response.data);
      } else if (response.data?.results) {
        setApplications(response.data.results);
      } else {
        setApplications([]);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'APPLIED': 'primary',
      'UNDER_REVIEW': 'warning',
      'APPROVED': 'success',
      'REJECTED': 'danger',
      'ON_HOLD': 'secondary',
    };
    return colors[status] || 'secondary';
  };

  const handleTrackStatus = (application) => {
    setSelectedApp(application);
    setShowModal(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <Container className="py-4 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <h5 className="text-muted mt-3">Loading applications...</h5>
      </Container>
    );
  }

  return (
    <Container className="py-3">
      <Row className="mb-4">
        <Col>
          <div className="d-flex align-items-center mb-3">
            <FiFileText className="text-primary me-3" size={32} />
            <div>
              <h2 className="text-primary fw-bold mb-1">My Applications</h2>
              <p className="text-muted mb-0">Track your scheme applications</p>
            </div>
          </div>
        </Col>
      </Row>

      {applications.length === 0 ? (
        <Row>
          <Col>
            <Card className="scheme-card text-center py-5">
              <Card.Body>
                <FiFileText className="text-muted mb-3" size={48} />
                <h5 className="text-muted">No Applications Found</h5>
                <p className="text-muted">You haven't applied for any schemes yet.</p>
                <Button href="/" className="btn-scheme-primary">
                  Browse Schemes
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      ) : (
        <Row>
          <Col>
            <Card className="scheme-card">
              <Card.Header className="bg-white">
                <h5 className="mb-0">Application History</h5>
              </Card.Header>
              <Card.Body className="p-0">
                <div className="table-responsive">
                  <Table className="mb-0">
                    <thead className="bg-light">
                      <tr>
                        <th>Scheme Name</th>
                        <th>Application ID</th>
                        <th>Status</th>
                        <th>Applied Date</th>
                        <th>Last Updated</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {applications.map(app => (
                        <tr key={app.id}>
                          <td>
                            <div>
                              <strong className="text-primary">
                                {app.scheme_details?.name}
                              </strong>
                              <br />
                              <small className="text-muted">
                                {app.scheme_details?.ministry}
                              </small>
                            </div>
                          </td>
                          <td>
                            <code className="bg-light px-2 py-1 rounded">
                              {app.application_id}
                            </code>
                          </td>
                          <td>
                            <Badge bg={getStatusColor(app.status)}>
                              {app.status.replace('_', ' ')}
                            </Badge>
                          </td>
                          <td>
                            <FiClock className="me-1 text-muted" />
                            {formatDate(app.applied_date)}
                          </td>
                          <td>
                            {formatDate(app.last_updated)}
                          </td>
                          <td>
                            <Button
                              variant="outline-primary"
                              size="sm"
                              onClick={() => handleTrackStatus(app)}
                            >
                              <FiTrendingUp className="me-1" />
                              Track Status
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Application Details Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>Application Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedApp && (
            <>
              <Row className="mb-3">
                <Col md={6}>
                  <h6 className="text-primary">Application Information</h6>
                  <p><strong>Application ID:</strong> <code>{selectedApp.application_id}</code></p>
                  <p><strong>Status:</strong> <Badge bg={getStatusColor(selectedApp.status)}>{selectedApp.status.replace('_', ' ')}</Badge></p>
                </Col>
                <Col md={6}>
                  <h6 className="text-primary">Scheme Information</h6>
                  <p><strong>Scheme:</strong> {selectedApp.scheme_details?.name || selectedApp.scheme?.name}</p>
                  <p><strong>Category:</strong> {selectedApp.scheme_details?.category || selectedApp.scheme?.category}</p>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={6}>
                  <p><strong>Applied Date:</strong> {formatDate(selectedApp.applied_date)}</p>
                </Col>
                <Col md={6}>
                  <p><strong>Last Updated:</strong> {formatDate(selectedApp.last_updated)}</p>
                </Col>
              </Row>

              <hr />

              {/* Application Information Table */}
              <h6 className="text-primary mb-3">📝 Application Information</h6>
              {selectedApp.form_data && Object.keys(selectedApp.form_data).length > 0 ? (
                <Table bordered hover responsive className="mb-3">
                  <thead className="table-primary">
                    <tr>
                      <th style={{ width: '40%' }}>Information Field</th>
                      <th>Submitted Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(selectedApp.form_data).map(([key, value]) => (
                      <tr key={key}>
                        <td className="fw-semibold" style={{ textTransform: 'capitalize' }}>
                          {key.replace(/_/g, ' ')}
                        </td>
                        <td>
                          {typeof value === 'object' 
                            ? (value.value || JSON.stringify(value)) 
                            : (value || 'Not provided')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <Alert variant="info">No form data available</Alert>
              )}

              <hr />

              {/* Uploaded Documents */}
              <h6 className="text-primary mb-3">📎 Uploaded Documents</h6>
              {selectedApp.documents && selectedApp.documents.length > 0 ? (
                <Table size="sm" bordered hover>
                  <thead className="table-light">
                    <tr>
                      <th>Field Name</th>
                      <th>File Name</th>
                      <th>Size</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedApp.documents.map((doc) => (
                      <tr key={doc.id}>
                        <td style={{ textTransform: 'capitalize' }}>{doc.field_name.replace(/_/g, ' ')}</td>
                        <td>{doc.original_filename}</td>
                        <td>{doc.file_size_display}</td>
                        <td>
                          <Button
                            variant="link"
                            size="sm"
                            href={doc.file_url}
                            target="_blank"
                          >
                            <FiDownload /> Download
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <Alert variant="info">No documents uploaded</Alert>
              )}

              {selectedApp.remarks && (
                <>
                  <hr />
                  <h6 className="text-primary">Admin Remarks</h6>
                  <Alert variant="warning">
                    {selectedApp.remarks}
                  </Alert>
                </>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Applications;
