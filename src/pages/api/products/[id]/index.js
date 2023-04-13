const currency = require("currency.js");

const Error404 = require("src/models/server/errors/404Error");

const { apiHandler } = require("src/helpers/api-handler")
const { getTotalPrice } = require("src/helpers/price");

const ProductModel = require("src/models/server/db/Product");

const requestHandler = async (req, res, { mongoDbConfig }) => {

    const { method, query: { id } } = req;

    switch(method) {
        case "GET": {
            const product = await ProductModel.get({ id: id }, { mongoDbConfig });

            if(!product) throw new Error404("Product not found");
            
            res.json(product);
            return;
        }
        case "PUT": {
            const { body } = req; 
            const { available, barCode, category, date, sellVat, name, purchasePrice, purchaseVat, sellPrice  } = JSON.parse(body);
            
            const totalPurchasePrice = getTotalPrice({ price: purchasePrice, taxRate: purchaseVat });
            const totalSellPrice = getTotalPrice({ price: sellPrice, taxRate: sellVat});
            const profit = currency(totalSellPrice).subtract(totalPurchasePrice).value;

            //const values = [ available, barCode, category, date, sellVat, name, purchasePrice, purchaseVat, sellPrice, profit, id ];

            await ProductModel.update({ id: id, newProduct: {
                barCode,
                groupId: category,
                name,
                profit, purchasePrice, purchaseVAT: purchaseVat,
                sellPrice, sellVAT: sellVat,
                totalPurchasePrice, totalSellPrice
            }}, { mongoDbConfig });

            res.json({ message: "Product was successfully updated" });
            return;

            /*return query(`SELECT * FROM Produto WHERE idProduto=?`, [ id ])
                .then(result => {
                    if(result.length === 0) throw new Error404("Product not found.");

                    return query(`UPDATE Produto SET Estado=?, BarCod=?, fk_grupo=?, Data=?, Iva_venda=?, Nome=?, Preco_compra=?, IVA_compra=?, Preco_venda=?, Profit=? WHERE idProduto=?`, values)
                        .then(() => res.json({ message: "Product was successfully updated" }));
                })*/
        }
        default: {
            return;
        }
    }
};

const handler = apiHandler(requestHandler )
export default handler;