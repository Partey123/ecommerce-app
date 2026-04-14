import DataTable from "../../../components/admin/DataTable";
import StatusBadge from "../../../components/admin/StatusBadge";
import { useAdminProducts } from "../../../features/admin/useAdminProducts";
import { formatCurrency } from "../../../utils/formatCurrency";

const ProductList = () => {
  const { products, loading, error } = useAdminProducts();

  return (
    <section>
      <h2>Products</h2>
      <p>Manage inventory, pricing, and publish state.</p>
      {error ? <div className="admin-empty">{error}</div> : null}
      {loading ? <div className="admin-empty">Loading products...</div> : null}
      <DataTable
        rows={products}
        columns={[
          { key: "id", header: "Product ID" },
          { key: "name", header: "Product" },
          { key: "category_id", header: "Category ID" },
          { key: "price_ghs", header: "Price", render: (row) => formatCurrency(Number(row.price_ghs ?? 0)) },
          { key: "stock", header: "Stock" },
          {
            key: "is_active",
            header: "Status",
            render: (row) => <StatusBadge status={row.is_active ? "ACTIVE" : "DRAFT"} />,
          },
        ]}
      />
    </section>
  );
};

export default ProductList;

