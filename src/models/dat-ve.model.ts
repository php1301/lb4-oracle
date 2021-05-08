import {Entity, model, property} from '@loopback/repository';

@model()
export class DatVe extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: false,
  })
  isbn?: number;

  @property({
    type: 'number',
    required: true,
  })
  maVe: number;

  @property({
    type: 'number',
    required: true,
  })
  maGhe: number;


  constructor(data?: Partial<DatVe>) {
    super(data);
  }
}

export interface DatVeRelations {
  // describe navigational properties here
}

export type DatVeWithRelations = DatVe & DatVeRelations;
