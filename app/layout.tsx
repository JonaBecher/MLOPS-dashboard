"use client"

import { Inter } from 'next/font/google'
import '../styles/globals.css'
import type { AppProps } from "next/app"
import { QueryClient, QueryClientProvider } from "react-query"

const inter = Inter({ subsets: ['latin'] })

const queryClient = new QueryClient()

export default function RootLayout({ children }: React.PropsWithChildren) {
  return (
      <html lang="en">
      <body className={inter.className}>
      <QueryClientProvider client={queryClient}>
          {children}
      </QueryClientProvider>
      </body>
      </html>
  )
}