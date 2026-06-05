import dns from "node:dns/promises";
dns.setServers(["1.1.1.1"]);

import app from './app';
import mongoose from 'mongoose';
import { runAutoMigration } from './db/migrate';

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/southcape-ecommerce';

mongoose
  .connect(MONGO_URI)
  .then(async () => {
    console.log('Đã kết nối thành công tới MongoDB.');
    // Chạy tự động migrate & seed dữ liệu mẫu nếu biến môi trường được bật
    if (process.env.CREATE_SAMPLE_DATA === 'true') {
      await runAutoMigration();
    } else {
      console.log('[Migration] Bỏ qua chạy tự động Migrate & Seed (CREATE_SAMPLE_DATA != true).');
    }

    app.listen(PORT, () => {
      console.log(`Server đang chạy tại cổng http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Lỗi kết nối MongoDB:', err.message);
    console.log('Khởi chạy server ở chế độ Demo (không kết nối cơ sở dữ liệu)...');
    app.listen(PORT, () => {
      console.log(`Server đang chạy tại cổng http://localhost:${PORT}`);
    });
  });
