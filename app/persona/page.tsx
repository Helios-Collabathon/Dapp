"use client";
import { useContext, useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../features/controls/Table";
import { InjectiveRepository } from "@/repository/injective.repository";
import { Chain } from "@/blockchain/types/connected-wallet";
import { WalletContext } from "@/blockchain/injective/wallet-provider";
import { Persona, Wallet } from "@/repository/types";
import { Button } from "../features/controls/Button";
import { Dialog } from "../features/controls/Dialog";
import {
  Dropdown,
  DropdownButton,
  DropdownItem,
  DropdownMenu,
} from "../features/controls/Dropdown";
import Image from "next/image";
import { APP_IMAGES } from "../app-images";
import { Strong, Text } from "../features/controls/Text";
import { Input } from "../features/controls/Input";
import { Field, Label } from "../features/controls/Fieldset";

export default function PersonaPage() {
  let { connectedWallet } = useContext(WalletContext);
  const [persona, setPersona] = useState<Persona>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [walletToAdd, setWalletToAdd] = useState<Wallet | undefined>();
  const [txn, setTxn] = useState("");
  const injRepository = new InjectiveRepository();

  useEffect(() => {
    const getConnectedWallet = async () => {
      Object.keys(Chain).map((chain: string) => {
        const wallet = localStorage.getItem(chain);
        if (wallet) connectedWallet = JSON.parse(wallet);
      });
    };

    const getPersonabyInjWallet = async () => {
      const prsn = await injRepository.getPersonaFromWallet(
        connectedWallet?.address!
      );
      setPersona(prsn);
    };

    getConnectedWallet().then(async () => await getPersonabyInjWallet());
  }, []);

  const registerWallet = async () => {
    if (!connectedWallet?.address) alert("Wallet not connected");
    if (!walletToAdd) alert("No wallet to add");
    const { txn, persona } = await injRepository.addWallet(
      connectedWallet!,
      walletToAdd!
    );
    setPersona(persona);
    setTxn(txn);
  };

  return (
    <div className="flex flex-col w-full">
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>Chain</TableHeader>
            <TableHeader>Address</TableHeader>
            <TableHeader>Verified</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow key={connectedWallet?.address}>
            <TableCell className="font-medium">Injective</TableCell>
            <TableCell>{connectedWallet?.address}</TableCell>
            <TableCell className="text-zinc-500"></TableCell>
          </TableRow>
          {persona?.linked_wallets.map((user) => (
            <TableRow key={user.address}>
              <TableCell className="font-medium">{user.chain}</TableCell>
              <TableCell>{user.address}</TableCell>
              <TableCell className="text-zinc-500">False</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button onClick={() => setIsDialogOpen(true)}>Add Address</Button>
      <Dialog open={isDialogOpen} onClose={() => {}}>
        <div className="flex flex-col gap-2 justify-center">
          {/* Title Section */}
          <h1 className="text-center text-2xl font-bold mb-4 text-black dark:text-white">
            Add Address
          </h1>
          <Dropdown>
            <DropdownButton outline>Select a Chain</DropdownButton>
            <DropdownMenu className=" min-w-96 text-xl">
              {Object.values(Chain).map((chain) => (
                <DropdownItem
                  onClick={() =>
                    setWalletToAdd({
                      address: walletToAdd?.address!,
                      chain: chain,
                    })
                  }
                  key={chain}
                >
                  <Image
                    src={
                      chain === Chain.INJ
                        ? APP_IMAGES.INGLogo
                        : APP_IMAGES.egldLogo
                    }
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
              onChange={(v) =>
                setWalletToAdd({
                  address: v.target.value,
                  chain: walletToAdd?.chain!,
                })
              }
              placeholder={"Enter the address"}
              name="address"
            />
          </Field>
          <Button onClick={() => registerWallet()}>Register</Button>
          {txn && (
            <a href={txn} target="__blank" className=" text-blue-600 font-bold">
              Successfully added wallet! Click to see on explorer
            </a>
          )}
        </div>
      </Dialog>
    </div>
  );
}
