import * as React from "react";
import currency from "currency.js";

const AddStockContext = React.createContext();
AddStockContext.displayName = "AddStockContext";

const AddStockContextProvider = ({ children }) => {
    const [ productsList, setProductsList ] = React.useState([]);
    const [ invoiceReference, setInvoiceReference ] = React.useState("");
    const [ stockProvider, setStockProvider ] = React.useState(-1);
    const [ errors, setErrors ] = React.useState({ "reference-code": true });

    const refreshProductsRef = React.useRef(null);

    const addError = React.useCallback((key, errorValue) => {
        setErrors(currentErrors => ({ ...currentErrors, [key]: errorValue }))
    }, [])

    const getProductsList = React.useCallback(() => productsList, [ productsList ]);
    
    const getInvoiceReference = React.useCallback(() => invoiceReference, [ invoiceReference ]);

    const getStockProvider = React.useCallback(() => stockProvider, [ stockProvider ]);

    const addInvoiceReference = React.useCallback((newReference) => setInvoiceReference(newReference), [])
    const addStockProvider = React.useCallback(newProvider => setStockProvider(newProvider), []);

    const addProduct = React.useCallback((newProduct) => setProductsList(currentList => [ ...currentList, newProduct ]), [])
    const removeProduct = React.useCallback(productId => {
        setProductsList(currentList => {
            return [ ...currentList.filter(item => item.id !== productId)];
        });
    }, []);

    const changeHelper = React.useCallback(({ func, productId }) => {
        setProductsList(currentList => {
            const newList = [ ...currentList ];

            const product = newList.find(item => item.id === productId);
            if(!product) return currentList;

            func(product)
            
            return newList;
        })
    }, [])

    const updateTotal = React.useCallback(({ headerKey, headerValue, product }) => {
        if(headerValue === "quantity") {
            product[headerKey]['total'] = currency(product[headerKey][headerValue]).add(product[headerKey].currentStock).value;
        }
    }, [])

    const changeValue = React.useCallback(({ headerKey, headerValue, newValue, productId }) => {
        changeHelper({
            func: product => {
                if(headerKey) {
                    product[headerKey][headerValue] = newValue;

                    updateTotal({ headerKey, headerValue, product });
                }
                else product[headerValue] = newValue;
            },
            productId
        })
    }, [ changeHelper, updateTotal ]);

    const decrementValue = React.useCallback(({ headerKey, headerValue, productId }) => {
        changeHelper({
            func: product => {
                if(headerKey) {
                    product[headerKey][headerValue] = currency(product[headerKey][headerValue]).subtract(1).value;

                    updateTotal({ headerKey, headerValue, product })
                }
                else product[headerValue] = currency(product[headerValue]).subtract(1).value;
            },
            productId
        })
    }, [ changeHelper, updateTotal ]);

    const incrementValue = React.useCallback(({ headerKey, headerValue, productId }) => {
        changeHelper({
            func: product => {
                if(headerKey) {
                    product[headerKey][headerValue] = currency(product[headerKey][headerValue]).add(1).value;

                    updateTotal({ headerKey, headerValue, product })
                }
                else product[headerValue] = currency(product[headerValue]).add(1).value;
            },
            productId
        })
    }, [ changeHelper, updateTotal ]);

    const reset = React.useCallback(() => {
        setProductsList([]);
        setStockProvider(1);
        setInvoiceReference("")
    }, []);

    const hasErrors = React.useMemo(() => {
        return Object.values(errors).includes(true);
    }, [ errors ])

    const toLiteral = React.useMemo(() => {
        const stats = productsList.reduce((previousValue, currentProduct) => {
            const { subTotal, total, totalVAT } = previousValue;

            return {
                subTotal: currency(subTotal).add(currentProduct.purchasePrice).value, 
                total: currency(total).add(currentProduct.getTotalPurchasePrice()).value, 
                totalVAT: currency(currentProduct.getTotalPurchaseVAT()).add(totalVAT).value
            };
        }, { subTotal: 0, total: 0, totalVAT: 0 });

        return {
            invoiceReference,
            products: {
                list: productsList.map(item => item.toLiteral()),
                stats
            },
            stockProvider
        };
    }, [ invoiceReference, productsList, stockProvider ]);

    React.useEffect(() => {
        const hasEmptyProduct = Boolean(productsList.find(product => currency(product.stock.quantity).value <= 0));
        addError("products-list", productsList.length === 0 || hasEmptyProduct);
    }, [ addError, productsList ]);

    return (
        <AddStockContext.Provider
            value={{
                addError, addStockProvider, addInvoiceReference, addProduct,
                changeValue, 
                decrementValue,
                errors,
                getInvoiceReference, getProductsList, getStockProvider,
                hasErrors,
                incrementValue,
                reset, removeProduct, refreshProductsRef,
                toLiteral
            }}>
            { children }
        </AddStockContext.Provider>
    );
};

export {
    AddStockContext,
    AddStockContextProvider
}