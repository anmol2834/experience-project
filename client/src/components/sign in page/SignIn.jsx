import { useState, useEffect, useRef } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './signin.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faEye, faEyeSlash, faLongArrowLeft, faMultiply, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

// Placeholder images - in a real app, you'd import actual images
const droneImg = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%234285F4' d='M12,8a2,2,0,1,0,2,2A2,2,0,0,0,12,8Zm8,0V5a1,1,0,0,0-1-1H17a1,1,0,0,0-1,1V8h2v3.28l-2.57-1.53A1,1,0,0,0,15,10a1,1,0,0,0-.57.18L12,12l-2.43-1.82A1,1,0,0,0,9,10a1,1,0,0,0-.43.75L7,11.28V8H9V5A1,1,0,0,0,8,5H5A1,1,0,0,0,4,6V8H6v3.28l-2.57,1.53A1,1,0,0,0,3,14v2a1,1,0,0,0,1,1H6v2a1,1,0,0,0,1,1H8a1,1,0,0,0,1-1V17h6v2a1,1,0,0,0,1,1h1a1,1,0,0,0,1-1V17h2a1,1,0,0,0,1-1V14a1,1,0,0,0-.43-.75L18,11.28V8h2Z'/%3E%3C/svg%3E";
const horrorImg = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23EA4335' d='M13,3C9.23,3 6.19,5.95 6,9.66L4.08,12.19C3.84,12.5 4.08,13 4.5,13H6V16C6,17.1 6.9,18 8,18H9V21H16V18H17C17.55,18 18,17.55 18,17V13H19.5C19.92,13 20.16,12.5 19.92,12.19L18,9.66C17.81,5.95 14.77,3 11,3C10.67,3 10.34,3 10,3.05C11.63,3.2 13,4.57 13,6.2C13,7.82 11.65,9.2 10,9.2C9.66,9.2 9.33,9.12 9.04,8.98C8.34,9.63 7.42,10 6.42,10C6.29,10 6.15,10 6,10C7.25,13.6 10.45,16 14,16C17.87,16 21,12.87 21,9C21,5.9 18.5,3.32 15.34,3C14.12,2.36 12.6,2 11,2C10,2 9.03,2.16 8.1,2.47C9.22,2.8 10.23,3.3 11,4C11.73,3.36 12.6,3 13,3Z'/%3E%3C/svg%3E";
const movieImg = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23FBBC05' d='M18,9.86V4H17V7.86L15,6.86V4H14V6.86L12,5.86V4H11V5.86L9,4.86V4H8V4.86L6,3.86V4H5A2,2,0,0,0,3,6V18a2,2,0,0,0,2,2H19a2,2,0,0,0,2-2V4H18ZM13,17H7V15H13Zm4-4H7V11H17Zm0-4H7V7H17Z'/%3E%3C/svg%3E";
const partyImg = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%2334A853' d='M12,3a9,9,0,0,0-9,9c0,2.17,.76,4.16,2,5.72V21h3.28c1.56,1.24,3.55,2,5.72,2s4.16-.76,5.72-2H21v-3.28c1.24-1.56,2-3.55,2-5.72,0-4.97-4.03-9-9-9Zm1,14h-2v-2h2v2Zm0-3h-2c0-3.25,3-3,3-5,0-1.1-.9-2-2-2s-2,.9-2,2h-2c0-2.21,1.79-4,4-4s4,1.79,4,4c0,2.5-3,2.75-3,5Z'/%3E%3C/svg%3E";
const gamingImg = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23673AB7' d='M21,6H17V5a1,1,0,0,0-1-1H8A1,1,0,0,0,7,5V6H3A1,1,0,0,0,2,7V19a1,1,0,0,0,1,1H21a1,1,0,0,0,1-1V7A1,1,0,0,0,21,6ZM9,6h6V5.5a.5.5,0,0,0-.5-.5h-5a.5.5,0,0,0-.5.5V6Zm11,12H4V8H8v1H6v2H8v2H6v2H8v2H6v2H20V18ZM14,12h2v2H14V12Zm-3,0H9v2h2V12Z'/%3E%3C/svg%3E";
const wisdomImg = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%2300BCD4' d='M12,3a9,9,0,0,0-9,9c0,2.17,.76,4.16,2,5.72V21h3.28c1.56,1.24,3.55,2,5.72,2s4.16-.76,5.72-2H21v-3.28c1.24-1.56,2-3.55,2-5.72,0-4.97-4.03-9-9-9Zm0,16c-3.87,0-7-3.13-7-7s3.13-7,7-7,7,3.13,7,7-3.13,7-7,7Zm1-11H11v2h2v2H11v2h2v2H11v2h2v-2h2v-2H13V13h2V11H13V8Zm0,4v2h-2V12h2Z'/%3E%3C/svg%3E";

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

  // Verification box states
  const [showVerificationBox, setShowVerificationBox] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState('');
  const [verificationOtp, setVerificationOtp] = useState('');
  const [otpTimer, setOtpTimer] = useState(0);
  const [canResendOtp, setCanResendOtp] = useState(true);

  // Loading states for server actions
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [isSendingVerificationOtp, setIsSendingVerificationOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  // Banner states
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const cardIntervalRef = useRef(null);

  const onSubmit = async (data) => {
    setIsLoggingIn(true);
    const result = await login(data.email, data.password);
    setIsLoggingIn(false);
    if (!result.success) {
      if (result.message === 'Email not verified') {
        setVerificationEmail(data.email);
        setShowVerificationBox(true);
      } else {
        toast.dismiss('login-error');
        toast.error(result.message, { toastId: 'login-error' });
      }
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

  const handleSendVerificationOtp = async () => {
    if (otpTimer > 0) {
      toast.error('Please wait before requesting a new OTP');
      return;
    }
    setIsSendingVerificationOtp(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/send-verification-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: verificationEmail })
      });
      if (response.ok) {
        setOtpTimer(60);
        setCanResendOtp(false);
        toast.success('OTP sent to your email');
      } else {
        const data = await response.json();
        toast.error(data.message || 'Failed to send OTP');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      toast.error('An error occurred while sending OTP');
    } finally {
      setIsSendingVerificationOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    setIsVerifyingOtp(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/verify-otp-no-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: verificationEmail, otp: verificationOtp })
      });
      if (response.ok) {
        toast.success('Email verified successfully');
        setShowVerificationBox(false);
        // Optionally, retry login here if needed
      } else {
        const data = await response.json();
        toast.error(data.message || 'Invalid OTP');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      toast.error('An error occurred while verifying OTP');
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  useEffect(() => {
    if (otpTimer > 0) {
      const timer = setTimeout(() => setOtpTimer(otpTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResendOtp(true);
    }
  }, [otpTimer]);

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

  const closeVerificationBox = () => {
    setShowVerificationBox(false);
    setVerificationOtp('');
    setOtpTimer(0);
    setCanResendOtp(true);
  };

  // Card data for the banner
  const bannerCards = [
    {
      title: "FPV Drone Experience",
      description: "Immerse yourself in breathtaking aerial views with our high-speed FPV drones. Feel the thrill as you pilot your own drone through stunning landscapes.",
      color: "#4285f4",
      icon: droneImg
    },
    {
      title: "Horror Story Sessions",
      description: "Get chills with our spine-tingling horror stories told by master storytellers. Experience suspense, mystery, and terror in our immersive sessions.",
      color: "#ea4335",
      icon: horrorImg
    },
    {
      title: "Movie Nights Under Stars",
      description: "Experience cinema like never before with our open-air screenings. Watch classic and contemporary films under the night sky with premium sound.",
      color: "#fbbc05",
      icon: movieImg
    },
    {
      title: "Late Night Parties",
      description: "Dance the night away with our exclusive late-night celebrations. Featuring top DJs, themed events, and vibrant atmospheres.",
      color: "#34a853",
      icon: partyImg
    },
    {
      title: "Gamer Bash",
      description: "Compete in epic gaming tournaments with fellow enthusiasts. From retro classics to the latest releases, we've got something for every gamer.",
      color: "#673ab7",
      icon: gamingImg
    },
    {
      title: "Wisdom Hours",
      description: "Gain insights from experts in intimate knowledge-sharing sessions. Learn about philosophy, science, art, and life from industry leaders.",
      color: "#00bcd4",
      icon: wisdomImg
    }
  ];

  // Handle card navigation
  const nextCard = () => {
    setCurrentCardIndex((prevIndex) => (prevIndex + 1) % bannerCards.length);
  };

  const prevCard = () => {
    setCurrentCardIndex((prevIndex) => (prevIndex - 1 + bannerCards.length) % bannerCards.length);
  };

  // Auto-rotate cards
  useEffect(() => {
    cardIntervalRef.current = setInterval(() => {
      nextCard();
    }, 5000);
    
    return () => {
      if (cardIntervalRef.current) {
        clearInterval(cardIntervalRef.current);
      }
    };
  }, []);

  // Particle canvas ref
  const canvasRef = useRef(null);
  
  // Particle animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width = canvas.offsetWidth;
    const height = canvas.height = canvas.offsetHeight;
    
    // Create particles
    const particles = [];
    const particleCount = 100;
    const colors = [
      'rgba(106, 90, 205, 0.5)', // rebeccapurple
      'rgba(66, 133, 244, 0.5)', // blue
      'rgba(234, 67, 53, 0.5)',  // red
      'rgba(251, 188, 5, 0.5)',  // yellow
      'rgba(52, 168, 83, 0.5)',  // green
      'rgba(103, 58, 183, 0.5)'  // purple
    ];
    
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        angle: 0,
        angleSpeed: Math.random() * 0.05
      });
    }
    
    // Animation loop
    let animationId;
    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Draw glow background
      const gradient = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, Math.max(width, height)/2);
      gradient.addColorStop(0, 'rgba(106, 90, 205, 0.1)');
      gradient.addColorStop(1, 'rgba(106, 90, 205, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
      
      // Update and draw particles
      particles.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.angle += p.angleSpeed;
        
        // Boundary check
        if (p.x < 0 || p.x > width) p.speedX *= -1;
        if (p.y < 0 || p.y > height) p.speedY *= -1;
        
        // Draw particle with pulsing effect
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius + Math.sin(p.angle) * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      });
      
      animationId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      cancelAnimationFrame(animationId);
    };
  }, []);

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
            <label htmlFor="email" className='label email-label'>Email</label>
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
              <FontAwesomeIcon icon={faEyeSlash} style={{ display: eye ? 'none' : 'block' }} />
              <FontAwesomeIcon icon={faEye} style={{ display: eye ? 'block' : 'none' }} />
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
      <div className="signin-banner">
        <canvas ref={canvasRef} className="particle-canvas"></canvas>
        <div className="banner-content">
          <div className="banner-title">
            <h2>Unlock Extraordinary Experiences</h2>
            <p>Sign in to access our exclusive experiences</p>
          </div>
          
          <div className="feature-carousel">
            <div className="carousel-control prev" onClick={prevCard}>
              <FontAwesomeIcon icon={faChevronLeft} />
            </div>
            
            <div className="feature-card-container">
              {bannerCards.map((card, index) => (
                <div 
                  key={index}
                  className={`feature-card ${index === currentCardIndex ? 'active' : ''}`}
                  style={{ 
                    backgroundColor: `${card.color}20`,
                    borderColor: card.color,
                    '--card-glow': card.color,
                    animationDelay: `${index * 0.1}s`
                  }}
                >
                  <div className="card-icon">
                    <img src={card.icon} alt={card.title} className="card-image" />
                  </div>
                  <div className="signin-card-content">
                    <h3>{card.title}</h3>
                    <p>{card.description}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="carousel-control next" onClick={nextCard}>
              <FontAwesomeIcon icon={faChevronRight} />
            </div>
          </div>
          
          <div className="carousel-indicators">
            {bannerCards.map((_, index) => (
              <div 
                key={index}
                className={`indicator ${index === currentCardIndex ? 'active' : ''}`}
                onClick={() => setCurrentCardIndex(index)}
              />
            ))}
          </div>
          
          <div className="coming-soon">
            <div className="pulse-dot"></div>
            <p>More experiences coming soon: Skydiving, Survival Training, Crafting Workshops</p>
          </div>
        </div>
      </div>

      <div
        onClick={closePasswordBox}
        className="change-password-container"
        style={{ display: passwordBox ? "flex" : "none" }}
      >
        <div className="change-password-box">
          <div className="back-btn-section">
           
            <FontAwesomeIcon icon={faLongArrowLeft} onClick={handleBackBtn} />
            <h2>Forgot Password</h2>
          </div>
          <div
            className="email-verificaton-container"
            style={{ display: !verifiedEmail ? "block" : "none" }}
          >
            <form onSubmit={handleVerifyEmail}>
              <h3>enter your valid email address</h3>
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
            className="second-process-container"
            style={{ display: verifiedEmail ? "block" : "none" }}
          >
            <form onSubmit={handleResetPassword}>
              <h3>OTP Sent To Your Email</h3>
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
      <div
        className="verification-container"
        style={{ display: showVerificationBox ? "flex" : "none" }}
      >
        <div className="verification-box">
          <h2>Verify Your Email</h2>
          <p>Enter the OTP sent to {verificationEmail}</p>
          <input
            type="text"
            placeholder="Enter OTP"
            value={verificationOtp}
            onChange={(e) => setVerificationOtp(e.target.value)}
          />
          <div className="verification-buttons">
            <button
              className="send-otp"
              onClick={handleSendVerificationOtp}
              disabled={isSendingVerificationOtp || !canResendOtp}
            >
              {isSendingVerificationOtp ? (
                <span className="spinner"></span>
              ) : otpTimer > 0 ? (
                `Resend in ${otpTimer}s`
              ) : (
                'Send OTP'
              )}
            </button>
            <button
              className="submit-otp"
              onClick={handleVerifyOtp}
              disabled={isVerifyingOtp}
            >
              {isVerifyingOtp ? <span className="spinner"></span> : 'Submit'}
            </button>
          </div>
          <button className="close-verification" onClick={closeVerificationBox}>
            <FontAwesomeIcon icon={faMultiply} />
          </button>
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