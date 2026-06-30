import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FiSave, FiArrowLeft } from 'react-icons/fi';
import api from '../../services/api';

const CreateScheme = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    scheme_type: 'CENTRAL',
    category: 'OTHER',
    ministry: '',
    income_groups: [],
    applicable_states: [],
    age_min: '',
    age_max: '',
    gender_applicable: [],
    benefits: '',
    eligibility_details: '',
    required_documents: '',
    application_process: '',
    official_website: '',
    helpline_number: '',
    is_active: true,
    launch_date: '',
    end_date: ''
  });

  const CATEGORIES = [
    { value: 'AGRICULTURE', label: 'Agriculture & Rural Development' },
    { value: 'EDUCATION', label: 'Education & Skill Development' },
    { value: 'HEALTH', label: 'Health & Nutrition' },
    { value: 'EMPLOYMENT', label: 'Employment & Livelihood' },
    { value: 'HOUSING', label: 'Housing & Urban Development' },
    { value: 'SOCIAL_SECURITY', label: 'Social Security & Welfare' },
    { value: 'WOMEN_CHILD', label: 'Women & Child Development' },
    { value: 'FINANCIAL', label: 'Financial Services' },
    { value: 'ENERGY', label: 'Energy & Environment' },
    { value: 'TRANSPORT', label: 'Transport & Infrastructure' },
    { value: 'OTHER', label: 'Other' }
  ];

  const INCOME_GROUPS = [
    { value: 'EWS', label: 'Economically Weaker Section' },
    { value: 'LIG', label: 'Low Income Group' },
    { value: 'MIG', label: 'Middle Income Group' },
    { value: 'OBC', label: 'Other Backward Class' },
    { value: 'SC', label: 'Scheduled Caste' },
    { value: 'ST', label: 'Scheduled Tribe' },
    { value: 'GENERAL', label: 'General Category' }
  ];

  const STATES = [
    { value: 'KA', label: 'Karnataka' },
    { value: 'MH', label: 'Maharashtra' },
    { value: 'TN', label: 'Tamil Nadu' },
    { value: 'UP', label: 'Uttar Pradesh' },
    { value: 'WB', label: 'West Bengal' }
  ];

  const GENDERS = [
    { value: 'MALE', label: 'Male' },
    { value: 'FEMALE', label: 'Female' },
    { value: 'OTHER', label: 'Other' }
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      if (name === 'income_groups' || name === 'applicable_states' || name === 'gender_applicable') {
        setFormData(prev => ({
          ...prev,
          [name]: checked 
            ? [...prev[name], value]
            : prev[name].filter(item => item !== value)
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          [name]: checked
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // Convert empty strings to null for optional fields
      const submitData = {
        ...formData,
        age_min: formData.age_min ? parseInt(formData.age_min) : null,
        age_max: formData.age_max ? parseInt(formData.age_max) : null,
        launch_date: formData.launch_date || null,
        end_date: formData.end_date || null,
        official_website: formData.official_website || null,
        helpline_number: formData.helpline_number || null
      };

      await api.post('/schemes/admin/create/', submitData);
      setMessage('Scheme created successfully!');
      
      setTimeout(() => {
        navigate('/admin/schemes');
      }, 2000);
    } catch (error) {
      setMessage('Error creating scheme. Please check all fields.');
      console.error('Error creating scheme:', error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <div className="d-flex align-items-center">
            <Button
              variant="outline-secondary"
              className="me-3"
              onClick={() => navigate('/admin/schemes')}
            >
              <FiArrowLeft />
            </Button>
            <div>
              <h2 className="text-primary fw-bold mb-1">Create New Scheme</h2>
              <p className="text-muted mb-0">Add a new government scheme to the system</p>
            </div>
          </div>
        </Col>
      </Row>

      {message && (
        <Alert variant={message.includes('success') ? 'success' : 'danger'}>
          {message}
        </Alert>
      )}

      <Form onSubmit={handleSubmit}>
        <Row>
          <Col lg={8}>
            <Card className="scheme-card mb-4">
              <Card.Header>
                <h5 className="mb-0">Basic Information</h5>
              </Card.Header>
              <Card.Body>
                <Form.Group className="mb-3">
                  <Form.Label>Scheme Name *</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter scheme name"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Description *</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    placeholder="Enter scheme description"
                  />
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Scheme Type *</Form.Label>
                      <Form.Select
                        name="scheme_type"
                        value={formData.scheme_type}
                        onChange={handleChange}
                        required
                      >
                        <option value="CENTRAL">Central Government</option>
                        <option value="STATE">State Government</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Category *</Form.Label>
                      <Form.Select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        required
                      >
                        {CATEGORIES.map(cat => (
                          <option key={cat.value} value={cat.value}>
                            {cat.label}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Ministry/Department *</Form.Label>
                  <Form.Control
                    type="text"
                    name="ministry"
                    value={formData.ministry}
                    onChange={handleChange}
                    required
                    placeholder="Enter responsible ministry or department"
                  />
                </Form.Group>
              </Card.Body>
            </Card>

            <Card className="scheme-card mb-4">
              <Card.Header>
                <h5 className="mb-0">Eligibility Criteria</h5>
              </Card.Header>
              <Card.Body>
                <Form.Group className="mb-3">
                  <Form.Label>Income Groups (Select applicable groups)</Form.Label>
                  <div className="row">
                    {INCOME_GROUPS.map(group => (
                      <div key={group.value} className="col-md-6 mb-2">
                        <Form.Check
                          type="checkbox"
                          name="income_groups"
                          value={group.value}
                          checked={formData.income_groups.includes(group.value)}
                          onChange={handleChange}
                          label={group.label}
                        />
                      </div>
                    ))}
                  </div>
                  <small className="text-muted">Leave empty if applicable to all income groups</small>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Applicable States (For state schemes)</Form.Label>
                  <div className="row">
                    {STATES.map(state => (
                      <div key={state.value} className="col-md-6 mb-2">
                        <Form.Check
                          type="checkbox"
                          name="applicable_states"
                          value={state.value}
                          checked={formData.applicable_states.includes(state.value)}
                          onChange={handleChange}
                          label={state.label}
                        />
                      </div>
                    ))}
                  </div>
                  <small className="text-muted">Leave empty for central schemes or all states</small>
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Minimum Age</Form.Label>
                      <Form.Control
                        type="number"
                        name="age_min"
                        value={formData.age_min}
                        onChange={handleChange}
                        min="0"
                        max="120"
                        placeholder="Minimum age requirement"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Maximum Age</Form.Label>
                      <Form.Control
                        type="number"
                        name="age_max"
                        value={formData.age_max}
                        onChange={handleChange}
                        min="0"
                        max="120"
                        placeholder="Maximum age limit"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Gender Applicability</Form.Label>
                  <div className="row">
                    {GENDERS.map(gender => (
                      <div key={gender.value} className="col-md-4 mb-2">
                        <Form.Check
                          type="checkbox"
                          name="gender_applicable"
                          value={gender.value}
                          checked={formData.gender_applicable.includes(gender.value)}
                          onChange={handleChange}
                          label={gender.label}
                        />
                      </div>
                    ))}
                  </div>
                  <small className="text-muted">Leave empty if applicable to all genders</small>
                </Form.Group>
              </Card.Body>
            </Card>

            <Card className="scheme-card mb-4">
              <Card.Header>
                <h5 className="mb-0">Scheme Details</h5>
              </Card.Header>
              <Card.Body>
                <Form.Group className="mb-3">
                  <Form.Label>Benefits *</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="benefits"
                    value={formData.benefits}
                    onChange={handleChange}
                    required
                    placeholder="Describe the benefits provided by this scheme"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Detailed Eligibility</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="eligibility_details"
                    value={formData.eligibility_details}
                    onChange={handleChange}
                    placeholder="Detailed eligibility criteria and conditions"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Required Documents</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="required_documents"
                    value={formData.required_documents}
                    onChange={handleChange}
                    placeholder="List of documents required for application"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Application Process</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="application_process"
                    value={formData.application_process}
                    onChange={handleChange}
                    placeholder="Step-by-step application process"
                  />
                </Form.Group>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4}>
            <Card className="scheme-card mb-4">
              <Card.Header>
                <h5 className="mb-0">Contact Information</h5>
              </Card.Header>
              <Card.Body>
                <Form.Group className="mb-3">
                  <Form.Label>Official Website</Form.Label>
                  <Form.Control
                    type="url"
                    name="official_website"
                    value={formData.official_website}
                    onChange={handleChange}
                    placeholder="https://example.gov.in"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Helpline Number</Form.Label>
                  <Form.Control
                    type="tel"
                    name="helpline_number"
                    value={formData.helpline_number}
                    onChange={handleChange}
                    placeholder="e.g., 1800-123-4567"
                  />
                </Form.Group>
              </Card.Body>
            </Card>

            <Card className="scheme-card mb-4">
              <Card.Header>
                <h5 className="mb-0">Status & Dates</h5>
              </Card.Header>
              <Card.Body>
                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleChange}
                    label="Active Scheme"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Launch Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="launch_date"
                    value={formData.launch_date}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>End Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="end_date"
                    value={formData.end_date}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Card.Body>
            </Card>

            <div className="d-grid gap-2">
              <Button
                type="submit"
                className="btn-scheme-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    Creating...
                  </>
                ) : (
                  <>
                    <FiSave className="me-2" />
                    Create Scheme
                  </>
                )}
              </Button>

              <Button
                variant="outline-secondary"
                onClick={() => navigate('/admin/schemes')}
              >
                Cancel
              </Button>
            </div>
          </Col>
        </Row>
      </Form>
    </Container>
  );
};

export default CreateScheme;
