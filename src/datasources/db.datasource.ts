import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

// const configDep = {
//   name: 'db',
//   connector: 'cloudant',
//   url: 'http://admin:pass@localhost:8080',
//   database: 'heqtv1',
//   modelIndex: '',
// };

const config = {
  name: 'db',
  connector: 'oracle',
  tns: '',
  host: 'localhost',
  port: 1521,
  user: 'c##project',
  password: 'test123',
  database: 'orcl',
  debug: true,
};

const mysqlConfig = {
  name: 'db2',
  connector: 'mysql',
  url: '',
  host: 'localhost',
  port: 3306,
  username: 'admin2',
  password: 'java123',
  database: 'doanjavalb',
};
const mysqlRemoteConfig = {
  name: 'db3',
  connector: 'mysql',
  url: '',
  host: 'remotemysql.com',
  port: 3306,
  username: 'Rv7rkcnTMx',
  password: 'ZJ0Pp56kEi',
  database: 'Rv7rkcnTMx',
};

const mysqlRemoteConfig2 = {
  name: 'db4',
  connector: 'mysql',
  url: '',
  host: '103.97.125.254',
  port: 3306,
  timeZone: '+07:00',
  username: 'doanjava',
  password: 'a2DpigCp7PDOyGk',
  database: 'doanjava_v1',
};
// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class DbDataSource
  extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'db';
  static readonly defaultConfig = mysqlRemoteConfig2;

  constructor(
    @inject('datasources.config.db', {optional: true})
    dsConfig: object = mysqlRemoteConfig2,
  ) {
    super(dsConfig);
  }
}
