import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {PhimTheLoai, PhimTheLoaiRelations} from '../models';

export class PhimTheLoaiRepository extends DefaultCrudRepository<
  PhimTheLoai,
  typeof PhimTheLoai.prototype.isbn,
  PhimTheLoaiRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(PhimTheLoai, dataSource);
  }
}
