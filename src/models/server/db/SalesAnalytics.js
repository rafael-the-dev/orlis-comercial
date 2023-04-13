const currency = require("currency.js");

const ExpensesModel = require("./Expenses")
const SaleModel = require("./Sale");

class SalesAnalytics {
    static async analise(params, { mongoDbConfig }) {
        //params: { barman, endDate, filter, loggedUser, product, soldBy, startDate, table }
        
        const [ expenses, sales ] = await Promise.all([
            ExpensesModel.getAll(params, { mongoDbConfig }),
            SaleModel.getAll(params, { mongoDbConfig })
        ]);

        const finalProfit = currency(sales.statistics.profit).subtract(expenses.analytics.total).value;

        return {
            list: sales.list,
            statistics: {
                ...sales.statistics,
                expenses: expenses.analytics.total,
                profit: finalProfit
            }
        }
    }
}

module.exports = SalesAnalytics;