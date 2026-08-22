'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Glasses, Mail, Lock, User, Phone, CheckCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, login, register, loading } = useAuth();
  
  const [activeTab, setActiveTab] = useState('login');
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  const redirectUrl = searchParams.get('redirect') || '/';

  // If user is already authenticated, redirect
  useEffect(() => {
    if (!loading && user) {
      router.push(redirectUrl);
    }
  }, [user, loading]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMessage('');
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setFormLoading(true);

    if (activeTab === 'login') {
      const res = await login(formData.email, formData.password);
      if (res.success) {
        router.push(redirectUrl);
      } else {
        setErrorMessage(res.message);
      }
    } else {
      // Validate fields
      if (!formData.name || !formData.email || !formData.password || !formData.phone) {
        setErrorMessage('All fields are required');
        setFormLoading(false);
        return;
      }
      const res = await register(formData.name, formData.email, formData.password, formData.phone);
      if (res.success) {
        router.push(redirectUrl);
      } else {
        setErrorMessage(res.message);
      }
    }
    setFormLoading(false);
  };

  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-luckoptics-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto my-12 px-4">
      {/* Brand logo showcase */}
      <div className="text-center space-y-2 mb-8">
        <div className="inline-flex p-3 bg-luckoptics-dark text-white rounded-2xl mx-auto shadow-md">
          <Glasses size={28} className="text-luckoptics-primary" />
        </div>
        <h2 className="font-display font-black text-2xl text-luckoptics-dark leading-none">LuckOptics</h2>
        <p className="text-xs text-gray-400 font-semibold tracking-wider uppercase">Secure Customer Access</p>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
        {/* Switch tabs */}
        <div className="flex border-b border-gray-100">
          <button
            onClick={() => {
              setActiveTab('login');
              setErrorMessage('');
            }}
            className={`w-1/2 py-4 text-sm font-bold text-center cursor-pointer transition-all border-b-2 ${
              activeTab === 'login'
                ? 'border-luckoptics-primary text-luckoptics-primary'
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setActiveTab('register');
              setErrorMessage('');
            }}
            className={`w-1/2 py-4 text-sm font-bold text-center cursor-pointer transition-all border-b-2 ${
              activeTab === 'register'
                ? 'border-luckoptics-primary text-luckoptics-primary'
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleFormSubmit} className="p-6 sm:p-8 space-y-4">
          {errorMessage && (
            <div className="bg-red-50 border border-red-200/50 text-red-600 text-xs font-semibold p-3.5 rounded-xl">
              {errorMessage}
            </div>
          )}

          {activeTab === 'register' && (
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1.5">Full Name</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <User size={16} />
                </span>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="John Doe"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-hidden focus:border-luckoptics-primary focus:bg-white transition-all"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1.5">Email Address</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Mail size={16} />
              </span>
              <input
                type="email"
                name="email"
                required
                placeholder="name@example.com"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-hidden focus:border-luckoptics-primary focus:bg-white transition-all"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {activeTab === 'register' && (
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1.5">Phone Number</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Phone size={16} />
                </span>
                <input
                  type="tel"
                  name="phone"
                  required
                  placeholder="9876543210"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-hidden focus:border-luckoptics-primary focus:bg-white transition-all"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1.5">Password</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Lock size={16} />
              </span>
              <input
                type="password"
                name="password"
                required
                placeholder="••••••••"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-hidden focus:border-luckoptics-primary focus:bg-white transition-all"
                value={formData.password}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={formLoading}
            className="w-full flex items-center justify-center gap-2 bg-luckoptics-primary text-white font-bold text-sm py-3.5 rounded-xl shadow-md hover:bg-luckoptics-primary/95 transition-all cursor-pointer"
          >
            {formLoading ? (
              <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
            ) : (
              <>
                <span>{activeTab === 'login' ? 'Sign In' : 'Create Account'}</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function Login() {
  return (
    <Suspense fallback={
      <div className="h-96 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-luckoptics-primary"></div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
