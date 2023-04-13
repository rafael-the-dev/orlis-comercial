import * as React from "react";
import { v4 as uuidV4 } from "uuid";
import currency from "currency.js";

import { fetchHelper, getAuthorizationHeader } from "src/helpers/queries";
import { ComponentsContext } from "../../DefaultComponentsContext"
import { WarehouseContext } from "..";

const DebtContext = React.createContext();
DebtContext.displayName = "DebtContext";

const DebtContextProvider = ({ children }) => {
    const { dialog, setDialog } = React.useContext(ComponentsContext);
    const { debtsListRef } = React.useContext(WarehouseContext);

    const debt = dialog;
    const setDebt = setDialog;

    const debtsInitialState = React.useCallback(() => {
        return debtsListRef.current ?? { analytics: { total: 0 }, list: [] };
    }, [ debtsListRef ]);

    const [ debts, setDebts ] = React.useState(debtsInitialState);
    const [ paymentMethods, setPaymentMethods ] = React.useState([]);

    const getAvailablePaymentMethod = React.useCallback(() => {
        const occupiedPaymentMethodsId = paymentMethods.map(item => item.paymentMethodId);

        return process.env.PAYMENT_METHODS.find(item => !occupiedPaymentMethodsId.includes(item.value));
    }, [ paymentMethods ]);

    const canISubmit = React.useMemo(() => {
        if(!debt) return false; // user cannot submit without selected debt

        const { amount, received } = paymentMethods.reduce((prevValue, currentPaymentMethod) => {
            return {
                amount: currency(prevValue.amount).add(currentPaymentMethod.amount).value,
                received: currency(prevValue.received).add(currentPaymentMethod.received).value
            }
        }, { amount: 0, received: 0 });
        
        if(amount > 0) {
            // client must not pay any amount greater than remaining balance;
            const isAmountLessThanRemainingBalance = amount <= debt.remainingBalance;
            // Received amount must not be less than the expected amount
            const isReceivedBalanceGreaterThanAmount = received >= amount;
            // test conditions
            return isAmountLessThanRemainingBalance && isReceivedBalanceGreaterThanAmount;
        }
            
        return false; // return false if has not added amount yet
    }, [ debt, paymentMethods ])

    const hasPaymentMethodLeft = React.useMemo(() => Boolean(getAvailablePaymentMethod()), [ getAvailablePaymentMethod ])

    const addDebt = React.useCallback((newValue) => setDebt(newValue), [ setDebt ]);

    const addPaymentMethod = React.useCallback(() => {
        const { value } = getAvailablePaymentMethod();

        const pm = {
            amount: 0,
            id: uuidV4(),
            paymentMethodId: value,
            received: 0
        };

        setPaymentMethods(list => [ ...list, pm ]);

    }, [ getAvailablePaymentMethod ]);
    
    React.useEffect(() => {
        if(paymentMethods.length === 0) addPaymentMethod();
    }, [ addPaymentMethod, paymentMethods ])
    
    const fetchDebtsData = React.useCallback(async () => {
        try {
            const options = getAuthorizationHeader();

            const { data } = await fetchHelper({ options, url: "/api/debts"});

            debtsListRef.current = data;
            setDebts(data);

            return data;
        } catch(e) {
            console.error(e);
        }
    }, [ debtsListRef ]);

    React.useEffect(() => {
        if(!debtsListRef.current) fetchDebtsData();
    }, [ debtsListRef, fetchDebtsData ]);

    return (
        <DebtContext.Provider
            value={{
                addDebt, addPaymentMethod,
                canISubmit,
                debt, debts,
                fetchDebtsData,
                hasPaymentMethodLeft,
                paymentMethods, 
                setDebt, setPaymentMethods
            }}
        >
            { children }
        </DebtContext.Provider>
    );
};

export {
    DebtContext,
    DebtContextProvider
}