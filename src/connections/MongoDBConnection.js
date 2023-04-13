const { MongoClient } = require("mongodb");

class MongoDBConnection {
    static config = null;
    static loading = false;

    closeConfig = () => {
        this.config = null;
    }

    static getConfig = async () => {
        if(this.config && this.config?.isConnected) return this.config;
        
        await this.createMongoDBConnection();
        return this.config;
    }

    static closeDbConnections = async () =>  await this.config.connection.close();

    static createMongoDBConnection = async () => {
        const mongoDBConnection = new MongoClient(process.env.MONGO_DB.url);
        this.config = {
            connection: mongoDBConnection
        };

        const dbCollections = process.env.MONGO_DB.collections;
        let clusterDB;

        try {

            mongoDBConnection.on("connectionCreated", () => {
                clusterDB = mongoDBConnection.db(process.env.MONGO_DB.name);
                
                this.config.collections = {
                    BARMEN: clusterDB.collection(dbCollections.barmen ?? "barmen"),
                    CATEGORIES: clusterDB.collection(dbCollections.categories ?? "categories"),
                    CLIENTS: clusterDB.collection(dbCollections.clients ?? "clients"),
                    DEBTS: clusterDB.collection(dbCollections.debts ?? "debts"),
                    EXPENSES: clusterDB.collection(dbCollections.expenses ?? "expenses"),
                    PRODUCTS: clusterDB.collection(dbCollections.products),
                    PAYMENT_METHOD: clusterDB.collection(dbCollections.payment_method),
                    ROOMS: clusterDB.collection(dbCollections.rooms ?? "rooms"),
                    ROOMS_CLASSES: clusterDB.collection(dbCollections.rooms_classes ?? "rooms_classes"),
                    ROOMS_USES: clusterDB.collection(dbCollections.rooms_uses ?? "rooms_uses"),
                    SALES: clusterDB.collection(dbCollections.sales),
                    SUPPLIERS: clusterDB.collection(dbCollections.suppliers ?? "suppliers"),
                    SUPPLIERS_INVOICES: clusterDB.collection(dbCollections.suppliers_invoices ?? "suppliers_invoices"),
                    TABLES: clusterDB.collection(dbCollections.tables ?? "tables"),
                    USERS: clusterDB.collection(dbCollections.users ?? "users")
                };
            });

            mongoDBConnection.on("error", () => {
                this.closeConfig();
            });

            mongoDBConnection.on("close", () => {
                console.log("connection closed")
                this.closeConfig();
            });

            await mongoDBConnection.connect();
            this.config.isConnected = true;
            console.log('Connected successfully to mongodb server');
        } catch(err) {
            this.closeDbConnections();
            throw err;
        }
        return clusterDB;
    }
}


module.exports = MongoDBConnection;