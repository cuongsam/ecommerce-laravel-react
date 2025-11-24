import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Spinner, Alert } from 'react-bootstrap';
import ProductCard from '../components/ProductCard';
import productService from '../services/product.service';
import AOS from 'aos';

const Featured = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });
  }, []);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await productService.getFeaturedProducts();
        console.log('🌟 Featured Products Response:', response);
        setFeaturedProducts(response.data || []);
      } catch (err) {
        console.error('Error fetching featured products:', err);
        setError('Không thể tải sản phẩm nổi bật. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <div style={{ paddingTop: '100px', minHeight: '100vh' }}>
      <Container>
        {/* Page Header */}
        <div className="text-center mb-5" data-aos="fade-up">
          <h1 className="mb-3 mt-4">Sản Phẩm Nổi Bật</h1>
          <p className="text-muted">
            Những sản phẩm được yêu thích và đánh giá cao nhất từ khách hàng
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
            <Spinner animation="border" variant="primary" />
            <p className="mt-3">Đang tải sản phẩm nổi bật...</p>
          </div>
        ) : featuredProducts.length > 0 ? (
          <Row>
            {featuredProducts.map((product, index) => (
              <Col lg={4} md={6} className="mb-4" key={product.id} data-aos="fade-up" data-aos-delay={index * 100}>
                <ProductCard product={product} />
              </Col>
            ))}
          </Row>
        ) : (
          <div className="text-center py-5" data-aos="fade-up">
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔍</div>
            <h4>Chưa có sản phẩm nổi bật</h4>
            <p className="text-muted">Vui lòng quay lại sau</p>
          </div>
        )}

        {/* Why Featured Section */}
        <section className="mt-5 py-5" style={{ backgroundColor: 'var(--secondary-color)' }}>
          <Container>
            <Row className="text-center">
              <Col className="mb-4" data-aos="fade-up">
                <h3 className="mb-4">Tại Sao Những Sản Phẩm Này Nổi Bật?</h3>
              </Col>
            </Row>
            <Row>
              <Col md={4} className="mb-4" data-aos="fade-up" data-aos-delay="100">
                <div className="text-center">
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⭐</div>
                  <h5>Đánh Giá Cao</h5>
                  <p className="text-muted">
                    Tất cả đều có rating từ 4.5 sao trở lên từ khách hàng thực tế
                  </p>
                </div>
              </Col>
              <Col md={4} className="mb-4" data-aos="fade-up" data-aos-delay="200">
                <div className="text-center">
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔥</div>
                  <h5>Bán Chạy Nhất</h5>
                  <p className="text-muted">
                    Những sản phẩm có lượng mua nhiều nhất trong tháng
                  </p>
                </div>
              </Col>
              <Col md={4} className="mb-4" data-aos="fade-up" data-aos-delay="300">
                <div className="text-center">
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💝</div>
                  <h5>Được Yêu Thích</h5>
                  <p className="text-muted">
                    Sản phẩm được thêm vào wishlist nhiều nhất
                  </p>
                </div>
              </Col>
            </Row>
          </Container>
        </section>
      </Container>
    </div>
  );
};

export default Featured;