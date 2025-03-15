import React, { useState, useEffect, useContext } from 'react';
import './UserAcc.css';
import { useAuth } from '../../context/AuthContext';
import { Outlet, useNavigate } from 'react-router-dom';
import { context_of_product } from '../../context/ProductContext'; // Import the context

function UserAcc() {
  const { logout, token } = useAuth();
  const { userUpdated } = useContext(context_of_product); // Access userUpdated from context
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    firstname: '',
    lastname: '',
    email: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!token) {
        navigate('/signin');
        return;
      }

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
          setUserData({
            firstname: data.firstname || '',
            lastname: data.lastname || '',
            email: data.email || ''
          });
        } else {
          throw new Error('Failed to fetch user data');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [token, navigate, logout, userUpdated]); // Add userUpdated to dependencies

  const handleLogout = () => {
    logout();
  };

  if (loading) {
    return (
      <div className="loading">
        <ul>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
        </ul>
      </div>
    );
  }

  return (
    <div className='user-acc-contain'>
      <div className="account-menu">
        <div className="home-btn">
          <svg onClick={() => navigate('/home')} xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="#000000"><path d="M366.15-253.85 140-480l226.15-226.15L408.31-664l-154 154H820v60H254.31l154 154-42.16 42.15Z" /></svg>
          <span>Profile</span>
        </div>
        <div className="profile">
          <section>
            <h2>{userData.firstname} {userData.lastname}</h2>
            <span className='edit-profile-icon' onClick={() => navigate('edit_profile')}>
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000">
                <path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z" />
              </svg>
            </span>
          </section>
          <section>
            <p>Email :- {userData.email}</p>
          </section>
          <section>
            <button className='logout-btn' onClick={handleLogout}>
              Logout
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M212.31-140Q182-140 161-161q-21-21-21-51.31v-535.38Q140-778 161-799q21-21 51.31-21h268.07v60H212.31q-4.62 0-8.46 3.85-3.85 3.84-3.85 8.46v535.38q0 4.62 3.85 8.46 3.84 3.85 8.46 3.85h268.07v60H212.31Zm436.92-169.23-41.54-43.39L705.08-450H363.85v-60h341.23l-97.39-97.38 41.54-43.39L820-480 649.23-309.23Z" /></svg>
            </button>
          </section>
        </div>

        <div className="profile-menu">
          <div onClick={() => navigate('bookings')} className="profile-menu-btn booked">
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="m692.92-158.46 126.31-124.92-33.54-33.54-92.77 91.15-38.61-39-33.54 34.15 72.15 72.16ZM255.39-605.39h449.22v-59.99H255.39v59.99ZM720-57.69q-74.92 0-127.46-52.54Q540-162.77 540-237.69q0-74.92 52.54-127.46 52.54-52.54 127.46-52.54 74.92 0 127.46 52.54Q900-312.61 900-237.69q0 74.92-52.54 127.46Q794.92-57.69 720-57.69Zm-580-46.93v-643.07q0-29.92 21.19-51.12Q182.39-820 212.31-820h535.38q29.92 0 51.12 21.19Q820-777.61 820-747.69v252.38q-14.39-6.31-29.19-10.57-14.81-4.27-30.81-6.5v-235.31q0-4.62-3.85-8.46-3.84-3.85-8.46-3.85H212.31q-4.62 0-8.46 3.85-3.85 3.84-3.85 8.46V-198h248.39q3.84 23.69 11.26 45.54 7.43 21.84 19.81 41.46l-3.69 3.69-52.69-46.54-56.93 49.23-56.92-49.23-56.92 49.23-56.92-49.23L140-104.62Zm115.39-190h195.69q2.61-16 7.27-30.8 4.65-14.81 11.34-29.19h-214.3v59.99Zm0-155.38h288.23q28.77-26.23 65.23-42.15 36.46-15.93 77.69-17.85H255.39v60ZM200-198v-562V-198Z" /></svg>
            <span>Booked</span>
          </div>
          <div onClick={() => navigate('wishlist')} className="profile-menu-btn wishlist-btn">
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="m480-146.93-44.15-39.69q-99.46-90.23-164.5-155.07-65.04-64.85-103.08-115.43-38.04-50.57-53.15-92.27Q100-591.08 100-634q0-85.15 57.42-142.58Q214.85-834 300-834q52.38 0 99 24.5t81 70.27q34.38-45.77 81-70.27 46.62-24.5 99-24.5 85.15 0 142.58 57.42Q860-719.15 860-634q0 42.92-15.12 84.61-15.11 41.7-53.15 92.27-38.04 50.58-102.89 115.43Q624-276.85 524.15-186.62L480-146.93Zm0-81.07q96-86.38 158-148.08 62-61.69 98-107.19t50-80.81q14-35.3 14-69.92 0-60-40-100t-100-40q-47.38 0-87.58 26.88-40.19 26.89-63.65 74.81h-57.54q-23.85-48.31-63.85-75Q347.38-774 300-774q-59.62 0-99.81 40Q160-694 160-634q0 34.62 14 69.92 14 35.31 50 80.81t98 107q62 61.5 158 148.27Zm0-273Z" /></svg>
            <span>Wishlist</span>
          </div>
          <div className="profile-menu-btn rewards-btn">
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M164.62-100v-435.39H100v-208.45h206.85q-8.46-9.77-11.5-22.01-3.04-12.23-3.04-25.69 0-44.87 31.41-76.28 31.41-31.41 76.28-31.41 23 0 42.62 9.65 19.61 9.66 35.07 25.81 15.46-16.77 35.08-26.11 19.61-9.35 42.61-9.35 44.88 0 76.29 31.41 31.41 31.41 31.41 76.28 0 13.31-3.35 25.31-3.35 12-11.19 22.39H860v208.45h-64.62V-100H164.62Zm390.76-739.23q-20.27 0-33.98 13.71-13.71 13.71-13.71 33.98 0 20.27 13.71 33.98 13.71 13.72 33.98 13.72 20.27 0 33.99-13.72 13.71-13.71 13.71-33.98 0-20.27-13.71-33.98-13.72-13.71-33.99-13.71Zm-203.07 47.69q0 20.27 13.71 33.98 13.71 13.72 33.98 13.72 20.27 0 33.98-13.72 13.71-13.71 13.71-33.98 0-20.27-13.71-33.98-13.71-13.71-33.98-13.71-20.27 0-33.98 13.71-13.71 13.71-13.71 33.98ZM160-683.85v88.47h290v-88.47H160ZM450-160v-375.39H224.61V-160H450Zm60 0h225.39v-375.39H510V-160Zm290-435.38v-88.47H510v88.47h290Z" /></svg>
            <span>Rewards</span>
          </div>
          <div onClick={() => navigate('help_center')} className="profile-menu-btn help-center-btn">
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M455.39-140v-60h292.3q5 0 8.66-3.08 3.65-3.07 3.65-8.07v-279.77q0-114.7-82.08-193.12-82.07-78.42-197.92-78.42t-197.92 78.42Q200-605.62 200-490.92v235.53h-30q-28.77 0-49.38-20.03Q100-295.46 100-324.23v-77.69q0-19.46 11.08-35.66 11.08-16.19 28.92-26.03l1.85-51.08q4.92-65.31 33.92-121t74.38-96.96q45.39-41.27 104.77-64.31Q414.31-820 480-820t124.77 23.04q59.08 23.04 104.77 64t74.38 96.65q28.69 55.7 34.23 121l1.85 50.08q17.46 8.23 28.73 23.54Q860-426.38 860-407.54v89.31q0 18.84-11.27 34.15-11.27 15.31-28.73 23.54v49.39q0 29.53-21.19 50.34Q777.61-140 747.69-140h-292.3Zm-87.7-269.23q-14.69 0-25.04-9.96-10.34-9.96-10.34-24.66 0-14.69 10.34-24.84 10.35-10.16 25.04-10.16 14.7 0 25.04 10.16 10.35 10.15 10.35 24.84 0 14.7-10.35 24.66-10.34 9.96-25.04 9.96Zm224.62 0q-14.7 0-25.04-9.96-10.35-9.96-10.35-24.66 0-14.69 10.35-24.84 10.34-10.16 25.04-10.16 14.69 0 25.04 10.16 10.34 10.15 10.34 24.84 0 14.7-10.34 24.66-10.35 9.96-25.04 9.96ZM254.85-472q-6.23-97.92 60.92-167.58 67.15-69.65 166.23-69.65 83.23 0 146.88 51.5 63.66 51.5 77.27 133.34-85.23-1-157.5-44.76-72.27-43.77-110.96-120-15.23 74.61-63.84 131.92-48.62 57.31-119 85.23Z" /></svg>
            <span>Help Center</span>
          </div>
        </div>

        <div className="address-section">
          <section>
            <h2>Saved Address :</h2>
            <span className='add-address'>
              <svg xmlns="http://www.w3.org/2000/svg" height="35px" viewBox="0 -960 960 960" width="35px" fill="#000000"><path d="M450-290h60v-160h160v-60H510v-160h-60v160H290v60h160v160Zm30.07 190q-78.84 0-148.21-29.92t-120.68-81.21q-51.31-51.29-81.25-120.63Q100-401.1 100-479.93q0-78.84 29.92-148.21t81.21-120.68q51.29-51.31 120.63-81.25Q401.1-860 479.93-860q78.84 0 148.21 29.92t120.68 81.21q51.31 51.29 81.25 120.63Q860-558.9 860-480.07q0 78.84-29.92 148.21t-81.21 120.68q-51.29 51.31-120.63 81.25Q558.9-100 480.07-100Zm-.07-60q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" /></svg>
            </span>
          </section>
          <section>
            Add Your Local Address
          </section>
        </div>

        <div className="my-activity-section">
          <h2>My Activity :</h2>
          <div className="activity">
            <section>Reviews</section>
            <section>Questions & Answers</section>
            <section>Transaction History</section>
          </div>
        </div>
      </div>
      <div className="account-render">
        <Outlet />
      </div>
    </div>
  );
}

export default UserAcc;