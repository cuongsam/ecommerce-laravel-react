import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, ButtonGroup, Spinner, Alert } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import productService from '../services/product.service';
import { categoryService } from '../services/category.service';
import AOS from 'aos';

const Shop = () => {
  const { categoryId } = useParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(categoryId || 'all');
  const [sortBy, setSortBy] = useState('newest');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  const ITEMS_PER_PAGE = 12;

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryService.getCategories();
        setCategories(response.data.data || []);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch products khi có thay đổi về filter hoặc sort
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        // Chuẩn bị params cho API
        const params = {
          limit: ITEMS_PER_PAGE,
          page: currentPage,
          sort: sortBy,
        };

        // Thêm category filter
        if (selectedCategory !== 'all') {
          params.category_id = selectedCategory;
        }

        // Thêm search
        if (searchTerm) {
          params.search = searchTerm;
        }

        // Gọi API
        const response = await productService.getAllProducts(params);
        
        console.log('📦 Products Response:', response);
        
        // API response structure: { data: [...], meta: {...} }
        setProducts(response.data || []);
        setTotalPages(response.meta?.last_page || 1);
        setTotalProducts(response.meta?.total || 0);
        setCurrentPage(response.meta?.current_page || 1);

      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Không thể tải sản phẩm. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, sortBy, searchTerm, currentPage]);

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });
  }, []);

  useEffect(() => {
    if (categoryId) {
      setSelectedCategory(categoryId);
    }
  }, [categoryId]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const getCurrentCategoryName = () => {
    if (selectedCategory === 'all') return 'Tất Cả Sản Phẩm';
    const category = categories.find(cat => cat.id === parseInt(selectedCategory));
    return category ? category.name : 'Sản Phẩm';
  };

  // Loading state
  if (loading && products.length === 0) {
    return (
      <div style={{ paddingTop: '100px', minHeight: '100vh' }}>
        <Container>
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-3">Đang tải sản phẩm...</p>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: '100px', minHeight: '100vh' }}>
      <Container>
        {/* Error Alert */}
        {error && (
          <Alert variant="danger" dismissible onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Page Header */}
        <div className="text-center mb-5 mt-4" data-aos="fade-up">
          <h1 className="mb-3">{getCurrentCategoryName()}</h1>
          <p className="text-muted">
            Khám phá bộ sưu tập sản phẩm chăm sóc tự nhiên của chúng tôi
          </p>
        </div>

        <Row>
          {/* Sidebar Filters */}
          <Col lg={3} className="mb-4">
            <div className="sticky-top" style={{ top: '120px' }}>
              {/* Search */}
              <div className="mb-4" data-aos="fade-right" data-aos-delay="100">
                <h5 className="mb-3">Tìm Kiếm</h5>
                <Form.Control
                  type="text"
                  placeholder="Tìm sản phẩm..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Category Filter */}
              <div className="mb-4" data-aos="fade-right" data-aos-delay="200">
                <h5 className="mb-3">Danh Mục</h5>
                <div className="d-grid gap-2">
                  <Button
                    variant={selectedCategory === 'all' ? 'primary' : 'outline-primary'}
                    onClick={() => handleCategoryChange('all')}
                    className="text-start"
                  >
                    Tất Cả Sản Phẩm
                  </Button>
                  {categories.map((category) => {
                    return (
                      <Button
                        key={category.id}
                        variant={selectedCategory === String(category.id) ? 'primary' : 'outline-primary'}
                        onClick={() => handleCategoryChange(String(category.id))}
                        className="text-start"
                      >
                        {category.name}
                      </Button>
                    );
                  })}
                </div>
              </div>

              {/* Sort Options */}
              <div className="mb-4" data-aos="fade-right" data-aos-delay="300">
                <h5 className="mb-3">Sắp Xếp</h5>
                <Form.Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="newest">Mới nhất</option>
                  <option value="price_asc">Giá thấp đến cao</option>
                  <option value="price_desc">Giá cao đến thấp</option>
                  <option value="popular">Phổ biến nhất</option>
                </Form.Select>
              </div>
            </div>
          </Col>

          {/* Products Grid */}
          <Col lg={9}>
            {/* Results Info */}
            <div className="d-flex justify-content-between align-items-center mb-4" data-aos="fade-up">
              <span className="text-muted">
                Hiển thị {products.length} / {totalProducts} sản phẩm (Trang {currentPage}/{totalPages})
              </span>
              <span className="text-muted">
                Sắp xếp theo: <strong>{sortBy === 'newest' ? 'Mới nhất' : sortBy === 'price_asc' ? 'Giá thấp đến cao' : sortBy === 'price_desc' ? 'Giá cao đến thấp' : 'Phổ biến nhất'}</strong>
              </span>
            </div>

            {/* Products */}
            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-3">Đang tải sản phẩm...</p>
              </div>
            ) : products.length > 0 ? (
              <>
                <Row>
                  {products.map((product, index) => (
                    <Col lg={4} md={6} className="mb-4" key={product.id} data-aos="fade-up" data-aos-delay={index * 50}>
                      <ProductCard product={product} />
                    </Col>
                  ))}
                </Row>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="d-flex justify-content-center gap-2 mt-5" data-aos="fade-up">
                    <Button
                      variant="outline-primary"
                      disabled={currentPage === 1 || loading}
                      onClick={() => setCurrentPage(currentPage - 1)}
                    >
                      ← Trước
                    </Button>
                    
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      return (
                        <Button
                          key={pageNum}
                          variant={currentPage === pageNum ? "primary" : "outline-primary"}
                          onClick={() => setCurrentPage(pageNum)}
                          disabled={loading}
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                    
                    <Button
                      variant="outline-primary"
                      disabled={currentPage === totalPages || loading}
                      onClick={() => setCurrentPage(currentPage + 1)}
                    >
                      Sau →
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-5" data-aos="fade-up">
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔍</div>
                <h4>Không tìm thấy sản phẩm nào</h4>
                <p className="text-muted">
                  Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
                </p>
                <Button
                  variant="primary"
                  onClick={() => {
                    setSelectedCategory('all');
                    setSearchTerm('');
                    setSortBy('name');
                  }}
                >
                  Xóa Bộ Lọc
                </Button>
              </div>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Shop;