const bars = [48, 62, 40, 79, 68, 91, 74];

const SalesChart = () => {
  return (
    <section>
      <h2>Analytics</h2>
      <p>Revenue trend for the last 7 days.</p>
      <div className="admin-card" style={{ marginTop: "1rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: "0.6rem", alignItems: "end", height: "220px" }}>
          {bars.map((value, index) => (
            <div key={index} style={{ textAlign: "center" }}>
              <div
                style={{
                  height: `${value * 2}px`,
                  background: "linear-gradient(180deg,#0f172a,#334155)",
                  borderRadius: "0.6rem 0.6rem 0.2rem 0.2rem",
                }}
              />
              <small>Day {index + 1}</small>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SalesChart;

