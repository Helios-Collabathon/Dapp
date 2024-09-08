"use client";
import {
  Sidebar,
  SidebarSection,
  SidebarItem,
  SidebarHeader,
  SidebarBody,
  SidebarFooter,
} from "./Sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { usePathname } from "next/navigation";
import { Config } from "@/app/config";
import { useContext, useState } from "react";
import { WalletContext } from "@/blockchain/wallet-provider";
import { Input } from "../controls/Input";
import Link from "next/link";
import LoginDropDown from "../loginButton/LoginDropDown";
import Image from "next/image";

export function CustomSidebar() {
  const currentPath = usePathname();
  const { connectedWallet } = useContext(WalletContext);
  const [searchQuery, setSearchQuery] = useState("");

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
    <Sidebar>
      <SidebarHeader>
        <Link href="/" aria-label="Home" className="flex items-center">
          <Image
            src="/heliosconnect.svg"
            alt="Logo"
            width={50} // Adjust the width as needed
            height={50} // Adjust the height as needed
            priority
          />
          <span className="ml-4 text-xl font-bold">Helios Connect</span>
        </Link>
      </SidebarHeader>

      <SidebarBody>
        <SidebarSection>
          <SidebarItem
            current={isCurrentPage(Config.Pages.Start)}
            href={Config.Pages.Start}
          >
            Start
          </SidebarItem>
          <SidebarItem
            current={isCurrentPage(Config.Pages.Faq)}
            href={Config.Pages.Faq}
          >
            FAQ
          </SidebarItem>
          {connectedWallet.address && (
            <SidebarItem
              current={isCurrentPage(Config.Pages.Persona)}
              href={Config.Pages.Persona}
            >
              My Persona
            </SidebarItem>
          )}
        </SidebarSection>

        <SidebarSection className="mt-4">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={onKeyDownHandler}
            placeholder="Search Persona"
            className="w-full"
          />
        </SidebarSection>
      </SidebarBody>

      <SidebarFooter>
        <div className="flex gap-4 items-centers place-items-center">
          <LoginDropDown />
          {connectedWallet.address && (
            <FontAwesomeIcon
              size="xl"
              className="cursor-pointer"
              onClick={() => {
                localStorage.removeItem("connected-wallet");
                window.location.reload();
              }}
              icon={faRightFromBracket}
            />
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
