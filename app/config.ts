type AppEnv = 'mainnet' | 'testnet' | 'devnet' | 'local'

export const Config = {
  Services: {
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

const Env: AppEnv = (process.env.NEXT_PUBLIC_ENV as AppEnv | null) || 'mainnet'
