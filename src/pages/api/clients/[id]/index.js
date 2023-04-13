
const { apiHandler } = require("src/helpers/api-handler");

const ClientModel = require("src/models/server/db/Client")

const requestHandler = (req, res, { mongoDbConfig }) => {
    const { body, method, query: { id } } = req;

    switch(method) {
        case "GET": {
            return ClientModel.getAll({}, { mongoDbConfig })
                .then(data => res.json({ data }))
        }
        case "PUT": {
            const { address, document, documentNumber, firstName, lastName } = JSON.parse(body);

            return ClientModel.update(
                { address, document, documentNumber, firstName, id, lastName }, 
                { mongoDbConfig }
            ).then(() => res.send());
        }
        case "DELETE": {
            return ClientModel.delete({ id }, { mongoDbConfig })
                .then(() => res.send());
        }
        default: {
            throw new Error("Method not supported.")
        }
    }
};

const handler = apiHandler(requestHandler);

export default handler;