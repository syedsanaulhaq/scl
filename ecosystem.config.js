module.exports = {
  apps: [
    {
      name: 'scl-backend',
      script: './backend/src/server.js',
      instances: 4,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production'
      },
      error_file: '/var/log/scl/backend-error.log',
      out_file: '/var/log/scl/backend-out.log',
      merge_logs: true,
      autorestart: true,
      max_memory_restart: '500M',
      watch: false,
      ignore_watch: ['node_modules', 'logs', 'frontend'],
      max_restarts: 10,
      min_uptime: '10s'
    }
  ]
};
