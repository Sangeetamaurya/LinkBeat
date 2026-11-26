// iTunes artwork urls end with a size like "100x100bb.jpg". We can ask for other sizes.
const SIZE_RE = /\d+x\d+(bb)?(\.\w+)$/;

function coverAt(url, size) {
  if (!url) return '';
  const https = url.replace(/^http:/, 'https:');
  return SIZE_RE.test(https) ? https.replace(SIZE_RE, size + 'x' + size + 'bb$2') : https;
}

module.exports = { coverAt };
