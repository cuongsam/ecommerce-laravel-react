import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { Provider } from 'react-redux';
import store from './store';

// Import styles
import './styles/global.css';
import './styles/Login.css';
import 'react-toastify/dist/ReactToastify.css';

// Import components
import Header from './components/Header';
import Footer from './components/Footer';

// Import pages
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Reviews from './pages/Reviews';
import Featured from './pages/Featured';
import About from './pages/About';
import Profile from './pages/Profile';
import Logout from './pages/Logout';

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/shop/:categoryId" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/featured" element={<Featured />} />
            <Route path="/about" element={<About />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/logout" element={<Logout />} />

            {/* Static placeholder routes */}
            <Route
              path="/checkout"
              element={
                <div style={placeholderStyle}>
                  <h2>🚧 Trang thanh toán đang được phát triển</h2>
                </div>
              }
            />
            <Route
              path="/contact"
              element={
                <div style={placeholderStyle}>
                  <h2>📞 Trang liên hệ đang được phát triển</h2>
                </div>
              }
            />
            <Route
              path="/wishlist"
              element={
                <div style={placeholderStyle}>
                  <h2>💖 Trang yêu thích đang được phát triển</h2>
                </div>
              }
            />

            {/* 404 */}
            <Route
              path="*"
              element={
                <div style={placeholderStyle}>
                  <h1>404</h1>
                  <p>Trang không tồn tại</p>
                </div>
              }
            />
          </Routes>
        </main>

        <Footer />

        {/* Toast Notifications */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </Provider>
  );
}

const placeholderStyle = {
  paddingTop: '100px',
  textAlign: 'center',
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
};

export default App;
