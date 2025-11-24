import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Spinner, Alert, Badge, ProgressBar, Form, Button, ButtonGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import reviewService from '../services/review.service';
import { FiStar, FiUser, FiFilter, FiThumbsUp } from 'react-icons/fi';
import AOS from 'aos';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterRating, setFilterRating] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });
  }, []);

  useEffect(() => {
    const fetchReviewsAndStats = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch reviews và statistics song song
        const [reviewsResponse, statsResponse] = await Promise.all([
          reviewService.getAllReviews({ limit: 100, sort: sortBy }),
          reviewService.getReviewStatistics()
        ]);

        console.log('📝 Reviews Response:', reviewsResponse);
        console.log('📊 Statistics Response:', statsResponse);
        
        setReviews(reviewsResponse.data || []);
        setFilteredReviews(reviewsResponse.data || []);
        setStatistics(statsResponse.data || {});
      } catch (err) {
        console.error('Error fetching reviews:', err);
        setError('Không thể tải đánh giá. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchReviewsAndStats();
  }, [sortBy]);

  // Filter reviews when filter changes
  useEffect(() => {
    if (filterRating === 'all') {
      setFilteredReviews(reviews);
    } else {
      setFilteredReviews(reviews.filter(r => r.rating === parseInt(filterRating)));
    }
  }, [filterRating, reviews]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getRatingPercentage = (rating) => {
    if (!statistics?.total_reviews) return 0;
    const count = statistics.rating_distribution?.[rating] || 0;
    return Math.round((count / statistics.total_reviews) * 100);
  };

  return (
    <div style={{ paddingTop: '100px', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <Container>
        {/* Hero Header */}
        <div className="text-center mb-5 py-5" data-aos="fade-up" style={{ 
          background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%)',
          borderRadius: '20px',
          color: 'white',
          marginTop: '20px'
        }}>
          <h1 className="mb-3 display-4 fw-bold">Đánh Giá Khách Hàng</h1>
          <p className="lead mb-0" style={{ opacity: 0.9 }}>
            Những chia sẻ chân thực từ cộng đồng khách hàng tin tưởng Serenity
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="danger" dismissible onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" size="lg" />
            <p className="mt-3 text-muted">Đang tải đánh giá...</p>
          </div>
        ) : (
          <>
            {/* Statistics Overview */}
            {statistics && (
              <Card className="mb-5 border-0 shadow-sm" data-aos="fade-up">
                <Card.Body className="p-4">
                  <Row className="align-items-center">
                    {/* Overall Rating */}
                    <Col lg={4} className="text-center border-end">
                      <div className="mb-3">
                        <div className="display-1 fw-bold text-primary mb-2">
                          {statistics.average_rating?.toFixed(1) || 0}
                        </div>
                        <div className="rating-stars mb-2" style={{ fontSize: '1.5rem' }}>
                          {[...Array(5)].map((_, i) => (
                            <FiStar 
                              key={i} 
                              fill={i < Math.round(statistics.average_rating) ? '#ffc107' : 'none'}
                              color="#ffc107"
                              size={24}
                            />
                          ))}
                        </div>
                        <p className="text-muted mb-0">{statistics.total_reviews || 0} đánh giá</p>
                      </div>
                    </Col>

                    {/* Rating Distribution */}
                    <Col lg={8} className="ps-lg-5">
                      <h5 className="mb-4">Phân bố đánh giá</h5>
                      {[5, 4, 3, 2, 1].map((rating) => (
                        <Row key={rating} className="align-items-center mb-2">
                          <Col xs={2} className="text-end">
                            <small className="text-muted">{rating} <FiStar size={12} color="#ffc107" /></small>
                          </Col>
                          <Col xs={8}>
                            <ProgressBar 
                              now={getRatingPercentage(rating)} 
                              style={{ height: '8px' }}
                              variant={rating >= 4 ? 'success' : rating === 3 ? 'warning' : 'danger'}
                            />
                          </Col>
                          <Col xs={2}>
                            <small className="text-muted">
                              {statistics.rating_distribution?.[rating] || 0} ({getRatingPercentage(rating)}%)
                            </small>
                          </Col>
                        </Row>
                      ))}
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            )}

            {/* Filters and Sort */}
            <Row className="mb-4" data-aos="fade-up">
              <Col md={6} className="mb-3 mb-md-0">
                <div className="d-flex align-items-center">
                  <FiFilter className="me-2 text-muted" />
                  <span className="me-3 text-muted">Lọc theo:</span>
                  <ButtonGroup>
                    <Button 
                      variant={filterRating === 'all' ? 'primary' : 'outline-primary'} 
                      size="sm"
                      onClick={() => setFilterRating('all')}
                    >
                      Tất cả
                    </Button>
                    {[5, 4, 3, 2, 1].map(rating => (
                      <Button 
                        key={rating}
                        variant={filterRating === String(rating) ? 'primary' : 'outline-primary'} 
                        size="sm"
                        onClick={() => setFilterRating(String(rating))}
                      >
                        {rating} <FiStar size={12} />
                      </Button>
                    ))}
                  </ButtonGroup>
                </div>
              </Col>
              <Col md={6}>
                <div className="d-flex align-items-center justify-content-md-end">
                  <span className="me-3 text-muted">Sắp xếp:</span>
                  <Form.Select 
                    size="sm" 
                    value={sortBy} 
                    onChange={(e) => setSortBy(e.target.value)}
                    style={{ width: 'auto' }}
                  >
                    <option value="newest">Mới nhất</option>
                    <option value="oldest">Cũ nhất</option>
                    <option value="highest_rating">Rating cao nhất</option>
                    <option value="lowest_rating">Rating thấp nhất</option>
                  </Form.Select>
                </div>
              </Col>
            </Row>

            {/* Reviews Count */}
            <div className="mb-4" data-aos="fade-up">
              <h5 className="mb-0">
                {filteredReviews.length} đánh giá 
                {filterRating !== 'all' && ` (${filterRating} sao)`}
              </h5>
            </div>

            {/* Reviews List - Facebook Style */}
            {filteredReviews.length > 0 ? (
              filteredReviews.map((review, index) => (
                <Card 
                  key={review.id} 
                  className="mb-4 border-0 shadow-sm overflow-hidden" 
                  data-aos="fade-up" 
                  data-aos-delay={Math.min(index * 50, 300)}
                  style={{ transition: 'all 0.3s ease' }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <Card.Body className="p-0">
                    <Row className="g-0">
                      {/* Product Image - Left Side */}
                      <Col md={4} lg={3}>
                        <Link to={`/product/${review.product?.id}`} style={{ textDecoration: 'none' }}>
                          <div 
                            style={{ 
                              position: 'relative',
                              paddingBottom: '100%',
                              overflow: 'hidden',
                              backgroundColor: '#f8f9fa',
                              cursor: 'pointer'
                            }}
                          >
                            <img 
                              src={review.product?.images?.[0]?.image_url || 'https://via.placeholder.com/400'} 
                              alt={review.product?.name || 'Product'}
                              style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                transition: 'transform 0.3s ease'
                              }}
                              onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                              onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                            />
                            {review.product?.sale_price > 0 && (
                              <Badge 
                                bg="danger" 
                                style={{
                                  position: 'absolute',
                                  top: '10px',
                                  right: '10px',
                                  fontSize: '0.75rem',
                                  padding: '0.5rem 0.7rem',
                                  fontWeight: 'bold'
                                }}
                              >
                                -{Math.round((1 - review.product.sale_price / review.product.price) * 100)}%
                              </Badge>
                            )}
                          </div>
                        </Link>
                      </Col>

                      {/* Review Content - Right Side */}
                      <Col md={8} lg={9}>
                        <div className="p-4">
                          {/* Product Info Header */}
                          <div className="mb-3 pb-3" style={{ borderBottom: '2px solid #f0f0f0' }}>
                            <h5 className="mb-2">
                              <Link 
                                to={`/product/${review.product?.id}`}
                                style={{ 
                                  color: '#2c3e50',
                                  textDecoration: 'none',
                                  fontWeight: '600',
                                  fontSize: '1.1rem'
                                }}
                                onMouseEnter={(e) => e.target.style.color = 'var(--primary-color)'}
                                onMouseLeave={(e) => e.target.style.color = '#2c3e50'}
                              >
                                {review.product?.name}
                              </Link>
                            </h5>
                            <div className="d-flex align-items-center gap-2 flex-wrap">
                              {review.product?.sale_price > 0 ? (
                                <>
                                  <span className="h5 mb-0 text-danger fw-bold">
                                    {review.product.sale_price.toLocaleString('vi-VN')}₫
                                  </span>
                                  <span className="text-muted text-decoration-line-through" style={{ fontSize: '0.95rem' }}>
                                    {review.product.price.toLocaleString('vi-VN')}₫
                                  </span>
                                </>
                              ) : (
                                <span className="h5 mb-0 fw-bold" style={{ color: 'var(--primary-color)' }}>
                                  {review.product?.price?.toLocaleString('vi-VN')}₫
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Reviewer Info */}
                          <div className="d-flex align-items-center mb-3">
                            <div 
                              className="rounded-circle d-flex align-items-center justify-content-center"
                              style={{ 
                                width: '52px', 
                                height: '52px',
                                background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%)',
                                fontSize: '1.3rem',
                                fontWeight: 'bold',
                                color: 'white',
                                flexShrink: 0
                              }}
                            >
                              {review.user?.name?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <div className="ms-3 flex-grow-1">
                              <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                                <div>
                                  <h6 className="mb-1" style={{ fontWeight: '600', fontSize: '1rem' }}>
                                    {review.user?.name || 'Khách hàng'}
                                  </h6>
                                  <small className="text-muted">
                                    {formatDate(review.created_at)}
                                  </small>
                                </div>
                                <Badge 
                                  bg="success" 
                                  className="d-flex align-items-center gap-1"
                                  style={{ fontSize: '0.8rem', padding: '0.5rem 0.9rem' }}
                                >
                                  <FiThumbsUp size={12} /> Đã mua hàng
                                </Badge>
                              </div>
                            </div>
                          </div>

                          {/* Rating */}
                          <div className="mb-3">
                            <div className="d-flex align-items-center gap-2">
                              <div>
                                {[...Array(5)].map((_, i) => (
                                  <FiStar 
                                    key={i}
                                    fill={i < review.rating ? '#ffc107' : 'none'}
                                    color="#ffc107"
                                    size={20}
                                  />
                                ))}
                              </div>
                              <Badge 
                                bg={review.rating >= 4 ? 'success' : review.rating === 3 ? 'warning' : 'danger'}
                                style={{ fontSize: '0.9rem', padding: '0.4rem 0.7rem' }}
                              >
                                {review.rating}.0/5
                              </Badge>
                            </div>
                          </div>

                          {/* Review Comment */}
                          <div 
                            className="p-3 rounded"
                            style={{ 
                              backgroundColor: '#f8f9fa',
                              border: '1px solid #e9ecef'
                            }}
                          >
                            <p className="mb-0" style={{ 
                              lineHeight: '1.8', 
                              color: '#2c3e50',
                              fontSize: '1rem'
                            }}>
                              "{review.comment}"
                            </p>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              ))
            ) : (
              <div className="text-center py-5" data-aos="fade-up">
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>💬</div>
                <h4>Không tìm thấy đánh giá nào</h4>
                <p className="text-muted">
                  {filterRating !== 'all' 
                    ? `Chưa có đánh giá ${filterRating} sao` 
                    : 'Hãy là người đầu tiên đánh giá sản phẩm của chúng tôi!'}
                </p>
                <Button variant="outline-primary" onClick={() => setFilterRating('all')}>
                  Xem tất cả đánh giá
                </Button>
              </div>
            )}

            {/* Trust Badges */}
            <Card className="mt-5 border-0" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }} data-aos="fade-up">
              <Card.Body className="p-5 text-white">
                <Row className="text-center">
                  <Col md={3} className="mb-4 mb-md-0">
                    <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>✅</div>
                    <h5 className="mb-2">100% Xác Thực</h5>
                    <p className="mb-0" style={{ opacity: 0.9 }}>Đánh giá từ khách hàng thực</p>
                  </Col>
                  <Col md={3} className="mb-4 mb-md-0">
                    <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>�️</div>
                    <h5 className="mb-2">Đã Xác Minh</h5>
                    <p className="mb-0" style={{ opacity: 0.9 }}>Chỉ từ đơn hàng thực tế</p>
                  </Col>
                  <Col md={3} className="mb-4 mb-md-0">
                    <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>⭐</div>
                    <h5 className="mb-2">{statistics?.average_rating?.toFixed(1) || 0}/5</h5>
                    <p className="mb-0" style={{ opacity: 0.9 }}>Điểm trung bình</p>
                  </Col>
                  <Col md={3}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>💬</div>
                    <h5 className="mb-2">{statistics?.total_reviews || 0}+</h5>
                    <p className="mb-0" style={{ opacity: 0.9 }}>Đánh giá đã kiểm duyệt</p>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* Call to Action */}
            <div className="text-center py-5" data-aos="fade-up">
              <h3 className="mb-3">Bạn đã trải nghiệm sản phẩm của Serenity?</h3>
              <p className="text-muted mb-4">
                Chia sẻ đánh giá của bạn để giúp cộng đồng khách hàng đưa ra lựa chọn tốt nhất
              </p>
              <Button as={Link} to="/shop" variant="primary" size="lg" className="px-5">
                Khám Phá Sản Phẩm
              </Button>
            </div>
          </>
        )}
      </Container>
    </div>
  );
};

export default Reviews;