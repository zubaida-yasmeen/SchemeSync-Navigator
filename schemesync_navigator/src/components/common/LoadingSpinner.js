import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const LoadingSpinner = () => {
  return (
    <Container fluid className="min-vh-100 d-flex align-items-center justify-content-center">
      <Row>
        <Col className="text-center">
          <div className="loading-spinner mx-auto mb-3"></div>
          <h5 className="text-muted">Loading...</h5>
        </Col>
      </Row>
    </Container>
  );
};

export default LoadingSpinner;
