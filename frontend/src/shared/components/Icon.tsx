type IconName =
  | 'search'
  | 'plus'
  | 'edit'
  | 'trash'
  | 'building'
  | 'phone'
  | 'mail'
  | 'chevron-left'
  | 'chevron-right'
  | 'camera'
  | 'lock'
  | 'close'
  | 'logout'
  | 'check';

type IconProps = {
  name: IconName;
  size?: number;
  className?: string;
};

const paths: Record<IconName, React.ReactNode> = {
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4 4" />
    </>
  ),

  plus: (
    <>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </>
  ),

  edit: (
    <>
      <path d="M4 20h4l10.5-10.5a2.8 2.8 0 0 0-4-4L4 16v4Z" />
      <path d="m13.5 6.5 4 4" />
    </>
  ),

  trash: (
    <>
      <path d="M4 7h16" />
      <path d="M9 7V4h6v3" />
      <path d="M7 7l1 13h8l1-13" />
      <path d="M10 11v5" />
      <path d="M14 11v5" />
    </>
  ),

  building: (
    <>
      <path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16" />
      <path d="M3 21h18" />
      <path d="M9 7h2" />
      <path d="M13 7h2" />
      <path d="M9 11h2" />
      <path d="M13 11h2" />
      <path d="M10 21v-5h4v5" />
    </>
  ),

  phone: (
    <path d="M6.6 3.8 9 3l2 5-2.3 1.4a15 15 0 0 0 5.9 5.9L16 13l5 2-0.8 2.4a3 3 0 0 1-3.2 2A16 16 0 0 1 4.6 7a3 3 0 0 1 2-3.2Z" />
  ),

  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </>
  ),

  'chevron-left': <path d="m15 18-6-6 6-6" />,

  'chevron-right': <path d="m9 18 6-6-6-6" />,

  camera: (
    <>
      <path d="M5 7h3l1.5-2h5L16 7h3a2 2 0 0 1 2 2v9H3V9a2 2 0 0 1 2-2Z" />
      <circle cx="12" cy="13" r="3.5" />
    </>
  ),

  lock: (
    <>
      <rect x="5" y="10" width="14" height="11" rx="3" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </>
  ),

  close: (
    <>
      <path d="m7 7 10 10" />
      <path d="m17 7-10 10" />
    </>
  ),

  logout: (
    <>
      <path d="M10 7V5.8A1.8 1.8 0 0 1 11.8 4H17a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-5.2a1.8 1.8 0 0 1-1.8-1.8V17" />
      <path d="M14 12H4" />
      <path d="M7.5 8.5 4 12l3.5 3.5" />
    </>
  ),

  check: <path d="m5 12 4.5 4.5L19 7" />
};

export function Icon({ name, size = 18, className = '' }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      aria-hidden="true"
      focusable="false"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  );
}
