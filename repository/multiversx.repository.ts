import { ConnectedWallet } from "@/blockchain/types/connected-wallet";
import { IRepository } from "./repository.interface";
import { Persona, Wallet } from "./types";

export class MultiversXRepository<T> implements IRepository<T> {
  removeWallet(
    connectedWallet: ConnectedWallet,
    wallet: Wallet,
  ): Promise<{ txn: string; persona: Persona }> {
    throw new Error("Method not implemented.");
  }
  getPersonaFromWallet(address: string): Promise<Persona> {
    throw new Error("Method not implemented.");
  }
  getPersonasFromLinkedWallet(wallet: Wallet): Promise<Persona[]> {
    throw new Error("Method not implemented.");
  }
  addWallet(
    connectedWallet: ConnectedWallet,
    wallet: Wallet,
  ): Promise<{ txn: string; persona: Persona }> {
    throw new Error("Method not implemented.");
  }
}
