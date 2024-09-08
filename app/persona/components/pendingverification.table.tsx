"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../features/controls/Table";
import { Button } from "../../features/controls/Button";
import { Strong } from "../../features/controls/Text";
import { Persona, Wallet } from "@/repository/types";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";

interface PendingLinkedWalletTableProps {
  pendingPersonas: Persona[];
  registerWallet: (walletToAdd: Wallet) => void;
}

export default function PendingLinkedWalletTable({
  pendingPersonas,
  registerWallet,
}: PendingLinkedWalletTableProps) {
  const [walletToAdd, setWalletToAdd] = useState<Wallet | undefined>();

  const handleRegisterWallet = async (prsn: Persona) => {
    setWalletToAdd({
      address: prsn.address,
      chain: prsn.chain,
    });
    if (walletToAdd) {
      registerWallet(walletToAdd);
    }
  };

  return (
    <div className="mt-20">
      <div className="bg-slate-900/5 dark:bg-slate-200/5 p-1 rounded-md w-fit">
        <Strong className="p-1">Pending verifications</Strong>
      </div>
      <Table
        striped
        className="[--gutter:theme(spacing.6)] sm:[--gutter:theme(spacing.8)]"
      >
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
              <TableCell>{prsn.address}</TableCell>
              <TableCell className="flex justify-end">
                <Button outline onClick={() => handleRegisterWallet(prsn)}>
                  <FontAwesomeIcon icon={faCircleCheck} />
                  Accept
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
