'use strict';

/**
 * Cau hinh PM2 de quan ly ca 2 tien trinh tren VPS:
 * 1. aicontent-web: Web server Next.js (Standalone mode, cong 6980)
 * 2. aicontent-worker: Background worker lang nghe hang doi PostgreSQL va goi AI
 *
 * Lenh su dung tren VPS:
 * - Khoi dong: pm2 start ecosystem.config.cjs
 * - Xem trang thai: pm2 status
 * - Xem log truc tiep: pm2 logs
 * - Reload khong gián đoạn: pm2 reload all
 * - Luu khoi dong cung VPS: pm2 startup && pm2 save
 */

module.exports = {
  apps: [
    {
      name: 'aicontent-web',
      script: '.next/standalone/server.js',
      node_args: '-r dotenv/config',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production',
        PORT: 6980,
        HOSTNAME: '0.0.0.0',
      },
    },
    {
      name: 'aicontent-worker',
      script: 'workers/model/index.js',
      node_args: '-r dotenv/config',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      restart_delay: 2000,
      max_memory_restart: '400M',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
