import type { DeviceTier } from "@/hooks/useDeviceTier";

export interface IslandTierConfig {
    /** Max width of the pill in its collapsed (resting) state */
    collapsedMaxWidth: number;
    /** Max width of the pill when fully expanded inline */
    expandedMaxWidth: number | string;
    /** GlassSurface blur radius — scaled down on mobile to protect GPU budget */
    blur: number;
    /** Height of the embedded map iframe in the expanded card */
    mapHeight: number;
    /** Whether the < > chevrons hide until hover (desktop only — no hover on touch) */
    chevronRequiresHover: boolean;
}

export const ISLAND_CONFIG: Record<DeviceTier, IslandTierConfig> = {
    mobile: {
        collapsedMaxWidth: 300,
        expandedMaxWidth: "calc(100vw - 32px)", // perfectly edge-to-edge with 16px padding
        blur: 8,                 // lighter blur — real GPU cost mitigation on mobile
        mapHeight: 150,
        chevronRequiresHover: false,
    },
    tablet: {
        collapsedMaxWidth: 340,
        expandedMaxWidth: 420,
        blur: 14,
        mapHeight: 175,
        chevronRequiresHover: false,
    },
    desktop: {
        collapsedMaxWidth: 340,
        expandedMaxWidth: 460,
        blur: 18,                // full premium glass on powerful desktop GPUs
        mapHeight: 200,
        chevronRequiresHover: true,
    },
};
