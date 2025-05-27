import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginMessage, setLoginMessage] = useState('');

  const handleStandardLogin = async (e) => {
    e.preventDefault();
    setLoginMessage('Login with google');
    try {
     const res = await axios.post('http://localhost:5000//auth/login', { email, password }, { withCredentials: true });
      if (res.status === 200) {
        window.location.href = '/todo';
      }
    } catch (error) {
      console.error('Login failed', error);
      alert('Login failed. login with google');
      setLoginMessage('');
    }
  };

  const googleLogin = () => {
    setLoginMessage('Logging in with Google...');
    window.open('http://localhost:5000/auth/google', '_self');
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Login</h2>
        <form className="login-form" onSubmit={handleStandardLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Login</button>
        </form>

        <div className="divider">OR</div>

        {/* Show prompt only after clicking login or Google */}
        {loginMessage && <p className="login-message">{loginMessage}</p>}

        <button onClick={googleLogin} className="google-login-btn">
          Login with Google
        </button>
      </div>
    </div>
  );
}

export default Login;
