'use client'
import { Config } from '@/app/config'
import { Wallet } from '@injectivelabs/wallet-ts'
import dynamic from 'next/dynamic'
import { createContext, useContext, useEffect, useState } from 'react'
import { getAddresses } from './injective/wallet'
import { Chain } from './types/connected-wallet'

type AppWalletProvider = string

type ContextType = {
  connectWallet: (wallet: AppWalletProvider) => Promise<void>
  disconnectWallet: () => void
  connectedWallet: { wallet?: AppWalletProvider; address?: string }
}

export const DappProvider = dynamic(async () => (await import('@multiversx/sdk-dapp/wrappers/DappProvider')).DappProvider, { ssr: false })

export const WalletContext = createContext<ContextType>({
  connectWallet: async () => {},
  disconnectWallet: () => {},
  connectedWallet: { address: '', wallet: undefined },
})

export const useWallet = () => useContext(WalletContext)

export const WalletContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [connectedWallet, setConnectedWallet] = useState<{
    address: string
    wallet?: AppWalletProvider
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

  const connectWallet = async (wallet: AppWalletProvider) => {
    const [address] = await getAddresses(wallet as Wallet)
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

  return (
    <WalletContext.Provider value={{ connectedWallet, connectWallet, disconnectWallet }}>
      <DappProvider
        environment={Config.App.Env}
        customNetworkConfig={{
          name: 'customConfig',
          apiTimeout: 30_000,
          walletConnectV2ProjectId: Config.Services.WalletConnect.ProjectId,
          metamaskSnapWalletAddress: Config.Services.MetamaskSnap(),
        }}
        dappConfig={{
          shouldUseWebViewProvider: true,
          isSSR: true,
        }}
      >
        {children}
      </DappProvider>
    </WalletContext.Provider>
  )
}

export default WalletContextProvider
