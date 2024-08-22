import { Faker } from '@faker-js/faker';
import { Location } from '../entities/location.entity';
import { setSeederFactory } from 'typeorm-extension';

export const LocationFactory = setSeederFactory(Location, (faker: Faker) => {
  const locationNames = [
    'Lobby',
    'Main Hall',
    'Conference Room',
    'Office',
    'Parking Garage',
    'Cafeteria',
  ];
  const buildings = ['A', 'B', 'C'];
  const location = new Location();
  location.name = faker.helpers.arrayElement(locationNames);
  location.building = faker.helpers.arrayElement(buildings);
  location.locationCode = `${location.building}-${location.name}`;
  location.area = faker.number.int({ min: 10, max: 99999 });

  return location;
});
