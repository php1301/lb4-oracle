import {Entity, model, property} from '@loopback/repository';

@model()
export class PhimTheLoai extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  isbn?: number;

  @property({
    type: 'number',
    required: true,
  })
  maPhim: number;

  @property({
    type: 'number',
    required: true,
  })
  maTheLoai: number;


  constructor(data?: Partial<PhimTheLoai>) {
    super(data);
  }
}

export interface PhimTheLoaiRelations {
  // describe navigational properties here
}

export type PhimTheLoaiWithRelations = PhimTheLoai & PhimTheLoaiRelations;
