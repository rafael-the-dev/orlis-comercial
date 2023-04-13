
class SaleDetails  {
    constructor({ id, paymentMethods, products }) {
        this._salesDetailsId = id;
        this._products = products.map(item => {
            const { BarCod, Iva_venda, Preco_venda, Quantity } = item;
            const subTotalAmount = Preco_venda * Quantity;
            const totalVAT = (subTotalAmount * Iva_venda) /100;
            const totalAmount = subTotalAmount + totalVAT;

            return {
                amount: subTotalAmount,
                product: {
                    barCode: BarCod,
                    name: item.Nome,
                    price: Preco_venda
                },
                subTotal: subTotalAmount,
                total: totalAmount,
                totalVAT: totalVAT,
                user: {
                    firstName: item.Nome,
                    lastName: item.Apelido
                }
        }});
        this._paymentMethod = paymentMethods;

    }

    get salesDetailsId() { return this._salesDetailsId; }
    get products() { return this._products; }
    get paymentMethod() { return this._paymentMethod; }

    toLiteral() {
        return {
            id: this.salesDetailsId,
            products: this.products,
            paymentMethods: this.paymentMethod,
        }
    }
}

module.exports = SaleDetails;