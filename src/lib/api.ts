// The BiscoTech backend. Set NEXT_PUBLIC_API_URL (in Hostinger's environment variables or a
// local .env file) to point somewhere else; it's read at build time, so redeploy after changing
// it. The fallback is the backend's temporary Hostinger address.
export const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "https://bubbly-darkviolet-hedgehog-26.hostingersite.com"
).replace(/\/+$/, "");
