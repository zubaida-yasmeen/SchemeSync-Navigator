import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Badge } from 'react-bootstrap';
import { FiPlus, FiTrash2, FiSave, FiArrowLeft } from 'react-icons/fi';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';

const SchemeForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [schemeData, setSchemeData] = useState({
    name: '',
    description: '',
    scheme_type: 'CENTRAL',
    category: 'EDUCATION',
    ministry: '',
    benefits: '',
    eligibility_details: '',
    required_documents: '',
    application_process: '',
    official_website: '',
    helpline_number: '',
    is_active: true
  });

  const [customFields, setCustomFields] = useState([]);

  const FIELD_TYPES = [
    { value: 'text', label: 'Text Input' },
    { value: 'number', label: 'Number Input' },
    { value: 'textarea', label: 'Text Area' },
    { value: 'select', label: 'Dropdown Select' },
    { value: 'file', label: 'File Upload' }
  ];

  useEffect(() => {
    if (isEdit) {
      fetchScheme();
    }
  }, [id]);

  const fetchScheme = async () => {
    try {
      const response = await api.get(`/schemes/${id}/`);
      setSchemeData(response.data);
      
      // Load existing custom fields
      if (response.data.custom_form_fields?.fields) {
        const fields = response.data.custom_form_fields.fields.map(field => ({
          ...field,
          options_string: field.options ? field.options.join(', ') : ''
        }));
        setCustomFields(fields);
      }
    } catch (error) {
      setMessage({ type: 'danger', text: 'Failed to load scheme data' });
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSchemeData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Add new custom field
  const addCustomField = () => {
    setCustomFields(prev => [...prev, {
      field_name: '',
      field_type: 'text',
      label: '',
      required: false,
      placeholder: '',
      options: [],
      options_string: '',
      accept: '.pdf,.jpg,.png'
    }]);
  };

  // Remove custom field
  const removeCustomField = (index) => {
    setCustomFields(prev => prev.filter((_, i) => i !== index));
  };

  // Update custom field
  const updateCustomField = (index, field, value) => {
    setCustomFields(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  // Handle options for select fields - store raw string
  const updateFieldOptions = (index, optionsString) => {
    // Store the raw string for editing
    updateCustomField(index, 'options_string', optionsString);
    // Parse to array for submission
    const optionsArray = optionsString.split(',').map(opt => opt.trim()).filter(opt => opt);
    updateCustomField(index, 'options', optionsArray);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Prepare custom fields - ensure options is array
      const processedFields = customFields.map(field => {
        const { options_string, ...rest } = field;
        return rest;
      });

      // Prepare data
      const submitData = {
        ...schemeData,
        custom_form_fields: {
          fields: processedFields
        }
      };

      if (isEdit) {
        // UPDATE: Use admin update endpoint
        await api.put(`/schemes/admin/${id}/`, submitData);
        setMessage({ type: 'success', text: 'Scheme updated successfully!' });
      } else {
        // CREATE: Use admin create endpoint
        await api.post('/schemes/admin/create/', submitData);
        setMessage({ type: 'success', text: 'Scheme created successfully!' });
        setTimeout(() => navigate('/admin/schemes'), 2000);
      }
    } catch (error) {
      setMessage({ 
        type: 'danger', 
        text: error.response?.data?.detail || 'Failed to save scheme' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <h2>{isEdit ? 'Edit Scheme' : 'Create New Scheme'}</h2>
            <Button variant="secondary" onClick={() => navigate('/admin/schemes')}>
              <FiArrowLeft className="me-2" />
              Back to Schemes
            </Button>
          </div>
        </Col>
      </Row>

      {message.text && (
        <Alert variant={message.type} dismissible onClose={() => setMessage({ type: '', text: '' })}>
          {message.text}
        </Alert>
      )}

      <Form onSubmit={handleSubmit}>
        {/* Basic Scheme Details */}
        <Card className="mb-4">
          <Card.Header className="bg-primary text-white">
            <h5 className="mb-0">Scheme Details</h5>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Scheme Name *</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={schemeData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter scheme name"
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Type *</Form.Label>
                  <Form.Select
                    name="scheme_type"
                    value={schemeData.scheme_type}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="CENTRAL">Central Government</option>
                    <option value="STATE">State Government</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Category *</Form.Label>
                  <Form.Select
                    name="category"
                    value={schemeData.category}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="EDUCATION">Education</option>
                    <option value="HEALTH">Health</option>
                    <option value="HOUSING">Housing</option>
                    <option value="EMPLOYMENT">Employment</option>
                    <option value="AGRICULTURE">Agriculture</option>
                    <option value="FINANCIAL">Financial</option>
                    <option value="SOCIAL_SECURITY">Social Security</option>
                    <option value="WOMEN_CHILD">Women & Child</option>
                    <option value="OTHER">Other</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Ministry *</Form.Label>
                  <Form.Control
                    type="text"
                    name="ministry"
                    value={schemeData.ministry}
                    onChange={handleInputChange}
                    required
                    placeholder="Ministry name"
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Official Website</Form.Label>
                  <Form.Control
                    type="url"
                    name="official_website"
                    value={schemeData.official_website}
                    onChange={handleInputChange}
                    placeholder="https://..."
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Helpline Number</Form.Label>
                  <Form.Control
                    type="text"
                    name="helpline_number"
                    value={schemeData.helpline_number}
                    onChange={handleInputChange}
                    placeholder="1800-XXX-XXXX"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Description *</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={schemeData.description}
                onChange={handleInputChange}
                required
                placeholder="Brief description of the scheme"
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Benefits *</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="benefits"
                    value={schemeData.benefits}
                    onChange={handleInputChange}
                    required
                    placeholder="List of benefits"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Eligibility Details *</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="eligibility_details"
                    value={schemeData.eligibility_details}
                    onChange={handleInputChange}
                    required
                    placeholder="Who can apply"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Required Documents *</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="required_documents"
                    value={schemeData.required_documents}
                    onChange={handleInputChange}
                    required
                    placeholder="Documents needed"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Application Process *</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="application_process"
                    value={schemeData.application_process}
                    onChange={handleInputChange}
                    required
                    placeholder="How to apply"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-0">
              <Form.Check
                type="checkbox"
                label="Active (users can see and apply)"
                name="is_active"
                checked={schemeData.is_active}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Card.Body>
        </Card>

        {/* Custom Application Fields */}
        <Card className="mb-4">
          <Card.Header className="bg-success text-white d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Application Form Fields</h5>
            <Button variant="light" size="sm" onClick={addCustomField}>
              <FiPlus className="me-1" />
              Add Field
            </Button>
          </Card.Header>
          <Card.Body>
            {customFields.length === 0 ? (
              <Alert variant="info">
                No custom fields added yet. Click "Add Field" to create application form fields.
              </Alert>
            ) : (
              customFields.map((field, index) => (
                <Card key={index} className="mb-3 border">
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <Badge bg="secondary">Field #{index + 1}</Badge>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => removeCustomField(index)}
                      >
                        <FiTrash2 />
                      </Button>
                    </div>

                    <Row>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Field Name (Internal) *</Form.Label>
                          <Form.Control
                            type="text"
                            value={field.field_name}
                            onChange={(e) => updateCustomField(index, 'field_name', e.target.value)}
                            required
                            placeholder="e.g., annual_income"
                          />
                          <Form.Text className="text-muted">
                            Use lowercase with underscores (no spaces)
                          </Form.Text>
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Field Type *</Form.Label>
                          <Form.Select
                            value={field.field_type}
                            onChange={(e) => updateCustomField(index, 'field_type', e.target.value)}
                            required
                          >
                            {FIELD_TYPES.map(type => (
                              <option key={type.value} value={type.value}>
                                {type.label}
                              </option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Label (Display Name) *</Form.Label>
                          <Form.Control
                            type="text"
                            value={field.label}
                            onChange={(e) => updateCustomField(index, 'label', e.target.value)}
                            required
                            placeholder="e.g., Annual Income"
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Placeholder Text</Form.Label>
                          <Form.Control
                            type="text"
                            value={field.placeholder}
                            onChange={(e) => updateCustomField(index, 'placeholder', e.target.value)}
                            placeholder="Hint text for user"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={3}>
                        <Form.Group className="mb-3">
                          <Form.Label>Required Field?</Form.Label>
                          <Form.Check
                            type="switch"
                            label={field.required ? 'Yes (Required *)' : 'No (Optional)'}
                            checked={field.required}
                            onChange={(e) => updateCustomField(index, 'required', e.target.checked)}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={3}>
                        {field.field_type === 'file' && (
                          <Form.Group className="mb-3">
                            <Form.Label>Accepted Files</Form.Label>
                            <Form.Control
                              type="text"
                              value={field.accept}
                              onChange={(e) => updateCustomField(index, 'accept', e.target.value)}
                              placeholder=".pdf,.jpg,.png"
                            />
                          </Form.Group>
                        )}
                      </Col>
                    </Row>

                    {field.field_type === 'select' && (
                      <Form.Group className="mb-0">
                        <Form.Label>Dropdown Options *</Form.Label>
                        <Form.Control
                          type="text"
                          value={field.options_string !== undefined ? field.options_string : field.options?.join(', ') || ''}
                          onChange={(e) => updateFieldOptions(index, e.target.value)}
                          required
                          placeholder="Option 1, Option 2, Option 3"
                        />
                        <Form.Text className="text-muted">
                          Separate options with commas (e.g., Below 5 Lakh, 5-10 Lakh, Above 10 Lakh)
                        </Form.Text>
                      </Form.Group>
                    )}
                  </Card.Body>
                </Card>
              ))
            )}
          </Card.Body>
        </Card>

        {/* Submit Buttons */}
        <div className="d-flex gap-2 justify-content-end">
          <Button variant="secondary" onClick={() => navigate('/admin/schemes')}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={loading}>
            <FiSave className="me-2" />
            {loading ? 'Saving...' : (isEdit ? 'Update Scheme' : 'Create Scheme')}
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default SchemeForm;
