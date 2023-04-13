import * as React from "react";
import { IconButton } from "@mui/material";
import classNames from "classnames";
import currency from "currency.js";

import classes from "./styles.module.css";

import { SalesTabContext } from "src/context"

import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

const Container = ({ id, quantity }) => {
    const { setSale } = React.useContext(SalesTabContext); //


    const decrement = () => {
        setSale(({ products, ...rest }) => {
            const list = [ ...products ];
            const product = list.find(item => item.id === id);
            const newQuantity = currency(product.quantity).subtract(1).value;
            product.quantity = newQuantity >= 0 ? newQuantity : product.quantity;

            return {
                ...rest,
                products: list
            }
        })
    }

    const increment = () => {
        setSale(({ products, ...rest }) => {
            const list = [ ...products ];
            const product = list.find(item => item.id === id);
            product.quantity = currency(product.quantity).add(1).value;

            return {
                ...rest,
                products: list
            }
        })
    };

    const changeHandler = (e) => {
        setSale(({ products, ...rest }) => {
            const list = [ ...products ];
            const product = list.find(item => item.id === id);
            product.quantity = e.target.value;

            return {
                ...rest,
                products: list
            }
        })
    };
    
    const hasError = false;//currency(quantity).value > cartItem.product.stock.currentStock || currency(quantity).value <= 0;
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