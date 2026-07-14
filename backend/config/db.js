require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.DB_USER,      // Kendi Postgres kullanıcı adın (genelde postgres)
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,  // Kendi Postgres veritabanın (Kurarken belirlediğin veritabanı adı)
    password: process.env.DB_PASSWORD,  // Kendi Postgres şifren (Kurarken belirlediğin şifre)
    port: process.env.DB_PORT,
});

const connectDB = async () => {
    try {
        const client = await pool.connect();
        console.log(`PostgreSQL Bağlantısı Başarılı!`);
        client.release();
    } catch (err) {
        console.error('PostgreSQL Bağlantı Hatası:', err.message);
    }
};

module.exports = { pool, connectDB };