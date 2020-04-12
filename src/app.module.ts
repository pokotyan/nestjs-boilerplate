import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { ConsoleModule } from 'nestjs-console';
import { SampleModule } from './module/sample';
import { Sample } from './entity/sample';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import dbConfig from './config/database';

@Module({
  imports: [
    SampleModule,
    TypeOrmModule.forRoot({
      type: dbConfig.type,
      host: dbConfig.host,
      port: parseInt(dbConfig.port, 10),
      username: dbConfig.username,
      password: dbConfig.password,
      database: dbConfig.database,
      entities: [Sample],
      synchronize: false,
      logging: true,
    }),
    ConsoleModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private connection: Connection) {}
}
