import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {LichChieu, LichChieuRelations, Rap, HeThongRap, CumRap} from '../models';
import {RapRepository} from './rap.repository';
import {HeThongRapRepository} from './he-thong-rap.repository';
import {CumRapRepository} from './cum-rap.repository';

export class LichChieuRepository extends DefaultCrudRepository<
  LichChieu,
  typeof LichChieu.prototype.maLichChieu,
  LichChieuRelations
> {

  public readonly lichChieuRap: BelongsToAccessor<Rap, typeof LichChieu.prototype.maLichChieu>;

  public readonly lichChieuHeThongRap: BelongsToAccessor<HeThongRap, typeof LichChieu.prototype.maLichChieu>;

  public readonly lichChieuCumRap: BelongsToAccessor<CumRap, typeof LichChieu.prototype.maLichChieu>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('RapRepository') protected rapRepositoryGetter: Getter<RapRepository>, @repository.getter('HeThongRapRepository') protected heThongRapRepositoryGetter: Getter<HeThongRapRepository>, @repository.getter('CumRapRepository') protected cumRapRepositoryGetter: Getter<CumRapRepository>,
  ) {
    super(LichChieu, dataSource);
    this.lichChieuCumRap = this.createBelongsToAccessorFor('lichChieuCumRap', cumRapRepositoryGetter,);
    this.registerInclusionResolver('lichChieuCumRap', this.lichChieuCumRap.inclusionResolver);
    this.lichChieuHeThongRap = this.createBelongsToAccessorFor('lichChieuHeThongRap', heThongRapRepositoryGetter,);
    this.registerInclusionResolver('lichChieuHeThongRap', this.lichChieuHeThongRap.inclusionResolver);
    this.lichChieuRap = this.createBelongsToAccessorFor('lichChieuRap', rapRepositoryGetter,);
    this.registerInclusionResolver('lichChieuRap', this.lichChieuRap.inclusionResolver);
  }
}
