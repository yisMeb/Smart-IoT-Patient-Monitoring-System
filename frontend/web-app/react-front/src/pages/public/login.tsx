import { useState, useEffect, useCallback  } from 'react'
import { Check, Eye, EyeOff, Loader2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { sendEmailVerification, signInWithCustomToken } from 'firebase/auth'
import { auth } from '../../lib/firebaseConfig'
import { getIdTokenFromCookies, getRoleFromCookies, isTokenExpired, setIdTokenCookie } from "../../lib/cookieUtils";
import { useUserRole } from '../../context/UserRoleContext';

export default function Login() {
  const [isLoading, setIsLoading] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [passwordVisible, setPasswordVisible] = useState(false)
  const[role, setRole] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [allFieldsFilled, setAllFieldsFilled] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const { setRoleName, setIsAuthenticated } = useUserRole();
  const navigate = useNavigate()

  useEffect(() => {
    const handleAuthState = async () => {
      const role = getRoleFromCookies();
      const idToken = getIdTokenFromCookies();
      if (!role || !idToken || isTokenExpired(idToken)){
            console.log('ID: ', idToken," ROLE: ", role)
            auth.signOut();
            return;
      }
     const unsubscribe = auth.onAuthStateChanged(async (user) => {
        if (user) {
          setIsLoading(true);
          try {
            const response = await fetch(`${import.meta.env.VITE_API_GET_USER_DATA}/${user.email}`, {
              method: "GET",
              headers: {
                'Authorization': `Bearer ${idToken}`,
                'Content-Type': 'application/json'
              }
            });
            const data = await response.json();
            const user_role = data.user_role;

            if (user_role === "institution") {
                navigate("/institutes");
             }else if (user_role === "professionals") {
                navigate("/professionals");
             }
          } catch (error) {
            console.error("Error fetching user data: try logging in", error);
          } finally {
            setIsLoading(false);
          }
        }
      });
  
      return () => unsubscribe();
    };
  
    handleAuthState();
  }, [navigate]);


  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const checkAllFieldsFilled = useCallback(() => {
    setAllFieldsFilled(
      isValidEmail(email) &&
      password.trim() !== '' &&
      acceptTerms
    );
  }, [email, password, acceptTerms]);  

  useEffect(() => {
    checkAllFieldsFilled();
  }, [checkAllFieldsFilled]);

  const handleLogin = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    if (!isValidEmail(email)) {
        setErrorMessage('Please enter a valid email address.')
        setIsLoading(false);
        return
      }
      try {
        const response = await fetch(import.meta.env.VITE_API_LOGIN, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });
        if (!response.ok) {
          setIsLoading(false);
          if (response.status === 401) {
            setErrorMessage("Incorrect email or password.");
          } else if (response.status === 500) {
            setErrorMessage("Server error. Please try again later.");
          } else {
            const data = await response.json();
            setErrorMessage(data.message || "Failed to log in. Please try again.");
          }
        } else {

          const data = await response.json();
          const customToken = data.custom_token;
          await signInWithCustomToken(auth, customToken);

          const currentUser = auth.currentUser;
          if(currentUser){
            const idToken = await currentUser.getIdToken();
            const { user_id, user_role } = data.user_data;
            const verificationStatus = data.verification_status;
              console.log("USER ROLE FROM BACK: ", user_role)
              setIdTokenCookie(idToken, user_role);
              setRole(user_role); 
              setIsAuthenticated(true);
              setRoleName(user_role)

            if (verificationStatus) {
              
              if (role === "institution") {
                navigate("/institutes");
              }else if (role === "professionals") {
                navigate("/professionals");
              }else if(role === "admin"){
                navigate("/admin");
              }
            } else {
                await sendEmailVerification(currentUser);
                navigate("/verify-email", { state: { email, user_id } });
            }
          }else{
            setErrorMessage("User is not signed in.");
          }
        }
      } catch (error) {
        if (error instanceof TypeError) {
            setErrorMessage("Network error. Please check your connection and try again.");
        } else {
            setErrorMessage("An unexpected error occurred. Please try again later.");
        }
        console.log(error);
      }finally {
        setIsLoading(false);
      }
  }; 

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
            <a href="/terms" className="hover:text-white">Terms</a>
            <a href="/policy" className="hover:text-white">Policies</a>
            <a href="/contact" className="hover:text-white">Contact Us</a>
          </div>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-[440px] space-y-6">
          <h1 className="text-3xl font-semibold tracking-tight text-center">Welcome back</h1>

          {errorMessage && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{errorMessage}</span>
            </div>
          )}

          <div className="space-y-4">
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

            <div className="relative">
              <input
                type={passwordVisible ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  checkAllFieldsFilled()
                }}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-[#0066FF] focus:outline-none"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2"
                onClick={() => setPasswordVisible(!passwordVisible)}
              >
                {passwordVisible ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  checked={acceptTerms}
                  onChange={(e) => {
                    setAcceptTerms(e.target.checked)
                    checkAllFieldsFilled()
                  }}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <span className="text-gray-600">
                  I Accept the{' '}
                  <a href="/terms" className="text-[#0066FF]">Terms</a>
                </span>
              </label>
              <a href="/forgot-password" className="text-[#0066FF]">Forgot Password?</a>
            </div>

            <button 
              onClick={handleLogin}
              disabled={isLoading || !allFieldsFilled}
              className={`w-full rounded-lg bg-[#0066FF] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#0066FF]/90 ${isLoading || !allFieldsFilled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="animate-spin h-5 w-5 mr-2" />
                  <span>Please wait...</span>
                </div>
              ) : 'Login'}
            </button>

            <p className="text-center text-sm text-gray-500">
              Don't have an Account?{' '}
              <a href="/signup" className="text-[#0066FF]">Sign up</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}