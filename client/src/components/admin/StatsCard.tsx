type StatsCardProps = {
  title: string;
  value: string;
  subtitle?: string;
};

const StatsCard = ({ title, value, subtitle }: StatsCardProps) => {
  return (
    <article className="admin-card">
      <h4>{title}</h4>
      <div className="admin-card-value">{value}</div>
      {subtitle ? <p>{subtitle}</p> : null}
    </article>
  );
};

export default StatsCard;

