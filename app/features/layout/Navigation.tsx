"use client";
import { Config } from "@/app/config";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Navbar,
  NavbarItem,
  NavbarSection,
  NavbarSpacer,
} from "../controls/Navbar";
import LoginDropDown from "../loginButton/LoginDropDown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { Field } from "../controls/Fieldset";
import { Input } from "../controls/Input";
import { useContext, useState } from "react";
import { WalletContext } from "@/blockchain/wallet-provider";

type Props = {};

export function Navigation(props: Props) {
  const currentPath = usePathname();
  const [searchQuery, setSearchQuery] = useState("");
  const { connectedWallet } = useContext(WalletContext);

  const isCurrentPage = (path: string) => currentPath === path;

  const onSearch = () => {
    if (searchQuery.trim()) {
      window.location.href = `${window.location.origin}/persona/${searchQuery.trim()}`;
    }
  };

  const onKeyDownHandler = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      onSearch();
    }
  };

  return (
    <Navbar className="flex flex-wrap items-center p-4 sm:flex-nowrap sm:justify-between">
      <div className="hidden sm:flex items-center">
        <Link href="/" aria-label="Home">
          <Image
            src="/heliosconnect.svg"
            alt="Logo"
            width={40} // Adjust the width as needed
            height={40} // Adjust the height as needed
            priority
            className="mr-4"
          />
        </Link>
        <NavbarSection className="hidden sm:flex">
          <NavbarItem
            href={Config.Pages.Start}
            current={isCurrentPage(Config.Pages.Start)}
          >
            Start
          </NavbarItem>
          <NavbarItem
            href={Config.Pages.Faq}
            current={isCurrentPage(Config.Pages.Faq)}
          >
            FAQ
          </NavbarItem>
          {connectedWallet.address && (
            <NavbarItem
              href={Config.Pages.Persona}
              current={isCurrentPage(Config.Pages.Persona)}
            >
              My Persona
            </NavbarItem>
          )}
        </NavbarSection>
      </div>
      <NavbarSpacer className="flex-1 sm:hidden" />
      <Field className="hidden order-3 sm:order-none sm:flex-none sm:w-auto mt-4 sm:mt-0">
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={onKeyDownHandler}
          placeholder="Search Persona"
          className="w-full sm:w-auto"
        />
      </Field>
      <NavbarSpacer className="hidden sm:flex" />
      <div className="hidden sm:flex items-center mt-4 sm:mt-0">
        <LoginDropDown />
        {connectedWallet.address && (
          <FontAwesomeIcon
            className="cursor-pointer ml-4"
            onClick={() => {
              localStorage.removeItem("connected-wallet");
              window.location.reload();
            }}
            icon={faRightFromBracket}
          />
        )}
      </div>
    </Navbar>
  );
}
