import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UniqueCodeService } from './unique-code.service';
import { UniqueCode } from './entities/UniqueCode';
import { ShortLongMap } from './entities/ShortLongMap';
import { ShortLongMapService } from './short-long-map.service';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '127.0.0.1',
      port: 3306,
      username: 'root',
      password: '123456',
      database: 'short-url',
      synchronize: true,
      logging: true,
      entities: [UniqueCode, ShortLongMap],
      connectorPackage: 'mysql2',
    }),
  ],
  controllers: [AppController],
  providers: [AppService, UniqueCodeService, ShortLongMapService],
})
export class AppModule {}
