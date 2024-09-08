import PersonaSC from "@/utils/PersonaSC/PersonaSC";
import { IRepository } from "./repository.interface";
import { Persona, Wallet } from "./types";
import { ConnectedWallet } from "@/blockchain/types/connected-wallet";
import { Address, TransactionHash } from "@multiversx/sdk-core/out";

export class MultiversXRepository<T> implements IRepository<T> {
    personaSC!: PersonaSC;

    constructor() {
        this.personaSC = new PersonaSC();
    }

    async addWallet(connectedWallet: ConnectedWallet, wallet: Wallet): Promise<{ txn: string; persona: Persona; }> {
        const txHash: TransactionHash = await this.personaSC.addWallet(new Address(connectedWallet.address), wallet);
        const persona: Persona = await this.personaSC.getPersonaByWallet(connectedWallet.address);

        return { 
            txn: `https://devnet-explorer.multiversx.com/transactions/${txHash}`, 
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