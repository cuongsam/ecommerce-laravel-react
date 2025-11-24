import React, { useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Table,
  Form,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, updateQuantity, clearCart } from "../store/cartSlice";
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag } from "react-icons/fi";
import { toast } from "react-toastify";
import AOS from "aos";

const Cart = () => {
  const dispatch = useDispatch();
  const { items, total, itemCount } = useSelector((state) => state.cart);

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });
  }, []);

  const calculateShippingFee = () => {
    return total >= 500000 ? 0 : 30000;
  };
  const shippingFee = calculateShippingFee();
  const grandTotal = total + shippingFee;

  const handleRemoveItem = (productId, productName) => {
    dispatch(removeFromCart(productId));
    toast.success(`Đã xóa ${productName} khỏi giỏ hàng!`, {
      position: "top-right",
      autoClose: 2000,
    });
  };

  const handleUpdateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      const item = items.find((item) => item.id === productId);
      handleRemoveItem(productId, item?.name);
    } else {
      dispatch(updateQuantity({ productId, quantity: newQuantity }));
    }
  };

  const handleClearCart = () => {
    dispatch(clearCart());
    toast.info("Đã xóa tất cả sản phẩm khỏi giỏ hàng!", {
      position: "top-right",
      autoClose: 2000,
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  if (items.length === 0) {
    return (
      <div style={{ paddingTop: "100px", minHeight: "100vh" }}>
        <Container>
          <div className="text-center py-5" data-aos="fade-up">
            <div style={{ fontSize: "5rem", marginBottom: "2rem" }}>🛒</div>
            <h2 className="mb-3">Giỏ hàng của bạn đang trống</h2>
            <p className="text-muted mb-4">
              Hãy khám phá bộ sưu tập sản phẩm tuyệt vời của chúng tôi
            </p>
            <Button as={Link} to="/shop" variant="primary" size="lg">
              <FiShoppingBag className="me-2" />
              Tiếp Tục Mua Sắm
            </Button>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: "100px", minHeight: "100vh" }}>
      <Container>
        <Row>
          <Col lg={8}>
            {/* Cart Header */}
            <div
              className="d-flex justify-content-between align-items-center mb-4 mt-5"
              data-aos="fade-up"
            >
              <h2>Giỏ Hàng ({itemCount} sản phẩm)</h2>
              <Button
                variant="outline-danger"
                size="sm"
                onClick={handleClearCart}
              >
                <FiTrash2 className="me-2" />
                Xóa tất cả
              </Button>
            </div>

            {/* Cart Items */}
            <Card className="mb-4" data-aos="fade-up" data-aos-delay="100">
              <Card.Body className="p-0">
                <Table responsive className="mb-0">
                  <thead className="table-light text-center">
                    <tr>
                      <th>Sản phẩm</th>
                      <th>Đơn giá</th>
                      <th>Số lượng</th>
                      <th>Thành tiền</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => {
                      // Get image URL from product structure
                      const imageUrl = item.primary_image?.image_url || 
                                      item.images?.[0]?.image_url || 
                                      item.image || 
                                      '/placeholder.jpg';
                      
                      // Get display price (sale_price if available, otherwise price)
                      const displayPrice = item.sale_price && item.sale_price > 0 
                                          ? item.sale_price 
                                          : item.price;
                      
                      return (
                      <tr key={item.id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <img
                              src={imageUrl}
                              alt={item.name}
                              style={{
                                width: "80px",
                                height: "80px",
                                objectFit: "cover",
                              }}
                              className="rounded me-3"
                            />
                            <div>
                              <h6 className="mb-1">
                                <Link
                                  to={`/product/${item.id}`}
                                  className="text-decoration-none text-dark"
                                >
                                  {item.name}
                                </Link>
                              </h6>
                              <small className="text-muted">
                                {item.description?.substring(0, 50)}...
                              </small>
                            </div>
                          </div>
                        </td>
                        <td className="align-middle">
                          <span className="fw-bold">
                            {formatPrice(displayPrice)}
                          </span>
                        </td>
                        <td className="align-middle">
                          <div className="d-flex align-items-center">
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              onClick={() =>
                                handleUpdateQuantity(item.id, item.quantity - 1)
                              }
                            >
                              <FiMinus size={14} />
                            </Button>
                            <Form.Control
                              type="number"
                              value={item.quantity}
                              onChange={(e) =>
                                handleUpdateQuantity(
                                  item.id,
                                  parseInt(e.target.value) || 1
                                )
                              }
                              style={{ width: "60px" }}
                              className="mx-2 text-center"
                              min="1"
                              max="10"
                            />
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              onClick={() =>
                                handleUpdateQuantity(item.id, item.quantity + 1)
                              }
                              disabled={item.quantity >= 10}
                            >
                              <FiPlus size={14} />
                            </Button>
                          </div>
                        </td>
                        <td className="align-middle">
                          <span className="fw-bold text-primary">
                            {formatPrice(displayPrice * item.quantity)}
                          </span>
                        </td>
                        <td className="align-middle">
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleRemoveItem(item.id, item.name)}
                          >
                            <FiTrash2 size={14} />
                          </Button>
                        </td>
                      </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>

            {/* Continue Shopping */}
            <div data-aos="fade-up" data-aos-delay="200">
              <Button as={Link} to="/shop" variant="outline-primary">
                <FiShoppingBag className="me-2" />
                Tiếp Tục Mua Sắm
              </Button>
            </div>
          </Col>

          {/* Order Summary */}
          <Col lg={4}>
            <Card
              className="sticky-top"
              style={{ top: "120px" }}
              data-aos="fade-left"
            >
              <Card.Header>
                <h5 className="mb-0 mt-2">Tóm Tắt Đơn Hàng</h5>
              </Card.Header>
              <Card.Body>
                <div className="d-flex justify-content-between mb-3">
                  <span>Tạm tính ({itemCount} sản phẩm):</span>
                  <span>{formatPrice(total)}</span>
                </div>

                <div className="d-flex justify-content-between mb-3">
                  <span>Phí vận chuyển:</span>
                  <span className={shippingFee === 0 ? "text-success" : ""}>
                    {shippingFee === 0 ? "Miễn phí" : formatPrice(shippingFee)}
                  </span>
                </div>

                <hr />

                <div className="d-flex justify-content-between mb-4">
                  <strong>Tổng cộng:</strong>
                  <strong className="text-primary h5">
                    {formatPrice(grandTotal)}
                  </strong>
                </div>

                <div className="d-grid gap-2">
                  <Button as={Link} to="/checkout" variant="primary" size="lg">
                    Tiến Hành Thanh Toán ({formatPrice(grandTotal)})
                  </Button>
                  <Button as={Link} to="/shop" variant="outline-primary">
                    Tiếp Tục Mua Sắm
                  </Button>
                </div>
              </Card.Body>
            </Card>

            {/* Shipping Info */}
            <Card className="mt-4" data-aos="fade-left" data-aos-delay="100">
              <Card.Body>
                <h6 className="mb-3">🚚 Thông Tin Giao Hàng</h6>
                <ul className="list-unstyled mb-0 small">
                  <li className="mb-2">✅ Miễn phí giao hàng toàn quốc</li>
                  <li className="mb-2">📦 Giao hàng trong 2-3 ngày</li>
                  <li className="mb-2">🔄 Đổi trả trong 30 ngày</li>
                  <li>💯 Bảo hành chất lượng</li>
                </ul>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Cart;
