type StatusBadgeProps = {
  status: string;
};

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const tone = status.toLowerCase();
  return <span className={`admin-badge ${tone}`}>{status}</span>;
};

export default StatusBadge;

