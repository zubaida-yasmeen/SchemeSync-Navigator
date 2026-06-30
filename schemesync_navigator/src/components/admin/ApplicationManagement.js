import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button, Modal, Form, Alert, Spinner } from 'react-bootstrap';
import { FiEye, FiDownload, FiFilter } from 'react-icons/fi';
import api from '../../services/api';

const ApplicationManagement = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchApplications();
  }, [statusFilter]);

    const fetchApplications = async () => {
    try {
      setLoading(true);
      const url = statusFilter 
        ? `/applications/admin/?status=${statusFilter}`
        : '/applications/admin/';
      
      const response = await api.get(url);
      
      // Handle response - ensure it's always an array
      console.log('API Response:', response.data);
      
      if (Array.isArray(response.data)) {
        setApplications(response.data);
      } else if (response.data?.results && Array.isArray(response.data.results)) {
        setApplications(response.data.results);
      } else {
        console.error('Unexpected response format:', response.data);
        setApplications([]);
        setMessage({ type: 'warning', text: 'No applications found' });
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
      setApplications([]);
      setMessage({ type: 'danger', text: 'Failed to load applications' });
    } finally {
      setLoading(false);
    }
  };


  const handleViewDetails = (app) => {
    setSelectedApp(app);
    setShowModal(true);
  };

  const handleStatusUpdate = async (status) => {
    if (!selectedApp) return;

    try {
      setUpdating(true);
      await api.patch(`/applications/admin/${selectedApp.id}/`, { status });
      
      setMessage({ type: 'success', text: 'Status updated successfully!' });
      setApplications(prev =>
        prev.map(app =>
          app.id === selectedApp.id ? { ...app, status } : app
        )
      );
      setSelectedApp({ ...selectedApp, status });
      
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      setMessage({ type: 'danger', text: 'Failed to update status' });
    } finally {
      setUpdating(false);
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      'APPLIED': 'primary',
      'UNDER_REVIEW': 'warning',
      'APPROVED': 'success',
      'REJECTED': 'danger',
      'ON_HOLD': 'secondary'
    };
    return <Badge bg={variants[status] || 'secondary'}>{status.replace('_', ' ')}</Badge>;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <h2>Application Management</h2>
          <p className="text-muted">View and manage all scheme applications</p>
        </Col>
      </Row>

      {message.text && (
        <Alert variant={message.type} dismissible onClose={() => setMessage({ type: '', text: '' })}>
          {message.text}
        </Alert>
      )}

      {/* Filters */}
      <Card className="mb-4">
        <Card.Body>
          <Row className="align-items-center">
            <Col md={3}>
              <Form.Group>
                <Form.Label><FiFilter className="me-2" />Filter by Status</Form.Label>
                <Form.Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                  <option value="">All Applications</option>
                  <option value="APPLIED">Applied</option>
                  <option value="UNDER_REVIEW">Under Review</option>
                  <option value="APPROVED">Approved</option>
                  <option value="REJECTED">Rejected</option>
                  <option value="ON_HOLD">On Hold</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <div className="mt-4">
                <strong>Total: {applications.length}</strong> applications
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Applications Table */}
      <Card>
        <Card.Body>
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-3">Loading applications...</p>
            </div>
          ) : applications.length === 0 ? (
            <Alert variant="info">
              No applications found. {statusFilter && 'Try changing the filter.'}
            </Alert>
          ) : (
            <Table responsive hover>
              <thead>
                <tr>
                  <th>Application ID</th>
                  <th>Applicant</th>
                  <th>Scheme</th>
                  <th>Applied Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app.id}>
                    <td><code>{app.application_id}</code></td>
                    <td>
                      <div>
                        <strong>{app.user_details?.first_name} {app.user_details?.last_name}</strong>
                        <div className="small text-muted">{app.user_details?.email}</div>
                      </div>
                    </td>
                    <td>{app.scheme_details?.name}</td>
                    <td>{formatDate(app.applied_date)}</td>
                    <td>{getStatusBadge(app.status)}</td>
                    <td>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => handleViewDetails(app)}
                      >
                        <FiEye className="me-1" />
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

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
                  <h6 className="text-primary">Applicant Information</h6>
                  <p><strong>Name:</strong> {selectedApp.user_details?.first_name} {selectedApp.user_details?.last_name}</p>
                  <p><strong>Email:</strong> {selectedApp.user_details?.email}</p>
                  <p><strong>Phone:</strong> {selectedApp.user_details?.phone}</p>
                </Col>
                <Col md={6}>
                  <h6 className="text-primary">Application Information</h6>
                  <p><strong>Application ID:</strong> <code>{selectedApp.application_id}</code></p>
                  <p><strong>Scheme:</strong> {selectedApp.scheme_details?.name}</p>
                  <p><strong>Applied Date:</strong> {formatDate(selectedApp.applied_date)}</p>
                  <p><strong>Status:</strong> {getStatusBadge(selectedApp.status)}</p>
                </Col>
              </Row>

              <hr />

               <h6 className="text-primary mb-3">📝 Application Information</h6>
              {selectedApp.form_data && Object.keys(selectedApp.form_data).length > 0 ? (
                <Table bordered hover responsive className="mb-3">
                  <thead className="table-primary">
                    <tr>
                      <th style={{ width: '40%' }}>Information</th>
                      <th>Submitted Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(selectedApp.form_data).map(([key, value]) => (
                      <tr key={key}>
                        <td className="fw-semibold" style={{ textTransform: 'capitalize' }}>
                          {key.replace(/_/g, ' ')}
                        </td>

                        <td>{typeof value === 'object' ? (value.value || JSON.stringify(value)) : (value || 'Not provided')}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <Alert variant="info">No form data submitted</Alert>
              )}



              <hr />

              <h6 className="text-primary">Uploaded Documents</h6>
              {selectedApp.documents && selectedApp.documents.length > 0 ? (
                <Table size="sm">
                  <thead>
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
                        <td>{doc.field_name}</td>
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

              <hr />

                           <h6 className="text-primary">Update Status</h6>
              {selectedApp.status === 'APPROVED' ? (
                <Alert variant="success" className="mb-0">
                  <strong>✅ Application Approved</strong>
                  <p className="mb-0 mt-2">This application has been approved and cannot be modified further.</p>
                </Alert>
              ) : (
                <div className="d-flex gap-2 flex-wrap">
                  <Button
                    variant="warning"
                    size="sm"
                    onClick={() => handleStatusUpdate('UNDER_REVIEW')}
                    disabled={updating || selectedApp.status === 'UNDER_REVIEW'}
                  >
                    Under Review
                  </Button>
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => handleStatusUpdate('APPROVED')}
                    disabled={updating}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleStatusUpdate('REJECTED')}
                    disabled={updating || selectedApp.status === 'REJECTED'}
                  >
                    Reject
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleStatusUpdate('ON_HOLD')}
                    disabled={updating || selectedApp.status === 'ON_HOLD'}
                  >
                    On Hold
                  </Button>
                </div>
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

export default ApplicationManagement;
