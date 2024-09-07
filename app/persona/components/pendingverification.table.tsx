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

interface PendingLinkedWalletTableProps {
  pendingPersonas: Persona[];
  registerWallet: (walletToAdd: Wallet) => void;
}

export default function PendingLinkedWalletTable({
  pendingPersonas,
  registerWallet,
}: PendingLinkedWalletTableProps) {
  const [walletToAdd, setWalletToAdd] = useState<Wallet | undefined>();

  const handleRegisterWallet = async () => {
    if (walletToAdd) {
      registerWallet(walletToAdd);
    }
  };
  return (
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
              <TableCell>{prsn.address}</TableCell>
              <TableCell className="flex justify-end">
                <Button
                  onClick={() => {
                    setWalletToAdd({
                      address: prsn.address,
                      chain: prsn.chain,
                    });
                    handleRegisterWallet();
                  }}
                  color={"green"}
                  className="mr-2"
                >
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
