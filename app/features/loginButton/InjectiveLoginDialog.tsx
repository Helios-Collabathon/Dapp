'use client'

import React from 'react'
import { Button } from '../controls/Button'
import { Dialog } from '../controls/Dialog'
import { wallets } from '@/blockchain/injective/wallets'
import Image from 'next/image'
import { useWallet } from '@/blockchain/injective/wallet-provider'
import { Wallet } from '@injectivelabs/wallet-ts'

interface InjectiveLoginDialogProps {
  isOpen: boolean
  onClose: () => void
}

export const InjectiveLoginDialog = ({ isOpen, onClose }: InjectiveLoginDialogProps) => {
  const wallet = useWallet()
  const handleWalletClick = async (walletValue: Wallet) => {
    try {
      await wallet.connectWallet(walletValue)
      onClose() // Close the dialog after successful connection
    } catch (error) {
      console.error('Error connecting wallet:', error)
    }
  }

  return (
    <>
      {isOpen && (
        <Dialog open={isOpen} onClose={onClose}>
          <div className="p-2">
            {/* Title Section */}
            <h1 className="mb-4 text-center text-2xl font-bold text-black">Injective Wallet Connection</h1>

            {/* Button Section */}
            <div className="flex justify-center space-x-2">
              {wallets.map((wlt) => (
                <Button key={wlt.name} onClick={() => handleWalletClick(wlt.value)}>
                  <Image src={wlt.icon} alt="meta-mask" width={32} height={32} />
                  {wlt.name}
                </Button>
              ))}
            </div>
          </div>
        </Dialog>
      )}
    </>
  )
}

export default InjectiveLoginDialog
