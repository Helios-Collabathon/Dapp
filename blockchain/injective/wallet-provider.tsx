"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { getAddresses } from "./wallet";
import { Wallet } from "@injectivelabs/wallet-ts";
import {
  Chain,
  ConnectedWallet,
  WalletProdiver,
} from "../types/connected-wallet";

type ContextType = {
  connectWallet: (wallet: Wallet) => Promise<void>;
  disconnectWallet: () => void;
  connectedWallet?: ConnectedWallet;
};

export const WalletContext = createContext<ContextType>({
  connectWallet: async () => {},
  disconnectWallet: () => {},
  connectedWallet: {
    address: "",
    provider: WalletProdiver.Keplr,
    chain: Chain.INJ,
  },
});

export const useWallet = () => useContext(WalletContext);

export const WalletContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [connectedWallet, setConnectedWallet] = useState<ConnectedWallet>();

  useEffect(() => {
    const wallet = localStorage.getItem(Chain.INJ);
    if (wallet) {
      setConnectedWallet({
        address: JSON.parse(wallet).address,
        chain: Chain.INJ,
        provider: JSON.parse(wallet).provider,
      });
    }
  }, []);

  const connectWallet = async (wallet: Wallet) => {
    const [address] = await getAddresses(wallet);
    setConnectedWallet({
      address: address,
      provider: wallet as any,
      chain: Chain.INJ,
    });
    localStorage.setItem(
      Chain.INJ,
      JSON.stringify({
        address: address,
        wallet: wallet,
        provider: wallet as unknown,
      })
    );
  };

  const disconnectWallet = () => {
    setConnectedWallet(undefined);
    localStorage.removeItem(Chain.INJ);
  };

  return (
    <WalletContext.Provider
      value={{ connectedWallet, connectWallet, disconnectWallet }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export default WalletContextProvider;
