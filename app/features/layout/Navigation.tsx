'use client'
import { Config } from '@/app/config'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Navbar, NavbarItem, NavbarSection } from '../controls/Navbar'

type Props = {}

export function Navigation(props: Props) {
  const currentPath = usePathname()

  const isCurrentPage = (path: string) => currentPath === path

  return (
    <Navbar>
      <Link href="/" aria-label="Home">
        TODO: Logo
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
        <NavbarItem href="#TODO">Docs</NavbarItem>
      </NavbarSection>
    </Navbar>
  )
}
