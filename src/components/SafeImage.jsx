import { useState } from 'react';
import { ImageOff } from 'lucide-react';

/**
 * Image with graceful fallback: if a photo is missing, a cinematic
 * gradient placeholder appears instead of a broken-image icon.
 */
export default function SafeImage({
  src,
  alt = '',
  className = '',
  imgClassName = '',
  eager = false,
  rounded = true,
  onDoubleClick,
  onClick,
}) {
  const [error, setError] = useState(false);

  if (error || !src) {
    return (
      <div
        role="img"
        aria-label={alt || 'decorative image'}
        className={`flex items-center justify-center bg-gradient-to-br from-ink-800 via-night-600 to-wine-600 ${rounded ? 'rounded-xl' : ''} ${className}`}
        onClick={onClick}
        onDoubleClick={onDoubleClick}
      >
        <ImageOff className="h-8 w-8 text-lilac-300/40" aria-hidden="true" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      onError={() => setError(true)}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      className={`${rounded ? 'rounded-xl' : ''} ${className}`}
      style={imgClassName ? undefined : undefined}
    />
  );
}
