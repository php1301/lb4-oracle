import {ApplicationConfig, MovieHeqtApplication} from './application';
import {DbDataSource} from './datasources/db.datasource';
const cfenv = require('cfenv');
const appEnv = cfenv.getAppEnv();
export * from './application';

export async function main(options: ApplicationConfig = {}) {
  if (!options) options = {};
  if (!options.rest) options.rest = {};
  options.rest.port = appEnv.isLocal ? options.rest.port : appEnv.port;
  options.rest.host = appEnv.isLocal ? options.rest.host : appEnv.host;

  const app = new MovieHeqtApplication(options);

  if (!appEnv.isLocal) {
    const dbConfig = Object.assign({}, DbDataSource.defaultConfig, {
      url: appEnv.getServiceURL('myCloudant'),
    });
    app.bind('datasources.config.db').to(dbConfig);
  }

  await app.boot();
  await app.start();

  const url = app.restServer.url;
  console.log(`Server is running at ${url}`);
  console.log(`Try ${url}/ping`);

  return app;
}

if (require.main === module) {
  // Run the application
  const config = {
    rest: {
      port: +(process.env.PORT ?? 3000),
      host: process.env.HOST,
      // The `gracePeriodForClose` provides a graceful close for http/https
      // servers with keep-alive clients. The default value is `Infinity`
      // (don't force-close). If you want to immediately destroy all sockets
      // upon stop, set its value to `0`.
      // See https://www.npmjs.com/package/stoppable
      gracePeriodForClose: 5000, // 5 seconds
      openApiSpec: {
        // useful when used with OpenAPI-to-GraphQL to locate your application
        setServersFromRequest: true,
      },
    },
  };
  main(config).catch(err => {
    console.error('Cannot start the application.', err);
    process.exit(1);
  });
}
