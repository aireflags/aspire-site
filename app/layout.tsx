import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'
import FontLinks from './components/FontLinks'

export const metadata: Metadata = {
  title: 'Brokerage Dashboard',
  description: 'Alex Brokerage Enterprise Dashboard',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-900">
        <FontLinks />
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

