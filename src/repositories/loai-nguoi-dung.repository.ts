import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {LoaiNguoiDung, LoaiNguoiDungRelations} from '../models';

export class LoaiNguoiDungRepository extends DefaultCrudRepository<
  LoaiNguoiDung,
  typeof LoaiNguoiDung.prototype.maLoaiNguoiDung,
  LoaiNguoiDungRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(LoaiNguoiDung, dataSource);
  }
}
