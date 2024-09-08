"use client";
import { useContext, useEffect, useMemo, useState } from "react";
import { Persona, Wallet } from "@/repository/types";
import { VerificationService } from "@/repository/verification.service";
import LinkedWalletTable from "./components/linkedwallet.table";
import PendingLinkedWalletTable from "./components/pendingverification.table";
import { PersonaService } from "@/repository/persona.service";
import { ConnectedWallet } from "@/blockchain/types/connected-wallet";
import LinkedWalletTableSkeleton from "./components/linkedwallet.skeleton";
import PendingLinkedWalletTableSkeleton from "./components/pendingverification.skeleton";
import toast from "react-hot-toast";
import { WalletContext } from "@/blockchain/wallet-provider";

export default function PersonaPage() {
  const { connectedWallet } = useContext(WalletContext);
  const [persona, setPersona] = useState<Persona | null>(null);
  const [pendingPersonas, setPendingPersonas] = useState<Persona[]>([]);
  const personaService = useMemo(() => new PersonaService(), []);
  const verificationService = useMemo(() => new VerificationService(), []);
  const [txn, setTxn] = useState("");

  useEffect(() => {
    if (!connectedWallet?.address) return;

    fetchAndVerifyPersona(connectedWallet);
  }, [connectedWallet]);

  const fetchAndVerifyPersona = async (connectedWallet: ConnectedWallet) => {
    try {
      const fetchedPersona = await personaService.getPersonaByWallet(
        connectedWallet.address,
        connectedWallet.chain,
      );

      if (fetchedPersona) {
        const verifiedPersona =
          await verificationService.verifyPersonaLinkedWallets(
            connectedWallet.address,
            fetchedPersona,
          );

        const pendingLinks = await fetchPendingLinks(
          connectedWallet,
          fetchedPersona,
        );

        setPersona(verifiedPersona);
        setPendingPersonas(pendingLinks);
        return verifiedPersona;
      } else return undefined;
    } catch (error) {
      toast.error(`Error fetching or verifying persona!\n${error}`);
      return undefined;
    }
  };
  const fetchPendingLinks = async (
    connectedWallet: ConnectedWallet,
    prsn?: Persona | undefined,
  ): Promise<Persona[]> => {
    try {
      if (!prsn) return [];
      let personas = await personaService.getPersonasFromLinkedWallet({
        address: connectedWallet.address,
        chain: connectedWallet.chain,
      });

      personas = personas.filter((p) => {
        return !prsn.linked_wallets.some(
          (wlt) => wlt.address === p.address && wlt.verified,
        );
      });

      console.log(personas);
      return personas;
    } catch (error) {
      console.error("Error fetching pending links:", error);
      return [];
    }
  };

  const registerWallet = async (walletToAdd: Wallet) => {
    if (!connectedWallet?.address) {
      toast.error("Wallet not connected");
      return;
    }

    try {
      let { txn, persona } = await personaService.addWallet(
        connectedWallet,
        walletToAdd,
      );
      const updatePersona = await fetchAndVerifyPersona(connectedWallet);

      if (updatePersona) persona = updatePersona;
      setPersona(persona);
      setTxn(txn);
      return persona;
    } catch (error) {
      toast.error(`Error registering wallet!\n${error}`);
    }
  };

  const removeWallet = async (walletToRemove: Wallet) => {
    if (!connectedWallet?.address) {
      toast.error("Wallet not connected");
      return;
    }

    try {
      let { txn, persona } = await personaService.removeWallet(
        connectedWallet,
        walletToRemove,
      );
      const updatePersona = await fetchAndVerifyPersona(connectedWallet);

      if (updatePersona) persona = updatePersona;
      setPersona(persona);
      setTxn(txn);
      return persona;
    } catch (error) {
      toast.error(`Error removing wallet!\n${error}`);
    }
  };

  return (
    <div className="flex flex-col w-full">
      {connectedWallet && persona ? (
        <>
          <LinkedWalletTable
            connectedWallet={connectedWallet}
            persona={persona}
            txn={txn}
            registerWallet={registerWallet}
            removeWallet={removeWallet}
          />
          <PendingLinkedWalletTable
            registerWallet={registerWallet}
            pendingPersonas={pendingPersonas}
          />
        </>
      ) : (
        <>
          <LinkedWalletTableSkeleton />
          <PendingLinkedWalletTableSkeleton />
        </>
      )}
    </div>
  );
}
