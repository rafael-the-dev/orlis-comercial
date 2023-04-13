const currency = require("currency.js");
const moment = require("moment");
const uuidV4 = require("uuid").v4;

const { resetDate } = require("src/helpers/date")
const { getIsoDate, parseId } = require("src/helpers")
const { getPriceVAT, getTotalPrice } = require("src/helpers/price");

const Error404 = require("../errors/404Error");
const InvalidValueError = require("../errors/AuthorizationError")
const ProductModel = require("./Product");

const date = moment(Date.now());
const currentYear = new Date(Date.now()).getFullYear();
const currentDay = date.format("DD");
const currentMonth = date.format("MMMM").toLowerCase();

//const { parseId } = require("src/helpers");

class Sale {
    static async get({ id, date }, { mongoDbConfig: { collections } }) {
        const sale = await collections.SALES.findOne({ $or: [{ id: parseId(id) }, { date }] });
        return sale;
    }

    static async getAll({ barman, endDate, filter, loggedUser, product, soldBy, startDate, table }, { mongoDbConfig }) {
        const { collections } = mongoDbConfig;

        let filters = {};

        if(product) {
            let productsIds = [ parseId(product) ];

            if(Array.isArray(product)) {
                productsIds = product.map(productId => parseId(productId));
            }

            filters = { ...filters, 'products.id': { $in: productsIds } };
        }

        if(![ "administrator", "manager" ].includes(loggedUser.category.toLowerCase())) {
            filters = { ...filters, user: parseId(loggedUser.id ?? loggedUser.idUser) }
        } 

        if(soldBy) {
            filters = { ...filters, user: parseId(soldBy) };
        }

        if(barman) {
            filters = { ...filters, barmanId: parseId(barman) };
        }

        if(table) {
            filters = { ...filters, tableId: parseId(table) };
        }

        const matchStage = { $match: filter ?? { ...resetDate({ endDate, startDate }), ...filters } };
        
        let sales = await collections.SALES
            .aggregate([
                matchStage, // filter sales by date//tableId
                {
                    $lookup: { // INNER JOIN users collection
                        as: "user",
                        from: "users",
                        foreignField: "id",
                        localField: "user"
                    }
                },
                {
                    $lookup: { // INNER JOIN users collection
                        as: "barman",
                        from: "barmen",
                        foreignField: "id",
                        localField: "barmanId"
                    }
                },
                {
                    $lookup: { // INNER JOIN barmen collection
                        as: "table",
                        from: "tables",
                        foreignField: "id",
                        localField: "tableId"
                    }
                },
                { $unwind: "$user"},
                { $unwind: 
                    {
                        path: "$barman",
                        preserveNullAndEmptyArrays: true
                    }
                },
                { $unwind: 
                    {
                      path: "$table",
                      preserveNullAndEmptyArrays: true
                    }
                }
            ])
            .toArray()
        
        // remove logs property from user property
        sales = sales.map((saleItem) => {
            const { user, ...saleItemRest } = saleItem;
            const { logs, ...userRest } = user;
           
            return {
                ...saleItemRest,
                user: { ...userRest }
            };
        });

        const initial = { profit: 0, subTotal: 0, total: 0, totalAmount: 0, totalVAT: 0 };
        const statistics = sales.reduce((previousValue, currentSale) => {
            const { amount, products, subTotal, total, vat } = currentSale;

            // sum sales profit
            const currentSaleProfit = products.reduce((previousProfit, currentSoldProduct) => {
                return currency(currentSoldProduct.item.profit).multiply(currentSoldProduct.quantity).add(previousProfit).value;
            }, 0)

            return {
                profit: currency(currentSaleProfit).add(previousValue.profit).value,
                subTotal: currency(previousValue.subTotal).add(subTotal).value, 
                total: currency(previousValue.total).add(total).value, 
                totalAmount: currency(previousValue.totalAmount).add(amount).value, 
                totalVAT: currency(previousValue.vat).add(vat).value
            }
        }, initial);
        
        return { list: sales, statistics };
    }

    static async insert({ barmanId, products, paymentMethods, tableId }, { mongoDbConfig, user }) {
        const id = uuidV4();

        const totalVAT = currency(products.reduce((previousValue, currentProduct) => {
            return currency(currentProduct.totalVAT).add(previousValue);
        }, 0)).value;

        const totalAmount = currency(products.reduce((previousValue, currentProduct) => {
            return currency(currentProduct.subTotal).add(previousValue);
        }, 0)).value;

        let productsList = products.map(item => ({
            id: item.id,
            quantity: item.quantity
        }))

        const sale = {
            amount: totalAmount,
            barmanId,
            date: getIsoDate(),
            id,
            products: productsList,
            paymentMethods,
            subTotal: totalAmount,
            total: totalAmount,
            tableId: tableId ?? "",
            user:  user.idUser,
            vat: totalVAT
        }

        const productsIds = products.map(item => item.id);

        const currentProducts = await ProductModel.getAll({ filter: { id: { $in: productsIds }}}, { mongoDbConfig });
        
        const { collections } = mongoDbConfig;

        let isSold = false;

        try {

            await collections.SALES.insertOne(sale);

            await Promise.all(products.map(({ id, quantity }) => ProductModel.sell({ id, quantity }, { mongoDbConfig })));
            isSold = true;
        } catch(e) {
            console.error(e)

            Promise.all(currentProducts.map(({ id, stock }) => {
                return ProductModel.update({ id, key: "stock", value: stock }, { mongoDbConfig })
            }));

            throw new Error();
        } 
        
        if(isSold) {
            productsList = productsList.map(listItem => {
                const result = currentProducts.find(item => item.id === listItem.id);
                const { _id, stock, ...productRest } = result;

                return {
                    id: listItem.id,
                    item: { ...productRest },
                    quantity: listItem.quantity
                };
            });

            collections.SALES.updateOne(
                { id },
                { $set: { products: productsList }}
            );
        }

        return id;
    }

