import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export function ConfirmPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  
  const [status, setStatus] = useState<'verifying' | 'success' | 'error' | 'invalid'>('verifying');
  const [userName, setUserName] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('invalid');
      return;
    }

    const verifyToken = async () => {
      try {
        const response = await fetch(`/api/confirm?token=${token}`);
        const data = await response.json();

        if (response.ok && data.success) {
          setUserName(data.user.first_name);
          setStatus('success');
          
          // Auto-redirect to dashboard after 2.5 seconds
          setTimeout(() => {
            navigate(`/dashboard?welcome=true&name=${encodeURIComponent(data.user.first_name)}`);
          }, 2500);
        } else {
          setStatus('error');
        }
      } catch (error) {
        setStatus('error');
      }
    };

    verifyToken();
  }, [token, navigate]);

  if (status === 'verifying') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-cream p-4">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-brand-orange border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-bold text-brand-green">Verifying your email...</h2>
          <p className="text-sm text-slate-500 mt-1">Please wait while we confirm your subscription.</p>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-cream p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-lg p-8 text-center">
          <div className="text-5xl mb-4">🎉</div>
          <h1 className="text-2xl font-black text-brand-green">Welcome, {userName}!</h1>
          <p className="text-slate-600 mt-2">Your email has been confirmed. You'll be redirected to your dashboard shortly.</p>
          <div className="w-full bg-slate-200 rounded-full h-2 mt-4 overflow-hidden">
            <div className="bg-brand-orange h-2 rounded-full animate-pulse" style={{ width: '100%' }}></div>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'invalid') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-cream p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-lg p-8 text-center">
          <div className="text-5xl mb-4">🔗</div>
          <h1 className="text-2xl font-black text-red-600">Invalid Link</h1>
          <p className="text-slate-600 mt-2">This confirmation link is invalid or has expired.</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 bg-brand-orange hover:bg-orange-600 text-white font-black py-2 px-6 rounded-xl text-sm transition"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-cream p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-lg p-8 text-center">
        <div className="text-5xl mb-4">⚠️</div>
        <h1 className="text-2xl font-black text-red-600">Something Went Wrong</h1>
        <p className="text-slate-600 mt-2">We couldn't confirm your email. Please try again or contact support.</p>
        <button
          onClick={() => navigate('/')}
          className="mt-4 bg-brand-orange hover:bg-orange-600 text-white font-black py-2 px-6 rounded-xl text-sm transition"
        >
          Return to Home
        </button>
      </div>
    </div>
  );
}
