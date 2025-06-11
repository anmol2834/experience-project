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
import ProductProvider from './context/ProductProvider'; // Default import
import ExperienceDetails from './user dashboard/experience details/ExperienceDetails';
import ProductSlideshow from './user dashboard/experience details/product slideshow/ProductSlideshow';
import BookingsPage from './user dashboard/user account/bookings page/BookingsPage';
import Rewards from './user dashboard/user account/rewards page/Rewards';
import AddToCart from './user dashboard/add to cart page/AddToCart';
import BookPage from './user dashboard/book page/BookPage';
import PaymentPage from './user dashboard/payment page/PaymentPage';
import Address from './user dashboard/user account/address/Address';
import { AddressProvider } from './context/AddressContext'; // Use AddressProvider
import Reviews from './user dashboard/user account/reviews/Reviews';

function App() {
  document.addEventListener('keydown', function (event) {
    if ((event.ctrlKey || event.metaKey) && (event.key === '+' || event.key === '-' || event.key === '0')) {
      event.preventDefault();
    }
  });

  document.addEventListener('wheel', function (event) {
    if (event.ctrlKey) {
      event.preventDefault();
    }
  }, { passive: false });

  document.addEventListener('gesturestart', function (event) {
    event.preventDefault();
  });

  return (
    <Router>
      <AuthProvider>
        <ProductProvider>
          <AddressProvider> {/* Corrected from AddressContext */}
            <div className="container">
              <div className="glow-shape blob1"></div>
              <div className="glow-shape blob2"></div>
              <div className="glow-shape blob3"></div>
              <div className="glow-shape blob4"></div>

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
              </Routes>
            </div>
          </AddressProvider>
        </ProductProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;