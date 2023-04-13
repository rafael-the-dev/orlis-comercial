import * as React from "react";
import classNames from "classnames";
import { IconButton, Paper } from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";

import { RegisterExpenseContext } from "src/context";

import TextField from "src/components/default-input";

const ListItem = ({ description, id, price }) => {
    const { productsList, remoteItem, setProductsList } = React.useContext(RegisterExpenseContext);

    const hasOneItemLeft = productsList.length === 1;

    const changeHandler = prop => ({ target: { value } }) => {
        setProductsList(currentList => {
            const list = [ ...currentList ];

            const product = list.find(item => item.id === id);

            if(!product) return currentList;

            product[prop] = value;

            return list;
        })
    };

    const removeHandler = () => remoteItem(id);

    return (
        <Paper 
            className="flex flex-wrap justify-between mb-6 px-3 py-6 rounded-none"
            elevation={1}>
            <TextField 
                className={classNames("input w12", { "md:mb-0": hasOneItemLeft })}
                label="Description"
                onChange={changeHandler("description")}
                required
                value={description}
            />
            <TextField 
                className={classNames("input w12", { "mb-0": hasOneItemLeft })}
                label="Price"
                onChange={changeHandler("price")}
                required
                value={price}
            />
            <IconButton
                className={classNames("bg-stone-50 hover:text-red-600", { "hidden": hasOneItemLeft })}
                onClick={removeHandler}>
                <DeleteIcon />
            </IconButton>
        </Paper>
    );
};

export default ListItem