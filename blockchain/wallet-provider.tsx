'use client'
import dynamic from 'next/dynamic'
import * as React from 'react'
import { createContext, useContext, useEffect, useState } from 'react'
import { Config } from '../app/config'

type AppWalletProvider = string

type ContextType = {
  connectWallet: (wallet: AppWalletProvider, address: string) => Promise<void>
  disconnectWallet: () => void
  connectedWallet: { wallet?: AppWalletProvider; address?: string }
}

const WalletStorageKey = 'connected-wallet'

export const DappProvider = dynamic(async () => (await import('@multiversx/sdk-dapp/wrappers/DappProvider')).DappProvider, { ssr: false })

export const WalletContext = createContext<ContextType>({
  connectWallet: async () => {},
  disconnectWallet: () => {},
  connectedWallet: { address: '', wallet: undefined },
})

export const useWallet = () => useContext(WalletContext)

export const WalletContextProvider = ({ children }: { children: React.ReactNode }) => {
  const env = Config.App.Env === 'local' ? 'devnet' : Config.App.Env

  const [connectedWallet, setConnectedWallet] = useState<{
    address: string
    wallet?: AppWalletProvider
  }>({ address: '', wallet: undefined })

  useEffect(() => {
    const wallet = localStorage.getItem(WalletStorageKey)
    if (wallet) {
      setConnectedWallet({
        address: JSON.parse(wallet).address,
        wallet: JSON.parse(wallet).wallet,
      })
    }
  }, [])

  const connectWallet = async (wallet: AppWalletProvider, address: string) => {
    setConnectedWallet({ address, wallet })
    localStorage.setItem(
      WalletStorageKey,
      JSON.stringify({
        address: address,
        wallet: wallet,
        provider: wallet as unknown,
      })
    )
  }

  const disconnectWallet = () => {
    setConnectedWallet({ address: '' })
    localStorage.removeItem(WalletStorageKey)
  }

  return (
    <WalletContext.Provider value={{ connectedWallet, connectWallet, disconnectWallet }}>
      <DappProvider
        environment={env}
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
