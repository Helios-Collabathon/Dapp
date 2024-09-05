export enum WalletProdiver {
  Keplr,
  Leap,
  Ninji,
  Metamask,
  XAlliance,
}

export enum Chain {
  INJ = "injective",
  MVX = "multivers_x",
}

export type ConnectedWallet = {
  address: string;
  provider: WalletProdiver;
  chain: Chain;
};
