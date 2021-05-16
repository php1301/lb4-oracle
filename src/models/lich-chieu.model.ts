import {Entity, model, property, belongsTo, hasMany} from '@loopback/repository';
import {Rap} from './rap.model';
import {HeThongRap} from './he-thong-rap.model';
import {CumRap} from './cum-rap.model';
import {Ghe} from './ghe.model';
import {GheDaDat} from './ghe-da-dat.model';

@model()
export class LichChieu extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  maLichChieu?: number;

  @property({
    type: 'date',
    required: true,
  })
  ngayChieuGioChieu: string;

  @property({
    type: 'number',
    required: true,
  })
  giaVe: number;

  @property({
    type: 'number',
    required: true,
  })
  thoiLuong: number;

  @belongsTo(() => Rap, {name: 'lichChieuRap'})
  maRap: number;

  @belongsTo(() => HeThongRap, {name: 'lichChieuHeThongRap'})
  maHeThongRap: string;

  @belongsTo(() => CumRap, {name: 'lichChieuCumRap'})
  maCumRap: string;

  @property({
    type: 'number',
  })
  maPhim?: number;

  @hasMany(() => Ghe, {through: {model: () => GheDaDat, keyFrom: 'maLichChieu', keyTo: 'maGhe'}})
  gheDaDat: Ghe[];

  constructor(data?: Partial<LichChieu>) {
    super(data);
  }
}

export interface LichChieuRelations {
  // describe navigational properties here
}

export type LichChieuWithRelations = LichChieu & LichChieuRelations;
