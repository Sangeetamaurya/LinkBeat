function notFound(req, res) {
  res.status(404).json({ error: 'Not found' });
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  if (err.type === 'entity.too.large') return res.status(413).json({ error: 'That is too large to send' });
  if (err.type === 'entity.parse.failed') return res.status(400).json({ error: 'Invalid JSON' });
  const status = err.status || 500;
  if (status >= 500 && status !== 502) console.error(err);
  res.status(status).json({ error: status === 500 ? 'Something went wrong' : err.message });
}

module.exports = { notFound, errorHandler };
