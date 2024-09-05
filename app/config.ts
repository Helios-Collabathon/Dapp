type AppEnv = 'mainnet' | 'testnet' | 'devnet' | 'local'

const Env: AppEnv = (process.env.NEXT_PUBLIC_ENV as AppEnv | null) || 'mainnet'

export const Config = {
  App: {
    Env,
  },
  Services: {
    WalletConnect: {
      ProjectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || '',
    },
    MetamaskSnap: () => {
      if (Env === 'devnet') return 'https://devnet-snap-wallet.multiversx.com'
      if (Env === 'testnet') return 'https://testnet-snap-wallet.multiversx.com'
      return 'https://snap-wallet.multiversx.com'
    },
  },
  Pages: {
    Start: '/',
    Faq: '/faq',
  },
}
