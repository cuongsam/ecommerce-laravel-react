import React from 'react';
import { Navbar, Nav, Container, Badge, NavDropdown } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FiShoppingCart, FiUser, FiHeart, FiLogOut, FiSettings } from 'react-icons/fi';
import { logout } from '../store/userSlice';
import { toast } from 'react-toastify';

const Header = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { itemCount } = useSelector(state => state.cart);
  const { wishlistCount } = useSelector(state => state.wishlist || { wishlistCount: 0 });
  const { isAuthenticated, userInfo } = useSelector(state => state.user);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Đăng xuất thành công!');
  };

  return (
    <Navbar expand="lg" className="navbar" fixed="top">
      <Container>
        <Navbar.Brand as={Link} to="/" className="navbar-brand">
          🕯️ Serenity
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link 
              as={Link} 
              to="/" 
              className={isActive('/') ? 'active' : ''}
            >
              Trang Chủ
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/shop" 
              className={isActive('/shop') ? 'active' : ''}
            >
              Sản Phẩm
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/about" 
              className={isActive('/about') ? 'active' : ''}
            >
              Giới Thiệu
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/reviews" 
              className={isActive('/reviews') ? 'active' : ''}
            >
              Đánh Giá
            </Nav.Link>

            <Nav.Link 
              as={Link} 
              to="/featured" 
              className={isActive('/featured') ? 'active' : ''}
            >
              Nổi Bật
            </Nav.Link>
            
          </Nav>
          
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/cart" className="position-relative">
              <FiShoppingCart size={20} />
              {itemCount > 0 && (
                <Badge 
                  bg="danger" 
                  className="position-absolute top-0 start-100 translate-middle badge-sale"
                  style={{ fontSize: '0.7rem' }}
                >
                  {itemCount}
                </Badge>
              )}
            </Nav.Link>
            
            <Nav.Link as={Link} to="/wishlist" className="position-relative">
              <FiHeart size={20} />
              {wishlistCount > 0 && (
                <Badge 
                  bg="danger" 
                  className="position-absolute top-0 start-100 translate-middle badge-sale"
                  style={{ fontSize: '0.7rem' }}
                >
                  {wishlistCount}
                </Badge>
              )}
            </Nav.Link>
            
            {isAuthenticated ? (
              <NavDropdown 
                title={
                  <span className="d-flex align-items-center">
                    <FiUser size={20} className="me-1" />
                    <span className="d-none d-lg-inline">{userInfo?.name || 'Tài khoản'}</span>
                  </span>
                }
                id="user-dropdown"
                align="end"
              >
                <NavDropdown.Item as={Link} to="/profile">
                  <FiSettings className="me-2" />
                  Trang cá nhân
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>
                  <FiLogOut className="me-2" />
                  Đăng xuất
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <Nav.Link as={Link} to="/login" className="d-flex align-items-center">
                <FiUser size={20} className="me-1" />
                <span className="d-none d-lg-inline">Đăng nhập</span>
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;