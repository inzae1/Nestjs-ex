import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeORMConfig: TypeOrmModuleOptions = {
  // Database Type
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'postgres',
  // Entities to be loaded for this connection
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  synchronize: true,
};
