"use client"
import { useState, useEffect } from 'react';
import { X, Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useForm } from 'react-hook-form';

const ForgotPasswordModal = ({ isOpen, onClose, onBackToLogin }) => {
  const [isClient, setIsClient] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    clearErrors
  } = useForm({
    defaultValues: {
      email: '',
      otp: '',
      password: '',
      confirmPassword: ''
    }
  });

  const [currentStep, setCurrentStep] = useState('email'); // email, otp, reset
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [apiError, setApiError] = useState('');
  const [apiSuccess, setApiSuccess] = useState('');
  const [email, setEmail] = useState('');

  // Set client flag on mount
  useEffect(() => {
    setIsClient(true);
  }, []);

  const password = watch('password');

  const handleSendOTP = async (data) => {
    try {
      setApiError('');
      setApiSuccess('');
      clearErrors();

      const response = await fetch('http://localhost:3001/api/user/forgotpassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: data.email })
      });

      const result = await response.json();

      if (response.ok) {
        setEmail(data.email);
        setApiSuccess('OTP sent successfully! Check your email.');
        setTimeout(() => {
          setCurrentStep('otp');
          setApiSuccess('');
        }, 1500);
      } else {
        setApiError(result.message || 'Failed to send OTP. Please try again.');
      }
    } catch (error) {
      console.error('Send OTP error:', error);
      setApiError('Network error. Please try again.');
    }
  };

  const handleVerifyOTP = async (data) => {
    try {
      setApiError('');
      setApiSuccess('');
      clearErrors();

      const response = await fetch('http://localhost:3001/api/user/verifyotp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          email: email, 
          otp: data.otp 
        })
      });

      const result = await response.json();

      if (response.ok) {
        setApiSuccess('OTP verified successfully!');
        setTimeout(() => {
          setCurrentStep('reset');
          setApiSuccess('');
        }, 1500);
      } else {
        setApiError(result.message || 'Invalid OTP. Please try again.');
      }
    } catch (error) {
      console.error('Verify OTP error:', error);
      setApiError('Network error. Please try again.');
    }
  };

  const handleResetPassword = async (data) => {
    try {
      setApiError('');
      setApiSuccess('');
      clearErrors();

      const response = await fetch('http://localhost:3001/api/user/resetpassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          email: email, 
          password: data.password 
        })
      });

      const result = await response.json();

      if (response.ok) {
        setApiSuccess('Password reset successfully!');
        setTimeout(() => {
          handleCloseModal();
          onBackToLogin();
        }, 2000);
      } else {
        setApiError(result.message || 'Failed to reset password. Please try again.');
      }
    } catch (error) {
      console.error('Reset password error:', error);
      setApiError('Network error. Please try again.');
    }
  };

  const handleCloseModal = () => {
    reset();
    setCurrentStep('email');
    setShowPassword(false);
    setShowConfirmPassword(false);
    setApiError('');
    setApiSuccess('');
    setEmail('');
    clearErrors();
    onClose();
  };

  const handleBackToLogin = () => {
    handleCloseModal();
    onBackToLogin();
  };

  const goBack = () => {
    if (currentStep === 'otp') {
      setCurrentStep('email');
      setApiError('');
      setApiSuccess('');
    } else if (currentStep === 'reset') {
      setCurrentStep('otp');
      setApiError('');
      setApiSuccess('');
    }
  };

  if (!isClient || !isOpen) return null;

  return (
    <dialog className="modal modal-open">
      <div className="modal-box max-w-md">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            {currentStep !== 'email' && (
              <button
                type="button"
                onClick={goBack}
                className="btn btn-sm btn-circle btn-ghost"
                disabled={isSubmitting}
              >
                <ArrowLeft size={16} />
              </button>
            )}
            <h3 className="font-bold text-2xl">
              {currentStep === 'email' && 'Forgot Password'}
              {currentStep === 'otp' && 'Verify OTP'}
              {currentStep === 'reset' && 'Reset Password'}
            </h3>
          </div>
          <button
            className="btn btn-sm btn-circle btn-ghost"
            onClick={handleCloseModal}
            disabled={isSubmitting}
          >
            <X size={20} />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-6">
          <div className="flex space-x-2">
            {['email', 'otp', 'reset'].map((step, index) => (
              <div
                key={step}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  currentStep === step
                    ? 'bg-blue-600 scale-110'
                    : ['email', 'otp', 'reset'].indexOf(currentStep) > index
                    ? 'bg-green-500'
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Success Message */}
        {apiSuccess && (
          <div className="alert alert-success mb-4">
            <span className="text-sm">{apiSuccess}</span>
          </div>
        )}

        {/* Error Message */}
        {apiError && (
          <div className="alert alert-error mb-4">
            <span className="text-sm">{apiError}</span>
          </div>
        )}

        {/* Step 1: Email Input */}
        {currentStep === 'email' && (
          <form onSubmit={handleSubmit(handleSendOTP)} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium flex items-center">
                  <Mail size={16} className="mr-2" />
                  Email Address
                </span>
              </label>
              <input
                type="email"
                placeholder="Enter your email address"
                className={`input input-bordered w-full ${errors.email ? 'input-error' : ''}`}
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Enter a valid email'
                  }
                })}
                disabled={isSubmitting}
              />
              {errors.email && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.email.message}</span>
                </label>
              )}
            </div>

            <button
              type="submit"
              className={`btn btn-primary w-full ${isSubmitting ? 'loading' : ''}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending OTP...' : 'Send OTP'}
            </button>

            <div className="text-center">
              <button
                type="button"
                className="link link-primary text-sm"
                onClick={handleBackToLogin}
                disabled={isSubmitting}
              >
                Back to Login
              </button>
            </div>
          </form>
        )}

        {/* Step 2: OTP Verification */}
        {currentStep === 'otp' && (
          <form onSubmit={handleSubmit(handleVerifyOTP)} className="space-y-4">
            <div className="text-center mb-4">
              <p className="text-sm text-gray-600">
                We've sent a 6-digit OTP to <strong>{email}</strong>
              </p>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">OTP Code</span>
              </label>
              <input
                type="text"
                placeholder="Enter 6-digit OTP"
                maxLength={6}
                className={`input input-bordered w-full text-center text-lg tracking-widest ${errors.otp ? 'input-error' : ''}`}
                {...register('otp', {
                  required: 'OTP is required',
                  pattern: {
                    value: /^\d{6}$/,
                    message: 'OTP must be 6 digits'
                  }
                })}
                disabled={isSubmitting}
              />
              {errors.otp && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.otp.message}</span>
                </label>
              )}
            </div>

            <button
              type="submit"
              className={`btn btn-primary w-full ${isSubmitting ? 'loading' : ''}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Verifying...' : 'Verify OTP'}
            </button>

            <div className="text-center">
              <button
                type="button"
                className="link link-primary text-sm"
                onClick={handleSendOTP}
                disabled={isSubmitting}
              >
                Resend OTP
              </button>
            </div>
          </form>
        )}

        {/* Step 3: Password Reset */}
        {currentStep === 'reset' && (
          <form onSubmit={handleSubmit(handleResetPassword)} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium flex items-center">
                  <Lock size={16} className="mr-2" />
                  New Password
                </span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter new password"
                  className={`input input-bordered w-full pr-12 ${errors.password ? 'input-error' : ''}`}
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters'
                    },
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                      message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
                    }
                  })}
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isSubmitting}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.password.message}</span>
                </label>
              )}
              <label className="label">
                <span className="label-text-alt text-base-content/60">
                  Must contain uppercase, lowercase & number
                </span>
              </label>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Confirm Password</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm new password"
                  className={`input input-bordered w-full pr-12 ${errors.confirmPassword ? 'input-error' : ''}`}
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: value =>
                      value === password || 'Passwords do not match'
                  })}
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isSubmitting}
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.confirmPassword.message}</span>
                </label>
              )}
            </div>

            <button
              type="submit"
              className={`btn btn-primary w-full ${isSubmitting ? 'loading' : ''}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Resetting Password...' : 'Reset Password'}
            </button>
          </form>
        )}
      </div>
    </dialog>
  );
};

export default ForgotPasswordModal;
