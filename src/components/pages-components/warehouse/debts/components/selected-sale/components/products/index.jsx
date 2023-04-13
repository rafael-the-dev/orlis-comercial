import * as React from "react";
import currency from "currency.js"

import { ComponentsContext, DebtContext } from "src/context";
import { getPriceVAT, getTotalPrice } from "src/helpers/price"

import DefaultTable from "src/components/default-table";
import SalePopover from "./components/products-popover";
import Status from "./components/status";

const SalesContainer = () => {
    const { dialog } = React.useContext(ComponentsContext);
    const debt = dialog;

    const [ sale, setSale ] = React.useState(null);

    const onClose = React.useRef(null)
    const onOpen = React.useRef(null);

    const headers = React.useRef([ 
        { label: "date", value: "name" },,
        { label: "Amount", value: "amount" },
        { label: "Total VAT", value: "vat" },
        { label: "Total", value: "total" },
        { label: "status", customComponent: ({ item }) => <Status { ...item } /> }
    ]);

    const debtList = React.useMemo(() => {
        if(!debt) return [];

        return debt.list.sort((a, b) => {
            if(a.status === "NOT_PAID") return -1;
            return 1;
        })
    }, [ debt ])

    const closeHandler = React.useCallback(() => {
        onClose.current?.();
        setSale(null)
    }, []);

    const rowClickHandler = React.useCallback(row => (e) => {
        setSale({ sale: row })
        onOpen.current?.(e);
    }, []);

    const tableMemo = React.useMemo(() => (
        <div className="mb-6 px-5 w-full xl:px-8">
            <DefaultTable 
                classes={{ tableHeaderRow: "bg-stone-300", tableHeadCell: "text-white", root: "h-full", table: "h-full" }}
                data={debtList}
                headers={headers}
                onClickRow={rowClickHandler}
            />
        </div>
    ), [ debtList, rowClickHandler ]);

    return (
        <>
            { tableMemo }
            <SalePopover { ...sale } onClose={closeHandler} onCloseRef={onClose} onOpenRef={onOpen} /> 
        </>
    );
};

export default SalesContainer;