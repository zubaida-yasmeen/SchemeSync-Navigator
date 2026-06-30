import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Badge, Modal, Alert } from 'react-bootstrap';
import { FiPlus, FiEdit, FiTrash2, FiEye, FiSearch } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import Form from 'react-bootstrap/Form';

const SchemeManagement = () => {
  const [schemes, setSchemes] = useState([]);
  const [filteredSchemes, setFilteredSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('view');
  const [message, setMessage] = useState('');

  const CATEGORIES = [
    { value: 'AGRICULTURE', label: 'Agriculture & Rural Development' },
    { value: 'EDUCATION', label: 'Education & Skill Development' },
    { value: 'HEALTH', label: 'Health & Nutrition' },
    { value: 'EMPLOYMENT', label: 'Employment & Livelihood' },
    { value: 'HOUSING', label: 'Housing & Urban Development' },
    { value: 'SOCIAL_SECURITY', label: 'Social Security & Welfare' },
    { value: 'WOMEN_CHILD', label: 'Women & Child Development' },
    { value: 'FINANCIAL', label: 'Financial Services' },
    { value: 'OTHER', label: 'Other' }
  ];

  useEffect(() => {
    fetchSchemes();
  }, []);

  const fetchSchemes = async () => {
    try {
      setLoading(true);
      const response = await api.get('/schemes/admin/list/');
      const schemesData = response.data.results || response.data;
      setSchemes(schemesData);
      setFilteredSchemes(schemesData);
    } catch (error) {
      console.error('Error fetching schemes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (searchTerm.trim() === '') {
      setFilteredSchemes(schemes);
      return;
    }

    const searchLower = searchTerm.toLowerCase();
    const filtered = schemes.filter(scheme => 
      scheme.name.toLowerCase().includes(searchLower) ||
      scheme.description.toLowerCase().includes(searchLower) ||
      scheme.ministry.toLowerCase().includes(searchLower) ||
      scheme.category.toLowerCase().includes(searchLower)
    );
    
    setFilteredSchemes(filtered);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setFilteredSchemes(schemes);
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/schemes/admin/${selectedScheme.id}/`);
      setMessage('Scheme deleted successfully');
      setShowModal(false);
      fetchSchemes();
    } catch (error) {
      setMessage('Error deleting scheme');
    }
  };

  const toggleSchemeStatus = async (scheme) => {
    try {
      await api.patch(`/schemes/admin/${scheme.id}/`, {
        is_active: !scheme.is_active
      });
      fetchSchemes();
    } catch (error) {
      console.error('Error updating scheme status:', error);
    }
  };

  const getSchemeTypeColor = (type) => {
    return type === 'CENTRAL' ? 'primary' : 'info';
  };

  const getCategoryColor = (category) => {
    const colors = {
      'AGRICULTURE': 'success',
      'EDUCATION': 'warning',
      'HEALTH': 'danger',
      'EMPLOYMENT': 'info',
      'HOUSING': 'secondary',
      'SOCIAL_SECURITY': 'dark',
      'WOMEN_CHILD': 'primary',
      'FINANCIAL': 'success',
      'OTHER': 'secondary'
    };
    return colors[category] || 'secondary';
  };

  if (loading) {
    return (
      <Container className="py-4 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <h5 className="text-muted mt-3">Loading schemes...</h5>
      </Container>
    );
  }

  return (
    <Container fluid className="py-3">
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="text-primary fw-bold mb-1">Scheme Management</h2>
              <p className="text-muted mb-0">Create, edit, and manage government schemes</p>
            </div>
            <Link to="/admin/schemes/create" className="btn btn-scheme-primary">
              <FiPlus className="me-2" />
              Create New Scheme
            </Link>
          </div>
        </Col>
      </Row>

      {message && (
        <Alert variant={message.includes('success') ? 'success' : 'danger'} dismissible onClose={() => setMessage('')}>
          {message}
        </Alert>
      )}

      {/* Search and Filters */}
      <Row className="mb-4">
        <Col>
          <Card className="scheme-card">
            <Card.Body>
              <div className="d-flex gap-3">
                <div className="flex-grow-1">
                  <Form.Control
                    type="text"
                    placeholder="Search schemes by name, description, ministry, or category..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      // Auto-search as user types
                      if (e.target.value.trim() === '') {
                        setFilteredSchemes(schemes);
                      }
                    }}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
                <Button className="btn-scheme-primary" onClick={handleSearch}>
                  <FiSearch className="me-2" />
                  Search
                </Button>
                <Button variant="outline-secondary" onClick={handleClearSearch}>
                  Clear
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Schemes Table */}
      <Row>
        <Col>
          <Card className="scheme-card">
            <Card.Header>
              <h5 className="mb-0">All Schemes ({filteredSchemes.length})</h5>
            </Card.Header>
            <Card.Body className="p-0">
              {filteredSchemes.length === 0 ? (
                <div className="text-center py-5">
                  <p className="text-muted">
                    {searchTerm ? 'No schemes found matching your search' : 'No schemes found'}
                  </p>
                  {searchTerm && (
                    <Button variant="outline-primary" onClick={handleClearSearch}>
                      Clear Search
                    </Button>
                  )}
                </div>
              ) : (
                <div className="table-responsive">
                  <Table className="mb-0">
                    <thead className="bg-light">
                      <tr>
                        <th>Scheme Details</th>
                        <th>Type & Category</th>
                        <th>Ministry</th>
                        <th>Status</th>
                        <th>Created</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSchemes.map(scheme => (
                        <tr key={scheme.id}>
                          <td>
                            <div>
                              <h6 className="mb-1 text-primary">{scheme.name}</h6>
                              <small className="text-muted line-clamp-2">
                                {scheme.description}
                              </small>
                            </div>
                          </td>
                          <td>
                            <div>
                              <Badge bg={getSchemeTypeColor(scheme.scheme_type)} className="mb-1">
                                {scheme.scheme_type}
                              </Badge>
                              <br />
                              <Badge bg={getCategoryColor(scheme.category)}>
                                {scheme.category.replace('_', ' ')}
                              </Badge>
                            </div>
                          </td>
                          <td>
                            <small className="text-muted">{scheme.ministry}</small>
                          </td>
                          <td>
                            <div className="d-flex flex-column gap-1">
                              <Badge bg={scheme.is_active ? 'success' : 'danger'}>
                                {scheme.is_active ? 'Active' : 'Inactive'}
                              </Badge>
                              <Button
                                size="sm"
                                variant={scheme.is_active ? 'outline-warning' : 'outline-success'}
                                onClick={() => toggleSchemeStatus(scheme)}
                              >
                                {scheme.is_active ? 'Deactivate' : 'Activate'}
                              </Button>
                            </div>
                          </td>
                          <td>
                            <small className="text-muted">
                              {new Date(scheme.created_at).toLocaleDateString()}
                            </small>
                          </td>
                          <td>
                            <div className="d-flex gap-1">
                              <Button
                                size="sm"
                                variant="outline-primary"
                                onClick={() => {
                                  setSelectedScheme(scheme);
                                  setModalType('view');
                                  setShowModal(true);
                                }}
                              >
                                <FiEye />
                              </Button>
                              <Link to={`/admin/schemes/edit/${scheme.id}`}>
                                <Button
                                  size="sm"
                                  variant="outline-secondary"
                                >
                                  <FiEdit />
                                </Button>
                              </Link>
                              <Button
                                size="sm"
                                variant="outline-danger"
                                onClick={() => {
                                  setSelectedScheme(scheme);
                                  setModalType('delete');
                                  setShowModal(true);
                                }}
                              >
                                <FiTrash2 />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modal for View/Delete */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>
            {modalType === 'view' && 'Scheme Details'}
            {modalType === 'delete' && 'Delete Scheme'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedScheme && (
            <>
              {modalType === 'view' && (
                <div>
                  <h5 className="text-primary">{selectedScheme.name}</h5>
                  <p className="text-muted">{selectedScheme.description}</p>
                  
                  <Row className="mb-3">
                    <Col md={6}>
                      <strong>Type:</strong> {selectedScheme.scheme_type}
                    </Col>
                    <Col md={6}>
                      <strong>Category:</strong> {selectedScheme.category.replace('_', ' ')}
                    </Col>
                  </Row>
                  
                  <Row className="mb-3">
                    <Col md={12}>
                      <strong>Ministry:</strong> {selectedScheme.ministry}
                    </Col>
                  </Row>
                  
                  <div className="mb-3">
                    <strong>Benefits:</strong>
                    <p>{selectedScheme.benefits}</p>
                  </div>
                  
                  <div className="mb-3">
                    <strong>Eligibility:</strong>
                    <p>{selectedScheme.eligibility_details}</p>
                  </div>
                  
                  {selectedScheme.official_website && (
                    <div className="mb-3">
                      <strong>Website:</strong>
                      <a href={selectedScheme.official_website} target="_blank" rel="noopener noreferrer" className="ms-2">
                        {selectedScheme.official_website}
                      </a>
                    </div>
                  )}
                </div>
              )}
              
              {modalType === 'delete' && (
                <div className="text-center">
                  <div className="text-danger mb-3">
                    <FiTrash2 size={48} />
                  </div>
                  <h5>Delete Scheme</h5>
                  <p>Are you sure you want to delete <strong>"{selectedScheme.name}"</strong>?</p>
                  <p className="text-muted">This action cannot be undone.</p>
                </div>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          {modalType === 'view' && selectedScheme && (
            <>
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Close
              </Button>
              <Link to={`/admin/schemes/edit/${selectedScheme.id}`} style={{ textDecoration: 'none' }}>
                <Button className="btn-scheme-primary">
                  Edit Scheme
                </Button>
              </Link>
            </>
          )}
          
          {modalType === 'delete' && (
            <>
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={handleDelete}>
                Delete Scheme
              </Button>
            </>
          )}
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default SchemeManagement;
