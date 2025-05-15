'use client'

import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react'

export default function SessionProviderWrapper({ children, session }) {
  // El prop 'session' se pasará desde el RootLayout (Server Component)
  // para inicializar la sesión en el cliente.
  return (
    <NextAuthSessionProvider session={session}>
      {children}
    </NextAuthSessionProvider>
  )
}
