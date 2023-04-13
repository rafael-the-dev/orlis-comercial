const formidable =  require('formidable');
const path = require("path");

const { apiHandler } = require("src/helpers/api-handler")
//const { connection } = require("src/connections/mysql");
const { deleteImage, getFile } = require("src/helpers/image")

const UserModel = require("src/models/server/db/User")

//set bodyparser
export const config = {
    api: {
        bodyParser: false
    }
}

const requestHandler = async (req, res, { mongoDbConfig }) => {

    const { method } = req;

    switch(method) {
        case "GET": {
            const result = await UserModel.getAll({}, { mongoDbConfig });
            const images = await Promise.all(result.map(item => getFile({ name: item.username })));

            const users = result
                .filter(user => user.category?.toLowerCase() !== "system")
                .map((user, index) => ({ ...user, image: images[index]}))
            res.json(users);
            return;
        }
        case "POST": {
            return new Promise((resolve, reject) => {
                const form = formidable({ 
                    filename: (name, ext) => `${ req.query?.user ?? name }${ext}`,
                    multiples: true ,
                    keepExtensions: true,
                    uploadDir: path.join(path.resolve("."), `/public/images/users`)
                });
                
                form.parse(req, async (err, fields, files) => {
                    if (err) reject({ err });

                    if(files) {
                        try {
                            await deleteImage({ name: await getFile({ name: req.query?.user }) });
                        } catch(e){}
                    }
                    
                    resolve({ err, fields, files })
                }) 
            }).then(async ({ fields }) => {
                
                const { firstName, lastName, password, user, username } = fields;

                await UserModel.insert({
                    category: user, firstName, lastName, password, username
                },
                { mongoDbConfig });

                res.status(201).send();
                return;
            })
        }
        default: {
            return;
        }
    }
};

const handler = apiHandler(requestHandler);

export default handler;