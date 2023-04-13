import { createContext, useCallback, useEffect, useRef, useState } from "react";
import { v4 as uuidV4 } from "uuid";

import { SalesTabContextProvider } from "./SalesTabContext";
import { fetchHelper, getAuthorizationHeader } from "src/helpers/queries"

import SalesTab from "src/components/reports-page/sales-tab";

const SalesReportContext = createContext();
SalesReportContext.displayName = "SalesReportContext";

const SalesReportContextProvider = ({ children }) => {
    const [ globalSales, setGlobalSales ] = useState({});
    const [ currentTab, setCurrentTab ] = useState("");
    const [ tabs, setTabs ] = useState([]);
    
    const hasSaleChangedRef = useRef(false);

    const getElement = useCallback((id) => (
        <SalesTabContextProvider key={id}>
            <SalesTab tabId={id} />
        </SalesTabContextProvider>
    ), [])

    const addTab = useCallback(() => {
        const id = uuidV4();
        let canIAdd = true;

        setTabs(currentTabs => {
            if(currentTabs.length >= 6) {
                canIAdd = false;
                return currentTabs;
            }

            const tempList = [ ...currentTabs.filter(item => item.id !== -1) ];

            tempList.push(
                {
                    id,
                    element: getElement(id)
                },
                {
                    id: -1
                }
            );

            return tempList;
        });

        if(canIAdd) setCurrentTab(id);
    }, [ getElement ]);

    const getTabs = useCallback(() => tabs, [ tabs ])

    const addCurrentVisibleTab = useCallback((id) => { 
        setCurrentTab(id);
    }, [])

    const removeTab = useCallback((tabId, index) => {
        setTabs(currentTabs => {
            addCurrentVisibleTab(currentTabs[index === 0 ? 1 : index - 1].id);
            return [ ...currentTabs.filter(item => item.id !== tabId) ]
        });
    }, [ addCurrentVisibleTab ])

    useEffect(() => {
        const id = uuidV4();

        setTabs(
            [
                {
                    id,
                    element: getElement(id)
                },
                {
                    id: -1
                }
            ]
        );
        setCurrentTab(id);
    }, [ getElement ]);

    const fetchGlobalSales = useCallback(async () => {
        try {
            const res = await fetchHelper({ options: getAuthorizationHeader(), url: "/api/analytics/sales" });
            setGlobalSales(res.data)
        } catch(e) {
            console.error(e)
        }
    }, [])
    
    useEffect(() => {
        fetchGlobalSales()
    }, [ fetchGlobalSales ])

    return (
        <SalesReportContext.Provider
            value={{
                addTab, addCurrentVisibleTab,
                currentTab,
                fetchGlobalSales,
                getTabs, globalSales,
                hasSaleChangedRef,
                removeTab,
                setGlobalSales, setTabs,
                tabs,
            }}>
            { children }
        </SalesReportContext.Provider>
    );
};

export {
    SalesReportContext,
    SalesReportContextProvider
}