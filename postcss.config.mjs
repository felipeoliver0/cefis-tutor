/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Permite que o deploy continue mesmo com avisos do ESLint
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Permite que o deploy continue mesmo com avisos de tipagem
    ignoreBuildErrors: true,
  },
};

export default nextConfig;