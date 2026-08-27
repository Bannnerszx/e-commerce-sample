/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",              // pure static HTML/CSS/JS → no serverless functions ever
  images: { unoptimized: true }, // no Vercel Image Optimization credits used
  trailingSlash: true,           // stable static routing on CDN (index.html per folder)
  env: {
    // Inline STATICFORMS_API_KEY into the client bundle at build time so the
    // contact form (which runs in the browser) can read it without needing the
    // NEXT_PUBLIC_ prefix. The key is public by design, so this is safe.
    STATICFORMS_API_KEY: process.env.STATICFORMS_API_KEY,
  },
};

export default nextConfig;
