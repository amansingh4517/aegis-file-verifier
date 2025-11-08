export function AegisLogo({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg" fill="none">
      {/* Shield shape */}
      <defs>
        <linearGradient id="shieldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#1b1b27", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#3c3939", stopOpacity: 1 }} />
        </linearGradient>
      </defs>

      {/* Main shield */}
      <path
        d="M 50 10 L 75 25 L 75 50 C 75 70 50 85 50 85 C 50 85 25 70 25 50 L 25 25 Z"
        fill="url(#shieldGradient)"
        stroke="#1b1b27"
        strokeWidth="1.5"
      />

      {/* Inner glow shield */}
      <path
        d="M 50 15 L 70 27 L 70 50 C 70 67 50 80 50 80 C 50 80 30 67 30 50 L 30 27 Z"
        fill="none"
        stroke="#e1e1ea"
        strokeWidth="1"
        opacity="0.5"
      />

      {/* Checkmark - represents verification */}
      <g transform="translate(50, 50)">
        <path
          d="M -8 -2 L -2 4 L 8 -6"
          stroke="white"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  )
}
