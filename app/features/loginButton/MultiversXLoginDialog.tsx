"use client";

import { Button } from "../controls/Button";
import { Dialog } from "../controls/Dialog";

interface MultiversXDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MultiversXDialog = ({
  isOpen,
  onClose,
}: MultiversXDialogProps) => {
  return (
    <>
      {isOpen && (
        <Dialog open={isOpen} onClose={onClose}>
          <div className="p-2">
            {/* Title Section */}
            <h1 className="text-center text-2xl font-bold mb-4">
              Multiversx Wallet Connection{" "}
            </h1>

            {/* Button Section */}
            <div className="flex justify-center space-x-2">
              <Button onClick={onClose}>Xportal</Button>
              <Button onClick={onClose}>Ledger</Button>
              <Button onClick={onClose}>Web Wallet</Button>
              <Button onClick={onClose}>MetaMask</Button>
            </div>
          </div>
        </Dialog>
      )}
    </>
  );
};

export default MultiversXDialog;
