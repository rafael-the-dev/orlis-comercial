import * as React from "react";

import Table from "src/components/table";
import TableRow from "./components/table-row";

const TableContainer = ({ data }) => {

    const headers = React.useRef([
        { key: "Selecionado", label: "Selected" },
        { key: "barCode", label: "Bar code" },
        { key: "name", label: "Name" },
        { key: "sellPrice", label: "Price" }
    ]);

    const getBodyRows = React.useCallback(({ page , rowsPerPage }) => {
        const list = rowsPerPage > 0 ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : data;

        return (
            <>
                {
                    list.map(product => (
                        <TableRow 
                            headers={headers}
                            key={product.id}
                            row={product}
                        />
                    ))
                }
            </>
        );
    }, [ data ]);

    return (
        <Table 
            data={data}
            getBodyRows={getBodyRows}
            headers={headers}
        />
    );
};

export default TableContainer;