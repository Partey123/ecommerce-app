import { adminCategories } from "../adminData";

const AddProduct = () => {
  return (
    <section>
      <h2>Add Product</h2>
      <p>Create a new product listing for the storefront.</p>
      <form className="admin-form-grid">
        <label>
          Product Name
          <input placeholder="Product name" />
        </label>
        <label>
          Category
          <select defaultValue="">
            <option value="" disabled>
              Select category
            </option>
            {adminCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>
        <label>
          Price (GHS)
          <input type="number" min="0" placeholder="0.00" />
        </label>
        <label>
          Stock
          <input type="number" min="0" placeholder="0" />
        </label>
        <label className="admin-full">
          Description
          <textarea rows={4} placeholder="Write a product description..." />
        </label>
        <div>
          <button type="button" className="admin-btn primary">
            Save Product
          </button>
        </div>
      </form>
    </section>
  );
};

export default AddProduct;

