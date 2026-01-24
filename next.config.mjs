const nextConfig = {
    transpilePackages: ["three", "gsap", "@react-three/fiber", "@react-three/drei"],
    eslint: {
        ignoreDuringBuilds: true,
    },
};

export default nextConfig;
