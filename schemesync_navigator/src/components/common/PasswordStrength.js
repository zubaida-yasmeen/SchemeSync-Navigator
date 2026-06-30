import React from 'react';
import { Form } from 'react-bootstrap';

const PasswordStrength = ({ password, showStrength = true }) => {
  const requirements = [
    { regex: /.{8,}/, text: 'At least 8 characters', met: false },
    { regex: /[A-Z]/, text: 'One uppercase letter (A-Z)', met: false },
    { regex: /[a-z]/, text: 'One lowercase letter (a-z)', met: false },
    { regex: /[0-9]/, text: 'One number (0-9)', met: false },
    { regex: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, text: 'One special character (!@#$%^&*)', met: false }
  ];

  // Check which requirements are met
  requirements.forEach(req => {
    req.met = req.regex.test(password);
  });

  const metCount = requirements.filter(req => req.met).length;
  const strength = metCount === 0 ? 'none' : 
                  metCount <= 2 ? 'weak' : 
                  metCount <= 4 ? 'medium' : 'strong';

  const getStrengthColor = () => {
    switch (strength) {
      case 'weak': return '#dc3545';
      case 'medium': return '#ffc107';
      case 'strong': return '#28a745';
      default: return '#6c757d';
    }
  };

  if (!showStrength || !password) return null;

  return (
    <div className="password-strength mt-2">
      <div className="d-flex align-items-center mb-2">
        <small className="text-muted me-2">Password strength:</small>
        <div 
          className="flex-grow-1 bg-light rounded" 
          style={{ height: '4px' }}
        >
          <div
            className="h-100 rounded transition-all"
            style={{
              width: `${(metCount / 5) * 100}%`,
              backgroundColor: getStrengthColor(),
              transition: 'all 0.3s ease'
            }}
          />
        </div>
        <small 
          className="ms-2 fw-semibold" 
          style={{ color: getStrengthColor() }}
        >
          {strength === 'none' ? '' : strength.toUpperCase()}
        </small>
      </div>
      
      <div className="requirements">
        {requirements.map((req, index) => (
          <small 
            key={index} 
            className={`d-block ${req.met ? 'text-success' : 'text-muted'}`}
            style={{ fontSize: '0.75rem' }}
          >
            <span className="me-1">
              {req.met ? '✓' : '○'}
            </span>
            {req.text}
          </small>
        ))}
      </div>
    </div>
  );
};

export default PasswordStrength;
