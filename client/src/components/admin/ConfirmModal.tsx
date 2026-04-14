type ConfirmModalProps = {
  open: boolean;
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
};

const ConfirmModal = ({
  open,
  title,
  description,
  onConfirm,
  onCancel,
}: ConfirmModalProps) => {
  if (!open) return null;
  return (
    <div className="admin-card" role="dialog" aria-modal="true">
      <h3>{title}</h3>
      <p>{description}</p>
      <div style={{ marginTop: "0.8rem", display: "flex", gap: "0.5rem" }}>
        <button className="admin-btn" onClick={onCancel}>
          Cancel
        </button>
        <button className="admin-btn primary" onClick={onConfirm}>
          Confirm
        </button>
      </div>
    </div>
  );
};

export default ConfirmModal;

