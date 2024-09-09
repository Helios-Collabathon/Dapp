import {
  Chain,
  ChainUtils,
  ConnectedWallet,
} from "@/blockchain/types/connected-wallet";
import { Persona, Wallet } from "./types";
import { InjectiveRepository } from "./injective.repository";
import { MultiversXRepository } from "./multiversx.repository";

export class PersonaService {
  private injRepository: InjectiveRepository<Persona>;
  private mvxRepository: MultiversXRepository<Persona>;

  constructor() {
    this.injRepository = new InjectiveRepository();
    this.mvxRepository = new MultiversXRepository();
  }

  async getPersonaByWallet(address: string, chain: Chain): Promise<Persona> {
    return ChainUtils.getRepository(chain).getPersonaFromWallet(address);
  }

  async getPersonasFromLinkedWallet(wallet: Wallet): Promise<Persona[]> {
    let personas = [];
    const inj_persona =
      await this.injRepository.getPersonasFromLinkedWallet(wallet);
    const mvx_persona =
      await this.mvxRepository.getPersonasFromLinkedWallet(wallet);
    personas.push(...inj_persona, ...mvx_persona);
    return personas;
  }

  async addWallet(
    connectedWallet: ConnectedWallet,
    wallet: Wallet,
  ): Promise<{ txn: string; persona: Persona }> {
    return await ChainUtils.getRepository(connectedWallet.chain).addWallet(
      connectedWallet,
      wallet,
    );
  }

  async removeWallet(
    connectedWallet: ConnectedWallet,
    wallet: Wallet,
  ): Promise<{ txn: string; persona: Persona }> {
    return await ChainUtils.getRepository(connectedWallet.chain).removeWallet(
      connectedWallet,
      wallet,
    );
  }
}
