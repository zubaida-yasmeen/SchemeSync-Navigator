import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Badge, Alert } from 'react-bootstrap';
import { FiSearch, FiFilter, FiGrid, FiList } from 'react-icons/fi';
import SchemeCard from './SchemeCard';
import LoadingSpinner from '../common/LoadingSpinner';
import api from '../../services/api';

const Dashboard = () => {
  const [schemes, setSchemes] = useState([]);
  const [filteredSchemes, setFilteredSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  
  // Filter states [web:126][web:129]
  const [filters, setFilters] = useState({
    search: '',
    scheme_type: '',
    category: '',
    state: '',
    income_group: '',
    gender: ''
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
    { value: 'OTHER', label: 'Other' }
  ];

  const STATES = [
    { value: 'KA', label: 'Karnataka' },
    { value: 'MH', label: 'Maharashtra' },
    { value: 'TN', label: 'Tamil Nadu' },
    { value: 'UP', label: 'Uttar Pradesh' },
    { value: 'WB', label: 'West Bengal' }
  ];

  useEffect(() => {
    fetchSchemes();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [schemes, filters]);

  const fetchSchemes = async () => {
    try {
      setLoading(true);
      const response = await api.get('/schemes/');
      setSchemes(response.data.results);
      setError('');
    } catch (err) {
      setError('Failed to fetch schemes');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = schemes;

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(scheme =>
        scheme.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        scheme.description.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Other filters
    Object.keys(filters).forEach(key => {
      if (filters[key] && key !== 'search') {
        filtered = filtered.filter(scheme => {
          if (key === 'scheme_type') return scheme.scheme_type === filters[key];
          if (key === 'category') return scheme.category === filters[key];
          // Add more filter logic as needed
          return true;
        });
      }
    });

    setFilteredSchemes(filtered);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleApplicationSuccess = () => {
  // Refresh schemes after successful application
  fetchSchemes();
};

  const clearFilters = () => {
    setFilters({
      search: '',
      scheme_type: '',
      category: '',
      state: '',
      income_group: '',
      gender: ''
    });
  };

  if (loading) return <LoadingSpinner />;

  return (
    <Container fluid className="py-3">
      {/* Header Section */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="text-primary fw-bold mb-1">Government Schemes</h2>
              <p className="text-muted mb-0">
                Discover {filteredSchemes.length} schemes available for you
              </p>
            </div>
            <div className="d-flex gap-2">
              <Button
                variant={viewMode === 'grid' ? 'primary' : 'outline-primary'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <FiGrid />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'primary' : 'outline-primary'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <FiList />
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      <Row>
        {/* Filter Sidebar */}
        <Col lg={3} className="mb-4">
          <Card className="scheme-card">
            <Card.Header className="bg-primary text-white">
              <h6 className="mb-0">
                <FiFilter className="me-2" />
                Filters
              </h6>
            </Card.Header>
            <Card.Body>
              {/* Search */}
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Search Schemes</Form.Label>
                <div className="position-relative">
                  <FiSearch className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                  <Form.Control
                    type="text"
                    placeholder="Search by name or description..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    className="ps-5"
                  />
                </div>
              </Form.Group>

              {/* Scheme Type */}
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Scheme Type</Form.Label>
                <Form.Select
                  value={filters.scheme_type}
                  onChange={(e) => handleFilterChange('scheme_type', e.target.value)}
                >
                  <option value="">All Types</option>
                  <option value="CENTRAL">Central Government</option>
                  <option value="STATE">State Government</option>
                </Form.Select>
              </Form.Group>

              {/* Category */}
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Category</Form.Label>
                <Form.Select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                >
                  <option value="">All Categories</option>
                  {CATEGORIES.map(cat => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              {/* State Filter */}
              {/* <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">State</Form.Label>
                <Form.Select
                  value={filters.state}
                  onChange={(e) => handleFilterChange('state', e.target.value)}
                >
                  <option value="">All States</option>
                  {STATES.map(state => (
                    <option key={state.value} value={state.value}>
                      {state.label}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group> */}

              {/* Income Group */}
              {/* <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Income Group</Form.Label>
                <Form.Select
                  value={filters.income_group}
                  onChange={(e) => handleFilterChange('income_group', e.target.value)}
                >
                  <option value="">All Income Groups</option>
                  <option value="EWS">Economically Weaker Section</option>
                  <option value="LIG">Low Income Group</option>
                  <option value="MIG">Middle Income Group</option>
                  <option value="OBC">Other Backward Class</option>
                  <option value="SC">Scheduled Caste</option>
                  <option value="ST">Scheduled Tribe</option>
                  <option value="GENERAL">General</option>
                </Form.Select>
              </Form.Group> */}

              <Button
                variant="outline-secondary"
                size="sm"
                className="w-100"
                onClick={clearFilters}
              >
                Clear All Filters
              </Button>
            </Card.Body>
          </Card>
        </Col>

        {/* Schemes Grid/List */}
        <Col lg={9}>
          {error && <Alert variant="danger">{error}</Alert>}
          
          {filteredSchemes.length === 0 ? (
            <Card className="scheme-card text-center py-5">
              <Card.Body>
                <h5 className="text-muted">No schemes found</h5>
                <p className="text-muted">Try adjusting your filters to see more results</p>
              </Card.Body>
            </Card>
          ) : (
            <Row>
              {filteredSchemes.map(scheme => (
                <Col
                  key={scheme.id}
                  xs={12}
                  md={viewMode === 'grid' ? 6 : 12}
                  xl={viewMode === 'grid' ? 4 : 12}
                  className="mb-4"
                >
                  <SchemeCard 
                    scheme={scheme} 
                    viewMode={viewMode}
                    onApplicationSuccess={handleApplicationSuccess}
                  />
                </Col>
              ))}
            </Row>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
