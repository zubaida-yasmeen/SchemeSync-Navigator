import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Tab, Tabs } from 'react-bootstrap';
import { FiUser, FiLock, FiSave, FiEye, FiEyeOff } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/auth';

const Profile = () => {
  const { user, checkAuthStatus, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  // Password visibility states
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [profileData, setProfileData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    age: '',
    gender: ''
  });

  const [passwordData, setPasswordData] = useState({
    old_password: '',
    new_password: '',
    confirm_password: ''
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        phone: user.phone || '',
        age: user.age || '',
        gender: user.gender || ''
      });
    }
  }, [user]);

  const handleProfileChange = (e) => {
    setProfileData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handlePasswordChange = (e) => {
    setPasswordData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await authService.updateProfile(profileData);
      await checkAuthStatus();
      setMessage('Profile updated successfully!');
      
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(error.response?.data?.detail || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (!passwordData.old_password) {
      setMessage("Please enter your current password");
      return;
    }

    if (passwordData.new_password !== passwordData.confirm_password) {
      setMessage("New passwords don't match");
      return;
    }

    if (passwordData.new_password.length < 8) {
      setMessage("New password must be at least 8 characters long");
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      await authService.updateProfile({
        old_password: passwordData.old_password,
        password: passwordData.new_password
      });
      
      setMessage('Password updated successfully! Logging you out...');
      
      setTimeout(() => {
        logout();
        navigate('/login');
      }, 2000);
      
    } catch (error) {
      const errorData = error.response?.data;
      let errorMessage = 'Failed to update password';
      
      if (errorData?.old_password) {
        errorMessage = Array.isArray(errorData.old_password) 
          ? errorData.old_password[0] 
          : errorData.old_password;
      } else if (errorData?.password) {
        errorMessage = Array.isArray(errorData.password) 
          ? errorData.password[0] 
          : errorData.password;
      } else if (errorData?.detail) {
        errorMessage = errorData.detail;
      } else if (errorData?.error) {
        errorMessage = errorData.error;
      }
      
      setMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-3">
      <Row className="justify-content-center">
        <Col lg={8}>
          <Card className="scheme-card">
            <Card.Header className="bg-primary text-white">
              <div className="d-flex align-items-center">
                <FiUser className="me-2" size={24} />
                <div>
                  <h5 className="mb-0">My Profile</h5>
                  <small className="opacity-75">Manage your account settings</small>
                </div>
              </div>
            </Card.Header>

            <Card.Body className="p-0">
              <Tabs
                activeKey={activeTab}
                onSelect={(k) => {
                  setActiveTab(k);
                  setMessage('');
                }}
                className="px-4 pt-4"
                fill
              >
                <Tab eventKey="profile" title="Profile Information">
                  <div className="p-4">
                    {message && activeTab === 'profile' && (
                      <Alert variant={message.includes('success') ? 'success' : 'danger'} dismissible onClose={() => setMessage('')}>
                        {message}
                      </Alert>
                    )}

                    <Form onSubmit={handleProfileSubmit} className="form-scheme">
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>First Name</Form.Label>
                            <Form.Control
                              type="text"
                              name="first_name"
                              value={profileData.first_name}
                              onChange={handleProfileChange}
                              required
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control
                              type="text"
                              name="last_name"
                              value={profileData.last_name}
                              onChange={handleProfileChange}
                              required
                            />
                          </Form.Group>
                        </Col>
                      </Row>

                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                              type="email"
                              name="email"
                              value={profileData.email}
                              onChange={handleProfileChange}
                              required
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Phone</Form.Label>
                            <Form.Control
                              type="tel"
                              name="phone"
                              value={profileData.phone}
                              onChange={handleProfileChange}
                            />
                          </Form.Group>
                        </Col>
                      </Row>

                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Age</Form.Label>
                            <Form.Control
                              type="number"
                              name="age"
                              value={profileData.age}
                              onChange={handleProfileChange}
                              min="1"
                              max="100"
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Gender</Form.Label>
                            <Form.Select
                              name="gender"
                              value={profileData.gender}
                              onChange={handleProfileChange}
                            >
                              <option value="">Select Gender</option>
                              <option value="MALE">Male</option>
                              <option value="FEMALE">Female</option>
                              <option value="OTHER">Other</option>
                            </Form.Select>
                          </Form.Group>
                        </Col>
                      </Row>

                      {/* Display-only fields for Income Group and State */}
                      {(user?.income_group || user?.state) && (
                        <>
                          <hr className="my-3" />
                          <h6 className="text-muted mb-3">Registration Information (Read-only)</h6>
                          <Row>
                            {user?.income_group && (
                              <Col md={6}>
                                <Form.Group className="mb-3">
                                  <Form.Label>Income Group</Form.Label>
                                  <Form.Control
                                    type="text"
                                    value={user.income_group.replace(/_/g, ' ')}
                                    disabled
                                    className="bg-light"
                                  />
                                  <Form.Text className="text-muted">
                                    Cannot be changed after registration
                                  </Form.Text>
                                </Form.Group>
                              </Col>
                            )}
                            {user?.state && (
                              <Col md={6}>
                                <Form.Group className="mb-3">
                                  <Form.Label>State</Form.Label>
                                  <Form.Control
                                    type="text"
                                    value={user.state}
                                    disabled
                                    className="bg-light"
                                  />
                                  <Form.Text className="text-muted">
                                    Cannot be changed after registration
                                  </Form.Text>
                                </Form.Group>
                              </Col>
                            )}
                          </Row>
                        </>
                      )}

                      <Button
                        type="submit"
                        className="btn-scheme-primary mt-3"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" />
                            Updating...
                          </>
                        ) : (
                          <>
                            <FiSave className="me-2" />
                            Update Profile
                          </>
                        )}
                      </Button>
                    </Form>
                  </div>
                </Tab>

                <Tab eventKey="password" title="Change Password">
                  <div className="p-4">
                    {message && activeTab === 'password' && (
                      <Alert variant={message.includes('success') ? 'success' : 'danger'} dismissible onClose={() => setMessage('')}>
                        {message}
                      </Alert>
                    )}

                    <Form onSubmit={handlePasswordSubmit} className="form-scheme">
                      <Form.Group className="mb-3">
                        <Form.Label>Current Password</Form.Label>
                        <div className="position-relative">
                          <Form.Control
                            type={showOldPassword ? "text" : "password"}
                            name="old_password"
                            value={passwordData.old_password}
                            onChange={handlePasswordChange}
                            className="pe-5"
                            required
                            placeholder="Enter current password"
                          />
                          <Button
                            variant="link"
                            className="position-absolute top-50 end-0 translate-middle-y text-muted p-0 me-3 border-0 bg-transparent"
                            onClick={() => setShowOldPassword(!showOldPassword)}
                            type="button"
                            tabIndex={-1}
                          >
                            {showOldPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                          </Button>
                        </div>
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>New Password</Form.Label>
                        <div className="position-relative">
                          <Form.Control
                            type={showNewPassword ? "text" : "password"}
                            name="new_password"
                            value={passwordData.new_password}
                            onChange={handlePasswordChange}
                            className="pe-5"
                            required
                            minLength={8}
                            placeholder="Enter new password"
                          />
                          <Button
                            variant="link"
                            className="position-absolute top-50 end-0 translate-middle-y text-muted p-0 me-3 border-0 bg-transparent"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            type="button"
                            tabIndex={-1}
                          >
                            {showNewPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                          </Button>
                        </div>
                        <Form.Text className="text-muted">
                          Must be at least 8 characters long
                        </Form.Text>
                      </Form.Group>

                      <Form.Group className="mb-4">
                        <Form.Label>Confirm New Password</Form.Label>
                        <div className="position-relative">
                          <Form.Control
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirm_password"
                            value={passwordData.confirm_password}
                            onChange={handlePasswordChange}
                            className="pe-5"
                            required
                            placeholder="Re-enter new password"
                          />
                          <Button
                            variant="link"
                            className="position-absolute top-50 end-0 translate-middle-y text-muted p-0 me-3 border-0 bg-transparent"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            type="button"
                            tabIndex={-1}
                          >
                            {showConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                          </Button>
                        </div>
                      </Form.Group>

                      <Button
                        type="submit"
                        className="btn-scheme-primary"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" />
                            Updating...
                          </>
                        ) : (
                          <>
                            <FiLock className="me-2" />
                            Update Password
                          </>
                        )}
                      </Button>
                    </Form>
                  </div>
                </Tab>
              </Tabs>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
