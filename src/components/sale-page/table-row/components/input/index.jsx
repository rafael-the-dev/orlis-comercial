import * as React from "react";
import { IconButton } from "@mui/material";
import classNames from "classnames";
import currency from "currency.js";

import classes from "./styles.module.css";

import { SaleContext } from "src/context"

import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

const Container = ({ cartItem, quantity }) => {
    const { getCart } = React.useContext(SaleContext); //

    const decrement = () => {
        getCart().decrementQuantity(cartItem.product.id)
    }

    const increment = () => {
        getCart().incrementQuantity(cartItem.product.id)
    };

    const changeHandler = (e) => {
        getCart().addQuantity(cartItem.product.id, e.target.value);
    };
    
    const hasError = currency(quantity).value > cartItem.product.stock.currentStock || currency(quantity).value <= 0;
    const errorClasses = { "text-red-600": hasError };

    return (
        <div className="flex items-center justify-center">
            <IconButton 
                className={classNames("p-0 text-sm", errorClasses)}
                onClick={increment}>
                <AddIcon className="text-base" />
            </IconButton>
            <input 
                className={classNames(classes.input, errorClasses,
                "bg-transparent border-0 text-center outline-none")}
                onChange={changeHandler}
                value={quantity}
            />
            <IconButton 
                className={classNames("p-0 text-sm", errorClasses)}
                onClick={decrement}>
                <RemoveIcon className="text-base" />
            </IconButton>
        </div>
    );
};

export default Container;