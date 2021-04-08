import {Entity, model, property} from '@loopback/repository';

@model({settings: {}})
export class Rap extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  maRap?: number;

  @property({
    type: 'string',
    required: true,
  })
  tenRap: string;

  @property({
    type: 'number',
    required: true,
  })
  soGhe: number;

  @property({
    type: 'number',
    required: true,
  })
  maCumRap: number;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Rap>) {
    super(data);
  }
}

export interface RapRelations {
  // describe navigational properties here
}

export type RapWithRelations = Rap & RapRelations;
