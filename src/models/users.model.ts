import {belongsTo, Entity, hasOne, model, property} from '@loopback/repository';
import {UserCredentials} from '.';
import {LoaiNguoiDung} from './loai-nguoi-dung.model';

@model({settings: {}})
export class Users extends Entity {
  @property({
    type: 'number',
    id: 1,
    generated: true,
  })
  taiKhoan: number;

  @property({
    type: 'string',
    required: true,
  })
  password: string;

  @property({
    type: 'string',
    index: {
      unique: true,
    },
  })
  username?: string;

  @property({
    type: 'string',
    required: true,
    index: {
      unique: true,
    },
  })
  email: string;

  @property({
    type: 'date',

    required: true,
  })
  ngaySinh: string;

  @property({
    type: 'string',
    required: true,
  })
  diaChi: string;

  @property({
    type: 'number',
    default: 0,
  })
  diemTichLuy?: number;

  @property({
    type: 'number',
    default: 0,
  })
  tongDiemTichLuy?: number;

  @property({
    type: 'string',
  })
  soDT?: string;
  @property({
    type: 'string',
  })
  hoTen?: string;
  @property({
    type: 'string',
    default: 'https://i.pravatar.cc/300',
  })
  avatar?: string;
  // Relations
  @belongsTo(() => LoaiNguoiDung, {name: 'loaiNguoiDung'})
  maLoaiNguoiDung: number;
  @hasOne(() => UserCredentials, {keyTo: 'taiKhoan'})
  userCredentials: UserCredentials;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Users>) {
    super(data);
  }
}

export interface UsersRelation {
  // describe navigational properties here
}

export type UsersWithRelations = Users & UsersRelation;
