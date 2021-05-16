import {Entity, model, property, belongsTo} from '@loopback/repository';
import {LoaiGhe} from './loai-ghe.model';
import {Rap} from './rap.model';

@model({settings: {strict: true}})
export class Ghe extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  maGhe?: number;

  @property({
    type: 'string',
    required: true,
  })
  tenGhe: string;

  @property({
    type: 'number',
    required: true,
  })
  stt: number;

  // @property({
  //   type: 'boolean',
  //   required: true,
  // })
  // kichHoat: boolean;

  @belongsTo(() => LoaiGhe, {name: 'gheLoaiGhe'})
  maLoaiGhe: number;

  @belongsTo(() => Rap, {name: 'gheRap'})
  maRap: number;
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Ghe>) {
    super(data);
  }
}

export interface GheRelations {
  // describe navigational properties here
}

export type GheWithRelations = Ghe & GheRelations;
