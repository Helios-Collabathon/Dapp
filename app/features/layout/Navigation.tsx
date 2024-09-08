'use client'
import { Config } from '@/app/config'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import AppLogo from '../../images/logo.svg'
import { Navbar, NavbarItem, NavbarSection, NavbarSpacer } from '../controls/Navbar'
import LoginDropDown from '../loginButton/LoginDropDown'

type Props = {}

export function Navigation(props: Props) {
  const currentPath = usePathname()

  const isCurrentPage = (path: string) => currentPath === path

  return (
    <Navbar>
      <Link href="/" aria-label="Home">
        <Image src={AppLogo} alt="Logo" className="size-10" priority />
      </Link>
      <NavbarSection>
        <NavbarItem href={Config.Pages.Start} current={isCurrentPage(Config.Pages.Start)}>
          Start
        </NavbarItem>
        <NavbarItem href={Config.Pages.Faq} current={isCurrentPage(Config.Pages.Faq)}>
          FAQ
        </NavbarItem>
      </NavbarSection>
      <NavbarSpacer />
      <LoginDropDown />
    </Navbar>
  )
}
