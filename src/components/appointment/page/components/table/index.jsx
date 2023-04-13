import * as React from "react";
import { TableCell, TableRow } from "@mui/material";
import { v4 as uuidV4 } from "uuid"

import Table from "src/components/table";

const TableContainer = () => {
    const list = React.useRef(
        [
            { barCode: "", id: 1, name: "", price: 0, quantity: 0, totalPrice: 0 },
            { barCode: "", id: 2, name: "", price: 0, quantity: 0, totalPrice: 0 },
            { barCode: "", id: 3, name: "", price: 0, quantity: 0, totalPrice: 0 },
            { barCode: "", id: 4, name: "", price: 0, quantity: 0, totalPrice: 0 },
            { barCode: "", id: 5, name: "", price: 0, quantity: 0, totalPrice: 0 },
            { barCode: "", id: 6, name: "", price: 0, quantity: 0, totalPrice: 0 },
        ]
    );

    const headers = React.useRef([
        { label: "Barcode", value: "barCode" },
        { label: "Name", value: "name" },
        { label: "Price", value: "price" },
        { label: "Qty", value: "quantity" },
        { label: "Total price", value: "totalPrice" }
    ]);

    const getBodyRows = React.useCallback(({ page, rowsPerPage }) => {

        return list.current.map(item => (
            <TableRow key={item.id}>
                {
                    headers.current.map(header => (
                        <TableCell key={header.value}>{ item[header.value] }</TableCell>
                    ))
                }
            </TableRow>
        ));
    }, []);

    return (
        <Table 
            data={list.current}
            getBodyRows={getBodyRows}
            headers={headers}
        />
    );
};

export default TableContainer;