const AuthorizationError = require("src/models/server/errors/AuthorizationError");
const { apiHandler } = require("src/helpers/api-handler")
const { query } = require("src/helpers/db");
const Acess = require("src/models/server/Acess")

const requestHandler = async (req, res, { mongoDbConfig }) => {

    const { method } = req;

    switch(method) {
        case "PUT": {
            const { authorization } = req.headers;

            if(Boolean(authorization)) return Acess.logout({ mongoDbConfig, res, token: authorization });

            throw new AuthorizationError()
        }
        default: {
            return;
        }
    }
};

const handler = apiHandler(requestHandler )
export default handler;