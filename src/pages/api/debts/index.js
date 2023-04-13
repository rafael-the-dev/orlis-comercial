
const { apiHandler } = require("src/helpers/api-handler");

const DebtModel = require("src/models/server/db/Debt")

const requestHandler = async (req, res, { mongoDbConfig, user }) => {
    let { method, query: { endDate, startDate } } = req;

    switch(method) {
        case "GET": {
            const debts = await DebtModel.getAll(
                { endDate, loggedUser: user, startDate },
                { mongoDbConfig }
            );
            res.status(200).json({ data: debts }); 
            return;
        }
        case "POST": {
            const { body } = req; 
            let { barman, debt, products, tableId } = JSON.parse(body);
            const barmanId = barman ? barman.id : "";

            const saleId = await DebtModel.insert(
                {
                    barmanId, debt, products, tableId
                }, 
                { mongoDbConfig, user }
            );
            
            res.json({ message: "Divida feita com successo", salesserie: saleId });

            return;
        }
        default: {
            throw new Error("Request method not supported")
        }
    }
};

const handler = apiHandler(requestHandler);
export default handler;