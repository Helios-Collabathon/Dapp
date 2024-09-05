'use client'

import { Button } from '../controls/Button'
import { Dialog } from '../controls/Dialog'

enum WalletProviderId {
  Xalias = 'xalias',
  Extension = 'extension',
  WebWallet = 'webwallet',
  Iframe = 'iframe',
  Passkeys = 'passkeys',
}

interface MultiversXDialogProps {
  isOpen: boolean
  onClose: () => void
}

export const MultiversXDialog = ({ isOpen, onClose }: MultiversXDialogProps) => {
  return (
    <>
      {isOpen && (
        <Dialog open={isOpen} onClose={onClose}>
          <div className="p-2">
            <h1 className="mb-4 text-center text-2xl font-bold">Multiversx Wallet Connection </h1>

            <div className="flex justify-center space-x-2">
              <Button onClick={() => onClose()}>XAlias</Button>
              <Button onClick={() => onClose()}>XPortal</Button>
              <Button onClick={() => onClose()}>Ledger</Button>
              <Button onClick={() => onClose()}>Web Wallet</Button>
              <Button onClick={() => onClose()}>MetaMask</Button>
            </div>
          </div>
        </Dialog>
      )}
    </>
  )
}

export default MultiversXDialog
