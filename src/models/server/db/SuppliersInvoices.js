const currency  = require("currency.js");

const Error404 = require("../errors/404Error")
const ProductModel  = require("./Product");

class SuppliersInvoices {
    static async getAll({ filter }, { mongoDbConfig }) {
        const { collections } = mongoDbConfig;

        const result = await collections.SUPPLIERS_INVOICES
            .aggregate([
                { $match: filter ?? {} },
                {
                    $lookup: {
                        from: "suppliers",
                        foreignField: "id",
                        localField: "supplier",
                        as: "supplier"
                    }
                },
                { $unwind: "$supplier" }
            ])
            .toArray()

        return result;
    }

    static async insert({ products, reference, supplier }, { mongoDbConfig }) {

        const invoice = {
            date: new Date(Date.now()).toISOString(),
            reference,
            supplier,
            subTotal: 0,
            totalVAT: 0,
            total: 0
        };

        const productsIds = products.map(item => item.id);
        const currentProducts = await ProductModel.getAll({ filter: { id: { $in: productsIds }}}, { mongoDbConfig });

        const { collections } = mongoDbConfig;

        try {
            await Promise.all([
                collections.SUPPLIERS_INVOICES.insertOne(invoice),
                products.map(product => {
                    const { id, purchasePrice, purchaseVAT, stock: { quantity } } = product;
                    const currentProduct = currentProducts.find(item => item.id === id);

                    if(!currentProduct) throw new Error404(`Product with id '${id}' does not exist`);

                    const total = currency(currentProduct.stock.currentStock).add(quantity).value;

                    return ProductModel.update({ id, key: "stock.currentStock", value: total }, { mongoDbConfig })
                }).flatMap(item => item)
            ])
        } catch(e) {
            console.error(e)

            Promise.all(currentProducts.map(({ id, stock }) => {
                return ProductModel.update({ id, key: "stock", value: stock }, { mongoDbConfig })
            }));

            throw e;
        }
    }
}

module.exports = SuppliersInvoices;