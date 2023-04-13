const currency = require("currency.js");
const moment = require("moment");
const uuidV4 = require("uuid").v4;

const { getPriceVAT, getTotalPrice } = require("./price");

const ProductModel = require("src/models/server/db/Product");

const getProductsFromDB = async ({ mongoDbConfig, productsIds }) => {
    const products = await ProductModel.getAll({ filter: { id: { $in: productsIds }}}, { mongoDbConfig });
    return products;
};

const getProductsIds = products => products.map(item => item.id);

const getProductsList = ({ currentProducts, products }) => products.map(product => {
    const result = currentProducts.find(item => item.id === product.id);
    const { _id, stock, ...productRest } = result;

    return {
        id: product.id,
        item: { ...productRest },
        quantity: product.quantity
    };
});

const getPaymentAmount = (products) => {
    const payment = products.reduce((prevValue, { item: { sellVAT, totalSellPrice }, quantity }) => {
        const totalPrice = currency(quantity).multiply(totalSellPrice).value;
        const vat = getPriceVAT({ price: totalPrice, taxRate: sellVAT }).value;
        const total = getTotalPrice({ price: totalPrice, taxRate: sellVAT });

        return {
            amount: currency(totalPrice).add(prevValue.amount).value, 
            total: currency(total).add(prevValue.total).value, 
            vat: currency(vat).add(prevValue.vat).value
        }
    }, { amount: 0, subTotal: 0, total: 0, vat: 0 })

    return payment;
}

const removeProductFromStock = async ({ barmanId, products, tableId }, { collectionName, mongoDbConfig, onSuccess, user }) => {
    const id = uuidV4();

    const productsIds = getProductsIds(products);

    const currentProducts = await getProductsFromDB({ mongoDbConfig, productsIds });
    
    let productsList = getProductsList({ currentProducts, products });
    
    const paymentAmount = getPaymentAmount(productsList);
    paymentAmount.subTotal = paymentAmount.amount; 

    const sale = {
        ...paymentAmount,
        barmanId,
        date: new Date(Date.now()).toISOString(),
        id,
        products: productsList,
        tableId: tableId ?? "",
        user:  user.idUser,
    }
    
    const { collections } = mongoDbConfig;

    try {
        await Promise.all(products.map(({ id, quantity }) => ProductModel.sell({ id, quantity }, { mongoDbConfig })));
        
        await onSuccess({ sale }); // add current sale to table/collections
    } 
    catch(e) {
        console.error(e);

        // remove current sale from table/collections
        collections[collectionName].deleteOne({ id })

        //update products with previos stock value if an error occured
        Promise.all(currentProducts.map(({ id, stock }) => {
            return ProductModel.update({ id, key: "stock", value: stock }, { mongoDbConfig })
        }));

        throw e;
    } 
    
    /*if(isSold) {
        // add current product details to each sold product
        // product price can vary during the time, so setting current product's details
        // can make profite realiable 
        productsList = productsList.map(listItem => {
            const result = currentProducts.find(item => item.id === listItem.id);
            const { _id, stock, ...productRest } = result;

            return {
                id: listItem.id,
                item: { ...productRest },
                quantity: listItem.quantity
            };
        });

        collections[collectionName].updateOne(
            { id },
            { $set: { products: productsList }}
        );
    }*/

    return id;
}

module.exports = {
    getPaymentAmount,
    removeProductFromStock
};