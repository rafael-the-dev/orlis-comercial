import * as React from "react";
import Button from "@mui/material/Button";

import AddIcon from '@mui/icons-material/Add';

//import classes from "./styles.module.css";

import { fetchHelper, getAuthorizationHeader } from "src/helpers/queries";
import { WarehouseContext } from "src/context"

import CancelLink from "src/components/cancel-link";
import Link from "src/components/link";
import Panel from "src/components/panel";
import PrimaryButton from "src/components/primary-button";
import Table from "src/components/default-table"

const Container = () => {
    const { stockListRef } = React.useContext(WarehouseContext);

    const stockInitialState = React.useCallback(() => {
        return stockListRef.current ?? [];
    }, [ stockListRef ]);

    const [ stockList, setStockList ] = React.useState(stockInitialState);

    const filterList = () => stockList;

    const headers = React.useRef([
        { label: "Codigo de barra", value: "barCode" },
        { label: "Nome", value: "name" },
        { label: "Stock atual", key: "stock", value: "currentStock" }
    ]);

    const linksMemo = React.useMemo(() => (
        <div className="flex flex-col items-stretch mt-8 sm:flex-row-reverse">
            <PrimaryButton classes={{ button: "w-full", link: "mb-3 sm:ml-4"}} href="/add-stock" startIcon={<AddIcon />}>
                Add stock
            </PrimaryButton>
            <PrimaryButton classes={{ button: "w-full", link: "mb-3 sm:ml-4" }} href="/stock-providers" variant="outlined">
                Stock suppliers
            </PrimaryButton>
            <CancelLink 
                classes={{ button: "w-full", link: "" }}
                href="/" 
            />
        </div>
    ), []);

    const panel = React.useMemo(() => (
        <Panel 
            component="h1"
            title="Stocks list"
        />
    ), []);

    const fetchData = React.useCallback(async () => {
        try {
            const options = {
                ...getAuthorizationHeader()
            };

            const data = await fetchHelper({ options, url: "/api/stock"});
            stockListRef.current = data;
            setStockList(data);
        } catch(e) {

        }
    }, [ stockListRef ])

    React.useEffect(() => {
        if(!stockListRef.current) fetchData();
    }, [ fetchData, stockListRef ]);

    return (
        <div className="flex flex-col h-full items-stretch justify-between">
            <Table 
                classes={{ tableHeaderRow: "bg-stone-300", tableHeadCell: "text-white" }}
                data={filterList()}
                headers={headers}
            />
            { linksMemo }
        </div>
    );
};

export default Container;