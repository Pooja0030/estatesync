import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Building } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const role = await login(email, password);
    if (role) {
      if (role === 'ADMIN') navigate('/admin');
      else if (role === 'MANAGER') navigate('/manager');
      else navigate('/agent');
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="inline-block p-3 bg-primary-100 rounded-full text-primary-600 mb-4">
            <Building size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">EstateSync Portal</h2>
          <p className="text-gray-500 mt-2">Sign in to manage your leads</p>
        </div>

        {error && <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border-gray-300 rounded-lg p-2.5 bg-gray-50 border focus:ring-primary-500 focus:border-primary-500 outline-none"
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-gray-300 rounded-lg p-2.5 bg-gray-50 border focus:ring-primary-500 focus:border-primary-500 outline-none"
              required 
            />
          </div>
          <button 
            type="submit"
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-2.5 rounded-lg transition"
          >
            Sign In
          </button>
        </form>

        <div className="mt-6 text-center border-t border-gray-100 pt-6">
          <button 
            onClick={() => navigate('/')} 
            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-primary-600 transition"
          >
            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            Back to Public Homepage
          </button>
        </div>
      </div>
    </div>
  );
}
