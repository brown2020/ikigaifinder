interface IkigaiLogoProps {
  className?: string;
}

/** Brand mark: four overlapping circles with a vermilion center. */
export default function IkigaiLogo({ className = "size-8" }: IkigaiLogoProps): React.ReactElement {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="1.6">
        <circle cx="20" cy="13" r="9" />
        <circle cx="13" cy="20" r="9" />
        <circle cx="27" cy="20" r="9" />
        <circle cx="20" cy="27" r="9" />
      </g>
      <circle cx="20" cy="20" r="3.2" fill="#b8401a" />
    </svg>
  );
}
