import React, { useState, useEffect, useContext } from 'react';
import './ProfileEdit.css';
import { motion } from 'framer-motion';
import { useAuth } from '../../../context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { context_of_product } from '../../../context/ProductContext';

function ProfileEdit() {
  const { token } = useAuth();
  const { incrementUserUpdated } = useContext(context_of_product);
  const [userData, setUserData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    dob: '',
    gender: ''
  });
  const [originalData, setOriginalData] = useState({}); // Store original fetched data
  const [changedFields, setChangedFields] = useState({}); // Track changed fields
  const [loading, setLoading] = useState(true);

  const [nextMethod, setNextMethod] = useState(false);
  const [passwordBox, setPasswordBox] = useState(false);
  const [newPassContain, setNewPassContain] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      if (!token) return;

      try {
        const response = await fetch('http://localhost:5000/user', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          const fetchedData = {
            firstname: data.firstname || '',
            lastname: data.lastname || '',
            email: data.email || '',
            phone: data.phone || '',
            dob: data.dob ? new Date(data.dob).toISOString().split('T')[0] : '',
            gender: data.gender || ''
          };
          setUserData(fetchedData);
          setOriginalData(fetchedData); // Store original data for comparison
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [token]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    let updatedValue = value;

    if (id === 'phone') {
      // Allow only numeric input and enforce exactly 10 digits
      const numericValue = value.replace(/[^0-9]/g, '');
      if (numericValue.length <= 10) {
        updatedValue = numericValue;
      } else {
        return; // Prevent updating if exceeding 10 digits
      }
    }

    setUserData((prev) => ({ ...prev, [id]: updatedValue }));

    // Check if the value differs from the original
    if (updatedValue !== originalData[id]) {
      setChangedFields((prev) => ({ ...prev, [id]: updatedValue }));
    } else {
      setChangedFields((prev) => {
        const { [id]: _, ...rest } = prev;
        return rest;
      });
    }
  };

  const handleProfileUpdate = async () => {
    // If no fields have changed, skip the update
    if (Object.keys(changedFields).length === 0) {
      toast.info('No changes to update');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/user', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(changedFields) // Send only changed fields
      });

      if (response.ok) {
        toast.success('Profile updated successfully');
        incrementUserUpdated();
        // Update originalData with the new values
        setOriginalData((prev) => ({ ...prev, ...changedFields }));
        setChangedFields({}); // Reset changed fields after successful update
      } else {
        const errorData = await response.json();
        const errorMessage = errorData.message || 'Failed to update profile';
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('An error occurred while updating profile');
    }
  };

  const handleChangePasswordWithOld = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/change-password-old', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ oldPassword, newPassword })
      });
      if (response.ok) {
        toast.success('Password updated successfully');
        setPasswordBox(false);
        setOldPassword('');
        setNewPassword('');
      } else {
        toast.error('Old password is incorrect');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error('An error occurred while changing password');
    }
  };

  const handleSendOtp = async () => {
    try {
      const response = await fetch('http://localhost:5000/send-otp', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        setOtpSent(true);
        toast.success('OTP sent to your email');
      } else {
        const data = await response.json();
        toast.error(data.message || 'Failed to send OTP');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      toast.error('An error occurred while sending OTP');
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/verify-otp', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ otp })
      });
      if (response.ok) {
        setNewPassContain(true);
        toast.success('OTP verified successfully');
      } else {
        toast.error('Invalid OTP');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      toast.error('An error occurred while verifying OTP');
    }
  };

  const handleResendOtp = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/resend-otp', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        toast.success('OTP resent successfully');
      } else {
        const data = await response.json();
        toast.error(data.message || 'Failed to resend OTP');
      }
    } catch (error) {
      console.error('Error resending OTP:', error);
      toast.error('An error occurred while resending OTP');
    }
  };

  const handleChangePasswordWithOtp = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/change-password-otp', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ newPassword })
      });
      if (response.ok) {
        toast.success('Password updated successfully');
        setPasswordBox(false);
        setNextMethod(false);
        setNewPassContain(false);
        setOtpSent(false);
        setOtp('');
        setNewPassword('');
      } else {
        toast.error('Failed to update password');
      }
    } catch (error) {
      console.error('Error changing password with OTP:', error);
      toast.error('An error occurred while changing password');
    }
  };

  const handleNextMethod = () => {
    if (!otpSent) {
      handleSendOtp();
    }
    setNextMethod(true);
  };

  const handlePreviousMethod = () => setNextMethod(false);
  const handleBackBtn = () => {
    setPasswordBox(false);
    setNextMethod(false);
    setNewPassContain(false);
    setOtpSent(false);
    setOtp('');
    setOldPassword('');
    setNewPassword('');
  };
  const openPasswordBox = () => setPasswordBox(true);
  const closePasswordBox = (e) => {
    if (e.target.closest('.change-password-box')) return;
    setPasswordBox(false);
    setNextMethod(false);
    setNewPassContain(false);
    setOtpSent(false);
    setOtp('');
    setOldPassword('');
    setNewPassword('');
  };

  if (loading) return <div>Loading...</div>;

  return (
    <motion.div
      className="profile-edit-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="form-section">
        <div className="input-row">
          <div className="input-group">
            <label htmlFor="firstname">First Name</label>
            <input
              type="text"
              id="firstname"
              onChange={handleInputChange}
              placeholder={userData.firstname ? userData.firstname : "john"}
              className="modern-input"
            />
          </div>
          <div className="input-group">
            <label htmlFor="lastname">Last Name</label>
            <input
              type="text"
              id="lastname"
              onChange={handleInputChange}
              placeholder={userData.lastname ? userData.lastname : "doe"}
              className="modern-input"
            />
          </div>
        </div>

        <div className="input-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            onChange={handleInputChange}
            placeholder={userData.email}
            className="modern-input icon-input email"
          />
        </div>

        <div className="input-row">
          <div className="input-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              onChange={handleInputChange}
              placeholder={userData.phone ? userData.phone : "8379777564"}
              maxLength="10"
              className="modern-input icon-input phone"
            />
          </div>
          <div className="input-group">
            <label htmlFor="dob">Date of Birth</label>
            <input
              type="date"
              id="dob"
              value={userData.dob}
              onChange={handleInputChange}
              className="modern-input"
            />
          </div>
        </div>

        <div className="input-group">
          <label htmlFor="gender">Gender (Optional)</label>
          <select
            id="gender"
            value={userData.gender}
            onChange={handleInputChange}
            className="modern-select"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <button className="edit-profile-btn" onClick={handleProfileUpdate}>
          <span className="btn-text">Update Profile</span>
        </button>
        <button className='change-password' onClick={openPasswordBox}>Change Password</button>

        <div
          onClick={closePasswordBox}
          className="change-password-container"
          style={{ display: passwordBox ? "flex" : "none" }}
        >
          <div className="change-password-box">
            <div
              className="back-btn-section"
              style={{ display: newPassContain ? "none" : "block" }}
            >
              <svg onClick={handleBackBtn} xmlns="http://www.w3.org/2000/svg"
                height="30px" viewBox="0 -960 960 960" width="30px" fill="#000000">
                <path d="M366.15-253.85 140-480l226.15-226.15L408.31-664l-154 154H820v60H254.31l154 154-42.16 42.15Z" />
              </svg>
            </div>

            <div
              className="first-method"
              style={{ display: !newPassContain && !nextMethod ? "block" : "none" }}
            >
              <form onSubmit={handleChangePasswordWithOld}>
                <h2>Change To Your New Password</h2>
                <input
                  type="password"
                  placeholder='Old Password'
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                />
                <input
                  type="password"
                  placeholder='New Password'
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <button type='submit'>Submit</button>
              </form>
            </div>

            <div
              className="second-method"
              style={{ display: !newPassContain && nextMethod ? "block" : "none" }}
            >
              <form onSubmit={handleVerifyOtp}>
                <h2>OTP Sent To Your Email</h2>
                <input
                  type="password"
                  placeholder='Enter OTP'
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
                <button type='submit'>Verify OTP</button>
                {otpSent && (
                  <button className="resend-otp" onClick={handleResendOtp}>Resend OTP</button>
                )}
              </form>
            </div>

            <div
              className="new-password-contain"
              style={{ display: newPassContain ? "block" : "none" }}
            >
              <form onSubmit={handleChangePasswordWithOtp}>
                <h2>Enter Your New Password</h2>
                <input
                  type="password"
                  placeholder='Enter Your New Password'
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <button type='submit'>Submit</button>
              </form>
            </div>

            {!newPassContain && (
              nextMethod ? (
                <div className="next-method-btn" onClick={handlePreviousMethod}>
                  <svg xmlns="http://www.w3.org/2000/svg" height="24px"
                    viewBox="0 -960 960 960" width="24px" fill="#000000">
                    <path d="M540-327.69 387.69-480 540-632.31v304.62Z" />
                  </svg>
                  <span>Previous Method</span>
                </div>
              ) : (
                <div className="next-method-btn" onClick={handleNextMethod}>
                  <span>Try Another Way</span>
                  <svg xmlns="http://www.w3.org/2000/svg" height="30px"
                    viewBox="0 -960 960 960" width="30px" fill="#000000">
                    <path d="M420-327.69v-304.62L572.31-480 420-327.69Z" />
                  </svg>
                </div>
              )
            )}
          </div>
        </div>
      </div>
      <ToastContainer />
    </motion.div>
  );
}

export default ProfileEdit;