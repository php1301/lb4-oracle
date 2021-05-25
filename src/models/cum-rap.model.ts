import {Entity, model, property, belongsTo, hasMany} from '@loopback/repository';
import {HeThongRap} from './he-thong-rap.model';
import {LichChieu} from './lich-chieu.model';
import {Rap} from './rap.model';

@model({settings: {strict: true}})
export class CumRap extends Entity {
  @property({
    type: 'string',
    id: true,
  })
  maCumRap: string;

  @property({
    type: 'string',
    required: true,
  })
  tenCumRap: string;
  @property({
    type: 'string',
  })
  thongTin?: string;

  @belongsTo(() => HeThongRap, {name: 'cumrap_hethongrap'})
  maHeThongRap: string;

  @hasMany(() => LichChieu, {keyTo: 'maCumRap'})
  lichChieuCumRap: LichChieu[];

  @hasMany(() => Rap, {keyTo: 'maCumRap'})
  rapCuaCumRap: Rap[];
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<CumRap>) {
    super(data);
  }
}

export interface CumRapRelations {
  // describe navigational properties here
}

export type CumRapWithRelations = CumRap & CumRapRelations;
