import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { Location } from '../entities/location.entity';
import { faker } from '@faker-js/faker';

export class MainSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    fatoryManager: SeederFactoryManager,
  ): Promise<any> {
    const locationFactory = fatoryManager.get(Location);

    console.log('Seeding some parent locations...');
    const locationRepo = dataSource.getRepository(Location);
    const locations = await Promise.all(
      Array(5)
        .fill('')
        .map(async () => {
          const location = await locationFactory.make();
          return location;
        }),
    );
    await locationRepo.save(locations);

    console.log('Seeding some child locations...');
    const childLocations = await Promise.all(
      Array(20)
        .fill('')
        .map(async () => {
          const location = await locationFactory.make();
          const parentLocation = await locationRepo.findOne({
            where: {
              id: faker.number.int({
                min: 1,
                max: 5,
              }),
              building: location.building,
            },
          });
          location.parent = parentLocation;
          return location;
        }),
    );
    await locationRepo.save(childLocations);
  }
}
