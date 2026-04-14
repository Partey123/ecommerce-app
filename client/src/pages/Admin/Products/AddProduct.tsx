import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { supabaseClient } from "../../../lib/supabaseClient";
import { adminService } from "../../../services/adminService";
import { productService } from "../../../services/productService";

const AddProduct = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState(0);
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadCategories = async () => {
      const response = await productService.listCategories();
      setCategories(response.categories);
    };
    void loadCategories();
  }, []);

  const toSlug = (value: string) =>
    value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const {
        data: { session },
      } = await supabaseClient.auth.getSession();
      if (!session?.access_token) throw new Error("Not authenticated");

      const response = await adminService.createProduct(session.access_token, {
        name,
        slug: toSlug(name),
        description,
        category_id: categoryId || null,
        price_ghs: Number(price),
        stock: Number(stock),
        images: imageUrl ? [imageUrl] : [],
        is_active: true,
      });

      setMessage("Product created.");
      navigate(`/admin/products/${response.product.id}/edit`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to create product");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section>
      <h2>Add Product</h2>
      <p>Create a new product listing for the storefront.</p>
      <form className="admin-form-grid" onSubmit={(event) => void handleSubmit(event)}>
        <label>
          Product Name
          <input placeholder="Product name" value={name} onChange={(event) => setName(event.target.value)} required />
        </label>
        <label>
          Category
          <select value={categoryId} onChange={(event) => setCategoryId(event.target.value)}>
            <option value="" disabled>
              Select category
            </option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Price (GHS)
          <input
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
            value={price}
            onChange={(event) => setPrice(Number(event.target.value))}
            required
          />
        </label>
        <label>
          Stock
          <input
            type="number"
            min="0"
            placeholder="0"
            value={stock}
            onChange={(event) => setStock(Number(event.target.value))}
            required
          />
        </label>
        <label className="admin-full">
          Main Image URL
          <input value={imageUrl} onChange={(event) => setImageUrl(event.target.value)} placeholder="https://..." />
        </label>
        <label className="admin-full">
          Description
          <textarea
            rows={4}
            placeholder="Write a product description..."
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </label>
        <div>
          <button type="submit" className="admin-btn primary" disabled={saving}>
            {saving ? "Saving..." : "Save Product"}
          </button>
        </div>
      </form>
      {message ? <p style={{ marginTop: "0.75rem" }}>{message}</p> : null}
    </section>
  );
};

export default AddProduct;

