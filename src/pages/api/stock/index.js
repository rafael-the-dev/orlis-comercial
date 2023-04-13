

const { apiHandler } = require("src/helpers/api-handler");
const { query } = require("src/helpers/db")

const ProductModel = require("src/models/server/db/Product");

const requestHandler = async (req, res, { mongoDbConfig }) => {
    const { method } = req;

    switch(method) {
        case "GET": {
            const products = await ProductModel.getAll({}, { mongoDbConfig });
            res.status(200).json(products);
            return;

            return query(`
                SELECT produto.idProduto AS id, BarCod AS barCode, produto.Nome AS name, fk_grupo AS groupId, 
                Preco_compra AS purchasePrice, Iva_compra AS purchaseVAT, produto.Preco_venda as sellPrice, 
                produto.Iva_venda as sellVAT, Total_Preco_compra AS totalPurchasePrice,
                stock.idStock as stockId, stock.inicial as initial, stock.final, stock.total,  
                user.idUser as userId, user.Nome as firstName, user.apelido as lastName, user.categoria as category
                FROM produto
                INNER JOIN stock ON produto.idProduto=stock.idProduto
                INNER JOIN user ON stock.user=user.idUser;`
            ).then(result => {
                const productsStockList = result.map(item => {
                    const { category, final, firstName, initial, lastName, stockId, total, userId, ...res } = item;

                    return {
                        ...res,
                        stock: {
                            final, initial, stockId, currentStock: total,
                            user: {
                                category, firstName, lastName, userId
                            }
                        }
                    }
                });

                res.json(productsStockList);
            });
        }
        default: {
            throw new Error();
        }
    }
};

const handler = apiHandler(requestHandler);

export default handler;