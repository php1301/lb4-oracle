import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {HeThongRap, HeThongRapRelations, CumRap} from '../models';
import {CumRapRepository} from './cum-rap.repository';

export class HeThongRapRepository extends DefaultCrudRepository<
  HeThongRap,
  typeof HeThongRap.prototype.maHeThongRap,
  HeThongRapRelations
> {

  public readonly cacCumRapHeThongRap: HasManyRepositoryFactory<CumRap, typeof HeThongRap.prototype.maHeThongRap>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('CumRapRepository') protected cumRapRepositoryGetter: Getter<CumRapRepository>,
  ) {
    super(HeThongRap, dataSource);
    this.cacCumRapHeThongRap = this.createHasManyRepositoryFactoryFor('cacCumRapHeThongRap', cumRapRepositoryGetter,);
    this.registerInclusionResolver('cacCumRapHeThongRap', this.cacCumRapHeThongRap.inclusionResolver);
  }
}
