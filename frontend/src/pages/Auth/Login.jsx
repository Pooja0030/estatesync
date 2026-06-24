import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Building, ArrowRight, ShieldCheck, Mail, KeyRound, ArrowLeft } from 'lucide-react';
import api from '../../services/api';

export default function Login() {
  const [loginMethod, setLoginMethod] = useState('password'); // 'password' or 'otp'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const { login, loginWithOtp } = useAuth();
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email first.');
      return;
    }
    setIsSendingOtp(true);
    setError('');
    setMessage('Sending OTP...');
    try {
      await api.post('/auth/send-otp', { email });
      setOtpSent(true);
      setMessage('OTP sent to your email.');
    } catch (err) {
      setError(err.response?.data || 'Failed to send OTP. Account might not exist.');
      setMessage('');
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    
    let role;
    if (loginMethod === 'password') {
      role = await login(email, password);
    } else {
      role = await loginWithOtp(email, otp);
    }

    if (role) {
      if (role === 'ADMIN') navigate('/admin');
      else if (role === 'MANAGER') navigate('/manager');
      else navigate('/agent');
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white font-sans overflow-hidden">
      
      {/* Inline Styles for Custom Animations */}
      <style>{`
        @keyframes float-up {
          0% { transform: translateY(120vh) rotate(0deg) scale(0.8); opacity: 0; }
          10% { opacity: 0.6; }
          90% { opacity: 0.6; }
          100% { transform: translateY(-20vh) rotate(360deg) scale(1.2); opacity: 0; }
        }
        @keyframes fade-in {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-float-1 { animation: float-up 25s linear infinite; }
        .animate-float-2 { animation: float-up 20s linear infinite 5s; }
        .animate-float-3 { animation: float-up 28s linear infinite 2s; }
        .animate-float-4 { animation: float-up 22s linear infinite 8s; }
        .animate-float-5 { animation: float-up 30s linear infinite 12s; }
        .animate-fade-in { animation: fade-in 0.4s ease-out forwards; }
      `}</style>

      {/* Left Panel: Light Green with Cool Animations */}
      <div className="lg:flex-1 relative hidden lg:flex flex-col justify-between p-12 bg-green-50 overflow-hidden border-r border-green-100">
        
        {/* Animated Floating Shapes Background */}
        <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
          <div className="absolute w-32 h-32 bg-primary-200/50 rounded-2xl left-[10%] backdrop-blur-md border border-white/40 animate-float-1"></div>
          <div className="absolute w-48 h-48 bg-emerald-200/40 rounded-full right-[20%] backdrop-blur-md border border-white/40 animate-float-2"></div>
          <div className="absolute w-24 h-24 bg-green-300/30 rounded-full left-[30%] backdrop-blur-md border border-white/40 animate-float-3"></div>
          <div className="absolute w-40 h-40 bg-teal-200/40 rounded-3xl right-[10%] backdrop-blur-md border border-white/40 animate-float-4"></div>
          <div className="absolute w-56 h-56 bg-primary-100/60 rounded-full left-[50%] backdrop-blur-md border border-white/40 animate-float-5"></div>
          
          {/* Static Soft Glow Overlays */}
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/40 rounded-full mix-blend-overlay filter blur-[100px]"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary-200/30 rounded-full mix-blend-multiply filter blur-[100px]"></div>
        </div>

        {/* Content (Z-10 to stay above animations) */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 text-primary-900">
            <div className="p-2.5 bg-white shadow-sm rounded-xl border border-primary-100">
              <Building size={28} className="text-primary-600" />
            </div>
            <span className="text-2xl font-bold tracking-tight">EstateSync</span>
          </div>
        </div>

        <div className="relative z-10 max-w-lg mb-12">
          <div className="inline-block px-4 py-1.5 bg-white/60 backdrop-blur-md border border-primary-200 rounded-full text-sm font-semibold text-primary-800 mb-6 shadow-sm">
            Staff & Partners Portal
          </div>
          <h1 className="text-5xl font-extrabold text-gray-900 leading-[1.15] mb-6 tracking-tight">
            Seamlessly manage <br/>
            <span className="text-primary-600">
              real estate.
            </span>
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed font-medium">
            Access your leads, organize visits, process proposals, and close deals efficiently in a workspace built for professionals.
          </p>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-4 text-sm text-primary-800 font-medium">
            <div className="flex items-center gap-1.5 bg-white/50 backdrop-blur-sm px-3 py-1.5 rounded-full border border-primary-200 shadow-sm">
              <ShieldCheck size={16} className="text-primary-600"/> Secure Access
            </div>
            <span>© 2026 EstateSync</span>
          </div>
        </div>
      </div>

      {/* Right Panel: Clean White Login Form */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-24 xl:px-32 relative bg-white">
        
        {/* Mobile Header (Only visible on small screens) */}
        <div className="flex lg:hidden items-center gap-3 mb-10">
          <div className="p-2.5 bg-primary-50 rounded-xl border border-primary-100">
            <Building size={24} className="text-primary-600" />
          </div>
          <span className="text-2xl font-bold text-gray-900 tracking-tight">EstateSync</span>
        </div>

        <div className="w-full max-w-[400px] mx-auto">
          
          <button 
            onClick={() => navigate('/')} 
            className="group flex items-center text-sm font-semibold text-gray-500 hover:text-primary-600 transition-colors mb-8 w-fit"
          >
            <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to public site
          </button>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">Welcome Back</h2>
            <p className="text-gray-500">Sign in to your account to continue.</p>
          </div>

          {/* Alert Messages */}
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl mb-6 text-sm font-medium flex items-start gap-3 animate-fade-in">
              <div className="mt-0.5"><ShieldCheck size={18} /></div>
              <div>{error}</div>
            </div>
          )}
          {message && (
            <div className="bg-green-50 border border-green-100 text-green-700 p-4 rounded-xl mb-6 text-sm font-medium flex items-start gap-3 animate-fade-in">
              <div className="mt-0.5"><ShieldCheck size={18} /></div>
              <div>{message}</div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Custom Method Toggle */}
            <div className="flex p-1 bg-gray-100/80 rounded-xl mb-8">
              <button 
                type="button"
                className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${loginMethod === 'password' ? 'bg-white text-gray-900 shadow-sm border border-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => { setLoginMethod('password'); setError(''); setMessage(''); }}
              >
                Password
              </button>
              <button 
                type="button"
                className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${loginMethod === 'otp' ? 'bg-white text-gray-900 shadow-sm border border-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => { setLoginMethod('otp'); setError(''); setMessage(''); }}
              >
                Email OTP
              </button>
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-gray-700">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors group-focus-within:text-primary-500 text-gray-400">
                  <Mail size={18} />
                </div>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all shadow-sm"
                  placeholder="name@estatesync.com"
                  required 
                />
              </div>
            </div>

            {loginMethod === 'password' && (
              <div className="space-y-1.5 animate-fade-in">
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-semibold text-gray-700">Password</label>
                  <a href="#" className="text-xs font-semibold text-primary-600 hover:text-primary-700">Forgot password?</a>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors group-focus-within:text-primary-500 text-gray-400">
                    <KeyRound size={18} />
                  </div>
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all shadow-sm"
                    placeholder="••••••••"
                    required={loginMethod === 'password'} 
                  />
                </div>
              </div>
            )}

            {loginMethod === 'otp' && (
              <div className="animate-fade-in space-y-4">
                {!otpSent ? (
                  <button 
                    type="button"
                    onClick={handleSendOtp}
                    disabled={isSendingOtp}
                    className="w-full bg-white text-gray-700 font-semibold py-3 rounded-xl border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSendingOtp ? (
                      <span className="w-5 h-5 border-2 border-gray-300 border-t-gray-700 rounded-full animate-spin"></span>
                    ) : 'Send One-Time Password'}
                  </button>
                ) : (
                  <div className="space-y-1.5 animate-fade-in mt-4">
                    <label className="block text-sm font-semibold text-gray-700 text-center">Enter 6-digit OTP</label>
                    <input 
                      type="text" 
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none tracking-[0.5em] font-mono text-center text-lg transition-all"
                      placeholder="------"
                      maxLength={6}
                      required={loginMethod === 'otp'} 
                    />
                  </div>
                )}
              </div>
            )}

            <div className="pt-4">
              {(loginMethod === 'password' || (loginMethod === 'otp' && otpSent)) && (
                <button 
                  type="submit"
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3.5 rounded-xl transition-all shadow-md shadow-primary-600/20 flex justify-center items-center gap-2"
                >
                  Sign In to Dashboard <ArrowRight size={18} />
                </button>
              )}
            </div>
            
          </form>

        </div>
      </div>
    </div>
  );
}
