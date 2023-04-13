import * as React from "react";
import MenuItem from "@mui/material/MenuItem"

import { FilterContext } from "../../context";

import Input from "src/components/default-input";

const TableFilter = () => {
    const { selectedTable, setSelectedTable, tables } = React.useContext(FilterContext);

    const changeHandler = React.useCallback(e => setSelectedTable(e.target.value), [ setSelectedTable ])

    return (
        <Input
            className="input w12"
            onChange={changeHandler}
            value={selectedTable}
            select>
            {
                tables.map(table => (
                    <MenuItem 
                        key={table.id}
                        value={table.id}>
                        { table.description }
                    </MenuItem>
                ))
            }
        </Input>
    );
};

export default TableFilter;