import { useState } from 'react';
import { useForm } from 'react-hook-form';
import './signup.css';
import banner from './lake-banner.jpg';
import { useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLongArrowLeft } from '@fortawesome/free-solid-svg-icons';

function SignUp() {
  const navigate = useNavigate();
  const [eye, setEye] = useState(false);
  const [verifyBox, setVerifyBox] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [isLoading, setLoading] = useState(false);
  const [isVerifying, setVerifying] = useState(false);
  const [isResending, setResending] = useState(false);

  const handleEye = () => setEye(!eye);

  const changeEmail = () => {
    setVerifyBox(false);
    toast.dismiss('verify-error');
  };

  const onSubmit = async (data) => {
    setLoading(true);
    toast.dismiss('signup-error');
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstname: data.firstname,
          lastname: data.lastname,
          phone: data.phone,
          email: data.email,
          password: data.password,
        }),
      });
      const result = await response.text();
      if (response.ok) {
        setRegisteredEmail(data.email);
        setVerifyBox(true);
        toast.success('Please verify your email');
      } else {
        toast.error(result, { toastId: 'signup-error' });
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Something went wrong', { toastId: 'signup-error' });
    } finally {
      setLoading(false);
    }
  };

  const onError = (errors) => {
    toast.dismiss('signup-error');
    const firstError = Object.values(errors)[0];
    if (firstError) {
      toast.error(firstError.message, { toastId: 'signup-error' });
    }
  };

  const handlePhoneInput = (e) => {
    const formattedNumber = e.target.value.replace(/\D/g, '').slice(0, 10);
    e.target.value = formattedNumber;
  };

  const handleCodeInput = (e) => {
    const formattedCode = e.target.value.replace(/\D/g, '').slice(0, 6);
    e.target.value = formattedCode;
    setVerificationCode(formattedCode);
  };

  const handleVerify = async () => {
    setVerifying(true);
    toast.dismiss('verify-error');
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: registeredEmail, code: verificationCode }),
      });

      const result = await response.json();
      if (response.ok) {
        setVerifyBox(false);
        navigate('/signin');
        toast.success('Registration successful!');
      } else {
        toast.error(result.message || 'Invalid code', { toastId: 'verify-error' });
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Something went wrong', { toastId: 'verify-error' });
    } finally {
      setVerifying(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    toast.dismiss('resend-error');
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/resend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: registeredEmail }),
      });

      const result = await response.text();
      if (response.ok) {
        toast.success('Verification code resent');
      } else {
        toast.error(result, { toastId: 'resend-error' });
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Something went wrong', { toastId: 'resend-error' });
    } finally {
      setResending(false);
    }
  };

  const responseGoogle = (response) => {
    console.log(response);
  };

  return (
    <div className="signup-contain">
      <form className="signup-form" onSubmit={handleSubmit(onSubmit, onError)}>
        <button type="button" className="back-btn" onClick={(e) => { e.preventDefault(); navigate('/home'); }}>
          <FontAwesomeIcon icon={faLongArrowLeft} />
        </button>
        <h1>create an account</h1>
        <p>Already have an Account <span onClick={() => navigate('/signin')}>Sign In</span></p>

        <div className="user-name">
          <input
            {...register('firstname', {
              required: 'First name is required',
            })}
            type="text"
            placeholder="First Name"
          />
          <input
            {...register('lastname', {
              required: 'Last name is required',
            })}
            type="text"
            placeholder="Last Name"
          />
        </div>
        <div className="user-detail">
          <div className="num-div">
            <span>+91</span>
            <input
              {...register('phone', {
                required: 'Phone number required',
                minLength: {
                  value: 10,
                  message: 'Invalid phone number',
                },
                maxLength: {
                  value: 10,
                  message: 'Invalid phone number',
                },
              })}
              type="number"
              placeholder="Enter Phone Number"
              onInput={handlePhoneInput}
            />
          </div>
          <input
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: 'Invalid email',
              },
            })}
            type="email"
            placeholder="Enter Your Email"
          />
          <div className="pass">
            <input
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
              })}
              type={eye ? 'text' : 'password'}
              placeholder="Enter Your Password"
            />
            <span onClick={handleEye}>
              <svg
                style={{ display: eye ? 'none' : 'block' }}
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#000000"
              >
                <path d="m644-428-58-58q9-47-27-88t-93-32l-58-58q17-8 34.5-12t37.5-4q75 0 127.5 52.5T660-500q0 20-4 37.5T644-428Zm128 126-58-56q38-29 67.5-63.5T832-500q-50-101-143.5-160.5T480-720q-29 0-57 4t-55 12l-62-62q41-17 84-25.5t90-8.5q151 0 269 83.5T920-500q-23 59-60.5 109.5T772-302Zm20 246L624-222q-35 11-70.5 16.5T480-200q-151 0-269-83.5T40-500q21-53 53-98.5t73-81.5L56-792l56-56 736 736-56 56ZM222-624q-29 26-53 57t-41 67q50 101 143.5 160.5T480-280q20 0 39-2.5t39-5.5l-36-38q-11 3-21 4.5t-21 1.5q-75 0-127.5-52.5T300-500q0-11 1.5-21t4.5-21l-84-82Zm319 93Zm-151 75Z" />
              </svg>
              <svg
                style={{ display: eye ? 'block' : 'none' }}
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#000000"
              >
                <path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z" />
              </svg>
            </span>
          </div>

          <div className="checkbox">
            <input
              {...register('userAgree', {
                required: 'Please accept the Terms and Conditions to proceed',
              })}
              type="checkbox"
            />
            <p>
              I agree to the <span onClick={() => navigate('/termsAndConditions')}>Terms and condition</span>
            </p>
          </div>
        </div>
        <button type="submit" className="submit" disabled={isLoading}>
          {isLoading ? <span className="spinner"></span> : 'Submit'}
        </button>
      </form>

      <div className="verification-container" style={{ display: verifyBox ? 'flex' : 'none' }}>
        <div className="verify-contain">
          <h2>verify your email</h2>
          <div className="verify">
            <span>Enter 6 digit code sent to your Email</span>
            <input
              className="enterCode"
              type="number"
              onInput={handleCodeInput}
              value={verificationCode}
            />
            <button className="submitCode" onClick={handleVerify} disabled={isVerifying}>
              {isVerifying ? <span className="spinner"></span> : 'Submit'}
            </button>
            <button className="sendAgain" onClick={handleResend} disabled={isResending}>
              {isResending ? <span className="spinner"></span> : 'Send Again'}
            </button>
            <span className="changeEmail" onClick={changeEmail}>
              change email
            </span>
          </div>
        </div>
      </div>

      <div className="side-banner" style={{ backgroundImage: `url(${banner})` }}></div>

      <div style={{ position: 'absolute' }}>
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

export default SignUp;