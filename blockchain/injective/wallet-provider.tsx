'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import { getAddresses } from './wallet'
import { Wallet } from '@injectivelabs/wallet-ts'
import { Chain, WalletProdiver } from '../types/connected-wallet'

type ContextType = {
  connectWallet: (wallet: Wallet) => Promise<void>
  disconnectWallet: () => void
  connectedWallet: { wallet?: Wallet; address?: string }
}

export const WalletContext = createContext<ContextType>({
  connectWallet: async () => {},
  disconnectWallet: () => {},
  connectedWallet: { address: '', wallet: undefined },
})

export const useWallet = () => useContext(WalletContext)

export const WalletContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [connectedWallet, setConnectedWallet] = useState<{
    address: string
    wallet?: Wallet
  }>({ address: '', wallet: undefined })

  useEffect(() => {
    const wallet = localStorage.getItem(Chain.INJ)
    if (wallet) {
      setConnectedWallet({
        address: JSON.parse(wallet).address,
        wallet: JSON.parse(wallet).wallet,
      })
    }
  }, [])

  const connectWallet = async (wallet: Wallet) => {
    const [address] = await getAddresses(wallet)
    setConnectedWallet({
      address: address,
      wallet: wallet,
    })
    localStorage.setItem(
      Chain.INJ,
      JSON.stringify({
        address: address,
        wallet: wallet,
        provider: wallet as unknown,
      })
    )
  }

  const disconnectWallet = () => {
    setConnectedWallet({ address: '' })
    localStorage.removeItem(Chain.INJ)
  }

  return <WalletContext.Provider value={{ connectedWallet, connectWallet, disconnectWallet }}>{children}</WalletContext.Provider>
}

export default WalletContextProvider
