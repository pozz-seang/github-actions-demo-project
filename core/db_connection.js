const { createConnection } = require("mysql2");
const { DBHost, DBPort, DBUser, DBPassword, DBDatabase } = require("./config");

const connectToDatabase = ()=>{
    const connection = createConnection({
        host: DBHost,
        port: DBPort,
        user: DBUser,
        password: DBPassword,
        database: DBDatabase,
        waitForConnections: true,
    });

    connection.connect((err) => {
      if (err)  return console.error('Error connecting to the MySQL database');
      console.log('Connected to the MySQL database');
    });

    return connection;
}

module.exports = {
  connectToDatabase,
};
