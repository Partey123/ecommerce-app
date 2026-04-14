import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { adminService } from "../../../services/adminService";
import { supabaseClient } from "../../../lib/supabaseClient";
import type { Category } from "../../../features/products/productTypes";

const CategoryManager = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const toSlug = (value: string) =>
    value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");

  const withToken = async <T,>(fn: (token: string) => Promise<T>): Promise<T> => {
    const {
      data: { session },
    } = await supabaseClient.auth.getSession();
    if (!session?.access_token) throw new Error("Not authenticated");
    return fn(session.access_token);
  };

  const loadCategories = async () => {
    const response = await withToken((token) => adminService.listCategories(token));
    setCategories(response.categories);
  };

  useEffect(() => {
    void loadCategories();
  }, []);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setMessage(null);
    try {
      if (editingCategoryId) {
        await withToken((token) =>
          adminService.updateCategory(token, editingCategoryId, {
            name,
            slug: toSlug(name),
            description,
          })
        );
        setMessage("Category updated.");
      } else {
        await withToken((token) =>
          adminService.createCategory(token, {
            name,
            slug: toSlug(name),
            description,
          })
        );
        setMessage("Category created.");
      }
      setName("");
      setDescription("");
      setEditingCategoryId(null);
      await loadCategories();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to save category");
    }
  };

  return (
    <section>
      <h2>Categories</h2>
      <p>Manage product taxonomy and storefront grouping.</p>
      <form className="admin-form-grid" style={{ marginTop: "1rem" }} onSubmit={(event) => void handleSubmit(event)}>
        <label>
          Category Name
          <input value={name} onChange={(event) => setName(event.target.value)} required />
        </label>
        <label>
          Slug
          <input value={toSlug(name)} disabled />
        </label>
        <label className="admin-full">
          Description
          <textarea
            rows={3}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Describe this category"
          />
        </label>
        <div>
          <button type="submit" className="admin-btn primary">
            {editingCategoryId ? "Update Category" : "Create Category"}
          </button>
        </div>
      </form>
      {message ? <p style={{ marginTop: "0.75rem" }}>{message}</p> : null}
      <div className="admin-card" style={{ marginTop: "1rem" }}>
        <ul style={{ margin: 0, paddingLeft: "1rem", listStyle: "none" }}>
          {categories.map((category) => (
            <li
              key={category.id}
              style={{
                marginBottom: "0.7rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "0.5rem",
              }}
            >
              <div>
                <strong>{category.name}</strong>
                <p style={{ marginTop: "0.2rem" }}>{category.description || "No description"}</p>
              </div>
              <div style={{ display: "flex", gap: "0.4rem" }}>
                <button
                  type="button"
                  className="admin-btn"
                  onClick={() => {
                    setEditingCategoryId(category.id);
                    setName(category.name);
                    setDescription(category.description ?? "");
                  }}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="admin-btn"
                  onClick={async () => {
                    try {
                      setMessage(null);
                      await withToken((token) => adminService.deleteCategory(token, category.id));
                      setMessage("Category deleted.");
                      await loadCategories();
                    } catch (error) {
                      setMessage(error instanceof Error ? error.message : "Failed to delete category");
                    }
                  }}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default CategoryManager;

