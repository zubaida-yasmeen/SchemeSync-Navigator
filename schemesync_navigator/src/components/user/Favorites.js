import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { FiHeart, FiTrash2, FiExternalLink } from 'react-icons/fi';
import api from '../../services/api';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const response = await api.get('/schemes/favorites/');
      
      // Handle both array and paginated responses
      if (Array.isArray(response.data)) {
        setFavorites(response.data);
      } else if (response.data?.results) {
        setFavorites(response.data.results);
      } else {
        setFavorites([]);
      }
      
      setError('');
    } catch (err) {
      console.error('Error fetching favorites:', err);
      setError('Failed to fetch favorites');
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (schemeId) => {
    try {
      await api.delete(`/schemes/${schemeId}/favorite/`);
      fetchFavorites(); // Refresh the list
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  if (loading) {
    return (
      <Container className="py-4 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <h5 className="text-muted mt-3">Loading favorites...</h5>
      </Container>
    );
  }

  return (
    <Container className="py-3">
      <Row className="mb-4">
        <Col>
          <div className="d-flex align-items-center">
            <FiHeart className="text-danger me-3" size={32} />
            <div>
              <h2 className="text-primary fw-bold mb-1">My Favorite Schemes</h2>
              <p className="text-muted mb-0">
                {favorites.length} scheme{favorites.length !== 1 ? 's' : ''} saved for quick access
              </p>
            </div>
          </div>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}

      {favorites.length === 0 ? (
        <Row>
          <Col>
            <Card className="scheme-card text-center py-5">
              <Card.Body>
                <FiHeart className="text-muted mb-3" size={48} />
                <h5 className="text-muted">No Favorite Schemes</h5>
                <p className="text-muted">
                  Start browsing schemes and save your favorites for quick access.
                </p>
                <Button href="/" className="btn-scheme-primary">
                  Browse Schemes
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      ) : (
        <Row>
          {favorites.map(favorite => {
            // Safe access to scheme data
            const scheme = favorite.scheme || favorite;
            const schemeId = scheme.id || favorite.scheme_id;
            
            return (
              <Col key={favorite.id} lg={4} md={6} className="mb-4">
                <Card className="scheme-card h-100">
                  <Card.Header className="border-0 bg-transparent">
                    <div className="d-flex justify-content-between align-items-start">
                      <small className="text-muted">
                        Added on {new Date(favorite.added_at || favorite.created_at).toLocaleDateString()}
                      </small>
                      <Button
                        variant="link"
                        className="p-0 text-danger"
                        onClick={() => removeFavorite(schemeId)}
                        title="Remove from favorites"
                      >
                        <FiTrash2 size={16} />
                      </Button>
                    </div>
                  </Card.Header>
                  
                  <Card.Body>
                    <h6 className="text-primary fw-bold mb-2">
                      {scheme.name || 'Untitled Scheme'}
                    </h6>
                    <p className="text-muted small mb-3 line-clamp-3">
                      {scheme.description || 'No description available'}
                    </p>
                    
                    <div className="mb-3">
                      <small className="text-muted">
                        <strong>Ministry:</strong> {scheme.ministry || 'N/A'}
                      </small>
                    </div>
                    
                    <div className="mb-3">
                      <small className="text-success">
                        <strong>Benefits:</strong> {scheme.benefits || 'N/A'}
                      </small>
                    </div>
                    
                    <div className="d-flex gap-2">
                      <Button 
                        size="sm" 
                        className="btn-scheme-primary flex-grow-1"
                        href={`/#scheme-${schemeId}`}
                      >
                        <FiExternalLink className="me-1" />
                        View Details
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}
    </Container>
  );
};

export default Favorites;
