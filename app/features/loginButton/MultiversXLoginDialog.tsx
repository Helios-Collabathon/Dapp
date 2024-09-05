'use client'
import { Config } from '@/app/config'
import { useExtensionLogin } from '@multiversx/sdk-dapp/hooks/login/useExtensionLogin'
import { useIframeLogin } from '@multiversx/sdk-dapp/hooks/login/useIframeLogin'
import { usePasskeyLogin } from '@multiversx/sdk-dapp/hooks/login/usePasskeyLogin'
import { useWebWalletLogin } from '@multiversx/sdk-dapp/hooks/login/useWebWalletLogin'
import { IframeLoginTypes } from '@multiversx/sdk-web-wallet-iframe-provider/out/constants'
import dynamic from 'next/dynamic'
import { useState } from 'react'
import { Button } from '../controls/Button'
import { Dialog } from '../controls/Dialog'

export type WalletProviderId = 'browser_extension' | 'webwallet' | 'iframe' | 'walletconnect' | 'ledger' | 'passkeys'

interface Props {
  isOpen: boolean
  onClose: () => void
}

const WalletConnectLoginContainer = dynamic(
  async () => (await import('@multiversx/sdk-dapp/UI/walletConnect/WalletConnectLoginContainer/index')).WalletConnectLoginContainer,
  { ssr: false }
)

const LedgerLoginContainer = dynamic(async () => (await import('@multiversx/sdk-dapp/UI/ledger/LedgerLoginContainer/index')).LedgerLoginContainer, {
  ssr: false,
})

export const MultiversXDialog = (props: Props) => {
  const [active, setActive] = useState<WalletProviderId | null>(null)

  const [initExtensionLogin] = useExtensionLogin({ nativeAuth: true })
  const [initWebWalletLogin] = useWebWalletLogin({ nativeAuth: true, callbackRoute: Config.Pages.Start })
  const [initIframeLogin] = useIframeLogin({ nativeAuth: true, walletAddress: Config.Services.MetamaskSnap() })
  const [initPasskeysLogin] = usePasskeyLogin({ nativeAuth: true })

  const handleLoginRequest = async (provider: WalletProviderId) => {
    if (provider === 'walletconnect') setActive(provider)
    if (provider === 'browser_extension') await executeAndReset(initExtensionLogin)
    if (provider === 'ledger') setActive(provider)
    if (provider === 'webwallet') executeAndReset(initWebWalletLogin)
    if (provider === 'iframe') await executeAndReset(() => initIframeLogin(IframeLoginTypes.metamask))
    if (provider === 'passkeys') await executeAndReset(initPasskeysLogin)
  }

  const executeAndReset = async (func?: () => void) => {
    onclose
    setActive(null)
    func?.()
  }

  const handleClose = () => {
    setActive(null)
    props.onClose()
  }

  return (
    <>
      {props.isOpen && (
        <Dialog open={props.isOpen} onClose={handleClose}>
          <div className="p-2 text-black dark:text-white">
            <h1 className="mb-4 text-center text-2xl font-bold">Multiversx Wallet Connection </h1>
            {active === 'walletconnect' ? (
              <WalletConnectLoginContainer
                loginButtonText="Login with xPortal"
                logoutRoute="/"
                title="xPortal Login"
                lead="Scan the QR code with xPortal"
                wrapContentInsideModal={false}
                showScamPhishingAlert={false}
                isWalletConnectV2
                nativeAuth
              />
            ) : active === 'ledger' ? (
              <LedgerLoginContainer callbackRoute="/" wrapContentInsideModal={false} showScamPhishingAlert={false} nativeAuth />
            ) : (
              <div className="flex flex-col space-y-2">
                <Button onClick={() => handleLoginRequest('passkeys')}>Passkeys</Button>
                <Button onClick={() => handleLoginRequest('browser_extension')}>Extension</Button>
                <Button onClick={() => handleLoginRequest('walletconnect')}>xPortal</Button>
                <Button onClick={() => handleLoginRequest('ledger')}>Ledger</Button>
                <Button onClick={() => handleLoginRequest('webwallet')}>Web Wallet</Button>
                <Button onClick={() => handleLoginRequest('iframe')}>MetaMask</Button>
              </div>
            )}
          </div>
        </Dialog>
      )}
    </>
  )
}

export default MultiversXDialog
