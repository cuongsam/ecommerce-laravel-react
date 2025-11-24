import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Card, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import BannerSlider from '../components/BannerSlider';
import ProductCard from '../components/ProductCard';
import { categories, reviews } from '../data/products';
import productService from '../services/product.service';
import { FiStar, FiUser } from 'react-icons/fi';
import AOS from 'aos';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  // Fetch featured products từ API
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        const response = await productService.getFeaturedProducts();
        console.log('🌟 Featured Products Response:', response);
        setFeaturedProducts(response.data || []);
      } catch (error) {
        console.error('Error fetching featured products:', error);
        // Fallback to empty array
        setFeaturedProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <div>
      {/* Hero Banner */}
      <BannerSlider />

      {/* Category Section */}
      <section className="py-5" style={{ backgroundColor: 'var(--secondary-color)' }}>
        <Container>
          <div className="text-center mb-5" data-aos="fade-up">
            <h2>Danh Mục Sản Phẩm</h2>
            <p className="text-muted">Khám phá bộ sưu tập sản phẩm chăm sóc tự nhiên của chúng tôi</p>
          </div>
          <Row>
            {categories.map((category, index) => (
              <Col lg={3} md={6} className="mb-4" key={category.id} data-aos="fade-up" data-aos-delay={index * 100}>
                <Card className="text-center h-100 scale-hover">
                  <Card.Body className="p-4">
                    <div className="mb-3" style={{ fontSize: '3rem' }}>
                      {category.icon}
                    </div>
                    <Card.Title as="h5">{category.name}</Card.Title>
                    <Card.Text className="text-muted mb-3">
                      {category.description}
                    </Card.Text>
                    <Button 
                      as={Link} 
                      to={`/shop/${category.id}`} 
                      variant="outline-primary"
                      className="btn-soft"
                    >
                      Xem Sản Phẩm
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Featured Products */}
      <section className="py-5">
        <Container>
          <div className="text-center mb-5" data-aos="fade-up">
            <h2>Sản Phẩm Nổi Bật</h2>
            <p className="text-muted">Những sản phẩm được yêu thích nhất từ khách hàng</p>
          </div>
          
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-3">Đang tải sản phẩm...</p>
            </div>
          ) : featuredProducts.length > 0 ? (
            <>
              <Row>
                {featuredProducts.slice(0, 6).map((product, index) => (
                  <Col lg={4} md={6} className="mb-4" key={product.id} data-aos="fade-up" data-aos-delay={index * 100}>
                    <ProductCard product={product} />
                  </Col>
                ))}
              </Row>
              <div className="text-center mt-4" data-aos="fade-up">
                <Button as={Link} to="/featured" variant="primary" size="lg">
                  Xem Tất Cả Sản Phẩm Nổi Bật
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-5" data-aos="fade-up">
              <p className="text-muted">Chưa có sản phẩm nổi bật</p>
              <Button as={Link} to="/shop" variant="primary">
                Khám Phá Cửa Hàng
              </Button>
            </div>
          )}
        </Container>
      </section>

      {/* Customer Reviews Section */}
      <section className="py-5" style={{ backgroundColor: 'var(--secondary-color)' }}>
        <Container>
          <div className="text-center mb-5" data-aos="fade-up">
            <h2>Khách Hàng Nói Gì Về Chúng Tôi</h2>
            <p className="text-muted">Những chia sẻ chân thực từ khách hàng đã trải nghiệm sản phẩm</p>
          </div>
          <Row>
            {reviews.slice(0, 3).map((review, index) => (
              <Col lg={4} md={6} className="mb-4" key={review.id} data-aos="fade-up" data-aos-delay={index * 100}>
                <Card className="h-100 scale-hover" style={{ border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
                  <Card.Body className="p-4">
                    {/* Rating Stars */}
                    <div className="d-flex align-items-center mb-3">
                      <div className="rating-stars me-2">
                        {[...Array(5)].map((_, i) => (
                          <FiStar 
                            key={i} 
                            fill={i < review.rating ? '#ffc107' : 'none'}
                            color="#ffc107"
                            size={18}
                          />
                        ))}
                      </div>
                      <span className="fw-bold text-primary">{review.rating}/5</span>
                    </div>

                    {/* Review Comment */}
                    <Card.Text className="mb-4" style={{ 
                      fontSize: '1rem', 
                      lineHeight: '1.7',
                      fontStyle: 'italic',
                      color: 'var(--text-dark)'
                    }}>
                      "{review.comment}"
                    </Card.Text>

                    {/* Product Name */}
                    <div className="mb-3 pb-3" style={{ borderBottom: '1px solid var(--secondary-color)' }}>
                      <small className="text-muted">Sản phẩm: </small>
                      <span className="fw-semibold" style={{ color: 'var(--primary-color)' }}>
                        {review.product}
                      </span>
                    </div>

                    {/* Customer Info */}
                    <div className="d-flex align-items-center">
                      <div 
                        className="rounded-circle d-flex align-items-center justify-content-center me-3"
                        style={{ 
                          width: '45px', 
                          height: '45px',
                          backgroundColor: 'var(--primary-color)'
                        }}
                      >
                        <FiUser color="white" size={22} />
                      </div>
                      <div>
                        <div className="fw-semibold" style={{ color: 'var(--text-dark)' }}>
                          {review.name}
                        </div>
                        <small className="text-muted">Khách hàng đã mua</small>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
          <div className="text-center mt-4" data-aos="fade-up" data-aos-delay="400">
            <Button as={Link} to="/reviews" variant="outline-primary" size="lg" className="btn-soft">
              Xem Tất Cả Đánh Giá
            </Button>
          </div>
        </Container>
      </section>

      {/* About Section */}
      <section className="py-5" style={{ backgroundColor: 'var(--cream)' }}>
        <Container>
          <Row className="align-items-center">
            <Col lg={6} className="mb-4 mb-lg-0" data-aos="fade-right">
              <img 
                src="https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600" 
                alt="About Serenity" 
                className="img-fluid rounded shadow"
              />
            </Col>
            <Col lg={6} data-aos="fade-left">
              <h2 className="mb-4">Về Serenity</h2>
              <p className="text-muted mb-4">
                Serenity được sinh ra từ niềm đam mê tạo ra những sản phẩm chăm sóc cơ thể tự nhiên, 
                giúp bạn tìm lại sự cân bằng và thư giãn trong cuộc sống hiện đại đầy bận rộn.
              </p>
              <p className="text-muted mb-4">
                Chúng tôi tin rằng mỗi sản phẩm không chỉ là món đồ chăm sóc cơ thể mà còn là 
                cầu nối giúp bạn kết nối với thiên nhiên và tìm thấy những giây phút bình yên 
                trong chính ngôi nhà của mình.
              </p>
              <div className="d-flex gap-3">
                <Button as={Link} to="/about" variant="primary">
                  Tìm Hiểu Thêm
                </Button>
                <Button as={Link} to="/shop" variant="outline-primary">
                  Mua Sắm Ngay
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Benefits Section */}
      <section className="py-5">
        <Container>
          <div className="text-center mb-5" data-aos="fade-up">
            <h2>Tại Sao Chọn Serenity?</h2>
            <p className="text-muted">Những lợi ích đặc biệt khi sử dụng sản phẩm của chúng tôi</p>
          </div>
          <Row>
            <Col lg={4} md={6} className="mb-4" data-aos="fade-up" data-aos-delay="100">
              <div className="text-center">
                <div className="mb-3" style={{ fontSize: '3rem' }}>🌿</div>
                <h5>100% Tự Nhiên</h5>
                <p className="text-muted">
                  Tất cả sản phẩm đều được làm từ nguyên liệu tự nhiên, không chứa hóa chất độc hại
                </p>
              </div>
            </Col>
            <Col lg={4} md={6} className="mb-4" data-aos="fade-up" data-aos-delay="200">
              <div className="text-center">
                <div className="mb-3" style={{ fontSize: '3rem' }}>💚</div>
                <h5>Thân Thiện Môi Trường</h5>
                <p className="text-muted">
                  Cam kết bảo vệ môi trường với bao bì có thể tái chế và quy trình sản xuất xanh
                </p>
              </div>
            </Col>
            <Col lg={4} md={6} className="mb-4" data-aos="fade-up" data-aos-delay="300">
              <div className="text-center">
                <div className="mb-3" style={{ fontSize: '3rem' }}>✨</div>
                <h5>Chất Lượng Cao Cấp</h5>
                <p className="text-muted">
                  Từng sản phẩm đều được kiểm tra kỹ lưỡng để đảm bảo chất lượng tốt nhất
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default Home;