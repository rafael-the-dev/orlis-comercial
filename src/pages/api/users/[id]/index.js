const formidable =  require('formidable');
const path = require("path");

const { apiHandler } = require("src/helpers/api-handler")
//const { query } = require("src/helpers/db");
const { deleteImage, getFile } = require("src/helpers/image")

const UserModel = require("src/models/server/db/User");

//set bodyparser
export const config = {
    api: {
        bodyParser: false
    }
}

const requestHandler = async (req, res, { mongoDbConfig }) => {

    const { method, query: { id , user} } = req;
    
    switch(method) {
        case "GET": {
            const result = await UserModel.get({ username: id }, { mongoDbConfig })
            res.json(result);
            return;
        }
        case "PUT": {
            return UserModel.get({ username: id }, { mongoDbConfig })
                .then(result => {
                    if(result.length === 0 ) throw new Error("User not found");
                    
                    return new Promise((resolve, reject) => {
                        const form = formidable({ 
                            filename: (name, ext) => `${ user ?? name }${ext}`,
                            multiples: true ,
                            keepExtensions: true,
                            uploadDir: path.join(path.resolve("."), `/public/images/users`)
                        });
                    
                        form.parse(req, async (err, fields, files) => {
                            if (err) reject({ err });

                            if(files) {
                                try {
                                    await deleteImage({ name: await getFile({ name: username }) });
                                } catch(e){}
                            }

                            resolve({ err, fields, files })
                        }) 
                    }).then(({ fields }) => {
                        const { firstName, lastName, user, username } = fields;
                        
                        const filter = { username };

                        return UserModel.update(
                            { 
                                filter,
                                userObj: { 
                                    firstName, 
                                    lastName, 
                                    category: user
                                }
                            }, 
                            { mongoDbConfig }
                        )
                        .then(() => res.json({ message: "Dados atualizados" }));
                    });
                })
        }
        default: {
            return;
        }
    }
};

const handler = apiHandler(requestHandler);

export default handler;