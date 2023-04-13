const { apiHandler } = require("src/helpers/api-handler")
//const { query } = require("src/helpers/db");

const CategoryModel = require("src/models/server/db/Category")

const requestHandler = async (req, res, { mongoDbConfig }) => {

    const { method } = req;

    switch(method) {
        case "GET": {
            const categories = await CategoryModel.getAll({}, { mongoDbConfig });
            res.json(categories);
            return;
        }
        case "POST": {
            const { description, type } = JSON.parse(req.body);
            await CategoryModel.insert({ description, type }, { mongoDbConfig })
            res.status(201).send();
        }
        default: {
            return;
        }
    }
};

const handler = apiHandler(requestHandler )
export default handler;