import React from "react";

export function KazakhOrnamentHeader({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-full max-w-[220px] h-4 ${className}`}
      aria-hidden="true"
    >
      {/* Kazakh horn-style symmetric ornament curve */}
      <path
        d="M10 12C25 4 40 20 55 12C70 4 85 20 100 12C115 4 130 20 145 12C160 4 175 20 190 12"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <circle cx="100" cy="12" r="3.5" fill="currentColor" />
      <circle cx="55" cy="12" r="2.5" fill="currentColor" />
      <circle cx="145" cy="12" r="2.5" fill="currentColor" />
      <path
        d="M90 6C95 2 105 2 110 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M90 18C95 22 105 22 110 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function KazakhCornerOrnament({
  position = "top-left",
  className = "",
}: {
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  className?: string;
}) {
  const transform =
    position === "top-right"
      ? "scale(-1, 1)"
      : position === "bottom-left"
      ? "scale(1, -1)"
      : position === "bottom-right"
      ? "scale(-1, -1)"
      : undefined;

  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-6 h-6 text-yellow-400 ${className}`}
      style={{ transform }}
      aria-hidden="true"
    >
      <path
        d="M2 30V10C2 5.58 5.58 2 10 2H30"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M6 14C6 9.58 9.58 6 14 6H24"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="10" cy="10" r="2" fill="currentColor" />
    </svg>
  );
}
