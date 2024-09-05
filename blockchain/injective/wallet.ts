import { Wallet, WalletStrategy } from "@injectivelabs/wallet-ts";

import { ChainId, EthereumChainId } from "@injectivelabs/ts-types";
import { Web3Exception } from "@injectivelabs/exceptions";
import { getInjectiveAddress } from "@injectivelabs/sdk-ts";
// import { useSDK } from "@metamask/sdk-react";

export const walletStrategy = new WalletStrategy({
  chainId: ChainId.Testnet,
  ethereumOptions: {
    ethereumChainId: EthereumChainId.Mainnet,
  },
});

export const getAddresses = async (wallet: Wallet) => {
  walletStrategy.setWallet(wallet);
  const addresses = await walletStrategy.getAddresses();

  if (addresses.length === 0) {
    throw new Web3Exception(
      new Error("There are no addresses linked to this wallet.")
    );
  }

  return wallet === Wallet.Metamask
    ? addresses.map((addr: string) => getInjectiveAddress(addr))
    : addresses;
};
