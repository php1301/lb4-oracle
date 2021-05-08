import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyThroughRepositoryFactory, HasManyRepositoryFactory} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Phim, PhimRelations, TheLoai, PhimTheLoai, LichChieu} from '../models';
import {PhimTheLoaiRepository} from './phim-the-loai.repository';
import {TheLoaiRepository} from './the-loai.repository';
import {LichChieuRepository} from './lich-chieu.repository';

export class PhimRepository extends DefaultCrudRepository<
  Phim,
  typeof Phim.prototype.maPhim,
  PhimRelations
> {

  public readonly phimtheloai: HasManyThroughRepositoryFactory<TheLoai, typeof TheLoai.prototype.maTheLoai,
          PhimTheLoai,
          typeof Phim.prototype.maPhim
        >;

  public readonly phimLichChieu: HasManyRepositoryFactory<LichChieu, typeof Phim.prototype.maPhim>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('PhimTheLoaiRepository') protected phimTheLoaiRepositoryGetter: Getter<PhimTheLoaiRepository>, @repository.getter('TheLoaiRepository') protected theLoaiRepositoryGetter: Getter<TheLoaiRepository>, @repository.getter('LichChieuRepository') protected lichChieuRepositoryGetter: Getter<LichChieuRepository>,
  ) {
    super(Phim, dataSource);
    this.phimLichChieu = this.createHasManyRepositoryFactoryFor('phimLichChieu', lichChieuRepositoryGetter,);
    this.registerInclusionResolver('phimLichChieu', this.phimLichChieu.inclusionResolver);
    this.phimtheloai = this.createHasManyThroughRepositoryFactoryFor('phimtheloai', theLoaiRepositoryGetter, phimTheLoaiRepositoryGetter,);
    this.registerInclusionResolver('phimtheloai', this.phimtheloai.inclusionResolver);
  }
}
