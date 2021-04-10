import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {LoaiGhe, LoaiGheRelations} from '../models';

export class LoaiGheRepository extends DefaultCrudRepository<
  LoaiGhe,
  typeof LoaiGhe.prototype.maLoaiGhe,
  LoaiGheRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(LoaiGhe, dataSource);
  }
}
