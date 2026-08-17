import { Icon } from '../../../shared/components/Icon';

type ContactSearchProps = {
  value: string;
  onChange: (value: string) => void;
};

export function ContactSearch({ value, onChange }: ContactSearchProps) {
  return (
    <div className="directory-search-block">
      <h2>Search contacts</h2>

      <label htmlFor="contact-search" className="sr-only">
        Search by name, department, or extension
      </label>

      <div className="directory-search-input-wrap">
        <span className="directory-search-icon" aria-hidden="true">
          <Icon name="search" size={17} />
        </span>
        <input
          id="contact-search"
          type="search"
          placeholder="Name, department, or extension"
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      </div>
    </div>
  );
}
