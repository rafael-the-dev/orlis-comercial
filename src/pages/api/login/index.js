
const { apiHandler } = require("src/helpers/api-handler")
const Access = require("src/models/server/Acess")

const requestHandler = async (req, res, { mongoDbConfig }) => {

    const { method } = req;
    
    switch(method) {
        case "PUT": {
            const { body } = req; 
            const { password, username } = JSON.parse(body);
            const { authorization } = req.headers;
            
            if(Boolean(authorization)) return Access.revalidateToken({ mongoDbConfig, res, token: authorization })
            
            return Access.login({ mongoDbConfig, password, res, username });
        }
        default: {
            return;
        }
    }
};

const handler = apiHandler(requestHandler )
export default handler;