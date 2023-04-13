const { createConnection } = require("mysql2");

const connection = createConnection(process.env.DB);


const createDBConnection = (dbConfig) => {
    return new Promise((resolve, reject) => {
        connection.connect(err => {
            if (err) {
                console.error('error connecting: ' + err.stack);

                dbConfig.db = null;
                dbConfig.isConnected = false;

                connection.destroy();
                
                reject(err)
                return;
            }
            
            console.log('connected as id ' + connection.threadId);

            dbConfig.isConnected = true;

            resolve();
        });
    })
};

module.exports = {
    createDBConnection, 
    connection
};