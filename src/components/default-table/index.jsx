import * as React from "react";
import { v4 as uuidV4 } from "uuid"

import Table from "src/components/table";
import TableRow from "src/components/table/components/table-row";

const ProductsTable = ({ classes, data, headers, onClickRow, onRemove }) => {
    
    const getBodyRows = ({ page, rowsPerPage }) => {
        const list = rowsPerPage > 0 ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : data;

        return list.map(row => (
            <TableRow 
                headers={headers}
                key={uuidV4()}
                onClick={onClickRow}
                onRemove={onRemove}
                row={row}
            />
        ))
    };

    return (
        <Table 
            classes={classes}
            data={data}
            headers={headers}
            getBodyRows={getBodyRows}
        />
    );
};

export default ProductsTable;