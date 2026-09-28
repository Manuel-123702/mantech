import Image from 'next/image';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  size?: number;
}

/**
 * ManTech Nexus Official Brand Logo
 * Professional image logo from public/logo.png
 * Standalone image mark with no adjacent text.
 */
export function Logo({ className, size = 44 }: LogoProps) {
  return (
    <Image
      src="/logo.png"
      alt="MANTECH Nexus"
      width={size}
      height={size}
      className={cn('shrink-0 select-none transition-transform duration-300 hover:scale-105', className)}
      priority
    />
  );
}

/**
 * Image-only full logo component (per requirement: no text logo near it).
 */
export function LogoFull({ className, size = 44 }: LogoProps) {
  return <Logo className={className} size={size} />;
}
