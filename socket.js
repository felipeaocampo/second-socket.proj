import { readFileSync } from 'fs';
import { io } from 'socket.io-client';

const socket = io('https://basic.html', {
  key: readFileSync('/path/to/client-key.pem'),
  cert: readFileSync('/path/to/client-cert.pem'),
  ca: [readFileSync('/path/to/server-cert.pem')],
});
