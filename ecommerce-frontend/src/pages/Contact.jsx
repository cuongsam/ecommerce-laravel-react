import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { 
  FiMail, 
  FiPhone, 
  FiMapPin, 
  FiClock, 
  FiFacebook, 
  FiInstagram, 
  FiTwitter,
  FiSend,
  FiCheckCircle
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import AOS from 'aos';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error khi user nhập
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Vui lòng nhập họ tên';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Vui lòng nhập số điện thoại';
    } else if (!/^[0-9]{10}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Số điện thoại không hợp lệ';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Vui lòng nhập tiêu đề';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Vui lòng nhập nội dung';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Nội dung quá ngắn (tối thiểu 10 ký tự)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Vui lòng kiểm tra lại thông tin!');
      return;
    }

    setLoading(true);

    try {
      // ← THÊM API call (nếu có endpoint)
      // const response = await contactService.sendMessage(formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      console.log('Contact form submitted:', formData);
      
      // ← THÊM: Có thể save vào localStorage hoặc backend
      // localStorage.setItem('contact_' + Date.now(), JSON.stringify(formData));
      
      setSubmitted(true);
      toast.success('Gửi thành công! Chúng tôi sẽ liên hệ sớm.');
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });

      // Hide success message after 5 seconds
      setTimeout(() => {
        setSubmitted(false);
      }, 5000);

    } catch (error) {
      toast.error('Có lỗi xảy ra. Vui lòng thử lại!');
      console.error('Contact form error:', error);
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: FiMapPin,
      title: 'Địa Chỉ',
      content: '123 Đường ABC, Quận 1, TP.HCM',
      link: 'https://maps.google.com'
    },
    {
      icon: FiPhone,
      title: 'Điện Thoại',
      content: '0123 456 789',
      link: 'tel:0123456789'
    },
    {
      icon: FiMail,
      title: 'Email',
      content: 'hello@serenity.vn',
      link: 'mailto:hello@serenity.vn'
    },
    {
      icon: FiClock,
      title: 'Giờ Làm Việc',
      content: 'T2 - T7: 8:00 - 20:00\nCN: 9:00 - 17:00',
      link: null
    }
  ];

  const faqItems = [
    {
      question: 'Thời gian giao hàng là bao lâu?',
      answer: 'Chúng tôi giao hàng trong vòng 2-3 ngày làm việc với đơn hàng nội thành và 3-5 ngày với đơn hàng tỉnh.'
    },
    {
      question: 'Chính sách đổi trả như thế nào?',
      answer: 'Bạn có thể đổi trả sản phẩm trong vòng 30 ngày kể từ ngày nhận hàng nếu sản phẩm còn nguyên vẹn.'
    },
    {
      question: 'Tôi có thể thanh toán như thế nào?',
      answer: 'Chúng tôi hỗ trợ thanh toán COD, chuyển khoản ngân hàng, ví MoMo và VNPay.'
    },
    {
      question: 'Làm thế nào để theo dõi đơn hàng?',
      answer: 'Sau khi đặt hàng, bạn sẽ nhận được mã đơn hàng qua email. Sử dụng mã này để theo dõi trên website.'
    }
  ];

  return (
    <div style={{ paddingTop: '100px', minHeight: '100vh' }}>
      {/* Hero Section */}
      <section className="contact-hero py-5" style={{ backgroundColor: 'var(--secondary-color)' }}>
        <Container>
          <div className="text-center" data-aos="fade-up">
            <h1 className="mb-3">Liên Hệ Với Chúng Tôi</h1>
            <p className="text-muted" style={{ fontSize: '1.1rem' }}>
              Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn
            </p>
          </div>
        </Container>
      </section>

      <Container className="py-5">
        <Row>
          {/* Contact Form */}
          <Col lg={8} className="mb-4">
            <Card data-aos="fade-right">
              <Card.Body className="p-4">
                <h3 className="mb-4">📝 Gửi Tin Nhắn</h3>

                {submitted && (
                  <Alert variant="success" className="mb-4">
                    <FiCheckCircle className="me-2" />
                    Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi trong vòng 24 giờ.
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Họ và tên *</Form.Label>
                        <Form.Control
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Nguyễn Văn A"
                          isInvalid={!!errors.name}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.name}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Email *</Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="email@example.com"
                          isInvalid={!!errors.email}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.email}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Số điện thoại *</Form.Label>
                        <Form.Control
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="0123456789"
                          isInvalid={!!errors.phone}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.phone}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Tiêu đề *</Form.Label>
                        <Form.Control
                          type="text"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          placeholder="Chủ đề liên hệ"
                          isInvalid={!!errors.subject}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.subject}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-4">
                    <Form.Label>Nội dung *</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={5}
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Nhập nội dung tin nhắn của bạn..."
                      isInvalid={!!errors.message}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.message}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={loading}
                    className="w-100"
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        Đang gửi...
                      </>
                    ) : (
                      <>
                        <FiSend className="me-2" />
                        Gửi Tin Nhắn
                      </>
                    )}
                  </Button>
                </Form>
              </Card.Body>
            </Card>

            {/* FAQ Section */}
            <Card className="mt-4" data-aos="fade-right" data-aos-delay="100">
              <Card.Body className="p-4">
                <h4 className="mb-4">❓ Câu Hỏi Thường Gặp</h4>
                <div className="faq-list">
                  {faqItems.map((item, index) => (
                    <div key={index} className="faq-item mb-3">
                      <h6 className="text-primary mb-2">{item.question}</h6>
                      <p className="text-muted mb-0">{item.answer}</p>
                    </div>
                  ))}
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* Contact Info Sidebar */}
          <Col lg={4}>
            {/* Contact Info Cards */}
            <div className="contact-info-cards">
              {contactInfo.map((info, index) => (
                <Card 
                  key={index} 
                  className="mb-3 contact-card"
                  data-aos="fade-left" 
                  data-aos-delay={index * 100}
                >
                  <Card.Body>
                    <div className="d-flex align-items-start gap-3">
                      <div className="contact-icon">
                        <info.icon size={24} />
                      </div>
                      <div className="flex-1">
                        <h6 className="mb-2">{info.title}</h6>
                        {info.link ? (
                          <a 
                            href={info.link} 
                            className="text-muted text-decoration-none contact-link"
                            target={info.link.startsWith('http') ? '_blank' : '_self'}
                            rel="noopener noreferrer"
                          >
                            {info.content}
                          </a>
                        ) : (
                          <p className="text-muted mb-0" style={{ whiteSpace: 'pre-line' }}>
                            {info.content}
                          </p>
                        )}
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              ))}
            </div>

            {/* Social Media */}
            <Card className="mt-4" data-aos="fade-left" data-aos-delay="400">
              <Card.Body className="text-center">
                <h6 className="mb-3">Kết Nối Với Chúng Tôi</h6>
                <div className="d-flex justify-content-center gap-3">
                  <a href="#" className="social-link">
                    <FiFacebook size={24} />
                  </a>
                  <a href="#" className="social-link">
                    <FiInstagram size={24} />
                  </a>
                  <a href="#" className="social-link">
                    <FiTwitter size={24} />
                  </a>
                </div>
              </Card.Body>
            </Card>

            {/* Map */}
            <Card className="mt-4" data-aos="fade-left" data-aos-delay="500">
              <Card.Body className="p-0">
                <div className="contact-map">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.4608693592777!2d106.69971731533467!3d10.776531692318378!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f4b3330bcc9%3A0x5a8b2d8f3c4d3f7b!2zUXXhuq1uIDEsIFRow6BuaCBwaOG7kSBI4buTIENow60gTWluaCwgVmnhu4d0IE5hbQ!5e0!3m2!1svi!2s!4v1635000000000!5m2!1svi!2s"
                    width="100%"
                    height="250"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    title="Serenity Location"
                  />
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Contact;

