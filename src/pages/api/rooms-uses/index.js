const { apiHandler } = require("src/helpers/api-handler")

const RoomUseModel = require("src/models/server/db/RoomUse");

const requestHandler = async (req, res, { mongoDbConfig }) => {

    const { body, method } = req;

    switch(method) {
        case "GET": {
            return RoomUseModel.getAll({}, { mongoDbConfig })
                .then(data => res.status(200).json({ data }));
        }
        case "POST": {
            const {  client, entrance, leaving, room } = JSON.parse(body);

            await RoomUseModel.insert(
                {
                    client, //{ document, documentNumber, firstName, lastName }
                    entrance, 
                    leaving, 
                    room
                }, 
                { mongoDbConfig }
            );
            
            res.status(201).json({ message: "Room was successfully booked." });
            return;
        }
        default: {
            return;
        }
    }
};

const handler = apiHandler(requestHandler )
export default handler;