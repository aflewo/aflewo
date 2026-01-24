"use client";

import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";

type AppIconProps = {
    name: string;
    size?: number | string;
    className?: string;
    "aria-hidden"?: boolean;
};

/**
 * Centralized Icon component for AFLEWO Connect.
 * Uses Material Symbols from Iconify: https://iconify.design/icon-sets/material-symbols/
 */
export default function AppIcon({
    name,
    size = 24,
    className,
    "aria-hidden": ariaHidden = true,
}: AppIconProps) {
    // Ensure we use the correct material-symbols prefix
    const iconName = name.startsWith("material-symbols:")
        ? name
        : `material-symbols:${name}`;

    return (
        <Icon
            icon={iconName}
            width={size}
            height={size}
            className={cn("flex-shrink-0 transition-colors duration-200", className)}
            aria-hidden={ariaHidden}
        />
    );
}
