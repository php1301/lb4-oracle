
import {DefaultCrudRepository} from '@loopback/repository';
import {UserCredentials, UserCredentialsRelations} from '../models';
import {DbDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class UserCredentialsRepository extends DefaultCrudRepository<
  UserCredentials,
  typeof UserCredentials.prototype.isbn,
  UserCredentialsRelations
> {
  constructor(@inject('datasources.db') dataSource: DbDataSource) {
    super(UserCredentials, dataSource);
  }
}
