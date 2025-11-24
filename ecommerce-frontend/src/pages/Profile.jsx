import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Form, Tab, Tabs } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiShoppingBag, FiLogOut, FiEdit2, FiSave, FiHeart } from 'react-icons/fi';
import { logout } from '../store/userSlice';
import { toast } from 'react-toastify';
import AOS from 'aos';
import '../styles/Profile.css';

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo, isAuthenticated } = useSelector(state => state.user);
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: userInfo?.name || '',
    email: userInfo?.email || '',
    phone: userInfo?.phone || '',
    address: userInfo?.address || ''
  });

  // Update form when userInfo changes
  React.useEffect(() => {
    if (userInfo) {
      setFormData({
        name: userInfo.name || '',
        email: userInfo.email || '',
        phone: userInfo.phone || '',
        address: userInfo.address || ''
      });
    }
  }, [userInfo]);

  // Initialize AOS animation
  React.useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });
  }, []);

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Đăng xuất thành công!');
    navigate('/');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    // TODO: Implement API call to update profile
    toast.success('Cập nhật thông tin thành công!');
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setFormData({
      name: userInfo?.name || '',
      email: userInfo?.email || '',
      phone: userInfo?.phone || '',
      address: userInfo?.address || ''
    });
    setIsEditing(false);
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="profile-page">
      <Container className="py-5">
        <div className="text-center mb-4" data-aos="fade-up">
          <h2 style={{ color: 'var(--text-dark)' }}>Tài khoản của tôi</h2>
          <p className="text-muted">Quản lý thông tin cá nhân và đơn hàng của bạn</p>
        </div>
        
        <Row>
          {/* Sidebar */}
          <Col lg={3} md={4} className="mb-4" data-aos="fade-right">
            <Card className="profile-sidebar">
              <Card.Body className="text-center">
                <div className="profile-avatar mb-3">
                  {userInfo?.avatar ? (
                    <img 
                      src={userInfo.avatar} 
                      alt={userInfo.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: '50%',
                        objectFit: 'cover'
                      }}
                    />
                  ) : (
                    <FiUser size={60} />
                  )}
                </div>
                <h5 className="mb-1" style={{ color: 'var(--text-dark)' }}>{userInfo?.name}</h5>
                <p className="text-muted small">{userInfo?.email}</p>
                {userInfo?.role === 'admin' && (
                  <span className="badge" style={{
                    background: 'linear-gradient(135deg, var(--primary-color), var(--brown-light))',
                    color: 'white',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '20px',
                    fontSize: '0.75rem'
                  }}>
                    Quản trị viên
                  </span>
                )}
                <Button 
                  variant="outline-danger" 
                  size="sm" 
                  className="mt-3 w-100"
                  onClick={handleLogout}
                >
                  <FiLogOut className="me-2" />
                  Đăng xuất
                </Button>
              </Card.Body>
            </Card>
          </Col>

          {/* Main Content */}
          <Col lg={9} md={8} data-aos="fade-left">
            <Tabs defaultActiveKey="profile" className="mb-4" fill>
              <Tab eventKey="profile" title={<><FiUser className="me-2" />Thông tin cá nhân</>}>
                <Card>
                  <Card.Header className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Thông tin cá nhân</h5>
                    {!isEditing && (
                      <Button 
                        variant="outline-primary" 
                        size="sm"
                        onClick={() => setIsEditing(true)}
                      >
                        <FiEdit2 className="me-2" />
                        Chỉnh sửa
                      </Button>
                    )}
                  </Card.Header>
                  <Card.Body>
                    <Form onSubmit={handleSaveProfile}>
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Họ tên</Form.Label>
                            <Form.Control
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleInputChange}
                              disabled={!isEditing}
                              placeholder="Nhập họ tên"
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              disabled={!isEditing}
                              placeholder="Nhập email"
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Số điện thoại</Form.Label>
                            <Form.Control
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                              disabled={!isEditing}
                              placeholder="Nhập số điện thoại"
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Đăng nhập gần nhất</Form.Label>
                            <Form.Control
                              type="text"
                              value={userInfo?.last_login_at 
                                ? new Date(userInfo.last_login_at).toLocaleString('vi-VN')
                                : 'Chưa có thông tin'
                              }
                              disabled
                            />
                          </Form.Group>
                        </Col>
                      </Row>

                      <Form.Group className="mb-3">
                        <Form.Label>Địa chỉ</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          placeholder="Nhập địa chỉ"
                        />
                      </Form.Group>

                      {isEditing && (
                        <div className="d-flex gap-2 justify-content-end">
                          <Button 
                            variant="secondary" 
                            onClick={handleCancelEdit}
                          >
                            Hủy
                          </Button>
                          <Button 
                            variant="primary" 
                            type="submit"
                          >
                            <FiSave className="me-2" />
                            Lưu thay đổi
                          </Button>
                        </div>
                      )}
                    </Form>
                  </Card.Body>
                </Card>
              </Tab>

              <Tab eventKey="orders" title={<><FiShoppingBag className="me-2" />Đơn hàng của tôi</>}>
                <Card>
                  <Card.Body>
                    <div className="text-center py-5">
                      <FiShoppingBag size={60} className="text-muted mb-3" />
                      <h5 className="text-muted">Chưa có đơn hàng nào</h5>
                      <p className="text-muted">Bạn chưa có đơn hàng nào. Hãy bắt đầu mua sắm ngay!</p>
                      <Button 
                        variant="primary" 
                        onClick={() => navigate('/shop')}
                      >
                        Mua sắm ngay
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Tab>

              <Tab eventKey="wishlist" title={<><FiHeart className="me-2" />Sản phẩm yêu thích</>}>
                <Card>
                  <Card.Body>
                    <div className="text-center py-5">
                      <FiHeart size={60} className="text-muted mb-3" />
                      <h5 className="text-muted">Chưa có sản phẩm yêu thích</h5>
                      <p className="text-muted">Bạn chưa thêm sản phẩm nào vào danh sách yêu thích.</p>
                      <Button 
                        variant="primary" 
                        onClick={() => navigate('/shop')}
                      >
                        Khám phá sản phẩm
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Tab>

              <Tab eventKey="security" title="Bảo mật">
                <Card>
                  <Card.Header>
                    <h5 className="mb-0">Đổi mật khẩu</h5>
                  </Card.Header>
                  <Card.Body>
                    <Form>
                      <Form.Group className="mb-3">
                        <Form.Label>Mật khẩu hiện tại</Form.Label>
                        <Form.Control
                          type="password"
                          placeholder="Nhập mật khẩu hiện tại"
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Mật khẩu mới</Form.Label>
                        <Form.Control
                          type="password"
                          placeholder="Nhập mật khẩu mới"
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Xác nhận mật khẩu mới</Form.Label>
                        <Form.Control
                          type="password"
                          placeholder="Nhập lại mật khẩu mới"
                        />
                      </Form.Group>

                      <Button variant="primary" type="submit">
                        Đổi mật khẩu
                      </Button>
                    </Form>
                  </Card.Body>
                </Card>
              </Tab>
            </Tabs>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Profile;
