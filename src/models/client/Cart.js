import currency from "currency.js"

class Cart {
    constructor(setCart) {
        this._list = [];
        this._setCart = setCart;
        this._setList = setCart;
    }

    get list() { return [ ...this._list]; }

    set list(list) {
        this._list = list;
    }

    addItem(...items) {
        this._setList(list => {
            const data = [ ...list, ...items ];
            
            this.list = data;

            return data;
        });
    }

    addQuantity(id, value) {
        this._setList(list => {
            const data = [ ...list];
            
            const cartItem = data.find(item => item.product.id === id);

            cartItem.quantity = value;

            this.list = data;

            return data;
        });
    }

    decrementQuantity(id) {
        this._setList(list => {
            const data = [ ...list];
            
            const cartItem = data.find(item => item.product.id === id);

            if(isNaN(cartItem.quantity)) cartItem.quantity = 1;
            else cartItem.quantity -= 1;
            
            this.list = data;

            return data;
        });
    }
    
    getSubTotal() {
        return currency(this.list.reduce((previousValue, currentItem) => {
            return currency(currentItem.getSubTotal()).add(previousValue);
        }, 0)).value;
    }

    getTotalVAT() {
        return currency(this.list.reduce((previousValue, currentItem) => {
            return currency(currentItem.getTotalVAT()).add(previousValue);
        }, 0)).value;
    }
    
    getTotal() {
        return currency(this.list.reduce((previousValue, currentItem) => {
            return currency(currentItem.getTotal()).add(previousValue);
        }, 0)).value;
    }
    
    hasProduct(id) {
        return Boolean(this.list.find(cartItem => cartItem.product.id === id))
    }

    incrementQuantity(id) {
        this._setList(list => {
            const data = [ ...list];
            
            const cartItem = data.find(item => item.product.id === id);

            if(!Boolean(cartItem)) return list;

            if(isNaN(cartItem.quantity)) cartItem.quantity = 1;
            else cartItem.quantity += 1;

            this.list = data;

            return data;
        });
    }

    reset() {
        this.list = [];
        this._setList([]);
    }

    remove(id) {
        this._setList(list => {
            const data = [ ...list.filter(item => item.product.id !== id)];

            this.list = data;

            return data;
        });
    }

    toLiteral() {
        return {
            products: this.list.map(product => product.toLiteral()),
            total: this.total
        }
    }

}

export default Cart;