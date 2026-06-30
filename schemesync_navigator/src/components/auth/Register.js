import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiUserPlus, FiCheck, FiEye, FiEyeOff } from 'react-icons/fi';
import PasswordStrength from '../common/PasswordStrength';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    phone: '',
    income_group: '',
    state: '',
    age: '',
    gender: '',
    password: '',
    password_confirm: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  // Use state abbreviations for backend compatibility!
  const STATES = [
    { value: 'KA', label: 'Karnataka' },
    { value: 'MH', label: 'Maharashtra' },
    { value: 'TN', label: 'Tamil Nadu' },
    { value: 'UP', label: 'Uttar Pradesh' },
    { value: 'WB', label: 'West Bengal' },
    { value: 'GJ', label: 'Gujarat' },
    { value: 'RJ', label: 'Rajasthan' },
    { value: 'MP', label: 'Madhya Pradesh' },
    { value: 'AP', label: 'Andhra Pradesh' },
    { value: 'TS', label: 'Telangana' },
    { value: 'KL', label: 'Kerala' },
    { value: 'OR', label: 'Odisha' },
    { value: 'PB', label: 'Punjab' },
    { value: 'HR', label: 'Haryana' },
    { value: 'DL', label: 'Delhi' }
    // Add more as required
  ];

  useEffect(() => {
    document.documentElement.classList.add('auth-page-scrollable');
    document.body.classList.add('auth-page-scrollable');
    return () => {
      document.documentElement.classList.remove('auth-page-scrollable');
      document.body.classList.remove('auth-page-scrollable');
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setSuccess('');

    if (formData.password !== formData.password_confirm) {
      setErrors({ password_confirm: "Passwords don't match. Please make sure both passwords are identical." });
      setLoading(false);
      return;
    }

    try {
      const response = await register(formData);
      setSuccess(response.message || 'Account created successfully! Welcome to Scheme Seva.');
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      if (err.response?.data) {
        const errorData = err.response.data;
        if (typeof errorData === 'object' && !errorData.error && !errorData.detail) {
          const processedErrors = {};
          Object.keys(errorData).forEach(key => {
            if (Array.isArray(errorData[key])) {
              processedErrors[key] = errorData[key][0];
            } else {
              processedErrors[key] = errorData[key];
            }
          });
          setErrors(processedErrors);
        } else {
          const errorMessage = errorData.error || errorData.detail || 'Registration failed. Please try again.';
          setErrors({ general: errorMessage });
        }
      } else {
        setErrors({ general: 'Registration failed. Please check your internet connection and try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container"
         style={{
           background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
           minHeight: '100vh',
           padding: '40px 0'
         }}>
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} sm={11} md={10} lg={8} xl={7}>
            <Card className="scheme-card border-0 shadow-lg auth-card">
              <Card.Body className="p-4">
                <div className="text-center mb-4">
                  <div className="mb-3">
                    <div className="bg-primary rounded-circle d-inline-flex p-3">
                      <FiUserPlus className="text-white" size={28} />
                    </div>
                  </div>
                  <h3 className="text-primary fw-bold mb-2">Create Account</h3>
                  <p className="text-muted mb-0">Join Scheme Seva to access government benefits</p>
                </div>

                {errors.general && <Alert variant="danger" className="py-2 mb-3">{errors.general}</Alert>}
                {success && (
                  <Alert variant="success" className="py-2 mb-3 d-flex align-items-center">
                    <FiCheck className="me-2" />
                    {success}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit} className="form-scheme">
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">First Name *</Form.Label>
                        <Form.Control
                          type="text"
                          name="first_name"
                          value={formData.first_name}
                          onChange={handleChange}
                          required
                          placeholder="Enter first name"
                          isInvalid={!!errors.first_name}
                        />
                        <Form.Control.Feedback type="invalid">{errors.first_name}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">Last Name *</Form.Label>
                        <Form.Control
                          type="text"
                          name="last_name"
                          value={formData.last_name}
                          onChange={handleChange}
                          required
                          placeholder="Enter last name"
                          isInvalid={!!errors.last_name}
                        />
                        <Form.Control.Feedback type="invalid">{errors.last_name}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">Username *</Form.Label>
                        <Form.Control
                          type="text"
                          name="username"
                          value={formData.username}
                          onChange={handleChange}
                          required
                          placeholder="Choose username"
                          isInvalid={!!errors.username}
                        />
                        <Form.Control.Feedback type="invalid">{errors.username}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">Email *</Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          placeholder="Enter email"
                          isInvalid={!!errors.email}
                        />
                        <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">Phone *</Form.Label>
                        <Form.Control
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                          placeholder="10-digit number"
                          maxLength="10"
                          isInvalid={!!errors.phone}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.phone}
                        </Form.Control.Feedback>
                        <Form.Text className="text-muted">
                          Must be exactly 10 digits
                        </Form.Text>
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">Age</Form.Label>
                        <Form.Control
                          type="number"
                          name="age"
                          value={formData.age}
                          onChange={handleChange}
                          placeholder="Age"
                          min="1"
                          max="100"
                          isInvalid={!!errors.age}
                        />
                        <Form.Control.Feedback type="invalid">{errors.age}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">Gender</Form.Label>
                        <Form.Select
                          name="gender"
                          value={formData.gender}
                          onChange={handleChange}
                          isInvalid={!!errors.gender}
                        >
                          <option value="">Select Gender</option>
                          <option value="MALE">Male</option>
                          <option value="FEMALE">Female</option>
                          <option value="OTHER">Other</option>
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">{errors.gender}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">Income Group / Category</Form.Label>
                        <Form.Select
                          name="income_group"
                          value={formData.income_group}
                          onChange={handleChange}
                          isInvalid={!!errors.income_group}
                        >
                          <option value="">Select Income Group</option>
                          <option value="EWS">Economically Weaker Section (EWS)</option>
                          <option value="LIG">Low Income Group (LIG)</option>
                          <option value="MIG">Middle Income Group (MIG)</option>
                          <option value="OBC">Other Backward Class (OBC)</option>
                          <option value="SC">Scheduled Caste (SC)</option>
                          <option value="ST">Scheduled Tribe (ST)</option>
                          <option value="GENERAL">General Category</option>
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">{errors.income_group}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">State</Form.Label>
                        <Form.Select
                          name="state"
                          value={formData.state}
                          onChange={handleChange}
                          isInvalid={!!errors.state}
                        >
                          <option value="">Select State</option>
                          {STATES.map(state => (
                            <option key={state.value} value={state.value}>
                              {state.label}
                            </option>
                          ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">{errors.state}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">Password *</Form.Label>
                        <div className="position-relative">
                          <Form.Control
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            placeholder="Create password"
                            className="pe-5"
                            isInvalid={!!errors.password}
                          />
                          <Button
                            variant="link"
                            className="position-absolute top-50 end-0 translate-middle-y text-muted p-0 me-3 border-0 bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                            type="button"
                            tabIndex={-1}
                            style={{ zIndex: 10 }}
                          >
                            {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                          </Button>
                          <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                        </div>
                        <PasswordStrength 
                          password={formData.password} 
                          showStrength={formData.password.length > 0}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-4">
                        <Form.Label className="fw-semibold">Confirm Password *</Form.Label>
                        <div className="position-relative">
                          <Form.Control
                            type={showConfirmPassword ? "text" : "password"}
                            name="password_confirm"
                            value={formData.password_confirm}
                            onChange={handleChange}
                            required
                            placeholder="Confirm password"
                            className="pe-5"
                            isInvalid={!!errors.password_confirm}
                          />
                          <Button
                            variant="link"
                            className="position-absolute top-50 end-0 translate-middle-y text-muted p-0 me-3 border-0 bg-transparent"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            type="button"
                            tabIndex={-1}
                            style={{ zIndex: 10 }}
                          >
                            {showConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                          </Button>
                          <Form.Control.Feedback type="invalid">{errors.password_confirm}</Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Button
                    type="submit"
                    className="btn-scheme-primary w-100 mb-3"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        Creating Account...
                      </>
                    ) : (
                      <>
                        <FiUserPlus className="me-2" />
                        Create Account
                      </>
                    )}
                  </Button>

                  <div className="text-center">
                    <span className="text-muted">Already have an account? </span>
                    <Link to="/login" className="text-primary fw-semibold text-decoration-none">
                      Sign In
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

export default Register;
