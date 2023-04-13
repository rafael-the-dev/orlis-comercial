const currency = require("currency.js")

const { apiHandler } = require("src/helpers/api-handler")
const { query } = require("src/helpers/db");
const SaleDetails = require("src/models/server/SaleDetails");

const SaleModel = require("src/models/server/db/Sale")

const requestHandler = async (req, res, { mongoDbConfig, user }) => {

    const { body, method, query: { id } } = req;

    switch(method) {
        case "PUT": {
            const { products } = JSON.parse(body);

            return SaleModel.update({ id, products }, { mongoDbConfig, user })
                .then(() => res.status(201).send());
        }
    }
};

const handler = apiHandler(requestHandler )
export default handler;