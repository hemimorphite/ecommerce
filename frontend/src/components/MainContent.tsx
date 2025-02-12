import AdjustmentTable from "./AdjustmentTable";
import ProductList from "./ProductList";

interface MainContentProps {
  activeTab: string;
}

export default function MainContent({ activeTab }: MainContentProps) {
  return (
    <>
      {activeTab === "products" ? <ProductList /> : <AdjustmentTable />}
    </>
  );
}
