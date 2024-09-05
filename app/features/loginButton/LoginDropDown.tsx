'use client'
import { APP_IMAGES } from '@/app/app-images'
import { Chain } from '@/blockchain/types/connected-wallet'
import { WalletContext } from '@/blockchain/wallet-provider'
import { faKey } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Image from 'next/image'
import { useContext, useEffect, useState } from 'react'
import { Dropdown, DropdownButton, DropdownItem, DropdownMenu } from '../controls/Dropdown'
import InjectiveLoginDialog from './InjectiveLoginDialog'
import MultiversXLoginDialog from './MultiversXLoginDialog'

export function LoginDropDown() {
  const [mvxLoginIsOpened, setMvxLoginIsOpened] = useState(false)
  const [injectiveLoginIsOpened, setInjectiveLoginIsOpened] = useState(false)
  // const [connectedWallet, setConnectedWallet] = useState<ConnectedWallet>();
  let { connectedWallet } = useContext(WalletContext)

  useEffect(() => {
    const getConnectedWallet = async () => {
      Object.keys(Chain).map((chain: string) => {
        const wallet = localStorage.getItem(chain)
        if (wallet) connectedWallet = JSON.parse(wallet)
      })
    }

    getConnectedWallet()
  }, [])

  return (
    <>
      <Dropdown>
        <DropdownButton color="teal">
          <FontAwesomeIcon icon={faKey} />
          {connectedWallet.address ? `${connectedWallet.address.slice(0, 5)}...${connectedWallet.address.slice(-5)}` : 'Login'}
        </DropdownButton>
        <DropdownMenu>
          <DropdownItem onClick={() => setMvxLoginIsOpened(true)}>
            <Image src={APP_IMAGES.egldLogo} alt="MultiversX" width={20} height={20} className="pr-2" />
            MultiversX
          </DropdownItem>
          <DropdownItem onClick={() => setInjectiveLoginIsOpened(true)}>
            <Image src={APP_IMAGES.INGLogo} alt="MultiversX" width={20} height={20} className="pr-2" />
            Injective
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>

      <MultiversXLoginDialog isOpen={mvxLoginIsOpened} onClose={() => setMvxLoginIsOpened(false)} />
      <InjectiveLoginDialog isOpen={injectiveLoginIsOpened} onClose={() => setInjectiveLoginIsOpened(false)} />
    </>
  )
}

export default LoginDropDown
