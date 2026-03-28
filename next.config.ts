import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Allow dev server WebSocket connections from LAN IP addresses.
     Without this, accessing the site via local IP (e.g. http://10.100.102.168:3000)
     causes the HMR WebSocket to be blocked by CSRF protection, which crashes
     React hydration and makes ALL client-side interactivity non-functional. */
  allowedDevOrigins: [
    "10.100.102.168",
    "10.100.102.*",
    "10.*",
    "192.168.*",
    "172.16.*",
  ],
};

export default nextConfig;

