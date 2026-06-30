import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiShield, FiUser, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';

const AdminLogin = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.classList.add('auth-page');
    document.body.classList.add('auth-page');
    
    return () => {
      document.documentElement.classList.remove('auth-page');
      document.body.classList.remove('auth-page');
    };
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await login(formData);
      
      if (response.user.is_staff || response.user.is_superuser) {
        navigate('/admin');
      } else {
        setError('Access denied. Admin privileges required.');
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Admin login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container" 
         style={{ background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)' }}>
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} sm={10} md={8} lg={6} xl={4}>
            <Card className="scheme-card border-0 shadow-lg auth-card">
              <Card.Body className="p-4">
                <div className="text-center mb-4">
                  <div className="mb-3">
                    <div className="bg-danger rounded-circle d-inline-flex p-3">
                      <FiShield className="text-white" size={28} />
                    </div>
                  </div>
                  <h3 className="text-danger fw-bold mb-2">Admin Access</h3>
                  <p className="text-muted mb-0">Secure login for administrators</p>
                </div>

                {error && <Alert variant="danger" className="py-2 mb-3">{error}</Alert>}

                <Form onSubmit={handleSubmit} className="form-scheme">
                  <Form.Group className="mb-3">
                    <Form.Label>Admin Username</Form.Label>
                    <div className="position-relative">
                      <FiUser className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                      <Form.Control
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        className="ps-5"
                        placeholder="Enter admin username"
                      />
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>Admin Password</Form.Label>
                    <div className="position-relative">
                      <FiLock className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                      <Form.Control
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="ps-5 pe-5"
                        placeholder="Enter admin password"
                      />
                      <Button
                        variant="link"
                        className="position-absolute top-50 end-0 translate-middle-y text-muted p-0 me-3 border-0 bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                        type="button"
                        tabIndex={-1}
                      >
                        {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                      </Button>
                    </div>
                  </Form.Group>

                  <Button
                    type="submit"
                    className="w-100 mb-3"
                    disabled={loading}
                    style={{ 
                      background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
                      border: 'none',
                      padding: '0.75rem 1.5rem',
                      borderRadius: '0.5rem',
                      fontWeight: '500',
                      color: 'white',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        <FiShield className="me-2" />
                        Admin Login
                      </>
                    )}
                  </Button>

                  <div className="text-center mb-3">
                    <Link to="/login" className="text-muted small">
                      ← Back to User Login
                    </Link>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AdminLogin;
