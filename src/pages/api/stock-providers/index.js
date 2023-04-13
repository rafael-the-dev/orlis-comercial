

const { apiHandler } = require("src/helpers/api-handler");
//const { query } = require("src/helpers/db")

const SupplierModel = require("src/models/server/db/Suppliers");

const requestHandler = async (req, res, { mongoDbConfig }) => {
    const { body, method } = req;

    switch(method) {
        case "GET": {
            const list = await SupplierModel.getAll({}, { mongoDbConfig });
            res.status(200).json(list);
            return;
        }
        case "POST": {
            const { address, name, nuit } = JSON.parse(body);
            await SupplierModel.insert({ address, name, nuit }, { mongoDbConfig });
            res.status(201).send();
            return;
            /*return query(`INSERT INTO Fornecedor(Nome, Nuit, Morada, Estado, Data) VALUES(?,?,?, "ACTIVO", NOW())`, [ name, nuit, address ])
                .then(() => res.status(201).send());*/
        }
    }
};

const handler = apiHandler(requestHandler);

export default handler;