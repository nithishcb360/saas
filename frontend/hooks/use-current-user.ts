"use client"

import { useState, useEffect } from "react"
import { usersAPI } from "@/lib/api"

interface User {
  email: string
  full_name: string
  company_name?: string
  is_active: boolean
  is_verified: boolean
  role: string
}

export function useCurrentUser() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("access_token")
      if (!token) {
        setLoading(false)
        return
      }

      try {
        const response = await usersAPI.getCurrentUser()
        setUser(response.data)
      } catch (err: any) {
        console.error("Failed to fetch user:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  return { user, loading, error }
}
