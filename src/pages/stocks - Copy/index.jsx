import * as React from "react";
import Button from "@mui/material/Button";

import classes from "../styles.module.css";

import { fetchHelper, getAuthorizationHeader } from "src/helpers/queries"

import Content from "src/components/scroll-container";
import CancelLink from "src/components/cancel-link";
import Link from "src/components/link";
import Main from "src/components/main";
import Panel from "src/components/panel";
import Table from "src/components/stocks-page/table"

const Container = () => {
    const [ stocksList, setStocksList ] = React.useState([]);

    const filterList = () => stocksList;

    const linksMemo = React.useMemo(() => (
        <div className="flex items-stretch justify-end mt-8">
            <CancelLink 
                href="/" 
            />
            <Link href="/add-stock">
                <Button
                    className="bg-blue-500 ml-4 py-2 text-white hover:bg-blue-700"
                    variant="contained">
                    Add stock
                </Button>
            </Link>
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

            const data = await fetchHelper({ options, url: "/api/stock-providers-invoices"});
            setStocksList(data);
        } catch(e) {

        }
    }, [])

    React.useEffect(() => {
        fetchData()
    }, [ fetchData ])

    return (
        <Main>
            { panel }
            <Content>
                <Table invoicesList={filterList()} />
                { linksMemo }
            </Content>
        </Main>
    );
};

export default Container;