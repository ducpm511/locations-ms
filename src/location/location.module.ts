import { Module, ValidationPipe } from '@nestjs/common';
import { LocationService } from './location.service';
import { LocationController } from './location.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Location } from 'src/entities/location.entity';
import { APP_PIPE } from '@nestjs/core';
import { Building } from 'src/entities/building.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Location, Building])],
  controllers: [LocationController],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    },
    LocationService,
  ],
})
export class LocationModule {}
