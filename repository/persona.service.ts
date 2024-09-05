import { IRepository } from './repostory.interface'
import { Persona } from './types'

export class PersonaService {
  private repository: IRepository<Persona>

  constructor(repository: IRepository<Persona>) {
    this.repository = repository
  }

  async getPersonaByWallet(address: string): Promise<Persona> {
    return this.repository.getPersonaFromWallet(address)
  }
}
