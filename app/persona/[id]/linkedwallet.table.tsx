import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../features/controls/Table";
import { Badge } from "../../features/controls/Badge";
import { Wallet, Persona } from "@/repository/types";
import { Button } from "../../features/controls/Button";
import { Dialog } from "../../features/controls/Dialog";
import Image from "next/image";
import { useState, useCallback } from "react";
import { Chain, ChainUtils } from "@/blockchain/types/connected-wallet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { Strong } from "@/app/features/controls/Text";
import {
  Dropdown,
  DropdownButton,
  DropdownItem,
  DropdownMenu,
} from "@/app/features/controls/Dropdown";
import { PersonaFilter } from "@/blockchain/types/persona-filter";
import PersonaFilterComponent from "../components/filter-component";

interface LinkedWalletTableProps {
  persona: Persona | null;
}

export default function SPLinkedWalletTable({
  persona,
}: LinkedWalletTableProps) {
  const [filters, setFilters] = useState<PersonaFilter>({
    chain: null,
    verified: null,
    query: "",
  });

  const filteredWallets =
    persona?.linked_wallets.filter((user) => {
      return (
        (!filters.chain || user.chain === filters.chain) &&
        (filters.verified === null || user.verified === filters.verified) &&
        (filters.query === "" || user.address?.includes(filters.query))
      );
    }) || [];

  return (
    <>
      <PersonaFilterComponent onFilterChange={setFilters} />

      <Table
        striped
        className="[--gutter:theme(spacing.6)] sm:[--gutter:theme(spacing.8)]"
      >
        <TableHead>
          <TableRow>
            <TableHeader className="w-full">Address</TableHeader>
            <TableHeader>Status</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredWallets.map((user) => (
            <TableRow key={user.address}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-4">
                  <Image
                    width={24}
                    height={24}
                    alt="chain-sel-logo"
                    src={ChainUtils.getLogo(user.chain!)}
                  />
                  <div className="font-medium">{user.address}</div>
                </div>
              </TableCell>
              <TableCell className="text-zinc-500">
                <Badge color={user.verified ? "lime" : "red"}>
                  {user.verified ? "Verified" : "Not Verified"}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
