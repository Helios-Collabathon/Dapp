import { Chain } from "@/blockchain/types/connected-wallet";
import { IRepository } from "./repository.interface";

export type Wallet = {
  chain?: Chain;
  address?: string;
  verified?: boolean;
};
export type Persona = {
  address: string;
  chain: Chain;
  linked_wallets: Wallet[];
};
