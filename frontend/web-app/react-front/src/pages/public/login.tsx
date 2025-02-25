import { useState, useEffect, useCallback } from "react";
import { Check, Eye, EyeOff, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { sendEmailVerification, signInWithCustomToken, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../lib/firebaseConfig";
import {
  setIdTokenCookie,
} from "../../lib/cookieUtils";
import { useUserRole } from "../../context/UserRoleContext";
import { FirebaseError } from "firebase/app";
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import Terms from "./terms"


export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [allFieldsFilled, setAllFieldsFilled] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [warningMessage, setWarningMessage] = useState("");
  const { setRoleName, setIsAuthenticated } = useUserRole();
  const [isLocked, setIsLocked] = useState(false);

  const navigate = useNavigate();
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const checkAllFieldsFilled = useCallback(() => {
    setAllFieldsFilled(
      isValidEmail(email) && password.trim() !== "" && acceptTerms
    );
  }, [email, password, acceptTerms]);

  useEffect(() => {
    const fetchLockStatus = async () => {
      if (!email) return;
      const locked = !(await checkIfLocked());
      setIsLocked(locked);
    };
  
    fetchLockStatus();
  }, [email]);

  useEffect(() => {
    checkAllFieldsFilled();
  }, [checkAllFieldsFilled]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    setWarningMessage("");
    
    if (!isValidEmail(email)) {
      setErrorMessage("Please enter a valid email address.");
      setIsLoading(false);
      return;
    }
    
    const isNotLocked = await checkIfLocked();
    if (!isNotLocked) {
      setIsLoading(false);
      return;
    }
    
    try {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const idToken = await userCredential.user.getIdToken();
        if (!idToken) {
          console.error('Failed to retrieve ID token');
          setIsLoading(false);
          return;
        }
        
        const response = await fetch(import.meta.env.VITE_API_LOGIN, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        });
        
        if (!response.ok) {
          setIsLoading(false);
          const data = await response.json();
          handleLockMessage(data.detail);
          return;
        }
        
        await fetch(`${import.meta.env.VITE_API_RESET_LOCK}/${email}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });
        
        const data = await response.json();
        const customToken = data.custom_token;
        
        await signInWithCustomToken(auth, customToken);
        
        const currentUser = auth.currentUser;
        if (currentUser) {
          const { user_id, user_role, role_specific_id } = data.user_data;
          const verificationStatus = data.verification_status;
          const mfaStatus = data.mfa_status;
          
          setIdTokenCookie(idToken, user_role, role_specific_id);
          setIsAuthenticated(true);
          setRoleName(user_role);
          
          if (!verificationStatus) {
            await sendEmailVerification(currentUser);
            navigate("/verify-email", { state: { email, user_id } });
          } else if (!mfaStatus) {
            navigate("/enable-mfa", { state: { email, user_id, user_role } });
          } else {
            navigate("/verify-mfa", {state:{email, user_id, user_role}});
          }
          
          setRole(user_role);
          console.log(role);
        } else {
          setErrorMessage("User is not signed in.");
        }
      } catch (firebaseError) {
        if (firebaseError instanceof FirebaseError) {
          const failedAttemptResponse = await fetch(`${import.meta.env.VITE_API_TRACK_LOCK}/${email}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
          });
          
          if (!failedAttemptResponse.ok) {
            const data = await failedAttemptResponse.json();
            handleLockMessage(data.detail);
          }
          
          if (firebaseError.code === 'auth/user-not-found' || firebaseError.code === 'auth/wrong-password') {
            setErrorMessage("Incorrect email or password.");
          } else if (firebaseError.code === 'auth/invalid-email') {
            setErrorMessage("Invalid email address.");
          } else if(firebaseError.code === 'auth/invalid-credential'){
            setErrorMessage("Invalid credential");
          } else {
            setErrorMessage("An authentication error occurred. Please try again.");
          }
        } else {
          console.error('Unexpected error:', firebaseError);
          setErrorMessage("An unexpected error occurred. Please try again later.");
        }
      }
    } catch (error) {
      if (error instanceof TypeError) {
        setErrorMessage("Network error. Please check your connection and try again.");
      } else {
        setErrorMessage("An unexpected error occurred. Please try again later.");
      }
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLockMessage = (detail: string) => {
    const lockTimeMatch = detail.match(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/);
    if (lockTimeMatch) {
      const lockTimeStr = lockTimeMatch[0];
      const lockTime = new Date(`${lockTimeStr} UTC`);
      const currentTime = new Date();
      
      const timeLeftMs = lockTime.getTime() - currentTime.getTime();
      
      if (timeLeftMs > 0) {
        const minutesLeft = Math.floor(timeLeftMs / 60000);
        const secondsLeft = Math.floor((timeLeftMs % 60000) / 1000);
        
        setWarningMessage(`Too many login attempts: your account is locked. Please try again in ${minutesLeft} minutes and ${secondsLeft} seconds.`);
      } else {
        setWarningMessage("Your account was locked but should be available now. Please try again.");
      }
    } else {
      setWarningMessage(detail || "Too many login attempts: your account is locked. Please try again soon.");
    }
  };

  const checkIfLocked = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_IS_LOCKED}/${email}`);
      if (!response.ok) {
        const data = await response.json();
        handleLockMessage(data.detail);
        return false;
      }
      return true;
    } catch (error) {
      console.error("Error checking lock status:", error);
      setErrorMessage("Error checking account status. Please try again.");
      return false;
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
              <h3 className="text-xl font-medium text-white">
                Account Information
              </h3>
              <p className="text-sm text-white/60">
                Setup your account information
              </p>
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
            <p style={{ fontSize: '0.8rem', textAlign: 'center' }}>
              &copy; {new Date().getFullYear()} Tena Guard. All rights reserved.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-[440px] space-y-6">
          <h1 className="text-3xl font-semibold tracking-tight text-center">
            Welcome back
          </h1>

          {warningMessage && typeof warningMessage === "string" && warningMessage.trim() !== "" && (
              <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative mb-2" role="alert">
                <h3 className="block sm:inline">{warningMessage}</h3>
              </div>
            )}
            {errorMessage && (
              <div
                className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                role="alert"
              >
                <span className="block sm:inline">{errorMessage}</span>
              </div>
            )}
          {/* form part */}
          <div>
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                handleLogin(e);
              }}
            >
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  checkAllFieldsFilled();
                }}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-[#0066FF] focus:outline-none"
                autoComplete="username"
              />
              <div className="relative">
                <input
                  type={passwordVisible ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    checkAllFieldsFilled();
                  }}
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-[#0066FF] focus:outline-none"
                  autoComplete="current-password"
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
                      setAcceptTerms(e.target.checked);
                      checkAllFieldsFilled();
                    }}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <span className="text-gray-600">
                    I Accept the{" "}
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="border-none text-[#0066FF] hover:bg-none" >Terms</Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[800px] p-0">
                        <Terms />
                      </PopoverContent>
                    </Popover>
                  </span>
                </label>
                <a href="/forgot-password" className="text-[#0066FF]">
                  Forgot Password?
                </a>
              </div>

              <button
                type="submit"
                disabled={isLoading || !allFieldsFilled || isLocked}
                className={`w-full rounded-lg bg-[#0066FF] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#0066FF]/90 ${
                  isLoading || !allFieldsFilled || isLocked
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="animate-spin h-5 w-5 mr-2" />
                    <span>Please wait...</span>
                  </div>
                ) : (
                  "Login"
                )}
              </button>
            </form>
          </div>

          <p className="text-center text-sm text-gray-500">
            Don't have an Account?{" "}
            <a href="/signup" className="text-[#0066FF]">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
