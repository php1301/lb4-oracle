import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class TheLoai extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: false,
  })
  maTheLoai?: number;

  @property({
    type: 'string',
    required: true,
  })
  tenTheLoai: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<TheLoai>) {
    super(data);
  }
}

export interface TheLoaiRelations {
  // describe navigational properties here
}

export type TheLoaiWithRelations = TheLoai & TheLoaiRelations;
