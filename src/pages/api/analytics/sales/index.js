const currency = require("currency.js")

const { apiHandler } = require("src/helpers/api-handler")
//const { query } = require("src/helpers/db");

const AuthorizationError = require("src/models/server/errors/AuthorizationError")

const SalesAnalyticsModel = require("src/models/server/db/SalesAnalytics")

const requestHandler = async (req, res, { mongoDbConfig, user } ) => {

    let { method, query: { barman, endDate, product, startDate, soldBy, table, username } } = req;

    switch(method) {
        case "GET": {
            if(soldBy && ![ "administrator", "manager" ].includes(user.category.toLowerCase())) {
                throw new AuthorizationError("You don't have access these sales")
            }

            const sales = await SalesAnalyticsModel.analise(
                { barman, endDate, loggedUser: user, product, startDate, soldBy, table, username },
                { mongoDbConfig }
            );

            res.status(200).json({ data: sales }); 
            return;
        }
        default: {
            return;
        }
    }
};

const handler = apiHandler(requestHandler )
export default handler;