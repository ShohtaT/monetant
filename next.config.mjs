/** @types {import('next').NextConfig} */
const nextConfig = {
    eslint: {
      // ESLintの設定をNext.jsの設定に統合
      dirs: ['src'],
      ignoreDuringBuilds: false,
    },
  };
  
  export default nextConfig;
  