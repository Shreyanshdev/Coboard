import React from "react";

export const DotMatrixArrow: React.FC<{ className?: string }> = ({ className = "" }) => {
  const dots = [
    [0.18, 0.18, 0.18, 0.18, 0.85, 0.18, 0.18],
    [0.18, 0.18, 0.18, 0.18, 0.35, 0.95, 0.18],
    [0.18, 0.18, 0.18, 0.18, 0.35, 0.45, 1.0],
    [0.18, 0.18, 0.18, 0.18, 0.35, 0.95, 0.18],
    [0.18, 0.18, 0.18, 0.18, 0.85, 0.18, 0.18],
  ];

  return (
    <div className={`flex flex-col gap-[3px] items-center group-hover:translate-x-1 transition-transform duration-300 ${className}`}>
      {dots.map((row, rIdx) => (
        <div key={rIdx} className="flex gap-[3px]">
          {row.map((opacity, cIdx) => (
            <span
              key={cIdx}
              className="w-[2.8px] h-[2.8px] rounded-full"
              style={{
                backgroundColor: opacity > 0.5 ? "#543828" : "#8c7b6f",
                opacity: opacity,
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

/**
 * Premium Architectural Drafting Pen Nib Vector
 */
export const DraftingNibSvg: React.FC<{ className?: string }> = ({ className = "w-7 h-7" }) => (
  <svg
    viewBox="0 0 36 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <linearGradient id="nibBody" x1="6" y1="4" x2="30" y2="32" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
        <stop offset="50%" stopColor="#ffeedd" stopOpacity="0.85" />
        <stop offset="100%" stopColor="#e5a882" stopOpacity="0.9" />
      </linearGradient>
      <linearGradient id="nibFacet" x1="18" y1="4" x2="30" y2="28" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.5" />
        <stop offset="100%" stopColor="#8c3a14" stopOpacity="0.25" />
      </linearGradient>
      <linearGradient id="goldAccent" x1="12" y1="16" x2="24" y2="16" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#ffd89b" />
        <stop offset="100%" stopColor="#e67e22" />
      </linearGradient>
    </defs>
    {/* Main Nib Body Silhouette */}
    <path
      d="M18 3.5 L29 16 C27.5 22, 26 27, 24.5 32.5 L11.5 32.5 C10 27, 8.5 22, 7 16 Z"
      fill="url(#nibBody)"
      stroke="#52200a"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
    {/* Right Geometric Facet Shadow */}
    <path
      d="M18 3.5 L29 16 C27.5 22, 26 27, 24.5 32.5 L18 32.5 Z"
      fill="url(#nibFacet)"
    />
    {/* Center Slit & Breather Circle */}
    <line
      x1="18"
      y1="3.5"
      x2="18"
      y2="17"
      stroke="#52200a"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <circle
      cx="18"
      cy="18.5"
      r="2.4"
      fill="#52200a"
      stroke="url(#goldAccent)"
      strokeWidth="0.8"
    />
    {/* Base Collar Ring */}
    <path
      d="M10.8 28.5 L25.2 28.5"
      stroke="#8c3a14"
      strokeWidth="1.4"
      strokeLinecap="round"
    />
  </svg>
);

/**
 * Premium Quantum Sync / Real-time Synapse Nexus Vector
 */
export const QuantumSyncSvg: React.FC<{ className?: string }> = ({ className = "w-7 h-7" }) => (
  <svg
    viewBox="0 0 36 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <linearGradient id="orbitGrad1" x1="4" y1="18" x2="32" y2="18" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#fff8e7" />
        <stop offset="50%" stopColor="#f39c12" />
        <stop offset="100%" stopColor="#ffffff" />
      </linearGradient>
      <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="60%" stopColor="#f1c40f" />
        <stop offset="100%" stopColor="#d35400" />
      </radialGradient>
    </defs>
    {/* Diagonal Orbit 1 */}
    <ellipse
      cx="18"
      cy="18"
      rx="14"
      ry="5.5"
      transform="rotate(-30 18 18)"
      stroke="url(#orbitGrad1)"
      strokeWidth="1.6"
      strokeDasharray="28 4"
      strokeLinecap="round"
    />
    {/* Diagonal Orbit 2 */}
    <ellipse
      cx="18"
      cy="18"
      rx="14"
      ry="5.5"
      transform="rotate(30 18 18)"
      stroke="url(#orbitGrad1)"
      strokeWidth="1.6"
      strokeDasharray="24 6"
      strokeLinecap="round"
    />
    {/* Horizontal Orbit 3 */}
    <ellipse
      cx="18"
      cy="18"
      rx="13.5"
      ry="5.5"
      transform="rotate(90 18 18)"
      stroke="url(#orbitGrad1)"
      strokeWidth="1.4"
      strokeOpacity="0.75"
    />
    {/* Satellite Signal Nodes */}
    <circle cx="7" cy="11.5" r="1.8" fill="#ffffff" stroke="#965a04" strokeWidth="0.8" />
    <circle cx="29" cy="24.5" r="1.8" fill="#ffffff" stroke="#965a04" strokeWidth="0.8" />
    <circle cx="29" cy="11.5" r="1.8" fill="#ffffff" stroke="#965a04" strokeWidth="0.8" />
    {/* Luminous Central Quantum Core */}
    <circle cx="18" cy="18" r="4.2" fill="url(#coreGlow)" stroke="#ffffff" strokeWidth="1.2" />
  </svg>
);

/**
 * Premium Generative Rough / Polyhedral Geodesic Wireframe Vector
 */
export const RoughPolyhedronSvg: React.FC<{ className?: string }> = ({ className = "w-7 h-7" }) => (
  <svg
    viewBox="0 0 36 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <linearGradient id="roughFacet1" x1="18" y1="4" x2="31" y2="18" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#e0f2fe" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.4" />
      </linearGradient>
      <linearGradient id="roughFacet2" x1="18" y1="4" x2="5" y2="18" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#0284c7" stopOpacity="0.35" />
      </linearGradient>
      <linearGradient id="roughFacet3" x1="18" y1="32" x2="18" y2="18" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#0369a1" stopOpacity="0.5" />
        <stop offset="100%" stopColor="#e0f2fe" stopOpacity="0.75" />
      </linearGradient>
    </defs>
    {/* Top-Right Facet */}
    <polygon
      points="18,4 31,14 18,20"
      fill="url(#roughFacet1)"
      stroke="#164e63"
      strokeWidth="1.4"
      strokeLinejoin="round"
    />
    {/* Top-Left Facet */}
    <polygon
      points="18,4 5,14 18,20"
      fill="url(#roughFacet2)"
      stroke="#164e63"
      strokeWidth="1.4"
      strokeLinejoin="round"
    />
    {/* Bottom-Left Facet */}
    <polygon
      points="5,14 18,32 18,20"
      fill="url(#roughFacet3)"
      stroke="#164e63"
      strokeWidth="1.4"
      strokeLinejoin="round"
    />
    {/* Bottom-Right Facet */}
    <polygon
      points="31,14 18,32 18,20"
      fill="url(#roughFacet1)"
      stroke="#164e63"
      strokeWidth="1.4"
      strokeLinejoin="round"
    />
    {/* Generative Rough Sketchy Accent Lines */}
    <path
      d="M18 4.5 L30.5 14.5 M18.5 4.2 L5.5 13.8 M18 20.5 L18 31.5"
      stroke="#ffffff"
      strokeWidth="0.9"
      strokeLinecap="round"
      strokeOpacity="0.8"
    />
    {/* Crystalline Vertex Nodes */}
    <circle cx="18" cy="4" r="1.5" fill="#ffffff" stroke="#083344" strokeWidth="0.8" />
    <circle cx="5" cy="14" r="1.5" fill="#ffffff" stroke="#083344" strokeWidth="0.8" />
    <circle cx="31" cy="14" r="1.5" fill="#ffffff" stroke="#083344" strokeWidth="0.8" />
    <circle cx="18" cy="32" r="1.5" fill="#ffffff" stroke="#083344" strokeWidth="0.8" />
    <circle cx="18" cy="20" r="1.8" fill="#bae6fd" stroke="#083344" strokeWidth="1" />
  </svg>
);
