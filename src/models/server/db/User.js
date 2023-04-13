const bcrypt = require("bcrypt");
const uuidV4 = require("uuid").v4;

const Error404 = require("../errors/404Error");

class User {
    static async get({ filter, username }, { mongoDbConfig: { collections } }) {
        const result = await collections.USERS
            .findOne(filter ?? { username });

        if(!result) throw new Error404("User not found");
        
        const { _id, password, ...rest } = result;
        const user = { ...rest };
        return user;
    }

    static async getAll({ filter }, { mongoDbConfig: { collections } }) {
        const result = await collections.USERS
            .find(filter ?? {})
            .toArray();
        
        const users = result.map(({ _id, password, ...rest }) => ({ ...rest }));
        return users;
    }

    static async insert({ category, firstName, lastName, password, username }, { mongoDbConfig: { collections } }) {
        const hashedPassword = await bcrypt.hash(password, 10);

        await collections.USERS.insertOne({
            category,
            firstName,
            id: uuidV4(),
            lastName,
            password: hashedPassword,
            username
        })
    }

    static async logIn({ username }, { mongoDbConfig }) {
        const { collections } = mongoDbConfig;
        
        const user = await this.get({ username }, { mongoDbConfig });

        const logId = uuidV4();

        const log = {
            id: logId,
            logIn: new Date(Date.now()).toISOString(),
            logOut: ""
        }

        const logs = {
            ...user.logs,
            [logId]: log
        };

        await collections.USERS.updateOne(
            { username },
            { $set: { logs }}
        );

        return logId;
    }

    static async logOut({ loginId, username }, { mongoDbConfig }) {
        const { collections } = mongoDbConfig;
        
        const user = await this.get({ username }, { mongoDbConfig });

        const logs = { ...user.logs };

        logs[loginId]['logOut'] = new Date(Date.now()).toISOString();

        await collections.USERS.updateOne(
            { username },
            { $set: { logs }}
        );
    }

    static async update({ filter, key, userObj, value }, { mongoDbConfig }) {
        await this.get({ filter }, { mongoDbConfig });

        const { collections } = mongoDbConfig;

        await collections.USERS.updateOne(
            filter,
            { 
                $set: userObj ?? { [key]: value },
            }
        );
    }
}

module.exports = User;