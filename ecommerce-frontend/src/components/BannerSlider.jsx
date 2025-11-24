import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { banners } from '../data/products';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const BannerSlider = () => {
  return (
    <div className="position-relative">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        loop={true}
        className="hero-swiper"
        style={{ height: '70vh' }}
      >
        {banners.map((banner) => (
          <SwiperSlide key={banner.id}>
            <div 
              className="position-relative w-100 h-100 d-flex align-items-center"
              style={{
                backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${banner.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
            >
              <Container>
                <div className="hero-content text-white" data-aos="fade-up" data-aos-duration="1000">
                  <div className="row">
                    <div className="col-lg-6">
                      <h1 className="hero-title text-white mb-4">
                        {banner.title}
                      </h1>
                      <p className="hero-subtitle text-white-50 mb-4">
                        {banner.subtitle}
                      </p>
                      <div className="d-flex gap-3">
                        <Button 
                          as={Link} 
                          to={banner.link} 
                          variant="primary" 
                          size="lg"
                          className="px-4 py-3"
                        >
                          {banner.buttonText}
                        </Button>
                        <Button 
                          as={Link} 
                          to="/shop" 
                          variant="outline-light" 
                          size="lg"
                          className="px-4 py-3"
                        >
                          Xem Tất Cả
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Container>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default BannerSlider;