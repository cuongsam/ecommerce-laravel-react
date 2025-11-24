import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { FiUser, FiLock, FiEye, FiEyeOff, FiMail } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { registerUser, loginUser } from '../store/userSlice';
import AOS from 'aos';


const Login = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    password: '',
    password_confirmation: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector(state => state.user);
  const [hasJustLoggedIn, setHasJustLoggedIn] = useState(false);


  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });
  }, []);

  useEffect(() => {
    // Chỉ redirect khi vừa đăng nhập thành công, không phải khi load trang
    if (isAuthenticated && hasJustLoggedIn) {
      toast.success('Chào mừng bạn trở lại!');
      navigate('/');
    }
  }, [isAuthenticated, hasJustLoggedIn, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (isRegistering && !formData.name.trim()) {
      newErrors.name = 'Vui lòng nhập họ và tên';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (!formData.password) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Mật khẩu phải có ít nhất 8 ký tự';
    }

    if (isRegistering) {
      if (!formData.password_confirmation) {
        newErrors.password_confirmation = 'Vui lòng xác nhận mật khẩu';
      } else if (formData.password !== formData.password_confirmation) {
        newErrors.password_confirmation = 'Mật khẩu xác nhận không khớp';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      if (isRegistering) {
        // Đăng ký
        const result = await dispatch(registerUser(formData));
        
        if (registerUser.fulfilled.match(result)) {
          setHasJustLoggedIn(true);
          toast.success('Đăng ký thành công!');
          navigate('/');
        } else if (registerUser.rejected.match(result)) {
          const errorData = result.payload;
          if (errorData.errors) {
            // Xử lý lỗi validation từ Laravel
            const laravelErrors = {};
            Object.keys(errorData.errors).forEach(key => {
              laravelErrors[key] = errorData.errors[key][0];
            });
            setErrors(laravelErrors);
          }
          toast.error(errorData.message || 'Đăng ký thất bại!');
        }
      } else {
        // Đăng nhập
        const loginData = {
          email: formData.email,
          password: formData.password
        };
        
        const result = await dispatch(loginUser(loginData));
        
        if (loginUser.fulfilled.match(result)) {
          setHasJustLoggedIn(true);
          toast.success('Đăng nhập thành công!');
          navigate('/');
        } else if (loginUser.rejected.match(result)) {
          const errorData = result.payload;
          if (errorData.errors) {
            setErrors(errorData.errors);
          }
          toast.error(errorData.message || 'Đăng nhập thất bại!');
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      toast.error('Có lỗi xảy ra! Vui lòng thử lại.');
    }
  };

 const toggleMode = () => {
    setIsRegistering(!isRegistering);
    // ← CLEAR form properly
    setFormData({
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
    });
    setErrors({});
    setHasJustLoggedIn(false);  // ← THÊM
};

  return (
    <div className="login-container">
      {/* Decorative background */}
      <div className="bg-decoration bg-decoration-1"></div>
      <div className="bg-decoration bg-decoration-2"></div>

      <Container fluid style={{ maxWidth: '1200px', position: 'relative', zIndex: 1 }}>
        <Row className="justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
          <Col lg={11} xl={10}>
            {/* Flip Container */}
            <div className="flip-container">
              <Card 
                className={`flip-card ${isRegistering ? 'flipped' : ''}`}
                data-aos="fade-up"
              >
                <Row className="g-0">
                  {/* Left Side - Branding */}
                  <Col 
                    md={5} 
                    className="d-none d-md-flex left-side"
                    data-aos="fade-right"
                    data-aos-delay="200"
                  >
                    <div className="d-flex flex-column justify-content-center w-100 px-4">
                      <div className="text-center mb-5">
                        <div className="brand-icon">🕯️</div>
                        <h1 className="brand-title">Serenity</h1>
                        <p className="brand-subtitle">
                          Khám phá sự bình yên trong tâm hồn
                        </p>
                      </div>
                      
                      <div className="features-list">
                        <FeatureItem 
                          icon="✨" 
                          title="Trải nghiệm độc đáo"
                          desc="Không gian thiền định riêng của bạn"
                        />
                        <FeatureItem 
                          icon="🌸" 
                          title="Bình yên nội tâm"
                          desc="Tìm thấy sự cân bằng trong cuộc sống"
                        />
                        <FeatureItem 
                          icon="🧘" 
                          title="Thực hành hàng ngày"
                          desc="Công cụ hỗ trợ thiền và mindfulness"
                        />
                      </div>

                      <div className="testimonial mt-5">
                        <div className="testimonial-text">
                          "Serenity đã giúp tôi tìm thấy sự cân bằng trong cuộc sống hàng ngày."
                        </div>
                        <div className="testimonial-author">- Nguyễn Thị Bình -</div>
                      </div>
                    </div>
                  </Col>

                  {/* Right Side - Form */}
                  <Col md={7} className="right-side">
                    <div className="d-flex flex-column justify-content-center h-100 px-4 py-5">
                      <div className="mb-4">
                        <Link to="/" className="back-link">
                          <span>←</span> Quay về trang chủ
                        </Link>
                        
                        <h2 className="form-title">
                          {isRegistering ? '🌟 Tạo tài khoản' : '👋 Chào mừng trở lại'}
                        </h2>
                        <p className="form-subtitle">
                          {isRegistering 
                            ? 'Bắt đầu hành trình khám phá bản thân'
                            : 'Tiếp tục hành trình của bạn với Serenity'
                          }
                        </p>
                      </div>

                      {error && !errors.email && !errors.password && (
                        <Alert variant="danger" className="custom-alert">
                          {error.message || 'Có lỗi xảy ra. Vui lòng thử lại!'}
                        </Alert>
                      )}

                      <Form onSubmit={handleSubmit} noValidate>
                        {isRegistering && (
                          <FormInput
                            label="Họ và tên"
                            icon={<FiUser />}
                            type="text"
                            name="name"
                            placeholder="Nguyễn Văn A"
                            value={formData.name}
                            onChange={handleChange}
                            error={errors.name}
                            required={isRegistering}
                          />
                        )}

                        <FormInput
                          label="Email"
                          icon={<FiMail />}
                          type="email"
                          name="email"
                          placeholder="your@email.com"
                          value={formData.email}
                          onChange={handleChange}
                          error={errors.email}
                          required
                        />

                        <FormInput
                          label="Mật khẩu"
                          icon={<FiLock />}
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          placeholder="••••••••"
                          value={formData.password}
                          onChange={handleChange}
                          error={errors.password}
                          required
                          showPassword={showPassword}
                          onTogglePassword={() => setShowPassword(!showPassword)}
                        />

                        {isRegistering && (
                          <FormInput
                            label="Xác nhận mật khẩu"
                            icon={<FiLock />}
                            type="password"
                            name="password_confirmation"
                            placeholder="••••••••"
                            value={formData.password_confirmation}
                            onChange={handleChange}
                            error={errors.password_confirmation}
                            required={isRegistering}
                          />
                        )}

                        {!isRegistering && (
                          <div className="d-flex justify-content-between align-items-center mb-4">
                            <Form.Check
                              type="checkbox"
                              label="Ghi nhớ đăng nhập"
                              id="remember"
                              className="custom-checkbox"
                            />
                            <Link to="/forgot-password" className="forgot-link">
                              Quên mật khẩu?
                            </Link>
                          </div>
                        )}

                        <div className="d-grid gap-2 mb-4">
                          <Button 
                            type="submit" 
                            disabled={loading} 
                            className="submit-btn"
                            size="lg"
                          >
                            {loading ? (
                              <div className="d-flex align-items-center justify-content-center">
                                <div className="spinner-border spinner-border-sm me-2" role="status">
                                  <span className="visually-hidden">Loading...</span>
                                </div>
                                {isRegistering ? 'Đang đăng ký...' : 'Đang đăng nhập...'}
                              </div>
                            ) : (
                              isRegistering ? 'Đăng Ký Ngay' : 'Đăng Nhập'
                            )}
                          </Button>
                        </div>

                        <div className="text-center mb-4">
                          <span className="text-muted switch-text">
                            {isRegistering ? 'Đã có tài khoản?' : 'Chưa có tài khoản?'}
                          </span>
                          <Button 
                            variant="link" 
                            className="switch-btn" 
                            onClick={toggleMode}
                            disabled={loading}
                          >
                            {isRegistering ? 'Đăng nhập ngay' : 'Đăng ký ngay'}
                          </Button>
                        </div>

                        {/* Social Login */}
                        <div>
                          <div className="position-relative mb-3">
                            <hr className="divider" />
                            <span className="divider-text">
                              Hoặc {isRegistering ? 'đăng ký' : 'đăng nhập'} với
                            </span>
                          </div>
                          <Row className="g-2">
                            <Col xs={6}>
                              <Button 
                                variant="outline-secondary" 
                                className="social-btn w-100"
                                disabled={loading}
                              >
                                <span className="social-icon">📘</span> Facebook
                              </Button>
                            </Col>
                            <Col xs={6}>
                              <Button 
                                variant="outline-secondary" 
                                className="social-btn w-100"
                                disabled={loading}
                              >
                                <span className="social-icon">🔍</span> Google
                              </Button>
                            </Col>
                          </Row>
                        </div>
                      </Form>
                    </div>
                  </Col>
                </Row>
              </Card>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

// Component cho Feature Item
const FeatureItem = ({ icon, title, desc }) => (
  <div className="feature-item mb-4">
    <div className="d-flex align-items-start">
      <div className="feature-icon me-3">{icon}</div>
      <div>
        <h6 className="feature-title mb-1">{title}</h6>
        <p className="feature-desc mb-0 text-muted">{desc}</p>
      </div>
    </div>
  </div>
);

// Component cho Form Input
const FormInput = ({ 
  label, 
  icon, 
  type, 
  name, 
  placeholder, 
  value, 
  onChange, 
  required,
  error,
  showPassword,
  onTogglePassword 
}) => (
  <Form.Group className="mb-3">
    <Form.Label className="input-label">{label} {required && <span className="text-danger">*</span>}</Form.Label>
    <div className="position-relative">
      <Form.Control
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`custom-input ps-5 ${error ? 'is-invalid' : ''}`}
        required={required}
        style={{ paddingRight: onTogglePassword ? '45px' : '12px' }}
      />
      <div className="input-icon">{icon}</div>
      {onTogglePassword && (
        <Button
          variant="link"
          className="password-toggle"
          onClick={onTogglePassword}
          type="button"
          style={{ right: '12px' }}
        >
          {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
        </Button>
      )}
    </div>
    {error && <div className="invalid-feedback d-block">{error}</div>}
  </Form.Group>
);

export default Login;