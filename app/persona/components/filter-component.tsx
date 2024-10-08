import { Dropdown, DropdownButton, DropdownItem, DropdownMenu } from '../../features/controls/Dropdown'
import { Input } from '../../features/controls/Input'
import { Field } from '../../features/controls/Fieldset'
import { Chain, ChainUtils } from '@/blockchain/types/connected-wallet'
import Image from 'next/image'
import { Strong } from '@/app/features/controls/Text'
import { useState, useEffect } from 'react'
import { PersonaFilter } from '@/blockchain/types/persona-filter'
import { Button } from '@/app/features/controls/Button'
import { Dialog } from '@/app/features/controls/Dialog'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilter } from '@fortawesome/free-solid-svg-icons'

interface PersonaFilterProps {
  onFilterChange: (filter: PersonaFilter) => void
}

export default function PersonaFilterComponent({ onFilterChange }: PersonaFilterProps) {
  const [filterChain, setFilterChain] = useState<Chain | null>(null)
  const [filterVerified, setFilterVerified] = useState<boolean | null>(null)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false)

  useEffect(() => {
    onFilterChange({
      chain: filterChain,
      verified: filterVerified,
      query: searchQuery,
    })
  }, [filterChain, filterVerified, searchQuery, onFilterChange])

  const FilterDialog = ({ isOpen, onClose, filterChain, setFilterChain, filterVerified, setFilterVerified, searchQuery, setSearchQuery }: any) => {
    return (
      <Dialog size="xs" open={isOpen} onClose={onClose} className="flex flex-col items-center gap-4 p-4 sm:p-6">
        <Strong className="w-full text-center text-lg sm:text-xl">Filter Options</Strong>
        <Dropdown>
          <DropdownButton outline className="w-full text-center">
            {filterChain ? (
              <div className="flex items-center justify-center gap-2 text-base font-bold sm:text-xl">
                <Image width={16} height={16} alt="chain-sel-logo" src={ChainUtils.getLogo(filterChain)} />
                <Strong>{ChainUtils.toString(filterChain)}</Strong>
              </div>
            ) : (
              'Filter by Chain'
            )}
          </DropdownButton>
          <DropdownMenu className="w-full">
            <DropdownItem onClick={() => setFilterChain(null)}>
              <Strong>All Chains</Strong>
            </DropdownItem>
            {Object.keys(Chain).map((chain) => (
              <DropdownItem className="flex" onClick={() => setFilterChain(ChainUtils.fromString(chain))} key={chain}>
                <Strong className="w-full text-start">{chain}</Strong>
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>

        <Dropdown>
          <DropdownButton outline className="w-full text-center">
            {filterVerified === null ? 'Filter by Status' : filterVerified ? 'Verified' : 'Not Verified'}
          </DropdownButton>
          <DropdownMenu className="w-full text-base sm:text-xl">
            <DropdownItem onClick={() => setFilterVerified(null)}>
              <Strong>All</Strong>
            </DropdownItem>
            <DropdownItem onClick={() => setFilterVerified(true)}>
              <Strong>Verified</Strong>
            </DropdownItem>
            <DropdownItem onClick={() => setFilterVerified(false)}>
              <Strong>Not Verified</Strong>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>

        <div className="w-full flex-1">
          <Input
            size={1}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Address"
            className="w-full text-base sm:text-xl"
          />
        </div>

        <Button outline className="mt-4 w-full" onClick={onClose}>
          Apply Filters
        </Button>
      </Dialog>
    )
  }

  return (
    <div className="flex w-full">
      {/* Render for large screens */}
      <div className="hidden sm:flex sm:w-full">
        <div className="grid w-full grid-cols-3 gap-4 sm:flex-row sm:items-center">
          <Dropdown>
            <DropdownButton outline>
              {filterChain ? (
                <div className="flex items-center justify-center gap-2 text-center text-base font-bold sm:text-xl">
                  <Image width={16} height={16} alt="chain-sel-logo" src={ChainUtils.getLogo(filterChain)} />
                  <Strong>{ChainUtils.toString(filterChain)}</Strong>
                </div>
              ) : (
                'Filter by Chain'
              )}
            </DropdownButton>
            <DropdownMenu>
              <DropdownItem onClick={() => setFilterChain(null)}>
                <Strong>All Chains</Strong>
              </DropdownItem>
              {Object.keys(Chain).map((chain) => (
                <DropdownItem className="flex" onClick={() => setFilterChain(ChainUtils.fromString(chain))} key={chain}>
                  <Strong className="w-full text-start">{chain}</Strong>
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
          <Dropdown>
            <DropdownButton outline>{filterVerified === null ? 'Filter by Status' : filterVerified ? 'Verified' : 'Not Verified'}</DropdownButton>
            <DropdownMenu className="min-w-[30%] text-base sm:text-xl">
              <DropdownItem onClick={() => setFilterVerified(null)}>
                <Strong>All</Strong>
              </DropdownItem>
              <DropdownItem onClick={() => setFilterVerified(true)}>
                <Strong>Verified</Strong>
              </DropdownItem>
              <DropdownItem onClick={() => setFilterVerified(false)}>
                <Strong>Not Verified</Strong>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <Input
            size={1}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Address"
            className="w-full text-base sm:text-xl"
          />
        </div>
      </div>

      {/* Render for mobile screens */}
      <div className="flex w-full sm:hidden">
        <div className="flex w-full">
          <Button outline className="w-full" onClick={() => setIsFilterDialogOpen(true)}>
            <FontAwesomeIcon icon={faFilter} />
            Filters
          </Button>
        </div>
        <FilterDialog
          isOpen={isFilterDialogOpen}
          onClose={() => setIsFilterDialogOpen(false)}
          filterChain={filterChain}
          setFilterChain={setFilterChain}
          filterVerified={filterVerified}
          setFilterVerified={setFilterVerified}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      </div>
    </div>
  )
}
