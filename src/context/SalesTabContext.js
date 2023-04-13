import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import currency from "currency.js";

import { SalesReportContext } from "./SalesReportContext";
import { getPriceVAT, getTotalPrice } from "src/helpers/price"

import Sales from "src/models/client/Sales";

const SalesTabContext = createContext();
SalesTabContext.displayName = "SalesTabContext";

const SalesTabContextProvider = ({ children }) => {
    const { globalSales, hasSaleChangedRef } = useContext(SalesReportContext);
    const [ sales, setSales ] = useState({});
    const [ selectedSale, setSelectedSale ] = useState([]);
    const [ sale, setSale ] = useState(null);

    const isFirstRender = useRef(true);
    const queryStringParamsRef = useRef(null);
    const salesRef = useRef(new Sales(setSales));

    const hasChanges = useMemo(() => {
        if(!sale) return false;

        return Boolean(sale.products.find(item => item.quantity !== item.initialValue));
    }, [ sale ]);

    const salesChanges = useMemo(() => {
        if(!sale) return {};
        
        const payment = sale.products.reduce((prevValue, { item: { sellVAT, totalSellPrice }, quantity }) => {
            const totalPrice = currency(quantity).multiply(totalSellPrice).value;
            const vat = getPriceVAT({ price: totalPrice, taxRate: sellVAT }).value;
            const total = getTotalPrice({ price: totalPrice, taxRate: sellVAT });

            return {
                amount: currency(totalPrice).add(prevValue.amount).value, 
                total: currency(total).add(prevValue.total).value, 
                vat: currency(vat).add(prevValue.vat).value
            }
        }, { amount: 0, subTotal: 0, total: 0, vat: 0 })

        return {
            ...payment,
            products: sale.products
                .filter(({ initialValue, quantity }) => quantity !== initialValue)
                .map(({ id, initialValue, quantity }) => ({
                    id,
                    oldQuantity: currency(initialValue).value,
                    quantity: currency(quantity).subtract(initialValue).value
                })
            )
        };
    }, [ sale ]);

    const getSales = useCallback(() => {
        if(sales){}
        return salesRef.current;
    }, [ sales ]);

    useEffect(() => {
        if((isFirstRender.current && Object.keys(globalSales).length > 0) || (hasSaleChangedRef.current && !Boolean(queryStringParamsRef.current)))
            getSales().update(globalSales);
        
        isFirstRender.current = false;
    }, [ getSales, globalSales, hasSaleChangedRef ])

    return (
        <SalesTabContext.Provider
            value={{
                getSales,
                hasChanges,
                queryStringParamsRef,
                sales, sale, salesChanges, setSale, selectedSale,
                setSales, setSelectedSale
            }}>
            { children }
        </SalesTabContext.Provider>
    );
};

export {
    SalesTabContext,
    SalesTabContextProvider
}