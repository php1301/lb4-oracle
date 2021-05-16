import {Entity, model, property} from '@loopback/repository';

@model()
export class GheDaDat extends Entity {
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
  maGhe: number;

  @property({
    type: 'number',
    required: true,
  })
  maLichChieu: number;


  constructor(data?: Partial<GheDaDat>) {
    super(data);
  }
}

export interface GheDaDatRelations {
  // describe navigational properties here
}

export type GheDaDatWithRelations = GheDaDat & GheDaDatRelations;
