require('dotenv').config()

module.exports = {
  development: {
    username: 'root',
    password: process.env.SEQUELIZE_PASSWORD,
    database: 'JWT_AUTH',
    host: '127.0.0.1',
    dialect: 'mysql',
    dialectOptions: {
      charset: 'utf8mb4',
      dateStrings: true,
      typeCast: true
    },
    timezone: '+09:00',
    operatorAliases: 'false'
  },
  production: {
    username: 'root',
    password: process.env.SEQUELIZE_PASSWORD,
    database: 'JWT_AUTH',
    // host: process.env.DB_HOST,
    // port: process.env.DB_PORT,
    dialectOptions: {
      charset: 'utf8mb4',
      dateStrings: true,
      typeCast: true
    },
    dialect: 'mysql',
    timezone: '+09:00',
    operatorAliases: 'false',
    logging: false
  }
}
