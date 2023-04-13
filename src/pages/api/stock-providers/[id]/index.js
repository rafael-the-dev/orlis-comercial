const { apiHandler } = require("src/helpers/api-handler");

const SupplierModel = require("src/models/server/db/Suppliers");

const requestHandler = async (req, res, { mongoDbConfig }) => {
    const { body, method, query: { id } } = req;

    switch(method) {
        case "GET": {
            return SupplierModel.get({ id }, { mongoDbConfig })
                .then(supplier => res.status(200).json(supplier))
            /*return query(`
                SELECT idFornecedor AS id, Nome AS name, Nuit AS nuit, Morada AS address, Estado AS state, 
                Data AS date FROM Fornecedor WHERE idFornecedor=?;`, [ id ])
                .then(result => {
                    if(result.length === 0) throw new Error404("Supplier not found");

                    
                })*/
        }
        case "PUT": {
            const { address, name, nuit } = JSON.parse(body);
            await SupplierModel.update({ address, id, name, nuit }, { mongoDbConfig });
            res.send();
            return;
            /*return query(`UPDATE Fornecedor SET Nome=?, Nuit=?, Morada=? WHERE idFornecedor=?`, [ name, nuit, address, id ])
                .then(() => res.status(200).send());*/
        }
    }
};

const handler = apiHandler(requestHandler);

export default handler;