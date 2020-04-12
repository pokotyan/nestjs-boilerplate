export default {
  type: 'postgres' as 'postgres',
  host: process.env.REM_DB_HOST || 'localhost',
  username: process.env.REM_DB_USER || 'postgres',
  password: process.env.REM_DB_PASSWORD || 'postgres',
  database: process.env.REM_DB_DATABASE || 'rem',
  port: process.env.REM_DB_PORT || '5432',
};
