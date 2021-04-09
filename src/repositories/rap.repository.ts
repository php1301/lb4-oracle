import {inject, Getter} from '@loopback/core';
import {
  DefaultCrudRepository,
  repository,
  BelongsToAccessor,
} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Rap, RapRelations, CumRap} from '../models';
import {CumRapRepository} from './cum-rap.repository';

export class RapRepository extends DefaultCrudRepository<
  Rap,
  typeof Rap.prototype.maRap,
  RapRelations
> {
  public readonly rapCumRap: BelongsToAccessor<
    CumRap,
    typeof Rap.prototype.maRap
  >;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
    @repository.getter('CumRapRepository')
    protected cumRapRepositoryGetter: Getter<CumRapRepository>,
  ) {
    super(Rap, dataSource);
    this.rapCumRap = this.createBelongsToAccessorFor(
      'rap_cumRap',
      cumRapRepositoryGetter,
    );
    this.registerInclusionResolver(
      'rap_cumRap',
      this.rapCumRap.inclusionResolver,
    );
  }
}
