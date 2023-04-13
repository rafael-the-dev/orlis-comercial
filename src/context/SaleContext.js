import * as React from "react";
import currency from "currency.js"

import { SalesContext } from "./SalesContext"

import Table from "src/models/client/Table";

const SaleContext = React.createContext();
SaleContext.displayName = "SaleContext";

const SaleContextProvider = ({ children, tableId }) => {
    const { getTables } = React.useContext(SalesContext);

    const [ cart, setCart ] = React.useState([]);
    const [ waiter, setWaiter ] = React.useState({});

    const isFirstRender = React.useRef(true);
    const tableRef = React.useRef(new Table({ setCart, setWaiter }));
    const savedTableRef = React.useRef(null);

    const hasBookedTable = React.useCallback(() => Boolean(savedTableRef.current), []);
    
    const getCart = React.useCallback(() => {
        if(savedTableRef.current) {
            savedTableRef.current.table.cart = cart;
        }

        return tableRef.current.cart;
    }, [ cart ]);

    //check if there is any invalid product quantity
    const hasQuantityError = React.useMemo(() => {
        return getCart().list.find(item => {
            return currency(item.quantity).value > item.product.stock.currentStock || currency(item.quantity).value <= 0;
        })
    }, [ getCart ])

    const getTable = React.useCallback(() => {
        tableRef.current.p = { cart, waiter }; // remvoe eslit warning
        return tableRef.current;
    }, [ cart, waiter ]);

    const getWaiter = React.useCallback(() => {
        if(savedTableRef.current) {
            savedTableRef.current.table.waiter = waiter;
        }
        return tableRef.current.waiter;
    }, [ waiter ]);

    React.useEffect(() => {
        if(tableId) {// get saved table data by id
            const result = getTables().find(item => item.id === tableId);

            if(result) {
                savedTableRef.current = result;
                
                // update table data only if it the first render
                if(isFirstRender.current) { 
                    tableRef.current.id = result.table.tableId;
                    tableRef.current.waiter = result.table.waiter;
                    tableRef.current.addItem(...result.table.cart)
                    isFirstRender.current = false;
                }
            }
        }
    }, [ getTables, tableId ])

    return (
        <SaleContext.Provider
            value={{
                getCart, getTable, getWaiter,
                hasBookedTable, hasQuantityError,
                savedTableRef
            }}>
            { children }
        </SaleContext.Provider>
    );
};

export {
    SaleContext,
    SaleContextProvider
}
