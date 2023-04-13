import * as React from "react";
import { MenuItem } from "@mui/material"

import CheckIcon from '@mui/icons-material/Check';

import { SaleContext, SalesContext } from "src/context"

import Select from "src/components/default-input"

const BarmenContainer = ({ table, setTable }) => {
    const { getSelectedTables, getTablesList } = React.useContext(SalesContext);
    const { getTable } = React.useContext(SaleContext);

    const changeHandler = e => {
        const result = getTablesList().find(currentTable => currentTable.id === e.target.value);

        setTable(result);
    };

    return (
        <Select
            className="input w12"
            label="Selecione a mesa"
            onChange={changeHandler}
            select
            value={Boolean(table) ? table.id : getTable().waiter.id}
            >
            {
                getTablesList()
                    .filter(currentTable => !getSelectedTables().includes(currentTable.id))
                    .map(({ id, description }) => (
                        <MenuItem 
                            key={id} 
                            value={id}>
                            <div className="flex items-center justify-between w-full">
                                { description }
                                { id === getTable().id && <CheckIcon /> }
                            </div>
                        </MenuItem>
                    )
                )
            }
        </Select>
    );
};

export default BarmenContainer;