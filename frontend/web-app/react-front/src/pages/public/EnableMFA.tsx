import { useEffect, useState } from "react"
import { AlertCircle, CheckCircle2, Loader2, QrCode, Shield } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useLocation, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"

export default function EnableMFA() {
  const [isLoading, setIsLoading] = useState(false)
  const [qrCode, setQrCode] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [isLoadingPageData, setIsLoadingPageData] = useState(false)
  const [pageDataError, setPageDataError] = useState("")
  const [isSkippingMFASetup, setIsSkippingMFASetup] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const user_role: "institution" | "professional" | "patient" = location.state?.user_role || ""
  const email = location.state?.email || ""

  useEffect(() => {
    async function fetchDataOnLoad() {
      try {
        setIsLoadingPageData(true)
        const response = await fetch(`${import.meta.env.VITE_API_ENABLE_MFA}/${email}`, {
          method: "POST",
        })
        if (!response.ok) {
          throw new Error("Failed to fetch data")
        }
        await response.json()
      } catch (err) {
        if (err instanceof Error) {
          setPageDataError(err.message || "An unknown error occurred")
        } else {
          setPageDataError("An unknown error occurred")
        }
      } finally {
        setIsLoadingPageData(false)
      }
    }

    fetchDataOnLoad()
  }, [email])

  const handleEnableMFA = async () => {
    try {
      setIsLoading(true)
      setError("")

      const response = await fetch(`${import.meta.env.VITE_API_ENABLE_MFA}/${email}`, {
        method: "POST",
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || "Failed to enable MFA")
      }

      setQrCode(`data:image/png;base64,${data.qr_code_base64}`)
      setSuccess(true)
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("An unknown error occurred")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleSkipMFASetupWithAPIcall = async () => {
    try {
      setIsSkippingMFASetup(true)

      const response = await fetch(`${import.meta.env.VITE_API_DISABLE_MFA}/${email}`, { method: "POST" })
      if (!response.ok) {
        throw new Error("Failed to skip MFA Setup")
      }
       // Role-based navigation
       const roleRoutes = {
        institution: "/institutes/h-provider",
        professional: "/professionals/dashboard",
        patient: "/patients/dashboard",
      }

      navigate(roleRoutes[user_role] || "/")
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || "Failed To Skip Setup")
      } else {
        setError("An Unknown error Occurred")
      }
    } finally {
      setIsSkippingMFASetup(false)
    }
  }

  if (isLoadingPageData) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center space-y-4"
        >
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-lg font-medium text-muted-foreground">Loading MFA setup...</p>
        </motion.div>
      </div>
    )
  }

  if (pageDataError) {
    return (
      <div className="container flex h-[80vh] items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          <Alert variant="destructive" className="border-2">
            <AlertCircle className="h-5 w-5" />
            <AlertTitle className="text-lg font-semibold">Error Loading MFA Setup</AlertTitle>
            <AlertDescription className="mt-2 text-sm">
              {pageDataError}
              <Button variant="outline" className="mt-4 w-full" onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </AlertDescription>
          </Alert>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="flex justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="container max-w-md py-8 md:py-12"
      >
        <Card>
          <CardHeader className="space-y-1">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <CardTitle>Enable Two-Factor Authentication</CardTitle>
            </div>
            <CardDescription>Secure your account with Google Authenticator two-factor authentication</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {!qrCode ? (
              <div className="space-y-4">
                <div className="space-y-2 rounded-lg bg-muted p-4">
                  <h3 className="font-semibold">Before you begin:</h3>
                  <ul className="ml-6 list-decimal text-sm text-muted-foreground">
                    <li>Download Google Authenticator on your mobile device</li>
                    <li>Make sure you have access to your device while setting up</li>
                    <li>Keep your backup codes in a safe place</li>
                  </ul>
                </div>

                <Button className="w-full" onClick={handleEnableMFA} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enabling MFA...
                    </>
                  ) : (
                    <>
                      <QrCode className="mr-2 h-4 w-4" />
                      Generate QR Code
                    </>
                  )}
                </Button>
                <Button
                  className="w-full"
                  onClick={() => handleSkipMFASetupWithAPIcall()}
                  disabled={isSkippingMFASetup}
                  style={{ backgroundColor: "#FFA07A", color: "white" }}
                >
                  {isSkippingMFASetup ? (
                    <>
                      <Loader2 size={16} color="#fff" /> &nbsp; Skipping...
                    </>
                  ) : (
                    <>
                      <span>Skip MFA&nbsp;</span>
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {success && (
                  <Alert className="border-primary">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <AlertTitle>Success</AlertTitle>
                    <AlertDescription>MFA has been enabled successfully</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-4 rounded-lg bg-muted p-4">
                  <h3 className="font-semibold">Next steps:</h3>
                  <ol className="ml-6 list-decimal text-sm text-muted-foreground">
                    <li>Open Google Authenticator on your mobile device</li>
                    <li>Tap the + button to add a new account</li>
                    <li>Scan the QR code below</li>
                    <li>Enter the 6-digit code when signing in</li>
                  </ol>
                </div>

                <Separator className="my-4" />

                <div className="flex flex-col items-center space-y-4">
                  <div className="overflow-hidden rounded-lg border bg-white p-2">
                    <img src={qrCode || "/placeholder.svg"} alt="MFA QR Code" className="h-48 w-48 object-contain" />
                  </div>
                  <p className="text-center text-sm text-muted-foreground">
                    Scan this QR code with <span className="font-bold">Google Authenticator App</span>
                  </p>
                  <Button className="w-full" onClick={() => handleSkipMFASetupWithAPIcall()}>
                    Continue
                  </Button>
                  <Button
                    className="w-full"
                    onClick={() => handleSkipMFASetupWithAPIcall()}
                    disabled={isSkippingMFASetup}
                    style={{ backgroundColor: "#FFA07A", color: "white" }}
                  >
                    {isSkippingMFASetup ? (
                      <>
                        <Loader2 size={16} color="#fff" /> &nbsp; Skipping...
                      </>
                    ) : (
                      <>
                        <span>Skip MFA&nbsp;</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

