import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './signin.css';
import signinBanner from './signin-banner.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faLongArrowLeft } from '@fortawesome/free-solid-svg-icons';

function SignIn() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [eye, setEye] = useState(false);

  const { register, handleSubmit, control } = useForm();

  const emailValue = useWatch({ control, name: 'email' }) || '';
  const passwordValue = useWatch({ control, name: 'password' }) || '';

  const handleEmailFocus = () => setEmailFocused(true);
  const handleEmailBlur = () => setEmailFocused(false);
  const handlePasswordFocus = () => setPasswordFocused(true);
  const handlePasswordBlur = () => setPasswordFocused(false);
  const handleEye = () => setEye(!eye);

  const [passwordBox, setPasswordBox] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [verifiedEmail, setVerifiedEmail] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [lastOtpSentTime, setLastOtpSentTime] = useState(null);
  const COOLDOWN_PERIOD = 5 * 60 * 1000; // 5 minutes in milliseconds

  // Loading states for server actions
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);

  const onSubmit = async (data) => {
    setIsLoggingIn(true);
    const result = await login(data.email, data.password);
    setIsLoggingIn(false);
    if (!result.success) {
      toast.dismiss('login-error');
      toast.error(result.message, { toastId: 'login-error' });
    }
  };

  const onError = (errors) => {
    toast.dismiss('login-error');
    const firstError = Object.values(errors)[0];
    if (firstError) {
      toast.error(firstError.message, { toastId: 'login-error' });
    }
  };

  const handleInputEmail = (e) => setResetEmail(e.target.value);

  const handleVerifyEmail = async (e) => {
    e.preventDefault();
    setIsVerifyingEmail(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/check-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail })
      });
      if (response.ok) {
        setVerifiedEmail(true);
        await handleSendResetOtp(); // Send OTP immediately after verification
        toast.success('Email verified, OTP sent to your email');
      } else {
        toast.error('User email does not exist');
      }
    } catch (error) {
      console.error('Error verifying email:', error);
      toast.error('An error occurred while verifying email');
    } finally {
      setIsVerifyingEmail(false);
    }
  };

  const handleSendResetOtp = async () => {
    if (lastOtpSentTime && Date.now() - lastOtpSentTime < COOLDOWN_PERIOD) {
      toast.error('Please wait before requesting a new OTP');
      return;
    }
    setIsSendingOtp(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/send-reset-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail })
      });
      if (response.ok) {
        setOtpSent(true);
        setLastOtpSentTime(Date.now());
        toast.success('OTP sent to your email');
      } else {
        const data = await response.json();
        toast.error(data.message || 'Failed to send OTP');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      toast.error('An error occurred while sending OTP');
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setIsResettingPassword(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail, otp, newPassword })
      });
      if (response.ok) {
        toast.success('Password updated successfully');
        setPasswordBox(false);
        setOtpSent(false);
        setOtp('');
        setNewPassword('');
        setVerifiedEmail(false);
        setResetEmail('');
      } else {
        const data = await response.json();
        toast.error(data.message || 'Failed to update password');
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      toast.error('An error occurred while resetting password');
    } finally {
      setIsResettingPassword(false);
    }
  };

  const handleBackBtn = () => {
    setPasswordBox(false);
    setOtpSent(false);
    setOtp('');
    setNewPassword('');
    setVerifiedEmail(false);
    setResetEmail('');
  };

  const openPasswordBox = () => {
    setPasswordBox(true);
    setVerifiedEmail(false);
    setResetEmail('');
    setOtpSent(false);
    setOtp('');
    setNewPassword('');
  };

  const closePasswordBox = (e) => {
    if (e.target.closest('.change-password-box')) return;
    setPasswordBox(false);
    setOtpSent(false);
    setOtp('');
    setNewPassword('');
    setVerifiedEmail(false);
    setResetEmail('');
  };

  return (
    <div className='signin-contain'>
      <form onSubmit={handleSubmit(onSubmit, onError)}>
        <button type='button' className='back-btn' onClick={(e) => { e.preventDefault(); navigate('/home') }}>
          <FontAwesomeIcon icon={faLongArrowLeft} />
        </button>
        <h1>sign in</h1>
        <p>Don't have an Account? <span onClick={() => navigate('/signup')}>sign up</span></p>
        <div className='input-area'>
          <div className={`input input-email ${emailFocused || emailValue ? 'focused' : ''}`}>
            <label htmlFor="email" className='label email-label'>Email / Phone no.</label>
            <input
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: 'Invalid email'
                }
              })}
              type="text"
              className='email'
              onFocus={handleEmailFocus}
              onBlur={handleEmailBlur}
            />
            <span className='bottom-border'></span>
          </div>
          <div className={`input input-pass ${passwordFocused || passwordValue ? 'focused' : ''}`}>
            <label htmlFor="password" className='label pass-label'>Password</label>
            <input
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters'
                }
              })}
              type={eye ? 'text' : 'password'}
              className='pass'
              onFocus={handlePasswordFocus}
              onBlur={handlePasswordBlur}
            />
            <div className="eye-container" onClick={handleEye}>
              <svg style={{ display: eye ? 'none' : 'block' }} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000">
                <path d="m644-428-58-58q9-47-27-88t-93-32l-58-58q17-8  34.5-12t37.5-4q75 0 127.5 52.5T660-500q0 20-4 37.5T644-428Zm128 126-58-56q38-29 67.5-63.5T832-500q-50-101-143.5-160.5T480-720q-29 0-57 4t-55 12l-62-62q41-17 84-25.5t90-8.5q151 0 269 83.5T920-500q-23 59-60.5 109.5T772-302Zm20 246L624-222q-35 11-70.5 16.5T480-200q-151 0-269-83.5T40-500q21-53 53-98.5t73-81.5L56-792l56-56 736 736-56 56ZM222-624q-29 26-53 57t-41 67q50 101 143.5 160.5T480-280q20 0 39-2.5t39-5.5l-36-38q-11 3-21 4.5t-21 1.5q-75 0-127.5-52.5T300-500q0-11 1.5-21t4.5-21l-84-82Zm319 93Zm-151 75Z" />
              </svg>
              <svg style={{ display: eye ? 'block' : 'none' }} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000">
                <path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z" />
              </svg>
            </div>
            <span className='bottom-border'></span>
          </div>
          <span className='forgot' onClick={openPasswordBox}>Forgot Password ?</span>
        </div>
        <div className="submit-container">
          <button type='submit' className='submit' disabled={isLoggingIn}>
            {isLoggingIn ? <span className="spinner"></span> : 'Login'}
          </button>
          <p>or</p>
          <div className="google">
            <svg width="35px" height="35px" viewBox="0 0 32 32" data-name="Layer 1" id="Layer_1" xmlns="http://www.w3.org/2000/svg">
              <path d="M23.75,16A7.7446,7.7446,0,0,1,8.7177,18.6259L4.2849,22.1721A13.244,13.244,0,0,0,29.25,16" fill="#00ac47" />
              <path d="M23.75,16a7.7387,7.7387,0,0,1-3.2516,6.2987l4.3824,3.5059A13.2042,13.2042,0,0,0,29.25,16" fill="#4285f4" />
              <path d="M8.25,16a7.698,7.698,0,0,1,.4677-2.6259L4.2849,9.8279a13.177,13.177,0,0,0,0,12.3442l4.4328-3.5462A7.698,7.698,0,0,1,8.25,16Z" fill="#ffba00" />
              <polygon fill="#2ab2db" points="8.718 13.374 8.718 13.374 8.718 13.374 8.718 13.374" />
              <path d="M16,8.25a7.699,7.699,0,0,1,4.558,1.4958l4.06-3.7893A13.2152,13.2152,0,0,0,4.2849,9.8279l4.4328,3.5462A7.756,7.756,0,0,1,16,8.25Z" fill="#ea4435" />
              <polygon fill="#2ab2db" points="8.718 18.626 8.718 18.626 8.718 18.626 8.718 18.626" />
              <path d="M29.25,15v1L27,19.5H16.5V14H28.25A1,1,0,0,1,29.25,15Z" fill="#4285f4" />
            </svg>
            <p>sign in with google</p>
          </div>
        </div>
      </form>
      <div className="signin-banner" style={{ backgroundImage: `url(${signinBanner})` }}></div>
      <div
        onClick={closePasswordBox}
        className="change-password-container"
        style={{ display: passwordBox ? "flex" : "none" }}
      >
        <div className="change-password-box">
          <div className="back-btn-section">
            <svg onClick={handleBackBtn} xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="#000000">
              <path d="M366.15-253.85 140-480l226.15-226.15L408.31-664l-154 154H820v60H254.31l154 154-42.16 42.15Z" />
            </svg>
          </div>
          <div
            className="email-verificaton-container"
            style={{ display: !verifiedEmail ? "block" : "none" }}
          >
            <form onSubmit={handleVerifyEmail}>
              <h2>Change To Your New Password</h2>
              <input
                type="email"
                value={resetEmail}
                onChange={handleInputEmail}
                placeholder='Enter Your Valid Email'
              />
              <button className='next-method' type="submit" disabled={isVerifyingEmail}>
                {isVerifyingEmail ? <span className="spinner"></span> : 'Next'}
              </button>
            </form>
          </div>
          <div
            className="second-method"
            style={{ display: verifiedEmail ? "block" : "none" }}
          >
            <form onSubmit={handleResetPassword}>
              <h2>OTP Sent To Your Email</h2>
              <input
                type="password"
                placeholder='Enter OTP'
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <input
                type="password"
                placeholder='New Password'
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <button type='submit' disabled={isResettingPassword}>
                {isResettingPassword ? <span className="spinner"></span> : 'Submit'}
              </button>
              {otpSent && (
                <button
                  className="resend-otp"
                  onClick={handleSendResetOtp}
                  disabled={isSendingOtp || (lastOtpSentTime && Date.now() - lastOtpSentTime < COOLDOWN_PERIOD)}
                >
                  {isSendingOtp ? <span className="spinner"></span> : 'Resend OTP'}
                </button>
              )}
            </form>
          </div>
        </div>
      </div>
      <div style={{ position: "absolute" }}>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </div>
    </div>
  );
}

export default SignIn;