const { DB_URL } = process.env;
const ENV = process.env.NODE_ENV || 'development';

const baseConfig = {
  client: 'pg',
  migrations: {
    directory: './db/migrations',
  },
  seeds: {
    directory: './db/seeds',
  },
};

const customConfigs = {
  production: {
    connection: `${DB_URL}?ssl=true`,
    timezone: 'UTC',
    dateStrings: true
  },
  development: {
    JWT_SECRET: 'secret key',
    connection: {
      database: 'nc_news',
      timezone: 'UTC',
      dateStrings: true
      // username: "",
      // password: "",
    },
  },
  test: {
    JWT_SECRET: 'secret key',
    connection: {
      database: 'nc_news_test',
      timezone: 'UTC',
      dateStrings: true
      // username: "",
      // password: "",
    },
  },
  docker: {
    connection: {
      host: "nc_news",
      database: "nc_news",
    }
  },
};

module.exports = { ...baseConfig, ...customConfigs[ENV] };
