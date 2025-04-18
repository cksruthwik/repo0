// Login.jsx
import React, { useState } from 'react';
import './Login.css'; // Create Login.css in the same directory
import { FaUserCircle } from 'react-icons/fa'; 
function Login({ onLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLoginSubmit = (event) => {
        event.preventDefault();
        setError('');

        // **Simulated Authentication - Replace with your actual backend logic**
        if (email === 'test@example.com' && password === 'password') {
            onLogin(email); // Call the onLogin function passed from App.jsx
        } else {
            setError('Invalid email or password.');
        }
    };

    return (
        <div className="login-container">
                <h2>
                <FaUserCircle style={{ marginRight: '8px', verticalAlign: 'middle' }} /> {/* Add icon here */}
                Sign In
            </h2>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleLoginSubmit} className="login-form">
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="login-button">Sign In</button>
            </form>
        </div>
    );
}

export default Login;