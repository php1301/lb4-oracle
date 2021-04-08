import {Getter, inject} from '@loopback/core';
import {
  BelongsToAccessor,
  DefaultCrudRepository,
  HasOneRepositoryFactory,
  repository,
} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {LoaiNguoiDung, UserCredentials, Users, UsersRelation} from '../models';
import {LoaiNguoiDungRepository} from './loai-nguoi-dung.repository';
import {UserCredentialsRepository} from './user-credentials.repository';

export class UsersRepository extends DefaultCrudRepository<
  Users,
  typeof Users.prototype.taiKhoan,
  UsersRelation
> {
  public readonly userCredentials: HasOneRepositoryFactory<
    UserCredentials,
    typeof Users.prototype.taiKhoan
  >;

  public readonly loaiNguoiDung: BelongsToAccessor<
    LoaiNguoiDung,
    typeof Users.prototype.taiKhoan
  >;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
    @repository.getter('UserCredentialsRepository')
    protected userCredentialsRepositoryGetter: Getter<UserCredentialsRepository>,
    @repository.getter('LoaiNguoiDungRepository')
    protected loaiNguoiDungRepositoryGetter: Getter<LoaiNguoiDungRepository>,
  ) {
    super(Users, dataSource);
    this.loaiNguoiDung = this.createBelongsToAccessorFor(
      'loaiNguoiDung',
      loaiNguoiDungRepositoryGetter,
    );
    this.registerInclusionResolver(
      'loaiNguoiDung',
      this.loaiNguoiDung.inclusionResolver,
    );

    this.userCredentials = this.createHasOneRepositoryFactoryFor(
      'userCredentials',
      userCredentialsRepositoryGetter,
    );
    this.registerInclusionResolver(
      'userCredentials',
      this.userCredentials.inclusionResolver,
    );
  }

  async findCredentials(
    taiKhoan: typeof Users.prototype.taiKhoan,
  ): Promise<UserCredentials | undefined> {
    try {
      return await this.userCredentials(taiKhoan).get();
    } catch (err) {
      if (err.code === 'ENTITY_NOT_FOUND') {
        return undefined;
      }
      throw err;
    }
  }
}
