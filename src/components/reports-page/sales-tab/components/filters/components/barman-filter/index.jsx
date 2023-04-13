import * as React from "react";
import MenuItem from "@mui/material/MenuItem"

import { FilterContext } from "../../context";

import Input from "src/components/default-input";

const TableFilter = () => {
    const { selectedBarman, setSelectedBarman, barmen } = React.useContext(FilterContext);

    const changeHandler = React.useCallback(e => setSelectedBarman(e.target.value), [ setSelectedBarman ])

    return (
        <Input
            className="input w12"
            onChange={changeHandler}
            value={selectedBarman}
            select>
            {
                barmen.map(barman => (
                    <MenuItem 
                        key={barman.id}
                        value={barman.id}>
                        { barman.firstName } { barman.lastName }
                    </MenuItem>
                ))
            }
        </Input>
    );
};

export default TableFilter;