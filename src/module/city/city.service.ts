import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CityService {
  constructor(private readonly prisma: PrismaService) {}

  async getListCity() {
    const listCity = await this.prisma.city.findMany();
    return listCity;
  }

  async getListCityAndDistrict() {
    const listCityAndDistrict = await this.prisma.city.findMany({
      select: {
        id: true,
        name: true,
        districts: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    return listCityAndDistrict;
  }
}
