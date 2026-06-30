import React, { useState } from 'react';
import { Form, Row, Col, Button, Alert, ProgressBar, Card } from 'react-bootstrap';
import { FiUpload, FiX, FiCheck, FiLock } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const SchemeApplicationForm = ({ scheme, onSuccess, onCancel }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({});
  const [files, setFiles] = useState({});
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Auto-populated fields from user profile
  const autoPopulatedFields = {
    first_name: { value: user?.first_name || '', label: 'First Name' },
    last_name: { value: user?.last_name || '', label: 'Last Name' },
    email: { value: user?.email || '', label: 'Email' },
    phone: { value: user?.phone || '', label: 'Phone Number' },
    state: { value: user?.state || '', label: 'State' },
    age: { value: user?.age || '', label: 'Age' },
    gender: { value: user?.gender || '', label: 'Gender' },
    income_group: { value: user?.income_group || '', label: 'Income Group' }
  };

  // ===== IMPROVED CUSTOM FIELDS PARSING =====
  console.log('🔍 Debugging scheme data:');
  console.log('Full scheme:', scheme);
  console.log('custom_form_fields:', scheme.custom_form_fields);
  console.log('Type:', typeof scheme.custom_form_fields);

  let customFields = [];
  
  if (scheme.custom_form_fields) {
    try {
      let fieldsData = scheme.custom_form_fields;
      
      // If it's a string, parse it
      if (typeof fieldsData === 'string') {
        console.log('⚠️ Parsing string to JSON');
        fieldsData = JSON.parse(fieldsData);
      }
      
      // Extract fields array
      if (fieldsData && fieldsData.fields && Array.isArray(fieldsData.fields)) {
        customFields = fieldsData.fields;
        console.log('✅ Successfully loaded custom fields:', customFields);
      } else {
        console.log('❌ No fields array found in:', fieldsData);
      }
    } catch (error) {
      console.error('❌ Error parsing custom fields:', error);
    }
  } else {
    console.log('⚠️ No custom_form_fields in scheme');
  }
  
  console.log('📋 Final custom fields count:', customFields.length);
  console.log('📋 Fields:', customFields);
  // ===== END PARSING =====

  const handleInputChange = (fieldName, value) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
  };

  const handleFileChange = (fieldName, file) => {
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setError(`File "${file.name}" is too large. Maximum size is 10MB.`);
      return;
    }

    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      setError('File type not allowed. Please upload PDF, JPG, or PNG files only.');
      return;
    }

    setFiles(prev => ({ ...prev, [fieldName]: file }));
    setError('');
  };

  const removeFile = (fieldName) => {
    setFiles(prev => {
      const newFiles = { ...prev };
      delete newFiles[fieldName];
      return newFiles;
    });
  };

    const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    setError('');
    setSuccess('');

    try {
      const submitData = new FormData();
      submitData.append('scheme_id', scheme.id);
      submitData.append('application_id', `APP-${user.id}-${Date.now()}`);
      
      const completeFormData = { ...autoPopulatedFields, ...formData };
      submitData.append('form_data', JSON.stringify(completeFormData));

      Object.entries(files).forEach(([fieldName, file]) => {
        submitData.append(fieldName, file);
      });

      const response = await api.post('/applications/create/', submitData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(progress);
        },
      });

      // Enhanced success message with application ID
      const appId = response.data.application_id;
      setSuccess(
        `🎉 Application Submitted Successfully!\n\nYour Application ID: ${appId}\n\nYou can track your application status in the "My Applications" section.`
      );
      setTimeout(() => onSuccess(response.data), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit application. Please try again.');
    } finally {
      setUploading(false);
    }
  };


  const renderField = (field) => {
    const value = formData[field.field_name] || '';

    switch (field.field_type) {
      case 'text':
      case 'number':
        return (
          <Form.Control
            type={field.field_type}
            value={value}
            onChange={(e) => handleInputChange(field.field_name, e.target.value)}
            required={field.required}
            placeholder={field.placeholder}
          />
        );

      case 'select':
        return (
          <Form.Select
            value={value}
            onChange={(e) => handleInputChange(field.field_name, e.target.value)}
            required={field.required}
          >
            <option value="">Select {field.label}</option>
            {field.options?.map((opt, i) => (
              <option key={i} value={opt}>{opt}</option>
            ))}
          </Form.Select>
        );

      case 'textarea':
        return (
          <Form.Control
            as="textarea"
            rows={3}
            value={value}
            onChange={(e) => handleInputChange(field.field_name, e.target.value)}
            required={field.required}
            placeholder={field.placeholder}
          />
        );

      case 'file':
        return (
          <div>
            <Form.Control
              type="file"
              onChange={(e) => handleFileChange(field.field_name, e.target.files[0])}
              required={field.required}
              accept={field.accept || '.pdf,.jpg,.jpeg,.png'}
            />
            <Form.Text className="text-muted">
              Accepted: PDF, JPG, PNG. Max 10MB
            </Form.Text>
            {files[field.field_name] && (
              <div className="mt-2 p-2 bg-light rounded d-flex justify-content-between align-items-center">
                <div>
                  <FiCheck className="text-success me-2" />
                  <small className="text-success">
                    {files[field.field_name].name} ({(files[field.field_name].size / 1024).toFixed(2)} KB)
                  </small>
                </div>
                <Button
                  variant="link"
                  size="sm"
                  className="text-danger p-0"
                  onClick={() => removeFile(field.field_name)}
                >
                  <FiX />
                </Button>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      {error && <Alert variant="danger" className="mb-4">{error}</Alert>}
      {success && <Alert variant="success" className="mb-4">{success}</Alert>}

      <Card className="mb-4">
        <Card.Header className="bg-light">
          <h6 className="mb-0 text-primary">
            <FiLock className="me-2" />
            Your Details (Auto-filled from profile)
          </h6>
        </Card.Header>
        <Card.Body>
          <Row>
            {Object.entries(autoPopulatedFields).map(([key, field]) => (
              <Col md={6} key={key} className="mb-3">
                <Form.Group>
                  <Form.Label className="fw-semibold">{field.label}</Form.Label>
                  <Form.Control
                    type="text"
                    value={field.value || 'Not provided'}
                    disabled
                    className="bg-light"
                  />
                </Form.Group>
              </Col>
            ))}
          </Row>
        </Card.Body>
      </Card>

      {customFields.length > 0 ? (
        <Card className="mb-4">
          <Card.Header className="bg-light">
            <h6 className="mb-0 text-primary">
              <FiUpload className="me-2" />
              Application Form
            </h6>
          </Card.Header>
          <Card.Body>
            <Row>
              {customFields.map((field, index) => (
                <Col md={6} key={index} className="mb-3">
                  <Form.Group>
                    <Form.Label className="fw-semibold">
                      {field.label}
                      {field.required && <span className="text-danger ms-1">*</span>}
                    </Form.Label>
                    {renderField(field)}
                  </Form.Group>
                </Col>
              ))}
            </Row>
          </Card.Body>
        </Card>
      ) : (
        <Alert variant="info">
          No additional information required for this scheme.
        </Alert>
      )}

      {uploading && (
        <div className="mb-4">
          <ProgressBar 
            now={uploadProgress} 
            label={`${uploadProgress}%`} 
            animated 
            variant="success"
          />
          <small className="text-muted">Uploading your application...</small>
        </div>
      )}

      <div className="d-flex gap-2">
        <Button 
          type="submit" 
          className="btn-primary flex-grow-1" 
          disabled={uploading}
        >
          {uploading ? 'Submitting...' : 'Submit Application'}
        </Button>
        <Button 
          variant="secondary" 
          onClick={onCancel}
          disabled={uploading}
        >
          Cancel
        </Button>
      </div>

      <div className="mt-3 text-center">
        <small className="text-muted">
          * Required fields must be filled before submission
        </small>
      </div>
    </Form>
  );
};

export default SchemeApplicationForm;
