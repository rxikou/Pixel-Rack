import { createContext, useContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { authClient } from '../api/authClient'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    authClient
      .getSession()
      .then(({ data }) => {
        if (isMounted) setUser(data?.session?.user ?? null)
      })
      .catch(() => {
        if (isMounted) setUser(null)
      })
      .finally(() => {
        if (isMounted) setIsLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [])

  async function signUp(email, password, name) {
    const { data, error } = await authClient.signUp.email({
      email,
      password,
      name,
    })
    if (error) throw new Error(error.message)
    setUser(data.user)
    return data.user
  }

  async function signIn(email, password) {
    const { data, error } = await authClient.signIn.email({ email, password })
    if (error) throw new Error(error.message)
    setUser(data.user)
    return data.user
  }

  async function signOut() {
    await authClient.signOut()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
