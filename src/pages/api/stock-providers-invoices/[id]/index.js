
const Error404 = require("src/models/server/errors/404Error")

const { apiHandler } = require("src/helpers/api-handler");
const { query } = require("src/helpers/db");
const { getTotalPrice, getPriceVAT } = require("src/helpers/price")

const requestHandler = (req, res) => {
    const { method, query: { id } } = req;
    
    switch(method) {
        case "GET": {
            return query(`
                SELECT factura_fornecedor.idFactura_Fornecedor as id, factura_fornecedor.CodFactura as invoiceCode, factura_fornecedor.IVA as totalVAT, factura_fornecedor.Subtotal as subTotal, factura_fornecedor.Total as total,
                fornecedor.idFornecedor as providerId, fornecedor.Nome as providerName, fornecedor.Nuit as providerNuit, fornecedor.Morada as providerAddress,
                factura_fornecedor_detail.Preco_compra as purchasePrice, factura_fornecedor_detail.IVA_Compra as purchaseVAT, factura_fornecedor_detail.Total_Compra as totalPurchasePrice, factura_fornecedor_detail.Quantidade as quantity,
                produto.BarCod as productBarcode, produto.Nome as productName
                FROM factura_fornecedor
                INNER JOIN fornecedor ON factura_fornecedor.fornecedor=fornecedor.idFornecedor
                INNER JOIN factura_fornecedor_detail ON factura_fornecedor_detail.idFactura_Fornecedor=factura_fornecedor.idFactura_Fornecedor
                INNER JOIN produto ON produto.idProduto=factura_fornecedor_detail.idProduto
                WHERE factura_fornecedor.idFactura_Fornecedor=?;`, [ id ]
            ).then(result => {
                if(result.length === 0) throw new Error404("Invoice not found");

                let invoiceMap = {
                    products: []
                };

                result.forEach((row) => {
                    const { 
                        productBarcode, productName, providerAddress, providerName, providerId, purchasePrice, purchaseVAT,
                        quantity, 
                        total, totalVAT, totalPurchasePrice,
                        subTotal
                    } = row;

                    invoiceMap ={ ...invoiceMap, total, totalVAT, subTotal };

                    invoiceMap["products"] = [ 
                        ...invoiceMap["products"], 
                        { 
                            barCode: productBarcode,
                            name: productName,
                            price: purchasePrice,
                            quantity,
                            total: totalPurchasePrice,
                            vat: purchaseVAT

                        }
                    ];

                    if(!invoiceMap["provider"]) {
                        invoiceMap["provider"] = {
                            address: providerAddress,
                            id: providerId,
                            name: providerName
                        };
                    }
                });

                res.status(200).json(invoiceMap);
            })
        }
    }
};

const handler = apiHandler(requestHandler);

export default handler;