    static async resolveDebt({ selectedDebt }, { mongoDbConfig: { collections } }) {
        const { _id, debt, remainingBalance, status, ...rest } = selectedDebt;

        await collections.SALES
            .insertOne({
                ...rest,
                date: getIsoDate(),
                type: "DEBT_PAYMENT"
            });
    }

    static async remove({ id }, { mongoDbConfig }) {
        await this.get({ id }, { mongoDbConfig })

        await mongoDbConfig.collections
            .SALES
            .deleteOne({ $or: [ { id: parseId(id) }, { debtId: parseId(id) }] })
    }

    static async update({ id, products }, { mongoDbConfig, user }) {
        const { collections } = mongoDbConfig;

        const sale = await this.get({ id }, { mongoDbConfig });
        const newSale = { 
            ...sale,
            modifiedBy: user.id,
            modiefiedAt: getIsoDate()
        };

        const productsIds = products.map(item => item.id);

        const currentProducts = await ProductModel.getAll({ filter: { id: { $in: productsIds }}}, { mongoDbConfig });

        try {
            await Promise.all(products.map(product => {
                const { quantity } = product;
                const currentProduct = currentProducts.find(item => item.id === product.id);
                const soldProduct = newSale.products.find(item => item.id === product.id);
                
                // throw and Error if product was not found.
                if(!currentProduct || !soldProduct) throw new Error404(`Product with id '${product.id}' not found.`);
                
                const { currentStock } = currentProduct.stock;
                let stockObj = {};
                let newSoldProctValue = currency(soldProduct.quantity).add(quantity).value;

                if(quantity === 0) {
                    newSoldProctValue = null; 
                    
                    // return product quantity to stock if quantity is equal to zero
                    stockObj = {
                        ...currentProduct.stock,
                        currentStock: currency(currentStock).add(soldProduct.quantity).value
                    };
                }
                else {
                    if(quantity > 0) { // quantity must not greater than available product's stock
                        if(quantity > currentStock) throw new InvalidValueError(`Quantity of product with id '${product.id}' is greater than available stock.`);
                    } 
                    
                    // if the quantity is less than zero this will increment current stock, 
                    //it means that the client is returning some products
                    stockObj = {
                        ...currentProduct.stock,
                        currentStock: currency(currentStock).subtract(quantity).value 
                    };
                }

                if(newSoldProctValue) {
                    soldProduct.quantity = newSoldProctValue;
                }
                else { 
                    //if new value if null or zero remove product from sale
                    //it means that the user added it by accident or the client is returning it
                    newSale.products = newSale.products.filter(item => item.id !== soldProduct.id);
                }

                return ProductModel.update(
                    { id: product.id, key: "stock", value: stockObj }, 
                    { mongoDbConfig }
                );
            }));

            const payment = sale.products.reduce((prevValue, { item: { sellVAT, totalSellPrice }, quantity }) => {
                const totalPrice = currency(quantity).multiply(totalSellPrice).value;
                const vat = getPriceVAT({ price: totalPrice, taxRate: sellVAT }).value;
                const total = getTotalPrice({ price: totalPrice, taxRate: sellVAT });
    
                return {
                    amount: currency(totalPrice).add(prevValue.amount).value, 
                    total: currency(total).add(prevValue.total).value, 
                    vat: currency(vat).add(prevValue.vat).value
                }
            }, { amount: 0, subTotal: 0, total: 0, vat: 0 })

            newSale.amount = payment.amount;
            newSale.subTotal = payment.amount;
            newSale.total = payment.total;
            newSale.vat = payment.vat;

            await collections.SALES.updateOne(
                { id: parseId(id) },
                { $set: newSale }
            );
        }
        catch(err) {
            await Promise.all(currentProducts.map(item => {
                return ProductModel.update(
                    { id: item.id, key: "stock", value: item.stock },
                    { mongoDbConfig }
                );
            }));

            await collections.SALES.updateOne(
                { id: parseId(id) },
                { $set: sale }
            );

            throw err;
        }

        return;
    }
}

module.exports = Sale;