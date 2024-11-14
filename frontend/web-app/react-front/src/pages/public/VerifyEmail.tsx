import { auth } from "../../lib/firebaseConfig";
import { sendEmailVerification } from "firebase/auth";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Mail, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react'

const VerifyEmail = () => {
  const location = useLocation();
  const { email } = location.state || {};
  const [message, setMessage] = useState("");
  const [isResending, setIsResending] = useState(false)
  const [resendStatus, setResendStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleResendVerification = async () => {
    setIsResending(true);
    setResendStatus('idle');
    await new Promise(resolve => setTimeout(resolve, 2000))
    try {
      const currentUser = auth.currentUser;  
      if (currentUser) {
         if (currentUser.email === email) {
          await sendEmailVerification(currentUser);
          setMessage("Verification email sent! Please check your inbox.");
          setResendStatus('success');
        } else {
          setMessage("Current user does not match the provided email.");
          setResendStatus('error');
        }
      } else {
        setMessage("No user is currently signed in.");
        setResendStatus('error');
      }
    } catch (error: unknown) {
        if (error instanceof Error) {
          setMessage("Error sending verification email: " + error.message);
        } else {
            setMessage("An unknown error occurred.");
        }
        setResendStatus('error');
    }
    setIsResending(false);
    setTimeout(() => setResendStatus('idle'), 5000)
  };

  return (
    <div className="max-w-md mx-auto my-10 bg-white p-6 rounded-lg shadow-lg">
      <div className="text-2xl font-bold flex items-center gap-2 text-primary">
        <Mail className="h-6 w-6" />
        Verify Your Email
      </div>
      <p className="mt-2 text-sm text-gray-500">
        We've sent a verification link to your email address. Please check your inbox and follow the instructions to complete your registration.
      </p>

      <div className="mt-4 bg-yellow-100 text-yellow-800 p-4 rounded-md flex items-start gap-2">
        <AlertCircle className="h-4 w-4" />
        <div>
          <strong>Important</strong>
          <p>If you don't see the email in your inbox, please check your spam folder.</p>
        </div>
      </div>

      <p className="mt-4 text-sm text-gray-500">
        Verification email sent to: <span className="font-medium text-primary">{email}</span>
      </p>

      <div className="mt-6 space-y-4">
        <button 
          className={`w-full px-4 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed`}
          onClick={handleResendVerification}
          disabled={isResending}
        >
          {isResending ? (
            <div className="flex items-center justify-center">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Resending
            </div>
          ) : (
            'Resend Verification Email'
          )}
        </button>

        {resendStatus === 'success' && (
          <div className="bg-green-100 text-green-800 p-4 rounded-md flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4" />
            <div>
              <strong>Success</strong>
              <p>Verification email has been resent successfully.</p>
            </div>
          </div>
        )}
        {resendStatus === 'error' && (
          <div className="bg-red-100 text-red-800 p-4 rounded-md flex items-start gap-2">
            <AlertCircle className="h-4 w-4" />
            <div>
              <strong>Error</strong>
              <p>{message}</p>
            </div>
          </div>
        )}

        <p className="text-xs text-gray-500">
          Need help? Contact our support team at <a href="mailto:contact@healthier.com" className="text-blue-600">contact@healthier.com</a>
        </p>
      </div>
      <button className={`mt-10 w-full px-4 py-2.5 rounded-lg bg-gray-600 text-white hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed`}>
          <Link to='/login'>
            Login to your account
          </Link>
      </button>
    </div>
  );
};

export default VerifyEmail;
