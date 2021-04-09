import {Entity, model, property, belongsTo} from '@loopback/repository';
import {CumRap} from './cum-rap.model';

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

  @belongsTo(() => CumRap, {name: 'rap_cumRap'})
  maCumRap: string;
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
