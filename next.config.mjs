/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",              // pure static HTML/CSS/JS → no serverless functions ever
  images: { unoptimized: true }, // no Vercel Image Optimization credits used
  trailingSlash: true,           // stable static routing on CDN (index.html per folder)
};

export default nextConfig;
