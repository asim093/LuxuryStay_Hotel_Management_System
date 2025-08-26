import React from 'react'
import Navbar from './Components/Navbar/Navbar'
import './globals.css'

export const metadata = {
  title: 'LuxuryStay Hotel Management',
  description: 'Premium hotel booking and management system',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-br from-blue-900 via-slate-900 to-purple-900">
        <Navbar />
        <main className="relative z-10">
          {children}
        </main>
      </body>
    </html>
  )
}
