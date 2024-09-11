"use client";
import { Config } from "@/app/config";
import { WalletContext } from "@/blockchain/wallet-provider";
import {
  faMoon,
  faRightFromBracket,
  faSun,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import LogoText from "../../images/logo-text.png";
import { Field } from "../controls/Fieldset";
import { Input } from "../controls/Input";
import {
  Navbar,
  NavbarItem,
  NavbarSection,
  NavbarSpacer,
} from "../controls/Navbar";
import LoginDropDown from "../loginButton/LoginDropDown";
import { logout } from "@multiversx/sdk-dapp/utils";

type Props = {};

export function Navigation(props: Props) {
  const currentPath = usePathname();
  const [searchQuery, setSearchQuery] = useState("");
  const { connectedWallet } = useContext(WalletContext);

  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      const storedTheme = localStorage.getItem("theme");
      // Default to dark mode if no theme is set in localStorage
      if (storedTheme) {
        return storedTheme === "dark";
      } else {
        return true;
      }
    }
    return false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

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
      <div className="hidden items-center gap-4 sm:flex">
        <Link href="/" aria-label="Home">
          <Image
            src={LogoText}
            alt="Logo"
            priority
            className="mr-4 w-full"
            style={{ height: "50px" }}
          />
        </Link>
        <NavbarSection className="hidden md:flex">
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
      <Field className="mt-4 hidden sm:mt-0 sm:flex sm:w-1/2 sm:flex-none">
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={onKeyDownHandler}
          placeholder="Search Persona"
          className="w-full sm:w-full"
        />
      </Field>
      <NavbarSpacer className="hidden sm:flex" />
      <div className="hidden items-center gap-3 sm:flex">
        <FontAwesomeIcon
          onClick={toggleTheme}
          icon={isDarkMode ? faSun : faMoon}
          cursor={"pointer"}
          color={isDarkMode ? "white" : "black"}
        />
        <LoginDropDown />
        {connectedWallet.address && (
          <FontAwesomeIcon
            className="cursor-pointer"
            onClick={() => {
              if (connectedWallet.provider === "webwallet") {
                logout(Config.Pages.Start, undefined, false);
                localStorage.removeItem("wallet-provider");
              }
              localStorage.removeItem("connected-wallet");
              window.location.href = `${window.location.origin}`;
            }}
            color={"red"}
            icon={faRightFromBracket}
          />
        )}
      </div>
    </Navbar>
  );
}
