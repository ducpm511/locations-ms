import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  Inject,
  LoggerService,
} from '@nestjs/common';
import { LocationService } from './location.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { PaginationDTO } from './dto/paginationDto';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Controller('location')
export class LocationController {
  constructor(
    private readonly locationService: LocationService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

  @Post()
  create(@Body() createLocationDto: CreateLocationDto) {
    try {
      return this.locationService.create(createLocationDto);
    } catch (error) {
      this.logger.error(
        'Calling create()',
        error.stack,
        LocationController.name,
      );
    }
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDTO) {
    try {
      return this.locationService.findAll(paginationDto);
    } catch (error) {
      this.logger.error(
        'Calling findAll()',
        error.stack,
        LocationController.name,
      );
    }
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id) {
    try {
      return this.locationService.findOne(id);
    } catch (error) {
      this.logger.error(
        'Calling findOne()',
        error.stack,
        LocationController.name,
      );
    }
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id,
    @Body() updateLocationDto: UpdateLocationDto,
  ) {
    try {
      return this.locationService.update(id, updateLocationDto);
    } catch (error) {
      this.logger.error(
        'Calling update()',
        error.stack,
        LocationController.name,
      );
    }
  }
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id) {
    try {
      return this.locationService.delete(id);
    } catch (error) {
      this.logger.error(
        'Calling remove()',
        error.stack,
        LocationController.name,
      );
    }
  }
}
