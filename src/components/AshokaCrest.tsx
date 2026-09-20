/* Ashoka Chakra — simplified SVG crest for header */
export function AshokaCrest({ size = 36 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Government of India emblem"
    >
      {/* Outer circle */}
      <circle cx="18" cy="18" r="16" stroke="#C0001A" strokeWidth="1.5" fill="none" />
      {/* Inner circle */}
      <circle cx="18" cy="18" r="10" stroke="#C0001A" strokeWidth="1" fill="none" />
      {/* Chakra hub */}
      <circle cx="18" cy="18" r="2.5" fill="#C0001A" />
      {/* 24 spokes */}
      {Array.from({ length: 24 }).map((_, i) => {
        const angle = (i * 360) / 24;
        const rad = (angle * Math.PI) / 180;
        const x1 = 18 + 2.5 * Math.cos(rad);
        const y1 = 18 + 2.5 * Math.sin(rad);
        const x2 = 18 + 9.5 * Math.cos(rad);
        const y2 = 18 + 9.5 * Math.sin(rad);
        return (
          <line
            key={i}
            x1={x1} y1={y1} x2={x2} y2={y2}
            stroke="#C0001A"
            strokeWidth="0.8"
          />
        );
      })}
    </svg>
  );
}
