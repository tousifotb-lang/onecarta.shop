/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
      },
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  typescript: {
    // টাইপস্ক্রিপ্ট এরর থাকলেও জোরপূর্বক বিল্ড কমপ্লিট করার জন্য
    ignoreBuildErrors: true,
  },
  eslint: {
    // লিন্ট বা কোড ফরম্যাটিং এরর ইগনোর করার জন্য
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;