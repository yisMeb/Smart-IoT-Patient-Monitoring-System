import { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { Shield, Loader2 } from 'lucide-react'
import { toast, Toaster } from 'sonner'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function VerifyMFA() {
  const location = useLocation()
  const email = location.state?.email || ""
  const user_role: "institution" | "professional" | "patient" = location.state?.user_role || ""
  const [code, setCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleVerifyMFA = async () => {
    if (code.length !== 6 || !/^\d+$/.test(code)) {
      toast.error("Please enter a valid 6-digit code")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(`${import.meta.env.VITE_API_VERIFY_MFA}/${email}/${code}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })

      if (response.ok) {
        toast.success("Verification successful", {
          description: "Redirecting to dashboard..."
        })

        // Role-based navigation
        const roleRoutes = {
          institution: "/institutes/h-provider",
          professional: "/professionals/dashboard",
          patient: "/patients/dashboard",
        }

        navigate(roleRoutes[user_role] || "/")
      } else {
        throw new Error("Invalid verification code")
      }
    } catch {
      toast.error("Verification failed", {
        description: "Invalid verification code. Please try again.",
        action: {
          label: "Try again",
          onClick: () => setCode("")
        }
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLoading) {
      handleVerifyMFA()
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4">
      <Toaster position="top-center" expand={true} richColors />
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-2">
            <Shield className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-2xl text-center">Two-Factor Authentication</CardTitle>
          <CardDescription className="text-center">
            Enter the 6-digit code from your authenticator app
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Input
              type="text"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ""))}
              placeholder="000000"
              onKeyPress={handleKeyPress}
              className="text-center text-lg tracking-[0.5em] font-mono"
              disabled={isLoading}
            />
          </div>
          <Button 
            className="w-full" 
            onClick={handleVerifyMFA}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying
              </>
            ) : (
              "Verify Code"
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}