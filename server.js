require('dotenv').config();
const http = require('http');
const connectDB = require('./config/db');
const app = require('./app');
const { initSocket } = require('./utils/socket');
const logger = require('./utils/logger');

connectDB();

// Tạo HTTP server thủ công (thay vì app.listen trực tiếp) vì Socket.IO cần
// gắn vào cùng 1 HTTP server với Express để dùng chung cổng.
const httpServer = http.createServer(app);

initSocket(httpServer, process.env.CLIENT_URL || '*');

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  logger.info(`Server đang chạy tại http://localhost:${PORT} [${process.env.NODE_ENV || 'development'}]`);
});

// Bắt các lỗi promise bị reject nhưng không được catch (vd: mất kết nối MongoDB đột ngột)
process.on('unhandledRejection', (err) => {
  logger.error(`UNHANDLED REJECTION: ${err.message}`, { stack: err.stack });
  httpServer.close(() => process.exit(1));
});

// Bắt lỗi đồng bộ không được catch ở bất kỳ đâu trong ứng dụng, ghi log trước khi thoát
// để không mất dấu vết lỗi (thay vì để process crash âm thầm).
process.on('uncaughtException', (err) => {
  logger.error(`UNCAUGHT EXCEPTION: ${err.message}`, { stack: err.stack });
  process.exit(1);
});
