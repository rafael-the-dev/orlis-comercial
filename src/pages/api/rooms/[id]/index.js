
const InputFormat = require("src/models/server/errors/AuthorizationError")

const { apiHandler } = require("src/helpers/api-handler")
//const { query } = require("src/helpers/db")

const RoomModel = require("src/models/server/db/Room");

const requestHandler = async (req, res, { mongoDbConfig }) => {

    const { body, method, query: { id } } = req;

    switch(method) {
        case "GET": {
            return RoomModel.get({ id }, { mongoDbConfig })
                .then(room => res.json(room));
        }
        case "PUT": {
            const { description, dailyPrice, hourlyPrice, number, roomClassId } = JSON.parse(body);
            //console.log(typeof id)
            //const roomValues = [ number, description, roomClassId, id ];
            //const roomDetailsValues = [ hourlyPrice, dailyPrice, id ];

            return RoomModel.update({ id, description, dailyPrice, hourlyPrice, number, roomClassId }, { mongoDbConfig })
                .then(() => res.json({ message: "Room was successfully updated" }));

            /*await Promise.all([
                query(`UPDATE Room SET Numero=?, Descricao=?, Classe=? WHERE idRoom=?`, roomValues),
                query(`UPDATE RoomDetails SET Preco_hora=?, Preco_dia=? WHERE RoomNumber=?`, roomDetailsValues)
            ]);

            res.status(200).json({ message: "Room was successfully updated" });*/
        }
        default: {
            return;
        }
    }
};

const handler = apiHandler(requestHandler )
export default handler;