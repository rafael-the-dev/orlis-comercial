const uuidV4 = require("uuid").v4;

const { parseId } = require("src/helpers")

class RoomClass {
    static async getAll({ filter }, { mongoDbConfig: { collections } }) {
        const result = await collections.ROOMS_CLASSES
            .find(filter ?? {})
            .toArray();
        
        return result;
    }
    static async insert({ description }, { mongoDbConfig: { collections } }) {
        await collections.ROOMS_CLASSES.insertOne({ 
            description,
            date: Date.now().toString(),
            id: uuidV4(),
            state: "ACTIVO"
        });
        return;
    }
}

module.exports = RoomClass;