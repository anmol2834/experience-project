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
import ProductContext from './context/ProductContext';
import ExperienceDetails from './user dashboard/experience details/ExperienceDetails';
import ProductSlideshow from './user dashboard/experience details/product slideshow/ProductSlideshow';
import BookingsPage from './user dashboard/user account/bookings page/BookingsPage';
import Rewards from './user dashboard/user account/rewards page/Rewards';
import AddToCart from './user dashboard/add to cart page/AddToCart';
import BookPage from './user dashboard/book page/BookPage';
import PaymentPage from './user dashboard/payment page/PaymentPage';
import Address from './user dashboard/user account/address/Address';

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
        <ProductContext>
          <div className="container">
            <Routes>
              <Route path="/" element={<DashboardLayout />}>
                <Route index element={<UserDashboard />} />
                <Route path="/home" element={<UserDashboard />} />
                {/* Updated route with dynamic productId parameter */}
                <Route path="/experience-details/:productId" element={<ExperienceDetails />} />
              </Route>
              <Route path="/account" element={<ProtectedRoute><UserAcc /></ProtectedRoute>}>
                <Route index element={<Rewards />} />
                <Route path="edit_profile" element={<ProfileEdit />} />
                <Route path="help_center" element={<HelpCenter />} />
                <Route path="wishlist" element={<Wishlist />} />
                <Route path="bookings" element={<BookingsPage />} />
                <Route path="rewards" element={<Rewards />} />
                <Route path='address' element={<Address />} />
              </Route>
              <Route path="/add_to_cart" element={<ProtectedRoute><AddToCart /></ProtectedRoute>} />
              <Route path="/book_page" element={<ProtectedRoute><BookPage /></ProtectedRoute>} />
              <Route path="/payment" element={<ProtectedRoute><PaymentPage /></ProtectedRoute>} />
              <Route path="/product-slideshow" element={<ProductSlideshow />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
            </Routes>
          </div>
        </ProductContext>
      </AuthProvider>
    </Router>
  );
}

export default App;