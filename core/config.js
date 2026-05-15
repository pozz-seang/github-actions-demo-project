require('dotenv').config();
const TGBotToken = "8597524231:AAH-9qOOkHqM8PH4FMEfoQrbsh4FpJTTf6Q";
const DBHost = "192.168.1.222";
const DBPort = 2200;
const DBUser = "root";
const DBPassword = "Baby123!";
const DBDatabase = "babysql";
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