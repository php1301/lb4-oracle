import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {GheDaDat, GheDaDatRelations} from '../models';

export class GheDaDatRepository extends DefaultCrudRepository<
  GheDaDat,
  typeof GheDaDat.prototype.isbn,
  GheDaDatRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(GheDaDat, dataSource);
  }
}
