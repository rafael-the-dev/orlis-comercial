const uuidV4 = require("uuid").v4;

class Category {
    static async getAll({ filter }, { mongoDbConfig: { collections } }) {
        const categories = await collections.CATEGORIES
            .find(filter ?? {})
            .toArray();
        
        const sortedCategories = categories.sort((a, b) => {
            const aDescription = a.description.toLowerCase();
            const bDescription = b.description.toLowerCase();

            if(aDescription === bDescription) return 0;

            if(aDescription > bDescription) return 1;

            return -1;
        });

        return sortedCategories;
    }

    static async insert({ description, type }, { mongoDbConfig: { collections }}) {
        await collections.CATEGORIES.insertOne({
            description, 
            id: uuidV4(), 
            type
        })
    }
}

module.exports = Category;