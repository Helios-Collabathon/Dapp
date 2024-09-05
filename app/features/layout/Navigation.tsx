'use client'
import { Config } from '@/app/config'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Navbar, NavbarItem, NavbarSection } from '../controls/Navbar'
import Image from 'next/image'

type Props = {}

export function Navigation(props: Props) {
  const currentPath = usePathname()

  const isCurrentPage = (path: string) => currentPath === path

  return (
    <Navbar>
      <Link href="/" aria-label="Home">
        <Image
          src="/vercel.svg"
          alt="Logo"
          width={100} // Adjust the width as needed
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
    </Navbar>
  )
}
