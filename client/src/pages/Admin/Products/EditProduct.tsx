import { adminCategories, adminProducts } from "../adminData";

const EditProduct = () => {
  const product = adminProducts[0];

  return (
    <section>
      <h2>Edit Product</h2>
      <p>Update listing details and inventory values.</p>
      <form className="admin-form-grid">
        <label>
          Product Name
          <input defaultValue={product.name} />
        </label>
        <label>
          Category
          <select defaultValue={product.category}>
            {adminCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>
        <label>
          Price (GHS)
          <input type="number" min="0" defaultValue={product.price} />
        </label>
        <label>
          Stock
          <input type="number" min="0" defaultValue={product.stock} />
        </label>
        <label className="admin-full">
          Description
          <textarea rows={4} defaultValue="Timeless design with modern precision craftsmanship." />
        </label>
        <div>
          <button type="button" className="admin-btn primary">
            Update Product
          </button>
        </div>
      </form>
    </section>
  );
};

export default EditProduct;

