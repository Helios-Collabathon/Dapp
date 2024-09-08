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
import { CompletedTransactionDialog } from "./completed-transaction.dialog";
import { Strong } from "@/app/features/controls/Text";
import {
  Dropdown,
  DropdownButton,
  DropdownItem,
  DropdownMenu,
} from "@/app/features/controls/Dropdown";
import { Field } from "@headlessui/react";
import { Input } from "@/app/features/controls/Input";
import { PersonaFilter } from "@/blockchain/types/persona-filter";
import PersonaFilterComponent from "./filter-component";

interface LinkedWalletTableProps {
  connectedWallet: Wallet;
  persona: Persona | null;
  txn: string;
  registerWallet: (walletToAdd: Wallet) => void;
  removeWallet: (walletToRemove: Wallet) => void;
}

export default function LinkedWalletTable({
  connectedWallet,
  persona,
  txn,
  registerWallet,
  removeWallet,
}: LinkedWalletTableProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [walletToAdd, setWalletToAdd] = useState<Wallet | undefined>();
  const [filters, setFilters] = useState<PersonaFilter>({
    chain: null,
    verified: null,
    query: "",
  });

  const handleInputChange = useCallback(
    (e: { target: { value: any } }) => {
      setWalletToAdd((prevState) => ({
        ...prevState,
        address: e.target.value,
      }));
    },
    [setWalletToAdd],
  );

  const handleRegisterWallet = async () => {
    if (walletToAdd) {
      registerWallet(walletToAdd);
    }
  };

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
            <TableHeader>Action</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {connectedWallet && (
            <TableRow key={connectedWallet.address}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-4">
                  <Image
                    width={24}
                    height={24}
                    alt="chain-avatr-logo"
                    src={ChainUtils.getLogo(connectedWallet.chain!)}
                  />
                  <div className="font-medium">{connectedWallet.address}</div>
                </div>
              </TableCell>
              <TableCell className="text-zinc-500"></TableCell>
            </TableRow>
          )}
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
              <TableCell>
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
      <Button outline onClick={() => setIsDialogOpen(true)}>
        Add Address
      </Button>
      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <div className="flex flex-col gap-2 justify-center">
          <h1 className="text-center text-2xl font-bold mb-4 text-black dark:text-white">
            Add Address
          </h1>
          <Dropdown>
            <DropdownButton outline>
              {walletToAdd?.chain ? (
                <div className="flex justify-center gap-2 font-bold text-xl text-center items-center">
                  <Image
                    width={24}
                    height={24}
                    alt="chain-sel-logo"
                    src={ChainUtils.getLogo(walletToAdd.chain)}
                  />
                  <Strong>{ChainUtils.toString(walletToAdd.chain)}</Strong>
                </div>
              ) : (
                "Select Chain"
              )}
            </DropdownButton>
            <DropdownMenu className="min-w-[30%] text-xl">
              {Object.keys(Chain).map((chain) => (
                <DropdownItem
                  onClick={() => {
                    setWalletToAdd((prevState) => ({
                      ...prevState,
                      chain: ChainUtils.fromString(chain),
                    }));
                  }}
                  key={`${chain}`}
                >
                  <Image
                    src={ChainUtils.getLogo(ChainUtils.fromString(chain))}
                    alt="logo"
                    width={32}
                    height={32}
                    className="pr-3"
                  />
                  <Strong>{chain}</Strong>
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
          <Field className="mt-2">
            <Input
              onChange={handleInputChange}
              placeholder="Enter the address"
              name="address"
            />
          </Field>
          <Button onClick={handleRegisterWallet}>Register</Button>
          {txn && (
            <a href={txn} target="__blank" className="text-blue-600 font-bold">
              Successfully added wallet! Click to see on explorer
            </a>
          )}
        </div>
      </Dialog>
      <CompletedTransactionDialog
        message="This is the message of a completed transaction"
        txn={txn}
      />
    </>
  );
}
