import {Entity, model, property, belongsTo, hasMany} from '@loopback/repository';
import {LichChieu} from './lich-chieu.model';
import {Users} from './users.model';
import {Ghe} from './ghe.model';
import {DatVe} from './dat-ve.model';

@model()
export class Ve extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  maVe?: number;

  @property({
    type: 'date',
    required: true,
  })
  ngayDat: string;

  @property({
    type: 'number',
    required: true,
  })
  giaVe: number;
// O FE se tao ra cac o box render dung data chon He Thong Rap
// O CSDL se tao trigger de check xem heThong, cumRap va rap co lien quan ko
// Tang tinh bao mat
  @belongsTo(() => LichChieu, {name: 'veLichChieu'})
  maLichChieu: number;

  @belongsTo(() => Users, {name: 'veUser'})
  taiKhoan: number;

  @hasMany(() => Ghe, {through: {model: () => DatVe, keyFrom: 'maVe', keyTo: 'maGhe'}})
  veDatVeGhe: Ghe[];

  constructor(data?: Partial<Ve>) {
    super(data);
  }
}

export interface VeRelations {
  // describe navigational properties here
}

export type VeWithRelations = Ve & VeRelations;
