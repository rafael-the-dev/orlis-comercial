import * as React from "react";

import { fetchHelper, getAuthorizationHeader } from "src/helpers/queries"

const ExpensesContext = React.createContext();
ExpensesContext.displayName = "ExpensesContext";

const ExpensesContextProvider = ({ children }) => {
    const [ expenses, setExpenses ] = React.useState({ list: [] });
    const [ expense, setExpense ] = React.useState(null);

    const setNewExpense = React.useCallback((newExpense) => setExpense(newExpense), [])

    const fetchExpensesData = React.useCallback(async () => {
        try {
            const options = getAuthorizationHeader();

            const { data } = await fetchHelper({ options, url: "/api/expenses"});
            setExpenses(data);
        } catch(e) {

        }
    }, []);

    React.useEffect(() => {
        fetchExpensesData();
    }, [ fetchExpensesData ]);

    return (
        <ExpensesContext.Provider 
            value={{
                expenses, expense,
                fetchExpensesData,
                setNewExpense
            }}>
            { children }
        </ExpensesContext.Provider>
    )
};

export {
    ExpensesContext,
    ExpensesContextProvider
}