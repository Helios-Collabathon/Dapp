import { Chain } from '@/blockchain/types/connected-wallet'
import { InjectiveRepository } from './injective.repository'
import { Persona } from './types'
import { MultiversXRepository } from './multiversx.repository'

export class VerificationService {
  private injectiveRepository: InjectiveRepository<Persona>
  private multiversxRepository: MultiversXRepository<Persona>

  constructor() {
    this.injectiveRepository = new InjectiveRepository()
    this.multiversxRepository = new MultiversXRepository()
  }

  async verifyPersonaLinkedWallets(address: string, persona: Persona): Promise<Persona> {
    for (const wallet of persona.linked_wallets) {
      let prsn
      switch (wallet.chain) {
        case Chain.Injective: {
          prsn = await this.injectiveRepository.getPersonaFromWallet(wallet.address!)
          break
        }
        case Chain.MultiversX:
          prsn = await this.multiversxRepository.getPersonaFromWallet(wallet.address!)
          break
      }

      wallet.verified = prsn?.linked_wallets.find((x) => x.address === persona.address) !== undefined
    }

    return persona
  }
}
