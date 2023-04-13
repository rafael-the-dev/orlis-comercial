
const InputFormat = require("src/models/server/errors/AuthorizationError")

const { apiHandler } = require("src/helpers/api-handler")

const RoomClassModel = require("src/models/server/db/RoomClass")

const requestHandler = async (req, res, { mongoDbConfig }) => {

    const { body, method } = req;

    switch(method) {
        case "GET": {
            return RoomClassModel.getAll({}, { mongoDbConfig })
                .then(result => res.json({
                        data: result
                    })
                );
        }
        case "POST": {
            const { description } = JSON.parse(body);

            if(description && Boolean(description.trim()))  {
                return RoomClassModel.insert({ description }, { mongoDbConfig })
                    .then(() => {
                        res.status(201).json({ message: "Class was successfully created" });
                    })
            }

            throw new InputFormat("Invalid class name");
        }
        default: {
            return;
        }
    }
};

const handler = apiHandler(requestHandler )
export default handler;