"use client";

import React from "react";
import { Button } from "../controls/Button";
import { Dialog } from "../controls/Dialog";

interface InjectiveLoginDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InjectiveLoginDialog = ({
  isOpen,
  onClose,
}: InjectiveLoginDialogProps) => {
  return (
    <>
      {isOpen && (
        <Dialog open={isOpen} onClose={onClose}>
          <div className="p-2">
            {/* Title Section */}
            <h1 className="text-center text-2xl font-bold mb-4">
              Injective Wallet Connection{" "}
            </h1>

            {/* Button Section */}
            <div className="flex justify-center space-x-2">
              <Button onClick={onClose}>tbd</Button>
              <Button onClick={onClose}>tbd</Button>
              <Button onClick={onClose}>tbd</Button>
            </div>
          </div>
        </Dialog>
      )}
    </>
  );
};

export default InjectiveLoginDialog;
