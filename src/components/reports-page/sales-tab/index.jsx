import * as React from "react";
import classNames from "classnames";

import { SalesReportContext, SalesTabContext } from "src/context"

import Home from "./components/home";
import SelectedSale from "./components/selected-sale"

const TabContainer = ({ tabId }) => {
    const { currentTab } = React.useContext(SalesReportContext)
    const { sale } = React.useContext(SalesTabContext);

    const homeMemo = React.useMemo(() => <Home />, []);
    
    return (
        <div className={classNames("pb-12", { "hidden": currentTab !== tabId })}>
            { homeMemo }
            { sale && <SelectedSale /> }
        </div>
    );
};

export default TabContainer;