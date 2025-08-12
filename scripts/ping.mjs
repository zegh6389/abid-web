import http from 'node:http';

const port = process.env.PORT || 3000;
const path = process.env.PATHNAME || '/api/health';

const req = http.request({ host: '127.0.0.1', port, path, method: 'GET' }, (res) => {
  console.log('PING', res.statusCode);
  res.resume();
});
req.on('error', (e) => {
  console.error('PING error', e.message);
  process.exit(1);
});
req.end();
