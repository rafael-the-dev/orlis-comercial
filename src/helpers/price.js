import currency from "currency.js";

export const getPriceVAT  = ({ price, taxRate }) => {
    return currency(price).multiply(taxRate).divide(100);
};

export const getTotalPrice = ({ price, taxRate }) => {
    price = price ?? 0;
    taxRate = taxRate ?? 0;
    return currency(getPriceVAT({ price, taxRate })).add(price).value;
};