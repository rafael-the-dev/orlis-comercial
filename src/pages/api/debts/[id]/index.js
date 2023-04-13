
const { apiHandler } = require("src/helpers/api-handler");

const DebtModel = require("src/models/server/db/Debt");

const requestHandler = (req, res, { mongoDbConfig, user }) => {
    const { body, method, query: { id }} = req;

    switch(method) {
        case "PUT": {
            const { payments } = JSON.parse(body);

            return DebtModel.update({ id, payments }, { mongoDbConfig, user })
                .then(() => res.status(203).send());
        }
        default: {
            throw new Error("Method not supported")
        }
    }
};

const handler = apiHandler(requestHandler);

export default handler;