"use client";

import Image from "next/image";
import type { NavItem } from "@/types";

// ============================================================================
// Types
// ============================================================================

interface NavMenuIconProps {
  /** Navigation item containing icon/profile data */
  item: NavItem;
  /** Icon size in pixels */
  size?: number;
}

// ============================================================================
// Component
// ============================================================================

/**
 * Shared Navigation Menu Icon Component
 *
 * Renders the appropriate icon for a navigation item:
 * - Profile photo if available
 * - Initial avatar if profile name is set
 * - Lucide icon as fallback
 */
export function NavMenuIcon({
  item,
  size = 24,
}: NavMenuIconProps): React.ReactElement {
  if (item.profileUrl) {
    return (
      <Image
        src={item.profileUrl}
        alt="profile"
        width={size}
        height={size}
        className="object-cover rounded-full"
        style={{ width: size, height: size }}
      />
    );
  }

  if (item.profileName) {
    return (
      <div
        className="bg-white font-medium text-black rounded-full flex items-center justify-center"
        style={{ width: size, height: size, fontSize: size * 0.5 }}
      >
        {item.profileName}
      </div>
    );
  }

  const IconComponent = item.icon;
  return <IconComponent size={size} />;
}

export default NavMenuIcon;
