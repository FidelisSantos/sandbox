import { Dialect } from 'sequelize';

interface DBConfig {
  username: string;
  password: string;
  database: string;
  host: string;
  dialect: Dialect;
}

interface Config {
  development: DBConfig;
  test: DBConfig;
  production: DBConfig;
}

const config: Config = {
  development: {
    username: 'user',
    password: 'password',
    database: 'sandboxdb',
    host: 'mysql',
    dialect: 'mysql',
  },
  test: {
    username: 'root',
    password: '',
    database: 'test_db',
    host: '127.0.0.1',
    dialect: 'mysql',
  },
  production: {
    username: 'root',
    password: '',
    database: 'prod_db',
    host: '127.0.0.1',
    dialect: 'mysql',
  },
};

export default config;
