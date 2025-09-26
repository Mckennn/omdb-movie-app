import { useState } from "react";

const FALLBACK =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 600"><rect width="100%" height="100%" fill="#0a0a0a"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#666" font-family="Arial" font-size="20">Poster indisponible</text></svg>`
  );

export default function Poster({
  src,
  alt,
  className,
}: {
  src?: string;
  alt: string;
  className?: string;
}) {
  const [err, setErr] = useState(false);
  const valid = src && src !== "N/A" && !err ? src : FALLBACK;
  return (
    <img
      src={valid}
      alt={alt}
      loading="lazy"
      onError={() => setErr(true)}
      className={className}
    />
  );
}
