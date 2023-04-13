const uuidV4 = require("uuid").v4;

const Error404 = require("src/models/server/errors/404Error");

const { parseId } = require("src/helpers");

class Suppliers {
    static async get({ filter, id }, { mongoDbConfig: { collections }}) {
        const supplier = await collections.SUPPLIERS
            .findOne(filter ?? { id: parseId(id) })

        if(!Boolean(supplier)) throw new Error404("Supplier not found");

        return supplier;
    }

    static async getAll({ filter }, { mongoDbConfig: { collections }}) {
        const list = await collections.SUPPLIERS
            .find(filter ?? {})
            .toArray();

        return list;
    }

    static async insert({ id, address, name, nuit }, { mongoDbConfig }) {
        const { collections } = mongoDbConfig;

        await collections.SUPPLIERS.insertOne({
            address,
            id: id ?? uuidV4(),
            name,
            nuit
        });
    }

    static async update({ id, address, name, nuit }, { mongoDbConfig }) {
        const { collections } = mongoDbConfig;

        await collections.SUPPLIERS.updateOne(
            { id: parseId(id) },
            {
                $set: {
                    address,
                    name,
                    nuit
                }
            }
        );
    }
}

module.exports = Suppliers;