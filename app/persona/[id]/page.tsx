'use client'
import { useEffect, useMemo, useState } from 'react'
import SPLinkedWalletTable from './linkedwallet.table'
import { Persona } from '@/repository/types'
import { useParams } from 'next/navigation'
import { Chain, ConnectedWallet } from '@/blockchain/types/connected-wallet'
import { getChainByAddress } from '@/utils/utils'
import { PersonaService } from '@/repository/persona.service'
import { VerificationService } from '@/repository/verification.service'
import toast from 'react-hot-toast'

export default function SearchedPersona() {
  const address = useParams().id as string
  const personaService = useMemo(() => new PersonaService(), [])
  const verificationService = useMemo(() => new VerificationService(), [])
  const [persona, setPersona] = useState<Persona>({
    address: address,
    chain: Chain.Injective,
    linked_wallets: [],
  })

  useEffect(() => {
    if (!address) return
    const chain = getChainByAddress(address)
    fetchAndVerifyPersona(address, chain)
  }, [address])

  const fetchAndVerifyPersona = async (address: string, chain: Chain) => {
    try {
      const fetchedPersona = await personaService.getPersonaByWallet(address, chain)

      if (fetchedPersona) {
        const verifiedPersona = await verificationService.verifyPersonaLinkedWallets(address, fetchedPersona)

        setPersona(verifiedPersona)
        return verifiedPersona
      } else return undefined
    } catch (error) {
      toast.error(`Error fetching or verifying persona!\n${error}`)
      return undefined
    }
  }

  return (
    <div>
      <SPLinkedWalletTable persona={persona} />
    </div>
  )
}
