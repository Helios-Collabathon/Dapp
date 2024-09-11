import { ConnectedWallet } from "@/blockchain/types/connected-wallet";
import { IRepository } from "./repository.interface";
import { Persona, Wallet } from "./types";
import PersonaSC from "@/utils/PersonaSC/PersonaSC";
import { Address } from "@multiversx/sdk-core";
import axios from "axios";
export class MultiversXRepository<T> implements IRepository<T> {
  personaSC!: PersonaSC;
  explorerEndpoint: string =
    process.env.NEXT_PUBLIC_MVX_EXPLORER ?? "https://explorer.multiversx.com";
  apiEndpoint: string =
    process.env.NEXT_PUBLIC_MVX_ENDPOINT ?? "https://api.multiversx.com";
  constructor() {
    this.personaSC = new PersonaSC();
  }

  async getBalance(address: string): Promise<number> {
    const acc_resp = await axios.get(`${this.apiEndpoint}/accounts/${address}`);

    const acc = acc_resp.data;
    return Number((parseInt(acc.balance) / Math.pow(10, 18)).toFixed(3));
  }

  async addWallet(
    connectedWallet: ConnectedWallet,
    wallet: Wallet,
  ): Promise<{ txn: string; persona: Persona }> {
    try {
      new Address(wallet.address!);
    } catch (error) {
      console.error(error);
      throw new Error("Invalid wallet address");
    }

    const txHash: Uint8Array = await this.personaSC.addWallet(
      new Address(connectedWallet.address),
      wallet,
    );
    const persona: Persona = await this.personaSC.getPersonaByWallet(
      connectedWallet.address,
    );

    return {
      txn: `${txHash}`,
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

    return {
      txn: `${txHash}`,
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
