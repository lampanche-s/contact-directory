import { Icon } from '../../../shared/components/Icon';

type AdminAccessButtonProps = {
  onClick: () => void;
};

export function AdminAccessButton({ onClick }: AdminAccessButtonProps) {
  return (
    <button
      type="button"
      className="admin-access-btn"
      onClick={onClick}
      aria-label="Administrative access"
      title="Administrative access"
    >
      <Icon name="lock" size={17} />
    </button>
  );
}
