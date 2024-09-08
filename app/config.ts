type AppEnv = 'mainnet' | 'testnet' | 'devnet' | 'local'

const Env: AppEnv = (process.env.NEXT_PUBLIC_ENV as AppEnv | null) || 'mainnet'

export const Config = {
  App: {
    Env,
    Title: 'Helios Connect',
    Description: 'Helios Connect is an open-source platform enabling cross-chain identity verification across MultiversX and Injective.',
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
