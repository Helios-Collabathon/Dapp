import { ConnectedWallet } from "@/blockchain/types/connected-wallet";
import { IRepository } from "./repository.interface";
import { Persona, Wallet } from "./types";
import PersonaSC from "@/utils/PersonaSC/PersonaSC";
import { Address } from "@multiversx/sdk-core";

export class MultiversXRepository<T> implements IRepository<T> {
  personaSC!: PersonaSC;
  explorerEndpoint: string = process.env.NEXT_PUBLIC_MVX_EXPLORER ?? "https://explorer.multiversx.com";

  constructor() {
    this.personaSC = new PersonaSC();
  }

  async addWallet(
    connectedWallet: ConnectedWallet,
    wallet: Wallet,
  ): Promise<{ txn: string; persona: Persona }> {
    const txHash: Uint8Array = await this.personaSC.addWallet(
      new Address(connectedWallet.address),
      wallet,
    );
    const persona: Persona = await this.personaSC.getPersonaByWallet(
      connectedWallet.address,
    );

    console.log(txHash);
    console.log(Buffer.from(txHash));
    console.log(Buffer.from(txHash).toString("hex"));
    console.log(`${this.explorerEndpoint}/transactions/${txHash}`);
    return {
      txn: `${this.explorerEndpoint}/transactions/${txHash}`,
      persona,
    };
  }

  async removeWallet(
    connectedWallet: ConnectedWallet,
    wallet: Wallet,
  ): Promise<{ txn: string; persona: Persona }> {
    const txHash: Uint8Array = await this.personaSC.removeWallet(
      new Address(connectedWallet.address),
      wallet,
    );
    const persona: Persona = await this.personaSC.getPersonaByWallet(
      connectedWallet.address,
    );

    console.log(txHash);
    console.log(Buffer.from(txHash));
    console.log(Buffer.from(txHash).toString("utf-8"));
    console.log(`${this.explorerEndpoint}/transactions/${txHash}`);
    return {
      txn: `${this.explorerEndpoint}/transactions/${txHash}`,
      persona,
    };
  }

  async getPersonaFromWallet(address: string): Promise<Persona> {
    return this.personaSC.getPersonaByWallet(address);
  }

  async getPersonasFromLinkedWallet(wallet: Wallet): Promise<Persona[]> {
    return this.personaSC.getPersonasByLinkedWallet(wallet);
  }
}
