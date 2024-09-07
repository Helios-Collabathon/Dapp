"use client";
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
import {
  Dropdown,
  DropdownButton,
  DropdownItem,
  DropdownMenu,
} from "../../features/controls/Dropdown";
import Image from "next/image";
import { Input } from "../../features/controls/Input";
import { Field } from "../../features/controls/Fieldset";
import { useState, useCallback } from "react";
import { Chain, ChainUtils } from "@/blockchain/types/connected-wallet";
import { Text } from "@/app/features/controls/Text";
import { XCircleIcon } from "@heroicons/react/16/solid";

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

  return (
    <>
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>Chain</TableHeader>
            <TableHeader>Address</TableHeader>
            <TableHeader>Status</TableHeader>
            <TableHeader className="flex justify-center">Action</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {connectedWallet && (
            <TableRow key={connectedWallet.address}>
              <TableCell className="font-medium">
                <Image
                  width={32}
                  height={32}
                  alt="chain-avatr-logo"
                  src={ChainUtils.getLogo(connectedWallet.chain!)}
                />
              </TableCell>
              <TableCell>{connectedWallet.address}</TableCell>
              <TableCell className="text-zinc-500"></TableCell>
            </TableRow>
          )}
          {persona?.linked_wallets.map((user) => (
            <TableRow key={user.address}>
              <TableCell className="font-medium">
                <Image
                  width={32}
                  height={32}
                  alt="chain-sel-logo"
                  src={ChainUtils.getLogo(user.chain!)}
                />
              </TableCell>
              <TableCell>{user.address}</TableCell>
              <TableCell className="text-zinc-500">
                <Badge color={user.verified ? "lime" : "red"}>
                  {user.verified ? "Verified" : "Not Verified"}
                </Badge>
              </TableCell>
              <TableCell className="flex justify-end">
                <Button
                  onClick={() =>
                    removeWallet({
                      address: user.address,
                      chain: user.chain,
                    })
                  }
                  color="red"
                  className="w-fit"
                >
                  <XCircleIcon />
                  Remove
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button onClick={() => setIsDialogOpen(true)}>Add Address</Button>
      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <div className="flex flex-col gap-2 justify-center">
          <h1 className="text-center text-2xl font-bold mb-4 text-black dark:text-white">
            Add Address
          </h1>
          <Dropdown>
            <DropdownButton outline>
              {walletToAdd?.chain ? (
                <div className="flex justify-center gap-2 font-bold text-lg text-center items-center">
                  <Image
                    width={32}
                    height={32}
                    alt="chain-sel-logo"
                    src={ChainUtils.getLogo(walletToAdd.chain)}
                  />
                  <p>{ChainUtils.toString(walletToAdd.chain)}</p>
                </div>
              ) : (
                "Select Chain"
              )}
            </DropdownButton>
            <DropdownMenu className="min-w-96 text-xl">
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
                    width={20}
                    height={20}
                    className="pr-2"
                  />
                  <Text>{chain}</Text>
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
    </>
  );
}
