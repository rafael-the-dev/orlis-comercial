import currency from "currency.js";

import Stock from "./Stock"

class Product {
    constructor({ id, barCode, name, purchasePrice, purchaseVAT, sellPrice, sellVAT, 
        groupId, Estado, date, stock }) {
        this._barCode = barCode;
        this._categoryId = groupId;
        this._date = date;
        this._id = id;
        this._name = name;
        this._purchasePrice = purchasePrice;
        this._purchaseVAT = purchaseVAT;
        this._state = Estado;
        this._sellPrice = sellPrice;
        this._sellVAT = sellVAT;
        this._stock = new Stock(stock ?? {});
    }

    get barCode() {
        return this._barCode;
    }

    set barCode(barCode) {
        this._barCode = barCode;
    }

    get categoryId() {
        return this._categoryId;
    }

    set categoryId(barCode) {
        this._categoryId = barCode;
    }

    get date() {
        return this._date;
    }

    set date(date) {
        this._date = date;
    }

    get id() {
        return this._id;
    }

    set id(id) {
        this._id = id;
    }

    get name() {
        return this._name;
    }

    set name(name) {
        this._name = name;
    }

    get purchasePrice() {
        return this._purchasePrice;
    }

    set purchasePrice(purchasePrice) {
        this._purchasePrice = purchasePrice;
    }

    get purchaseVAT() {
        return this._purchaseVAT;
    }

    set purchaseVAT(purchaseVAT) {
        this._purchaseVAT = purchaseVAT;
    }

    get state() {
        return this._state;
    }

    set state(state) {
        this._state = state;
    }
    
    get sellPrice() {
        return this._sellPrice;
    }

    set sellPrice(sellPrice) {
        this._sellPrice = sellPrice;
    }
    
    get sellVAT() {
        return this._sellVAT;
    }

    set sellVAT(sellVAT) {
        this._sellVAT = sellVAT;
    }
    
    get stock() { return this._stock; }

    getTotalPurchaseVAT() {
        return currency(this.purchasePrice)
            .multiply(this.purchaseVAT)
            .divide(100)
            .value;
    }

    getTotalPurchasePrice() {
        return currency(this.getTotalPurchaseVAT())
            .add(this.purchasePrice)
            .value;
    }


    getTotalSellPrice() {
        return currency(this.sellPrice)
            .multiply(this.sellVAT)
            .divide(100)
            .add(this.sellPrice)
            .value;
    }

    toLiteral() {
        
        return {
            barCode: this.barCode,
            categoryId: this.groupId,
            date: this.date,
            id: this.id,
            name: this.name,
            purchasePrice: this.purchasePrice,
            purchaseVAT: this.purchaseVAT,
            state: this.Estado,
            sellPrice: this.sellPrice,
            sellVAT: this.sellVAT,
            stock: this.stock.toLiteral()
        }
    }

}

export default Product;