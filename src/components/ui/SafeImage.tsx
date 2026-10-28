import Image from "next/image";
import { resolveDisplaySrc } from "@/utils/mediaSrc";
import { cn } from "@/utils/cn";

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
  width?: number;
  height?: number;
}

/** Renders a static asset with next/image, or a same-origin/avatar URL with a plain img. */
export default function SafeImage({ src, alt, className, fill, sizes, priority, width, height }: SafeImageProps) {
  const resolved = resolveDisplaySrc(src, process.env.NEXT_PUBLIC_FIREBASE_STORAGEBUCKET);
  if (!resolved) return null;
  if (resolved.optimized) {
    if (fill) {
      return <Image src={resolved.src} alt={alt} fill sizes={sizes} className={className} priority={priority} />;
    }
    return <Image src={resolved.src} alt={alt} width={width ?? 64} height={height ?? 64} className={className} priority={priority} />;
  }
  return (
    // User media is served by this origin (or loaded by the browser for Google avatars), not the image optimizer.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={resolved.src}
      alt={alt}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      className={fill ? cn("absolute inset-0 size-full", className) : className}
      fetchPriority={priority ? "high" : undefined}
    />
  );
}
