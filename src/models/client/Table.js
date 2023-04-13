import Cart from "./Cart";

class Table {
    constructor({ setCart, setWaiter }) {
        this._cart = new Cart(setCart);
        this._waiter = {};

        this._setCart = setCart;
        this._setWaiter = setWaiter;
    }

    get cart() { return this._cart; }

    get waiter() { return this._waiter; }
    set waiter(waiter) {
        this._waiter = waiter;
        this._setWaiter(waiter)
    }

    addItem(...items) { this.cart.addItem(...items);}

    addQuantity(id, value) { this.cart.addQuantity(id, value); }

    decrementQuantity(id) { this.cart.decrementQuantity(id); }

    hasProduct(id) { return this.cart.hasProduct(id); }

    incrementQuantity(id) { this.cart.incrementQuantity(id) }

    reset() { this.cart.reset() }

    remove(id) { this.cart.remove(id); }
}

export default Table;