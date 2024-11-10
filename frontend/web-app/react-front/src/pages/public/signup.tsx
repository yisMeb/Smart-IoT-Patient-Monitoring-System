import { Check, ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Signup() {
  const [accountType, setAccountType] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [showError, setShowError] = useState(false)
  
  const handleSignUp = () => {
    if (!acceptTerms) {
      setShowError(true)
      return
    }
    setIsLoading(true)
    
    setTimeout(() => setIsLoading(false), 2000)
  }

  const handleAccountTypeChange = (type: string) => {
    setAccountType(type)
    setIsDropdownOpen(false)
  }

  return (
    <div className="flex min-h-screen">
      {/* Left Side - Progress */}
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

      {/* Right Side - Form */}
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-[440px] space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-semibold tracking-tight">Sign up for an account</h1>
            <p className="text-gray-500">Your social campaigns</p>
          </div>

          <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
            <img src="/google.png" alt="Google" className="h-5 w-5" />
            Sign in with Google
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-4 text-gray-500">Or with email</span>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <input
                type="email"
                placeholder="Email"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-[#0066FF] focus:outline-none"
              />
            </div>
            
            <div>
              <input
                type="password"
                placeholder="Password"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-[#0066FF] focus:outline-none"
              />
            </div>

            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex w-full items-center justify-between rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-500"
              >
                {accountType || 'Account type'}
                <ChevronDown className="h-4 w-4" />
              </button>
              {isDropdownOpen && (
                <div className="absolute mt-1 w-full rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
                  <button
                    onClick={() => handleAccountTypeChange('Healthcare Professional')}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50"
                  >
                    Healthcare Professional
                  </button>
                  <button
                    onClick={() => handleAccountTypeChange('Healthcare Provider')}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50"
                  >
                    Healthcare Provider
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  className={`h-4 w-4 rounded border-gray-300 ${showError && !acceptTerms ? 'border-red-500' : ''}`}
                  checked={acceptTerms}
                  onChange={(e) => {
                    setAcceptTerms(e.target.checked)
                    setShowError(false)
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
              disabled={isLoading}
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
              <Link to="/signin" className="text-[#0066FF]">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
