import Image from 'next/image'
import BackgroundImage from '../../images/helios-lightning.jpg'

export function HeroSection() {
  return (
    <div className="relative overflow-hidden rounded-2xl dark:shadow-xl">
      <div className="absolute inset-0">
        <Image className="h-full w-full object-cover mix-blend-multiply" src={BackgroundImage} alt="" />
        <div className="absolute inset-0 block bg-gradient-to-r from-zinc-900/90 to-zinc-800/90 mix-blend-multiply dark:hidden" />
      </div>
      <div className="relative px-6 py-16 sm:py-24 lg:px-8 lg:py-32">
        <h1 className="text-center text-4xl font-bold tracking-tight text-white dark:text-white sm:text-5xl md:text-6xl lg:text-7xl">
          Connecting <span className="bg-gradient-to-br from-brand-purple to-brand-skyblue bg-clip-text text-transparent">Cross-Chain</span>
          <br />
          Communities
        </h1>
        <p className="mx-auto mt-6 max-w-lg text-center text-2xl text-gray-700 text-white dark:text-gray-100 sm:max-w-3xl">
          Unify your cross-chain wallets under a single, decentralized persona.
        </p>
        <div className="mx-auto mt-10 flex justify-center">
          {/* <Button href="#TODO" color="primary">
            <span className="text-base">Register now</span>
          </Button> */}
        </div>
      </div>
    </div>
  )
}
