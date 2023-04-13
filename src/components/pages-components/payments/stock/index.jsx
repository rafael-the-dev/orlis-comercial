import * as React from "react";

import AddIcon from '@mui/icons-material/Add';

import { fetchHelper, getAuthorizationHeader } from "src/helpers/queries";

import Content from "src/components/scroll-container";
import CancelLink from "src/components/cancel-link";
import Link from "src/components/link";
import Main from "src/components/pages-components/default-main";
import Panel from "src/components/panel";
import PrimaryButton from "src/components/primary-button"
import Table from "src/components/stocks-page/table"

const Container = () => {
    const [ stocksList, setStocksList ] = React.useState([]);

    const filterList = () => stocksList;

    const linksMemo = React.useMemo(() => (
        <div className="flex items-stretch justify-end mt-8">
            <CancelLink href="/">Voltar</CancelLink>
            <PrimaryButton classes={{ link: "ml-4" }} href="/add-stock" startIcon={<AddIcon />}>
                Adicionar stock
            </PrimaryButton>
        </div>
    ), []);

    const fetchData = React.useCallback(async () => {
        try {
            const options = getAuthorizationHeader();

            const data = await fetchHelper({ options, url: "/api/stock-providers-invoices"});
            setStocksList(data);
        } catch(e) {

        }
    }, [])

    React.useEffect(() => {
        fetchData();
    }, [ fetchData ])

    return (
        <div className="flex flex-col h-full items-stretch justify-between">
            <Table invoicesList={filterList()} />
            { linksMemo }
        </div>
    );
};

export default Container;