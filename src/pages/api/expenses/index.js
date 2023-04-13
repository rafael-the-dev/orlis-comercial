
const { apiHandler } = require("src/helpers/api-handler");

const ExpenseModel = require("src/models/server/db/Expenses");

const requestHandler = (req, res, { mongoDbConfig, user }) => {
    const { body, method } = req;

    switch(method) {
        case "GET": {
            return ExpenseModel.getAll({}, { mongoDbConfig })
                .then(data => res.send({ data }));
        }
        case "POST": {
            const { category, products } = JSON.parse(body);

            return ExpenseModel.insert({ category, products }, { mongoDbConfig, user })
                .then(() => res.status(201).send())
        }
        default: {
            throw new Error("Http method not supported.")
        }
    }
};

const handler = apiHandler(requestHandler);

export default handler;