"use client"
import { User, X, Mail, Lock, Eye, EyeOff, UserPlus, Camera, CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../../context/AuthContext";

const SignupModal = ({ isOpen, onClose, onLoginClick }) => {
  const { signupStart, signupSuccess, signupFailure, loading, loadingMessage, loadingProgress } = useAuth();
  const [isClient, setIsClient] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    reset,
    watch,
    clearErrors,
    setError
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      profileImage: null
    },
    mode: 'onChange'
  });

  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Set client flag on mount
  useEffect(() => {
    setIsClient(true);
  }, []);

  const password = watch('password');
  const email = watch('email');
  const name = watch('name');
  const profileImage = watch('profileImage');

  const onSubmit = async (data) => {
    try {
      setApiError('');
      clearErrors();

      // Validate profile image
      if (!data.profileImage || !data.profileImage[0]) {
        setError('profileImage', { message: 'Profile image is required' });
        return;
      }

      signupStart('Creating your account...');

      // Create FormData for file upload
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('email', data.email);
      formData.append('password', data.password);
      formData.append('profileImage', data.profileImage[0]);

      const response = await fetch('http://localhost:3001/api/user/signup', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (response.ok) {
        console.log('Signup successful:', result);
        // Automatically log in the user after successful signup
        signupSuccess(result);
        setTimeout(() => {
          handleCloseModal();
        }, 1000);
      } else {
        if (result.message) {
          if (result.message.includes('already exists') || result.message.includes('email')) {
            setApiError('Email already exists. Please use a different email.');
          } else {
            setApiError(result.message);
          }
        } else {
          setApiError('Signup failed. Please try again.');
        }
        signupFailure(setApiError);
      }
    } catch (error) {
      console.error('Signup error:', error);
      const errorMessage = 'Network error. Please try again.';
      setApiError(errorMessage);
      signupFailure(errorMessage);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setApiError('Image size should be less than 5MB');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setApiError('Please select a valid image file');
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
      setApiError('');
    }
  };

  const handleCloseModal = () => {
    reset();
    setShowPassword(false);
    setApiError('');
    setImagePreview(null);
    setUploadProgress(0);
    clearErrors();
    onClose();
  };

  const handleLoginClick = () => {
    handleCloseModal();
    onLoginClick();
  };

  const getPasswordStrength = () => {
    if (!password) return { score: 0, label: '', color: '' };
    
    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 2) return { score, label: 'Weak', color: 'text-red-500' };
    if (score <= 4) return { score, label: 'Fair', color: 'text-yellow-500' };
    return { score, label: 'Strong', color: 'text-green-500' };
  };

  const passwordStrength = getPasswordStrength();

  if (!isClient || !isOpen) return null;

  return (
    <dialog className="modal modal-open">
      <div className="modal-box max-w-md">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
              <UserPlus size={20} className="text-white" />
            </div>
            <h3 className="font-bold text-2xl bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Create Account
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
          Join us and start your luxury travel journey today
        </p>

        {/* Form */}
        <div className="space-y-5">
          {/* API Error */}
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

          {/* Profile Image Upload */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium flex items-center">
                <Camera size={16} className="mr-2 text-blue-600" />
                Profile Image <span className="text-red-500 ml-1">*</span>
              </span>
            </label>
            <div className="flex flex-col items-center space-y-4">
              {/* Image Preview */}
              <div className="avatar">
                <div className="w-24 h-24 rounded-full ring-4 ring-blue-200 ring-offset-2 hover:ring-blue-300 transition-all duration-200">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="rounded-full object-cover w-full h-full" />
                  ) : (
                    <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center w-full h-full">
                      <User size={40} className="text-blue-400" />
                    </div>
                  )}
                </div>
              </div>
              
              {/* File Input */}
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  className="file-input file-input-bordered file-input-sm w-full max-w-xs hover:file-input-primary transition-all duration-200"
                  {...register('profileImage', {
                    onChange: handleImageChange
                  })}
                  disabled={isSubmitting}
                />
                <div className="absolute -bottom-6 left-0 text-xs text-gray-500">
                  Max 5MB • JPG, PNG, GIF
                </div>
              </div>
              {errors.profileImage && (
                <label className="label">
                  <span className="label-text-alt text-error flex items-center">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.profileImage.message}
                  </span>
                </label>
              )}
            </div>
          </div>

          {/* Name Field */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium flex items-center">
                <User size={16} className="mr-2 text-blue-600" />
                Full Name
              </span>
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Enter your full name"
                className={`input input-bordered w-full pl-10 transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.name ? 'input-error' : 'hover:border-blue-300'
                }`}
                {...register('name', {
                  required: 'Name is required',
                  minLength: {
                    value: 2,
                    message: 'Name must be at least 2 characters'
                  },
                  maxLength: {
                    value: 50,
                    message: 'Name must be less than 50 characters'
                  }
                })}
                disabled={isSubmitting}
              />
              <User size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            {errors.name && (
              <label className="label">
                <span className="label-text-alt text-error flex items-center">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.name.message}
                </span>
              </label>
            )}
          </div>

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
                placeholder="Create a password"
                className={`input input-bordered w-full pl-10 pr-12 transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.password ? 'input-error' : 'hover:border-blue-300'
                }`}
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
            
            {/* Password Strength Indicator */}
            {password && (
              <div className="mt-2">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-gray-600">Password strength:</span>
                  <span className={passwordStrength.color}>{passwordStrength.label}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      passwordStrength.score <= 2 ? 'bg-red-500' : 
                      passwordStrength.score <= 4 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${(passwordStrength.score / 6) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}

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
            
            <label className="label">
              <span className="label-text-alt text-base-content/60 flex items-center">
                <CheckCircle size={12} className="mr-1" />
                Must contain uppercase, lowercase & number
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="button"
            onClick={handleSubmit(onSubmit)}
            className={`btn btn-primary w-full h-12 text-base font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 ${
              loading ? 'loading' : ''
            } ${!isValid ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={loading || !isValid}
          >
            {loading ? (
              <div className="flex flex-col items-center space-y-2">
                <div className="loading loading-spinner loading-sm"></div>
                <span>{loadingMessage}</span>
                {loadingProgress > 0 && (
                  <div className="w-full bg-white/20 rounded-full h-1">
                    <div 
                      className="bg-white h-1 rounded-full transition-all duration-300"
                      style={{ width: `${loadingProgress}%` }}
                    ></div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <UserPlus size={18} />
                <span>Create Account</span>
              </div>
            )}
          </button>

          {/* Login Link */}
          <div className="divider text-gray-400">or</div>
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <button
                type="button"
                className="link link-primary font-semibold hover:text-blue-700 transition-colors duration-200"
                onClick={handleLoginClick}
                disabled={isSubmitting}
              >
                Sign In
              </button>
            </p>
          </div>
        </div>
      </div>
    </dialog>
  );
};

export default SignupModal;