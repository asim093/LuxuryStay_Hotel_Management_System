"use client"
import { useState, useEffect } from 'react';
import { Menu, X, Search, User, Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import SignupModal from '../Signup/Signup';
import ForgotPasswordModal from './ForgotPasswordModal';

const LoginModal = ({ isOpen, onClose , handleSignupClick }) => {
  const { loginStart, loginSuccess, loginFailure, loading, loadingMessage, loadingProgress } = useAuth();
  const [isClient, setIsClient] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setError,
    clearErrors
  } = useForm({
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const onSubmit = async (data) => {
    try {
      setApiError('');
      clearErrors();
      loginStart('Signing in...');

      const response = await fetch('http://localhost:3001/api/user/Login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (response.ok) {
        console.log('Login successful:', result);
        loginSuccess(result);
        setTimeout(() => {
          handleCloseModal();
        }, 1000);
      } else {
        const errorMessage = result.message || 'Login failed. Try again.';
        if (result.message.includes('invalid') || result.message.includes('wrong')) {
          setApiError('Invalid email or password');
        } else {
          setApiError(result.message);
        }
        loginFailure(errorMessage);
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = 'Network error. Please try again.';
      setApiError(errorMessage);
      loginFailure(errorMessage);
    }
  };

  const handleCloseModal = () => {
    reset();
    setShowPassword(false);
    setApiError('');
    clearErrors();
    onClose();
  };

  const handleIsSignupClick = () => {
    handleCloseModal();
    handleSignupClick();
  };

  const handleForgotPasswordClick = () => {
    setShowForgotPassword(true);
  };

  const handleForgotPasswordClose = () => {
    setShowForgotPassword(false);
  };

  if (!isClient || !isOpen) return null;

  return (
    <>
      <dialog className="modal modal-open">
        <div className="modal-box max-w-md">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <LogIn size={20} className="text-white" />
              </div>
              <h3 className="font-bold text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Welcome Back
              </h3>
            </div>
            <button
              className="btn btn-sm btn-circle btn-ghost hover:bg-gray-100"
              onClick={handleCloseModal}
              disabled={isSubmitting}
            >
              <X size={20} />
            </button>
          </div>

          {/* Subtitle */}
          <p className="text-gray-600 mb-6 text-center">
            Sign in to your account to continue your journey
          </p>

          <div className="space-y-5">
            {apiError && (
              <div className="alert alert-error shadow-lg">
                <div className="flex items-center">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium">{apiError}</span>
                </div>
              </div>
            )}

            {/* Email Field */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium flex items-center">
                  <Mail size={16} className="mr-2 text-blue-600" />
                  Email Address
                </span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className={`input input-bordered w-full pl-10 transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.email ? 'input-error' : 'hover:border-blue-300'
                  }`}
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Enter a valid email'
                    }
                  })}
                  disabled={isSubmitting}
                />
                <Mail size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              {errors.email && (
                <label className="label">
                  <span className="label-text-alt text-error flex items-center">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.email.message}
                  </span>
                </label>
              )}
            </div>

            {/* Password Field */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium flex items-center">
                  <Lock size={16} className="mr-2 text-blue-600" />
                  Password
                </span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  className={`input input-bordered w-full pl-10 pr-12 transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.password ? 'input-error' : 'hover:border-blue-300'
                  }`}
                  {...register('password', {
                    required: 'Password is required'
                  })}
                  disabled={isSubmitting}
                />
                <Lock size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isSubmitting}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <label className="label">
                  <span className="label-text-alt text-error flex items-center">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.password.message}
                  </span>
                </label>
              )}
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <button
                type="button"
                className="link link-primary text-sm hover:text-blue-700 transition-colors duration-200 font-medium"
                onClick={handleForgotPasswordClick}
                disabled={isSubmitting}
              >
                Forgot Password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="button"
              onClick={handleSubmit(onSubmit)}
              className={`btn btn-primary w-full h-12 text-base font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 ${
                isSubmitting ? 'loading' : ''
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center space-x-2">
                  <div className="loading loading-spinner loading-sm"></div>
                  <span>Signing In...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <LogIn size={18} />
                  <span>Sign In</span>
                </div>
              )}
            </button>

            {/* Sign Up Link */}
            <div className="divider text-gray-400">or</div>
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <button
                  type="button"
                  className="link link-primary font-semibold hover:text-blue-700 transition-colors duration-200"
                  onClick={handleIsSignupClick}
                  disabled={isSubmitting}
                >
                  Sign Up
                </button>
              </p>
            </div>
          </div>
        </div>
      </dialog>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={showForgotPassword}
        onClose={handleForgotPasswordClose}
        onBackToLogin={() => setShowForgotPassword(false)}
      />
    </>
  );
};

export default LoginModal