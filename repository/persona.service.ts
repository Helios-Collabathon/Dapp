import { ConnectedWallet } from "@/blockchain/types/connected-wallet";
import { IRepository } from "./repostory.interface";
import { Persona, Wallet } from "./types";

export class PersonaService {
  private repository: IRepository<Persona>;

  constructor(repository: IRepository<Persona>) {
    this.repository = repository;
  }

  async getPersonaByWallet(address: string): Promise<Persona> {
    return this.repository.getPersonaFromWallet(address);
  }

  async addWallet(
    connectedWallet: ConnectedWallet,
    wallet: Wallet,
  ): Promise<void> {
    await this.repository.addWallet(connectedWallet, wallet);
  }
}
