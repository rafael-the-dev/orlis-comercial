import * as React from "react";
import currency from "currency.js";
import { v4 as uuidV4} from "uuid";

const RegisterExpenseContext = React.createContext();
RegisterExpenseContext.displayName = "RegisterExpenseContext";

const getNewProduct = () => {
    return {
        description: "",
        id: uuidV4(),
        price: 0
    }
};

const RegisterExpenseContextProvider = ({ children }) => {
    const [ category, setCategory ] = React.useState("credelec");
    const [ productsList, setProductsList ] = React.useState([]);

    const canISubmit = React.useMemo(() => {
        return !Boolean(productsList.find(({ description, price }) => {
            return !Boolean(description.trim()) || currency(price).value <= 0;
        }))
    }, [ productsList ]);

    const totalPrice = React.useMemo(() => {
        return productsList.reduce((prevValue, currentItem) => {
            return currency(currentItem.price).add(prevValue).value
        }, 0);
    }, [ productsList ])

    const addNewProduct = React.useCallback(() => {
        setProductsList(list => [ ...list, getNewProduct() ]);
    }, []);

    const remoteItem = React.useCallback((id) => {
        setProductsList(list => [ ...list.filter(item => item.id !== id) ]);
    }, [])

    React.useEffect(() => {
        setProductsList(list => {
            if(list.length === 0) {
                return [ getNewProduct() ];
            }

            return list;
        })
    }, [])

    return (
        <RegisterExpenseContext.Provider
            value={{
                addNewProduct,
                category, canISubmit,
                productsList,
                remoteItem,
                setCategory, setProductsList,
                totalPrice
            }}>
            { children }
        </RegisterExpenseContext.Provider>
    );
};

export {
    RegisterExpenseContext,
    RegisterExpenseContextProvider
}