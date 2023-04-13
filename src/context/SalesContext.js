import * as React from "react";
import { v4 as uuidV4 } from "uuid";

import { fetchHelper, getAuthorizationHeader } from "src/helpers/queries"

import { SaleContextProvider } from "./SaleContext";

import Product from "src/models/client/Product";
import PageComponent from "src/components/appointment/page"

const SalesContext = React.createContext();
SalesContext.displayName = "SalesContext";

const SalesContextProvider = ({ children }) => {
    const [ barmenList, setBarmenList ] = React.useState([]);
    const [ categories, setCategories ] = React.useState([]);
    const [ products, setProducts ] = React.useState([]);
    const [ tablesList, setTablesList ] = React.useState([]);
    const [ selectedTables, setSelectedTable ] = React.useState([]);

    const [ pages, setPages ] = React.useState({
        list: [],
        selectedPage: 0
    });

    const [ tables, setTables ] = React.useState({
        list: [],
        selectedTable: 0
    })

    const createPage = React.useCallback((id, tableId, options) => ({
        element: <SaleContextProvider key={id} tableId={tableId}><PageComponent id={id} /></SaleContextProvider>,
        id,
        tableId //table id to retrieve saved table data on the first render
    }), []);

    const addCategories = React.useCallback(categoriesList => setCategories(categoriesList), [])

    // add brand new tab
    const addPage = React.useCallback(() => {
        const id = uuidV4();
        setPages(currentPages => {
            // Insert up to 5 pages
            if(currentPages.list.length >= 5) return currentPages;

            return { list: [ ...currentPages.list, createPage(id) ], selectedPage: id };
        });
    }, [ createPage ]);

    // remove selected tab from the list
    const removePage = React.useCallback(id => {
        setPages(currentPages => {
            // Remove page only if the list is greater than or equal to 2
            if(currentPages.list.length <= 1) return currentPages;

            const list = currentPages.list.filter(item => item.id !== id);

            return {
                list,
                selectedPage: list[list.length - 1].id
            }
        })
    }, []);

    const addTable = React.useCallback((newTable) => {
        const id = uuidV4();

        setTables(currentTables => ({
            ...currentTables,
            list: [ ...currentTables.list, { id, table: newTable } ]
        }))
    }, []);

    // open new tab with saved table details
    const createPageWithTable = React.useCallback((tableId) => {
        setPages(currentPages => {
            if(!Boolean(tableId)) return currentPages; // cancel if is an invalid tableId

            const list = [ ...currentPages.list.filter(item => item.id !== tableId) ];
            const length = list.length;
            const newComponent = createPage(tableId, tableId);

            if(length >= 5) list[length - 1] = newComponent;
            else list.push(newComponent);

            return { list, selectedPage: tableId };
        });
    }, [ createPage ])

    const removeTable = React.useCallback((id) => {
        setTables(currentTables => ({
            ...currentTables,
            list: [ ...currentTables.list.filter(item => item.id !== id) ]
        }))
    }, [])

    const getBarmenList = React.useCallback(() => barmenList, [ barmenList ]);
    const getCategories = React.useCallback(() => categories, [ categories ]);
    const getProducts = React.useCallback(() => products, [ products ]);
    const getSelectedTables = React.useCallback(() => selectedTables, [ selectedTables ])
    const getTablesList = React.useCallback(() => tablesList, [ tablesList ])
    
    const getPages = React.useCallback(() => pages.list, [ pages ]);
    const getCurrentPage = React.useCallback(() => pages.selectedPage, [ pages ]);
    const setCurrentPage = React.useCallback((id) => setPages(currentPages => {
        if(currentPages.selectedPage === id) return currentPages;

        return {  ...currentPages, selectedPage: id };
    }), [])


    const getTables = React.useCallback(() => tables.list, [ tables ]);
    const getCurrentTable = React.useCallback(() => tables.selectedTable, [ tables ]);

    // create first page on component mount if the list is empty
    React.useEffect(() => {
        setPages(currentPages => {
            if(currentPages.list.length > 0) return currentPages;

            const id = uuidV4();

            return { list: [ createPage(id) ], selectedPage: id }
        });
    }, [ createPage ]);

    const fetchProducts = React.useCallback(async () => {
        try {
            const options = { ...getAuthorizationHeader() };

            const data = await fetchHelper({ options, url: "/api/stock" });
            setProducts(data.map(item => new Product(item)));
        }
        catch(e) {
            console.error(e)
        }
    }, [])

    React.useEffect(() => {
        fetchProducts();
    }, [ fetchProducts ]);

    const fetchTables = React.useCallback(async () => {
        const options = getAuthorizationHeader();

        try {
            const data = await fetchHelper({ options, url: "/api/tables" });
            setTablesList(data);
        } catch(e) {

        }
    }, []);

    const fetcBarmen = React.useCallback(async () => {
        const options = getAuthorizationHeader();

        try {
            const data = await fetchHelper({ options, url: "/api/barmen" });
            setBarmenList(data);
        } catch(e) {

        }
    }, []);

    React.useEffect(() => {
        fetchTables();
        fetcBarmen()
    }, [ fetcBarmen, fetchTables ]);
    
    return (
        <SalesContext.Provider
            value={{
                addCategories, addPage, addTable,
                createPageWithTable,
                fetchProducts,
                getBarmenList, getCategories, getCurrentPage, getPages, getProducts, getTables, 
                getTablesList, getSelectedTables, getCurrentTable,
                removePage, removeTable,
                setCurrentPage, setCategories, setProducts, setSelectedTable
            }}>
            { children }
        </SalesContext.Provider>
    );
};

export {
    SalesContext,
    SalesContextProvider
}