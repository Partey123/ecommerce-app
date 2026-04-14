import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { useParams } from "react-router-dom";
import { supabaseClient } from "../../../lib/supabaseClient";
import { adminService } from "../../../services/adminService";
import { productService } from "../../../services/productService";

const EditProduct = () => {
  const { id } = useParams();
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState(0);
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      try {
        const {
          data: { session },
        } = await supabaseClient.auth.getSession();
        if (!session?.access_token) throw new Error("Not authenticated");

        const [categoryResponse, productResponse] = await Promise.all([
          productService.listCategories(),
          adminService.getProduct(session.access_token, id),
        ]);

        setCategories(categoryResponse.categories);

        const product = productResponse.product;
        setName(product.name);
        setSlug(product.slug);
        setCategoryId(product.category_id ?? "");
        setPrice(Number(product.price_ghs));
        setStock(Number(product.stock));
        setDescription(product.description ?? "");
        setImageUrl(product.images[0] ?? "");
        setIsActive(product.is_active);
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [id]);

  const inferredSlug = useMemo(
    () =>
      name
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-"),
    [name]
  );

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!id) return;
    setSaving(true);
    setMessage(null);

    try {
      const {
        data: { session },
      } = await supabaseClient.auth.getSession();
      if (!session?.access_token) throw new Error("Not authenticated");

      await adminService.updateProduct(session.access_token, id, {
        name,
        slug: slug || inferredSlug,
        description,
        category_id: categoryId || null,
        price_ghs: Number(price),
        stock: Number(stock),
        images: imageUrl ? [imageUrl] : [],
        is_active: isActive,
      });
      setMessage("Product updated successfully.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to update product");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section>
      <h2>Edit Product</h2>
      <p>Update listing details and inventory values.</p>
      {loading ? <div className="admin-empty">Loading product...</div> : null}
      <form className="admin-form-grid" onSubmit={(event) => void handleSubmit(event)}>
        <label>
          Product Name
          <input value={name} onChange={(event) => setName(event.target.value)} required />
        </label>
        <label>
          Slug
          <input value={slug} onChange={(event) => setSlug(event.target.value)} placeholder={inferredSlug} required />
        </label>
        <label>
          Category
          <select value={categoryId} onChange={(event) => setCategoryId(event.target.value)}>
            <option value="">No category</option>
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
            value={price}
            onChange={(event) => setPrice(Number(event.target.value))}
            required
          />
        </label>
        <label>
          Stock
          <input type="number" min="0" value={stock} onChange={(event) => setStock(Number(event.target.value))} required />
        </label>
        <label className="admin-full">
          Main Image URL
          <input value={imageUrl} onChange={(event) => setImageUrl(event.target.value)} placeholder="https://..." />
        </label>
        <label>
          Status
          <select
            value={isActive ? "active" : "draft"}
            onChange={(event) => setIsActive(event.target.value === "active")}
          >
            <option value="active">Active</option>
            <option value="draft">Draft</option>
          </select>
        </label>
        <label className="admin-full">
          Description
          <textarea rows={4} value={description} onChange={(event) => setDescription(event.target.value)} />
        </label>
        <div>
          <button type="submit" className="admin-btn primary" disabled={saving || loading}>
            {saving ? "Updating..." : "Update Product"}
          </button>
        </div>
      </form>
      {message ? <p style={{ marginTop: "0.75rem" }}>{message}</p> : null}
    </section>
  );
};

export default EditProduct;

