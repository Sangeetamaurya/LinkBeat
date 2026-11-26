// iTunes artwork urls end with a size like "100x100bb.jpg". We can ask for other sizes.
const SIZE_RE = /\d+x\d+(bb)?(\.\w+)$/;

export function coverAt(url, size) {
  if (!url) return '';
  const https = url.replace(/^http:/, 'https:');
  return SIZE_RE.test(https) ? https.replace(SIZE_RE, size + 'x' + size + 'bb$2') : https;
}

// Try big first, then smaller ones if a size fails to load.
export function coverFallbacks(url) {
  if (!url) return [];
  const https = url.replace(/^http:/, 'https:');
  if (!SIZE_RE.test(https)) return [https];
  return [600, 300, 100].map((s) => coverAt(https, s));
}
