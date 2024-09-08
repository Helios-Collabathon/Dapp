import { ConnectedWallet } from "@/blockchain/types/connected-wallet";
import { Persona, Wallet } from "./types";

export interface IRepository<T> {
  getPersonaFromWallet(address: string): Promise<Persona>;
  getPersonasFromLinkedWallet(wallet: Wallet): Promise<Persona[]>;

  addWallet(
    connectedWallet: ConnectedWallet,
    wallet: Wallet,
  ): Promise<{ txn: string; persona: Persona }>;
}