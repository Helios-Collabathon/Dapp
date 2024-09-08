"use client";
import { getAddresses } from "@/blockchain/injective/wallet";
import { wallets } from "@/blockchain/injective/wallets";
import { useWallet } from "@/blockchain/wallet-provider";
import { Wallet } from "@injectivelabs/wallet-ts";
import Image from "next/image";
import { Button } from "../controls/Button";
import { Dialog } from "../controls/Dialog";
import { Chain } from "@/blockchain/types/connected-wallet";

interface InjectiveLoginDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InjectiveLoginDialog = ({
  isOpen,
  onClose,
}: InjectiveLoginDialogProps) => {
  const wallet = useWallet();
  const handleWalletClick = async (walletValue: Wallet) => {
    try {
      const [address] = await getAddresses(walletValue);
      await wallet.connectWallet(
        address,
        Chain.Injective,
        walletValue.toString(),
      );
      window.location.href = `${window.location.origin}/persona`;
      onClose(); // Close the dialog after successful connection
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  return (
    <>
      {isOpen && (
        <Dialog open={isOpen} onClose={onClose}>
          <div className="p-2">
            {/* Title Section */}
            <h1 className="mb-4 text-center text-2xl font-bold dark:text-white text-black">
              Injective Wallet Connection
            </h1>

            {/* Button Section */}
            <div className="grid grid-cols-2 gap-2">
              {wallets.map((wlt) => (
                <Button
                  outline
                  key={wlt.name}
                  onClick={() => handleWalletClick(wlt.value)}
                >
                  <Image
                    src={wlt.icon}
                    alt="meta-mask"
                    width={32}
                    height={32}
                  />
                  {wlt.name}
                </Button>
              ))}
            </div>
          </div>
        </Dialog>
      )}
    </>
  );
};

export default InjectiveLoginDialog;
