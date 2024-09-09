import { Props } from 'next/script'
import { StackedLayout } from '../features/controls/StackedLayout'
import { Navigation } from '../features/layout/Navigation'
import { CustomSidebar } from '../features/controls/CustomSidebar'

export function BaseLayout(props: Props) {
  return (
    <StackedLayout navbar={<Navigation />} sidebar={<CustomSidebar />}>
      {props.children}
    </StackedLayout>
  )
}
