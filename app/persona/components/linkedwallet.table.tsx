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
import {
  Chain,
  ChainUtils,
  ConnectedWallet,
} from "@/blockchain/types/connected-wallet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark, faSyncAlt } from "@fortawesome/free-solid-svg-icons";
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
import { CompletedTransactionDialog } from "./completed-transaction.dialog";

interface LinkedWalletTableProps {
  connectedWallet: ConnectedWallet;
  persona: Persona | null;
  txn: string;
  registerWallet: (walletToAdd: Wallet) => void;
  removeWallet: (walletToRemove: Wallet) => void;
  refreshPersona: (connectedWallet: ConnectedWallet) => void;
}

export default function LinkedWalletTable({
  connectedWallet,
  persona,
  txn,
  registerWallet,
  removeWallet,
  refreshPersona,
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
      setIsDialogOpen(false);
    }
  };

  const handleRefresh = () => {
    refreshPersona(connectedWallet);
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
      <div className="flex flex-col mb-8 gap-2">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-start ">
          My Persona
        </h1>
        <div className="flex gap-2">
          <Image
            width={16}
            height={16}
            alt="chain-sel-logo"
            src={ChainUtils.getLogo(connectedWallet.chain!)}
          />
          <p className="text-xs font-mono">{connectedWallet.address}</p>
        </div>
      </div>

      <div className="flex w-full gap-4 items-center place-items-center">
        <PersonaFilterComponent onFilterChange={setFilters} />
        <FontAwesomeIcon
          cursor={"pointer"}
          className="cursor-pointer"
          onClick={handleRefresh}
          icon={faSyncAlt}
        />
      </div>

      <Table
        striped
        className="[--gutter:theme(spacing.6)] sm:[--gutter:theme(spacing.8)]"
      >
        <TableHead>
          <TableRow>
            <TableHeader className="text-sm sm:text-base w-full">
              Address
            </TableHeader>
            <TableHeader className="text-sm sm:text-base">Status</TableHeader>
            <TableHeader className="text-sm sm:text-base">Action</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {/* {connectedWallet && (
            <TableRow key={connectedWallet.address}>
              <TableCell className="font-medium text-sm sm:text-base">
                <div className="flex items-center gap-2 sm:gap-4">
                  <Image
                    width={24}
                    height={24}
                    alt="chain-avatar-logo"
                    src={ChainUtils.getLogo(connectedWallet.chain!)}
                  />
                  <div>{connectedWallet.address}</div>
                </div>
              </TableCell>
              <TableCell className="text-zinc-500 text-sm sm:text-base"></TableCell>
            </TableRow>
          )} */}
          {filteredWallets.map((user) => (
            <TableRow key={user.address}>
              <TableCell className="font-medium text-sm sm:text-base">
                <div className="flex items-center gap-2 sm:gap-4">
                  <Image
                    width={24}
                    height={24}
                    alt="chain-sel-logo"
                    src={ChainUtils.getLogo(user.chain!)}
                  />
                  <div>{user.address}</div>
                </div>
              </TableCell>
              <TableCell className="text-zinc-500 text-sm sm:text-base">
                <Badge color={user.verified ? "lime" : "red"}>
                  {user.verified ? "Verified" : "Not Verified"}
                </Badge>
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
      <Button
        className="w-full sm:w-fit mt-2 text-sm sm:text-base"
        outline
        onClick={() => setIsDialogOpen(true)}
      >
        Add Wallet
      </Button>
      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <div className="flex flex-col gap-2 justify-center p-4 sm:p-6">
          <h1 className="text-center text-xl sm:text-2xl font-bold mb-4 text-black dark:text-white">
            Add Wallet
          </h1>
          <Dropdown>
            <DropdownButton outline>
              {walletToAdd?.chain ? (
                <div className="flex justify-center gap-2 font-bold text-lg sm:text-xl text-center items-center">
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
            <DropdownMenu className="min-w-[50%] sm:min-w-[30%] text-sm sm:text-lg">
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
              className="text-sm sm:text-base"
            />
          </Field>
          <Button
            className="text-sm sm:text-base"
            onClick={handleRegisterWallet}
          >
            Register
          </Button>
        </div>
      </Dialog>
      {txn && <CompletedTransactionDialog txn={txn} message="" />}
    </>
  );
}
