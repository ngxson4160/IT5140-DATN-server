import { Controller, Get } from '@nestjs/common';
import { CityService } from './city.service';
import { Public } from 'src/auth/decorator/public.decorator';

@Controller('cities')
export class CityController {
  constructor(private readonly cityService: CityService) {}

  @Public()
  @Get()
  getListCity() {
    return this.cityService.getListCity();
  }

  @Public()
  @Get('districts')
  getListCityAndDistrict() {
    return this.cityService.getListCityAndDistrict();
  }
}
