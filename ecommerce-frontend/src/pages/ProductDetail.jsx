import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Badge,
  Breadcrumb,
  Card,
  ListGroup,
  Spinner,
} from "react-bootstrap";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../store/cartSlice";
import productService from "../services/product.service";
import ProductCard from "../components/ProductCard";
import {
  FiShoppingCart,
  FiHeart,
  FiStar,
  FiMinus,
  FiPlus,
  FiCheck,
  FiTruck,
  FiRefreshCw,
} from "react-icons/fi";
import { toast } from "react-toastify";
import AOS from "aos";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });
  }, []);

  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        setLoading(true);
        console.log('🔍 Fetching product ID:', id);
        const response = await productService.getProductById(id);
        console.log('📦 Product Detail Response:', response);
        
        const productData = response.data;
        console.log('📦 Product Data:', productData);
        setProduct(productData);
        setSelectedImage(0);

        // Fetch related products (same category)
        if (productData.category_id) {
          console.log('🔗 Fetching related products for category:', productData.category_id);
          const relatedResponse = await productService.getAllProducts({
            category_id: productData.category_id,
            limit: 4
          });
          console.log('🔗 Related Products Response:', relatedResponse);
          const related = relatedResponse.data.filter(p => p.id !== productData.id).slice(0, 3);
          console.log('🔗 Related Products:', related);
          setRelatedProducts(related);
        }
      } catch (error) {
        console.error('❌ Error fetching product:', error);
        console.error('❌ Error details:', error.response?.data);
        setError(error.response?.data?.message || 'Không tìm thấy sản phẩm!');
        toast.error('Không tìm thấy sản phẩm!');
        // Redirect về shop sau 2s
        setTimeout(() => navigate("/shop"), 2000);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetail();
  }, [id, navigate]);

  if (loading || !product) {
    return (
      <div
        className="d-flex flex-column justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        {loading ? (
          <>
            <Spinner animation="border" variant="primary" />
            <p className="mt-3">Đang tải sản phẩm...</p>
          </>
        ) : error ? (
          <div className="text-center">
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>😢</div>
            <h4>{error}</h4>
            <p className="text-muted">Đang chuyển về trang cửa hàng...</p>
          </div>
        ) : null}
      </div>
    );
  }

  const handleAddToCart = () => {
    if (quantity > product.in_stock) {
      toast.error(`Chỉ còn ${product.in_stock} sản phẩm!`);
      return;
    }
    dispatch(addToCart({ product, quantity }));
    toast.success(`Đã thêm ${quantity}x ${product.name} vào giỏ!`);
  };

  const handleAddToWishlist = () => {
    toast.info(`Đã thêm ${product.name} vào danh sách yêu thích!`, {
      position: "top-right",
      autoClose: 2000,
    });
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    // ← THÊM: Check stock
    const maxQuantity = Math.min(10, product.in_stock || 10);
    if (newQuantity >= 1 && newQuantity <= maxQuantity) {
      setQuantity(newQuantity);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const calculateDiscount = () => {
    if (product.sale_price && product.sale_price > 0) {
      return Math.round(
        ((product.price - product.sale_price) / product.price) * 100
      );
    }
    return 0;
  };

  const getCategoryName = () => {
    return product.category?.name || "Sản phẩm";
  };

  const discount = calculateDiscount();

  return (
    <div style={{ paddingTop: "100px", minHeight: "100vh" }}>
      <Container>
        {/* Breadcrumb */}
        <Breadcrumb className="mb-4 mt-4" data-aos="fade-up">
          <Breadcrumb.Item as={Link} to="/">
            Trang chủ
          </Breadcrumb.Item>
          <Breadcrumb.Item as={Link} to="/shop">
            Sản phẩm
          </Breadcrumb.Item>
          <Breadcrumb.Item as={Link} to={`/shop/${product.category_id}`}>
            {getCategoryName()}
          </Breadcrumb.Item>
          <Breadcrumb.Item active>{product.name}</Breadcrumb.Item>
        </Breadcrumb>

        <Row>
          {/* Product Images */}
          <Col lg={6} className="mb-4">
            <div data-aos="fade-right">
              <div className="position-relative mb-3">
                <img
                  src={
                    product.images && product.images.length > 0
                      ? product.images[selectedImage]?.image_url
                      : product.primary_image?.image_url || '/placeholder.jpg'
                  }
                  alt={product.name}
                  className="img-fluid rounded shadow w-100"
                  style={{ height: "500px", objectFit: "cover" }}
                />
                {discount > 0 && (
                  <Badge className="position-absolute top-0 end-0 m-3 badge-sale">
                    -{discount}%
                  </Badge>
                )}
                {product.featured && !discount && (
                  <Badge className="position-absolute top-0 end-0 m-3 badge-featured">
                    Nổi bật
                  </Badge>
                )}
              </div>

              {product.images && product.images.length > 1 && (
                <Row>
                  {product.images.map((image, index) => (
                    <Col key={image.id} xs={3} className="mb-2">
                      <img
                        src={image.image_url}
                        alt={image.alt_text || `${product.name} ${index + 1}`}
                        className={`img-fluid rounded cursor-pointer ${
                          selectedImage === index ? "border border-primary" : ""
                        }`}
                        style={{
                          height: "80px",
                          objectFit: "cover",
                          cursor: "pointer",
                          opacity: selectedImage === index ? 1 : 0.7,
                        }}
                        onClick={() => setSelectedImage(index)}
                      />
                    </Col>
                  ))}
                </Row>
              )}
            </div>
          </Col>

          {/* Product Info */}
          <Col lg={6}>
            <div data-aos="fade-left">
              <div className="mb-3">
                <Badge bg="secondary" className="mb-2">
                  {getCategoryName()}
                </Badge>
                <h1 className="mb-3">{product.name}</h1>

                {/* Rating */}
                <div className="d-flex align-items-center mb-3">
                  <div className="rating-stars me-2">
                    {[...Array(5)].map((_, i) => (
                      <FiStar
                        key={i}
                        fill={
                          i < Math.floor(product.average_rating || 0) ? "#ffc107" : "none"
                        }
                        color="#ffc107"
                        size={18}
                      />
                    ))}
                  </div>
                  <span className="me-2">{product.average_rating || 0}</span>
                  <span className="text-muted">
                    ({product.reviews_count || 0} đánh giá)
                  </span>
                </div>

                {/* Price */}
                <div className="mb-4">
                  <span className="h3 text-primary me-3">
                    {formatPrice(product.sale_price && product.sale_price > 0 ? product.sale_price : product.price)}
                  </span>
                  {product.sale_price && product.sale_price > 0 && (
                    <span className="h5 text-muted text-decoration-line-through">
                      {formatPrice(product.price)}
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="text-muted mb-4">{product.description}</p>

                {/* Benefits */}
                {product.benefits && (
                  <div className="mb-4">
                    <h6>Lợi ích:</h6>
                    <ul className="list-unstyled">
                      {product.benefits.map((benefit, index) => (
                        <li
                          key={index}
                          className="d-flex align-items-center mb-2"
                        >
                          <FiCheck className="text-success me-2" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Quantity Selector */}
                <div className="mb-4">
                  <h6 className="mb-2">Số lượng:</h6>
                  <div className="d-flex align-items-center">
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                    >
                      <FiMinus />
                    </Button>
                    <span className="mx-3 fw-bold">{quantity}</span>
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= (product.in_stock || 10)}
                    >
                      <FiPlus />
                    </Button>
                  </div>
                  {product.in_stock && (
                    <small className="text-muted mt-2 d-block">
                      Còn lại: {product.in_stock} sản phẩm
                    </small>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="d-grid gap-3 mb-4">
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={handleAddToCart}
                    className="d-flex align-items-center justify-content-center"
                  >
                    <FiShoppingCart className="me-2" />
                    Thêm vào giỏ hàng
                  </Button>
                  <Button
                    variant="outline-primary"
                    size="lg"
                    onClick={handleAddToWishlist}
                    className="d-flex align-items-center justify-content-center"
                  >
                    <FiHeart className="me-2" />
                    Thêm vào yêu thích
                  </Button>
                </div>

                {/* Features */}
                <Row className="mb-4">
                  <Col sm={4} className="mb-2">
                    <div className="d-flex align-items-center">
                      <FiTruck className="text-primary me-2" />
                      <small>Giao hàng miễn phí</small>
                    </div>
                  </Col>
                  <Col sm={4} className="mb-2">
                    <div className="d-flex align-items-center">
                      <FiRefreshCw className="text-primary me-2" />
                      <small>Đổi trả 30 ngày</small>
                    </div>
                  </Col>
                  <Col sm={4} className="mb-2">
                    <div className="d-flex align-items-center">
                      <FiCheck className="text-primary me-2" />
                      <small>Chất lượng đảm bảo</small>
                    </div>
                  </Col>
                </Row>
              </div>
            </div>
          </Col>
        </Row>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-5">
            <h3 className="mb-4" data-aos="fade-up">
              Sản Phẩm Liên Quan
            </h3>
            <Row>
              {relatedProducts.map((relatedProduct, index) => (
                <Col
                  lg={4}
                  md={6}
                  className="mb-4"
                  key={relatedProduct.id}
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  <ProductCard product={relatedProduct} />
                </Col>
              ))}
            </Row>
          </section>
        )}
      </Container>
    </div>
  );
};

export default ProductDetail;
