"use client";

import { Icon } from "@iconify/react";

type AppIconProps = {
    name: string;
    size?: number;
    className?: string;
};

export default function AppIcon({
    name,
    size = 24,
    className,
}: AppIconProps) {
    return (
        <Icon
            icon={`material-symbols:${name}`}
            width={size}
            height={size}
            className={className}
        />
    );
}
