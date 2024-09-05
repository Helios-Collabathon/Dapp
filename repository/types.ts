import { Chain } from '@/blockchain/types/connected-wallet'

export type Wallet = {
  chain: Chain
  address: string
}
export type Persona = {
  linked_wallets: Wallet[]
}
