import React, { useEffect } from 'react';
import { Container, Card, Spinner } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../store/userSlice';
import { toast } from 'react-toastify';
import { FiLogOut } from 'react-icons/fi';

const Logout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // Auto logout after component mounts
    const timer = setTimeout(() => {
      dispatch(logout());
      toast.success('Đăng xuất thành công!');
      navigate('/');
    }, 1500);

    return () => clearTimeout(timer);
  }, [dispatch, navigate]);

  return (
    <div className="logout-page" style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, var(--secondary-color) 0%, var(--cream) 100%)',
      paddingTop: '100px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <Container>
        <Card className="text-center" style={{
          maxWidth: '400px',
          margin: '0 auto',
          borderRadius: '15px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          border: 'none',
          padding: '2rem'
        }}>
          <Card.Body>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--brown-light) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
              boxShadow: '0 4px 12px rgba(212, 165, 116, 0.3)'
            }}>
              <FiLogOut size={40} color="white" />
            </div>
            <h4 className="mb-3" style={{ color: 'var(--text-dark)' }}>Đang đăng xuất...</h4>
            <Spinner animation="border" style={{ color: 'var(--primary-color)' }} />
            <p className="text-muted mt-3">Vui lòng đợi trong giây lát</p>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default Logout;
