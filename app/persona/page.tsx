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
import { Field } from "../features/controls/Fieldset";
import { VerificationService } from "@/repository/verification.service";
import { Badge } from "../features/controls/Badge";
import { address, g } from "framer-motion/client";
export default function PersonaPage() {
  const { connectedWallet } = useContext(WalletContext);
  const [persona, setPersona] = useState<Persona | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [walletToAdd, setWalletToAdd] = useState<Wallet | undefined>();
  const [txn, setTxn] = useState("");
  const [pendingPersonas, setPendingPersonas] = useState<Persona[]>([]);
  const injRepository = new InjectiveRepository();
  const verificationService = new VerificationService();

  // Fetch and verify persona on connectedWallet change
  useEffect(() => {
    if (!connectedWallet?.address) return;

    const fetchAndVerifyPersona = async () => {
      try {
        const fetchedPersona = await injRepository.getPersonaFromWallet(
          connectedWallet.address,
        );
        if (fetchedPersona) {
          // Only update persona if it has actually changed
          if (JSON.stringify(fetchedPersona) !== JSON.stringify(persona)) {
            setPersona(fetchedPersona);
          }

          // Verify persona linked wallets if necessary
          const verifiedPersona =
            await verificationService.verifyPersonaLinkedWallets(
              connectedWallet.address,
              fetchedPersona,
            );

          // Again, only update if the verified persona is different
          if (
            JSON.stringify(verifiedPersona) !== JSON.stringify(fetchedPersona)
          ) {
            setPersona(verifiedPersona);
          }
        }
      } catch (error) {
        console.error("Error fetching or verifying persona:", error);
      }
    };

    fetchAndVerifyPersona();
  }, [connectedWallet, injRepository, verificationService, persona]);

  // Fetch pending linked wallets
  useEffect(() => {
    if (!connectedWallet?.address || !connectedWallet.chain) return;

    const fetchPendingLinks = async () => {
      try {
        const personas = await injRepository.getPersonasFromLinkedWallet({
          address: connectedWallet.address,
          chain: connectedWallet.chain,
        });

        // Only update pending personas if the new data is different
        if (JSON.stringify(personas) !== JSON.stringify(pendingPersonas)) {
          setPendingPersonas(personas);
        }
      } catch (error) {
        console.error("Error fetching pending links:", error);
      }
    };

    fetchPendingLinks();
  }, [connectedWallet, injRepository, pendingPersonas]);

  const registerWallet = async () => {
    if (!connectedWallet?.address) {
      alert("Wallet not connected");
      return;
    }
    if (!walletToAdd) {
      alert("No wallet to add");
      return;
    }

    try {
      const { txn, persona } = await injRepository.addWallet(
        connectedWallet,
        walletToAdd,
      );
      setPersona(persona);
      setTxn(txn);
    } catch (error) {
      console.error("Error registering wallet:", error);
    }
  };

  const LinkedWalletComponent = () => (
    <>
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>Chain</TableHeader>
            <TableHeader>Address</TableHeader>
            <TableHeader>Verified</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {connectedWallet && (
            <TableRow key={connectedWallet.address}>
              <TableCell className="font-medium">Injective</TableCell>
              <TableCell>{connectedWallet.address}</TableCell>
              <TableCell className="text-zinc-500"></TableCell>
            </TableRow>
          )}
          {persona?.linked_wallets.map((user) => (
            <TableRow key={user.address}>
              <TableCell className="font-medium">{user.chain}</TableCell>
              <TableCell>{user.address}</TableCell>
              <TableCell className="text-zinc-500">
                <Badge color={user.verified ? "lime" : "red"}>
                  {user.verified ? "Verified" : "Not Verified"}
                </Badge>
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
              {walletToAdd?.chain
                ? walletToAdd.chain.toUpperCase()
                : "Select a Chain"}
            </DropdownButton>
            <DropdownMenu className="min-w-96 text-xl">
              {Object.values(Chain).map((chain) => (
                <DropdownItem
                  onClick={() =>
                    setWalletToAdd(
                      (prev) =>
                        prev && prev.address
                          ? { ...prev, chain }
                          : { address: "", chain }, // Ensure `address` is defined
                    )
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
                  chain: walletToAdd?.chain,
                  address: v.target.value,
                })
              }
              placeholder="Enter the address"
              name="address"
            />
          </Field>
          <Button onClick={registerWallet}>Register</Button>
          {txn && (
            <a href={txn} target="__blank" className="text-blue-600 font-bold">
              Successfully added wallet! Click to see on explorer
            </a>
          )}
        </div>
      </Dialog>
    </>
  );

  const PendingLinkedWalletComponent = () => (
    <div className="mt-20">
      <Strong>Pending verifications</Strong>
      <Table className="[--gutter:theme(spacing.6)] sm:[--gutter:theme(spacing.8)]">
        <TableHead>
          <TableRow>
            <TableHeader className="w-1/4">Chain</TableHeader>
            <TableHeader className="w-full">Address</TableHeader>
            <TableHeader>Action</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {pendingPersonas?.map((prsn) => (
            <TableRow key={JSON.stringify(prsn)}>
              <TableCell className="font-medium">{prsn.chain}</TableCell>
              <TableCell>{prsn.addr}</TableCell>
              <TableCell className="flex justify-end">
                <Button color={"green"} className="mr-2">
                  Accept
                </Button>
                <Button color={"red"} className="mr-2">
                  Deny
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <div className="flex flex-col w-full">
      <LinkedWalletComponent />
      <PendingLinkedWalletComponent />
    </div>
  );
}
