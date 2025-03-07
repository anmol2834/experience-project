import React, { useState, useEffect } from 'react';
import './ProfileEdit.css';
import { motion } from 'framer-motion'
import { useAuth } from '../../../context/AuthContext';

function ProfileEdit() {
  const { token } = useAuth();
  const [userData, setUserData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    dob: '',
    gender: ''
  });
  const [loading, setLoading] = useState(true);


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
          console.log('Fetched user data:', data);
          setUserData({
            firstname: data.firstname || '',
            lastname: data.lastname || '',
            email: data.email || '',
            phone: data.phone || '',
            dob: data.dob ? new Date(data.dob).toISOString().split('T')[0] : '',
            gender: data.gender || ''
          });
        } else {
          throw new Error('Failed to fetch user data');
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
    setUserData((prev) => ({ ...prev, [id]: value }));
  };

  const handleProfileUpdate = async () => {
    try {
      const updateData = {
        firstname: userData.firstname,
        lastname: userData.lastname,
        email: userData.email,
        phone: userData.phone,
        dob: userData.dob,
        gender: userData.gender
      };
      const response = await fetch('http://localhost:5000/user', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });

      if (response.ok) {
        alert('Profile updated successfully');
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
  };

  const [nextMethod, setNextMethod] = useState(false);
  const [passwordBox, setPasswordBox] = useState(false)

  const handleNextMethod = () => {
    setNextMethod(true)
  }

  const handlePreviousMethod = () => {
    setNextMethod(false)
  }

  const handleBackBtn = () => {
    setPasswordBox(false)
  }

  const openPasswordBox = () => {
    setPasswordBox(true)
  }

  const closePasswordBox = (e) => {
    if(e.target.closest('.change-password-box')){
      return;
    }
    setPasswordBox(false)
  }

  if (loading) {
    return <div>Loading...</div>;
  }

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

        <div onClick={closePasswordBox} className="change-password-container" style={{display: `${passwordBox?"flex":"none"}`}}>
          <div className="change-password-box">

            <div className="back-btn-section">
              <svg onClick={handleBackBtn} xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="#000000"><path d="M366.15-253.85 140-480l226.15-226.15L408.31-664l-154 154H820v60H254.31l154 154-42.16 42.15Z" /></svg>
            </div>

            <div className="first-method" style={{ display: `${nextMethod == false ? "block" : "none"}` }}>
              <form>
                <h2>Change To Your New Password</h2>
                <input type="password" placeholder='Old Password' />
                <input type="password" placeholder='New Password' />
                <button type='submit'>Submit</button>
              </form>
            </div>

            <div className="second-method" style={{ display: `${nextMethod == true ? "block" : "none"}` }}>
              <form>
                <h2>OTP Sent To Your Email</h2>
                <input type="password" placeholder='Enter OTP' />
                <button type='submit'>Submit</button>
                <button className="resend-otp">Resend OTP</button>
              </form>
            </div>

            {
              nextMethod ?
                <div className="next-method-btn" onClick={handlePreviousMethod}>
                  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M540-327.69 387.69-480 540-632.31v304.62Z" /></svg>
                  <span>Previous Way</span>
                </div> :
                <div className="next-method-btn" onClick={handleNextMethod}>
                  <span>Try Another Way</span>
                  <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="#000000"><path d="M420-327.69v-304.62L572.31-480 420-327.69Z" /></svg>
                </div>
            }

          </div>
        </div>

      </div>
    </motion.div>
  );
}

export default ProfileEdit;