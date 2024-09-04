export enum Chain {
  Injective,
  MultiversX,
}

export type Wallet = {
  chain: Chain;
  address: string;
};
export type Persona = {
  linked_wallets: Wallet[];
};
