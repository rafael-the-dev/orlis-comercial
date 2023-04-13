const moment = require("moment");
const uuidV4 = require("uuid").v4;

const ClientModel = require("./Client");

const format = date => moment(date).format("DD/MM/YYYY HH:mm:ss");

class RoomUse {
    static async getAll({ filter }, { mongoDbConfig: { collections } }) {
        const roomsUses = await collections.ROOMS_USES
            .aggregate([
                { $match: filter ?? {} },
                {
                    $lookup: {
                        as: "room",
                        from: "rooms",
                        foreignField: "roomId",
                        localField: "room"
                    }
                },
                { $unwind: "$room" },
                {
                    $lookup: {
                        as: "classe",
                        from: "rooms_classes",
                        foreignField: "id",
                        localField: "room.classId"
                    }
                },
                { $unwind: "$classe" },
            ])
            .toArray();
        
        const result = roomsUses.map(({ classe, room, ...rest }) => ({
            ...rest, 
            //entrance: format(entrance),
            //leaving: format(leaving),
            room: {
                ...room,
                classe
            }
        }));

        return result;
    }

    static async insert({ client, entrance, leaving, room }, { mongoDbConfig }) {
        let clientId = -1;

        try {
            const clientResult = await ClientModel.get({ documentNumber }, { mongoDbConfig }); 
            clientId = clientResult.id;
        } catch(e) {
            clientId = await ClientModel.insert({ ...client }, { mongoDbConfig })
        }
        
        const { collections } = mongoDbConfig;

        const id = uuidV4();
        const roomUse = {
            client: clientId,
            date: Date.now().toString(),
            id,
            entrance, 
            leaving,
            room: room.id,
        };

        await collections.ROOMS_USES.insertOne(roomUse);
        return id;
    }
}

module.exports = RoomUse;