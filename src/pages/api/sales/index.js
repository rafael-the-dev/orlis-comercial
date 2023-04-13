const currency = require("currency.js")

const { apiHandler } = require("src/helpers/api-handler")
//const { query } = require("src/helpers/db");

const AuthorizationError = require("src/models/server/errors/AuthorizationError")

const SaleModel = require("src/models/server/db/Sale")

const requestHandler = async (req, res, { mongoDbConfig, user } ) => {

    let { method, query: { barman, endDate, product, startDate, soldBy, table, username } } = req;

    switch(method) {
        case "GET": {
            if(soldBy && ![ "administrator", "manager" ].includes(user.category.toLowerCase())) {
                throw new AuthorizationError("You don't have access these sales")
            }

            const sales = await SaleModel.getAll(
                { barman, endDate, loggedUser: user, product, startDate, soldBy, table, username },
                { mongoDbConfig }
            );
            res.status(200).json({ data: sales }); 
            return;
        }
        case "POST": {
            const { body } = req; 
            let { barman, products, paymentMethods, state, total, tableId } = JSON.parse(body);
            const barmanId = barman ? barman.id : "";
            const errorRecovery = {
                salesSeries: null,
                salesId: null,
            };

            const saleId = await SaleModel.insert(
                {
                    barmanId, products, paymentMethods, tableId
                }, 
                { mongoDbConfig, user }
            );
            
            res.json({ message: "Venda feita com successo", salesserie: saleId });

            return;
           
            /*return query(`INSERT INTO SalesSeries(Data, Estado, User) VALUES(now(),?,?)`, [ "CONCLUIDO", user.idUser  ])
                .then(async (result) => {
                    const { insertId } = result;
                    errorRecovery.salesSeries = insertId;

                    const totalVAT = currency(products.reduce((previousValue, currentProduct) => {
                        return currency(currentProduct.totalVAT).add(previousValue);
                    }, 0)).value;

                    const totalAmount = currency(products.reduce((previousValue, currentProduct) => {
                        return currency(currentProduct.subTotal).add(previousValue);
                    }, 0)).value;

                    try {
                        await Promise.all([
                            query("INSERT INTO Sales(SalesSerie, Montante, Iva, Subtotal, Total, Status, Data) VALUES(?,?,?,?,?,?,now())", [ insertId, totalAmount, totalVAT, totalAmount, totalAmount, "CONCLUIDO" ])
                                .then(async salesResult => {
                                    const salesId = salesResult.insertId;
                                    errorRecovery.salesId = salesId;
    
                                    return await Promise.all(
                                        products.map(product => {
                                            const { id, quantity, subTotal, stock, total, totalVAT } = product;
                                            return [
                                                query("INSERT INTO SalesDetail(FKSales, Product, Quantity, Satus, Barman, Mesa, User, Data) VALUES(?,?,?,?,?,?,?,now())", [ salesId, id, quantity, "CONCLUIDO", barmanId, tableId, user.idUser ]),
                                                query(`UPDATE stock SET total=? WHERE idStock=?`, [ stock.total, stock.stockId ])
                                            ]
                                        }).flatMap(item => item)
                                    );
    
                                }),
                            query('INSERT INTO PaymentSeries(status, fk_user, fk_salesserie, data) VALUES(?,?,?, now())', [ "CONCLUIDO", user.idUser, insertId ])
                                .then(async result => {
                                    const paymentSeriesId = result.insertId;
                                    errorRecovery.paymentSeries = paymentSeriesId;
            
                                    await Promise.all(
                                        paymentMethods.map(method => {
                                            const { amount, id } = method;
                                            return query("INSERT INTO PaymentMethodUsed(fk_payment_mode, fk_payment_serie, amount, status, Received, data) VALUES(?,?,?,?,?,now())", [ id, paymentSeriesId, amount, "CONCLUIDO", amount ])
                                        })
                                    )
                                })
                        ]);

                        res.json({ message: "Venda feita com successo", salesserie: insertId });
                    } catch(e) {
                        console.error(e)
                        await Promise.all([
                            query("UPDATE SalesSeries SET Estado='FALHADO' WHERE idSalesSeries=?", [ errorRecovery.salesSeries ]),
                            query("UPDATE Sales SET Status='FALHADO' WHERE SalesSerie=?", [ errorRecovery.salesSeries ]),
                            query("UPDATE PaymentSeries SET status='FALHADO' WHERE fk_salesserie=?", [ errorRecovery.salesSeries ])
                        ]);

                        await Promise.all(
                            products.map(product => {
                                const { stock } = product;
                                return query(`UPDATE stock SET total=? WHERE idStock=?`, [ stock.currentStock, stock.stockId ])
                            })
                        );

                        if(errorRecovery.salesId) {
                            await query(`UPDATE SalesDetail SET Satus='FALHADO' WHERE FKSales=?`, [ errorRecovery.salesId ])
                        }

                        if(errorRecovery.paymentSeries) {
                            await query(`UPDATE PaymentMethodUsed SET status='FALHADO' WHERE fk_payment_serie=?`, [ errorRecovery.paymentSeries ])
                        }

                        throw e;
                    }

                });*/
        }
        default: {
            return;
        }
    }
};

const handler = apiHandler(requestHandler )
export default handler;