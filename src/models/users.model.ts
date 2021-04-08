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
  })
  username?: string;

  @property({
    type: 'string',
    required: true,
  })
  email: string;

  @property({
    type: 'string',
  })
  soDT?: string;
  @property({
    type: 'string',
  })
  hoTen?: string;

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
