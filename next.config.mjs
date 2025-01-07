/** @type {import('next').NextConfig} */

const isDev = process.env.NODE_ENV === 'development';

const nextConfig = {
    output: isDev ? 'standalone' : 'export',
    basePath: isDev ? '' : '/test-mate',
    assetPrefix: isDev ? '' : '/test-mate',
};

export default nextConfig;
