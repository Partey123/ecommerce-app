const StoreSettings = () => {
  return (
    <section>
      <h2>Store Settings</h2>
      <p>Configure key storefront settings.</p>
      <form className="admin-form-grid">
        <label>
          Store Name
          <input defaultValue="LuxeMart" />
        </label>
        <label>
          Currency
          <select defaultValue="GHS">
            <option value="GHS">GHS</option>
            <option value="USD">USD</option>
          </select>
        </label>
        <label>
          Contact Email
          <input defaultValue="support@luxemart.com" />
        </label>
        <label>
          Contact Phone
          <input defaultValue="+233 20 000 0000" />
        </label>
        <label className="admin-full">
          Store Description
          <textarea rows={4} defaultValue="Luxury essentials curated for modern living." />
        </label>
        <div>
          <button type="button" className="admin-btn primary">
            Save Settings
          </button>
        </div>
      </form>
    </section>
  );
};

export default StoreSettings;

