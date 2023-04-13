import * as React from "react";
import { TableCell, TableRow } from "@mui/material"

import Table from "src/components/table";


const TableContainer = ({ product }) => {
    const headers = React.useRef([
        { label: "Codigo de barra", value: "barCode" },
        { label: "Nome", value: "name" },
        { label: "Stock inicial", key: "stock", value: "initial" },
        { label: "Stock atual", key: "stock", value: "total" },
        { label: "", value: "" },
    ]);

    const getBodyRows = () => (
        <TableRow>
            {
                headers.current.map(header => {
                    const { key, value } = header;

                    return (
                        <TableCell align="center" key={value}>
                            { key ? product[key][value] : product[value] }
                        </TableCell>
                    );
                })
            }
        </TableRow>
    );

    return (
        <div className="mb-4">
            <Table 
                classes={{ tableFooter: "hidden " }}
                data={[ product ]}
                getBodyRows={getBodyRows}
                headers={headers}
            />
        </div>
    );
};

export default TableContainer;