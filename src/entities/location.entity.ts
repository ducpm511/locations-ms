import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Tree,
  TreeChildren,
  TreeParent,
} from 'typeorm';

@Entity()
@Tree('closure-table')
export class Location {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  building: string;

  @Column()
  area: number;

  @Column()
  locationCode: string;

  @TreeChildren()
  children: Location[];

  @TreeParent()
  parent: Location;
}
