import React from 'react'
import Navbar from './Components/Navbar/Navbar'
import Footer from './Components/Footer/Footer'
import './globals.css'
import { AuthProvider } from './context/AuthContext'
import LoadingOverlay from './Components/LoadingOverlay/LoadingOverlay'
import { Suspense } from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export const metadata = {
  title: 'LuxuryStay Hotel Management',
  description: 'Premium hotel booking and management system',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-gradient-to-br from-blue-900 via-slate-900 to-purple-900" suppressHydrationWarning>
        <AuthProvider>
          <LoadingOverlay />
          <Navbar />
          <main className="relative z-10">
            <Suspense fallback={
              <div className="flex items-center justify-center min-h-screen">
                <div className="loading loading-spinner loading-lg text-white"></div>
              </div>
            }>
              {children}
            </Suspense>
          </main>
          <Footer />
          <ToastContainer
            position="top-right"
            autoClose={4000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
          />
        </AuthProvider>
      </body>
    </html>
  )
}
