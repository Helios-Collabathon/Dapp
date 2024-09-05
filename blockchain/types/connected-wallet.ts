export enum WalletProdiver {
  Keplr,
  Leap,
  Ninji,
  Metamask,
  XAlliance,
}

export enum Chain {
  INJ = "INJ",
  MVX = "MMVX",
}

export type ConnectedWallet = {
  address: string;
  provider: WalletProdiver;
  chain: Chain;
};
