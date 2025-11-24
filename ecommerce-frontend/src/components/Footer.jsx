import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FiFacebook, FiInstagram, FiTwitter, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="footer">
      <Container>
        <Row>
          <Col lg={4} md={6} className="mb-3 mb-lg-0">
            <h5>🕯️ Serenity</h5>
            <p className="mb-2" style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>
              Mang đến những sản phẩm chăm sóc cơ thể tự nhiên, giúp bạn thư giãn trong chính ngôi nhà của mình.
            </p>
            <div className="d-flex gap-3">
              <a href="#" className="text-decoration-none">
                <FiFacebook size={20} />
              </a>
              <a href="#" className="text-decoration-none">
                <FiInstagram size={20} />
              </a>
              <a href="#" className="text-decoration-none">
                <FiTwitter size={20} />
              </a>
            </div>
          </Col>
          
          <Col lg={2} md={6} className="mb-3 mb-lg-0">
            <h5>Danh Mục</h5>
            <ul className="list-unstyled mb-0">
              <li className="mb-1">
                <Link to="/shop/candles" className="text-decoration-none" style={{ fontSize: '0.9rem' }}>Nến Thơm</Link>
              </li>
              <li className="mb-1">
                <Link to="/shop/essential-oils" className="text-decoration-none" style={{ fontSize: '0.9rem' }}>Tinh Dầu</Link>
              </li>
              <li className="mb-1">
                <Link to="/shop/shampoo" className="text-decoration-none" style={{ fontSize: '0.9rem' }}>Dầu Gội</Link>
              </li>
              <li className="mb-1">
                <Link to="/shop/body-wash" className="text-decoration-none" style={{ fontSize: '0.9rem' }}>Sữa Tắm</Link>
              </li>
            </ul>
          </Col>
          
          <Col lg={3} md={6} className="mb-3 mb-lg-0">
            <h5>Hỗ Trợ</h5>
            <ul className="list-unstyled mb-0">
              <li className="mb-1">
                <Link to="/about" className="text-decoration-none" style={{ fontSize: '0.9rem' }}>Giới Thiệu</Link>
              </li>
              <li className="mb-1">
                <Link to="/contact" className="text-decoration-none" style={{ fontSize: '0.9rem' }}>Liên Hệ</Link>
              </li>
              <li className="mb-1">
                <Link to="/shipping" className="text-decoration-none" style={{ fontSize: '0.9rem' }}>Giao Hàng</Link>
              </li>
              <li className="mb-1">
                <Link to="/returns" className="text-decoration-none" style={{ fontSize: '0.9rem' }}>Đổi Trả</Link>
              </li>
            </ul>
          </Col>
          
          <Col lg={3} md={6} className="mb-3 mb-lg-0">
            <h5>Liên Hệ</h5>
            <div className="mb-1 d-flex align-items-start" style={{ fontSize: '0.9rem' }}>
              <FiMapPin size={14} className="me-2 mt-1" style={{ flexShrink: 0 }} />
              <span>123 Đường ABC, Q.1, TP.HCM</span>
            </div>
            <div className="mb-1 d-flex align-items-center" style={{ fontSize: '0.9rem' }}>
              <FiPhone size={14} className="me-2" />
              <span>0123 456 789</span>
            </div>
            <div className="mb-1 d-flex align-items-center" style={{ fontSize: '0.9rem' }}>
              <FiMail size={14} className="me-2" />
              <span>hello@serenity.vn</span>
            </div>
          </Col>
        </Row>
        
        <hr className="mt-4 mb-2" style={{ borderColor: 'var(--primary-color)', opacity: 0.3 }} />
        
        <Row>
          <Col className="text-center py-2">
            <p className="mb-0" style={{ fontSize: '0.85rem', opacity: 0.9 }}>
              &copy; 2024 Serenity. Tất cả quyền được bảo lưu. 
              <span className="mx-2">|</span>
              <Link to="/privacy" className="text-decoration-none">Chính sách bảo mật</Link>
              <span className="mx-2">|</span>
              <Link to="/terms" className="text-decoration-none">Điều khoản sử dụng</Link>
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;