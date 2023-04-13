
class Sales {
    constructor(setSales) {
        this._list = [];
        this._stats = {};
        this._setList = setSales;
    }

    get list() { return this._list; }
    set list(list) { this._list = list; }

    get stats() { return this._stats; }
    set stats(stats) { this._stats = stats; }


    update(sales) {
        this._setList(() => {
            this.list = sales.list;
            this.stats = sales.statistics;
            
            return sales;
        })
    }
}

export default Sales;