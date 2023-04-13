

const { apiHandler } = require("src/helpers/api-handler");
const { query } = require("src/helpers/db");
const { getTotalPrice, getPriceVAT } = require("src/helpers/price");

const SuppliersInvoicesModel = require("src/models/server/db/SuppliersInvoices")

const requestHandler = async (req, res, { mongoDbConfig, user }) => {
    const { method } = req;

    switch(method) {
        case "GET": {
            const result = await SuppliersInvoicesModel.getAll({}, { mongoDbConfig });
            res.status(200).json(result);
            return;
            
            return query(`
                SELECT factura_fornecedor.idFactura_Fornecedor as id, factura_fornecedor.idFactura_Fornecedor as providerId, factura_fornecedor.CodFactura as invoiceCode, factura_fornecedor.IVA as totalVAT, factura_fornecedor.subTotal as subTotal, factura_fornecedor.total as total, factura_fornecedor.Data as date,
                fornecedor.Nome as providerName, fornecedor.idFornecedor as providerId, fornecedor.Morada as address
                FROM factura_fornecedor
                INNER JOIN fornecedor ON factura_fornecedor.fornecedor=fornecedor.idFornecedor;
            `).then(result => {
                res.status(200).json(result.map(({ address, providerName, providerId, ...rest }) => ({
                    ...rest,
                    provider: {
                        address,
                        id: providerId,
                        name: providerName
                    }
                })))
            })
        }
        case "POST": {
            const { invoiceReference, products: { list, stats }, stockProvider } = JSON.parse(req.body);

            const invoiceProviderValues = [ invoiceReference, stockProvider, stats.totalVAT, stats.subTotal, stats.total ]
            
            await SuppliersInvoicesModel.insert({ products: list, reference: invoiceReference, supplier: stockProvider  }, { mongoDbConfig });
            res.status(201).send();
            return;

            return query(`INSERT INTO 
                factura_fornecedor(CodFactura, Data_Entrada, Fornecedor, IVA, Subtotal, Total, Data) 
                VALUES(?, NOW(), ?, ?, ?, ?, NOW())`, invoiceProviderValues)
                .then(async result => {
                    const { insertId } = result;

                    try {
                        await Promise.all(
                            list.map((product) => {
                                const { id, purchasePrice, purchaseVAT, stock: { quantity, stockId, total } } = product;
                                
                                const totalPrice = getTotalPrice({ price: purchasePrice, taxRate: purchaseVAT });
                                
                                const factura_fornecedor_detail = [ id, purchasePrice, purchaseVAT, totalPrice, quantity, insertId ]
    
                                return [
                                    query("SELECT * FROM user"
                                    ),
                                    query(`
                                        UPDATE stock SET Total=? WHERE idStock=?
                                    `, [ total, stockId ])
                                ]
                            }).flatMap(promiseQuery => promiseQuery)
                        );

                        res.status(201).send();
                    } catch(e) {
                        await Promise.all([
                            query("DELETE FROM factura_fornecedor WHERE idFactura_Fornecedor=?", [ insertId ]),
                            query('DELETE FROM factura_fornecedor_detail WHERE IDFactura_Fornecedor=?', [ insertId ])
                        ]);

                        await Promise.all(
                            list.map(({ stock: { currentStock, stockId, } }) => 
                            query(`
                                UPDATE stock SET Total=? WHERE idStock=?
                            `, [ currentStock, stockId ]))
                        )

                        res.status(500).send();
                    }
                });
        }
    }
};

const handler = apiHandler(requestHandler);

export default handler;

/**
 * `
                                        INSERT INTO factura_fornecedor_detail(idproduto, Preco_compra, IVA_Compra, Total_Compra, Quantidade, IDFactura_Fornecedor, Data)
                                        VALUES(?,?,?,?,?,?, NOW())
                                        `, factura_fornecedor_detail
 */