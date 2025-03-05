import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import './signup.css'
import banner from './lake-banner.jpg'
import { useNavigate } from 'react-router-dom'
import { GoogleLogin } from 'react-google-login'

function SignUp() {
  const navigate = useNavigate();
  const [eye, setEye] = useState(false);
  const [verifyBox, setVerifyBox] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState(''); // Added for email storage
  const [verificationCode, setVerificationCode] = useState(''); // Added for code input
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [isLoading, setLoading] = useState(false)

  const handleEye = () => {
    if (eye == false) {
      setEye(true);
    } else {
      setEye(false);
    }
  }

  const changeEmail = () => {
    setVerifyBox(false)
  }

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const response = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstname: data.firstname,
          lastname: data.lastname,
          phone: data.phone,
          email: data.email,
          password: data.password
        })
      });
      const result = await response.text();
      if (response.ok) {
        setRegisteredEmail(data.email); // Store email for verification
        setLoading(false)
        setVerifyBox(true); // Show verification container
      } else {
        alert(result);
        setLoading(false)
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong');
      setLoading(false)
    }
  }

  const handlePhoneInput = (e) => {
    const formattedNumber = e.target.value.replace(/\D/g, '').slice(0, 10);
    e.target.value = formattedNumber;
  }

  const handleCodeInput = (e) => {
    const formattedCode = e.target.value.replace(/\D/g, '').slice(0, 6);
    e.target.value = formattedCode;
    setVerificationCode(formattedCode); // Update state with formatted code
  }

  // Handle verification code submission
  const handleVerify = async () => {
    try {
      const response = await fetch('http://localhost:5000/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: registeredEmail, code: verificationCode })
      });

      const result = await response.json();
      if (response.ok) {
        console.log('Email verified, JWT Token:', result.token);
        setVerifyBox(false); // Hide verification container
        alert('Registration successful!');
        // Optionally, store token or redirect
      } else {
        alert(result.message || 'Invalid code');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong');
    }
  }

  // Handle resend code request
  const handleResend = async () => {
    try {
      const response = await fetch('http://localhost:5000/resend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: registeredEmail })
      });

      const result = await response.text();
      if (response.ok) {
        alert('Verification code resent');
      } else {
        alert(result);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong');
    }
  }

  // Handle Google sign-up response
  const responseGoogle = (response) => {
    console.log(response);
    // TODO: Send response.tokenId to backend for verification and user creation
  }

  return (
    <div className='signup-contain'>
      <form className='signup-form' onSubmit={handleSubmit(onSubmit)}>
        <button type='button' className='back-btn' onClick={(e) => { e.preventDefault(); navigate('/home') }}>
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z" /></svg>
        </button>
        <h1>create an account</h1>
        <p>Already have an Account <span onClick={() => navigate('/signin')}>Sign In</span></p>

        <div className="user-name">
          <input {...register('firstname', {
            required: "first name is required"
          })} type="text" placeholder='First Name' />
          <input {...register('lastname', {
            required: "last name is required"
          })} type="text" placeholder='Last Name' />
        </div>
        <div className="user-detail">
          <div className="num-div"><span>+91</span><input {
            ...register("phone", {
              required: "phone number required",
              minLength: {
                value: 10,
                message: "invalid phone number"
              },
              maxLength: {
                value: 10,
                message: "invalid phone number"
              }
            })
          } type="number" placeholder='Enter Phone Number' onInput={handlePhoneInput} /></div>
          <input {...register('email', {
            required: "email is required",
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: "invalid email"
            }
          })} type="email" placeholder='Enter Your Email' />
          <div className="pass">
            <input {...register('password', {
              required: "password is required",
              minLength: {
                value: 6,
                message: "password must be atleast 6 character"
              }
            })} type={eye ? 'text' : 'password'} placeholder='Enter Your Password' />
          </div>

          <div className="checkbox">
            <input {...register('userAgree', {
              required: "Please accept the Terms and Conditions to proceed"
            })} type="checkbox" /><p>I agree to the <span>Terms and condition</span></p>
          </div>
        </div>
        <button type='submit' className={`${isLoading?"submitAnimation":"submit"}`} disabled={isLoading?true:false}>
          {isLoading ? <svg style={{width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center"}} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><circle fill="#FF156D" stroke="#FF156D" stroke-width="6" r="15" cx="40" cy="65"><animate attributeName="cy" calcMode="spline" dur="2" values="65;135;65;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="-.4"></animate></circle><circle fill="#FF156D" stroke="#FF156D" stroke-width="6" r="15" cx="100" cy="65"><animate attributeName="cy" calcMode="spline" dur="2" values="65;135;65;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="-.2"></animate></circle><circle fill="#FF156D" stroke="#FF156D" stroke-width="6" r="15" cx="160" cy="65"><animate attributeName="cy" calcMode="spline" dur="2" values="65;135;65;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="0"></animate></circle></svg>
            : "Submit"}
        </button>
        <div className='or'>
          <span className='line'></span> or <span className='line'></span>
        </div>
        <GoogleLogin
          clientId="179615418024-dbjrdunjdif6ucducb0i7i3mcothpu1a.apps.googleusercontent.com" // Replace with your Google Client ID
          render={renderProps => (
            <div className="google" onClick={renderProps.onClick}>
              <svg width="30px" height="30px" viewBox="0 0 32 32" data-name="Layer 1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"><path d="M23.75,16A7.7446,7.7446,0,0,1,8.7177,18.6259L4.2849,22.1721A13.244,13.244,0,0,0,29.25,16" fill="#00ac47" /><path d="M23.75,16a7.7387,7.7387,0,0,1-3.2516,6.2987l4.3824,3.5059A13.2042,13.2042,0,0,0,29.25,16" fill="#4285f4" /><path d="M8.25,16a7.698,7.698,0,0,1,.4677-2.6259L4.2849,9.8279a13.177,13.177,0,0,0,0,12.3442l4.4328-3.5462A7.698,7.698,0,0,1,8.25,16Z" fill="#ffba00" /><polygon fill="#2ab2db" points="8.718 13.374 8.718 13.374 8.718 13.374 8.718 13.374" /><path d="M16,8.25a7.699,7.699,0,0,1,4.558,1.4958l4.06-3.7893A13.2152,13.2152,0,0,0,4.2849,9.8279l4.4328,3.5462A7.756,7.756,0,0,1,16,8.25Z" fill="#ea4435" /><polygon fill="#2ab2db" points="8.718 18.626 8.718 18.626 8.718 18.626 8.718 18.626" /><path d="M29.25,15v1L27,19.5H16.5V14H28.25A1,1,0,0,1,29.25,15Z" fill="#4285f4" /></svg>
              <p>sign Up with google</p>
            </div>
          )}
          onSuccess={responseGoogle}
          onFailure={responseGoogle}
          cookiePolicy={'single_host_origin'}
        />
      </form>

      <div className="verification-container" style={{ display: `${verifyBox == true ? "flex" : "none"}` }}>
        <div className="verify-contain">
          <h2>verify your email</h2>
          <div className="verify">
            <span>Enter 6 digit code sent to your Email</span>
            <input
              className='enterCode'
              type="number"
              onInput={handleCodeInput}
            />
            <button className='submitCode' onClick={handleVerify}>Submit</button>
            <button className='sendAgain' onClick={handleResend}>send again</button>
            <span className='changeEmail' onClick={changeEmail}>change email</span>
          </div>
        </div>
      </div>

      <div className="side-banner" style={{ backgroundImage: `url(${banner})` }}></div>
    </div>
  )
}

export default SignUp