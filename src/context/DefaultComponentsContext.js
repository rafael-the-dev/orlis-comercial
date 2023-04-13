import * as React from "react";
import { useRouter } from "next/router";

const ComponentsContext = React.createContext();
ComponentsContext.displayName = "ComponentsContext";

const ComponentsContextProvider = ({ children, containersMap, defaultContainerId, tabsList }) => {
    const [ dialog, setDialog ] = React.useState(null);
    const [ panel, setPanel ] = React.useState("");

    const { query: { tab }} = useRouter();

    const getPanel = React.useCallback(() => panel, [ panel ]);
    const setNewPanel = React.useCallback(panelId => setPanel(panelId), []);

    React.useEffect(() => {
        setNewPanel(defaultContainerId ?? tabsList[0].id)
    }, [ defaultContainerId, setNewPanel, tabsList ]);

    React.useEffect(() => {
        Boolean(tab) && setNewPanel(tab.toUpperCase())
    }, [ setNewPanel, tab ])

    return (
        <ComponentsContext.Provider
            value={{
                containersMap,
                dialog, 
                getPanel,
                setDialog, setNewPanel,
                tabsList
            }}>
            { children }
        </ComponentsContext.Provider>
    )
};

export {
    ComponentsContext,
    ComponentsContextProvider
}