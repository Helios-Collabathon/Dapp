import {
  Dropdown,
  DropdownButton,
  DropdownItem,
  DropdownMenu,
} from "../../features/controls/Dropdown";
import { Input } from "../../features/controls/Input";
import { Field } from "../../features/controls/Fieldset";
import { Chain, ChainUtils } from "@/blockchain/types/connected-wallet";
import Image from "next/image";
import { Strong } from "@/app/features/controls/Text";
import { useState, useEffect } from "react";
import { PersonaFilter } from "@/blockchain/types/persona-filter";

interface PersonaFilterProps {
  onFilterChange: (filter: PersonaFilter) => void;
}

export default function PersonaFilterComponent({
  onFilterChange,
}: PersonaFilterProps) {
  const [filterChain, setFilterChain] = useState<Chain | null>(null);
  const [filterVerified, setFilterVerified] = useState<boolean | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    onFilterChange({
      chain: filterChain,
      verified: filterVerified,
      query: searchQuery,
    });
  }, [filterChain, filterVerified, searchQuery, onFilterChange]);

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:w-1/2">
      <Dropdown>
        <DropdownButton outline>
          {filterChain ? (
            <div className="flex justify-center gap-2 font-bold text-base sm:text-xl text-center items-center">
              <Image
                width={16}
                height={16}
                alt="chain-sel-logo"
                src={ChainUtils.getLogo(filterChain)}
              />
              <Strong>{ChainUtils.toString(filterChain)}</Strong>
            </div>
          ) : (
            "Filter by Chain"
          )}
        </DropdownButton>
        <DropdownMenu>
          <DropdownItem onClick={() => setFilterChain(null)}>
            <Strong>All Chains</Strong>
          </DropdownItem>
          {Object.keys(Chain).map((chain) => (
            <DropdownItem
              className="flex"
              onClick={() => setFilterChain(ChainUtils.fromString(chain))}
              key={`${chain}`}
            >
              <Strong className="w-full text-start">{chain}</Strong>
            </DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>
      <Dropdown>
        <DropdownButton outline>
          {filterVerified === null
            ? "Filter by Status"
            : filterVerified
              ? "Verified"
              : "Not Verified"}
        </DropdownButton>
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
      <Field className="flex-1 w-full">
        <Input
          size={1}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by Address"
          className="w-full text-base sm:text-xl"
        />
      </Field>
    </div>
  );
}
