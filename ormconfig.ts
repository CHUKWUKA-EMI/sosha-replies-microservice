/* eslint-disable prettier/prettier */
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Reply } from 'src/replies/entities/reply.entity';
import { config } from 'dotenv';
import * as fs from 'fs';

config();

const ORMCONFIG: TypeOrmModuleOptions = {
  type: 'postgres' || 'cockroachdb',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  cert: fs.readFileSync('./root.crt').toString(),
  ssl: { rejectUnauthorized: false },
  extra: {
    options:
      process.env.NODE_ENV === 'production'
        ? '--cluster=sosha-replies-2153'
        : '',
  },
  synchronize: false,
  logging: true,
  migrationsRun: false,
  entities: [Reply],
  migrations: ['dist/src/migration/*.js'],
  cli: {
    migrationsDir: 'src/migration',
  },
};

export default ORMCONFIG;
