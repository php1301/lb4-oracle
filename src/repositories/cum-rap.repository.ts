import {inject, Getter} from '@loopback/core';
import {
  DefaultCrudRepository,
  repository,
  BelongsToAccessor, HasManyRepositoryFactory} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {CumRap, CumRapRelations, HeThongRap, LichChieu, Rap} from '../models';
import {HeThongRapRepository} from './he-thong-rap.repository';
import {LichChieuRepository} from './lich-chieu.repository';
import {RapRepository} from './rap.repository';

export class CumRapRepository extends DefaultCrudRepository<
  CumRap,
  typeof CumRap.prototype.maCumRap,
  CumRapRelations
> {
  public readonly cumRapHeThongRap: BelongsToAccessor<
    HeThongRap,
    typeof CumRap.prototype.maCumRap
  >;

  public readonly lichChieuCumRap: HasManyRepositoryFactory<LichChieu, typeof CumRap.prototype.maCumRap>;

  public readonly rapCuaCumRap: HasManyRepositoryFactory<Rap, typeof CumRap.prototype.maCumRap>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
    @repository.getter('HeThongRapRepository')
    protected heThongRapRepositoryGetter: Getter<HeThongRapRepository>, @repository.getter('LichChieuRepository') protected lichChieuRepositoryGetter: Getter<LichChieuRepository>, @repository.getter('RapRepository') protected rapRepositoryGetter: Getter<RapRepository>,
  ) {
    super(CumRap, dataSource);
    this.rapCuaCumRap = this.createHasManyRepositoryFactoryFor('rapCuaCumRap', rapRepositoryGetter,);
    this.registerInclusionResolver('rapCuaCumRap', this.rapCuaCumRap.inclusionResolver);
    this.lichChieuCumRap = this.createHasManyRepositoryFactoryFor('lichChieuCumRap', lichChieuRepositoryGetter,);
    this.registerInclusionResolver('lichChieuCumRap', this.lichChieuCumRap.inclusionResolver);
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
