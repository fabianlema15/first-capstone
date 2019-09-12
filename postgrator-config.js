require('dotenv').config();

module.exports = {
  "migrationDirectory": "migrations",
  "driver": "pg",
  "connectionString": process.env.NODE_ENV === 'production' ?
    process.env.DATABASE_URL : process.env.DB_URL
}
