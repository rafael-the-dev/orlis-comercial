const uuidV4 = require("uuid").v4;

const { parseId } = require("src/helpers");

const Error404 = require("../errors/404Error");

class Client {
    static async get({ document, documentNumber, filter, id }, { mongoDbConfig: { collections } }) {
        const client = await collections.CLIENTS
            .findOne(filter ?? { $or: [{ id: parseId(id) }, { document, documentNumber }] })

        if(!client) throw new Error404("Client not found.")
        
        return client;
    }

    static async getAll({ filter }, { mongoDbConfig: { collections } }) {
        const clients = await collections.CLIENTS
            .find(filter ?? { })
            .toArray();

        return { list: clients };
    }

    static async delete({ id }, { mongoDbConfig }) {
        const clientId = parseId(id);

        await this.get({ id }, { mongoDbConfig })

        const { collections } = mongoDbConfig;

        await collections.CLIENTS.deleteOne(
            { id: clientId }
        );
    }

    static async insert({ address, document, documentNumber, firstName, lastName }, { mongoDbConfig: { collections } }) {
        const id = uuidV4();

        const client = {
            address,
            document, documentNumber, date: Date.now().toString(),
            firstName, 
            id,
            lastName
        };

        await collections.CLIENTS.insertOne(client);

        return id;
    }

    static async update({ address, document, documentNumber, firstName, id, lastName }, { mongoDbConfig }) {
        const clientId = parseId(id);

        await this.get({ id }, { mongoDbConfig })

        const { collections } = mongoDbConfig;

        await collections.CLIENTS.updateOne(
            { id: clientId },
            {
                $set: {
                    address,
                    document, documentNumber, 
                    firstName, 
                    lastName
                }
            }
        );
    }
}

module.exports = Client;