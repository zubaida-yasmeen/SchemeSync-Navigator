import React, { useState } from 'react';
import { Card, Badge, Button, Modal, Row, Col } from 'react-bootstrap';
import { FiHeart, FiExternalLink, FiPhone, FiUsers } from 'react-icons/fi';
import SchemeApplicationForm from './SchemeApplicationForm';  // ✅ CORRECT
import api from '../../services/api';

const SchemeCard = ({ scheme, viewMode = 'grid', onApplicationSuccess }) => {
  const [showModal, setShowModal] = useState(false);
  const [isFavorite, setIsFavorite] = useState(scheme.is_favorite);
  const [showApplication, setShowApplication] = useState(false);

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

  const toggleFavorite = async () => {
    try {
      if (isFavorite) {
        await api.delete(`/schemes/${scheme.id}/favorite/`);
        setIsFavorite(false);
      } else {
        await api.post(`/schemes/${scheme.id}/favorite/`);
        setIsFavorite(true);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handleApplicationSuccess = (application) => {
    setShowApplication(false);
    if (onApplicationSuccess) {
      onApplicationSuccess();
    }
  };

  const CardContent = () => (
    <>
      <Card.Header className="border-0 bg-transparent pb-0">
        <div className="d-flex justify-content-between align-items-start">
          <div className="flex-grow-1">
            <Badge 
              bg={getSchemeTypeColor(scheme.scheme_type)} 
              className="mb-2"
            >
              {scheme.scheme_type === 'CENTRAL' ? 'Central Govt' : 'State Govt'}
            </Badge>
            <Badge 
              bg={getCategoryColor(scheme.category)} 
              className="mb-2 ms-2"
            >
              {scheme.category.replace('_', ' ')}
            </Badge>
          </div>
          <Button
            variant="link"
            className={`p-0 ${isFavorite ? 'text-danger' : 'text-muted'}`}
            onClick={toggleFavorite}
          >
            <FiHeart fill={isFavorite ? 'currentColor' : 'none'} size={20} />
          </Button>
        </div>
      </Card.Header>

      <Card.Body>
        <h5 className="card-title text-primary fw-bold mb-2 line-clamp-2">
          {scheme.name}
        </h5>
        <p className="text-muted mb-3 line-clamp-3">
          {scheme.description}
        </p>
        
        <div className="mb-3">
          <small className="text-muted d-block">
            <FiUsers className="me-1" />
            Ministry: {scheme.ministry}
          </small>
        </div>

        <div className="mb-3">
          <strong className="text-success">Benefits:</strong>
          <p className="mb-0 small line-clamp-2">{scheme.benefits}</p>
        </div>

        <div className="d-flex gap-2">
          <Button
            className="btn-scheme-primary flex-grow-1"
            size="sm"
            onClick={() => setShowModal(true)}
          >
            View Details
          </Button>
          <Button
            className="btn-scheme-outline"
            size="sm"
            onClick={() => setShowApplication(true)}
          >
            Apply Now
          </Button>
        </div>
      </Card.Body>
    </>
  );

  return (
    <>
      <Card className={`scheme-card h-100 ${viewMode === 'list' ? 'mb-3' : ''}`}>
        {viewMode === 'list' ? (
          <Row className="g-0">
            <Col md={8}>
              <CardContent />
            </Col>
            <Col md={4} className="d-flex align-items-center justify-content-center p-3">
              <div className="text-center">
                <div className="text-primary mb-2">
                  <FiExternalLink size={24} />
                </div>
                <small className="text-muted">
                  {scheme.scheme_type} Scheme
                </small>
              </div>
            </Col>
          </Row>
        ) : (
          <CardContent />
        )}
      </Card>

      {/* Scheme Details Modal */}
      {/* Scheme Details Modal */}
<Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
  <Modal.Header closeButton className="bg-primary text-white">
    <Modal.Title>{scheme.name}</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <Row>
      <Col md={6}>
        <h6 className="text-primary">Basic Information</h6>
        <p><strong>Type:</strong> {scheme.scheme_type} Government</p>
        <p><strong>Category:</strong> {scheme.category.replace('_', ' ')}</p>
        <p><strong>Ministry:</strong> {scheme.ministry}</p>
        
        <h6 className="text-primary mt-4">Contact Information</h6>
        {scheme.official_website && (
          <p>
            <strong>Website:</strong> 
            <a href={scheme.official_website} target="_blank" rel="noopener noreferrer" className="ms-2">
              <FiExternalLink className="me-1" />
              Visit Website
            </a>
          </p>
        )}
        {scheme.helpline_number && (
          <p>
            <strong>Helpline:</strong> 
            <span className="ms-2">
              <FiPhone className="me-1" />
              {scheme.helpline_number}
            </span>
          </p>
        )}
      </Col>
      <Col md={6}>
        <h6 className="text-primary">Eligibility</h6>
        <p>{scheme.eligibility_details}</p>
        
        <h6 className="text-primary mt-4">Required Documents</h6>
        <p>{scheme.required_documents}</p>
      </Col>
    </Row>
    
    <hr />
    
    <h6 className="text-primary">Benefits</h6>
    <p>{scheme.benefits}</p>
    
    <h6 className="text-primary">Application Process</h6>
    <p>{scheme.application_process}</p>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={() => setShowModal(false)}>
      Close
    </Button>
    <Button className="btn-scheme-primary" onClick={() => {
      setShowModal(false);
      setShowApplication(true);
    }}>
      Apply for this Scheme
    </Button>
  </Modal.Footer>
</Modal>
{/* Scheme Details Modal */}
<Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
  <Modal.Header closeButton className="bg-primary text-white">
    <Modal.Title>{scheme.name}</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <Row>
      <Col md={6}>
        <h6 className="text-primary">Basic Information</h6>
        <p><strong>Type:</strong> {scheme.scheme_type} Government</p>
        <p><strong>Category:</strong> {scheme.category.replace('_', ' ')}</p>
        <p><strong>Ministry:</strong> {scheme.ministry}</p>
        
        <h6 className="text-primary mt-4">Contact Information</h6>
        {scheme.official_website && (
          <p>
            <strong>Website:</strong> 
            <a href={scheme.official_website} target="_blank" rel="noopener noreferrer" className="ms-2">
              <FiExternalLink className="me-1" />
              Visit Website
            </a>
          </p>
        )}
        {scheme.helpline_number && (
          <p>
            <strong>Helpline:</strong> 
            <span className="ms-2">
              <FiPhone className="me-1" />
              {scheme.helpline_number}
            </span>
          </p>
        )}
      </Col>
      <Col md={6}>
        <h6 className="text-primary">Eligibility</h6>
        <p>{scheme.eligibility_details}</p>
        
        <h6 className="text-primary mt-4">Required Documents</h6>
        <p>{scheme.required_documents}</p>
      </Col>
    </Row>
    
    <hr />
    
    <h6 className="text-primary">Benefits</h6>
    <p>{scheme.benefits}</p>
    
    <h6 className="text-primary">Application Process</h6>
    <p>{scheme.application_process}</p>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={() => setShowModal(false)}>
      Close
    </Button>
    <Button className="btn-scheme-primary" onClick={() => {
      setShowModal(false);
      setShowApplication(true);
    }}>
      Apply for this Scheme
    </Button>
  </Modal.Footer>
</Modal>


      {/* Application Modal */}
      <Modal 
        show={showApplication} 
        onHide={() => setShowApplication(false)}
        size="xl"
        centered
        scrollable
      >
        <Modal.Header closeButton>
          <Modal.Title>Apply for {scheme.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: '75vh', overflowY: 'auto' }}>
          <SchemeApplicationForm
            scheme={scheme}
            onSuccess={handleApplicationSuccess}
            onCancel={() => setShowApplication(false)}
          />
        </Modal.Body>
      </Modal>
    </>
  );
};

export default SchemeCard;
