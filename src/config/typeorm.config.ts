import {TypeOrmModuleOptions} from '@nestjs/typeorm';

export const typeOrmConfig:TypeOrmModuleOptions = {
  type:'postgres',
  host:'localhost',
  port:5434,
  username:'postgres',
  password:'docker',
  database:'ArtyPrd',
  entities:[__dirname + '/../**/*.entity.{js,ts}'],
  synchronize:false,
  migrationsTableName: "custom_migration_table",
  migrations: ["migration/*.{js,ts}"],
  cli: {
      migrationsDir: "migration"
  }
};