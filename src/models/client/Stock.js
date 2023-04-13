
class Stock {
    constructor({ currentStock, initial, stockId, total, user }) {
        this._currentStock = currentStock;
        this._initial = initial;
        this._stockId = stockId;
        this._total = total;
        this._user = user;
    }

    get currentStock() { return this._currentStock; }
    get initial() { return this._initial; }
    get stockId() { return this._stockId; }
    get user() { return this._user; }

    get total() { return this._total; }
    set total(newValue) { this._total = newValue; }

    toLiteral() {
        return {
            currentStock: this.currentStock,
            initial: this.initial,
            quantity: this.quantity,
            stockId: this.stockId,
            total: this.total,
            user: this.user
        }
    }
}

export default Stock;