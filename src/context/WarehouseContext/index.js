import * as React from "react";
import moment from "moment";
import { useRouter } from "next/router";

import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import BookmarkAddOutlinedIcon from '@mui/icons-material/BookmarkAddOutlined';
import BookmarkAddedOutlinedIcon from '@mui/icons-material/BookmarkAddedOutlined';
import PaidIcon from '@mui/icons-material/Paid';
import ReorderOutlinedIcon from '@mui/icons-material/ReorderOutlined';

import { fetchHelper, getAuthorizationHeader } from "src/helpers/queries"
import { DebtContextProvider, ComponentsContext } from "../index"

import Debts from "src/components/pages-components/warehouse/debts";
import NewProduct from "src/components/pages-components/warehouse/register-product";
import ProductsList from "src/components/pages-components/warehouse/products";
import Stock from "src/components/pages-components/warehouse/stock";

const WarehouseContext = React.createContext();
WarehouseContext.displayName = "WarehouseContext";

const WarehouseContextProvider = ({ children }) => {
    const { getPanel } = React.useContext(ComponentsContext);

    //const [ panel, setPanel ] = React.useState("");
    const [ productId, setProductId ] = React.useState(null);

    const categoriesListRef = React.useRef(null);
    const clientsListRef = React.useRef(null);
    const debtsListRef = React.useRef(null);
    const productsListRef = React.useRef(null);
    const stockListRef = React.useRef(null);

    const fetchCategories = React.useCallback(async ({ onSuccess }) => {
        try {
            const data = await fetchHelper({ options: getAuthorizationHeader(), url: "/api/categories"});
            const list = [ { description: "All", id: -1 }, ...data ];

            categoriesListRef.current = list;
            onSuccess(list);
        } catch(e) {
            console.error(e);
        }
    }, [])

    React.useEffect(() => {
        if(getPanel()  !== "NEW_PRODUCTS") {
            setProductId(null);
        }
    }, [ getPanel ]);

    return (
        <WarehouseContext.Provider
            value={{
                categoriesListRef, clientsListRef,
                debtsListRef,
                fetchCategories,
                productId, productsListRef,
                setProductId, stockListRef
            }}>
            { children }
        </WarehouseContext.Provider>
    )
};

export {
    WarehouseContext,
    WarehouseContextProvider
}