import React, { useState } from 'react';
import { auth } from './firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      setMessage("Account created successfully!");
      console.log("User signed up:", userCredential.user);
      navigate('/'); // Redirect after signup
    } catch (error) {
      setMessage("Error: " + error.message);
    }
  };

  return (
    <div className="signup-page" style={{ paddingTop: '120px' }}>
      <h2>Create an Account</h2>
      <form onSubmit={handleSignup}>
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
        <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
        <button type="submit">Sign Up</button>
      </form>
      <button onClick={() => navigate('/')}>Back to Home</button>

      <p>{message}</p>
    </div>
  );
}

export default Signup;
