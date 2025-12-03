import dotenv from "dotenv";
dotenv.config({ path: "./backend/.env" });

const dbOptions = {
  host: process.env.DB_HOST,
  port: 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  // REQUIRED OPTIONS for express-mysql-session
  clearExpired: true,                      // delete expired sessions
  checkExpirationInterval: 900000,         // every 15 minutes
  expiration: 1000 * 60 * 60 * 24 * 7,     // 7 days
  createDatabaseTable: true,               // auto-create `sessions` table
  schema: {
    tableName: 'sessions',
    columnNames: {
      session_id: 'session_id',
      expires: 'expires',
      data: 'data'
    }
  }
};

export default dbOptions;
