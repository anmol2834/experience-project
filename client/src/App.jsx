import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import SignIn from './components/sign in page/SignIn';
import SignUp from './components/sign up page/SignUp';
import UserDashboard from './user dashboard/UserDashboard';
import DashboardLayout from './components/outlets/DashboardLayout';
import UserAcc from './user dashboard/user account/UserAcc';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="container">
          <Routes>
            <Route path="/" element={<DashboardLayout />}>
              <Route index element={<UserDashboard />} />
              <Route path="/home" element={<UserDashboard />} />
              <Route path="/account" element={<UserAcc />} />
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