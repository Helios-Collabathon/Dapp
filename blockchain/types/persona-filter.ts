import { Chain } from './connected-wallet'

export type PersonaFilter = {
  chain: Chain | null
  verified: boolean | null
  query: string
}
