const { apiHandler } = require("src/helpers/api-handler");

const ProductModel = require("src/models/server/db/Product")

const requestHandler = async (req, res, { mongoDbConfig, user }) => {

    const { method } = req;

    switch(method) {
        case "GET": {
            const products = await ProductModel.getAll({}, { mongoDbConfig });
            res.status(200).json(products);
            return;
        }
        case "POST": {
            const { body } = req; 
            const { available, barCode, category, sellVat, name, purchasePrice, purchaseVat, sellPrice  } = JSON.parse(body);

            await ProductModel.insert({
                available,
                barCode, 
                category,
                name, 
                purchasePrice, purchaseVAT: purchaseVat, 
                sellPrice, sellVAT: sellVat,
            }, { mongoDbConfig });

            res.status(201).json({ message: "Product was successfully registered" });
        }
        default: {
            return;
        }
    }
};

const handler = apiHandler(requestHandler )
export default handler;