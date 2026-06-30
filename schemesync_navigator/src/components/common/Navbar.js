import React from 'react';
import { Navbar, Nav, NavDropdown, Container, Badge } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiHome, FiUser, FiFileText, FiHeart, FiSettings, FiLogOut } from 'react-icons/fi';

const CustomNavbar = () => {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <Navbar expand="lg" className="navbar-scheme">
      <Container>
        <Navbar.Brand as={Link} to={isAdmin ? "/admin" : "/"}>
          <strong>SchemeSync_Navigator</strong>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {!isAdmin ? (
              <>
                <Nav.Link 
                  as={Link} 
                  to="/" 
                  className={isActive('/') ? 'active' : ''}
                >
                  <FiHome className="me-2" />
                  Dashboard
                </Nav.Link>
                <Nav.Link 
                  as={Link} 
                  to="/applications" 
                  className={isActive('/applications') ? 'active' : ''}
                >
                  <FiFileText className="me-2" />
                  My Applications
                </Nav.Link>
                <Nav.Link 
                  as={Link} 
                  to="/favorites" 
                  className={isActive('/favorites') ? 'active' : ''}
                >
                  <FiHeart className="me-2" />
                  Favorites
                </Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/admin">
                  <FiSettings className="me-2" />
                  Admin Dashboard
                </Nav.Link>
                <Nav.Link as={Link} to="/admin/schemes">
                  Scheme Management
                </Nav.Link>
                <Nav.Link as={Link} to="/admin/applications">
                  Application Management
                </Nav.Link>
              </>
            )}
          </Nav>

          <Nav>
            <NavDropdown
              title={
                <span className="text-white">
                  <FiUser className="me-2" />
                  {user?.first_name || user?.username}
                  {isAdmin && <Badge bg="warning" className="ms-2">Admin</Badge>}
                </span>
              }
              id="user-dropdown"
              align="end"
            >
              {!isAdmin && (
                <NavDropdown.Item as={Link} to="/profile">
                  <FiUser className="me-2" />
                  Profile
                </NavDropdown.Item>
              )}
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={handleLogout} className="text-danger">
                <FiLogOut className="me-2" />
                Logout
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;
