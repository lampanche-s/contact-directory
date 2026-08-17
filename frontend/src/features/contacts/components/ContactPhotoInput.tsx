import { useEffect, useRef, useState } from 'react';
import { Icon } from '../../../shared/components/Icon';
import { assertValidImage } from '../../../shared/lib/file';

type PhotoChangeValue = {
  photo: string;
  photoFile: File | null;
  removePhoto: boolean;
};

type ContactPhotoInputProps = {
  value: string;
  onChange: (value: PhotoChangeValue) => void;
};

export function ContactPhotoInput({ value, onChange }: ContactPhotoInputProps) {
  const [fileName, setFileName] = useState(value ? 'Current photo' : 'No photo selected');
  const [error, setError] = useState('');
  const previewUrlRef = useRef<string | null>(null);

  useEffect(() => {
    if (value !== previewUrlRef.current) {
      setFileName(value ? 'Current photo' : 'No photo selected');
    }
  }, [value]);

  useEffect(
    () => () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    },
    []
  );

  function handleChange(file: File | undefined) {
    setError('');

    if (!file) {
      setFileName(value ? 'Current photo' : 'No photo selected');
      return;
    }

    const validationError = assertValidImage(file);

    if (validationError) {
      releasePreviewUrl();
      setError(validationError);
      setFileName('No photo selected');
      onChange({
        photo: '',
        photoFile: null,
        removePhoto: true
      });
      return;
    }

    releasePreviewUrl();

    const previewUrl = URL.createObjectURL(file);
    previewUrlRef.current = previewUrl;

    setFileName(file.name);
    onChange({
      photo: previewUrl,
      photoFile: file,
      removePhoto: false
    });
  }

  function handleRemovePhoto() {
    releasePreviewUrl();
    setError('');
    setFileName('No photo selected');

    onChange({
      photo: '',
      photoFile: null,
      removePhoto: true
    });
  }

  function releasePreviewUrl() {
    if (!previewUrlRef.current) return;

    URL.revokeObjectURL(previewUrlRef.current);
    previewUrlRef.current = null;
  }

  return (
    <aside className="contact-photo-panel">
      <div className="photo-panel-header">
        <div>
          <p className="contact-form-section-title">Photo</p>
          <span>Contact profile image</span>
        </div>
      </div>

      <label htmlFor="contact-photo" className={`new-photo-preview-frame photo-upload-trigger ${value ? 'has-photo' : ''}`}>
        {value ? (
          <>
            <img src={value} alt="Photo preview" />
            <span className="photo-change-overlay">
              <Icon name="camera" size={14} />
              Change photo
            </span>
          </>
        ) : (
          <span className="photo-empty-state">
            <span className="photo-upload-icon">
              <Icon name="camera" size={19} />
            </span>
            <strong>Add photo</strong>
            <small>PNG, JPG ou WEBP</small>
          </span>
        )}
      </label>

      <input
        id="contact-photo"
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="visually-hidden-file"
        onChange={(event) => handleChange(event.target.files?.[0])}
      />

      <div className="photo-status-box">
        <p className="photo-file-name">{fileName}</p>

        {value ? (
          <button type="button" className="photo-remove-button" onClick={handleRemovePhoto}>
            <Icon name="trash" size={13} />
            Remove photo
          </button>
        ) : null}
      </div>

      {error ? <p className="form-error photo-error">{error}</p> : null}

      <p className="photo-help-text">
        The image will be fitted automatically to the contact card.
      </p>
    </aside>
  );
}
