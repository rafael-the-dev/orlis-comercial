
const InputFormat = require("src/models/server/errors/AuthorizationError")

const { apiHandler } = require("src/helpers/api-handler")
//const { query } = require("src/helpers/db");

const RoomModel = require("src/models/server/db/Room");

const requestHandler = async (req, res, { mongoDbConfig }) => {

    const { body, method } = req;

    switch(method) {
        case "GET": {
            return RoomModel.getAll({}, { mongoDbConfig })
                .then(result => {
                    res.json({
                        data: result
                    });
                })
        }
        case "POST": {
            const { description, dailyPrice, hourlyPrice, number, roomClassId } = JSON.parse(body);
            ///const roomValues = [ number, description, roomClassId ];

            if(description && Boolean(description.trim()))  {
                return RoomModel.insert(
                    { description, dailyPrice, hourlyPrice, number, roomClassId }, 
                    { mongoDbConfig })
                    .then(() => res.status(201).json({ message: "Room was successfully created" }))

                /*return query(`INSERT INTO Room(Numero, Descricao, Classe, Date) VALUES(?,?,?, NOW())`, roomValues)
                    .then(({ insertId }) => {
                            const roomDetailsValues = [ insertId, hourlyPrice, dailyPrice ];
                            return query(`INSERT INTO RoomDetails(RoomNumber, Preco_hora, Preco_dia, Data) VALUES(?,?,?, NOW())`, roomDetailsValues)
                                .then(() => {
                                    res.status(201).json({ message: "Room was successfully created" });
                                }
                            );
                    })*/
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