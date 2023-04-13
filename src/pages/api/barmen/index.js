const { apiHandler } = require("src/helpers/api-handler")
//const { query } = require("src/helpers/db")

const BarmanModel = require("src/models/server/db/Barman");

const requestHandler = async (req, res, { mongoDbConfig }) => {

    const { method } = req;

    switch(method) {
        case "GET": {
            return BarmanModel.getAll({}, { mongoDbConfig })
                .then(result => res.json(result))
            //return query(`SELECT idBarman AS id, nome AS firstName, apelido AS lastName FROM barman;`)
              //  .then(result => {
                    //res.json([])//result)
                //})
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