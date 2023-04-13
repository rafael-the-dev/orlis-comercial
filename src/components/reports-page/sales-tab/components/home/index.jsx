import * as React from "react";
import { Button } from "@mui/material"
import classNames from "classnames";

import FilterAltIcon from '@mui/icons-material/FilterAlt';

import classes from "./styles.module.css"

import { SalesTabContext } from "src/context";
import { FilterContextProvider } from "../filters/context"

import DataContainer from "../data-show"
import Filters from "../filters"
import Highlights from "../../../highlights";

const TabContainer = ({ tabId }) => {
    const { getSales } = React.useContext(SalesTabContext);

    const onToggle = React.useRef(null);

    const toggleHandler = React.useCallback(() => onToggle.current?.(), [])

    const filtersButtonMemo = React.useMemo(() => (
        <Button
            className={classNames(classes.filtersButton, "border border-solid border-neutral-500 bg-white rounded-none text-black hover:bg-stone-400")}
            onClick={toggleHandler}
            startIcon={<FilterAltIcon />}>
            Filters
        </Button>
    ), [ toggleHandler ]);
    
    const dataContainer = React.useMemo(() => <DataContainer />, []);
    const filtersMemo = React.useMemo(() => <FilterContextProvider><Filters onToggle={onToggle} /></FilterContextProvider>, []);
    
    const highlightsMemo = React.useMemo(() => (
        <Highlights 
            expenses={getSales().stats?.expenses}
            isHome
            totalProfit={getSales().stats?.profit ?? 0}
            total={getSales().stats?.total}
            totalAmount={getSales().stats?.totalAmount}
            totalVAT={getSales().stats?.totalVAT}
        />
    ), [ getSales ]);
    
    return (
        <>
            <div className={classNames(classes.hightlightsContainer, "bg-neutral-700 mb-20 px-5 xl:px-8")}>
                <div className={classNames(classes.analyticsContainer, "bg-white flex flex-wrap justify-between py-8 px-8")}>
                    { highlightsMemo }
                    { filtersButtonMemo }
                </div>
            </div>
            <div className={classNames(classes.salesListContainer, "overflow-y-auto px-5 xl:px-8")}>
                { filtersMemo }
                { dataContainer }
            </div>
        </>
    );
};

export default TabContainer;