import http from 'http';
import app from './app';
import { ENV } from './config/env';
import { initSocket } from './socket';

const PORT = ENV.PORT;
const server = http.createServer(app);

// Initialize Socket.IO real-time server
initSocket(server);

server.listen(PORT, () => {
  console.log(`[MediSlot Backend] Express & Socket.IO server running on http://localhost:${PORT}`);
});
