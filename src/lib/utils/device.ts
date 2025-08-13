export function isMobileUserAgent(ua: string | null | undefined): boolean {
  if (!ua) return false;
  const s = ua.toLowerCase();
  return /iphone|ipad|ipod|android|blackberry|windows phone|opera mini|mobile|mobi/.test(s);
}
