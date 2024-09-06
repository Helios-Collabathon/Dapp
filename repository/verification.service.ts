import { Chain } from "@/blockchain/types/connected-wallet";
import { InjectiveRepository } from "./injective.repository";
import { Persona } from "./types";

export class VerificationService {
  private injectiveRepository: InjectiveRepository<Persona>;
  //   private multiversxRepository: InjectiveRepository<Persona>;

  constructor() {
    this.injectiveRepository = new InjectiveRepository();
    //todo: multiversX
  }

  async verifyPersonaLinkedWallets(
    address: string,
    persona: Persona,
  ): Promise<Persona> {
    for (const wallet of persona.linked_wallets) {
      switch (wallet.chain) {
        case Chain.INJ: {
          const prsn = await this.injectiveRepository.getPersonaFromWallet(
            wallet.address,
          );
          wallet.verified = prsn.linked_wallets.includes({
            address,
            chain: Chain.INJ,
          });
          break;
        }
        case Chain.MVX:
          wallet.verified = false;
          break;
      }
    }
    return persona;
  }
}
