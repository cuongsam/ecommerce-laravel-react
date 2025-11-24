import React, { useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import AOS from 'aos';

const About = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  return (
    <div style={{ paddingTop: '100px' }}>
      {/* Hero Section */}
      <section className="py-5" style={{ backgroundColor: 'var(--secondary-color)' }}>
        <Container>
          <Row className="align-items-center">
            <Col lg={6} className="mb-4 mb-lg-0" data-aos="fade-right">
              <h1 className="mb-4">Câu Chuyện Của Serenity</h1>
              <p className="text-muted mb-4" style={{ fontSize: '1.1rem', lineHeight: '1.7' }}>
                Serenity được sinh ra từ niềm đam mê tạo ra những sản phẩm chăm sóc cơ thể tự nhiên, 
                giúp mọi người tìm lại sự cân bằng và thư giãn trong cuộc sống hiện đại đầy bận rộn.
              </p>
              <p className="text-muted mb-4" style={{ fontSize: '1.1rem', lineHeight: '1.7' }}>
                Chúng tôi tin rằng mỗi sản phẩm không chỉ là món đồ chăm sóc cơ thể mà còn là 
                cầu nối giúp bạn kết nối với thiên nhiên và tìm thấy những giây phút bình yên.
              </p>
            </Col>
            <Col lg={6} data-aos="fade-left">
              <img 
                src="https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600" 
                alt="About Serenity" 
                className="img-fluid rounded shadow"
              />
            </Col>
          </Row>
        </Container>
      </section>

      {/* Mission & Vision */}
      <section className="py-5">
        <Container>
          <Row>
            <Col lg={6} className="mb-4" data-aos="fade-up" data-aos-delay="100">
              <Card className="h-100 text-center border-0 shadow-sm">
                <Card.Body className="p-5">
                  <div style={{ fontSize: '4rem', marginBottom: '2rem' }}>🎯</div>
                  <h3 className="mb-4">Sứ Mệnh</h3>
                  <p className="text-muted mb-0" style={{ fontSize: '1.1rem', lineHeight: '1.7' }}>
                    Mang đến những sản phẩm chăm sóc cơ thể tự nhiên chất lượng cao, 
                    giúp khách hàng tạo ra không gian thư giãn và ấm cúng trong chính ngôi nhà của mình.
                  </p>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={6} className="mb-4" data-aos="fade-up" data-aos-delay="200">
              <Card className="h-100 text-center border-0 shadow-sm">
                <Card.Body className="p-5">
                  <div style={{ fontSize: '4rem', marginBottom: '2rem' }}>👁️</div>
                  <h3 className="mb-4">Tầm Nhìn</h3>
                  <p className="text-muted mb-0" style={{ fontSize: '1.1rem', lineHeight: '1.7' }}>
                    Trở thành thương hiệu hàng đầu về sản phẩm chăm sóc tự nhiên tại Việt Nam, 
                    góp phần nâng cao chất lượng cuộc sống và sức khỏe tinh thần của người dùng.
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Values */}
      <section className="py-5" style={{ backgroundColor: 'var(--cream)' }}>
        <Container>
          <div className="text-center mb-5" data-aos="fade-up">
            <h2 className="mb-4">Giá Trị Cốt Lõi</h2>
            <p className="text-muted">Những nguyên tắc định hướng mọi hoạt động của chúng tôi</p>
          </div>
          <Row>
            <Col lg={4} className="mb-4" data-aos="fade-up" data-aos-delay="100">
              <div className="text-center">
                <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>🌿</div>
                <h5 className="mb-3">Tự Nhiên</h5>
                <p className="text-muted">
                  Sử dụng 100% nguyên liệu tự nhiên, không chứa hóa chất độc hại, 
                  an toàn cho người dùng và môi trường.
                </p>
              </div>
            </Col>
            <Col lg={4} className="mb-4" data-aos="fade-up" data-aos-delay="200">
              <div className="text-center">
                <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>✨</div>
                <h5 className="mb-3">Chất Lượng</h5>
                <p className="text-muted">
                  Cam kết mang đến sản phẩm chất lượng cao nhất thông qua quy trình 
                  sản xuất nghiêm ngặt và kiểm tra kỹ lưỡng.
                </p>
              </div>
            </Col>
            <Col lg={4} className="mb-4" data-aos="fade-up" data-aos-delay="300">
              <div className="text-center">
                <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>💚</div>
                <h5 className="mb-3">Bền Vững</h5>
                <p className="text-muted">
                  Bảo vệ môi trường với bao bì có thể tái chế và quy trình sản xuất 
                  thân thiện với thiên nhiên.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Process */}
      <section className="py-5">
        <Container>
          <div className="text-center mb-5" data-aos="fade-up">
            <h2 className="mb-4">Quy Trình Sản Xuất</h2>
            <p className="text-muted">Từ nguyên liệu tự nhiên đến sản phẩm hoàn thiện</p>
          </div>
          <Row>
            <Col lg={3} md={6} className="mb-4" data-aos="fade-up" data-aos-delay="100">
              <div className="text-center">
                <div 
                  className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center mx-auto mb-3"
                  style={{ width: '80px', height: '80px', fontSize: '1.5rem' }}
                >
                  1
                </div>
                <h6 className="mb-3">Chọn Lựa Nguyên Liệu</h6>
                <p className="text-muted small">
                  Tuyển chọn nguyên liệu tự nhiên chất lượng cao từ các nhà cung cấp uy tín
                </p>
              </div>
            </Col>
            <Col lg={3} md={6} className="mb-4" data-aos="fade-up" data-aos-delay="200">
              <div className="text-center">
                <div 
                  className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center mx-auto mb-3"
                  style={{ width: '80px', height: '80px', fontSize: '1.5rem' }}
                >
                  2
                </div>
                <h6 className="mb-3">Pha Chế Thủ Công</h6>
                <p className="text-muted small">
                  Pha chế theo công thức độc quyền với tỷ lệ hoàn hảo để tạo ra hương thơm tự nhiên
                </p>
              </div>
            </Col>
            <Col lg={3} md={6} className="mb-4" data-aos="fade-up" data-aos-delay="300">
              <div className="text-center">
                <div 
                  className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center mx-auto mb-3"
                  style={{ width: '80px', height: '80px', fontSize: '1.5rem' }}
                >
                  3
                </div>
                <h6 className="mb-3">Kiểm Tra Chất Lượng</h6>
                <p className="text-muted small">
                  Kiểm tra nghiêm ngặt từng sản phẩm để đảm bảo chất lượng trước khi đóng gói
                </p>
              </div>
            </Col>
            <Col lg={3} md={6} className="mb-4" data-aos="fade-up" data-aos-delay="400">
              <div className="text-center">
                <div 
                  className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center mx-auto mb-3"
                  style={{ width: '80px', height: '80px', fontSize: '1.5rem' }}
                >
                  4
                </div>
                <h6 className="mb-3">Đóng Gói & Giao Hàng</h6>
                <p className="text-muted small">
                  Đóng gói cẩn thận với bao bì thân thiện môi trường và giao hàng tận tay khách hàng
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Team */}
      <section className="py-5" style={{ backgroundColor: 'var(--secondary-color)' }}>
        <Container>
          <div className="text-center mb-5" data-aos="fade-up">
            <h2 className="mb-4">Đội Ngũ Serenity</h2>
            <p className="text-muted">Những người đam mê tạo ra sản phẩm tự nhiên chất lượng</p>
          </div>
          <Row className="justify-content-center">
            <Col lg={4} md={6} className="mb-4" data-aos="fade-up" data-aos-delay="100">
              <Card className="text-center border-0 shadow-sm">
                <Card.Body className="p-4">
                  <div 
                    className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center mx-auto mb-3"
                    style={{ width: '80px', height: '80px', fontSize: '2rem' }}
                  >
                    👩‍💼
                  </div>
                  <h5 className="mb-2">Nguyễn Thị Mai</h5>
                  <p className="text-muted small mb-3">Founder & CEO</p>
                  <p className="text-muted small">
                    "Tôi tin rằng sản phẩm tự nhiên có thể thay đổi cuộc sống của mọi người"
                  </p>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={4} md={6} className="mb-4" data-aos="fade-up" data-aos-delay="200">
              <Card className="text-center border-0 shadow-sm">
                <Card.Body className="p-4">
                  <div 
                    className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center mx-auto mb-3"
                    style={{ width: '80px', height: '80px', fontSize: '2rem' }}
                  >
                    👨‍🔬
                  </div>
                  <h5 className="mb-2">Trần Văn Nam</h5>
                  <p className="text-muted small mb-3">Head of R&D</p>
                  <p className="text-muted small">
                    "Nghiên cứu và phát triển những công thức độc quyền từ thiên nhiên"
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-5">
        <Container>
          <div className="text-center" data-aos="fade-up">
            <h3 className="mb-4">Hãy Cùng Serenity Tạo Nên Không Gian Thư Giãn</h3>
            <p className="text-muted mb-4">
              Khám phá bộ sưu tập sản phẩm tự nhiên của chúng tôi ngay hôm nay
            </p>
            <div className="d-flex gap-3 justify-content-center">
              <Button as={Link} to="/shop" variant="primary" size="lg">
                Mua Sắm Ngay
              </Button>
              <Button as={Link} to="/contact" variant="outline-primary" size="lg">
                Liên Hệ
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default About;