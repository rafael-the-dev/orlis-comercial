
class Barman { 

    static async getAll({ filter }, { mongoDbConfig: { collections } }) {
        const barmen = await collections.BARMEN
            .find(filter ?? {})
            .toArray();

        return barmen;
    }
}

module.exports = Barman;