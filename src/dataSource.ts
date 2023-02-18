import 'reflect-metadata';
import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  synchronize: true,
  logging: false,
  entities: ['dist/entities/*.js'],
  type: 'sqlite',
  database: process.env.DATABASE_NAME ?? 'You Forgot to set DATABASE_NAME in .env',
});

await AppDataSource.initialize();
