import { useState } from "react";
import type { FormEvent } from "react";

const StoreSettings = () => {
  const [storeName, setStoreName] = useState("LuxeMart");
  const [currency, setCurrency] = useState("GHS");
  const [contactEmail, setContactEmail] = useState("support@luxemart.com");
  const [contactPhone, setContactPhone] = useState("+233 20 000 0000");
  const [description, setDescription] = useState(
    "Luxury essentials curated for modern living."
  );
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    localStorage.setItem(
      "adminStoreSettings",
      JSON.stringify({
        storeName,
        currency,
        contactEmail,
        contactPhone,
        description,
      })
    );

    setMessage("Settings saved.");
  };

  return (
    <section>
      <h2>Store Settings</h2>
      <p>Configure key storefront settings.</p>
      <form className="admin-form-grid" onSubmit={handleSubmit}>
        <label>
          Store Name
          <input value={storeName} onChange={(event) => setStoreName(event.target.value)} />
        </label>
        <label>
          Currency
          <select value={currency} onChange={(event) => setCurrency(event.target.value)}>
            <option value="GHS">GHS</option>
            <option value="USD">USD</option>
          </select>
        </label>
        <label>
          Contact Email
          <input value={contactEmail} onChange={(event) => setContactEmail(event.target.value)} />
        </label>
        <label>
          Contact Phone
          <input value={contactPhone} onChange={(event) => setContactPhone(event.target.value)} />
        </label>
        <label className="admin-full">
          Store Description
          <textarea rows={4} value={description} onChange={(event) => setDescription(event.target.value)} />
        </label>
        <div>
          <button type="submit" className="admin-btn primary">
            Save Settings
          </button>
        </div>
      </form>
      {message ? <p style={{ marginTop: "0.75rem" }}>{message}</p> : null}
    </section>
  );
};

export default StoreSettings;

