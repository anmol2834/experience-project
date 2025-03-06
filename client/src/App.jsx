import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import SignIn from './components/sign in page/SignIn';
import SignUp from './components/sign up page/SignUp';
import UserDashboard from './user dashboard/UserDashboard';
import DashboardLayout from './components/outlets/DashboardLayout';
import UserAcc from './user dashboard/user account/UserAcc';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './ProtectedRoute';

function App() {

  //! Preventing Zoom on Ctrl + or Ctrl -
  document.addEventListener('keydown', function (event) {
    if ((event.ctrlKey || event.metaKey) && (event.key === '+' || event.key === '-' || event.key === '0')) {
      event.preventDefault();
    }
  });

  //! Preventing Zoom on Pinch Gestures
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
        <div className="container">
          <Routes>
            <Route path="/" element={<DashboardLayout />}>
              <Route index element={<UserDashboard />} />
              <Route path="/home" element={<UserDashboard />} />
              <Route path="/account" element={<ProtectedRoute><UserAcc /></ProtectedRoute>} />
            </Route>
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;