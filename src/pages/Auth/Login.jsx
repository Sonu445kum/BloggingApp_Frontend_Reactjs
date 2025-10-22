import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLoginMutation } from '../../api/apiSlice';
import { toast } from 'react-toastify';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [login, { isLoading }] = useLoginMutation();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!username.trim() || !password.trim()) {
        toast.error("Username and password are required");
        return;
      }

      const res = await login({ username: username.trim(), password: password.trim() }).unwrap();

      // Adjust this depending on backend token field
      const token = res.token || res.access;
      if (token) {
        localStorage.setItem('token', token);
        toast.success('Login successful!');
        navigate('/');
      } else {
        toast.error('Login failed. Check username/password.');
      }
    } catch (err) {
      console.error('Login Error:', err);
      if (err?.status === 400) {
        toast.error('Invalid username or password');
      } else {
        toast.error(err?.data?.detail || 'Login error');
      }
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl mb-6 font-bold">Login</h2>
        <input
          type="text"
          placeholder="Username"
          className="border p-2 mb-4 w-full rounded"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-2 mb-4 w-full rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded w-full hover:bg-blue-700"
          disabled={isLoading}
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default Login;
