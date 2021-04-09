import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {HeThongRap, HeThongRapRelations} from '../models';

export class HeThongRapRepository extends DefaultCrudRepository<
  HeThongRap,
  typeof HeThongRap.prototype.maHeThongRap,
  HeThongRapRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(HeThongRap, dataSource);
  }
}
