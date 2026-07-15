export function FlagEN({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 21 15"
      className={className ?? "h-3.5 w-5 shrink-0 rounded-sm shadow-sm"}
      aria-hidden="true"
    >
      <rect width="21" height="15" fill="#012169" />
      <path d="M0 0L21 15M21 0L0 15" stroke="#fff" strokeWidth="3" />
      <path d="M0 0L21 15M21 0L0 15" stroke="#C8102E" strokeWidth="2" />
      <path d="M10.5 0V15M0 7.5H21" stroke="#fff" strokeWidth="5" />
      <path d="M10.5 0V15M0 7.5H21" stroke="#C8102E" strokeWidth="3" />
    </svg>
  );
}
