import * as React from "react";
import SelectItem from "@mui/material/MenuItem";

import { RegisterExpenseContext } from "src/context"

import Select from "src/components/default-input";

const Categories = () => {
    const { category, setCategory } = React.useContext(RegisterExpenseContext);

    const categoriesList = React.useRef([
        { label: "Credelec", value: "credelec" },
        { label: "Food", value: "food" },
        { label: "Other", value: "other" },
    ]);

    const changeHandler = React.useCallback(({ target: { value }}) => setCategory(value), [ setCategory ])

    return (
        <Select
            className="input w12"
            label="Categories"
            onChange={changeHandler}
            select
            value={category}>
            {
                categoriesList.current.map(item => (
                    <SelectItem
                        { ...item }
                        key={item.value}>
                        { item.label }
                    </SelectItem>
                ))
            }
        </Select>
    );
};

export default Categories;