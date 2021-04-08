import {Entity, model, property} from '@loopback/repository';

@model({settings: {}})
export class LoaiNguoiDung extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: false,
    required: true,
  })
  maLoaiNguoiDung: number;

  @property({
    type: 'string',
    required: true,
  })
  tenLoai: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<LoaiNguoiDung>) {
    super(data);
  }
}

export interface LoaiNguoiDungRelations {
  // describe navigational properties here
}

export type LoaiNguoiDungWithRelations = LoaiNguoiDung & LoaiNguoiDungRelations;
