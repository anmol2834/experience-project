import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import SignIn from './components/sign in page/SignIn';
import SignUp from './components/sign up page/SignUp';
import UserDashboard from './user dashboard/UserDashboard';
import DashboardLayout from './components/outlets/DashboardLayout';
import UserAcc from './user dashboard/user account/UserAcc';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './ProtectedRoute';
import ProfileEdit from './user dashboard/user account/profile edit/ProfileEdit';
import HelpCenter from './user dashboard/user account/help center/HelpCenter';
import Wishlist from './user dashboard/user account/wishlist/Wishlist';
import ProductProvider from './context/ProductProvider';
import ExperienceDetails from './user dashboard/experience details/ExperienceDetails';
import ProductSlideshow from './user dashboard/experience details/product slideshow/ProductSlideshow';
import BookingsPage from './user dashboard/user account/bookings page/BookingsPage';
import Rewards from './user dashboard/user account/rewards page/Rewards';
import AddToCart from './user dashboard/add to cart page/AddToCart';
import BookPage from './user dashboard/book page/BookPage';
import PaymentPage from './user dashboard/payment page/PaymentPage';
import Address from './user dashboard/user account/address/Address';
import { AddressProvider } from './context/AddressContext';
import Reviews from './user dashboard/user account/reviews/Reviews';
import AboutUs from './user dashboard/about us/AboutUs';
import { useEffect } from 'react';
import TermsAndConditions from './user dashboard/terms and conditions/TermsAndConditions';

function App() {
  // Prevent zooming
  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && (event.key === '+' || event.key === '-' || event.key === '0')) {
        event.preventDefault();
      }
    };

    const handleWheel = (event) => {
      if (event.ctrlKey) {
        event.preventDefault();
      }
    };

    const handleGestureStart = (event) => {
      event.preventDefault();
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('wheel', handleWheel, { passive: false });
    document.addEventListener('gesturestart', handleGestureStart);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('wheel', handleWheel);
      document.removeEventListener('gesturestart', handleGestureStart);
    };
  }, []);

  return (
    <Router>
      <AuthProvider>
        <ProductProvider>
          <AddressProvider>
            <div className="container">
              {/* Background Elements (unchanged) */}
              <div className="glow-shape blob1"></div>
              <div className="glow-shape blob2"></div>
              <div className="glow-shape blob3"></div>
              <div className="glow-shape blob4"></div>
              
              {/* NEW: Floating Particles */}
              <div className="app-particles">
                {[...Array(30)].map((_, i) => (
                  <div 
                    key={i} 
                    className="app-particle" 
                    style={{
                      top: `${Math.random() * 100}%`,
                      left: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 5}s`,
                      transform: `scale(${0.5 + Math.random()})`
                    }}
                  ></div>
                ))}
              </div>
              
              {/* NEW: Decorative Ornaments */}
              <div className="app-ornament app-ornament-top-left">✧</div>
              <div className="app-ornament app-ornament-top-right">✦</div>
              <div className="app-ornament app-ornament-bottom-left">✦</div>
              <div className="app-ornament app-ornament-bottom-right">✧</div>
              
              {/* Main Content (unchanged) */}
              <Routes>
                <Route path="/" element={<DashboardLayout />}>
                  <Route index element={<UserDashboard />} />
                  <Route path="/home" element={<UserDashboard />} />
                  <Route path="/experience-details/:productId" element={<ExperienceDetails />} />
                  <Route path="/product-slideshow/:productId" element={<ProductSlideshow />} />
                </Route>
                <Route path="/account" element={<ProtectedRoute><UserAcc /></ProtectedRoute>}>
                  <Route index element={<Rewards />} />
                  <Route path="edit_profile" element={<ProfileEdit />} />
                  <Route path="help_center" element={<HelpCenter />} />
                  <Route path="wishlist" element={<Wishlist />} />
                  <Route path="bookings" element={<BookingsPage />} />
                  <Route path="rewards" element={<Rewards />} />
                  <Route path="address" element={<Address />} />
                  <Route path="reviews" element={<Reviews />} />
                </Route>
                <Route path="/add_to_cart" element={<ProtectedRoute><AddToCart /></ProtectedRoute>} />
                <Route path="/book_page" element={<ProtectedRoute><BookPage /></ProtectedRoute>} />
                <Route path="/payment" element={<ProtectedRoute><PaymentPage /></ProtectedRoute>} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path='/aboutus' element={<AboutUs />} />
                <Route path='termsAndConditions' element={<TermsAndConditions/>} />
              </Routes>
            </div>
          </AddressProvider>
        </ProductProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;