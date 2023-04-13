const currency = require("currency.js")
const moment = require("moment");

const { apiHandler } = require("src/helpers/api-handler")
const { query } = require("src/helpers/db");

const Sale = require("src/models/server/Sale");
const SalesList = require("src/models/server/SalesList");

const requestHandler = async (req, res, user ) => {

    const { method, query: { endDate, startDate, username } } = req;

    switch(method) {
        case "GET": {
            const getDate = () => {
                let stringifiedDate = '';

                if(Boolean(startDate) && Boolean(endDate)) {
                    stringifiedDate = ` BETWEEN '${moment(startDate).format('YYYY-MM-DD')}' AND '${moment(endDate).format('YYYY-MM-DD')}'`;
                }
                else if(Boolean(startDate)) {
                    stringifiedDate = `='${moment(startDate).format('YYYY-MM-DD')}'`;
                }
                /*else if(Boolean(endDate)) {
                    stringifiedDate = moment(new Date(endDate)).format('YYYY-MM-DD');
                }*/

                return stringifiedDate ? stringifiedDate : "";
            };

            const usernameFilter = username ? ` AND username=${username}` : "";

            const filterDate = getDate();
            const dateResult =  Boolean(filterDate) ? filterDate : "=curdate()";

            return query(`SELECT * FROM salesseries INNER JOIN sales ON sales.SalesSerie=SalesSeries.idSalesSeries 
                INNER JOIN user ON user.idUser=salesseries.user WHERE salesseries.Estado='CONCLUIDO' AND DATE(sales.data) ${dateResult};`)
                .then(async result => {
                    const list = result.map(item => new Sale(item).toLiteral());
                    const salesList = new SalesList(list);

                    await Promise.all([
                        query(`SELECT SUM(Montante) as Montante, SUM(Iva) as Iva, SUM(Total) as Total FROM sales WHERE Status='CONCLUIDO' AND DATE(Sales.data) ${dateResult};`)
                            .then(statsResult => {
                                salesList.stats = statsResult[0];
                                return;
                            }),
                        query(`
                            SELECT sum(salesdetail.Quantity*produto.profit) AS Profit FROM  sales INNER JOIN salesseries on salesseries.idSalesSeries=sales.salesserie 
                            INNER JOIN salesdetail ON salesdetail.FKSales=sales.idsales 
                            INNER JOIN produto ON salesdetail.product=produto.idproduto
                            WHERE sales.Status='CONCLUIDO' AND salesseries.Estado='CONCLUIDO' AND DATE(salesdetail.data) ${dateResult};`)
                            .then(profitResult => {
                                salesList.profit = currency(profitResult[0].Profit).value;
                                return;
                            })
                    ]);
                    
                    res.json(salesList.toLiteral());
                })
        }
        default: {
            return;
        }
    }
};

const handler = apiHandler(requestHandler )
export default handler;