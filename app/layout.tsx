import WalletContextProvider from '@/blockchain/wallet-provider'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Config } from './config'
import './globals.css'
import { BaseLayout } from './layouts/BaseLayout'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: Config.App.Title,
  description: Config.App.Description,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="light bg-white dark:bg-zinc-900 lg:bg-zinc-100 dark:lg:bg-zinc-950">
      <body className={inter.className}>
        <WalletContextProvider>
          <BaseLayout>{children}</BaseLayout>
        </WalletContextProvider>
      </body>
    </html>
  )
}
