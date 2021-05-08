import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor, HasManyThroughRepositoryFactory} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Ve, VeRelations, LichChieu, Users, Ghe, DatVe} from '../models';
import {LichChieuRepository} from './lich-chieu.repository';
import {UsersRepository} from './users.repository';
import {DatVeRepository} from './dat-ve.repository';
import {GheRepository} from './ghe.repository';

export class VeRepository extends DefaultCrudRepository<
  Ve,
  typeof Ve.prototype.maVe,
  VeRelations
> {

  public readonly veLichChieu: BelongsToAccessor<LichChieu, typeof Ve.prototype.maVe>;

  public readonly veUser: BelongsToAccessor<Users, typeof Ve.prototype.maVe>;

  public readonly veDatVeGhe: HasManyThroughRepositoryFactory<Ghe, typeof Ghe.prototype.maGhe,
          DatVe,
          typeof Ve.prototype.maVe
        >;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('LichChieuRepository') protected lichChieuRepositoryGetter: Getter<LichChieuRepository>, @repository.getter('UsersRepository') protected usersRepositoryGetter: Getter<UsersRepository>, @repository.getter('DatVeRepository') protected datVeRepositoryGetter: Getter<DatVeRepository>, @repository.getter('GheRepository') protected gheRepositoryGetter: Getter<GheRepository>,
  ) {
    super(Ve, dataSource);
    this.veDatVeGhe = this.createHasManyThroughRepositoryFactoryFor('veDatVeGhe', gheRepositoryGetter, datVeRepositoryGetter,);
    this.registerInclusionResolver('veDatVeGhe', this.veDatVeGhe.inclusionResolver);
    this.veUser = this.createBelongsToAccessorFor('veUser', usersRepositoryGetter,);
    this.registerInclusionResolver('veUser', this.veUser.inclusionResolver);
    this.veLichChieu = this.createBelongsToAccessorFor('veLichChieu', lichChieuRepositoryGetter,);
    this.registerInclusionResolver('veLichChieu', this.veLichChieu.inclusionResolver);
  }
}
