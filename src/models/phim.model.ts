import {Entity, model, property, hasMany} from '@loopback/repository';
import {TheLoai} from './the-loai.model';
import {PhimTheLoai} from './phim-the-loai.model';
import {LichChieu} from './lich-chieu.model';

@model({settings: {strict: true}})
export class Phim extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  maPhim?: number;

  @property({
    type: 'string',
    required: true,
  })
  tenPhim: string;

  @property({
    type: 'string',
    required: true,
  })
  trailer: string;

  @property({
    type: 'string',
    required: true,
  })
  hinhAnh: string;

  @property({
    type: 'string',
    required: true,
  })
  moTa: string;

  @property({
    type: 'date',
    required: true,
  })
  ngayKhoiChieu: string;

  @property({
    type: 'number',
    required: true,
  })
  danhGia: number;

  @property({
    type: 'string',
    required: true,
  })
  biDanh: string;

  @property({
    type: 'boolean',
    default: false,
  })
  daXoa?: boolean;

  @hasMany(() => TheLoai, {through: {model: () => PhimTheLoai, keyFrom: 'maPhim', keyTo: 'maTheLoai'}})
  phimtheloai: TheLoai[];

  @hasMany(() => LichChieu, {keyTo: 'maPhim'})
  phimLichChieu: LichChieu[];
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Phim>) {
    super(data);
  }
}

export interface PhimRelations {
  // describe navigational properties here
}

export type PhimWithRelations = Phim & PhimRelations;
