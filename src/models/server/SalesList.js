const currency = require("currency.js")

class SalesList {
    constructor(list) {
        this._list = list;
        this._profit = 0;
        this._subTotal = 0;
        this._stats = {};
        this._total = 0;
        this._totalVAT = 0;
    }
    get profit() { return this._profit; }
    set profit(newProfit) { this._profit = newProfit; }

    get list() { return this._list; }

    get stats() { return this._stats; }

    set stats({ Iva, Montante, Total }) {
        this._stats = {
            total: currency(Total).value,
            totalAmount: currency(Montante).value,
            subTotal: currency(this.subTotal).value,
            totalVAT: currency(Iva).value
        };
    }

    get totalAmount() {
        return currency(this.list.reduce((previousValue, currentSale) => {
            return currency(currentSale.amount).add(previousValue);
        }, 0)).value;
    }

    get subTotal() {
        return currency(this.list.reduce((previousValue, currentSale) => {
            return currency(currentSale.subTotal).add(previousValue);
        }, 0)).value;
    }

    get total() {
        return currency(this.list.reduce((previousValue, currentSale) => {
            return currency(currentSale.total).add(previousValue);
        }, 0)).value;
    }

    get totalVAT() {
        return currency(this.list.reduce((previousValue, currentSale) => {
            return currency(currentSale.totalVAT).add(previousValue);
        }, 0)).value;
    }

    toLiteral() {
        return {
            list: this.list,
            statistics: {
                ...this.stats,
                profit: this.profit
            }
        }
    }
}

module.exports = SalesList;