
const { apiHandler } = require("src/helpers/api-handler");

const ClientModel = require("src/models/server/db/Client")

const requestHandler = (req, res, { mongoDbConfig }) => {
    const { body, method } = req;

    switch(method) {
        case "GET": {
            return ClientModel.getAll({}, { mongoDbConfig })
                .then(data => res.json({ data }))
        }
        case "POST": {
            const { address, document, documentNumber, firstName, lastName } = JSON.parse(body);

            return ClientModel.insert(
                { address, document, documentNumber, firstName, lastName }, 
                { mongoDbConfig }
            ).then(() => res.status(201).send());
        }
    }
};

const handler = apiHandler(requestHandler);

export default handler;