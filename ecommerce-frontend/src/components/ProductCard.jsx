import React from 'react';
import { Card, Badge, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/cartSlice';
import { FiShoppingCart, FiHeart, FiStar } from 'react-icons/fi';
import { toast } from 'react-toastify';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    dispatch(addToCart({ product, quantity: 1 }));
    toast.success(`Đã thêm ${product.name} vào giỏ hàng!`, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
    });
  };

  const handleAddToWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toast.info(`Đã thêm ${product.name} vào danh sách yêu thích!`, {
      position: "top-right",
      autoClose: 2000,
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const calculateDiscount = () => {
    if (product.sale_price && product.sale_price > 0) {
      return Math.round(((product.price - product.sale_price) / product.price) * 100);
    }
    return 0;
  };

  const discount = calculateDiscount();
  const displayPrice = product.sale_price && product.sale_price > 0 ? product.sale_price : product.price;
  const productImage = product.primary_image?.image_url || product.images?.[0]?.image_url || '/placeholder.jpg';

  return (
    <Card className="product-card h-100 scale-hover">
      <div className="position-relative">
        {discount > 0 && (
          <Badge className="badge badge-sale">
            -{discount}%
          </Badge>
        )}
        {product.featured && !discount && (
          <Badge className="badge badge-featured">
            Nổi bật
          </Badge>
        )}
        
        <Card.Img 
          variant="top" 
          src={productImage}
          style={{ height: '250px', objectFit: 'cover' }}
          alt={product.name}
        />
        
        <div className="position-absolute top-0 end-0 p-2">
          <Button 
            variant="light" 
            size="sm" 
            className="rounded-circle me-1 d-flex align-items-center justify-content-center"
            style={{ width: '35px', height: '35px' }}
            onClick={handleAddToWishlist}
          >
            <FiHeart size={16} />
          </Button>
        </div>
      </div>
      
      <Card.Body className="d-flex flex-column">
        <div className="mb-2">
          <div className="d-flex align-items-center mb-1">
            <div className="rating-stars me-2">
              {[...Array(5)].map((_, i) => (
                <FiStar 
                  key={i} 
                  fill={i < Math.floor(product.average_rating || 0) ? '#ffc107' : 'none'}
                  color="#ffc107"
                  size={14}
                />
              ))}
            </div>
            <small className="text-muted">({product.reviews_count || 0})</small>
          </div>
        </div>
        
        <Card.Title as={Link} to={`/product/${product.id}`} className="text-decoration-none">
          <h6 className="mb-2" style={{ fontSize: '1.1rem', lineHeight: '1.4' }}>
            {product.name}
          </h6>
        </Card.Title>
        
        <Card.Text className="text-muted small mb-3" style={{ fontSize: '0.9rem' }}>
          {product.description.length > 80 
            ? `${product.description.substring(0, 80)}...`
            : product.description
          }
        </Card.Text>
        
        <div className="mt-auto">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <div>
              <span className="product-price">{formatPrice(displayPrice)}</span>
              {product.sale_price && product.sale_price > 0 && (
                <span className="product-price-original">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>
          </div>
          
          <div className="d-grid gap-2">
            <Button 
              variant="primary" 
              onClick={handleAddToCart}
              className="d-flex align-items-center justify-content-center"
            >
              <FiShoppingCart size={16} className="me-2" />
              Thêm vào giỏ
            </Button>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;