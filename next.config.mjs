import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ["three", "gsap", "@react-three/fiber", "@react-three/drei"],
    eslint: {
        ignoreDuringBuilds: true,
    },
    images: {
        remotePatterns: [
            // Cloudinary CDN — for uploaded audition audio thumbnails, resource thumbnails
            {
                protocol: "https",
                hostname: "res.cloudinary.com",
                pathname: "/ji3d0vql/**",
            },
            // Supabase Storage — for avatar URLs from OAuth providers
            {
                protocol: "https",
                hostname: "wjwjsjzfhcxdrcjugnbp.supabase.co",
            },
            // Google user profile photos (from Google OAuth)
            {
                protocol: "https",
                hostname: "lh3.googleusercontent.com",
            },
            // Cloudflare R2 Public Vault
            {
                protocol: "https",
                hostname: "storage.aflewo.saemstunes.com",
            },
        ],
    },
    webpack: (config) => {
        // Allow importing Lottie JSON files from the context directory
        config.resolve.alias = {
            ...config.resolve.alias,
        };
        return config;
    },
};

export default nextConfig;
