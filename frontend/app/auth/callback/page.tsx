"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2 } from "lucide-react"

export default function AuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState("")

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get tokens from URL parameters
        const accessToken = searchParams.get('access_token')
        const refreshToken = searchParams.get('refresh_token')

        if (!accessToken || !refreshToken) {
          setError("Authentication failed. No tokens received.")
          setTimeout(() => router.push("/auth/login"), 2000)
          return
        }

        // Store tokens in localStorage
        localStorage.setItem("access_token", accessToken)
        localStorage.setItem("refresh_token", refreshToken)

        // Redirect to dashboard
        router.push("/dashboard")
      } catch (err) {
        console.error("Callback error:", err)
        setError("An error occurred during authentication.")
        setTimeout(() => router.push("/auth/login"), 2000)
      }
    }

    handleCallback()
  }, [searchParams, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="text-center">
        {error ? (
          <div>
            <p className="text-destructive text-lg mb-4">{error}</p>
            <p className="text-muted-foreground">Redirecting to login...</p>
          </div>
        ) : (
          <div>
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-lg font-medium">Completing sign in...</p>
            <p className="text-muted-foreground mt-2">Please wait while we authenticate you</p>
          </div>
        )}
      </div>
    </div>
  )
}
