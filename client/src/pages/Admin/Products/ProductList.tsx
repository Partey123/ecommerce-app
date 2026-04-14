import DataTable from "../../../components/admin/DataTable";
import StatusBadge from "../../../components/admin/StatusBadge";
import { adminProducts } from "../adminData";

const ProductList = () => {
  return (
    <section>
      <h2>Products</h2>
      <p>Manage inventory, pricing, and publish state.</p>
      <DataTable
        rows={adminProducts}
        columns={[
          { key: "id", header: "SKU" },
          { key: "name", header: "Product" },
          { key: "category", header: "Category" },
          { key: "price", header: "Price", render: (row) => `GHS ${row.price}` },
          { key: "stock", header: "Stock" },
          { key: "status", header: "Status", render: (row) => <StatusBadge status={row.status} /> },
        ]}
      />
    </section>
  );
};

export default ProductList;

