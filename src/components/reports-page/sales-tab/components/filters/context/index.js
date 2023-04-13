import * as React from "react";
import moment from "moment"

import { SalesTabContext } from "src/context"
import { fetchHelper, getAuthorizationHeader, getCategories } from "src/helpers/queries"

const FilterContext = React.createContext();
FilterContext.displayName  = "FilterContext";

const parseDate = date => moment(date).toDate();

const FilterContextProvider = ({ children }) => {
    const [ barmen, setBarmen ] = React.useState([]);
    const { queryStringParamsRef } = React.useContext(SalesTabContext);

    const [ categoriesList, setcategoriesList ] = React.useState([]);
    const [ date, setDate ] = React.useState({
        end: "",
        start: ""
    });
    const [ productsList, setProductsList ] = React.useState([]);
    const [ tables, setTables ] = React.useState([]);
    const [ users, setUsers ] = React.useState([]);

    
    const [ selectedBarman, setSelectedBarman ] = React.useState("");
    const [ selectedProducts, setSelectedProducts ] = React.useState([]);
    const [ selectedTable, setSelectedTable ] = React.useState("");
    const [ selectedUser, setSelectedUser ] = React.useState(-1);

    const canISubmit = React.useMemo(() => {
        return Boolean(date.start) || selectedProducts.length > 0 || Boolean(selectedUser)
    }, [ date, selectedProducts, selectedUser ]);

    const dateQueryString = React.useMemo(() => {
        return `${date.start && `startDate=${parseDate(date.start)}` }${date.end && `&endDate=${parseDate(date.end)}` }`;
    }, [ date ]);

    const productsQueryString = React.useMemo(() => {
        return selectedProducts.map((item, index) => {
            return `${index === 0 && !Boolean(dateQueryString) ? "" : "&"}product=${item.id}`
        }).join("")
    }, [ dateQueryString, selectedProducts ]);
    
    const userQueryString = React.useMemo(() => (
        selectedUser !== -1 ? `${Boolean(productsQueryString) || Boolean(dateQueryString) ? '&' : ""}soldBy=${selectedUser}` : ""
    ), [ dateQueryString, productsQueryString, selectedUser ])

    const queryStringParams = React.useMemo(() => {
        return [ dateQueryString, productsQueryString, userQueryString ].join("")
    }, [ dateQueryString, productsQueryString, userQueryString ])

    const fetchHandler = React.useCallback(async ({ onSucess, url }) => {
        try {
            const res = await fetchHelper({ options: getAuthorizationHeader(), url});
            onSucess && onSucess(res)
        } catch(e) {
            console.error(e)
        }
    }, []);

    React.useEffect(() => {
        const func = async () => {
            try {
                const options = getAuthorizationHeader();

                const result = await getCategories({ options });
                setcategoriesList(result);
            }
            catch(e) {
                console.error(e)
            }
        };

        func()
    }, [])

    React.useEffect(() => {
        const onSucess = data => setUsers([ { id: -1, firstName: "All", lastName: "" }, ...data]);
        fetchHandler({ onSucess, url: "/api/users"})
    }, [ fetchHandler ]);

    React.useEffect(() => {
        const onSucess = data => setProductsList(data);
        fetchHandler({ onSucess, url: "/api/products"})
    }, [ fetchHandler ]);

    React.useEffect(() => {
        const onSucess = data => setTables([ { id: -1, description: "All" }, ...data]);
        fetchHandler({ onSucess, url: "/api/tables"})
    }, [ fetchHandler ]);

    React.useEffect(() => {
        const onSucess = data => setBarmen([ { id: -1, firstName: "All", lastName: "" }, ...data]);
        fetchHandler({ onSucess, url: "/api/barmen"})
    }, [ fetchHandler ]);
    
    React.useEffect(() => {
        queryStringParamsRef.current = queryStringParams;
    }, [ queryStringParams, queryStringParamsRef ])

    return (
        <FilterContext.Provider
            value={{
                barmen,
                canISubmit, categoriesList,
                date, 
                queryStringParams,
                productsList,
                selectedBarman, selectedProducts, selectedTable, selectedUser, 
                setDate, setTables,
                setSelectedBarman, setSelectedProducts, setSelectedTable, setSelectedUser,
                tables, 
                users 
            }}>
            { children }
        </FilterContext.Provider>
    );
};

export {
    FilterContext,
    FilterContextProvider
}