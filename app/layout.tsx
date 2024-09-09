import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { BaseLayout } from './layouts/BaseLayout'
import { Toaster } from 'react-hot-toast'
import WalletContextProvider from '@/blockchain/wallet-provider'
import { Config } from './config'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: Config.App.Title,
  description: Config.App.Description,
  metadataBase: new URL('https://www.heliosconnect.net/'),
  alternates: {
    canonical: 'https://www.heliosconnect.net',
    languages: {
      'en-US': '/en-US',
    },
  },
  icons: '/heliosconnect.png',
  openGraph: {
    images: '/heliosconnect.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark bg-white dark:bg-zinc-900 lg:bg-zinc-100 dark:lg:bg-zinc-950">
      <body className={inter.className}>
        <WalletContextProvider>
          <Toaster position="top-right" />
          <BaseLayout>{children}</BaseLayout>
        </WalletContextProvider>
      </body>
    </html>
  )
}
