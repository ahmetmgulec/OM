import React, { useState, useEffect } from 'react';
import './Avatar.css';

/** Fallback avatar URL from DiceBear (initials from name) - no API key, no upload */
function getFallbackAvatarUrl(name: string): string {
  const seed = name?.trim() || 'anonymous';
  return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(seed)}&backgroundColor=5865f2`;
}

interface AvatarProps {
  avatarUrl?: string | null;
  name?: string;
  size?: number;
  className?: string;
}

export function Avatar({ avatarUrl, name, size = 32, className = '' }: AvatarProps) {
  const customUrl = avatarUrl?.trim();
  const fallbackUrl = getFallbackAvatarUrl(name || '');
  const [useFallback, setUseFallback] = useState(false);
  const src = customUrl && !useFallback ? customUrl : fallbackUrl;

  // Reset fallback when avatarUrl changes so we retry loading (e.g. after DB update)
  useEffect(() => {
    setUseFallback(false);
  }, [avatarUrl]);

  const handleError = () => {
    if (customUrl) setUseFallback(true);
  };

  return (
    <img
      src={src}
      alt=""
      className={`avatar ${className}`}
      style={{ width: size, height: size }}
      loading="lazy"
      onError={handleError}
    />
  );
}
