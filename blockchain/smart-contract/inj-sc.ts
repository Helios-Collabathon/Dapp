import { Wallet } from '@/repository/types'

export type AddWalletMsg = {
  add_wallet: {
    wallet: Wallet
  }
}

export type RemoveWalletMsg = {
  remove_wallet: {
    wallet: Wallet
  }
}
