import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: true}})
export class LoaiGhe extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  maLoaiGhe?: number;

  @property({
    type: 'string',
    required: true,
  })
  tenLoaiGhe: string;

  @property({
    type: 'string',
  })
  moTa?: string;

  @property({
    type: 'number',
    default: 0,
  })
  chietKhau?: number;


  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<LoaiGhe>) {
    super(data);
  }
}

export interface LoaiGheRelations {
  // describe navigational properties here
}

export type LoaiGheWithRelations = LoaiGhe & LoaiGheRelations;
