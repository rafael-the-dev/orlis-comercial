const uuidV4 = require("uuid").v4;

const currency = require("currency.js");

const { getTotalPrice } = require("src/helpers/price");
const { parseId } = require("src/helpers")

const Error404 = require("src/models/server/errors/404Error");

class Product {
    static async get({ id, barCode }, { mongoDbConfig: { collections } }) {
        const product = await collections.PRODUCTS.findOne({ $or: [{ id: parseId(id) }, { barCode }] });
        return product;
    }

    static async getAll({ filter }, { mongoDbConfig: { collections } }) {
        const products = await collections.PRODUCTS
            .find(filter ?? {})
            .toArray();
        
            
        const sortedProducts = products.sort((a, b) => {
            const aBarcode = a.barCode.toLowerCase();
            const bBarcode = b.barCode.toLowerCase();

            if(aBarcode === bBarcode) return 0;

            if(aBarcode > bBarcode) return 1;

            return -1;
        });

        return sortedProducts;
    }

    static async insert(product, { mongoDbConfig }) {
        const { 
            available,
            barCode, 
            category,
            name, 
            purchasePrice, purchaseVAT, 
            sellPrice, sellVAT,
        } = product;

        if(await this.get({ barCode }, { mongoDbConfig })) throw new Error404("Product already exists");

        const totalPurchasePrice = getTotalPrice({ price: purchasePrice, taxRate: purchaseVAT });
        const totalSellPrice = getTotalPrice({ price: sellPrice, taxRate: sellVAT});
        const profit = currency(totalSellPrice).subtract(totalPurchasePrice).value;

        const { collections } = mongoDbConfig;

        await collections.PRODUCTS.insertOne({
            available,
            barCode,
            date: Date.now().toString(),
            groupId: category,
            id: uuidV4(),
            name,
            profit, purchasePrice, purchaseVAT, 
            sellPrice, sellVAT,
            stock: {
                currentStock: 0,
                final: 0,
                id: uuidV4(),
                initial: 0
            },
            totalPurchasePrice, totalSellPrice
        });
    }

    static async add(product, { mongoDbConfig: { collections } }) {
        const { 
            barCode, 
            groupId,
            id,
            name, 
            profit, purchasePrice, purchaseVAT, 
            stock, sellPrice, sellVAT,
            totalPurchasePrice, totalSellPrice
        } = product;

        await collections.PRODUCTS.insertOne({
            barCode,
            date: Date.now().toString(),
            groupId: groupId,
            id,
            name,
            profit, purchasePrice, purchaseVAT, 
            sellPrice, sellVAT,
            stock,
            totalPurchasePrice, totalSellPrice
        });
    }

    static async sell({ id, quantity }, { mongoDbConfig }) {
        const product = await this.get({ id }, { mongoDbConfig });

        if(!product) throw new Error404("Product not found");

        const { collections } = mongoDbConfig;

        const newStock = currency(product.stock.currentStock).subtract(quantity).value;

        await collections.PRODUCTS.updateOne(
            { id: parseId(id) },
            { 
                $set: { 'stock.currentStock': newStock },
            }
        );
    }

    static async update({ id, newProduct, key, value }, { mongoDbConfig }) {
        const product = await this.get({ id: parseId(id) }, { mongoDbConfig });

        if(!product) throw new Error404(`Product with id '${id}' not found`);

        const { collections } = mongoDbConfig;

        await collections.PRODUCTS.updateOne(
            { id: parseId(id) },
            { 
                $set: newProduct ?? { [key]: value },
            }
        );
    }
}

module.exports = Product;