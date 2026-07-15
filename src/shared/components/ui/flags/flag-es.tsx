export function FlagES({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 21 15"
      className={className ?? "h-3.5 w-5 shrink-0 rounded-sm shadow-sm"}
      aria-hidden="true"
    >
      <rect y="0" width="21" height="4" fill="#C60B1E" />
      <rect y="4" width="21" height="4" fill="#FFC400" />
      <rect y="8" width="21" height="4" fill="#C60B1E" />
      <rect y="12" width="21" height="3" fill="#C60B1E" />
    </svg>
  );
}
