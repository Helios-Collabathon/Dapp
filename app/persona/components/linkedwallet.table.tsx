import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../features/controls/Table'
import { Badge } from '../../features/controls/Badge'
import { Wallet, Persona } from '@/repository/types'
import { Button } from '../../features/controls/Button'
import { Dialog } from '../../features/controls/Dialog'
import Image from 'next/image'
import { useState, useCallback } from 'react'
import { Chain, ChainUtils, ConnectedWallet } from '@/blockchain/types/connected-wallet'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleXmark, faSyncAlt } from '@fortawesome/free-solid-svg-icons'
import { Strong } from '@/app/features/controls/Text'
import { Dropdown, DropdownButton, DropdownItem, DropdownMenu } from '@/app/features/controls/Dropdown'
import { Field } from '@headlessui/react'
import { Input } from '@/app/features/controls/Input'
import { PersonaFilter } from '@/blockchain/types/persona-filter'
import PersonaFilterComponent from './filter-component'
import { CompletedTransactionDialog } from './completed-transaction.dialog'

interface LinkedWalletTableProps {
  connectedWallet: ConnectedWallet
  persona: Persona | null
  txn: string
  registerWallet: (walletToAdd: Wallet) => void
  removeWallet: (walletToRemove: Wallet) => void
}

export default function LinkedWalletTable({ connectedWallet, persona, txn, registerWallet, removeWallet }: LinkedWalletTableProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [walletToAdd, setWalletToAdd] = useState<Wallet | undefined>()
  const [dialogMsg, setDialogMsg] = useState('')
  const [filters, setFilters] = useState<PersonaFilter>({
    chain: null,
    verified: null,
    query: '',
  })

  const handleInputChange = useCallback(
    (e: { target: { value: any } }) => {
      setWalletToAdd((prevState) => ({
        ...prevState,
        address: e.target.value,
      }))
    },
    [setWalletToAdd]
  )

  const handleRegisterWallet = async () => {
    if (walletToAdd) {
      registerWallet(walletToAdd)
      setIsDialogOpen(false)
    }
  }

  const filteredWallets =
    persona?.linked_wallets.filter((user) => {
      return (
        (!filters.chain || user.chain === filters.chain) &&
        (filters.verified === null || user.verified === filters.verified) &&
        (filters.query === '' || user.address?.includes(filters.query))
      )
    }) || []

  return (
    <>
      <div className="flex place-items-center items-center gap-4">
        <PersonaFilterComponent onFilterChange={setFilters} />
      </div>

      <Table striped className="[--gutter:theme(spacing.6)] sm:[--gutter:theme(spacing.8)]">
        <TableHead>
          <TableRow>
            <TableHeader className="w-full text-sm sm:text-base">Address</TableHeader>
            <TableHeader className="text-sm sm:text-base">Status</TableHeader>
            <TableHeader className="text-sm sm:text-base">Action</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredWallets.map((user) => (
            <TableRow key={user.address}>
              <TableCell className="text-sm font-medium sm:text-base">
                <div className="flex items-center gap-2 sm:gap-4">
                  <Image width={24} height={24} alt="chain-sel-logo" src={ChainUtils.getLogo(user.chain!)} />
                  <div>{user.address}</div>
                </div>
              </TableCell>
              <TableCell className="text-sm text-zinc-500 sm:text-base">
                <div className="group relative inline-block">
                  <Badge className="cursor-pointer" color={user.verified ? 'lime' : 'red'}>
                    {user.verified ? 'Verified' : 'Not Verified'}
                  </Badge>
                  {!user.verified && (
                    <div className="absolute bottom-full left-1/2 mb-2 w-max -translate-x-1/2 transform whitespace-nowrap rounded-md bg-black px-2 py-1 text-xs text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      Connect to this wallet to verify
                      <div className="absolute left-1/2 top-full -translate-x-1/2 transform border-4 border-transparent border-t-black"></div>
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-sm sm:text-base">
                <Button
                  outline
                  onClick={() =>
                    removeWallet({
                      address: user.address,
                      chain: user.chain,
                    })
                  }
                >
                  <FontAwesomeIcon icon={faCircleXmark} />
                  Remove
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button className="mt-2 w-full text-sm sm:w-fit sm:text-base" outline onClick={() => setIsDialogOpen(true)}>
        Add Wallet
      </Button>
      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <div className="flex flex-col justify-center gap-2 p-4 sm:p-6">
          <h1 className="mb-4 text-center text-xl font-bold text-black dark:text-white sm:text-2xl">Add Wallet</h1>
          <Dropdown>
            <DropdownButton outline>
              {walletToAdd?.chain ? (
                <div className="flex items-center justify-center gap-2 text-center text-lg font-bold sm:text-xl">
                  <Image width={24} height={24} alt="chain-sel-logo" src={ChainUtils.getLogo(walletToAdd.chain)} />
                  <Strong>{ChainUtils.toString(walletToAdd.chain)}</Strong>
                </div>
              ) : (
                'Select Chain'
              )}
            </DropdownButton>
            <DropdownMenu className="min-w-[50%] text-sm sm:min-w-[30%] sm:text-lg">
              {Object.keys(Chain).map((chain) => (
                <DropdownItem
                  onClick={() => {
                    setWalletToAdd((prevState) => ({
                      ...prevState,
                      chain: ChainUtils.fromString(chain),
                    }))
                  }}
                  key={`${chain}`}
                >
                  <Image src={ChainUtils.getLogo(ChainUtils.fromString(chain))} alt="logo" width={32} height={32} className="pr-3" />
                  <Strong>{chain}</Strong>
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
          <Field className="mt-2">
            <Input onChange={handleInputChange} placeholder="Enter the address" name="address" className="text-sm sm:text-base" />
          </Field>
          <Button className="text-sm sm:text-base" onClick={handleRegisterWallet}>
            Register
          </Button>
        </div>
      </Dialog>
      {txn && connectedWallet.chain != Chain.MultiversX && <CompletedTransactionDialog txn={txn} message={dialogMsg} />}
    </>
  )
}
