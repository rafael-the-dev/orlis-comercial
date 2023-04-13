import { v4 as uuidV4 } from "uuid"

import Table from "src/components/table";
import TableRow from "../table-row"

const TableContainer = ({ data, headers, onClose }) => {
    
    const getBodyRows = ({ page , rowsPerPage }) => {
        const list = rowsPerPage > 0 ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : data;

        return (
            <>
                {
                    list.map(row => (
                        <TableRow 
                            headers={headers}
                            key={uuidV4()}
                            onClose={onClose}
                            product={row}
                        />
                    ))
                }
            </>
        );
    };

    return (
        <Table 
            data={data}
            getBodyRows={getBodyRows}
            headers={headers}
        />
    );
};

export default TableContainer;