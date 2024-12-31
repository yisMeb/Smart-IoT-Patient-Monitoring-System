import { Check, Eye, EyeOff } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { PasswordStrengthMeter } from '../../components/public/PasswordStrengthMeter'
 
export default function Signup() {
  const [isLoading, setIsLoading] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [showError, setShowError] = useState(false)
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordMatchError, setPasswordMatchError] = useState(false)
  const [institutionName, setInstitutionName] = useState('')
  const [address, setAddress] = useState('')
  const [email, setEmail] = useState('')
  const [allFieldsFilled, setAllFieldsFilled] = useState(false)
  const [passwordStrong, setPasswordStrong] = useState(false)
  const [error, SetError] = useState('')
  
  const navigate = useNavigate();

  const handleSignUp = async () => {
    if (!acceptTerms) {
      setShowError(true)
      return
    }
    if (password !== confirmPassword) {
      setPasswordMatchError(true)
      return
    }
    if (!passwordStrong) {
      return
    }
    setIsLoading(true)
    
    try {
      const response = await fetch(import.meta.env.VITE_API_SIGNUP_INSTITUTE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          name: institutionName,
          address,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log(data.message);
        navigate('/login');
      } else {
        const data = await response.json();
        console.log('Response data:', data);

        const errorMessage = data.detail?.message || ' An unknown error occurred.';
         if (/already exists/.test(errorMessage)) {
              SetError(' An account with this email already exists. Please use a different email.');
          } else if (/Failed to add user/.test(errorMessage)) {
              SetError(' We encountered an issue adding your user information. Please try again.');
          } else if (/Role creation failed/.test(errorMessage)) {
              SetError(' There was a problem assigning your role. Please contact support.');
          } else if (/validation/.test(errorMessage)) {
              SetError(' Please check your input data and try again.');
          } else if (/Firebase/.test(errorMessage)) {
              SetError(' There was an issue with authentication. Please try again.');
          } else { 
              SetError(` Registration failed: ${errorMessage}`);
          }
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.message.includes('network')) {
            SetError(' Network error: Please check your internet connection.');
        } else if (error.message.includes('Firebase')) {
            SetError(' There was an issue with Firebase. Please try again later.');
        } else {
            SetError(' An unexpected error occurred. Please try again.');
        }
      } else {
          SetError(' An unknown error occurred. Please try again.');
      }
    } finally {
        setIsLoading(false);
    }
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
    setPasswordMatchError(false)
    checkAllFieldsFilled()
  }

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value)
    setPasswordMatchError(false)
    checkAllFieldsFilled()
  }

  const checkPasswordStrength = (password: string): boolean => {
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-={};':"\\|,.<>?]/.test(password); // Removed unnecessary escape character
    const hasNoSpaceOrTab = !/[ \t]/.test(password);
    const isLongEnough = password.length >= 8;
    
    return hasUppercase && hasLowercase && hasNumber && hasSpecialChar && hasNoSpaceOrTab && isLongEnough;
  };

  useEffect(() => {
    setPasswordStrong(checkPasswordStrength(password))
  }, [password])

  const checkAllFieldsFilled = () => {
    const isValidEmail = (email: string): boolean => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    };

    const allFilled = 
      institutionName.trim() !== '' &&
      address.trim() !== '' &&
      email.trim() !== '' && isValidEmail(email) &&
      password.trim() !== '' &&
      confirmPassword.trim() !== '' &&
      acceptTerms &&
      passwordStrong
    setAllFieldsFilled(allFilled)
  }

  useEffect(() => {
    checkAllFieldsFilled()
  }, [institutionName, address, email, password, confirmPassword, acceptTerms, passwordStrong])

  return (
    <div className="flex min-h-screen">
      <div className="hidden w-[400px] bg-[#0066FF] p-12 flex-col justify-between lg:flex">
        <div className="space-y-16 relative">
          <div className="flex items-start space-x-4 relative">
            <div className="rounded-md border-2 border-dashed border-white/20 p-1 z-10 bg-[#0066FF]">
              <div className="flex h-6 w-6 items-center justify-center rounded-full">
                <Check className="h-4 w-4 text-white" />
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-medium text-white">Account Type</h3>
              <p className="text-sm text-white/60">Select your account type</p>
            </div>
            <div className="absolute left-4 top-10 bottom-0 border-l-2 border-dashed border-white/20 z-0"></div>
          </div>
          
          <div className="flex items-start space-x-4 relative">
            <div className="rounded-md border-2 border-dashed border-white/20 p-1 z-10 bg-[#0066FF]">
              <div className="flex h-6 w-6 items-center justify-center rounded-full">
                <Check className="h-4 w-4 text-white" />
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-medium text-white">Account Information</h3>
              <p className="text-sm text-white/60">Setup your account information</p>
            </div>
            <div className="absolute left-4 top-10 bottom-0 border-l-2 border-dashed border-white/20 z-0"></div>
          </div>
          
          <div className="flex items-start space-x-4 relative">
            <div className="rounded-md border-2 border-dashed border-white/20 p-1 z-10 bg-[#0066FF]">
              <div className="flex h-6 w-6 items-center justify-center rounded-full">
                <Check className="h-4 w-4 text-white" />
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-medium text-white">Completed</h3>
              <p className="text-sm text-white/60">Your account is created</p>
            </div>
          </div>
        </div>
        
        <div className="mt-auto">
          <div className="flex space-x-6 text-sm text-white/60">
            <Link to="/terms" className="hover:text-white">Terms</Link>
            <Link to="/policy" className="hover:text-white">Policies</Link>
            <Link to="/contact" className="hover:text-white">Contact Us</Link>
          </div>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-[440px] space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-semibold tracking-tight">Register for an account</h1>
          </div>
          {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                  <strong className="font-bold">Error!</strong>
                  <span className="block sm:inline">{error}</span>
              </div>
          )}
          <div className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Institution Name"
                value={institutionName}
                onChange={(e) => {
                  setInstitutionName(e.target.value)
                  checkAllFieldsFilled()
                }}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-[#0066FF] focus:outline-none"
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="Address"
                value={address}
                onChange={(e) => {
                  setAddress(e.target.value)
                  checkAllFieldsFilled()
                }}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-[#0066FF] focus:outline-none"
              />
            </div>
            <div>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  checkAllFieldsFilled()
                }}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-[#0066FF] focus:outline-none"
              />
            </div>
            <div className="space-y-2">
              <div className="relative">
                <input
                  type={passwordVisible ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={handlePasswordChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-[#0066FF] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setPasswordVisible(!passwordVisible)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {passwordVisible ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              <PasswordStrengthMeter password={password} />
            </div>
            <div className="relative">
              <input
                type={confirmPasswordVisible ? "text" : "password"}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-[#0066FF] focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {confirmPasswordVisible ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
            {passwordMatchError && (
              <p className="text-red-500 text-sm">Passwords do not match.</p>
            )}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  className={`h-4 w-4 rounded border-gray-300 ${showError && !acceptTerms ? 'border-red-500' : ''}`}
                  checked={acceptTerms}
                  onChange={(e) => {
                    setAcceptTerms(e.target.checked)
                    setShowError(false)
                    checkAllFieldsFilled()
                  }}
                />
                <span className="text-gray-600">
                  I Accept the{' '}
                  <Link to="terms" className="text-[#0066FF]">
                    Terms
                  </Link>
                </span>
              </label>
              <Link to="/forgot-password" className="text-[#0066FF]">
                Forgot Password?
              </Link>
            </div>
            {showError && !acceptTerms && (
              <p className="text-red-500 text-sm">Please accept the terms to proceed.</p>
            )}

            <button 
              onClick={handleSignUp}
              disabled={isLoading || !allFieldsFilled}
              className="w-full rounded-lg bg-[#0066FF] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#0066FF]/90 disabled:opacity-50"
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5 text-white mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : 'Sign up'}
            </button>

            <p className="text-center text-sm text-gray-500">
              Already have an Account?{' '}
              <Link to="/login" className="text-[#0066FF]">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}