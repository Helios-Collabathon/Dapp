import Image from 'next/image'
import BackgroundImage from '../../images/helios-lightning.jpg'
import { Button } from '../controls/Button'

export function HeroSection() {
  return (
    <div className="relative overflow-hidden rounded-2xl shadow-xl">
      <div className="absolute inset-0">
        <Image className="h-full w-full object-cover mix-blend-overlay" src={BackgroundImage} alt="" />
        <div className="from-primary-900 to-primary-800 absolute inset-0 bg-gradient-to-r mix-blend-multiply" />
      </div>
      <div className="relative px-6 py-16 sm:py-24 lg:px-8 lg:py-32">
        <h1 className="text-center text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
          <span className="block text-white">Connecting Cross-Chain</span>
          <span className="block text-white">Communities</span>
        </h1>
        <p className="mx-auto mt-6 max-w-lg text-center text-2xl text-white sm:max-w-3xl">
          Unify your cross-chain wallets under a single, decentralized persona
        </p>
        <div className="mx-auto mt-10 flex justify-center">
          <Button href="#TODO" color="primary">
            <span className="text-base">Register now</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
