import { useState } from "react";
import { adminCategories } from "../adminData";

const CategoryManager = () => {
  const [categories] = useState(adminCategories);

  return (
    <section>
      <h2>Categories</h2>
      <p>Manage product taxonomy and storefront grouping.</p>
      <div className="admin-card" style={{ marginTop: "1rem" }}>
        <ul style={{ margin: 0, paddingLeft: "1rem" }}>
          {categories.map((category) => (
            <li key={category} style={{ marginBottom: "0.5rem" }}>
              {category}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default CategoryManager;

