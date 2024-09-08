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

type Props = {};

export function Navigation(props: Props) {
  const currentPath = usePathname();

  const isCurrentPage = (path: string) => currentPath === path;

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
      </NavbarSection>
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
