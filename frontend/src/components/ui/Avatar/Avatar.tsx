import React, { forwardRef, useState } from 'react';
import { cn } from '../../../utils/cn.js';
import { useCharacterMedia } from '../../../hooks/useMedia.js';

export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  name?: string;
  size?: AvatarSize;
  canonicalId?: string;
}

const sizeClasses: Record<AvatarSize, string> = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg font-semibold',
};

function getInitials(name?: string): string {
  if (!name) return '';
  const trimmed = name.trim();
  if (!trimmed) return '';
  const parts = trimmed.split(/\s+/);
  if (parts.length === 1) return (parts[0]?.slice(0, 2) || '').toUpperCase();
  const first = parts[0]?.[0] || '';
  const last = parts[parts.length - 1]?.[0] || '';
  return (first + last).toUpperCase();
}

export const BaseAvatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ src, alt = '', name, size = 'md', className, ...props }, ref) => {
    const [imageError, setImageError] = useState(false);
    const initials = getInitials(name);
    const showImage = src && !imageError;

    return (
      <div
        ref={ref}
        role="img"
        aria-label={name ? `Portrait of ${name}` : alt || 'Avatar'}
        className={cn(
          'relative inline-flex items-center justify-center rounded-full overflow-hidden shrink-0 select-none',
          'bg-surface-raised text-content-secondary border border-stroke-subtle font-medium',
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {showImage ? (
          <img
            src={src}
            alt={alt || (name ? `Portrait of ${name}` : 'Avatar')}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover"
          />
        ) : initials ? (
          <span>{initials}</span>
        ) : (
          <svg
            className="w-1/2 h-1/2 text-content-muted"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
        )}
      </div>
    );
  }
);

BaseAvatar.displayName = 'BaseAvatar';

/**
 * CharacterAvatar resolves the canonical character avatar from Layer 4/5 media infrastructure.
 */
export const CharacterAvatar = forwardRef<
  HTMLDivElement,
  AvatarProps & { canonicalId: string }
>(({ canonicalId, src, ...props }, ref) => {
  const { data: mediaBundle } = useCharacterMedia(canonicalId);
  const resolvedSrc =
    src ||
    (mediaBundle?.primaryAvatar && !mediaBundle.primaryAvatar.isFallback
      ? (mediaBundle.primaryAvatar.resolvedUrl ?? undefined)
      : undefined);

  return <BaseAvatar ref={ref} src={resolvedSrc} {...props} />;
});

CharacterAvatar.displayName = 'CharacterAvatar';

/**
 * Avatar component with optional automatic canonicalId resolution.
 */
export const Avatar = forwardRef<HTMLDivElement, AvatarProps>((props, ref) => {
  if (props.canonicalId) {
    return (
      <CharacterAvatar ref={ref} canonicalId={props.canonicalId} {...props} />
    );
  }
  return <BaseAvatar ref={ref} {...props} />;
});

Avatar.displayName = 'Avatar';
