

class TableList {
    constructor(setTableList) {
        this._list = [];
        this._currentTable = 0;
        this._setTableList = setTableList;
    }

    get list() { return this._list; }

    get currentTable() { return this._currentTable; }

    addTable() {
        
    }

}

export default TableList;