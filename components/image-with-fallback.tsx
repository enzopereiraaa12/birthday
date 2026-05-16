"use client";

import { useState } from "react";

export default function ImageWithFallback({
  src,
  fallback,
  alt,
  className = "",
  fit = "cover",
  position = "50% 50%"
}: {
  src: string;
  fallback: string;
  alt: string;
  className?: string;
  fit?: "cover" | "contain";
  position?: string;
}) {
  const [currentSrc, setCurrentSrc] = useState(src);

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      style={{ objectFit: fit, objectPosition: position }}
      onError={() => {
        if (currentSrc !== fallback) setCurrentSrc(fallback);
      }}
    />
  );
}
