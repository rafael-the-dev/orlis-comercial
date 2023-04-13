import * as React from "react";
import { MenuItem } from "@mui/material"

import classes from "./styles.module.css";

import { SaleContext, SalesContext } from "src/context"

import Select from "src/components/default-input"

const BarmenContainer = ({ barman, setBarman }) => {
    const { getBarmenList } = React.useContext(SalesContext);
    const { getTable } = React.useContext(SaleContext);

    const changeHandler = e => {
        const result = getBarmenList().find(currentBarman => currentBarman.id === e.target.value);

        setBarman(result);
    }

    return (
        <Select
            className="input w12"
            label="Selecione o barman"
            onChange={changeHandler}
            select
            value={Boolean(barman) ? barman.id : -1}
            >
            {
                getBarmenList().map(({ id, firstName, lastName }) => (
                    <MenuItem 
                        key={id} 
                        value={id}>
                        {firstName} { lastName }
                    </MenuItem>
                ))
            }
        </Select>
    );
};

export default BarmenContainer;