import dbConfig from './src/config/database';

export = {
  type: dbConfig.type,
  host: dbConfig.host,
  port: dbConfig.port,
  database: dbConfig.database,
  username: dbConfig.username,
  password: dbConfig.password,
  synchronize: true,
  logging: true,
  entities: ['src/entity/**.ts'],
  subscribers: [],
  migrations: ['migration/*.ts'],
  cli: {
    migrationsDir: 'migration',
  },
};
