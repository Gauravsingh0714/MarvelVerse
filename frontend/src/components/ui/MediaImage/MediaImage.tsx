import React, { useState, forwardRef } from 'react';
import { cn } from '../../../utils/cn.js';
import { ResolvedMediaAsset, MediaSize } from '@marvelverse/shared';
import {
  useMovieMedia,
  useSeriesMedia,
  useCharacterMedia,
} from '../../../hooks/useMedia.js';
import { Film, User } from 'lucide-react';
import { Skeleton } from '../Skeleton/Skeleton.js';

export type MediaAspectRatio =
  'poster' | 'backdrop' | 'square' | 'avatar' | 'wide' | 'auto';

export interface MediaImageProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'children'
> {
  // Source inputs
  src?: string | null;
  asset?: ResolvedMediaAsset | null;
  canonicalId?: string | null;
  entityType?: 'movie' | 'series' | 'character';
  mediaKind?: 'poster' | 'backdrop' | 'avatar';
  size?: MediaSize;

  // Visual & Behavioral options
  alt: string;
  aspectRatio?: MediaAspectRatio;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none';
  loading?: 'lazy' | 'eager';
  fallbackIcon?: React.ReactNode;
  fallbackText?: string;
  imgClassName?: string;
}

const aspectRatioClasses: Record<MediaAspectRatio, string> = {
  poster: 'aspect-[2/3]',
  backdrop: 'aspect-[16/9]',
  square: 'aspect-square',
  avatar: 'aspect-square',
  wide: 'aspect-[21/9]',
  auto: '',
};

interface BaseMediaImageProps extends MediaImageProps {
  resolvedUrl?: string | null;
  isLoading?: boolean;
  isMissingOrUnavailable?: boolean;
}

const BaseMediaImageView = forwardRef<HTMLDivElement, BaseMediaImageProps>(
  (
    {
      resolvedUrl,
      isLoading = false,
      isMissingOrUnavailable = false,
      alt,
      aspectRatio = 'auto',
      objectFit = 'cover',
      loading = 'lazy',
      fallbackIcon,
      fallbackText,
      mediaKind = 'poster',
      className,
      imgClassName,
      ...props
    },
    ref
  ) => {
    const [imageError, setImageError] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);

    const showFallback = isMissingOrUnavailable || !resolvedUrl || imageError;

    const defaultFallbackIcon =
      fallbackIcon ||
      (mediaKind === 'avatar' ? (
        <User className="w-8 h-8 text-content-muted" aria-hidden="true" />
      ) : (
        <Film className="w-10 h-10 text-content-muted" aria-hidden="true" />
      ));

    return (
      <div
        ref={ref}
        role="img"
        aria-label={alt}
        className={cn(
          'relative overflow-hidden bg-surface-raised flex items-center justify-center select-none',
          aspectRatioClasses[aspectRatio],
          className
        )}
        {...props}
      >
        {/* Loading state: display shimmer skeleton with matching dimensions */}
        {isLoading && (
          <Skeleton className="absolute inset-0 w-full h-full rounded-none" />
        )}

        {/* Real image presentation */}
        {!showFallback && resolvedUrl && (
          <img
            src={resolvedUrl}
            alt={alt}
            loading={loading}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            className={cn(
              'w-full h-full transition-opacity duration-300 motion-reduce:transition-none',
              objectFit === 'cover' && 'object-cover',
              objectFit === 'contain' && 'object-contain',
              objectFit === 'fill' && 'object-fill',
              imageLoaded ? 'opacity-100' : 'opacity-0',
              imgClassName
            )}
          />
        )}

        {/* Fallback presentation */}
        {showFallback && !isLoading && (
          <div
            className="flex flex-col items-center justify-center p-4 text-center space-y-2 w-full h-full bg-surface-raised border border-stroke-subtle/50 text-content-muted"
            aria-hidden="true"
          >
            {defaultFallbackIcon}
            {fallbackText && (
              <span className="text-xs font-medium text-content-muted line-clamp-1 max-w-[85%]">
                {fallbackText}
              </span>
            )}
          </div>
        )}
      </div>
    );
  }
);

BaseMediaImageView.displayName = 'BaseMediaImageView';

/**
 * Entity-aware wrapper that queries Layer 5 React Query hooks for media bundles.
 */
function EntityMediaImage(
  props: MediaImageProps & {
    canonicalId: string;
    entityType: 'movie' | 'series' | 'character';
  }
) {
  const {
    canonicalId,
    entityType,
    mediaKind = 'poster',
    size = 'medium',
    src,
    asset,
    ...rest
  } = props;

  const movieQuery = useMovieMedia(
    entityType === 'movie' ? canonicalId : null,
    mediaKind === 'poster' ? { posterSize: size } : { backdropSize: size }
  );

  const seriesQuery = useSeriesMedia(
    entityType === 'series' ? canonicalId : null,
    mediaKind === 'poster' ? { posterSize: size } : { backdropSize: size }
  );

  const characterQuery = useCharacterMedia(
    entityType === 'character' ? canonicalId : null,
    { avatarSize: size }
  );

  const activeBundle =
    entityType === 'movie'
      ? movieQuery.data
      : entityType === 'series'
        ? seriesQuery.data
        : characterQuery.data;

  const isLoading =
    entityType === 'movie'
      ? movieQuery.isLoading
      : entityType === 'series'
        ? seriesQuery.isLoading
        : characterQuery.isLoading;

  let resolvedAsset: ResolvedMediaAsset | null = asset ?? null;
  if (!resolvedAsset && activeBundle) {
    if (mediaKind === 'poster') {
      resolvedAsset = activeBundle.primaryPoster ?? null;
    } else if (mediaKind === 'backdrop') {
      resolvedAsset = activeBundle.primaryBackdrop ?? null;
    } else if (mediaKind === 'avatar') {
      resolvedAsset = activeBundle.primaryAvatar ?? null;
    }
  }

  const rawUrl =
    src ||
    (resolvedAsset && !resolvedAsset.isFallback
      ? resolvedAsset.resolvedUrl
      : null);
  const isMissingOrUnavailable =
    !rawUrl ||
    resolvedAsset?.availability === 'missing' ||
    resolvedAsset?.availability === 'unavailable';

  return (
    <BaseMediaImageView
      {...rest}
      src={src}
      asset={resolvedAsset}
      mediaKind={mediaKind}
      resolvedUrl={rawUrl}
      isLoading={isLoading}
      isMissingOrUnavailable={isMissingOrUnavailable}
    />
  );
}

/**
 * Unified MediaImage component connecting Layer 6 React UI to the Layer 4/5 media infrastructure.
 */
export const MediaImage = forwardRef<HTMLDivElement, MediaImageProps>(
  (props, ref) => {
    if (props.canonicalId && props.entityType) {
      return (
        <EntityMediaImage
          {...props}
          canonicalId={props.canonicalId}
          entityType={props.entityType}
        />
      );
    }

    const rawUrl =
      props.src ||
      (props.asset && !props.asset.isFallback ? props.asset.resolvedUrl : null);
    const isMissingOrUnavailable =
      !rawUrl ||
      props.asset?.availability === 'missing' ||
      props.asset?.availability === 'unavailable';

    return (
      <BaseMediaImageView
        {...props}
        ref={ref}
        resolvedUrl={rawUrl}
        isMissingOrUnavailable={isMissingOrUnavailable}
      />
    );
  }
);

MediaImage.displayName = 'MediaImage';
