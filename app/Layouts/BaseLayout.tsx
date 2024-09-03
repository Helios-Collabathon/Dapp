import Link from 'next/link'
import { Config } from '../config'
import { Navbar, NavbarItem, NavbarSection } from '../controls/Navbar'
import { Sidebar } from '../controls/Sidebar'
import { StackedLayout } from '../controls/StackedLayout'

type Props = {
  children: React.ReactNode
}

export function BaseLayout(props: Props) {
  return (
    <StackedLayout
      navbar={
        <Navbar>
          <Link href="/" aria-label="Home">
            TODO: Logo
          </Link>
          <NavbarSection>
            <NavbarItem href="#TODO" current>
              Dashboard
            </NavbarItem>
            <NavbarItem href={Config.Pages.Faq}>FAQ</NavbarItem>
            <NavbarItem href="#TODO">Docs</NavbarItem>
          </NavbarSection>
        </Navbar>
      }
      sidebar={<Sidebar>{/* TODO */}</Sidebar>}
    >
      {props.children}
    </StackedLayout>
  )
}
