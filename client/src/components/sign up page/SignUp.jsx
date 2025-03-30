import { useState } from 'react'
import { useForm } from 'react-hook-form'
import './signup.css'
import banner from './lake-banner.jpg'
import { useNavigate } from 'react-router-dom'
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function SignUp() {
  const navigate = useNavigate();
  const [eye, setEye] = useState(false);
  const [verifyBox, setVerifyBox] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [isLoading, setLoading] = useState(false)

  const handleEye = () => setEye(!eye);

  const changeEmail = () => {
    setVerifyBox(false)
    toast.dismiss('verify-error')
  }

  const onSubmit = async (data) => {
    setLoading(true)
    toast.dismiss('signup-error')
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/register`, {
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
        setRegisteredEmail(data.email);
        setLoading(false)
        setVerifyBox(true);
      } else {
        toast.error(result, { toastId: 'signup-error' })
        setLoading(false)
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Something went wrong', { toastId: 'signup-error' })
      setLoading(false)
    }
  }

  const onError = (errors) => {
    toast.dismiss('signup-error')
    const firstError = Object.values(errors)[0]
    if (firstError) {
      toast.error(firstError.message, { toastId: 'signup-error' })
    }
  }

  const handlePhoneInput = (e) => {
    const formattedNumber = e.target.value.replace(/\D/g, '').slice(0, 10);
    e.target.value = formattedNumber;
  }

  const handleCodeInput = (e) => {
    const formattedCode = e.target.value.replace(/\D/g, '').slice(0, 6);
    e.target.value = formattedCode;
    setVerificationCode(formattedCode);
  }

  const handleVerify = async () => {
    toast.dismiss('verify-error')
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: registeredEmail, code: verificationCode })
      });

      const result = await response.json();
      if (response.ok) {
        setVerifyBox(false);
        navigate("/signin")
        toast.success('Registration successful!');
      } else {
        toast.error(result.message || 'Invalid code', { toastId: 'verify-error' })
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Something went wrong', { toastId: 'verify-error' })
    }
  }

  const handleResend = async () => {
    toast.dismiss('resend-error')
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/resend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: registeredEmail })
      });

      const result = await response.text();
      if (response.ok) {
        toast.success('Verification code resent');
      } else {
        toast.error(result, { toastId: 'resend-error' })
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Something went wrong', { toastId: 'resend-error' })
    }
  }

  const responseGoogle = (response) => {
    console.log(response);
  }


  return (
    <div className='signup-contain'>
      <form className='signup-form' onSubmit={handleSubmit(onSubmit, onError)}>
        <button type='button' className='back-btn' onClick={(e) => { e.preventDefault(); navigate('/home') }}>
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M366.92-213.46 100-480.38l266.92-266.93 41.77 41.77-194.54 195.16h646.23v59.99H214.54l195.15 195.16-42.77 41.77Z" /></svg>
        </button>
        <h1>create an account</h1>
        <p>Already have an Account <span onClick={() => navigate('/signin')}>Sign In</span></p>

        <div className="user-name">
          <input {...register('firstname', {
            required: "First name is required"
          })} type="text" placeholder='First Name' />
          <input {...register('lastname', {
            required: "Last name is required"
          })} type="text" placeholder='Last Name' />
        </div>
        <div className="user-detail">
          <div className="num-div"><span>+91</span><input {
            ...register("phone", {
              required: "Phone number required",
              minLength: {
                value: 10,
                message: "Invalid phone number"
              },
              maxLength: {
                value: 10,
                message: "Invalid phone number"
              }
            })
          } type="number" placeholder='Enter Phone Number' onInput={handlePhoneInput} /></div>
          <input {...register('email', {
            required: "Email is required",
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: "Invalid email"
            }
          })} type="email" placeholder='Enter Your Email' />
          <div className="pass">
            <input {...register('password', {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters"
              }
            })} type={eye ? 'text' : 'password'} placeholder='Enter Your Password' />
          </div>

          <div className="checkbox">
            <input {...register('userAgree', {
              required: "Please accept the Terms and Conditions to proceed"
            })} type="checkbox" /><p>I agree to the <span>Terms and condition</span></p>
          </div>
        </div>
        <button type='submit' className={`${isLoading ? "submitAnimation" : "submit"}`} disabled={isLoading}>
          {isLoading ? <svg style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><circle fill="#FF156D" stroke="#FF156D" strokeWidth="6" r="15" cx="40" cy="65"><animate attributeName="cy" calcMode="spline" dur="2" values="65;135;65;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="-.4"></animate></circle><circle fill="#FF156D" stroke="#FF156D" strokeWidth="6" r="15" cx="100" cy="65"><animate attributeName="cy" calcMode="spline" dur="2" values="65;135;65;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="-.2"></animate></circle><circle fill="#FF156D" stroke="#FF156D" strokeWidth="6" r="15" cx="160" cy="65"><animate attributeName="cy" calcMode="spline" dur="2" values="65;135;65;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="0"></animate></circle></svg>
            : "Submit"}
        </button>
        <div className='or'>
          <span className='line'></span> or <span className='line'></span>
        </div>
        <GoogleOAuthProvider clientId="179615418024-dbjrdunjdif6ucducb0i7i3mcothpu1a.apps.googleusercontent.com">
          <GoogleLogin
            clientId="179615418024-dbjrdunjdif6ucducb0i7i3mcothpu1a.apps.googleusercontent.com"
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
        </GoogleOAuthProvider>
      </form>

      <div className="verification-container" style={{ display: `${verifyBox ? "flex" : "none"}` }}>
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
  )
}

export default SignUp