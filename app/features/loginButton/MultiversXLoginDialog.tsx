"use client";
import { Config } from "@/app/config";
import { useWallet } from "@/blockchain/wallet-provider";
import { useGetAccountInfo } from "@multiversx/sdk-dapp/hooks/account/useGetAccountInfo";
import { useExtensionLogin } from "@multiversx/sdk-dapp/hooks/login/useExtensionLogin";
import { useIframeLogin } from "@multiversx/sdk-dapp/hooks/login/useIframeLogin";
import { usePasskeyLogin } from "@multiversx/sdk-dapp/hooks/login/usePasskeyLogin";
import { useWebWalletLogin } from "@multiversx/sdk-dapp/hooks/login/useWebWalletLogin";
import { logout } from "@multiversx/sdk-dapp/utils";
import { IframeLoginTypes } from "@multiversx/sdk-web-wallet-iframe-provider/out/constants";
import { useEffect, useState } from "react";
import { Button } from "../controls/Button";
import { Dialog } from "../controls/Dialog";
import { Chain } from "@/blockchain/types/connected-wallet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faKey } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import LedgerLogo from "../../images/ledger.svg";
import MetamaskLogo from "../../images/metamask.svg";
import MultiversxLogo from "../../images/multiversx.svg";
import dynamic from "next/dynamic";

export type WalletProvider =
  | "browser_extension"
  | "webwallet"
  | "iframe"
  | "walletconnect"
  | "ledger"
  | "passkeys";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const WalletConnectLoginContainer = dynamic(
  async () =>
    (
      await import(
        "@multiversx/sdk-dapp/UI/walletConnect/WalletConnectLoginContainer/index"
      )
    ).WalletConnectLoginContainer,
  { ssr: false },
);

const LedgerLoginContainer = dynamic(
  async () =>
    (await import("@multiversx/sdk-dapp/UI/ledger/LedgerLoginContainer/index"))
      .LedgerLoginContainer,
  {
    ssr: false,
  },
);

export const MultiversXDialog = (props: Props) => {
  const pastWalletProvider = localStorage.getItem("wallet-provider");
  const [walletProvider, setWalletProvider] = useState<WalletProvider | null>(
    pastWalletProvider as WalletProvider,
  );

  const [initExtensionLogin] = useExtensionLogin({ nativeAuth: true });
  const [initWebWalletLogin] = useWebWalletLogin({
    nativeAuth: true,
    callbackRoute: Config.Pages.Start,
  });
  const [initIframeLogin] = useIframeLogin({
    nativeAuth: true,
    walletAddress: Config.Services.MetamaskSnap(),
  });
  const [initPasskeysLogin] = usePasskeyLogin({ nativeAuth: true });

  const wallet = useWallet();
  const { account } = useGetAccountInfo();

  useEffect(() => {
    if (!account.address || !walletProvider) return;
    try {
      wallet.connectWallet(account.address, Chain.MultiversX, walletProvider);
      props.onClose();
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  }, [account.address]);

  useEffect(() => {
    if (!props.isOpen) return;
    logout(location.pathname, undefined, false);
  }, [props.isOpen]);

  const handleLoginRequest = async (provider: WalletProvider) => {
    setWalletProvider(provider);
    if (provider === "browser_extension") initExtensionLogin();
    if (provider === "webwallet") {
      localStorage.setItem("wallet-provider", JSON.stringify(provider));
      initWebWalletLogin();
    }
    if (provider === "iframe") initIframeLogin(IframeLoginTypes.metamask);
    if (provider === "passkeys") initPasskeysLogin();

    if (wallet.connectedWallet && !window.location.href.includes("persona"))
      window.location.href = `${window.location.origin}/persona`;
  };

  const handleClose = () => {
    setWalletProvider(null);
    props.onClose();
  };

  return (
    <>
      {props.isOpen && (
        <Dialog open={props.isOpen} onClose={handleClose}>
          <div className="p-2 text-black dark:text-white">
            <h1 className="mb-4 text-center text-2xl font-bold">
              Multiversx Wallet Connection{" "}
            </h1>
            {walletProvider === "walletconnect" ? (
              <WalletConnectLoginContainer
                loginButtonText="Login with xPortal"
                logoutRoute="/"
                title="xPortal Login"
                lead="Scan the QR code with xPortal"
                wrapContentInsideModal={false}
                showScamPhishingAlert={false}
                isWalletConnectV2
                nativeAuth
              />
            ) : walletProvider === "ledger" ? (
              <LedgerLoginContainer
                callbackRoute="/"
                wrapContentInsideModal={false}
                showScamPhishingAlert={false}
                nativeAuth
              />
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Button onClick={() => handleLoginRequest("passkeys")}>
                  <FontAwesomeIcon icon={faKey} className="mr-1 inline-block" />
                  Passkeys
                </Button>
                <Button onClick={() => handleLoginRequest("browser_extension")}>
                  <Image
                    src={MultiversxLogo}
                    alt=""
                    className="mr-1 inline-block size-6"
                  />
                  Extension
                </Button>
                <Button onClick={() => handleLoginRequest("walletconnect")}>
                  <Image
                    src={MultiversxLogo}
                    alt=""
                    className="mr-1 inline-block size-6"
                  />
                  xPortal
                </Button>
                <Button onClick={() => handleLoginRequest("ledger")}>
                  <Image
                    src={LedgerLogo}
                    alt=""
                    className="mr-1 inline-block size-6"
                  />
                  Ledger
                </Button>
                <Button onClick={() => handleLoginRequest("webwallet")}>
                  <Image
                    src={MultiversxLogo}
                    alt=""
                    className="mr-1 inline-block size-6"
                  />
                  Web Wallet
                </Button>
                <Button onClick={() => handleLoginRequest("iframe")}>
                  <Image
                    src={MetamaskLogo}
                    alt=""
                    className="mr-1 inline-block size-6"
                  />
                  MetaMask
                </Button>
              </div>
            )}
          </div>
        </Dialog>
      )}
    </>
  );
};

export default MultiversXDialog;
