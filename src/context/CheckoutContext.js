import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

import { SaleContext } from "./SaleContext";

import Payment from "src/models/client/Payment"

const CheckoutContext = createContext();
CheckoutContext.displayName = "CheckoutContext";

const CheckoutContextProvider = ({ children }) => {
    const { getCart } = useContext(SaleContext);

    const [ paymentMethods, setPaymentMethods ] = useState([])
    
    const paymentMethodsRef = useRef( new Payment(setPaymentMethods))

    const getPaymentMethods = useCallback(() => {
        if(paymentMethods || getCart()){}
        return paymentMethodsRef.current;
    }, [ getCart, paymentMethods ]);

    useEffect(() => {
        getPaymentMethods().cart = getCart();
    }, [ getCart, getPaymentMethods ]);

    return (
        <CheckoutContext.Provider
            value={{
                getPaymentMethods,
                paymentMethods
            }}>
            { children }
        </CheckoutContext.Provider>
    );
};

export {
    CheckoutContext,
    CheckoutContextProvider
}