import { useState } from 'react';
import { Button } from '../../../shared/components/Button';
import { Icon } from '../../../shared/components/Icon';
import { Modal } from '../../../shared/components/Modal';

type AdminLoginModalProps = {
  open: boolean;
  errorMessage: string;
  onClose: () => void;
  onLogin: (password: string) => Promise<boolean>;
};

export function AdminLoginModal({ open, errorMessage, onClose, onLogin }: AdminLoginModalProps) {
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      const loggedIn = await onLogin(password);

      if (loggedIn) {
        setPassword('');
        onClose();
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} titleId="login-title" className="login-modal-card">
      <div className="login-modal-brand">
        <div>
          <p className="login-kicker">Restricted area</p>
          <h2 id="login-title">Administrative access</h2>
        </div>
      </div>

      <p className="login-description">Enter the password to access administrative actions.</p>

      <form className="login-form" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="admin-password" className="form-label">Password</label>
          <input
            id="admin-password"
            type="password"
            className="modal-input"
            placeholder="Enter the administrative password"
            autoComplete="current-password"
            value={password}
            disabled={isSubmitting}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>

        {errorMessage ? <p className="login-error">{errorMessage}</p> : null}

        <div className="login-actions">
          <Button type="button" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {!isSubmitting && <Icon name="lock" size={15} />}
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
