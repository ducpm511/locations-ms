import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Tree,
  TreeChildren,
  TreeParent,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Building } from './building.entity';

@Entity()
@Tree('closure-table')
export class Location {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  area: number;

  @Column()
  locationCode: string;

  @ManyToOne(() => Building, (building) => building.locations, {
    nullable: false,
  })
  @JoinColumn({ name: 'buidlingId' })
  building: Building;

  @TreeChildren()
  children: Location[];

  @TreeParent()
  parent: Location;
}
