import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Ghe, GheRelations, LoaiGhe, Rap} from '../models';
import {LoaiGheRepository} from './loai-ghe.repository';
import {RapRepository} from './rap.repository';

export class GheRepository extends DefaultCrudRepository<
  Ghe,
  typeof Ghe.prototype.maGhe,
  GheRelations
> {

  public readonly gheLoaiGhe: BelongsToAccessor<LoaiGhe, typeof Ghe.prototype.maGhe>;

  public readonly gheRap: BelongsToAccessor<Rap, typeof Ghe.prototype.maGhe>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('LoaiGheRepository') protected loaiGheRepositoryGetter: Getter<LoaiGheRepository>, @repository.getter('RapRepository') protected rapRepositoryGetter: Getter<RapRepository>,
  ) {
    super(Ghe, dataSource);
    this.gheRap = this.createBelongsToAccessorFor('gheRap', rapRepositoryGetter,);
    this.registerInclusionResolver('gheRap', this.gheRap.inclusionResolver);
    this.gheLoaiGhe = this.createBelongsToAccessorFor('gheLoaiGhe', loaiGheRepositoryGetter,);
    this.registerInclusionResolver('gheLoaiGhe', this.gheLoaiGhe.inclusionResolver);
  }
}
