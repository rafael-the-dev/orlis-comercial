const uuidV4 = require("uuid").v4;

const { parseId } = require("src/helpers");

const Error404 = require("src/models/server/errors/404Error");

class Room {
    static async get({ filter, id }, { mongoDbConfig: { collections } }) {
        const room = await collections.ROOMS
            .findOne(filter ?? { roomId: parseId(id) });

        if(!room) throw new Error404("Room not found");

        const { details, ...rest } = room;

        return {
            ...details,
            ...rest
        };
    }

    static async getAll({ filter }, { mongoDbConfig: { collections } }) {
        const rooms = await collections.ROOMS
            .find(filter ?? {})
            .toArray();

        const result = rooms.map(({ details, ...rest}) => ({
            ...details,
            ...rest
        }));

        return result;
    }

    static async insert({ description, dailyPrice, hourlyPrice, number, roomClassId }, { mongoDbConfig: { collections }}) {
        const room = {
            classId: roomClassId,
            description,
            date: Date.now().toString(),
            details: {
                dailyPrice,
                hourlyPrice,
                number,
                roomDetailsId: uuidV4()
            },
            roomId: uuidV4(),
        };

        await collections.ROOMS.insertOne(room);
    }

    static async update({ description, dailyPrice, hourlyPrice, id, number, roomClassId }, { mongoDbConfig }) {
        await this.get({ id }, { mongoDbConfig });

        const room = {
            classId: roomClassId,
            description,
            details: {
                dailyPrice,
                hourlyPrice,
                number,
            }
        };

        const { collections } = mongoDbConfig;

        await collections.ROOMS.updateOne(
            { roomId: parseId(id) },
            { $set: room }
        );
    }
}

module.exports = Room;