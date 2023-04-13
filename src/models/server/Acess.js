const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const AuthorizationError = require("./errors/AuthorizationError");
const Error404 = require("./errors/404Error");
const { getFile } = require("src/helpers/image")
const LoginError = require("./errors/LoginError");
const { query } = require("src/helpers/db");

const UserModel = require("./db/User")

class Access {
    static getUser(token) {
        try {
            const user = jwt.verify(token, process.env.JWT_SECRET_KEY);
            return user;
        } catch(e) {
            throw new AuthorizationError();
        }
    }

    static login = async ({ mongoDbConfig, password, res, username }) => {
        return mongoDbConfig.collections.USERS.findOne({ username })//query(`SELECT * FROM user WHERE username=?`, [ username ])
            .then(async user => {
                
                if(!user) throw new LoginError();

                const hasAccess = await bcrypt.compare(password, user.password);

                if(hasAccess) { //                     
                    const [ image, logId ] = await Promise.all([
                        getFile({ name: username }),
                        UserModel.logIn({ username }, { mongoDbConfig })
                    ]);

                    const acessToken = jwt.sign({ 
                        category: user.category, 
                        image,
                        loginId: logId, 
                        username,
                        id: user.id,
                        idUser: user.id
                    }, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });

                    const verifiedToken = jwt.verify(acessToken, process.env.JWT_SECRET_KEY);

                    res.json({
                        access: {
                            expiresIn: verifiedToken.exp, 
                            token: acessToken

                        },
                        category: user.category,
                        firstName: user.firstName,
                        image,
                        lastName: user.lastName,
                        username: user.username
                    });
                    return;
                }

                throw new LoginError();
            })


    }

    static async logout({ mongoDbConfig, res, token }) {
        try {
            const user = jwt.verify(token, process.env.JWT_SECRET_KEY);

            const { loginId, username } = user;
            
            await UserModel.logOut({ loginId, username }, { mongoDbConfig });
            res.send();

            /*return query(`UPDATE userlog SET Logout=now() WHERE idUserLog=? AND user=?;`, [ loginId, idUser ])
                .then(() => {
                    res.send()
                })
                .catch(e => res.status(500).json({ message: e.message }));*/
        } catch(e) {
            throw new AuthorizationError();
        }
    }

    static revalidateToken({ mongoDbConfig, res, token }) {
        try {
            const loggedUser = jwt.verify(token, process.env.JWT_SECRET_KEY);
            
            return  mongoDbConfig.collections.USERS.findOne({ username: loggedUser.username })
                .then(async user => {
                    
                    const acessToken = jwt.sign({ 
                        category: user.category, 
                        image: loggedUser.image,
                        loginId: loggedUser.logId, 
                        username: user.username,
                        id: user.id,
                        idUser: user.id
                    }, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });

                    const verifiedUser = jwt.verify(acessToken, process.env.JWT_SECRET_KEY);
                    
                    res.json({
                        access: {
                            expiresIn: verifiedUser.exp, 
                            token: acessToken
                        },
                        category: user.category,
                        firstName: user.firstName,
                        image: loggedUser.image,
                        lastName: user.lastName,
                        username: user.username
                    });
                })

        } catch(e) {
            throw new AuthorizationError();
        }
    }
}

module.exports = Access;