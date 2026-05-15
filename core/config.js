require('dotenv').config();
const TGBotToken = process.env.TELEGRAM_BOT_TOKEN;
const DBHost = process.env.DB_HOST;
const DBPort = process.env.DB_PORT;
const DBUser = process.env.DB_USER;
const DBPassword = process.env.DB_PASSWORD;
const DBDatabase = process.env.DB_DATABASE;
const PORT = process.env.PORT || 3000;


module.exports = {
    TGBotToken,
    DBHost,
    DBPort,
    DBUser,
    DBPassword,
    DBDatabase,
    PORT
};