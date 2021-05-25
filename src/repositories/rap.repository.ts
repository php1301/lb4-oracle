import {inject, Getter} from '@loopback/core';
import {
  DefaultCrudRepository,
  repository,
  BelongsToAccessor, HasManyRepositoryFactory} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Rap, RapRelations, CumRap, Ghe, LichChieu} from '../models';
import {CumRapRepository} from './cum-rap.repository';
import {GheRepository} from './ghe.repository';
import {LichChieuRepository} from './lich-chieu.repository';

export class RapRepository extends DefaultCrudRepository<
  Rap,
  typeof Rap.prototype.maRap,
  RapRelations
> {
  public readonly rapCumRap: BelongsToAccessor<
    CumRap,
    typeof Rap.prototype.maRap
  >;

  public readonly rapCuaGhe: HasManyRepositoryFactory<Ghe, typeof Rap.prototype.maRap>;

  public readonly lichChieuCuaRap: HasManyRepositoryFactory<LichChieu, typeof Rap.prototype.maRap>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
    @repository.getter('CumRapRepository')
    protected cumRapRepositoryGetter: Getter<CumRapRepository>, @repository.getter('GheRepository') protected gheRepositoryGetter: Getter<GheRepository>, @repository.getter('LichChieuRepository') protected lichChieuRepositoryGetter: Getter<LichChieuRepository>,
  ) {
    super(Rap, dataSource);
    this.lichChieuCuaRap = this.createHasManyRepositoryFactoryFor('lichChieuCuaRap', lichChieuRepositoryGetter,);
    this.registerInclusionResolver('lichChieuCuaRap', this.lichChieuCuaRap.inclusionResolver);
    this.rapCuaGhe = this.createHasManyRepositoryFactoryFor('rapCuaGhe', gheRepositoryGetter,);
    this.registerInclusionResolver('rapCuaGhe', this.rapCuaGhe.inclusionResolver);
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
