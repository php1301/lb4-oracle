import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: true}})
export class HeThongRap extends Entity {
  @property({
    type: 'string',
    id: true,
  })
  maHeThongRap: string;

  @property({
    type: 'string',
    required: true,
  })
  tenHeThongRap: string;

  @property({
    type: 'string',
    required: true,
  })
  biDanh: string;

  @property({
    type: 'string',
    required: true,
  })
  logo: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<HeThongRap>) {
    super(data);
  }
}

export interface HeThongRapRelations {
  // describe navigational properties here
}

export type HeThongRapWithRelations = HeThongRap & HeThongRapRelations;
