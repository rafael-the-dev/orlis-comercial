const { apiHandler } = require("src/helpers/api-handler")
//const { query } = require("src/helpers/db");

const TableModel = require("src/models/server/db/Table");

const requestHandler = async (req, res, { mongoDbConfig }) => {

    const { method } = req;

    switch(method) {
        case "GET": {
            return TableModel.getAll({}, { mongoDbConfig })
                .then(result => res.json(result));
            /*return query(`SELECT idMesa AS id, descricao AS description, codigo AS code FROM mesa;`)
                .then(result => {
                    res.json(result)
                })*/
        }
        case "POST": {
            throw new Error();
        }
        default: {
            return;
        }
    }
};

const handler = apiHandler(requestHandler )
export default handler;