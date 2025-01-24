require('dotenv').config();
const envSuffix = process.env.NODE_ENV && process.env.NODE_ENV == 'test' ? `.${process.env.NODE_ENV}` : '';
const env = `.env${envSuffix}`;

const dotenv = require('dotenv');
const result = dotenv.config({ path: `./${env}` });

if (result.error) {
  console.error(`Failed to load environment file: ${env}`);
  process.exit(1);
}

const {
  DB_HOST,
  DB_NAME,
  DB_PASSWORD,
  DB_PORT,
  DB_USERNAME,
  TEST_DB_HOST,
  TEST_DB_NAME,
  TEST_DB_PASSWORD,
  TEST_DB_PORT,
  TEST_DB_USERNAME,
} = process.env;

module.exports = {
  defaultTeamName: 'My Organisation',
  development: {
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_NAME,
    host: DB_HOST,
    dialect: 'postgres',
    port: DB_PORT,
    logging: false,
  },
  test: {
    username: TEST_DB_USERNAME,
    password: TEST_DB_PASSWORD,
    database: TEST_DB_NAME,
    host: TEST_DB_HOST,
    dialect: 'postgres',
    port: TEST_DB_PORT,
    logging: false,
  },
  production: {
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_NAME,
    host: DB_HOST,
    dialect: 'postgres',
    port: DB_PORT,
    logging: false,
  },
};
