import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer className="footer-gradient">
      <Container>
        <Row className="align-items-center py-3">
          <Col md={6}>
            <div className="d-flex align-items-center">
              <strong className="text-white me-2">SchemeSync_Navigator</strong>
              <small className="text-light opacity-75">
                Connecting citizens with government schemes
              </small>
            </div>
          </Col>
          <Col md={6} className="text-md-end">
            <small className="text-light opacity-75">
              © 2025 SchemeSync_Navigator. Built for the people.
            </small>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
