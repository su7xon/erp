/** @type {import('next').NextConfig} */
const nextConfig = {
    typescript: {
        ignoreBuildErrors: true,
    },
    images: {
        unoptimized: true,
    },
    allowedDevOrigins: ['192.168.1.5', '192.168.1.7', 'localhost', '127.0.0.1'],
}

export default nextConfig