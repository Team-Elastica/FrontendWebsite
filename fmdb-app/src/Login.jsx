import React, { useState } from 'react';
import { auth } from './firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';


function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setMessage("Welcome " + userCredential.user.email);
      console.log("User logged in:", userCredential.user);
      navigate('/'); // Redirect to homepage
    } catch (error) {
      setMessage("Error: " + error.message);
    }
  };

  return (
    <div className="login-page" style={{ paddingTop: '120px' }}>
      <h2>Login or Sign Up</h2>
      <form onSubmit={handleLogin}>
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
        <button type="submit">Log In</button>
      </form>
      <button onClick={() => navigate('/')}>Back to Home</button>
      <p>{message}</p>
      <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
    </div>
  );
}

export default Login;
