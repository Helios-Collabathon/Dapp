import { Sidebar } from "../features/controls/Sidebar";
import { StackedLayout } from "../features/controls/StackedLayout";
import { Navigation } from "../features/layout/Navigation";

type Props = {
  children: React.ReactNode;
};

export function BaseLayout(props: Props) {
  return (
    <StackedLayout
      navbar={<Navigation />}
      sidebar={<Sidebar>{/* TODO */}</Sidebar>}
    >
      {props.children}
    </StackedLayout>
  );
}
