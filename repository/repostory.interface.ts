import { Persona } from './types'

export interface IRepository<T> {
  getPersonaFromWallet(address: string): Promise<Persona>
  getPersonasFromLinkedWallet(): Promise<{ data: T[] }>
}
