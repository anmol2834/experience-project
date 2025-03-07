import React, { useState, useEffect } from 'react';
import './ProfileEdit.css';
import {motion} from 'framer-motion'
import { useAuth } from '../../../context/AuthContext'; // Adjust path as needed

function ProfileEdit() {
  const { token } = useAuth(); // Get token from AuthContext
  const [userData, setUserData] = useState({
    firstname: '', // Changed to match backend schema
    lastname: '',  // Changed to match backend schema
    email: '',
    phone: '',
    dob: '',
    gender: ''
  });
  const [loading, setLoading] = useState(true);

  // Fetch user data when the component mounts
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
          console.log('Fetched user data:', data); // Debug log
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

  // Handle changes to form inputs
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setUserData((prev) => ({ ...prev, [id]: value }));
  };

  // Submit updated profile data to the server
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
              placeholder={userData.firstname?userData.firstname:"john"}
              className="modern-input"
            />
          </div>
          <div className="input-group">
            <label htmlFor="lastname">Last Name</label>
            <input
              type="text"
              id="lastname"
              onChange={handleInputChange}
              placeholder={userData.lastname?userData.lastname:"doe"}
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
              placeholder={userData.phone?userData.phone:"8379777564"}
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
      </div>
    </motion.div>
  );
}

export default ProfileEdit;