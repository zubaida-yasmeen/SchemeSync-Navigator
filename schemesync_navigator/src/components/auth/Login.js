import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiUser, FiLock, FiLogIn, FiEye, FiEyeOff } from 'react-icons/fi';

const Login = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
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
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await login(formData);
      
      // Check if user is admin/staff - block them from regular login
      if (response.user.is_staff || response.user.is_superuser) {
        setError('Admin users cannot login here. Please use the Admin Login page.');
        // Logout the admin user
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setLoading(false);
        return;
      }
      
      setSuccess(response.message || 'Login successful!');
      
      setTimeout(() => {
        navigate('/');
      }, 1000);
      
    } catch (err) {
      const errorMessage = err.response?.data?.error || 
                          err.response?.data?.detail || 
                          'Login failed. Please check your credentials and try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container" 
         style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} sm={10} md={8} lg={6} xl={4}>
            <Card className="scheme-card border-0 shadow-lg auth-card">
              <Card.Body className="p-4">
                <div className="text-center mb-4">
                  <div className="mb-3">
                    <div className="bg-primary rounded-circle d-inline-flex p-1">
                      <FiUser className="text-white" size={28} />
                    </div>
                    <h3 className="text-primary fw-bold mb-0">Scheme Seva</h3>
                    <p className="text-muted mb-0">Sign in to access government schemes</p>
                  </div>
                </div>

                {error && <Alert variant="danger" className="py-1 mb-2">{error}</Alert>}
                {success && <Alert variant="success" className="py-1 mb-2">{success}</Alert>}

                <Form onSubmit={handleSubmit} className="form-scheme">
                  <Form.Group className="mb-2">
                    <Form.Label>Username</Form.Label>
                    <div className="position-relative">
                      <FiUser className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                      <Form.Control
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        className="ps-5"
                        placeholder="Enter your username"
                      />
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>Password</Form.Label>
                    <div className="position-relative">
                      <FiLock className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                      <Form.Control
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="ps-5 pe-5"
                        placeholder="Enter your password"
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
                    className="btn-scheme-primary w-100 mb-3"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        Signing In...
                      </>
                    ) : (
                      <>
                        <FiLogIn className="me-2" />
                        Sign In
                      </>
                    )}
                  </Button>

                  <div className="text-center mb-3">
                    <span className="text-muted">Don't have an account? </span>
                    <Link to="/register" className="text-primary fw-semibold text-decoration-none">
                      Sign Up
                    </Link>
                  </div>

                  <hr className="my-3" />
                  
                  <div className="text-center">
                    <Link to="/admin-login" className="text-secondary small">
                      Admin Login
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

export default Login;
