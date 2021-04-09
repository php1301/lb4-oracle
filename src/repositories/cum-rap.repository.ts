import {inject, Getter} from '@loopback/core';
import {
  DefaultCrudRepository,
  repository,
  BelongsToAccessor,
} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {CumRap, CumRapRelations, HeThongRap} from '../models';
import {HeThongRapRepository} from './he-thong-rap.repository';

export class CumRapRepository extends DefaultCrudRepository<
  CumRap,
  typeof CumRap.prototype.maCumRap,
  CumRapRelations
> {
  public readonly cumRapHeThongRap: BelongsToAccessor<
    HeThongRap,
    typeof CumRap.prototype.maCumRap
  >;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
    @repository.getter('HeThongRapRepository')
    protected heThongRapRepositoryGetter: Getter<HeThongRapRepository>,
  ) {
    super(CumRap, dataSource);
    this.cumRapHeThongRap = this.createBelongsToAccessorFor(
      'cumrap_hethongrap',
      heThongRapRepositoryGetter,
    );
    this.registerInclusionResolver(
      'cumrap_hethongrap',
      this.cumRapHeThongRap.inclusionResolver,
    );
  }
}
