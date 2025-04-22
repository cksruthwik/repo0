// src/Login/Login.jsx
import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import './Login.css'; // Ensure this path is correct relative to Login.jsx
import { useAuth } from './AuthContext'; // Still need useAuth for login function
import { sendOtp } from './LoginService'; // Keep for sending OTP
// Remove useNavigate as navigation is handled by the parent based on auth state
// import { useNavigate } from 'react-router-dom';

// Accept onLoginSuccess prop from the parent component (AppContent in App.jsx)
const Login = ({ onLoginSuccess }) => {
  const { login } = useAuth(); // Get the login function from the AuthContext
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtp, setShowOtp] = useState(false); // State to toggle OTP visibility
  const [otpSent, setOtpSent] = useState(false); // State to track if OTP has been sent
  const [error, setError] = useState('');       // State for displaying error messages
  const [loading, setLoading] = useState(false); // State to indicate loading (sending OTP or verifying)
  // const navigate = useNavigate(); // Remove useNavigate

  // --- Handler for Sending OTP ---
  const handleSendOtp = async (e) => {
    e.preventDefault(); // Prevent default form submission
    // Basic email validation
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    try {
      setLoading(true); // Start loading indicator
      setError('');     // Clear previous errors
      console.log("Login: Sending OTP to", email);
      await sendOtp({ email }); // Call your API service function to send OTP
      console.log("Login: OTP sent successfully.");
      setOtpSent(true);   // Update state to show the OTP input field
      setError('');     // Clear error message on success
    } catch (err) {
      console.error("Login: Failed to send OTP:", err);
      // Display a user-friendly error message from the caught error or a default one
      setError(err.message || 'Failed to send OTP. Please check the email and try again.');
    } finally {
      setLoading(false); // Stop loading indicator regardless of success or failure
    }
  };

  // --- Handler for Verifying OTP and Logging In ---
  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent default form submission
    // Basic validation for OTP presence
    if (!email || !otp) {
      setError('Please enter both email and the received OTP.');
      return;
    }
    // Optional: Add OTP format validation (e.g., length)
    if (otp.length !== 6) { // Example: Assuming 6-digit OTP
        setError('Please enter a valid 6-digit OTP.');
        return;
    }

    try {
      setLoading(true); // Start loading indicator
      setError('');     // Clear previous errors
      console.log("Login: Verifying OTP for", email);
      // Call the login function from AuthContext, which handles API call and token storage
      await login(email, otp);
      console.log("Login: OTP verification successful.");
      // IMPORTANT: Call the success handler passed from App.jsx
      // This allows the parent component to know login succeeded and handle navigation/state changes.
      onLoginSuccess(email);
      // No navigation here - the parent component (AppContent) will re-render
      // based on the updated 'isAuthenticated' state from AuthContext.
    } catch (err) {
      console.error("Login: OTP verification failed:", err);
      // Display error message from the caught error or a default one
      setError(err.message || 'Invalid OTP or login failed. Please try again.');
      setLoading(false); // Stop loading ONLY on error, successful login unmounts this component
    }
    // No finally { setLoading(false); } here, as success leads to unmounting.
  };

  // --- Render JSX ---
  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-icon">🔐</div> {/* Lock icon */}
          <h1>Welcome Back</h1>
        </div>

        {/* Display error message if present */}
        {error && <div className="error-message">{error}</div>}

        {/* Form submits either handleSendOtp or handleLogin based on otpSent state */}
        <form className="login-form" onSubmit={otpSent ? handleLogin : handleSendOtp}>

          {/* Email Input Group */}
          <div className="form-group">
            <label htmlFor="email-input"> {/* Use htmlFor for accessibility */}
              <Mail size={16} className="input-icon" />
              Email
            </label>
            <input
              id="email-input" // Corresponding id for label
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              // Disable email input after OTP is sent or while loading
              disabled={otpSent || loading}
              required // HTML5 validation
            />
          </div>

          {/* OTP Input Group - Conditionally rendered */}
          {otpSent && (
            <div className="form-group">
              <label htmlFor="otp-input">
                <Lock size={16} className="input-icon" />
                OTP
              </label>
              <div className="password-input-wrapper"> {/* Reusing class name, adjust if needed */}
                <input
                  id="otp-input"
                  // Toggle input type based on showOtp state
                  type={showOtp ? "text" : "password"}
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  disabled={loading} // Disable while loading
                  required
                  minLength={6} // Basic validation
                  maxLength={6} // Basic validation
                  autoComplete="one-time-code" // Helps with browser autofill for OTPs
                />
                {/* Button to toggle OTP visibility */}
                <button
                  type="button" // Important: prevent form submission
                  className="password-toggle"
                  onClick={() => setShowOtp(!showOtp)}
                  aria-label={showOtp ? "Hide OTP" : "Show OTP"} // Accessibility
                  tabIndex="-1" // Remove from tab order
                >
                  {showOtp ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          )}

          {/* Footer: Contains Submit/Resend buttons */}
          <div className="form-footer">
            {otpSent ? (
              // Show Resend OTP and Verify Button
              <>
                <div className="remember-forgot" style={{ justifyContent: 'flex-end' }}>
                  {/* Use a button for Resend OTP for better semantics */}
                  <button
                    type="button" // Prevent form submission
                    className="forgot-link" // Style as a link
                    onClick={handleSendOtp} // Reuse OTP sending logic
                    disabled={loading} // Disable while loading
                    style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                  >
                    {loading ? 'Sending...' : 'Resend OTP'}
                  </button>
                </div>
                <button
                  className="login-button"
                  type="submit"
                  // Disable if loading or OTP isn't 6 digits
                  disabled={loading || otp.length !== 6}
                >
                  {loading ? 'Verifying...' : 'Verify & Login'}
                </button>
              </>
            ) : (
              // Show Send OTP Button initially
              <button className="login-button" type="submit" disabled={loading}>
                {loading ? 'Sending...' : 'Send OTP'}
              </button>
            )}
          </div>
        </form>

        {/* Optional Signup Link - Keep or remove as needed */}
        {/* <div className="signup-link">
          Don't have an account? <a href="/signup">Sign up</a>
        </div> */}
      </div>
    </div>
  );
};

export default Login;