import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button, Modal, Form, Alert } from 'react-bootstrap';
import { FiUsers, FiFileText, FiTrendingUp, FiEye, FiSearch } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import api from '../../services/api';

// Inline styles for hover effect
const styles = `
  .hover-row {
    transition: background-color 0.15s ease;
    cursor: pointer;
  }
  
  .hover-row:hover {
    background-color: rgba(44, 82, 130, 0.08);
  }
`;


const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalSchemes: 0,
    totalApplications: 0,
    totalUsers: 0,
    pendingApplications: 0,
    approvedApplications: 0,
    rejectedApplications: 0
  });
  const [recentApplications, setRecentApplications] = useState([]);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showUsersList, setShowUsersList] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userSearch, setUserSearch] = useState('');

  useEffect(() => {
    fetchDashboardData();
    fetchUsers();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, applicationsRes] = await Promise.all([
        api.get('/admin/stats/'),
        api.get('/applications/admin/')
      ]);

      setStats(statsRes.data);
      setRecentApplications(applicationsRes.data.results?.slice(0, 10) || applicationsRes.data.slice(0, 10));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await api.get('/admin/users/');
      const usersData = response.data.results || response.data;
      setUsers(usersData);
      setFilteredUsers(usersData);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleUserSearch = () => {
    if (userSearch.trim() === '') {
      setFilteredUsers(users);
      return;
    }

    const searchLower = userSearch.toLowerCase();
    const filtered = users.filter(user => {
      const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
      const email = user.email.toLowerCase();
      const username = user.username.toLowerCase();
      
      return fullName.includes(searchLower) ||
             email.includes(searchLower) ||
             username.includes(searchLower);
    });
    
    setFilteredUsers(filtered);
  };

  const handleClearUserSearch = () => {
    setUserSearch('');
    setFilteredUsers(users);
  };

  const getStatusColor = (status) => {
    const colors = {
      'APPLIED': 'primary',
      'UNDER_REVIEW': 'warning',
      'APPROVED': 'success',
      'REJECTED': 'danger',
      'ON_HOLD': 'secondary'
    };
    return colors[status] || 'secondary';
  };

  if (loading) {
    return (
      <Container className="py-4 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <h5 className="text-muted mt-3">Loading dashboard...</h5>
      </Container>
    );
  }

  return (
    <Container fluid className="py-3">
      <style>{styles}</style>
      
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex align-items-center">
            <div>
              <h2 className="text-primary fw-bold mb-1">Admin Dashboard</h2>
              <p className="text-muted mb-0">Manage schemes, applications, and users</p>
            </div>
          </div>
        </Col>
      </Row>

      {/* Statistics Cards */}
      <Row className="mb-4">
        <Col lg={3} md={6} className="mb-3">
          <Card className="scheme-card border-0 bg-primary text-white h-100">
            <Card.Body className="d-flex align-items-center">
              <div className="flex-grow-1">
                <h3 className="fw-bold mb-1">{stats.totalSchemes}</h3>
                <p className="mb-0 opacity-75">Total Schemes</p>
              </div>
              <FiFileText size={32} className="opacity-75" />
            </Card.Body>
          </Card>
        </Col>

        <Col lg={3} md={6} className="mb-3">
          <Card className="scheme-card border-0 bg-success text-white h-100">
            <Card.Body className="d-flex align-items-center">
              <div className="flex-grow-1">
                <h3 className="fw-bold mb-1">{stats.totalApplications}</h3>
                <p className="mb-0 opacity-75">Total Applications</p>
              </div>
              <FiTrendingUp size={32} className="opacity-75" />
            </Card.Body>
          </Card>
        </Col>

        <Col lg={3} md={6} className="mb-3">
          <Card className="scheme-card border-0 bg-warning text-white h-100">
            <Card.Body className="d-flex align-items-center">
              <div className="flex-grow-1">
                <h3 className="fw-bold mb-1">{stats.pendingApplications}</h3>
                <p className="mb-0 opacity-75">Pending Review</p>
              </div>
              <FiUsers size={32} className="opacity-75" />
            </Card.Body>
          </Card>
        </Col>

        <Col lg={3} md={6} className="mb-3">
          <Card className="scheme-card border-0 bg-info text-white h-100">
            <Card.Body className="d-flex align-items-center">
              <div className="flex-grow-1">
                <h3 className="fw-bold mb-1">{stats.totalUsers}</h3>
                <p className="mb-0 opacity-75">Registered Users</p>
              </div>
              <FiUsers size={32} className="opacity-75" />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Quick Actions - Only 3 cards */}
      <Row className="mb-4">
        <Col>
          <Card className="scheme-card">
            <Card.Header>
              <h5 className="mb-0">Quick Actions</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={4} className="mb-3">
                  <Link to="/admin/schemes" className="text-decoration-none">
                    <Card className="text-center h-100 border-2 border-primary border-opacity-25 hover-lift">
                      <Card.Body>
                        <FiFileText className="text-primary mb-2" size={24} />
                        <h6 className="text-primary">Manage Schemes</h6>
                        <small className="text-muted">Create, edit, delete schemes</small>
                      </Card.Body>
                    </Card>
                  </Link>
                </Col>
                
                <Col md={4} className="mb-3">
                  <Link to="/admin/applications" className="text-decoration-none">
                    <Card className="text-center h-100 border-2 border-success border-opacity-25 hover-lift">
                      <Card.Body>
                        <FiTrendingUp className="text-success mb-2" size={24} />
                        <h6 className="text-success">Review Applications</h6>
                        <small className="text-muted">Approve or reject applications</small>
                      </Card.Body>
                    </Card>
                  </Link>
                </Col>
                
                <Col md={4} className="mb-3">
                  <Card 
                    className="text-center h-100 border-2 border-warning border-opacity-25 hover-lift" 
                    style={{ cursor: 'pointer' }}
                    onClick={() => setShowUsersList(!showUsersList)}
                  >
                    <Card.Body>
                      <FiUsers className="text-warning mb-2" size={24} />
                      <h6 className="text-warning">User Management</h6>
                      <small className="text-muted">Manage user accounts</small>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* User Management Section */}
      {showUsersList && (
        <Row className="mb-4">
          <Col>
            <Card className="scheme-card">
              <Card.Header className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">User Management ({filteredUsers.length})</h5>
                <div className="d-flex gap-2">
                  <Form.Control
                    type="text"
                    placeholder="Search by name, email, or username..."
                    value={userSearch}
                    onChange={(e) => {
                      setUserSearch(e.target.value);
                      // Auto-clear filter when input is empty
                      if (e.target.value.trim() === '') {
                        setFilteredUsers(users);
                      }
                    }}
                    onKeyPress={(e) => e.key === 'Enter' && handleUserSearch()}
                    style={{ width: '300px' }}
                  />
                  <Button className="btn-scheme-primary" onClick={handleUserSearch}>
                    <FiSearch />
                  </Button>
                  <Button variant="outline-secondary" onClick={handleClearUserSearch}>
                    Clear
                  </Button>
                </div>
              </Card.Header>
              <Card.Body className="p-0">
                {filteredUsers.length === 0 ? (
                  <div className="text-center py-5">
                    <p className="text-muted">
                      {userSearch ? 'No users found matching your search' : 'No users found'}
                    </p>
                    {userSearch && (
                      <Button variant="outline-primary" onClick={handleClearUserSearch}>
                        Clear Search
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="table-responsive">
                    <Table className="mb-0">
                      <thead className="bg-light">
                        <tr>
                          <th>User Details</th>
                          <th>Profile Info</th>
                          <th>Joined Date</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.map(user => (
                          <tr key={user.id}>
                            <td>
                              <div>
                                <strong className="text-primary">
                                  {user.first_name} {user.last_name}
                                </strong>
                                <br />
                                <small className="text-muted">{user.email}</small>
                                <br />
                                <small className="text-muted">@{user.username}</small>
                              </div>
                            </td>
                            <td>
                              <small className="text-muted">
                                Age: {user.age || 'N/A'}<br />
                                State: {user.state || 'N/A'}<br />
                                Income: {user.income_group || 'N/A'}
                              </small>
                            </td>
                            <td>
                              <small className="text-muted">
                                {new Date(user.created_at).toLocaleDateString()}
                              </small>
                            </td>
                            <td>
                              <Badge bg="success">Active</Badge>
                            </td>
                            <td>
                              <div className="d-flex gap-1">
                                <Button
                                  size="sm"
                                  variant="outline-primary"
                                  onClick={() => {
                                    setSelectedUser(user);
                                    setShowUserModal(true);
                                  }}
                                >
                                  <FiEye />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Recent Applications */}
      <Row>
        <Col>
          <Card className="scheme-card">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Recent Applications</h5>
              <Link to="/admin/applications" className="btn btn-sm btn-outline-primary">
                View All
              </Link>
            </Card.Header>
            <Card.Body className="p-0">
              {recentApplications.length === 0 ? (
                <div className="text-center py-4">
                  <FiFileText className="text-muted mb-2" size={32} />
                  <p className="text-muted">No recent applications</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <Table className="mb-0">
                    <thead className="bg-light">
                      <tr>
                        <th>User</th>
                        <th>Scheme</th>
                        <th>Application ID</th>
                        <th>Status</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentApplications.map(app => (
                        <tr 
                          key={app.id} 
                          onClick={() => window.location.href = '/admin/applications'}
                          style={{ cursor: 'pointer' }}
                          className="hover-row"
                        >
                          <td>
                            <div>
                              <strong>
                                {app.user_details?.first_name || 'N/A'} {app.user_details?.last_name || ''}
                              </strong>
                              <br />
                              <small className="text-muted">{app.user_details?.email || 'N/A'}</small>
                            </div>
                          </td>
                          <td>
                            <div>
                              <strong className="text-primary">
                                {app.scheme_details?.name || 'N/A'}
                              </strong>
                              <br />
                              <small className="text-muted">
                                {app.scheme_details?.scheme_type || 'N/A'} • {app.scheme_details?.category || 'N/A'}
                              </small>
                            </div>
                          </td>
                          <td>
                            <code className="bg-light px-2 py-1 rounded">
                              {app.application_id}
                            </code>
                          </td>
                          <td>
                            <Badge bg={getStatusColor(app.status)}>
                              {app.status?.replace('_', ' ')}
                            </Badge>
                          </td>
                          <td>
                            <small className="text-muted">
                              {new Date(app.applied_date).toLocaleDateString()}
                            </small>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* User Details Modal */}
      <Modal show={showUserModal} onHide={() => setShowUserModal(false)} size="lg">
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>User Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser && (
            <Row>
              <Col md={6}>
                <h6 className="text-primary">Personal Information</h6>
                <p><strong>Name:</strong> {selectedUser.first_name} {selectedUser.last_name}</p>
                <p><strong>Username:</strong> {selectedUser.username}</p>
                <p><strong>Email:</strong> {selectedUser.email}</p>
                <p><strong>Phone:</strong> {selectedUser.phone || 'Not provided'}</p>
              </Col>
              <Col md={6}>
                <h6 className="text-primary">Profile Information</h6>
                <p><strong>Age:</strong> {selectedUser.age || 'Not provided'}</p>
                <p><strong>Gender:</strong> {selectedUser.gender || 'Not provided'}</p>
                <p><strong>State:</strong> {selectedUser.state || 'Not provided'}</p>
                <p><strong>Income Group:</strong> {selectedUser.income_group || 'Not provided'}</p>
                <p><strong>Joined:</strong> {new Date(selectedUser.created_at).toLocaleDateString()}</p>
              </Col>
            </Row>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUserModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminDashboard;
