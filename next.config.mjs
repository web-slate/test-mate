/** @type {import('next').NextConfig} */

const isDev = process.env.NODE_ENV === 'development';

const nextConfig = {
    output: isDev ? 'standalone' : 'export',
    // basePath: '/test-mate',
    // assetPrefix: '',
};

export default nextConfig;
