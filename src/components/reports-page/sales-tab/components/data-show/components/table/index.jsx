import * as React from "react";
import { v4 as uuidV4 } from "uuid";

import { SalesTabContext } from "src/context";

import Table from "src/components/table";
import TableRow from "./components/table-row";

const TableContainer = () => {
    const { getSales } = React.useContext(SalesTabContext);

    const headers = React.useRef([
        { label: "Date", value: "date" },
        { label: "Sold by", key: "user", value: "firstName" },
        { label: "Amount", value: "amount" },
        { label: "Total VAT", value: "vat" },
        { label: "Total", value: "total" }
    ]);

    const getBodyRows = React.useCallback(({ page, rowsPerPage }) => {
        const list = getSales().list;
        
        const result = rowsPerPage > 0 ? list.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : list;
        
        return result.map(row => (
            <TableRow headers={headers} isClickable row={row} key={uuidV4()} />
        ));
    }, [ getSales ]);

    const salesTableMemo = React.useMemo(() => (
        <Table 
            classes={{ tableHeaderRow: "bg-stone-200", root: "h-full", table: "h-full" }}
            data={getSales().list}
            getBodyRows={getBodyRows}
            headers={headers}
        />
    ), [ getSales, getBodyRows ]);

    return salesTableMemo;
};

export default TableContainer;