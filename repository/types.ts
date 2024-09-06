import { Chain } from "@/blockchain/types/connected-wallet";

export type Wallet = {
  chain?: Chain;
  address?: string;
  verified?: boolean;
};
export type Persona = {
  addr: string;
  chain: Chain;
  linked_wallets: Wallet[];
};
