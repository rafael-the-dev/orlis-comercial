
class Table { 

    static async getAll({ filter }, { mongoDbConfig: { collections } }) {
        const tables = await collections.TABLES
            .find(filter ?? {})
            .toArray();

        return tables;
    }
}

module.exports = Table;