import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {DatVe, DatVeRelations} from '../models';

export class DatVeRepository extends DefaultCrudRepository<
  DatVe,
  typeof DatVe.prototype.isbn,
  DatVeRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(DatVe, dataSource);
  }
}
