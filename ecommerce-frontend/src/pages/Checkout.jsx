import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Badge,
  Alert,
} from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearCart } from "../store/cartSlice";
import {
  FiCheck,
  FiTruck,
  FiCreditCard,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi";
import { toast } from "react-toastify";
import AOS from "aos";

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items, total } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.user);
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [shippingInfo, setShippingInfo] = useState({
    fullName: userInfo?.name || "",
    email: userInfo?.email || "",
    phone: "",
    address: "",
    city: "Ho Chi Minh", // ← MATCH backend
    district: "", // ← MATCH backend
    ward: "", // ← NEW
    notes: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 800, once: true });

    // Redirect nếu giỏ hàng trống
    if (items.length === 0) {
      toast.error("Giỏ hàng trống!");
      navigate("/cart");
    }
  }, [items, navigate]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const handleInputChange = (e) => {
    setShippingInfo({
      ...shippingInfo,
      [e.target.name]: e.target.value,
    });
  };

  const validateShippingInfo = () => {
    const required = [
      "fullName",
      "email",
      "phone",
      "address",
      "city",
      "district",
    ];
    for (let field of required) {
      if (!shippingInfo[field]) {
        toast.error(`Vui lòng điền ${getFieldLabel(field)}`);
        return false;
      }
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(shippingInfo.email)) {
      toast.error("Email không hợp lệ");
      return false;
    }

    // Validate phone
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(shippingInfo.phone.replace(/\s/g, ""))) {
      toast.error("Số điện thoại không hợp lệ");
      return false;
    }

    return true;
  };

  const getFieldLabel = (field) => {
    const labels = {
      fullName: "Họ và tên",
      email: "Email",
      phone: "Số điện thoại",
      address: "Địa chỉ",
      city: "Tỉnh/Thành phố",
      district: "Quận/Huyện",
    };
    return labels[field] || field;
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (validateShippingInfo()) {
        setCurrentStep(2);
      }
    } else if (currentStep === 2) {
      setCurrentStep(3);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handlePlaceOrder = async () => {
    if (!agreedToTerms) {
      toast.error("Vui lòng đồng ý với điều khoản");
      return;
    }

    setLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const orderData = {
        name: shippingInfo.fullName,
        email: shippingInfo.email,
        phone: shippingInfo.phone,
        address: shippingInfo.address,
        city: shippingInfo.city,
        district: shippingInfo.district,
        note: shippingInfo.notes,
        payment_method: paymentMethod, // ← THÊM
        items: items.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
      };

      console.log("Order placed:", orderData);

      // Clear cart
      dispatch(clearCart());

      // Navigate to success page
      toast.success("Đặt hàng thành công!");
      setCurrentStep(4);

      // Redirect sau 3 giây
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (error) {
      toast.error("Đặt hàng thất bại. Vui lòng thử lại!");
      console.error("Order error:", error);
    } finally {
      setLoading(false);
    }
  };

  const StepIndicator = () => (
    <div className="checkout-steps mb-5" data-aos="fade-down">
      <div className="steps-container">
        {[
          { num: 1, label: "Thông tin", icon: FiTruck },
          { num: 2, label: "Thanh toán", icon: FiCreditCard },
          { num: 3, label: "Xác nhận", icon: FiCheck },
        ].map((step, index) => (
          <React.Fragment key={step.num}>
            <div
              className={`step-item ${
                currentStep >= step.num ? "active" : ""
              } ${currentStep > step.num ? "completed" : ""}`}
              onClick={() => currentStep > step.num && setCurrentStep(step.num)}
            >
              <div className="step-circle">
                {currentStep > step.num ? (
                  <FiCheck size={20} />
                ) : (
                  <step.icon size={20} />
                )}
              </div>
              <span className="step-label">{step.label}</span>
            </div>
            {index < 2 && (
              <div
                className={`step-line ${
                  currentStep > step.num ? "completed" : ""
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );

  const ShippingInfoForm = () => (
    <Card className="mb-4" data-aos="fade-up">
      <Card.Header>
        <h5 className="mb-0">📦 Thông Tin Giao Hàng</h5>
      </Card.Header>
      <Card.Body>
        <Form>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Họ và tên *</Form.Label>
                <Form.Control
                  type="text"
                  name="fullName"
                  value={shippingInfo.fullName}
                  onChange={handleInputChange}
                  placeholder="Nguyễn Văn A"
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Email *</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={shippingInfo.email}
                  onChange={handleInputChange}
                  placeholder="email@example.com"
                  required
                />
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
                  value={shippingInfo.phone}
                  onChange={handleInputChange}
                  placeholder="0123456789"
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Tỉnh/Thành phố *</Form.Label>
                <Form.Select
                  name="city"
                  value={shippingInfo.city}
                  onChange={handleInputChange}
                  required
                >
                  <option value="Ho Chi Minh">TP. Hồ Chí Minh</option>
                  <option value="Ha Noi">Hà Nội</option>
                  <option value="Da Nang">Đà Nẵng</option>
                  <option value="Can Tho">Cần Thơ</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Quận/Huyện *</Form.Label>
                <Form.Control
                  type="text"
                  name="district"
                  value={shippingInfo.district}
                  onChange={handleInputChange}
                  placeholder="Quận 1"
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Phường/Xã</Form.Label>
                <Form.Control
                  type="text"
                  name="ward"
                  value={shippingInfo.ward}
                  onChange={handleInputChange}
                  placeholder="Phường Bến Nghé"
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Địa chỉ cụ thể *</Form.Label>
            <Form.Control
              type="text"
              name="address"
              value={shippingInfo.address}
              onChange={handleInputChange}
              placeholder="Số nhà, tên đường..."
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Ghi chú đơn hàng (tùy chọn)</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="notes"
              value={shippingInfo.notes}
              onChange={handleInputChange}
              placeholder="Ghi chú về đơn hàng, ví dụ: thời gian hay chỉ dẫn địa điểm giao hàng chi tiết hơn."
            />
          </Form.Group>
        </Form>
      </Card.Body>
    </Card>
  );

  const PaymentMethodForm = () => (
    <Card className="mb-4" data-aos="fade-up">
      <Card.Header>
        <h5 className="mb-0">💳 Phương Thức Thanh Toán</h5>
      </Card.Header>
      <Card.Body>
        <div className="payment-methods">
          <div
            className={`payment-option ${
              paymentMethod === "cod" ? "active" : ""
            }`}
            onClick={() => setPaymentMethod("cod")}
          >
            <Form.Check
              type="radio"
              name="paymentMethod"
              checked={paymentMethod === "cod"}
              onChange={() => setPaymentMethod("cod")}
              label=""
            />
            <div className="payment-info">
              <div className="payment-icon">💵</div>
              <div>
                <h6>Thanh toán khi nhận hàng (COD)</h6>
                <p className="text-muted small mb-0">
                  Thanh toán bằng tiền mặt khi nhận hàng
                </p>
              </div>
            </div>
          </div>

          <div
            className={`payment-option ${
              paymentMethod === "bank" ? "active" : ""
            }`}
            onClick={() => setPaymentMethod("bank")}
          >
            <Form.Check
              type="radio"
              name="paymentMethod"
              checked={paymentMethod === "bank"}
              onChange={() => setPaymentMethod("bank")}
              label=""
            />
            <div className="payment-info">
              <div className="payment-icon">🏦</div>
              <div>
                <h6>Chuyển khoản ngân hàng</h6>
                <p className="text-muted small mb-0">
                  Chuyển khoản trực tiếp đến tài khoản ngân hàng
                </p>
              </div>
            </div>
          </div>

          <div
            className={`payment-option ${
              paymentMethod === "momo" ? "active" : ""
            }`}
            onClick={() => setPaymentMethod("momo")}
          >
            <Form.Check
              type="radio"
              name="paymentMethod"
              checked={paymentMethod === "momo"}
              onChange={() => setPaymentMethod("momo")}
              label=""
            />
            <div className="payment-info">
              <div className="payment-icon">📱</div>
              <div>
                <h6>Ví MoMo</h6>
                <p className="text-muted small mb-0">
                  Thanh toán qua ví điện tử MoMo
                </p>
              </div>
            </div>
          </div>

          <div
            className={`payment-option ${
              paymentMethod === "vnpay" ? "active" : ""
            }`}
            onClick={() => setPaymentMethod("vnpay")}
          >
            <Form.Check
              type="radio"
              name="paymentMethod"
              checked={paymentMethod === "vnpay"}
              onChange={() => setPaymentMethod("vnpay")}
              label=""
            />
            <div className="payment-info">
              <div className="payment-icon">💳</div>
              <div>
                <h6>VNPay</h6>
                <p className="text-muted small mb-0">
                  Thanh toán qua cổng VNPay
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card.Body>
    </Card>
  );

  const OrderSummary = () => (
    <Card className="sticky-top" style={{ top: "120px" }} data-aos="fade-left">
      <Card.Header>
        <h5 className="mb-0">📋 Chi Tiết Đơn Hàng</h5>
      </Card.Header>
      <Card.Body>
        {/* Products */}
        <div className="order-items mb-3">
          {items.map((item) => (
            <div key={item.id} className="order-item">
              <img
                src={item.image}
                alt={item.name}
                className="order-item-image"
              />
              <div className="order-item-info">
                <h6 className="mb-1">{item.name}</h6>
                <small className="text-muted">SL: {item.quantity}</small>
              </div>
              <span className="order-item-price">
                {formatPrice(item.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>

        <hr />

        {/* Totals */}
        <div className="order-totals">
          <div className="d-flex justify-content-between mb-2">
            <span>Tạm tính:</span>
            <span>{formatPrice(total)}</span>
          </div>
          <div className="d-flex justify-content-between mb-2">
            <span>Phí vận chuyển:</span>
            <span className="text-success">Miễn phí</span>
          </div>
          <hr />
          <div className="d-flex justify-content-between mb-0">
            <strong>Tổng cộng:</strong>
            <strong className="text-primary h5 mb-0">
              {formatPrice(total)}
            </strong>
          </div>
        </div>
      </Card.Body>
    </Card>
  );

  const ConfirmationStep = () => (
    <Card data-aos="fade-up">
      <Card.Body className="p-4">
        <h4 className="mb-4">✅ Xác Nhận Đơn Hàng</h4>

        {/* Shipping Info Summary */}
        <div className="mb-4">
          <h6 className="text-primary mb-3">📦 Thông Tin Giao Hàng</h6>
          <div className="info-box">
            <p className="mb-2">
              <strong>Người nhận:</strong> {shippingInfo.fullName}
            </p>
            <p className="mb-2">
              <strong>Email:</strong> {shippingInfo.email}
            </p>
            <p className="mb-2">
              <strong>Số điện thoại:</strong> {shippingInfo.phone}
            </p>
            <p className="mb-0">
              <strong>Địa chỉ:</strong> {shippingInfo.address},{" "}
              {shippingInfo.ward && `${shippingInfo.ward}, `}
              {shippingInfo.district}, {shippingInfo.city}
            </p>
            {shippingInfo.notes && (
              <p className="mb-0 mt-2">
                <strong>Ghi chú:</strong> {shippingInfo.notes}
              </p>
            )}
          </div>
        </div>

        {/* Payment Method Summary */}
        <div className="mb-4">
          <h6 className="text-primary mb-3">💳 Phương Thức Thanh Toán</h6>
          <div className="info-box">
            <p className="mb-0">
              {paymentMethod === "cod" && "💵 Thanh toán khi nhận hàng (COD)"}
              {paymentMethod === "bank" && "🏦 Chuyển khoản ngân hàng"}
              {paymentMethod === "momo" && "📱 Ví MoMo"}
              {paymentMethod === "vnpay" && "💳 VNPay"}
            </p>
          </div>
        </div>

        {/* Terms Agreement */}
        <Form.Check
          type="checkbox"
          id="terms"
          checked={agreedToTerms}
          onChange={(e) => setAgreedToTerms(e.target.checked)}
          label={
            <span>
              Tôi đã đọc và đồng ý với{" "}
              <a href="/terms" target="_blank" rel="noopener noreferrer">
                điều khoản dịch vụ
              </a>{" "}
              và{" "}
              <a href="/privacy" target="_blank" rel="noopener noreferrer">
                chính sách bảo mật
              </a>
            </span>
          }
          className="mb-4"
        />

        {/* Order Info */}
        <Alert variant="info">
          <FiAlertCircle className="me-2" />
          Đơn hàng của bạn sẽ được xử lý trong vòng 24h. Chúng tôi sẽ liên hệ
          với bạn sớm nhất có thể.
        </Alert>
      </Card.Body>
    </Card>
  );

  const SuccessStep = () => (
    <div className="text-center py-5" data-aos="zoom-in">
      <div className="success-icon mb-4">
        <FiCheckCircle size={100} color="#28a745" />
      </div>
      <h2 className="mb-3">🎉 Đặt Hàng Thành Công!</h2>
      <p className="text-muted mb-4">
        Cảm ơn bạn đã mua hàng tại Serenity. <br />
        Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.
      </p>
      <Alert variant="success" className="mb-4">
        Mã đơn hàng của bạn:{" "}
        <strong>#ORD{Date.now().toString().slice(-8)}</strong>
      </Alert>
      <Button variant="primary" onClick={() => navigate("/")}>
        Tiếp Tục Mua Sắm
      </Button>
    </div>
  );

  if (items.length === 0 && currentStep !== 4) {
    return null;
  }

  return (
    <div
      style={{ paddingTop: "100px", minHeight: "100vh", paddingBottom: "4rem" }}
    >
      <Container>
        <h2 className="mb-4" data-aos="fade-down">
          Thanh Toán
        </h2>

        {currentStep !== 4 && <StepIndicator />}

        <Row>
          <Col lg={8}>
            {currentStep === 1 && <ShippingInfoForm />}
            {currentStep === 2 && <PaymentMethodForm />}
            {currentStep === 3 && <ConfirmationStep />}
            {currentStep === 4 && <SuccessStep />}

            {/* Navigation Buttons */}
            {currentStep < 4 && (
              <div
                className="d-flex gap-3 justify-content-between"
                data-aos="fade-up"
              >
                <Button
                  variant="outline-secondary"
                  size="lg"
                  onClick={handleBack}
                  disabled={currentStep === 1}
                >
                  ← Quay lại
                </Button>

                {currentStep < 3 ? (
                  <Button variant="primary" size="lg" onClick={handleNext}>
                    Tiếp tục →
                  </Button>
                ) : (
                  <Button
                    variant="success"
                    size="lg"
                    onClick={handlePlaceOrder}
                    disabled={loading || !agreedToTerms}
                  >
                    {loading ? "Đang xử lý..." : "✓ Đặt Hàng"}
                  </Button>
                )}
              </div>
            )}
          </Col>

          {currentStep < 4 && (
            <Col lg={4}>
              <OrderSummary />
            </Col>
          )}
        </Row>
      </Container>
    </div>
  );
};

export default Checkout;
