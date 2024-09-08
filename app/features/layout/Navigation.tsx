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
    <Navbar>
      <Link href="/" aria-label="Home">
        <Image
          src="/heliosconnect.svg"
          alt="Logo"
          width={50} // Adjust the width as needed
          height={50} // Adjust the height as needed
          priority
        />
      </Link>
      <NavbarSection>
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
      <NavbarSpacer />

      <Field className="flex-1">
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={onKeyDownHandler}
          placeholder="Search Persona"
        />
      </Field>
      <NavbarSpacer />
      <LoginDropDown />
      <FontAwesomeIcon
        className="cursor-pointer"
        onClick={() => {
          localStorage.removeItem("connected-wallet");
          window.location.reload();
        }}
        icon={faRightFromBracket}
      />
    </Navbar>
  );
}
