"use client";
import dynamic from "next/dynamic";
import { createContext, useContext, useEffect, useState } from "react";
import { Config } from "../app/config";
import { Chain, ConnectedWallet } from "./types/connected-wallet";

type AppWalletProvider = string;

type ContextType = {
  connectWallet: (
    address: string,
    chain: Chain,
    provider: AppWalletProvider,
  ) => Promise<void>;
  disconnectWallet: () => void;
  connectedWallet: ConnectedWallet;
};

const WalletStorageKey = "connected-wallet";

const DappProvider = dynamic(async () => (await import('@multiversx/sdk-dapp/wrappers/DappProvider')).DappProvider, { ssr: false })

const SignTransactionsModals = dynamic(
  async () => (await import('@multiversx/sdk-dapp/UI/SignTransactionsModals/SignTransactionsModals')).SignTransactionsModals,
  { ssr: false }
)

const TransactionsToastList = dynamic(async () => (await import('@multiversx/sdk-dapp/UI/TransactionsToastList')).TransactionsToastList, { ssr: false })
const NotificationModal = dynamic(async () => (await import('@multiversx/sdk-dapp/UI/NotificationModal')).NotificationModal, { ssr: false })

export const WalletContext = createContext<ContextType>({
  connectWallet: async () => {},
  disconnectWallet: () => {},
  connectedWallet: {
    address: "",
    chain: Chain.Injective,
    provider: "",
  },
});

export const useWallet = () => useContext(WalletContext);

export const WalletContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const env = Config.App.Env === "local" ? "devnet" : Config.App.Env;

  const [connectedWallet, setConnectedWallet] = useState<ConnectedWallet>({
    address: "",
    chain: Chain.Injective,
    provider: "",
  });

  useEffect(() => {
    try {
      const storedWallet = localStorage.getItem(WalletStorageKey);
      if (storedWallet) {
        setConnectedWallet(JSON.parse(storedWallet));
      }
    } catch (error) {
      console.error("Failed to parse stored wallet from localStorage", error);
    }
  }, []);

  const connectWallet = async (
    address: string,
    chain: Chain,
    provider: AppWalletProvider,
  ) => {
    const wallet: ConnectedWallet = { address, chain, provider };
    setConnectedWallet(wallet);
    localStorage.setItem(WalletStorageKey, JSON.stringify(wallet));
  };

  const disconnectWallet = () => {
    setConnectedWallet({ address: "", provider: "", chain: Chain.Injective });
    localStorage.removeItem(WalletStorageKey);
  };

  return (
    <WalletContext.Provider
      value={{ connectedWallet, connectWallet, disconnectWallet }}
    >
      <DappProvider
        environment={env}
        customNetworkConfig={{
          name: "customConfig",
          apiTimeout: 30_000,
          walletConnectV2ProjectId: Config.Services.WalletConnect.ProjectId,
          metamaskSnapWalletAddress: Config.Services.MetamaskSnap(),
        }}
        dappConfig={{
          shouldUseWebViewProvider: true,
          isSSR: typeof window === "undefined", // SSR detection
        }}
      >
        {children}
        <TransactionsToastList />
        <NotificationModal />
        <SignTransactionsModals />
      </DappProvider>
    </WalletContext.Provider>
  );
};

export default WalletContextProvider;
